<template>
  <div class="app-container">
      <div class="filter-container">
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="——"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-select
        v-model="listQuery.opsType"
        placeholder="积分类型"
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
      <el-input v-model="listQuery.userNameAndPhone" placeholder="用户昵称/手机号"  style="width:15%"  @keyup.enter.native="getList"></el-input>
      <el-button type="primary"  @click="search">查询</el-button>
      <el-button type="info"  @click="resetIntegralRecord">重置</el-button>
      <div>
        <ul class="ul-content">
          <li>
             <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                积分收入：{{usersIntegralMall.integralIncome}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>订单收入: {{usersIntegralMall.orderIncome}}</el-dropdown-item>
                <el-dropdown-item>手动增加: {{usersIntegralMall.manualIncome}}</el-dropdown-item>
                <el-dropdown-item>订单退回: {{usersIntegralMall.orderReturn}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                积分消耗：{{usersIntegralMall.integralOutcome}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>商品兑换: {{usersIntegralMall.checkout}}</el-dropdown-item>
                <el-dropdown-item>手动减少: {{usersIntegralMall.manualReduce}}</el-dropdown-item>
               </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>剩余积分：{{usersIntegralMall.integralRemain}}</li>
        </ul>
      </div>
      <el-table :data="tableData" max-height="650" border style="width: 100%;" @sort-change="tableSortChange" :default-sort = "{prop: 'time', order: 'descending'}">
        <el-table-column prop="time" label="时间" sortable align="center"></el-table-column>
        <el-table-column prop="nameAndPhone" label="用户昵称/手机号" align="center"></el-table-column>
        <el-table-column prop="tradeType" label="类型" align="center"></el-table-column>
        <el-table-column prop="title" label="明细" align="center"></el-table-column>
        <!-- <el-table-column prop="integralAmount" align="center" label="积分"> -->
       <el-table-column prop="type" label="金额" align="center">
          <template slot-scope="scope">{{ scope.row.type === 0 ? '-':'+'}}{{ scope.row.integralAmount }}</template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />

     <!-- </el-tab-pane>
    </el-tabs> -->
</div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { integralRecord, superIntegralRecordApi } from "@/api/users";
import { getToken } from "@/utils/auth.js";
import {exportBlob} from "@/api/blob";

const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key:'0',
    display_name:'订单赠送积分'
  },
  {
    key: "1",
    display_name: "平台操作"
  },
  {
    key: "2",
    display_name: "积分兑换"
  },
  {
    key: "3",
    display_name: "取消订单退还积分"
  },
];
export default {
  name:'integralRecordcs',
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
        userNameAndPhone:undefined,
        // phone: undefined,
        opsType: undefined,
        sort: 0,
      },
       calendarTypeOptions,
      tableData: [],
      goodsName:'',
      integralOutcome:'',
      integralRemain:'',
      orderIncome:'',
      manualIncome:'',
      checkout:'',
      manualReduce:'',
      // 积分总记
      usersIntegralMall:{},
      activeName:'first'
    };
  },
  created() {
    const phone = this.$route.query && this.$route.query.phone ? this.$route.query.phone : null;
    console.log(this.$route.query,'qqq')
    if(phone){
      this.listQuery.userNameAndPhone = phone;
    }
    this.activeName = this.$route.query.type || 'first'
    //const userId = this.$route.query.userId;
      this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : ((this.listQuery.startTime = undefined),
          (this.listQuery.endTime = undefined));

      if( this.activeName == 'first' ){
        integralRecord(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = Number(response.data.records.total);
          this.usersIntegralMall = response.data;
          (this.tableData = response.data.records.records);
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        });
      }else{
        superIntegralRecordApi(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = Number(response.data.records.total);
          this.usersIntegralMall = response.data;
          (this.tableData = response.data.records.records);
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        });
      }

    },
    search(){
      this.listQuery.current = 1
      this.getList();
    },

    resetIntegralRecord(){
     this.listQuery = {
        // 拍卖搜索条件
        userNameAndPhone: undefined,
        opsType: undefined,
        current: 1,
        size: 10,
        startTime:undefined,
        endTime:undefined,
        sort: 0,
      };
      this.getList();
    },
     // 排序
    tableSortChange(data) {
      if (data.order === null) {
        this.listQuery.sort = 0;
      } else {
        this.timeSort = data.order === "descending" ? 0 : 1;
      }
      this.getList();
    },
    // tab切换
    handleClick(){
      this.getList();
    }
  }
};
</script>

<style scoped>
ul.ul-content > li {
  list-style: none;
  float: left;
  width: 20%;
  height: 50px;
  line-height: 50px;
}
ul.ul-content:after {
  display: block;
  content: "";
  clear: both;
}
</style>
