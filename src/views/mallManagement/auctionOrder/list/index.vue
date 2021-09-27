<template>
  <div class="orderList">
    <div class="orderList-maill">
      <el-tabs v-model="parentIndex" type="card" @tab-click="handleClick">
        <el-tab-pane name="1" label="寄拍"></el-tab-pane>
        <el-tab-pane name="2" label="换购"></el-tab-pane>
      </el-tabs>
    </div>
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
      <div
        class="item"
        v-if="activeIndex == 1 || activeIndex == 2|| activeIndex == 3 || activeIndex == 5 "
      >
        <el-date-picker
          v-model="payTime"
          type="daterange"
          range-separator="-"
           format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="订单付款开始日期"
          end-placeholder="订单付款结束日期"
        ></el-date-picker>
      </div>
      <div class="item" v-if="(activeIndex == 3 || activeIndex == 5 )&& (parentIndex == 1 || parentIndex == 4)">
        <el-date-picker
          v-model="CompleteTime"
          type="daterange"
          range-separator="-"
           format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="订单完成开始日期"
          end-placeholder="订单完成结束日期"
        ></el-date-picker>
      </div>
      <div class="item" v-if="activeIndex == 3 && parentIndex == 2">
        <el-date-picker
          v-model="ReceivingGoodsTime"
          type="daterange"
          range-separator="-"
           format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="订单完成开始日期"
          end-placeholder="订单完成结束日期"
        ></el-date-picker>
      </div>
      <div class="item">
        <el-input class="item-input" v-model="goodsNameId" placeholder="请输入商品名称、ID"></el-input>
      </div>
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
      <div class="item" v-if="parentIndex != 4">
        <el-select class="item-input" v-model="type" placeholder="请选择付款方式">
          <el-option
            v-for="item in payArry"
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
      <div class="item" v-if="activeIndex == 1">
        <el-select class="item-input" v-model="orderType" placeholder="请选择寄拍状态">
          <el-option
            v-for="item in postalStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button class="item-btn" type="primary" @click="search">搜索</el-button>
        <el-button class="item-btn" type="primary" @click="rest">重置</el-button>
        <el-button type='text'>金额：{{totalPrice.price}} 积分：{{ totalPrice.integral }}</el-button>
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
        <el-menu-item index="6">
          全部
          <span v-if="activeIndex == 6">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="0" v-if="parentIndex != 4">
          待付款
          <span v-if="activeIndex == 0">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="4" v-if="parentIndex == 4">
          交易关闭
          <span v-if="activeIndex == 4">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="1">
          待发货
          <span v-if="activeIndex == 1">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="2">
          待收货
          <span v-if="activeIndex == 2">({{total}})</span>
        </el-menu-item>
        <el-menu-item index="3">
          交易成功
          <span v-if="activeIndex == 3">({{total}})</span>
        </el-menu-item>
        <el-menu-item v-if="parentIndex == 1" index="5">
          寄拍成功
          <span v-if="activeIndex == 5">({{total}})</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="tableList">
      <el-table :data="list" border class="list" style="width: 100%" max-height="550">
        <el-table-column prop="createTime" align="center" label="下单时间"></el-table-column>
        <el-table-column prop="orderId" align="center" label="订单号"></el-table-column>
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
        <el-table-column prop="phone" align="center" label="买家/手机号">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <span class>{{scope.row.userName}}/{{scope.row.phone}}</span>
              <!-- <div class>{{scope.row.phone}}</div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" align="center" label="总价格"></el-table-column>
        <el-table-column prop="totalIntegral" align="center" label="总积分"></el-table-column>
        <el-table-column prop="orderStatus" align="center" label="订单状态">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div
                style="text-align: center"
              >{{scope.row.orderStatus === 0? '待付款':scope.row.orderStatus === 1?'待发货':scope.row.orderStatus === 2?'待收货':scope.row.orderStatus === 3?'交易成功':scope.row.orderStatus === 4?'交易失败':scope.row.orderStatus === 5?'寄拍成功':''}}</div>
            </div>
          </template>
        </el-table-column>
         <el-table-column prop="num" align="center" label="数量" v-if="parentIndex != 4"></el-table-column>
        <el-table-column
          prop="orderType"
          align="center"
          label="寄拍状态"
          v-if="activeIndex == 1 && parentIndex == 1"
        >
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div
                style="text-align: center"
              >{{scope.row.orderType === 1? '待接拍':scope.row.orderType === 2?'寄拍中':scope.row.orderType === 3?'寄拍成功':scope.row.orderType === 4?'寄拍失败':scope.row.orderType === 5?'拒绝寄拍': ''}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" align="center" label="寄拍时间" v-if="parentIndex == 1">
          <template slot-scope="scope">
            <div>{{scope.row.applyTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="付款方式" v-if="parentIndex != 4">
          <template slot-scope="scope">
            <div class="goodsInfo" style="text-align: center">
              <div
                class
              >{{scope.row.type == 1? '余额':scope.row.type == 2?'微信':scope.row.type == 4?'积分':''}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" align="center" label="付款时间" v-if="parentIndex != 4"></el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="完成时间"
          v-if="activeIndex == 6 || activeIndex == 3 || activeIndex == 5"
        >
          <template slot-scope="scope">
            <div>
              <div
                v-if="scope.row.orderStatus === 3 || scope.row.orderStatus === 5"
              >{{scope.row.updateTime}}</div>
              <div v-else></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="costPrice" align="center" label="成本价"></el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="lookOrder(scope.row)">查看订单</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.orderStatus == 1 && scope.row.orderType == 1 && checkPermission(['mall:mallOrder:acceptGoods'])"
                @click="deliver(scope.$index,scope.row)"
              >接拍</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.orderStatus == 1 && (scope.row.orderType == 0 || scope.row.orderType == 4 || scope.row.orderType == 5) && checkPermission(['mall:mallGoods:sendGoods'])"
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
    <el-dialog title="接拍" :visible.sync="deliverGoods" width="30%" :before-close="closeReceive">
      <div class="dialog-orderMall">
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
  orderListMall,
  acceptAuctionMall,
  deliverGoodsMall,
  mallCountMoneyApi
} from "@/api/mallManagement";
import checkPermission from "@/utils/permission";
import { requestfile, exportBlob } from "@/api/blob";
export default {
  name: "mallOrderTag",
  data() {
    return {
      receive: false,
      deliverGoods: false,
      companyArry: [],
      categoryArry: [],
      categoryId: "",
      applyStatus: "",
      reasonRemark: "",
      orderRow: "",
      logisticsNo: "",
      carrierId: "",
      parentIndex: "1",
      activeIndex: "6",
      consignee: "",
      mobile: "",
      size: 10,
      list: [],
      current: 1,
      total: 0,
      goodsNameId: "",
      orderId: "",
      orderStatus: "",
      orderType: "",
      buyerNamePhone: "",
      type: undefined,
      createTime: "",
      payTime: "",
      CompleteTime: "",
      ReceivingGoodsTime: "",
      postalStatus: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待接拍",
          value: 1
        },
        {
          label: "寄拍中",
          value: 2
        },
        {
          label: "寄拍成功",
          value: 3
        },
        {
          label: "寄拍失败",
          value: 4
        },
        {
          label: "拒绝",
          value: 5
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /**
     *
     */
    handleClick() {
      this.ReceivingGoodsTime = undefined;
      this.CompleteTime = undefined;
      this.activeIndex = "6";
      this.orderStatus = "";
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
      if (val == "6") {
        that.activeIndex = val;
        that.orderStatus = "";
      } else {
        that.activeIndex = val;
        that.orderStatus = val;
      }
      if (this.activeIndex == 0 || this.activeIndex == 6) {
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
        orderStatus: that.orderStatus,
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
      orderListMall(data).then(res => {
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
        orderStatus: that.orderStatus,
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
        mallCountMoneyApi(data).then(res=>{
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
      this.type = undefined;
      this.buyerNamePhone = "";
      this.orderType = "";
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
        path: "/mallManagement/mallOrder/mallOrderDetail",
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
      that.categoryId = that.categoryId[that.categoryId.length - 1];
      that.deliverGoods = false;
      let data = {
        orderId: that.orderRow.orderId,
        reasonRemark: that.reasonRemark,
        categoryId: that.categoryId,
        orderType: that.applyStatus
      };
      acceptAuctionMall(data).then(res => {
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
