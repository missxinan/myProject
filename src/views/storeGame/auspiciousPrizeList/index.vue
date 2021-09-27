<template>
  <div class="app-container">
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
		  <el-table-column label="drawId" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.drawId }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="奖品名称" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.drawName }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="奖品图片" align="center" width="160">
		    <template slot-scope="scope">
		          <img class="goods_image" :src="scope.row.drawImage" />
		    </template>
		  </el-table-column>
		  <el-table-column label="中奖概率" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.drawRate }}</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="奖励类型" align="center" >
		    <template slot-scope="scope">
			  <span v-if="scope.row.drawType == 1">芒果币</span>
			  <span v-if="scope.row.drawType == 2">现金红包</span>
			  <span v-if="scope.row.drawType == 3">下次翻倍</span>
			  <span v-if="scope.row.drawType == 4">实物奖励</span>
		    </template>
		  </el-table-column>
		  <el-table-column label="芒果币励系数/翻倍奖励倍数" align="center">
		    <template slot-scope="scope">
		      <span>{{ scope.row.drawScale }}</span>
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
	  <!-- 抽奖奖品 -->
	  <el-dialog title="抽奖奖品" :visible.sync="dialogAuditVisible">
	    <el-form
	      ref="dataForm"
	      :model="temp"
	      label-position="left"
	      label-width="100px"
	      style="width: 650px; margin-left:50px;"
	    >
		  <el-form-item label="奖励名称:"> 
		    <el-input @input="change($event)" v-model="temp.drawName"/>
		  </el-form-item>
		  <el-form-item label="奖品图片">
		  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
		  	 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
		  		<i class="el-icon-plus"></i>
		  	</el-upload>
		  	<el-dialog :visible.sync="dialogVisible">
		  		<img width="100%" :src="temp.drawImage" alt="">
		  	</el-dialog>
		  </el-form-item>
		  <el-form-item label="中奖概率:">
		    <el-input @input="change($event)" v-model="temp.drawRate"/>
		  </el-form-item>
		  <el-form-item label="奖励类型: " prop="status">
		    <el-radio v-model="temp.drawType" label="1">芒果币</el-radio>
		    <el-radio v-model="temp.drawType" label="2">现金红包</el-radio>
		    <el-radio v-model="temp.drawType" label="3">下次翻倍</el-radio>
		    <el-radio v-model="temp.drawType" label="4">实物奖励</el-radio>
		  </el-form-item>
		  <el-form-item  label="芒果币励系数/红包金额/翻倍倍数:">
		    <el-input v-model="temp.drawScale"
			@input="change($event)" 
		  		oninput="value=value.replace(/[^\d.]/g,'')"
		  		/>
		  </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="signClance()">取消</el-button>
	      <el-button type="primary"  @click="addOrUpdataAudit()">提交</el-button>
	    </div>
	  </el-dialog>
  </div>
</template>

<script>
import {
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
        fetchPrizeList(this.userlistQuery).then(response => {
          this.mangolist = response.data.records;
          this.mangototal = Number(response.data.total);
          this.listLoading = false;
        });
      
    },
	signClance(){
		this.dialogAuditVisible = false
		this.getList();
	},
	addOrUpdataAudit(){
	  this.$refs["dataForm"].validate(valid => {
	    if (valid) {
			console.log(this.temp)
			// return
			this.submitClick = true
			fetchPrizeEdit(this.temp).then(res => {
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
	  console.log(row)
	  this.temp = row
	  this.temp.drawType = String(this.temp.drawType)
	  this.dialogAuditVisible = true;
	  // this.$nextTick(() => {
	  //   this.$refs["dataForm"].clearValidate();
	  // });
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
						that.temp.drawImage = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
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
		this.temp.drawImage = ''
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
