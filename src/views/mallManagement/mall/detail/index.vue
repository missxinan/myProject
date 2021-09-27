<template>
	<div class="mall-detail">
		<div class="detail-content">
			<div class="detail-title">
				<span class="title-line"></span>
				<span class="title-text">基础信息</span>
			</div>
			<div class="detail-main">
				<div class="item">
					<span class="item-text">商品分类：</span>
					<span class="item-value">{{goodsDetail.categoryName}}</span>
				</div>
				<div class="item">
					<span class="item-text">商品类型：</span>
					<span class="item-value">{{goodsDetail.goodsType == 1?"寄拍":"换购"}}</span>
				</div>
				<div class="item">
					<span class="item-text">商品名称：</span>
					<span class="item-value">{{goodsDetail.goodsName}}</span>
				</div>
				<div class="item">
					<span class="item-text">商品简介：</span>
					<span class="item-value">{{goodsDetail.description}}</span>
				</div>
				<div class="item">
					<span class="item-text">封面图：</span>
					<img class="item-img" :src="goodsDetail.logo" />
				</div>
				<div class="item">
					<span class="item-text">头图：</span>
					<img class="item-img" v-for="(item,index) in headImage" :src="item" :key="index"/>
				</div>
				<div class="item">
					<span class="item-text">成本价：</span>
					<span class="item-value">{{goodsDetail.costPrice}}</span>
				</div>
				<div class="item">
					<span class="item-text">价格类型：</span>
					<span class="item-value">{{goodsDetail.priceType == 1?'积分':goodsDetail.priceType == 2?'积分+金额':'金额'}}</span>
				</div>
				<div class="item">
					<span class="item-text">价格：</span>
					<span class="item-value">{{goodsDetail.price}}</span>
				</div>
				<div class="item">
					<span class="item-text">积分：</span>
					<span class="item-value">{{goodsDetail.integral}}</span>
				</div>
				<div class="item">
					<span class="item-text">估值：</span>
					<span class="item-value">{{goodsDetail.assessPrice}}</span>
				</div>
				<div class="item">
					<span class="item-text">权重：</span>
					<span class="item-value">{{goodsDetail.sort}}</span>
				</div>
			</div>
			<div class="detail-title">
				<span class="title-line"></span>
				<span class="title-text">详情</span>
			</div>
			<div class="detail-main">
				<div v-html="goodsDetail.goodsDetail"></div>
				<!-- <tinymce v-model="goodsDetail.goodsDetail" ></tinymce> -->
			</div>
		</div>
	</div>
</template>

<script>
import { goodsDetailMall } from "@/api/mallManagement.js";
import tinymce from '@/components/Tinymce'
export default {
	name:'mallDetail',
	components: {
		tinymce
	},
	data() {
		return {
			goodsId:'',
			goodsDetail:'',
			headImage:[]
		}
	},
	created() {
		let goodsId = this.$route.query.goodsId;
		this.goodsId = goodsId;
		this.getGoodsDetail();
	},
	methods: {
		getGoodsDetail(){
			let that = this;
			let data = {
				goodsId: that.goodsId
			}
			goodsDetailMall(data).then((res) =>{
				if(res.code == 0){
					this.goodsDetail = res.data;
					let headImage = res.data.headImage;
					this.headImage = JSON.parse(headImage);
				}else{
					that.$message({
						message: res.msg,
						type: 'error'
					});
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.mall-detail{
		margin: 24px;
		.detail-content{
			height:calc(100vh - 200px);
			overflow-y: scroll;
			position: relative;
			.detail-title{
				border-bottom: 1px solid #eee;
				margin-bottom: 30px;
				display: flex;
				align-items: center;
				padding: 10px 0;
				.title-line{
					display: inline-block;
					width: 2px;
					height: 20px;
					margin-right: 10px;
					background: #409EFF
				}
				.title-text{
					display: inline-block;
					color: #333;
					font-size: 14px;
				}
			}
			.detail-main{
				padding: 0px 20px 20px;
				.item{
					display: flex;
					align-items: center;
					margin-bottom: 30px;
					.item-text{
						font-size: 15px;
						color: #333;
					}
					.item-value{
						font-size: 15px;
						color: #333;
					}
					.item-img{
						height: 100px;
						width: 100px;
						margin-right: 20px;
					}
				}
			}
		}

	}
</style>
