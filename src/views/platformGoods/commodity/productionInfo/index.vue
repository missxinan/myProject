<template>
	<div class="container" id="containerly">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基础信息</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<!-- <el-form-item label="商品分类" class="is-required" prop='classificationofgoods'>
					<div class="block">
						<el-cascader v-model="ruleForm.classificationofgoods" :options="options" @change="handleChange"></el-cascader>
					</div>
				</el-form-item> -->
				<el-form-item label="商品分类" class="is-required" prop='categoryId'>
					<div class="block">
						<el-select v-model="ruleForm.categoryId" placeholder="请选择商品分类">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
				</el-form-item>
				<el-form-item v-if="ruleForm.categoryId==17" label="选择个人馆：" prop="mallShopId">
					<el-select  v-model="ruleForm.mallShopId" placeholder="请选择个人馆">
						<el-option
							v-for="item in mallShopArry"
							:key="item.id"
							:label="item.mallName"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品名称" prop="goodsName">
					<el-input  v-model="ruleForm.goodsName" maxlength="100"></el-input>
				</el-form-item>
				<el-form-item label="商品简介" prop="description">
					<el-input type="textarea" v-model="ruleForm.description"></el-input>
				</el-form-item>

				<el-form-item label="封面图选择" prop="logo" class="is-required" v-if="this.saveType != 'see'">
					<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
					 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="ruleForm.logo" alt="">
					</el-dialog>
				</el-form-item>

				<el-form-item label="封面图展示" prop="logo" v-if="jiaohuFlag != 0">
					<div class="selectedDisplayarea">
						<img :src="ruleForm.logo" alt="图片出错">
					</div>
				</el-form-item>

				<el-form-item label="头图选择区" prop="headImage" v-if="this.saveType != 'see'">
					<moreImgUpload color="#1890ff"  @successCBK="imageSuccessCBK" />
				</el-form-item>

				<el-form-item label="头图展示区" prop="headImage">
					<div class="showimages">
						<vuedraggable class="wrapper" v-model="ruleForm.headImage">
							<transition-group style="display:flex;">
							<div :class="index === selectedIndex?'selectedDisplayarea':'Displayarea'" v-for="(item,index) in ruleForm.headImage"
								:key="index" @click="DisplayareaImage(index)">

									<img :src="item" :alt="'图片'+index">
									<div :class="index === selectedIndex?'x':''" @click="Xhao(index)"></div>
								</div>
							</transition-group>
						</vuedraggable>
					</div>
				</el-form-item>
				<el-form-item label="鉴定师鉴定情况描述：" required>
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.appraiserDescribe"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="鉴定师鉴定真品度：" required>
					<el-input
						class="item-input-number"
						placeholder="请输入0-100的数字"
						v-model="ruleForm.appraiserResult"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="鉴定师市场价格预估：" required>
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.marketPrice"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="尺寸："  >
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.size"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="规格：" >
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.spec"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="材质：" >
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.material"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="瑕疵：" >
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.flaw"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="年代：" >
					<el-input
						class="item-input-number"
						placeholder="请输入内容"
						v-model="ruleForm.age"
						type="text"
						@input="change($event)"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="是否平台自营：">
					<el-switch
					  v-model="ruleForm.isPlatform"
					  @change="change($event)"
					  active-color="#13ce66"
					  inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item label="是否可鉴定 ：">
					<el-switch
					  v-model="ruleForm.isIdentify"
					  @change="change($event)"
					  active-color="#13ce66"
					  inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item  label="是否包邮：">
					<el-switch
					  v-model="ruleForm.isSend"
					  @change="change($event)"
					  active-color="#13ce66"
					  inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item label="开启限价" class="is-required">
				  <el-radio-group v-model="ruleForm.isLimitPrice" @change="change($event)">
					<el-radio label="1" value="1">开启</el-radio>
					<el-radio label="0" value="0">关闭</el-radio>
				  </el-radio-group>
				</el-form-item>
				
				<el-form-item label="限价" v-if="this.ruleForm.isLimitPrice == 1" :prop=" this.ruleForm.isLimitPrice == 1 ? 'limitPrice' : ''">
				  <el-input
				    v-model="ruleForm.limitPrice"
				    maxlength="12"
				    oninput="value=value.replace(/[^\d.]/g,'')"
				  />
				</el-form-item>

				<el-form-item label="成本价" prop="costPrice">
					<el-input v-model="ruleForm.costPrice" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="12"></el-input>
				</el-form-item>

				<el-form-item label="估价" prop="assessPrice">
					<el-input v-model="ruleForm.assessPrice" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="12"></el-input>
				</el-form-item>
				<!-- <el-form-item label="赠送积分比" prop="isGiveIntegral">
					<el-input type="number" v-model="ruleForm.isGiveIntegral" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="4" ></el-input>
				</el-form-item> -->
			</el-form>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>详情</span>
			</div>
			<particulars v-model="ruleForm.goodsDetail"></particulars>
			<el-button class='footerBun' type="primary" v-if="this.saveType != 'edit' && this.saveType != 'see'" @click="addGoods(2)">保存并上架</el-button>
			<el-button class='footerBun' type="primary" v-if="this.saveType == 'edit' && this.saveType != 'see'" @click="editGoods(2)">保存并上架</el-button>
			<el-button class='footerBun' type="primary" v-if="this.saveType != 'see' && this.saveType != 'edit'" @click="addGoods(1)">保存</el-button>
			<el-button class='footerBun' type="primary" v-if="this.saveType != 'see' && this.saveType == 'edit'" @click="editGoods(1)">保存</el-button>
			<el-button type="primary" @click="cancel">取消</el-button>
		</el-card>


		<!-- 选择商品 -->
		<el-dialog :visible.sync="selectSellingGoods" title="选择商品">
			<exchangeGoods @callback="callbackSuc"></exchangeGoods>
		</el-dialog>
	</div>
</template>

<script>
	import moreImgUpload from "@/components/moreImgUpload"
	import {
		goodsInfoadd,
		goodsInfoaddlist,
		goodsInfoedit,
		base64picture,
	} from "@/api/addrules";
	import {
		treeApi
	} from "@/api/AuctionsRecord.js";
	import {fetchMallList} from "@/api/collect.js";
	import { goodsInfoDetail,editGoods } from "@/api/platcommoditymanagement.js"
	import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
	import particulars from '@/components/particulars';
	import vuedraggable from 'vuedraggable';
	import exchangeGoods from "@/components/exchangeGoods/index";
	export default {
		components: {
			particulars,
			moreImgUpload,
			vuedraggable,
			exchangeGoods
		},
		data() {
			return {
				JiePaiTimeTrueFalse: false,
				pickerOptions0: {
					disabledDate(time) {
						// console.log(Date.now());
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				FlagNumber: false,
				YongJin: "",
				props: {
					multiple: true
				},
				content: '<h2>I am Example</h2>',
				editorOption: {
					// some quill options
					placeholder: '',
					theme: 'snow', // or 'bubble'
				},
				imgs: '',
				//拍卖设置部分
				AuctionSet: {
					assessPrice: '',
					startPrice: '',
					protectPrice: '',
					maxProtectPrice: '',
					markupPrice: '',
					startTime: '',
					endTime: '',
					addPriceRuleId: '',
					ProtectPrice: '',
				},
				// 临时使用
				radio:'1',
				ImgFlag: false,
				//
				mallShopArry:[],
				ruleForm: {
					headImage:[],
					integralType: 1,
					source: 3,
					inventory:1,
					isLimitPrice:0 ,//限价默认关闭
					isGiveIntegral:0 //积分赠送比默认1
				},
				addrules: [],
				dialogVisibleHeader: false,
				dialogVisible: false,
				// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
				rules: {
					name: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'change'
					}, ],
					classificationofgoods: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'change'
					}, ],
					displayArea: [{
						required: true,
						message: '请选择展示区域',
						trigger: 'change'
					}],
					goodsName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'change'
					}],
					costPrice: [{
						required: true,
						message: '请输入成本价',
						trigger: 'change'
					}],
					headImage:[{
						required: true,
						message: '请输上传头图',
						trigger: 'change'
					}],
					assessPrice: [{
						required: true,
						message: '请输估价',
						trigger: 'change'
					}],
					startPrice: [{
						required: true,
						message: '请输商品起拍价',
						trigger: 'change'
					}],
					inventory: [{
						required: true,
						message: '请输商品库存',
						trigger: 'change'
					}],
					isGiveIntegral: [{
						required: true,
						message: '请输入积分赠送比例',
						trigger: 'change'
					}],
					isLimitPrice: [{
						required: true,
						message: '请选择是否限制最高价',
						trigger: 'change'
					}],
					limitPrice: [{
						required: true,
						message: '请输入最高限价',
						trigger: 'change'
					}],
				},
				test: [],
				options: [],
				jiaohuFlag: null,
				SampleData: [],
				SwitchFlag: false,
				IndexSelected: '',
				numbers: null,
				selectedIndex: 0,
				copyflag: false,
				CurrentTime: null,
				saveType:'',
				userInfo:{},
				userInfoShow:false,
				// 套餐数据
				ruleFormArray:[{integralRatio:'',worthRatio:'',row:'2',goodsList:[]}],
				selectSellingGoods:false,
				// 添加套餐商品列表
				shortTimeRow:{},
				// 编辑取消临时数据
				editBackRow:{}
			}
		},
		created() {
			//this.$route.query.userId
			// location.reload();
			this.getMallList()
			this.jiaohuFlag = Array.from(Object.keys(this.$route.query)).length;
			if (this.$route.query.hasOwnProperty('copy')) {
				this.saveType = 'copy'
				//this.copyflag = true;
				this.getGoodsDetail();
			}
			if (this.$route.query.hasOwnProperty('edit')) {
				this.saveType = 'edit'
				//this.copyflag = true;
				this.getGoodsDetail();
			}
			if (this.$route.query.hasOwnProperty('see')) {
				this.saveType = 'see'
				//this.copyflag = true;
				this.getGoodsDetail();
			}
			goodsInfoaddlist(this.$route.query).then((res) => {
				for (var oldkey in this.ruleForm) {
					for (var newkey in res.data) {
						if (oldkey === newkey) {
							if (oldkey === 'headImage') {
								this.ruleForm[oldkey] = res.data[newkey];
								this.imgs = res.data[newkey];
							} else {
								this.ruleForm[oldkey] = res.data[newkey];
							}
						}
					}
				}

				// if (res.data.displayArea === 1) {
				// 	this.ruleForm.displayArea = '默认区'
				// }
				for (var oldkey in this.AuctionSet) {
					for (var newkey in res.data) {
						if (oldkey === newkey) {

							this.AuctionSet[oldkey] = res.data[newkey];

						}
					}
				}
				// this.YongJin = res.data.brokerage;
				//字符串;
				// console.log(this.ruleForm,'66666')
				if (typeof this.ruleForm.headImage === 'string') {
					this.ruleForm.headImage = JSON.parse(this.ruleForm.headImage);
					if (this.ruleForm.headImage.length === 0) {
						this.SwitchFlag = true;
					}
				}
				})
			setTimeout(() => {
				treeApi({type:4}).then((res) => {
					this.test = [];
					for (let i = 0; i < res.data.length; i++) {
						
							this.test.push({
								value: res.data[i].categoryId,
								label: res.data[i].name,
								disabled: true,
							})
					}
					this.options = this.test;
					this.duigui(this.options);
				})
			}, 500)

		},
		methods: {
			ZuiDi(value) {
				//   console.log(value,'666');
				//   console.log(this.AuctionSet.protectPrice);
				if (this.AuctionSet.protectPrice < this.AuctionSet.maxProtectPrice && this.AuctionSet.protectPrice >= 0) {

				} else {
					this.$message('最低保护价区间要低于最高保护价！');
				}
				},
			JiePaiTime(value) {
				if (this.AuctionSet.startTime === '') {
					this.JiePaiTimeTrueFalse = true
					this.$message('请先填写开拍时间');
					this.AuctionSet.endTime = '';
				}
			},
			KaiPaiTime(value) {
				console.log(new Date(), '6666');
				this.CurrentTime = new Date();
			},
			//递归
			duigui(options) {
				for (let i = 0; i < options.length; i++) {
					if (options[i].hasOwnProperty('children') && options[i].children.length > 0) {
						for (let j = 0; j < options[i].children.length; j++) {
							if (options[i].children[j].hasOwnProperty('children')) {
								this.duigui(options[i].children[j]);
							} else {
								}
						}
					}
				}

			},
			Xhao(index) {
				this.ruleForm.headImage.splice(index, 1);
			},
			cancel() {
				this.$router.push('/platformGoods/platformGoods');
			},
			//键盘输入事件
			submitadd() {
				console.log(1);
			},
			DisplayareaImage(index) {
				this.IndexSelected = index;
				this.selectedIndex = index;
			},
			handleChange(value) {
				console.log(value);
			},
			change(e){
				this.$forceUpdate()
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
			getGoodsDetail(){
				goodsInfoDetail({goodsId:this.$route.query.goodsId,source:3}).then(res=>{
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
						this.ruleForm.isPlatform = res.data.goodsInfo.isPlatform ? true : false ;
						this.ruleForm.isSend = res.data.goodsInfo.isSend ? true : false ;
						this.ruleForm.isIdentify = res.data.goodsInfo.isIdentify ? true : false ;
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
									delete item.mallGoodsIds
									delete item.mallGoodsNames
								}
								item.goodsList = goodsList
							})
							this.ruleFormArray =JSON.parse(JSON.stringify(res.data.goodsInfo.goodsMealList))
						}
						delete this.ruleForm.goodsMealList
						console.log(this.ruleForm ,'this.ruleForm')
					}
				})
			},
			editGoods(index){
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						this.ruleForm.isGiveIntegral = this.ruleForm.isGiveIntegral.toString();
						if( this.ruleForm.isGiveIntegral > 1 ){
							this.$message('赠送积分比需在0-1之间');
							return
						}
						if(this.ruleForm.isGiveIntegral.indexOf('.') != -1){
							if( this.ruleForm.isGiveIntegral.split('.')[1].length > 2){
								this.$message('赠送积分比需在0-1之间，最多2位小数');
								return
							}
						}
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
						// if(!this.ruleForm.size){
						// 	this.$message.error('请输入尺寸！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.spec){
						// 	this.$message.error('请输入规格！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.material){
						// 	this.$message.error('请输入材质！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.flaw){
						// 	this.$message.error('请输入瑕疵！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.age){
						// 	this.$message.error('请输入年代！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						this.ruleForm.isGiveIntegral = Number(this.ruleForm.isGiveIntegral).toFixed(2)
						this.ruleForm.isPlatform = this.ruleForm.isPlatform ? 1 : 0 ;
						this.ruleForm.isIdentify = this.ruleForm.isIdentify ? 1 : 0 ; 
						this.ruleForm.isSend = this.ruleForm.isSend ? 1 : 0 ; 
						// this.ruleForm.isGiveIntegral = Number(this.ruleForm.isGiveIntegral).toFixed(3)
						let obj = JSON.parse(JSON.stringify(this.ruleForm))
						if(obj.integralType == 2){
							obj = this.submitDealWith(obj)
						}
						// obj.categoryId = obj.classificationofgoods[obj.classificationofgoods.length - 1]
						delete obj.classificationofgoods;
						this.FlagNumber = true;
						obj.headImage = JSON.stringify(obj.headImage);
						obj.status = index
						editGoods(obj).then((res) => {
								if (res.code == 0) {
									this.$router.push('/platformGoods/platformGoods')
								} else {
									this.$message(res.msg);
								}
						})
					}
				})


			},
			addGoods(index) {
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						this.ruleForm.isGiveIntegral = this.ruleForm.isGiveIntegral.toString();
						if( this.ruleForm.isGiveIntegral > 1 ){
							this.$message('赠送积分比需在0-1之间');
							return
						}
						if(this.ruleForm.isGiveIntegral.indexOf('.') != -1){
							if( this.ruleForm.isGiveIntegral.split('.')[1].length > 2){
								this.$message('赠送积分比需在0-1之间，最多2位小数');
								return
							}
						}
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
						// if(!this.ruleForm.size){
						// 	this.$message.error('请输入尺寸！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.spec){
						// 	this.$message.error('请输入规格！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.material){
						// 	this.$message.error('请输入材质！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.flaw){
						// 	this.$message.error('请输入瑕疵！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						// if(!this.ruleForm.age){
						// 	this.$message.error('请输入年代！');
						// 	this.loadingBtn = false;
						// 	return;
						// }
						this.ruleForm.isGiveIntegral = Number(this.ruleForm.isGiveIntegral).toFixed(2)
						this.ruleForm.isPlatform = this.ruleForm.isPlatform ? 1 : 0 ; 
						this.ruleForm.isIdentify = this.ruleForm.isIdentify ? 1 : 0 ; 
						this.ruleForm.isSend = this.ruleForm.isSend ? 1 : 0 ; 
						
						let obj = JSON.parse(JSON.stringify(this.ruleForm))
						// 处理数据
						if(obj.integralType == 2){
							obj = this.submitDealWith(obj)
							if(obj == false){
								return
							}
						}
						console.log(obj,'objobjobjobj')
						// return
						// obj.categoryId = obj.classificationofgoods[obj.classificationofgoods.length - 1]
						delete obj.classificationofgoods;
						this.FlagNumber = true;
						console.log(obj,'Obj')
						obj.headImage = JSON.stringify(obj.headImage);
						obj.status = index
						goodsInfoadd(obj).then((res) => {
								if (res.code == 0) {
									this.$router.push({path:'/platformGoods/platformGoods',query:{	upload: 'upload'}})
								} else {
									this.$message.error(res.msg);
								}
						})
					}
				})
			},
			submitDealWith(data){
				console.log(data,'data')
				if( data.integralType == 2 && this.ruleFormArray.length <= 0 ){
					this.$message.error('请添加套餐');
					return false
				}
				let ruleFormEdit = false
				this.ruleFormArray.map((item,index)=>{
					if(item.integralRatio == '' && item.worthRatio == '' && item.goodsList.length <= 0 ){
						this.ruleFormArray.splice(index,1);
					}
					if(item.goodsList && item.goodsList.length > 0){
						let mallGoodsIds = []
						let mallGoodsNames = []
						item.goodsList.map((ite,index)=>{
							mallGoodsIds.push(ite.goodsId)
							mallGoodsNames.push(ite.goodsName)
						})
						item.mallGoodsIds = mallGoodsIds.join(';')
						item.mallGoodsNames = mallGoodsNames.join(';')
					}
					item.sort = index
					if( item.row == 1 ){
						ruleFormEdit = true
					}
				})
				if(this.ruleFormArray.length <= 0){
					this.$message.error('存在未编辑完成的套餐');
					return false
				}
				if(ruleFormEdit == true){
					this.$message.error('存在未编辑完成的套餐');
					return false
				}
				data.goodsMeals = JSON.stringify(this.ruleFormArray)
				return data
			},
			//去空逻辑
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
			ChangeTime(data) {
				var d = new Date(data);
				var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
					':' + d.getSeconds();
				return datetime
			},
			//富文本编辑器方法



			onEditorBlur(quill) {
				console.log(444)
				console.log('editor blur!', quill)
			},
			onEditorFocus(quill) {
				console.log(333)
				console.log('editor focus!', quill)
			},
			onEditorReady(quill) {
				console.log(222)
				console.log('editor ready!', quill)
			},
			onEditorChange({
				quill,
				html,
				text
			}) {
				console.log(111)
				console.log('editor change!', quill, html, text)
				this.content = html
			},
			//
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			//上传图片接口
			//富文本内容
			richEditor(value) {
				console.log(value);
				let Data = value.goodsDetail.slice(value.goodsDetail.indexOf('d'), value.goodsDetail.lastIndexOf('>') - 4);
				console.log(Data);
				base64picture({
					base64Pic: Data
				}).then((res) => {
					console.log(res, '666');
					// if(res.msg === 'success'){
					//     this.ruleForm.goodsDetail = res.data;
					// }
				})
			},
			getFile(file, fileList) {
				let that = this
				// console.log(file.raw)
				let formDate = new FormData()
				formDate.append('multipartFileList', file.raw);
				// console.log(formDate,'55555')
				uploadFileList(formDate).then(resp => {
					// console.log(resp);
					if (resp.code == 0) {
						let img_url = resp.data[0];//图片URL地址
						let imgObj = new Image();//创建对象
						imgObj.src = img_url;//改变图片地址
						imgObj.onload = function(){
							that.ruleForm.logo = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]
						}
					} else {
						this.$message({
							message: resp.msg,
							type: 'warning'
						});
					}

				})
			},
			handlePictureCardPreview(file) {

				this.dialogVisibleHeader = true;

			},
			handleRemoveHeader1(file, fileList) {
				if (this.jiaohuFlag != 0) {
					if (this.SwitchFlag) {
						this.SampleData.some((item, index) => {
							if (item.uid === file.uid) {
								this.ruleForm.headImage.splice(index, 1);
								this.SampleData.splice(index, 1);
								this.SampleData.forEach((item, key) => {
									item.index = key
								})
								return true
							}
						})
					} else {
					}
				} else {
					this.SampleData.some((item, index) => {
						if (item.uid === file.uid) {
							this.ruleForm.headImage.splice(index, 1);
							this.SampleData.splice(index, 1);
							this.SampleData.forEach((item, key) => {
								item.index = key
							})
							return true
						}
					})
				}
			},
			handleRemoveHeader(file, fileList) {

			},
			handlePictureCardPreviewHeader(file) {
				this.dialogVisible = true;
			},
			imageSuccessCBK(arr) {
				console.log(arr,'arr')
				const _this = this
				arr.forEach(v => {
					// window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
					if(this.ruleForm.headImage.length < 9){
						this.ruleForm.headImage.push(v.url)
					}
				})
			},
			// 商品赠送礼包
			ruleFormArrayEdit(row,index){
				if( row.row == 1 ){
					row.integralRatio = row.integralRatio.toString();
					if( row.integralRatio > 100 ){
						this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
						return
					}
					if(row.integralRatio.indexOf('.') != -1){
						if( row.integralRatio.split('.')[1].length > 3){
							this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
							return
						}
					}
					row.worthRatio = row.worthRatio.toString();
					if( row.worthRatio > 100 ){
						this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
						return
					}
					if(row.worthRatio.indexOf('.') != -1){
						if( row.worthRatio.split('.')[1].length > 3){
							this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
							return
						}
					}
					if( row.integralRatio == '' && row.worthRatio == '' && row.goodsList.length <= 0 ){
						this.$message('请输入套餐内容');
						return
					}
					if( row.integralRatio == 0 && row.worthRatio == 0 && row.goodsList.length <= 0 ){
						this.$message('套餐输入错误');
						return
					}
					console.log(row,'row')
					this.ruleFormArray[index] = row
					console.log(this.ruleFormArray,'row111')
				}else{
					let edit = false
					this.ruleFormArray.map(item=>{
						if(item.row == 1){
							edit = true
							return
						}
					})
					if(edit == true){
						this.$message('请先保存正在编辑的套餐');
						return
					}
				}
				this.editBackRow =JSON.parse(JSON.stringify(row))
				row.row = row.row == 1 ? '2' : '1'
			},
			ruleFormArrayBack(row,index){
				row.row = row.row == 1 ? '2' : '1'
				row.integralRatio = this.editBackRow.integralRatio
				row.worthRatio = this.editBackRow.worthRatio
				row.goodsList = this.editBackRow.goodsList
				// console.log(this.editBackRow,'this.editBackRow')
				// this.editBackRow.row  = 1
				// this.ruleFormArray[index] = this.editBackRow

				// row = this.editBackRow
			},
			ruleFormArrayDel(row,index){
				this.$confirm('此操作将删除该套餐, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				   this.ruleFormArray.splice(index,1)
				})
			},
			ruleFormArrayTofirst(row,index){
				this.$confirm('此操作将置顶该套餐, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				   this.ruleFormArray.splice(index,1)
				   this.ruleFormArray.unshift(row)
				})
			},
			addSetmeal(){
				if( this.ruleFormArray.length > 9 ){
					this.$message.error('最多添加10个套餐')
					return
				}
				this.ruleFormArray.push({integralRatio:'',worthRatio:'',row:'2',goodsList:[]})
			},
			inputExchangeGoods(row){
				if(row.goodsList.length > 4 ){
					this.$message.error('每种套餐最多添加5个商品')
					return
				}
				this.shortTimeRow = row
				this.selectSellingGoods = true
			},
			callbackSuc(value) {
				console.log(value, "value");
				this.shortTimeRow.goodsList.push(value)
				// this.sellingRecordDate.goodsId = value.goodsId;
				// this.sellingRecordDate.goodsName = value.goodsName;
				// this.sellingRecordDate.assessPrice = value.assessPrice;
				this.selectSellingGoods = false;
			},
			delListGoods(index,proIndex){
				console.log(this.ruleFormArray,index,proIndex)
				this.ruleFormArray[proIndex].goodsList.splice(index,1)
			},
			mathFixdDeal(data){
				data = data.toString();
				if( data > 100 ){
					this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
					return
				}
				if(data.indexOf('.') != -1){
					if( data.split('.')[1].length > 3){
						this.$message('赠送积分(超值积分)比需小于100，最多3位小数');
						return
					}
				}
			}
		}
	}
</script>

<style>
	.giveGoodsDiv{
		position: relative;
	}
	.giveGoodsIcon{
		position: absolute;
		right: 10px;
		top: 10px;
		margin: auto;
		width: 30px;
		height: 30px;
		cursor: pointer;
	}
	.upload-demo ul {
		display: none !important;
	}

	.el-upload-list .el-upload-list--picture /deep/ {
		display: none !important;
	}

	.showimages {
		display: flex;
		flex-wrap: wrap;
	}

	.selectedDisplayarea span {
		display: block;
		text-align: center;
	}

	.selectedDisplayarea img {
		width: 100px;
		height: 100px;
		background: #000;
		border: 1px solid #fff;
		border-width: 5px 5px 5px 5px;
		box-shadow: 1px 1px 5px #333;
		-webkit-box-shadow: 1px 1px 5px #333;
		-moz-box-shadow: 1px 1px 5px #333;
		cursor: pointer;
		opacity: 0.5;
		-webkit-transition: all .5s ease-in .1s;
		transition: all .5s ease-in .1s;
	}

	.selectedDisplayarea img:hover {
		width: 100px;
		height: 100px;
		background: #000;
		border: 1px solid #fff;
		border-width: 5px 5px 5px 5px;
		box-shadow: 1px 1px 5px #333;
		-webkit-box-shadow: 1px 1px 5px #333;
		-moz-box-shadow: 1px 1px 5px #333;
		cursor: pointer;
		opacity: 1;
		-webkit-transition: all .5s ease-in .1s;
		transition: all .5s ease-in .1s;
	}

	.selectedDisplayarea {
		position: relative;
		float: left;
		margin-left: 20px;
		width: 100px;
		height: 100px;
		cursor: pointer;
		opacity: 0.5;
		-webkit-transition: all .5s ease-in .1s;
		transition: all .5s ease-in .1s;
	}

	.selectedDisplayarea:hover {
		position: relative;
		float: left;
		margin-left: 20px;
		width: 100px;
		height: 100px;
		cursor: pointer;
		opacity: 1;
		-webkit-transition: all .5s ease-in .1s;
		transition: all .5s ease-in .1s;
	}

	.x {
		left: 87px;
		top: 5px;
		position: absolute;
		width: 10px;
		height: 10px;
		display: inline-block;
		cursor: pointer;
		opacity: 0.5;
		-webkit-transition: all .5s ease-in .1s;
		transition: all .5s ease-in .1s;
	}

	.x:hover {
		left: 77px;
		top: 0;
		position: absolute;
		width: 20px;
		height: 20px;
		display: inline-block;
		cursor: pointer;
		opacity: 1;
		transition: all .5s ease-in .1s;
	}

	.x::before {
		content: '';
		width: inherit;
		border-top: 1px solid #000;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.x::after {
		content: '';
		width: inherit;
		border-top: 1px solid #000;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	/* .app-container{
        height: 500px;
        overflow-y: scroll;
    } */
	.container {
		padding: 20px;
		/* height: 500px;
    overflow-y: scroll; */
	}

	.Displayarea span {
		display: block;
		text-align: center;
	}

	.Displayarea {
		position: relative;
		float: left;
		margin-left: 20px;
	}

	.Displayarea img {
		width: 100px;
		height: 100px;
	}

	.container {
		padding: 20px;
		/* height: 500px;
    overflow-y: scroll; */
	}

	.Images {
		width: 50px;
		height: 50px;
	}

	.productDetails {
		width: 100%;
		height: 632px;
		border: 1px solid #ccc;
		margin-left: 20px;
		margin-top: 20px;
		overflow-y: scroll;
	}

	.footerBun {
		margin: 20px 30px 40px;
	}
</style>
