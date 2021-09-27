<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        v-if="checkPermission(['system:rule:add'])"
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
      max-height="650"
    >
      <el-table-column label="ruleKey" align="center">
        <template slot-scope="scope">{{ scope.row.ruleKey }}</template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope"><div style="max-height: 300px;max-width: 300px;display: flex;" v-html="scope.row.content"></div></template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" v-if="checkPermission(['system:rule:edit'])" @click="handleUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger" v-if="checkPermission(['system:rule:del'])" @click="handleModifyStatus(row)">删除</el-button>
          <el-button size="mini" type="success"  @click="handleDeleteCopy(row)">复制</el-button>
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
        label-width="90px"
        style="margin-left:50px;"
      >
        <el-form-item label="rulekey" prop="ruleKey">
          <el-input v-model="temp.ruleKey" :min="5"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title	" />
        </el-form-item>
      <el-form-item label="" prop="content">
        <tinymce v-model="temp.content"></tinymce>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormClose">关闭</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  // fetchPv,
  addRule,
  editRule,
  delRule
} from "@/api/rule.js";
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
import tinymce from '@/components/Tinymce';
import { getSysConfig } from '@/api/public';

const calendarTypeOptions = [
  { key: "1", display_name: "男" },
  { key: "2", display_name: "女" }
];
const defaultRole = {
  routes: []
};

export default {
	name: 'rule',
  components: { Pagination, permission ,tinymce},

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
        ruleKey: undefined,
        title: undefined,
        content:undefined
      },
      textMap: {
        update: "修改",
        create: "添加"
      },
      rules: {
        ruleKey: [
          { required: true,min:5,max:20, message: "请填写ruleKey,5-20字符", trigger: "change" }
        ],
        // roleList: [{ required: true }],
        title: [
          { required: true, message: "请填写标题", trigger: "change" }
        ],
        content: [{ required: true, message: "请填写内容", trigger: "change" }]
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
      defaultCheckedKeysDept: [],
      headerUrl: ''
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
	console.log(this.routes,'角色信息')
      return this.routes;
    },
    
  },
  created() {
    this.getList();
    this.getheaderUrl();
  },
  methods: {
    getheaderUrl(){
      getSysConfig({'configKey':'rule_header_url'}).then(res=>{
        if( res.code == 0 ){
          this.headerUrl = res.data
        }
      })
    },
    handleChange(e) {
      console.log(e);
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
        this.total = Number(response.data.total);
        // Just to simulate the time of the request
		console.log(this.list,'this.list')
        this.listLoading = false;
      });
    },
    // 请求角色

    formatData(item) {
      if (item.subDepts && item.subDepts.length == 0) {
        item.subDepts = null;
      } else {
        item.subDepts.forEach(t => {
          this.formatData(t);
        });
      }
    },
    //删除
    handleModifyStatus(row) {
      delRule({ id: row.id }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
          history.go(0) 
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //复制
    handleDeleteCopy(row){
          var Copytext = this.headerUrl + row.ruleKey;
          var input = document.createElement('input');
          input.setAttribute('readonly', 'readonly');
          input.setAttribute('value', Copytext);
          document.body.appendChild(input);
          input.select();
          // input.setSelectionRange(0, 9999);
          document.execCommand('Copy');
          console.log( document.execCommand('Copy'))
          if (document.execCommand('Copy')) {
            this.$message.success('复制成功')
          }else{
            this.$message.error('复制失败')
          }
    },
    resetTemp() {
      this.temp = {
        ruleKey: undefined,
        title: undefined,
        content: undefined
      };
      
    },
    dialogFormClose(){
      this.dialogFormVisible = false;
      // this.getList();
      history.go(0) 
    },
    // 添加用户
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // this.temp.roleList = this.$refs["tree"].getCheckedKeys().join("");
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addRule(this.temp).then(res => {
            if (res.code == 0) {
				this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "添加成功",
                type: "success",
                duration: 2000
              });
              this.getList();
              history.go(0) 
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleUpdate(row) {
		    this.resetTemp();
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.temp =JSON.parse(JSON.stringify(row))
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editRule(this.temp).then(res => {
            if (res.code == 0) {
               this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
              this.getList();
              history.go(0) 
            }else{
              this.$message.error(res.msg)
            }
            this.dialogFormVisible = false;
           
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
			console.log(row,'row')
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
