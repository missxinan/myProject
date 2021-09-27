<template>
	<div class="container">
<!-- 		<div class="OrderTopFlex">
			<div class="ax_200">
				<el-date-picker v-model="ProductionPrice.startCreateTime" type="datetimerange" range-separator="-"  value-format="yyyy-MM-dd HH:mm:ss"
				 start-placeholder="下单开始日期" end-placeholder="下单结束日期">
				</el-date-picker>
			</div>
			<div class="ax_200">
				<el-input v-model="ProductionPrice.goodsNameId" style="width: 130px;" clearable  placeholder="请输入商品名称"></el-input>
			</div>

			<div class="ax_200">
				<el-input type="text" v-model="ProductionPrice.orderId" style="width: 130px;" clearable maxlength="19"  show-word-limit placeholder="请输入订单编号"></el-input>
			</div>
	<div class="ax_200">
				<el-input v-model="ProductionPrice.buyerNamePhone" clearable placeholder="请输入买家信息"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="ProductionPrice.mobile" clearable placeholder="请输入收货人手机号"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="ProductionPrice.consignee" clearable placeholder="请输入收货人姓名"></el-input>
			</div>
			<div class="ax_200 right">
				<el-button type="primary" icon="el-icon-search" style="height:40px" @click="searchDingDan">搜索</el-button>
				<el-button type="info" style="height:40px" @click="resetDingDan">重置</el-button>
			</div>

		</div> -->
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" max-height="650" border fit highlight-current-row>
			<el-table-column align="center" label="id">
				<template slot-scope="scope">{{ scope.row.id }}</template>
			</el-table-column>
			<el-table-column label="用户Id" align="center">
				<template slot-scope="scope">{{ scope.row.userId }}</template>
			</el-table-column>
			<el-table-column align="center" label="订单时间">
				<template slot-scope="scope">{{ scope.row.createTime }}</template>
			</el-table-column>
			<el-table-column label="奖品名称" align="center">
				<template slot-scope="scope">
					{{scope.row.goodsName }}
				</template>
			</el-table-column>
			<el-table-column label="奖品价格" align="center">
				<template slot-scope="scope">
					￥{{scope.row.goodsPrice }}
				</template>
			</el-table-column>
			<el-table-column label="手机号" align="center">
				<template slot-scope="scope">{{ scope.row.mobile }}</template>
			</el-table-column>
			<el-table-column label="抽奖时间" align="center">
				<template slot-scope="scope">{{ scope.row.updateTime }}</template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="Theorderdetails(row)">查看</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
	</div>
</template>

<script>
	import {
		getList,
		activityOrder
	} from "@/api/table";
	//分页控制
	import Pagination from "@/components/Pagination";
	//树形遍历列表
	import {
		requestfile,
		exportBlob
	} from "@/api/blob"
	import {
		getToken
	} from '@/utils/auth.js'
	import qs from 'qs'
	import {
		orderlist
	} from "@/api/Theorderlist.js";
	import {
		treeApi
	} from "@/api/AuctionsRecord.js";
	import {
		goodsInfolist,
		downGoodsInfo,
		settingSort
	} from "@/api/commoditymanagement.js";
	import checkPermission from "@/utils/permission";
	export default {
		name: 'fukubukuroList',
		components: {
			Pagination
		},
		data() {
			return {
				//
				//调试
				activeIndex: '1',
				thistotal: 0,
				debuggers: {
					shoppingname: '',
					weight: '',
					id: '',
				},
				Informationfromtheshelves: '',
				//将来下架商品ID
				goodsId: '',
				Setweight: '',
				list: null,
				listLoading: true,
				props: {
					multiple: true
				},
				total: 1,
				listQuery: {
					page: 1,
					limit: 10,
					importance: undefined,
					title: undefined,
					type: undefined
				},
				ProductionPrice: {
					buyerNamePhone: '',
					goodsNameId: '',
					orderId: '',
					startCreateTime: '',
					orderStatus: '',
					type: '',
					mobile:'',
					consignee:'',
					payTime:''
				},
				//商品分类
				// 级联框
				Cascadebox: [],
				options: [],
				classifyvalue1: '',
				//商品分类
				test: [],
				classifyvalue2: '',
				excelList: [],
				sentGoodsErrorList: [],
				sentGoodsError: false,
				displayArea:3
			}
		},
		created() {
			const phone = this.$route.query  && this.$route.query.phone ? this.$route.query.phone : null;
			if(phone){
				this.ProductionPrice.mobile = phone;
			}
			this.getList();
		},
		computed: {
			Fn: function(shopping) {
				let flag = '';
				this.Obj.some((item, index) => {
					if (item.name === shopping) {
						flag === item.value
						return true
					}
				})
				return flag;
			},
		},
		methods: {
			checkPermission,
			Theorderdetails(row) {
				this.$router.push(`/orderManagement/detail?orderId=${row.orderId}`);
			},
			// 搜索
			searchDingDan() {
				// 每次搜索页面置1
				this.listQuery.page = 1
				if( this.ProductionPrice.startCreateTime == null ){
					this.ProductionPrice.startCreateTime = ''
				}
				this.getList();
			},
			// 搜索条件重置
			resetDingDan() {
				for (var key in this.ProductionPrice) {
					this.ProductionPrice[key] = ''
				}
			},
			getList() {
				let Obj = this.dealWithRequestDate();
				activityOrder({ ...Obj}).then((res) => {
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
			// 所有请求参数处理
			dealWithRequestDate(){
				this.listLoading = true;
				let startCreateTime = this.ProductionPrice.startCreateTime[0];
				let endCreateTime = this.ProductionPrice.startCreateTime[1];
				let Obj = this.fliterfunc({ ...this.ProductionPrice,
					startCreateTime,
					endCreateTime,
					current: this.listQuery.page,
					size: this.listQuery.limit,
				});
				return Obj
			},
			fliterfunc(Obj) {
				for (let key in Obj) {
					if (Obj[key]) {
						if (Object.prototype.toString.call(Obj[key]) == "[object String]") {
							if (Obj[key].indexOf("NaN") != -1) {
								delete Obj[key]
							} else {
								Obj[key] = Obj[key]
							}
						} else {
							Obj[key] = Obj[key]
						}
					} else {
						delete Obj[key]
					}
				}
				return Obj
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
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
