<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="userlistQuery.title"
            clearable
            placeholder="请输入公告标题"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
		  <el-select
		    v-model="userlistQuery.status"
		    clearable
		    class="filter-item"
		    style="width: 130px"
		    placeholder="状态"
		  >
		    <el-option
		      v-for="item in statusOptions"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
		    ></el-option>
		  </el-select>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
		  <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="reset">重置</el-button> -->
		  
		  <el-button
		    class="filter-item"
		    style="margin-left: 10px;"
		    type="primary"
		    icon="el-icon-edit"
		    @click="addNotice"
		  >添加</el-button>
		  <el-button
		    class="filter-item"
		    style="margin-left: 10px;"
		    type="primary"
		    icon="el-icon-edit"
		    @click="handleAppPush"
		  >APP推送</el-button>
        </div>
        <div style="height: 20px;"></div>
        <el-table
          v-loading="listLoading"
          :data="userlist"
          border
          fit
          highlight-current-row
          max-height="650"
          style="width: 100%;"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column label="创建时间" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="更新时间" align="center" width="100">
		    <template slot-scope="scope">
		      <span>{{ scope.row.updateTime }}</span>
		    </template>
		  </el-table-column>
           <el-table-column label="标题" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
           <el-table-column label="内容" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="链接" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.linkId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送状态" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.status == 0 ? '启用中' : '未启用' }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="推送状态" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pushStatus == 0 ? '推送' : '不推送' }}</span>
            </template>
          </el-table-column> -->
         <el-table-column label="操作人" align="center">
           <template slot-scope="scope">
             <span>{{ scope.row.updateBy }}</span>
           </template>
         </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
			 <!-- <el-button
			    type="primary"
			    size="mini"
			    style="margin-bottom:20px"
			    @click="lookupNotice(row)"
			    v-if="row.status === 0 && checkPermission(['adver:adverList:lookUp'])"
			  >查看</el-button> -->
			  
			  <el-button
			    type="primary"
			    size="mini"
			    style="margin-bottom:20px"
			    @click="editorNotice(row)"
				v-if="row.status === 1"
			  >编辑</el-button>
			  
			  <el-button
			    size="mini"
			    type="danger"
			    style="margin-bottom:20px"
			    @click="outNotice(row)"
			    v-if="row.status === 0"
			  >禁用</el-button>
			  
			  <el-button
			    size="mini"
			    type="success"
			    style="margin-bottom:20px"
			    @click="openNotice(row)"
			    v-if="row.status === 1"
			  >启用</el-button>
			  
			  <el-button
			    size="mini"
			    type="info"
			    style="margin-bottom:20px"
			    @click="deleteNotice(row)"
			  >删除</el-button>
            </template>
          </el-table-column>
        <pagination
          v-show="usertotal>0"
          :total="usertotal"
          :page.sync="userlistQuery.current"
          :limit.sync="userlistQuery.size"
          :currentPage="userlistQuery.current"
          @pagination="getList"
        />
      </el-table>
      <pagination
        v-show="usertotal>0"
        :total="usertotal"
        :page.sync="userlistQuery.current"
        :limit.sync="userlistQuery.size"
        :currentPage="userlistQuery.current"
        @pagination="getList"
      />

    <!-- 添加公告 -->
    <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="information"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公告标题: " prop="remark">
          <textarea v-model="information.title" maxlength="100"></textarea>
        </el-form-item>
		<el-form-item label="公告详情: " prop="remark">
		  <textarea v-model="information.content" maxlength="300"></textarea>
		</el-form-item>
		<!-- <el-form-item label="推送类型"  prop="type">
		  <el-select
		    v-model="information.type"
		    placeholder="类型"
		    clearable
		    class="filter-item"
		    style="width: 130px"
		  >
		    <el-option
		      v-for="item in typeOptions"
		      :key="item.key"
		      :label="item.label"
		      :value="item.value"
		    />
		  </el-select>
		</el-form-item> -->
		<el-form-item
		  label="H5链接"
		  prop="linkId"
		>
		  <el-input v-model="information.linkId" style="width: 200px" />
		</el-form-item>
       <!-- <el-form-item label="是否启用: " :prop="information.status">
          <el-radio v-model="information.status" label="0">启用</el-radio>
          <el-radio v-model="information.status" label="1">不启用</el-radio>
        </el-form-item> -->
		<!-- <el-form-item label="是否推送: " prop="pushStatus">
		  <el-radio v-model="information.pushStatus" label="0">推送</el-radio>
		  <el-radio v-model="information.pushStatus" label="1">不推送</el-radio>
		</el-form-item> -->
		<!-- <el-form-item label="推送时间">
		  <el-date-picker
		    type="datetime"
		    placeholder="选择日期"
		    value-format="yyyy-MM-dd HH:mm:00"
		    v-model="information.sendTime"
		  ></el-date-picker>
		</el-form-item> -->
      </el-form>
	 
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"   @click="updateData()">提交</el-button>
      </div>
    </el-dialog>
	
	<!-- APP推送 -->
	<el-dialog title="APP推送" :visible.sync="dialogPushVisible">
	  <el-form
	    ref="dataForm"
	    :model="pushInfoData"
	    label-position="left"
	    label-width="100px"
	    style="width: 600px; margin-left:50px;"
	  >
	    <el-form-item label="推送标题: " prop="remark">
	      <textarea v-model="pushInfoData.title" maxlength="100"></textarea>
	    </el-form-item>
		<el-form-item label="推送详情: " prop="remark">
		  <textarea v-model="pushInfoData.content" maxlength="300"></textarea>
		</el-form-item>
		<el-form-item label="推送类型" prop="type">
		  <el-input v-model="pushInfoData.type" style="width: 200px" /><br>
		  <span style="font-size: 10px;">(推送类型: 0 寄拍订单 1 竞拍订单 2 活动相关 3 福利专场 4 竞拍商品 5 兑换商品 6 其他 7 拼赚订单)</span>
		</el-form-item>
		<el-form-item label="触达类型" prop="touchType">
		  <el-input v-model="pushInfoData.touchType" style="width: 200px" /><br>
		  <span style="font-size: 10px;">(触达类型:0 商品ID 1 订单ID 2 H5链接)</span>
		</el-form-item>
		<el-form-item label="触达参数" prop="linkId">
		  <el-input v-model="pushInfoData.linkId" style="width: 200px" />
		</el-form-item>

	  </el-form>
	 
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogPushVisible = false">取消</el-button>
	    <el-button type="primary"   @click="clickPushData()">提交</el-button>
	  </div>
	</el-dialog>
	
	
	
	
<!-- 	<el-dialog title="下架" :visible.sync="soldOut">
	  <div class="putawayClass">确定下架此广告吗？</div>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="soldOut = false">取 消</el-button>
	    <el-button type="primary" @click="soldSure">确 定</el-button>
	  </div>
	</el-dialog> -->
	
	<!-- <el-dialog title="上架" :visible.sync="putaway">
	  <div class="putawayClass">确定上架此广告吗？</div>
	
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="putaway = false">取 消</el-button>
	    <el-button type="primary" @click="putawaySure">确 定</el-button>
	  </div>
	</el-dialog> -->
	
	<el-dialog title="确定删除吗？" :visible.sync="deleleOut">
	  <div class="putawayClass">删除后，公告信息不可见，确定删除吗？</div>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="deleleOut = false">取 消</el-button>
	    <el-button type="primary" @click="deleleOutSure()">确 定</el-button>
	  </div>
	</el-dialog>
  </div>
</template>

<script>
import {
  fetchNoticeList,
  noticeDel,
  noticeDetail,
  noticeEdit,
  noticeAdd,
  noticeStatus,
  pushNotice
} from "@/api/notice.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";

const typeOptions = [
  {
    value: 0,
    label: "公告"
  },{
    value: 1,
    label: "活动相关"
  },{
    value: 2,
    label: "福利专场"
  },{
    value: 3,
    label: "兑换商品专场"
  },{
    value: 4,
    label: "其他"
  },
  
];
const statusOptions = [
  {
    value: '',
    label: "全部"
  },{
    value: 0,
    label: "启用中"
  },{
    value: 1,
    label: "未启用"
  }
  
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
	  soldOutstatus:null,
	  typeOptions,
	  statusOptions,
	  isAdd:true,
      list: null,
      userlist: null,
      usertotal: 0,
      listLoading: true,
	  listQuery: {
	    current: 1,
	    size: 10,
	    title: undefined,
	    status: undefined,
	  },
      userlistQuery: {
        current: 1,
        size: 10,
        title: undefined,
        status: undefined,
      },
      dialogFormVisible: false,
      dialogPushVisible: false,
	  pushInfoData:{},
	  information:{
		  id:'',
		  title:'',
		  content:'',
		  type:'',
		  status:'',
		  pushStatus:'',
		  sendTime:'',
		  linkId:''
	  }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true;
        fetchNoticeList(this.userlistQuery).then(response => {
          this.userlist = response.data.records;
          this.usertotal = Number(response.data.total);
          this.listLoading = false;
        });
      
    },
	handleAppPush(){
		for (var key in this.pushInfoData) {
		    this.pushInfoData[key] = "";
		}
		this.dialogPushVisible = !this.dialogPushVisible
	},
    handleFilter() {
      if (this.listQuery.status == "") {
        this.listQuery.status = undefined;
      } else if (this.listQuery.title == "") {
        this.listQuery.title = undefined;
      }
      this.listQuery.current = 1;
      this.userlistQuery.current = 1;
      this.getList();
    },
	clickPushData(){
		console.log(this.pushInfoData)
		pushNotice(this.pushInfoData).then(response => {
		 if (response.code == 0) {
			this.$message("操作成功");
		 	this.dialogPushVisible=false
		 } else {
		   this.$message.error(response.msg);
		 }
		});
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
	addNotice(){
		for (var key in this.information) {
		    this.information[key] = "";
		}
		this.information.status = 0
		this.isAdd = true
		this.dialogFormVisible = !this.dialogFormVisible;
		
	},
	//查看公告
	lookupNotice(){
		
	},
	deleleOutSure(){
		let data = {
			id:this.soldOutstatus.id,
		}
		noticeDel(data).then(res => {
		  if (res.code == 0) {
		    this.deleleOut = false;
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
	},
	//删除公告
	deleteNotice(row){
		this.soldOutstatus = row
		this.deleleOut=!this.deleleOut

	},
	//启用公告
	openNotice(row){
		let data = {
			id:row.id,
			status:0
		}
		noticeStatus(data).then(res => {
		  if (res.code == 0) {
		    this.dialogFormVisible = false;
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
	},
	//关闭公告
	outNotice(row){
		let data = {
			id:row.id,
			status:1
		}
		noticeStatus(data).then(res => {
		  if (res.code == 0) {
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
	},
	//编辑公告
	editorNotice(row){
		console.log(row)
		this.isAdd = false
		this.information.id = row.id
		this.information.title = row.title
		this.information.content = row.content
		this.information.type = row.type
		this.information.status = 1
		this.information.pushStatus = row.pushStatus
		this.information.linkId = row.linkId
		this.information.sendTime = row.sendTime
		this.dialogFormVisible = !this.dialogFormVisible;
	},
    // 审核
    handleStart(row) {
      this.temp.id = row.id;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
		console.log(this.information)
		// return
		if(this.isAdd){
			noticeAdd(this.information).then(res => {
			  if (res.code == 0) {
			    this.dialogFormVisible = false;
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
			noticeEdit(this.information).then(res => {
			  if (res.code == 0) {
			    this.dialogFormVisible = false;
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
