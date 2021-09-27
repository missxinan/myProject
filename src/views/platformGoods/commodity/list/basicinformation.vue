<template>
  <div>
    <div class="Flex filter-container">
      <div class="ax_200">
        <el-date-picker
          v-model="ProductionPrice.startTimeValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始创建日期"
          end-placeholder="结束创建日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </div>
<!--      <div class="ax_200">
        <div class="block">
          <el-cascader
            placeholder="请选择商品分类"
            :options="options"
            :props="Props"
            v-model="ProductionPrice.cascade"
            clearable
          ></el-cascader>
        </div>
      </div> -->
      <div class="ax_200">
        <el-input
          v-model="ProductionPrice.goodsName"
          clearable
          placeholder="请输入内容商品名称"
          style="width: 160px;"
        ></el-input>
      </div>
      <div class="ax_200">
        <el-input
          v-model="ProductionPrice.goodsId"
          clearable
          placeholder="请输入内容商品ID"
          style="width: 160px;"
        ></el-input>
      </div>
      <div class="ax_200">
        <el-select
          v-model="ProductionPrice.status"
          clearable
          placeholder="请选择商品状态"
          style="width: 160px;"
        >
          <el-option
            v-for="item in Sources"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>      
	  <div class="ax_200">
        <el-select
          v-model="ProductionPrice.types"
          clearable
          placeholder="请选择商品类型"
          style="width: 160px;"
        >
          <el-option
            v-for="item in Types"
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
      border
      max-height="700"
      fit
      highlight-current-row
      :default-sort="{prop: 'startTime', order: 'descending'}"
      @sort-change="selectSort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <!-- <el-table-column  label="序号" type="index" align="center" width="60"></el-table-column> -->
      <el-table-column label="商品信息" align="center" width="260">
        <template slot-scope="scope">
          <div class="goodsInfo_wrap">
            <div class="goodsImg_wrap">
              <img class="goods_image" :src="scope.row.logo" />
            </div>
            <div class="goods_right">
              <span
                class="goods_name"
                @click="seeDetail(scope.row)"
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
      <el-table-column label="拍卖次数" align="center">
        <template slot-scope="scope">{{scope.row.mailingCount}}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="100">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" width="100">
        <template slot-scope="scope">{{scope.row.updateTime}}</template>
      </el-table-column>
      <el-table-column label="积分比" align="center">
        <template slot-scope="scope">{{ scope.row.isGiveIntegral*1000/10 }}%</template>
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
            v-if="checkPermission(['goods:platform:forbidden'])"
            @click="soldoutl(row)"
          >{{ row.status == 1 ? '上架' : '下架' }}</el-button>
          <el-button
            type="text"
            v-if="row.status == 1"
            size="mini"
            @click="Jumpfordetails(row)"
            style="margin:1px"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            @click="copy(row)"
            v-if="checkPermission(['goods:platform:copy'])"
          >复制</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :text1="text1"
      :text2="text2"
      v-on:callBackUp="callBackPageUp"
      v-on:callBackDown="callBackPageDown"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @pagination="search"
    />

  </div>
</template>

<script>
import { getList } from "@/api/table";

//分页控制
import Pagination from "@/components/Pagination";

//树形遍历列表
import { treeApi } from "@/api/AuctionsRecord.js";
import checkPermission from "@/utils/permission";
import {
  goodsInfolist,
  downGoodsInfo,
  settingSort,
  supplierList,
  upperGoodsInfo,
  batchUpperGoodsInfo,
  batchDownGoodsInfo
} from "@/api/platcommoditymanagement.js";
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
const Types = [
  {
    value: 2,
    label: "平台"
  },
  {
    value: 3,
    label: "捡漏"
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
    Pagination
  },
  props: ["totals"],
  data() {
    return {
      //
      //调试
      debuggers: {
        shoppingname: "",
        weight: "",
        id: ""
      },
      timeSort: 2, //时间排序
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
	  Types,
      shoppingStatus,
      //----
      total: 1,
      text1: "批量上架",
      text2: "批量下架",
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      ProductionPrice: {
        start: "",
        end: "",
        productName: "",
        sources: "",
		types:2,
        startTimeValue: "",
        finishTimeValue: "",
        goodsStatus: "",
        cascade: [],
        isLimitPrice:'',
      },
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
      // 批量操作数据
      handleSelection:[]
    };
  },
  created() {
    this.getList();
    // 获取分类列表
    this.getClassData();
  },
  computed: {
    Fn: function(shopping) {
      let flag = "";
      this.Obj.some((item, index) => {
        if (item.name === shopping) {
          flag === item.value;
          return true;
        }
      });
      return flag;
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
          this.timeSort = 1;
        } else if (sortType == "descending") {
          this.timeSort = 2;
        }
        this.sortNo = "";
      } else if (sortProp == "sort") {
        if (sortType == "ascending") {
          this.sortNo = 1;
        } else if (sortType == "descending") {
          this.sortNo = 2;
        }
        this.timeSort = "";
      }
      this.getList();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    exit() {},
    copy(res) {
      //copy代码
	  if(res.source==3){
		  this.$router.push({
			path: "/platformGoods/addplatformGoodsInfo",
			query: {
			  goodsId: res.goodsId,
			  copy: "copy"
			}
		  });
	  }else{
		this.$router.push({
		  path: "/platformGoods/addplatformGoods",
		  query: {
			goodsId: res.goodsId,
			copy: "copy"
		  }
		});  
	  }
      // this.$router.push(`/storeManagement/commodity/commodityAdd?goodsId=${Id}`);
    },
    seeDetail(res) {
      this.$router.push({
        path: "/platformGoods/platformGoodsDetail",
        query: {
          goodsId: res.goodsId,
          see: "see"
        }
      });
    },
    Jumpfordetails(res) {
	  if(res.source==3){
		  this.$router.push({
		    path: "/platformGoods/addplatformGoodsInfo",
		    query: {
		      goodsId: res.goodsId,
		      edit: "edit"
		    }
		  });
	  }else{
		  this.$router.push({
		    path: "/platformGoods/addplatformGoods",
		    query: {
		      goodsId: res.goodsId,
		      edit: "edit"
		    }
		  });
	  }
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
	  console.log('shangjia')
      this.soldOut = true;
      this.Informationfromtheshelves =
        "确定要下架(上架)" + row.goodsName + "商品么？";
      this.goodsId = row.goodsId;
      if (row.status == 1) {
        this.setStatus = 2;
		console.log('shangjia1')
      } else if (row.status == 2) {
        this.setStatus = 1;
		console.log('shangjia2')
      }
	  this.$confirm("确定要执行此操作么?", "提示", {
	    confirmButtonText: "确定",
	    cancelButtonText: "取消",
	    type: "warning"
	  }).then(() => {
         this.Sure()
	  });
	  
    },
    //调序
    Thesequence(row) {
      console.log(row, "row");
      this.debuggers.id = row.goodsId;
      this.debuggers.shoppingname = row.goodsName;
      this.debuggers.weight = row.mailingCount;
      this.Setweight = row.inventory;
      this.dialogFormVisible = true;
    },
    soldout(row) {
      this.soldOut = true;
    },
    getList() {
      // this.listLoading = true;
      // let obj = JSON.parse(JSON.stringify(this.listQuery));
      // obj.size = this.listQuery.limit;
      // obj.current = this.listQuery.page;
      // obj.source = 2;
      // delete obj.limit;
      // delete obj.page;
      let categoryId = null;
      let Basic = false;
      if (
        this.ProductionPrice.cascade.length &&
        this.ProductionPrice.cascade.length > 0
      ) {
        categoryId = this.ProductionPrice.cascade[
          this.ProductionPrice.cascade.length - 1
        ];
      }
      let obj = this.fliterfunc({
        categoryId,
        current: this.listQuery.page,
        size: this.listQuery.limit,
        status: this.ProductionPrice.status,
        startStartPrice: this.ProductionPrice.start,
        endStartPrice: this.ProductionPrice.end,
        goodsName: this.ProductionPrice.goodsName,
        goodsId: this.ProductionPrice.goodsId,
        isLimitPrice: this.ProductionPrice.isLimitPrice,
        integralType:  this.ProductionPrice.integralType,
        startTime:
          this.ProductionPrice.startTimeValue === "" ||
          this.ProductionPrice.startTimeValue === null ||
          this.ProductionPrice.startTimeValue === undefined
            ? ""
            : this.ProductionPrice.startTimeValue[0],
        endTime:
          this.ProductionPrice.startTimeValue === "" ||
          this.ProductionPrice.startTimeValue === null ||
          this.ProductionPrice.startTimeValue === undefined
            ? ""
            : this.ProductionPrice.startTimeValue[1],
        startEndTime:
          this.ProductionPrice.finishTimeValue === "" ||
          this.ProductionPrice.finishTimeValue === null ||
          this.ProductionPrice.finishTimeValue === undefined
            ? ""
            : this.ProductionPrice.finishTimeValue[0],
        endEndTime:
          this.ProductionPrice.finishTimeValue === "" ||
          this.ProductionPrice.finishTimeValue === null ||
          this.ProductionPrice.finishTimeValue === undefined
            ? ""
            : this.ProductionPrice.finishTimeValue[1],
        goodsType: 1,
        timeSort: this.timeSort,
        sortNo: this.sortNo,
        source: this.ProductionPrice.types,
        supplierId: this.ProductionPrice.supplier
      });

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
    searchTitle(){
      this.listQuery.page = 1
      this.search();
    },
    search() {
      console.log(this.ProductionPrice.cascade, "777");
      this.listLoading = true;
      let categoryId = null;
      let Basic = false;
      if (
        this.ProductionPrice.cascade.length &&
        this.ProductionPrice.cascade.length > 0
      ) {
        categoryId = this.ProductionPrice.cascade[
          this.ProductionPrice.cascade.length - 1
        ];
      }
      let Obj = this.fliterfunc({
        categoryId,
        current: this.listQuery.page,
        size: this.listQuery.limit,
        status: this.ProductionPrice.status,
        startStartPrice: this.ProductionPrice.start,
        endStartPrice: this.ProductionPrice.end,
        goodsName: this.ProductionPrice.goodsName,
        goodsId: this.ProductionPrice.goodsId,
        isLimitPrice: this.ProductionPrice.isLimitPrice,
        integralType:  this.ProductionPrice.integralType,
        startTime:
          this.ProductionPrice.startTimeValue === "" ||
          this.ProductionPrice.startTimeValue === null ||
          this.ProductionPrice.startTimeValue === undefined
            ? ""
            : this.ProductionPrice.startTimeValue[0],
        endTime:
          this.ProductionPrice.startTimeValue === "" ||
          this.ProductionPrice.startTimeValue === null ||
          this.ProductionPrice.startTimeValue === undefined
            ? ""
            : this.ProductionPrice.startTimeValue[1],
        startEndTime:
          this.ProductionPrice.finishTimeValue === "" ||
          this.ProductionPrice.finishTimeValue === null ||
          this.ProductionPrice.finishTimeValue === undefined
            ? ""
            : this.ProductionPrice.finishTimeValue[0],
        endEndTime:
          this.ProductionPrice.finishTimeValue === "" ||
          this.ProductionPrice.finishTimeValue === null ||
          this.ProductionPrice.finishTimeValue === undefined
            ? ""
            : this.ProductionPrice.finishTimeValue[1],
        goodsType: 1,
        timeSort: this.timeSort,
        sortNo: this.sortNo,
        source: this.ProductionPrice.types,
        supplierId: this.ProductionPrice.supplier
      });
      this.searchPagein = Obj;

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
      for (var key in this.ProductionPrice) {
        this.ProductionPrice[key] = "";
      }
    },
    //商品多选上下架
    handleSelectionChange(e) {
      this.handleSelection = e;
      console.log(e);
    },
    callBackPageUp() {
      if (this.handleSelection.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return
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
        return
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
  width: 70px;
  height: 70px;
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
