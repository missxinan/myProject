<template>
  <div class="app-container">
	 
    <div class="filter-container">
		<div class="ax_200">
		  <el-input v-model="listQuery.orderNo" style="width:140px" placeholder="请输入编号"></el-input>
		</div>
		<div class="ax_200">
		  <el-input v-model="listQuery.phone" style="width:140px" placeholder="手机号"></el-input>
		</div>
		<div class="ax_200">
		    <el-date-picker
		      v-model="listQuery.startTime"
		      type="datetime"
			  value-format="yyyy-MM-dd HH:mm:ss"
		      placeholder="选择开始时间">
		    </el-date-picker>
		  </div>
		  <div class="ax_200">
		      <el-date-picker
		        v-model="listQuery.endTime"
		        type="datetime"
		  	    value-format="yyyy-MM-dd HH:mm:ss"
		        placeholder="选择结束时间">
		      </el-date-picker>
		    </div>
      <el-select
        v-model="listQuery.orderStatus"
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
	  <el-table-column label="鉴品ID" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.artworkId }}</span>
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
	  <el-table-column label="寄卖服务费" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.consignmentFee }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="寄卖售价" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.consignmentPrice }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="寄卖成交价" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.transactionPrice }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="创建时间" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.createTime }}</span>
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
	  <el-table-column label="快递公司名称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.logisticsName }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="物流订单号" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.logisticsOrder }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="订单状态" align="center" width="100px">
	    <template slot-scope="scope">
		  <span v-if="scope.row.orderStatus == 0">寄卖中</span>
		  <span v-if="scope.row.orderStatus == 1">取消寄卖</span>
		  <span v-if="scope.row.orderStatus == 2">已寄卖</span>
		  <span v-if="scope.row.orderStatus == 3">待邮寄</span>
		  <span v-if="scope.row.orderStatus == 4">已邮寄</span>
		  <span v-if="scope.row.orderStatus == 5">已签收</span>
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
	    :model="orderInfo"
	    label-position="left"
	    label-width="140px"
	    style="width: 500px; margin-left:50px;font-size: 30px;"
	  >
	  <el-form-item label="鉴品ID:" >
		<span>{{orderInfo.artworkId}}</span>
	  </el-form-item>
	  <el-form-item label="订单编号:" >
	  		<span>{{orderInfo.orderNo}}</span>
	  </el-form-item>
	  <el-form-item label="用户ID:">
	  		<span>{{orderInfo.userId}}</span>
	  </el-form-item>
	  <el-form-item label="用户昵称:">
	  		<span>{{orderInfo.nickName}}</span>
	  </el-form-item>
	  <el-form-item label="用户头像:" prop="avatar">
	  		<img width="100px" :src="orderInfo.avatar" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品名称:">
	  		<span>{{orderInfo.artworkName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品封面图:" prop="coverImage">
	  		<img width="100px" :src="orderInfo.coverImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品细节图:" prop="detailsImageArr">
	  		<!-- <img width="100px"  :src="orderInfo.coverImage" alt=""> -->
			<span v-for="(item,index) in orderInfo.detailsImageArr" :key="index">
				<!-- <img width="100px" :src="item" /> -->
				<el-image
				    style="width: 100px"
				    :src="item" 
				    :preview-src-list="getImgList(index)">
				  </el-image>
			</span>
	  </el-form-item>
	  <el-form-item label="鉴品分类ID:">
	    <span>{{orderInfo.classifyId}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品分类名称:">
	    <span>{{orderInfo.classifyName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品证书图:" prop="certificateImage">
	  		<img width="100px" :src="orderInfo.certificateImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴品规格:">
	    <span>{{orderInfo.specification}}</span>
	  </el-form-item>
	  <el-form-item label="鉴品描述:">
	    <span>{{orderInfo.description}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师ID:">
	    <span>{{orderInfo.appraiserId}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师免冠照片:" prop="personalImage">
	  		<img width="100px" :src="orderInfo.personalImage" alt="">
	  </el-form-item>
	  <el-form-item label="鉴定师名称:">
	    <span>{{orderInfo.appraiserName}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定师个人简介:">
	    <span>{{orderInfo.introduction}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定情况描述:">
	    <span>{{orderInfo.appraiserDescribe}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定真品度:">
	    <span>{{orderInfo.appraiserResult}}</span>
	  </el-form-item>
	  <el-form-item label="鉴定价格预估:">
	    <span>{{orderInfo.marketPrice}}</span>
	  </el-form-item>
	  <el-form-item label="寄卖售价:">
	    <span>{{orderInfo.consignmentPrice}}</span>
	  </el-form-item>
	  <el-form-item label="寄卖服务费:">
	    <span>{{orderInfo.consignmentFee}}</span>
	  </el-form-item>
	  <el-form-item label="寄卖成交价:">
	    <span>{{orderInfo.transactionPrice}}</span>
	  </el-form-item>
	  <el-form-item label="订单状态:">
	    <span v-if="orderInfo.orderStatus == 0">寄卖中 </span>
	    <span v-if="orderInfo.orderStatus == 1">取消寄卖</span>
	    <span v-if="orderInfo.orderStatus == 2">已寄卖</span>
	    <span v-if="orderInfo.orderStatus == 3">待邮寄</span>
	    <span v-if="orderInfo.orderStatus == 4">已邮寄</span>
	    <span v-if="orderInfo.orderStatus == 5">已签收</span>
	  </el-form-item>
	  <el-form-item label="快递公司名称:">
	    <span>{{orderInfo.logisticsName}}</span>
	  </el-form-item>
	  <el-form-item label="物流订单号:">
	    <span>{{orderInfo.logisticsOrder}}</span>
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
		identificationAudit,
		identificationOrderList,
		identificationOrderInfo
	} from "@/api/identification.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
const statusListOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "寄卖中" },
  { key: "1", display_name: "取消寄卖" },
  { key: "2", display_name: "已寄卖" },
  { key: "3", display_name: "待邮寄" },
  { key: "4", display_name: "已邮寄" },
  { key: "5", display_name: "已签收" },
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
	  orderInfo:{
		  
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
      identificationOrderList(this.listQuery).then(response => {
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
		let images = JSON.parse(JSON.stringify(this.orderInfo.detailsImageArr))
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
		identificationOrderInfo({id:row.id}).then(response => {
		  this.orderInfo = response.data;
		  this.orderInfo.detailsImageArr = response.data.detailsImage.split(';')
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
.ax_200 {
  height: 50px;
  margin-left: 4px;
  display: inline-block;
}

.ax_200 span {
  line-height: 43px;
  font-size: 15px;
  color: #333;
  font-weight: 400;
}

.ax_200 span:nth-child(1) {
  width: 80px;
}

</style>
