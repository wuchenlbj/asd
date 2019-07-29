<template>
    <header class="head-nav" :style="styleObject">
        <div style="width:100%;float:left;">
            <div style="width:80%;height:80px;float:left; line-height:80px;">
                <a id="logo" href="/">
                    <img src="../../../public/images/logo.png">
                    <span>{{title}}</span>
                </a>
            </div>
            <div style="width:20%;float:left;" class="userinfo">
                <el-dropdown class="avatar-container" trigger="click" @command='setDialogInfo'>
                    <div class="avatar-wrapper">
                        <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
                        <span class="user-name">{{name}}</span>
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <router-link class='inlineBlock' to="/changelog">
                            <el-dropdown-item  command='changelog'>
                                版本信息
                            </el-dropdown-item>
                        </router-link> 
                         <router-link class='inlineBlock' to="/changepwd">
                          <el-dropdown-item  command='changepwd'>
                              修改密码
                          </el-dropdown-item>
                      </router-link>
                        <!-- <el-dropdown-item command='pass'>修改密码</el-dropdown-item> -->
                        <el-dropdown-item command='set'>系统设置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <i class="fa fa-sign-out logout" @click='logout'></i>
            </div>
        </div>
        
    </header>
</template>
  opacity: 0.8;
      position: absolute;
      background: #000;
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "延长油田科技项目管理平台",
      styleObject: {
        borderBottom: "none",
        backgroundColor: "#f8f6f2"
      },
      dialog_test1: false,
      bgcolor: "#324057",
      bordercolor: "#1f2d3d",
      aaList: {}
    };
  },
  mounted() {
    if (this.$route.name != "homedetail") {
        this.styleObject={
         backgroundColor: '#324057',
         borderBottom :"#1f2d3d",
        //  opacity:0.7
      }

    } else {
    }
    // this.onGetSetting();
  },
  computed: {
    ...mapGetters(['avatar', 'name'])
  },
  methods: {
    /**
         * 退出登录
         */
    logout() {
      this.$confirm("你确定退出登录么?", "确认退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        });
        // this.$store.dispatch('remove_userinfo').then(() => {
        //     this.$router.push('/login');
        // });
      });
    },

    /**
         * 弹出框-修改密码或者系统设置   
         * @param {string} cmditem 弹框类型
         */
    setDialogInfo(cmditem) {
      if (!cmditem) {
        this.$message.error("菜单选项缺少command属性");
        return;
      }
      switch (cmditem) {
        case "info":
          this.$router.push({
            path: "/demo/user/edit",
            query: {
              id: this.$store.state.user.userinfo.id
            }
          });
          break;
        case "pass":
          this.dialog.show_pass = true;
          this.dialog.title = "修改密码";
          break;
        case "set":
          this.onGetSetting();
          this.dialog.show_set = true;
          this.dialog.title = "系统设置";
          break;
        case "test":
          this.dialog_test1 = true;
          break;
      }
    },

    /**
         * 修改密码
         * @param  {object} userinfo 当前修改密码的表单信息
         */
    updUserPass(userinfo) {
      this.$refs[userinfo].validate(valid => {
        if (valid) {
          UserApi.updPass.call(
            this,
            {
              old_password: this.dialog[userinfo].old_password,
              password: this.dialog[userinfo].password,
              password_confirm: this.dialog[userinfo].password_confirm
            },
            data => {
              this.dialog.show_pass = false;
              // this.$nextTick(() => {
              this.$message.success("修改成功！");
              // });
            }
          );
        }
      });
    },

    /**
         * 获取系统设置信息
         */
    onGetSetting() {
      //获取系统设置信息
      if (this.$store.state.user.userinfo.pid == 0) {
        SystemApi.getSetting.call(this, data => {
          // console.log(data);
          if (data.setting_info.disabled_update_pass) {
            data.setting_info.disabled_update_pass = data.setting_info.disabled_update_pass.split(
              ","
            );
          } else {
            data.setting_info.disabled_update_pass = [];
          }
          data.setting_info.login_style = data.setting_info.login_style + "";

          this.dialog.set_info = data.setting_info;
        });
      } else {
        this.$message.error("只有管理员才能操作！");
      }
    },

    /**
         * 修改系统设置信息
         */
    onUpdateSetting() {
      // console.log(this.dialog.set_info.login_style);
      // console.log(this.dialog.set_info.disabled_update_pass);
      // console.log(this.dialog.set_info.id);

      SystemApi.updateSetting.call(
        this,
        {
          id: this.dialog.set_info.id,
          login_style: this.dialog.set_info.login_style,
          disabled_update_pass:
            this.dialog.set_info.disabled_update_pass &&
            this.dialog.set_info.disabled_update_pass.length
              ? this.dialog.set_info.disabled_update_pass.join(",")
              : ""
        },
        data => {
          // console.log(data);
          this.dialog.show_set = false;
        }
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.head-nav {
  width: 100%;
  height: 80px;
  border-bottom: #324057;
  line-height: 80px;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1999;
  .fa-user {
    position: relative;
    top: -2px;
    margin-right: 4px;
  }
  #logo {
    padding-left: 30px;
    margin: 0;
    padding: 0;
    height: 80px;
    color: #ff0000;
    text-shadow: 0px 1px 2px #ddd;
    font-family: "微软雅黑", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    text-decoration: none;
  }
  #logo span {
    font-size: 1.6em;
    color: #ff0000;
    line-height: 80px;
    margin: 0;
    padding: 0;
  }
  #logo img {
    width: 70px;
    height: 55px;
    margin-top: -10px;
    vertical-align: middle;
  }

  .logout {
    width: 60px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    float: right;
    color: white;
    cursor: pointer;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    top: 15px;
    color: #fff;
    right: 70px;
    .avatar-wrapper {
      cursor: pointer;
      line-height: 50px;
      height: 100%;
      position: relative;
      .user-avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
      }
      .user-name {
        color: white;
        line-height: 50px;
        height: 100%;
        margin-left: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}

.userinfo {
  text-align: right;
}

.username {
  height: 60px;
  line-height: 60px;
  cursor: pointer;

  .el-dropdown {
    color: #fff;
  }
}
</style>
