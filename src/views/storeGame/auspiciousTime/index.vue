<template>
  <div class="app-container">
        <div class="filter-container">
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
              <span>{{ scope.row.auspiciousId }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="开始时间" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.startTime }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="结束时间" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.endTime }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="创建时间" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.createTime }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="创建人" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.createBy }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="更新时间" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.updateTime }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="更新人" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.updateBy }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label=" 标志" align="center">
		    <template slot-scope="scope">
		      <span v-if="scope.row.deleted==0">正常 </span>
		      <span v-if="scope.row.deleted==1">删除 </span>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="260px" align="center" class-name="small-padding fixed-width">
		    <template slot-scope="{row}">
		      <el-button type="primary" size="mini" @click="updataDataStatus(row)">编辑</el-button>
		      <el-button type="primary" size="mini" @click="delHandleData(row)">删除</el-button>
		      <el-button type="primary" size="mini" @click="lookHandleData(row)">查看</el-button>
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
	  <!-- 天降祥瑞时间 -->
	  <el-dialog title="天降祥瑞时间" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
	      <el-form-item  label="时间范围">
	       <el-time-picker
	           is-range
	           v-model="temp.time"
			   value-format="HH:mm:ss"
	           range-separator="至"
	           start-placeholder="开始时间"
	           end-placeholder="结束时间"
	           placeholder="选择时间范围">
	         </el-time-picker>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogAuditVisible = false">取消</el-button>
	      <el-button type="primary"  @click="addOrUpdataAudit()">提交</el-button>
	    </div>
	  </el-dialog>
	  <!-- 祥瑞奖励配置 -->
	  <el-dialog title="祥瑞奖励配置" :visible.sync="dialogDeployVisible">
	    <el-form
	      ref="dataForm"
	      :model="deployTemp"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
		  <el-form-item label="奖励名称">
		    <el-select
		      v-model="deployTemp.rewardId"
		      placeholder="奖励ID"
			  @change="change($event)" 
		      clearable
		      class="filter-item"
		      style="width: 130px"
		    >
		      <el-option
		        v-for="item in statusListOptions"
		        :key="item.rewardId"
		        :label="item.rewardName"
		        :value="item.rewardId"
		      />
		    </el-select>
		  </el-form-item>
	      <el-form-item label="奖励数量">
	        <el-input v-model="deployTemp.rewardNumber"
	         @input="change($event)" 
	         oninput="value=value.replace(/[^\d.]/g,'')"
	      		/>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogDeployVisible = false">取消</el-button>
	      <el-button type="primary"  @click="addOrUpdataDeploy()">提交</el-button>
	    </div>
	  </el-dialog>
	  <!-- 天降祥瑞详情 -->
	  <el-dialog title="天降祥瑞详情" :visible.sync="dialogVisible">
	    <el-form
	      ref="dataForm"
	      :model="ausTimeInfo"
	      label-position="left"
	      label-width="100px"
	      style="width: 700px; margin-left:50px;"
	    >
	      <el-form-item  label="开始时间">
	       <span>{{ausTimeInfo.startTime}}</span>
	      </el-form-item>
		  <el-form-item  label="结束时间">
		   <span>{{ausTimeInfo.endTime}}</span>
		  </el-form-item>
		  <el-form-item  label="奖励信息">
			<el-button class="filter-item" type="primary" @click="deployAdd(ausTimeInfo)">添加</el-button>
		  </el-form-item>
		  <el-form-item  label="" v-for="(item,index) in ausTimeInfo.rewards" :key="index">
			  <span>奖品信息：</span><span>{{item.rewardName}}</span>*<span>{{item.rewardNumber}}</span>
			  <span>兑换所需芒果币：</span><span>{{item.needfulMango}}</span>
			  <el-button type="primary" size="mini" @click="deployUpdata(item)">编辑</el-button>
			  <el-button type="primary" size="mini" @click="delDeployData(item)">删除</el-button>
		  </el-form-item>
	    </el-form>
	  </el-dialog>
  </div>
</template>

<script>
import {
	fetchRewardList,
	fetchTimeList,
	auspiciousTimeInfo,
	auspiciousTimeAdd,
	auspiciousTimeEdit,
	auspiciousTimeDel,
	fetchDeployAdd,
	fetchDeployEdit,
	fetchDeployDel
} from "@/api/auspicious.js";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
export default {
  name: "notice",
  components: {
    Pagination
  },
  data() {
    return {
	  value1: [],
	  soldOut:false,
	  putaway:false,
	  deleleOut:false,
	  statusListOptions:[],
	  soldOutstatus:null,
	  isAdd:true,
      list: null,
      mangolist: null,
      mangototal: 0,
      listLoading: true,
	  ausTimeInfo:{},
	  dialogVisible:false,
	  dialogDeployVisible:false,
	  dialogAuditVisible:false,
	  temp: {},
	  deployTemp:{},
	  status:'',
	  submitClick: false,
      userlistQuery: {
        current: 1,
        size: 10,
      },
    };
  },
  created() {
    this.getList();
	this.getdeloyList()
  },
  methods: {
    checkPermission,
	getdeloyList() {
	    fetchRewardList().then(response => {
	      console.log(response.data.records,'1111111111')
		  this.statusListOptions = response.data.records
	    });
	  
	},
    getList() {
      this.listLoading = true;
        fetchTimeList(this.userlistQuery).then(response => {
          this.mangolist = response.data.records;
          this.mangototal = Number(response.data.total);
          this.listLoading = false;
        });
    },
	deployAdd(row){
	  console.log(row)
	  this.deployTemp.edit = false
	  this.deployTemp.rewardId = row.rewardId
	  this.deployTemp.rewardNumber = row.rewardNumber
	  this.deployTemp.auspiciousId = row.auspiciousId;
	  this.dialogDeployVisible = true;
	},
	deployUpdata(row){
		console.log(row)
		this.deployTemp.edit = true
		this.deployTemp.rewardId = row.rewardId
		this.deployTemp.rewardNumber = row.rewardNumber
		this.deployTemp.auspiciousId = this.ausTimeInfo.auspiciousId;
		this.dialogDeployVisible = true;
	},
	lookHandleData(res){
		auspiciousTimeInfo({auspiciousId:res.auspiciousId}).then(response => {
		  console.log(response)
		  this.ausTimeInfo=response.data
		  this.dialogVisible=true
		});
	},
	addOrUpdataDeploy(){
	  this.$refs["dataForm"].validate(valid => {
		if (valid) {
			console.log(this.deployTemp,'111111111')
			// if(!this.temp.time){
			// 	this.$notify({
			// 	  title: "error",
			// 	  message:'请选择时间',
			// 	  type: "error",
			// 	  duration: 2000
			// 	});
			// 	return
			// }
			// return
			this.submitClick = true
			if(this.deployTemp.edit){
				fetchDeployEdit(this.deployTemp).then(res => {
				  this.submitClick = false
				  if (res.code == 0) {
					this.dialogDeployVisible = false;
					this.$notify({
					  title: "Success",
					  message: "操作成功",
					  type: "success",
					  duration: 2000
					});
					this.lookHandleData(this.ausTimeInfo);
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
				fetchDeployAdd(this.deployTemp).then(res => {
				  this.submitClick = false
				  if (res.code == 0) {
					this.dialogDeployVisible = false;
					this.$notify({
					  title: "Success",
					  message: "操作成功",
					  type: "success",
					  duration: 2000
					});
					this.lookHandleData(this.ausTimeInfo);
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
	addOrUpdataAudit(){
	  this.$refs["dataForm"].validate(valid => {
	    if (valid) {
			console.log(this.temp)
			if(!this.temp.time){
				this.$notify({
				  title: "error",
				  message:'请选择时间',
				  type: "error",
				  duration: 2000
				});
				return
			}
			// return
			this.submitClick = true
			if(this.temp.auspiciousId){
				this.temp.startTime = this.temp.time[0]
				this.temp.endTime = this.temp.time[1]
				auspiciousTimeEdit(this.temp).then(res => {
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
				this.temp.startTime = this.temp.time[0]
				this.temp.endTime = this.temp.time[1]
				auspiciousTimeAdd(this.temp).then(res => {
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
	delDeployData(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      fetchDeployDel({ auspiciousId:this.ausTimeInfo.auspiciousId,rewardId:row.rewardId }).then(res=>{
		        if( res.code == 0 ){
		          this.$message({
		            type: 'success',
		            message: '操作成功!'
		          });
		          this.lookHandleData(this.ausTimeInfo);
		        }else{
		          this.$message.error(res.msg);
		        }
		      })
		    })
		
	},
	delHandleData(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      auspiciousTimeDel({ auspiciousId:row.auspiciousId }).then(res=>{
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
		    auspiciousId: "",
			startTime:'',
			endTime:''
	  }
	  if(row){
		  this.temp = row
		  this.temp.auspiciousId = row.auspiciousId;
	  }
	  this.dialogAuditVisible = true;
	  // this.$nextTick(() => {
	  //   this.$refs["dataForm"].clearValidate();
	  // });
	},
	change(e){
		this.$forceUpdate()
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
