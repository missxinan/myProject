<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" class="uploadButton"  size="mini" type="primary" @click=" dialogVisible=true">
      <i class="el-icon-plus" style="color:#8c939d;"></i>
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
		    name="multipartFileList"
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :headers="headers"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="imgUrl"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
        <div class="dragImg">
            <vuedraggable class="wrapper" v-model="imgList">
                <transition-group style="display:flex;">
                  <div v-for="(item,index) in imgList" :key="index">
                    <img :src="item.url" style="width:80px;height:80px;margin-right:10px;" />
                  </div>
                </transition-group>
            </vuedraggable>
        </div>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        提交
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { getToken } from '@/utils/auth';
import vuedraggable from 'vuedraggable';
import url from '@/utils/url'
export default {
  name: 'moreImgUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
components: {vuedraggable},
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      imgList:[],
      headers:{
            'Authorization':getToken()
        },
      // imgUrl: 'https://devu.jiayikou.com/oss/uploadFileList'
      imgUrl: url + '/oss/uploadFileList'

}
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('图片正在上传！')
        return
      }
      this.$emit('successCBK', this.imgList)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
      this.imgList = []
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data[0]
          this.listObj[objKeyArr[i]].hasSuccess = true
          this.imgList.push( this.listObj[objKeyArr[i]])
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    },
    move(e){
        console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  .el-upload--picture-card {
    width: 100%;
  }
}
.dragImg{
    display:flex;
    padding:10px;
}
.uploadButton{
    background: #fbfdff !important;
    border: 1px dashed #c0ccda !important;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
    font-size: 28px;
}
</style>
