<template>
  <div class="tip-off-container">
    <h2>举报卖家店铺列表</h2>
    <div class="tip-off-content">
      <el-table
        :data="tipOffList"
        border
        style="width: 100%"
        max-height="650">
        <el-table-column prop="goodsId" label="商品编号" width="180" align="center"></el-table-column>
        <el-table-column prop="userId" label="举报人ID" width="180" align="center"></el-table-column>
        <el-table-column prop="reason" label="举报原因"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.reason==0">分类错误</span>
            <span v-if="scope.row.reason==1">涉嫌售假</span>
            <span v-if="scope.row.reason==2">侵权</span>
            <span v-if="scope.row.reason==3"> 骚扰/辱骂</span>
            <span v-if="scope.row.reason==4">外网导购</span>
            <span v-if="scope.row.reason==5">图文不符</span>
            <span v-if="scope.row.reason==6">出售违禁品</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type==0">商家承认售假</span>
            <span v-if="scope.row.type==1">其他涉嫌售假场景</span>
            <span v-if="scope.row.type==2">盗图</span>
            <span v-if="scope.row.type==3">知识产权侵权</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="描述" align="center"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="goodsDesc" label="商品描述" align="center"></el-table-column>
        <el-table-column label="图片" width="200" align="center">
          <template slot-scope="scope">
<!--            <img :src="scope.row.images" alt="" style="height: 200px">-->
            <div class="demo-image__preview">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.images.split(';')[0]"
                :preview-src-list="srcList">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="handle" label="是否处理" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.handle == 0 ? '未处理' : '已处理'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="处理结果" align="center"></el-table-column>
        <el-table-column prop="resultTime" label="处理时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="goDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页器-->
    <div class="tip-off-pagination">
      <pagination
        :total="total"
        :page.sync="current"
        :limit.sync="size"
        :currentPages="current"
        @pagination="getList"></pagination>
    </div>
  </div>
</template>

<script>
import {fetchTipOffList} from "@/api/sellerCenter";
import Pagination from "@/components/Pagination"
export default {
  name: "index",
  data(){
    return {
      current: 1,
      size: 10,
      tipOffInfo: '',
      tipOffList: [],
      // 总数
      total: 0,
      srcList: []
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList (){
      let data = {size: this.size ,current: this.current}
      fetchTipOffList(data).then(res => {
        console.log(res)
        //每次点击其他页的时候 清空srcList
        this.srcList = []
        //获取数据{}
        this.tipOffInfo = res.data
        //table中每一项[]
        this.tipOffList = res.data.records
        //总条数 转成number类型
        this.total = parseInt(res.data.total)
        //第x页 转成number类型
        this.current= parseInt(res.data.current)

        // 将返回过来的数组中的每一项image 放到srcList中 , 因为一项返回有多张图片, 因为后端返回过来的是通过;拼接的多个imgUrl 这里需要处理一下
        res.data.records.forEach((item, index) => {
          if(item.images.indexOf(';') >= 0){
            // 这里只将第一张放在列表页中展示用, 其他一起放到详情中展示
            this.srcList.push(item.images.split(';')[0])
          }else{
            // 如果只有一张图  那么push到srcList中就好了
            this.srcList.push(item.images)
          }
        })
      })

    },
    goDetail(_id){
      this.$router.push({
        path: '/sellerCenter/goodsTipOffDetail',
        query:{
          id : _id
        }
      })
    }
  },
  components:{
    Pagination
  }
}
</script>

<style scoped>
.tip-off-container{
  padding: 20px;
}
</style>
