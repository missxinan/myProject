<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="userlistQuery.phone"
            clearable
            placeholder="请输入手机号"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
		  <el-input
		    v-model="userlistQuery.agentPhone"
		    clearable
		    placeholder="请输入代理商手机号"
		    style="width: 160px;"
		    class="filter-item"
		    @keyup.enter.native="handleFilter"
		  />
		  <el-date-picker
		    v-model="userlistQuery.time"
		    type="daterange"
		    value-format="yyyy-MM-dd HH:mm:ss"
		    range-separator="至"
		    start-placeholder="开始日期"
		    end-placeholder="结束日期"
		  ></el-date-picker>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
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
          <el-table-column label="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="用户id" align="center" width="100">
		    <template slot-scope="scope">
		      <span>{{ scope.row.userId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="用户手机号" align="center" width="100">
		    <template slot-scope="scope">
		      <span>{{ scope.row.phone }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="卡名称" align="center" width="100">
		    <template slot-scope="scope">
		      <span>{{ scope.row.cardName }}</span>
		    </template>
		  </el-table-column>
           <el-table-column label="卡号" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.cardNo }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="购买价格" align="center" >
		    <template slot-scope="scope">
		      <span>{{ scope.row.buyPrice }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="开卡时间" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.createTime }}</span>
		    </template>
		  </el-table-column>
           <el-table-column label="开始时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="过期时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.expireDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="代理商ID" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.agentId }}</span>
            </template>
          </el-table-column>
         <el-table-column label="代理商名称" align="center">
           <template slot-scope="scope">
             <span>{{ scope.row.agentName }}</span>
           </template>
         </el-table-column>
		 <el-table-column label="代理商手机号" align="center">
		   <template slot-scope="scope">
		     <span>{{ scope.row.agentPhone }}</span>
		   </template>
		 </el-table-column>
		 <el-table-column label="代理商公司" align="center">
		   <template slot-scope="scope">
		     <span>{{ scope.row.agentCompany }}</span>
		   </template>
		 </el-table-column>
        <pagination
          v-show="mangototal>0"
          :total="mangototal"
          :page.sync="userlistQuery.current"
          :limit.sync="userlistQuery.size"
          :currentPage="userlistQuery.current"
          @pagination="getList"
        />
      </el-table>
      <pagination
        v-show="mangototal>0"
        :total="mangototal"
        :page.sync="userlistQuery.current"
        :limit.sync="userlistQuery.size"
        :currentPage="userlistQuery.current"
        @pagination="getList"
      />
  </div>
</template>

<script>
import {
  fetchMangoList
} from "@/api/mangoCard.js";
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
	  isAdd:true,
      list: null,
      mangolist: null,
      mangototal: 0,
      listLoading: true,
      userlistQuery: {
        current: 1,
        size: 10,
        phone: undefined,
        time: undefined,
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
        fetchMangoList(this.userlistQuery).then(response => {
          this.mangolist = response.data.records;
          this.mangototal = Number(response.data.total);
          this.listLoading = false;
        });

    },
    handleFilter() {
      this.userlistQuery.current = 1;
	  this.listLoading = true;
	  this.userlistQuery.phone == "" ? (this.userlistQuery.phone = undefined) : "",
	  this.userlistQuery.time
	    ? ((this.userlistQuery.startTime = this.userlistQuery.time[0]),
	      (this.userlistQuery.endTime = this.userlistQuery.time[1]))
	    : ((this.userlistQuery.startTime = undefined),
	      (this.userlistQuery.endTime = undefined));
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
