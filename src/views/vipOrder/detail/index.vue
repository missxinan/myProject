<template>
  <div class="container">
    <!-- 待发货页面 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单详情</span>
      </div>
      <p v-if="bigobj.orderStatus === 0">
        订单状态:{{status}}
        <span class="RedColor">剩余付款时间:{{expirationTime}}</span>
      </p>
      <p v-else>订单状态:{{status}}</p>
      <div v-if="bigobj.orderStatus === 0">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>付款时间:未付款</p>
        <p>发货时间:未发货</p>
        <p>快递公司（单号）:未发货</p>
        <p>收货时间:未签收</p>
      </div>
      <div v-if="bigobj.orderStatus === 1">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>付款时间:{{bigobj.payTime}}</p>
        <p>发货时间:未发货</p>
        <p>快递公司（单号）:未发货</p>
        <p>收货时间:未签收</p>
      </div>
      <div v-if="bigobj.orderStatus === 2">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>付款时间:{{bigobj.payTime}}</p>
        <p>发货时间:{{bigobj.deliverTime}}</p>
        <p>快递公司:{{bigobj.logisticsName}}</p>
        <p>快递单号:{{bigobj.logisticsNo}}</p>
        <p>收货时间:未签收</p>
      </div>
      <div v-if="bigobj.orderStatus === 3">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>付款时间:{{bigobj.payTime}}</p>
        <p>发货时间:{{bigobj.deliverTime}}</p>
        <p>快递公司（单号）:{{bigobj.logisticsName}}({{bigobj.logisticsNo}})</p>
        <p>收货时间:{{bigobj.updateTime}}</p>
      </div>
      <div v-if="bigobj.orderStatus === 4">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>关闭时间:{{bigobj.updateTime}}</p>
        <p>付款时间:未付款</p>
        <p>发货时间:未发货</p>
        <p>快递公司（单号）:未发货</p>
        <p>收货时间:未签收</p>
      </div>
      <div v-if="bigobj.orderStatus === 5">
        <p>下单时间:{{bigobj.createTime}}</p>
        <p>付款时间:{{bigobj.payTime}}</p>
      </div>
      <el-table :data="orderArr" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="商品编号" align="center">
          <template slot-scope="scope">{{ scope.row.goodsId }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column label="供应商" align="center">
          <template slot-scope="scope">{{ scope.row.supplier }}</template>
        </el-table-column>
        <el-table-column label="成本价" align="center">
          <template slot-scope="scope">{{ scope.row.costPrice }}</template>
        </el-table-column>
        <el-table-column label="起拍价" align="center">
          <template slot-scope="scope">{{ scope.row.startPrice }}</template>
        </el-table-column>
        <el-table-column label="成交价" align="center">
          <template slot-scope="scope">{{ scope.row.transactionPrice }}</template>
        </el-table-column>
        <el-table-column label="保证金" align="center">
          <template slot-scope="scope">{{ scope.row.pledgePrice }}</template>
        </el-table-column>
        <el-table-column label="尾款" align="center">
          <template slot-scope="scope">{{ scope.row.weikuan}}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>买家收货信息</span>
      </div>
      <p>收件人:{{bigobj.consignee}}</p>
      <p>手机号码:{{bigobj.mobile}}</p>
      <p>收件地址:{{bigobj.address}}</p>
      <p>备注:{{ bigobj.remark }}</p>
    </el-card>
    <div style="margin-top: 20px;">
      <el-button v-if="bigobj.orderStatus == 2" type="primary" @click="changeOriderNum()">修改单号</el-button>
      <el-button type="primary" v-if="bigobj.orderStatus === 1" @click="Publish">发货</el-button>
      <el-button
        type="success"
        v-if="bigobj.orderStatus === 1 || bigobj.orderStatus === 0"
        @click="cancel"
      >取消订单</el-button>
      <el-button
        type="success"
        v-if="bigobj.orderStatus === 1 || bigobj.orderStatus === 0"
        @click="setRemark"
      >修改备注</el-button>
      <el-button type="success" v-if="bigobj.orderStatus === 4" @click="backMoney">退保证金</el-button>
    </div>
    <!-- <el-card class="box-card" >
			<div slot="header" class="clearfix">
				<span>订单按钮</span>
			</div>
			
    </el-card>-->

    <Dialog :flag="showorfalse" @publish="Fn" :orderId="orderIds"></Dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span class="yangshia">{{ toastMsg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CancelSureOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 待收货订单允许修改订单号 -->
    <el-dialog title="备注" :visible.sync="setRemarkShow">
      <el-form label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="备注信息">
          <textarea v-model="setRemarkTxt" maxlength="400" style="width: 300px;height: 150px;"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="* -footer">
        <el-button @click="setRemarkShow = false">取消</el-button>
        <el-button type="primary" @click="setRemarkUpdata()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// soldOut = false
import {
  orderdetaillist,
  ordercloseOrder,
  orderdetaillistactionId,
  deliverGoods,
  setRemark,
  backMoney
} from "@/api/orderdetails.js";
import Dialog from "@/components/dialog/index.vue";
export default {
  components: {
    Dialog
  },
  data() {
    return {
      centerDialogVisible: false,
      showorfalse: false,
      soldOut: false,
      orderList: {
        //订单编号
        orderId: "",
        //订单状态
        orderStatus: "",
        //下单时间:
        createTime: "",
        //付款时间:
        payTime: "",
        //发货时间:
        deliverTime: "",
        //快递公司单号:
        logisticsNo: ""
        //收获时间:
      },
      //Table表格内容
      orderArr: [],
      //之后将此对象写入
      shoppingContent: {
        //商品编号
        goodsId: "",
        //商品名称
        goodsName: "",
        //起拍价
        startPrice: "",
        //成交价
        transactionPrice: "",
        //保证金
        pledgePrice: "",
        //尾款
        weikuan: "",
        // 供应商
        supplier: "",
        // 成本价
        costPrice: ""
        // transactionPrice : transactionPrice-
      },
      //买家收获信息
      Buyer: {
        //收件人
        consignee: "",
        //收件地址
        address: ""
      },
      bigobj: {},
      starttime: "",
      endtime: "",
      isEnd: false,
      setIntervalTime: null,
      expirationTime: null,
      status: "",
      statusObj: [
        {
          num: 0,
          value: "待付款"
        },
        {
          num: 1,
          value: "待发货"
        },
        {
          num: 2,
          value: "待收货"
        },
        {
          num: 3,
          value: "交易完成"
        },
        {
          num: 4,
          value: "交易失败"
        },
        {
          num: 5,
          value: "已取消"
        }
      ],
      orderIds: null,
      logisticsEdit: false,
      // 添加备注
      setRemarkShow: false,
      setRemarkTxt: "",
      // 取消订单提示
      toastMsg: "确定取消订单？"
    };
  },
  //处理状态函数

  created() {
    //此处调用订单详情/upms/order/order/detail
    console.log(this.$route.query, "222222");
    this.getOrderDetail();
  },
  destroyed() {
    clearInterval(this.setIntervalTime);
  },
  methods: {
    CancelSureOk() {
      ordercloseOrder({
        orderId: this.$route.query.orderId
      }).then(res => {
        if (res.msg === "操作成功") {
		  this.getOrderDetail();
		  this.centerDialogVisible = !this.centerDialogVisible;
          // this.$router.push('/orderManagement/orderList');
        } else {
          this.$message(res.msg);
        }
      });
    },
    cancel() {
      if (this.bigobj.orderStatus === 0) {
        this.toastMsg = "取消订单后，保证金会退还给用户，确定取消么";
      } else {
        this.toastMsg = "确定取消订单？";
      }
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    Fn(value) {
      // console.log()
      this.showorfalse = value;
    },
    //Day30 把后续接口走通完成任务！！！1
    Publish() {
      this.showorfalse = true;
      // deliverGoods({
      // 	orderId : this.orderIds,
      // 	logisticsNo:this.bigobj.logisticsNo,

      // }).then((res)=>{

      // })

      // this.soldOut = true;
    },
    //状态函数
    statusFunc(status) {
      this.statusObj.some((item, index) => {
        if (item.num === status) {
          this.status = item.value;
          return true;
        }
      });
    },
    setEndTime() {
      // 目标日期时间戳
      const end = Date.parse(this.endtime);
      // 当前时间戳
      const now = Date.parse(new Date());
      // 相差的毫秒数
      const msec = end - now;
      // 计算时分秒数
      let day = parseInt(msec / 1000 / 60 / 60 / 24);
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      // 个位数前补零
      hr = hr > 9 ? hr : "0" + hr;
      min = min > 9 ? min : "0" + min;
      sec = sec > 9 ? sec : "0" + sec;
      this.expirationTime = `${day}天 ${hr}小时 ${min}分钟 ${sec}秒`;
    },
    changeOriderNum() {
      this.showorfalse = true;
    },
    // 添加订单备注
    setRemark() {
      this.setRemarkTxt = this.bigobj.remark;
      this.setRemarkShow = true;
    },
    setRemarkUpdata() {
      setRemark({
        orderId: this.$route.query.orderId,
        remark: this.setRemarkTxt
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.setRemarkShow = false;
          this.bigobj.remark = this.setRemarkTxt;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // 交易关闭退保证金
    backMoney() {
      this.$confirm("确定要退保证金么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        backMoney({ orderId: this.$route.query.orderId }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.setRemarkShow = false;
            this.orderArr = [];
			      this.getOrderDetail();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      });
    },
    // 获得订单详情
    getOrderDetail() {
      this.orderArr = [];
      let that = this;
      let Data = Array.from(Object.keys(this.$route.query));
      console.log(Data, "666");
      // orderdetaillistactionId
      if (Data[0] == "orderId") {
        this.orderIds = this.$route.query.orderId;
        orderdetaillist({
          orderId: this.$route.query.orderId
        }).then(res => {
          this.bigobj = Object.assign({}, res.data.goodsInfo, res.data.order);
          for (let key in this.shoppingContent) {
            for (let bey in this.bigobj) {
              if (key === "weikuan") {
                this.shoppingContent[key] = this.bigobj.orderPrice;
                console.log(this.shoppingContent[key]);
              }
              if (key === bey) {
                this.shoppingContent[key] = this.bigobj[bey];
              }
            }
          }
          console.log(this.shoppingContent, "this.shoppingContent");
          this.orderArr.push(this.shoppingContent);
          this.starttime = new Date(this.bigobj.createTime);
          this.endtime = new Date(Number(this.bigobj.endTime));
          this.statusFunc(this.bigobj.orderStatus);
          this.setIntervalTime = setInterval(function() {
            that.setEndTime();
          }, 1000);
        });
      } else {
        orderdetaillistactionId({
          auctionId: this.$route.query.auctionId
        }).then(res => {
          console.log(res, "333");
          this.orderIds = res.data.order.orderId;
          this.bigobj = Object.assign({}, res.data.goodsInfo, res.data.order);
          console.log(this.bigobj, "444");
          for (let key in this.shoppingContent) {
            for (let bey in this.bigobj) {
              if (key === "weikuan") {
                this.shoppingContent[key] = this.bigobj.orderPrice;
                console.log(this.shoppingContent[key]);
              }
              if (key === bey) {
                this.shoppingContent[key] = this.bigobj[bey];
              }
            }
          }
          this.orderArr.push(this.shoppingContent);
          this.starttime = new Date(this.bigobj.createTime);
          this.endtime = new Date(Number(this.bigobj.endTime));
          this.statusFunc(this.bigobj.orderStatus);
          this.setIntervalTime = setInterval(function() {
            that.setEndTime();
          }, 1000);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.yangshia {
  text-align: center;
  margin: 0 auto;
  display: block;
}

.RedColor {
  color: red;
}
.container {
  padding: 20px;
}
</style>
