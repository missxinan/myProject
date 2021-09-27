<template>
	<div class="container" id="containerly">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基础信息</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="商品分类" class="is-required">
					<div class="block">
						<el-cascader v-model="ruleForm.classificationofgoods" :options="options" @change="handleChange"></el-cascader>
					</div>
				</el-form-item>
				<el-form-item label="商品来源" prop="source">
					<el-select v-model="ruleForm.source" placeholder="请选择活动区域">
						<el-option label="商城" value='1'></el-option>
						<el-option label="平台" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="供应商" prop="supplier">
					<el-input v-model="ruleForm.supplier"></el-input>
				</el-form-item>
				<el-form-item label="展示区域" prop="displayArea">
					<el-radio-group v-model="ruleForm.displayArea">
						<el-radio label="默认区" value="1"></el-radio>
						<el-radio label="新人区" value="2"></el-radio>
						<el-radio label="VIP区" value="3"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商品名称" prop="goodsName">
					<el-input type="textarea" v-model="ruleForm.goodsName"></el-input>
				</el-form-item>
				<el-form-item label="商品简介" prop="description">
					<el-input type="textarea" v-model="ruleForm.description"></el-input>
				</el-form-item>

				<el-form-item label="封面图选择" prop="region" class="is-required">
					<el-upload action="https://csupms.jiayikou.com" list-type="picture-card" :limit="1" :auto-upload="false"
					 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="ruleForm.logo" alt="">
					</el-dialog>

					<!-- 测试 -->

				</el-form-item>

				<el-form-item label="封面图展示" prop="region" v-if="jiaohuFlag != 0">
					<div class="selectedDisplayarea">
						<img :src="ruleForm.logo" alt="图片出错">
					</div>
				</el-form-item>

				<el-form-item label="头图选择区" prop="region">
					<el-upload v-if="jiaohuFlag == 0" action="https://csupms.jiayikou.com" list-type="picture-card" :limit="9"
					 :auto-upload="false" :on-change="getFile1" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveHeader1">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisibleHeader" v-if="jiaohuFlag == 0">
						<img width="100%" :src="imgs" alt="">
					</el-dialog>


					<el-upload :limit="9" v-if="jiaohuFlag != 0" :auto-upload="false" class="upload-demo" action="https://csupms.jiayikou.com"
					 :on-change="getFile1" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveHeader1" list-type="picture">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>

				<el-form-item label="头图展示区" prop="region" v-if="jiaohuFlag != 0">
					<div class="showimages">
						<div :class="index === selectedIndex?'selectedDisplayarea':'Displayarea'" v-for="(item,index) in ruleForm.headImage"
						 :key="index" @click="DisplayareaImage(index)">

							<img :src="item" :alt="'图片'+index">
							<div :class="index === selectedIndex?'x':''" @click="Xhao(index)"></div>
						</div>
					</div>
				</el-form-item>


				<el-form-item label="成本价" prop="costPrice">
					<el-input v-model="ruleForm.costPrice"></el-input>
				</el-form-item>

				<el-form-item label="权重" prop="sort">
					<el-input v-model="ruleForm.sort"></el-input>
				</el-form-item>

			</el-form>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>详情</span>
				<particulars v-model="ruleForm.goodsDetail"></particulars>
			</div>
			<!-- <div slot="header" class="clearfix">
                <quill-editor v-model="ruleForm.goodsDetail"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"></quill-editor>
            </div> -->
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>拍卖设置</span>
			</div>
			<el-form :model="AuctionSet" :rules="rules" ref="AuctionSet" label-width="100px" class="demo-ruleForm">
				<el-form-item label="估值" prop="assessPrice">
					<el-input v-model="AuctionSet.assessPrice"></el-input>
				</el-form-item>
				<el-form-item label="起拍价" prop="startPrice">
					<el-input v-model="AuctionSet.startPrice"></el-input>
				</el-form-item>
				<el-form-item label="最低保护价" class="is-required">
					<div>
						<el-input v-model="AuctionSet.protectPrice"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="最高保护价" class="is-required">
					<div>
						<el-input v-model="AuctionSet.maxProtectPrice"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="佣金" prop="sum" class="is-required">
					<el-input v-model="sum" :disabled="true"></el-input>
				</el-form-item>

				<el-form-item label="加价幅度" prop="markupPrice">
					<el-input v-model="AuctionSet.markupPrice" @keyup.enter.native="submitadd"></el-input>
				</el-form-item>

				<el-form-item label="开拍时间" prop="startTime">
					<el-date-picker @focus="KaiPaiTime" :editable="false" :picker-options="pickerOptions0" format="yyyy-MM-dd HH:mm"
					 type="datetime" @change="Vm" placeholder="选择日期" v-model="AuctionSet.startTime" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="截拍时间" prop="endTime">
					<el-date-picker @focus="JiePaiTime" :disabled="JiePaiTimeTrueFalse" :editable="false" :picker-options="pickerOptions0"
					 format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期" @change="Gm" v-model="AuctionSet.endTime" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<!--  <el-form-item label="加价规则" prop="addPriceRuleId">
                    <el-select v-model="AuctionSet.addPriceRuleId" placeholder="请选择活动区域" clearable >
						<el-option :label="item.name" :value="item.id" v-for="(item,index) in addrules" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->

			</el-form>
			<!-- 前端排重 -->
			<el-button class='footerBun' type="primary" @click="search" :disabled="FlagNumber">发布产品</el-button>
			<el-button class='footerBun' type="primary" @click="saveshopping" :disabled="FlagNumber">保存</el-button>
			<el-button type="primary" @click="cancel">取消</el-button>
		</el-card>
		<!-- <el-button type="primary" @click="search">发布产品</el-button> -->


		<!-- <el-button type="primary">取消</el-button> -->
	</div>
</template>

<script>
	import {
		quillEditor
	} from 'vue-quill-editor'
	import {
		allList,
		goodsInfoadd,
		goodsInfoaddlist,
		goodsInfoedit,
		base64picture
	} from "@/api/addrules";
	import {
		auctionRecordInfoList,
		treeApi
	} from "@/api/AuctionsRecord.js";

	import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
	import particulars from '@/components/particulars';
	export default {
		components: {
			quillEditor,
			particulars
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
				// props:{
				//     label: '文玩收藏',
				//     value: '1000',
				//     children: 'sub'
				// },
				//富文本
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
				ImgFlag: false,
				//
				ruleForm: {
					goodsDetail: '',
					classificationofgoods: [],
					source: '',
					supplier: '',
					displayArea: '',
					goodsName: '',
					logo: '',
					headImage: [],
					costPrice: '',
					sort: '',
					description: ''
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
					source: [{
						required: true,
						message: '请选择商品来源',
						trigger: 'change'
					}, ],
					region: [{
						required: true,
						message: '请选择活动区域',
						trigger: 'change'
					}],
					supplier: [{
						required: true,
						message: '请输入供应商',
						trigger: 'change'
					}],
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
					description: [{
						required: true,
						message: '请输入商品简介',
						trigger: 'change'
					}],
					costPrice: [{
						required: true,
						message: '请输入成本价',
						trigger: 'change'
					}],
					sort: [{
						required: true,
						message: '请输商品权重',
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
					markupPrice: [{
						required: true,
						message: '请输商品加价幅度',
						trigger: 'change'
					}],
					startTime: [{
						type: 'date',
						required: true,
						message: '请选择日期',
						trigger: 'change'
					}],
					endTime: [{
						type: 'date',
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}]
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
			}
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			},
			sum() {

				inputOnchange({
					configKey: 'markup_ratio_member'
				}).then((res) => {
					if (res.msg === 'success') {
						this.numbers = Number(res.data);
					}
				})
				return (this.AuctionSet.markupPrice * this.numbers).toFixed(2);
			}
		},
		created() {
			// location.reload();
			this.jiaohuFlag = Array.from(Object.keys(this.$route.query)).length;
			// console.log(this.$route.query);
			// console.log(this.jiaohuFlag,'看看我的结果');
			if (this.$route.query.hasOwnProperty('copy')) {
				console.log('true');
				this.copyflag = true;
			}
			goodsInfoaddlist(this.$route.query).then((res) => {
				// console.log(res,'新增/编辑页面'
				// console.log(res,'66667777');
				this.ruleForm.classificationofgoods.push(res.data['categoryId']);
				//console.log(this.ruleForm.classificationofgoods,'6666');
				for (var oldkey in this.ruleForm) {
					for (var newkey in res.data) {
						if (oldkey === newkey) {
							if (oldkey === 'headImage') {
								console.log(res.data[newkey], '666666')
								this.ruleForm[oldkey] = res.data[newkey];
								this.imgs = res.data[newkey];
							} else {
								this.ruleForm[oldkey] = res.data[newkey];
							}
						}
					}
				}

				if (res.data.displayArea === 1) {
					this.ruleForm.displayArea = '默认区'
				}
				for (var oldkey in this.AuctionSet) {
					for (var newkey in res.data) {
						if (oldkey === newkey) {

							this.AuctionSet[oldkey] = res.data[newkey];

						}
					}
				}
				this.YongJin = res.data.brokerage;
				//字符串;
				// console.log(this.ruleForm,'66666')
				if (typeof this.ruleForm.headImage === 'string') {
					this.ruleForm.headImage = JSON.parse(this.ruleForm.headImage);
					console.log(this.ruleForm.headImage, '准备前期')
					if (this.ruleForm.headImage.length === 0) {
						this.SwitchFlag = true;
					}
				}
				//  console.log(typeof this.ruleForm.headImage,'77777')
				//头图和商品分类需要单独拎出来处理
				//请求回数据之后商品分类直接可以选中以后的ID 比如：10001;
			})

			allList().then((res) => {
				this.addrules = [];
				this.addrules = res.data;
				this.addrules.push({
					name: '无',
					id: "0"
				})
			})
			setTimeout(() => {
				treeApi({type:1}).then((res) => {
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
				//   <el-form-item label="最低保护价" class="is-required">
				//             <div>
				//                 <el-input v-model="AuctionSet.protectPrice" @blur="ZuiDi"></el-input>
				//             </div>
				//         </el-form-item>
				//         <el-form-item label="最高保护价" class="is-required">
				//             <div>
				//                 <el-input v-model="AuctionSet.maxProtectPrice"></el-input>
				//             </div>
				//         </el-form-item>
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
			//截拍时间
			Gm(vm) {
				// 1秒 == 1000毫秒
				// 1小时 == 60分钟 60秒 3600000
				if (new Date(vm).getTime() - new Date(this.AuctionSet.startTime).getTime() >= 0 && new Date(vm).getTime() - new Date(
						this.AuctionSet.startTime).getTime() <= 3600000) {
					this.$message('选择成功！')
					this.AuctionSet.endTime = vm;
				} else {
					this.$message('截拍时间距开拍时间不能超过一小时！');
					this.AuctionSet.endTime = '';
				};
			},
			Vm(vm) {
				console.log(vm, '7777');
				if (vm < this.CurrentTime) {
					this.$message('选中时间要大于当前时间！');
					this.AuctionSet.startTime = '';
				} else {
					// this.$message('请重新选择时间！');
					let Data = new Date(vm).getTime() + (60000 * 20);
					var d = new Date(Data);
					this.AuctionSet.endTime = d;
					this.JiePaiTimeTrueFalse = false
				}

			},
			//递归
			duigui(options) {
				for (let i = 0; i < options.length; i++) {
					if (options[i].hasOwnProperty('children') && options[i].children.length > 0) {
						for (let j = 0; j < options[i].children.length; j++) {
							if (options[i].children[j].hasOwnProperty('children')) {
								this.duigui(options[i].children[j]);
							} else {
								console.log(options[i].children[j].value)
								if (options[i].children[j].value === this.ruleForm.classificationofgoods[0]) {
									let Data = this.ruleForm.classificationofgoods[0];
									this.ruleForm.classificationofgoods.length = 0;
									this.ruleForm.classificationofgoods.push(options[i].value)
									this.ruleForm.classificationofgoods.push(Data)
									console.log(this.ruleForm.classificationofgoods, '99999');
								}
							}
						}
					}
				}

			},
			Xhao(index) {
				this.ruleForm.headImage.splice(index, 1);
			},
			cancel() {
				this.$router.push('/storeManagement/commodity/commodityList');
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
			saveshopping() {
				let Obj = Object.assign({}, { ...this.ruleForm,
					categoryId: this.ruleForm.classificationofgoods[this.ruleForm.classificationofgoods.length - 1]
				}, this.AuctionSet)
				delete Obj.classificationofgoods;
				switch (Obj['displayArea']) {
					case '默认区':
						Obj['displayArea'] = '1'
						break
					case '新人区':
						Obj['displayArea'] = '2'
						break
					case 'VIP区':
						Obj['displayArea'] = '3'
						break
				}
				Obj.status = 6;
				this.FlagNumber = true;
				if (Number(Obj.maxProtectPrice) < Number(Obj.protectPrice) || Obj.maxProtectPrice <= 0) {
					this.$message('最高保护价不能低于最低保护价,且不能为空！');
					setTimeout(() => {
						this.FlagNumber = false;
					}, 500)
					return
				}
				if (Obj.headImage.length > 0 && Obj.logo.length > 0) {

					Obj.endTime = this.ChangeTime(Obj.endTime);
					Obj.startTime = this.ChangeTime(Obj.startTime);
					Obj.headImage = JSON.stringify(Obj.headImage);
					Obj = this.fliterfunc(Obj);

					if (this.copyflag) {
						goodsInfoadd(Obj).then((res) => {
							if (res.msg === 'success') {
								this.$router.push('/storeManagement/commodity/commodityList')
							} else {
								this.$message(res.msg);
								setTimeout(() => {
									this.FlagNumber = false;
								}, 500)
							}
						})
					} else {
						if (this.jiaohuFlag != 0) {
							goodsInfoedit({ ...Obj,
								...this.$route.query
							}).then((res) => {
								if (res.msg === 'success') {
									this.$router.push('/storeManagement/commodity/commodityList')
								} else {
									this.$message(res.msg);
									setTimeout(() => {
										this.FlagNumber = false;
									}, 500)
								}
							})
						} else {
							goodsInfoadd(Obj).then((res) => {
								if (res.msg === 'success') {
									this.$router.push('/storeManagement/commodity/commodityList')
								} else {
									this.$message(res.msg);
									setTimeout(() => {
										this.FlagNumber = false;
									}, 500)
								}

							})
						}
					}

				} else {
					this.$message('头图和封面图是必选项！');
					setTimeout(() => {
						this.FlagNumber = false;
					}, 500)
				}
			},
			search() {

				let Obj = Object.assign({}, { ...this.ruleForm,
					categoryId: this.ruleForm.classificationofgoods[this.ruleForm.classificationofgoods.length - 1]
				}, this.AuctionSet)
				delete Obj.classificationofgoods;
				switch (Obj['displayArea']) {
					case '默认区':
						Obj['displayArea'] = '1'
						break
					case '新人区':
						Obj['displayArea'] = '2'
						break
					case 'VIP区':
						Obj['displayArea'] = '3'
						break
				}
				Obj.status = 3;
				this.FlagNumber = true;
				if (Number(Obj.maxProtectPrice) < Number(Obj.protectPrice) || Obj.maxProtectPrice <= 0) {
					this.$message('最高保护价不能低于最低保护价,且不能为空！');
					setTimeout(() => {
						this.FlagNumber = false;
					}, 500)
					return
				}
				if (Obj.headImage.length > 0 && Obj.logo.length > 0) {

					// Obj.endTime = this.ChangeTime(Obj.endTime);
					// Obj.startTime = this.ChangeTime(Obj.startTime);
					Obj.headImage = JSON.stringify(Obj.headImage);
					Obj = this.fliterfunc(Obj);
					if (this.copyflag) {
						//复制然后注册商品
						if (Obj.hasOwnProperty('startTime') && Obj.hasOwnProperty('endTime')) {
							Obj.endTime = this.ChangeTime(Obj.endTime);
							Obj.startTime = this.ChangeTime(Obj.startTime);
							Obj.startTime = Obj.startTime.slice(0, Obj.startTime.lastIndexOf(':'));
							Obj.endTime = Obj.endTime.slice(0, Obj.endTime.lastIndexOf(':'));
							Obj.startTime = Obj.startTime + ':00';
							Obj.endTime = Obj.endTime + ':00';
							setTimeout(() => {
								goodsInfoadd(Obj).then((res) => {
									if (res.msg === 'success') {
										this.$router.push('/storeManagement/commodity/commodityList')
									} else {
										this.$message(res.msg);
										setTimeout(() => {
											this.FlagNumber = false;
										}, 500)
									}
								})
							}, 500)

						} else {
							goodsInfoadd(Obj).then((res) => {
								if (res.msg === 'success') {
									this.$router.push('/storeManagement/commodity/commodityList')
								} else {
									this.$message(res.msg);
									setTimeout(() => {
										this.FlagNumber = false;
									}, 500)
								}
							})
						}


					} else {
						if (this.jiaohuFlag != 0) {
							// console.log(Obj,'7777')
							if (Obj.hasOwnProperty('startTime') && Obj.hasOwnProperty('endTime')) {
								Obj.endTime = this.ChangeTime(Obj.endTime);
								Obj.startTime = this.ChangeTime(Obj.startTime);
								Obj.startTime = Obj.startTime.slice(0, Obj.startTime.lastIndexOf(':'));
								Obj.endTime = Obj.endTime.slice(0, Obj.endTime.lastIndexOf(':'));
								Obj.startTime = Obj.startTime + ':00';
								Obj.endTime = Obj.endTime + ':00';
								setTimeout(() => {
									goodsInfoedit({ ...Obj,
										...this.$route.query
									}).then((res) => {
										if (res.msg === 'success') {
											this.$router.push('/storeManagement/commodity/commodityList')
										} else {
											this.$message(res.msg);
											setTimeout(() => {
												this.FlagNumber = false;
											}, 500)
										}
									})
								}, 500)

							} else {
								goodsInfoedit({ ...Obj,
									...this.$route.query
								}).then((res) => {
									if (res.msg === 'success') {
										this.$router.push('/storeManagement/commodity/commodityList')
									} else {
										this.$message(res.msg);
										setTimeout(() => {
											this.FlagNumber = false;
										}, 500)
									}
								})
							}

						} else {
							if (Obj.hasOwnProperty('startTime') && Obj.hasOwnProperty('endTime')) {
								Obj.endTime = this.ChangeTime(Obj.endTime);
								Obj.startTime = this.ChangeTime(Obj.startTime);
								Obj.startTime = Obj.startTime.slice(0, Obj.startTime.lastIndexOf(':'));
								Obj.endTime = Obj.endTime.slice(0, Obj.endTime.lastIndexOf(':'));
								Obj.startTime = Obj.startTime + ':00';
								Obj.endTime = Obj.endTime + ':00';
								setTimeout(() => {
									goodsInfoadd(Obj).then((res) => {
										if (res.msg === 'success') {
											this.$router.push('/storeManagement/commodity/commodityList')
										} else {
											this.$message(res.msg);
											setTimeout(() => {
												this.FlagNumber = false;
											}, 500)
										}
									})
								}, 500)

							} else {
								goodsInfoadd(Obj).then((res) => {
									if (res.msg === 'success') {
										this.$router.push('/storeManagement/commodity/commodityList')
									} else {
										this.$message(res.msg);
										setTimeout(() => {
											this.FlagNumber = false;
										}, 500)
									}

								})
							}

						}
					}

				} else {

					// Obj.endTime = this.ChangeTime(Obj.endTime);
					// Obj.startTime = this.ChangeTime(Obj.startTime);
					// Obj.startTime = Obj.startTime.slice(0,Obj.startTime.lastIndexOf(':'));
					// Obj.endTime = Obj.endTime.slice(0,Obj.endTime.lastIndexOf(':'));
					// console.log(Obj.startTime+':00','目标数据')
					// console.log(Obj.endTime+':59','目标数据')
					this.$message('头图和封面图是必选项！');
					setTimeout(() => {
						this.FlagNumber = false;
					}, 500)
				}



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
				// console.log(file.raw)
				let formDate = new FormData()
				formDate.append('multipartFileList', file.raw);
				// console.log(formDate,'55555')
				uploadFileList(formDate).then(resp => {
					// console.log(resp);
					if (resp.code == 0) {
						this.ruleForm.logo = resp.data[0]
						// this.dialogVisible = true
					} else {
						this.$message({
							message: resp.msg,
							type: 'warning'
						});
					}

				})
			},
			getFile1(file, fileList) {
				console.log('Hello');
				let formDate = new FormData()
				formDate.append('multipartFileList', file.raw);
				try {
					uploadFileList(formDate).then(resp => {

						if (resp.code == 0) {
							if (this.jiaohuFlag != 0) {
								if (this.SwitchFlag) {
									this.imgs = resp.data[0];
									this.ruleForm.headImage.push(resp.data[0]);

									if (this.SampleData.length === 0) {

										this.SampleData.push({
											index: 0,
											uid: file.uid
										})
									} else {

										let Indexbeforetarget = this.SampleData[this.SampleData.length - 1].index + 1;
										this.SampleData.push({
											index: Indexbeforetarget,
											uid: file.uid
										});
									}
								} else {
									this.imgs = resp.data[0];
									//第二期代码！  明日需要更改得地方。
									// console.log(this.IndexSelected,'78888');
									console.log(this.ruleForm.headImage);
									if (this.IndexSelected != null && typeof this.IndexSelected == 'number') {
										this.ruleForm.headImage.splice(this.IndexSelected, 1, resp.data[0]);
										console.log(this.ruleForm.headImage);
										this.IndexSelected = '';
									} else {
										if (this.ruleForm.headImage.length < 9) {
											this.ruleForm.headImage.push(resp.data[0])
										} else {
											this.$message('无法添加，头图最多选择9张！');
										}

									}

								}
							} else {
								this.imgs = resp.data[0];
								this.ruleForm.headImage.push(resp.data[0]);
								if (this.SampleData.length === 0) {
									this.SampleData.push({
										index: 0,
										uid: file.uid
									})
								} else {
									let Indexbeforetarget = this.SampleData[this.SampleData.length - 1].index + 1;
									this.SampleData.push({
										index: Indexbeforetarget,
										uid: file.uid
									});
								}

							}

						} else {
							this.$message({
								message: resp.msg,
								type: 'warning'
							});
							location.reload();
						}

					})
				} catch (err) {
					//在此处理错误
					this.$message({
						message: err,
						type: 'warning'
					});
					location.reload();
				}




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
						//牛逼
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
			// 从后台获取文本
		}
	}
</script>

<style>
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

	/* .selectedDisplayarea{
    position: relative;
    float: left;
    margin-left: 20px;
} */
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
