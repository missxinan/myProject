<template>
  <div class="headQuarters-list">
    <div class="add-company">
      <el-button
        @click="addHouse"
        type="primary"
        v-if="checkPermission(['vip:vipManage:vipAdd'])"
      >增加店主</el-button>
    </div>
    <div class="search-content">
      <div class="item">
        <!-- <span class="item-title">创建时间：</span> -->
        <el-date-picker
          class="item-picker"
          v-model="searchParam.time"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </div>
      <div class="item">
        <!-- <span class="item-title">名称/姓名/账号:</span> -->
        <el-input class="item-input" v-model="searchParam.nickUserNamePhone" placeholder="名称/账号"></el-input>
      </div>
      <div class="item">
        <el-button type="primary" class @click="search">搜索</el-button>
        <el-button type="primary" class @click="reset">重置</el-button>
      </div>
    </div>
    <div class="tablelist">
      <el-table
        :data="dataList"
        border
        class="list"
        style="width: 100%"
        max-height="650"
        @cell-click="cellclick"
      >
        <el-table-column prop="createTime" align="center" label="创建时间" width="100"></el-table-column>
        <el-table-column prop="nickname" align="center" label="名称"></el-table-column>
        <el-table-column prop="userName" align="center" label="联系人姓名"></el-table-column>
        <el-table-column prop="phone" align="center" label="联系人手机（账号）"></el-table-column>
        <el-table-column prop="roomNum" align="center" label="店铺数量"></el-table-column>
        <el-table-column prop="totalIncome" align="center" label="总收益" property="totalIncome">
          <template slot-scope="scope">
            <div  class="total_blue">{{scope.row.totalIncome}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="openStatus" align="center" label="状态">
          <template slot-scope="scope">
            <div>{{scope.row.openStatus == 1 ? '启用' : '禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipManage:edit'])"
                @click="editHouseOwner(scope.row)"
              >编辑</span>
              <span
                class="table-btn btn-red"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipManage:forbidden'])"
                @click="disabling(scope.row)"
              >禁用</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 0 && checkPermission(['vip:vipManage:forbidden'])"
                @click="disabling(scope.row)"
              >启用</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipManage:vipRoomAdd'])"
                @click="addHouseList(scope.row)"
              >增加店铺</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1"
                @click="checkTheroom(scope.row)"
              >查看店铺</span>
              <span
                class="table-btn btn-blue"
                v-if="scope.row.openStatus == 1 && checkPermission(['vip:vipManage:resetPassword'])"
                @click="resetPassword(scope.row)"
              >重置密码</span>
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

    <el-dialog title="禁用/启用" :visible.sync="disableBomb" width="30%" :before-close="closeDisabling">
      <div>确定要禁用/启用供应商‘ {{partner.nickname}}’的账号么？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDisabling">取 消</el-button>
        <el-button type="primary" @click="confirmDisabling">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="isPass" width="30%" :before-close="noResetPassword">
      <div>确定要把‘{{partner.nickname}}’密码重置掉吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noResetPassword">取 消</el-button>
        <el-button type="primary" @click="confirmResetPassword">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="vipHouseTitle"
      :visible.sync="isHouse"
      width="50%"
      :before-close="cancelAddHouseOwner"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="nickname" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入名称"
            v-model.trim="ruleForm.nickname"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="userName" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入联系人姓名"
            v-model.trim="ruleForm.userName"
            maxlength="4"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人手机" prop="phone" required>
          <el-input
            class="item-input"
            v-model.trim="ruleForm.phone"
            :disabled="ruleForm.vipId ? true: false"
            placeholder="请输入联系人手机号"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="联系人城市" prop="addrCode">
          <el-select v-model="ruleForm.province" placeholder="请选择省" @change="selectProvince">
            <el-option
              v-for="item in provinceArry"
              :key="item.id"
              :label="item.areaname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="ruleForm.city" placeholder="请选择市" @change="selectCity">
            <el-option
              v-for="item in cityArry"
              :key="item.id"
              :label="item.areaname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="ruleForm.area" placeholder="请选择区" @change="$forceUpdate()">
            <el-option
              v-for="item in areaArry"
              :key="item.id"
              :label="item.areaname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress">
          <el-input
            class="item-input"
            type="textarea"
            :rows="2"
            placeholder="请输入详细地址"
            v-model="ruleForm.detailedAddress"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="C端账号" prop="cPhone" required>
          <el-input
            class="item-input"
            type="textarea"
            v-model="ruleForm.cPhone"
            placeholder="请输入C端账号"
            :disabled="ruleForm.vipId ? true: false"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddHouseOwner">取 消</el-button>
        <el-button type="primary" @click="submitForm" :disabled="submitClick">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="增加店铺" :visible.sync="isAddHouse" width="30%" :before-close="noAddHouseList">
      <el-form
        :model="addHouseRuleForm"
        :rules="addHouseRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="店铺名称" prop="name" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入店铺名称"
            v-model.trim="addHouseRuleForm.name"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入编号"
            v-model="addHouseRuleForm.number"
            maxlength="30"
            :disabled="true"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="levelId" required>
          <el-select v-model="addHouseRuleForm.levelId" placeholder="请选择等级">
            <el-option
              v-for="item in levelList"
              :key="item.levelId"
              :label="item.name"
              :value="item.levelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属" prop="userName" required>
          <el-input
            class="item-input"
            type="text"
            placeholder="请输入归属"
            v-model="addHouseRuleForm.userName"
            show-word-limit
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="openPassword" required>
          <el-radio-group v-model="addHouseRuleForm.openPassword">
            <el-radio label="1">开启</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            class="item-input"
            type="number"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
            v-model="addHouseRuleForm.sort"
            placeholder="请输入排序（纯数字）"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noAddHouseList">取 消</el-button>
        <el-button type="primary" @click="AddHousesubmitForm" :disabled="submitClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  viphouseOwnerManageList,
  vipHouseOwnerAdd,
  vipHouseOwnerEdit,
  vipHouseOwnerDetail,
  vipHouseOwnerDisableAndEnable,
  vipHouseOwnerResetPassword,
  vipLevelList,
  vipHouseAdd,
  getNextNumber
} from "@/api/vipMange.js";
import { addressList } from "@/api/corporateManagement.js";
import { debuglog } from "util";
import checkPermission from "@/utils/permission";
export default {
  name: "houseOwnerMange",
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确手机号"));
        return;
      } else {
        callback();
        return;
      }
    };
    return {
      openPassword: "",
      //增加店铺时候，密码   默认开启状态
      radio: "1",
      searchParam: {
        // 列表搜索条件
        time: "", // 开始结束时间
        nickUserNamePhone: "" // 名称/手机号/昵称
      },
      dataList: [],
      size: 10,
      current: 1,
      total: 0,
      passwordBomb: false,
      disableBomb: false,
      partner: "",
      isUpgrade: false,
      vipHouseTitle: "新增", // 新增修改标题
      isHouse: false, // 新增修改房间显示隐藏
      isPass: false, // 重置密码显示隐藏
      isAddHouse: false,
      ruleForm: {
        vipId: "",
        nickname: "",
        userName: "",
        phone: "",
        province: "", // 省
        city: "", // 市
        area: "", // 区域
        detailedAddress: "", // 详细地址
        cPhone: ""
      }, // 新增修改表单
      provinceArry: [], // 省列表
      cityArry: [], // 市列表
      areaArry: [], // 区列表
      provinceId: "",
      cityId: "",
      areaId: "",
      levelList: [], // 等级列表
      submitClick: false,
      rules: {
        nickname: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 2 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          { min: 1, max: 4, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validate, trigger: "blur" }
        ],
        cPhone: [
          {
            required: true,
            message: "请输入C端账号（手机号）",
            trigger: "blur"
          }
        ]
      },
      //  添加房间form
      addHouseRuleForm: {
        name: "",
        number: "",
        levelId: "",
        vipId: "",
        sort: "",
        userName: "",
        openPassword: "",
        openCustom: "0"
      },
      addHouseRules: {
        name: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        levelId: [{ required: true, message: "请输入等级", trigger: "blur" }],
        openPassword: [
          { required: true, message: "这是必选项", trigger: "blur" }
        ]
      },
      currentVip: ""
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    checkPermission,
    areachange(value) {
      this.ruleForm.area = value;
    },
    // 增加房主
    addHouse() {
      this.isHouse = true;
      this.ruleForm = {};
      // this.getProvinceAddress();
    },
    //获取列表
    getDataList() {
      let data = {
        nickUserNamePhone: this.searchParam.nickUserNamePhone || "",
        startCreateTime:
          this.searchParam.time == null || this.searchParam.time == ""
            ? ""
            : this.searchParam.time[0], // 开始日期
        endCreateTime:
          this.searchParam.time == null || this.searchParam.time == ""
            ? ""
            : this.searchParam.time[1], // 结束日期
        size: this.size,
        current: this.current
      };
      viphouseOwnerManageList(data).then(res => {
        if (res.code == "00000") {
          this.dataList = res.data.records;
          this.total = Number(res.data.total);
        }
      });
    },
    // 到收支明细
    cellclick(row, column, cell, event) {
      if (column.property === "totalIncome") {
        let partnerId = row.partnerId;
        this.$router.push({
          path: "/vipMange/incomeAndPayDetail",
          query: {
            vipId: row.vipId
          }
        });
      }
    },
    //获取省地址
    getProvinceAddress() {
      let data = {
        parentId: 0
      };
      addressList(data).then(res => {
        if (res.code == 0) {
          this.provinceArry = [...res.data];
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //获取市地址
    getCityAddress() {
      let data = {
        parentId: this.provinceId
      };
      addressList(data).then(res => {
        if (res.code == 0) {
          this.cityArry = res.data;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //获取区地址
    getAreaAddress() {
      let data = {
        parentId: this.cityId
      };
      addressList(data).then(res => {
        if (res.code == 0) {
          this.areaArry = res.data;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },

    selectProvince(value) {
      if (value == "") {
        this.provinceId = "";
        this.cityId = "";
        this.areaId = "";
        this.ruleForm.area = "";
        this.ruleForm.city = "";
        this.cityArry = [];
        this.areaArry = [];
      } else {
        this.provinceId = Number(value);
        this.ruleForm.area = "";
        this.ruleForm.city = "";
        this.getCityAddress();
      }
    },
    selectCity(value) {
      this.cityId = Number(value);
      this.ruleForm.area = "";
      this.getAreaAddress();
    },

    //  取消增加房主
    cancelAddHouseOwner() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm = {};
      this.isHouse = false;
    },

    // 提交保存
    submitForm() {
      let data = this.ruleForm;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          delete data.province;
          delete data.city;
          if (data.area) {
            data.addrCode = data.area;
          }
          delete data.area;
          if (data.vipId) {
            // 编辑修改
            this.submitClick = true;
            vipHouseOwnerEdit(data).then(res => {
              this.submitClick = false;
              if (res.code == "00000") {
                this.$message({
                  message: "编辑修改成功！",
                  type: "success"
                });
                this.cancelAddHouseOwner();
                this.getDataList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          } else {
            // 添加
            this.submitClick = true;
            vipHouseOwnerAdd(data).then(res => {
              this.submitClick = false;
              if (res.code == "00000") {
                this.$message({
                  message: "添加成功！",
                  type: "success"
                });
                this.cancelAddHouseOwner();
                this.getDataList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          }
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
      this.searchParam = {};
      this.getDataList();
    },

    // 修改房主
    editHouseOwner(row) {
      vipHouseOwnerDetail({ id: row.vipId }).then(res => {
        if (res.code == 0) {
          const data = res.data;
          this.isHouse = true;
          this.ruleForm = {
            vipId: data.vipId,
            nickname: data.nickname,
            userName: data.userName,
            phone: data.phone,
            detailedAddress: data.detailedAddress || "",
            cPhone: data.cPhone
          };
          this.vipHouseTitle = "修改";
          if (data.code && data.code !== "null" && data.code !== "undefined") {
            let codes = data.code.split(",");
            this.ruleForm.province = Number(codes[0]);
            this.ruleForm.city = Number(codes[1]);
            this.ruleForm.area = Number(codes[2]);
            this.provinceId = codes[0];
            this.cityId = codes[1];
            this.areaId = codes[2];
            this.getProvinceAddress();
            this.getCityAddress();
            this.getAreaAddress();
          } else {
            this.getProvinceAddress();
          }
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    resetPassword(row) {
      this.isPass = true;
      this.partner = row;
    },
    noResetPassword() {
      this.isPass = false;
      this.partner = "";
    },
    confirmResetPassword() {
      vipHouseOwnerResetPassword({ vipId: this.partner.vipId }).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: "重置密码成功",
            type: "success"
          });
          this.getDataList();
          this.isPass = false;
          this.partner = "";
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
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
      this.disableBomb = true;
      this.partner = row;
    },
    //确认禁用
    confirmDisabling() {
      let data = {
        vipId: this.partner.vipId,
        openStatus: this.partner.openStatus === 0 ? 1 : 0
      };
      vipHouseOwnerDisableAndEnable(data).then(res => {
        if (res.code == "00000") {
          this.$message({
            message: `${data.openStatus === 0 ? "禁用" : "启用"}成功`,
            type: "success"
          });
          this.getDataList();
          this.disableBomb = false;
          this.partner = "";
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    // 关闭禁用弹框
    closeDisabling() {
      this.disableBomb = false;
      this.partner = "";
    },

    //  查看房间
    checkTheroom(row) {
      this.$router.push({
        path: "/vipMange/roomManagement/roomManagementList",
        query: {
          nickNamePhone: row.phone
        }
      });
    },
    //  增加房间
    addHouseList(row) {
      vipLevelList({ size: 100 }).then(res => {
        if (res.code == 0) {
          this.addHouseRuleForm.vipId = row.vipId; // vipid
          this.addHouseRuleForm.userName = row.userName;
          this.addHouseRuleForm.openPassword = row.openPassword;
          this.isAddHouse = true;
          this.currentVip = row;
          this.levelList = res.data.records;
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
      getNextNumber().then(res => {
        if (res.code == 0) {
          this.addHouseRuleForm.number = res.data; // 增加房间编号
          this.$forceUpdate(); // 刷新视图
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //  取消添加房间
    noAddHouseList() {
      this.isAddHouse = false;
      this.currentVip = "";
      this.$refs["addRuleForm"].resetFields();

      this.addHouseRuleForm = {};
    },

    //  增加房间
    AddHousesubmitForm() {
      const data = this.addHouseRuleForm;
      this.$refs["addRuleForm"].validate(valid => {
        if (valid) {
          this.submitClick = true;
          vipHouseAdd(data).then(res => {
            this.submitClick = false;
            if (res.code == "00000") {
              this.$message({ message: "增加店铺成功！", type: "success" });
              this.checkTheroom(this.currentVip);
              this.noAddHouseList();
              //this.getDataList();
            } else {
              this.$message({ message: res.msg, type: "error" });
            }
          });
        }
      });
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
    // margin-bottom: 24px;
    .item {
      display: inline-block;
      margin-bottom: 24px;
    }
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
  .total_blue {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
