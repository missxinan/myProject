<template>
  <div>
    <div class="chiefInspector-detail">
      <div class="title">基本信息</div>
      <div class="userInfo">
        <div class="useLeft">
          <div class="block">
            <el-avatar :size="120" :src="circleUrl"></el-avatar>
          </div>
        </div>
        <div class="useCenter">
          <ul class="useCenter_Left">
            <li>{{nickname}}</li>
            <li>{{phone}}</li>
            <li>&nbsp;</li>
            <li v-if="gender==1">性别：男</li>
            <li v-if="gender==2">性别：女</li>
            <li>来源：小程序</li>
            <li>
              <span v-if="status==1" style="color:red">{{statusWarnText}}</span>
              <span v-if="status==0">
                {{name}} &nbsp; &nbsp; {{cardNo}} &nbsp; &nbsp;
                <span style="color:red">已认证</span>
              </span>
            </li>
          </ul>
          <ul class="useCenter_Right">
            <li>注册时间：{{createTime}}</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>年龄：{{age}}</li>
          </ul>
        </div>
        <ul class="useRight">
          <li class="table-btn btn-blue" @click="receivingAddress()">收货地址</li>
        </ul>
      </div>
    </div>
    <div class="chiefInspector-detail">
      <div class="title"><span>资产统计</span><el-button type="text" @click="toDetailTotal" >查看明细</el-button>
      </div>
      <el-button type="text" @click="ofreceDataShowClick" >查看全部</el-button>
      <ul class="ul-content" v-if="ofreceDataShow == true">
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
              手动调整：+{{ofreceData.handMoney}}
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
        <li>
          <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color:black;font-size: 16px;">
                提现金额：{{(ofreceData.outWithdraw - ofreceData.withdrawReturnMoney).toFixed(2) }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>提现金额: {{ofreceData.outWithdraw}}</el-dropdown-item>
                <el-dropdown-item>提现驳回: {{ofreceData.withdrawReturnMoney}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </li>
      </ul>
    </div>
    <div class="chiefInspector-detail">
      <div class="title">积分统计</div>
      <el-table :data="dataListnitegral" border class="list" style="width: 100%">
        <el-table-column prop="integral" align="center" label="可用积分"></el-table-column>
        <el-table-column prop="integralIn" align="center" label="总积分"></el-table-column>
        <el-table-column prop="integralOut" align="center" label="消耗积分"></el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="integralStatistics(scope.row)">查看明细</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <div>共{{total}}条</div>
      <el-table :data="gridData">
        <el-table-column property="consignee" label="收件人"></el-table-column>
        <el-table-column property="mobile" label="手机号"></el-table-column>
        <el-table-column property="provinceText" label="省市区">
          <template slot-scope="scope">
            <div>{{scope.row.provinceText}} {{scope.row.cityText}} {{scope.row.districtText}}</div>
          </template>
        </el-table-column>
        <el-table-column property="streetText" label="街道"></el-table-column>
        <el-table-column property="address" label="详细地址"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserDetail,
  getUserRealInfo,
  getMyMoneyByUserId,
  myTotalIntegrate,
  receivingAddressList,
  getcomputerMoney //分库分表后获取用户资金统计
} from "@/api/users";
export default {
  data() {
    return {
      circleUrl: "",
      sizeList: ["large"],
      dataList: [],
      dataListnitegral: [],
      dataListRecord: [],
      nickname: "",
      age: "",
      createTime: "",
      gender: "",
      phone: "",
      invitationCode: "",
      status: "",
      name: "",
      cardNo: "",
      outWithdraw: "",
      chargeMoney: "",
      amount: "",
      dialogTableVisible: false,
      gridData: [],
      userId: "",
      total: "",
      statusWarnText: "",
      activeName: "first",
      // 分库分表后用户资金统计
      ofreceData: {},
      ofreceDataShow:false,
    };
  },
  created() {
    const userId = this.$route.query.userId;
    this.userId = userId;
    getUserDetail({ userId })
      .then(res => {
        //console.log(res);
        (this.circleUrl = res.data.avatar),
          (this.nickname = res.data.nickname),
          (this.age = res.data.age),
          (this.phone = res.data.phone),
          (this.gender = res.data.gender),
          (this.createTime = res.data.createTime);
      })
      .catch(() => {});
    getUserRealInfo({ userId })
      .then(res => {
        if (res.code == 1) {
          this.status = 1;
          this.statusWarnText = res.data;
        } else {
          (this.name = res.data.name),
            (this.cardNo = res.data.cardNo),
            (this.status = res.data.status);
        }
      })
      .catch(() => {});
    getMyMoneyByUserId({ userId })
      .then(res => {
        this.dataList = [{ ...res.data }];
      })
      .catch(() => {});
    myTotalIntegrate({ userId })
      .then(res => {
        this.dataListnitegral = [{ ...res.data }];
      })
      .catch(() => {});
  },
  methods: {
    //跳转到收支明细
    detailsBudgetView() {
      this.$router.push({
        path: "DetailsOfreceiptsAndPayments",
        query: { userId: this.userId }
      });
    },
    //跳转到积分统计
    integralStatistics() {
      this.$router.push({
        path: "integralRecord",
        query: { phone: this.phone }
      });
    },
    //跳转订单列表页
    toOrderList() {
      this.$router.push({
        path: "/orderManagement",
        query: { phone: this.phone }
      });
    },
    //跳转出价记录列表
    toBidRecord() {
      this.$router.push({ path: "bidRecord", query: { userId: this.userId } });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    receivingAddress() {
      this.dialogTableVisible = true;
      //收货地址
      const userId = this.$route.query.userId;
      receivingAddressList({ userId })
        .then(res => {
          console.log(res);
          // this.gridData = [{ ...res.data }];
          // (this.address = res.data.address)
          this.total = res.data.total;
          this.gridData = res.data.records;
          // console.log(this.gridData)
        })
        .catch(() => {});
    },
    cellclick(row, column, cell, event) {
      // if (column.property === "nick") {

      // }
      console.log(row, column, cell, event);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getusersTotalMoney(){
      getcomputerMoney({ userId:this.$route.query.userId }).then(res=>{
        if(res.code == 0){
           this.ofreceData = res.data;
        }
      })
    },
    ofreceDataShowClick(){
      this.ofreceDataShow = true
      this.getusersTotalMoney()
    },
    // 查看全部
    toDetailTotal(){
      let that = this
      this.$router.push({
        path: "DetailsOfreceiptsAndPayments",
        query: { userId: that.userId, phone: that.phone }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
ul li {
  list-style: none;
  line-height: 40px;
}
.chiefInspector-detail {
  padding: 24px;
  .title {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    // margin-bottom: 40px;
  }
  .title::before {
    content: "";
    display: inline-block;
    height: 18px;
    width: 2px;
    background: #409eff;
    margin-right: 6px;
    vertical-align: text-bottom;
  }
  .detail-content {
    padding: 24px;
    .item {
      padding: 12px 0;
    }
    .item-name {
      display: inline-block;
      width: 150px;
      margin-right: 20px;
    }
    .item-value {
      display: inline-block;
    }
  }
  .userInfo {
    width: 100%;
    height: 230px;
    margin: 20px auto;
    display: flex;
    .useLeft {
      flex: 10%;
      padding-left: 4%;
      margin-top: 1%;
    }
    .useRight {
      flex: 10%;
    }
    .useCenter {
      display: flex;
      justify-content: flex-start;
      flex: 90%;
      //background: skyblue;
      .useCenter_Left {
        flex: 15%;
        margin-top: 3%;
      }
      .useCenter_Right {
        flex: 55%;
        margin-top: 3%;
      }
    }
  }
  .btn-blue:hover {
    cursor: pointer;
  }
  .btn-blue {
    color: #409eff;
  }
}
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
  .ofreceDataWrap{
    padding: 20px;
  }
</style>
