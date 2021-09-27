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
	<el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
	  <el-table-column label="id" align="center" width="100px">
	    <template slot-scope="scope">
	      <span>{{ scope.row.id }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="头像" align="center" width="160">
	    <template slot-scope="scope">
	          <img class="goods_image" :src="scope.row.avatar" />
	    </template>
	  </el-table-column>
	  <el-table-column label="用户昵称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.nickname }}</span>
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
      <el-table-column label="邀请人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inviteNumber }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="奖励金额" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.rewardPrice }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="活动id" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.activityId }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">激活</span>
          <span v-if="scope.row.status == 1">未激活</span>
        </template>
      </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" type="primary" size="mini" @click="inviteDataEdit(row)">编辑</el-button>
           <el-button type="primary" size="mini" @click="inviteForbidden(row)">{{ row.status == 1 ? '激活' : '关闭' }}</el-button>
		   <el-button v-if="row.status == 1" type="info" size="mini" @click="inviteDatadelete(row)">删除</el-button>
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
	    :model="inviteData"
	    label-position="left"
	    label-width="100px"
	    style="width: 500px; margin-left:50px;"
	  >
	  <el-form-item label="用户名">
	    <el-input v-model="inviteData.nickname"/>
	  </el-form-item>
	  <el-form-item label="用户头像" prop="avatar">
	  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
	  	 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
	  		<i class="el-icon-plus"></i>
	  	</el-upload>
	  	<el-dialog :visible.sync="dialogVisible">
	  		<img width="100%" :src="inviteData.avatar" alt="">
	  	</el-dialog>
	  </el-form-item>
	  <el-form-item label="邀请人数">
	    <el-input v-model="inviteData.inviteNumber"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item label="奖励金额"> 
	    <el-input v-model="inviteData.rewardPrice"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item label="活动id">
	    <el-input v-model="inviteData.activityId"
	  		oninput="value=value.replace(/[^\d.]/g,'')"
	  		/>
	  </el-form-item>
	 <!-- <el-form-item label="状态">
	    <el-input v-model="inviteData.status"/>
	  </el-form-item> -->
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取消</el-button>
	    <el-button type="primary" @click="inviteAddUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	<!-- 邀请信息修改 -->
	<el-dialog title="邀请信息修改" :visible.sync="dialogInviteVisible">
	  <el-form
	    :model="inviteDataUpdata"
	    label-position="left"
	    label-width="100px"
	    style="width: 500px; margin-left:50px;"
	  >
	  <el-form-item label="用户名">
	    <el-input v-model="inviteDataUpdata.nickname"/>
	  </el-form-item>
	  <el-form-item label="用户头像" prop="avatar">
	  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
	  	 :on-change="getFile1" :on-preview="handlePictureCardPreviewHeader1" :on-remove="handleRemove1">
	  		<i class="el-icon-plus"></i>
	  	</el-upload>
	  	<el-dialog :visible.sync="dialogVisible1">
	  		<img width="100%" :src="inviteDataUpdata.avatar" alt="">
	  	</el-dialog>
	  </el-form-item>
	  <el-form-item label="邀请人数">
	    <el-input v-model="inviteDataUpdata.inviteNumber"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item label="奖励金额"> 
	    <el-input v-model="inviteDataUpdata.rewardPrice"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item label="活动id">
	    <el-input v-model="inviteDataUpdata.activityId"
	  		oninput="value=value.replace(/[^\d.]/g,'')"
	  		/>
	  </el-form-item>
	  <!-- <el-form-item label="状态">
	    <el-input v-model="inviteDataUpdata.status"/>
	  </el-form-item> -->
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogInviteVisible = false">取消</el-button>
	    <el-button type="primary" @click="inviteDataUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	
  </div>
</template>

<script>
import {
	fetchList,
	inviteInfoAdd,
	inviteInfoUpdate,
	inviteInfoDelete,
	inviteInfoStatus
} from "@/api/inviteRanking.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
export default {
  name: "InviteRanking",
  components: {
    Pagination
  },
  directives: {},
  inject:['reload'],
  data() {
    return {
      tableKey: 0,
      list: null,
	  inviteData:{
		  
	  },
	  inviteDataUpdata:{
		  
	  },
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
        goodsName: undefined,
        goodsType:2
      },
      positionList: [],
      dialogFormVisible: false,
	  dialogInviteVisible:false,
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
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : ((this.listQuery.startTime = undefined),
          (this.listQuery.endTime = undefined));
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
         this.listLoading = false;
      });
    },
	inviteAddUpdate(){
		console.log(this.inviteData)
		let data = this.inviteData
		data.status=0
		inviteInfoAdd(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogFormVisible = false
			this.inviteData = {}
		    this.getList();
			this.reload();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
	inviteDataUpdate(){
		console.log(this.inviteData)
		let data = this.inviteDataUpdata
		inviteInfoUpdate(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogInviteVisible = false
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
						that.inviteData.avatar = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
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
					that.inviteDataUpdata.avatar = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]
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
	},
	inviteDatadelete(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      inviteInfoDelete({ id:row.id }).then(res=>{
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
    inviteForbidden(row){
      console.log(row,'row')
       this.$confirm('此操作将修改数据状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status = row.status == '1' ? '0' : '1'
          inviteInfoStatus({ id:row.id,status }).then(res=>{
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
    inviteDataEdit(row){
      console.log(row)
	  this.inviteDataUpdata=row
	  this.dialogInviteVisible = true
    },
  }
};
</script>
<style>
.el-form-item__content {
  font-size: 22px;
}
.topMagin {
  margin-top: 20px;

}
</style>
