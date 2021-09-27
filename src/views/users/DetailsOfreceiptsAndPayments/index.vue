<template>
  <div class="app-container">
    <div class="filter-container">
       <!-- :picker-options="pickerOptions" -->
      <el-date-picker
        v-model="listQuery.time"
        :picker-options="pickerOptions"
        type="daterange"
        range-separator="——"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select
        v-model="listQuery.tradeType"
        placeholder="类型"
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
      <el-button type="info" @click="reset">重置</el-button>      <div>
        <ul class="ul-content">
          <li>初始金额：{{ofreceData.initialMoney}}</li>
          <li>用户余额：{{ofreceData.amount}}</li>
          <li>冻结金额：{{ofreceData.lockAmount}}</li>
          <li>充值金额：{{ofreceData.chargeMoney}}</li>
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                总收益： {{ofreceData.totalIncome}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>拍卖收益: {{ofreceData.profitMoney}}</el-dropdown-item>
                <el-dropdown-item>成交收益: {{ofreceData.orderProfitMoney}}</el-dropdown-item>
                <el-dropdown-item>寄拍收益: {{ofreceData.proceedsMoney}}</el-dropdown-item>
                <el-dropdown-item>旗舰店收益: {{ofreceData.vipIncome}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                手动调整：{{ofreceData.handMoney}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>数据迁移: +{{ofreceData.moveMoney}}</el-dropdown-item>
                <el-dropdown-item>手动增加: +{{ofreceData.platGiveAddAmount}}</el-dropdown-item>
                <el-dropdown-item>手动减少: -{{ofreceData.platGiveReduceAmount}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                消费金额：{{ofreceData.consumeMoney}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>订单保证金: {{ofreceData.orderPositMoney}}</el-dropdown-item>
                <el-dropdown-item>尾款: {{ofreceData.orderMoney}}</el-dropdown-item>
                <el-dropdown-item>商城: {{ofreceData.mallOrder}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>失效保证金：{{ofreceData.loseMoney}}</li>
          <li>
             <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                提现金额：{{ ofreceData.withdrawMoney }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>提现申请: {{ofreceData.outWithdraw}}</el-dropdown-item>
                <el-dropdown-item>提现驳回: {{ofreceData.withdrawReturnMoney}}</el-dropdown-item>
                 <el-dropdown-item>提现撤回: {{ ofreceData.withdrawCancelMoney }} </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <!-- <li>免单退保证金：{{ofreceData.freeBackDepositMoney}}</li> -->
          <li>
            <el-button type="primary" @click="compute">计算</el-button>
          </li>
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
        <el-table-column prop="tradeType" align="center" label="订单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.tradeType === 0">提现</span>
            <span v-if="scope.row.tradeType === 1">保证金</span>
            <span v-if="scope.row.tradeType === 2">订单</span>
            <span v-if="scope.row.tradeType === 3">充值金额</span>
            <span v-if="scope.row.tradeType === 5">拍卖分佣</span>
            <span v-if="scope.row.tradeType === 6">交割分佣</span>
            <span v-if="scope.row.tradeType === 7">平台操作</span>
            <span v-if="scope.row.tradeType === 8">寄拍收益</span>
            <span v-if="scope.row.tradeType === 10">拍卖收入</span>
            <span v-if="scope.row.tradeType === 11">商城</span>
            <span v-if="scope.row.tradeType === 15">提现撤回</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="明细" align="center"></el-table-column>
        <el-table-column prop="tradeNo" label="订单编号" align="center"></el-table-column>
        <!-- <el-table-column prop="amount" label="金额"></el-table-column> -->
        <el-table-column prop="type" label="金额" align="center">
          <template slot-scope="scope">{{ scope.row.type === 0 ? '-':'+'}}{{ scope.row.amount }}</template>
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
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getMyMoneymmm, moneyList } from "@/api/users";
import { getToken } from "@/utils/auth.js";
const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "0",
    display_name: "提现"
  },
  {
    key: "2",
    display_name: "尾款"
  },
  {
    key: "3",
    display_name: "充值余额"
  },
  {
    key: "5",
    display_name: "拍卖收益"
  },
  {
    key: "6",
    display_name: "成交收益"
  },
  {
    key: "7",
    display_name: "平台操作"
  },
  {
    key: "8",
    display_name: "寄拍收益"
  },
  {
    key: "10",
    display_name: "旗舰店收益"
  },
  {
    key: "11",
    display_name: "商城"
  },
  {
    key: "12",
    display_name: "订单保证金"
  },
   {
    key: "15",
    display_name: "提现撤回"
  }
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
        userId: undefined
      },
      listLoading: false,
      calendarTypeOptions,
      tableData: [],
      pickerOptions: {
         shortcuts: [
           {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              picker.$emit('pick', [end, end]);
            }
          },
           {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近20天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 20);
              picker.$emit('pick', [start, end]);
            }
          }],
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        },
        disabledDate: (time) => {
          const self = this;
          const startDay = new Date(new Date().getTime() - (24 * 3600 * 1000 * 365));
          const endDay = new Date(new Date().getTime())
          let minTime = startDay;
          let maxTime =  endDay;
          return time.getTime() < minTime || time.getTime() > maxTime
        }
      },
      choiceDate: '',
    };
  },
  created() {
    const userId = this.$route.query.userId;
    this.listQuery.userId = userId;
    // let time = this.defaultDate();
    // getMyMoneymmm({ userId ,startCreateTime:time,endCreateTime:time}).then(response => {
    //   this.ofreceData = response.data;
    // });
    this.defaultDate();
    this.getList();

  },
  methods: {
    getList() {
      if(!this.listQuery.time ){
          this.$message.error('请选择时间');
          return
      }
      this.listLoading = true;
      this.listQuery.time
        ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
          (this.listQuery.endCreateTime = this.listQuery.time[1]))
        : ((this.listQuery.startCreateTime = undefined),
          (this.listQuery.endCreateTime = undefined));
      moneyList(this.listQuery)
        .then(response => {
          this.tableData = response.data.records;
          this.total = Number(response.data.total);
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        })
        .catch(() => {});
      const userId = this.$route.query.userId;
      this.listQuery.userId = userId;
      getMyMoneymmm({ userId,...this.listQuery }).then(response => {
        this.ofreceData = response.data;
      });
    },
    // 计算
    compute() {
      this.userBalance = "";
      this.userBalance =(
        this.ofreceData.initialMoney +
        this.ofreceData.chargeMoney +
        this.ofreceData.totalIncome +
        this.ofreceData.handMoney -
        (this.ofreceData.consumeMoney +
          this.ofreceData.loseMoney +
          this.ofreceData.lockAmount +
          this.ofreceData.withdrawMoney)).toFixed(2);
      this.dialogVisible = true;
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
        userId: this.listQuery.userId
      };
      this.getList();
    },
    defaultDate(){
      let date = new Date()
      let monthDay = new Date(date.getTime() - 3600 * 1000 * 24 * 30)
      let end = this.timeChange(date)
      let beg = this.timeChange(monthDay)
      this.listQuery.time = [beg,end]
    },
    timeChange(date){
      let year = date.getFullYear().toString()
      let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString()
      let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate().toString()
      let beg = year + '-' + month + '-' + day
      return beg
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
  font-size: 16px;
}
ul.ul-content:after {
  display: block;
  content: "";
  clear: both;
}
</style>
