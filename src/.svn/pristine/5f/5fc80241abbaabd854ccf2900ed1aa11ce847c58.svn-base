<!-- 成果管理-专利 -->
<template>
  <div class="">

    <!-- 第三部分 -->
    <el-tooltip class="item" effect="dark" content="1对多文件上传" placement="top-start">
      <h4>3.集团申报及奖励及油田专利奖励(1对多)</h4>
    </el-tooltip>

    <!-- 表单 -->
    <el-form :model="form" :rules="rules2" ref="ruleForm" :inline="true" label-width="160px" style="margin-top:10px;">
      <el-form-item label="集团月报表上报受理" prop="JTSBSL">
        <el-date-picker v-model="form.JTSBSL" type="month" value-format="yyyy-MM" placeholder="集团月报表上报受理" style="width:150px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="集团月报表上报授权" prop="JTSBSQ">
        <el-date-picker v-model="form.JTSBSQ" type="month" value-format="yyyy-MM" placeholder="集团月报表上报授权" style="width:150px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="集团奖励年度" prop="JTSBSND">
        <el-date-picker v-model="form.JTSBSND" type="year" value-format="yyyy" placeholder="集团奖励年度" style="width:150px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="油田奖励年度" prop="YTJLND">
        <el-date-picker v-model="form.YTJLND" type="year" value-format="yyyy" placeholder="油田奖励年度" style="width:150px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:110px;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
      </el-form-item>
      <el-form-item style="width:90%;">
        <el-row>
          集团公司专利奖励发放通知文件:
          <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME4+'&filepath='+smjpic.FILEPATH4">{{smjpic.FILENAME4}}</a>
          <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload1" :headers="headersData" :on-success="filesuccess1" :data="uploadData" :multiple="false">
            <el-button type="warning" :loading="uploadbtn1">上传</el-button>
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item style="width:90%;">
        <el-row>
          油田公司专利奖励发放通知文件:
          <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME5+'&filepath='+smjpic.FILEPATH5">{{smjpic.FILENAME5}}</a>
          <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload2" :headers="headersData" :on-success="filesuccess2" :data="uploadData" :multiple="false">
            <el-button type="warning" :loading="uploadbtn1">上传</el-button>
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item style="width:90%;">
        <el-row>
          专利奖励反馈表:
          <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME6+'&filepath='+smjpic.FILEPATH6">{{smjpic.FILENAME6}}</a>
          <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload3" :headers="headersData" :on-success="filesuccess3" :data="uploadData" :multiple="false">
            <el-button type="warning" :loading="uploadbtn1">上传</el-button>
          </el-upload>
        </el-row>
      </el-form-item>

    </el-form>

  </div>
</template>

<script >
import { NewGuid } from '@/config/filter'
import msg from 'utils/loadmsg'
import { getZLJLData, saveZLJLData } from 'api/cggl/zscq.js'
import { saveFileByFID } from 'api/cggl/cgdj'
export default {
  name: 'formjl',
  props: {
    value: {
      type: String,
      default: ''
    },
    smjpic: {
      type: Object,
      default() {
        return null
      }
    },
    selectRows: {
      type: Array,
      default() {
        return null
      }
    }
  },
  watch: {
    smjpic: function (value) {
      // 查询奖励附件信息
      this.form.JTSBSL = value.JTSBSL
      this.form.JTSBSQ = value.JTSBSQ
      this.form.JTSBSND = value.JTSBSND
      this.form.YTJLND = value.YTJLND
      this.form.ZLID = value.ZLID
      this.form.TYPE = 'edit'
    }
  },
  data() {
    return {
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      uploadbtn1: false,
      uploadbtn2: false,
      uploadbtn3: false,
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      // 上传参数
      uploadData: {
        id: ''
      },
      tableData: [],
      loading: false,
      form: {
        ZLID: '',
        JTSBSL: '',
        JTSBSQ: '',
        JTSBSND: '',
        YTJLND: '',
        TYPE: 'add'
      },
      rules2: {
        JTSBSL: [{ required: true, message: '请选择集团月报表上报受理', trigger: 'change' }],
        JTSBSQ: [{ required: true, message: '请选择集团月报表上报授权', trigger: 'change' }],
        JTSBSND: [{ required: true, message: '请选择集团奖励年度', trigger: 'change' }],
        YTJLND: [{ required: true, message: '请选择油田奖励年度', trigger: 'change' }]
      }
    }
  },
  methods: {

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },
    // 受理证书扫描件
    beforeAvatarUpload1(file, ) {
      return this.beforeAvatarUpload(file, 1)
    },
    beforeAvatarUpload2(file) {
      return this.beforeAvatarUpload(file, 2)
    },
    beforeAvatarUpload3(file) {
      return this.beforeAvatarUpload(file, 3)
    },//授权证书扫描件
    //专利年费扫描件
    beforeAvatarUpload(file, index) {
      if (this.selectRows == null) {
        msg.showwarning('请先选择相关数据行')
        return false
      }

      if (index == 1) {
        this.uploadbtn1 = true
      } else if (index == 2) {
        this.uploadbtn2 = true
      } else if (index == 3) {
        this.uploadbtn3 = true
      }
      return true
    },
    filesuccess1(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'JTSBJLID')
    },
    filesuccess2(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'YTZLJLID')
    },
    filesuccess3(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'YTJLFKBID')
    },
    // 文件上传成功
    filesuccess(response, file, fileList, lx) {
      var _this = this
      // 保存文档库以及业务库
      var fids = []
      for (var i = 0; i < _this.selectRows.length; i++) {
        fids.push(_this.selectRows[i].ZLID)
      }

      _this.fileList = {
        tablename: 'kjglpt_cg_zl',
        name: fileList[0].name,
        fids: fids,
        lx: lx,
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')

        if (lx == 'JTSBJLID') _this.uploadbtn1 = false
        else if (lx == 'YTZLJLID') _this.uploadbtn2 = false
        else if (lx == 'YTJLFKBID') _this.uploadbtn3 = false
      })
    },
    resetForm(formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 获取项目所属的软件著作权
    _GetTGXX() {
      this.loading = true
      getZLData(this.listQuery).then(response => {
        this.loading = false
        this.tableData = response.data.rows
        this.total = response.data.total
      })
    },
    // 保存项目立项
    submitForm(formName) {

      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          var forms = []

          for (var i = 0; i < this.selectRows.length; i++) {
            var ff = JSON.parse(JSON.stringify(this.form))
            ff.ZLID = this.selectRows[i].ZLID
            forms.push(ff)
          }
          saveZLJLData(forms).then(response => {
            msg.showsuccess('保存数据成功')
            _this.$refs[formName].resetFields()
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted() {
    // this._GetTGXX()
  }
}
</script>
<style scoped>
.zlxx {
  overflow-y: auto;
  height: 100%;
}
label {
  font-weight: 500 !important;
}
.upload-demo {
  margin-bottom: 10px;
}
</style>