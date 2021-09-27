<template>
  <div class="seller-container">
    <div class="seller-header">
      <div class="seller-search">
        <el-input v-model="listQuery.mallName" placeholder="输入店铺名字" style="width: 140px"></el-input>
      </div>
      <div class="seller-search">
        <el-input v-model="listQuery.phone" placeholder="请输入手机号" style="width: 140px"></el-input>
      </div>
      <div class="seller-search">
        <el-date-picker
          v-model="listQuery.createTimeStart"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间"
          @change="getStartTime">
        </el-date-picker>
      </div>
      <div class="seller-search">
        <el-date-picker
          v-model="listQuery.createTimeEnd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束时间"
          @change="getEndTime">
        </el-date-picker>
      </div>
      <div class="seller-search">
<!--        <el-input v-model="listQuery.ratifyStatus" placeholder="状态" style="width: 140px"></el-input>-->
        {{listQuery.ratifyStatus}}
        <el-select v-model="listQuery.ratifyStatus" placeholder="状态">
          <el-option
            v-for="item in statusOption"
            :key="item.key"
            :label="item.status"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>
<!--    卖家店铺列表table-->
    <div class="seller-content">
      <el-table :data="tableData" border style="width: 100%" v-loading="isLoading" max-height="650">
        <el-table-column prop="id" label="店铺ID" width="80px" align="center"></el-table-column>
        <el-table-column prop="userId" label="userId" align="center"></el-table-column>
        <el-table-column prop="mallName" label="商家店铺名称" align="center"></el-table-column>
        <el-table-column prop="deliverAddress" label="发货地址" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="identityNo" label="身份证号" width="180px" align="center"></el-table-column>
        <el-table-column label="店铺类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.mallType == 2">个人卖家</span>
            <span v-if="scope.row.mallType == 3">企业卖家</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="主营类目" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="80px" align="center"></el-table-column>
        <el-table-column prop="mallAddress" label="店铺地址"  width="120px" align="center"></el-table-column>
        <el-table-column prop="returnAddress" label="退货地址" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <!--卖家店铺上传特殊文件审核状态-->
        <el-table-column  label="文件审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.paperStatus == 0" class="primary">不需要上传</span>
            <span v-if="scope.row.paperStatus == 1" class="primary">审核通过</span>
            <span v-if="scope.row.paperStatus == 2" class="warning">待审核</span>
            <span v-if="scope.row.paperStatus == 3" class="danger">资料不足</span>
            <span v-if="scope.row.paperStatus == 4" class="danger">审核失败</span>
            <el-button type="primary" size="mini" @click="toFilesDetail(scope.row)" v-if="scope.row.paperStatus !== 0">查看详情</el-button>
          </template>
        </el-table-column>
        <!--整个审核状态-->
        <el-table-column  label="审核状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.ratifyStatus == 1" class="warning">待审核</span>
            <span v-if="scope.row.ratifyStatus == 2" class="primary">审核通过</span>
            <span v-if="scope.row.ratifyStatus == 3" class="danger">审核拒绝</span>
            <el-button type="primary" size="mini" @click="getSellerDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" align="center">-->
<!--          <template slot-scope="{row}">-->
<!--            <el-button type="primary" size="mini" @click="getSellerDetail(row)">查看详情</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
    {{listQuery.current}}
<!--    分页器部分-->
    <div class="seller-footer">
      <pagination
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        :currentPage="listQuery.current"
        @pagination="getList"
        />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import {fetchSellerStoreList} from "@/api/sellerCenter";
const statusOption = [
  {key: 0, status: '全部', value:''},
  {key: 1, status: '审核中', value: 1},
  {key: 2, status: '审核通过', value: 2},
  {key: 3, status: '审核拒绝', value: 3},
]
export default {
  name: "index",
  data(){
    return {
      //
      listQuery:{
        current: 1,
        size: 10,
      },
      statusOption,
      //请求的table数据 在这里
      tableData:[],
      total: 0,
      isLoading:true
    }
  },
  created (){

    this.getList()

    this.listQuery.current = JSON.parse( sessionStorage.getItem('sellerList') );

    sessionStorage.removeItem('sellerList');


  },
  methods:{
    //点击查询
    handleFilter(){
      this.isLoading = true
      this.getList()
    },
    //获取列表数据
    getList(){
      fetchSellerStoreList(this.listQuery).then(res=>{
        // console.log(res)
        // console.log(this.listQuery)
        this.tableData = res.data.records
        this.total = parseInt(res.data.total)
        this.isLoading = false
      })
    },
    // 时间选择器 获取开始的时间
    getStartTime(startTime){
      this.listQuery.createTimeStart = startTime
    },
    // 时间选择器 获取的结束时间
    getEndTime(endTime){
      this.listQuery.createTimeEnd = endTime
    },
    //点击查看详情 前往卖家店铺详情 ,这里是大审核,通过即卖家通过审核
    getSellerDetail(row){



      sessionStorage.setItem('sellerList',this.listQuery.current);


      this.$router.push({
        path:'/sellerCenter/sellerDetail',
        query: {
          id: row.id,
          userId: row.userId,
          paperStatus: row.paperStatus,
        }
      })
    },
    //点击查看详情  前往审核卖家上传文件的页面, 卖家通过审核之前 必须先审核文件
    toFilesDetail(row){

      this.$router.push({
        path: '/sellerCenter/sellerFileDetail',
        query: {
          userId: row.userId,
          id: row.id
        }
      })
    },
  },
  components:{
    Pagination
  }
}
</script>
<style scoped>
.danger{
  color: #f56c6c;
}
.primary{
  color: #409EFF;
}
.warning{
  color: #E6A23C;
}
.seller-container{
 padding: 20px;
}
.seller-header{
  margin-bottom: 20px;
}
.seller-search{
  display: inline-block;
  margin-right: 20px;
}
</style>
