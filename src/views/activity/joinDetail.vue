<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickName"
        clearable
        placeholder="请输入用户昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        clearable
        placeholder="请输入用户手机号"
        style="width: 200px;"
        class="filter-item"
        maxlength="11"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item topMagin" type="primary" @click="search">查询</el-button>
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
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑奖码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.codeTime }}</span>
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
    <!-- 加入黑名单 -->
  </div>
</template>

<script>
import { activityCodeDetailApi } from "@/api/activity.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import checkPermission from "@/utils/permission";
export default {
  name: "joinDetail",
  components: {
    Pagination
  },
  directives: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        nickName: undefined,
        phone: undefined,
        activityId: undefined
      },
      positionList: [],
      dialogFormVisible: false,
    };
  },
  created() {
    this.listQuery.activityId = this.$route.query.activityId
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
      activityCodeDetailApi(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
        this.listLoading = false;
      });
    },

    search() {
      this.listQuery.current = 1;
      this.getList();
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
