<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phone"
        placeholder="手机号"
        style="width: 220px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button @click="addShareholder">添加虚拟股东</el-button>
    </div>
    <div style="height: 20px;"></div>
    <el-table
      :key="tableKey"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="650"
    >
      <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.email  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级用户电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.parentPhone  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.amount  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.remark  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status == '1' ? '正常' : '禁用'  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.stopTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  fixed="right" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="text"
            size="mini"
            @click="userEdit(row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            @click="resetPassword(row)"
          >重置密码</el-button>
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
    <el-dialog title="虚拟股东" :visible.sync="shareholderVisible">
      <el-form
        ref="integralDataForm"
        :model="shareholderData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="手机号" class="is-required">
          <el-input v-model="shareholderData.phone" :disabled="robotType == 'edit' "/>
        </el-form-item>
        <el-form-item label="身份证" class="is-required">
          <el-input v-model="shareholderData.idCard" />
        </el-form-item>
        <el-form-item label="姓名" class="is-required">
          <el-input v-model="shareholderData.userName" />
        </el-form-item>
        <el-form-item label="邮箱" class="is-required">
          <el-input v-model="shareholderData.email" />
        </el-form-item>
        <el-form-item label="截止时间" class="is-required">
          <el-date-picker
                v-model="shareholderData.stopTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上级用户电话">
          <el-input v-model="shareholderData.parentPhone" />
        </el-form-item>
        <el-form-item label="签约金额" class="is-required">
          <el-input v-model="shareholderData.amount" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="shareholderData.remark" />
        </el-form-item>
        <el-form-item label="状态" class="is-required">
          <el-radio-group v-model="shareholderData.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareholderVisible = false">取消</el-button>
        <el-button type="primary" v-if="robotType == 'add'" @click="addShareholderUpdate()">提交</el-button>
        <el-button type="primary" v-if="robotType == 'edit'" @click="userEditUpdate()">提交</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->

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
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { virtualHoldListApi, virtualHoldAddApi, virtualHoldEditApi, resetPasswordApi } from '@/api/shareholder.js'

export default {
  name: "shareholder",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      SendIncomeTime: undefined, //寄拍导出的时间筛选
      listQuery: {
        current: 1,
        size: 10,
        phone:""
      },
      temp: {
        name: "",
        firstChar: ""
      },
      userAvatar: false,
      userAvatarData: {
        avatar: ""
      },
      shareholderVisible:false,
      shareholderData:{
        status:'1'
      },
      robotType:'add'
    };
  },
  created() {
    this.getList();
  },
  methods: {
    bidsrecords(row) {
      this.$router.push({ path: "bidRecord", query: { userId: row.userId } });
    },
    getList() {
      // this.listLoading = true;
      this.listQuery.phone == ""
        ? (this.listQuery.phone = undefined)
        : "",
      virtualHoldListApi(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = Number(response.data.total);
        this.listLoading = false;
      });
    },
    addShareholder(row) {
      this.resetTemp()
      this.robotType = 'add'
      this.shareholderVisible = true;
    },
    resetPassword(row){
      resetPasswordApi({userId:row.userId}).then(res => {
        if (res.code == 0) {
          this.shareholderVisible = false;
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
    addShareholderUpdate() {
      virtualHoldAddApi(this.shareholderData).then(res => {
        if (res.code == 0) {
          this.shareholderVisible = false;
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
      this.listQuery.current = 1;
      this.getList();
    },
    resetTemp() {
      this.shareholderData = {
        status: "1",
      };
    },
    userEdit(row) {
      this.robotType = 'edit'
      row.status = row.status + ''
      this.shareholderData =JSON.parse(JSON.stringify(row))
      this.shareholderVisible = true;
    },
    userEditUpdate(){
      virtualHoldEditApi(this.shareholderData).then(res => {
        if (res.code == 0) {
          this.shareholderVisible = false;
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
    //邮箱正则 inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  }
};
</script>
