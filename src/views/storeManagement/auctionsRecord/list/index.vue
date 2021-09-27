<template>
	<div class="container">
		<div class="Flex">
			<div class="ax_200">
				<span>开拍时间</span>
				<el-date-picker v-model="ProductionPrice.startTimeValue" type="datetimerange" range-separator="~" start-placeholder="开始日期"
				 end-placeholder="结束日期">
				</el-date-picker>
			</div>

			<div class="ax_200">
				<span>结拍时间</span>
				<el-date-picker v-model="ProductionPrice.finishTimeValue" type="datetimerange" range-separator="~"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</div>

			<div class="ax_200">
				<div class="block">
					<span class="demonstration">商品分类</span>
					<el-cascader v-model="ProductionPrice.cascade" :options="options" :props="props" collapse-tags @change="handleChange"
					 clearable></el-cascader>
				</div>
			</div>


			<!-- <div class="ax_200">
            <span>商品状态</span>
            <el-select v-model="ProductionPrice.goodsStatus" placeholder="请选择">
                <el-option
                v-for="item in shoppingStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div> -->

			<div class="ax_200">
				<span>起拍价格</span>
				<el-input v-model="ProductionPrice.start" placeholder="请输入内容" style="width:110px"></el-input>
				<span>~</span>
				<el-input v-model="ProductionPrice.end" placeholder="请输入内容" style="width:110px"></el-input>
			</div>

			<div class="ax_200">
				<span>商品名称</span>
				<el-input v-model="ProductionPrice.productName" placeholder="请输入内容"></el-input>
			</div>

			<div class="ax_200">
				<span style="width: 40px;">来源</span>
				<el-select v-model="ProductionPrice.sources" placeholder="请选择">
					<el-option v-for="item in Sources" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>

			<div class="ax_200 right">
				<el-button type="primary" icon="el-icon-search" style="height:40px" @click="search">搜索</el-button>
				<el-button style="height:40px" @click="reset">重置</el-button>
				<el-button style="height:40px" @click="zhengxuanddaoxu">{{zhengxu}}</el-button>
			</div>
		</div>


		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
			<el-table-column align="center" label="记录ID">
				<template slot-scope="scope">{{ scope.row.auctionId }}</template>
			</el-table-column>
			<el-table-column label="商品名称" align="center">
				<template slot-scope="scope">{{ scope.row.goodsName }}</template>
			</el-table-column>
			<el-table-column label="商品图片" align="center">
				<template slot-scope="scope">
					<img class="image" :src="scope.row.logo" />
				</template>
			</el-table-column>
			<el-table-column label="商品类别" align="center">
				<template slot-scope="scope">{{ scope.row.categoryName }}</template>
			</el-table-column>
			<el-table-column label="起拍价格" align="center">
				<template slot-scope="scope">{{ scope.row.startPrice }}</template>
			</el-table-column>
			<el-table-column label="加价" align="center">
				<template slot-scope="scope">{{ scope.row.markupPrice  }}</template>
			</el-table-column>
			<el-table-column label="最低保护价" class="is-required" align="center">
				<template slot-scope="scope">
					{{scope.row.protectPrice}}
				</template>
				<!-- <el-input v-model="AuctionSet.AuctionSetregion"></el-input> -->
				<!-- <el-input v-model="AuctionSet.maxProtectPrice"></el-input> -->
				<!-- <el-input v-model="AuctionSet.protectPrice"></el-input> -->
			</el-table-column>

			<el-table-column label="最高保护价" class="is-required" align="center">
				<template slot-scope="scope">
					{{scope.row.maxProtectPrice}}
				</template>
				<!-- <el-input v-model="AuctionSet.AuctionSetregion"></el-input> -->
				<!-- <el-input v-model="AuctionSet.maxProtectPrice"></el-input> -->
				<!-- <el-input v-model="AuctionSet.protectPrice"></el-input> -->
			</el-table-column>
			<!-- <el-table-column label="保护价" align="center">
                <template slot-scope="scope">
                {{scope.row.protectPrice}}
                </template>
            </el-table-column> -->
			<el-table-column label="开拍时间" align="center">
				<template slot-scope="scope">{{ scope.row.startTime}}</template>
			</el-table-column>
			<el-table-column label="截拍时间" align="center">
				<template slot-scope="scope">{{ scope.row.endTime}}</template>
			</el-table-column>
			<el-table-column label="商品状态" align="center">
				<template slot-scope="scope">
					<div v-if="1 === scope.row.status">
						上架
					</div>
					<div v-if="2 === scope.row.status">
						预展
					</div>
					<div v-if="3 === scope.row.status">
						竞拍中
					</div>
					<div v-if="4 === scope.row.status">
						已售
					</div>
					<div v-if="5 === scope.row.status">
						已流拍
					</div>
					<div v-if="6 === scope.row.status">
						下架
					</div>
				</template>
			</el-table-column>
			<el-table-column label="来源" align="center">
				<template slot-scope="scope">
					<div v-if="1 === scope.row.source">
						商城
					</div>
					<div v-if="2 === scope.row.source">
						平台
					</div>
				</template>
			</el-table-column>
			<el-table-column label="机器人" align="center">
				<template slot-scope="scope">
					<el-tag :type=" scope.row.openRobot == 0 ? 'warning' : ''">
						{{ scope.row.openRobot == 0 ? '禁用' : '启用'  }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="primary" size="mini" @click="soldoutl(row)" v-if="row.status === 4">查看订单</el-button>
					<el-button type="primary" size="mini" @click="CheckFile(row)">查看</el-button>
					<el-button type="danger" v-if="row.status == 2" size="mini" @click="robotForbidden(row.auctionId,row.openRobot)">{{ row.openRobot == 0 ? '机器人启用' : '机器人禁用'  }}</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getList" />
	</div>
</template>

<script>
	//tablelist中需要改接口
	import {
		getList
	} from "@/api/table";
	import Pagination from "@/components/Pagination";
	import {
		fetchList,
	} from "@/api/userInfo.js";
	import {
		auctionRecordInfoList,
		treeApi,
		robotForbidden
	} from "@/api/AuctionsRecord.js";
	export default {
		name: 'auctionsRecordList',
		components: {
			Pagination
		},
		data() {

			return {
				//
				Setweight: '',
				list: null,
				listLoading: true,
				props: {
					multiple: true
				},
				zhengxu: '点击倒序',
				//商品来源
				Sources: [{
					value: 1,
					label: '商城'
				}, {
					value: 2,
					label: '平台'
				}],
				shoppingStatus: [{
					value: 1,
					label: '待上架'
				}, {
					value: 2,
					label: '预展'
				}, {
					value: 3,
					label: '竞拍中'
				}, {
					value: 4,
					label: '已售'
				}, {
					value: 5,
					label: '已流拍'
				}, {
					value: 6,
					label: '下架'
				}],
				//----
				total: 1,
				listQuery: {
					page: 1,
					limit: 10,
					importance: undefined,
					title: undefined,
					type: undefined
				},
				//
				dialogFormVisible: false,
				soldOut: false,
				ProductionPrice: {
					start: '',
					end: '',
					productName: '',
					sources: '',
					startTimeValue: '',
					finishTimeValue: '',
					goodsStatus: '',
					cascade: []
				},
				//商品分类
				// 级联框
				Cascadebox: [],
				options: [],
				classifyvalue1: '',
				//商品分类
				test: [],
				classifyvalue2: '',
			}
		},
		created() {
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
			zhengxuanddaoxu() {
				this.listLoading = true;
				if (this.zhengxu == '点击正序') {
					this.zhengxu = '点击倒序';
					let Obj = this.fliterfunc({
						categoryId: this.Flagfunc(),
						size: this.listQuery.limit,
						current: this.listQuery.page,
						timeSort: 1,
						source: this.ProductionPrice.sources,
						status: this.ProductionPrice.goodsStatus,
						startStartPrice: this.ProductionPrice.start,
						endStartPrice: this.ProductionPrice.end,
						goodsName: this.ProductionPrice.productName,
						startStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null ||
							this.ProductionPrice.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
						endStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this.ProductionPrice
							.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
						startEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null ||
							this.ProductionPrice.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[
								0]),
						endEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this.ProductionPrice
							.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
					});
					auctionRecordInfoList({
						...Obj
					}).then((res) => {
						if (res.msg === 'success') {
							this.list = res.data.records;
							this.total = Number(res.data.total);
							this.listLoading = false;
						} else {
							console.error('服务器开小茶了！')
						}

					})
				} else {
					this.zhengxu = '点击正序';
					let Obj = this.fliterfunc({
						categoryId: this.Flagfunc(),
						size: this.listQuery.limit,
						current: this.listQuery.page,
						source: this.ProductionPrice.sources,
						timeSort: 2,
						status: this.ProductionPrice.goodsStatus,
						startStartPrice: this.ProductionPrice.start,
						endStartPrice: this.ProductionPrice.end,
						goodsName: this.ProductionPrice.productName,
						startStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null ||
							this.ProductionPrice.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
						endStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this.ProductionPrice
							.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
						startEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null ||
							this.ProductionPrice.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[
								0]),
						endEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this.ProductionPrice
							.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
					});
					auctionRecordInfoList({
						...Obj
					}).then((res) => {
						if (res.msg === 'success') {
							this.list = res.data.records;
							this.total = Number(res.data.total);
							this.listLoading = false;
						} else {
							console.error('服务器开小茶了！')
						}

					})
				}
			},
			soldoutl(row) {
				this.$router.push({
					path: '/orderManagement/orderList/detail',
					query: {
						auctionId: row.auctionId
					}
				})
			},
			//下架
			handleChange(value) {
				console.log('Hello,World');
			},
			CheckFile(row) {
				this.$router.push({
					path: '/storeManagement/auctionsRecord/auctionsRecordDetail',
					query: row
				});
			},
			soldout(row) {
				this.soldOut = true;
			},
			//调序
			Thesequence(row) {
				this.dialogFormVisible = true;
			},
			Flagfunc() {
				let Flag = null;
				let Basic = false;
				if (this.ProductionPrice.cascade.length === 0) {
					Flag = '';
				} else {
					if (this.ProductionPrice.cascade.length > 1) {
						Flag = this.ProductionPrice.cascade[0][0];
						for (let i = 0; i < this.ProductionPrice.cascade.length; i++) {
							this.ProductionPrice.cascade[i].some((item, index) => {
								if (item === Flag) {
									Basic = true;
									return true
								} else {
									Basic = false;
									return true
								}
							})
						}

						if (Basic) {
							let pop = false;
							this.options.some((item, index) => {
								if (item.value === Flag) {
									if (item.children.length === this.ProductionPrice.cascade.length) {
										Flag = this.ProductionPrice.cascade[0][0];
										return true
									} else {
										pop = true;
										return true
									}
								}
							})
							if (pop) {
								this.$message('商品分类只能选择一个');
								return
							}

						} else {
							this.$message('商品分类只能选择一个');
							return
						}

					} else {
						if (this.ProductionPrice.cascade[0].length > 1) {
							Flag = this.ProductionPrice.cascade[0][1]
						} else {
							Flag = this.ProductionPrice.cascade[0][0]
						}
					}
				}
				return Flag;
			},
			getList() {
				this.listLoading = true;
				let Obj = this.fliterfunc({
					categoryId: this.Flagfunc(),
					size: this.listQuery.limit,
					current: this.listQuery.page,
					source: this.ProductionPrice.sources,
					status: this.ProductionPrice.goodsStatus,
					startStartPrice: this.ProductionPrice.start,
					endStartPrice: this.ProductionPrice.end,
					goodsName: this.ProductionPrice.productName,
					startStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this
						.ProductionPrice.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
					endStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this.ProductionPrice
						.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
					startEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this
						.ProductionPrice.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
					endEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this.ProductionPrice
						.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
				});
				auctionRecordInfoList({
					...Obj,
					timeSort: this.zhengxu === '点击倒序' ? 1 : 2,
				}).then((res) => {
					if (res.msg === 'success') {
						this.list = res.data.records;
						this.total = Number(res.data.total);
						this.listLoading = false;
					} else {
						console.error('服务器开小茶了！')
					}

				})

				treeApi().then((res) => {
					this.test = [];
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].subCategorys.length > 0) {
							this.test.push({
								value: res.data[i].categoryId,
								label: res.data[i].name,
								children: []
							})
							for (let j = 0; j < res.data[i].subCategorys.length; j++) {
								this.test[i].children.push({
									value: res.data[i].subCategorys[j].categoryId,
									label: res.data[i].subCategorys[j].name
								})
							}
						} else {
							this.test.push({
								value: res.data[i].categoryId,
								label: res.data[i].name
							})
						}

					}
					this.options = this.test;
				})
			},
			//问题出现的点，无线递归
			Tosortoutthetree(json, arr) {
				for (var i = 0; i < json.length; i++) {
					var sonList = json[i].subCategorys;
					if (sonList.length == 0) {
						arr.push({
							value: json[i].categoryId,
							label: json[i].name,
							children: []
						});
					} else {
						arr.push({
							value: json[i].categoryId,
							label: json[i].name,
							children: []
						});
						this.Tosortoutthetree(sonList, arr[i].children);
					}
				}
				return arr;

			},
			search() {
				this.listLoading = true;
				let Flag = null;
				let Basic = false;
				if (this.ProductionPrice.cascade.length === 0) {
					Flag = '';
				} else {
					if (this.ProductionPrice.cascade.length > 1) {
						Flag = this.ProductionPrice.cascade[0][0];
						for (let i = 0; i < this.ProductionPrice.cascade.length; i++) {
							this.ProductionPrice.cascade[i].some((item, index) => {
								if (item === Flag) {
									console.log(111)
									Basic = true;
									return true
								} else {
									Basic = false;
									return true
								}
							})
						}

						if (Basic) {
							let pop = false;
							this.options.some((item, index) => {
								if (item.value === Flag) {
									if (item.children.length === this.ProductionPrice.cascade.length) {
										Flag = this.ProductionPrice.cascade[0][0];
										return true
									} else {
										pop = true;
										return true
									}
								}
							})
							if (pop) {
								this.$message('商品分类只能选择一个');
								return
							}

						} else {
							this.$message('商品分类只能选择一个');
							return
						}

					} else {
						if (this.ProductionPrice.cascade[0].length > 1) {
							Flag = this.ProductionPrice.cascade[0][1]
						} else {
							Flag = this.ProductionPrice.cascade[0][0]
						}
					}
				}

				let Obj = this.fliterfunc({
					categoryId: Flag,
					size: this.listQuery.limit,
					source: this.ProductionPrice.sources,
					status: this.ProductionPrice.goodsStatus,
					startStartPrice: this.ProductionPrice.start,
					endStartPrice: this.ProductionPrice.end,
					goodsName: this.ProductionPrice.productName,
					startStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this
						.ProductionPrice.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[0]),
					endStartTime: this.ProductionPrice.startTimeValue == '' || this.ProductionPrice.startTimeValue == null || this.ProductionPrice
						.startTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.startTimeValue[1]),
					startEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this
						.ProductionPrice.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[0]),
					endEndTime: this.ProductionPrice.finishTimeValue == '' || this.ProductionPrice.finishTimeValue == null || this.ProductionPrice
						.finishTimeValue == undefined ? '' : this.ChangeTime(this.ProductionPrice.finishTimeValue[1])
				});

				auctionRecordInfoList(Obj).then((res) => {
					if (res.msg === 'success') {
						this.list = res.data.records;
						this.total = Number(res.data.total);
						this.listLoading = false;
					} else {
						this.$message(res.msg + '请输入有效值！');
					}
				})
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
				console.log(Obj, '处理后');
				return Obj
			},
			//时间转换方法
			ChangeTime(d) {
				var d = new Date(d);
				var startStartTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
					':' + d.getSeconds();
				return startStartTime
			},
			reset() {
				for (var key in this.ProductionPrice) {
					this.ProductionPrice[key] = '';
				}
			},
			// 禁用启用机器人 新增
			robotForbidden(auctionId, opendRobot) {
				console.log(opendRobot, 'openRobot')
				console.log(opendRobot == 0 ? 1 : 0)
				let dataobg = {
					auctionId: auctionId,
					opendRobot: opendRobot == 0 ? 1 : 0
				}
				robotForbidden(dataobg).then(res => {
					if (res.code == 0) {
						this.$message({
							message: '操作成功',
							type: 'success'
						})
						this.getList()
					} else {
						this.$message({
							message: res.msg,
							type: 'error'
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
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

	.Flex {
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
