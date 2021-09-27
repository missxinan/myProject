<template>
  	<div class="mall-add">
		<div class="mall-content">
			<div class="mall-basicInformation">
				<div class="basicInformation-title">
					<span class="title-line"></span>
					<span class="title-text">基础信息</span>
				</div>
				<div class="basicInformation-content">
					<el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="ruleForm">
						<el-form-item label="商品类型：" required>
							<el-select v-model="ruleForm.goodsType" @change="selectGoodsType" placeholder="请选择商品类型">
								<el-option
									v-for="item in goodsTypeArry"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商品分类：" prop="categoryId" required>
							<el-cascader
							v-if="types!=4"
							placeholder="请选择商品分类"
							:props="Props"
							:options="categoryArry"
							v-model="ruleForm.categoryId"
							></el-cascader>
							<el-select v-if="types==4" v-model="ruleForm.categoryId" placeholder="请选择商品分类">
								<el-option
									v-for="item in categoryArry"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商品名称：" required>
							<el-input
								class="item-input-text"
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="ruleForm.goodsName"
								maxlength="100"
								show-word-limit
							>
							</el-input>
						</el-form-item>
						<el-form-item label="商品简介：">
							<el-input
								class="item-input-text"
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="ruleForm.description"
								maxlength="200"
								show-word-limit
							>
							</el-input>
						</el-form-item>
						<el-form-item label="封面图：" required>
							<el-upload
								class="avatar-uploader"
								:action=actionUrl
								name="multipartFileList"
								accept="image/*"
								:headers="headers"
								:on-success="handleAvatarSuccess"
								:show-file-list="false">
								<img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								<span v-if="!ruleForm.logo" class="uploader-text">上传封面图</span>
							</el-upload>
							<div>建议尺寸：800*800像素</div>
						</el-form-item>
						<el-form-item label="头图：" required>
							<draggable v-model="headerImgArry" >
								<div class="pic-preview" v-for="(item,index) in headerImgArry" :key="index">
									<div class="hidden-block"><i class="el-icon-delete" @click="removeImg(index)"></i></div>
									<img :src="item" />
								</div>
							</draggable>
							<moreImgUpload color="#1890ff"  @successCBK="imageSuccessCBK" />
							<div>建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传9张</div>
						</el-form-item>
						<el-form-item v-if="types==4" label="鉴定师鉴定情况描述：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.appraiserDescribe"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="鉴定师鉴定真品度：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入0-100的数字"
								v-model="ruleForm.appraiserResult"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="鉴定师市场价格预估：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.marketPrice"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="尺寸："  >
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.size"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="规格：" >
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.spec"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="材质：" >
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.material"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="瑕疵：" >
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.flaw"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="年代：" >
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.age"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="库存：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.goodsNumber"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="types==4" label="是否平台自营：">
							<el-switch
							  v-model="ruleForm.isPlatform"
							  @change="change($event)"
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
						</el-form-item>
						<el-form-item v-if="types==4" label="是否可鉴定 ：">
							<el-switch
							  v-model="ruleForm.isIdentify"
							  @change="change($event)"
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
						</el-form-item>
						<el-form-item v-if="types==4" label="是否包邮：">
							<el-switch
							  v-model="ruleForm.isSend"
							  @change="change($event)"
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
						</el-form-item>
						<el-form-item v-if="types==4&&ruleForm.categoryId==17" label="是否仅展示：">
							<el-switch
							  v-model="ruleForm.buyType"
							  @change="change($event)"
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
						</el-form-item>
						<el-form-item v-if="types==4&&ruleForm.categoryId==17" label="选择个人馆：" prop="mallShopId">
							<el-select  v-model="ruleForm.mallShopId" placeholder="请选择个人馆">
								<el-option
									v-for="item in mallShopArry"
									:key="item.id"
									:label="item.mallName"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="个人馆商品图：" v-if="types==4&&ruleForm.categoryId==17">
							<el-upload
								class="avatar-uploader"
								:action=actionUrl
								name="multipartFileList"
								accept="image/*"
								:headers="headers"
								:on-success="handleLongImageSuccess"
								:show-file-list="false">
								<img v-if="longImage" :src="longImage" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								<span v-if="!longImage" class="uploader-text">上传个人馆图</span>
							</el-upload>
						</el-form-item>
						<el-form-item label="个人馆商品明细：" v-if="types==4&&ruleForm.categoryId==17">
							<draggable v-model="detailImage" >
								<div class="pic-preview" v-for="(item,index) in detailImage" :key="index">
									<div class="hidden-block"><i class="el-icon-delete" @click="removeDetailImage(index)"></i></div>
									<img :src="item" />
								</div>
							</draggable>
							<moreImgUpload color="#1890ff"  @successCBK="detailImageSuccessCBK" />
						</el-form-item>
						<el-form-item label="成本价：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.costPrice"
								type="text"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item label="价格类型：" required>
							<el-select v-model="ruleForm.priceType" @change="changePrice" placeholder="请选择">
								<el-option
									v-for="item in priceTypeArry"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="ruleForm.priceType==2 || ruleForm.priceType==3" label="价格：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.price"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item v-if="ruleForm.priceType==1 || ruleForm.priceType==2" label="积分：" required>
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.integral"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
					<!-- 	<el-form-item label="库存：" required style="visibility: hidden;">
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.inventory = 1"
							>
							</el-input>
						</el-form-item> -->
						<el-form-item label="估值：">
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.assessPrice"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
						<el-form-item label="权重：">
							<el-input
								class="item-input-number"
								placeholder="请输入内容"
								v-model="ruleForm.sort"
								@input="change($event)"
							>
							</el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="mall-detail">
				<div class="detail-title">
					<span class="title-line"></span>
					<span class="title-text">详情</span>
				</div>
				<div class="detail-content">
					<particulars v-model="ruleForm.goodsDetail"></particulars>
				</div>
			</div>
		</div>

		<div class="mall-btn">
			<el-button type="primary" :loading="loadingBtn" @click="publishProducts">发布产品</el-button>
			<el-button type="primary" :loading="loadingBtn" @click="submitWarehouse">保存到仓库中</el-button>
			<el-button type="primary" @click="cancel">取消</el-button>
		</div>
	</div>
</template>
<script>
import { treeApi } from "@/api/AuctionsRecord.js";
import {fetchMallList} from "@/api/collect.js";
import { addGoodsMall,editGoodsMall,goodsDetailMall,supplierList } from "@/api/mallManagement.js";
import particulars from '@/components/particulars';
import { getToken } from '@/utils/auth';
import draggable from 'vuedraggable';
import moreImgUpload from "@/components/moreImgUpload";
import URL  from "@/utils/url"
export default {
	name:'mallAdd',
	components: {
		particulars,
		draggable,
		moreImgUpload
	},
  	data() {
		return {
      actionUrl:URL + "/oss/uploadFileList",
			types: '',
			goodsId:'',
			loadingBtn:false,
			showPicList:[],
			headers:{
				'Authorization':getToken()
			},
			goodsTypeArry:[{
				label:'寄拍',
				value:1,
			},{
				label:'换购',
				value:2,
			},{
				label:'直营',
				value:4,
			}],
			priceTypeArry:[{
				label:'积分',
				value:1,
			},{
				label:'积分+金额',
				value:2,
			},{
				label:'金额',
				value:3,
			}],
			dialogVisible: false,
			classify:[],
			longImage:'',
			categoryArry:[],
			mallShopArry:[],
			headerImgArry:[],
			detailImage:[],
			ruleForm: {
				goodsType: '',
				goodsName: '',
				description: '',
				costPrice: '',
				size:'',
				spec:'',
				assessPrice: '',
				sort: '',
				logo: '',
				headImage: [],
				supplierId: '',
				priceType: '',
				price: '',
				integral: '',
				inventory: '1',
				status: 1,
				categoryId: '',
				goodsDetail: ''
			},
			Props:{
				value:'value',
				label:'label',
				children:'children'
			}
		}
	},
	mounted(){

	},
	created() {
		let goodsId = this.$route.query.goodsId;
		if(goodsId){
			this.goodsId = goodsId;
			this.getGoodsDetail();
		}
		this.getMallList()
	},
	methods: {
		//选择商品分类
		selectGoodsType(value){
			const val = value;
			if(val === 1){
				this.types = 2
			}else if(val === 2){
				this.types = 3
			}else if(val === 4){
				this.types = 4
			}else if(val === 4){
				this.types = 1
			}
			this.ruleForm.categoryId = ''
			this.getAllGoodsCategory();
		},
		//选择
		changePrice(){
			let that = this;
			that.ruleForm.price = '';
			that.ruleForm.integral = '';
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
		//获取商品分类
		getAllGoodsCategory(){
			let data = {
				type: this.types
			}
			treeApi(data).then((res) => {
				console.log(res,'res')
				if(res.code == 0){
					let datas = res.data;
					// this.delEmptySub(datas)
					this.categoryArry =  res.data;
					let categoryArry = [];
					if(datas.length>0){
						datas.forEach((ele,index) => {
							if(ele.subCategorys&&ele.subCategorys.length>0){
								let subCategorys = ele.subCategorys;
								let children = [];
								categoryArry.push({
									value: ele.categoryId,
									label: ele.name,
									children: children
								})
								subCategorys.forEach(item => {
									if(item.subCategorys.length>0){
										let childrens = []
										let childrenArry = item.subCategorys;
										children.push({
											value: item.categoryId,
											label: item.name,
											children: childrens
										})
										childrenArry.forEach(e => {
											childrens.push({
												value: e.categoryId,
												label: e.name,
											})
										})
									}else{
										if(this.types === 3){
											children.push({
												value: item.categoryId,
												label: item.name,
												disabled: true
											})
										}else{
											children.push({
												value: item.categoryId,
												label: item.name,
											})
										}
									}
								});
							}else{
								categoryArry.push({
									value: ele.categoryId,
									label: ele.name,
									disabled: true,
								})
							}
						});
						this.categoryArry = categoryArry;
						console.log(this.categoryArry);
					}
				}else{
					that.$message({
						message: res.msg,
						type: 'error'
					});
				}
			})
		},
		change(e){
			this.$forceUpdate()
		},
		// 处理空子集
		// delEmptySub(datas){
		// 	for( let i of datas ){
		// 		if( i.subCategorys &&  i.subCategorys.length > 0){
		// 			this.delEmptySub(i.subCategorys)
		// 		}else{
		// 			delete i.subCategorys
		// 		}
		// 	}
		// 	this.categoryArry =  datas;
		// },
		//获取商品详情
		getGoodsDetail(){
			let that = this;
			let data = {
				goodsId: that.goodsId
			}
			goodsDetailMall(data).then((res) =>{
				if(res.code == 0){
					that.ruleForm.goodsName = res.data.goodsName;
					that.ruleForm.goodsType = res.data.goodsType;
					that.ruleForm.description = res.data.description;
					that.ruleForm.costPrice = res.data.costPrice;
					that.ruleForm.assessPrice = res.data.assessPrice;
					that.ruleForm.sort = res.data.sort;
					that.ruleForm.logo = res.data.logo;
					that.longImage = res.data.longImage;
					that.headerImgArry = JSON.parse(res.data.headImage);
					that.detailImage = JSON.parse(res.data.detailImage);
					that.ruleForm.supplierId = res.data.supplierId;
					that.ruleForm.priceType = res.data.priceType;
					that.ruleForm.price = res.data.price;
					that.ruleForm.integral = res.data.integral;
					that.ruleForm.inventory = res.data.inventory;
					that.ruleForm.status = res.data.status;
					that.ruleForm.categoryId = res.data.categoryIdList.length>0?res.data.categoryIdList:res.data.categoryId;
					that.ruleForm.goodsDetail = res.data.goodsDetail;
					that.ruleForm.size = res.data.size;
					that.ruleForm.spec = res.data.spec;
					that.ruleForm.material = res.data.material;
					that.ruleForm.flaw = res.data.flaw;
					that.ruleForm.age = res.data.age;
					that.ruleForm.goodsNumber = res.data.goodsNumber;
					that.ruleForm.appraiserDescribe = res.data.appraiserDescribe;
					that.ruleForm.appraiserResult = res.data.appraiserResult;
					that.ruleForm.marketPrice = res.data.marketPrice;
					that.ruleForm.isPlatform = res.data.isPlatform ? true : false ;
					that.ruleForm.isSend = res.data.isSend ? true : false ;
					that.ruleForm.isIdentify = res.data.isIdentify ? true : false ;
					that.ruleForm.buyType = res.data.buyType ? true : false ;
					
					if(res.data.goodsType === 1){
						this.types = 2
					}else if(res.data.goodsType === 4){
						this.types = 4
					}else{
						this.types = 3
					}
					this.getAllGoodsCategory();
				}else{
					that.$message({
						message: res.msg,
						type: 'error'
					});
				}
			})
		},
		handleLongImageSuccess(res){
			if(res.code == 0){
				let that = this;
				let imgUrl = res.data[0]
				let imgObj = new Image();//创建对象
				imgObj.src = imgUrl;//改变图片地址
				imgObj.onload = function(){
					that.longImage = imgUrl.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + imgUrl.split('?')[1]
				}
				that.$message({message: '添加个人馆的长图成功', type: 'success'});
			}
			
		},
		//商品封面图上传成功
		handleAvatarSuccess(res){
			if(res.code == 0){
				let that = this;
				let imgUrl = res.data[0]
				let imgObj = new Image();//创建对象
				imgObj.src = imgUrl;//改变图片地址
				imgObj.onload = function(){
					that.ruleForm.logo = imgUrl.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + imgUrl.split('?')[1]
				}
				that.$message({message: '添加商品封面图成功', type: 'success'});
			}
		},
		// handlePictureUpload(response,file, fileList){
		// 	if(response.code == '0'){
		// 		this.headerImgArry.push(response.data[0]);
		// 		this.$message({message: '添加商品图片成功', type: 'success'});
		// 	}else{
		// 		this.$message({message: response.msg, type: 'error'});
		// 	}
		// },
		detailImageSuccessCBK(arr) {
			const _this = this
			arr.forEach(v => {
				if(this.detailImage.length < 9){
					this.detailImage.push(v.url)
				}
			})
		},
		removeDetailImage(index){
			this.detailImage.splice(index,1);
		},
		imageSuccessCBK(arr) {
			const _this = this
			arr.forEach(v => {
				if(this.headerImgArry.length < 9){
					this.headerImgArry.push(v.url)
				}
			})
		},
		removeImg(index){
			this.headerImgArry.splice(index,1);
		},
		// beforeUploadingImg(){
		// 	let headImage = this.headerImgArry;
		// 	if(headImage.length == 9){
        //       this.$message({message: '图片数量已达上限无法继续添加', type: 'error'});
        //       return false;
        //     }
		// },
		//发布产品
		publishProducts(){
			this.ruleForm.status = 2;
			this.submitGoods();
		},
		//保存到仓库
		submitWarehouse(){
			this.submitGoods();
		},
		//取消
		cancel(){
			this.$router.push({
				path: '/mallManagement/mall/mallList'
			})
		},
		//保存商品
		submitGoods(){
			let that = this;
			this.loadingBtn = true;
			if(this.ruleForm.categoryId === ''){
				this.$message.error('请选择商品分类！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.goodsType == ''){
				this.$message.error('请选择商品类型！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.goodsName == ''){
				this.$message.error('请输入商品名称！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.logo == ''){
				this.$message.error('请上传商品封面图！');
				this.loadingBtn = false;
				return;
			}
			if(this.headerImgArry == ''){
				this.$message.error('请上传商品头图！');
				this.loadingBtn = false;
				return;
			}
			if(this.types==4){
				this.ruleForm.isPlatform = this.ruleForm.isPlatform ? 1 : 0 ; 
				this.ruleForm.isIdentify = this.ruleForm.isIdentify ? 1 : 0 ; 
				this.ruleForm.isSend = this.ruleForm.isSend ? 1 : 0 ; 
				this.ruleForm.buyType = this.ruleForm.buyType ? 2 : 0 ; 
				if(!this.ruleForm.appraiserDescribe){
					this.$message.error('请输入鉴定师鉴定情况描述！');
					this.loadingBtn = false;
					return;
				}
				if(!this.ruleForm.appraiserResult){
					this.$message.error('请输入鉴定师鉴定真品度！');
					this.loadingBtn = false;
					return;
				}
				if(!this.ruleForm.marketPrice){
					this.$message.error('请输入鉴定师市场价格预估！');
					this.loadingBtn = false;
					return;
				}
				if(!this.ruleForm.goodsNumber){
					this.$message.error('请输入库存！');
					this.loadingBtn = false;
					return;
				}
			}
			if(this.ruleForm.costPrice == '' || Number(this.ruleForm.costPrice) === 0){
				this.$message.error('请输入成本价！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.priceType == ''){
				this.$message.error('请选择价格类型！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.priceType == 1){
				if(this.ruleForm.integral == ''){
					this.$message.error('请输入积分！');
					this.loadingBtn = false;
					return;
				}
			}
			if(this.ruleForm.priceType == 2){
				if(this.ruleForm.price === '' || Number(this.ruleForm.price) === 0){
					this.$message.error('请输入价格！');
					this.loadingBtn = false;
					return;
				}
				if(this.ruleForm.integral === '' || Number(this.ruleForm.integral) === 0){
					this.$message.error('请输入积分！');
					this.loadingBtn = false;
					return;
				}
			}
			if(this.ruleForm.priceType == 3){
				if(this.ruleForm.price === '' || Number(this.ruleForm.price) === 0){
					this.$message.error('请输入价格！');
					this.loadingBtn = false;
					return;
				}
			}
			if(this.ruleForm.inventory === '' || Number(this.ruleForm.inventory) === 0){
				this.$message.error('请输入库存！');
				this.loadingBtn = false;
				return;
			}
			if(this.ruleForm.goodsDetail == ''){
				this.$message.error('请输入商品详情！');
				this.loadingBtn = false;
				return;
			}
			if(this.types!=4){
				this.ruleForm.categoryId = this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1];
			}
			this.ruleForm.headImage = JSON.stringify(this.headerImgArry);
			this.ruleForm.detailImage = JSON.stringify(this.detailImage);
			this.ruleForm.longImage = this.longImage;
			let data = this.ruleForm;
			if(that.goodsId == ''){
				addGoodsMall(data).then((res) =>{
					if(res.code == 0){
						that.$message({
							message: '新增商品成功！',
							type: 'success'
						});
						this.loadingBtn = false;
						this.$router.push('/mallManagement/mall/mallList');
					}else{
						that.$message({
							message: res.msg,
							type: 'error'
						});
						this.loadingBtn = false;
					}
				})
			}else{
				data.goodsId = that.goodsId;
				editGoodsMall(data).then((res) =>{
					if(res.code == 0){
						that.$message({
							message: '编辑商品成功！',
							type: 'success'
						});
						this.$router.push('/mallManagement/mall/mallList');
						this.loadingBtn = false;
					}else{
						that.$message({
							message: res.msg,
							type: 'error'
						});
						this.loadingBtn = false;
					}
				})
			}
		}
	},
}
</script>
<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 110px;
		height: 110px;
		line-height: 110px;
		text-align: center;
	}
	.upload-picture-content .el-upload--picture-card{
		width: 110px;
		height: 110px;
		line-height: 110px;
	}
	.avatar {
		width: 110px;
		height: 110px;
		display: block;
	}
	.middle-icon-view{
		position: relative;
		width: 110px;
		text-align: center;
		height: 110px;
	}
	.middle-icon-view p{
		position: absolute;
		top: 0;
		width: 110px;
		text-align: center;
		height: 110px;
		padding: 0;
		margin: 0;
		line-height: 150px;
	}
	.uploader-text{
		width: 110px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		color: #666;
		font-size: 14px;
		position: absolute;
		top: 70px;
		left: 0;
	}
</style>
<style lang="scss" scoped>
	.mall-add{
		margin: 24px;
		.mall-content{
			height:calc(100vh - 300px);
			overflow-y: scroll;
			position: relative;
			.mall-basicInformation{
				.basicInformation-title{
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
				.basicInformation-content{
					.ruleForm{
						margin-left: 100px;
						.item-input-text{
							width: 500px;
						}
						.item-input-number{
							width: 300px;
						}
						.pic-preview{
							width: 110px;
							height: 110px;
							display: inline-block;
							border: 1px solid #c0ccda;
							border-radius: 4px;
							overflow: hidden;
							margin: 8px 8px 0px 0px;
							position: relative;
							vertical-align: top;
							img{
							width: 100%;
							height: 100%;
							}
							.hidden-block{
							width: 100%;
							height: 100%;
							display: none;
							position: absolute;
							top: 0px;
							left: 0px;
							background-color: rgba(0,0,0,0.7);
							i{
								color: #fff;
								font-size: 18px;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%,-50%);
								cursor: pointer;
							}
							}
						}
						.pic-preview:hover{
							.hidden-block{
							display: block;
							}
						}
					}
				}
			}
			.mall-detail{
				.detail-title{
					padding: 10px 0;
					border-bottom: 1px solid #eee;
					margin-bottom: 30px;
					display: flex;
					align-items: center;
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
				.detail-content{
					padding: 15px 50px;
				}
			}
		}
		.mall-btn{
			width: 100%;
			padding: 15px 0;
			background: #ffff;
			text-align: center;
		}
	}
</style>
