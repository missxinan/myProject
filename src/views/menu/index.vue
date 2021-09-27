<template>
  <div class="table-box">
    <div class="filter-container">
      <!-- v-if="checkPermission(['system:menu:add'])" -->
      <el-button
        class="filter-item"
        style="margin: 15px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate({menuId:0})"
      >添加</el-button>
    </div>
    <div style="padding:20px;">
      <tree-table
        :data="data"
        v-on:handleCreate="handleCreate"
        v-on:handleUpdate="handleUpdate"
        v-on:handleDelete="handleDelete"
        :columns="columns"
        border
      />
    </div>

    <!-- <pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page"  @pagination="getList" /> -->
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
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort"/>
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input v-model="temp.url"/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="temp.menuType" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in menuTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单状态" prop="visible">
          <el-select v-model="temp.visible" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="permsIdent">
          <el-input v-model="temp.permsIdent"/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="temp.icon"/>
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
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import treeTable from "@/components/treeTable";
import checkPermission from "@/utils/permission"; // 权限判断函数
import {
  menuTreeLis,
  menuTreeAdd,
  menuTreeDelete,
  mentTreeEdit
} from "@/api/menu.js";
// import svgIcons from './svg-icons.js'
//  import Vue from 'vue'
const calendarTypeOptions = [
  { key: "0", display_name: "显示" },
  { key: "1", display_name: "隐藏" }
];
const menuTypeOptions = [
  { key: "1", display_name: "目录" },
  { key: "2", display_name: "菜单" },
  { key: "3", display_name: "按钮" }
];

const defaultRole = {
  routes: []
};
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});
const menuTypeValue = menuTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});
export default {
  data() {
		name: 'menu'
    return {
      columns: [
        {
          text: "名称",
          value: "menuName"
        },
        {
          text: "排序",
          value: "sort"
        },
        {
          text: "请求地址",
          value: "url"
        },
        {
          text: "菜单类型",
          value: "menuTypeName"
        },
        {
          text: "菜单状态",
          value: "visibleName"
        },
        {
          text: "权限标识",
          value: "permsIdent"
        },
        {
          text: "菜单图标",
          value: "icon"
        }
      ],
      data: [],
      listQuery: {
        page: 1,
        limit: 50,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      temp: {
        menuName: "",
        parentId: "",
        sort: "",
        url: "",
        menuType: "",
        visible: "",
        permsldent: "",
        icon: "",
        remark: ""
      },
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加"
      },
      dialogFormVisible: false,
      calendarTypeOptions,
      menuTypeOptions,
      rules: {
        loginName: [
          { required: true, message: "登录名不能为空", trigger: "change" }
        ],
        userName: [
          { required: true, message: "用户名不能为空", trigger: "change" }
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "change" }],
        passward: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ],
        phone: [{ required: true, message: "密码不能为空", trigger: "change" }],
        roleList: [{ required: true }],
        deptId: [{ required: true }]
      },
      dialogPvVisible: false,
      pvData: []
    };
  },

  components: {
    treeTable,
    Pagination
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    handleDelete(row) {
      menuTreeDelete({ menuId: row.menuId }).then(res => {
        this.getList();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
	formatData(item) {
	  item.visibleName = item.visible == "0" ? "显示" : "隐藏";
	  item.menuTypeName = menuTypeValue[item.menuType];
	  if (item.subMenus && item.subMenus.length) {
	    item.subMenus.forEach(t => {
	      this.formatData(t);
	    });
	  }
	},
    getList() {
      this.listLoading = true;
      menuTreeLis({
        current: this.listQuery.page,
        size: 50,
        parentId: 0
      }).then(response => {
        response.data.records = response.data.records || [];
        response.data.records.forEach(item => {
          this.formatData(item);
        });
        this.data = response.data.records;
        this.listLoading = false;
      });
    },
    resetTemp(parentid) {
      this.temp = {
        menuName: "",
        parentId: parentid,
        sort: "1",
        url: "#",
        menuType: "1",
        visible: "1",
        permsldent: "",
        icon: "",
        remark: ""
      };
    },
    // 添加菜单
    handleCreate(row) {
      this.resetTemp(row.menuId);
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData(menu) {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.menuId = this.temp.menuId;
          mentTreeEdit(this.temp).then(res => {
            if (res.code == 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000
              });
              this.getList();
            }
          });
          // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          menuTreeAdd(this.temp).then(res => {
            this.dialogFormVisible = false;
            if (res.code == 0) {
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
      this.temp = Object.assign({}, row); // copy obj
	    this.temp.visible = this.temp.visible + ''
			this.dialogFormVisible = true;
      this.dialogStatus = "update";
    },
    // 图标
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
    }
  }
};
</script>
