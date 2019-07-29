<!--开发方案-->
<template>
  <div class="">

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="ruleForm" :inline="true" label-width="230px" style="margin-top:10px;">

      <el-form-item label="研究工区面积（km2)" prop="YJGQMJ">
        <el-input v-model="form.YJGQMJ" style="width:150px; " placeholder="研究工区面积（km2)"></el-input>
      </el-form-item>
      <el-form-item label="研究工区井数（口）" prop="YJGQJS">
        <el-input v-model="form.YJGQJS" style="width:150px; " placeholder="研究工区井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="编制图件（幅）" prop="BJTJ">
        <el-input v-model="form.BJTJ" style="width:150px; " placeholder="编制图件（幅）"></el-input>
      </el-form-item>
      <el-form-item label="部署注水井数（口）" prop="BSSJJS">
        <el-input v-model="form.BSSJJS" style="width:150px; " placeholder="部署注水井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="研究工区注水规模（m3/d）" prop="YJGQZSGM">
        <el-input v-model="form.YJGQZSGM" style="width:150px; " placeholder="研究工区注水规模（m3/d）"></el-input>
      </el-form-item>
      <el-form-item label="部署采油井数（口）" prop="BSYJJS">
        <el-input v-model="form.BSYJJS" style="width:150px; " placeholder="部署采油井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="部署测试井数（口）" prop="BSCSJS">
        <el-input v-model="form.BSCSJS" style="width:150px; " placeholder="部署测试井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="建成注水站数（座）" prop="JCZSZS">
        <el-input v-model="form.JCZSZS" style="width:150px; " placeholder="建成注水站数（座）"></el-input>
      </el-form-item>
      <el-form-item label="建成注水站注水规模合计" prop="JCZSZZSGMHJ">
        <el-input v-model="form.JCZSZZSGMHJ" style="width:150px; " placeholder="建成注水站注水规模合计（m3/d）"></el-input>
      </el-form-item>
      <el-form-item label="完成采油井数（口）" prop="WCYJJS">
        <el-input v-model="form.WCYJJS" style="width:150px; " placeholder="完成采油井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="完成注水井数（口）" prop="WCSJJS">
        <el-input v-model="form.WCSJJS" style="width:150px; " placeholder="完成注水井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="测试井数（口）" prop="CSJS">
        <el-input v-model="form.CSJS" style="width:150px; " placeholder="测试井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="增加水驱面积（km2)" prop="ZJSQMJ">
        <el-input v-model="form.ZJSQMJ" style="width:150px; " placeholder="增加水驱面积（km2)"></el-input>
      </el-form-item>
      <el-form-item label="增加水驱地质储量（万吨）" prop="ZJSQDZCL">
        <el-input v-model="form.ZJSQDZCL" style="width:150px; " placeholder="增加水驱地质储量（万吨）"></el-input>
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
import { getFormDataKFFA, saveDataKFFA } from 'api/cggl/cgpj.js'
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
        YJGQJS: '',
        BJTJ: '',
        BSSJJS: '',
        YJGQZSGM: '',
        BSYJJS: '',
        BSCSJS: '',
        JCZSZS: '',
        JCZSZZSGMHJ: '',
        WCYJJS: '',
        WCSJJS: '',
        CSJS: '',
        ZJSQMJ: '',
        ZJSQDZCL: '',
        QT: '',
        TBR: '',
        LXFS: '',
        TYPE: 'add'
      },
      rules: {
        YJGQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YJGQJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BJTJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BSSJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YJGQZSGM: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BSYJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BSCSJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JCZSZS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JCZSZZSGMHJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        WCYJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        WCSJJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        CSJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        ZJSQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        ZJSQDZCL: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }]
      }
    }
  },

  methods: {
    _getchange(id, ktbh) {
      // 查询信息
      getFormDataKFFA({ id: id }).then(response => {
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
      if (!this.currentFormName) {
        msg.showwarning('没有获取到专业分类，请刷新重试')
        return false
      }
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {

          saveDataKFFA(this.form).then(response => {
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