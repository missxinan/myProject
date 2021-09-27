<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="areaName"
            clearable
            placeholder="请输入城市/区县名"
            style="width: 260px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >快速查询</el-button>
        </div>
		<div style="height: 20px;"></div>
		<div class="filter-container">
		  <el-select
		    v-model="listQuery.province"
		    clearable
		    class="filter-item"
		    style="width: 130px"
		    placeholder="请选择"
			@change="changeProvince"
		  >
		    <el-option
		      v-for="item in citylist"
		      :key="item.areaCode"
		      :label="item.areaName"
		      :value="item.areaCode"
		    ></el-option>
		  </el-select>
		  <el-select
		    v-model="listQuery.city"
		    clearable
		    class="filter-item"
		    style="width: 130px"
		    placeholder="请选择"
			@change="changeCounty"
		  >
		    <el-option
		      v-for="item in countyList"
		      :key="item.areaCode"
		      :label="item.areaName"
		      :value="item.areaCode"
		    ></el-option>
		  </el-select>
		  <el-select
		    v-model="listQuery.area"
		    clearable
		    class="filter-item"
		    style="width: 130px"
		    placeholder="请选择"
		  >
		    <el-option
		      v-for="item in areaList"
		      :key="item.areaCode"
		      :label="item.areaName"
		      :value="item.areaCode"
		    ></el-option>
		  </el-select>
		  <el-button
		    class="filter-item"
		    type="primary"
		    icon="el-icon-search"
		    @click="handleFilter1"
		  >精准查询</el-button>
		  <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="reset">重置</el-button> -->
		</div>
		<div style="height: 20px;"></div>
		<div class="orderList-maill">
		  <el-tabs v-model="parentIndex" type="card" @tab-click="handleClick">
		    <el-tab-pane name="1" label="城市"></el-tab-pane>
		    <el-tab-pane name="2" label="区县"></el-tab-pane>
		  </el-tabs>
		</div>
		<!-- 城市 -->
		<div v-if="parentIndex=='1'">
			<div class="cityDetail" >
				<div class="flexDiv" v-for="(item) in  indexCityInfo" :key="item.areaCode">
					<div class="prov"  v-if="item.cityList.length>0">{{item.areaName}} </div>
					<div class="cityli1">
						<span @click="handleCity(group,item)" v-for="(group) in  item.cityList" :key="group.areaCode">{{group.areaName}} {{group.level}}</span>	
					</div>
				</div>	  
			</div>
		</div>
       
		<!-- 区县 -->
		<div v-if="parentIndex=='2'"  v-loading="loading">
			<div class="btn-type" >
				<el-button :type="btnType==0?'primary':''" @click="handleBtn(0)">全部</el-button>
				<el-button :type="btnType==1?'primary':''" @click="handleBtn(1)">A类</el-button>
				<el-button :type="btnType==2?'primary':''" @click="handleBtn(2)">B类</el-button>
				<el-button :type="btnType==3?'primary':''" @click="handleBtn(3)">C类</el-button>
				<el-button :type="btnType==4?'primary':''" @click="handleBtn(4)">D类</el-button>
			</div>
			<p class="desc">*红色：未代理， 灰色：保护区， 蓝色：已合作，橘黄：已交定金</p>
			<div class="cityDetail">
				<div class="flexDiv"  v-for="(item) in indexCountyInfo" :key="item.areaCode">
					<div class="prov" v-if="item.countyList.length>0">{{item.areaName}}</div>
					<div class="cityli1">
						<div style="display: inline-block;" v-for="(group) in  item.countyList" 
							 :key="group.areaCode">
							<span v-if="group.hidden==0"
							:class="group.signStatus==1?'danger0':group.signStatus==2?'danger3':group.signStatus==3?'danger2':group.signStatus==4?'danger1':''"
							 >{{group.areaName}} {{group.level}}</span>
						</div>
					</div>
				</div>	  
			</div>
		</div>
		<!-- 城市详情 -->
		<div class="padd" v-if="parentIndex=='3'"  v-loading="loading">
			<div class="selectCityTxt">
				<span style="color: rgb(113, 113, 113);"> 已选择城市:{{province}}-{{city}}</span>
				<el-button type="primary" @click="changeCity()">切换城市</el-button>
			</div>
			<div class="classify">
				<p>*红色：未代理， 灰色：保护区， 蓝色：已合作，橘黄：已交定金</p>
				<div class="agentDetail">
					<span 
					:class="item.signStatus==1?'danger0':item.signStatus==2?'danger3':item.signStatus==3?'danger2':item.signStatus==4?'danger1':''"
					 v-for="(item) in  areaAllList" 
					 :key="item.areaCode">{{item.areaName}} {{item.level}}</span>
				</div>
			</div>
		</div>

  </div>
</template>

<script>
import {
  fetchCityInfo,
  fetchCountyInfo,
  fetchCityList,
  fetchCountyList,
  fetchAreaList,
  fetchAreaName,
  fetchAreaCode
} from "@/api/tbSysArea.js";

export default {
  name: "notice",
  data() {
    return {
	  citylist:[],
	  countyList:[],
	  areaList:[],
	  parentIndex: "1",
	  btnType:0,
	  level:' ',
	  indexCityInfo:[],
	  areaName:'',
	  loading:true,
	  indexCountyInfo:[],
	  areaAllList:[],
	  province:'',
	  city:'',
	  listQuery: {
	    province:'',
		city:'',
		area:''
	  },
    };
  },
  created() {
    this.getCityList();
	this.getCountyList()
	this.getAllCity()
  },
  methods: {
    getCityList() {
      this.listLoading = true;
        fetchCityInfo().then(response => {
          console.log(response)
		  if (response.code == 0) {
		    this.indexCityInfo=response.data
		    this.listLoading = false;
		  } else {
		  	this.$message.error(response.msg);
		  }
        });
    },
	getAllCity(){
		fetchCityList({areaLevel:1}).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		    this.citylist=response.data
		  } else {
		  	this.$message.error(response.msg);
		  }
		});
	},
	getAllCounty(code){
		fetchCountyList({areaLevel:2,areaCode:code}).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		    this.countyList=response.data
		  } else {
		  	this.$message.error(response.msg);
		  }
		});
	},
	getAllArea(code){
		fetchAreaList({areaLevel:3,areaCode:code}).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		    this.areaList=response.data
		  } else {
		  	this.$message.error(response.msg);
		  }
		});
	},
	changeProvince(e){
		console.log(e)
		for(let i=0;i<this.citylist.length;i++){
			if(this.citylist[i].areaCode==e){
				console.log(this.citylist[i].areaName)
				this.province=this.citylist[i].areaName
			}
		}
		this.listQuery.city=''
		this.listQuery.area=''
		this.getAllCounty(e)
	},
	changeCounty(e){
		console.log(e)
		for(let i=0;i<this.countyList.length;i++){
			if(this.countyList[i].areaCode==e){
				console.log(this.countyList[i].areaName)
				this.city=this.countyList[i].areaName
			}
		}
		this.listQuery.area=''
		this.getAllArea(e)
	},
	getCountyList() {
		this.loading=true
	  let data={
		  level:this.level?this.level:' '
	  }
		fetchCountyInfo(data).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		   this.loading=false
		   this.indexCountyInfo=response.data
		  } else {
		  	this.$message.error(response.msg);
		  }
		});
	},
	handleBtn(type){
		console.log(type)
		this.btnType=type
		this.level=type==1?'A类':type==2?'B类':type==3?'C类':type==4?'D类':' '
		this.getCountyList()
	},
	handleClick() {
		if(this.parentIndex=='1'){
			this.getCityList();
		}else if(this.parentIndex=='2'){
			this.getCountyList()
		}
	},
	selectArea() {
	  let data={
		  areaName:this.areaName
	  }
		fetchAreaName(data).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		    this.parentIndex='2'
		    this.areaAllList=response.data
			this.indexCountyInfo=response.data
		  } else {
			this.$message.error(response.msg);
		  }
		  
		});
	},
	handleAreaCode(code) {
	  let data={
		  areaCode:code
	  }
		fetchAreaCode(data).then(response => {
		  console.log(response)
		  if (response.code == 0) {
		    this.parentIndex='3'
		    this.areaAllList=response.data
		  } else {
		    this.$message.error(response.msg);
		  }
		});
	},
	changeCity(){
		this.parentIndex='1'
	},
	handleCity(group,item){
		console.log(group,item)
		this.parentIndex='3'
		this.province=item.areaName
		this.city=group.areaName
		this.handleAreaCode(group.areaCode)
	},
	handleFilter() {
	  this.selectArea();
	},
	handleFilter1(){
		if(!this.listQuery.city){
		  this.$message("请选择城市！");
		  return
		}
		let code=this.listQuery.area?this.listQuery.area:this.listQuery.city
		this.handleAreaCode(code);
	},
	reset() {
	  // for (let key in this.searchbanner) {
	  //   this.searchbanner[key] = "";
	  // }
	  // this.information.positionId = undefined;
	  // this.information.type = undefined;
	  // this.information.name = "";
	  // this.getList();
	},

  }
};
</script>
<style>
.el-form-item__content {
  font-size: 16px;
}
.warning-row {
  color: red !important;
}
.total_blue {
    color: #409eff;
    cursor: pointer;
  }
.el-tabs__item {
	width: 200px;
	text-align: center;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
.cityDetail .flexDiv .prov{
	height: 2.25rem;
	line-height: 2.25rem;
	padding-left: 0.9375rem;
	font-size: 1rem;
	font-weight: 700;
	color: #5b5b5b;
	background: #f0f0f0;
	margin-bottom: 0.9375rem;
}
.cityDetail .flexDiv .cityli1{
	padding: 0 0 0 1.375rem;
}
.cityDetail .flexDiv .cityli1 span{
	padding:0 1.5rem;
	height: 1.875rem;
	font-size: 1.25rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	line-height: 1.875rem;
	border: 0.0625rem solid #dcdcc8;
	border-radius: 0.125rem;
	margin-right: 0.5rem;
	margin-bottom: 0.75rem;
	display: inline-block;
	color: #7a7878;
}
.cityDetail .flexDiv .cityli1 span.danger0{
	background: #ff5757;
	color: #fff;
	border: none;
}
.cityDetail .flexDiv .cityli1 span.danger1{
	background: #f8f8f8;
	color: #c8c8c8;
	border: none;
}
.cityDetail .flexDiv .cityli1 span.danger2{
	background: #57a2ff;
	color: #fff;
	border: none;
}
.cityDetail .flexDiv .cityli1 span.danger3{
	background: #ffb200;
	color: #fff;
	border: none;
}
.btn-type{
	display: -webkit-box;
	padding: 0.8125rem 1.375rem;
}
.btn-type button{
	margin-right: 2.5rem;
}
.desc{
	padding-left: 1.375rem;
	color: rgb(153, 153, 153);
	font-size: 0.75rem;
	padding-bottom: 0.9375rem;
}
.padd{
	padding: 0.625rem 0 0 0.9375rem;
}
.padd .selectCityTxt{
	width: 100%;
	height: 3.125rem;
	line-height: 3.125rem;
}
.padd .selectCityTxt button{
	height: 3.125rem;
	font-size: 1.25rem;
	width: 7.5rem;
	margin-left: 3.125rem;
	text-align: center;
	color: #fff;
}
.classify p{
	font-size: 1rem;
	font-weight: 400;
	padding-bottom: 0.625rem;
	padding-top: 0.75rem;
	color: #999;
}
.agentDetail{
	font-size: 0;
	padding-top: 0.9375rem;
}
.agentDetail>span{
	padding:0 1.5rem;
	height: 1.875rem;
	font-size: 1.25rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: center;
	line-height: 1.875rem;
	border: 0.0625rem solid #dcdcc8;
	border-radius: 0.125rem;
	margin-right: 0.5rem;
	margin-bottom: 0.75rem;
	display: inline-block;
	color: #7a7878;
}
.agentDetail>span.danger0{
	background: #ff5757;
	color: #fff;
	border: none;
}
.agentDetail>span.danger1{
	background: #f8f8f8;
	color: #c8c8c8;
	border: none;
}
.agentDetail>span.danger2{
	background: #57a2ff;
	color: #fff;
	border: none;
}
.agentDetail>span.danger3{
	background: #ffb200;
	color: #fff;
	border: none;
}
</style>
