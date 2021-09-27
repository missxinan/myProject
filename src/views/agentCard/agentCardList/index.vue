<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="listQuery.phone"
            clearable
            placeholder="请输入手机号"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
		  <el-button
		    class="filter-item"
		    type="primary"
		    @click="handleExport"
		  >分配并导出</el-button>
		  <span style="margin-left: 10px;">可提供兑换青芒卡数量:{{cardNumber}}</span>
        </div>
        <div style="height: 20px;"></div>
        <el-table
          v-loading="listLoading"
          :data="mangolist"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column label="序号" type="index" align="center" width="60"></el-table-column> -->
          <el-table-column label="代理商" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.agentName }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="代理商手机号" align="center" >
		    <template slot-scope="scope">
		      <span>{{ scope.row.agentPhone }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="代理商ID" align="center" >
		    <template slot-scope="scope">
		      <span>{{ scope.row.agentId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="卡号" align="center" >
		    <template slot-scope="scope">
		      <span>{{ scope.row.cardNo }}</span>
		    </template>
		  </el-table-column>
           <el-table-column label="激活码" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.cardCode }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="绑定用户id" align="center" >
		    <template slot-scope="scope">
		      <span>{{ scope.row.userId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="使用状态" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.cardStatus == 0 ? '未使用' : '已使用' }}</span>
		    </template>
		  </el-table-column>
           <el-table-column label="购买价格" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.buyPrice }}</span>
            </template>
          </el-table-column>
        <pagination
          v-show="mangototal>0"
          :total="mangototal"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          :currentPage="listQuery.current"
          @pagination="getList"
        />
      </el-table>
	  
	  <!-- 芒果卡操作 -->
	  <el-dialog title="赠送芒果卡" :visible.sync="dialogMangoVisible">
	    <el-form
	      ref="dataForm"
	      :model="information"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
		<el-form-item label="代理商名称" prop="name">
		  <el-input v-model="information.name" style="width: 200px" />
		</el-form-item>
	  	<el-form-item label="代理商手机号" prop="phone">
	  	  <el-input v-model="information.phone" style="width: 200px" />
	  	</el-form-item>
	  	<el-form-item label="分配数量" prop="number">
	  	  <el-input v-model="information.number" style="width: 200px" />
	  	</el-form-item>
	  	<el-form-item label="购买价格" prop="money">
	  	  <el-input v-model="information.money" style="width: 200px" />
	  	</el-form-item>
	  
	    </el-form>
	   
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogMangoVisible = false">取消</el-button>
	      <el-button type="primary"   @click="distribution()">提交</el-button>
	    </div>
	  </el-dialog>
	  
      <pagination
        v-show="mangototal>0"
        :total="mangototal"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        :currentPage="listQuery.current"
        @pagination="getList"
      />
  </div>
</template>

<script>
import {
  fetchMangoList,
  distribution 
} from "@/api/agentCard.js";
import { requestfile, exportBlobExcel } from "@/api/blob";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";

export default {
  name: "notice",
  components: {
    Pagination
  },
  data() {
    return {
	  soldOut:false,
	  putaway:false,
	  deleleOut:false,
	  soldOutstatus:null,
	  dialogMangoVisible:false,
	  information:{},
	  isAdd:true,
      list: null,
	  cardNumber:'',
      mangolist: null,
      mangototal: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        phone: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
        fetchMangoList(this.listQuery).then(response => {
          this.mangolist = response.data.iPage.records;
          this.mangototal = Number(response.data.iPage.total);
		  this.cardNumber = response.data.number
          this.listLoading = false;
        });
      
    },
	handleExport(){
		this.dialogMangoVisible=true
	},
	distribution(){
		distribution(this.information).then(response => {
		  if (response.code == 0) {
			  this.exportToExcel()
			  this.getList();
			  this.information = {}
			  this.dialogMangoVisible=false
		  } else {
		    this.$message.error(response.msg);
		  }
		});
	},
	/**
	 * 导出excel
	 */
	exportToExcel() {
	  let that = this;
	  let url = "/mango/card/excel";
	  if (!this.information.phone) {
	    this.$message.error("请输入导出用户手机号");
	    return;
	  }
	  this.listQuery.phone = this.information.phone
	  let datas = JSON.parse(JSON.stringify(this.information));
	  exportBlobExcel(url, datas).then(res => {
	    console.log(res, "res");
	    const data = res.data;
	    const a = document.createElement("a");
	    const blob = new Blob([data]);
	    const blobUrl = window.URL.createObjectURL(blob);
	    a.style.display = "none";
		a.download = "代理商青芒卡激活码.xls";
	    a.href = blobUrl;
	    a.click();
		this.information={}
	  });
	  // exportBlobExcel(url, datas).then(res => {
	  //   console.log(res, "res");
	  //   const data = res.data;
	  //   const a = document.createElement("a");
	  //   const blob = new Blob([data]);
	  //   const blobUrl = window.URL.createObjectURL(blob);
	  //   a.style.display = "none";
	  //   a.download = "拼赚订单.xls";
	  //   a.href = blobUrl;
	  //   a.click();
	  // });
	},
    handleFilter() {
      this.listQuery.current = 1;
	  this.listLoading = true;
	  this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
      this.getList();
    },
	reset() {
	  // for (let key in this.searchbanner) {
	  //   this.searchbanner[key] = "";
	  // }
	  // this.information.positionId = undefined;
	  // this.information.type = undefined;
	  // this.information.name = "";
	  // this.getList();
	},

    tableRowClassName({ row, rowIndex }) {
      if (row.blacklist != 0 && row.blacklist) {
        return "warning-row";
      }
      return "";
    }
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 16px;
}
.warning-row {
  color: red !important;
}
.total_blue {
    color: #409eff;
    cursor: pointer;
  }
</style>
