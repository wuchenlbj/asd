<!--修改密码 -->
<template>
  <div>
    <div class="con">
      <div class='h2'>修改密码</div>
      <el-row>
        <el-col :offset="8" :span="6" style="background-color:#fafafa;height:100%;padding:0 30px;">
          <div>

            <div style="height:80px;width:100%;background-color:#fafafa;border-bottom:1px solid rgba(0,0,0,.07);margin-bottom:20px;padding-right:20px;">
              <h3 style="line-height:80px;padding-left:40px;" class="animated bounceInLeft">
                <img src="public/images/male.png" class="user-avatar">
                <span class="spinfo">个人信息</span>
              </h3>
            </div>

            <el-form  :rules="rules"  :model="form" ref="form" label-width="100px">
              <input type="hidden" v-model="form.pwd">
              <el-form-item label="输入原密码" prop='oldpassword'>
                <el-input type="password" v-model="form.oldpassword" ></el-input>
              </el-form-item>
              <el-form-item label="输入新密码" prop='password'>
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop='newpassword'>
                <el-input type="password"v-model="form.newpassword" ></el-input>
              </el-form-item>
              <el-form-item style="display:block;padding-left:40px;">
                <el-button type="primary" v-on:click="savepwd('form')" :loading="saveloading">提交</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-col>

      </el-row>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fetch from 'utils/fetch'

export default {
  name: 'changepwd',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.newpassword !== '') {
          this.$refs.form.validateField('newpassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      saveloading: false,
      form: {},
      rules: {
        oldpassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        newpassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    this.form.pwd = this.user.PassWord
  },
  methods: {
    // 修改密码
    savepwd(formName) {
      this.saveloading = true

      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            return fetch({
              baseURL: process.env.PT_BASE_API,
              url: '/api/User/SavePwd',
              method: 'post',
              data: this.form
            }).then(response => {
              // this.treeData = response.data
              this.saveloading = false

              if (response.data) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                resolve()
              }
            }).catch(error => {
              this.saveloading = false
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          this.saveloading = false
          return false
        }
      })
    },
    getDWtree() { // 获取单位树
      return new Promise((resolve, reject) => {
        return fetch({
          baseURL: process.env.PT_BASE_API,
          url: '/api/Page/GetUnitTreeJson',
          method: 'post'
        }).then(response => {
          //console.info(response.data)
          this.treeData = response.data
          if (response.data) {
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>
 

<style rel="stylesheet/scss" lang="scss" scoped>
.con {
  margin: 15px 50px 10px 30px;
  font-size: 0.8rem;
  .h2 {
    height: 50px;
    line-height: 40px;
    background: #5d96dd;
    color: #fff;
    text-indent: 10px;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 10px;
  }
  .navbtn {
    cursor: pointer;
    color: #5d96dd;
    margin-left: 20px;
  }
  .input-group-addon-right {
    border-right: 1px solid #ccc !important;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
  .spinfo {
    margin-left: 10px;
  }
  .user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-left: 10px;
    display: inline-block;
    vertical-align: middle;
  }
  .list-unstyled {
    li {
      list-style-type: none;
      margin-left: 20px;
      line-height: 25px;
      font-size: 1.05em;
    }
    label {
      font-weight: 400;
      width: 60px;
    }
  }
}
</style>
