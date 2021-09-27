<template>
<div class="container">
    <div class="out-line">
        <div class="Flex">
            <div class="ax_200">
                <span class="shoppingnames">商品名称:</span>
                <p class="shoppingname">{{obj.goodsName}}</p>
            </div>
            <div class="ax_200">
                <span>分类:</span>
                <p>{{obj.categoryName}}</p>
            </div>
            <div class="ax_200">
                <span>来源:</span>
                <p v-if="obj.source === 1">商城</p>
                <p v-if="obj.source === 2">平台</p>
                 <p v-if="obj.source === 3">旗舰店</p>
            </div>
            <div class="ax_200" v-if="obj.status === 4 || obj.status === 5 || obj.status === 6">
                <span>交割价:</span>
                <p>{{obj.transactionPrice}}</p>
            </div>
            <div class="ax_200">
                <span>起拍价:</span>
                <p>{{obj.startPrice}}</p>
            </div>
            <div class="ax_200">
                <span>机器人：</span>
                <p v-if="obj.openRobot == 0">关闭</p>
                <p v-if="obj.openRobot == 1">开启({{obj.protectPrice}}-{{obj.maxProtectPrice}})</p>
            </div>
            <div class="ax_200">
                <span>加价幅度:</span>
                <p>{{obj.markupPrice}}</p>
            </div>
            <div class="ax_200">
                <span>佣金:</span>
                <p>{{obj.brokerage}}</p>
            </div>
            <div class="ax_200" style="width:33%">
                <span>拍卖时间:</span>
                <p>{{obj.startTime}}~{{obj.endTime}}</p>
            </div>
        </div>
        <div class="title">
            <div class="box" v-if="obj.status === 1">待上架</div>
            <div class="box" v-if="obj.status === 2">预展</div>
            <div class="box" v-if="obj.status === 3">竞拍中</div>
            <div class="box" v-if="obj.status === 4">已售</div>
            <div class="box" v-if="obj.status === 5">已流拍</div>
            <div class="box" v-if="obj.status === 6">下架</div>
            <div class="box" v-if="obj.status === 7">已关闭</div>
        </div>
    </div>
    <div>
        <div v-if="flag">
            <div class="selllist">
                    <div class="selllist_box">
                    <div class="sellbox_small_head marginTop">
                        <span>{{time.endTime}}</span>
                        <span>截拍</span>
                    </div>
                    <div class="sellbox_list">

                        <div class="sellevery" v-for="(item,index) in list" :key="index">
                        <dl class="sellevery_dl">
                            <dt><img :src="item.avatar" alt="图片报错" class="Dis"></dt>
                            <dd>
                            <div>
                                <!-- <span><img :src="item.avatar" alt="图片报错"></span> -->
                                <span>{{item.userName}}</span>
                                
                            </div>
                            <div>
                                <span>{{item.markupTime}}</span>
                                <span>出价</span>
                            </div>
                            </dd>
                        </dl>
                        <div class="sellevery_price"> 
                            <div class="fontweightbig">￥<span>{{item.payPrice}}</span></div>
                            <div>保证金: <span>{{item.guarantyPrice}}</span></div>
                        </div>
                        
                            <div class="position_zd" v-if="item.userType === 2"><div v-if="item.userType === 2">自动</div> </div>
                            </div>
                        
                        
                    </div>
                    <div class="sellbox_small_head">
                        <span>{{time.startTime}}</span>
                        <!-- <span>16:00</span> -->
                        <span>起拍</span>
                    </div>
                    <div class="reload_button" @click="reaload">
                        刷新
                    </div>
                    </div>
                </div>
        </div>
        <div v-else>
            <p class="content">
                <span>出价总次数:{{data.total}}</span>
                <span>用户出价次数:{{Totalnumberofuserbids}}</span>
            </p>
            <!-- 将来的动态data值 -->
            <el-table
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            >
            <el-table-column align="center" label="出价时间" width="95">
                <template slot-scope="scope">{{ scope.row.markupTime }}</template>
            </el-table-column>
            <el-table-column label="竞价ID">
                <template slot-scope="scope">{{ scope.row.auctionDetailId }}</template>
            </el-table-column>
            <el-table-column label="类型" align="center">
                <template slot-scope="scope">
					{{scope.row.userType === 1?'用户':'自动'}}
                </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
                {{ obj.goodsName }}
            </el-table-column>
            <el-table-column label="参与用户" align="center">
                <template slot-scope="scope">
                 {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column label="出价金额" align="center">
                <template slot-scope="scope">{{ scope.row.payPrice }}</template>
            </el-table-column>
            <el-table-column label="保证金" align="center">
                <template slot-scope="scope">{{ scope.row.guarantyPrice}}</template>
            </el-table-column>
            </el-table>
        </div>
        <pagination
                v-show="total>0"
                :total="total"
                :limit.sync="listQuery.limit"
                :page.sync="listQuery.page"
                @pagination="getList"
        />
    </div>
</div>
    
</template>

<script>
import { auctionRecordInfodetail,ByAuctionId,} from "@/api/AuctionsRecord";
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";
export default {
	name:'auctionsRecordDetail',
components: { Pagination },
data() {
    return {
        list : [],
        obj : {},
        flag : false,
        data:{},
        datalist:[],
        Totalnumberofuserbids:0,
        tableData: [],
        time:{
            startTime:'',
            endTime:''
        },
        total: 1,
        listQuery: {
            page: 1,
            limit: 10,
            importance: undefined,
            title: undefined,
            type: undefined
        },
        listLoading:false
    }
},
methods: {
    reaload(){
        this.getList();
    },
    getList(){
        this.listLoading = true;
        auctionRecordInfodetail({current: this.listQuery.page,
            size: this.listQuery.limit,auctionId:this.$route.query.auctionId}).then((res)=>{
                switch(res.data.status){
                    case 1 : this.flag = true;
                    break
                    case 2 : this.flag = true;
                    break
                    case 3 : this.flag = true;
                    break
                    case 4 : this.flag = false;
                    break
                    case 5 : this.flag = false;
                    break
                    case 6 : this.flag = false;
                    break
                    default: this.flag = true;
                }
                this.obj = res.data;
                this.time.startTime = res.data.startTime;
                this.time.endTime = res.data.endTime;
                // console.log(res,'555');
                console.log(res)
                
        })

        ByAuctionId({current: this.listQuery.page,
            size: this.listQuery.limit,auctionId:this.$route.query.auctionId}).then((res)=>{
            this.data = res.data.iPage;
            this.datalist = res.data.iPage.records;
            this.list = res.data.iPage.records;
            this.Totalnumberofuserbids = res.data.userCount;
            this.total = Number(res.data.iPage.total);
            this.listLoading = false;
        })
    },
     
},
created() {
    this.listLoading = true;
    auctionRecordInfodetail({current: this.listQuery.page,
            size: this.listQuery.limit,auctionId:this.$route.query.auctionId}).then((res)=>{
                // console.log(res,'777')
        switch(res.data.status){
            case 1 : this.flag = true;
            break
            case 2 : this.flag = true;
            break
            case 3 : this.flag = true;
            break
            case 4 : this.flag = false;
            break
            case 5 : this.flag = false;
            break
            case 6 : this.flag = false;
            break
            default: this.flag = true;
        }
        this.obj = res.data;
        this.time.startTime = res.data.startTime;
        this.time.endTime = res.data.endTime;
    })
    ByAuctionId({auctionId:this.$route.query.auctionId}).then((res)=>{
        console.log(res,'999999');
        this.data = res.data.iPage;
        this.datalist = res.data.iPage.records;
        this.list = res.data.iPage.records;
        this.Totalnumberofuserbids = res.data.userCount;
        this.total = Number(res.data.iPage.total);
        this.listLoading = false;
        console.log(this.data.total,this.Totalnumberofuserbids)
    })
},
}
</script>

<style lang="scss" scoped>
.container{
	padding: 20px;
}
.shoppingname{
    height: 35px;
    width: 115px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.shoppingnames{
    width: 75px;
}
.Dis{
    width: 50px;
    height: 50px;
    background: gray;
    border-radius: 50%;
}
.content{
    width: 100%;
    height: 20px;
    display: flex;
}
.content span{
    display: inline-block;
    margin-left: 20px;
}
.marginTop{
    margin-top: 20px;
}
.selllist {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #f3f3f3;
  position: relative;
  .selllist_box {
      background: white;
    width: 100%;
    height: 500px;
    margin: 0 auto;
    padding: 15px 30px;
    border: 1px solid rgb(224, 219, 219);
    border-radius: 10px;
    overflow-y: scroll;
    .sellbox_small_head {
      width: 950px;
      height: 50px;
      line-height: 50px;
      color: #666666;
      padding: 0 30px;
      border-radius: 10px;
      border: 1px solid rgb(224, 219, 219);
    }
    .sellevery {
      width: 950px;
      height: 100px;
      border-radius: 10px;
      border: 1px solid rgb(224, 219, 219);
      margin-top: 15px;
      padding: 0 30px;
       color: #666666;
       position: relative;
       overflow: hidden;
      .sellevery_dl {
        display: flex;
        width: 50%;
        dt {
          width: 50px;
          height: 50px;
          background: gray;
          border-radius: 50%;
          margin-top: 20px;
        }
        dd {
          flex: 1;
          margin-left: 25px;
           margin-top: 20px;
           font-size:  15px;
          div{
              line-height: 30px;
          }
        }
      }
      .sellevery_price{
          position: absolute;
          right: 50px;
          bottom: 0;
          div{
              line-height: 35px;
          }
          .fontweightbig{
              font-size: 20px;
              color: black;
          }
      }
      .position_zd{
          width: 200px;
          height: 100px;
          position: absolute;
          background: #ffffcd;
          left: -10px;
          top: 80px;
          transform:rotate(10deg);
          padding-left: 30px;
          line-height: 10px;
          div{
              transform:rotate(-10deg);
          }
      }
    }
  }
  .reload_button{
      position: absolute;
     
      height: 50px;
      right: 100px;
      line-height: 50px;
      padding:  0 30px;
      top: 60px;
       border-radius: 10px;
      border: 1px solid rgb(224, 219, 219);
      text-align: center;
       color: #666666;
  }
}
.box{
    width: 200px;
    height: 50px;
    border: 1px solid #ccc;
    // background: green;
    transform: rotate(21deg);
    margin-left: 39px;
    margin-top: 40px;
    text-align: center;
    line-height: 50px;
}
.ax_200{
    width: 21%;
    height: 7px;
    margin-left: 4px;
    margin-top: -5px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    }
.ax_200 span{
    line-height: 50px;
}
.out-line{
    width: 100%;
    height: 135px;
    // background: red;
    display: flex;
    border-bottom: 1px solid #ccc;
}
.title{
    width: 20%;
    height: 100%;
    // background: orange;
}
.Flex{
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    height: 100%;
    border-right: 1px solid #ccc;
    // background: green;
}
</style>
