<template>
  <div class="headQuarters-list">
    <div class="search-content">
      <div class="item">
        <el-input v-model="listQuery.title" placeholder="请输入消息名称" maxlength="16" show-word-limit></el-input>
      </div>
      <div class="item">
        <el-date-picker
          class="item-picker"
          type="daterange"
          v-model="listQuery.time"
          range-separator="-"
          start-placeholder="发送开始时间"
          end-placeholder="发送结束时间"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div class="item">
        <el-select class="item-input" v-model="listQuery.status" placeholder="请选择发送状态">
          <el-option
            v-for="item in statuArry"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-select class="item-input" v-model="listQuery.isPush" placeholder="请选择是否推送">
          <el-option
            v-for="item in whetherTopushList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-select class="item-input" v-model="listQuery.msgType" placeholder="请选择消息类型">
          <el-option
            v-for="item in msgType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button type="primary" class @click="search">搜索</el-button>
        <el-button type="primary" class @click="reset">重置</el-button>
        <el-button type="primary" class @click="add">添加消息</el-button>
      </div>
    </div>
    <div class="tablelist">
      <el-table :data="dataList" border class="list" style="width: 100%" max-height="650">
        <el-table-column type="index" label="序列号" align="center" width="100"></el-table-column>
        <el-table-column label="消息名称" align="center" prop="title"></el-table-column>
        <el-table-column prop="audience" align="center" label="发送范围">
          <template slot-scope="scope">
            <div>{{scope.row.phone == '0'?'所有人': scope.row.phone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pushType" align="center" label="设备">
          <template slot-scope="scope">
            <div>{{scope.row.pushType === 1 ?'安卓': (scope.row.pushType === 0? '苹果': '安卓/苹果')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" align="center" label="消息内容"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="发送时间" prop="sendTime" align="center"></el-table-column>
        <el-table-column label="是否推送" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.isPush === 0 ?'推送': '不推送'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="发送状态">
          <template slot-scope="scope">
            <div>{{scope.row.status === 0?'未发送': (scope.row.status === 1? '成功': '失败')}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span class="table-btn btn-red" @click="deleteMessage(scope.row)">删除</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.status == 0"
                @click="editMessage(scope.row)"
              >编辑</span>
              <span class="table-btn" @click="detailMessage(scope.row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-paging">
        <pagination
          :total="total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          :currentPage="listQuery.current"
          @pagination="search"
        />
      </div>
    </div>
    <el-dialog title="消息推送" :visible.sync="showMessage" width="50%">
      <div class="dialog-orderMall">
        <div class="dialog-item">
          <span class="item-span">消息名称：</span>
          <el-input
            type="input"
            placeholder="请输入消息名称"
            v-model="message.title"
            class="inputs"
            maxlength="16"
            show-word-limit
          ></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span">消息内容：</span>
          <el-input type="textarea" placeholder="请输入内容" v-model="message.content" class="inputs"></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span">是否推送：</span>
          <el-radio v-model="message.isPush" label="0">是</el-radio>
          <el-radio v-model="message.isPush" label="1">否</el-radio>
        </div>
        <div class="dialog-item">
          <span class="item-span">推送用户类型：</span>
          <el-select v-model="message.audience" placeholder="请选择用户类型">
            <el-option
              v-for="item in usersType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 如果用户选择了部分用户   显示输入手机号-->
        <div class="dialog-item" v-if="message.audience == 0">
          <span class="item-span">输入手机号：</span>
          <el-input
            type="input"
            placeholder="输入手机号码，多账号用逗号隔开（限制100个）"
            v-model="message.phone"
            class="inputs"
          ></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span">广告类型：</span>
          <el-select v-model="message.type" @change="handleClick" placeholder="请选择用户类型">
            <el-option
              v-for="item in advertisingType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="dialog-item" v-if="message.type === '1'">
          <span class="item-span">H5链接：</span>
          <!-- <el-input type="input" placeholder="请添加链接" v-model="message.linkId" class="inputs"></el-input> -->
          <el-select
            style="width: 200px"
            filterable
            v-model="message.linkId"
            placeholder="选择H5"
            clearable
            class="filter-item"
          >
            <template slot="empty">
              <div style="padding:10px;">
                <span>搜索没有结果？</span>
                <span class="addStyle" @click="addH5">新增H5</span>
              </div>
            </template>
            <el-option
              v-for="item in h5List"
              :key="item.id"
              :label="item.h5Name"
              :value="item.h5Url"
            />
          </el-select>
        </div>
        <div class="dialog-item" v-if="message.type === '2' || message.type === '3'">
          <span class="item-span">商品：</span>
          <el-input
            type="input"
            placeholder="请添加链接"
            v-model="goodsName"
            @focus="selectShopping"
            class="inputs"
          ></el-input>
        </div>
        <div class="dialog-item">
          <span class="item-span">推送设备：</span>
          <el-radio v-model="message.pushType" label="1">安卓</el-radio>
          <el-radio v-model="message.pushType" label="0">苹果</el-radio>
          <el-radio v-model="message.pushType" label="2">所有</el-radio>
        </div>
        <div class="dialog-item">
          <span class="item-span">发送时间：</span>
          <el-date-picker
            v-model="message.sendTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMessage = false">取消</el-button>
        <el-button type="primary" v-if="dialogType === 'create'" @click="submitMessage">确定</el-button>
        <el-button type="primary" v-if="dialogType === 'edit'" @click="submitEdit">提交</el-button>
      </span>
    </el-dialog>
    <goodsChoice @closeDialog="closeDialog" :dialogPvVisible="dialogPvVisible" @callback="iwantyou"></goodsChoice>
    <integralMall @closeDialog="closeDialog" :goodsDialog="goodsDialog" @callback="iwantyou"></integralMall>
  </div>
</template>
<script>
import {
  messagelist,
  addmessage,
  deletmessage,
  pushmessage,
  editMessageApi
} from "@/api/messageManagement.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import goodsChoice from "@/components/Advertisingmanagementpopup/goodsChoice";
import integralMall from "@/components/Advertisingmanagementpopup/integralMall";
import { h5ManageGetAllList } from "@/api/rule";
export default {
  name: "messageManagement",
  components: { Pagination, goodsChoice, integralMall },
  data() {
    return {
      value1: "",
      time: "",
      listQuery: {
        size: 10,
        current: 1,
        time: undefined,
        status: undefined,
        isPush: undefined,
        title: undefined,
        msgType: "1"
      },
      dataList: [],
      advertisingType: [
        {
          value: "1",
          label: "H5"
        },
        {
          value: "2",
          label: "拍卖商品"
        },
        {
          value: "3",
          label: "商城商品"
        },
        {
          value: "4",
          label: "无跳转"
        }
      ],
      total: 0,
      statuArry: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未发送",
          value: 0
        },
        {
          label: "成功",
          value: 1
        },
        {
          label: "失败",
          value: 2
        }
      ],
      whetherTopushList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ],
      whetherTopush: undefined,
      status: undefined,
      showMessage: false,
      pushType: "",
      audience: "",
      msgType: undefined,
      phone: "",
      content: "",
      iphoneShow: false,
      messageName: "",
      usersType: [
        {
          value: "0",
          label: "指定用户"
        },
        {
          value: "1",
          label: "所有人"
        }
      ],
      msgType: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "2",
          label: "站内信"
        },
        {
          value: "1",
          label: "通知"
        }
      ],
      value: "",
      dialogPvVisible: false,
      goodsDialog: false,
      message: {
        title: undefined,
        content: undefined,
        sendTime: undefined,
        isPush: undefined,
        type: undefined,
        linkId: undefined,
        audience: undefined,
        phone: undefined,
        pushType: undefined
      },
      dialogType: "create",
      goodsName: "",
      iwantyouvalue: "",
      h5List: []
    };
  },
  created() {
    this.getMessageList();
    this.getH5List();
  },
  methods: {
    getH5List() {
      h5ManageGetAllList().then(res => {
        if (res.code == 0) {
          this.h5List = res.data;
        }
      });
    },
    //获取列表
    getMessageList() {
      this.listQuery.time
        ? ((this.listQuery.startTime = this.listQuery.time[0]),
          (this.listQuery.endTime = this.listQuery.time[1]))
        : ((this.listQuery.startTime = undefined),
          (this.listQuery.endTime = undefined));
      messagelist(this.listQuery).then(res => {
        if (res.code == "0") {
          this.dataList = res.data.records;
          this.total = Number(res.data.total);
        } else {
        }
      });
    },
    handleClick(e) {
      if (this.message.type !== "" && this.message.type != e) {
        this.showname = "";
        this.iwantyouvalue = "";
        this.message.linkId = "";
      }
    },
    // 搜索
    search() {
      this.current = 1;
      this.getMessageList();
    },
    // 弹出选择商品弹框
    selectShopping() {
      if (this.message.type == 2) {
        this.dialogPvVisible = true;
      } else {
        this.goodsDialog = true;
      }
    },
    closeDialog() {
      this.dialogPvVisible = false;
      this.goodsDialog = false;
    },
    iwantyou(value) {
      this.goodsName = value.goodsName;
      this.iwantyouvalue = value.auctionId;
      this.message.linkId = value.auctionId;
      this.dialogPvVisible = false;
      this.goodsDialog = false;
    },
    // 重置
    reset() {
      this.listQuery = {
        size: 10,
        current: 1,
        time: undefined,
        status: undefined,
        isPush: undefined
      };
      this.getMessageList();
    },
    // 分页
    handleCurrentChange(page) {
      this.current = page;
      this.getMessageList();
    },
    // 条数
    handleSizeChange(page) {
      this.size = page;
      this.getMessageList();
    },
    //推送用户类型：
    changeAudience(value) {
      if (value === "0") {
        this.iphoneShow = true;
      } else {
        this.iphoneShow = false;
      }
    },
    //弹出添加消息弹框
    add() {
      this.message = {
        title: undefined,
        content: undefined,
        sendTime: undefined,
        isPush: undefined,
        type: undefined,
        linkId: undefined,
        audience: undefined,
        phone: undefined,
        pushType: undefined,
        h5Id:undefined,
      };
      (this.dialogType = "create"), (this.showMessage = true);
    },
    //新增消息
    submitMessage() {
      let that = this;
      if (that.message.pushType === "") {
        that.$message({
          message: "请选择推送方式！",
          type: "error"
        });
        return;
      }
      if (that.message.audience === "") {
        that.$message({
          message: "请选择推送用户类型！",
          type: "error"
        });
        return;
      }
      if (that.message.msgType === "") {
        that.$message({
          message: "请选择消息类型！",
          type: "error"
        });
        return;
      }
      if (that.message.content === "") {
        that.$message({
          message: "请输入推送内容！",
          type: "error"
        });
        return;
      }
      if (this.message.type == 2 || this.message.type == 3) {
        this.message.linkId = this.iwantyouvalue;
      } else {
        this.message.linkId = this.message.linkId;
      }
      //后面
      if(this.message.type == 1){
        for(const item of this.h5List){
          if(item.h5Url == this.message.linkId){
            this.message.h5Id = item.id;
            break;
          }
        }

      }
      addmessage(this.message).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: res.data,
            type: "success"
          });
          that.showMessage = false;
          that.getMessageList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //删除消息
    deleteMessage(row) {
      let that = this;
      let data = {
        id: row.id
      };
      deletmessage(data).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: "删除消息成功！",
            type: "success"
          });
          that.getMessageList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //发送消息
    sendMessage(row) {
      let that = this;
      let data = {
        id: row.id
      };
      pushmessage(data).then(res => {
        if (res.code == "00000") {
          that.$message({
            message: "发送消息成功！",
            type: "success"
          });
          that.getMessageList();
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    editMessage(row) {
      for (let i in this.message) {
        this.message[i] = row[i] + "";
      }
      this.message.id = row.id;
      (this.dialogType = "edit"), (this.showMessage = true);
    },
    detailMessage(row) {
      for (let i in this.message) {
        this.message[i] = row[i] + "";
      }
      if (this.message.type === "2" || this.message.type === "3") {
        this.goodsName = this.message.linkId;
      }
      (this.dialogType = "detail"), (this.showMessage = true);
    },
    submitEdit() {
      if (this.message.pushType === "") {
        that.$message({
          message: "请选择推送方式！",
          type: "error"
        });
        return;
      }
      if (this.message.audience === "") {
        this.$message({
          message: "请选择推送用户类型！",
          type: "error"
        });
        return;
      }
      if (this.message.audience === "0") {
        if (
          this.message.phone === "" ||
          !/^1[23456789]\d{9}$/.test(this.message.phone)
        ) {
          this.$message({
            message: "请输入用户手机号！",
            type: "error"
          });
          return;
        }
      }
      if (this.message.msgType === "") {
        this.$message({
          message: "请选择消息类型！",
          type: "error"
        });
        return;
      }
      if (this.message.content === "") {
        this.$message({
          message: "请输入推送内容！",
          type: "error"
        });
        return;
      }
       //后面
      if(this.message.type == 1){
        for(const item of this.h5List){
          if(item.h5Url == this.message.linkId){
            this.message.h5Id = item.id;
            break;
          }
        }
      };
      editMessageApi(this.message).then(res => {
        if (res.code == 0) {
          this.showMessage = false;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getMessageList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 新增h5路由跳转
    addH5() {
      this.showMessage = false;
      this.$router.push({ path: "/rule/hFiveAddEdit", query: { type: "add" } });
    }
  }
};
</script>
<style lang="scss" scoped>
.addStyle {
    color: #0071f8;
    cursor: pointer;
  }
.headQuarters-list {
  padding: 24px;
  .search-content {
    display: block;
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
        width: 120px;
      }
      .item-span::before {
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
  }
  .btn-red {
    color: #f56c6c;
  }
  .btn-blue {
    color: #409eff;
  }
}
</style>