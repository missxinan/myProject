<template>
  <div class="container">
    <div class="out-line">
      <div class="Flex">
        <div class="ax_200">
          <span class="shoppingnames">商品名称:</span>
          <p class="shoppingname">{{obj.goodsName}}</p>
        </div>
        <div class="ax_200">
          <span>分类:</span>
          <p>{{obj.categoryName}}</p>
        </div>
        <div class="ax_200">
          <span>来源:</span>
          <p v-if="obj.source === 1">商城</p>
          <p v-if="obj.source === 2">平台</p>
          <p v-if="obj.source === 3">旗舰店</p>
        </div>
        <div class="ax_200" v-if="obj.status === 4 || obj.status === 5 || obj.status === 6">
          <span>交割价:</span>
          <p>{{obj.transactionPrice}}</p>
        </div>
        <div class="ax_200">
          <span>起拍价:</span>
          <p>{{obj.startPrice}}</p>
        </div>
        <div class="ax_200">
          <span>最低保护价:</span>
          <p>{{obj.protectPrice}}</p>
        </div>
        <div class="ax_200">
          <span>最高保护价:</span>
          <p>{{obj.maxProtectPrice}}</p>
        </div>
        <div class="ax_200">
          <span>加价幅度:</span>
          <p>{{obj.markupPrice}}</p>
        </div>
        <div class="ax_200">
          <span>佣金:</span>
          <p>{{obj.brokerage}}</p>
        </div>
        <div class="ax_200" v-if="obj.displayArea == 3">
          <span>VIP编号:</span>
          <p>{{obj.roomNumber}}</p>
        </div>
        <div class="ax_200" style="width:33%">
          <span>拍卖时间:</span>
          <p>{{obj.startTime}}~{{obj.endTime}}</p>
        </div>
        <el-button
          type="primary"
          size="mini"
          style="height:30px;margin-top:10px;"
          v-if="obj.status === 4 && obj.orderId != null"
          @click="toOrder(obj.orderId)"
        >查看订单</el-button>
      </div>
      <div class="title">
        <div class="box" v-if="obj.status === 1">待上架</div>
        <div class="box" v-if="obj.status === 2">预展</div>
        <div class="box" v-if="obj.status === 3">竞拍中</div>
        <div class="box" v-if="obj.status === 4">已售</div>
        <div class="box" v-if="obj.status === 5">已流拍</div>
        <div class="box" v-if="obj.status === 6">下架</div>
        <div class="box" v-if="obj.status === 7">已关闭</div>
      </div>
    </div>
    <div>
      <div v-if="flag">
        <div class="selllist">
          <div class="selllist_box">
            <div class="sellbox_small_head marginTop">
              <span>{{time.endTime}}</span>
              <span>截拍</span>
            </div>
            <div class="sellbox_list">
              <div class="sellevery" v-for="(item,index) in list" :key="index">
                <dl class="sellevery_dl">
                  <dt>
                    <img :src="item.avatar" alt="图片报错" class="Dis" />
                  </dt>
                  <dd>
                    <div>
                      <!-- <span><img :src="item.avatar" alt="图片报错"></span> -->
                      <span>{{item.userName}}</span>
                    </div>
                    <div>
                      <span>{{item.markupTime}}</span>
                      <span>出价</span>
                    </div>
                  </dd>
                </dl>
                <div class="sellevery_price">
                  <div class="fontweightbig">
                    ￥
                    <span>{{item.payPrice}}</span>
                  </div>
                  <div>
                    保证金:
                    <span>{{item.guarantyPrice}}</span>
                  </div>
                </div>

                <div class="position_zd" v-if="item.userType === 2">
                  <div v-if="item.userType === 2">自动</div>
                </div>
              </div>
            </div>
            <div class="sellbox_small_head">
              <span>{{time.startTime}}</span>
              <!-- <span>16:00</span> -->
              <span>起拍</span>
            </div>
            <!-- <div class="reload_button" @click="reaload">
                        刷新
            </div>-->
            <el-button class="reload_button" type="primary" @click="reaload">刷新</el-button>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="content">
          <span>出价总次数:{{data.total}}</span>
          <span>用户出价次数:{{Totalnumberofuserbids}}</span>
        </p>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="出价信息" name="first">
            <!-- 将来的动态data值 -->
            <el-table
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              style="margin-top:10px;"
            >
              <el-table-column align="center" label="出价时间" width="95">
                <template slot-scope="scope">{{ scope.row.markupTime }}</template>
              </el-table-column>
              <el-table-column label="竞价ID">
                <template slot-scope="scope">{{ scope.row.auctionDetailId }}</template>
              </el-table-column>
              <el-table-column label="类型" align="center">
                <template slot-scope="scope">{{scope.row.userType === 1?'用户':'自动'}}</template>
              </el-table-column>
              <el-table-column label="商品名称" align="center">
                <template>{{ obj.goodsName }}</template>
              </el-table-column>
              <el-table-column label="参与用户" align="center">
                <template slot-scope="scope">
                  <span
                    @click="nickNameClick(scope.row)"
                    style="cursor: pointer;color: #0066CC;"
                  >{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户Id" align="center">
                <template slot-scope="scope">
                  <span
                    @click="nickNameClick(scope.row)"
                    style="cursor: pointer;color: #0066CC;"
                  >{{scope.row.userId}}</span>
                </template>
              </el-table-column>
              <el-table-column label="出价金额" align="center">
                <template slot-scope="scope">{{ scope.row.payPrice }}</template>
              </el-table-column>
              <el-table-column label="保证金" align="center">
                <template slot-scope="scope">{{ scope.row.guarantyPrice}}</template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :limit.sync="listQuery.limit"
              :page.sync="listQuery.page"
              @pagination="getList"
            />
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="second">
            <div>
              积分赠送类型：
              <span v-if="goodsInfo.integralType == 0 ">无积分</span>
              <span v-if="goodsInfo.integralType == 1 ">全额积分</span>
              <span v-if="goodsInfo.integralType == 2 ">超值积分</span>
            </div>
            <el-table
              v-if="goodsInfo.integralType == 2 "
              style="margin-top:20px"
              element-loading-text="Loading"
              border
              :data="goodsList"
              highlight-current-row
            >
              <el-table-column label="序号" type="index" width="60px"></el-table-column>
              <el-table-column prop="integralRatio" label="积分赠送比例"></el-table-column>
              <el-table-column prop="worthRatio" label="超值积分赠送比例"></el-table-column>
              <el-table-column prop="auctionMealGoodsVoList" label="赠送商品">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.auctionMealGoodsVoList" :key="index">
                    <!-- <div style="width:50px">
                      <img :src="item.logo" alt style="width:100%" />
                    </div> -->
                    <span>{{item.mallGoodsName}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  auctionRecordInfodetail,
  ByAuctionId,
  auctionRecordInfodetail_goodsInfo
} from "@/api/AuctionsRecord";
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
export default {
  name: "auctionsRecordDetail",
  components: { Pagination },
  data() {
    return {
      list: [],
      obj: {},
      flag: false,
      data: {},
      datalist: [],
      Totalnumberofuserbids: 0,
      tableData: [],
      time: {
        startTime: "",
        endTime: ""
      },
      total: 1,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      listLoading: false,
      activeName: "first",
      goodsInfo: {},
      goodsList: []
    };
  },
  methods: {
    reaload() {
      this.getList();
    },
    nickNameClick(row) {
      this.$router.push({
        path: "/users/userDetail",
        query: { userId: row.userId }
      });
    },
    getList() {
      this.listLoading = true;
      auctionRecordInfodetail({
        current: this.listQuery.page,
        size: this.listQuery.limit,
        auctionId: this.$route.query.auctionId
      }).then(res => {
        console.log(res, "resres");
        switch (res.data.status) {
          case 1:
            this.flag = true;
            break;
          case 2:
            this.flag = true;
            break;
          case 3:
            this.flag = true;
            break;
          case 4:
            this.flag = false;
            break;
          case 5:
            this.flag = false;
            break;
          case 6:
            this.flag = false;
            break;
          default:
            this.flag = true;
        }
        this.obj = res.data;
        this.time.startTime = res.data.startTime;
        this.time.endTime = res.data.endTime;
        console.log(res, "555");
      });

      ByAuctionId({
        current: this.listQuery.page,
        size: this.listQuery.limit,
        auctionId: this.$route.query.auctionId
      }).then(res => {
        console.log(res, "resresrerlist");
        this.data = res.data.iPage;
        this.datalist = res.data.iPage.records;
        this.list = res.data.iPage.records;
        this.Totalnumberofuserbids = res.data.userCount;
        this.total = Number(res.data.iPage.total);
        this.listLoading = false;
      });
    },
    toOrder(orderId) {
      this.$router.push(`/orderManagement/detail?orderId=${orderId}`);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  created() {
    this.listLoading = true;
    auctionRecordInfodetail({
      current: this.listQuery.page,
      size: this.listQuery.limit,
      auctionId: this.$route.query.auctionId
    }).then(res => {
      console.log(res, "777");
      switch (res.data.status) {
        case 1:
          this.flag = true;
          break;
        case 2:
          this.flag = true;
          break;
        case 3:
          this.flag = true;
          break;
        case 4:
          this.flag = false;
          break;
        case 5:
          this.flag = false;
          break;
        case 6:
          this.flag = false;
          break;
        default:
          this.flag = true;
      }
      this.obj = res.data;
      this.time.startTime = res.data.startTime;
      this.time.endTime = res.data.endTime;
    });
    ByAuctionId({ auctionId: this.$route.query.auctionId }).then(res => {
      // console.log(res, "999999");
      this.data = res.data.iPage;
      this.datalist = res.data.iPage.records;
      this.list = res.data.iPage.records;
      this.Totalnumberofuserbids = res.data.userCount;
      this.total = Number(res.data.iPage.total);
      this.listLoading = false;
    });
    auctionRecordInfodetail_goodsInfo({
      current: this.listQuery.page,
      size: this.listQuery.limit,
      auctionId: this.$route.query.auctionId
    }).then(res => {
      this.goodsInfo = res.data;
      this.goodsList = res.data.auctionMealViewVoList;
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.shoppingname {
  height: 35px;
  width: 115px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.shoppingnames {
  width: 75px;
}
.Dis {
  width: 50px;
  height: 50px;
  background: gray;
  border-radius: 50%;
}
.content {
  width: 100%;
  height: 20px;
  display: flex;
}
.content span {
  display: inline-block;
  margin-left: 20px;
}
.marginTop {
  margin-top: 20px;
}
.selllist {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #f3f3f3;
  position: relative;
  .selllist_box {
    background: white;
    width: 100%;
    height: 500px;
    margin: 0 auto;
    padding: 15px 30px;
    border: 1px solid rgb(224, 219, 219);
    border-radius: 10px;
    overflow-y: scroll;
    .sellbox_small_head {
      width: 950px;
      height: 50px;
      line-height: 50px;
      color: #666666;
      padding: 0 30px;
      border-radius: 10px;
      border: 1px solid rgb(224, 219, 219);
    }
    .sellevery {
      width: 950px;
      height: 100px;
      border-radius: 10px;
      border: 1px solid rgb(224, 219, 219);
      margin-top: 15px;
      padding: 0 30px;
      color: #666666;
      position: relative;
      overflow: hidden;
      .sellevery_dl {
        display: flex;
        width: 50%;
        dt {
          width: 50px;
          height: 50px;
          background: gray;
          border-radius: 50%;
          margin-top: 20px;
        }
        dd {
          flex: 1;
          margin-left: 25px;
          margin-top: 20px;
          font-size: 15px;
          div {
            line-height: 30px;
          }
        }
      }
      .sellevery_price {
        position: absolute;
        right: 50px;
        bottom: 0;
        div {
          line-height: 35px;
        }
        .fontweightbig {
          font-size: 20px;
          color: black;
        }
      }
      .position_zd {
        width: 200px;
        height: 100px;
        position: absolute;
        background: #ffffcd;
        left: -10px;
        top: 80px;
        transform: rotate(10deg);
        padding-left: 30px;
        line-height: 10px;
        div {
          transform: rotate(-10deg);
        }
      }
    }
  }
  .reload_button {
    position: absolute;
    right: 100px;
    top: 60px;
  }
}
.box {
  width: 200px;
  height: 50px;
  border: 1px solid #ccc;
  // background: green;
  transform: rotate(21deg);
  margin-left: 39px;
  margin-top: 40px;
  text-align: center;
  line-height: 50px;
}
.ax_200 {
  width: 21%;
  height: 7px;
  margin-left: 4px;
  margin-top: -5px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.ax_200 span {
  line-height: 50px;
}
.out-line {
  width: 100%;
  height: 135px;
  // background: red;
  display: flex;
  border-bottom: 1px solid #ccc;
}
.title {
  width: 20%;
  height: 100%;
  // background: orange;
}
.Flex {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  height: 100%;
  border-right: 1px solid #ccc;
  // background: green;
}
</style>
