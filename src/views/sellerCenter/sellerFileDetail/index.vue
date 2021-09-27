<template>
  <div class="seller-file-container">
    <div class="seller-flie-list" v-if="fileInfo.length > 0">
      <el-button type="primary" @click="allPass">一键通过</el-button>
      <el-button type="danger" @click="allRefuse">一键拒绝</el-button>
      <div>
        <h2 v-if="fileInfo[0].specialType == 1">茶酒滋补(1.食品许可证 2.假一赔三承诺书)</h2>
        <h2 v-if="fileInfo[0].specialType == 2">奢侈品(1.线下门店照片 2.假一赔三承诺书 3.假一赔三承诺书 4.鉴定师劳动关系证明 5.授权证明（一手需提供）)</h2>
        <h2 v-if="fileInfo[0].specialType == 3">皮具(1.品牌授权书或商标注册证 2.检测报告)</h2>
        <h2 v-if="fileInfo[0].specialType == 4">金器(1.品牌授权书或商标注册证 2.品牌加盟或直营合同)</h2>
      </div>
      <!-- <div class="seller-file-item" v-for="(item, index) in fileInfo" :key="index">
        <div class="seller-info-header">
          <span>审核状态</span>
          <span v-if="item.paperStatus == 0" class="warning">未审核</span>
          <span v-if="item.paperStatus == 1" class="primary">审核通过</span>
          <span v-if="item.paperStatus == 2" class="danger">审核不通过</span>
        </div>
        <div class="table">
          <template>
            <el-table :data="[item]" border style="width: 100%">
              <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
              <el-table-column align="center" prop="createBy" label="创建人" width="100"></el-table-column>
              <el-table-column
                  align="center"
                  prop="updateTime"
                  label="更新时间"
                  width="auto">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="updateBy"
                  label="更新人"
                  width="100">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="paperType"
                  label="文件类型">
                <template>
                  <span v-if="item.paperType == 1">食品许可证</span>
                  <span v-if="item.paperType == 2">假一赔三承诺书</span>
                  <span v-if="item.paperType == 3">线下门店照片</span>
                  <span v-if="item.paperType == 4">鉴定师奢侈品鉴定证书</span>
                  <span v-if="item.paperType == 5">鉴定师劳动关系证明</span>
                  <span v-if="item.paperType == 6">授权证明（一手需提供）</span>
                  <span v-if="item.paperType == 7">品牌授权书/商标注册证</span>
                  <span v-if="item.paperType == 8">检测报告</span>
                  <span v-if="item.paperType == 9">品牌加盟或直营合同</span>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="reason"
                  label="拒绝原因">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="reason"
                  label="文件图片">
                <template>
                  <div class="demo-image__preview">
                    <el-image :preview-src-list="srcList" :src="srcList[index]" v-if="srcList[index]"></el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="checkPass(item.id)" >审核通过</el-button>
                  <el-button type="danger" @click="checkRefuse(item.id)">审核拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div> -->
			<div class="seller-file-item" v-for="(item, index) in arr" :key="index">
        <div class="seller-info-header">
          <span>审核状态</span>
          <span v-if="item.paperStatus == 0" class="warning">未审核</span>
          <span v-else-if="item.paperStatus == 1" class="primary">审核通过</span>
          <span v-else-if="item.paperStatus == 2" class="danger">审核不通过</span>
					<span v-else>未提交</span>
        </div>
        <div class="table">
          <template>
            <el-table :data="[item]" border style="width: 100%">
              <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
              <el-table-column align="center" prop="createBy" label="创建人" width="100"></el-table-column>
              <el-table-column
                  align="center"
                  prop="updateTime"
                  label="更新时间"
                  width="auto">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="updateBy"
                  label="更新人"
                  width="100">
              </el-table-column>
              <el-table-column
                  align="center"
                  label="文件类型">
                <template>
                  <span v-if="item.paperType == 1">食品许可证</span>
                  <span v-if="item.paperType == 2">假一赔三承诺书</span>
                  <span v-if="item.paperType == 3">线下门店照片</span>
                  <span v-if="item.paperType == 4">鉴定师奢侈品鉴定证书</span>
                  <span v-if="item.paperType == 5">鉴定师劳动关系证明</span>
                  <span v-if="item.paperType == 6">授权证明（一手需提供）</span>
                  <span v-if="item.paperType == 7">品牌授权书/商标注册证</span>
                  <span v-if="item.paperType == 8">检测报告</span>
                  <span v-if="item.paperType == 9">品牌加盟或直营合同</span>
                  {{item.id}}
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="reason"
                  label="拒绝原因">
              </el-table-column>
              <el-table-column
                  align="center"
                  label="文件图片">
                <template>
                  <div class="demo-image__preview">
                    <el-image :preview-src-list="srcList" :src="srcList[index]" v-if="srcList[index]"></el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="checkPass(item.id)" >审核通过</el-button>
                  <el-button type="danger" @click="checkRefuse(item.id)">审核拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>

    <div v-else>
      <h2>
        该店铺类型不需要文件审核或还未上传资料
      </h2>
    </div>
<!--    <div class="toSellerCheck" style="text-align: right">-->
<!--      <el-button type="primary" @click="toSellerCheck()">前往店铺审核</el-button>-->
<!--    </div>-->
    <el-dialog
        title="拒绝原因"
        :visible.sync="dialogRefuseVisible"
        width="30%"
        @close="refuseReason=''"
    >
      <el-input
          placeholder="请输入内容"
          v-model="refuseReason"
          clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuseVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRefuse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {fetchSellerFileDetail ,SellerFileRatify} from "@/api/sellerCenter";

// 定义特殊类目所需要的的资料 @specialType 特殊类型, @paperType 所需文件类型
const specialTypeList = [
	// 茶酒滋补
	{specialType: 1, paperType: [1, 2]},
	// 奢侈品
	{specialType: 2, paperType: [3, 2, 4, 5, 6]},
	// 皮具
	{specialType: 3, paperType: [7, 8]},
	// 金器
	{specialType: 4, paperType: [7, 9]},
]
export default {
  data(){
    return {
      userId: '',
      id: '',
      fileInfo: [],
      sellerInfo: {},
      //el-image需要的图片列表
      srcList: [],
      refuseReason: '',
      //审核拒绝dialog
      dialogRefuseVisible: false,
      //拒绝文件的id
      refuseId: '',
			specialTypeList,
			currentItem: {},
			arr:[],
      currentIdArr: [],
      allRefuseType: 0
    }
  },
  created(){
    this.userId = this.$route.query.userId
    this.id = this.$route.query.id
    // console.log(this.userId)
    this.fetchFileDetail()
  },
  methods:{
    fetchFileDetail(){
      let data = {userId: this.userId}
      fetchSellerFileDetail(data).then(res=>{
        this.fileInfo = res.data
        console.log(res.data)
        this.srcList = []
        // this.sellerInfo = this.fileInfo[0].specialType
        // 将定义好的specialTypeList 和请求的其中一项做对比, 返回specialTypeList中的匹配的一项
				let matchList = this.specialTypeList.filter((item, index)=>{
					return item.specialType == this.fileInfo[0].specialType
				})
        console.log(matchList);

        // 让currentIten 为当前匹配项的paperType,如 [1, 3, 6]
        this.currentItem = matchList[0].paperType

				// console.log('currentItem', this.currentItem)
				this.arr =this.currentItem.map(item =>{
					return {'paperType': item}
				})
        //将currentItem通过映射 返回arr数组[{'paperType': 1}, {'paperType': 3}, {'paperType': 6}]
				// console.log(this.arr)

        //然后进行循环 如果arr中paperType值等于请求过来的paperType值, 那么请求过来的那一项直接赋值给arr当前这一项
				for(let i = 0; i < this.fileInfo.length; i++){
					for(let j = 0; j < this.arr.length; j++){
						if(this.arr[j].paperType == this.fileInfo[i].paperType){
							// console.log(11)
							this.arr[j] = this.fileInfo[i]
						}
					}
				}
				// console.log(this.arr)

        res.data.forEach(item=>{
          this.currentIdArr.push(item.id)
        })
        console.log(this.currentIdArr)

				// this.currentItem = a[0]


				// console.log(this.currentItem)

        // console.log(this.fileInfo)
        // let newFileInfo = this.currentItem.paperType
				// for(let i = 0; i < newFileInfo.length; i++){
				// 	newFileInfo[i] = {paperType: newFileInfo[i]}
				// }


				// this.currentItem.paperType.forEach((item, index) =>{
				// 	for(let i = 0; i < this.fileInfo.length; i++){
				// 		if(item.paperType == this.fileInfo[i].paperType){
				// 			newFileInfo[index] = this.fileInfo[i]
				// 		}
				// 	}

				// })
				// console.log(newFileInfo)


				// 先生成 el-image 的图片列表
        this.fileInfo.forEach((item, index) => {
          this.srcList.push(item.paperImage)
        })
      }).catch(err=>{
        console.log(err)
      })
    },

    checkPass(status){
      console.log('点击了审核通过')
      this.$confirm('您确定要通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(()=>{
        let paperStatus = 1;
        let data = {id:status, paperStatus}
        SellerFileRatify(data).then(res => {
          console.log(res)
          if(res.code == 1){
            return this.$message({
              type:'error',
              message: '该用户还未提交资料'
            })
          }
          this.fetchFileDetail()
        }).catch(err => {
          console.log(err)
        })
      }).catch(()=>{
        this.$message({
          type:'warning',
          message:'您已取消~'
        })
      })
    },
    //点击审核拒绝 弹出拒绝原因的dialog框
    checkRefuse(_id){
      this.dialogRefuseVisible = true
      this.refuseId = _id
      this.allRefuseType = 0
    },
    //点击确认框  输入原因 确定拒绝
    confirmRefuse(){
      if(!this.refuseReason){
        return this.$message({
          type: 'error',
          message: '请填写拒绝原因'
        })
      }
      //请求接口 确定拒绝
      if(this.allRefuseType){
        let paperStatus = 2;
        for(let i = 0; i < this.currentIdArr.length; i++){
          SellerFileRatify({id:this.currentIdArr[i], paperStatus, reason: this.refuseReason}).then(res=>{
            if(i == this.currentIdArr.length - 1){
              this.$message({
                type:'success',
                message:'拒绝成功~'
              })
              this.fetchFileDetail()
              this.currentIdArr = []
              this.dialogRefuseVisible = false
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }else{
        let data = {id: this.refuseId, paperStatus:2,reason: this.refuseReason}
        SellerFileRatify(data).then(res => {
          console.log(res)
          this.dialogRefuseVisible = false
          if(res.code == 1){
            return this.$message({
              type: 'error',
              message: '该用户还未提交资料'
            })
          }
          this.fetchFileDetail()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    //前往店铺审核页面
    toSellerCheck(){
      console.log(1)
      console.log(this.$route);
      this.$router.push({
        path: '/sellerCenter/sellerDetail',
        query: {
          id: this.id,
          userId: this.userId
        }
      })
    },
    //一键通过
    allPass(){
      console.log(1)
      let paperStatus = 1;
      for(let i = 0; i < this.currentIdArr.length; i++){
        SellerFileRatify({id:this.currentIdArr[i], paperStatus}).then(res=>{
          if(i == this.currentIdArr.length - 1){
            this.$message({
              type:'success',
              message:'成功~'
            })
            this.currentIdArr = []
            this.fetchFileDetail()
          }
        })
      }
    },
    // 一键拒绝
    allRefuse(){
      this.dialogRefuseVisible = true
      this.allRefuseType = 1
      console.log(2)

    }
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
.primary{
  color: #409EFF !important;
}
.seller-file-container{
  padding: 20px;
  background-color: #FFF;
}

.seller-file-item{
  margin-bottom: 20px;
}

.seller-info-header{
  display: flex;
  padding: 30px;
  margin-bottom: 20px;
  width: 100%;
  justify-content: space-between;
  background-color: #F5F5F6;
  font-size: 24px;
  font-weight: bold;

}
.toSellerCheck{
  font-size: 30px;
}


span{
  color: #595959;
}
</style>
