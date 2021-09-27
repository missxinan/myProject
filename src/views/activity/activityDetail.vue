<template>
  <div class="container" id="containerly">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="活动形式" prop="activityForm">
          <!-- <el-select v-model="ruleForm.activityForm" placeholder="请选择活动形式" >
						<el-option key="1" label="用户抽奖活动" value="1"></el-option>
          </el-select>-->
          <span v-if="ruleForm.activityForm == 1">大转盘</span>
          <span v-if="ruleForm.activityForm == 2">红包雨</span>
        </el-form-item>

        <el-form-item label="图片展示" v-if="ruleForm.imageUrl != ''">
          <div class="selectedDisplayarea">
            <img :src="ruleForm.imageUrl" style="max-width:200px;max-height:200px" />
          </div>
        </el-form-item>

        <el-form-item label="活动名称" prop="activityName">
          <span>{{ ruleForm.activityName }}</span>
        </el-form-item>
        <el-form-item label="活动权重" prop="sort">
          <span>{{ ruleForm.sort }}</span>
        </el-form-item>

        <el-form-item label="活动时间" prop="time">
          <span>{{ ruleForm.startTime }} - {{ ruleForm.endTime }}</span>
        </el-form-item>

        <el-form-item label="活动链接" prop="activityUrl">
          <span>{{ ruleForm.activityUrl }}</span>
        </el-form-item>

        <el-form-item label="每日免费抽奖次数(每人)" prop="freeNum">
          <span>{{ ruleForm.freeNum }}</span>
        </el-form-item>
        <el-form-item label="每次抽奖消耗积分" prop="costIntegral">
          <span>{{ ruleForm.costIntegral }}</span>
        </el-form-item>

        <el-form-item label="抽奖活动触发条件" prop="triggerCondition">
          <!-- <el-select v-model="ruleForm.triggerCondition" placeholder="请选择触发条件" >
						<el-option key="1" label="每日登陆" value="1"></el-option>
          </el-select>-->
          <span>{{ ruleForm.triggerCondition == 1 ? '每日登陆' : '' }}</span>
        </el-form-item>

        <el-form-item label="活动奖品种类" class="is-required">
          <span style="margin-right:20px;">{{drawGoodsDataList.length}}</span>
        </el-form-item>
      </el-form>
      <div v-if="ruleForm.activityForm == 2">
        <div style="margin:20px 0 ">奖品等级</div>
        <!-- 配置奖品等级列表 -->
        <el-table
          key="tableKey"
          v-loading="listLoading"
          :data="addLevelDataList"
          border
          fit
          highlight-current-row
          style="width: 100%;margin:20px 0"
        >
          <el-table-column label="奖品等级名称" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.gradeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="奖品等级权值" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.sort}}</span>
            </template>
          </el-table-column>
          <el-table-column label="阈值（积分）" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.threshold}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:20px 0 ">奖品列表</div>
      <!-- 选型列表 -->
      <el-table
        key="tableKey"
        v-loading="listLoading"
        :data="drawGoodsDataList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="奖品类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.prizeType == 1">实物</span>
            <span v-if="scope.row.prizeType == 2">红包</span>
            <span v-if="scope.row.prizeType == 3">积分</span>
            <span v-if="scope.row.prizeType == 4">无</span>
            <span v-if="scope.row.prizeType == 5">默认1积分</span>
          </template>
        </el-table-column>
        <el-table-column label="奖品等级" align="center" v-if="ruleForm.activityForm == 2">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖品名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.prizeName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="奖品图片" align="center">
          <template slot-scope="scope">
            <img
              v-if="scope.row.imageUrl"
              style="width: 80px;height: 80px;"
              :src="scope.row.imageUrl"
            />
          </template>
        </el-table-column>
        <el-table-column label="面值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖品权重" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中奖概率" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.drawRatio }}</span>
          </template>
        </el-table-column>
        <el-table-column label="每天发放数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="指定中奖用户" align="center" v-if="ruleForm.activityForm == 1">
          <template slot-scope="scope">
            <span>{{ scope.row.appointUserPhones }}</span>
          </template>
        </el-table-column>
        <el-table-column label="指定用户第几次中奖" align="center"  v-if="ruleForm.activityForm == 1">
          <template slot-scope="scope">
            <span>{{ scope.row.appointFrequency }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { activityDetailApi } from "@/api/activity.js";
export default {
  components: {},
  data() {
    return {
      ruleForm: {
        activityForm: undefined,
        imageUrl: undefined,
        activityName: undefined,
        time: undefined,
        freeNum: undefined,
        costIntegral: undefined,
        triggerCondition: undefined
      },
      // 新增属性
      dialogVisible: false,
      listLoading: false,
      addGoodsDialog: false,
      addGoods: {
        prizeType: undefined,
        prizeName: undefined,
        imageUrl: undefined,
        sort: undefined,
        drawRatio: undefined,
        num: undefined,
        totalNum: undefined,
        appointUserPhones: undefined,
        appointFrequency: undefined,
        price: undefined
      },
      drawGoodsDataList: [],
      goodsEdit: false,
      goodsEditIndex: 0,
      openType: "add",
      activityId: ""
    };
  },
  computed: {},
  created() {
    if (this.$route.query.hasOwnProperty("see")) {
      this.openType = "see";
      this.getGoodsDetail(this.$route.query.activityId);
    }
  },
  methods: {
    // 请求活动详情
    getGoodsDetail(activityId) {
      activityDetailApi({ activityId }).then(res => {
        if (res.code == 0) {
          res.data.time = [];
          this.ruleForm = res.data;
          this.drawGoodsDataList = res.data.activityPrizeList;
          if (this.ruleForm.activityForm == 2) {
            this.addLevelDataList = res.data.activityPrizeGradeList;
          }
          this.ruleForm.activityForm = this.ruleForm.activityForm + "";
          this.ruleForm.costIntegral = this.ruleForm.costIntegral + "";
          this.ruleForm.time = [res.data.startTime, res.data.endTime];
          this.drawGoodsDataList.map(item => {
            if (item.activityPrizeId) {
              delete item.activityPrizeId;
            }
          });
          delete this.ruleForm.activityPrizeList;
          if (this.openType == "copy") {
            this.ruleForm.time = undefined;
            delete this.ruleForm.activityId;
          }
        } else {
          this.$message.error(res.msg);
        }
        console.log(res, "res");
      });
    }
  }
};
</script>

<style>
.el-form-item__content {
  font-size: 14px;
}
</style>
