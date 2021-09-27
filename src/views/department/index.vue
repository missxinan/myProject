<template>
  <div class="table-box" style="padding:20px;">
    <div class="filter-container">

      <el-button

        class="filter-item"
        style="margin: 15px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate({deptId:0})"
      >添加</el-button>
    </div>
    <tree-table
      v-loading="listLoading"
      :data="data"
      v-on:handleCreate="handleCreate"
      v-on:handleUpdate="handleUpdate"
      v-on:handleDelete="handleDelete"
      :columns="columns"
      border
    />
    <!-- <pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page"  @pagination="getList" /> -->
    <!-- 添加模板 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
       <!-- <el-form-item label="父部门" prop="parentId">
          <el-input v-model="temp.parentId" disabled/>
        </el-form-item> -->

        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="temp.deptName"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort"/>
        </el-form-item>

        <el-form-item label="负责人" prop="leader">
          <el-input v-model="temp.leader"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
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
import Pagination from "@/components/Pagination";
import treeTable from "@/components/treeTable";
import checkPermission from "@/utils/permission"; // 权限判断函数
import {
  getDepartment,
  deleteDepartment,
  updateDepart,
  addDepartment
} from "@/api/department.js";

export default {
  data() {
		name: 'department'
    return {
      listLoading: false,
      rules: {
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "change" }
        ]
      },
      columns: [
        {
          text: "部门名称",
          value: "deptName"
        },
        {
          text: "排序",
          value: "sort"
        },

        {
          text: "负责人",
          value: "leader"
        },
        {
          text: "手机号",
          value: "phone"
        },
        {
          text: "邮箱",
          value: "email"
        }
      ],
      data: [],
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      temp: {},
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "添加"
      },
      dialogFormVisible: false
    };
  },

  components: {
    treeTable,
    Pagination
  },
  created() {
    this.getList();
    this.resetTemp();
  },
  methods: {
    handleDelete(data) {
      deleteDepartment({ deptId: data.deptId }).then(res => {
				if( res.code == 0 ){
					this.operaCallback("删除成功");
				}else{
					this.$message.error(res.msg);
				}

      });
    },

    checkPermission,
    formatData(list) {
      list.forEach(item => {
        item.subMenus = item.subDepts;
        if(item.subDepts && item.subDepts.length){
          this.formatData(item.subDepts)
        }
      });
      return list
    },
    getList() {
      this.listLoading = true;
      getDepartment({
        current: this.listQuery.page,
        size: this.listQuery.limit,
        parentId: 0
      }).then(response => {
         response.data.records = this.formatData( response.data.records || [])

        this.data = response.data.records;
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    resetTemp(parentid) {
      let data = {
        email: "",
        phone: "",
        email: "",
        leader: "",
        sort: "",
        deptName: "",
        parentId: parentid
      };
      this.temp = data;
    },
    // 添加菜单
    handleCreate(row) {
      this.resetTemp(row.deptId);
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addDepartment(this.temp).then(res => {
            this.dialogFormVisible = false;
            this.operaCallback("添加成功");
          });
        }
      });
    },

    handleUpdate(row) {
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateDepart(this.temp).then(res => {
            this.dialogFormVisible = false;
            this.operaCallback("修改成功");
          });
        }
      });
    },
    operaCallback(msg) {
      this.$notify({
        title: "Success",
        message: msg,
        type: "success",
        duration: 2000
      });
      this.getList();
    }
  }
};
</script>
