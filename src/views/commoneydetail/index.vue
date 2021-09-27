<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 	<el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
				<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>-->
      <el-select
        v-model="listQuery.tradeType"
        placeholder="订单类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in tradeType"
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" @click="exportUserMoneyList">导出</el-button>
    </div>
    <div style="height: 20px;"></div>
    <div class="content">
      <ul class="content_ul">
        <li>总收益：+{{userMoney.totalIncome}}</li>
        <li>提现总额：-{{userMoney.withdrawTotalIncome}}</li>
        <li>冻结金额：-{{userMoney.lockIncome}}</li>
      </ul>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="600"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? '支出' :'收入' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeType == 3 ? '提现' : (scope.row.tradeType == 1 ? '拍卖分佣' : '交割分佣') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? '-' :'+' }}{{ scope.row.money }}</span>
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
import { partnerAccount, partnerList, partnerAccount2 } from "@/api/detailAll";
import { exportBlob } from "@/api/blob";
import { getToken } from "@/utils/auth.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  {
    key: "0",
    display_name: "支出"
  },
  {
    key: "1",
    display_name: "收入"
  }
];
const tradeType = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "3",
    display_name: "提现"
  },
  {
    key: "1",
    display_name: "拍卖分佣"
  },
  {
    key: "2",
    display_name: "交割分佣"
  }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        time: undefined,
        type: undefined,
        partnerId: undefined,
        tradeType: undefined
      },
      calendarTypeOptions,
      tradeType,
      positionList: [],
      dialogFormVisible: false,
      userMoney: {}
    };
  },
  created() {
    this.listQuery.partnerId = this.$route.query.userId;
    this.getList();
    this.getUserMoney(1);
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.time
        ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
          (this.listQuery.endCreateTime = this.listQuery.time[1]))
        : ((this.listQuery.startCreateTime = undefined),
          (this.listQuery.endCreateTime = undefined));
      partnerList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    handleFilter() {
      if (this.listQuery.nickName == "") {
        this.listQuery.nickName = undefined;
      } else if (this.listQuery.accountType == "") {
        this.listQuery.accountType = undefined;
      } else if (this.listQuery.phone == "") {
        this.listQuery.phone = undefined;
      }
      this.listQuery.current = 1;
      this.getList();
      // 涉及到性能问题 只有在搜索条件存在时再调用
      this.getUserMoney(2);
    },
    getUserMoney(number) {
      if (number == 1) {
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
        partnerAccount(this.listQuery).then(res => {
          if (res.code == 0) {
			this.userMoney = res.data;
          }
        });
      } else {
        this.listQuery.time
          ? ((this.listQuery.startCreateTime = this.listQuery.time[0]),
            (this.listQuery.endCreateTime = this.listQuery.time[1]))
          : ((this.listQuery.startCreateTime = undefined),
            (this.listQuery.endCreateTime = undefined));
        partnerAccount2(this.listQuery).then(res => {
          if (res.code == 0) {
			this.userMoney = res.data;
			this.userMoney.withdrawTotalIncome = res.data.withdrawIncome;
          }
        });
      }
    },
    exportUserMoneyList() {
      let data = {
        startCreateTime: this.listQuery.time
          ? this.listQuery.time[0]
          : undefined,
        endCreateTime: this.listQuery.time ? this.listQuery.time[1] : undefined,
        tradeType: this.listQuery.tradeType,
        partnerId: this.listQuery.partnerId
      };
      // data = qs.stringify(data)
      console.log(data, "data");
      let str = "";
      if (this.listQuery.tradeType) {
        str = `tradeType=` + this.listQuery.tradeType;
      }
      if (!this.listQuery.time) {
        str += `&partnerId=` + this.listQuery.partnerId;
      } else {
        str +=
          `&partnerId=` +
          this.listQuery.partnerId +
          `&startCreateTime=` +
          this.listQuery.time[0] +
          `&endCreateTime=` +
          this.listQuery.time[1];
      }
      // return
      // let str = `userId=`+ this.listQuery.userId + `&tradeType=` + this.listQuery.tradeType + `&startCreateTime=`+ (this.listQuery.time  ? this.listQuery.time [0] : null) + `&endCreateTime=` + (this.listQuery.time  ? this.listQuery.time [1] : null)
      let that = this;
      const req = new XMLHttpRequest();
      // req.open('POST', '/upms/memberUserList/excelMyAmountList', true);
      req.open("POST", "/upms/partnerAccountDetail/excel", true);
      req.responseType = "blob";
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      req.setRequestHeader("Authorization", getToken());
      req.onload = function() {
        const data = req.response;
        const a = document.createElement("a");
        const blob = new Blob([data]);
        const blobUrl = window.URL.createObjectURL(blob);
        that.download(blobUrl);
      };
      req.send(str);
    },
    download(blobUrl) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "用户收支明细.xls";
      a.href = blobUrl;
      a.click();
      // document.body.removeChild(a);
    }
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 22px;
}
.content_ul {
  display: flex;
  flex-wrap: wrap;
}
.content_ul li {
  width: 20%;
  margin-bottom: 15px;
  color: #333;
  list-style-type: none;
}
</style>
