<template>
	<div class="vipAuditing-container">
		<div class="Flex">
			<div class="ax_200">
				<el-date-picker v-model="listQuery.startTimeValue" type="datetimerange" range-separator="~" start-placeholder="开始申请日期"
				 end-placeholder="结束申请日期" format="yyyy-MM-dd HH:mm"  value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.goodsName" clearable placeholder="请输入商品名称" maxlength="80" style="width: 160px;"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.vipGoodsId" clearable placeholder="请输入商品ID" maxlength="18" style="width: 160px;"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.roomName" clearable placeholder="请输入店铺名称" maxlength="80" style="width: 160px;"></el-input>
			</div>
			<div class="ax_200">
				<el-input v-model="listQuery.roomNumber" clearable placeholder="请输入店铺编号" maxlength="18" style="width: 160px;"></el-input>
			</div>
			<div class="ax_200">
				<el-select v-model="listQuery.status" clearable placeholder="请选择商品状态" style="width: 160px;">
					<el-option v-for="item in goodsStatus" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="ax_200 right">
				<el-button type="primary" icon="el-icon-search" style="height:40px" @click="search">搜索</el-button>
				<el-button style="height:40px" @click="reset">重置</el-button>
			</div>
		</div>
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" style="width:100%" border max-height="750" fit
		 highlight-current-row :default-sort="{prop: 'startTime', order: 'descending'}">
		   <el-table-column label="申请时间" align="center" width="100">
				<template slot-scope="scope">
					{{scope.row.createTime}}
				</template>
			</el-table-column>
			<el-table-column label="商品信息" align="center" width="260">
				<template slot-scope="scope">
					<div class="goodsInfo_wrap">
						<div class="goodsImg_wrap">
							<img class="goods_image"  :src="scope.row.logo" />
						</div>
						<div class="goods_right">
							<span class="goods_name">{{ scope.row.goodsName }}</span>
							<span>{{ scope.row.vipGoodsId }}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="商品分类" align="center">
				<template slot-scope="scope">{{ scope.row.categoryName }}</template>
			</el-table-column>
			<el-table-column label="起拍价格" align="center">
				<template slot-scope="scope">{{ scope.row.startPrice }}</template>
			</el-table-column>
			<el-table-column label="加价" align="center">
				<template slot-scope="scope">
					{{scope.row.markupPrice}}
				</template>
			</el-table-column>

			<el-table-column label="开拍时间" align="center" width="100">
				<template slot-scope="scope">
					{{scope.row.startTime}}
				</template>
			</el-table-column>
			<el-table-column label="结拍时间" align="center" width="100">
				<template slot-scope="scope">
					{{scope.row.endTime}}
				</template>
			</el-table-column>

			<el-table-column label="拍卖店铺" align="center">
				<template slot-scope="scope">
					{{scope.row.roomNumber}}
					{{scope.row.roomName}}
				</template>
			</el-table-column>
				<el-table-column label="备注" align="center">
				<template slot-scope="scope">
					{{scope.row.remark}}
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center">
				 <template slot-scope="{row}">
              <el-tag
				:type="row.status == 0 ? '' : (row.status == 1 ? 'success' : 'danger')"
              >{{ row.status == 0 ? '待审核' : row.status == 1 ? '审核通过' : '拒绝' }}</el-tag>
            </template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
				<template slot-scope="{row}">
					<el-button type="text" size="mini" v-if="row.status == 0" @click="auditAuction(row.auctionApplyId)" >审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination 
		v-show="total>0" 
		:total="total" 
		:limit.sync="listQuery.size" 
		:page.sync="listQuery.current"
		 @pagination="getList" />

		 <el-dialog title="审核" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm"
				:model="temp"
				label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
			>
				<el-form-item label="审核状态" prop="status">
					<el-radio v-model="temp.status" label="1">审核通过</el-radio>
					<el-radio v-model="temp.status" label="2">审核拒绝</el-radio>
				</el-form-item>
				<el-form-item label="备注" :prop="temp.status == 2 ? 'remark' : ''  ">
					<textarea v-model="temp.remark" maxlength="100"></textarea>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary"    @click="updateData()">提交</el-button>
			</div>
			</el-dialog>
	</div>
</template>

<script>
	//分页控制
	import Pagination from "@/components/Pagination";
	import checkPermission from "@/utils/permission";
	import { vipActionsList, vipActionsAudit } from "@/api/AuctionsRecord.js";
	const goodsStatus = [
		{
			value: '',
			label: '全部'
		}, {
			value: 0,
			label: '审核中'
		}, {
			value: 1,
			label: '审核成功'
		},{
			value: 2,
			label: '审核失败'
		},
	]
	export default {
		components: {
			Pagination
		},
		props: ['totals'],
		data() {
			return {
				dialogFormVisible: false,
				listLoading: true,
				//商品来源
				goodsStatus,
				total: 0,
				list:[],
				listQuery: {
					current: 1,
					size: 10,
					startTimeValue: undefined,
					goodsName: undefined,
					vipGoodsId: undefined,
					status:undefined,
					roomName:undefined,
					roomNumber:undefined
				},
				temp: {
					remark:undefined,
					status:undefined,
					goodsId:undefined
				},
				rules:{
					remark:[{ required: true, message: '请填写审核原因', trigger: 'change' }],
					status:[{ required: true, message: '审核状态', trigger: 'change' }],
				},
				submitClick:true
			}
		},
		created() {
			this.getList();
			
		},
		methods: {
			checkPermission,
			getList() {
				this.listLoading = true;
				(this.listQuery.startTimeValue != undefined && this.listQuery.startTimeValue.length > 0) ? (this.listQuery.startTime = this.listQuery.startTimeValue[0],this.listQuery.endTime = this.listQuery.startTimeValue[1]) : ''
				// delete this.listQuery.startTimeValue
				vipActionsList(this.listQuery).then((res) => {
					if (res.code == 0) {
						this.list = res.data.records;
						this.total = Number(res.data.total);
						this.listLoading = false;
					} else {
						this.$message(res.msg);
					}
				})
			},
			search(){
				this.listQuery.current = 1
				this.getList();
			},
			reset() {
				this.listQuery={
					startTimeValue: undefined,
					goodsName: undefined,
					vipGoodsId: undefined,
					status:undefined,
					roomName:undefined,
					roomNumber:undefined
				}
			},
			auditAuction(goodsId){
				this.temp = {
					remark:undefined,
					status:undefined,
					auctionApplyId:goodsId
				}
				this.dialogFormVisible = true
			},
			updateData(){
				this.submitClick = false
				vipActionsAudit(this.temp).then(res=>{
					if( res.code == 0 ){
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.dialogFormVisible = false
						this.getList();
						this.submitClick = true
					}else{
						this.$message.error(res.msg);
						this.submitClick = true
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
    .vipAuditing-container{
        padding: 20px;
        box-sizing: border-box;
    }
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
