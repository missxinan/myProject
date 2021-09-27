<template>
	<div class="container">
		<div class="OrderTopFlex">
			<!-- <div class="ax_200">
				<el-date-picker v-model="listQuery.startCreateTime" type="datetimerange" range-separator="-"  value-format="yyyy-MM-dd HH:mm:ss"
				 start-placeholder="开始时间" end-placeholder="结束时间">
				</el-date-picker>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.goodsName" style="width: 130px;" clearable  placeholder="请输入商品名称"></el-input>
			</div>

			<div class="ax_200">
				<el-input type="text" v-model="listQuery.activityOrderId" show-word-limit placeholder="请输入订单编号"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.nickName" clearable placeholder="请输入会员昵称"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.phone" clearable placeholder="请输入手机号码"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.consignee" clearable placeholder="请输入收货人姓名"></el-input>
			</div> -->
			<div class="ax_200">
				<el-select v-model="listQuery.orderStatus" clearable placeholder="请选择订单状态">
					<el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</div>
			<div class="ax_200 right">
				<el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchDingDan">搜索</el-button>
				<el-button type="info" style="height:40px" @click="resetDingDan">重置</el-button>
			</div>
		</div>

		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" max-height="650" border fit highlight-current-row>
			<el-table-column label="活动ID" align="center">
				<template slot-scope="scope">
					{{scope.row.activityId }}
				</template>
			</el-table-column>
			<el-table-column label="订单ID" align="center">
				<template slot-scope="scope">
					{{scope.row.id }}
				</template>
			</el-table-column>
			<el-table-column label="用户ID" align="center">
				<template slot-scope="scope">
					{{scope.row.userId }}
				</template>
			</el-table-column>
			<el-table-column label="商品信息" align="center" width="260">
			  <template slot-scope="scope">
			    <div class="goodsInfo_wrap">
			      <div class="goodsImg_wrap">
			        <img class="goods_image" :src="scope.row.headImage" />
			      </div>
			      <div class="goods_right">
			        <span
			          class="goods_name"
			        >{{ scope.row.goodsName }}</span>
			        <span>商品Id：{{ scope.row.goodsId }}</span>
					<span>价格：¥{{ scope.row.goodsPrice }}</span>
			      </div>
			    </div>
			  </template>
			</el-table-column>
			<el-table-column label="参与条件" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.takePart }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="收货人" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.consignee }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="联系方式" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.mobile }}</span>
			  </template>
			</el-table-column>
			<el-table-column label="订单状态" align="center">
			  <template slot-scope="scope">
			    <span v-if="scope.row.orderStatus == 0">进行中</span>
			    <span v-if="scope.row.orderStatus == 1">完成 </span>
			    <span v-if="scope.row.orderStatus == 2">已发货</span>
			  </template>
			</el-table-column>
			<el-table-column label="备注" align="center">
			  <template slot-scope="scope">
			    <span>{{ scope.row.remark }}</span>
			  </template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="Theorderdetails(row)">发货</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
		<sendGoodsDio
		  :flag="showorfalse"
		  v-on:closeDio="closeDio"
		  v-on:callBackSendGoods="sendGoodsFn"
		  :orderId="activityOrderId"
		></sendGoodsDio>
	</div>
</template>

<script>
	import {
		activityOrderApi, sendGoodsApi,activityOrderList
	} from "@/api/activity.js";
	//分页控制
	import Pagination from "@/components/Pagination";
  import sendGoodsDio from "@/components/sendGoods/index.vue";
	const orderStatus = [
		{
			value: '',
			label: '全部'
		},
		{
			value: 0,
			label: '进行中'
		},
		{
			value: 1,
			label: '完成'
		},
		{
			value: 2,
			label: '已发货'
		},
	]
	export default {
		name: 'activityOrder',
		components: {
			Pagination,
      sendGoodsDio
		},
		data() {
			return {
        orderStatus,
				thistotal: 0,
				list: null,
				listLoading: true,
        sendGoodsDialog:false,
        sentGoodsData:{},
				total: 1,
				listQuery: {
					page: 1,
					limit: 10,
				},
        showorfalse:false,
        activityOrderId:''
			}
		},
		created() {
			this.getList();
		},
		methods: {
			searchDingDan() {
				this.listQuery.page = 1
				this.getList();
			},
			// 搜索条件重置
			resetDingDan() {
				for (var key in this.listQuery) {
					this.listQuery[key] = ''
				}
			},
			getList() {
				activityOrderList(this.listQuery).then((res) => {
					if (res.code == 0) {
						this.list = res.data.records;
						this.total = Number(res.data.total);
						this.thistotal = Number(res.data.total);
						this.listLoading = false;
					} else {
						this.$message.error(res.msg);
					}
				})
			},
      sendGoodsFn(value) {
        sendGoodsApi({
          activityOrderId: this.activityOrderId,
          logisticsNo: value.logisticsNo,
          carrierId: value.carrierId
        }).then(res => {
          if (res.code == 0) {
            this.$notify({
              title: "Success",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
            this.showorfalse = false;
            this.getList()
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      Theorderdetails(row){
        this.activityOrderId = row.activityOrderId
      },
      publish() {
        this.showorfalse = true;
      },
      closeDio() {
        this.showorfalse = false;
      },
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20px;
	}

	#u9 {
		border-top: solid 1px #e6e6e6;
	}

	.Shopping {
		line-height: 37px;
	}

	.Setweight {
		display: flex;
	}

	.image {
		width: 40px;
		height: 40px;
	}

	.OrderTopFlex {
		display: flex;
		flex-wrap: wrap;
	}

	.ax_200 {
		margin: 12px 0;
		margin-left: 4px;
		display: flex;
	}

	.ax_200 span {
		line-height: 43px;
		font-size: 15px;
		color: #333;
		font-weight: 400;
	}

	.ax_200 span:nth-child(1) {
		width: 70px;
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
