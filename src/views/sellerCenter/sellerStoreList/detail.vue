<template>
  <div class="seller-container">
    <!--卖家店铺信息-->
    <div class="seller-header">
      <h2>卖家信息</h2>
      <el-card class="seller-discription">
        <el-row :gutter="20">
          <el-col class="avatar-content">
            <span>店铺头像:</span>
            <div class="seller-avatar">
              <div class="demo-image__preview">
                <el-image :preview-src-list="srcList" :src="srcList[0]" v-if="srcList[0]"></el-image>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>真实姓名:</span>
            <span>{{sellerInfo.realName}}</span>
          </el-col>
          <el-col :span="3">
            <span>手机号:</span>
            <span>{{sellerInfo.phone}}</span>
          </el-col>
          <el-col :span="4">
            <span>身份证: </span>
            <span>{{sellerInfo.identityNo}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>店铺名称:</span>
            <span>{{sellerInfo.mallName}}</span>
          </el-col>
          <el-col :span="3">
            <span>店铺类型:</span>
            <span>{{mallType}}</span>
          </el-col>
          <el-col :span="3">
            <span>主营类目:</span>
            <span>{{sellerInfo.categoryName}}</span>
          </el-col>
          <el-col :span="3">
            <span>店铺地址:</span>
            <span>{{sellerInfo.mallAddress}}</span>
          </el-col>
          <el-col :span="12">
            <span>商家介绍:</span>
            <span>{{sellerInfo.mallExplain}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <span>发货地址:</span>
            <span>{{sellerInfo.deliverAddress}}</span>
          </el-col>
          <el-col :span="11">
            <span>退货地址:</span>
            <span>{{sellerInfo.returnAddress}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>创建时间:</span>
            <span>{{sellerInfo.createTime}}</span>
          </el-col>
          <el-col :span="11">
            <span>认证年费到期时间:</span>
            <span>{{sellerInfo.expireTime}}</span>
          </el-col>
          <el-col :span="3">
            <span>状态:</span>
            <span class="check-Status" :class="{'warning': isWarning, 'danger': isDanger}">{{ratifyStatus}}</span>
          </el-col>
          <el-col :span="6">
            <div v-if="checkPermission(['sellerDetail:store:pass'])">
              <el-button type="primary" @click="checkPass" >审核通过</el-button>
              <el-button type="danger" @click="checkRefuse">审核拒绝</el-button>
              <el-button type="primary" @click="toCheckFile" v-if="$route.query.paperStatus">前往文件审核页</el-button>
            </div>
          </el-col>
        </el-row>

<!--        refuse Reason-->
        <div style="width: 300px; height: 200px; position: absolute; right: 40px; top: 100px;">
          <h2>拒绝原因</h2>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            maxlength="15"
            show-word-limit
            :disabled="this.sellerInfo.ratifyStatus == 3 || this.sellerInfo.ratifyStatus == 2"
            v-model="refuseReason">
          </el-input>
        </div>
      </el-card>
    </div>

    <!--认证年费缴纳信息-->
    <div class="seller-pay">
      <h2>认证年费缴纳信息</h2>
      <el-card class="seller-pay-info" v-if="payInfo">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>支付订单ID:</span>
            <span>{{payInfo.tradeNo ? payInfo.tradeNo: '未知'}}</span>
          </el-col>
          <el-col :span="4">
            <span>用户ID:</span>
            <span>{{payInfo.userId ? payInfo.userId :'未知'}}</span>
          </el-col>
          <el-col :span="4">
            <span>支付来源:</span>
            <span>{{payInfo.paySource == 1 ? '微信小程序' : 'app'}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>缴费付款标识:</span>
            <span v-if="payInfo.sign == 1">认证年费</span>
            <span v-if="payInfo.sign == 2">店铺保证金</span>
            <span v-if="payInfo.sign == 3">拍品保证金</span>
            <span v-if="payInfo.sign == 4">拍品报名费</span>
          </el-col>
          <el-col :span="4">
            <span>支付方式:</span>
            <span v-if="payInfo.type == 1 ">余额</span>
            <span v-if="payInfo.type == 2 ">微信</span>
            <span v-if="payInfo.type == 3 ">支付宝</span>
            <span v-if="payInfo.type == 4 ">店铺账户</span>
          </el-col>
          <el-col :span="4">
            <span>备注信息:</span>
            <span>{{payInfo.remark}}</span>
          </el-col>
          <el-col :span="4">
            <span>支付状态:</span>
            <span v-if="payInfo.status == 0 ">待支付</span>
            <span v-if="payInfo.status == 1 ">已支付</span>
            <span v-if="payInfo.status == 2 ">已退款</span>
            <span v-if="payInfo.status == 3 ">已取消</span>
          </el-col>
          <el-col :span="4">
            <span>支付金额:</span>
            <span>{{payInfo.price}}</span>
          </el-col>
        </el-row>
      </el-card>
      <h3 v-else>无信息</h3>
    </div>

    <!--证件资料部分-->
    <div class="seller-info">
      <h2>证件资料</h2>
      <el-card class="certification-card">
        <el-card class="identity-card">
          <span>身份证正面</span>
          <div class="demo-image__preview">
            <el-image :preview-src-list="srcList" :src="srcList[1]" v-if="srcList[1]"></el-image>
          </div>
        </el-card>
        <el-card class="identity-card" style="text-align: center">
          <span>身份证反面</span>
          <div class="demo-image__preview">
            <el-image :preview-src-list="srcList" :src="srcList[2]" v-if="srcList[2]"></el-image>
          </div>
        </el-card>
        <el-card class="identity-card" style="text-align: center">
          <span>{{this.sellerInfo.mallType == 2 ? '手持身份证': '企业资质'}}</span>
          <div class="demo-image__preview">
            <el-image :preview-src-list="srcList" :src="srcList[3]" v-if="srcList[3]"></el-image>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import {fetchSellerDetail,SellerRatify} from '@/api/sellerCenter'
import checkPermission from "@/utils/permission";
export default {
  name: "detail",
  data(){
    return {
      id: 0,
      userId: '',
      //卖家信息
      sellerInfo: {},
      isWarning: false,
      isDanger: false,
      //店铺类型
      mallType:'',
      //审核状态
      ratifyStatus: '',
      //审核通过
      passStatus: 2,
      //审核拒绝状态
      refuseStatus: 3,
      //拒绝原因
      refuseReason: '',
      //认证年费缴纳信息
      payInfo: {},
      //大图列表
      srcList: []
    }
  },
  created() {
    // console.log(this.$route.query.id);
    this.id = this.$route.query.id
    this.userId = this.$route.query.userId
    // console.log(this.userId);
    this.getSellerDetail()
  },
  methods:{
    // 获取当前卖家店铺详情
    getSellerDetail(){
      fetchSellerDetail({id:this.id}).then(res=>{
        this.sellerInfo = res.data
        console.log(this.sellerInfo)
        this.payInfo = res.data.payInfo[0]
        this.judgeStatus()
        // 获取拒绝原因
        this.refuseReason = this.sellerInfo.refuseReason || '';

        this.srcList.push(this.sellerInfo.avatar);
        this.srcList.push(this.sellerInfo.frontImage);
        this.srcList.push(this.sellerInfo.backImage);
        this.mallType == '个人卖家' ? this.srcList.push(this.sellerInfo.holdImage) : this.srcList.push(this.sellerInfo.licenseImage)
        // console.log(this.srcList);
      })
    },
    // 判断 店铺类型 和 审核状态
    judgeStatus(){
      this.mallType = this.sellerInfo.mallType == 3? '企业卖家' :'个人卖家'
      switch (this.sellerInfo.ratifyStatus) {
        case 1:
          this.ratifyStatus = '待审核';
          this.isWarning = true
          break;
        case 2:
          this.ratifyStatus = '审核通过';
          break;
        case 3:
          this.ratifyStatus = '审核拒绝';
          this.isWarning = false
          this.isDanger = true
          break;
      }
    },
    // 审核通过
    checkPass(){
      this.$confirm('您确定要通过吗？', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        //发送请求
        SellerRatify({id: this.id, ratifyStatus: this.passStatus}).then(res=>{
         console.log(res)
          if(!res.code){
            this.$message({
              type:'success',
              message: res.data
            })
            return location.reload()
          }
          this.$message({
            type:'warning',
            message:res['msg']
          })
        })
        //审核通过 刷新页面
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 审核拒绝
    checkRefuse(){
      // 如果文本域为空  提示输入
      if(!this.refuseReason){
        return this.$alert('请输入拒绝原因哦~', '警告', {
          confirmButtonText: '确定'
        })
      }
      SellerRatify({id: this.id, ratifyStatus: this.refuseStatus, refuseReason: this.refuseReason}).then(res=>{
        console.log(res);
        if(!res.code){
          this.$message({
            type:'success',
            message: res.data
          })
          return location.reload()
        }
        this.$message({
          type:'warning',
          message:res['msg']
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 前往文件审核页面
    toCheckFile(){
      this.$router.push({
        path: '/sellerCenter/sellerFileDetail',
        query: {
          id: this.id,
          userId: this.userId
        }
      })
    },
    checkPermission
  }
}
</script>

<style scoped>
.warning{
  color: #E6A23C !important;
}
.danger{
  color: #F56C6C !important;
}
span{
  color: #595959;
}
.seller-container{
  padding: 20px;
  background-color: #F0F2F5;
  font-size: 14px;
}
.seller-header > h2{
  padding: 0 20px;
}
.el-row{
  margin-bottom: 30px;
}
.seller-discription{
  position: relative;
}
.avatar-content{
  display: flex;
  align-items: center;
}
.seller-avatar{
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-left: 10px;
  border-radius: 10px;
  overflow: hidden;
}
.seller-avatar  .el-image{
  width: 100px;
  height: 100px;
}

.check-Status{
  font-size: 28px;
  font-weight: bold;
}
.identity-card{
  display: inline-block;
  width: 300px;
  height: 300px;
  padding: 20px;
  margin: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;

}
.identity-card  .el-image {
  width: 200px;
  height: 200px;
  margin-top: 10px;
}
.el-row{
  line-height: 40px;
}
.el-col{
  display: flex;
}
.el-col > span:nth-of-type(2){
  color: #409EFF;
  padding-left: 15px;
}
</style>
