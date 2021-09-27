<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.spellMakeOrderId"
        placeholder="拼赚订单编号"
        style="width: 140px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
	  <el-input
        v-model="listQuery.channelNo"
        placeholder="渠道编号"
        style="width: 140px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select
        v-model="listQuery.orderStatus"
        placeholder="拼赚订单状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="拼赚中" value="5"/>
        <el-option label="拼赚成功" value="6"/>
        <el-option label="拼赚失败" value="7"/>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button @click="resetListQuery">重置</el-button>
      <el-button @click="exportToExcel">导出拼团数据数据</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
      max-height="650"
	  border
	  fit
	  highlight-current-row
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="拼赚订单id" align="center" property="spellMakeOrderId">
        <template slot-scope="scope">
          <span>{{ scope.row.spellMakeOrderId }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="参与拍品" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.goodsName }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与拼赚日期" align="center" property="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="渠道编号" align="center" property="channelNo">
	    <template slot-scope="scope">
	      <span>{{ scope.row.channelNo }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="参与用户ID" align="center" property="userId">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center" property="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投资金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spellMakePrice }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="拼赚订单状态" align="center">
	    <template slot-scope="scope">
	  			<span v-if="scope.row.orderStatus==0">待付款</span>
	  			<span v-if="scope.row.orderStatus==1">待发货</span>
	  			<span v-if="scope.row.orderStatus==2">待收货</span>
	  			<span v-if="scope.row.orderStatus==3">交易完成</span>
	  			<span v-if="scope.row.orderStatus==4">交易失败</span>
	  			<span v-if="scope.row.orderStatus==5">进行中</span>
	  			<span v-if="scope.row.orderStatus==6">已成团</span>
	  			<span v-if="scope.row.orderStatus==7">拼团失败</span>
	  			<span v-if="scope.row.orderStatus==8">竞拍中</span>
	  			<span v-if="scope.row.orderStatus==9">开团待支付</span>
	  			<span v-if="scope.row.orderStatus==10">已取消</span>
	  		</template>
	  </el-table-column>
      <el-table-column label="投资收益" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.earnings }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {
  fetchList,
  usersDetail,
  integralEdit,
  uploadImgFile,
  getSysConfig,
} from "@/api/users";
import {
  spellTeam
} from "@/api/spellRecord.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { requestfile, exportBlobExcel } from "@/api/blob";
import qs from "qs";
import checkPermission from "@/utils/permission";


export default {
  name: "spellGroupRecord",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
		channelNo:undefined,
      },

    };
  },
  created() {
    this.getList();
  },
  methods: {
	  /**
	   * 导出excel
	   */
	  exportToExcel() {
	  let that = this;
	  let url = "/spell/make/order/team/excel";
	  this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
	  this.listQuery.time
	    ? ((this.listQuery.minDate = this.listQuery.time[0]),
	      (this.listQuery.maxDate = this.listQuery.time[1]))
	    : ((this.listQuery.minDate = undefined),
	      (this.listQuery.maxDate = undefined));
	  let datas = JSON.parse(JSON.stringify(this.listQuery));
	  exportBlobExcel(url, datas).then(res => {
	    console.log(res, "res");
	    const data = res.data;
	    const a = document.createElement("a");
	    const blob = new Blob([data]);
	    const blobUrl = window.URL.createObjectURL(blob);
	    a.style.display = "none";
	    a.download = "拼团数据.xls";
	    a.href = blobUrl;
	    a.click();
	  });
	},
    // 权限管理
    checkPermission,
    getList() {
      this.listLoading = true;
      this.listQuery.nickname == ""
        ? (this.listQuery.nickname = undefined)
        : "",
        this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
        this.listQuery.time
          ? ((this.listQuery.minDate = this.listQuery.time[0]),
            (this.listQuery.maxDate = this.listQuery.time[1]))
          : ((this.listQuery.minDate = undefined),
            (this.listQuery.maxDate = undefined));
      spellTeam(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
        setTimeout(() => {
          this.listLoading = false;
        }, 10);
      });
    },
    handleFilter() {
      this.listQuery.current = 1;
      this.getList();
    },
    resetListQuery() {
      this.listQuery = {
        current: 1,
        size: 10,
        time: undefined,
		channelNo:undefined,
      };
      this.getList();
    },
  }
};
</script>
