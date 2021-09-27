<template>
  <div class="headQuarters-list">
    <div class="search-content">
      <div class="item">
        <el-button type="primary" @click="add">新增版本</el-button>
      </div>
      <br />
      <div class="item">
        <el-input v-model="searchParam.verNameCode" placeholder="请输版本名称/版本号" maxlength="10"></el-input>
      </div>
      <div class="item">
        <el-select v-model="searchParam.verType" placeholder="请选择版本类型">
          <el-option
            v-for="item in versionType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-select v-model="searchParam.switchs" placeholder="请选择版本状态">
          <el-option
            v-for="item in versionStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button type="primary" class @click="search">搜索</el-button>
        <el-button type="primary" class @click="reset">重置</el-button>
      </div>
    </div>
    <div class="tablelist">
      <el-table :data="dataList" border class="list" style="width: 100%" max-height="650">
        <el-table-column type="index" label="序列号" align="center" width="100"></el-table-column>
        <el-table-column prop="verName" align="center" label="版本名称"></el-table-column>
        <el-table-column prop="verCode" align="center" label="版本号"></el-table-column>
        <el-table-column prop="verType" align="center" label="版本类型">
          <template slot-scope="scope">
            <div v-if="scope.row.verType === 'Android'">安卓</div>
            <div v-if="scope.row.verType === 'ios'">苹果</div>
            <div v-if="scope.row.verType === 'androidCustomMade'">安卓定制版</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" align="center" label="描述"></el-table-column>
        <el-table-column prop="createTime" align="center" label="上传时间"></el-table-column>
        <el-table-column prop="createBy" align="center" label="所属管理员"></el-table-column>
        <el-table-column prop="switchs" align="center" label="状态">
          <template slot-scope="scope">
            <div>{{scope.row.switchs === 0?'未发布': '已发布'}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-blue" @click="edit(scope.row)">编辑</span>
              <span
                v-if="scope.row.switchs === 1"
                class="table-btn btn-blue"
                @click="close(scope.row)"
              >关闭</span>
              <span
                v-if="scope.row.switchs === 0"
                class="table-btn btn-blue"
                @click="open(scope.row)"
              >打开</span>
              <span class="table-btn btn-red" @click="deleteVersion(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="showVersion" width="30%" :before-close="closeVersion">
      <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="item-span span-icon">版本名称：</span>
          <el-input
            :disabled="editData.switchs == 1"
            type="textarea"
            maxlength="20"
            v-model="verName"
            class="inputs"
            placeholder="请输入版本名称"
            show-word-limit
          ></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span span-icon">版本类型：</span>
          <el-select
            :disabled="editData.switchs == 1"
            class="item-input"
            v-model="verType"
            placeholder="请选择版本类型"
            @change="typeChange"
          >
            <el-option
              v-for="item in typeArry"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="dialog-item">
          <span class="item-span span-icon">版本号：</span>
          <el-input
            :disabled="editData.switchs == 1"
            class="inputs"
            v-model.number="verCode"
            oninput="value=value.replace(/[^\d.]/g,'')"
            :controls="false"
            :step="1"
            step-strictly
            placeholder="请输入版本号"
          ></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span span-icon">安装模式：</span>
          <el-radio-group v-model="isForce">
            <el-radio :label="0">普通安装</el-radio>
            <el-radio :label="1">强制安装</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-item" v-if="isShowChecked">
          <span class="item-span">是否弹窗：</span>
          <el-checkbox v-model="installChecked">不弹框提示</el-checkbox>
          <!-- <span v-if="!isShowChecked">是（安卓和安卓定制版，选择强制安装后必须弹框）</span> -->
        </div>
        <div class="dialog-item">
          <span class="item-span span-icon">安装包：</span>
          <el-input v-model="fileUrl" class="inputs" placeholder="请输入链接"></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span">说明：</span>
          <el-input
            type="textarea"
            maxlength="100"
            v-model="content"
            class="inputs"
            placeholder="请输入说明"
            show-word-limit
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVersion">取 消</el-button>
        <el-button type="primary" @click="submitVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  versionlist,
  addversion,
  deletversion,
  versioninfoopen,
  versionDetails,
  versionEdit
} from "@/api/versionManagement.js";
export default {
  name: "versionManagement",
  data() {
    return {
      bool:'',
      time: "",
      dataList: [],
      size: 10,
      current: 1,
      total: 0,
      value: null,
      title: "新增版本", // 默认是新增版本
      typeArry: [
        {
          label: "安卓",
          value: "Android"
        },
        {
          label: "苹果",
          value: "ios"
        },
        {
          label: "安卓定制版",
          value: "androidCustomMade"
        }
      ],
      showVersion: false, //新增版本的弹框
      verName: "",
      verType: "",
      verCode: "",
      content: "",
      fileUrl: "",
      isForce: "",
      audited: "",
      verPackage: "",
      installChecked: true, // 不安装提示 默认勾上
      editData: {}, // 编辑数据 默认为{}
      versionType: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "安卓",
          value: "Android"
        },
        {
          label: "安卓定制机",
          value: "androidCustomMade"
        },
        {
          label: "苹果",
          value: "ios"
        }
      ],
      versionStatus: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未发布",
          value: "0"
        },
        {
          label: "已发布",
          value: "1"
        }
      ],
      // 列表搜索条件
      searchParam: {
        verNameCode: undefined,
        verType: undefined,
        switchs: undefined
      }
    };
  },
  created() {
    this.getVersionList();
  },
  computed: {
    isShowChecked() {
      let bool = true;
      if (
        (this.verType == "Android" || this.verType == "androidCustomMade") &&
        this.isForce == 1
      ) {
        bool = false;
      }
      this.bool = bool
      return bool;
    },
  },
  methods: {
    //获取列表
    getVersionList() {
      let data = {
        verNameCode: this.searchParam.verNameCode || undefined,
        verType: this.searchParam.verType || undefined,
        switchs: this.searchParam.switchs || undefined,
        size: this.size,
        current: this.current
      };
      versionlist(data).then(res => {
        if (res.code == "00000") {
          this.dataList = res.data.records;
          this.total = Number(res.data.total);
        } else {
          this.$message({
            message: res.msg || "后台错误",
            type: "error"
          });
        }
      });
    },
    // 搜索
    search() {
      this.current = 1;
      this.getVersionList();
    },
    // 重置
    reset() {
      this.searchParam = {
        verNameCode: undefined,
        verType: undefined,
        switchs: undefined
      };
      this.getVersionList();
    },
    // 分页
    handleCurrentChange(page) {
      this.current = page;
      this.getVersionList();
    },
    // 条数
    handleSizeChange(page) {
      this.size = page;
      this.getVersionList();
    },
    //关闭添加消息弹框
    closeVersion() {
      this.showVersion = false;
      this.verName = "";
      this.verType = "";
      this.verCode = "";
      this.content = "";
      this.fileUrl = "";
      this.isForce = "";
      this.installChecked = true;
      this.editData = {};
      this.title = "新增版本";
    },
    //弹出添加消息弹框
    add() {
      this.verName = "";
      this.verType = "";
      this.verCode = "";
      this.content = "";
      this.fileUrl = "";
      this.isForce = "";
      this.installChecked = true;
      this.editData = {};
      this.showVersion = true;
    },

    //弹出修改版本弹框
    edit(row) {
      // 根据id获取详情
      // console.log(row);
      versionDetails({ verId: row.verId }).then(res => {
        if (res.code == "00000") {
          this.editData = res.data;
          // 编辑赋值
          this.verName = this.editData.verName || "";
          this.verType = this.editData.verType || "";
          this.verCode = this.editData.verCode || "";
          this.content = this.editData.content || "";
          this.fileUrl = this.editData.fileUrl || "";
          this.isForce = this.editData.isForce;
          // this.installChecked = this.editData.alert == 1 ? false : true;
          if (this.bool) {
            this.installChecked = this.editData.alert == 1 ? false : true;
          }
          this.title = "修改版本";
          this.showVersion = true;
        } else {
          this.$message({
            message: res.msg || "后台错误",
            type: "error"
          });
        }
      });
    },
    //新增消息
    submitVersion() {
      let that = this;
      if (that.verName === "") {
        that.$message({
          message: "请输入应用名称！",
          type: "error"
        });
        return;
      }
      if (that.verType === "") {
        that.$message({
          message: "请选择版本类型！",
          type: "error"
        });
        return;
      }
      if (that.verCode === "") {
        that.$message({
          message: "请选择版本号！",
          type: "error"
        });
        return;
      }
      if (that.isForce === "") {
        that.$message({
          message: "请选择安装模式！",
          type: "error"
        });
        return;
      }
      if (that.fileUrl === "") {
        that.$message({
          message: "请输入安装包！",
          type: "error"
        });
        return;
      }
      let data = {
        verName: that.verName,
        verType: that.verType,
        verCode: that.verCode,
        content: that.content,
        fileUrl: that.fileUrl,
        isForce: that.isForce,
        audited: that.audited,
        verPackage: that.verPackage
        // alert: that.installChecked ? 0 : 1,
      };
      // 满足条件
      if (this.bool) {
        data.alert = that.installChecked ? 0 : 1;
      }
      // editData数据里有id代表为修改
      if (this.editData && this.editData.verId) {
        data.verId = this.editData.verId;
        versionEdit(data).then(res => {
          if (res.code == "00000") {
            that.$message({
              message: "修改版本成功！",
              type: "success"
            });
            that.showVersion = false;
            that.closeVersion();
            that.getVersionList();
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      } else {
        addversion(data).then(res => {
          if (res.code == "00000") {
            that.$message({
              message: "新增版本成功！",
              type: "success"
            });
            that.showVersion = false;
            that.closeVersion();
            that.getVersionList();
          } else {
            that.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      }
    },
    //删除版本
    deleteVersion(row) {
      let that = this;
      let data = {
        verId: row.verId
      };
      deletversion(data).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: "删除版本成功！",
            type: "success"
          });
          that.getVersionList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //开
    open(row) {
      let that = this;
      let data = {
        verId: row.verId,
        switchs: 1
      };
      versioninfoopen(data).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: "放开版本成功！",
            type: "success"
          });
          that.getVersionList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //关
    close(row) {
      let that = this;
      let data = {
        verId: row.verId,
        switchs: 0
      };
      versioninfoopen(data).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: "关闭版本成功！",
            type: "success"
          });
          that.getVersionList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // //  版本类型change
    typeChange(val) {
      const downloadUrl = {
        Android: "http://ppbfx.xinyipaipai.com/xinyipaipai.apk",
        androidCustomMade:
          "http://ppbfx.xinyipaipai.com/xinyipaipai.apk",
        ios: "https://apps.apple.com/cn/app/id1509598746"
      };

      if (downloadUrl[val]) {
        this.fileUrl = downloadUrl[val];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.headQuarters-list {
  padding: 24px;
  .search-content {
    display: block;
    margin-bottom: 20px;
    .item {
      display: inline-block;
      margin-bottom: 24px;
      margin-right: 10px;
    }
    .item-title {
      font-size: 14px;
    }
  }
  .tablelist {
    .list {
      margin-bottom: 30px;
    }
  }
  .table-paging {
    display: flex;
    justify-content: flex-end;
  }
  .passwordBomb {
    .company-name {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .name-text {
        display: inline-block;
        line-height: 40px;
      }
      .name-value {
        display: inline-block;
        width: 300px;
      }
    }
    .company-password {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-around;
      .password-text {
        display: inline-block;
        line-height: 40px;
      }
      .password-text::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
      .password-input {
        display: inline-block;
        width: 300px;
      }
    }
  }
  .dialog-orderMall {
    margin-left: 20px;
    .dialog-item {
      line-height: 50px;
      .item-span {
        display: inline-block;
        width: 100px;
      }
      .span-icon::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
      .inputs {
        width: 300px;
      }
    }
  }
  .table-btn {
    cursor: pointer;
    margin-right: 5px;
  }
  .btn-red {
    color: #f56c6c;
  }
  .btn-blue {
    color: #409eff;
  }
}
.float_line {
  float: left;
  list-style: none;
  margin-right: 20px;
}
</style>
