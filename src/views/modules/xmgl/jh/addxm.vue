<!--添加修改项目立项-->
<template>
  <div class="">
     
    <el-form v-loading='loadingform' :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="100px" >
  
      <el-form-item label="项目编号"  prop="XMBH">
        <el-autocomplete  :disabled="inpt_zj" v-model="form.XMBH"
          :fetch-suggestions="querySearchAsync" placeholder="请输入项目编号" @select="handleSelect">
          </el-autocomplete>       
      </el-form-item>
      <el-form-item label="项目名称" prop="XMMC">
        <el-input  v-model="form.XMMC"  placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="课题编号" prop="KTBH">
        <el-input v-model="form.KTBH"   :disabled="inpt_zj"   placeholder="课题编号" ></el-input>
      </el-form-item>
      <el-form-item label="课题名称" prop="KTMC">
        <el-input v-model="form.KTMC"    placeholder="课题名称"></el-input>
      </el-form-item> 
      <el-form-item label="负责单位" prop="FZDWDM">     
         <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.FZDWDM" 
          :multiple="false" placeholder="负责单位" @setSelectedId="setSelectedIdFZDW">
        </tree-select>  
      </el-form-item>
       <el-form-item label="项目批次" prop="XMPCDM">
        <el-select v-model="form.XMPCDM" placeholder="请选择" >
          <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="项目级别" prop="XMJBDM">
        <el-select v-model="form.XMJBDM" placeholder="请选择" >
         <el-option v-for="(item,index) in opts_jb" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="项目分类" prop="XMFLDM">
          <tree-select clearable :treeData="treeDataXMFL" :treeProps="treeProps" v-model="form.XMFLDM" 
            :multiple="false" placeholder="项目分类" @setSelectedId="setSelectedIdXMFL">
          </tree-select> 
      </el-form-item>
      <el-form-item label="参加单位" prop="CJDWDM">
        <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.CJDWDM" 
          :multiple="false" placeholder="参加单位" @setSelectedId="setSelectedIdCJDW">
        </tree-select> 
      </el-form-item>
      <el-form-item label="协作单位" prop="XZDWDM">
        <el-select v-model="form.XZDWDM" placeholder="请选择" >
          <el-option v-for="(item,index) in opts_xzdw" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目负责人" prop="XMFZR">
        <el-input v-model="form.XMFZR"  placeholder="项目负责人"></el-input>
      </el-form-item>
       <el-form-item label="计划年度" prop="JHND">
        <el-date-picker  v-model="form.JHND" value-format="yyyy"    type="year" placeholder="计划年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="参加人员" prop="CJRY">
        <el-input v-model="form.CJRY" style="width:515px;" placeholder="参加人员"></el-input>
      </el-form-item>
      <el-form-item label="起止时间" prop="QZSJ">       
           <el-date-picker  
              v-model="form.QZSJ"
              type="daterange" value-format="yyyy-MM-dd" format='yyyy-MM-dd'
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
      </el-form-item> 
      <el-form-item label="立项依据">  
        <el-input type="textarea" v-model="form.LXYJ" placeholder="立项依据" style="width:515px;"></el-input>
      </el-form-item>
       <el-form-item label="研究内容">  
        <el-input type="textarea" v-model="form.ZYYJNR" placeholder="主要研究内容" style="width:515px;"></el-input>
      </el-form-item>
      <el-form-item label="技术经济指标">
        <el-input type="textarea" v-model="form.JSJJZB" placeholder="技术经济指标" style="width:515px;"></el-input>
      </el-form-item>
      <el-form-item label="成果提交方式">
        <el-input type="textarea" v-model="form.CGTJFS" placeholder="成果提交方式" style="width:515px;"></el-input>
      </el-form-item>  
      <el-form-item label="备注">  
        <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:515px;"></el-input>
      </el-form-item>
      <el-form-item   style="margin-left:100px;margin-top:20px;">
        <el-button type="primary"  @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">清空新建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import treeSelect from '../../../../components/Common/treeSelect/tree.vue'
import { getDistinctXM, saveXMData, getOneXMXX } from 'api/xmlx/index.js'
import { GetUnitTree } from 'api/common/xm.js'
import { getXmPC, getXmJB, getXMFLTree } from 'api/xtsz/fzdw.js'
import { getXZDW } from 'api/xtsz/xzdw.js'
import { mapGetters } from 'vuex';
import { parseTime } from 'utils/index.js'
import msg from 'utils/loadmsg'
import bus from '../../../../components/bus'
// 立项申报
export default {
  name: 'xlxmjh',
  components: {
    treeSelect
  },
  data() {
    // 项目编号
    const validXMBH = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入项目编号'))
      } else if (value.indexOf('ycsy') < 0) {
        callback(new Error('格式输入不正确'))
      } else {
        callback()
      }
    }
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
        JHND: '',
        XMBH: '',
        KTBH: '',
        XMMC: '',
        KTMC: '',
        QZSJ: [], // 起止时间
        FZDWDM: '', // 负责单位
        FZDWDM2: [], // 负责单位
        XMPCDM: '',
        XMJBDM: '',
        XMFLDM: '',
        LXYJ: '',
        ZYYJNR: '',
        JSJJZB: '',
        CGTJFS: '',
        CJDWDM: '',
        XZDWDM: '',
        XMFZR: '',
        CJRY: '',
        JHQSSJ: '',
        JHZZSJ: '',
        SPJG: '',
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
        XMBH: [{ required: true, trigger: 'blur', validator: validXMBH }],
        XMMC: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        KTBH: [{ required: true, trigger: 'blur', validator: validKTBH }],
        KTMC: [{ required: true, message: '请输入课题名称', trigger: 'blur' }],
        JHND: [{ type: 'string', required: true, message: '请选择计划年度', trigger: 'blur' }],
        FZDWDM2: [{ type: 'array', required: true, message: '请选择负责单位', trigger: 'change' }],
        XMPCDM: [{ required: true, message: '请选择项目批次', trigger: 'change' }],
        XMFLDM: [{ required: true, message: '请选择项目分类', trigger: 'change' }],
        XMJBDM: [{ required: true, message: '请选择项目级别', trigger: 'change' }],
        CJDWDM: [{ required: true, message: '请选择参加单位', trigger: 'change' }],
        XZDWDM: [{ required: true, message: '请选择协作单位', trigger: 'change' }],
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
  computed: {
    ...mapGetters(['xmxxRow'])
  },
  watch: {
    xmxxRow: function(row) {
      this.getXMXX(row)
    }
  },
  methods: {
    initForm() {
      var nowDate = new Date()
      var nowyear = nowDate.getFullYear()
      this.form.XMBH = 'ycsy' + nowyear
      this.form.KTBH = 'ycsy' + nowyear
    },
    // 项目编号赋值事件
    handleSelect(item) {
      this.form.XMMC = item.name
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
          // 加上8个小时补差 格式化日期parseTime(nowDate)
          // _this.form.JHND = parseTime(_this.form.JHND, '{yyyy}')

          saveXMData(this.form).then(response => {
            this.loadingform = false
            if (response.data.XMBH) {
              msg.showsuccess('保存数据成功')
              // this.$store.dispatch('GetXMInfo', this.listQuery).then(res => { }) 此句改为触发组件的方法

              bus.$emit('on-getXMInfo')
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
    // 远程查询项目编号
    querySearchAsync(query, cb) {
      if (query !== '') {
        getDistinctXM({ key: query }).then(response => {
          this.xmbhList = response.data
        })
      } else {
        this.xmbhList = []
      }
      cb(this.xmbhList)
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
      GetUnitTree({ type: 'children', ny: '' }).then(response => {
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
      this.loading = true
      var _this = this
      // 获取经费明细
      getOneXMXX({ xmbh: row.XMBH, ktbh: row.KTBH }).then(response => {
        // 表单赋值
        var d = response.data
        _this.form = d
        _this.form.QZSJ = [parseTime(d.JHQSSJ, '{y}-{m}-{d}'), parseTime(d.JHZZSJ, '{y}-{m}-{d}')]
        _this.form.TYPE = 'edit'
        this.loading = false
        this.inpt_zj = true
      })
    }
  }
}
</script>

<style scoped >
.el-form {
  /* width: 680px; */
  /* margin: 10px; */
}

</style>

<style>
label {
  font-weight: 500 !important;
}
</style>

