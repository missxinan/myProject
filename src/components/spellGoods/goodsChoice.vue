<template>
  <div class="goods-choice">
    <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
      <div class="block">
        <el-input v-model="ProductionPrice.productName" placeholder="请输入商品名称" style="width:30%"></el-input>
        <el-input  v-if="activeName == 'second'" v-model="ProductionPrice.mallNumber" placeholder="请输入寄拍编号" style="width:30%"></el-input>

        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="平台" name="first">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column label="商品名称"  align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品图片"  align="center" >
            <template slot-scope="scope">
              <img class="image" :src="scope.row.logo" />
            </template>
          </el-table-column>
          <el-table-column label="分类"  align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成本价"  align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.costPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="积分赠送比例" align="center" >
            <template slot-scope="scope">
              {{ scope.row.isGiveIntegral }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button
                type="primary"
                size="mini"
                :disabled="(row.inventory - row.soldNum) <= 0"
                @click="pitch(row)"
              >选中</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="pagination-page">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        :currentPage="listQuery.current"
        @pagination="search"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { goodsInfolist,auctionInfolist } from "@/api/platcommoditymanagement.js";
export default {
  name: "goods-choice",
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      ProductionPrice: {
        cascade: [],
        productName: "",
		mallNumber:"",
        UpDay: undefined
      },
      options: [],
      props: { multiple: true },
      category: [],
      listQuery: {
        current: 1,
        size: 20,
        time: undefined,
        name: undefined,
        status: undefined,
        page: 1,
        limit: 10
      },
      total: 0,
      dialogVisible: true, //控制弹框开关
      form: {
        goodsTypeFir: "", //选择商品第一框
        goodsTypeSec: "", //选择商品第二框
        goodsName: "", //商品名称
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      gridData: [],
      test: [],
      pageSize: 1, //每页渲染条数
      activeName: "first",
      source: 2
    };
  },
  created() {
    this.getList();
  },
  methods: {
    dealWithDay() {
      let date = new Date();
      let year = date.getFullYear().toString();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString();
      let day =
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
      let beg = year + "-" + month + "-" + day;
      this.ProductionPrice.UpDay = [beg, beg];
    },
    search() {
      this.listLoading = true;
      let Flag = null;
      let Basic = false;
      let Data = this.fliterfunc({
        goodsName: this.ProductionPrice.productName,
        startUpDay: this.ProductionPrice.UpDay
          ? this.ProductionPrice.UpDay[0]
          : undefined,
        endUpDay: this.ProductionPrice.UpDay
          ? this.ProductionPrice.UpDay[1]
          : undefined
      });
	  if(this.source==2){
		 goodsInfolist({
		   current: this.listQuery.page,
		   size: this.listQuery.limit,
		   source: this.source,
		   status: 2,
		   type: 1,
		   ...Data
		 }).then(res => {
		   this.list = res.data.records;
		   this.total = Number(res.data.total);
		   this.listLoading = false;
		 }); 
	  }else{
		  auctionInfolist({
		    current: this.listQuery.page,
		    size: this.listQuery.limit,
		    source: this.source,
		    status: 2,
			mallNumber:this.ProductionPrice.mallNumber,
		    type: 1,
		    ...Data
		  }).then(res => {
		    this.list = res.data.records;
		    this.total = Number(res.data.total);
		    this.listLoading = false;
		  });
	  }

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
    pitch(row) {
      console.log(row, "row");
      this.$emit("callback", {
        goodsId: row.goodsId,
        goodsName: row.goodsName,
        assessPrice: row.assessPrice,
        limitPrice: row.limitPrice || 0,
        isLimitPrice:row.isLimitPrice,
		costPrice:row.costPrice
      });
    },
    handleChange(value) {
      console.log(value);
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    getList() {
      this.listLoading = true;
      // this.listQuery.time ?
      // 	(this.listQuery.startTime = this.listQuery.time[0],
      // 		this.listQuery.endTime = this.listQuery.time[1]) : ""
	  if(this.source==2){
		  goodsInfolist({
		    current: this.listQuery.page,
		    size: this.listQuery.limit,
		    type: 1,
		    source: this.source,
		    status: 2,
		    goodsName: this.ProductionPrice.productName
		      ? this.ProductionPrice.productName
		      : undefined,
		    startUpDay: this.ProductionPrice.UpDay
		      ? this.ProductionPrice.UpDay[0]
		      : undefined,
		    endUpDay: this.ProductionPrice.UpDay
		      ? this.ProductionPrice.UpDay[1]
		      : undefined
		  }).then(res => {
		    console.log(res, "999");
		    // this.list = res.data.records;
		    this.list = res.data.records;
		    this.total = Number(res.data.total);
		    this.listLoading = false;
		  });
	  }else{
		  auctionInfolist({
		    current: this.listQuery.page,
		    size: this.listQuery.limit,
		    type: 1,
		    source: this.source,
		    status: 2,
		    goodsName: this.ProductionPrice.productName
		      ? this.ProductionPrice.productName
		      : undefined,
		    startUpDay: this.ProductionPrice.UpDay
		      ? this.ProductionPrice.UpDay[0]
		      : undefined,
		    endUpDay: this.ProductionPrice.UpDay
		      ? this.ProductionPrice.UpDay[1]
		      : undefined
		  }).then(res => {
		    console.log(res, "999");
		    // this.list = res.data.records;
		    this.list = res.data.records;
		    this.total = Number(res.data.total);
		    this.listLoading = false;
		  });
	  }

    },
    dialogSure() {
      //点击搜索框的回调
      console.log(
        this.form,
        "这里是获取表单内容的函数，也是点击后校验成功与否的地方"
      );
    },
    pageChange(e) {
      //切换页码时的回调
      console.log(e); //这里是改变后的页码
    },
    pageChangePrev(e) {
      //点击上一页的回调
      console.log(e, "点击上一页的回调,e为当前页");
    },
    pageChangeNext(e) {
      //点击下一页的回调
      console.log(e, "点击下一页的回调,e为当前页");
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.listQuery.page = 1;
      this.ProductionPrice.UpDay = undefined;
      if (tab.name == "first") {
        this.source = 2;
      } else {
        // this.dealWithDay();
        this.source = 1;
      }
      this.getList();
    }
  }
};
</script>

<style scoped>
.block {
  margin-top: 20px;
}
.image {
  width: 70px;
  height: 70px;
}
.goods-choice {
  width: 90%;
  height: 100%;
  margin-left: 5%;
}
.btns {
  margin: 20px 0;
}
.paginat {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.paginat .totalShow {
  display: inline-block;
}
.addEditor {
  color: rgb(16, 16, 245);
  float: right;
}
.el-form-item {
  margin-bottom: 10px !important;
  padding: 0;
}
.el-form-item .el-form-item__content {
  line-height: 20px !important;
}
.pagination-page {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  margin-top: 10px;
}
</style>
