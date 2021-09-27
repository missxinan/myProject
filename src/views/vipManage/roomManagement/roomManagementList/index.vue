<template>
  <div class="headQuarters-list">
    <div class="search-content">
      <div class="item">
        <span class="item-title"></span>
        <el-input
          class="item-input"
          v-model.trim="roomManageSearchParam.roomNameNumber"
          placeholder="请输入店铺名称/店铺编号："
        ></el-input>
      </div>
      <div class="item">
        <span class="item-title"></span>
        <el-input
          class="item-input"
          v-model.trim="roomManageSearchParam.nickNamePhone"
          placeholder="请输入店主昵称/店主手机号:"
        ></el-input>
      </div>
      <div class="item">
        <span class="item-title"></span>
        <el-select v-model="roomManageSearchParam.levelId" placeholder="请选择店铺等级:">
          <el-option
            v-for="item in levelList"
            :key="item.levelId"
            :label="item.name"
            :value="item.levelId"
          ></el-option>
        </el-select>
      </div>
      <!-- 筛选，根据密码公开/私密，接口出来需要改 -->
      <div class="item">
        <span class="item-title"></span>
        <el-select v-model="roomManageSearchParam.openPassword" placeholder="请选择密码状态:">
          <el-option
            v-for="item in passwordList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 请根据房间状态 -->
       <div class="item">
        <span class="item-title"></span>
        <el-select v-model="roomManageSearchParam.openStatus" placeholder="请选择店铺状态">
          <el-option
            v-for="item in roomStatusList"
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
        <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
        <el-table-column prop="name" align="center" label="店铺名称"></el-table-column>
        <el-table-column prop="number" align="center" label="编号"></el-table-column>
        <el-table-column prop="vipNickname" align="center" label="店主姓名/手机号">
          <template slot-scope="scope">
            <div>{{scope.row.vipNickname}} {{scope.row.vipPhone}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="levelName" align="center" label="店铺等级"></el-table-column>
        <el-table-column prop="completeMoney" align="center" label="总成交额"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序"></el-table-column>
        <el-table-column prop="openStatus" align="center" label="状态">
          <template slot-scope="scope">
            <div>{{scope.row.openStatus == 1 ? '启用' : '禁用'}}</div>
          </template>
        </el-table-column>
        <!-- 密码一栏，接口出来需要改 -->
        <el-table-column prop="openPassword" align="center" label="密码状态">
          <template slot-scope="scope">
            <div>{{scope.row.openPassword == 0 ? '公开' : '私密'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="roomId" align="center" label="操作" width="210">
          <template slot-scope="scope">
            <div>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipRoom:edit'])"
                @click="EditTheRoom(scope.row)"
              >编辑</span>
              <span
                class="table-btn btn-red"
                v-if="scope.row.openStatus == 1"
                @click="openAndDisableClick(scope.row) && checkPermission(['vip:vipRoom:forbidden'])"
              >禁用</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 0 && checkPermission(['vip:vipRoom:forbidden'])"
                @click="openAndDisableClick(scope.row)"
              >启用</span>
              <!-- 密码私密或者是开启 -->
               <span
                class="table-btn btn-blue"
                v-if="scope.row.openPassword == 1 && scope.row.openStatus == 1" 
                @click="newopenAndDisableClick(scope.row)"
              >关闭密码</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openPassword == 0 && scope.row.openStatus == 1" 
                @click="newopenAndDisableClick(scope.row)"
              >开启密码</span>
               <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1"
                @click="CheckItem(scope.row)"
              >查看拍品</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipRoom:resetPassword'])"
                @click="resetPassword(scope.row)"
              >重置密码</span>
              <!-- <span class="table-btn btn-blue" @click="lookPerformance(scope.row)">查看绩效</span> -->
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipRoom:lookup'])"
                @click="viewPassword(scope.row)"
              >查看密码</span>
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

    <!-- 查看密码===S -->
    <el-dialog title="查看密码" :visible.sync="isPassView" width="30%" :before-close="noViewPassword">
      <div>{{currentRoom.number}}号房间密码：{{viewGetPassword}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="noViewPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看密码===N -->

    <el-dialog
      :title="openDisableTitle"
      :visible.sync="isOpenDisable"
      width="30%"
      :before-close="closeOpenDisableing"
    >
      <div>确定要{{openDisableTitle}}‘{{currentRoom.name}}’ 店铺吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOpenDisableing">取 消</el-button>
        <el-button type="primary" @click="confirmOpenDisableing">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="newopenDisableTitle"
      :visible.sync="newisOpenDisable"
      width="30%"
      :before-close="newcloseOpenDisableing"
    >
      <div>确定要{{newopenDisableTitle}}‘{{currentRoom.name}}’ 店铺的密码吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newcloseOpenDisableing">取 消</el-button>
        <el-button type="primary" @click="newconfirmOpenDisableing">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="isResetPassword"
      width="30%"
      :before-close="closeResetPasswording"
    >
      <div>确定要重置{{currentRoom.name}}店铺的密码吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeResetPasswording">取 消</el-button>
        <el-button type="primary" @click="confirmResetPassword">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="vipRoomTitle"
      :visible.sync="isRoom"
      width="30%"
      :before-close="cancelEditHouseOwner"
    >
      <el-form
        :model="roomForm"
        :rules="roomFormRules"
        ref="roomForm"
        label-width="100px"
        class="demo-ruleForm"
        max-height="650"
      >
        <el-form-item label="店铺名称" prop="name" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入店铺名称"
            maxlength="30"
            v-model.trim="roomForm.name"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="店主姓名" prop="vipNickname" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入店主姓名"
            maxlength="30"
            v-model.trim="roomForm.vipNickname"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺等级" required>
          <el-select v-model="roomForm.levelId" placeholder="请选择等级">
            <el-option
              v-for="item in levelList"
              :key="item.levelId"
              :label="item.name"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditHouseOwner">取 消</el-button>
        <el-button type="primary" @click="editHouseSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  vipRoomMangeList,
  vipRoomMangeDetail,
  vipRoomMangeEdit,
  vipLevelList,
  roomManagementEdit,
  roomManagementOpenAndDisable,
  newroomManagementOpenAndDisable,
  roomManagementResetPassword,
  getPassword
} from "@/api/vipMange.js";
import { log } from "util";
import checkPermission from "@/utils/permission";
export default {
  name: "roomManagement",
  data() {
    return {
      openPassword:"",
      roomManageSearchParam: {
        nickNamePhone: "",
        roomNameNumber: "",
        levelId: null,
        openPassword: null,
        openStatus: null,
        openCustom: null
      },
      isDisableBomb: false, //是否禁用
      dataList: [],
      size: 10,
      current: 1,
      total: 0,
      isRoom: false,
      vipRoomTitle: "修改",
      levelList: [],
      roomForm: {
        name: "",
        vipNickname: "",
        levelId: "",
        // openPassword:1
      },
      roomFormRules: {
        name: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        vipNickname: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        levelId: [{ required: true, message: "请输入等级", trigger: "blur" }],
        openCustom: [{ required: true, message: "请选择是否定制", trigger: "change" }]
      },
      openDisableTitle: "禁用",
      newopenDisableTitle:'关闭密码',
      isResetPassword: false,
      isOpenDisable: false,
      newisOpenDisable:false,
      currentRoom: "",
      isPassView: false,
      viewGetPassword: "",
      passwordList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "公开",
          value: "0"
        },
        {
          label: "私密",
          value: "1"
        }
      ],
    roomStatusList:[
      {
        label: "全部",
          value: ""
      },
      {
          label: "启用",
          value: "1"
        },
        {
          label: "禁用",
          value: "0"
        }
    ]
    };
  },
  created() {
    let nickNamePhone = this.$route.query.nickNamePhone;
    if (nickNamePhone) {
      this.roomManageSearchParam.nickNamePhone = nickNamePhone;
    }
    this.getDataList();
    this.getVipLevelList();
  },
  methods: {
    checkPermission,
    // 获取等级列表
    getVipLevelList() {
      vipLevelList({ size: 100 }).then(res => {
        if (res.code == "00000") {
          const levelList = res.data.records;
          console.log(typeof(levelList))
          this.levelList = levelList;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //  取消房间
    cancelEditHouseOwner() {
      this.isRoom = false;
      this.$refs["roomForm"].resetFields();
      this.roomForm = {};
    },

    //  保存修改房间
    editHouseSave() {
      const data = this.roomForm;
      roomManagementEdit(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: "编辑修改成功！",
            type: "success"
          });
          this.cancelEditHouseOwner();
          this.getDataList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑房间
    EditTheRoom(row) {
      this.roomForm = {
        name: row.name,
        vipNickname: row.vipNickname,
        levelId: row.levelId,
        roomId: row.roomId,
        openCustom: row.openCustom + ''
        // openPassword:row.openPassword,
      };
      this.isRoom = true;
    },
    //获取列表
    getDataList() {
      let data = {
        size: this.size,
        current: this.current,
        roomNameNumber: this.roomManageSearchParam.roomNameNumber || undefined,
        nickNamePhone: this.roomManageSearchParam.nickNamePhone || undefined,
        levelId: this.roomManageSearchParam.levelId || undefined,
        openPassword: this.roomManageSearchParam.openPassword || undefined,
        openStatus:this.roomManageSearchParam.openStatus || undefined,
        openCustom: this.roomManageSearchParam.openCustom || undefined,
      };
      vipRoomMangeList(data).then(res => {
        if (res.code == "00000") {
          this.dataList = res.data.records;
          this.total = Number(res.data.total);
          // console.log(res)
        } else {
        }
      });
    },
    // 搜索
    search() {
      this.current = 1;
      this.getDataList();
    },
    // 重置
    reset() {
      this.roomManageSearchParam = {};
      this.getDataList();
    },

    // 禁用启用
    openAndDisableClick(row) {
      this.openDisableTitle = row.openStatus === 1 ? "禁用" : "启用";
      this.isOpenDisable = true;
      this.currentRoom = row;
    },
    // 取消禁用、启动
    closeOpenDisableing() {
      this.isOpenDisable = false;
      this.currentRoom = "";
    },
    // 确定禁用、启用
    confirmOpenDisableing() {
      const data = {
        roomId: this.currentRoom.roomId,
        openStatus: this.currentRoom.openStatus === 0 ? 1 : 0
      };
      const title = this.openDisableTitle;
      roomManagementOpenAndDisable(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: `${title}成功！`,
            type: "success"
          });
          this.closeOpenDisableing();
          this.getDataList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

 // 密码开启==============禁用启用
    newopenAndDisableClick(row) {
      this.newopenDisableTitle = row.openPassword === 1 ? "关闭密码" : "开启密码";
      this.newisOpenDisable = true;
      this.currentRoom = row;
    },
    //密码开始============= 取消禁用、启动
    newcloseOpenDisableing() {
      this.newisOpenDisable = false;
      this.currentRoom = "";
    },
    // 密码确定禁用、启用
    newconfirmOpenDisableing() {
      const data = {
        roomId: this.currentRoom.roomId,
        openPassword: this.currentRoom.openPassword === 0 ? 1 : 0
      };
      const title = this.newopenDisableTitle;
      newroomManagementOpenAndDisable(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: `${title}成功！`,
            type: "success"
          });
          this.newcloseOpenDisableing();
          this.getDataList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    // 重置密码操作
    resetPassword(row) {
      this.isResetPassword = true;
      this.currentRoom = row;
    },
    // 取消重置密码
    closeResetPasswording() {
      this.isResetPassword = false;
      this.currentRoom = "";
    },
    //查看密码
    viewPassword(row) {
      // console.log(row.roomId)
      getPassword({ roomId: row.roomId }).then(res => {
        if (res.code == "00000") {
          this.viewGetPassword = res.data;
          this.isPassView = true;
          this.currentRoom = row;
        } else {
        }
      });
    },
    noViewPassword(row) {
      this.isPassView = false;
      this.currentRoom = "";
    },
    // 确定重置
    confirmResetPassword() {
      const data = {
        roomId: this.currentRoom.roomId
      };
      roomManagementResetPassword(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: "重置成功！",
            type: "success"
          });
          this.closeResetPasswording();
          this.getDataList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    // 查看拍品
    CheckItem(row) {
      let roomId = row.roomId;
      // debugger
      this.$router.push({
        path: "/vipMange/roomManagement/checkTheTtemsmentList",
        query: {
          roomId,
          name:row.name,
          vipId:row.vipId
        }
      });
    },

    // 升级
    upgrade(row) {
      this.isUpgrade = true;
      this.partner = row;
    },
    // 分页
    handleCurrentChange(page) {
      this.current = page;
      this.getDataList();
    },
    // 条数
    handleSizeChange(page) {
      this.size = page;
      this.getDataList();
    },

    // 禁用弹框显示
    disabling(row) {
      this.isDisableBomb = true;
      this.parter = row;
    },
    //确认禁用
    confirmDisabling() {
      let data = {
        partnerId: this.partner.partnerId
      };
      partnerForbidden(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: "禁用成功！",
            type: "success"
          });
          this.getDataList();
          this.isDisableBomb = false;
        }
      });
    },
    // 关闭禁用弹框
    closeDisabling() {
      this.isDisableBomb = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.headQuarters-list {
  padding: 24px;
  .add-company {
    margin-bottom: 24px;
  }
  .search-content {
    display: block;
    margin-bottom: 24px;
    .item {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 24px;
    }
    // .item:first-child {
    //   width: 14%;
    // }
    .item-title {
      font-size: 14px;
    }
    .item-picker {
      width: 300px;
    }
    .item-input {
      width: 220px;
      display: inline-block;
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

