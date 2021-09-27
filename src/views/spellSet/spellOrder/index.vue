<template>
  <div class="container">
    <div class="addFlex">
      <div class="ax_200">
        <el-input v-model="listQuery.phone" style="width:140px" placeholder="请输入手机号"></el-input>
      </div>
	  <el-input
	    v-model="listQuery.spellMakeOrderId"
	    placeholder="拼赚订单编号"
	    style="width: 140px;"
	    class="filter-item"
	    clearable
	    @keyup.enter.native="handleFilter"
	  />
	  <el-date-picker
	    v-model="listQuery.time"
	    type="daterange"
	    value-format="yyyy-MM-dd HH:mm:ss"
	    range-separator="至"
	    start-placeholder="开始日期"
	    end-placeholder="结束日期"
	  ></el-date-picker>
	  <el-select
	    v-model="listQuery.orderStatus"
	    placeholder="拼赚订单状态"
	    clearable
	    class="filter-item"
	    style="width: 130px"
	  >
	    <el-option label="拼赚中" value="5"/>
	    <el-option label="拼赚成功" value="6"/>
	    <!-- <el-option label="拼赚失败" value="7"/> -->
	  </el-select>
   <div class="ax_200 right">
        <el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchTitle">搜索</el-button>
        <el-button style="height:40px" @click="reset">重置</el-button>
		<el-button style="height:40px" @click="exportToExcel">导出拼赚数据</el-button>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      max-height="600"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="商品信息" align="center" width="260">
        <template slot-scope="scope">{{ scope.row.goodsName }}</template>
      </el-table-column>
	  <el-table-column align="center" label="拼赚商品id">
	    <template slot-scope="scope">{{ scope.row.spellMakeGoodsId }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="用户id">
	    <template slot-scope="scope">{{ scope.row.userId }}</template>
	  </el-table-column>
	  <el-table-column label="创建时间" align="center" property="createTime">
	    <template slot-scope="scope">
	      <span>{{ scope.row.createTime }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column align="center" label="手机号">
	    <template slot-scope="scope">{{ scope.row.phone }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="拼赚开团所需人数">
	    <template slot-scope="scope">{{ scope.row.requiredNumber }}</template>
	  </el-table-column>
	  <el-table-column label="参与人数" align="center">
	    <template slot-scope="scope">{{ scope.row.numberParticipants }}</template>
	  </el-table-column>
      <el-table-column label="拼赚订单状态" align="center">
        <template slot-scope="scope">
			<span v-if="scope.row.orderStatus==0">待付款</span>
			<span v-if="scope.row.orderStatus==1">待发货</span>
			<span v-if="scope.row.orderStatus==2">待收货</span>
			<span v-if="scope.row.orderStatus==3">交易完成</span>
			<span v-if="scope.row.orderStatus==4">交易失败</span>
			<span v-if="scope.row.orderStatus==5">进行中</span>
			<span v-if="scope.row.orderStatus==6">已成团</span>
			<span v-if="scope.row.orderStatus==7">拼团失败</span>
			<span v-if="scope.row.orderStatus==8">竞拍中</span>
			<span v-if="scope.row.orderStatus==9">开团待支付</span>
			<span v-if="scope.row.orderStatus==10">已取消</span>
		</template>
      </el-table-column>
	  <el-table-column label="平均收益" align="center">
	    <template slot-scope="scope">{{ scope.row.earnings }}</template>
	  </el-table-column>
	  <el-table-column label="开团方式 " align="center">
	    <template slot-scope="scope">
			<span v-if="scope.row.groupWay==0">金额支付</span>
			<span v-if="scope.row.groupWay==1">芒果支付</span>
		</template>
	  </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
		  <el-button
		    type="text"
		    size="mini"
		    @click="toSpellInfoPage(row.id)"
		  >参团详情</el-button>
		  <el-button
		    type="text"
		    size="mini"
		    @click="toSubscribePage(row.id)"
		  >预约保底详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改保护价弹窗 -->
   <pagination
     
      v-show="total>0"
      :total="total"
      :limit.sync="listQuery.size"
      :page.sync="listQuery.current"
      @pagination="getList"
    />
  </div>
</template>

<script>
//tablelist中需要改接口
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
import {
  spellOrder
} from "@/api/spellRecord.js";
import { requestfile, exportBlobExcel } from "@/api/blob";
import checkPermission from "@/utils/permission";
const displayArea = [
  {
    value: "",
    label: "全部"
  },
  {
    value: 1,
    label: "默认区"
  },
  {
    value: 2,
    label: "新人"
  },
  {
    value: 3,
    label: "VIP"
  }
];
export default {
  name: "spellOrder",
  components: {
    Pagination
  },
  data() {
    return {
      //
      Setweight: "",
      list: null,
      listLoading: true,
      props: {
        multiple: true
      },
      displayArea,
      //----
      total: 1,
      listQuery: {
        current: 1,
        size: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      soldOut: false,
      ProductionPrice: {
        start: "",
        end: "",
		time: undefined,
        goodsStatus: undefined
      },
      options: [],
      classifyvalue1: "",
      //商品分类
      test: [],
      classifyvalue2: "",
      // 暂存临时最低保护价，最高保护价
      lowPrice: "",
      highPrice: "",
      // 批量关闭操作列表
      handleSelection: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
	onInput(){
	     this.$forceUpdate();
	},
    toSubscribePage(row) {
      this.$router.push({
        path: "subscribeDetail",
        query: {
			spellMakeOrderId:row
		}
      });
    },
    soldout(row) {
      this.soldOut = true;
    },
	toSpellInfoPage(row){
		console.log(row)
		// return
		this.$router.push({
		  path: "spellOrderDetail",
		  query: {
			  spellMakeOrderId:row
		  }
		});
	},
    getList() {
      this.listLoading = true;
	  this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
	  this.listQuery.time
	    ? ((this.listQuery.minDate = this.listQuery.time[0]),
	      (this.listQuery.maxDate = this.listQuery.time[1]))
	    : ((this.listQuery.minDate = undefined),
	      (this.listQuery.maxDate = undefined));
      spellOrder(this.listQuery).then(res => {
        if (res.code == 0) {
          let listData = res.data.records;
          listData.map((item, index) => {
            item.lowPrice = false;
            item.highPrice = false;
            item.index = index;
          });
          this.list = JSON.parse(JSON.stringify(listData));
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
	/**
	 * 导出excel
	 */
	exportToExcel() {
	  let that = this;
	  let url = "/spell/make/order/excel";
	  this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
	  this.listQuery.time
	    ? ((this.listQuery.minDate = this.listQuery.time[0]),
	      (this.listQuery.maxDate = this.listQuery.time[1]))
	    : ((this.listQuery.minDate = undefined),
	      (this.listQuery.maxDate = undefined));
	  let datas = JSON.parse(JSON.stringify(this.listQuery));
	  exportBlobExcel(url, datas).then(res => {
	    console.log(res, "res");
	    const data = res.data;
	    const a = document.createElement("a");
	    const blob = new Blob([data]);
	    const blobUrl = window.URL.createObjectURL(blob);
	    a.style.display = "none";
	    a.download = "拼赚订单.xls";
	    a.href = blobUrl;
	    a.click();
	  });
	},
    // 搜索页面置一
    searchTitle() {
      this.listQuery.current = 1;
      this.search();
    },
    search() {
      this.listLoading = true;
      this.listQuery.phone == "" ? (this.listQuery.phone = undefined) : "",
	  this.listQuery.time
	    ? ((this.listQuery.minDate = this.listQuery.time[0]),
	      (this.listQuery.maxDate = this.listQuery.time[1]))
	    : ((this.listQuery.minDate = undefined),
	      (this.listQuery.maxDate = undefined));
      spellOrder(this.listQuery).then(res => {
        if (res.code == 0) {
          let listData = res.data.records;
          listData.map((item, index) => {
            item.lowPrice = false;
            item.highPrice = false;
            item.index = index;
          });
          this.list = listData;
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message(res.msg + "请输入有效值！");
        }
      });
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
    reset() {
	 this.listQuery={
        current: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      this.getList();
    },
    // 多选操作
    handleSelectionChange(e) {
      this.handleSelection = e;
    },
  }
};
</script>

<style lang="scss" scoped>
.Shopping {
  line-height: 37px;
}
.el-dialog {
	width: 60%;
}
.Setweight {
  display: flex;
}

.image {
  width: 80px;
  height: 80px;
}

.addFlex {
  display: flex;
  flex-wrap: wrap;
}

.ax_200 {
  // width: 25%;
  height: 50px;
  margin-left: 4px;
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
  width: 80px;
}

.container {
  padding: 20px;
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
