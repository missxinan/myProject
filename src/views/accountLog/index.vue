<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.status"
        placeholder="充值状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>

      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-input
        v-model="listQuery.userName"
        clearable
        placeholder="用户昵称/手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.paySource"
        placeholder="来源"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in sourceOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.payType"
        placeholder="充值账户"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in accountList"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <!-- <el-input v-model="listQuery.phone" clearable placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-button
        v-waves
        class="filter-item topMagin"
        type="primary"
        icon="el-icon-search"
        @click="search"
      >查询</el-button>
      <el-button type='text'>金额：{{totalPrice}}</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="650"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="付款时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户/手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}/{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 1">支付宝</span>
           <span v-if="scope.row.payType === 2">微信</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? '充值中' :(scope.row.status == 1 ? '充值成功' : '充值失败' ) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.paySource == 1 ? '小程序' : 'App'}}</span>
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
import { fetchList, rechargeLogExport,rechargeCountMoneyApi } from "@/api/accountLog";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import treeToArray from "@/utils/deal";
import { getToken } from "@/utils/auth.js";
import checkPermission from "@/utils/permission";
import {requestfile, exportBlob} from "@/api/blob"

const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "0",
    display_name: "充值中"
  },
  {
    key: "1",
    display_name: "充值成功"
  },
  {
    key: "2",
    display_name: "充值失败"
  }
];

const sourceOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "1",
    display_name: "小程序"
  },
  {
    key: "2",
    display_name: "App"
  }
];

const accountList = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "1",
    display_name: "支付宝"
  },
  {
    key: "2",
    display_name: "微信"
  }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "accountLog",
  components: {
    Pagination
  },
  directives: {
    waves
  },
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
        userName: undefined,
        // phone: undefined,
        status: undefined,
        paySource: undefined, // 来源绑定
        payType:undefined,
      },
      sourceOptions,
      accountList,
      calendarTypeOptions,
      positionList: [],
      dialogFormVisible: false,
      totalPrice:''
    };
  },
  created() {
    this.getList();
    this.countMoney();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : ((this.listQuery.startTime = undefined),
          (this.listQuery.endTime = undefined));
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    search(){
      this.listQuery.current = 1
      this.getList();
      this.countMoney();
    },
    countMoney(){
      rechargeCountMoneyApi(this.listQuery).then(res=>{
        this.totalPrice = res.data
      })
    },
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 22px;
}
.topMagin {
  margin-top: 20px;
}
</style>
