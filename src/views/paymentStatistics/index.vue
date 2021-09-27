<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="拍卖" name="1">
        <div class="filter-container">
          <el-date-picker
            v-model="auctionQuery.time"
            type="datetimerange"
            clearable
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="付款开始时间"
            end-placeholder="付款结束日期"
          ></el-date-picker>
          <el-input
            v-model="auctionQuery.orderId"
            clearable
            placeholder="订单编号"
            style="width: 200px;"
            class="filter-item"
            maxlength="19"
          />
          <el-input
            v-model="auctionQuery.paymentCode"
            clearable
            placeholder="支付单号"
            style="width: 200px;"
            class="filter-item"
          />
          <el-input
            v-model="auctionQuery.userName"
            clearable
            placeholder="用户昵称或手机号"
            style="width: 200px;"
            class="filter-item"
          />
          <el-select
            v-model="auctionQuery.payType"
            placeholder="付款账户"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in payingTellerOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="auctionQuery.paySource"
            placeholder="来源"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in paySourceOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
          <el-button v-waves class="filter-item" type="primary" @click="auctionReset">重置</el-button>
        </div>
        <div style="height: 20px;"></div>
        <div class="paymoney"  :data="auctionAllPrice">付款金额：{{auctionAllPrice.totalPrice}}</div>
        <el-table
          v-loading="auctionLoading"
          :data="auctionList"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
        >
          <el-table-column prop="payTime" align="center" label="付款时间" width="100"></el-table-column>
          <el-table-column prop="price" align="center" label="付款金额"></el-table-column>
          <el-table-column prop="userName" align="center" label="用户信息">
            <template slot-scope="scope">
              <span>{{ scope.row.userName}} {{ scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" align="center" label="订单编号"></el-table-column>
          <el-table-column prop="code" align="center" label="交易单号"></el-table-column>
          <el-table-column prop="type" align="center" label="付款账号">
              <template slot-scope="scope">
              <span>{{ scope.row.type == 2 ? '微信': '支付宝'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paySource" align="center" label="来源">
             <template slot-scope="scope">
              <span>{{ scope.row.paySource == 1 ? '小程序': 'App'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-paging">
          <el-pagination
            @size-change="handleAuctionSizeChange"
            @current-change="handleAuctionCurrentChange"
            :current-page="auctionQuery.current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="auctionQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="auctionTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商城" name="2">
        <div class="filter-container">
          <el-date-picker
            v-model="integralQuery.time"
            type="datetimerange"
            clearable
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="付款开始时间"
            end-placeholder="付款结束日期"
          ></el-date-picker>
          <el-input
            v-model="integralQuery.orderId"
            clearable
            placeholder="订单编号"
            style="width: 200px;"
            class="filter-item"
          />
          <el-input
            v-model="integralQuery.paymentCode"
            clearable
            placeholder="支付单号"
            style="width: 200px;"
            class="filter-item"
          />
          <el-input
            v-model="integralQuery.userName"
            clearable
            placeholder="用户昵称或手机号"
            style="width: 200px;"
            class="filter-item"
          />
          <el-select
            v-model="integralQuery.payType"
            placeholder="付款账户"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in payingTellerOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="integralQuery.paySource"
            placeholder="来源"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in paySourceOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleIntegralFilter"
          >查询</el-button>
          <el-button v-waves class="filter-item" type="primary" @click="integralReset">重置</el-button>
        </div>
        <div style="height: 20px;"></div>
         <div class="paymoney" :data="shoppingAllPrice">付款金额：{{shoppingAllPrice.totalPrice}}</div>
        <el-table
          v-loading="integralLoading"
          :data="integralList"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
        >
          <el-table-column prop="payTime" align="center" label="付款时间" width="100"></el-table-column>
          <el-table-column prop="price" align="center" label="付款金额"></el-table-column>
          <el-table-column prop="userName" align="center" label="用户信息">
            <template slot-scope="scope">
              <span>{{ scope.row.userName}} {{ scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderId" align="center" label="订单编号"></el-table-column>
          <el-table-column prop="code" align="center" label="交易单号"></el-table-column>
          <el-table-column prop="type" align="center" label="付款账号">
              <template slot-scope="scope">
              <span>{{ scope.row.type == 2 ? '微信': '支付宝'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paySource" align="center" label="来源">
             <template slot-scope="scope">
              <span>{{ scope.row.paySource == 1 ? '小程序': 'App'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-paging">
          <el-pagination
            @size-change="handleIntegralSizeChange"
            @current-change="handleIntegralCurrentChange"
            :current-page="integralQuery.current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="integralQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="integralTotal"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { auctionDataList, integralDataList } from "@/api/paymentStatistics";
import waves from "@/directive/waves"; // 按钮样式波纹效果

// 付款账户
const payingTellerOptions = [
  {
    key: "",
    display_name: "全部"
  },
  {
    key: "2",
    display_name: "微信"
  },
  {
    key: "3",
    display_name: "支付宝"
  }
];

// 来源
const paySourceOptions = [
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

export default {
  name: "paymentStatistics",
  directives: {
    waves
  },
  data() {
    return {
      payingTellerOptions, // 付款账户选择列表
      paySourceOptions, // 来源选择列表
      auctionTotal: 0, // 总数量
      auctionLoading: true, // loading
      auctionQuery: {
        // 拍卖搜索条件
        time: undefined,
        orderId: undefined,
        paymentCode: undefined,
        userName: undefined,
        payType: undefined,
        paySource: undefined,
        current: 1,
        size: 10
      },
      auctionList: [], //拍卖列表
      shoppingAllPrice:[],
      auctionAllPrice:[],
      integralTotal: 0, // 总数量
      integralLoading: true, // loading
      integralQuery: {
        // 积分商城搜索条件
        time: undefined,
        orderId: undefined,
        paymentCode: undefined,
        userName: undefined,
        payType: undefined,
        paySource: undefined,
        current: 1,
        size: 10
      },
      integralList: [], //积分商城列表
      activeName: "1",
      totalPrice:''
    };
  },
  created() {
    this.getList();
    this.getIntegralList();
  },
  methods: {
    // 拍卖列表
    getList() {
      this.auctionLoading = true;
      this.auctionQuery.time
        ? ((this.auctionQuery.startTime = this.auctionQuery.time[0]+`:00`),
          (this.auctionQuery.endTime = this.auctionQuery.time[1]+`:00`))
        : ((this.auctionQuery.startTime = undefined),
          (this.auctionQuery.endTime = undefined));
      auctionDataList(this.auctionQuery)
        .then(res => {
          this.auctionList = res.data.records.records;
          this.auctionAllPrice = res.data;
          this.auctionTotal = Number(res.data.records.total);
          this.auctionLoading = false;
        })
        .catch(() => {
          this.auctionLoading = false;
        });
    },
    // 拍卖搜索
    handleFilter() {
      this.auctionQuery.current = 1;
      this.getList();
    },
    // 重置
    auctionReset() {
      this.auctionQuery = {
        // 拍卖搜索条件
        time: undefined,
        orderId: undefined,
        paymentCode: undefined,
        userName: undefined,
        payType: undefined,
        paySource: undefined,
        current: 1,
        size: 10
      };
      this.getList();
    },
    // 拍卖部分
    handleAuctionSizeChange(page) {
      this.auctionQuery.size = page;
      this.getList();
    },
    // 分页
    handleAuctionCurrentChange(page) {
      this.auctionQuery.current = page;
      this.getList();
    },
    // 积分商城页面
    getIntegralList() {
      this.integralLoading = true;
      this.integralQuery.time
        ? ((this.integralQuery.startTime = this.integralQuery.time[0]+`:00`),
          (this.integralQuery.endTime = this.integralQuery.time[1]+`:00`))
        : ((this.integralQuery.startTime = undefined),
          (this.integralQuery.endTime = undefined));
      integralDataList(this.integralQuery)
        .then(res => {
          this.integralList = res.data.records.records;
          this.integralTotal = Number(res.data.records.total);
          this.shoppingAllPrice = res.data;
          this.integralLoading = false;
        })
        .catch(() => {
          this.integralLoading = false;
        });
    },
    handleIntegralSizeChange(page) {
      this.integralQuery.size = page;
      this.getIntegralList();
    },
    handleIntegralCurrentChange(page) {
      this.integralQuery.current = page;
      this.getIntegralList();
    },
    handleIntegralFilter() {
      this.integralQuery.current = 1;
      this.getIntegralList();
    },
    // 重置
    integralReset() {
      this.integralQuery = {
        // 拍卖搜索条件
        time: undefined,
        orderId: undefined,
        paymentCode: undefined,
        userName: undefined,
        payType: undefined,
        paySource: undefined,
        current: 1,
        size: 10
      };
      this.getIntegralList();
    },
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 16px;
}
.table-paging {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.paymoney {
  margin-bottom: 15px;
}
</style>
