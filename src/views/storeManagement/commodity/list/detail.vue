<template>
	<div class="container" id="containerly" style="padding:20px;">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基础信息</span>
			</div>
			<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="商品分类" prop='classificationofgoods'>
					<div class="block">
                        {{ ruleForm.categoryName }}
					</div>
				</el-form-item>
				<el-form-item label="商品名称" prop="goodsName">
                    <span>{{ ruleForm.goodsName }}</span>
				</el-form-item>
				<el-form-item label="商品简介" prop="description">
                    <span>{{ ruleForm.description }}</span>
				</el-form-item>
				<el-form-item label="封面图展示" prop="logo">
					<div class="selectedDisplayarea">
						<img :src="ruleForm.logo" style="width:150px;height:150px;" alt="图片出错">
					</div>
				</el-form-item>


				<el-form-item label="头图展示区" prop="headImage">
					<div class="showimages">
						<vuedraggable class="wrapper" v-model="ruleForm.headImage">
							<transition-group style="display:flex;">
							<div v-for="(item,index) in ruleForm.headImage"
								:key="index">
									<img :src="item" style="width:150px;height:150px;margin-right:20px;" :alt="'图片'+index">
								</div>
							</transition-group>
						</vuedraggable>
					</div>
				</el-form-item>


				<el-form-item label="成本价" prop="costPrice">
                    <span>{{ ruleForm.costPrice }}</span>
				</el-form-item>

				<el-form-item label="估价" prop="assessPrice">
                    <span>{{ ruleForm.assessPrice }}</span>
				</el-form-item>
			<el-form-item label="赠送积分" prop="isGiveIntegral">
                    <span>{{ ruleForm.isGiveIntegral*1000/10 }}%</span>
				</el-form-item>
				</el-form>
		</el-card>
		<el-card class="box-card" v-if="userInfoShow == true">
			<div slot="header" class="clearfix">
				<span>寄拍用户信息</span>
			</div>
			<div class="userInfo">
				<img class="infoAvatar" :src="userInfo.avatar">
				<div class="userInfo_tel">
					<span class="user_name">{{ userInfo.nickname }}</span>
					<span class="user_tel">{{ userInfo.phone }}</span>
				</div>
			</div>
		</el-card>
		<el-card class="box-card" v-if="userInfoShow == true">
			<div slot="header" class="clearfix">
				<span>拍卖记录</span>
			</div>
			<!-- 将来的动态data值 -->
			<el-table :data="list" element-loading-text="Loading" border fit highlight-current-row>
				<el-table-column align="center" label="记录ID">
					<template slot-scope="scope">{{ scope.row.auctionId }}</template>
				</el-table-column>
				<el-table-column label="商品名称" align="center">
					<template slot-scope="scope">{{ scope.row.goodsName }}</template>
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
				</el-table-column>

				<el-table-column label="最高保护价" class="is-required" align="center">
					<template slot-scope="scope">
						{{scope.row.maxProtectPrice}}
					</template>

				</el-table-column>
				<el-table-column label="开拍时间" align="center">
					<template slot-scope="scope">{{ scope.row.startTime}}</template>
				</el-table-column>
				<el-table-column label="截拍时间" align="center">
					<template slot-scope="scope">{{ scope.row.endTime}}</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
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
						<div v-if="7 === scope.row.status">
							已关闭
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
			</el-table>
			<pagination v-show="total>0" :total="total" :limit.sync="listQuery.limit" :page.sync="listQuery.page" @pagination="getrecordList" />
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>详情</span>
			</div>
            <div v-html="ruleForm.goodsDetail"></div>
			<el-button type="primary" @click="cancel">取消</el-button>
		</el-card>
	</div>
</template>

<script>
	import { goodsInfoDetail } from "@/api/platcommoditymanagement.js"
	import {
		auctionRecordInfoList,
	} from "@/api/AuctionsRecord.js";
	import vuedraggable from 'vuedraggable'
	import pagination from '@/components/Pagination'
	export default {
        components:{
			vuedraggable,
			pagination
        },
		data() {
			return {
				total:0,
				listQuery:{
					page: 1,
					limit: 10
				},
				userInfoShow:false,
				ruleForm: {
					headImage:[],
				},
				list:[]
			}
		},
		created() {
            this.getGoodsDetail();
		},
		methods: {
			getGoodsDetail(){
				goodsInfoDetail({goodsId:this.$route.query.goodsId}).then(res=>{
					if(res.code == 0){
						res.data.goodsInfo.headImage = JSON.parse(res.data.goodsInfo.headImage)
						let arr = []
						let str = res.data.goodsInfo.categoryId
						if(str.length > 4){
							arr.push(str.slice(0,4))
							arr.push(str)
						}else{
							arr.push(str)
						}
						if (res.data.member) {
							console.log(res.data.member, 'res.data.member')
							this.userInfo = res.data.member
							this.userInfoShow = true
							this.getrecordList()
						}
						res.data.goodsInfo.classificationofgoods = arr
						this.ruleForm = res.data.goodsInfo
						console.log(this.ruleForm ,'this.ruleForm ')
					}
				})
            },
            cancel() {
				this.$router.push('/storeManagement/commodityList');
			},
			// 请求出价记录
			getrecordList() {
				auctionRecordInfoList({
					size: this.listQuery.limit,
					current: this.listQuery.page,
					goodsId: this.$route.query.goodsId
				}).then((res) => {
					if (res.msg === 'success') {
						this.list = res.data.records;
						this.total = Number(res.data.total);
						this.listLoading = false;
					} else {
						console.error('服务器开小差了！')
					}

				})
			}
		}
	}
</script>

<style>
	/* 用户信息 */
	.userInfo {
		display: flex;
		align-items: center;
	}

	.infoAvatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin-right: 20px;
	}

	.userInfo_tel {
		display: flex;
		flex-direction: column;
	}

	.user_name {
		margin-bottom: 20px;
	}
</style>
