<template>
  <div class="app-container">
    <div class="filter-container">
		<el-select
		  v-model="listQuery.regionId"
		  placeholder="区域"
		  clearable
		  class="filter-item"
		  style="width: 130px"
		>
		  <el-option
		    v-for="item in regionIdOptions"
		    :key="item.key"
		    :label="item.display_name"
		    :value="item.key"
		  />
		</el-select>
		
		<el-select
		  v-model="listQuery.status"
		  placeholder="状态"
		  clearable
		  class="filter-item"
		  style="width: 130px"
		>
		  <el-option
		    v-for="item in couponStatusOptions"
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
      <el-button
        class="filter-item topMagin"
        type="primary"
        @click="toAddCoupon"
      >添加</el-button>
	 <!-- <el-button
	    class="filter-item topMagin"
	    type="primary"
	    @click="toSendCoupon"
	  >发放</el-button> -->
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
	  <el-table-column label="id" align="center" width="100px">
	    <template slot-scope="scope">
	      <span>{{ scope.row.id }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="图片" align="center" width="160">
	    <template slot-scope="scope">
	          <img class="goods_image" :src="scope.row.img" />
	    </template>
	  </el-table-column>
	  <el-table-column label="区域" align="center">
	    <template slot-scope="scope">
	     <span v-if="scope.row.regionId == 4">直购</span>
	     <span v-if="scope.row.regionId == 14">捡漏</span>
	    </template>
	  </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">满减</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="优惠券名称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.name }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="优惠券名称" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.name }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="优惠券开始时间" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.startTime }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="优惠券结束时间" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.endTime }}</span>
	    </template>
	  </el-table-column>
      <el-table-column label="优惠券金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="金额满" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.fullMoney }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="说明" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.remark }}</span>
	    </template>
	  </el-table-column>
	  <el-table-column label="状态" align="center">
	    <template slot-scope="scope">
		  <span v-if="scope.row.status == 0">未开始</span>
		  <span v-if="scope.row.status == 1">进行中</span>
		  <span v-if="scope.row.status == 2">已结束 </span>
	    </template>
	  </el-table-column>
	  <el-table-column label="类型" align="center">
	    <template slot-scope="scope">
	  		  <span v-if="scope.row.receiveType == 0">其他</span>
	  		  <span v-if="scope.row.receiveType == 1">新人</span>
	    </template>
	  </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="{row}">
          <el-button  type="primary" size="mini" @click="couponDataEdit(row)">编辑</el-button>
		   <el-button type="info" size="mini" @click="appraiserDataDelete(row)">关闭</el-button>
		   <el-button type="primary"  size="mini"  @click="toSendCoupon(row)"  >发放</el-button>
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
	
	
	<!-- 优惠券管理 -->
	<el-dialog title="优惠券管理" :visible.sync="dialogFormVisible">
	  <el-form
	    :model="appraiserData"
	    label-position="left"
	    label-width="120px"
	    style="width: 500px; margin-left:50px;"
	  >
	  <el-form-item label="优惠券名称">
	    <el-input @input="change($event)" v-model="appraiserData.name"/>
	  </el-form-item>
	  <el-form-item label="区域">
	    <el-select
		  v-model="appraiserData.regionId"
		  placeholder="区域"
		  clearable
		  class="filter-item"
		  style="width: 130px"
		>
		  <el-option
			v-for="item in regionIdOptions"
			:key="item.key"
			:label="item.display_name"
			:value="item.key"
		  />
		</el-select>
	  </el-form-item>
	  <el-form-item label="状态" v-if="appraiserData.id">
	    <el-select
	      v-model="appraiserData.status"
	      placeholder="状态"
	      clearable
	      class="filter-item"
	      style="width: 130px"
	    >
	      <el-option
	        v-for="item in couponStatusOptions"
	        :key="item.key"
	        :label="item.display_name"
	        :value="item.key"
	      />
	    </el-select>
	  </el-form-item>
	 
	  <el-form-item label="图片地址" prop="img" v-if="appraiserData.id">
	  	<el-upload action="" list-type="picture-card" :limit="1" :auto-upload="false"
	  	 :on-change="getFile" :on-preview="handlePictureCardPreviewHeader" :on-remove="handleRemove">
	  		<i class="el-icon-plus"></i>
	  	</el-upload>
	  	<el-dialog :visible.sync="dialogVisible">
	  		<img width="100%" :src="appraiserData.img" alt="">
	  	</el-dialog>
	  </el-form-item>
	  <el-form-item label="开始时间">
	    <div class="ax_200">
	        <el-date-picker
	          v-model="appraiserData.startTime"
	          type="datetime"
	    	  value-format="yyyy-MM-dd HH:mm:ss"
	          placeholder="选择开始时间">
	        </el-date-picker>
	      </div>
	  </el-form-item>
	  <el-form-item label="结束时间">
	    <div class="ax_200">
	        <el-date-picker
	          v-model="appraiserData.endTime"
	          type="datetime"
	    	    value-format="yyyy-MM-dd HH:mm:ss"
	          placeholder="选择结束时间">
	        </el-date-picker>
	      </div>
	  </el-form-item>
	  <el-form-item @input="change($event)" label="优惠券金额">
	    <el-input v-model="appraiserData.money"
		oninput="value=value.replace(/[^\d.]/g,'')"
		/>
	  </el-form-item>
	  <el-form-item @input="change($event)" label="金额满">
	    <el-input v-model="appraiserData.fullMoney"
	  		oninput="value=value.replace(/[^\d.]/g,'')"
	  		/>
	  </el-form-item>
	  <el-form-item @input="change($event)" label="优惠券的说明">
	    <el-input
	    	class="item-input-text"
	    	type="textarea"
	    	:rows="3"
	    	placeholder="请输入内容"
	    	v-model="appraiserData.remark"
	    	maxlength="50"
	    	show-word-limit
	    >
	    </el-input>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取消</el-button>
	    <el-button type="primary" @click="couponAddUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	
	<!-- 发放 -->
	<el-dialog title="发放" :visible.sync="dialogSendVisible">
	  <el-form
	    ref="dataForm"
	    :model="temp"
	    label-position="left"
	    label-width="100px"
	    style="width: 400px; margin-left:50px;"
	  >
	  <el-form-item  label="优惠券id">
	    <span>{{temp.id}}</span>
	  </el-form-item>
		<el-form-item label="标识">
		  <el-select
				  v-model="temp.flag"
				  placeholder="标识"
				  clearable
				  class="filter-item"
				  style="width: 130px"
				>
				  <el-option
					v-for="item in flagOptions"
					:key="item.key"
					:label="item.display_name"
					:value="item.key"
				  />
				</el-select>
		</el-form-item>
		<el-form-item label="注册时间起点" v-if="this.temp.flag==3">
		  <div class="ax_200">
		      <el-date-picker
		        v-model="temp.registerTimeStart"
		        type="datetime"
		  	  value-format="yyyy-MM-dd HH:mm:ss"
		        placeholder="选择时间">
		      </el-date-picker>
		    </div>
		</el-form-item>
		<el-form-item label="注册时间终点" v-if="this.temp.flag==3">
		  <div class="ax_200">
		      <el-date-picker
		        v-model="temp.registerTimeEnd"
		        type="datetime"
		  	    value-format="yyyy-MM-dd HH:mm:ss"
		        placeholder="选择时间">
		      </el-date-picker>
		    </div>
		</el-form-item>
		<el-form-item @input="change($event)" label="手机号" v-if="this.temp.flag==4">
		  <el-input v-model="temp.phoneList" placeholder="手机号多个使用英文逗号隔开"/>
		</el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogSendVisible = false">取消</el-button>
	    <el-button type="primary"  @click="couponSend()">提交</el-button>
	  </div>
	</el-dialog>
	
	
  </div>
</template>

<script>
import {
		fetchCouponList,
		addCouponSave,
		updateCoupon,
		closeCoupon,
		sendCoupon
	} from "@/api/coupon.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		uploadFileList,
		inputOnchange
	} from "@/api/Newcompilation.js";
const regionIdOptions = [
  { key: "", display_name: "全部" },
  { key: "4", display_name: "直购" },
  { key: "14", display_name: "捡漏" },
];
const couponStatusOptions = [
  { key: "", display_name: "全部" },
  { key: "0", display_name: "未开始" },
  { key: "1", display_name: "进行中" },
  { key: "2", display_name: "已结束" },
];
const flagOptions = [
  { key: "1", display_name: "新人  " },
  { key: "2", display_name: "全体 " },
  { key: "3", display_name: "时间段" },
  { key: "4", display_name: "手机号" },
];
export default {
  name: "CouponList",
  components: {
    Pagination
  },
  directives: {},
  inject:['reload'],
  data() {
    return {
      tableKey: 0,
      list: null,
	  regionIdOptions,
	  couponStatusOptions,
	  flagOptions,
	  appraiserData:{
		  type:1,
	  },
	  appraiserInfo:{
		  
	  },
	  status: "4",
	  temp: {
	    id: "",
	    status: "",
	    remark: ""
	  },
	  submitClick: false,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
		type:1,
        size: 10,
      },
      positionList: [],
	  dialogSendVisible:false,
      dialogFormVisible: false,
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
      fetchCouponList(this.listQuery).then(response => {
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
	couponAddUpdate(){
		console.log(this.appraiserData)
		if(this.appraiserData.id){
			this.couponUpdate()
		}else{
			this.couponAdd()
			this.appraiserData = {
				type:1,
			}
		}
	},
	couponAdd(){
		console.log(this.appraiserData)
		let data = this.appraiserData
		addCouponSave(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogFormVisible = false
			this.dialogVisible = false
			this.appraiserData = {
				type:1,
			}
		    this.getList();
			this.reload();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
	couponSend(){ 
		this.$refs["dataForm"].validate(valid => {
        if (valid) {
			this.submitClick = true
			if(this.temp.flag==1||this.temp.flag==2){
				this.temp.registerTimeStart = ""
				this.temp.registerTimeEnd = ""
				this.temp.phoneList = ""
			}
			if(this.temp.flag==3){
				this.temp.phoneList = ""
			}
			if(this.temp.flag==4){
				this.temp.registerTimeStart = ""
				this.temp.registerTimeEnd = ""
			}
            sendCoupon(this.temp).then(res => {
              this.submitClick = false
              if (res.code == 0) {
                this.dialogSendVisible = false;
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
      });},
	couponUpdate(){
		console.log(this.appraiserData)
		let data = this.appraiserData
		updateCoupon(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogVisible = false
			this.appraiserData = {
				type:1
			}
			this.dialogFormVisible = false
		    this.getList();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
    toAddCoupon(){
      // this.$router.push({ path: "inviteData"});
	  this.dialogFormVisible=true
    },
	toSendCoupon(row){
		this.dialogSendVisible=true
		this.$nextTick(() => {
		  this.$refs["dataForm"].clearValidate();
		  this.temp.id = row.id
		});
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
						that.appraiserData.img = img_url.split('?')[0] + '?' + imgObj.width + '*' + imgObj.height + '/' + img_url.split('?')[1]	
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
	appraiserDataDelete(row){
		  console.log(row,'row')
		   this.$confirm('此操作将关闭该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      closeCoupon({ id:row.id }).then(res=>{
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
    couponDataEdit(row){
      console.log(row)
	  this.appraiserData = Object.assign({}, row)
	  // this.appraiserData.id = row.id
	  // this.appraiserData.regionId = row.regionId
	  // this.appraiserData.type = row.type
	  // this.appraiserData.name = row.name
	  // this.appraiserData.img = row.img
	  // this.appraiserData.startTime = row.startTime
	  // this.appraiserData.endTime = row.endTime
	  // this.appraiserData.money = row.money
	  // this.appraiserData.status = row.status
	  // this.appraiserData.remark = row.remark
	  // this.appraiserData.fullMoney = row.fullMoney
	  this.dialogFormVisible = true
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
</style>
