<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
       v-if="checkPermission(['system:user:add'])"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height = "700"
    >
      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">{{ scope.row.userId }}</template>
      </el-table-column>
      <el-table-column label="登录名"  align="center">
        <template slot-scope="scope">{{ scope.row.loginName }}</template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.sex == 1 ? '男' : (scope.row.sex == 2 ? '女' : '未知') }}</template>
      </el-table-column>
      <!-- <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img class="image" :src="scope.row.avatar" />
        </template>
      </el-table-column> -->
      <el-table-column label="账号状态" align="center">
        <template slot-scope="scope">{{ scope.row.state == 0 ? '正常' : '停用' }}</template>
      </el-table-column>
      <el-table-column label="删除状态" align="center">
        <template slot-scope="scope">{{ scope.row.deleted == 0 ? '正常' : '删除' }}</template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">{{ scope.row.roleNames }}</template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="scope">{{ scope.row.deptName }}</template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" v-if="checkPermission(['system:user:edit'])" @click="handleUpdate(row)">修改</el-button>
          <el-button type="text" size="mini" v-if="checkPermission(['system:user:resetPassword'])" @click="resetPwd(row)">重置密码</el-button>
          <el-button size="mini" type="text" style="color:#f66" v-if="checkPermission(['system:user:del'])" @click="handleModifyStatus(row.userId,'deleted')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页handleCheckChange-->
    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
    <!-- 添加模板 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogStatus=='create'">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roleList" class="is-required">
          <el-input style="display:none" v-model="temp.roleList" />
          <el-tree
            ref="tree"
            @check="treeClick"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="roleId"
            class="permission-tree"
            :default-checked-keys="defaultCheckedKeysRoles"
          />
        </el-form-item>
        <el-form-item label="部门" class="is-required">
          <el-cascader
            :value="defaultCheckedKeysDept"
            :options="departmentData"
            :props="defaultPropsDepart"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  // fetchPv,
  createArticle,
  resetPassword,
  updateUser
} from "@/api/userInfo.js";
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import {
  getUserDetail,
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
  department,
} from "@/api/role";

const calendarTypeOptions = [
  { key: "1", display_name: "男" },
  { key: "2", display_name: "女" }
];
const defaultRole = {
  routes: []
};

export default {
	name: 'userInof',
  components: { Pagination, permission },

  data() {
    return {
      list: null,
      listLoading: true,
      //----
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      dialogStatus: "",
      dialogFormVisible: false,
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      temp: {
        loginName: "",
        userName: "",
        email: "",
        password: "",
        remark: "",
        sex: "",
        roleList: "",
        deptId: ""
      },
      textMap: {
        update: "修改",
        create: "添加"
      },
      rules: {
        loginName: [
          { required: true, message: "登录名不能为空", trigger: "change" }
        ],
        // roleList: [{ required: true }],
        userName: [
          { required: true, message: "用户名不能为空", trigger: "change" }
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "change" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "change" }
        ],
        deptId: [{ required: true }]
      },

      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "roleName",
        id: "roleId"
      },
      // 角色
      routes: [],
      // 部门
      departmentData: [],
      defaultPropsDepart: {
        label: "deptName",
        children: "subDepts",
        value: "deptId"
      },
      roleArr: [],
      defaultCheckedKeysDept: []
    };
  },
  computed: {
    defaultCheckedKeysRoles() {
      let arr = [];
      if (this.temp.roles && this.temp.roles.length) {
        this.temp.roles.forEach(item => {
          arr.push(item.roleId);
        });
      }
      return arr;
    },
    routesData() {
			// console.log(this.routes,'角色信息')
      return this.routes;
    }
  },
  created() {
    this.getList();
		// 请求角色
		this.getRoleLists();
		// 请求部门
		this.departmentApi();
  },
  methods: {
    sdggd(list, id) {
      list.forEach(item => {
        if (item.deptId == id) {
          this.defaultCheckedKeysDept.push(id);
          if (item.parentId != "0") {
            this.sdggd(
              this.departmentData || [],
              item.parentId == "0" ? id : item.parentId
            );
          }
        } else {
          this.sdggd(
            item.subDepts || [],
            item.parentId == "0" ? id : item.parentId
          );
        }
      });
    },
    resetPwd(row) {
      resetPassword({ userId: row.userId }).then(res => {
        this.$message({
          message: "密码重置成功",
          type: "success"
        });
      });
    },
    handleChange(e) {
      // console.log(e);
      this.temp.deptId = e.join(",");
    },
    checkPermission,
    getList() {
      this.listLoading = true;
      fetchList({
        current: this.listQuery.page,
        size: this.listQuery.limit
      }).then(response => {
        this.list = response.data.records;
				for(let i of this.list){
					let roleNames = ''
					for(let j of i.roles){
						roleNames += j.roleName + ' '
					}
					i.roleNames = roleNames
				}
        this.total = Number(response.data.total);
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    // 请求角色
    getRoleLists() {
      getRoutes().then(res => {
        this.role = Object.assign({}, defaultRole);
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([]);
        }
        this.dialogType = "new";
        this.dialogVisible = true;
        // console.log(res, "角色返回");
        this.routes = res.data;
      });
    },

    formatData(item) {
      if (item.subDepts && item.subDepts.length == 0) {
        item.subDepts = null;
      } else {
        item.subDepts.forEach(t => {
          this.formatData(t);
        });
      }
    },
    // 请求部门
    departmentApi() {
      department().then(res => {
        // console.log(res, "部门");
        res.data.forEach(item => {
          this.formatData(item);
        });
        this.departmentData = res.data;
      });
    },
    handleModifyStatus(row, status) {
      deleteRole({ userId: row }).then(res => {
        // console.log(res);
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    resetTemp() {
      this.temp = {
        loginName: "",
        password: "",
        userName: "",
        email: "",
        remark: "",
        sex: "",
        roleList: "",
        deptId: ""
      };
    },
    // 添加用户
    handleCreate() {
      this.resetTemp();
      this.defaultCheckedKeysDept = [];
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
			this.$refs.tree.setCheckedKeys([]);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // this.temp.roleList = this.$refs["tree"].getCheckedKeys().join("");
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let sendData = JSON.parse(JSON.stringify(this.temp));
          sendData.deptId = sendData.deptId.split(",").pop();
          createArticle(sendData).then(res => {
            if (res.code == 0) {
							this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "添加成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.defaultCheckedKeysDept = [];
			
      getUserDetail({ userId: row.userId }).then(res => {
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
				this.$refs.tree ? this.$refs.tree.setCheckedKeys([]) : '';
        res.data.roleList = '';
        this.temp = res.data;
        this.sdggd(this.departmentData, res.data.deptId);
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
          this.defaultCheckedKeysDept = this.defaultCheckedKeysDept.reverse();
        });
      });
    },
    treeClick(e) {
      this.temp.roleList = this.$refs["tree"].getCheckedKeys().join(",");
			// console.log(this.temp.roleList,'roleList')
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
					// console.log(this.temp,'temp')
          const tempData = Object.assign({}, this.temp);
          tempData.deptId = tempData.deptId.split(",").pop();
          tempData.roleList = this.$refs["tree"].getCheckedKeys().join(",");
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(res => {
            if (res.code == 0) {
              this.getList();
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
		// 用户禁用启用
		usersForbidden(row){
			// console.log(row,'row')
		}
  }
	
};
</script>
<style>
.image {
  width: 40px;
  height: 40px;
}
.filter-container {
  margin-bottom: 10px;
}
</style>
