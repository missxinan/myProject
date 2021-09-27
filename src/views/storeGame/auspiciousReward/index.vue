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
          <!-- <el-table-column label="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column> -->
		  <el-table-column label="rewardId" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.rewardId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="奖励名称" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.rewardName }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="需要的芒果币" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.needfulMango }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="红包金额" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.rewardAmount }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="奖励类型" align="center" >
		    <template slot-scope="scope">
			  <span v-if="scope.row.rewardType == 0">红包</span>
			  <span v-if="scope.row.rewardType == 1">实物奖励</span>
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
	  <!-- 天降祥瑞奖励 -->
	  <el-dialog title="天降祥瑞奖励" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
		<el-form-item label="需要的芒果币">
		  <el-input v-model="temp.needfulMango"
		   @input="change($event)" 
		   oninput="value=value.replace(/[^\d.]/g,'')"
				/>
		</el-form-item>
		  <el-form-item label="奖励名称"> 
		    <el-input @input="change($event)" v-model="temp.rewardName"/>
		  </el-form-item>
		  <el-form-item label="奖励类型: " prop="status">
		    <el-radio v-model="temp.rewardType" label="0">红包</el-radio>
		    <el-radio v-model="temp.rewardType" label="1">实物奖励</el-radio>
		  </el-form-item>
		  <el-form-item  label="红包金额">
		    <el-input v-model="temp.rewardAmount"
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
	fetchRewardList,
	fetchRewardAdd,
	fetchRewardEdit,
	fetchRewardDel,
} from "@/api/auspicious.js";
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
	  temp: {},
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
        fetchRewardList(this.userlistQuery).then(response => {
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
			if(this.temp.rewardId){
				fetchRewardEdit(this.temp).then(res => {
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
				fetchRewardAdd(this.temp).then(res => {
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
		      fetchRewardDel({ rewardId:row.rewardId }).then(res=>{
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
		    rewardId: "",
	  }
	  if(row){
		  this.temp = row
		  this.temp.rewardId = row.rewardId;
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
