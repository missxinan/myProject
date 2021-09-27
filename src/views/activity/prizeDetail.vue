<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <div class="statusList">
          <p v-if="goodsDetailData.status == 0">订单状态:未确认</p>
          <p v-if="goodsDetailData.status == 1">订单状态:待发货</p>
          <p v-if="goodsDetailData.status == 2">订单状态:待收货</p>
          <p v-if="goodsDetailData.status == 3">订单状态:交易完成</p>
          <p v-if="goodsDetailData.status == 4">订单状态:交易失败</p>
          <p v-if="goodsDetailData.activityForm == 1">中奖时间:{{ goodsDetailData.createTime }}</p>
          <p v-if="goodsDetailData.activityForm == 2">中奖时间:{{ goodsDetailData.lotteryTime }}</p>
          <p
            v-if="goodsDetailData.status == 3 || goodsDetailData.status == 2"
          >发货时间:{{ goodsDetailData.deliverTime }}</p>
          <p
            v-if="goodsDetailData.status == 3 || goodsDetailData.status == 2"
          >快递公司:{{ goodsDetailData.logisticsName }}</p>
          <p
            v-if="goodsDetailData.status == 3 || goodsDetailData.status == 2"
          >快递单号:{{ goodsDetailData.logisticsNo }}</p>
          <p v-if="goodsDetailData.status == 3">收货时间:{{ goodsDetailData.updateTime }}</p>
        </div>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="goodsDetailDataList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        max-height="800"
      >
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.prizeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" align="center">
          <span>用户抽奖活动</span>
        </el-table-column>
        <el-table-column label="活动名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.activityName }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <p>收件人:{{goodsDetailData.consignee}}</p>
      <p>手机号码:{{goodsDetailData.mobile}}</p>
      <p>收件地址:{{goodsDetailData.address}}</p>
      <el-button type="primary" v-if="goodsDetailData.status == 1 && goodsDetailData.isWinning == 1" @click="publish">发货</el-button>
      <sendGoodsDio
        :flag="showorfalse"
        v-on:closeDio="closeDio"
        v-on:callBackSendGoods="sendGoodsFn"
        :orderId="goodsDetailData.activityLogId"
      ></sendGoodsDio>
    </el-card>
  </div>
</template>

<script>
import { prizeDetailtApi, sendGoodsApi } from "@/api/activity.js";
import checkPermission from "@/utils/permission";
import { exportBlob } from "@/api/blob";
import sendGoodsDio from "@/components/sendGoods/index.vue";
export default {
  components: {
    sendGoodsDio
  },
  name: "statisticsNo",
  directives: {},
  components: {
    sendGoodsDio
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      positionList: [],
      dialogFormVisible: false,
      totalData: {},
      activityLogId: "",
      goodsDetailData: {},
      goodsDetailDataList: [],
      showorfalse: false
    };
  },
  created() {
    this.activityLogId = this.$route.query.activityLogId;
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      prizeDetailtApi({ activityLogId: this.activityLogId }).then(response => {
        this.goodsDetailData = response.data;
        this.goodsDetailDataList.push(this.goodsDetailData);
        this.listLoading = false;
      });
    },
    activitySee(row) {
      this.$router.push({
        path: "activityAdd",
        query: { activityId: row.activityId, see: "see" }
      });
    },
    // 导出
    statisticsExcel() {
      let obj = {
        activityStatisticsId: this.listQuery.activityStatisticsId,
        phone: this.listQuery.phone,
        prizeType: this.listQuery.prizeType
      };
      exportBlob("upms/activity/activityLogExcel", obj).then(res => {
        console.log(res, "res");
        if (res.code && res.code == 1) {
          this.$message.error(res.msg);
        }
        const data = res.data;
        const a = document.createElement("a");
        const blob = new Blob([data]);
        const blobUrl = window.URL.createObjectURL(blob);
        a.style.display = "none";
        a.download = "用户抽奖明细.xls";
        a.href = blobUrl;
        a.click();
      });
    },
    publish() {
      this.showorfalse = true;
    },
    closeDio() {
      console.log("1111");
      this.showorfalse = false;
    },
    sendGoodsFn(value) {
      console.log(value, "value");
      sendGoodsApi({
        activityLogId: this.goodsDetailData.activityLogId,
        logisticsNo: value.logisticsNo,
        carrierId: value.carrierId
      }).then(res => {
        if (res.code == 0) {
          this.$notify({
            title: "Success",
            message: "操作成功",
            type: "success",
            duration: 2000
          });
          this.showorfalse = false;
          location.reload();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style>
</style>
