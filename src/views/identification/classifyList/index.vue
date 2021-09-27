<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item topMagin"
        type="primary"
        @click="toAddClassify"
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
	  <el-table-column label="分类图片" align="center" >
	    <template slot-scope="scope">
			  <span v-for="(item,index) in scope.row.classifyImageArray" :key="index">
			  <img class="goods_image"  :src="item" />
			  </span>
	    </template>
	  </el-table-column>
	  <el-table-column label="分类名称" align="center">
	    <template slot-scope="scope">
	      <span >{{ scope.row.classifyName }}</span>
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
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">激活</span>
          <span v-if="scope.row.status == 1">未激活</span>
        </template>
      </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status == 0" type="primary" size="mini" @click="classifyDataEdit(row)">编辑</el-button>
           <el-button type="primary" size="mini" @click="classifyForbidden(row)">{{ row.status == 1 ? '激活' : '关闭' }}</el-button>
		   <el-button v-if="row.status == 1" type="info" size="mini" @click="classifyDatadelete(row)">删除</el-button>
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
	
	
	<!-- 添加编辑鉴品分类 -->
	<el-dialog title="添加编辑鉴品分类" :visible.sync="dialogFormVisible">
	  <el-form
	    :model="classifyData"
	    label-position="left"
	    label-width="100px"
	    style="width: 500px; margin-left:50px;"
	  >
	  <el-form-item  label="分类名称: " >
	    <el-input v-model="classifyData.classifyName"/>
	  </el-form-item>
	  <el-form-item label="分类图片" prop="avatar">
	  	<draggable v-model="classifyImageArry" >
	  		<div class="pic-preview" v-for="(item,index) in classifyImageArry" :key="index">
	  			<div class="hidden-block"><i class="el-icon-delete" @click="removeImg(index)"></i></div>
	  			<img :src="item" />
	  		</div>
	  	</draggable>
	  	<moreImgUpload color="#1890ff"  @successCBK="imageSuccessCBK" />
	  </el-form-item>
	  <el-form-item label="状态：">
	  	<el-switch
	  	  v-model="classifyData.open"
	  	  @change="change($event)"
	  	  active-color="#13ce66"
	  	  inactive-color="#ff4949">
	  	</el-switch>
	  </el-form-item>
	  <el-form-item label="权重">
	    <el-input v-model="classifyData.sort"
	  		oninput="value=value.replace(/[^\d.]/g,'')"
	  		/>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取消</el-button>
	    <el-button type="primary" @click="classifyAddUpdate()">提交</el-button>
	  </div>
	</el-dialog>
	
	
	
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import {
		addClassifySave,
		fetchClassifyList,
		updataClassifyStatus,
		deleteClassify,
		updataClassify
	} from "@/api/identification.js";
import { getToken } from '@/utils/auth';
import draggable from 'vuedraggable';
import moreImgUpload from "@/components/moreImgUpload";
import URL  from "@/utils/url"
export default {
  name: "AppraiserList",
  components: {
  	Pagination,
  	draggable,
  	moreImgUpload
  },
  directives: {},
  inject:['reload'],
  data() {
    return {
      tableKey: 0,
      list: null,
	  classifyNameArr:[],
	  classifyData:{
		  open:false
	  },
	  classifyImageArry:[],
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10
      },
      positionList: [],
      dialogFormVisible: false,
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
      fetchClassifyList(this.listQuery).then(response => {
        this.list = response.data.records;
		this.list.forEach((v,index) => {
			console.log(v , index)
			this.list[index].classifyImageArray = this.list[index].classifyImage.split(',')
		})
        this.total = Number(response.data.total);
        this.listLoading = false;
      });
    },
	change(e){
		this.$forceUpdate()
	},
	classifyAddUpdate(){
		// if(!this.classifyImageArry.length){
		// 	this.$message.error('至少上传一张品类图！');
		// 	return;
		// }
		this.classifyData.status = this.classifyData.open ? 0 : 1 ;
		this.classifyData.classifyImage = this.classifyImageArry.join(',')
		console.log(this.classifyData)
		if(this.classifyData.id){
			this.classifyUpdate()
		}else{
			this.classifyAdd()
		}
	},
	classifyAdd(){
		let data = this.classifyData
		addClassifySave(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogFormVisible = false
			this.classifyData = {open:false}
		    this.getList();
			this.reload();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
	classifyUpdate(){
		let data = this.classifyData
		updataClassify(data).then(res=>{
		  if( res.code == 0 ){
		    this.$message({
		      type: 'success',
		      message: '操作成功!'
		    });
			this.dialogFormVisible = false
			this.classifyData = {open:false}
			this.getList();
			this.reload();
		  }else{
		    this.$message.error(res.msg);
		
		  }
		})
	},
	imageSuccessCBK(arr) {
		const _this = this
		arr.forEach(v => {
			console.log(v)
			if(this.classifyImageArry.length < 9){
				this.classifyImageArry.push(v.url.split('?')[0])
			}
		})
	},
	removeImg(index){
		this.classifyImageArry.splice(index,1);
	},
    toAddClassify(){
      // this.$router.push({ path: "inviteData"});
	  this.dialogFormVisible=true
	  this.classifyData = {open:false}
    },
	classifyDatadelete(row){
		  console.log(row,'row')
		   this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      deleteClassify({ id:row.id }).then(res=>{
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
    classifyForbidden(row){
      console.log(row,'row')
       this.$confirm('此操作将修改数据状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status = row.status == '1' ? '0' : '1'
          updataClassifyStatus({ id:row.id,status }).then(res=>{
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
    classifyDataEdit(row){
      console.log(row)
	  this.classifyImageArry = row.classifyImage.split(',')
	  this.classifyData=row
	  this.classifyData.open = row.status == 0 ? true : false ;
	  this.dialogFormVisible = true
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
