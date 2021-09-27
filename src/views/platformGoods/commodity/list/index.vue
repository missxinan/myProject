<template>
    <!-- 商品列表 -->

    <div class="app-container">
        <el-button type="primary" @click="productiondetailList" v-if="checkPermission(['goods:platform:add'])" style="margin-bottom: 10px;">添加商品</el-button>
        <el-button type="primary" @click="productiondetailInfo" v-if="checkPermission(['goods:platform:add'])" style="margin-bottom: 10px;">添加捡漏商品</el-button>
		<keep-alive v-if="upload == true">
            <component v-bind:is="whichcomp" :totals="msg"></component>
		</keep-alive>
        <div v-if="upload == false">
            <component v-bind:is="whichcomp" :totals="msg"></component>
		</div>
    </div>

</template>

<script>
import Basic from './basicinformation';
import checkPermission from "@/utils/permission";
export default {
	name:'platformGoods',
    components:{
        Basic,
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            activeIndex: '1',
            activeIndex2: '1',
            componentsArray:['Basic'],
            whichcomp:'Basic',
            upload:true
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
           console.log(this.$route.query,'444444')

           if (this.$route.query.upload == 'upload') {
                console.log(1111)
                this.upload = false
                console.log(this.upload)
            }else{
                this.upload = true
            }
       }

	},
    methods: {
		checkPermission,
		childrenmethod(value){
			console.log(value,'666')
		},
        // handleSelect(key, keyPath) {
        //     this.componentsArray.some((item,index)=>{
        //     if(index === key-1){
        //         this.whichcomp = item;
				// sessionStorage.setItem('whichcomp',JSON.stringify(this.whichcomp));
				// sessionStorage.setItem('key',JSON.stringify(key));
        //         return true
        //     }
        //     })
        // },
        productiondetailList(){
            //需要跳转的路由。
            // /storeManagement/commodity/productiondetail
            this.$router.push('/platformGoods/addPlatformGoods')
        },
		productiondetailInfo(){
		    //需要跳转的路由。
		    // /storeManagement/commodity/productiondetail
		    this.$router.push('/platformGoods/addPlatformGoodsInfo')
		}
    },
}
</script>

<style>
	.container{
		padding: 20px;
	}
</style>
