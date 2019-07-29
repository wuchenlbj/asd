<!-- 成果管理-专利应用评价 -->
<template>
  <div class="">

    <h4>6.专利应用评价</h4>

    <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="120px">
      <el-form-item label="专利简介" prop="ZLJJ">
        <el-input type="textarea" v-model="form.ZLJJ" placeholder="成果简介" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="应用情况" prop="YYQK">
        <el-input type="textarea" v-model="form.YYQK" placeholder="应用情况" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="取得效果" prop="JJXY">
        <el-input type="textarea" v-model="form.JJXY" placeholder="取得效果" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="应用前景" prop="YYQJ">
        <el-input type="textarea" v-model="form.YYQJ" placeholder="应用前景" style="width:320px;"></el-input>
      </el-form-item>
      <el-form-item label="填报人" prop="TBR">
        <el-input v-model="form.TBR" style="width:320px;" placeholder="专利名称"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="LXFS">
        <el-input v-model="form.LXFS" style="width:320px;" placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="BZ">
        <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:320px;"></el-input>
      </el-form-item>

      <el-form-item style="padding-left:120px;width:100%;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script >
import { NewGuid } from '@/config/filter'
import msg from 'utils/loadmsg'
import { getYYPJData, saveYYPJData } from 'api/cggl/zscq.js'
export default {
  name: 'formpj',
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
      this.form.ZLID = zlid
      this._GetTGXX()
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      form: {
        ZLJJ: '',
        YYQK: '',
        JJXY: '',
        YYQJ: '',
        TBR: '',
        LXFS: '',
        BZ: '',
        ZLID: '',
        TYPE: 'add'
      },
      rules: {
        ZLQRBGR: [{ required: true, message: '请输入专利权人变更人', trigger: 'blur' }],
        TCBGR: [{ required: true, message: '请选择提出变更日', trigger: 'change' }],
        FWRQ: [{ required: true, message: '请选择发文日期', trigger: 'change' }]
      }
    }
  },
  methods: {

    // 获取项目所属的变更信息
    _GetTGXX() {
      var zlid = this.selectRows[0].ZLID
      this.loading = true

      // 专利维持
      this.loading = true
      getYYPJData({ id: zlid }).then(response => {
        this.loading = false
        if (response.data.length > 0) {
          this.form = response.data[0]
        } else {
          this.resetForm('ruleForm')
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields()
      })
    },
    // 保存
    submitForm(formName) {

      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {

          saveYYPJData(this.form).then(response => {
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
    }
  },
  mounted() {

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