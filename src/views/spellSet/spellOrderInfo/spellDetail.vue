<template>
  <div class="container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      max-height="600"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="拼赚订单id">
        <template slot-scope="scope">{{ scope.row.spellMakeOrderId }}</template>
      </el-table-column>
      <el-table-column label="参与用户ID" align="center" width="260">
        <template slot-scope="scope">{{ scope.row.userId }}</template>
      </el-table-column>
	  <el-table-column align="center" label="邀请人id">
	    <template slot-scope="scope">{{ scope.row.parentId }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="用户id">
	    <template slot-scope="scope">{{ scope.row.userId }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="用户昵称">
	    <template slot-scope="scope">{{ scope.row.nickname }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="支付金额">
	    <template slot-scope="scope">{{ scope.row.price }}</template>
	  </el-table-column>
	  <el-table-column align="center" label="创建时间">
	    <template slot-scope="scope">{{ scope.row.createTime }}</template>
	  </el-table-column>
	  <el-table-column label="标识" align="center">
	    <template slot-scope="scope">
		<span v-if="scope.row.sign==0"> 用户占位 </span>
		<span v-if="scope.row.sign==1">机器人补位</span>
		</template>
	  </el-table-column>
	  <el-table-column label="支付方式 " align="center">
	    <template slot-scope="scope">
			<span v-if="scope.row.payType==1"> 余额支付</span>
			<span v-if="scope.row.payType==3">支付宝支付</span>
		</template>
	  </el-table-column>
    </el-table>
  </div>
</template>

<script>
//tablelist中需要改接口
import { getList } from "@/api/table";
import {
  spellOrderInfo
} from "@/api/spellRecord.js";
export default {
  name: "spellDetail",
  data() {
    return {
      list: null,
      listLoading: true,
      total: 1,
    };
  },
  created() {
  },
  mounted() {
  	this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      spellOrderInfo({
		  spellMakeOrderId:this.$route.query.spellMakeOrderId
	  }).then(res => {
        if (res.code == 0) {
          let listData = res.data;
          this.list = JSON.parse(JSON.stringify(listData));
          this.total = Number(res.data.total);
          this.listLoading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
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
