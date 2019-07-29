<!--新技术研究应用-->
<template>
  <div class="">

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="ruleForm" :inline="true" label-width="200px" style="margin-top:10px;">

      <el-form-item label="研究成果" prop="YJCG">
        <el-input type="textarea" v-model="form.YJCG" style="width:350px; " placeholder="研究成果(技术原理、技术适应性）"></el-input>
      </el-form-item>
      <el-form-item label="应用状况" prop="YYZK">
        <el-input type="textarea" v-model="form.YYZK" style="width:350px; " placeholder="应用状况(应用区域概况、应用规模、应用时间)"></el-input>
      </el-form-item>
      <el-form-item label="取得效果" prop="QDCG">
        <el-input type="textarea" v-model="form.QDCG" style="width:350px; " placeholder="取得效果（经济效益、社会效益）"></el-input>
      </el-form-item>
      <el-form-item label="存在问题" prop="CZWT">
        <el-input type="textarea" v-model="form.CZWT" style="width:350px; " placeholder="存在问题"></el-input>
      </el-form-item>
      <el-form-item label="应用前景和下步工作建议" prop="YYQJ">
        <el-input type="textarea" v-model="form.YYQJ" style="width:350px; " placeholder="应用前景和下步工作建议"></el-input>
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
import { getFormDataYJYY, saveDataYJYY } from 'api/cggl/cgpj.js'
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
        YJCG: '',
        YYZK: '',
        QDCG: '',
        CZWT: '',
        YYQJ: '',
        TBR: '',
        LXFS: '',
        TYPE: 'add'
      },
      rules: {
        YJCG: [{ required: true, message: '请输入研究成果', trigger: 'blur' }],
        YYZK: [{ required: true, message: '请输入应用状况', trigger: 'blur' }]
      }
    }
  },

  methods: {
    _getchange(id, ktbh) {
      // 查询信息
      getFormDataYJYY({ id: id }).then(response => {
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

          saveDataYJYY(this.form).then(response => {
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