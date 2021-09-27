<template>
  <div class="dashboard-container">
    <div class="carousel">
      <el-carousel height="calc(100vh - 100px)">
        <el-carousel-item v-for="item in imgData" :key="item" >
          <img class="carouselImg" :src="item" />
        </el-carousel-item>
      </el-carousel>
    </div>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 引入密码不是字母+数字的，接口验证
import { passwordVerify } from "@/api/passwordVerify.js";
import { sureUpdatePwd } from "@/api/user.js"; //修改密码接口
import { removeToken } from "@/utils/auth";
import img1 from "../img/slide1.jpg"
import img2 from "../img/slide3.jpg"
import img3 from "../img/slide4.jpg"
import img4 from "../img/loginbg.jpg"

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
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
      updatePwdDto: {
        password: "",
        newPassword: "",
        userId: "",
      },
      //修改密码的规则
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
      isEditPassword: false,
      dialogFormVisible: false,
      dialogFormWarning: false,
      imgData:[img1,img2,img3,img4]
    };
  },
  created() {},
  methods: {
    editPasswordDialog() {
      this.dialogFormVisible = true;
    },
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
              this.$router.push("/login");
              this.dialogFormVisible = false;
            } else {
              this.$notify({
                message: res.msg,
                type: "warning"
              });
            }
            // this.$router.push({ path: "/login" });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    width: 100%;
    // height: 100%;
    min-height: calc(100vh - 100px);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.carousel{
  width: 100%;
  // height: 100%;
  min-height: calc(100vh - 100px);
}
.carouselImg{
  min-height: calc(100vh - 100px);
}
.el-carousel__container{
  min-height: calc(100vh - 100px);
}
</style>
