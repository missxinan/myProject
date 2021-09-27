<template>
  <div class="express-manage">
    <el-button
      type="primary"
      class="btns"
      @click="addExpress('这里写添加')"
      v-if="checkPermission(['order:fastMail:add'])"
    >添加快递公司</el-button>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="650"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="快递名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="快递编码" align="center">
        <template slot-scope="scope">{{ scope.row.no }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="handleEdit(row)"
            v-if="checkPermission(['order:fastMail:edit'])"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
    <el-dialog title="新增/编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="快递公司名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            type="text"
            placeholder="请输入内容"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="快递编码" :label-width="formLabelWidth">
          <el-input v-model="form.no" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="form.remarkArea"
                maxlength="30"
                show-word-limit
                >
                </el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogfalse">取 消</el-button>
        <el-button type="primary" @click="dialogSure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import tableData from './mock.js';

import Pagination from "@/components/Pagination";
//getlist中的接口需要改

import {
  carrierlist,
  carrieradd,
  carrieredit
} from "@/api/Expressdeliverymanagement";
import { getList } from "@/api/table";
import checkPermission from "@/utils/permission";
export default {
  name: "expressManagement",
  components: { Pagination },
  data() {
    return {
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      listLoading: false,
      paginatConfig: {
        //分页器配置
        pageSize: 15, //每页显示条数
        total: 120, //数据总数
        pagerCount: 5 //分页器显示多少个页数
      },
      dialogFormVisible: false, //控制弹框开关
      form: {
        name: "", //公司名称
        no: "", //快递编码
        remarkArea: "", //备注
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        editorOrAdd: ""
      },
      formLabelWidth: "120px",
      tableData: [],
      Flag: false,
      rowdata: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      //此处放订单管理的接口
      this.listLoading = true;
      carrierlist({
        current: this.listQuery.page,
        size: this.listQuery.limit
      }).then(res => {
        if (res.msg === "success") {
          this.tableData = res.data.records;
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          console.error("服务器开小茶了！");
        }
      });
    },
    handleEdit(row) {
      //编辑按钮
      console.log(row);
      this.form.name = row.name;
      this.form.no = row.no;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.Flag = true;
      this.rowdata = row;
    },
    addExpress(add) {
      //添加快递公司
      for (var key in this.form) {
        this.form[key] = "";
      }
      this.form.editorOrAdd = add;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    dialogfalse() {
      this.Flag = false;
      this.dialogFormVisible = false;
    },
    dialogSure() {
      //确定按钮执行的回调
      if (this.Flag) {
        carrieredit({
          carrierId: this.rowdata.carrierId,
          name: this.form.name,
          no: this.form.no
        }).then(res => {
          if( res.code == 0 ){
            this.Flag = false;
            this.getList();
          }else{
            this.$message(res.msg);
          }
          
        });
      } else {
        carrieradd({
          name: this.form.name,
          no: this.form.no
        }).then(res => {
          if (res.msg === "success") {
            // this.tableData.push({name:this.form.name,no:this.form.no})
            // window.reload()
            this.getList();
            location.reload();
          } else {
            this.$message(res.msg);
            // location.reload()
          }
        });
      }
      for (var key in this.form) {
        this.form[key] = "";
      }
      this.dialogFormVisible = false;
    },
    currentChange() {
      //当前页改变的时候触发
      console.log(this);
    },
    prevClick() {
      //点击上一个
      console.log(this);
    },
    nextClick() {
      //点击下一个
      console.log(this);
    }
  }
};
</script>

<style scoped>
.express-manage {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.btns {
  margin: 20px 0;
}
.paginat {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.paginat .totalShow {
  display: inline-block;
}
</style>
