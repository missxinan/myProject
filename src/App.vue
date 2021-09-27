<template>
  <div id="app">
    <!-- <div class="nav-link">
        <div class="percenter"></div>
        <el-tag
          v-for="tag in RouterLink"
          :key="tag.name"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          @click="TiaoZhuan(tag)"
          :type="tag.type"
          class="colorCenter"
        >
          {{tag.name}}
        </el-tag>
    </div> -->
   
      <!-- <router-view /> -->
	  <router-view v-if="isRouterAlive"></router-view>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
	  return {
		  reload: this.reload                                              
	  }
  },
  data() {
    return {
	  isRouterAlive: true,                    //控制视图是否显示的变量
      RouterLink:[],
      RouterLinkType:[{
        link : '/storeManagement/commodity/commodityList',
        name : '商品列表'
      },{
        link : '/storeManagement/classification',
        name : '拍卖分类管理'
      },{
        link : '/storeManagement/auctionsRecord/auctionsRecordList',
        name : '拍卖记录列表'
      },{
        link : '/storeManagement/priceRule',
        name : '加价规则'
      }],
      Flag:''
    }
  },
  methods: {
	  reload () {
		  this.isRouterAlive = false;            //先关闭，
		  this.$nextTick(function () {
			  this.isRouterAlive = true;         //再打开
		  }) 
	  },
    TiaoZhuan(tag){
      this.$router.push(tag.link);
    },
    handleClose(tag){
      this.RouterLink.splice(this.RouterLink.indexOf(tag), 1);
    },
    newname(newVal){
      this.Flag = '';
      
      this.$nextTick(()=>{
        this.RouterLinkType.some((item,index)=>{
          if(item.link == newVal){
            //console.log(333);
            this.Flag = item.name;
            //console.log(item.name,this.Flag,'7777')
            return true
          }
        })
        setTimeout(()=>{
         // console.log(this.Flag,'666')
          return this.Flag
        },300)
        
      })

      
      
    },
		tomoneydetail(row){
			//console.log(row,'row')
			let routeData = this.$router.resolve({ path: '/moneyList/comMoneyDetail', query: {  userId:row.userId} });
			window.open(routeData.href, '_blank');
		}
  },
  watch: {
    '$route.path':function (newVal) {
        //console.log(this.RouterLink,'777');
        if(this.RouterLink.length > 0){
          let Data = this.RouterLink.filter((item,index)=>{
            return item.link == newVal
          })
          if(Data.length == 0){
             this.RouterLinkType.some((item,index)=>{
                if(item.link == newVal){
                  this.RouterLink.push({link:newVal,name:item.name,type:''})
                  return true
                }
             })
          }
        }else{
          this.RouterLinkType.some((item,index)=>{
            if(item.link == newVal){
              this.RouterLink.push({link:newVal,name:item.name,type:''})
              return true
            }
          })
          
        }
        
    } 
  }
}
</script>
<style lang="scss" scoped>
.colorCenter:hover{
  cursor: pointer;
}
.colorCenter{
  margin-left: 3px;
}
  .percenter{
    width: 210px;
    height: 30px;
  }
  .nav-link{
    width: 100%;
    height: 30px;
    background:#84AF9B;
    display: flex;
  }
</style>
