<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <el-dialog title="修改密码" width="450px" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="ruleForm" :model="updatePwdDto">
        <el-form-item label="旧密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="updatePwdDto.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth">
          <el-input v-model="updatePwdDto.newPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureUpdatePwd">确 定</el-button>
      </div>
    </el-dialog>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->
      </template>

      <el-dropdown class="avatar-container" style="margin-top:0;" trigger="click">
        <div class="avatar-wrapper" style="display: flex;align-items: center;">
          <span style="margin-right: 20px;">{{ name }}</span>
          <img
            :src="avatar+'?imageView2/1/w/80/h/80'"
            style="border-radius:50%;"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="updatePwd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { removeToken } from "@/utils/auth";
import SizeSelect from "@/components/SizeSelect";
import { sureUpdatePwd } from "@/api/user.js";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SizeSelect
  },
  data() {
    const validatePass = (rule, value, callback) => {
      var regex = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$");
      if (!regex.test(value)) {
        callback(
          new Error("密码中必须为字母和数字组合，且长度大于等于8位，小于16位")
        );
      } else {
        callback();
      }
    };

    return {
      rules: {
        password: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { min: 6, message: "最少6个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 8, message: "最少8个字符", trigger: "blur" },
          { max: 15, message: "最多15个字符", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      formLabelWidth: "80px",
      updatePwdDto: {
        password: "",
        newPassword: "",
        userId: ""
      },
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "device"])
  },
  methods: {
    sureUpdatePwd() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.updatePwdDto));
          data.userId = JSON.parse(sessionStorage.getItem("tokenData")).userId;
          sureUpdatePwd(data).then(res => {
            if (res.code == "0") {
              this.$notify({
                message: "密码修改成功",
                type: "success"
              });
              removeToken();
              this.dialogFormVisible = false;
              this.$router.push("/login");
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
            });
            }
            // this.$router.push({ path: "/login" });
          });
        }
      });
    },
    updatePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      console.log("1111");
      this.$store.dispatch("user/logout");
      setTimeout(() => {
        sessionStorage.clear();
        window.location.reload();
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
