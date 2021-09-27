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
      <el-input v-model="listQuery.auctionId" placeholder="请输入拍卖ID" style="width:15%"></el-input>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="info" @click="resetBidRecord">重置</el-button>

      <el-table :data="tableData" max-height="700" border style="width: 100%;margin-top:30px;">
        <el-table-column prop="createTime" label="出价时间"></el-table-column>
        <el-table-column label="昵称/手机号">
          <template slot-scope="scope">
            <div>{{scope.row.userName}} {{scope.row.phone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="auctionId" label="拍卖ID"></el-table-column>
        <el-table-column prop="goodsName" label="出价商品"></el-table-column>
        <el-table-column prop="payPrice" label="出价金额"></el-table-column>
        <el-table-column prop="guarantyPrice" label="保证金"></el-table-column>
      </el-table>
    </div>
    <pagination
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { bidList } from "@/api/users";

const calendarTypeOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "0",
    display_name: "支出"
  },
  {
    key: "1",
    display_name: "收入"
  }
];
export default {
  components: {
    Pagination
  },
  data() {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime()+ 3600 * 1000 * 24 *1);
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    function dateFormatter(str){//返回yyyy-MM-dd
    var d = new Date(str);
    var year = d.getFullYear();
    var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
      return [year, month, day].join('-');
  }
    return {
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        time: [dateFormatter(start), dateFormatter(end)],
        auctionId: undefined,
        goodsName: undefined
      },
      tableData: [],
    };
  },
  created() {
    const userId = this.$route.query.userId;
    this.listQuery.userId = userId;
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
      bidList(this.listQuery).then(response => {
         this.tableData = response.data.records;
         this.total = Number(response.data.total);
         console.log(this.tableData)
         console.log(this.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    // searchBidRecord() {
    //   if (this.listQuery.auctionId == "") {
    //     this.listQuery.auctionId = undefined;
    //   }
    //   this.listQuery.current = 1;
    //   this.getList();
    // },
    resetBidRecord() {
      this.listQuery = {
        current: 1,
        size: 10,
        time: undefined,
        auctionId: undefined,
        goodsName: undefined,
        userId: this.listQuery.userId
      };
      this.getList();
    }
  }
};
</script>

<style scoped>
ul li {
  list-style: none;
  float: left;
  width: 20%;
  height: 50px;
  line-height: 50px;
}
</style>