<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="userlistQuery.phone"
            clearable
            placeholder="手机号"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
		  <el-input
		    v-model="userlistQuery.mallName"
		    clearable
		    placeholder="收藏馆名称"
		    style="width: 160px;"
		    class="filter-item"
		    @keyup.enter.native="handleFilter"
		  />
		  <el-date-picker
		    v-model="userlistQuery.time"
		    type="daterange"
		    value-format="yyyy-MM-dd HH:mm:ss"
		    range-separator="至"
		    start-placeholder="开始日期"
		    end-placeholder="结束日期"
		  ></el-date-picker>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
		  <el-button
		    class="filter-item"
		    type="primary"
		    @click="updataDataStatus('')"
		  >添加</el-button>
        </div>
        <div style="height: 20px;"></div>
        <el-table
          v-loading="listLoading"
          :data="mangolist"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column label="序号" type="index" align="center" width="60"></el-table-column> -->
          <el-table-column label="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="用户ID" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.userId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="用户头像" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.avatar" />
		    </template>
		  </el-table-column>
		  <el-table-column label="封面图" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.logo" />
		    </template>
		  </el-table-column>
		  <el-table-column label="店铺名称" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.mallName }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="手机号" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.phone }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="地址" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.mallAddress }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="店铺类型" align="center" >
		    <template slot-scope="scope">
			  <span v-if="scope.row.mallType == 0">直营店</span>
			  <span v-if="scope.row.mallType == 1">直营店</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="简介图" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.introduceImage" />
		    </template>
		  </el-table-column>
		  <el-table-column label="分享页面图" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.shareImage" />
		    </template>
		  </el-table-column>
		  <el-table-column label="个人藏馆封面图" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.coverImage" />
		    </template>
		  </el-table-column>
		  <el-table-column label="说明" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.mallExplain }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="商品数量" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.goodsNumber }}</span>
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
          <el-table-column label="修改人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.updateBy }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="操作" width="160px" align="center" class-name="small-padding fixed-width">
		    <template slot-scope="{row}">
		      <el-button type="primary" size="mini" @click="updataDataStatus(row)">编辑</el-button>
		      <el-button type="primary" size="mini" @click="delHandleData(row)">删除</el-button>
		    </template>
		  </el-table-column>
        <pagination
          v-show="mangototal>0"
          :total="mangototal"
          :page.sync="userlistQuery.current"
          :limit.sync="userlistQuery.size"
          :currentPage="userlistQuery.current"
          @pagination="getList"
        />
      </el-table>
      <pagination
        v-show="mangototal>0"
        :total="mangototal"
        :page.sync="userlistQuery.current"
        :limit.sync="userlistQuery.size"
        :currentPage="userlistQuery.current"
        @pagination="getList"
      />
	  <!-- 审核 -->
	  <el-dialog title="编辑个人馆" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
		<el-form-item label="手机号">
		  <el-input v-model="temp.phone"
		   @input="change($event)" 
		   oninput="value=value.replace(/[^\d.]/g,'')"
				/>
		</el-form-item>
		  <el-form-item label="收藏馆名称"> 
		    <el-input @input="change($event)" v-model="temp.mallName"/>
		  </el-form-item>
		  <el-form-item label="地址: " >
		    <textarea v-model="temp.mallAddress" @input="change($event)"  maxlength="100"></textarea>
		  </el-form-item>
		  <el-form-item label="说明: " >
		    <textarea v-model="temp.mallExplain" @input="change($event)"  maxlength="100"></textarea>
		  </el-form-item>
		  <el-form-item label="封面图">
		  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
		  	 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
		  		<i class="el-icon-plus"></i>
		  	</el-upload>
		  	<el-dialog :visible.sync="dialogVisible">
		  		<img width="100%" :src="temp.logo" alt="">
		  	</el-dialog>
		  </el-form-item>
		  <el-form-item label="个人简介图">
		  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
		  	 :on-change="getFile1" :on-preview="handlePictureCardPreviewHeader1" :on-remove="handleRemove1">
		  		<i class="el-icon-plus"></i>
		  	</el-upload>
		  	<el-dialog :visible.sync="dialogVisible1">
		  		<img width="100%" :src="temp.introduceImage" alt="">
		  	</el-dialog>
		  </el-form-item>
		  <el-form-item label="收藏人头像">
		  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
		  	 :on-change="getFile2" :on-preview="handlePictureCardPreviewHeader2" :on-remove="handleRemove2">
		  		<i class="el-icon-plus"></i>
		  	</el-upload>
		  	<el-dialog :visible.sync="dialogVisible2">
		  		<img width="100%" :src="temp.shareImage" alt="">
		  	</el-dialog>
		  </el-form-item>
		  <el-form-item label="个人馆封面图">
		  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
		  	 :on-change="getFile3" :on-preview="handlePictureCardPreviewHeader3" :on-remove="handleRemove3">
		  		<i class="el-icon-plus"></i>
		  	</el-upload>
		  	<el-dialog :visible.sync="dialogVisible3">
		  		<img width="100%" :src="temp.coverImage" alt="">
		  	</el-dialog>
		  </el-form-item>
		  <el-form-item  label="商品数量">
		    <el-input v-model="temp.goodsNumber"
			@input="change($event)" 
		  		oninput="value=value.replace(/[^\d.]/g,'')"
		  		/>
		  </el-form-item>
	      <el-form-item  label="排序">
	        <el-input v-model="temp.sort"
			@input="change($event)" 
	      		oninput="value=value.replace(/[^\d.]/g,'')"
	      		/>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogAuditVisible = false">取消</el-button>
	      <el-button type="primary"  @click="addOrUpdataAudit()">提交</el-button>
	    </div>
	  </el-dialog>
  </div>
</template>

<script>
import {
  fetchPersonalMallList,
  addPersonalMallList,
  editPersonalMallList,
  delPersonalMallList
} from "@/api/collect.js";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
const statusListOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "未处理" },
  { key: "1", display_name: "成功" },
  { key: "2", display_name: "失败" },
];
export default {
  name: "notice",
  components: {
    Pagination
  },
  data() {
    return {
	  soldOut:false,
	  putaway:false,
	  deleleOut:false,
	  statusListOptions,
	  soldOutstatus:null,
	  isAdd:true,
      list: null,
      mangolist: null,
      mangototal: 0,
      listLoading: true,
	  dialogAuditVisible:false,
	  
	  dialogVisible: false,
	  dialogVisible1: false,
	  dialogVisible2: false,
	  dialogVisible3: false,
	  temp: {
	    id: "",
		phone:"",
		mallName:"",
		mallAddress:"",
		mallExplain	:"",
		logo:"",
		introduceImage:"",
		shareImage:"",
		coverImage:"",
		sort:"",
		goodsNumber:"",
	    status: "",
	    remarks: ""
	  },
	  status:'',
	  submitClick: false,
      userlistQuery: {
        current: 1,
        size: 10,
        phone: undefined,
        time: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
        fetchPersonalMallList(this.userlistQuery).then(response => {
          this.mangolist = response.data.records;
          this.mangototal = Number(response.data.total);
          this.listLoading = false;
        });
      
    },
	addOrUpdataAudit(){
	  this.$refs["dataForm"].validate(valid => {
	    if (valid) {
			console.log(this.temp)
			// return
			this.submitClick = true
			if(this.temp.id){
				editPersonalMallList(this.temp).then(res => {
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
			}else{
				addPersonalMallList(this.temp).then(res => {
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

	      }
	  });
	},
	delHandleData(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      delPersonalMallList({ id:row.id }).then(res=>{
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
	updataDataStatus(row) {
	  console.log(row)
	  this.temp = {
		    id: "",
			phone:"",
			mallName:"",
			mallAddress:"",
			mallExplain	:"",
			logo:"",
			introduceImage:"",
			shareImage:"",
			coverImage:"",
			sort:"",
			goodsNumber:"",
		    status: "",
		    remarks: ""  
	  }
	  if(row){
		  this.temp = row
		  this.temp.id = row.id;
	  }
	  this.dialogAuditVisible = true;
	  // this.$nextTick(() => {
	  //   this.$refs["dataForm"].clearValidate();
	  // });
	},
    handleFilter() {
      this.userlistQuery.current = 1;
	  this.listLoading = true;
	  this.userlistQuery.phone == "" ? (this.userlistQuery.phone = undefined) : "",
	  this.userlistQuery.time
	    ? ((this.userlistQuery.startTime = this.userlistQuery.time[0]),
	      (this.userlistQuery.endTime = this.userlistQuery.time[1]))
	    : ((this.userlistQuery.startTime = undefined),
	      (this.userlistQuery.endTime = undefined));
      this.getList();
    },
	change(e){
		this.$forceUpdate()
	},
	//封面图
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
						that.temp.logo = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
						that.$forceUpdate()
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
		this.temp.logo = ''
	},
	//个人简介图
	getFile1(file, fileList) {
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
						that.temp.introduceImage = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
						that.$forceUpdate()
				}
			} else {
				this.$message({
					message: resp.msg,
					type: 'warning'
				});
			}
	
		})
	},
	handlePictureCardPreviewHeader1(file) {
		this.dialogVisible1 = true;
	},
	handleRemove1(file, fileList) {
		console.log(file, fileList);
		this.temp.introduceImage = ''
	},
	//收藏人头像
	getFile2(file, fileList) {
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
						that.temp.shareImage = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
						that.$forceUpdate()
				}
			} else {
				this.$message({
					message: resp.msg,
					type: 'warning'
				});
			}
	
		})
	},
	handlePictureCardPreviewHeader2(file) {
		this.dialogVisible2 = true;
	},
	handleRemove2(file, fileList) {
		console.log(file, fileList);
		this.temp.shareImage = ''
	},
	//收藏馆封面
	getFile3(file, fileList) {
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
						that.temp.coverImage = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
						that.$forceUpdate()
				}
			} else {
				this.$message({
					message: resp.msg,
					type: 'warning'
				});
			}
	
		})
	},
	handlePictureCardPreviewHeader3(file) {
		this.dialogVisible3 = true;
	},
	handleRemove3(file, fileList) {
		console.log(file, fileList);
		this.temp.coverImage = ''
	},
	reset() {
	  // for (let key in this.searchbanner) {
	  //   this.searchbanner[key] = "";
	  // }
	  // this.information.positionId = undefined;
	  // this.information.type = undefined;
	  // this.information.name = "";
	  // this.getList();
	},

    tableRowClassName({ row, rowIndex }) {
      if (row.blacklist != 0 && row.blacklist) {
        return "warning-row";
      }
      return "";
    }
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 16px;
}
.warning-row {
  color: red !important;
}
.total_blue {
    color: #409eff;
    cursor: pointer;
  }
</style>
