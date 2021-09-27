<template>
  <div class="login-container">
    <img src="../img/loginbg.jpg" alt class="login-bg" />
    <!-- <div class="canvasBg"><canvas id="cas"></canvas></div> -->
    <div class="login-Small-bg">
      <div class="login-right">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form box "
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">鑫艺拍拍</h3>
            <p >欢迎登录鑫艺拍拍后台管理系统</p>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <!-- <svg-icon icon-class="person" /> -->
              <img src="../img/zh@2x.png" alt />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              style="background: transparent;"
            />
          </el-form-item>

          <el-form-item prop="password" >
            <span class="svg-container">
              <!-- <svg-icon icon-class="password" /> -->
              <img src="../img/mm @2x.png" alt />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="submitBun"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import store from "@/store";
import { JSEncrypt } from "jsencrypt";
import { animate,resize } from "@/utils/bgCanvas.js";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      callback();
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  mounted() {},
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = JSON.parse(JSON.stringify(this.loginForm));
          // 密码加密
          // var encrypt = new JSEncrypt();
          // encrypt.setPublicKey(store.getters.publicKey);
          // var encrypted = encrypt.encrypt(data.password);
          // data.password = encrypted;
          this.$store
            .dispatch("user/login", data)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    initCanvas(){
        var canvas = document.getElementById("cas");
        console.log(canvas,'canvas')
        var ctx = canvas.getContext("2d");

        resize(canvas);
        window.onresize = resize;

        var RAF = (function() {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
        })();

        // 鼠标活动时，获取鼠标坐标
        var warea = {x: null, y: null, max: 20000};
        window.onmousemove = function(e) {
          e = e || window.event;

          warea.x = e.clientX;
          warea.y = e.clientY;
        };
        window.onmouseout = function(e) {
          warea.x = null;
          warea.y = null;
        };

        // 添加粒子
        // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
        var dots = [];
        for (var i = 0; i < 300; i++) {
          var x = Math.random() * canvas.width;
          var y = Math.random() * canvas.height;
          var xa = Math.random() * 2 - 1;
          var ya = Math.random() * 2 - 1;

          dots.push({
            x: x,
            y: y,
            xa: xa,
            ya: ya,
            max: 6000
          })
        }

        // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
        setTimeout(function() {
          console.log('aaaa')
          animate(ctx,dots,canvas);
        }, 100);
        var RAF = (function() {
          return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
        })();
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #006fe2;
$cursor: #006fe2;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    // border: 1px solid #e1dfdf;
    // border-radius: 5px;
    // background: transparent;
    color: #454545;
  }
  .login-bg {
    width: 100%;
    height: 100%;
  }
}
.login-Small-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .login-left {
    float: left;
  }
  .login-right {
    float: right;
  }
}
</style>

<style lang="scss" scoped>
// $bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #006fe2;

.login-container {
  height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 40px 40px 20px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 12px 5px 6px 15px;
    // color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    color: #D3D7F7;
    p {
      color: #999;
      margin-bottom: 40px;
    }
    .title {
      font-size: 30px;
      color: #D3D7F7;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: 400;
      // font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.canvasBg{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.login-right .box{
    backface-visibility: hidden;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)',GradientType=1 );
    box-shadow: -15px 15px 15px rgba(0,0,0,.4);
    transition: all 1s;
    transform:rotateY(0deg);
}
.submitBun{
  width: 60%;
  border: 2px solid #4FA1D9;
  color: #4FA1D9;
  padding: 10px 80px;
  border-radius: 50px;
  background: transparent;
  font-size: 11px;
  color: #4FA1D9;
  -webkit-transition: all .2s;
  -o-transition: all .2s;
  transition: all .2s;
  margin: 10px 20%;
}
</style>
