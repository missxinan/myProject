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
        <!--佣金比例-->
        <el-table-column prop="createTime" label="佣金比例" align="center"></el-table-column>
        <!--整个审核状态-->
        <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="getSellerDetail(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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

    <!-- 修改佣金比例dialog-->
    <el-dialog
      title="修改佣金比例"
      :visible.sync="commissionDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <p>请输入1-100的整数</p>
      <el-form ref="commissionForm" :model="commissionForm" :rules="commissionRules" label-width="80px">
        <el-form-item label="佣金比例" prop="commissionRate">
          <el-input v-model="commissionForm.commissionRate"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateRate">确 定</el-button>
<!--          <el-button type="primary" @click="onSubmit">立即创建</el-button>-->
          <el-button @click="commissionDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    var validateRate = (rule, value, callback)=>{
      if(value == ''){
        callback(new Error('佣金比例不能为空'))
      }else{
        let reg = /^([1-9][0-9]{0,1}|100)$/
        if(!reg.test(value)){
          callback(new Error('您输入的格式不正确哦~'))
        }else{
          callback()
        }
      }
    }
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
      isLoading:true,
      commissionDialogVisible: false,
      commissionForm: {
        commissionRate: ''
      },
      commissionRules: {
        commissionRate:[
          {validator: validateRate, trigger: 'blur' }
        ]
      }
    }
  },
  created (){
    this.getList()
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
        console.log(res)
        console.log(this.listQuery)
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
    //点击编辑弹窗修改佣金的dialog
    getSellerDetail(row){
      console.log(row)
      this.commissionDialogVisible = true
      this.commissionForm.commissionRate = row.createTime
    },
    //修改比例
    updateRate(){
      this.$refs.commissionForm.validate(valid=>{
        if(valid){
          console.log('可以发送请求了')
        }else{
          console.log('有问题哦')
        }
      })
      this.commissionDialogVisible = false
    }
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
