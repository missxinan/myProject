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
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
		  <el-table-column label="扩容次数编号" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.expansionNo }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="扩容费用" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.cost }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="扩容容量" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.volume }}</span>
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
		  <el-table-column label="标志" align="center">
		    <template slot-scope="scope">
		      <span v-if="scope.row.deleted == 0">正常 </span>
		      <span v-if="scope.row.deleted == 1">删除</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="操作" width="160px" align="center" class-name="small-padding fixed-width">
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
	  <!-- 仓库扩容配置 -->
	  <el-dialog title="仓库扩容配置" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 650px; margin-left:50px;"
	    >
		  <el-form-item label="扩容费用:"> 
		    <el-input @input="change($event)" v-model="temp.cost"/>
		  </el-form-item>
		  <el-form-item label="扩容容量:">
		    <el-input @input="change($event)" v-model="temp.volume	"/>
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
	fetchWarehouseList,
	fetchWarehouseAdd,
	fetchWarehouseEdit,
	fetchPrizeList,
	fetchPrizeEdit
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
        fetchWarehouseList(this.userlistQuery).then(response => {
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
				fetchWarehouseEdit(this.temp).then(res => {
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
				fetchWarehouseAdd(this.temp).then(res => {
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
	updataDataStatus(row) {
	  console.log(row)
	  this.temp = {
		    id: "",
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
