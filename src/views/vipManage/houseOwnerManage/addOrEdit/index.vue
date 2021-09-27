<template>
	<div class="headQuarters-addOrEdit">
		<div class="title">基础信息</div>
		<div class="addOrEdit-content">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="名称" prop="nickname" required>
					<el-input
						class="item-input"
						type="text"
						placeholder="请输入名称"
						v-model.trim="ruleForm.nickname"
						maxlength="30"
						show-word-limit
					>
					</el-input>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="userName" required>
					<el-input
						class="item-input"
						type="text"
						placeholder="请输入联系人姓名"
						v-model.trim="ruleForm.userName"
						maxlength="4"
						show-word-limit
					>
					</el-input>
				</el-form-item>
				<el-form-item label="联系人手机" prop="phone" required>
					<el-input class="item-input" :disabled="partnerId !=='' ? true : false" v-model.trim="ruleForm.phone" placeholder="请输入联系人手机号"></el-input>
				</el-form-item>
				<!-- <el-form-item label="联系人城市" prop="addrCode">
					<el-select v-model="province" placeholder="请选择省" @change="selectProvince">
						<el-option
							v-for="item in provinceArry"
							:key="item.id"
							:label="item.areaname"
							:value="item.id">
						</el-option>0
					</el-select>
					<el-select v-model="city" placeholder="请选择市" @change="selectCity">
						<el-option
							v-for="item in cityArry"
							:key="item.id"
							:label="item.areaname"
							:value="item.id">
						</el-option>
					</el-select>
					<el-select v-model="area" placeholder="请选择区">
						<el-option
							v-for="item in areaArry"
							:key="item.id"
							:label="item.areaname"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="详细地址" prop="detailedAddress">
					<el-input
						class="item-input"
						type="textarea"
						:rows="2"
						placeholder="请输入详细地址"
						v-model="ruleForm.detailedAddress">
					</el-input>
				</el-form-item> -->
				<el-form-item label="C端账号" prop="cPhone" required>
					<el-input class="item-input" :disabled="partnerId !=='' ? true : false" type="textarea" v-model="ruleForm.cPhone" placeholder="请输入C端账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
					<el-button @click="goList">取消</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>
<script>
import { create } from 'domain';
// import {
//   partnerAdd,
//   partnerDetail,
//   partnerEdit,
//   addressList
// } from "@/api/corporateManagement.js";
import {viphouseOwnerManageList,vipHouseOwnerAdd,vipHouseOwnerEdit,vipHouseOwnerDetail} from "@/api/vipMange.js";
export default {
	name: 'headQuartersAddOrEdit',
	data() {
		var validate=(rule,value,callback)=>{
			const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if(!reg.test(value)){
				callback(new Error('请输入正确手机号'));
				return;
			}else{
				callback();
				return;
			}
        };
		return {
			partnerId:'',
			provinceId:'',
			province:'',
			provinceArry: [{
				areaname:'',
				id: ''
			}],
			city: '',
			cityId: '',
			cityArry:[],
			area: '',
			areaId: '',
			areaArry: [],
			ruleForm: {
				nickname: '',
				userType: '1',
				userName: '',
				phone: '',
				addrCode: '',
				detailedAddress: '',
				cPhone: '',
			},
			rules: {
				nickname: [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 2 个字符', trigger: 'blur' }
				],
				userType: [
					{ required: true, trigger: 'change' }
				],
				userName: [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ min: 1, max: 4, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入名称', trigger: 'blur' },
					{ validator: validate, trigger: 'blur' }
				],
				cPhone: [
					{ required: true, message: '请输入C端账号（手机号）', trigger: 'blur' }
				]
			}
		}
	},
	created(){
		let partnerId = this.$route.query.partnerId;
		if(partnerId){
			this.partnerId = partnerId;
			this.getPartnerDetail();
		}else{
			// 店主地址隐藏
			// this.getProvinceAddress();
		}
	},
	methods:{
		// 提交保存
		submitForm(formName) {
			let data = this.ruleForm;
			let that = this;
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let partnerId = this.partnerId;
					if(that.area != ''){
						that.ruleForm.addrCode =  that.area;
					}
					if(partnerId !==""){
						// 编辑
						data.partnerId = this.partnerId;
						vipHouseOwnerEdit(data).then(res =>{
							if(res.code == '00000'){
								this.$message({
									message: '编辑成功！',
									type: 'success'
								});
								this.$router.push({
									path: '/vipMange/houseOwnerMange/houseOwnerMangeList',
								})
							}else{
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
						})
					}else{
						// 添加
						vipHouseOwnerAdd(data).then(res =>{
							if(res.code == '00000'){
								this.$message({
									message: '添加成功！',
									type: 'success'
								});
								this.$router.push({
									path: '/vipMange/houseOwnerMange/houseOwnerMangeList',
								})
							}else{
								this.$message({
									message: res.msg,
									type: 'error'
								});
							}
						})
					}
				}
			});
		},
		// 取消提交
		resetForm(formName) {
			this.$router.push({
				path: '/vipMange/houseOwnerMange/houseOwnerMangeList',
			})
		},
		//获取省地址
		getProvinceAddress() {
			let data = {
				parentId: 0
			}
			viphouseOwnerManageList(data).then(res =>{
				if(res.code == 0){
					this.provinceArry = [...this.provinceArry,...res.data];
				}else{
					this.$message({ message: res.msg, type: "error" });
				}
			})
		},
		//获取市地址
		getCityAddress() {
			let data = {
				parentId: this.provinceId
			}
			viphouseOwnerManageList(data).then(res =>{
				if(res.code == 0){
					this.cityArry = res.data;
				}else{
					this.$message({ message: res.msg, type: "error" });
				}
			})
		},
		//获取区地址
		getAreaAddress() {
			let data = {
				parentId: this.cityId
			}
			viphouseOwnerManageList(data).then(res =>{
				if(res.code == 0){
					this.areaArry = res.data;
				}else{
					this.$message({ message: res.msg, type: "error" });
				}
			})
		},
		selectProvince(value){
			if(value == ''){
				this.provinceId= "";
				this.cityId = "";
				this.areaId = "";
				this.area = "";
				this.city = "";
				this.cityArry = [];
				this.areaArry = [];
			}else{
				this.provinceId = value;
				this.city = '';
				this.area = '';
				this.getCityAddress();
			}
		},
		selectCity(value){
			this.cityId = value;
			this.area = '';
			this.getAreaAddress();
		},
		//获取详情
		getPartnerDetail(){
			let data = {
				partnerId: this.partnerId
			};
			vipHouseOwnerDetail(data).then(res =>{
				if(res.code == 0){
					let datas = res.data;
					this.ruleForm.nickname = datas.nickname;
					this.ruleForm.userType = datas.userType;
					this.ruleForm.userName = datas.userName;
					this.ruleForm.phone = datas.phone;
					this.ruleForm.addrCode = datas.addrCode;
					this.ruleForm.detailedAddress = datas.detailedAddress;
					this.ruleForm.cPhone = datas.cPhone;
					if(datas.code !== ''){
						let codes = datas.code.split(",")
						this.province = Number(codes[0]);
						this.city = Number(codes[1]);
						this.area = Number(codes[2]);
						this.provinceId = codes[0];
						this.cityId = codes[1];
						this.areaId = codes[2];
						// this.getProvinceAddress();
						// this.getCityAddress();
						// this.getAreaAddress();
					}else{
						// this.getProvinceAddress();
					}
				}else{
					this.$message({ message: res.msg, type: "error" });
				}
			})
		},
		goList(){
			this.$router.push({
				path: '/vipMange/houseOwnerMange/houseOwnerMangeList',
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	.headQuarters-addOrEdit{
		padding: 24px;
		.title{
			height: 50px;
			line-height: 50px;
			border-bottom: 1px solid #eee;
			margin-bottom: 40px;
		}
		.title::before{
			content: '';
			display: inline-block;
			height: 16px;
			width: 2px;
			background: #409EFF;
			margin-right: 6px;
		}
		.addOrEdit-content{
			padding: 0 24px;
			.item-input{
				width: 400px;
			}
		}
	}
</style>
