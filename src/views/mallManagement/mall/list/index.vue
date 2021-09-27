<template>
  <div class="mall-list">
    <div class="addGoods">
      <el-button
        type="primary"
        v-if="checkPermission(['mall:mallGoods:add'])"
        @click="addMallGoods"
      >添加商品</el-button>
    </div>
    <div class="switch-table">
      <div class="tab" :class="{'tabborder':tabValue == 2}" @click="switchTab(2)">已售中</div>
     <div class="tab" :class="{'tabborder':tabValue == 1}" @click="switchTab(1)">仓库中</div>
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
        <el-input class="item-input" v-model="goodsName" placeholder="请输入商品名称"></el-input>
      </div>
      <div class="item">
        <el-select v-model="goodsType" class="pirce-input" placeholder="请选择商品类型">
          <el-option
            v-for="item in goodsTypeArry"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
	  <div class="item">
	    <el-select v-model="mallShopId" class="pirce-input" placeholder="请选择个人馆">
	      <el-option
	        v-for="item in mallShopArry"
	        :key="item.id"
	        :label="item.mallName"
	        :value="item.id"
	      ></el-option>
	    </el-select>
	  </div>
      <div class="item">
        <el-button class="item-btn" type="primary" @click="search">搜索</el-button>
        <el-button class="item-btn" type="primary" @click="rest">重置</el-button>
      </div>
    </div>
    <div class="tablelist">
      <el-table
        :data="list"
        border
        class="list"
        style="width: 100%"
        max-height="650"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" v-if="tabValue!==3"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="更新时间"></el-table-column>
        <el-table-column prop="nick" align="center" label="商品信息" width="260px">
          <template slot-scope="scope">
            <div class="goodsInfo_wrap">
              <div class="goodsImg_wrap">
                <img class="goods_image" :src="scope.row.logo" />
              </div>
              <div class="goods_right">
                <span
                  class="goods_name"
                  @click="lookGoodsDetail(scope.row)"
                  style="cursor: pointer;color: #2196F3;"
                >{{ scope.row.goodsName }}</span>
                <span>{{ scope.row.goodsId }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" align="center" label="商品类别"></el-table-column>
        <el-table-column prop="goodsType" align="center" label="商品类型">
          <template slot-scope="scope">
            <div style="text-align: center">{{scope.row.goodsType === 1?'寄拍':scope.row.goodsType === 2?'换购':scope.row.goodsType === 4?'直营':'特卖'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格"></el-table-column>
        <el-table-column prop="integral" align="center" label="积分"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序"></el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="tabValue === 2">
              <span
                class="table-btn btn-blue"
                v-if="checkPermission(['mall:mallGoods:forbidden'])"
                @click="lowerShelfGoods(scope.row,2)"
              >下架</span>
              <span
                class="table-btn btn-blue"
                v-if="checkPermission(['mall:mallGoods:trimSort'])"
                @click="ordering(scope.row,3)"
              >调序</span>
            </div>
            <div v-if="tabValue === 1">
              <span
                class="table-btn btn-blue"
                v-if="checkPermission(['mall:mallGoods:edit'])"
                @click="editGoods(scope.row)"
              >编辑</span>
              <span
                class="table-btn btn-blue"
                v-if="checkPermission(['mall:mallGoods:up'])"
                @click="upperGoods(scope.row,5)"
              >上架</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <!-- <el-pagination
          v-if="tabValue===3"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="size"
          layout="->,total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination> -->
        <Pagination
          :limit.sync="size"
          :page.sync="current"
          :text1="text1"
          :text2="text2"
          v-on:callBackUp="callBackPageUp"
          v-on:callBackDown="callBackPageDown"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @pagination="getDataList"
        ></Pagination>
      </div>
      <el-dialog
        :title="dialogType == 1?'调整库存':dialogType == 2?'下架商品':dialogType == 3?'调序':dialogType == 4?'增加库存':dialogType == 5?'上架商品':''"
        :visible.sync="isShowDialog"
        width="35%"
        :before-close="close"
      >
        <div>
          <div class="mask-content" v-if="dialogType == 1">
            <div class="mask-text">
              <span class="titles">商品名称：</span>
              <span>{{goodsDetail.goodsName}}</span>
            </div>
            <div class="mask-text">
              <span class="titles">总库存：</span>
              <el-input-number
                class="inputs"
                v-model="goodsNum"
                :controls="false"
                placeholder="请输入内容"
              ></el-input-number>
            </div>
          </div>
          <div class="mask-content" v-if="dialogType == 2">确定要下架{{goodsDetail.goodsName}}商品么？</div>
          <div class="mask-content" v-if="dialogType == 3">
            <div class="mask-text">
              <span class="titles">商品名称：</span>
              <span>{{goodsDetail.goodsName}}</span>
            </div>
            <div class="mask-text">
              <span class="titles">当前权重：</span>
              <span>{{goodsSort}}</span>
            </div>
            <div class="mask-text">
              <span class="titles">设置权重：</span>
              <el-input-number class="inputs" v-model="sort" :controls="false" :min="0"></el-input-number>
            </div>
          </div>
          <div class="mask-content" v-if="dialogType == 4">
            <div class="mask-text">
              <span class="titles">商品名称：</span>
              <span>{{goodsDetail.goodsName}}</span>
            </div>
            <div class="mask-text">
              <span class="titles">总库存：</span>
              <el-input-number
                class="inputs"
                v-model="goodsNum"
                :controls="false"
                placeholder="请输入内容"
              ></el-input-number>
            </div>
          </div>
          <div class="mask-content" v-if="dialogType == 5">确定要上架{{goodsDetail.goodsName}}商品么？</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="Sure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//分页控制
import Pagination from "@/components/Pagination";
import { treeApi } from "@/api/AuctionsRecord.js";
import {fetchMallList} from "@/api/collect.js";
import {
  goodsListMall,
  downGoodsMall,
  upperGoodsMall,
  editInventoryMall,
  editSortsMall,
  supplierList,
  newDownGoodsMall, //批量下架
  newUpperGoodsMall //批量上架
} from "@/api/mallManagement.js";
import checkPermission from "@/utils/permission";
import { exportBlob } from "@/api/blob"
export default {
  name: "mallList",
  components: {
    Pagination
  },
  data() {
    return {
      createTime: "",
      categoryArry: [],
	  mallShopArry:[],
      goodsName: "",
      goodsType: "",
      categoryId: "",
      supplierArry: [{
        supplierId: '',
        supplierName: '全部'
      }],
      supplierId: "",
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
        },
        {
          label: "直营",
          value: 4
        }
      ],
      size: 20,
      list: [],
      current: 1,
      total: 0,
	  mallShopId:'',
      //将来下架商品ID
      goodsId: "",
      tabValue: 2,
      dialogType: 1,
      isShowDialog: false,
      goodsDetail: "",
      goodsNum: "",
      goodsSort: "",
      sort: "",
      debuggers: {
        shoppingname: "",
        weight: "",
        ids: ""
      },
      //   批量上下架
      text1: "批量上架",
      text2: "批量下架",
      selectData: [], // 选中的数据集合,
    };
  },
  created() {
    this.getGoodsList();
    this.getAllGoodsCategory();
	this.getMallList()
  },
  methods: {
    checkPermission,
    //商品多选上下架
    handleSelectionChange(e) {
      this.selectData = e;
      //   console.log(this.selectData)
    },
	getMallList(){
		let that = this;
		let data = {
		}
		fetchMallList(data).then((res) =>{
			if(res.code == 0){
				that.mallShopArry = res.data
	
			}else{
				that.$message({
					message: res.msg,
					type: 'error'
				});
			}
		})
		
	},
    // 批量上架
    callBackPageUp() {
      if (this.selectData.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return
      }
      this.$confirm("是否批量上架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.selectData.length > 0) {
          let ids = [];
          console.log(this.selectData);
          this.selectData.map(item => {
            ids.push(item.goodsId);
          });
          // this.Sure("u", ids);
          newUpperGoodsMall({
            goodsIds: ids.join(",")
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
          this.$message({
            message: "请至少选择一条数据",
            type: "warning"
          });
        }
      });
    },
    // 批量下架
    callBackPageDown() {
      if (this.selectData.length <= 0) {
        this.$message.error("请选择批量操作的数据");
        return
      }
      this.$confirm("是否批量下架?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.selectData.length > 0) {
          let ids = [];
          console.log(this.selectData);
          this.selectData.map(item => {
            ids.push(item.goodsId);
          });
          newDownGoodsMall({
            goodsIds: ids.join(",")
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
        } else {
          this.$message({
            message: "请至少选择一条数据",
            type: "warning"
          });
        }
      });
    },
    
    getDataList(val){
      this.size = val.limit,
      this.current = val.page
      this.getGoodsList();
    },
    //获取商品列表
    getGoodsList() {
      let that = this;
      let data = {
        goodsName: that.goodsName,
        status: that.tabValue,
		mallShopId: that.mallShopId,
        categoryId: that.categoryId[that.categoryId.length - 1],
        goodsType: that.goodsType,
        supplierId: that.supplierId,
        startTime: that.createTime ? that.createTime[0] : "",
        endTime: that.createTime ? that.createTime[1] : "",
        size: that.size,
        current: that.current,
      };
      goodsListMall(data).then(res => {
        if (res.code == 0) {
          that.list = res.data.records;
          that.total = Number(res.data.total);
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
      treeApi().then(res => {
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
        path: "/mallManagement/mall/mallAdd"
      });
    },
    //查看商品详情
    lookGoodsDetail(row) {
      let goodsId = row.goodsId;
      this.$router.push({
        path: "/mallManagement/mall/mallDetail",
        query: {
          goodsId: goodsId
        }
      });
    },
    //切换商城商品状态
    switchTab(val) {
      this.createTime = "";
      this.goodsName = "";
      this.goodsType = "";
      this.categoryId = "";
      this.supplierId = "";
      this.tabValue = val;
      this.current = 1;
      if(val == 3){
        this.text1 = '';
        this.text2 = '';
      } else {
        this.text1 = "批量上架";
        this.text2 ="批量下架";
      }
      this.getGoodsList();
    },
    //搜索
    search() {
      this.current = 1;
      this.getGoodsList();
    },
    //重置
    rest() {
      this.createTime = "";
      this.goodsName = "";
      this.goodsType = "";
      this.categoryId = "";
      this.supplierId = "";
	  this.mallShopId = "";
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
    //上架商品
    upperGoods(row, val) {
      this.dialogType = val;
      this.goodsDetail = row;
      this.isShowDialog = true;
    },
    //下架商品
    lowerShelfGoods(row, val) {
      this.dialogType = val;
      this.goodsDetail = row;
      this.isShowDialog = true;
    },
    //增加库存
    increasingInventory(row, val) {
      this.dialogType = val;
      this.goodsDetail = row;
      this.goodsNum = row.inventory;
      this.isShowDialog = true;
    },
    //关闭弹框
    close() {
      this.isShowDialog = false;
    },
    //提交
    Sure() {
      let that = this;
      let dialogType = that.dialogType;
      if (dialogType == 1) {
        let data = {
          goodsId: that.goodsDetail.goodsId,
          num: that.goodsNum
        };
        editInventoryMall(data).then(res => {
          if (res.code == 0) {
            that.$message({
              message: "调整商品库存成功！",
              type: "success"
            });
            that.getGoodsList();
            that.isShowDialog = false;
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
            that.isShowDialog = false;
          }
        });
      } else if (dialogType == 2) {
        let data = {
          goodsId: that.goodsDetail.goodsId
        };
        downGoodsMall(data).then(res => {
          if (res.code == 0) {
            that.$message({
              message: "下架商品成功！",
              type: "success"
            });
            that.getGoodsList();
            that.isShowDialog = false;
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
            that.isShowDialog = false;
          }
        });
      } else if (dialogType == 3) {
        let data = {
          goodsId: that.goodsDetail.goodsId,
          sort: that.sort
        };
        editSortsMall(data).then(res => {
          if (res.code == 0) {
            that.$message({
              message: "商品调序成功！",
              type: "success"
            });
            that.getGoodsList();
            that.isShowDialog = false;
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
            that.isShowDialog = false;
          }
        });
      } else if (dialogType == 4) {
        let data = {
          goodsId: that.goodsDetail.goodsId,
          num: that.goodsNum
        };
        editInventoryMall(data).then(res => {
          if (res.code == 0) {
            that.$message({
              message: "调整商品库存成功！",
              type: "success"
            });
            that.getGoodsList();
            that.isShowDialog = false;
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
            that.isShowDialog = false;
          }
        });
      } else if (dialogType == 5) {
        let data = {
          goodsId: that.goodsDetail.goodsId
        };
        upperGoodsMall(data).then(res => {
          if (res.code == 0) {
            that.$message({
              message: "上架商品成功！",
              type: "success"
            });
            that.getGoodsList();
            that.isShowDialog = false;
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
            that.isShowDialog = false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mall-list {
  padding: 24px;
  .addGoods {
    padding: 0px 0 10px;
  }
  .switch-table {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
    .tab {
      display: inline-block;
      height: 40px;
      width: 100px;
      line-height: 40px;
      text-align: center;
      background: #e9e9f0;
      color: #808080;
      font-size: 15px;
      cursor: pointer;
    }
    .tabborder {
      background: #409eff;
      font-size: 15px;
      color: #fff;
    }
  }
  .search-input {
    // margin-bottom: 20px;
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
