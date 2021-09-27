<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-date-picker v-model="listQuery.time" type="datetimerange" clearable range-separator="至" value-format="yyyy-MM-dd HH:mm:ss"
			 start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>-->
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
        placeholder="用户昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
	  <el-input
        v-model="listQuery.phone"
        clearable
        placeholder="手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
	  <el-select
        v-model="listQuery.status"
        placeholder="用户类型"
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
	   <el-select
        v-model="listQuery.paySource"
        placeholder="请选择状态"
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
        v-model="listQuery.paySource"
        placeholder="请选择来源"
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
      <!-- <el-input v-model="listQuery.phone" clearable placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <br/>
      <el-button
        v-waves
        class="filter-item topMagin"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
	  <el-button
        v-waves
        class="filter-item topMagin"
        type="primary"
        icon="el-icon-refresh"
        @click="handleFilter"
      >重置</el-button>
      <el-button class="topMagin" type="primary" icon="el-icon-download" @click="exportRechargeList">导出</el-button>
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
      <!-- <el-table-column label="序号" type="index" align="center" width="60"></el-table-column> -->
      <el-table-column label="注册时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}/{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payType == 2 ? '微信' : '其他' }}</span>
        </template>
      </el-table-column>
	   <el-table-column label="邀请码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? '充值中' :(scope.row.status == 1 ? '充值成功' : '充值失败' ) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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
// 这个页面废弃了，是以前用户管理列表点进去的就是资金明细，如果后期需要再加上，导出功能未完善
import { fetchList, rechargeLogExport } from "@/api/accountLog";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import treeToArray from "@/utils/deal";
import { getToken } from "@/utils/auth.js";

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
  },
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
        phone:undefined,
        // phone: undefined,
		status: undefined,
		paySource: undefined,  // 来源绑定
      },
      sourceOptions,
      calendarTypeOptions,
      positionList: [],
      dialogFormVisible: false
    };
  },
  created() {
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
      fetchList(this.listQuery).then(response => {
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
    },
    // 导出
    exportRechargeList() {
      // 导出接口调用 后续导出接口出来换成导出接口
      // rechargeLogExport(this.listQuery);
      let data = {
        startCreateTime: this.listQuery.time
          ? this.listQuery.time[0]
          : undefined,
        endCreateTime: this.listQuery.time ? this.listQuery.time[1] : undefined,
        accountType:this.listQuery.accountType,
        nickName:this.listQuery.nickName
      };
      // data = qs.stringify(data)
      console.log(data, "data");
       let str = "";
      if (this.listQuery.accountType) {
        str = `accountType=` + this.listQuery.accountType;
      }
      if (!this.listQuery.time) {
        str += `&nickName=` + this.listQuery.nickName;
      } else {
        str +=
          `&nickName=` +
          this.listQuery.nickName +
          `&startCreateTime=` +
          this.listQuery.time[0] +
          `&endCreateTime=` +
          this.listQuery.time[1];
      }
      // return
      // let str = `userId=`+ this.listQuery.userId + `&tradeType=` + this.listQuery.tradeType + `&startCreateTime=`+ (this.listQuery.time  ? this.listQuery.time [0] : null) + `&endCreateTime=` + (this.listQuery.time  ? this.listQuery.time [1] : null)
      let that = this;
      const req = new XMLHttpRequest();
      // req.open('POST', 'https://optu.jiayikou.com/upms/memberUserList/excelMyAmountList', true);
      req.open("POST", "upms/member/rechargeLog/export", true);
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
.topMagin {
  margin-top: 20px;
}
</style>
