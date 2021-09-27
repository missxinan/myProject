<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        range-separator="——"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select
        v-model="listQuery.tradeType"
        placeholder="明细类型"
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
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <div>
        <ul class="ul-content">
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                总收益 ：{{totalMoney}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>代拍收益: {{ofreceData.actingIncome}}</el-dropdown-item>
                <el-dropdown-item>特卖收益: {{ofreceData.postIncome}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
         <li>提现金额 ：{{ofreceData.withdraw}}</li>
          <li>用户余额 ：{{ofreceData.amount}}</li>
        </ul>
      </div>
      <el-table
        :data="tableData"
        max-height="620"
        border
        style="width: 100%"
        v-loading="listLoading"
      >
        <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
        <el-table-column prop="type" label="收支类型" align="center">
          <template slot-scope="scope">{{ scope.row.type === 0 ? '支出':'收入'}}</template>
        </el-table-column>
        <el-table-column prop="tradeType" label="明细类型" align="center">
            <template slot-scope="scope">
            <span v-if="scope.row.tradeType == 1">特卖收益</span>
            <span v-if="scope.row.tradeType == 2">提现</span>
            <span v-if="scope.row.tradeType == 3">代拍收益</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" align="center">
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />
    <el-dialog title="用户余额" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>用户余额：{{ userBalance }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; 
import { getMyMoneymmm, moneyList } from "@/api/users";
import { vipAccountDetail , vipAccount} from "@/api/vipMange";

import { getToken } from "@/utils/auth.js";
const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "1",
    display_name: "特卖收益"
  },
  {
    key: "2",
    display_name: "提现"
  },
  {
    key: "3",
    display_name: "代拍收益"
  },
];
export default {
  components: {
    Pagination
  },
  data() {
    return {
      value1: "",
      value2: "",
      total: 0,
      ofreceData: {},
      dialogVisible: false, // 用户余额显示
      userBalance: 0,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
        tradeType: undefined,
        vipId: undefined,
      },
      listLoading: false,
      calendarTypeOptions,
      tableData: [],
      totalMoney:0,
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "今天",
      //       onClick(picker) {
      //         const end = new Date();
      //         picker.$emit("pick", [end, end]);
      //       }
      //     },
      //     {
      //       text: "最近一周",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit("pick", [start, end]);
      //       }
      //     },
      //     {
      //       text: "最近一个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //         picker.$emit("pick", [start, end]);
      //       }
      //     }
      //   ],
      //   // onPick: ({ maxDate, minDate }) => {
      //   //   this.choiceDate = minDate.getTime();
      //   //   if (maxDate) {
      //   //     this.choiceDate = "";
      //   //   }
      //   // },
      //   // disabledDate: time => {
      //   //   const self = this;
      //   //   const startDay = new Date(
      //   //     new Date().getTime() - 24 * 3600 * 1000 * 30
      //   //   );
      //   //   const endDay = new Date(new Date().getTime());
      //   //   let minTime = startDay;
      //   //   let maxTime = endDay;
      //   //   return time.getTime() < minTime || time.getTime() > maxTime;
      //   // }
      // },
      // choiceDate: ""
    };
  },
  created() {
    const vipId = this.$route.query.vipId;
    this.listQuery.vipId = vipId;
    // this.defaultDate();
    this.getList();
  },
  methods: {
    getList() {
      // if (!this.listQuery.time) {
      //   this.$message.error("请选择时间");
      //   return;
      // }
      this.listLoading = true;
       const moneyData = {
        ...this.listQuery,
        startCreateTime: this.listQuery.time ? this.listQuery.time[0] : '',
        endCreateTime: this.listQuery.time ? this.listQuery.time[1] : ''
      }
      vipAccountDetail(moneyData)
        .then(response => {
          this.tableData = response.data.records;
          this.total = Number(response.data.total);
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error.msg || '后台出错');
          this.listLoading = false;
        });
      const vipId = this.$route.query.vipId;
      const myMoneyData = {
        ...this.listQuery,
        startTime: this.listQuery.time ? this.listQuery.time[0] : '',
        endTime: this.listQuery.time ? this.listQuery.time[1] : ''
      }
      vipAccount({ vipId, ...myMoneyData }).then(response => {
        this.ofreceData = response.data;
        this.computetotalMoney()
      });
    },
    // 计算总金额 ==  特卖收益 + 特卖收益
    computetotalMoney() {
      this.totalMoney = Number(this.ofreceData.actingIncome) + Number(this.ofreceData.postIncome)
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 重置
    reset() {
      this.listQuery = {
        time: undefined,
        current: 1,
        size: 10,
        tradeType: undefined,
        vipId: this.listQuery.vipId
      };
      this.getList();
    },
    // defaultDate() {
    //   let date = new Date();
    //   let monthDay = new Date(date.getTime() - 3600 * 1000 * 24 * 30);
    //   let end = this.timeChange(date);
    //   let beg = this.timeChange(monthDay);
    //   this.listQuery.time = [beg, end];
    // },
    // timeChange(date) {
    //   let year = date.getFullYear().toString();
    //   let month =
    //     date.getMonth() + 1 < 10
    //       ? "0" + (date.getMonth() + 1).toString()
    //       : (date.getMonth() + 1).toString();
    //   let day =
    //     date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    //   let beg = year + "-" + month + "-" + day;
    //   return beg;
    // }
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
  font-size: 16px;
}
ul.ul-content:after {
  display: block;
  content: "";
  clear: both;
}
</style>