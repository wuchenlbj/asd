/*
 * @Author: lbq 
 * @Date: 2017-11-30 09:01:51 
 * @Last Modified by: lbq
 * @Last Modified time: 2017-12-21 09:15:01
 */ 
<!-- 项目评审打分   -->  
<template>
	<div class="list">
      <el-alert v-show="!xmxxRow" title="请选择项目" style="margin-bottom:20px;"  show-icon type="warning"></el-alert>
     <el-form v-show="showForm" v-loading="loading" :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="110px" > 
      <el-form-item  v-show="xmxxRow&&form.PWMC.length>0" label="评委专家" prop="XMMC"  style="width:600px;">
        <el-tag v-for="(item,index) in form.PWMC" :key="index">{{item}}</el-tag>
      </el-form-item>      
      <el-form-item label="项目名称" prop="XMMC">
        <el-input disabled  v-model="form.XMMC" style="width:200px;"  placeholder="项目名称"></el-input>
      </el-form-item>      
      <el-form-item label="课题名称" prop="KTMC">
        <el-input disabled v-model="form.KTMC"  style="width:200px;"   placeholder="课题名称"></el-input>
      </el-form-item>
      <el-form-item label="评审时间" prop="PSSJ">
        <el-date-picker v-model="form.PSSJ" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  style="width:200px;" placeholder="评审时间">
        </el-date-picker>        
      </el-form-item>    
       <el-form-item label="评委建议费用" prop="PWJYFY">
         <el-input placeholder="评委建议费用" v-model="form.PWJYFY" style="width:200px;" >
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
       <el-form-item label="可行性得分" prop="KXXDF">
         <el-input placeholder="可行性得分" v-model="form.KXXDF" style="width:200px;" >         
        </el-input>
      </el-form-item>
        <el-form-item label="基础资料得分" prop="JCZLDF">
         <el-input placeholder="基础资料得分" v-model="form.JCZLDF" style="width:200px;" >         
        </el-input>
      </el-form-item>
        <el-form-item label="经济效益得分" prop="JJXYDF">
         <el-input placeholder="经济效益得分" v-model="form.JJXYDF" style="width:200px;" >         
        </el-input>
      </el-form-item>
       <el-form-item v-show="pslx==1" label="分组类型" prop="FZLX">
        <el-select v-model="form.FZLX" placeholder="请选择" >
         <el-option v-for="(item,index) in opts_psfz" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>  
        <el-form-item  v-show="pslx==2"  label="专业类型" prop="ZYLX">
        <el-select v-model="form.ZYLX" placeholder="请选择" >
         <el-option v-for="(item,index) in opts_psfz" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>  
      <el-form-item label="备注">  
        <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:515px;"></el-input>
      </el-form-item>
      <el-form-item   style="margin-left:100px;">
        <el-button type="primary"  @click="submitForm('ruleForm')">保存配置</el-button>
      </el-form-item>
    </el-form>
	 </div>
</template>  

<script>
// import { getZY, getPsfs, savePSData } from "api/kxgzgl/pwgl.js"
import { getPSDfXX, getPsfz, savePSPZ } from "api/kxgzgl/pwdf.js"
import { parseTime3 } from 'config/filter.js'
import { mapGetters } from 'vuex';
import msg from 'utils/loadmsg'
export default {
  name: "xmps",
  computed: {
    ...mapGetters(['xmxxRow'])
  },
  watch: {
    xmxxRow: function (row) {
      this.getPsdfxx(row)
    }
  },
  props: {
    pslx: {
      type: String
    }
  },
  mounted() {
    if (this.xmxxRow) {
      this.getPsdfxx(this.xmxxRow)
    }
    if (this.pslx == 1)
      this.getPSFZ(1) // 分组
    else if (this.pslx == 2)
      this.getPSFZ(2) // 专业
  },
  data() {
    const validDF = (rule, value, callback) => {

      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确数值'))
      } else {
        if (rule.field == 'KXXDF' && parseInt(value) > 40) {
          callback(new Error('分数值最大为40'))
        }
        if ((rule.field == 'JCZLDF' || rule.field == 'JJXYDF') && parseInt(value) > 30) {
          callback(new Error('分数值最大为30'))
        }
        callback()
      }
    }
    return {
      showForm: false,
      loading: false,
      opts_psfz: [], // 分组  专业类型
      // opts_pszylx: [], //
      form: {
        PWMC: [],
        XMBH: '',
        XMMC: '',
        KTBH: '',
        KTMC: '',
        PSSJ: '',
        PWJYFY: '',
        KXXDF: '',
        JCZLDF: '',
        JJXYDF: '',
        FZLX: '',
        ZYLX: '',
        PSLX: '',
        BZ: ''
      },
      opts_fzlx: [], // 分组类型     
      // 表单验证规则
      rules: {
        PSSJ: [{ type: 'string', message: '请选择评审时间', required: true, trigger: 'blur' }],
        PWJYFY: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        KXXDF: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JCZLDF: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }],
        JJXYDF: [{ type: 'float', required: true, trigger: 'blur', validator: validDF }]
        // , FZLX: [{ required: true, message: '请选择分组类型', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getPsdfxx(row) {
      var _this = this
      this.loading = true
      getPSDfXX({ xmbh: row.XMBH, ktbh: row.KTBH, type: this.pslx }).then(response => {
        if (!response.data.XMBH && !response.data.PWMC) {
          this.loading = false
          msg.showwarning(response.data)
          this.form.PWMC = []
          this.$refs["ruleForm"].resetFields()
          // 隐藏表单
          _this.showForm = false
          return false
        }
        this.showForm = true
        this.form = response.data
        this.form.PSLX = this.pslx
        if (!response.data.XMBH) {
          this.form.PSSJ = ''
        }
        this.form.XMBH = row.XMBH
        this.form.XMMC = row.XMMC
        this.form.KTBH = row.KTBH
        this.form.KTMC = row.KTMC
        this.loading = false
      }).catch(error => {
        msg.showwarning(error)
        this.loading = false;
      });
    },
    // 保存项目立项
    submitForm(formName) {
      var _this = this

      if (_this.form.XMBH == '' || _this.form.KTBH == '') {
        msg.showwarning('请先选择项目')
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          savePSPZ(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.loading = false
          })
        } else {
          console.log('error submit!!')
          _this.loading = false
          return false
        }
      })
    },
    // 评审方式
    getPSFS() {
      getPsfs().then(response => {
        this.opts_psfs = response.data
      })
    },
    // 附录-评审分组 附录-专业类型
    getPSFZ(type) {
      getPsfz({ type: type }).then(response => {
        this.opts_psfz = response.data
      })
    }
  }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  width: 680px;
}
.el-form-item__content > .el-tag {
  margin-left: 10px;
}
</style>
<style>
label {
  font-weight: 500 !important;
}
</style>