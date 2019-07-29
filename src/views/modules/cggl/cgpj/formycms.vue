<!--油藏描述-->
<template>
  <div class="">

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="ruleForm" :inline="true" label-width="220px" style="margin-top:10px;">

      <el-form-item label="研究工区面积（km2)" prop="YJGQMJ">
        <el-input v-model="form.YJGQMJ" style="width:150px; " placeholder="研究工区面积（km2)"></el-input>
      </el-form-item>
      <el-form-item label="研究工区采油井井数（口）" prop="YJGQYJJS">
        <el-input v-model="form.YJGQYJJS" style="width:150px; " placeholder="研究工区采油井井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="研究工区注水井井数（口）" prop="YJGQSJJS">
        <el-input v-model="form.YJGQSJJS" style="width:150px; " placeholder="研究工区注水井井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="编制图件（幅）" prop="BZTJ">
        <el-input v-model="form.BZTJ" style="width:150px; " placeholder="编制图件（幅）"></el-input>
      </el-form-item>
      <el-form-item label="建议调整方案工作量（口）" prop="JYTZGZL">
        <el-input v-model="form.JYTZGZL" style="width:150px; " placeholder="建议调整方案工作量（口）"></el-input>
      </el-form-item>
      <el-form-item label="实际完成调整措施井数（口）" prop="SJWCTZCSJS">
        <el-input v-model="form.SJWCTZCSJS" style="width:150px; " placeholder="实际完成调整措施井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="采油井措施效果分析" prop="YJCSXGFX">
        <el-input type="textarea" v-model="form.YJCSXGFX" style="width:350px; " placeholder="采油井措施效果分析"></el-input>
      </el-form-item>
      <el-form-item label="注水井措施效果分析" prop="SJCSXGFX">
        <el-input type="textarea" v-model="form.SJCSXGFX" style="width:350px; " placeholder="注水井措施效果分析"></el-input>
      </el-form-item>
      <el-form-item label="实施前水驱面积（km2）" prop="SSQSQMJ">
        <el-input v-model="form.SSQSQMJ" style="width:150px; " placeholder="实施前水驱面积（km2）"></el-input>
      </el-form-item>
      <el-form-item label="实施后水驱面积（km3）" prop="SSHSQMJ">
        <el-input v-model="form.SSHSQMJ" style="width:150px; " placeholder="实施后水驱面积（km3）"></el-input>
      </el-form-item>
      <el-form-item label="实施前水驱储量动用程度（%）" prop="SSQSQCLDYCD">
        <el-input v-model="form.SSQSQCLDYCD" style="width:150px; " placeholder="实施前水驱储量动用程度（%）"></el-input>
      </el-form-item>
      <el-form-item label="实施后水驱储量动用程度（%）" prop="SSHSQCLDYCD">
        <el-input v-model="form.SSHSQCLDYCD" style="width:150px; " placeholder="实施后水驱储量动用程度（%）"></el-input>
      </el-form-item>
      <el-form-item label="实施前分注井数（口）" prop="SSQFZJS">
        <el-input v-model="form.SSQFZJS" style="width:150px; " placeholder="实施前分注井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="实施后分注井数（口）" prop="SSHFZJS">
        <el-input v-model="form.SSHFZJS" style="width:150px; " placeholder="实施后分注井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="其它" prop="QT">
        <el-input v-model="form.QT" style="width:150px; " placeholder="其它"></el-input>
      </el-form-item>
      <el-form-item label="填报人" prop="TBR">
        <el-input v-model="form.TBR" style="width:150px; " placeholder="填报人"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="LXFS">
        <el-input v-model="form.LXFS" style="width:150px; " placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="项目评价报告Word版">
        <a style="color:blue;" v-if="form.FILENAME" :href="actiondownurl+'filename='+form.FILENAME+'&filepath='+form.FILEPATH">{{form.FILENAME}}</a>
        <el-upload class="upload-demo" :action="actionurl" :show-file-list="false" :on-error="onerror" :before-upload="beforeAvatarUpload" :headers="headersData" :on-success="filesuccess" :data="uploadData" :multiple="false">
          <el-button type="warning" :loading="uploadbtn">上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left:220px;width:100%;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script >
import msg from 'utils/loadmsg'
import { getFormDataYCMS, saveDataYCMS } from 'api/cggl/cgpj.js'
import { saveFileByFID } from 'api/cggl/cgdj'
export default {
  name: 'formjl',
  props: {
    selectRows: {
      type: Object,
      default() {
        return null
      }
    },
    currentFormName: {
      type: String
    }
  },
  watch: {
    selectRows: function (rows) {
      this._getchange(rows.ID, rows.KTBH)
    },
    currentFormName: function (val) {
      this.form.ZYFL = val
    }
  },
  mounted() {
    if (this.selectRows) {
      this._getchange(this.selectRows.ID, this.selectRows.KTBH)
    }
  },
  data() {
    const validDF = (rule, value, callback) => {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }

    return {
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      uploadbtn: false,
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
        ZYFL: '',
        KTBH: '',
        YJGQMJ: '',
        YJGQYJJS: '',
        YJGQSJJS: '',
        BZTJ: '',
        JYTZGZL: '',
        SJWCTZCSJS: '',
        YJCSXGFX: '',
        SJCSXGFX: '',
        SSQSQMJ: '',
        SSHSQMJ: '',
        SSQSQCLDYCD: '',
        SSHSQCLDYCD: '',
        SSQFZJS: '',
        SSHFZJS: '',
        QT: '',
        TBR: '',
        LXFS: '',
        TYPE: 'add'
      },
      rules: {
        YJGQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YJGQYJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YJGQSJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BZTJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JYTZGZL: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SJWCTZCSJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        // YJCSXGFX: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        // SJCSXGFX: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSQSQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSHSQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSQSQCLDYCD: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSHSQCLDYCD: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSQFZJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SSHFZJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }]
      }
    }
  },

  methods: {
    _getchange(id, ktbh) {
      // 查询信息
      getFormDataYCMS({ id: id }).then(response => {
        if (response.data.length == 1) {
          this.form = response.data[0]
          this.form.TYPE = 'edit'

        } else {
          this.form.TYPE = 'add'
        }
        this.form.KTBH = ktbh
        this.form.GDID = id
        this.form.ZYFL = this.currentFormName
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },

    // 上传验证
    beforeAvatarUpload(file) {
      if (this.selectRows == null) {
        msg.showwarning('请先选择相关数据行')
        return false
      }
      var len = file.name.split('.')
      const extension = file.name.split('.')[len.length - 1]
      const isExcel = (extension === 'docx' || extension === 'doc');
      if (!isExcel) {
        msg.showwarning('请上传word格式的文件')
        return false
      }

      this.uploadbtn1 = true
    },

    // 文件上传成功
    filesuccess(response, file, fileList) {
      var _this = this
      // 保存文档库以及业务库
      var fids = []
      fids.push(_this.selectRows.ID)

      _this.fileList = {
        tablename: '',
        name: fileList[0].name,
        fids: fids,
        // lx: lx,
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')

        _this.uploadbtn = false
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

          saveDataYCMS(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            this.$emit('refreshList');
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
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