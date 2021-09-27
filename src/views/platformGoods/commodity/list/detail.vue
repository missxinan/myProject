<template>
	<div class="container" id="containerly">
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
						<img :src="ruleForm.logo" style="width:100px;height:100px;" alt="图片出错">
					</div>
				</el-form-item>

				<el-form-item label="头图展示区" prop="headImage">
					<div class="showimages">
						<vuedraggable class="wrapper" v-model="ruleForm.headImage">
							<transition-group style="display:flex;">
							<div v-for="(item,index) in ruleForm.headImage"
								:key="index">
									<img :src="item" style="width:100px;height:100px;margin-right:20px;" :alt="'图片'+index">
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
        <el-form-item label="赠送积分比" prop="assessPrice">
          <span>{{ ruleForm.isGiveIntegral*1000/10 }}%</span>
        </el-form-item>
				<!-- <el-form-item label="商品限价" prop="isLimitPrice">
          <span>{{ ruleForm.isLimitPrice == 1 ? '开启' : '关闭' }}</span>
				</el-form-item>
				<el-form-item v-if="ruleForm.isLimitPrice == 1" :prod=" ruleForm.isLimitPrice == 1 ? 'limitPrice' : ''" label="限价价格">
          <span>{{ ruleForm.limitPrice }}</span>
				</el-form-item> -->
			</el-form>
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
	import vuedraggable from 'vuedraggable'
	export default {
        components:{
            vuedraggable
        },
		data() {
			return {
				ruleForm: {
					headImage:[]
				},
				ruleFormArray:[]
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
						res.data.goodsInfo.classificationofgoods = arr
						this.ruleForm = res.data.goodsInfo
						if( res.data.goodsInfo.integralType == 2 ){
							// this.ruleFormArray =JSON.parse(JSON.stringify(res.data.goodsInfo.goodsMealList))
							res.data.goodsInfo.goodsMealList.map((item,index)=>{
								console.log(item,'1231231')
								item.row = 2
								let goodsList = []
								if( item.mallGoodsIds){
									let mallGoodsIdsArr =  item.mallGoodsIds.split(';')
									let mallGoodsNamesArr =  item.mallGoodsNames.split(';')
									let obj = {}
									mallGoodsIdsArr.map((ite,index)=>{
										obj = {}
										obj.goodsId = mallGoodsIdsArr[index]
										obj.goodsName = mallGoodsNamesArr[index]
										goodsList.push(obj)
									})
								}
								item.goodsList = goodsList
							})
							this.ruleFormArray =JSON.parse(JSON.stringify(res.data.goodsInfo.goodsMealList))
							delete this.ruleForm.goodsMealList
						}
					}
				})
            },
            cancel() {
				this.$router.push('/platformGoods/platformGoods');
			},
		}
	}
</script>

<style>

</style>
