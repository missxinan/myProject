<template>
  <div class="tip-off-detail">
    <el-card>
      <el-page-header @back="goBack" content="举报商品详情">
      </el-page-header>
    </el-card>
    <!--详情-->
    <el-card class="detail-content">
      <p class="detail-item">
        <span>商品编号:</span>
        <span>{{detailInfo.goodsId}}</span>
      </p>
      <p class="detail-item">
        <span>商品名称:</span>
        <span>{{detailInfo.goodsName}}</span>
      </p>
      <p class="detail-item">
        <span>商品描述:</span>
        <span>{{detailInfo.goodsDesc}}</span>
      </p>
      <p class="detail-item">
        <span>举报人ID:</span>
        <span>{{detailInfo.userId}}</span>
      </p>
      <p class="detail-item">
        <span>类型:</span>
        <span v-if="detailInfo.type==0">商家承认售假</span>
        <span v-if="detailInfo.type==1">其他涉嫌售假场景</span>
        <span v-if="detailInfo.type==2">盗图</span>
        <span v-if="detailInfo.type==3">知识产权侵权</span>
      </p>
      <p class="detail-item">
        <span>举报原因:</span>
        <span v-if="detailInfo.reason == 1">涉嫌售假</span>
        <span v-if="detailInfo.reason==0">分类错误</span>
        <span v-if="detailInfo.reason==2">侵权</span>
        <span v-if="detailInfo.reason==3"> 骚扰/辱骂</span>
        <span v-if="detailInfo.reason==4">外网导购</span>
        <span v-if="detailInfo.reason==5">图文不符</span>
        <span v-if="detailInfo.reason==6">出售违禁品</span>
      </p>
      <p class="detail-item">
        <span>描述:</span>
        <span>{{detailInfo.content}}</span>
      </p>
      <p class="detail-item">
        <span>是否处理:</span>
        <span>{{detailInfo.handle == 0 ? '未处理': '已处理'}}</span>
      </p>
      <p class="detail-item">
        <span>处理结果:</span>
        <span>{{detailInfo.result}}</span>
      </p>
      <p class="detail-item">
        <span>处理时间:</span>
        <span>{{detailInfo.resultTime}}</span>
      </p>
      <div class="detail-item">
        <p class="image">图片:</p>
        <div class="image-container">
          <div class="detail-item demo-image__preview" v-if="srcList" :key="index" v-for="(item, index) in srcList">
            <el-image
              style="width: 200px; height: 200px;margin-left: 50px"
              :src="item"
              :preview-src-list="srcList">
            </el-image>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {fetchTipOffDetail} from "@/api/sellerCenter";

export default {
  data(){
    return {
      id: '',
      detailInfo: {},
      srcList:[]
    }
  },
  created(){
    this.id = this.$route.query.id
    this.getTipOffDetail()
  },
  methods: {
    getTipOffDetail(){
      fetchTipOffDetail({id:this.id}).then(res => {
        console.log(res.data)
        this.detailInfo = res.data

        this.srcList =  res.data.images.split(';')

        // this.srcList.push(res.data.images)
      })
    },
    goBack() {
      this.$router.push('/sellerCenter/goodsTipOffList')
    }
  }
}
</script>

<style scoped>
.tip-off-detail{
padding: 20px;
}
/deep/ .el-page-header__title{
  font-size: 18px;
}
/deep/ .el-page-header__content{
  font-size: 24px;
  font-weight: bold;
}
.detail-content{
  margin-top: 20px;
}
.detail-item{
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 18px;
  font-weight: bold;
}
.detail-item > span:nth-of-type(1){
  width: 100px;
}
.detail-item > span:nth-of-type(2){
  flex: 1;
  padding-left: 100px;
  font-size: 16px;
}
.image{
  font-weight: bold;
  font-size: 18px;
  width: 100px;
}
.image-container{
  display: flex;
  flex-wrap: wrap;
}
</style>
