<template>
	<div class="orderList">
    <div class="orderList-search">
      <div class="item">
        <el-date-picker
          class="item-picker"
          v-model="createTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="item">
        <el-input class="item-input" v-model="goodsNameId" placeholder="请输入商品名称、ID"></el-input>
      </div>
	  <div class="item">
	    <el-input
	      class="item-input"
	      type="text"
	      v-model="mallNumber"
	      placeholder="请输入寄拍编号"
	    ></el-input>
	  </div><br/>
      <div class="item">
        <el-input
          class="item-input"
          type="text"
          v-model="orderId"
          placeholder="请输入订单编号"
          maxlength="19"
          show-word-limit
        ></el-input>
      </div>
	  <div class="item">
	    <el-select class="item-input" v-model="handleStatus" placeholder="请选择寄拍状态">
	      <el-option
	        v-for="item in handleType"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value"
	      ></el-option>
	    </el-select>
	  </div>
	 <div class="item">
	   <el-input class="item-input" v-model="buyerNamePhone" placeholder="请输入买家姓名或手机号"></el-input>
	 </div>
      <div class="item">
        <el-input class="item-input" v-model="consignee" placeholder="请输入收货人姓名"></el-input>
      </div>
      <div class="item">
        <el-input class="item-input" v-model="mobile" placeholder="请输入收货人手机号"></el-input>
      </div>
      <div class="item">
        <el-button class="item-btn" type="primary" @click="search">搜索</el-button>
        <el-button class="item-btn" type="primary" @click="rest">重置</el-button>
        <el-button class="item-btn" type="primary" @click="exportToExcel">导出</el-button>
        <el-button type='text'>订单数：{{totalPrice.mallCount}} 积分：{{ totalPrice.integral }}</el-button>
      </div>
    </div>
    <div class>
      <el-menu
        :default-active="activeIndex"
        id="u9"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        style="margin-bottom: 20px;"
      >
        <el-menu-item index="8">
          全部
          <span v-if="activeIndex == 8">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="0" >
          待接拍
          <span v-if="activeIndex == 0">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="1">
          待寄拍
          <span v-if="activeIndex == 1">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="2">
          已上拍
          <span v-if="activeIndex == 2">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="3">
          已拍下
          <span v-if="activeIndex == 3">({{total}})</span>
        </el-menu-item>
        <el-menu-item  index="5">
          已付款
          <span v-if="activeIndex == 5">({{total}})</span>
        </el-menu-item>
		<el-menu-item  index="6">
		  已发货
		  <span v-if="activeIndex == 6">({{total}})</span>
		</el-menu-item>
		<el-menu-item  index="7">
		  交易完成
		  <span v-if="activeIndex == 7">({{total}})</span>
		</el-menu-item>
		<el-menu-item index="4" >
		  交易失败
		  <span v-if="activeIndex == 4">({{total}})</span>
		</el-menu-item>
      </el-menu>
    </div>
    <div class="tableList">
      <el-table :data="list" border class="list" style="width: 100%" max-height="550">
        <el-table-column prop="createTime" align="center" label="下单时间"></el-table-column>
        <el-table-column prop="orderId" align="center" label="寄拍订单号"></el-table-column>
        <el-table-column prop="auctionId" align="center" label="竞拍id"></el-table-column>
        <el-table-column prop="nick" align="center" label="商品信息" width="260px">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div class="info-left">
                <img class="info-img" :src="scope.row.logo" />
              </div>
              <div class="info-right">
                <div class="goods_name">{{scope.row.goodsName}}</div>
                <div>{{scope.row.goodsId}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" align="center" label="用户/手机号">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <span class>{{scope.row.userName}}/{{scope.row.phone}}</span>
              <!-- <div class>{{scope.row.phone}}</div> -->
            </div>
          </template>
        </el-table-column>
		 <el-table-column prop="mallNumber" align="center" label="寄拍编号"></el-table-column>
        <!-- <el-table-column prop="totalPrice" align="center" label="总价格"></el-table-column> -->
        <el-table-column prop="startPrice" align="center" label="起拍价"></el-table-column>
        <el-table-column prop="limitPrice" align="center" label="限高价"></el-table-column>
        <el-table-column prop="transactionPrice" align="center" label="成交价"></el-table-column>
        <el-table-column prop="totalIntegral" align="center" label="消耗积分"></el-table-column>
        <el-table-column prop="income" align="center" label="用户收入"></el-table-column>
        <el-table-column prop="fee" align="center" label="手续费"></el-table-column>
        <el-table-column prop="mallStatus" align="center" label="订单状态">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div
                style="text-align: center"
              >{{scope.row.mallStatus === 0? '待接拍':scope.row.mallStatus === 1?'待寄拍':scope.row.mallStatus === 2?'已上拍':scope.row.mallStatus === 3?'已拍下':scope.row.mallStatus === 4?'未付款':scope.row.mallStatus === 5?'已付款':scope.row.mallStatus === 6?'已发货 ':scope.row.mallStatus === 7?'交易完成':scope.row.mallStatus === 99?'已撤销':scope.row.mallStatus === 98?'重新申请寄拍':''}}</div>
            </div>
          </template>
        </el-table-column>
		<el-table-column prop="mallStatus" align="center" label="处理状态/操作人">
		  <template slot-scope="scope">
		    <div class="goodsInfo">
		      <div
		        style="text-align: center"
		      >{{scope.row.handleStatus === 0? '未处理':'已处理'}}{{scope.row.handleBy?'/'+scope.row.handleBy:''}}</div>
		    </div>
		  </template>
		</el-table-column>
        <el-table-column
          prop="orderType"
          align="center"
          label="寄拍状态"
          v-if="activeIndex == 1 "
        >
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div
                style="text-align: center"
              >{{scope.row.orderType === 1? '待接拍':scope.row.orderType === 2?'寄拍中':scope.row.orderType === 3?'寄拍成功':scope.row.orderType === 4?'寄拍失败':scope.row.orderType === 5?'拒绝寄拍': ''}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" align="center" label="处理时间">
          <template slot-scope="scope">
            <div>{{scope.row.handleTime}}</div>
          </template>
        </el-table-column>
		<el-table-column prop="payDate" align="center" label="买家付款时间">
		  <template slot-scope="scope">
		    <div>{{scope.row.payDate}}</div>
		  </template>
		</el-table-column>
		<el-table-column prop="upTime" align="center" label="上拍时间">
		  <template slot-scope="scope">
		    <div>{{scope.row.upTime}}</div>
		  </template>
		</el-table-column>
		<el-table-column prop="successTime" align="center" label="完成时间">
		  <template slot-scope="scope">
		    <div>{{scope.row.successTime}}</div>
		  </template>
		</el-table-column>
		<el-table-column prop="successTime" align="center" label="上拍次数">
		  <template slot-scope="scope">
		    <div>{{scope.row.times}}/3</div>
		  </template>
		</el-table-column>
        <el-table-column prop="costPrice" align="center" label="成本价"></el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="lookOrder(scope.row)">查看订单</span>
			  <span class="table-btn btn-blue" v-if="scope.row.handleStatus == 0&& (scope.row.mallStatus == 5 || scope.row.mallStatus == 6 || scope.row.mallStatus == 7)"
			   @click="handleOrder(scope.row)">处理订单</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.mallStatus == 0 && scope.row.orderType == 1 && checkPermission(['mall:mallOrder:acceptGoods'])"
                @click="deliver(scope.$index,scope.row)"
              >接拍</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.mallStatus == 1 && (scope.row.orderType == 0 || scope.row.orderType == 4 || scope.row.orderType == 5) && checkPermission(['mall:mallGoods:sendGoods'])"
                @click="receiveGoods(scope.$index,scope.row)"
              >发货</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="发货" :visible.sync="receive" width="30%" :before-close="closeLogistics">
      <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="dialog-item-label">物流公司：</span>
          <div class="dialog-item-value">
            <el-select class="item-input" v-model="carrierId" placeholder="请选择物流公司">
              <el-option
                v-for="item in companyArry"
                :key="item.carrierId"
                :label="item.name"
                :value="item.carrierId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="dialog-item">
          <span class="dialog-item-label">物流单号：</span>
          <div class="dialog-item-value">
            <el-input class="item-input" v-model="logisticsNo" placeholder="请输入订单编号"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLogistics">取 消</el-button>
        <el-button type="primary" @click="submitLogistics">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="是否确认接拍？" :visible.sync="deliverGoods" width="30%" :before-close="closeReceive">
      <!-- <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="dialog-item-label">商品名称：</span>
          <span class="dialog-item-value">{{orderRow.goodsName}}</span>
        </div>
      <div class="dialog-item">
          <span class="dialog-item-label">商品分类：</span>
          <div class>
            <el-cascader placeholder="请选择商品分类" :options="categoryArry" v-model="categoryId"></el-cascader>
          </div>
        </div>
        <div class="dialog-item">
          <span class="dialog-item-label">是否接拍：</span>
          <div class="dialog-item-value">
            <el-radio v-model="applyStatus" label="2">接拍</el-radio>
            <el-radio v-model="applyStatus" label="5">拒绝接拍</el-radio>
          </div>
        </div>
        <div class="dialog-item" v-if="applyStatus == 5">
          <span class="dialog-item-label">拒绝原因：</span>
          <div class="dialog-item-value">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="reasonRemark"></el-input>
          </div>
        </div>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReceive">取 消</el-button>
        <el-button type="primary" @click="confirmReceive">确 定</el-button>
      </span>
    </el-dialog>
	<el-dialog title="处理订单" :visible.sync="handleOrderVisible" width="30%" :before-close="closeHandleOrder">
	  <div class="dialog-orderMall">
	    <div class="dialog-item">
	      <span class="dialog-item-value">是否确认处理该订单？</span>
	    </div>
		<div class="dialog-item">
		  <span class="dialog-item-label">订单编号：</span>
		  <span class="dialog-item-value">{{orderRow.orderId}}</span>
		</div>
	  </div>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closeHandleOrder">取 消</el-button>
	    <el-button type="primary" @click="confirmHandleOrder">确 定</el-button>
	  </span>
	</el-dialog>
	
    <!-- 批量发货错误返回信息 -->
    <el-dialog title="发货失败列表" :visible.sync="sentGoodsError" style="width:100%; margin-left:50px;">
      <div
        style="margin-bottom:10px;"
      >成功：{{ sentGoodsErrorList.successCount }};失败：{{ sentGoodsErrorList.failCount }}</div>
      <el-table
        key="sentGoods"
        :data="sentGoodsErrorList.list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="订单ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="快递名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.logisticsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="快递编码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.logisticsCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.logisticsNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="错误原因" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fallReasons }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sentGoodsError = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { carrierlist } from "@/api/orderdetails.js";
import { treeApi } from "@/api/AuctionsRecord.js";
import {
  orderListMall,
  orderListAuction,
  acceptAuctionByNumber,
  acceptAuctionMall,
  deliverGoodsMall,
  mallCountMoneyApi,
  auctionCountMoneyApi,
  handleMallOrder
} from "@/api/mallManagement";
import checkPermission from "@/utils/permission";
import { requestfile, exportBlobExcel } from "@/api/blob";
export default {
  name: "auctionOrderList",
  data() {
    return {
      receive: false,
      deliverGoods: false,
	  handleOrderVisible: false,
      companyArry: [],
      categoryArry: [],
      categoryId: "",
      applyStatus: "2",
      reasonRemark: "",
      orderRow: "",
      logisticsNo: "",
      carrierId: "",
      parentIndex: "1",
      activeIndex: "8",
      consignee: "",
      mobile: "",
      size: 10,
      list: [],
      current: 1,
	  handleStatus:"",
      total: 0,
      goodsNameId: "",
      orderId: "",
	  mallNumber:"",
      mallStatus: "",
      orderType: "",
      buyerNamePhone: "",
      type: undefined,
      createTime: "",
      payTime: "",
      CompleteTime: "",
      ReceivingGoodsTime: "",
      handleType: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未处理",
          value: 0
        },
        {
          label: "已处理",
          value: 1
        }
      ],
      payArry: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "余额",
          value: 1
        },
        {
          label: "微信",
          value: 2
        },
        {
          label: "积分",
          value: 4
        },
        {
          label: "支付宝",
          value: 3
        }
      ],
      Props: {
        value: "value",
        label: "label",
        children: "children"
      },
      sentGoodsErrorList: [],
      sentGoodsError: false,
      orderIndex: "",
      totalPrice:{}
    };
  },
  created() {
    this.getOrderList();
    this.logisticsCompany();
    this.getAllGoodsCategory();
    this.getCountMoney();
  },
  methods: {
    /**
     * 导出excel
     */
    checkPermission,
    exportToExcel() {
      let that = this;
      let times = 0;
      let url = "management/mallOrder/excel";
      if (this.createTime) {
        if (
          new Date(this.createTime[1]).getTime() -
            new Date(this.createTime[0]).getTime() >
          30 * 24 * 60 * 60 * 1000
        ) {
          this.$message.error("只能导一个月内的数据");
          return;
        } else {
          times += 1;
          url = "management/mallOrder/excel";
        }
      }
      if (this.payTime) {
        if (
          new Date(this.payTime[1]).getTime() -
            new Date(this.payTime[0]).getTime() >
          30 * 24 * 60 * 60 * 1000
        ) {
          this.$message.error("只能导一个月内的数据");
          return;
        } else {
          times += 1;
          url = "management/mallOrder/excel";
        }
      }
      if (this.CompleteTime) {
        if (
          new Date(this.CompleteTime[1]).getTime() -
            new Date(this.CompleteTime[0]).getTime() >
          30 * 24 * 60 * 60 * 1000
        ) {
          this.$message.error("只能导一个月内的数据");
          return;
        } else {
          times += 1;
          url = "management/mallOrder/excel";
        }
      }
      if (this.ReceivingGoodsTime) {
        if (
          new Date(this.ReceivingGoodsTime[1]).getTime() -
            new Date(this.ReceivingGoodsTime[0]).getTime() >
          30 * 24 * 60 * 60 * 1000
        ) {
          this.$message.error("只能导一个月内的数据");
          return;
        } else {
          times += 1;
          url =
            "management/mallOrder/excel";
        }
      }
      if (times == 0) {
        this.$message.error("请选择导出订单时间");
        return;
      }
      let data = {
        goodsType: that.parentIndex,
        goodsNameId: that.goodsNameId,
        orderId: that.orderId,
        mallStatus: that.mallStatus,
        orderType: that.orderType,
        buyerNamePhone: that.buyerNamePhone,
        type: that.type,
        startTime: that.createTime ? that.createTime[0] : undefined,
        endTime: that.createTime ? that.createTime[1] : undefined,
        startPayTime: that.payTime ? that.payTime[0] : undefined,
        endPayTime: that.payTime ? that.payTime[1] : undefined,
        startCompleteTime: that.CompleteTime ? that.CompleteTime[0] : undefined,
        endCompleteTime: that.CompleteTime ? that.CompleteTime[1] : undefined,
        startReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[0]
          : undefined,
        endReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[1]
          : undefined,
        consignee: that.consignee,
        mobile: that.mobile
	  };
	  let datas = JSON.parse(JSON.stringify(data));
      exportBlobExcel(url, datas).then(res => {
        console.log(res, "res");
        const data = res.data;
        const a = document.createElement("a");
        const blob = new Blob([data]);
        const blobUrl = window.URL.createObjectURL(blob);
        a.style.display = "none";
        a.download = "会员寄拍订单.xls";
        a.href = blobUrl;
        a.click();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /**
     *
     */
    handleClick() {
      this.ReceivingGoodsTime = undefined;
      this.CompleteTime = undefined;
      this.activeIndex = "8";
      this.mallStatus = "";
      this.getOrderList();
      this.getCountMoney();
    },
    /**
     * 查看物流公司
     */
    logisticsCompany() {
      let that = this;
      carrierlist().then(res => {
        if (res.code == 0) {
          that.companyArry = res.data;
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    /**
     * 订单状态切换
     */
    handleSelect(val) {
      let that = this;
      if (val == "8") {
        that.activeIndex = val;
        that.mallStatus = "";
      } else {
        that.activeIndex = val;
        that.mallStatus = val;
      }
      if (this.activeIndex == 0 || this.activeIndex == 8) {
        this.payTime = undefined;
        this.CompleteTime = undefined;
        this.ReceivingGoodsTime = undefined;
      } else if (this.activeIndex == 1 || this.activeIndex == 2) {
        this.CompleteTime = undefined;
        this.ReceivingGoodsTime = undefined;
      }
      that.getOrderList();
      this.getCountMoney();
    },
    //获取商品分类
    getAllGoodsCategory() {
      let that = this;
      let data = {
        type: 1
      };
      treeApi(data).then(res => {
        if (res.code == 0) {
          let datas = res.data;
          that.categoryArry = res.data;
          let categoryArry = [];
          if (datas.length > 0) {
            datas.forEach((ele, index) => {
              if (ele.subCategorys.length > 0) {
                let subCategorys = ele.subCategorys;
                let children = [];
                categoryArry.push({
                  value: ele.categoryId,
                  label: ele.name,
                  children: children
                });
                subCategorys.forEach(item => {
                  children.push({
                    value: item.categoryId,
                    label: item.name
                  });
                });
              } else {
                categoryArry.push({
                  value: ele.categoryId,
                  label: ele.name,
                  disabled: true
                });
              }
            });
            that.categoryArry = categoryArry;
          }
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    /**
     * 订单列表
     */
    getOrderList() {
      let that = this;
      that.list = [];
      let data = {
        goodsType: that.parentIndex,
        goodsNameId: that.goodsNameId,
        orderId: that.orderId,
		mallNumber: that.mallNumber,
        mallStatus: that.mallStatus,
        orderType: that.orderType,
		handleStatus: that.handleStatus,
        buyerNamePhone: that.buyerNamePhone,
        type: that.type,
        startTime: that.createTime ? that.createTime[0] : undefined,
        endTime: that.createTime ? that.createTime[1] : undefined,
        startPayTime: that.payTime ? that.payTime[0] : undefined,
        endPayTime: that.payTime ? that.payTime[1] : undefined,
        startCompleteTime: that.CompleteTime ? that.CompleteTime[0] : undefined,
        endCompleteTime: that.CompleteTime ? that.CompleteTime[1] : undefined,
        startReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[0]
          : undefined,
        endReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[1]
          : undefined,
        size: that.size,
        current: that.current,
        consignee: that.consignee,
        mobile: that.mobile
      };
      orderListAuction(data).then(res => {
        if (res.code == 0) {
          that.list = res.data.records;
          that.total = Number(res.data.total);
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //搜索
    search() {
      this.current = 1;
      this.getOrderList();
      this.getCountMoney();
    },
    getCountMoney(){
      let that = this;
      let data = {
        goodsType: that.parentIndex,
        goodsNameId: that.goodsNameId,
        orderId: that.orderId,
        mallStatus: that.mallStatus,
        orderType: that.orderType,
        buyerNamePhone: that.buyerNamePhone,
        type: that.type,
        startTime: that.createTime ? that.createTime[0] : undefined,
        endTime: that.createTime ? that.createTime[1] : undefined,
        startPayTime: that.payTime ? that.payTime[0] : undefined,
        endPayTime: that.payTime ? that.payTime[1] : undefined,
        startCompleteTime: that.CompleteTime ? that.CompleteTime[0] : undefined,
        endCompleteTime: that.CompleteTime ? that.CompleteTime[1] : undefined,
        startReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[0]
          : undefined,
        endReceivingGoodsTime: that.ReceivingGoodsTime
          ? that.ReceivingGoodsTime[1]
          : undefined,
        size: that.size,
        current: that.current,
        consignee: that.consignee,
        mobile: that.mobile
      };
        auctionCountMoneyApi(data).then(res=>{
          this.totalPrice = res.data;
        })
    },
    //重置
    rest() {
      this.createTime = "";
      this.payTime = "";
      this.CompleteTime ="";
      this.ReceivingGoodsTime ="";
      this.goodsNameId = "";
      this.orderId = "";
	  this.mallNumber = "";
      this.type = undefined;
      this.buyerNamePhone = "";
      this.orderType = "";
	  this.handleStatus = "",
      this.consignee ="";
      this.mobile ="";
      // this.startPayTime = "";
      // this.endPayTime = "";
      this.current = 1;
      this.getOrderList();
    },
    // 分页
    handleCurrentChange(val) {
      this.current = val;
      this.getOrderList();
    },
    //选择一页条数
    handleSizeChange(val) {
      this.size = val;
      this.getOrderList();
    },
    /**
     * 查看订单详情
     */
    lookOrder(row) {
      let that = this;
      that.$router.push({
        path: "/mallManagement/auctionOrderDetail",
        query: {
          orderId: row.orderId,
          parentIndexType:this.parentIndex
        }
      });
    },
    /**
     * 发货
     */
    receiveGoods(index, row) {
      let that = this;
      that.orderRow = row;
      that.orderIndex = index;
      that.receive = true;
    },
    closeLogistics() {
      let that = this;
      that.receive = false;
      that.orderRow = "";
      that.orderIndex = "";
    },
    submitLogistics() {
      let that = this;
      that.receive = false;
      let data = {
        orderId: that.orderRow.orderId,
        logisticsNo: that.logisticsNo,
        carrierId: that.carrierId,
        type: 1
      };
      deliverGoodsMall(data).then(res => {
        if (res.code == 0) {
          that.$message({
            message: "发货成功！",
            type: "success"
          });
          that.logisticsNo = "";
          that.carrierId = "";
          that.list[that.orderIndex].orderType = 2;
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    /**
     * 接拍
     */
    deliver(index, row) {
      let that = this;
      that.orderRow = row;
      that.orderIndex = index;
      that.deliverGoods = true;
	  that.categoryId = row.categoryId;
	  console.log(row,that.categoryId)
    },
    closeReceive() {
      let that = this;
      that.deliverGoods = false;
      that.categoryId = "";
      that.orderType = "";
      that.reasonRemark = "";
      that.orderRow = "";
      that.orderIndex = "";
    },
	handleOrder(row) {
	  let that = this;
	  that.orderRow = row;
	  that.handleOrderVisible = true;
	},
	closeHandleOrder() {
	  let that = this;
	  that.handleOrderVisible = false;
	  that.orderRow = "";
	},
    getFile(file) {
      let formDate = new FormData();
      formDate.append("multipartFile", file.raw);
      requestfile(
        "upms/mallOrder/batchDeliverGoods",
        formDate
      ).then(resp => {
        if (resp.code == 0) {
          this.$message({
            message: "批量发货成功" + resp.data + "条",
            type: "success"
          });
        } else if (resp.code == 1) {
          this.sentGoodsError = true;
          this.sentGoodsErrorList = resp.data;
        } else {
          this.$message({
            message: resp.msg,
            type: "error"
          });
        }
      });
    },
	confirmHandleOrder(){
      let that = this;
      that.handleOrderVisible = false;
      let data = {
        orderId: that.orderRow.orderId,
      };
      handleMallOrder(data).then(res => {
        if (res.code == 0) {
			that.$message({
			  message: "处理成功！",
			  type: "success"
			});
			 this.getOrderList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    confirmReceive() {
      let that = this;
      // if (that.categoryId == "") {
      //   that.$message({
      //     message: "请选择商品分类!",
      //     type: "error"
      //   });
      //   return;
      // }
	  // console.log(that.categoryId)
	  // return
      if (that.applyStatus == "") {
        that.$message({
          message: "请选择是否接拍!",
          type: "error"
        });
        return;
      }
      // that.categoryId = that.categoryId[that.categoryId.length - 1];
      that.deliverGoods = false;
      let data = {
        orderId: that.orderRow.orderId,
        reasonRemark: that.reasonRemark,
        categoryId: that.categoryId,
        orderType: that.applyStatus
      };
      acceptAuctionByNumber(data).then(res => {
        if (res.code == 0) {
          if (that.applyStatus == 2) {
            that.$message({
              message: "接受接拍成功！",
              type: "success"
            });
          } else {
            that.$message({
              message: "拒绝接拍成功！",
              type: "success"
            });
          }
          that.categoryId = "";
          that.orderType = "";
          that.reasonRemark = "";
          that.list[that.orderIndex].orderType = 2;
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.orderList {
  margin: 24px;
  .orderList-maill {
    margin-bottom: 24px;
  }
  .orderList-search {
    .item {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 25px;
      .item-upload {
        display: inline-block;
        width: 60px;
      }
    }
  }
  .tableList {
    .list {
      margin-bottom: 24px;
      .goodsInfo {
        display: flex;
        align-items: center;
        .info-left {
          .info-img {
            height: 50px;
            width: 50px;
          }
          margin-right: 10px;
        }
        .info-right {
          text-align: left;
          .goods_name {
            width: 100%;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
        }
      }
    }
    .table-paging {
      display: flex;
      justify-content: flex-end;
    }
  }
  .dialog-orderMall {
    .dialog-item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .dialog-item-label {
        width: 100px;
        display: inline-block;
        font-size: 14px;
      }
      .dialog-item-value {
        width: 260px;
        display: inline-block;
      }
    }
  }
  .table-btn {
    cursor: pointer;
  }
  .btn-blue {
    color: #409eff;
  }
}
</style>
