<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phone"
        placeholder="电话"
        style="width: 220px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.time"
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
		icon="el-icon-edit"
	    @click="handleAddData(0)"
	  >添加拍客领袖</el-button>
	  <el-button
	    class="filter-item"
	    type="primary"
	  		icon="el-icon-edit"
	    @click="handleAddData(1)"
	  >添加合伙人</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="650"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="电话" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.phone }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领袖到期时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaderExpireTime }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="合伙人到期时间" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.agentExpireTime }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="操作" align="center">
	    <template slot-scope="scope">
	       <el-button type="text" size="mini" @click="handleUpdata(scope.row,0)">修改领袖</el-button>
	       <el-button type="text" size="mini" @click="handleUpdata(scope.row,1)">修改合伙人</el-button>
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
	
	
	<!-- 领袖管理 -->
	<el-dialog title="领袖管理" :visible.sync="dialogFormVisible">
	  <el-form
	    ref="dataForm"
	    :model="information"
	    label-position="left"
	    label-width="100px"
	    style="width: 400px; margin-left:50px;"
	  >
		<el-form-item
		  label="手机号"
		  prop="phone"
		>
		  <el-input v-model="information.phone" style="width: 200px" />
		</el-form-item>
		<el-form-item label="到期时间">
		  <el-date-picker
		    type="date"
		    placeholder="选择日期"
		    format="yyyy 年 MM 月 dd 日"
		    value-format="yyyy-MM-dd"
		    v-model="information.expireTime"
		  ></el-date-picker>
		</el-form-item>
	  </el-form>
	 
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取消</el-button>
	    <el-button type="primary"   @click="updateData()">提交</el-button>
	  </div>
	</el-dialog>
	
  </div>
</template>

<script>
import {
  isLeaderLists, 
  isLeaderSaveOrUpdate
} from "@/api/users";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import qs from "qs";
import checkPermission from "@/utils/permission";


export default {
  name: "users",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      SendIncomeTime: undefined, //寄拍导出的时间筛选
      listQuery: {
        current: 1,
        size: 10,
        phone: '',
      },
	  types:0,
	  information:{},
      rules: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "详情",
        create: "添加"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 权限管理
    checkPermission,
    bidsrecords(row) {
      this.$router.push({ path: "bidRecord", query: { userId: row.userId } });
    },
	handleUpdata(row,type){
		console.log(row)
		this.dialogFormVisible=true
		this.information=row
		this.types =type
	},
	handleAddData(type){
		this.dialogFormVisible=true
		this.information={}
		this.types = type
	},
	updateData(){
		let data={
			phone:this.information.phone,
			expireTime:this.information.expireTime,
			type : this.types
		}
		isLeaderSaveOrUpdate(data).then(res => {
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
    getList() {
      this.listLoading = true;
      this.listQuery.time ? (this.listQuery.startTime = this.listQuery.time[0],this.listQuery.endTime = this.listQuery.time[1]):
      (this.listQuery.startTime = '',this.listQuery.endTime = '')
      isLeaderLists(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);

        setTimeout(() => {
          this.listLoading = false;
        }, 10);
      });
    },
    handleFilter() {
      this.listQuery.current = 1;
      this.getList();
    },
  }
};
</script>
