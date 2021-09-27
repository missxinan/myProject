<template>
  <div>
    <div class="Flex filter-container">
      <div class="ax_200">
        <el-date-picker
          v-model="listQuery.startTimeValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始创建时间"
          end-placeholder="结束创建时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="ax_200">
        <el-date-picker
          v-model="listQuery.UpDay"
          type="daterange"
          range-separator="~"
          start-placeholder="上拍开始时间"
          end-placeholder="上拍结束时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="ax_200">
        <div class="block">
          <el-cascader
            placeholder="请选择商品分类"
            :options="options"
            :props="Props"
            v-model="listQuery.cascade"
            clearable
          ></el-cascader>
        </div>
      </div>

      <div class="ax_200">
        <el-input v-model="listQuery.goodsName" clearable placeholder="请输入内容商品名称"></el-input>
      </div>
      <div class="ax_200">
        <el-input v-model="listQuery.goodsId" clearable placeholder="请输入内容商品ID"></el-input>
      </div>
      <div class="ax_200">
        <el-select v-model="listQuery.status" clearable placeholder="请选择商品状态">
          <el-option
            v-for="item in Sources"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="ax_200 right">
        <el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchTitle">搜索</el-button>
        <el-button style="height:40px" @click="reset">重置</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="width:100%"
      max-height="700"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'startTime', order: 'descending'}"
      @sort-change="selectSort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="商品信息" align="center" width="260">
        <template slot-scope="scope">
          <div class="goodsInfo_wrap">
            <div class="goodsImg_wrap">
              <img class="goods_image" :src="scope.row.logo" />
            </div>
            <div class="goods_right">
              <span
                class="goods_name"
                @click="seeDetail(scope.row.goodsId)"
                style="cursor: pointer;color: #2196F3;"
              >{{ scope.row.goodsName }}</span>
              <span>{{ scope.row.goodsId }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品类别" align="center">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>
      <el-table-column label="成本价" align="center">
        <template slot-scope="scope">{{ scope.row.costPrice }}</template>
      </el-table-column>
      <!-- <el-table-column label="供应商" align="center">
        <template slot-scope="scope">{{scope.row.supplier}}</template>
      </el-table-column>
      <el-table-column label="总库存" align="center">
        <template slot-scope="scope">{{scope.row.inventory}}</template>
      </el-table-column>
      <el-table-column label="可用库存" align="center">
        <template slot-scope="scope">{{(scope.row.inventory) - (scope.row.soldNum)}}</template>
      </el-table-column> -->
      <el-table-column label="拍卖次数" align="center">
        <template slot-scope="scope">{{scope.row.mailingCount}}</template>
      </el-table-column>
      <el-table-column label="上拍时间" width="100" align="center">
        <template slot-scope="scope">{{scope.row.upDay ? scope.row.upDay.split(' ')[0] : '' }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="100" align="center">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="修改时间" width="100" align="center">
        <template slot-scope="scope">{{scope.row.updateTime}}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div v-if=" scope.row.status == 1">下架</div>
          <div v-if=" scope.row.status == 2">上架</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="text"
            size="mini"
            style="color:#67C23A;"
            v-if="mallpops == 0 && checkPermission(['goods:sendPro:upDawn'])"
            @click="soldoutl(row)"
          >{{ row.status == 1 ? '上架' : '下架' }}</el-button>
          <el-button
            type="text"
            size="mini"
            style="color:#F56C6C;"
            v-if="mallpops == 0 && checkPermission(['goods:sendPro:closeAuction'])"
            @click="Thesequence(row)"
          >关闭竞拍</el-button>
          <el-button
            type="text"
            size="mini"
            v-if="mallpops == 0 && row.status == 1 && checkPermission(['goods:sendPro:edit'])"
            @click="Jumpfordetails(row.goodsId)"
            style="margin:1px"
          >编辑</el-button>
          <!-- <el-button type="text" size="mini" @click="copy(row.goodsId)">查看</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.size"
      :page.sync="listQuery.current"
      @pagination="search"
    />
    <el-dialog title="修改库存" :visible.sync="dialogFormVisible">
      <div class="Shopping">商品名称： {{debuggers.shoppingname}}</div>
      <div class="Setweight Shopping">
        总库存：
        <el-input v-model="Setweight" style="width:50%"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sortSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="下架" :visible.sync="soldOut">
      <div>{{Informationfromtheshelves}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="soldOut = false">取 消</el-button>
        <el-button type="primary" @click="Sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/table";

//分页控制
import Pagination from "@/components/Pagination";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数
//树形遍历列表
import { treeApi } from "@/api/AuctionsRecord.js";
import {
  goodsInfolist,
  downGoodsInfo,
  settingSort,
  upperGoodsInfo,
  closeGoodsInfo,
  batchUpperGoodsInfo,
  batchDownGoodsInfo
} from "@/api/platcommoditymanagement.js";
import { exportBlob } from "@/api/blob";
const Sources = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 2,
    label: "上架"
  },
  {
    value: 1,
    label: "下架"
  }
];
const shoppingStatus = [
  {
    value: 1,
    label: "待上架"
  },
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
    value: 6,
    label: "下架"
  }
];

export default {
  components: {
    Pagination,
    permission
  },
  props: {
    mallpops: {
      type: Number,
      require: true
    }
  },
  name: "commodityListDel",
  data() {
    return {
      //
      //调试
      debuggers: {
        shoppingname: "",
        weight: "",
        id: ""
      },

      sortNo: "", //排序
      Informationfromtheshelves: "",
      //将来下架商品ID
      goodsId: "",
      dialogFormVisible: false,
      soldOut: false,
      Setweight: "",
      list: null,
      listLoading: true,
      props: {
        multiple: true
      },
      //商品来源
      Sources,
      shoppingStatus,
      //----
      total: 1,
      listQuery: {
        current: 1,
        size: 10,
        start: "",
        end: "",
        productName: "",
        sources: "",
        startTimeValue: "",
        finishTimeValue: "",
        goodsStatus: "",
		    UpDay:[],
        cascade: [],
        timeSort: 2, //时间排序
        goodsType: 1,
        source: 1,
      },
      // listQuery: {
      //   start: "",
      //   end: "",
      //   productName: "",
      //   sources: "",
      //   startTimeValue: "",
      //   finishTimeValue: "",

      // },
      //商品分类
      Props: {
        value: "categoryId",
        label: "name",
        children: "subCategorys",
        checkStrictly: "true"
      },
      // 级联框
      Cascadebox: [],
      options: [],
      classifyvalue1: "",
      //商品分类
      test: [],
      classifyvalue2: "",
      //商品搜索点击分页切换功能
      searchPagein: null,
      // 多选数据
      handleSelection: []
    };
  },
  created() {
    let date = new Date()
    let year = date.getFullYear().toString()
    let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString()
    let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate().toString()
    let beg = year + '-' + month + '-' + day
    this.listQuery.UpDay = [beg,beg]
    this.getList();
    // 分类数据
    this.getClassData();
  },
  mounted(){
    // let data = new Date()

  },
  activated() {
    // isUseCache为false时才重新刷新获取数据
    // 因为对list使用keep-alive来缓存组件，所以默认是会使用缓存数据的
    if (!this.$route.meta.isUseCache) {
      console.log(333, "Hello");
      (this.listQuery = {
        start: "",
        end: "",
        productName: "",
        sources: "",
        startTimeValue: "",
        finishTimeValue: "",
        goodsStatus: "",
        cascade: []
      }),
        // 这是我们获取数据的函数
        (this.$route.meta.isUseCache = false);
    } else {
      if (sessionStorage.getItem("production")) {
        this.listQuery = JSON.parse(sessionStorage.getItem("production"));
      } else {
        console.log("Hello,World!");
      }
    }
  },
  methods: {
    checkPermission,
    //排序
    selectSort(val) {
      let sortType = val.order;
      let sortProp = val.prop;
      if (sortProp == "startTime") {
        if (sortType == "ascending") {
          this.listQuery.timeSort = 1;
        } else if (sortType == "descending") {
          this.listQuery.timeSort = 2;
        }
        this.sortNo = "";
      } else if (sortProp == "sort") {
        if (sortType == "ascending") {
          this.sortNo = 1;
        } else if (sortType == "descending") {
          this.sortNo = 2;
        }
        this.listQuery.timeSort = "";
      }
      this.getList();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    exit() {},
    copy(Id) {
      //copy代码
      this.$router.push({
        path: "/storeManagement/productiondetail",
        query: {
          goodsId: Id,
          see: "see"
        }
      });
      // this.$router.push(`/storeManagement/commodity/commodityAdd?goodsId=${Id}`);
    },
    Jumpfordetails(Id) {
      //sessionStorage.setItem('production',JSON.stringify(this.listQuery));
      // this.$router.push(`/storeManagement/commodity/commodityAdd?goodsId=${Id}`);
      //let routeData = this.$router.resolve({ path: '/storeManagement/commodity/commodityAdd', query: {  goodsId:Id  } });
      this.$router.push({
        path: "/storeManagement/productiondetail",
        query: {
          goodsId: Id,
          edit: "edit"
        }
      });
    },
    sortSure() {
      if (this.Setweight == "") {
        console.error("");
      } else {
        settingSort({
          goodsId: this.debuggers.id,
          num: this.Setweight
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
        this.Setweight = "";
      }

      this.dialogFormVisible = false;
    },
    //不确定接口
    Sure() {
      if (this.setStatus == 2) {
        upperGoodsInfo({
          goodsId: this.goodsId
        }).then(res => {
          if (res.code == 0) {
            // this.list.some((item,index)=>{
            //    if(item.goodsId == this.goodsId){
            //        item.status = 6
            //        return true
            //    }
            //})
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
            //location.reload();
          } else {
            this.$message(res.msg);
            // location.reload();
          }
          this.soldOut = false;
        });
      } else {
        downGoodsInfo({
          goodsId: this.goodsId
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$message(res.msg);
            // location.reload();
          }
          this.soldOut = false;
        });
      }
    },
    soldoutl(row) {
      this.soldOut = true;
      this.Informationfromtheshelves =
        "确定要下架(上架)" + row.goodsName + "商品么？";
      this.goodsId = row.goodsId;
      if (row.status == 1) {
        this.setStatus = 2;
      } else if (row.status == 2) {
        this.setStatus = 1;
      }
    },
    //调序
    Thesequence(row) {
      console.log(row, "row");
      this.$confirm("此操作将关闭竞拍, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        closeGoodsInfo({ goodsId: row.goodsId }).then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.search();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      });
    },
    //下架
    handleChange(value) {
      console.log("Hello,world!");
    },
    soldout(row) {
      this.soldOut = true;
    },
    getList() {
      this.listLoading = true;
      let obj = this.requestQueryDeal();
      obj.size = this.listQuery.size;
      obj.current = this.listQuery.current;
      obj.source = 1;
      obj.mailingStatus = this.mallpops;
      console.log(obj, "obj");
      // delete obj.limit;
      // delete obj.page;

      goodsInfolist(obj).then(res => {
        if (res.code == 0) {
          this.list = res.data.records;
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message(res.msg);
        }
      });
    },
    getClassData() {
      treeApi({ type: 1 }).then(res => {
        if (res.code == 0) {
          console.log(res, "分类数据");
          this.options = this.delNullCategory(res.data);
        }
      });
    },
    // 数据处理
    delNullCategory(data) {
      data.map(item => {
        if (item.subCategorys && item.subCategorys.length <= 0) {
          delete item.subCategorys;
        } else {
          this.delNullCategory(item.subCategorys);
        }
      });
      return data;
    },
    fliterfunc(Obj) {
      for (let key in Obj) {
        if (Obj[key]) {
          if (Object.prototype.toString.call(Obj[key]) == "[object String]") {
            if (Obj[key].indexOf("NaN") != -1) {
              delete Obj[key];
            } else {
              Obj[key] = Obj[key];
            }
          } else {
            Obj[key] = Obj[key];
          }
        } else {
          delete Obj[key];
        }
      }
      console.log(Obj, "处理后");
      return Obj;
    },
    Flagfunc() {
      let Flag = null;
      let Basic = false;
      if (this.listQuery.cascade.length === 0) {
        Flag = "";
      } else {
        if (this.listQuery.cascade.length > 1) {
          Flag = this.listQuery.cascade[0][0];
          for (let i = 0; i < this.listQuery.cascade.length; i++) {
            this.listQuery.cascade[i].some((item, index) => {
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
                if (
                  item.children.length === this.listQuery.cascade.length
                ) {
                  Flag = this.listQuery.cascade[0][0];
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
          if (this.listQuery.cascade[0].length > 1) {
            Flag = this.listQuery.cascade[0][1];
          } else {
            Flag = this.listQuery.cascade[0][0];
          }
        }
      }
      return Flag;
    },
    searchTitle() {
      this.listQuery.current = 1;
      this.search();
    },
    search() {
      console.log(this.listQuery.cascade, "777");
      this.listLoading = true;
      let categoryId = null;
      let Basic = false;
      // if (
      //   this.listQuery.cascade.length &&
      //   this.listQuery.cascade.length > 0
      // ) {
      //   categoryId = this.listQuery.cascade[
      //     this.listQuery.cascade.length - 1
      //   ];
      // }
      let Obj = this.requestQueryDeal();
      //最终请求
      goodsInfolist(Obj).then(res => {
        if (res.msg === "success") {
          this.list = res.data.records;
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message(res.msg + "请输入有效值！");
        }
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
    reset() {
      for (var key in this.listQuery) {
        if( key == 'size' || key == 'current' ){
          continue
        }
        this.listQuery[key] = "";
      }
    },
    // 请求参数处理
    requestQueryDeal(){
      let categoryId = null;
      let Basic = false;
      if (
        this.listQuery.cascade.length &&
        this.listQuery.cascade.length > 0
      ) {
        categoryId = this.listQuery.cascade[
          this.listQuery.cascade.length - 1
        ];
      }
      let Obj = this.fliterfunc({
        categoryId,
        current: this.listQuery.current,
        size: this.listQuery.size,
        status: this.listQuery.status,
        goodsName: this.listQuery.goodsName,
        goodsId: this.listQuery.goodsId,
        startTime:
          this.listQuery.startTimeValue === "" ||
          this.listQuery.startTimeValue === null ||
          this.listQuery.startTimeValue === undefined
            ? ""
            : this.listQuery.startTimeValue[0],
        endTime:
          this.listQuery.startTimeValue === "" ||
          this.listQuery.startTimeValue === null ||
          this.listQuery.startTimeValue === undefined
            ? ""
            : this.listQuery.startTimeValue[1],
        startUpDay: this.listQuery.UpDay
          ? this.listQuery.UpDay[0]
          : undefined,
        endUpDay: this.listQuery.UpDay
          ? this.listQuery.UpDay[1]
          : undefined,
        goodsType: 1,
        timeSort: this.listQuery.timeSort,
        sortNo: this.sortNo,
        source: 1,
        mailingStatus: this.mallpops == 0 ? "0" : this.mallpops,
        supplierId: this.listQuery.supplier
      });
      return Obj
    },
    //商品多选上下架
    handleSelectionChange(e) {
      this.handleSelection = e;
      console.log(e);
    },
    callBackPageUp() {
      if (this.handleSelection.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return;
      }
      this.$confirm("是否批量上架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log("点击了批量上架");
        if (this.handleSelection.length <= 0) {
          this.$message.error("请选择批量操作的数据");
        } else {
          let arr = [];
          this.handleSelection.map(item => {
            if (item.status == 1) {
              arr.push(item.goodsId);
            }
          });
          if (arr.length <= 0) {
            this.$message.error("没有可上架的商品");
          } else {
            arr = arr.join(",");
            batchUpperGoodsInfo({ goodsIds: arr }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        }
      });
    },
    callBackPageDown() {
      if (this.handleSelection.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return;
      }
      this.$confirm("是否批量下架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.handleSelection.length <= 0) {
          this.$message.error("请选择批量操作的数据");
        } else {
          let arr = [];
          this.handleSelection.map(item => {
            if (item.status == 2) {
              arr.push(item.goodsId);
            }
          });
          if (arr.length <= 0) {
            this.$message.error("没有可下架的商品");
          } else {
            arr = arr.join(",");
            batchDownGoodsInfo({ goodsIds: arr }).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        }
      });
    },
    // 商品详情
    seeDetail(Id) {
      this.$router.push({
        path: "/storeManagement/commodityListDetail",
        query: {
          goodsId: Id,
          see: "see"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.Shopping {
  line-height: 37px;
}

.Setweight {
  display: flex;
}

.image {
  width: 80px;
  height: 80px;
}

.Flex {
  display: flex;
  flex-wrap: wrap;
}

.ax_200 {
  // width: 25%;
  height: 50px;
  margin-left: 10px;
  // margin-top: 10px;
  display: flex;
}

.ax_200 span {
  line-height: 43px;
  font-size: 15px;
  color: #333;
  font-weight: 400;
}

.ax_200 span:nth-child(1) {
  width: 100px;
}

.search-content {
  display: block;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .item {
    display: inline-block;
    width: 30%;
    margin-bottom: 24px;
    margin-right: 1%;
    display: flex;
  }

  .item:first-child {
    width: 25%;
  }

  .item-title {
    font-size: 14px;
    line-height: 40px;
  }

  .item-picker {
    width: 300px;
  }

  .item-input {
    width: 220px;
    display: inline-block;
  }
}
</style>
