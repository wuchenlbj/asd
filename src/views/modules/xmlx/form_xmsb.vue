<!--项目立项-->
<template>
  <div class="">
     
    <el-form v-loading='loadingform' :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="100px" >
       <el-form-item label="排序总分" prop="XMXHZ">
        <el-input v-model="form.XMXHZ" style="width:90px;"   placeholder="总"></el-input>
        <el-input v-model="form.XMXHF" style="width:90px;"   placeholder="分"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="XMMC">
        <el-input  v-model="form.XMMC"  style="width:185px;" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="课题编号" prop="KTBH">
        <el-input v-model="form.KTBH" style="width:185px;" :disabled="inpt_zj"   placeholder="课题编号" ></el-input>
      </el-form-item>
      <el-form-item label="课题名称" prop="KTMC">
        <el-input v-model="form.KTMC"   style="width:185px;" placeholder="课题名称"></el-input>
      </el-form-item> 
      <el-form-item label="负责单位" prop="FZDWDM">     
         <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.FZDWDM" style="width:185px;"
          :multiple="false" placeholder="负责单位" @setSelectedId="setSelectedIdFZDW">
        </tree-select>  
      </el-form-item>      
       <el-form-item label="项目级别" prop="XMJBDM" >
        <el-select v-model="form.XMJBDM" placeholder="请选择"  style="width:185px;">
         <el-option v-for="(item,index) in opts_jb" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>     
      <el-form-item label="参加单位" prop="CJDWDM" >
        <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.CJDWDM" style="width:185px;"
          :multiple="false" placeholder="参加单位" @setSelectedId="setSelectedIdCJDW">
        </tree-select> 
      </el-form-item>
      <el-form-item label="协作单位" prop="XZDWDM">
        <el-input v-model="form.XZDWDM" style="width:185px;"   placeholder="协作单位"></el-input>
        <!-- <el-select v-model="form.XZDWDM" placeholder="请选择" style="width:185px;" >
          <el-option v-for="(item,index) in opts_xzdw" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="项目负责人" prop="XMFZR">
        <el-input v-model="form.XMFZR" style="width:185px;" placeholder="项目负责人"></el-input>
      </el-form-item>
       <el-form-item label="计划年度" prop="LXND">
        <el-date-picker  v-model="form.LXND" value-format="yyyy" style="width:185px;"   type="year" placeholder="计划年度">
        </el-date-picker>
      </el-form-item>
       <el-form-item label="项目批次" prop="XMPC">
        <el-select v-model="form.XMPC" placeholder="请选择"  style="width:185px;" >
          <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参加人员" prop="CJRY">
        <el-input v-model="form.CJRY" style="width:185px;"   placeholder="参加人员"></el-input>
      </el-form-item>
        <el-form-item label="总费用" prop="ZFY">
        <el-input v-model="form.ZFY"  style="width:185px;" placeholder="计划总费用">
           <template slot="append">万元</template>
        </el-input>
      </el-form-item>
       <el-form-item label="第一年" prop="FY1">
        <el-input v-model="form.FY1"  style="width:185px;" placeholder="第一年计划费用">
           <template slot="append">万元</template>
        </el-input>
      </el-form-item>
       <el-form-item label="第二年" prop="FY2">
        <el-input v-model="form.FY2"  style="width:185px;" placeholder="第二年计划费用">
           <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="起止时间" prop="QZSJ">       
           <el-date-picker  
              v-model="form.QZSJ"
              type="daterange" value-format="yyyy-MM-dd" format='yyyy-MM-dd' style="width:350px;" 
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
      </el-form-item> 
      <el-form-item label="立项依据"  prop="YJNR">   
        <el-input type="textarea" v-model="form.YJNR" placeholder="立项依据及主要研究内容" style="width:350px;"></el-input>
      </el-form-item>      
      <el-form-item label="经济指标"  prop="JJZB">   
        <el-input type="textarea" v-model="form.JJZB" placeholder="达到的主要技术经济指标及成果提交方式" style="width:350px;"></el-input>
      </el-form-item>
     
      <el-form-item label="备注" prop="BZ">    
        <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:350px;"></el-input>
      </el-form-item>
      <el-form-item   style="margin-left:350px;margin-top:20px;">
        <el-button type="primary"  @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">清空新建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import treeSelect from '../../../components/Common/treeSelect/tree.vue'
import { getDistinctXM, saveXMData, getOneXMXX } from 'api/xmlx/index.js'
import { GetUnitTree } from 'api/common/xm.js'
import { getXmPC, getXmJB, getXMFLTree } from 'api/xtsz/fzdw.js'
import { getXZDW } from 'api/xtsz/xzdw.js'
import { mapGetters } from 'vuex';
import { parseTime } from 'utils/index.js'
import msg from 'utils/loadmsg'
// 立项申报
export default {
  name: 'formxmsb',
  components: {
    treeSelect
  },
  data() {
    // 课题编号验证
    const validKTBH = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入课题编号'))
      } else if (value.indexOf('ycsy') < 0) {
        callback(new Error('格式输入不正确'))
      } else {
        // 验证编号是否冲突TODO
        callback()
      }
    }
    return {
      loadingform: false,
      inpt_zj: false,
      treeSelected: '',
      xmbhloading: false,
      xmbhList: [], // 项目编号的数据源
      opts_pc: [], // 项目批次的数据源
      opts_jb: [], // 项目级别数据源
      opts_xzdw: [], // 协作单位
      treeDataFZDW: [], // 负责单位
      treeDataXMFL: [], // 项目分类
      // 表单内容
      form: {
        XMXHZ: '',
        XMXFZ: '',
        LXND: '',
        XMBH: '',
        KTBH: '',
        XMMC: '',
        KTMC: '',
        ZFY: '',
        FY1: '',
        FY2: '',
        QZSJ: [], // 起止时间
        FZDWDM: '', // 负责单位
        FZDWDM2: [], // 负责单位
        XMPC: '',
        XMJBDM: '',
        YJNR: '', // 立项依据
        JJZB: '',
        CJDWDM: '',
        XZDWDM: '',
        XMFZR: '',
        CJRY: '',
        JHQSSJ: '',
        JHZZSJ: '',
        TYPE: 'add',
        BZ: ''
      },
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      },
      // 表单验证规则
      rules: {
        XMMC: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        KTBH: [{ required: true, trigger: 'blur', validator: validKTBH }],
        KTMC: [{ required: true, message: '请输入课题名称', trigger: 'blur' }],
        LXND: [{ type: 'string', required: true, message: '请选择计划年度', trigger: 'blur' }],
        FZDWDM2: [{ type: 'array', required: true, message: '请选择负责单位', trigger: 'change' }],
        XMPC: [{ required: true, message: '请选择项目批次', trigger: 'change' }],
        XMJBDM: [{ required: true, message: '请选择项目级别', trigger: 'change' }],
        ZFY: [{ type: 'float', required: true, trigger: 'blur',
          validator: function(rule, value, callback) {
            if (!/^\d+(\.\d+)?$/.test(value)) {
              callback(new Error('请输入正确数值'))
            } else {
              callback()
            }
          } }],
        // CJDWDM: [{ required: true, message: '请选择参加单位', trigger: 'change' }],
        XMFZR: [{ required: true, message: '请输入项目负责人', trigger: 'blur' }],
        CJRY: [{ required: true, message: '请输入参加人员', trigger: 'blur' }],
        QZSJ: [{ type: 'array', required: true, message: '请选择起止时间', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getCombData() // 获取下拉数据
    this.initForm()
  },
  methods: {
    initForm() {
      var nowDate = new Date()
      var nowyear = nowDate.getFullYear()
      this.form.XMBH = 'ycsy' + nowyear
      this.form.KTBH = 'ycsy' + nowyear
    },
    setSelectedIdFZDW(val) {
      this.form.FZDWDM = val
    },
    setSelectedIdXMFL(val) {
      this.form.XMFLDM = val
    },
    setSelectedIdCJDW(val) {
      this.form.CJDWDM = val
    },
    getCombData() {
      this.getTreeData()
      this.getXMPC()
      this.getxmjb()
      this.getXmFLTree()
      this.getXzdw()
    },
    // 保存项目立项
    submitForm(formName) {
      this.loadingform = true
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveXMData(this.form).then(response => {
            this.loadingform = false
            if (response.data.KTBH) {
              msg.showsuccess('保存数据成功')

              this.$emit('getXMInfo')
            } else {
              msg.showwarning(response.data)
            }
          }).catch(error => {
            this.loadingform = false
          })
        } else {
          console.log('error submit!!')
          this.loadingform = false
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.initForm()
      this.form.TYPE = 'add'
      this.inpt_zj = false
    },

    // 获取协作单位
    getXzdw() {
      getXZDW().then(response => {
        this.opts_xzdw = response.data
      })
    },
    // 获取项目批次
    getXMPC() {
      getXmPC().then(response => {
        this.opts_pc = response.data
      })
    },
    // 项目级别
    getxmjb() {
      getXmJB().then(response => {
        this.opts_jb = response.data
      })
    },
    // 负责单位
    getTreeData() {
      GetUnitTree().then(response => {
        this.treeDataFZDW = response.data
      })
    },
    // 项目分类
    getXmFLTree() {
      getXMFLTree().then(response => {
        this.treeDataXMFL = response.data
      })
    },
    // 给表单赋值
    getXMXX(row) {
      this.loadingform = true
      var _this = this
      // 获取经费明细
      getOneXMXX({ ktbh: row.KTBH }).then(response => {
        // 表单赋值 不能直接复制row 会出现列值丢失情况
        this.$nextTick(() => {
          var d = response.data
          _this.form = d
          _this.form.QZSJ = [parseTime(d.JHQSSJ, '{y}-{m}-{d}'), parseTime(d.JHZZSJ, '{y}-{m}-{d}')]
          _this.form.TYPE = 'edit'
        })

        this.loadingform = false
        this.inpt_zj = true
      })
    }
  }
}
</script>

<style>
label {
  font-weight: 500 !important;
}
</style>

