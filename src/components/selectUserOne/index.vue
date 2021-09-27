<template>
  <div class="goods-choice">
    <el-form
      :inline="true"
      :model="listQuery"
      class="demo-form-inline"
      size="mini"
      style="margin-bottom:10px;"
    >
      <div class="block">
        <el-date-picker
          v-model="listQuery.time"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input v-model="listQuery.nickname" placeholder="请输入昵称" style="width:120px;margin:20px"></el-input>
        <el-input v-model="listQuery.phone" placeholder="请输入手机号" style="width:120px;margin:20px"></el-input>
        <el-select
          v-model="listQuery.blacklist"
          placeholder="状态"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option key label="全部" value />
          <el-option key="0" label="正常" value="0" />
          <el-option key="1" label="一级黑名单" value="1" />
          <el-option key="2" label="二级黑名单" value="2" />
          <el-option key="3" label="三级黑名单" value="3" />
        </el-select>
        <el-select
          v-model="listQuery.registerSource"
          placeholder="注册来源"
          @change="handleSecChange"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option label="全部" value />
          <el-option key="1" label="小程序" value="1" />
          <el-option key="2" label="h5" value="2" />
          <el-option key="3" label="ios" value="3" />
          <el-option key="4" label="Android" value="4" />
          <el-option key="5" label="未知来源" value="5" />
        </el-select>
        <el-select
          v-model="listQuery.registerChannel"
          v-if="listQuery.registerSource == 2"
          placeholder="渠道"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option label="全部" value />
          <el-option
            v-for="item in registerH5"
            :key="item.id"
            :label="item.channelName"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="listQuery.registerChannel"
          v-if="listQuery.registerSource == 4"
          placeholder="渠道"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option label="全部" value />
          <el-option key="2" label="华为" value="2" />
          <el-option key="3" label="360" value="3" />
          <el-option key="4" label="应用宝" value="4" />
          <el-option key="5" label="小米" value="5" />
          <el-option key="6" label="VIVO" value="6" />
          <el-option key="7" label="OPPO" value="7" />
          <el-option key="8" label="其他" value="8" />
          <el-option key="11" label="阿里分发平台" value="11" />
          <el-option key="12" label="百度" value="12" />
          <el-option key="13" label="魅族" value="13" />
          <el-option key="14" label="搜狗" value="14" />success
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="success" @click="submitData">提交</el-button>
      </div>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :row-key="getRowKeys"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      ref="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
      <el-table-column label="注册时间" align="center" width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="userId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.blacklist == 0 ? 'success' : 'danger'"
            v-show="scope.row.blacklist === 0"
          >正常</el-tag>
          <el-tag
            :type=" scope.row.blacklist == 0 ? 'success' : 'danger'"
            v-show="scope.row.blacklist === 1"
          >一级黑名单</el-tag>
          <el-tag
            :type=" scope.row.blacklist == 0 ? 'success' : 'danger'"
            v-show="scope.row.blacklist === 2"
          >二级黑名单</el-tag>
          <el-tag
            :type=" scope.row.blacklist == 0 ? 'success' : 'danger'"
            v-show="scope.row.blacklist === 3"
          >三级黑名单</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册来源" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.registerSource == 1">小程序</span>
          <span v-if="scope.row.registerSource == 2">h5</span>
          <span v-if="scope.row.registerSource == 3">ios</span>
          <span v-if="scope.row.registerSource == 4">Android</span>
          <span v-if="scope.row.registerSource == 5">未知来源</span>
        </template>
      </el-table-column>
      <el-table-column label="二级注册来源" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registerChannelName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <span style="margin-top:10px;">已选{{ selectUserData.length }}人</span>
    <div class="pagination-page">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        :currentPage="listQuery.current"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { fetchList, registerAllListApi } from "@/api/users.js";
export default {
  props: ["selectAllData"],
  name: "selectUserOne",
  components: {
    Pagination
  },
  // const statusListOptions = [
  //   { key: "", display_name: "全部" },
  //   { key: "0", display_name: "正常" },
  //   { key: "1", display_name: "一级黑名单" },
  //   { key: "2", display_name: "二级黑名单" },
  //   { key: "3", display_name: "三级黑名单" }
  // ];
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      options: [],
      props: { multiple: true },
      category: [],
      listQuery: {
        current: 1,
        size: 10,
        nickname: undefined,
        name: undefined,
        blacklist: undefined,
        registerSource: undefined,
        registerChannel: undefined
      },
      total: 0,
      dialogVisible: true, //控制弹框开关
      gridData: [],
      test: [],
      pageSize: 1, //每页
      source: 2,
      // 注册来源
      registerH5: {},
      selectUserData: [], // 全部选中数据
      isClear: false,
      istoggleRowSelection: false,
      // searchA:1
    };
  },
  created() {
    this.selectUserData = this.selectAllData.map(item => {
      item.userId = item.memberId;
      return item;
    });
    this.getList(1);
  },
  methods: {
    search() {
      this.listQuery.current = 1;
      this.$nextTick(function(ite) {
        this.getList();
      });
    },
    reset() {
      this.listQuery = {
        current: 1,
        size: 10,
        nickname: undefined,
        phone: undefined,
        blacklist: undefined,
        registerSource: undefined,
        registerChannel: undefined
      };
      this.getList();
    },
    submitData() {
      let data = [];
      console.log(this.selectUserData,'this.selectUserData')
      this.selectUserData.map(item => {
       const obj = {};
        obj.memberId = item.userId;
        obj.phone = item.phone;
        obj.userName = item.nickname;
        obj.nickname = item.nickname;
        obj.blacklist = item.blacklist;
        obj.createTime = item.createTime;
        obj.registerSource = item.registerSource;
        obj.registerChannel = item.registerChannel;
        obj.registerChannelName = item.registerChannelName;
        data.push(obj);
      });
      this.$emit("callback", data);
    },
    getRowKeys(row) {
      return row.id;
    },
    getList(state) {
      // debugger
      if (state !== 1 && this.selectUserData.length > 0) {
        // alert('11111')
        this.isClear = true;
        this.$refs.table.clearSelection();
      }
      
      
      this.listLoading = true;
      fetchList(this.listQuery).then(res => {
        this.list = res.data.records;
        this.list.map(item => {
          this.selectUserData.map(ite => {
            if (item.userId === ite.userId) {
              this.istoggleRowSelection = false;
              this.$nextTick(function(ite) {
                this.$refs.table.toggleRowSelection(item, true);
              });
            }
          });
        });
        // this.selectUserData.map(ite=>{
        //     this.$refs.table.toggleRowSelection(ite);
        // })
        this.total = Number(res.data.total);
        this.listLoading = false;
      });
    },
    handleSecChange(e) {
      console.log(e, "e");
      this.listQuery.registerChannel = undefined;
      if (e == 2) {
        registerAllListApi().then(res => {
          if (res.code == 0) {
            this.registerH5 = res.data;
          }
        });
      }
    },
    handleSelectionChange(e) {
      console.log(e,'eeeeee',this.selectUserData,this.isClear,this.istoggleRowSelection)
      if (!this.isClear) {
        console.log('tttttt')
        if (!this.istoggleRowSelection) {
          console.log('weweew')
          const selectUserData = []; // 后面
          for(const item of this.selectUserData){
            console.log(item,'item')
            let bool = false;
            for(const currentItem of this.list){
              console.log(currentItem,'currentItem',item.userId, currentItem.userId)
              if(item.userId == currentItem.userId){
                bool = true;
                break;
              }
            }
            if(!bool){
              selectUserData.push(item);
            }
          }
          this.selectUserData = selectUserData.concat(e);
        } else {
           console.log('wewewweeewewewew')
          this.istoggleRowSelection = false;
        }
      } else {
        this.selectUserData =  this.selectUserData.concat(e) 
        this.isClear = false;
      }
    }
  }
};
</script>

<style scoped>
.block {
  margin-top: 20px;
}
.image {
  width: 70px;
  height: 70px;
}
.goods-choice {
  width: 90%;
  height: 100%;
  margin-left: 5%;
}
.btns {
  margin: 20px 0;
}
.paginat {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.paginat .totalShow {
  display: inline-block;
}
.addEditor {
  color: rgb(16, 16, 245);
  float: right;
}
.el-form-item {
  margin-bottom: 10px !important;
  padding: 0;
}
.el-form-item .el-form-item__content {
  line-height: 20px !important;
}
.pagination-page {
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  margin-top: 10px;
}
</style>
