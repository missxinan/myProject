<template>
  <div class="mallOrderDetail">
    <div class="order-info">
      <div class="info-title">
        <span class="title-line"></span>
        <span class="title-text">订单详情</span>
      </div>
      <div class="info-content">
        <div class="order-status">
          <div class="order-id">订单编号：{{orderDetail.orderId}}</div>
          <div class="order-status">
            <div>订单状态：</div>
            <div v-if="orderDetail.orderStatus === 0">待付款</div>
            <div
              v-if="orderDetail.orderStatus === 1"
            >{{orderDetail.orderType === 0? '待发货':orderDetail.orderType === 1?'待接拍':orderDetail.orderType === 2?'寄拍中':'寄拍审核不通过'}}</div>
            <div v-if="orderDetail.orderStatus === 2">待收货</div>
            <div
              v-if="orderDetail.orderStatus === 3"
            >{{orderDetail.orderType === 3? '寄拍成功': '交易完成'}}</div>
            <div v-if="orderDetail.orderStatus === 4">交易失败</div>
          </div>
        </div>
        <div class="order-time">
          <div v-if="orderDetail.orderStatus === 0">
            <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
          </div>
          <div v-if="orderDetail.orderStatus === 1">
            <div v-if="orderDetail.orderType === 0">
              <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
              <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
            </div>
            <div v-if="orderDetail.orderType === 1">
              <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
              <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
              <div class="item-time">申请时间：{{orderDetail.applyTime}}</div>
            </div>
            <div v-if="orderDetail.orderType === 2">
              <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
              <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
              <div class="item-time">申请时间：{{orderDetail.applyTime}}</div>
              <div class="item-times">接拍时间：{{orderDetail.acceptTime}}</div>
            </div>
          </div>
          <div v-if="orderDetail.orderStatus === 2">
            <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
            <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
            <div class="item-time">发货时间：{{orderDetail.deliverTime}}</div>
            <div
              class="item-times"
            >快递公司（单号）：{{orderDetail.logisticsName}} ({{orderDetail.logisticsNo}})</div>
          </div>
          <div v-if="orderDetail.orderStatus === 3">
            <div v-if="orderDetail.orderType === 3">
              <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
              <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
              <div class="item-time">申请时间：{{orderDetail.applyTime}}</div>
              <div class="item-times">接拍时间：{{orderDetail.acceptTime}}</div>
              <div class="item-time">完成时间：{{orderDetail.updateTime}}</div>
            </div>
            <div v-else>
              <div class="item-time">下单时间：{{orderDetail.createTime}}</div>
              <div class="item-times">付款时间：{{orderDetail.payTime}}</div>
              <div class="item-time">发货时间：{{orderDetail.deliverTime}}</div>
              <div
                class="item-times"
              >快递公司（单号）：{{orderDetail.logisticsName}} ({{orderDetail.logisticsNo}})</div>
              <div class="item-time">完成时间：{{orderDetail.updateTime}}</div>
            </div>
          </div>
          <div v-if="orderDetail.orderStatus === 4">交易失败</div>
        </div>
        <div class="tablist">
          <el-table :data="goodsDetail" border class="list" style="width: 100%">
            <el-table-column prop="goodsId" align="center" label="商品编号"></el-table-column>
            <el-table-column prop="goodsName" align="center" label="商品名称">
              <template slot-scope="scope">
                <div class="goodsInfo">
                  <div class="info-left">
                    <img class="info-img" style="height:50px;width:50px" :src="scope.row.logo" />
                  </div>
                  <div>{{scope.row.goodsName}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="num" align="center" label="数量"></el-table-column>
            <el-table-column prop="totalPrice" align="center" label="总价格"></el-table-column>
            <el-table-column prop="totalIntegral" align="center" label="总积分"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div
      class="user-Info"
      v-if="(orderDetail.orderStatus === 1 && orderDetail.orderType === 1 ) || (orderDetail.orderStatus === 1 && orderDetail.orderType === 2 ) || (orderDetail.orderStatus === 3 && orderDetail.orderType === 3 )"
    >
      <div class="info-title">
        <span class="title-line"></span>
        <span class="title-text">寄拍用户信息</span>
      </div>
      <div class="info-content">
        <div class="users">
          <div class="users-left">
            <img class="users-img" :src="orderDetail.avatar" />
          </div>
          <div class="users-right">
            <div class="users-name">{{orderDetail.userName}}</div>
            <div class="users-phone">{{orderDetail.phone}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- v-if="(this.parentIndexType == 4 || integralType == 2) && orderDetail.orderStatus != 0" -->
    <div class="buyer-info" v-if="(this.parentIndexType == 4 || integralType == 2) && orderDetail.orderStatus != 0">
      <div class="info-title">
        <span class="title-line"></span>
        <span class="title-text">拍卖订单</span>
      </div>
      <div>
        <!-- <div>
          <span style="margin-right:20px">积分：{{auctionDetail.integralRatio}}</span>
          <span>超值积分：{{auctionDetail.worthRatio}}</span>
        </div> -->
        <!-- <div style="margin-top:20px">赠送商品：</div> -->
        <el-table border class="list" style="width: 100%;margin:20px 0;" :data="auctionGoodsDetail">
          <el-table-column prop="orderId" align="center" label="订单编号"></el-table-column>
          <el-table-column prop="goodsName" align="center" label="商品名称">
            <template slot-scope="scope">
              <div class="goodsInfo_wrap">
                <div class="goodsImg_wrap">
                  <img class="goods_image" :src="scope.row.logo" />
                </div>
                <div class="goods_right">
                  <span class="goods_name">{{ scope.row.goodsName }}</span>
                  <span>{{ scope.row.goodsId }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="transactionPrice" align="center" label="成交价"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span
                @click="seeToMallDetail(scope.row.orderId)"
                style="color: #0066cc;
  cursor: pointer;"
              >查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="buyer-info">
      <div class="info-title">
        <span class="title-line"></span>
        <span class="title-text">买家收货信息</span>
      </div>
      <div class="info-content">
        <div class="addressee">
          <span class="addressee-text">收件人：</span>
          <span class="addressee-name">{{orderDetail.consignee}}</span>
          <span class="addressee-phone">{{orderDetail.mobile}}</span>
        </div>
        <div class="address">
          <span class="address-text">收件地址：</span>
          <span class="address-value">{{orderDetail.address}}</span>
        </div>
        <div class="remark">
          <span class="remark-text">买家留言：</span>
          <span class="remark-value">{{orderDetail.remark}}</span>
        </div>
        <div class="remark">
          <span class="remark-text">卖家备注：</span>
          <span class="remark-value">{{remark}}</span>
        </div>
      </div>
    </div>
    <div class="order-btn">
      <!-- <el-button
        class="item-btn"
        v-if="orderDetail.orderStatus === 1 && orderDetail.orderType === 1 && checkPermission(['mall:mallOrder:acceptGoods'])"
        type="primary"
        @click="receiveGoods"
      >接拍</el-button> -->
      <el-button
        class="item-btn"
        v-if="orderDetail.orderStatus === 1 || orderDetail.orderStatus === 2 && checkPermission(['mall:mallOrder:changeRemark'])"
        type="primary"
        @click="editRemark"
      >修改备注</el-button>
      <el-button
        class="item-btn"
        v-if="orderDetail.orderType === 1 || orderDetail.orderType === 2 || orderDetail.orderType === 3"
        type="primary"
        @click="seecontract"
      >查看合同</el-button>
      <el-button
        class="item-btn"
        v-if="orderDetail.orderStatus === 1 && (orderDetail.orderType === 0 || orderDetail.orderType === 4 || orderDetail.orderType === 5) && checkPermission(['mall:mallOrder:sendGoods'])"
        type="primary"
        @click="deliver"
      >发货</el-button>
    </div>
    <el-dialog title="发货" :visible.sync="deliverGoods" width="30%" :before-close="closeLogistics">
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
    <el-dialog title="修改备注" :visible.sync="showRemark" width="30%" :before-close="closeRemark">
      <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="dialog-item-label">备注：</span>
          <div class="dialog-item-value">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="remarks"
              maxlength="50"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRemark">取 消</el-button>
        <el-button type="primary" @click="submitRemark">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="接拍" :visible.sync="receive" width="30%" :before-close="closeReceive">
      <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="dialog-item-label">商品名称：</span>
          <span class="dialog-item-value">{{orderDetail.goodsName}}</span>
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
        <div class="dialog-item">
          <span class="dialog-item-label">拒绝原因：</span>
          <div class="dialog-item-value">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="reasonRemark"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReceive">取 消</el-button>
        <el-button type="primary" @click="confirmReceive">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { carrierlist } from "@/api/orderdetails.js";
import { treeApi } from "@/api/AuctionsRecord.js";
import {
  orderDetailMall,
  acceptAuctionMall,
  deliverGoodsMall,
  editRemarkMall
} from "@/api/mallManagement";
import checkPermission from "@/utils/permission";
export default {
  name: "mallOrderDetail",
  data() {
    return {
      orderId: "",
      receive: false,
      deliverGoods: false,
      showRemark: false,
      companyArry: [],
      categoryArry: [],
      categoryId: "",
      applyStatus: "",
      reasonRemark: "",
      logisticsNo: "",
      carrierId: "",
      orderDetail: "",
      auctionDetail: "",
      goodsDetail: [],
      parentIndexType:"",
      auctionGoodsDetail: [],
      integralType: "",
      remark: "",
      remarks: "",
      Props: {
        value: "value",
        label: "label",
        children: "children"
      }
    };
  },
  created() {
    let orderId = this.$route.query.orderId;
    this.parentIndexType = this.$route.query.parentIndexType;
    // console.log(this.parentIndexType,'我是parentIndexType')
    // console.log(orderId,'我是orderId')
    this.orderId = orderId;
    this.logisticsCompany();
    this.getMallOrder();
  },
   watch: {
      $route(to, from) {
      let orderId = this.$route.query.orderId;
      this.parentIndexType = this.$route.query.parentIndexType;
      // console.log(this.parentIndexType,'我是parentIndexType')
      // console.log(orderId,'我是orderId')
      this.orderId = orderId;
	  if(this.orderId ){
		  this.logisticsCompany();
		  this.getMallOrder();
	  }
      }
    },
  methods: {
    checkPermission,
    /**
     * 订单详情
     */
    getMallOrder() {
      let that = this;
      let datas = {
        orderId: that.orderId
      };
      that.goodsDetail = [];
      that.auctionGoodsDetail = [];
      orderDetailMall(datas).then(res => {
        if (res.code == 0) {
          that.orderDetail = res.data.order;
          that.remark = res.data.order.sellerRemark;
          that.goodsDetail.push(res.data.order);
          //获取到auctionOrder里面的值
          that.auctionDetail = res.data.auctionOrder;
          if(res.data.auctionOrder && res.data.auctionOrder.integralType){
            that.integralType = res.data.auctionOrder.integralType;
          }
          that.auctionGoodsDetail.push(res.data.auctionOrder);
        //   console.log(that.auctionGoodsDetail, "我是新加的");
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
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
    seeToMallDetail(orderId) {
      // debugger
     this.$router.push({
        path: "/orderManagement/detail",
        query: { orderId, parentIndexType: this.parentIndexType }
      });
    },
    
    /**
     * 查看合同
     */
    seecontract() {
      let url = this.orderDetail.contractUrl;
      window.open(url, "_blank");
    },
    /**
     * 修改备注
     */
    editRemark() {
      let that = this;
      that.showRemark = true;
    },
    closeRemark() {
      let that = this;
      that.showRemark = false;
      that.remarks = "";
    },
    submitRemark() {
      let that = this;
      that.showRemark = false;
      let data = {
        orderId: that.orderId,
        remark: that.remarks
      };
      editRemarkMall(data).then(res => {
        if (res.code == 0) {
          that.$message({
            message: "修改备注成功！",
            type: "success"
          });
          that.getMallOrder();
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
    receiveGoods() {
      let that = this;
      that.receive = true;
    },
    closeReceive() {
      let that = this;
      that.receive = false;
      that.categoryId = "";
      that.orderType = "";
      that.reasonRemark = "";
    },
    confirmReceive() {
      let that = this;
      if (that.categoryId == "") {
        that.$message({
          message: "请选择商品分类!",
          type: "error"
        });
        return;
      }
      if (that.applyStatus == "") {
        that.$message({
          message: "请选择是否接拍!",
          type: "error"
        });
        return;
      }
      that.receive = false;
      that.categoryId = that.categoryId[that.categoryId.length - 1];
      let data = {
        orderId: that.orderId,
        reasonRemark: that.reasonRemark,
        categoryId: that.categoryId,
        orderType: that.applyStatus
      };
      acceptAuctionMall(data).then(res => {
        if (res.code == 0) {
          that.$message({
            message: "接拍成功！",
            type: "success"
          });
          that.categoryId = "";
          that.orderType = "";
          that.reasonRemark = "";
          that.getMallOrder();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    /**
     * 发货
     */
    deliver() {
      let that = this;
      that.deliverGoods = true;
    },
    closeLogistics() {
      let that = this;
      that.deliverGoods = false;
    },
    submitLogistics() {
      let that = this;
      that.deliverGoods = false;
      let data = {
        orderId: that.orderId,
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
          that.getMallOrder();
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
.mallOrderDetail {
  margin: 24px;
  .order-info {
    .info-title {
      padding: 16px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .title-line {
        display: inline-block;
        width: 2px;
        height: 20px;
        margin-right: 10px;
        background: #409eff;
      }
      .title-text {
        display: inline-block;
        color: #333;
        font-size: 14px;
      }
    }
    .info-content {
      .order-status {
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f5f5f6;
        padding: 0 10px;
        font-size: 13px;
      }
      .order-time {
        padding: 10px 40px;
        font-size: 14px;
        .item-time {
          display: inline-block;
          width: 25%;
          height: 50px;
          line-height: 50px;
        }
        .item-times {
          display: inline-block;
          width: 70%;
          height: 50px;
          line-height: 50px;
        }
      }
      .tablist {
        padding: 0 30px;
        .goodsInfo {
          display: flex;
          align-items: center;
          justify-content: center;
          .info-left {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .user-Info {
    .info-title {
      padding: 16px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .title-line {
        display: inline-block;
        width: 2px;
        height: 20px;
        margin-right: 10px;
        background: #409eff;
      }
      .title-text {
        display: inline-block;
        color: #333;
        font-size: 14px;
      }
    }
    .info-content {
      padding: 20px 30px;
      .users {
        display: flex;
        align-items: center;
        .users-left {
          height: 100px;
          width: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 20px;
          .users-img {
            height: 100%;
            width: 100%;
          }
        }
        .users-right {
          .users-name {
            height: 40px;
            line-height: 40px;
          }
          .users-phone {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
  .buyer-info {
    .info-title {
      padding: 16px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .title-line {
        display: inline-block;
        width: 2px;
        height: 20px;
        margin-right: 10px;
        background: #409eff;
      }
      .title-text {
        display: inline-block;
        color: #333;
        font-size: 14px;
      }
    }
    .info-content {
      padding: 0 30px;
      .addressee {
        height: 50px;
        line-height: 50px;
      }
      .address {
        height: 50px;
        line-height: 50px;
      }
      .remark {
        height: 50px;
        line-height: 50px;
      }
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
  .order-btn {
    text-align: center;
  }
}
</style>
