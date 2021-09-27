<template>
	<div class="container" id="containerly">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基础信息</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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


				<el-form-item label="成本价" prop="goodsPrice">
					<el-input v-model="ruleForm.goodsPrice" oninput="value=value.replace(/[^\d.]/g,'')" maxlength="12"></el-input>
				</el-form-item>

			</el-form>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>详情</span>
			</div>
			<particulars v-model="ruleForm.goodsDetail"></particulars>
			<el-button class='footerBun' type="primary" v-if="this.saveType != 'edit' && this.saveType != 'see'" @click="addGoods(2)">添加</el-button>
			<el-button class='footerBun' type="primary" v-if="this.saveType != 'see' && this.saveType == 'edit'" @click="editGoods(1)">修改</el-button>
			<el-button type="primary" @click="cancel">取消</el-button>
		</el-card>


	</div>
</template>

<script>
	import moreImgUpload from "@/components/moreImgUpload"
	import {
		activityGoodsAdd,
    goodsInfoDetail,
    editGoods
	} from "@/api/activity.js";
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
				content: '<h2>I am Example</h2>',
				ruleForm: {
					headImage:[],
				},
				dialogVisible: false,
				rules: {
					goodsName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'change'
					}],
					goodsPrice: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'change'
					}],
					headImage:[{
						required: true,
						message: '请输上传头图',
						trigger: 'change'
					}],
				},
				jiaohuFlag: null,
				SampleData: [],
				SwitchFlag: false,
				IndexSelected: '',
				selectedIndex: 0,
				copyflag: false,
				saveType:'',
				userInfo:{}
			}
		},
		created() {
			//this.$route.query.userId
			// location.reload();
			if (this.$route.query.hasOwnProperty('edit')) {
				this.saveType = 'edit'
				//this.copyflag = true;
				this.getGoodsDetail();
			}
			// goodsInfoaddlist(this.$route.query).then((res) => {
			// 	for (var oldkey in this.ruleForm) {
			// 		for (var newkey in res.data) {
			// 			if (oldkey === newkey) {
			// 				if (oldkey === 'headImage') {
			// 					this.ruleForm[oldkey] = res.data[newkey];
			// 					this.imgs = res.data[newkey];
			// 				} else {
			// 					this.ruleForm[oldkey] = res.data[newkey];
			// 				}
			// 			}
			// 		}
			// 	}

			// 	for (var oldkey in this.AuctionSet) {
			// 		for (var newkey in res.data) {
			// 			if (oldkey === newkey) {
			// 				this.AuctionSet[oldkey] = res.data[newkey];

			// 			}
			// 		}
			// 	}
			// 	if (typeof this.ruleForm.headImage === 'string') {
			// 		this.ruleForm.headImage = JSON.parse(this.ruleForm.headImage);
			// 		if (this.ruleForm.headImage.length === 0) {
			// 			this.SwitchFlag = true;
			// 		}
			// 	}
			// })
     },
		methods: {
			Xhao(index) {
				this.ruleForm.headImage.splice(index, 1);
			},
			cancel() {
				window.history.back();
			},
			DisplayareaImage(index) {
				this.IndexSelected = index;
				this.selectedIndex = index;
			},
			getGoodsDetail(){
				goodsInfoDetail({goodsId:this.$route.query.goodsId}).then(res=>{
					if(res.code == 0){
						res.data.headImage = JSON.parse(res.data.headImage)
						this.ruleForm = res.data
						console.log(this.ruleForm ,'this.ruleForm')
					}
				})
			},
			editGoods(index){
        this.$refs["ruleForm"].validate(valid => {
        	if (valid) {
        		let obj = JSON.parse(JSON.stringify(this.ruleForm))
        		obj.headImage = JSON.stringify(obj.headImage);
            obj.goodsType = 1
        		editGoods(obj).then((res) => {
        				if (res.code == 0) {
        					this.$router.push({path:'/activity/drawGoods',query:{	upload: 'upload'}})
        				} else {
        					this.$message.error(res.msg);
        				}
        		})
        	}
        })

			},
			addGoods(index) {
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						let obj = JSON.parse(JSON.stringify(this.ruleForm))
						obj.headImage = JSON.stringify(obj.headImage);
            obj.goodsType = 1
						activityGoodsAdd(obj).then((res) => {
								if (res.code == 0) {
									this.$router.push({path:'/activity/drawGoods',query:{	upload: 'upload'}})
								} else {
									this.$message.error(res.msg);
								}
						})
					}
				})
			},
			//富文本编辑器方法



			onEditorChange({quill,html,text}) {
				this.content = html
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
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
