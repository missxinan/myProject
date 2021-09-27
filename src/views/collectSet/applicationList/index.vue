<template>
  <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="userlistQuery.phone"
            clearable
            placeholder="请输入手机号"
            style="width: 160px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
		  <el-input
		    v-model="userlistQuery.name"
		    clearable
		    placeholder="请输入姓名"
		    style="width: 160px;"
		    class="filter-item"
		    @keyup.enter.native="handleFilter"
		  />
		  <el-select
		    v-model="userlistQuery.status"
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
		  <el-table-column label="姓名" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.name }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="手机号" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.phone }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="状态" align="center" >
		    <template slot-scope="scope">
			  <span v-if="scope.row.status == 0">未处理</span>
			  <span v-if="scope.row.status == 1">成功</span>
			  <span v-if="scope.row.status == 2">失败 </span>
		    </template>
		  </el-table-column>
		  <el-table-column label="备注" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.remarks }}</span>
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
		  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
		    <template slot-scope="{row}">
		      <el-button type="primary" size="mini" @click="updataDataStatus(row)">编辑</el-button>
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
	  <el-dialog title="审核" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 400px; margin-left:50px;"
	    >
	      <el-form-item label="备注: " prop="remarks">
	        <textarea v-model="temp.remarks" maxlength="100"></textarea>
	      </el-form-item>
	      <el-form-item label="修改状态: " prop="status">
	        <el-radio v-model="status" label="1">成功</el-radio>
	        <el-radio v-model="status" label="2">失败</el-radio>
	      </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogAuditVisible = false">取消</el-button>
	      <el-button type="primary"  @click="statusUpdataAudit()">提交</el-button>
	    </div>
	  </el-dialog>
  </div>
</template>

<script>
import {
  fetchCollectList,
  updataStatus
} from "@/api/collect.js";
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
	  temp: {
	    id: "",
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
        fetchCollectList(this.userlistQuery).then(response => {
          this.mangolist = response.data.records;
          this.mangototal = Number(response.data.total);
          this.listLoading = false;
        });
      
    },
	statusUpdataAudit(){
	  this.$refs["dataForm"].validate(valid => {
	    if (valid) {
			this.temp.status = this.status;
			this.submitClick = true
	        updataStatus(this.temp).then(res => {
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
	updataDataStatus(row) {
	  this.temp.id = row.id;
	  this.dialogAuditVisible = true;
	  this.$nextTick(() => {
	    this.$refs["dataForm"].clearValidate();
	  });
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
