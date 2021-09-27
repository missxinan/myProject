<template>
  <div class="mall-list">
    <div class="addGoods">
      <el-button
        type="primary"
        v-if="checkPermission(['mall:mallGoods:add'])"
        @click="addMallGoods"
      >添加商品</el-button>
    </div>
    <div class="search-input">
      <div class="item">
        <el-date-picker
          class="item-picker"
          v-model="createTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="item">
        <el-cascader
          class="pirce-input"
          placeholder="请选择商品分类"
          :options="categoryArry"
          :props="{ checkStrictly: true }"
          v-model="categoryId"
          clearable
        ></el-cascader>
      </div>
      <div class="item">
        <el-input class="item-input" v-model="goodsName" placeholder="请输入商品名称"></el-input>
      </div>
      <div class="item">
        <el-input class="item-input" v-model="vipGoodsId" placeholder="请输入商品ID" maxlength="18"></el-input>
      </div>
      <!-- 请选择商品状态 -->
      <div class="item">
        <el-select v-model="status" class="pirce-input" placeholder="请选择商品状态">
          <el-option
            v-for="item in goodsStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button class="item-btn" type="primary" @click="search">搜索</el-button>
        <el-button class="item-btn" type="primary" @click="rest">重置</el-button>
      </div>
    </div>
    <div class="tablelist">
      <!-- <el-table :data="list" border class="list" style="width: 100%" max-height="550"> -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        class="list"
        style="width:100%"
        border
        max-height="550"
        fit
        highlight-current-row
        :default-sort="{prop: 'createTime', order: 'descending'}"
        @sort-change="selectSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间" width="100"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间" width="100"></el-table-column>
        <el-table-column prop="nick" align="center" label="商品信息" width="260">
          <template slot-scope="scope">
            <div class="goodsInfo">
              <div class="info-left">
                <img class="info-img" :src="scope.row.logo" />
              </div>
              <div class="info-right">
                <div
                  class="table-btn btn-blue"
                  @click="lookGoodsDetail(scope.row,{see: 'see'})"
                >{{scope.row.goodsName}}</div>
                <div>{{scope.row.vipGoodsId}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" align="center" label="商品分类"></el-table-column>
       <el-table-column prop="startPrice" align="center" label="起拍价格"></el-table-column>
        <el-table-column prop="markupPrice" align="center" label="加价幅度"></el-table-column>
        <el-table-column prop="costPrice" align="center" label="成本价"></el-table-column>
        <el-table-column prop align="center" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 1">下架</div>
            <div v-if="scope.row.status === 2">上架</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
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
              @click="Jumpfordetails(row.vipGoodsId)"
              style="margin:1px"
            >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="copy(row.vipGoodsId)"
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
        :limit.sync="size"
        :page.sync="current"
        @pagination="getDataList"
      />
    </div>
    <el-dialog title="上/下架" :visible.sync="soldOut">
      <div>{{Informationfromtheshelves}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="soldOut = false">取 消</el-button>
        <el-button type="primary" @click="SureOne">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//分页控制
import Pagination from "@/components/Pagination";
import { treeApi } from "@/api/AuctionsRecord.js";
import {
  downGoodsMall,
  upperGoodsMall,
  editInventoryMall,
  editSortsMall
} from "@/api/mallManagement.js";
import {
  vipLibraryOfGoods,
  upperGoodsInfo,
  downGoodsInfo,
  settingSort
} from "@/api/vipMange.js";
import { supplierList } from "@/api/platcommoditymanagement.js";

import checkPermission from "@/utils/permission";
export default {
  components: {
    Pagination
  },
  name: "mallList",
  data() {
    return {
      source: "1",
      vipGoodsId: "",
      listLoading: true,
      createTime: "",
      categoryArry: [],
      goodsName: "",
      goodsType: undefined,
      categoryId: "",
      goodsTypeArry: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "寄拍",
          value: 1
        },
        {
          label: "换购",
          value: 2
        }
      ],
      goodsStatus: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "上架",
          value: 2
        },
        {
          label: "下架",
          value: 1
        }
      ],
      size: 10,
      list: [],
      current: 1,
      total: 0,
      tabValue: "",
      dialogType: 1,
      isShowDialog: false,
      goodsDetail: "",
      goodsNum: "",
      goodsSort: "",
      sort: "",
      upperTime: "",
      dialogFormVisible: false,
      debuggers: {
        shoppingname: "",
        weight: "",
        ids: ""
      },
      Setweight: "",
      soldOut: false,
      Informationfromtheshelves: "",
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
      supplier: "",
      status: undefined,
      supplierId: undefined,
      selectData: [], // 选中的数据集合,
      sortNo:1  //1.创建时间倒序，2.创建时间正序,3.更新时间的正序,4.更新时间的倒序
    };
  },
  created() {
    this.getGoodsList();
    this.getAllGoodsCategory();
  },
  methods: {
    checkPermission,
    //排序 等待后台参数接口出现
    selectSort(val) {
      let sortType = val.order;
      let sortProp = val.prop;
      // 当前时间为创建时间排序
      if (sortProp == "createTime") {
        // 如果是正序
        if (sortType == "ascending") {
          this.sortNo = 2;
          // 如果是倒序
        } else if (sortType == "descending") {
          this.sortNo = 1;
        }
        // 当前时间如果是更新时间排序
      } else if (sortProp == "updateTime") {
        // 如果是正序
        if (sortType == "ascending") {
          this.sortNo = 3;
        } else if (sortType == "descending") {
          this.sortNo = 4;
        }
      }
      if(!sortType){
          this.sortNo = '';
      }
      this.getGoodsList();
    },
    //获取商品列表
    getGoodsList() {
      this.listLoading = true;
      let that = this;
      let data = {
        goodsName: that.goodsName,
        // status: that.tabValue,
        categoryId: that.categoryId[that.categoryId.length - 1],
        goodsId: that.vipGoodsId,
        mailingStatus: that.mailingStatus,
        startTime: that.createTime ? that.createTime[0] : "",
        endTime: that.createTime ? that.createTime[1] : "",
        source: that.source,
        size: that.size,
        current: that.current,
        status: that.status,
        supplierId: that.supplierId,
        sortNo:that.sortNo
      };
      vipLibraryOfGoods(data).then(res => {
        if (res.code == 0) {
          that.list = res.data.records;
          that.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //获取商品分类
    getAllGoodsCategory() {
      treeApi({type:1}).then(res => {
        if (res.code == 0) {
          let datas = res.data;
          let categoryArry = [];
          if (datas.length > 0) {
            datas.forEach(ele => {
              if (ele.subCategorys.length > 0) {
                let subCategorys = ele.subCategorys;
                let children = [];
                categoryArry.push({
                  value: ele.categoryId,
                  label: ele.name,
                  children: children
                });
                subCategorys.forEach(item => {
                  if (item.subCategorys.length > 0) {
                    let childrens = [];
                    let childrenArry = item.subCategorys;
                    children.push({
                      value: item.categoryId,
                      label: item.name,
                      children: childrens
                    });
                    childrenArry.forEach(e => {
                      childrens.push({
                        value: e.categoryId,
                        label: e.name
                      });
                    });
                  } else {
                    children.push({
                      value: item.categoryId,
                      label: item.name
                    });
                  }
                });
              } else {
                categoryArry.push({
                  value: ele.categoryId,
                  label: ele.name
                });
              }
            });

            this.categoryArry = categoryArry;
          }
        }
      });
    },
    //添加商品
    addMallGoods() {
      this.$router.push({
        path: "/vipMange/vipLibraryOfGoods/addGoods"
      });
    },
    //查看商品详情
    lookGoodsDetail(row, obj) {
      let goodsId = row.vipGoodsId;
      this.$router.push({
        path: "/vipMange/vipLibraryOfGoods/goodDetail",
        query: {
          goodsId: goodsId,
          ...obj
        }
      });
    },
    //编辑
    Jumpfordetails(Id) {
      this.$router.push({
        path: "/vipMange/vipLibraryOfGoods/addGoods",
        query: {
          goodsId: Id,
          edit: "edit",
        }
      });
    },

    copy(Id) {
				//copy代码
				this.$router.push({
					path: '/vipMange/vipLibraryOfGoods/addGoods',
					query: {
						goodsId: Id,
						copy: 'copy'
					}
				})
				// this.$router.push(`/storeManagement/commodity/commodityAdd?goodsId=${Id}`);
			},
   sortSure() {
      if (this.Setweight == "") {
        console.error("");
      } else {
        settingSort({
          goodsId: this.debuggers.ids,
          num: this.Setweight
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getGoodsList();
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
    //上下架
    soldoutl(row) {
      console.log(row,'row')
      this.soldOut = true;
      this.Informationfromtheshelves =
        "确定要下架(上架)" + row.goodsName + "商品么？";
      this.goodsId = row.vipGoodsId;
      if (row.status == 1) {
        this.setStatus = 2;
      } else if (row.status == 2) {
        this.setStatus = 1;
      }
    },

    //切换商城商品状态
    switchTab(val) {
      this.createTime = "";
      this.goodsName = "";
      this.goodsType = "";
      this.categoryId = "";
      this.tabValue = val;
      this.current = 1;
      this.getGoodsList();
    },
    //搜索
    search() {
      this.listLoading = true;
      this.current = 1;
      this.getGoodsList();
    },
    getDataList(val){
      this.current = val.page;
      this.size = val.limit;
      this.getGoodsList();
    },
    //重置
    rest() {
      this.createTime = "";
      this.goodsName = "";
      this.goodsType = "";
      this.categoryId = "";
      this.status = undefined;
      this.supplierId = undefined;
      this.vipGoodsId = ""
      this.getGoodsList();
    },
    //调序
    ordering(row, val) {
      this.dialogType = val;
      this.goodsDetail = row;
      this.goodsSort = row.sort;
      this.isShowDialog = true;
    },
    //编辑商品
    editGoods(row) {
      let goodsId = row.goodsId;
      this.$router.push({
        path: "/mallManagement/mall/mallAdd",
        query: {
          goodsId: goodsId
        }
      });
    },
    //关闭弹框
    close() {
      this.isShowDialog = false;
    },
    //上架或者下架  批量上架或者下架
     //不确定接口
    SureOne() {
      if (this.setStatus == 2) {
        upperGoodsInfo({
          ids: this.goodsId
        }).then(res => {
          if (res.code == 0) {
            this.soldOut = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getGoodsList();
            //location.reload();
          } else {
            this.$message(res.msg);
            // location.reload();
          }

        });
      } else {
        downGoodsInfo({
          ids: this.goodsId
        }).then(res => {
          if (res.code == 0) {
            this.soldOut = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getGoodsList();
          } else {
            this.$message(res.msg);
            // location.reload();
          }
          this.soldOut = false;
        });
      }
    },
    Sure(status, ids) {
      if (status == "u") {
        upperGoodsInfo({
          ids: ids.join(',')
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getGoodsList();
            //location.reload();
          } else {
            this.$message(res.msg);
            // location.reload();
          }
          this.soldOut = false;
          this.selectData = [];
        });
      } else {
        downGoodsInfo({
          ids: ids.join(',')
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getGoodsList();
          } else {
            this.$message(res.msg);
            // location.reload();
          }
          this.soldOut = false;
          this.selectData = [];
        });
      }
    },
    //商品多选上下架
    handleSelectionChange(e) {
      this.selectData = e;
    },
    // 批量上架
    callBackPageUp() {
       this.$confirm("是否批量上架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // console.log("点击了批量上架");
        if (this.selectData.length > 0) {
        const ids = this.selectData.map(item => item.vipGoodsId);
        this.Sure("u", ids);
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
      });

    },

    // 批量下架
    callBackPageDown() {
      this.$confirm("是否批量下架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
       if (this.selectData.length > 0) {
        const ids = this.selectData.map(item => item.vipGoodsId);
        this.Sure("d", ids);
      } else {
        this.$message({
          message: "请至少选择一条数据",
          type: "warning"
        });
      }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mall-list {
  padding: 24px;
  .addGoods {
    padding: 10px 0 34px;
  }
  .search-input {
    margin-bottom: 20px;
    .item {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 30px;
      .item-title {
        font-size: 13px;
        color: #333;
      }
    }
  }
  .tablelist {
    .list {
      margin-bottom: 30px;
      .goodsInfo {
        display: flex;
        align-items: center;
        .info-left {
          .info-img {
            height: 50px;
            width: 50px;
          }
          margin-right: 10px;
        }
      }
    }
    .table-paging {
      display: flex;
      justify-content: flex-end;
    }
  }
  .table-btn {
    cursor: pointer;
  }
  .btn-blue {
    color: #409eff;
  }
  .titles {
    font-size: 14px;
    color: #333;
  }
  .inputs {
    width: 300px;
  }
  .mask-content {
    padding: 0 20px;
  }
  .mask-text {
    margin-bottom: 20px;
  }
}
</style>
