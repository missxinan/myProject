<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item topMagin"
        type="primary"
        @click="toAddActivity"
      >添加</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="800"
    >
	<!-- <el-table-column label="序号" type="index" align="center" width="60"></el-table-column> -->
	  <el-table-column label="id" align="center" width="100px">
	    <template slot-scope="scope">
	      <span>{{ scope.row.id }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴定师照片" align="center" width="160">
	    <template slot-scope="scope">
	          <img class="goods_image" :src="scope.row.personalImage" />
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴定师名称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.appraiserName }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="鉴定师手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appraiserPhone }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="鉴定师个人简介" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.introduction }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="类型" align="center">
	    <template slot-scope="scope">
		  <span v-if="scope.row.type == 0">入驻</span>
		  <span v-if="scope.row.type == 1">平台</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="合作方式" align="center">
	    <template slot-scope="scope">
	  		 <span v-if="appraiserInfo.cooperationWay == 0">鉴定师入驻</span>
	  		 <span v-if="appraiserInfo.cooperationWay == 1">店铺入驻</span>
	  		 <span v-if="appraiserInfo.cooperationWay == 2">藏品拍卖</span>
	  		 <span v-if="appraiserInfo.cooperationWay == 3">藏品抵押</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="状态" align="center">
	    <template slot-scope="scope">
		  <span v-if="scope.row.status == 0">待审核</span>
		  <span v-if="scope.row.status == 1">审核通过</span>
		  <span v-if="scope.row.status == 2">审核未通过 </span>
		  <span v-if="scope.row.status == 3">隐藏 </span>
	    </template>
	  </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button  type="primary" size="mini" @click="lookAppraiserData(row)">查看</el-button>
          <el-button v-if=" row.type == 1" type="primary" size="mini" @click="appraiserDataEdit(row)">编辑</el-button>
          <!-- <el-button  type="primary" size="mini" @click="handleStart(row)">审核</el-button> -->
          <el-button v-if=" row.status == 0" type="primary" size="mini" @click="handleStart(row)">审核</el-button>
		   <el-button type="info" size="mini" @click="appraiserDataDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      :currentPage="listQuery.current"
      @pagination="getList"
    />
	
	
	<!-- 邀请信息添加 -->
	<el-dialog title="邀请信息添加" :visible.sync="dialogFormVisible">
	  <el-form
	    :model="appraiserData"
	    label-position="left"
	    label-width="120px"
	    style="width: 500px; margin-left:50px;"
	  >
	  <el-form-item label="鉴定师名称">
	    <el-input @input="change($event)" v-model="appraiserData.appraiserName"/>
	  </el-form-item>
	  <el-form-item label="鉴定师照片" prop="personalImage">
	  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
	  	 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
	  		<i class="el-icon-plus"></i>
	  	</el-upload>
	  	<el-dialog :visible.sync="dialogVisible">
	  		<img width="100%" :src="appraiserData.personalImage" alt="">
	  	</el-dialog>
	  </el-form-item>
	  <el-form-item @input="change($event)" label="鉴定师手机号">
	    <el-input v-model="appraiserData.appraiserPhone"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item @input="change($event)" label="鉴定师简介">
	    <el-input
	    	class="item-input-text"
	    	type="textarea"
	    	:rows="3"
			@input="change($event)"
	    	placeholder="请输入内容"
	    	v-model="appraiserData.introduction"
	    	maxlength="50"
	    	show-word-limit
	    >
	    </el-input>
	  </el-form-item>
	  <el-form-item label="擅长分类">
	    <el-select style="width:350px" v-model="appraiserData.classifyId" multiple  placeholder="请选择擅长分类">
	      <el-option
	        v-for="item in reqClassifyList"
	        :key="item.id"
	        :label="item.classifyName"
	        :value="item.id"
	      ></el-option>
	    </el-select>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取消</el-button>
	    <el-button type="primary" @click="appraiserAddUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	<!-- 查看详情 -->
	<el-dialog title="查看详情" :visible.sync="dialogInfoVisible">
	  <el-form
	    :model="appraiserInfo"
	    label-position="left"
	    label-width="140px"
	    style="width: 500px; margin-left:50px;font-size: 30px;"
	  >
	  <el-form-item label="鉴定师名称:">
		<span>{{appraiserInfo.appraiserName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师头像:" prop="avatar">
	  		<img width="100px" :src="appraiserInfo.personalImage" alt="">
	  </el-form-item>
	  <el-form-item label="身份证正面图:" prop="avatar">
	  		<img width="100px" :src="appraiserInfo.frontImage" alt="">
	  </el-form-item>
	  <el-form-item label="身份证反面图:" prop="avatar">
	  		<img width="100px" :src="appraiserInfo.contraryImage" alt="">
	  </el-form-item>
	  <el-form-item label="资质证书:" prop="avatar">
	  		<img width="100px" :src="appraiserInfo.certificateImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴定师手机号:">
	    <span>{{appraiserInfo.appraiserPhone}}</span>
	  </el-form-item>
	  <el-form-item label="个人简介:">
	    <span>{{appraiserInfo.introduction}}</span>
	  </el-form-item>
	  <el-form-item label="合作方式:">
	    <span v-if="appraiserInfo.cooperationWay == 0">鉴定师入驻</span>
	    <span v-if="appraiserInfo.cooperationWay == 1">店铺入驻</span>
	    <span v-if="appraiserInfo.cooperationWay == 2">藏品拍卖</span>
	    <span v-if="appraiserInfo.cooperationWay == 3">藏品抵押</span>
	  </el-form-item>
	  <el-form-item label="类型:">
	    <span v-if="appraiserInfo.type == 0">入驻</span>
	    <span v-if="appraiserInfo.type == 1">平台</span>
	  </el-form-item>
	  <el-form-item label="状态:">
	    <span v-if="appraiserInfo.status == 0">待审核</span>
	    <span v-if="appraiserInfo.status == 1">审核通过</span>
	    <span v-if="appraiserInfo.status == 2">审核未通过 </span>
	    <span v-if="appraiserInfo.status == 3">隐藏 </span>
	  </el-form-item>
	  <el-form-item label="擅长分类:">
	    <span v-for="(item,index) in appraiserInfo.classifyList" :key="index">
		{{item.classifyName}} ,
		<!-- <img width="100px" :src="item.classifyImage" alt=""> -->
		</span>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogInfoVisible = false">取消</el-button>
	    <el-button type="primary" @click="inviteDataUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	
	
	<!-- 审核 -->
	<el-dialog title="审核" :visible.sync="dialogAuditVisible">
	  <el-form
	    ref="dataForm"
	    :model="temp"
	    label-position="left"
	    label-width="100px"
	    style="width: 400px; margin-left:50px;"
	  >
	    <el-form-item label="审核内容: " prop="remark">
	      <textarea v-model="temp.remark" maxlength="100"></textarea>
	    </el-form-item>
	    <el-form-item label="审核状态: " prop="status">
	      <el-radio v-model="status" label="1">审核通过</el-radio>
	      <el-radio v-model="status" label="2">审核不通过</el-radio>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogAuditVisible = false">取消</el-button>
	    <el-button type="primary"  @click="appraiserAudit()">提交</el-button>
	  </div>
	</el-dialog>
	
  </div>
</template>

<script>
import {
		fetchAppraiserClassify,
		fetchAppraiserList,
		addAppraiserSave,
		updateAppraiser,
		deleteAppraiser,
		getAppraiserInfo,
		auditAppraiser
	} from "@/api/identification.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
export default {
  name: "AppraiserList",
  components: {
    Pagination
  },
  directives: {},
  inject:['reload'],
  data() {
    return {
      tableKey: 0,
      list: null,
	  appraiserData:{
		  
	  },
	  appraiserInfo:{
		  
	  },
	  status: "4",
	  temp: {
	    id: "",
	    status: "",
	    remark: ""
	  },
	  submitClick: false,
	  // 请求分类列表
	  reqClassifyList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
      },
      positionList: [],
	  dialogAuditVisible:false,
      dialogFormVisible: false,
	  dialogInfoVisible:false,
	  dialogVisible: false,
	  dialogVisible1: false,
    };
  },
  created() {
    this.getList();
	this.getClassifyList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      fetchAppraiserList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
         this.listLoading = false;
      });
    },
	// 请求展示区域
	getClassifyList() {
	  fetchAppraiserClassify().then(res => {
	    if (res.code == 0) {
	      this.reqClassifyList = res.data;
	    }
	  });
	},
	change(e){
		this.$forceUpdate()
	},
	appraiserAddUpdate(){
		console.log(this.appraiserData)
		if(this.appraiserData.id){
			this.appraiserUpdate()
		}else{
			this.appraiserAdd()
		}
	},
	appraiserAdd(){
		console.log(this.appraiserData)
		let data = this.appraiserData
		data.classifyId=this.appraiserData.classifyId.join(',')
		addAppraiserSave(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogFormVisible = false
			this.dialogVisible = false
			this.appraiserData = {}
		    this.getList();
			this.reload();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
	appraiserUpdate(){
		console.log(this.appraiserData)
		let data = this.appraiserData
		data.classifyId=this.appraiserData.classifyId.join(',')
		updateAppraiser(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogVisible = false
			this.appraiserData = {}
			this.dialogFormVisible = false
		    this.getList();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
    toAddActivity(){
      // this.$router.push({ path: "inviteData"});
	  this.dialogFormVisible=true
    },
	getFile(file, fileList) {
		let that = this
		// console.log(file.raw)
		let formDate = new FormData()
		formDate.append('multipartFileList', file.raw);
		// console.log(formDate,'55555')
		uploadFileList(formDate).then(resp => {
			// console.log(resp);
			if (resp.code == 0) {
				let img_url = resp.data[0];//图片URL地址
				let imgObj = new Image();//创建对象
				imgObj.src = img_url;//改变图片地址
				imgObj.onload = function(){
						that.appraiserData.personalImage = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
				}
			} else {
				this.$message({
					message: resp.msg,
					type: 'warning'
				});
			}
	
		})
	},
	handlePictureCardPreviewHeader(file) {
		this.dialogVisible = true;
	},
	handleRemove(file, fileList) {
		console.log(file, fileList);
	},
	appraiserDataDelete(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      deleteAppraiser({ id:row.id }).then(res=>{
		        if( res.code == 0 ){
		          this.$message({
		            type: 'success',
		            message: '操作成功!'
		          });
		          this.getList();
		        }else{
		          this.$message.error(res.msg);
		        }
		      })
		    })
		
	},
    reset(){
      this.listQuery = {
        current: 1,
        size: 10,
        time:undefined,
        goodsName:undefined,
        goodsId:undefined,
      }
       this.getList();
    },
    search(){
      this.listQuery.current = 1
      this.getList();
    },
	lookAppraiserData(row){
		console.log(row)
		getAppraiserInfo({id:row.id}).then(response => {
		  this.appraiserInfo = response.data;
		});
		this.dialogInfoVisible = true
	},
    appraiserDataEdit(row){
      console.log(row)
	  getAppraiserInfo({id:row.id}).then(response => {
	    this.appraiserData.id = response.data.id;
	    this.appraiserData.appraiserName = response.data.appraiserName;
	    this.appraiserData.appraiserPhone = response.data.appraiserPhone;
	    this.appraiserData.personalImage = response.data.personalImage;
	    this.appraiserData.introduction = response.data.introduction;
		this.dialogFormVisible = true
	  });
	  // this.dialogVisible = true
    },
	appraiserAudit(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
			this.temp.status = this.status;
			this.submitClick = true
            auditAppraiser(this.temp).then(res => {
              this.submitClick = false
              if (res.code == 0) {
                this.dialogAuditVisible = false;
                this.$notify({
                  title: "Success",
                  message: "操作成功",
                  type: "success",
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: "error",
                  message: res.msg,
                  type: "error",
                  duration: 2000
                });
              }
            });
          }
      });
    },
	handleStart(row) {
	  this.temp.id = row.id;
	  this.dialogAuditVisible = true;
	  this.$nextTick(() => {
	    this.$refs["dataForm"].clearValidate();
	  });
	},
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 20px;
}
.topMagin {
  margin-top: 20px;

}
</style>
