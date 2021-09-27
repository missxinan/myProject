<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.artworkStatus"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusListOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
	  <el-button
	    class="filter-item"
	    type="primary"
	    icon="el-icon-search"
	    @click="handleFilter"
	  >查询</el-button>
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
	  <el-table-column label="id" align="center" width="60px">
	    <template slot-scope="scope">
	      <span>{{ scope.row.id }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="订单编号" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.orderNo }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="用户昵称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.nickName }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴品名称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.artworkName }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴品封面图" align="center" width="160">
	    <template slot-scope="scope">
	          <img class="goods_image" :src="scope.row.coverImage" />
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴品分类" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.classifyName }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="鉴品规格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="鉴定师鉴定情况描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appraiserDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="鉴定师鉴定真品度" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.appraiserResult }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="鉴定师市场价格预估" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.marketPrice }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴定状态" align="center" width="100px">
	    <template slot-scope="scope">
		  <span v-if="scope.row.artworkStatus == 0">鉴定中</span>
		  <span v-if="scope.row.artworkStatus == 1">已鉴定</span>
		  <span v-if="scope.row.artworkStatus == 2">已寄卖</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="鉴定手续费支付状态" align="center">
	    <template slot-scope="scope">
		  <span v-if="scope.row.payStatus == 0">待支付</span>
		  <span v-if="scope.row.payStatus == 1">已支付</span>
	    </template>
	  </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="{row}">
          <el-button  type="primary" size="mini" @click="lookAppraiserData(row)">查看</el-button>
          <el-button v-if=" row.artworkStatus == 0" type="primary" size="mini" @click="handleStart(row)">审核</el-button>
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
	
	<!-- 查看详情 -->
	<el-dialog title="查看详情" :visible.sync="dialogInfoVisible">
	  <el-form
	    :model="appraiserInfo"
	    label-position="left"
	    label-width="140px"
	    style="width: 500px; margin-left:50px;font-size: 30px;"
	  >
	  <el-form-item label="订单编号:" >
		<span>{{appraiserInfo.orderNo}}</span>
	  </el-form-item>
	  <el-form-item label="用户ID:">
	  		<span>{{appraiserInfo.userId}}</span>
	  </el-form-item>
	  <el-form-item label="用户昵称:">
	  		<span>{{appraiserInfo.nickName}}</span>
	  </el-form-item>
	  <el-form-item label="用户头像:" prop="avatar">
	  		<img width="100px" :src="appraiserInfo.avatar" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品名称:">
	  		<span>{{appraiserInfo.artworkName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品封面图:" prop="coverImage">
	  		<img width="100px" :src="appraiserInfo.coverImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品细节图:" prop="detailsImageArr">
	  		<!-- <img width="100px"  :src="appraiserInfo.coverImage" alt=""> -->
			<span v-for="(item,index) in appraiserInfo.detailsImageArr" :key="index">
				<!-- <img width="100px" :src="item" /> -->
				<el-image 
				    style="width: 100px"
				    :src="item" 
				    :preview-src-list="getImgList(index)">
				  </el-image>
			</span>
	  </el-form-item>
	  <el-form-item label="鉴品分类ID:">
	    <span>{{appraiserInfo.classifyId}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品分类名称:">
	    <span>{{appraiserInfo.classifyName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品证书图:" prop="certificateImage">
	  		<img width="100px" :src="appraiserInfo.certificateImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品规格:">
	    <span>{{appraiserInfo.specification}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品描述:">
	    <span>{{appraiserInfo.description}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师ID:">
	    <span>{{appraiserInfo.appraiserId}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师免冠照片:" prop="personalImage">
	  		<img width="100px" :src="appraiserInfo.personalImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴定师名称:">
	    <span>{{appraiserInfo.appraiserName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师个人简介:">
	    <span>{{appraiserInfo.introduction}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定情况描述:">
	    <span>{{appraiserInfo.appraiserDescribe}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定真品度:">
	    <span>{{appraiserInfo.appraiserResult}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定价格预估:">
	    <span>{{appraiserInfo.marketPrice}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定状态:">
	    <span v-if="appraiserInfo.artworkStatus == 0">鉴定中</span>
	    <span v-if="appraiserInfo.artworkStatus == 1">已鉴定</span>
	    <span v-if="appraiserInfo.artworkStatus == 2">已寄卖</span>
	  </el-form-item>
	  <el-form-item label="手续费支付状态:">
	    <span v-if="appraiserInfo.payStatus == 0"> 待支付</span>
	    <span v-if="appraiserInfo.payStatus == 1">已支付</span>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="dialogInfoVisible = false">关闭</el-button>
	    <!-- <el-button type="primary" @click="inviteDataUpdate()">提交</el-button> -->
	  </div>
	</el-dialog>
	
	
	<!-- 审核 -->
	<el-dialog title="审核" :visible.sync="dialogAuditVisible">
	  <el-form
	    ref="dataForm"
	    :model="temp"
	    label-position="left"
	    label-width="200px"
	    style="width: 600px; margin-left:50px;"
	  >
	    <!-- <el-form-item label="鉴定情况描述: " prop="appraiserDescribe">
	      <textarea v-model="temp.appraiserDescribe" maxlength="100"></textarea>
	    </el-form-item> -->
		<el-form-item label="鉴定师鉴定情况描述：" >
			<el-input
				class="item-input-number"
				placeholder="请输入内容"
				v-model="temp.appraiserDescribe"
				type="text"
				@input="change($event)"
			>
			</el-input>
		</el-form-item>
		<el-form-item label="鉴定师鉴定真品度：" >
			<el-input
				class="item-input-number"
				placeholder="请输入0-100的数字"
				v-model="temp.appraiserResult"
				type="text"
				@input="change($event)"
			>
			</el-input>
		</el-form-item>
		<el-form-item label="鉴定师市场价格预估：" >
			<el-input
				class="item-input-number"
				placeholder="请输入内容"
				v-model="temp.marketPrice"
				type="text"
				@input="change($event)"
			>
			</el-input>
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
		fetchIdentificationList,
		getIdentificationInfo,
		identificationAudit
	} from "@/api/identification.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
const statusListOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "鉴定中" },
  { key: "1", display_name: "已鉴定" },
  { key: "2", display_name: "已寄卖" },
];
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
	  statusListOptions,
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
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
      fetchIdentificationList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
         this.listLoading = false;
      });
    },
	handleFilter() {
	  this.listQuery.current = 1;
	  this.getList();
	},
	change(e){
		this.$forceUpdate()
	},
    toAddActivity(){
      // this.$router.push({ path: "inviteData"});
	  this.dialogFormVisible=true
    },
  /* 操作--查看 图片预览 */ 
	 getImgList(index){
		let images = JSON.parse(JSON.stringify(this.appraiserInfo.detailsImageArr))
		for(let i=0;i<index;i++){
			images.push(images[0]);
			images.splice(0,1);
		}
		return images
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
		getIdentificationInfo({id:row.id}).then(response => {
		  this.appraiserInfo = response.data;
		  this.appraiserInfo.detailsImageArr = response.data.detailsImage.split(';')
		});
		this.dialogInfoVisible = true
	},
	appraiserAudit(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
			this.temp.status = this.status;
			this.submitClick = true
            identificationAudit(this.temp).then(res => {
              this.submitClick = false
              if (res.code == 0) {
                this.dialogAuditVisible = false;
                this.$notify({
                  title: "Success",
                  message: "操作成功",
                  type: "success",
                  duration: 2000
                });
				this.temp = {}
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
	  this.temp = {}
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
