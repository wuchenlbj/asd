<template>
  <div class="login">
    <div class="left">

      <div class="loginhead">
        <a id="logo" href="/">
          <!-- <img :src="'../../public/images/logo.png'"> -->
          <img src="../../public/images/logo.png">
          <span>{{title}}</span>
        </a>
      </div>
      <div class="loginmain">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px" class="card-box login-form">
          <div class="formlogin">
            <el-form-item prop="UserName">
              <el-input name="UserName" class="lineinput" type="text" v-model="loginForm.UserName" autoComplete="on" placeholder="输入用户名">
                <template slot="append">输入用户名</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="UserPwd">
              <el-input name="UserPwd" class="lineinput" type="password"  @keyup.enter.native="login" v-model="loginForm.UserPwd" autoComplete="on" placeholder="密码">
                <template slot="append">输入密码</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" style="width:350px;" @click='login()'>登录</el-button>

            </el-form-item>
            <el-form-item>
              <el-tooltip :content="'主题风格'" placement="top">
                <el-switch v-model="themefg" active-text="经典" inactive-text="炫动" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-tooltip>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="right">
      <carrousel></carrousel>
    </div>
  </div>
</template>

<script>
// import Login from './Login.js';

import carrousel from "../components/Login/swiper";

export default {
  components: {
    carrousel
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      
      loading: false,
      themefg: "1",
      title: "延长油田科技项目管理平台",
      loginForm: {
        UserName: "",
        UserPwd: ""
      },
      loginRules: {
        UserName: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        UserPwd: [{ required: true, trigger: "blur", validator: validatePass }]
      }
    };
  },
  methods: {
    login() {
      localStorage.theme = this.themefg; // 1.经典 0 炫动
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$message.success("验证成功！")

              if (this.themefg == "1") {
                this.$router.push("/");
              } else {
                this.$router.push("/homedetail");
              }
            })
            .catch(err => {
              this.loading = false;

              this.$message.error(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.loginhead {
  width: 100%; // margin-top: 30%; //
  position: absolute;
  top: 28%;
  left: 80px;

  #logo {
    display: inline-block;
    font-size: 2em;
    line-height: 50px;
    color: #ff0000;
    text-shadow: 5px 5px 5px #9f9f9f;
    font-family: "微软雅黑", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    text-decoration: none;
    font-weight: 500;
  }
  #logo img {
    width: 75px;
    height: 55px;
    vertical-align: bottom;
  }
}

.loginmain {
  // background: url('../../../public/images/loginbg.png') no-repeat;
  width: 100%;
  margin: 0 auto;
  height: 250px;
  position: relative;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #2e2e2e !important;
  }
  input {
    background: transparent;
    border: 0px;
    border-bottom: 1px solid #ccc;
    -webkit-appearance: none;
    border-radius: 0px; // padding: 12px 5px 12px 15px;
    color: #2e2e2e; // height: 47px;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
    display: table-cell;
    position: relative;
    border: 0;
    border-bottom: 1px solid #bfcbd9;
    padding: 0 10px;
    width: 1px;
    white-space: nowrap;
  }
}

.loginmain .formlogin {
  height: 50px; // padding-top: 10px;
  width: 400px;
  margin: 0 auto;
}

.loginmain .formlogin .el-input {
  width: 350px;
}
</style>

<style scoped >
.login {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  height: 100%;
  justify-content: center;
  min-height: 620px;
  min-width: 1200px;
}
.left {
  width: 480px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.left:before {
  content: "";
  -webkit-box-flex: 2;
  -ms-flex: 2;
  flex: 2;
}
.left:after {
  content: "";
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.right {
  width: calc(100% - 480px);
  min-height: 620px;
  height: 100vh;
}
</style>
 