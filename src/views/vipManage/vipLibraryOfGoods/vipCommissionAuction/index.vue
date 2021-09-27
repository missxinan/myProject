<template>
    <!-- 商品列表 -->
	
    <div class="app-container">
        <!--<el-button type="primary" @click="productiondetailList">添加商品</el-button>-->
         <!--<el-menu :default-active="activeIndex" class="el-menu-demo" style="margin-bottom: 10px;" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">竞拍中</el-menu-item>
            <el-menu-item index="2">寄拍成功</el-menu-item>
            <el-menu-item index="3">寄拍失败</el-menu-item>
        </el-menu>-->
		<el-tabs v-model="activeName">
			<el-tab-pane label="寄拍中" name="first">
				<Basic v-bind:mallpops="0"></Basic>
			</el-tab-pane>
			<el-tab-pane label="寄拍成功" name="second">
				<Basic v-bind:mallpops="1"></Basic>
			</el-tab-pane>
			<el-tab-pane label="寄拍失败" name="third">
				<Basic v-bind:mallpops="2"></Basic>
			</el-tab-pane>
		  </el-tabs>
    </div>
	
</template>

<script>
import Basic from './newbasicinformation';
export default {
	name:'commodityList',
    components:{
        Basic,//竞拍中来点击时对应不同的组件名即可
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            activeIndex: '1',
            activeIndex2: '1',
            componentsArray:['Basic','Details','Auctioninformation','Auctionsarecord'],
            whichcomp:'Basic',
			activeName: 'first'
			
        }
    },
		
	created(){
		this.whichcomp = JSON.parse(sessionStorage.getItem('whichcomp'));
		this.activeIndex = JSON.parse(sessionStorage.getItem('key'));
		if(this.activeIndex == null || this.activeIndex == undefined || this.activeIndex == ''){
            console.log(2);
            this.activeIndex = '1'
            this.whichcomp = 'Basic'
		}
	},
	
	watch:{
	   '$route'(to,from){
		   console.log(this.$route.path,'444444');
	   }
	},
    methods: {
			
		childrenmethod(value){
			console.log(value,'666')
		},
        handleSelect(key, keyPath) {
            this.componentsArray.some((item,index)=>{
            if(index === key-1){
                this.whichcomp = item;
				sessionStorage.setItem('whichcomp',JSON.stringify(this.whichcomp));
				sessionStorage.setItem('key',JSON.stringify(key));
                return true
            }
            })
        },
        productiondetailList(){
            //需要跳转的路由。
            // /storeManagement/commodity/productiondetail
            this.$message('跳转成功！');
            this.$router.push('/storeManagement/commodity/productiondetail')
        }
    },
}
</script>

<style>
	.container{
		padding: 20px;
	}
</style>
