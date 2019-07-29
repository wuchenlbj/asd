<!--勘探地质-->
<template>
  <div class="">

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="ruleForm" :inline="true" label-width="220px" style="margin-top:10px;">

      <el-form-item label="研究工区面积（km2)" prop="YJGQMJ">
        <el-input v-model="form.YJGQMJ" style="width:150px; " placeholder="研究工区面积（km2)"></el-input>
      </el-form-item>
      <el-form-item label="研究目的层位" prop="YJMDCW">
        <el-input v-model="form.YJMDCW" style="width:150px; " placeholder="研究目的层位"></el-input>
      </el-form-item>
      <el-form-item label="完成地层对比井数（口）" prop="WCDCDBJS">
        <el-input v-model="form.WCDCDBJS" style="width:150px; " placeholder="完成地层对比井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="预测有利区数量（个）" prop="YCYLQSL">
        <el-input v-model="form.YCYLQSL" style="width:150px; " placeholder="预测有利区数量（个）"></el-input>
      </el-form-item>
      <el-form-item label="预测有利区面积（km2）" prop="YCYLQMJ">
        <el-input v-model="form.YCYLQMJ" style="width:150px; " placeholder="预测有利区面积（km2）"></el-input>
      </el-form-item>
      <el-form-item label="计算地质储量（万吨）" prop="DZCL">
        <el-input v-model="form.DZCL" style="width:150px; " placeholder="计算地质储量（万吨）"></el-input>
      </el-form-item>
      <el-form-item label="编制图件（幅）" prop="BJTJ">
        <el-input v-model="form.BJTJ" style="width:150px; " placeholder="编制图件（幅）"></el-input>
      </el-form-item>
      <el-form-item label="提供部署井位数（口）" prop="TGBSJS">
        <el-input v-model="form.TGBSJS" style="width:150px; " placeholder="提供部署井位数（口）"></el-input>
      </el-form-item>
      <el-form-item label="建议试油井（口）" prop="JYSYJS">
        <el-input v-model="form.JYSYJS" style="width:150px; " placeholder="建议试油井（口）"></el-input>
      </el-form-item>
      <el-form-item label="依据成果完钻探井数（口）" prop="WCZTJS">
        <el-input v-model="form.WCZTJS" style="width:150px; " placeholder="依据成果完钻探井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="实际获得油流探井数（口）" prop="SJHDYLTJS">
        <el-input v-model="form.SJHDYLTJS" style="width:150px; " placeholder="实际获得油流探井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="实际获得工业油流探井数（口）" prop="SJHDGYYLTJ">
        <el-input v-model="form.SJHDGYYLTJ" style="width:150px; " placeholder="实际获得工业油流探井数（口）"></el-input>
      </el-form-item>
      <el-form-item label="实际增加含油面积（km2)" prop="SJZJHYMJ">
        <el-input v-model="form.SJZJHYMJ" style="width:150px; " placeholder="实际增加含油面积（km2)"></el-input>
      </el-form-item>
      <el-form-item label="实际增加地质储量（万吨）" prop="SJZJDZCL">
        <el-input v-model="form.SJZJDZCL" style="width:150px; " placeholder="实际增加地质储量（万吨）"></el-input>
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
import { getFormDataKTDZ, saveDataKTDZ } from 'api/cggl/cgpj.js'
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
        TBR: '',
        LXFS: '',
        KTBH: '',
        GDID: '',
        YJGQMJ: '',
        YJMDCW: '',
        WCDCDBJS: '',
        YCYLQSL: '',
        YCYLQMJ: '',
        DZCL: '',
        BJTJ: '',
        TGBSJS: '',
        JYSYJS: '',
        WCZTJS: '',
        SJHDYLTJS: '',
        SJHDGYYLTJ: '',
        SJZJHYMJ: '',
        SJZJDZCL: '',
        QT: '',
        TYPE: 'add'
      },
      rules: {
        YJGQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YJMDCW: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        WCDCDBJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YCYLQSL: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        YCYLQMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        DZCL: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        BJTJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        TGBSJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JYSYJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        WCZTJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SJHDYLTJS: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SJHDGYYLTJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SJZJHYMJ: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        SJZJDZCL: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }]
      }
    }
  },

  methods: {
    _getchange(id, ktbh) {
      // 查询信息
      getFormDataKTDZ({ id: id }).then(response => {
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

          saveDataKTDZ(this.form).then(response => {
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