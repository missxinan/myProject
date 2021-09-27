<template>
  <div class="add-container" style="padding: 20px">
    <el-form ref="form" :model="form"  :rules="rules" label-width="80px">
      <el-card>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入标题，标题需5-30字"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="form.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item label="商品类目" prop="subCategoryId">
          <el-cascader
            v-model="currentCategory"
            :options="categoryList"
            :props="optionProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
<!--        {{categoryList}}-->
      </el-card>
      <el-card>
        <h2>拍品参数(选填)</h2>
        <el-form-item label="尺寸">
          <el-input v-model="form.goodsSize" placeholder="10cm*20cm*5cm"></el-input>
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="form.goodsMate" placeholder="金丝楠木"></el-input>
        </el-form-item>
        <el-form-item label="瑕疵">
          <el-input v-model="form.goodsFlaw" placeholder="无"></el-input>
        </el-form-item>
        <el-form-item label="年代">
          <el-input v-model="form.goodsYears" placeholder="近代"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="goodsSpecs">
          <el-input v-model="form.goodsSpecs" placeholder="1件"></el-input>
        </el-form-item>
      </el-card>

      <el-card>
        <h2>商品主图（最少上传1张)</h2>
        <el-form-item label="头图选择" prop="headImages" label-width="50">
          <el-upload action="" list-type="picture-card" :auto-upload="false"
                     :on-change="getFile" :on-preview="handleHeaderPictureCardPreviewHeader" :on-remove="handleHeaderRemove" :limit="9" :on-exceed="handleMore">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="headerDialogVisible">
            <img width="100%" :src="headerImgUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-card>

      <el-card>
        <h2>商品详情图</h2>
        <el-form-item label="详情图选择" label-width="50">
          <el-upload action="" list-type="picture-card" :auto-upload="false"
                     :on-change="getDetailFile" :on-preview="handleDetailPictureCardPreviewHeader" :on-remove="handleDetailRemove" :limit="9" :on-exceed="handleMore">
            <i class="el-icon-plus"></i>
          </el-upload>
            <el-dialog :visible.sync="detailDialogVisible">
              <img width="100%" :src="detailImgUrl" alt="">
            </el-dialog>
        </el-form-item>
      </el-card>

      <el-card>
        <h2>拍卖设置</h2>
        <el-form-item label="截止时间" prop="endHours">
          <el-radio v-model="form.endHours" label="12">12小时</el-radio>
          <el-radio v-model="form.endHours" label="24">24小时</el-radio>
          <el-radio v-model="form.endHours" label="48">48小时</el-radio>
        </el-form-item>
        <el-form-item label="起拍价">
          <el-input v-model="form.startPrice" placeholder="请输入起拍价" :disabled="startPriceType"></el-input>
        </el-form-item>
        <el-form-item label="加价幅度">
          <el-input v-model="form.increaseRate" placeholder="请输入加价幅度" :disabled="increaseRateType"></el-input>
        </el-form-item>
        <el-form-item label="保证金">
          <el-input v-model="form.goodsDeposit" placeholder="请输入保证金"></el-input>
        </el-form-item>
        <el-form-item label="七天无理由退" label-width="200">
          <el-switch
            v-model="noReason"
            active-color="#409EFF"
            inactive-color="#cccccc">
          </el-switch>
        </el-form-item>
        <el-form-item label="包邮否" label-width="200">
          <el-switch
            v-model="freeShip"
            active-color="#409EFF"
            inactive-color="#cccccc">
          </el-switch>
        </el-form-item>
      </el-card>
      <el-card>
        <h2>增值玩法</h2>
        <el-form-item label="玩法">
          <el-radio-group v-model="form.goodsType" @change="goodsTypeChange">
            <el-radio label="0">普通拍</el-radio>
            <el-radio label="1">捡漏专区</el-radio>
            <el-radio label="2">分享拍</el-radio>
            <el-radio label="3">一元拍</el-radio>
            <el-radio label="4">一口价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="一口价" v-if="form.goodsType == 4">
          <el-input v-model="form.fixedPrice" placeholder="请输入一口价"></el-input>
        </el-form-item>
      </el-card>
      <el-form-item>
        <el-button class="issue-btn" type="primary" @click="submitForm('form')">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  uploadFileList,
  inputOnchange
} from "@/api/Newcompilation.js";
import {getCategoryList ,shelvesGoods} from "../../../api/ownStoreGoods";
export default {
  name: "addOwnStoreGoods",
  data() {
    return {
      form: {
        goodsSize: '',
        goodsName: '',
        goodsDesc: '',
        goodsMate: '',
        goodsFlaw: '',
        goodsYears: '',
        goodsSpecs: '',
        endHours: '48',
        startPrice: '',
        increaseRate: '',
        goodsDeposit: 0,
        noReason: 1,
        freeShip: 1,
        goodsType: '0',
        fixedPrice: '',
        subCategoryId: '',
        headImages: '',
        detailImages: ''
      },
      //监听是否七天无理由, 如果是那么form中的noReason为1 不是为0
      noReason: true,
      //监听包邮, 同上
      freeShip: true,
      //商品类目
      categoryList: [],
      //当前选择的商品2级类目
      currentCategory: '',
      //映射三级联动框
      optionProps: {
        value: 'id',
        label: 'categoryName',
        children: 'subs'
      },
      headImagesText: '',
      detailImagesText: '',
      headImagesArr: [],
      detailImagesArr: [],
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        goodsDesc: [
          { required: true, message: '请输入拍品描述', trigger: 'blur' },
          {  min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ],
        subCategoryId: [
          { required: true, message: '请选择主营类目id', trigger: 'blur' },
        ],
        headImages: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ],
        endHours: [
          { required: true, message: '请选择截止时间', trigger: 'blur' },
        ]
      },
      startPriceType: false,
      increaseRateType: false,
      goodsDepositType: false,
      headerDialogVisible: false,
      detailDialogVisible: false,
      headerImgUrl: '',
      detailImgUrl: '',
      headFileList: [],
      detailFileList: []
    }
  },
  created(){
    //获取所有类目  放到三级联动选择器中
    getCategoryList().then(res=>{
      console.log(res)
      this.categoryList = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.form.headImages = this.headImagesArr.join(';')
      this.form.detailImages = this.detailImagesArr.join(';')

      this.$refs[formName].validate((valid) => {
        if (valid) {
          shelvesGoods(this.form).then(res=>{
            console.log(res)
            if(res.code==0){
              this.$message({
                message: '您已成功上架商品~',
                type: 'success'
              });
              this.$router.go(0);
            }else{
              this.$message({
                message: res.msg,
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            message: '您还有必填项未填',
            type: 'warning'
          })
          return false;
        }
      });
    },
    getFile(file, fileList) {
      console.log(file, fileList)
      this.headFileList = JSON.parse(JSON.stringify(fileList))
      console.log('深拷贝后的结果',this.headFileList)
      let that = this
      let formDate = new FormData()
      formDate.append('multipartFileList', file.raw);
      // console.log(formDate,'55555')
      uploadFileList(formDate).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          let img_url = resp.data[0];//图片URL地址
          let imgObj = new Image();//创建对象
          imgObj.src = img_url;//改变图片地址
          imgObj.onload = function(){
            that.headImagesText = (img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?'))
            that.headImagesArr.push(that.headImagesText);
            that.form.headImages = that.headImagesArr.join(';')
          }
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          });
        }
      })
    },
    getDetailFile(file, fileList) {
      let that = this
      let formDate = new FormData()
      this.detailFileList = JSON.parse(JSON.stringify(fileList))
      formDate.append('multipartFileList', file.raw);
      // console.log(formDate,'55555')
      uploadFileList(formDate).then(resp => {
        console.log(resp);
        if (resp.code == 0) {
          let img_url = resp.data[0];//图片URL地址
          let imgObj = new Image();//创建对象
          imgObj.src = img_url;//改变图片地址
          imgObj.onload = function(){
            that.detailImagesText = (img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?'))
            that.detailImagesArr.push(that.detailImagesText);
            that.form.detailImages = that.detailImagesArr.join(';')
          }
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          });
        }
      })
    },

    handleHeaderPictureCardPreviewHeader(file) {
      this.headerImgUrl = file.url
      this.headerDialogVisible = true;
    },
    handleDetailPictureCardPreviewHeader(file) {
      this.detailImgUrl = file.url
      this.detailDialogVisible = true;
    },
    handleHeaderRemove(file, fileList) {
      let index = this.headFileList.findIndex(item=>{
        return file.raw.uid == item.raw.uid
      })
      console.log(index)
      this.headImagesArr.splice(index, 1)
      this.form.headImages = this.headImagesArr.join(';')
      this.headFileList = JSON.parse(JSON.stringify(fileList))
    },
    handleDetailRemove(file, fileList) {
      let index = this.detailFileList.findIndex(item=>{
        return file.raw.uid == item.raw.uid
      })
      console.log(index)
      this.detailImagesArr.splice(index, 1)
      this.form.detailImages = this.detailImagesArr.join(';')
      this.detailFileList = JSON.parse(JSON.stringify(fileList))
    },
    goodsTypeChange(value){
      this.startPriceType= false;
      this.increaseRateType= false;
      this.form.startPrice = ''
      this.form.increaseRate = ''
      if(value == 1){
        this.startPriceType= true;
        this.increaseRateType= true;
        this.form.startPrice = 0
        this.form.increaseRate = 5
      }else if(value == 4){
        this.form.fixedPrice = ''
        this.startPriceType= true;
        this.increaseRateType= true;
        this.form.startPrice = ''
        this.form.increaseRate = ''
      }else if( value == 3){
        this.startPriceType= true;
        this.increaseRateType= true;
        this.form.startPrice = 0
        this.form.increaseRate = 1
      }
    },
    handleMore(){
      this.$message({
        message: '最多只能上传9张图哦~',
        type: 'warning'
      })
    },
    //联机选择器事件
    handleChange(value) {
      console.log(value);
      this.form.subCategoryId = value[1]
    }
  },
  watch:{
    noReason(newVal, oldVal){
      if(newVal){
        this.form.noReason = 1
      }else{
        this.form.noReason = 0
      }
    },
    freeShip(newVal, oldVal){
      if(newVal){
        this.form.freeShip = 1
      }else{
        this.form.freeShip = 0
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.el-card + .el-card
  margin-top: 30px
.issue-btn
  margin-top: 20px
</style>

