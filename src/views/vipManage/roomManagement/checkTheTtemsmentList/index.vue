<template>
  <div class="headQuarters-list">
    <div class="add-company">
      <el-button type="primary" @click="addAuction">新增拍卖</el-button>
      <span style="margin-left:50px">旗舰店名称: {{ name}} </span>
    </div>
    <div class="search-content">
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="grid-content">
            <!-- <span class="item-title item-label">开拍时间：</span> -->
            <el-date-picker
              class="item-picker"
              v-model="searchParam.time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="拍卖开始日期"
              end-placeholder="拍卖结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <!-- <span class="item-title item-label">商品名称：</span> -->
            <el-input class="item-input" v-model="searchParam.goodsName" placeholder="请输入商品名称"></el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <!-- <span class="item-title item-label">状态:</span> -->
            <el-select v-model="searchParam.status" placeholder="请选择状态">
              <el-option
                v-for="item in shoppingStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <!-- <span class="item-title item-label">商品分类:</span> -->
            <el-cascader
              v-model="searchParam.cascade"
              :options="options"
              :props="props"
              collapse-tags
              placeholder="请选择商品分类"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <!-- <span class="item-title item-label source">来源:</span> -->
            <el-select v-model="searchParam.source" placeholder="请选择来源">
              <el-option
                v-for="item in Sources"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" class @click="search">搜索</el-button>
          <el-button type="primary" class @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20" class="marginTop25">
        
      </el-row>-->
    </div>
    <div class="tablelist">
      <el-table
        :data="dataList"
        border
        @sort-change="tableSortChange"
        class="list"
        style="width: 100%"
        max-height="650"
      >
        <el-table-column prop="auctionId" align="center" label="记录ID"></el-table-column>
        <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="logo" align="center" label="商品图片">
          <template slot-scope="scope">
            <el-avatar shape="square" :size="100" fit="cover" :src="scope.row.logo"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" align="center" label="商品类别"></el-table-column>
        <el-table-column prop="startPrice" align="center" label="起拍价格"></el-table-column>
        <el-table-column prop="markupPrice" align="center" label="加价"></el-table-column>
        <el-table-column prop="protectPrice" align="center" label="最低保护价"></el-table-column>
        <el-table-column prop="maxProtectPrice" align="center" label="最高保护价"></el-table-column>
        <el-table-column prop="assessPrice" align="center" label="估值"></el-table-column>
        <el-table-column prop="startTime" align="center" sortable label="开拍时间"></el-table-column>
        <el-table-column prop="endTime" align="center" label="截拍时间"></el-table-column>
        <el-table-column prop="status" align="center" label="商品状态">
          <template slot-scope="scope">
            <div v-if="1 === scope.row.status">上架</div>
            <div v-if="2 === scope.row.status">预展</div>
            <div v-if="3 === scope.row.status">竞拍中</div>
            <div v-if="4 === scope.row.status">已售</div>
            <div v-if="5 === scope.row.status">已流拍</div>
            <div v-if="6 === scope.row.status">下架</div>
            <div v-if="7 === scope.row.status">已关闭</div>
          </template>
        </el-table-column>
        <el-table-column prop="openRobot" align="center" label="机器人状态">
          <template slot-scope="scope">
            <el-tag
              :type=" scope.row.openRobot == 0 ? 'warning' : ''"
            >{{ scope.row.openRobot == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="seeDetails(scope.row)">查看</span>

              <span
                class="table-btn btn-red"
                v-if="scope.row.openRobot == 1 && scope.row.status == 2"
                @click="openAndDisRobot(scope.row)"
              >机器人禁用</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openRobot == 0 && scope.row.status == 2"
                @click="openAndDisRobot(scope.row)"
              >机器人启用</span>
              <span
                class="table-btn btn-blue"
                v-if="7 !== scope.row.status && (scope.row.status == 2 || scope.row.status == 3)"
                @click="closeAuction(scope.row)"
              >关闭拍卖</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.status == 2"
                @click="editPrice(scope.row)"
              >修改保护价</span>
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
    <el-dialog
      :title="robotTitle"
      :visible.sync="isRobot"
      width="30%"
      :before-close="closeRoboting"
    >
      <div>确定要{{robotTitle}}机器人吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRoboting">取 消</el-button>
        <el-button type="primary" @click="confirmRoboting">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭拍卖" :visible.sync="isAuction" width="30%" :before-close="closeAuctioning">
      <div>确定要关闭拍卖吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAuctioning">取 消</el-button>
        <el-button type="primary" @click="confirmAuctioning">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改保护价" :visible.sync="isPrice" width="30%" :before-close="noprice">
      <el-form
        :model="priceForm"
        :rules="priceFormRules"
        ref="priceForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称">
          <span>{{currentOwner.goodsName}}</span>
        </el-form-item>
        <el-form-item label="起拍价" prop="startPrice" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入起拍价"
            v-model="priceForm.startPrice"
            maxlength="12"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="最低保护价" prop="protectPrice" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入最低保护价"
            v-model="priceForm.protectPrice"
            maxlength="12"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="最高保护价" prop="maxProtectPrice" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入最高保护价"
            v-model="priceForm.maxProtectPrice"
            maxlength="12"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="估值" prop="assessPrice" required>
          <el-input
            class="item-input"
            type="number"
            placeholder="请输入估值(纯数字）"
            v-model="priceForm.assessPrice"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="加价幅度" prop="markupPrice" required>
          <el-input
            class="item-input"
            type="number"
            placeholder="请输入加价幅度(纯数字）"
            v-model="priceForm.markupPrice"
            maxlength="30"
            show-word-limit
            @input="markupPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="佣金">
          <el-input
            class="item-input"
            type="text"
            v-model="priceForm.brokerage"
            readonly
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noprice">取 消</el-button>
        <el-button type="primary" @click="confirmPrice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  viewTheAuctionList,
  newAddAuction,
  treeApi,
  updateOpendRobot,
  closeAuction,
  editProtectPrice
} from "@/api/vipMange.js";
export default {
  name: "headQuartersList",
  data() {
    return {
      roomId: "", // 房间id
      name: "", // 店铺名称
      searchParam: {
        // 列表搜索条件
        time: "", // 开始结束时间
        source: "", // 名称/手机号/昵称
        goodsName: "",
        status: "",
        cascade: ""
      },
      assessPrice: "",
      brokerage: 0,
      dataList: [],
      size: 10,
      current: 1,
      total: 0,
      timeSort: 0, // 时间排序 0 默认 1 正序 1 倒序
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "明日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //商品来源
      Sources: [
        {
          value: 2,
          label: "平台"
        },
        {
          value: 1,
          label: "商城"
        }
      ],
      // 商品状态
      shoppingStatus: [
        {
          value: 2,
          label: "预展"
        },
        {
          value: 3,
          label: "竞拍中"
        },
        {
          value: 4,
          label: "已售"
        },
        {
          value: 5,
          label: "已流拍"
        },
        {
          value: 7,
          label: "已关闭"
        }
      ],
      //商品分类
      options: [],
      //商品分类
      test: [],
      props: {
        multiple: true
      },
      isRobot: false, // 机器人 禁用 启用
      robotTitle: "禁用",
      currentOwner: "",
      isAuction: false, // 关闭拍卖显示隐藏
      priceForm: {
        protectPrice: "",
        maxProtectPrice: "",
        markupPrice: "",
        startPrice: "",
        brokerage: 0,
        assessPrice: ""
      },
      priceFormRules: {
        startPrice: [
          {
            required: true,
            message: "请输入起拍价",
            trigger: "change"
          }
        ],
        protectPrice: [
          {
            required: true,
            message: "请输入最低保护价",
            trigger: "change"
          }
        ],
        maxProtectPrice: [
          {
            required: true,
            message: "请输入最高保护价",
            trigger: "change"
          }
        ],
        markupPrice: [
          {
            required: true,
            message: "请输入加价幅度加价",
            trigger: "change"
          }
        ],
        brokerage: [
          {
            required: true,
            message: "",
            trigger: "change"
          }
        ],
        assessPrice: [
          {
            required: true,
            message: "请输入估值（纯数字）",
            trigger: "change"
          }
        ]
      },
      // 修改保护价显示隐藏
      isPrice: false
    };
  },
  created() {
    this.roomId = this.$route.query.roomId;
    this.name = this.$route.query.name;
    this.vipId = this.$route.query.vipId;
    this.viewTheAuctionListData();
    this.getGoodList();
  },
  methods: {
    // 起拍价change 改变佣金
    markupPrice(value) {
      this.priceForm.brokerage = Number(value) * 0.1;
    },
    // 机器人禁用启用
    openAndDisRobot(row) {
      this.isRobot = true;
      this.robotTitle = row.openRobot === 1 ? "禁用" : "启用";
      this.currentOwner = row;
    },
    // 机器人取消
    closeRoboting() {
      this.isRobot = false;
      this.currentOwner = "";
    },
    // 启用禁用机器人
    confirmRoboting() {
      const param = {
        auctionId: this.currentOwner.auctionId,
        opendRobot: this.currentOwner.openRobot === 1 ? 0 : 1
      };
      updateOpendRobot(param).then(res => {
        if (res.code == 0) {
          this.$message({
            message: `${param.opendRobot === 1 ? "启用" : "禁用"}机器人成功`,
            type: "success"
          });
          this.isRobot = false;
          this.currentOwner = "";
          this.viewTheAuctionListData();
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },

    // 关闭拍卖显示
    closeAuction(row) {
      this.currentOwner = row;
      this.isAuction = true;
    },
    // 关闭拍卖
    closeAuctioning() {
      this.currentOwner = "";
      this.isAuction = false;
    },
    //  确定拍卖
    confirmAuctioning() {
      const param = {
        auctionId: this.currentOwner.auctionId
      };
      closeAuction(param).then(res => {
        if (res.code == 0) {
          this.$message({ message: "关闭拍卖成功！", type: "success" });
          this.isAuction = false;
          this.currentOwner = "";
          this.viewTheAuctionListData();
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },

    //  保护价显示
    editPrice(row) {
      this.currentOwner = row;
      this.priceForm = {
        protectPrice: row.protectPrice,
        maxProtectPrice: row.maxProtectPrice,
        markupPrice: row.markupPrice,
        startPrice: row.startPrice,
        brokerage: Number(row.markupPrice) * 0.1,
        assessPrice: row.assessPrice
      };
      this.isPrice = true;
    },
    //  关闭修改保护价
    noprice() {
      this.isPrice = false;
      this.currentOwner = "";
      this.priceForm = {};
    },
    //  确定修改保护价
    confirmPrice(row) {
      if (this.priceForm.protectPrice > this.priceForm.maxProtectPrice) {
        this.$message.error("最高保护价要大于最低保护价哦");
      } else {
        const param = {
          ...this.priceForm,
          auctionId: this.currentOwner.auctionId
        };
        editProtectPrice(param).then(res => {
          if (res.code == 0) {
            this.$message({ message: "修改保护价成功！", type: "success" });
            this.noprice();
            this.viewTheAuctionListData();
          } else {
            this.$message({ message: res.msg, type: "error" });
          }
        });
      }
    },
    //增加拍卖
    addAuction() {
      console.log("roomID", this.roomId);
      this.$router.push({
        path: "/vipMange/roomManagement/newAddAuction",
        query: { roomId: this.roomId, name: this.name ,vipId:this.vipId}
      });
    },
    //时间转换方法
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
    // 商品分类筛选 只能选一个
    Flagfunc() {
      let Flag = null;
      let Basic = false;
      if (this.searchParam.cascade.length === 0) {
        Flag = "";
      } else {
        if (this.searchParam.cascade.length > 1) {
          Flag = this.searchParam.cascade[0][0];
          for (let i = 0; i < this.searchParam.cascade.length; i++) {
            this.searchParam.cascade[i].some((item, index) => {
              if (item === Flag) {
                Basic = true;
                return true;
              } else {
                Basic = false;
                return true;
              }
            });
          }

          if (Basic) {
            let pop = false;
            this.options.some((item, index) => {
              if (item.value === Flag) {
                if (item.children.length === this.searchParam.cascade.length) {
                  Flag = this.searchParam.cascade[0][0];
                  return true;
                } else {
                  pop = true;
                  return true;
                }
              }
            });
            if (pop) {
              this.$message("商品分类只能选择一个");
              return;
            }
          } else {
            this.$message("商品分类只能选择一个");
            return;
          }
        } else {
          if (this.searchParam.cascade[0].length > 1) {
            Flag = this.searchParam.cascade[0][1];
          } else {
            Flag = this.searchParam.cascade[0][0];
          }
        }
      }
      return Flag;
    },
    viewTheAuctionListData() {
      let data = {
        roomId: this.roomId,
        current: this.current,
        size: this.size,
        startEndTime: this.searchParam.time ? this.searchParam.time[0] : "",
        endEndTime: this.searchParam.time ? this.searchParam.time[1] : "",
        goodsName: this.searchParam.goodsName || "",
        status: this.searchParam.status || "",
        source: this.searchParam.source || "",
        categoryId: this.searchParam.cascade ? this.Flagfunc() : "",
        timeSort: this.timeSort
      };
      viewTheAuctionList(data).then(res => {
        if (res.code == "00000") {
          this.dataList = res.data.records;
          this.total = Number(res.data.total);
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    getGoodList() {
      treeApi().then(res => {
        this.test = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].subCategorys.length > 0) {
            this.test.push({
              value: res.data[i].categoryId,
              label: res.data[i].name,
              children: []
            });
            for (let j = 0; j < res.data[i].subCategorys.length; j++) {
              this.test[i].children.push({
                value: res.data[i].subCategorys[j].categoryId,
                label: res.data[i].subCategorys[j].name
              });
            }
          } else {
            this.test.push({
              value: res.data[i].categoryId,
              label: res.data[i].name
            });
          }
        }
        this.options = this.test;
      });
    },

    // 搜索
    search() {
      this.current = 1;
      this.viewTheAuctionListData();
    },
    // 重置
    reset() {
      this.searchParam = {};
      this.viewTheAuctionListData();
    },
    // 查看（房间管理-->查看拍卖中的查看）
    seeDetails(row) {
      // alert(111)
      this.$router.push({
        path: "/vipMange/roomManagement/seeDetails",
        query: {
          auctionId: row.auctionId
        }
      });
    },
    // 分页
    handleCurrentChange(page) {
      this.current = page;
      this.viewTheAuctionListData();
    },
    // 条数
    handleSizeChange(page) {
      this.size = page;
      this.viewTheAuctionListData();
    },
    // 排序
    tableSortChange(data) {
      if (data.order === null) {
        this.timeSort = 0;
      } else {
        this.timeSort = data.order === "descending" ? 2 : 1;
      }
      this.viewTheAuctionListData();
    }
  }
};
</script>
<style lang="scss" scoped>
.marginTop25 {
  margin-top: 25px;
}
.grid-content {
  .item-label {
    display: inline-block;
    width: 80px;
    text-align: left;
  }
}
.headQuarters-list {
  padding: 24px;
  .add-company {
    margin-bottom: 24px;
  }
  .search-content {
    display: block;
    margin-bottom: 24px;
    .item {
      display: inline-block;
      // width: 20%;
      margin-bottom: 24px;
      // margin-right: 1%;
    }
    // .item:first-child {
    //   width: 40%;
    // }
    .item-title {
      font-size: 14px;
      // margin-right: 20px;
    }
    .today {
      margin-left: 20px;
    }
    .item-picker {
      width: 300px;
    }
    .item-input {
      width: 220px;
      display: inline-block;
    }
  }
  .classGoods {
    width: 660px !important;
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
  .passwordBomb {
    .company-name {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .name-text {
        display: inline-block;
        line-height: 40px;
      }
      .name-value {
        display: inline-block;
        width: 300px;
      }
    }
    .company-password {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-around;
      .password-text {
        display: inline-block;
        line-height: 40px;
      }
      .password-text::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
      .password-input {
        display: inline-block;
        width: 300px;
      }
    }
  }
  .table-btn {
    cursor: pointer;
  }
  .btn-red {
    color: #f56c6c;
  }
  .btn-blue {
    color: #409eff;
  }
}
</style>

