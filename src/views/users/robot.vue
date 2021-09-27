<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        placeholder="用户名称"
        style="width: 220px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button @click="changeAvatar">添加虚拟用户</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="650"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="昵称" align="center" property="nickname">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img
            style="width: 60px;height: 60px;border-radius: 50%;"
            :src="scope.row.avatar"
          />
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="text"
            size="mini"
            @click="userEdit(row)"
          >编辑</el-button>
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
    <!-- 更换头像 -->
    <el-dialog title="用户头像" :visible.sync="userAvatar">
      <el-form
        ref="integralDataForm"
        :model="userAvatarData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="头像" class="is-required">
          <img
            width="200px"
            v-if="userAvatarData.avatar"
            class="tempPic"
            :src="userAvatarData.avatar"
            alt
          />
          <el-upload
            ref="upload"
            v-model="userAvatarData.avatar"
            action
            :on-change="getFile"
            :show-file-list="false"
            :auto-upload="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userAvatarData.nickname" maxlength="30"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAvatar = false">取消</el-button>
        <el-button type="primary" v-if="robotType == 'add'" @click="changeAvatarDataUpda()">提交</el-button>
        <el-button type="primary" v-if="robotType == 'edit'" @click="userEditUpdate()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 加入黑名单 -->
  </div>
</template>

<script>
import {
  fetchList,
  usersDetail,
  fansList,
  addRobotApi,
  uploadImgFile,
  robotEditApi
} from "@/api/users";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import qs from "qs";
import checkPermission from "@/utils/permission";


export default {
  name: "users",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      value1: "",
      value2: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      SendIncomeTime: undefined, //寄拍导出的时间筛选
      listQuery: {
        current: 1,
        size: 10,
        type:2
      },
      fansQuery: {
        current: 1,
        size: 20
      },
      fansTotal: 0,
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        name: "",
        firstChar: ""
      },
      rules: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "详情",
        create: "添加"
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      fans: false,
      fansList: [],
      // 余额弹窗
      moneyDialog: false,
      isEarnings: "0",
      isSendMsg: "1",
      moneyData: {},
      // 积分弹窗
      integralDialog: false,
      integralData: {
        superIntegralAmount: ""
      },
      // 用户头像
      userAvatar: false,
      userAvatarData: {
        avatar: ""
      },
      robotType:'add'
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
    getList() {
      this.listLoading = true;
      this.listQuery.nickname == ""
        ? (this.listQuery.nickname = undefined)
        : "",
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);

        setTimeout(() => {
          this.listLoading = false;
        }, 10);
      });
    },
    // 上传头像
    getFile(file, fileList) {
      let formDate = new FormData();
      formDate.append("multipartFileList", file.raw);
      uploadImgFile(formDate).then(resp => {
        if (resp.code == 0) {
          this.userAvatarData.avatar = resp.data[0];
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          });
        }
      });
    },
    changeAvatar(row) {
      this.robotType = 'add'
      this.userAvatarData.avatar = "";
      this.userAvatar = true;
    },
    changeAvatarDataUpda() {
      addRobotApi(this.userAvatarData).then(res => {
        if (res.code == 0) {
          this.userAvatar = false;
          this.$message({
            message: "操作Success",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    handleFilter() {
      if (this.listQuery.name == "") {
        this.listQuery.name = undefined;
      } else if (this.listQuery.status == "") {
        this.listQuery.status = undefined;
      }
      this.listQuery.current = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        name: "",
        firstChar: ""
      };
    },
    userEdit(row) {
      this.robotType = 'edit'
      this.userAvatarData = row
      this.userAvatar = true;
    },
    userEditUpdate(){
      robotEditApi(this.userAvatarData).then(res => {
        if (res.code == 0) {
          this.userAvatar = false;
          this.$message({
            message: "操作Success",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
