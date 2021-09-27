<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
       <el-input
        v-model="listQuery.goodsName"
        clearable
        placeholder="请输入商品名称"
        style="width: 200px;"
        class="filter-item"
        maxlength="16"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.goodsId"
        clearable
        placeholder="请输入商品ID"
        style="width: 200px;"
        class="filter-item"
        maxlength="16"
        @keyup.enter.native="handleFilter"
      />
       <el-select
        v-model="listQuery.activityForm"
        placeholder="商品状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option value="1" key="1" label="上架"></el-option>
        <el-option value="2" key="2" label="下架"></el-option>
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
      <el-table-column label="商品信息" align="center" width="260">
        <template slot-scope="scope">
          <div class="goodsInfo_wrap">
            <div class="goodsImg_wrap">
              <img class="goods_image" :src="scope.row.logo" />
            </div>
            <div class="goods_right">
              <span
                class="goods_name"
              >{{ scope.row.goodsName }}</span>
              <span>{{ scope.row.goodsId }}</span>
            </div>
          </div>
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
      <el-table-column label="已抽件数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.giveNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成本价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">下架</span>
          <span v-if="scope.row.status == 2">上架</span>
        </template>
      </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="activityEdit(row)">编辑</el-button>
           <el-button type="text" size="mini" @click="activityForbidden(row)">{{ row.status == 1 ? '上架' : '下架' }}</el-button>
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

  </div>
</template>

<script>
import {activityGoodsList, activityDelApi, activityForbApi } from "@/api/activity.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
export default {
  name: "activityList",
  components: {
    Pagination
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
        goodsName: undefined,
        goodsType:1
      },
      positionList: [],
      dialogFormVisible: false
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
      activityGoodsList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
         this.listLoading = false;
      });
    },
    toAddActivity(){
      this.$router.push({ path: "drawGoodsAdd"});
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
       this.$confirm('此操作将上架/下架该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status = row.status == '1' ? '2' : '1'
          activityForbApi({ goodsId:row.goodsId,status }).then(res=>{
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
    activityEdit(row){
      this.$router.push({ path: "drawGoodsAdd",query: { goodsId: row.goodsId,edit:'edit'}} );
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
