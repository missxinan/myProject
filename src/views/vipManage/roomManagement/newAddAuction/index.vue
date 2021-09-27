<template>
  <div class="headQuarters-addOrEdit">
    <div class="addOrEdit-content">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="ruleFormRules"
        label-width="100px"
        class="demo-ruleForm"
        style="margin-top:40px"
      >
        <el-form-item label="选择商品" required prop="goodsName">
          <el-input
            v-model="ruleForm.goodsName"
            class="item-inputs"
            readonly
            placeholder="请选择商品"
            @click.native="goodnameSelect"
          />
        </el-form-item>
        <el-form-item label="估价" prop="assessPrice">
          <el-input
            v-model="ruleForm.assessPrice"
            type="number"
            class="item-inputs"
            placeholder="请输入估价（纯数字）"
          />
        </el-form-item>
        <el-form-item label="机器人状态" prop="openRobot">
          <el-radio-group v-model="ruleForm.openRobot">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="起拍价" required prop="startPrice">
          <el-input
            v-model="ruleForm.startPrice"
            class="item-inputs"
            type="number"
            placeholder="请输入起拍价（纯数字）"
          />
        </el-form-item>
        <el-form-item label="最低保护价" required prop="startProtectPrice" v-if="ruleForm.openRobot == '1'">
          <div style="display:flex;" class="item-inputs">
            <el-input
              v-model="ruleForm.startProtectPrice"
              maxlength="12"
              oninput="value=value.replace(/[^\d]/g,'')"
            /><span style="margin:0 5px;">-</span><el-input
              v-model="ruleForm.endProtectPrice"
              maxlength="12"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="最高保护价"
          required
          prop="startMaxProtectPrice"
          v-if="ruleForm.openRobot == '1'"
        >
          <div style="display:flex;" class="item-inputs">
          <el-input
            v-model="ruleForm.startMaxProtectPrice"
            maxlength="12"
            oninput="value=value.replace(/[^\d]/g,'')"
          /><span style="margin:0 5px;">-</span><el-input
            v-model="ruleForm.endMaxProtectPrice"
            class="item-inputs"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </div>
        </el-form-item>
         <el-form-item label="机器人参与个数"  v-if="ruleForm.openRobot == 1"
          :prop="ruleForm.openRobot == 1 ?'robotNum':''">
          <el-input
            v-model="ruleForm.robotNum"
            class="item-inputs"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item label="加价幅度" required prop="markupPrice">
          <el-input
            v-model="ruleForm.markupPrice"
            class="item-inputs"
            type="number"
            placeholder="请输入加价幅度（纯数字）"
            @input="markupPrice"
          />
        </el-form-item>
        <el-form-item label="佣金">
          <el-input
            v-model="ruleForm.commission"
            class="item-inputs"
            :rows="2"
            placeholder="请输入内容"
            readonly
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="权重" prop="sort">
          <el-input
            v-model="ruleForm.sort"
            type="number"
            class="item-inputs"
            placeholder="请输入权重（纯数字）"
          />
        </el-form-item>
        <el-form-item label="开拍时间" required prop="startTime">
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="ruleForm.startTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:00"
              class="item-inputs"
              placeholder="选择开拍日期和时间"
              @change="Vm"
            />
          </div>
        </el-form-item>
        <el-form-item label="截拍时间" required prop="endTime">
          <div class="block">
            <span class="demonstration" />
            <el-date-picker
              v-model="ruleForm.endTime"
              class="item-inputs"
              type="datetime"
              format="yyyy-MM-dd HH:mm:00"
              placeholder="选择截拍日期和时间"
              @change="Gm"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择商品" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="search-content-dialog">
        <div class="item">
          <span class="item-title">商品名称：</span>
          <el-input v-model="goodsName" class="item-input" placeholder="请输入商品名称" />
        </div>
        <el-button type="primary" class @click="search">搜索</el-button>
        <el-button type="primary" class @click="reset">重置</el-button>
      </div>
      <!-- 选择商品下面的平台和寄拍的切换 -->
      <template>
              <el-table border :data="source.dataList" stripe style="width: 100%" max-height="650">
                <el-table-column prop="goodsName" label="商品名称" width="180" />
                <el-table-column label="商品图片" width="100">
                  <template slot-scope="scope">
                    <img class="addGoodsImage" :src="scope.row.logo" />
                  </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="分类" width="180" />
                <el-table-column prop="costPrice" label="成本价" />
               <!-- <el-table-column prop="goodsId" label="可用库存">
                  <template slot-scope="scope">
                    <span>{{ Number(scope.row.inventory) - Number(scope.row.soldNum) }}</span>
                  </template>
                </el-table-column> -->
               <!-- <el-table-column label="限价" align="center">
                  <template slot-scope="scope">
                    <el-tag
                      :type=" scope.row.limitedPriceType == 0 ? 'warning' : ''"
                    >{{ scope.row.limitedPriceType == 0 ? '否' : scope.row.limitedPrice }}</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column prop="goodsId" align="center" label="操作">
                  <template slot-scope="scope">
                    <div>
                      <el-button
                        type="primary"
                        plain
                        @click="selectGood(scope.row)"
                      >选择商品</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-paging">
                <el-pagination
                  :current-page="source.current"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="source.size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="source.total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  viewTheAuctionList,
  newAddAuction,
  vipLibraryOfGoods
} from "@/api/vipMange.js";
import { getSystemTime } from "@/api/AuctionsRecord.js";
export default {
  name: "ChiefInspectorAddOrEdit",
  data() {
    return {
      roomId: "",
      dialogVisible: false,
      activeName: "source",
      ruleForm: {
        assessPrice: null, // 估价
        sort: null, // 权重
        protectPrice: null, // 最低保护价
        markupPrice: null, // 加价幅度
        startPrice: null, // 起拍价
        startTime: null,
        endTime: null,
        goodsId: null,
        commission: 0,
        maxProtectPrice: null,
        goodsName: null,
        openRobot: 0,
        isLimitPrice:0
      },
      ruleFormRules: {
        protectPrice: [
          { required: true, message: "请输入最低保护价", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        markupPrice: [
          { required: true, message: "请输入加价幅度", trigger: "change" }
        ],
        startPrice: [
          { required: true, message: "请输入起拍价", trigger: "change" }
        ],
        goodsName: [
          { required: true, message: "请选择商品", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开拍时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择截拍时间", trigger: "blur" }
        ],
        maxProtectPrice: [
          { required: true, message: "请输入最高保护价", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        assessPrice: [
          { required: true, message: "估值不能为空", trigger: "change" }
        ],
        openRobot: [
          { required: true, message: "这是必选项", trigger: "change" }
        ],
        sort: [
          {
            required: true,
            message: "权重不能为空并且小于11位",
            trigger: "change",
            min: 1,
            max: 10
          }
        ],
        limitPrice: [
          { required: true, message: "限高价不能为空", trigger: "change" }
        ],
        // robotNum
        robotNum: [
          { required: true, message: "机器人个数不能为空", trigger: "change" },
          {min:1,max:100, message: "只能输入正整数，大于等于2，最多2位数", trigger: "change"}
        ],
         startProtectPrice: [
          { required: true, message: "最低保护价最小值不能为空", trigger: "change" }
        ],
        // endProtectPrice
        endProtectPrice: [
          { required: true, message: "最低保护价最大值不能为空", trigger: "change" }
        ],
        startMaxProtectPrice: [
          { required: true, message: "最高保护价最小值不能为空", trigger: "change" }
        ],
        endMaxProtectPrice: [
          { required: true, message: "最高保护价最大值不能为空", trigger: "change" }
        ],
      },
      displayArea: 3,
      goodsName: "", // 商品名称

      // 店主
      mailing: {
        source: 1,
        size: 10,
        current: 1,
        dataList: [],
        total: 0,
      },
      // 平台 默认是平台
      source: {
        source: 2,
        size: 10,
        current: 1,
        dataList: [],
        total: 0
      }
    };
  },
  created() {
    this.roomId = this.$route.query.roomId;
    this.name = this.$route.query.name;
    this.vipId = this.$route.query.vipId;
    // 获取系统参数
    this.getSystemnum();
  },
  methods: {
    ChangeShow(data) {
      var d = new Date(data);
      var datetime =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) +
        " " +
        (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +
        ":" +
        (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
        ":" +
        (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
      // var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
      //   ':' + d.getSeconds();
      return datetime;
    },
    Gm(vm) {
      // 1秒 == 1000毫秒
      // 1小时 == 60分钟 60秒 3600000
      if (
        new Date(vm).getTime() - new Date(this.ruleForm.startTime).getTime() >=
          0 &&
        new Date(vm).getTime() - new Date(this.ruleForm.startTime).getTime() <=
          3600000
      ) {
        this.$message("选择成功！");
        this.ruleForm.endTime = this.ChangeShow(vm);
      } else {
        this.$message("请先选择开拍时间且截拍时间距开拍时间不能超过一小时！");
        this.ruleForm.endTime = "";
      }
    },
    Vm(vm) {
      console.log(vm, "vm");
      if (vm < this.CurrentTime) {
        this.$message("选中时间要大于当前时间！");
        this.ruleForm.startTime = "";
      } else {
        let nowData = new Date(vm).getTime();
        this.ruleForm.startTime = parseInt(nowData / 60000) * 60000;
        // this.$message('请重新选择时间！');
        let Data = new Date(vm).getTime() + this.systemTime * 60 * 1000;
        Data = parseInt(Data / 60000) * 60000;
        var d = new Date(Data);
        this.ruleForm.endTime = this.ChangeShow(d);
        this.JiePaiTimeTrueFalse = false;
      }
    },
    //  商品选择
    goodnameSelect() {
      this.dialogVisible = true;
      this.selectSourceData();
      this.selectMailingData();
    },

    // 平台列表
    selectSourceData() {
      const data = {
        size: this.source.size,
        current: this.source.current,
        goodsName: this.goodsName,
        source: 1,
        type: 1,
        status: 2,
        statusType: 1
      };
      vipLibraryOfGoods(data).then(res => {
        if (res.code == "00000") {
          this.source.dataList = res.data.records;
          this.source.total = Number(res.data.total);
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // 店主列表
    selectMailingData() {
      const data = {
        size: this.mailing.size,
        current: this.mailing.current,
        goodsName: this.goodsName,
        vipId: this.vipId,
        source: 2,
        type: 1,
        status: 2,
        statusType: 1
      };
      vipLibraryOfGoods(data).then(res => {
        if (res.code == "00000") {
          this.mailing.dataList = res.data.records;
          this.mailing.total = Number(res.data.total);
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    ChangeTime(d) {
      var d = new Date(d);
      var startStartTime =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      return startStartTime;
    },
    // 分页
    handleCurrentChange(page) {
      if (this.activeName === "source") {
        this.source.current = page;
        this.selectSourceData();
      } else {
        this.mailing.current = page;
        this.selectMailingData();
      }
    },
    // 条数
    handleSizeChange(page) {
      if (this.activeName === "source") {
        this.source.size = page;
        this.selectSourceData();
      } else {
        this.mailing.size = page;
        this.selectMailingData();
      }
    },
    //   搜索
    search() {
      if (this.activeName === "source") {
        this.selectSourceData();
      } else {
        this.selectMailingData();
      }
    },
    //  重置
    reset() {
      this.goodsName = "";
      this.selectSourceData();
      this.selectMailingData();
    },

    //   选择商品
    selectGood(row) {
      console.log(row,'limitPrice')
      this.ruleForm.goodsId = row.vipGoodsId;
      this.ruleForm.goodsName = row.goodsName;
      this.ruleForm.assessPrice = row.assessPrice;
      this.ruleForm.limitPrice = row.limitPrice;
      // this.ruleForm.isLimitPrice = row.isLimitPrice;
      this.markupPrice(row.markupPrice);
      // debugger
     if(row.source === 1){
        //起拍价格
      this.ruleForm.markupPrice = row.markupPrice;
      //加价幅度
      // this.ruleForm.startPrice = row.startPrice;
     }
      this.dialogVisible = false;
      this.mailing = {
        source: 1,
        mailingStatus: 1,
        size: 10,
        current: 1,
        dataList: [],
        total: 0
      };
      // 平台 默认是平台
      this.source = {
        source: 2,
        size: 10,
        current: 1,
        dataList: [],
        total: 0
      };
    },

    // 提交拍卖
    submitForm() {
      if(this.ruleForm.openRobot == 1 ){
            if( !this.ruleForm.endProtectPrice ){
              this.$message.warning('请输入最低保护价最大值')
            }
            if( !this.ruleForm.endMaxProtectPrice ){
              this.$message.warning('请输入最高保护价最大值')
            }
            if (
              Number(this.ruleForm.startMaxProtectPrice) <
              Number(this.ruleForm.endProtectPrice)
            ) {
              this.$message({
                message: "最高保护价最小值不能小于最低保护价最大值",
                type: "warning"
              });
              return;
            }
            if (
              Number(this.ruleForm.startProtectPrice) >
              Number(this.ruleForm.endProtectPrice)
            ) {
              this.$message({
                message: "最低保护价最小值不能大于最低保护价最大值",
                type: "warning"
              });
              return;
            }
            if (
              Number(this.ruleForm.startMaxProtectPrice) >
              Number(this.ruleForm.endMaxProtectPrice)
            ) {
              this.$message({
                message: "最高保护价最小值不能大于最高保护价最大值",
                type: "warning"
              });
              return;
            }
          }
          if (
              Number(this.ruleForm.markupPrice) >=
              Number(this.ruleForm.startPrice)
            ) {
              this.$message({
                message: "加价幅度必须小于起拍价",
                type: "warning"
              });
              return;
            }
            // 起拍价必须小于商品限价
            if(this.ruleForm.limitPrice != 0){
              if (
                Number(this.ruleForm.startPrice) >=
                Number(this.ruleForm.limitPrice)
              ) {
                this.$message({
                  message: "起拍价必须小于商品限价",
                  type: "warning"
                });
                return;
              }
              // 最低、最高保护价的最大区间值必须小于商品限价
              if (
                Number(this.ruleForm.endProtectPrice) >=
                Number(this.ruleForm.limitPrice) || Number(this.ruleForm.endMaxProtectPrice) >=
                Number(this.ruleForm.limitPrice)
              ) {
                this.$message({
                  message: "最低、最高保护价的最大区间值必须小于商品限价",
                  type: "warning"
                });
                return;
              }

            }
      const data = {

        roomId: this.roomId,
        displayArea: this.displayArea,
        ...this.ruleForm,
        startTime: this.ChangeShow(this.ruleForm.startTime),
        endTime: this.ChangeShow(this.ruleForm.endTime),
      };
      if (this.ruleForm.openRobot == 1) {
        data.protectPrice = this.ruleForm.protectPrice;
        data.maxProtectPrice = this.ruleForm.maxProtectPrice;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          newAddAuction(data).then(res => {
            if (res.code == "00000") {
              this.$message({
                message: "添加拍卖成功！",
                type: "sucess"
              });
              this.$router.push({
                path: "/vipMange/roomManagement/checkTheTtemsmentList",
                query: {
                  roomId: this.roomId,
                  name: this.name
                }
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    // 起拍价change 改变佣金
    markupPrice(value) {
      this.ruleForm.commission = Number(value) * 0.1;
    },
    // 切换平台寄拍栏，  选择商品截面
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 取消  选择商品触发的选择商品页面
    handleClose(done) {
      this.dialogVisible = false;
      this.mailing = {
        mailingStatus: 1,
        size: 10,
        current: 1,
        dataList: [],
        total: 0
      };
      // 平台 默认是平台
      this.source = {
        source: 2,
        size: 10,
        current: 1,
        dataList: [],
        total: 0
      };
    },
    // 取消提交
    resetForm(formName) {
      this.$router.push({
        path: "/vipMange/roomManagement/checkTheTtemsmentList",
        query: {
          roomId: this.roomId
        }
      });
    },
    getSystemnum() {
      getSystemTime({ configKey: "auction_continued_time" }).then(res => {
        if (res.code == 0) {
          console.log(res, "系统时间");
          this.systemTime = res.data;
        }
      });
    }
  }
};
</script>
<style>
.addGoodsImage {
  width: 80px;
  height: 80px;
}
</style>
<style lang="scss" scoped>
.table-btn {
  cursor: pointer;
}
.btn-red {
  color: #f56c6c;
}
.btn-blue {
  color: #409eff;
}
.item-inputs {
  width: 450px;
}
.table-paging {
  display: flex;
  justify-content: flex-end;
}
.search-content-dialog {
  display: block;
  margin-bottom: 24px;
  .item {
    display: inline-block;
    width: 40%;
    margin-bottom: 24px;
    margin-right: 1%;
  }
  .item:first-child {
    width: 40%;
  }
  .item-title {
    font-size: 14px;
  }
  .item-input {
    width: 220px;
    display: inline-block;
  }
}
.t .headQuarters-addOrEdit {
  padding: 24px;
  .title {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    margin-bottom: 40px;
  }
  .title::before {
    content: "";
    display: inline-block;
    height: 16px;
    width: 2px;
    background: #409eff;
    margin-right: 6px;
  }
  .addOrEdit-content {
    padding: 0 24px;
    .item-input {
      width: 400px;
    }
  }
  .table-search {
    display: block;
    margin-bottom: 24px;
    .item {
      display: inline-block;
      width: 24%;
      margin-bottom: 24px;
      margin-right: 1%;
    }
    .item:last-child {
      display: inline-block;
      width: 20%;
      margin-bottom: 24px;
    }
    .item-title {
      font-size: 14px;
    }
    .item-picker {
      width: 300px;
    }
    .item-inputs {
      width: 200px;
      display: inline-block;
    }
  }
  .tablelist {
    .list {
      margin-bottom: 30px;
    }
  }
  .table-paging {
    display: flex;
    justify-content: flex-end;
  }
  .addGoodsImage {
    width: 70px;
    height: 70px;
  }
}
</style>
