<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      max-height="650"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column align="center" label="区域ID" >
        <template slot-scope="scope">{{ scope.row.auctionId }}</template>
      </el-table-column>
      <el-table-column label="区域名称" align="center">
        <template slot-scope="scope">{{ scope.row.auctionName }}</template>
      </el-table-column>
      <el-table-column label="是否首页展示" align="center">
        <template slot-scope="scope">{{ scope.row.isHomePage == 1 ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">{{ scope.row.remark}}</template>
      </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.current"
      :page.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="120px"
        :rules="rules"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="区域名" prop="auctionName">
          <input type="text" v-model="temp.auctionName" maxlength="8" />
        </el-form-item>
        <el-form-item label="是否在首页展示" prop="isHomePage">
          <el-radio-group v-model="temp.isHomePage">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <textarea v-model="temp.remark" maxlength="30" style="width:200px;height:100px;" ></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"  @click="updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sellingAreaList, sellingAreaEdit } from "@/api/adverLocal";
import Pagination from "@/components/Pagination";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
export default {
  name: "adverLocal",
  components: { Pagination, permission },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      total: 1,
      listQuery: {
        current: 1,
        size: 10
      },
      temp:{
          auctionId:undefined,
          auctionName:undefined,
          remark:undefined
      },
      rules:{
        auctionName: [{
						required: true,
						message: '请填写区域名',
						trigger: 'change'
          }],
        isHomePage:[{
						required: true,
						message: '请选择是否在首页展示',
						trigger: 'change'
					}],
      }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      sellingAreaList(this.listQuery).then(response => {
        console.log(response,'this.list')
        this.list = response.data;
        this.total = Number(response.data.total);
        this.listLoading = false;
      });
    },
    resetTemp() {
      this.temp = {
         auctionId:undefined,
         auctionName:undefined,
         remark:undefined
      };
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
          const tempData = Object.assign({}, this.temp);
          sellingAreaEdit(tempData).then(res => {
            if (res.code == 0) {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Update Successfully",
                type: "success",
                duration: 2000
              });
            }else{
                this.$message.error(res.msg);
            }
          });
        }
      });
    },
  }
};
</script>
<style>
.filter-item {
  float: left;
}
.image {
  width: 40px;
  height: 40px;
}
.filter-container {
  margin-bottom: 10px;
}
</style>
