<template>
	<div class="container">
    <div class="OrderTopFlex">
      <div class="ax_200">
        <el-date-picker
          v-model="ProductionPrice.startCreateTime"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="下单开始日期"
          end-placeholder="下单结束日期"
        ></el-date-picker>
      </div>
      <div class="ax_200" v-if="activeIndex == 3 || activeIndex == 4 || activeIndex == 5 ">
        <el-date-picker
          v-model="ProductionPrice.payTime"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="订单付款开始日期"
          end-placeholder="订单付款结束日期"
        ></el-date-picker>
      </div>
      <div class="ax_200" v-if="activeIndex == 5">
        <el-date-picker
          v-model="ProductionPrice.startTimeArrory"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="订单完成开始日期"
          end-placeholder="订单完成结束日期"
        ></el-date-picker>
      </div>
      <div class="ax_200">
        <el-input
          v-model="ProductionPrice.goodsNameId"
          style="width: 200px;"
          clearable
          placeholder="请输入商品名称"
        ></el-input>
      </div>
     <div class="ax_200">
        <el-input
          type="text"
          v-model="ProductionPrice.auctionId"
          style="width: 200px;"
          clearable
          maxlength="19"
          show-word-limit
          placeholder="请输入竞拍号"
        ></el-input>
      </div>
      <div class="ax_200">
        <el-input
          type="text"
          v-model="ProductionPrice.orderId"
          style="width: 200px;"
          clearable
          maxlength="19"
          show-word-limit
          placeholder="请输入订单编号"
        ></el-input>
      </div>
      <div class="ax_200">
        <el-input v-model="ProductionPrice.buyerNamePhone" clearable placeholder="请输入买家信息"></el-input>
      </div>
      <div class="ax_200">
        <el-input v-model="ProductionPrice.mobile" clearable placeholder="请输入收货人手机号"></el-input>
      </div>
      <div class="ax_200">
        <el-input v-model="ProductionPrice.consignee" clearable placeholder="请输入收货人姓名"></el-input>
      </div>
      <div class="ax_200">
        <el-select v-model="ProductionPrice.type" clearable placeholder="请选择付款方式">
          <el-option
            v-for="item in paymethod"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ax_200">
        <el-select v-model="ProductionPrice.orderSource" clearable placeholder="请选择订单类型">
          <el-option key label="全部" value></el-option>
          <el-option key="1" label="平台订单" value="1"></el-option>
          <el-option key="2" label="寄拍订单" value="2"></el-option>
        </el-select>
      </div>
      <div class="ax_200 right">
        <el-button
          type="primary"
          icon="el-icon-search"
          style="height:40px"
          @click="searchDingDan"
        >搜索</el-button>
        <el-button type="info" style="height:40px" @click="resetDingDan">重置</el-button>
         <el-button type='text'>总保证金：{{totalPrice.pledgePrice}} 总尾款：{{ totalPrice.orderPrice }}</el-button>
      </div>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      id="u9"
      style="margin-bottom: 20px;"
    >
      <el-menu-item index="1">
        全部
        <span v-if="activeIndex == 1">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="2">
        待付款
        <span v-if="activeIndex == 2">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="3">
        待发货
        <span v-if="activeIndex == 3">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="4">
        待收货
        <span v-if="activeIndex == 4">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="5">
        交易成功
        <span v-if="activeIndex == 5">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="6">
        交易关闭
        <span v-if="activeIndex == 6">({{thistotal}})</span>
      </el-menu-item>
      <el-menu-item index="7">
        已取消
        <span v-if="activeIndex == 7">({{thistotal}})</span>
      </el-menu-item>
    </el-menu>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      max-height="650"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">{{scope.row.orderId }}</template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" width="200">
        <template slot-scope="scope">
          <div class="goodsInfo_wrap">
            <div class="goodsImg_wrap">
              <img class="goods_image" :src="scope.row.logo" />
            </div>
            <div class="goods_right" style="width:58%;margin-left:8%">
              <span class="goods_name">{{ scope.row.goodsName }}</span>
              <span>{{ scope.row.goodsId }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="买家/手机号" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column label="付款时间" align="center">
        <template slot-scope="scope">{{ scope.row.payTime }}</template>
      </el-table-column>
      <el-table-column label="交易完成时间" align="center">
        <template slot-scope="scope">
          <div v-if="3 === scope.row.orderStatus">{{ scope.row.updateTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="成交价" align="center">
        <template slot-scope="scope">{{ scope.row.transactionPrice }}</template>
      </el-table-column>
      <el-table-column label="保证金" align="center">
        <template slot-scope="scope">{{scope.row.pledgePrice}}</template>
      </el-table-column>
      <el-table-column label="成本价" align="center">
        <template slot-scope="scope">{{ scope.row.costPrice }}</template>
      </el-table-column>
      <el-table-column label="尾款" align="center">
        <template slot-scope="scope">{{scope.row.orderPrice}}</template>
      </el-table-column>
      <!-- <el-table-column label="实付款"  align="center">
        <template slot-scope="scope">{{ scope.row.actualPayment}}</template>
      </el-table-column> -->
      <!-- <el-table-column label="付款时间" align="center">
                <template slot-scope="scope" >{{scope.row.payTime}}</template>
      </el-table-column>-->
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <div v-if="0 === scope.row.orderStatus">
            <el-tag type="success">待付款</el-tag>
          </div>
          <div v-if="1 === scope.row.orderStatus">
            <el-tag type="danger">待发货</el-tag>
          </div>
          <div v-if="2 === scope.row.orderStatus">待收货</div>
          <div v-if="3 === scope.row.orderStatus">交易完成</div>
          <div v-if="4 === scope.row.orderStatus">交易失败</div>
          <div v-if="5 === scope.row.orderStatus">已取消</div>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center">
        <template slot-scope="scope">
          <div v-if="1 === scope.row.orderSource">平台订单</div>
          <div v-if="2 === scope.row.orderSource">寄拍订单</div>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="scope">
          <!-- <div v-if="0 == scope.row.orderStatus"></div> -->
          <div v-if="0 != scope.row.orderStatus">{{ scope.row.isGiveIntegral*scope.row.transactionPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" align="center">
        <template slot-scope="scope">
          <div v-if="1 === scope.row.type">余额</div>
          <div v-if="2 === scope.row.type">微信</div>
          <div v-if="3 === scope.row.type">支付宝</div>
          <div v-if="4 === scope.row.type">积分</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="Theorderdetails(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList } from "@/api/table";
//分页控制
import Pagination from "@/components/Pagination";
//树形遍历列表
import { requestfile, exportBlob } from "@/api/blob";
import { getToken } from "@/utils/auth.js";
import qs from "qs";
import { orderlist,orderCountMoney } from "@/api/Theorderlist.js";
import { treeApi } from "@/api/AuctionsRecord.js";
import {
  goodsInfolist,
  downGoodsInfo,
  settingSort
} from "@/api/commoditymanagement.js";
import checkPermission from "@/utils/permission";
const shoppingStatus = [
  {
    value: 0,
    label: "待付款"
  },
  {
    value: 1,
    label: "待发货"
  },
  {
    value: 2,
    label: "待收货"
  },
  {
    value: 3,
    label: "交易完成"
  },
  {
    value: 4,
    label: "交易失败"
  }
];
const Sources = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 1,
    label: "平台"
  },
  {
    value: 2,
    label: "商城"
  }
];
const paymethod = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 1,
    label: "余额"
  },
  {
    value: 2,
    label: "微信"
  }
];
export default {
  name: "orderListTag",
  components: {
    Pagination
  },
  data() {
    return {
      //
      //调试
      activeIndex: "1",
      thistotal: 0,
      debuggers: {
        shoppingname: "",
        weight: "",
        id: ""
      },
      Informationfromtheshelves: "",
      //将来下架商品ID
      goodsId: "",
      Setweight: "",
      list: null,
      listLoading: true,
      props: {
        multiple: true
      },
      //商品来源
      Sources,
      // 订单状态
      shoppingStatus,
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      ProductionPrice: {
        buyerNamePhone: "",
        goodsNameId: "",
        orderId: "",
		auctionId: "",
        startCreateTime: "",
        endCreateTime: "",
        orderStatus: "",
        type: "",
        startTimeArrory: "",
        mobile: "",
        consignee: "",
        payTime: ""
      },
      //付款方式
      paymethod,
      //商品分类
      // 级联框
      Cascadebox: [],
      options: [],
      classifyvalue1: "",
      //商品分类
      test: [],
      classifyvalue2: "",
      excelList: [],
      sentGoodsErrorList: [],
      sentGoodsError: false,
      totalPrice:{}
    };
  },
  created() {
    const phone =
      this.$route.query && this.$route.query.phone
        ? this.$route.query.phone
        : null;
    if (phone) {
      this.ProductionPrice.mobile = phone;
    }
    this.getList();
    this.getCountMoney();
  },
  computed: {
    Fn: function(shopping) {
      let flag = "";
      this.Obj.some((item, index) => {
        if (item.name === shopping) {
          flag === item.value;
          return true;
        }
      });
      return flag;
    }
  },
  methods: {
    checkPermission,
    Theorderdetails(row) {
      this.$router.push(`/orderManagement/detail?orderId=${row.orderId}`);
    },
    // 搜索
    searchDingDan() {
      // 每次搜索页面置1
      this.listQuery.page = 1;
      if (this.ProductionPrice.startCreateTime == null) {
        this.ProductionPrice.startCreateTime = "";
      }
      if (this.ProductionPrice.startTimeArrory == null) {
        this.ProductionPrice.startTimeArrory = "";
      }
      if (this.ProductionPrice.payTime == null) {
        this.ProductionPrice.payTime = "";
      }
      this.getList();
      this.getCountMoney();
    },
    getCountMoney(){
      let Obj = this.dealWithRequestDate();
      orderCountMoney({
        ...Obj,
        orderStatus: this.orderlistStatus(this.activeIndex)
      }).then(res => {
        if (res.code == 0) {
          this.totalPrice = res.data
        }
      })
    },
    // 搜索条件重置
    resetDingDan() {
      for (var key in this.ProductionPrice) {
        this.ProductionPrice[key] = "";
      }
    },
    // 根据状态栏展示返回不同的状态
    orderlistStatus(value) {
      if (value == 1) {
        return "";
      } else if (value == 2) {
        return 0;
      } else if (value == 3) {
        return 1;
      } else if (value == 4) {
        return 2;
      } else if (value == 5) {
        return 3;
      } else if (value == 6) {
        return 4;
      } else if (value == 7) {
        return 5;
      }
    },
    // 状态栏切换
    handleSelect(value) {
      // 切换时页码置1
      this.listQuery.page = 1;
      this.activeIndex = value;
      this.ProductionPrice.startTimeArrory = "";
      let DataFlag = this.orderlistStatus(value);
      this.listLoading = true;
      let startCreateTime = this.ProductionPrice.startCreateTime[0];
      let endCreateTime = this.ProductionPrice.startCreateTime[1];
      let startTime = this.ProductionPrice.startTimeArrory[0];
      let endTime = this.ProductionPrice.startTimeArrory[1];
      let Obj = this.fliterfunc({
        ...this.ProductionPrice,
        startCreateTime,
        endCreateTime,
        startTime,
        endTime
      });
      orderlist({
        ...Obj,
        current: this.listQuery.page,
        size: this.listQuery.limit,
        orderStatus: this.orderlistStatus(value)
      }).then(res => {
        if (res.code == 0) {
          this.excelList = [];
          this.list = res.data.records;
          this.thistotal = Number(res.data.total);
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
      this.getCountMoney();
    },
    getList() {
      let Obj = this.dealWithRequestDate();
      orderlist({
        ...Obj,
        orderStatus: this.orderlistStatus(this.activeIndex)
      }).then(res => {
        if (res.code == 0) {
          this.list = res.data.records;
          this.total = Number(res.data.total);
          this.thistotal = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 所有请求参数处理
    dealWithRequestDate() {
      this.listLoading = true;
      let startCreateTime = this.ProductionPrice.startCreateTime[0];
      let endCreateTime = this.ProductionPrice.startCreateTime[1];
      let startTime = this.ProductionPrice.startTimeArrory[0];
      let endTime = this.ProductionPrice.startTimeArrory[1];
      let startPayTime = this.ProductionPrice.payTime[0];
      let endPayTime = this.ProductionPrice.payTime[1];
      let Obj = this.fliterfunc({
        ...this.ProductionPrice,
        startCreateTime,
        endCreateTime,
        startTime,
        endTime,
        startPayTime,
        endPayTime,
        current: this.listQuery.page,
        size: this.listQuery.limit
      });
      return Obj;
    },
    fliterfunc(Obj) {
      for (let key in Obj) {
        if (Obj[key]) {
          if (Object.prototype.toString.call(Obj[key]) == "[object String]") {
            if (Obj[key].indexOf("NaN") != -1) {
              delete Obj[key];
            } else {
              Obj[key] = Obj[key];
            }
          } else {
            Obj[key] = Obj[key];
          }
        } else {
          delete Obj[key];
        }
      }
      return Obj;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

#u9 {
  border-top: solid 1px #e6e6e6;
}

.Shopping {
  line-height: 37px;
}

.Setweight {
  display: flex;
}

.image {
  width: 40px;
  height: 40px;
}

.OrderTopFlex {
  display: flex;
  flex-wrap: wrap;
}

.ax_200 {
  margin: 12px 0;
  margin-left: 4px;
  display: flex;
}

.ax_200 span {
  line-height: 43px;
  font-size: 15px;
  color: #333;
  font-weight: 400;
}

.ax_200 span:nth-child(1) {
  width: 70px;
}

.search-content {
  display: block;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .item {
    display: inline-block;
    width: 30%;
    margin-bottom: 24px;
    margin-right: 1%;
    display: flex;
  }

  .item:first-child {
    width: 25%;
  }

  .item-title {
    font-size: 14px;
    line-height: 40px;
  }

  .item-picker {
    width: 300px;
  }

  .item-input {
    width: 220px;
    display: inline-block;
  }
}
</style>
