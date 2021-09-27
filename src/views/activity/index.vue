<template>
  <div class="app-container">
    <div class="filter-container">
       <el-input
        v-model="listQuery.activityName"
        clearable
        placeholder="请输入活动名称"
        style="width: 200px;"
        class="filter-item"
        maxlength="16"
        @keyup.enter.native="handleFilter"
      />
     <!-- <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker> -->
      <el-select
        v-model="listQuery.status"
        placeholder="活动状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option value="" key="" label="全部"></el-option>
        <el-option value="0" key="0" label="已关闭"></el-option>
        <el-option value="1" key="1" label="开启中"></el-option>
        <!-- <el-option value="3" key="3" label="已结束"></el-option> -->
      </el-select>
      <el-button
        class="filter-item topMagin"
        type="primary"
        @click="search"
      >查询</el-button>
      <el-button
        class="filter-item topMagin"
        @click="reset"
      >重置</el-button>
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
     <el-table-column label="活动id" align="center">
       <template slot-scope="scope">
         <span>{{ scope.row.id }}</span>
       </template>
     </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动链接" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.linkUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="更新时间" align="center">
	    <template slot-scope="scope">
	      <span>{{ scope.row.updateTime }}</span>
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
      <el-table-column label="活动状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">关闭</span>
          <span v-if="scope.row.status == 1">开启</span>
          <span v-if="scope.row.status == 2">预览</span>
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="text"  size="mini" @click="activityMoreEdit(row)">更多编辑</el-button> -->
          <!-- <el-button type="text"  size="mini" @click="toJoinDetail(row)">参与详情</el-button> -->
		  <el-button
		    type="primary"
		    size="mini"
		    style="margin-bottom:20px"
		    @click="editorActivity(row)"
		  	v-if="row.status === 0"
		  >编辑</el-button>
		  
		  <el-button
		    size="mini"
		    type="danger"
		    style="margin-bottom:20px"
		    @click="outActivity(row)"
		    v-if="row.status === 1"
		  >关闭</el-button>
		  
		  <el-button
		    size="mini"
		    type="success"
		    style="margin-bottom:20px"
		    @click="openActivity(row)"
		    v-if="row.status === 0"
		  >开启</el-button>
		  
		  <el-button
		    size="mini"
		    type="info"
		    style="margin-bottom:20px"
		    @click="deleteActivity(row)"
			v-if="row.status === 0"
		  >删除</el-button>
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
    <!-- 添加活动 -->
    <el-dialog title="活动添加" :visible.sync="iactivityDialog">
      <el-form
        :model="activityData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
     <!-- <el-form-item label="选择商品" prop="goodsId" class="is-required">
        <el-input v-model="activityData.goodsName" @focus="selectShopping" />
      </el-form-item>
      <el-form-item label="选择赠品" prop="goodsId" class="is-required">
        <el-input v-model="activityData.giveGoodsName" @focus="selectGiveShopping" />
      </el-form-item> -->
	  <el-form-item label="活动名称">
	    <el-input v-model="activityData.activityName"/>
	  </el-form-item>
      <el-form-item label="参与积分">
        <el-input
          v-model.number="activityData.partakeIntegral"
          oninput="value=value.replace(/[^\d.]/g,'')"
        />
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="activityData.time"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
	  <el-form-item label="活动链接">
	    <el-input v-model="activityData.linkUrl"/>
	  </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="iactivityDialog = false">取消</el-button>
        <el-button type="primary" @click="activityAddUpdate()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 选择商品 -->
    <el-dialog :visible.sync="selectSellingGoods" title="选择商品">
      <selectGoods @callback="goodsSecBack"></selectGoods>
    </el-dialog>
    <!-- 选择赠品 -->
    <el-dialog :visible.sync="selectSellingGiveGoods" title="选择赠品">
      <selectGoods @callback="goodsSecGiveBack"></selectGoods>
    </el-dialog>

    <el-dialog title="活动编辑" :visible.sync="activityMoreEditDialog">
      <el-form
        :model="activityMoreData"
        label-position="left"
        label-width="130px"
        style="width: 400px; margin-left:50px;"
      >
      <el-form-item label="活动名称">
       <el-input v-model="activityMoreData.activityName"/>
      </el-form-item>
	  <el-form-item label="开始时间">
	   <span>{{activityMoreData.startTime}}</span>
	  </el-form-item>
	  <el-form-item label="结束时间">
	   <span>{{activityMoreData.endTime}}</span>
	  </el-form-item>
	  <el-form-item label="重新选择活动时间">
	   <el-date-picker
	         v-model="activityTime"
	         type="daterange"
	         range-separator="至"
			 value-format="yyyy-MM-dd HH:mm:00"
	         start-placeholder="开始日期"
	         end-placeholder="结束日期">
	       </el-date-picker>
	  </el-form-item>
	  <!-- <el-form-item label="规则人数">
	   <el-input v-model="activityMoreData.theRules"/>
	  </el-form-item> -->
	  <el-form-item label="参与积分">
	   <el-input v-model="activityMoreData.partakeIntegral"/>
	  </el-form-item>
	  <el-form-item label="H5链接">
	   <el-input v-model="activityMoreData.linkUrl"/>
	  </el-form-item>
      <!-- <el-form-item label="是否开启">
        <el-radio-group v-model="activityMoreData.status">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="activityMoreEditDialog = false">取消</el-button>
        <el-button type="primary" @click="activityMoreAddUpdate()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
	activityListApi,
    activityEditApi,
	activityDetailApi,
	activityAddApi,
	activityInfo,
	activityEditInfo,
	activityNewAdd,
	activityDelete,
	activityChangeStatus} from "@/api/activity.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
import selectGoods from "@/components/selectActivityGoods/index";
export default {
  name: "activityList",
  components: {
    Pagination,
    selectGoods
  },
  directives: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        time: undefined,
        userName: undefined,
        // phone: undefined,
        status: undefined,
        paySource: undefined, // 来源绑定
        payType:undefined,
      },
      positionList: [],
      iactivityDialog: false,
      // 活动信息
      activityData:{},
      // 商品弹窗
      selectSellingGoods:false,
      selectSellingGiveGoods:false,
      activityMoreEditDialog:false,
	  activityTime:[],
      activityMoreData:{
		
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
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : ((this.listQuery.startTime = undefined),
          (this.listQuery.endTime = undefined));
      activityListApi(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
         this.listLoading = false;
      });
    },
    toAddActivity(){
      this.iactivityDialog = true;
    },
	outActivity(row){//关闭活动
		this.$confirm('此操作将关闭该活动, 是否继续?', '提示', {
		   confirmButtonText: '确定',
		   cancelButtonText: '取消',
		   type: 'warning'
		 }).then(() => {
		   activityChangeStatus({ id:row.id,status:0 }).then(res=>{
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
	openActivity(row){//开启活动
		this.$confirm('是否开启活动?', '提示', {
		   confirmButtonText: '确定',
		   cancelButtonText: '取消',
		   type: 'warning'
		 }).then(() => {
		   activityChangeStatus({ id:row.id,status:1 }).then(res=>{
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
	editorActivity(row){//编辑活动
		activityInfo({id:row.id}).then(res=>{
		  if(res.code == 0){
		    this.activityMoreData = res.data
		    this.activityMoreEditDialog = true
		  }else{
		    this.$message.error(res.msg)
		  }
		})
	},
	deleteActivity(row){//删除活动
	   this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
		  confirmButtonText: '确定',
		  cancelButtonText: '取消',
		  type: 'warning'
		}).then(() => {
		  activityDelete({ id:row.id }).then(res=>{
			if( res.code == 0 ){
			  this.$message({
				type: 'success',
				message: '删除成功!'
			  });
			  this.getList();
			}else{
			  this.$message.error(res.msg);
			}
		  })
		})		
	},
    activityDel(row){
       this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          activityDelApi({ activityId:row.activityId }).then(res=>{
            if( res.code == 0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            }else{
              this.$message.error(res.msg);

            }
          })
        })
    },
    activityForbidden(row){
      console.log(row,'row')
       this.$confirm('此操作将禁用/启用该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status = row.status == '1' ? '0' : '1'
          activityForbApi({ activityId:row.activityId,status }).then(res=>{
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
        partakeIntegral:undefined
      }
       this.getList();
    },
    search(){
      this.listQuery.current = 1
      this.getList();
    },
    selectShopping() {
      this.selectSellingGoods = true;
    },
    selectGiveShopping() {
      this.selectSellingGiveGoods = true;
    },
    goodsSecBack(value) {
      console.log(value,'value1')
      this.activityData.goodsId = value.goodsId;
      this.activityData.goodsName = value.goodsName;
      this.selectSellingGoods = false;
    },
    goodsSecGiveBack(value){
      console.log(value,'value2')
      this.activityData.giveGoodsId = value.goodsId;
      this.activityData.giveGoodsName = value.goodsName;
      this.selectSellingGiveGoods = false;
    },
    activityAddUpdate(){
      this.activityData.time ? (this.activityData.startTime = this.activityData.time[0],this.activityData.endTime = this.activityData.time[1]):''
	  console.log(this.activityData)
	  let data = this.activityData
	  data.status=0
	  // return
      activityNewAdd(data).then(res=>{
        if (res.code == "0") {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getList();
          this.iactivityDialog = false;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // activityMoreEdit(row){
    //   activityDetailApi({activityId:row.activityId}).then(res=>{
    //     if(res.code == 0){
    //       this.activityMoreData = res.data.records[0]
    //       this.activityMoreEditDialog = true
    //     }else{
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
    activityMoreAddUpdate(){
		
      let data = {
        id:this.activityMoreData.id,
        activityName:this.activityMoreData.activityName,
		status:0,
        startTime:this.activityMoreData.startTime,
        endTime:this.activityMoreData.endTime,
        linkUrl:this.activityMoreData.linkUrl
      }
	  
	  if(this.activityTime.length>0){
		  data.startTime=this.activityTime[0]
		  data.endTime=this.activityTime[1]
	  }
	  console.log(this.activityTime)
	  console.log(data)
      activityEditInfo(data).then(res=>{
        if(res.code == 0){
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
          this.activityMoreEditDialog = false;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    toJoinDetail(row){
      this.$router.push({ path: "joinDetail",query: { activityId: row.activityId}} );
    },
    activityEdit(row){
      this.$router.push({ path: "activityAdd",query: { activityId: row.activityId,edit:'edit'}} );
    },
    tostatistics(row){
      this.$router.push({ path: "statistics",query: { activityId: row.activityId}} );
    },
    activityCopy(row){
      this.$router.push({ path: "activityAdd",query: { activityId: row.activityId,copy:'copy'}} );
    },
  }
};
</script>
<style scoped="scoped">
.el-form-item__content {
  font-size: 22px;
}
.topMagin {
  margin-top: 20px;
}
.is-require{
  font-size: 14px;
}
</style>
