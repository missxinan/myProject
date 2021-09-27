<template>
  <div class="goods-choice">
    <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
      <div class="block">
        <el-cascader
          class="pirce-input"
          placeholder="请选择商品分类"

          :options="options"
          :props="props"
          v-model="categoryId"
          clearable
        ></el-cascader>
        <el-input v-model="ProductionPrice.productName" placeholder="请输入商品名称" style="width:30%"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="换购" name="first">
        <el-table
          :key="tableKey"
          :data="list"
          border
          @sort-change="sortChange"
        >
        <el-table-column label="商品ID" type="index" align="center"  width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.goodsId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" type="index" align="center" width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.goodsName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品图片" type="index" align="center" width="140px">
            <template slot-scope="scope">
              <img class="image" :src="scope.row.logo" />
            </template>
          </el-table-column>
          <el-table-column label="分类" type="index" align="center" width="140px">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="成本价" type="index" align="center" width="90px">
            <template slot-scope="scope">
              <span>{{ scope.row.costPrice }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="可用库存" type="index" align="center" width="70px">
            <template slot-scope="scope">
              <span>{{ scope.row.inventory - scope.row.soldNum }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="限价" align="center" width="90px">
            <template slot-scope="scope">
              <el-tag
                :type=" scope.row.isLimitPrice == 0 ? 'warning' : ''"
              >{{ scope.row.isLimitPrice == 0 ? '否' : scope.row.limitPrice }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button
                type="primary"
                size="mini"
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
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        :currentPage="listQuery.current"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { goodsListMall,treeCategoryApi } from "@/api/mallManagement.js";
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
        UpDay:undefined
      },
      options: [],
      props:{
          value:'categoryId',
          label:'name',
          children:'subCategorys',
          checkStrictly: true 
      },
      category: [],
      listQuery: {
        current: 1,
        size: 10,
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
      source: 2,
      categoryData:[],
    //   分类Id
      categoryId:undefined
    };
  },
  created() {
    this.getTreeCategory();
    this.getList();
  },
  methods: {
    dealWithDay(){
      let date = new Date()
      let year = date.getFullYear().toString()
      let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString()
      let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate().toString()
      let beg = year + '-' + month + '-' + day
      this.ProductionPrice.UpDay = [beg,beg]
    },
    search() {
      this.listQuery.current = 1
      this.getList();
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
      return Obj;
    },
    pitch(row) {
      console.log(row, "row");
      this.$emit("callback", {
        goodsId: row.goodsId,
        goodsName: row.goodsName,
        assessPrice: row.assessPrice
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
      goodsListMall({
        current: this.listQuery.current,
        size: this.listQuery.size,
        status: 2,
        goodsType: 2,
        goodsName: this.ProductionPrice.productName ? this.ProductionPrice.productName : undefined,
        categoryId: this.categoryId ? this.categoryId[this.categoryId.length - 1] : undefined,
        
      }).then(res => {
        console.log(res, "999");
        // this.list = res.data.records;
        this.list = res.data.records;
        this.total = Number(res.data.total);
        this.listLoading = false;
      });
    },
    getTreeCategory(){
        treeCategoryApi({type:3}).then(res=>{
            if(res.code == 0){
                this.options = this.categoryDealwith(res.data) 
            }
        })
    },
    categoryDealwith(data){
        data.map(item=>{
            if( item.subCategorys ){
                if( item.subCategorys.length > 0 ){
                    this.categoryDealwith(item.subCategorys)
                }else{
                    delete item.subCategorys
                }
            }
        })
        return data
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
      this.ProductionPrice.UpDay = undefined
      if (tab.name == "first") {
        this.source = 2;
      } else {
        this.dealWithDay();
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
