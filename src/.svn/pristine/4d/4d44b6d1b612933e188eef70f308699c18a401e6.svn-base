<!-- 成果管理-专利权人变更 -->
<template>
  <div class="">

    <h4>4.专利权人变更</h4>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click="add">添加变更</el-button>
    </el-button-group>
    <el-table border @row-dblclick="rowdblclick" @cell-click='cellclick' style="width: 100%;margin-top:10px;" height="150" :data="tableData" highlight-current-row v-loading="loading" header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="专利权人变更人" prop="ZLQRBGR" min-width="120"></el-table-column>
      <el-table-column label="提出变更日" prop="TCBGR" width="110">
        <template slot-scope="scope">
          <span class="span-title">{{scope.row.TCBGR|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发文日期" prop="FWRQ" width="100">
        <template slot-scope="scope">
          <span class="span-title">{{scope.row.FWRQ|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="FILEPATH" label="专利变更文件" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH" :href="actiondownurl+'filename='+scope.row.FILENAME+'&filepath='+scope.row.FILEPATH">{{scope.row.FILENAME}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
    </el-table>

    <h4>5.专利维持</h4>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click="add2">添加专利缴费</el-button>
    </el-button-group>
    <el-table border @row-dblclick="rowdblclick2" style="width: 100%;margin-top:10px;" height="200" :data="tableData2" v-loading="loading2" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="交费日期" prop="JFRQ" width="110">
        <template slot-scope="scope">
          <span class="span-title">{{scope.row.JFRQ|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交费金额" prop="ZLNF" min-width="120"></el-table-column>
      <el-table-column label="缴费人" prop="JFR" min-width="120"></el-table-column>

    </el-table>

    <!-- 表单 1-->
    <el-dialog v-dialogDrag title="信息编辑" width="900px" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="120px">
        <el-form-item label="专利权人变更人" prop="ZLQRBGR">
          <el-input v-model="form.ZLQRBGR" style="width:130px;" placeholder="专利权人变更人"></el-input>
        </el-form-item>
        <el-form-item label="提出变更日" prop="TCBGR">
          <el-date-picker v-model="form.TCBGR" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:130px;" placeholder="提出变更日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发文日期" prop="FWRQ">
          <el-date-picker v-model="form.FWRQ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:130px;" placeholder="发文日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专利变更文件" prop="FMR">

          <a style="color:blue;" :href="actiondownurl+'filename='+form.FILENAME+'&filepath='+form.FILEPATH">{{form.FILENAME}}</a>
          <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload" :headers="headersData" :on-success="filesuccess" :data="uploadData" :multiple="false">
            <el-button type="warning" :loading="uploadbtn1">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item style="margin-left:110px;">
          <el-button type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 表单 2-->
    <el-dialog v-dialogDrag title="信息编辑" width="900px" :visible.sync="dialogFormVisible2">
      <el-form :model="form2" ref="ruleForm2" :rules="rules2" :inline="true" label-width="120px">
        <el-form-item label="交费日期" prop="JFRQ">
          <el-date-picker v-model="form2.JFRQ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:130px;" placeholder="交费日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交费人" prop="JFR">
          <el-input v-model="form2.JFR" style="width:130px;" placeholder="交费人"></el-input>
        </el-form-item>
        <el-form-item label="缴费金额" prop="ZLNF">
          <el-input v-model="form2.ZLNF" style="width:130px;" placeholder="缴费金额"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:110px;">
          <el-button type="primary" @click="submitForm2('ruleForm2')">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script >
import { NewGuid } from '@/config/filter'
import msg from 'utils/loadmsg'
import { getZLBGData, saveZLBGData, getZLWCData, saveZLWCData } from 'api/cggl/zscq.js'
import { saveFileByFID } from 'api/cggl/cgdj'
export default {
  name: 'formzlq',
  props: {
    selectRows: {
      type: Array,
      default() {
        return null
      }
    }
  },
  watch: {
    selectRows: function (rows) {
      // 查询奖励附件信息
      var zlid = rows[0].ZLID
      this._GetTGXX()
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
      dialogFormVisible: false,
      dialogFormVisible2: false,
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      uploadbtn1: false,
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      // 上传参数
      uploadData: {
        id: ''
      },
      tableData: [],
      tableData2: [], // 专利维持
      loading: false,
      loading2: false,
      form: {
        ZLQRBGR: '',
        TCBGR: '',
        FWRQ: '',
        ZLID: '',
        DOCID: '',
        ID: '',
        TYPE: 'add'
      },
      form2: {
        JFRQ: '',
        JFR: '',
        ZLID: '',
        ZLNF: '',
        ID: '',
        TYPE: 'add'
      },
      rules: {
        ZLQRBGR: [{ required: true, message: '请输入专利权人变更人', trigger: 'blur' }],
        TCBGR: [{ required: true, message: '请选择提出变更日', trigger: 'change' }],
        FWRQ: [{ required: true, message: '请选择发文日期', trigger: 'change' }]
      },
      rules2: {
        JFR: [{ required: true, message: '请输入交费人', trigger: 'blur' }],
        JFRQ: [{ required: true, message: '请选择交费日期', trigger: 'change' }],
        ZLNF: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }]
      }
    }
  },
  methods: {
    // 添加
    add() {
      this.dialogFormVisible = true
      this.resetForm('ruleForm')
      this.$nextTick(function () {
        this.form.TYPE = 'add'
        this.form.ZLID = this.selectRows[0].ZLID
        this.form.ID = NewGuid()
      })
    },
    add2() {
      this.dialogFormVisible2 = true
      this.resetForm('ruleForm2')
      this.$nextTick(function () {
        this.form2.TYPE = 'add'
        this.form2.ZLID = this.selectRows[0].ZLID
        this.form2.ID = NewGuid()
      })
    },
    // 双击编辑
    rowdblclick(row, event) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = row
        this.form.TYPE = 'edit'
      })
    },
    // 双击编辑
    rowdblclick2(row, event) {
      this.dialogFormVisible2 = true
      this.$nextTick(function () {
        this.form2 = row
        this.form2.TYPE = 'edit'
      })
    },
    cellclick(row, column, cell, event) {
      if (column.type != 'selection') {

      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },

    //专利年费扫描件
    beforeAvatarUpload(file, index) {
      if (this.selectRows == null) {
        msg.showwarning('请先选择相关数据行')
        return false
      }
      this.uploadbtn1 = true
      return true
    },
    // 文件上传成功
    filesuccess(response, file, fileList) {
      var _this = this
      // 保存文档库以及业务库

      var fids = []
      fids.push(_this.form.ID)

      _this.fileList = {
        tablename: 'KJGLPT_CG_ZLBG',
        name: fileList[0].name,
        fids: fids,
        //lx: lx,
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')
        this.uploadbtn1 = false
        // 查询数据
        this._GetTGXX()
      })
    },
    resetForm(formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 获取项目所属的变更信息
    _GetTGXX() {
      var zlid = this.selectRows[0].ZLID
      this.loading = true
      // 专利权人变更
      getZLBGData({ id: zlid }).then(response => {
        this.loading = false
        this.tableData = response.data
      })
      // 专利维持
      this.loading2 = true
      getZLWCData({ id: zlid }).then(response => {
        this.loading2 = false
        this.tableData2 = response.data
      })
    },
    // 保存专利变更
    submitForm(formName) {

      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {

          saveZLBGData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.$refs[formName].resetFields()
            this.dialogFormVisible = false
            this._GetTGXX()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存专利w维持
    submitForm2(formName) {

      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {

          saveZLWCData(this.form2).then(response => {
            msg.showsuccess('保存数据成功')
            _this.$refs[formName].resetFields()
            this.dialogFormVisible2 = false
            this._GetTGXX()
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