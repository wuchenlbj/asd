<!-- 合同管理 合同洽谈 -->
<template>
  <div class="list">
    <XmTree class="top-container" :tableheight="tableHeight" :show-export="true" :xls-name="pagetitle" :title-name="pagetitle"></XmTree>

    <el-row :gutter="2" style="margin-top:5px;width:99.9%">
      <!-- 添加width控制横向滚动条 -->
      <el-col :span="24">
        <!-- 合同信息 -->
        <el-button type="primary" size="mini" @click="showExcelDialog">导入合同数据</el-button>
        <el-button type="primary" size="mini" :disabled="disabledAdd" @click="showHTDialog">添加合同</el-button>
        <el-button type="primary" size="mini" :disabled="disabledht" @click="showFileDialog">上传合同资料</el-button>

        <el-table v-loading='loading' :height="btmTableHeight" @cell-click='cellclick' @row-dblclick="rowdblclick" ref="htqt" border :data="XMHTXX" style="width: 100%;margin-top: 5px;" header-row-class-name="headclass" highlight-current-row>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="HTJ" label="合同价" width="120"></el-table-column>
          <el-table-column prop="SL" label="税率(%)" width="120"></el-table-column>
          <el-table-column prop="HTTYPEMC" label="合同类型" width="120"></el-table-column>
          <el-table-column prop="QDRQ" label="签订日期" width="100">
            <template slot-scope="scope">
              <span class="span-title">{{scope.row.QDRQ|parseTime3('yyyy-MM')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="WXDWMC" label="协作单位" show-overflow-tooltip min-width="150"></el-table-column>
          <el-table-column prop="LXR" label="联系人" width="70"></el-table-column>
          <el-table-column prop="LXDH" label="联系电话" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column prop="BZ" label="备注" min-width="100"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 添加编辑合同 -->
    <el-dialog v-dialogDrag title="合同信息修改" width="800px" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="90px" style="margin:10px 0;">
        <el-form-item v-if="xmxxRow" label="项目名称" prop="XMMC">
          <el-input disabled v-model="xmxxRow.XMMC" style="width:180px;" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item v-if="xmxxRow" label="课题名称" prop="CGMC">
          <el-input disabled v-model="xmxxRow.KTMC" style="width:180px;" placeholder="成果名称"></el-input>
        </el-form-item>
        <el-form-item prop="HTJ" label="合同价格">
          <el-input v-model="form.HTJ" style="width:180px;" @blur="changeHTJ" placeholder="合同价格">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="税率" prop="SL">
          <el-input v-model="form.SL" style="width:180px;" placeholder="合同价格">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="协作单位" prop="XZDWDM">
          <el-select filterable v-model="form.XZDWDM" @change="" style="width: 180px;" placeholder="选择专业查询">
            <el-option v-for="(item,index) in opts_xzdw" :key="index" :label="item.WXDWMC" :value="item.WXDWDM">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签订年月" prop="QDRQ">
          <el-date-picker v-model="form.QDRQ" type="month" value-format="yyyy-MM" change="changeNY" style="width:180px;" placeholder="签订年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="签订方式" prop="HTTYPE">
          <el-select :disabled="disqdfs" v-model="form.HTTYPE" style="width: 180px;" placeholder="签订方式">
            <el-option v-for="(item,index) in opts_qdfs" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:470px;"></el-input>
        </el-form-item>
        <el-form-item label="提示：" style="width:100%;" v-if="xmxxRow">
          计划总费用：{{xmxxRow.ZFY}} 累积合同金额:{{xmxxRow.HTJ}}
        </el-form-item>
        <el-form-item style="margin-left:90px;">
          <el-button type="primary" :loading="loadinght" @click="submitForm('ruleForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 导入ExcelDialog -->
    <el-dialog v-dialogDrag title="导入Excel" width="1000px" top="5vh" :close-on-click-modal="false" :visible.sync="dialogExcelVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">
        <UploadExcel :hideYear="false" tableName="KJGLPT_XMGL_HTXX" @loadingexcelerror="loadingexcelerror" @loadingexcel="loadingexcel" @excelData="getExcelData" @excelYear="excelYear"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitExcel()">保存</el-button>

        <el-table :data="FormtableData" border style="width: 100%;margin-top:5px;" header-row-class-name="headclass">
          <el-table-column label="课题编号" min-width="120" prop="KTBH">

          </el-table-column>
          <el-table-column label="课题名称" min-width="120" show-overflow-tooltip prop="KTMC"></el-table-column>
          <el-table-column label="合同价" width="120" prop="HTJ"></el-table-column>
          <el-table-column label="税率(%)" width="100" prop="SL"></el-table-column>
          <el-table-column label="合同类型" width="100" prop="HTTYPEMC"></el-table-column>
          <el-table-column label="协作单位" min-width="120" show-overflow-tooltip prop="XZDWDMMC"></el-table-column>
          <el-table-column label="合同签订时间" width="120" prop="QDRQ">
            <template slot-scope="scope">
              <span class="span-title">{{scope.row.QDRQ|parseTime3('yyyy-MM')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="BZ" min-width="150"></el-table-column>
        </el-table>
      </div>

    </el-dialog>
    <!-- 上传文件Dialog -->
    <el-dialog v-dialogDrag title="导入Excel" width="1000px" top="5vh" :close-on-click-modal="false" :visible.sync="dialogFormUpload">
      <FileUpload :Page="dialogHT"></FileUpload>
    </el-dialog>

  </div>
</template>

<script >
import FileUpload from 'views/FileUpload'
import UploadExcel from '../../../../components/Common/UploadExcel'
import { XmTree } from 'common'
import { NewGuid } from '@/config/filter'
import { getxzdwList } from 'api/xtsz/xzdw.js'
import {
  saveSQCL,
  saveQTData,
  getHTXX,
  saveExcelData,
  getQdfs
} from 'api/xmgl/htgl/index.js'
import { mapGetters } from 'vuex'
import bus from 'src/components/bus'
import msg from 'utils/loadmsg'
export default {
  name: 'htqtsq',
  components: {
    XmTree,
    UploadExcel,
    FileUpload
  },
  props: {
    pagetitle: {
      type: String,
      default: '合同信息'
    },
    pagetype: {
      type: String,
      default: '1'
    }
  },
  computed: {
    ...mapGetters(['xmxxRow','rightHeight'])
  },
  watch: {
    xmxxRow: function(row) {
      if (!row) return
      this.disabledAdd = false
      // 合同信息查询
      this.getHTXX(row)
    },
    rightHeight(val) {
      this.setHeight()
    }
  },
  data() {
    return {
      disabledht: true,
      dialogHT: 'HT' + new Date(),
      rowHT: {},
      FormtableData: [],
      disqdfs: false, // 签订方式
      loading2: false,
      loadingtext: '数据处理中,请稍后',
      disabledAdd: true,
      dialogFormVisible: false,
      dialogFormUpload: false,
      dialogExcelVisible: false,
      Dyear: '',
      tableHeight: 400,
      btmTableHeight: 300,
      XMHTXX: [],
      loadinght: false,
      form: {
        ID: '',
        XMBH: '',
        KTBH: '',
        HTJ: '',
        SL: '0',
        QDRQ: '',
        TYPE: '',
        HTTYPE: '',
        BZ: ''
      },
      rules: {
        QDRQ: [
          {
            type: 'string',
            required: true,
            message: '请选择签订年月',
            trigger: 'blur'
          }
        ],
        HTJ: [
          {
            type: 'float',
            required: true,
            trigger: 'blur',
            validator: function(rule, value, callback) {
              if (!/^\d+(\.\d+)?$/.test(value)) {
                callback(new Error('请输入正确数值'))
              } else {
                callback()
              }
            }
          }
        ],
        SL: [
          {
            type: 'float',
            required: true,
            trigger: 'blur',
            validator: function(rule, value, callback) {
              if (!/^\d+(\.\d+)?$/.test(value)) {
                callback(new Error('请输入正确数值'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      loading: false,
      rowEdit: false,
      activeName: '1',
      opts_qdfs: [], // 签订方式
      opts_xzdw: [] // 协作单位
    }
  },
  mounted() {
    this.setHeight()
    this.form.HTTYPE = this.pagetype // 合同类型
    this.getXzdw() // 获取写作单位下拉数据
    this.getqdfs() // 签订方式
    // this.getHavaQTXX()

    // GNM 添加简单的功能说明
    this.$store.dispatch('SetHelpContent', `
    <span style="font-size:14px;font-weight:bold">功能说明：</span><br/>
    <span>&nbsp;&nbsp;1、点击项目数据时，下方会显示当前项目所有的合同信息</span><br/>
    <span>&nbsp;&nbsp;2、选择合同后，可以上传此合同的相关资料</span>
    `)
  },
  destroyed () {
    this.$store.dispatch('SetHelpContent', '')
  },
  methods: {
    setHeight() {
      this.tableHeight = parseInt(this.rightHeight * 0.55) - 15
      this.btmTableHeight = parseInt(this.rightHeight * 0.4)
    },
    // 选择合同
    cellclick(row, column, cell, event) {
      if (column.type != 'selection') {
        this.disabledht = false
        this.rowHT = row
      }
    },
    changeHTJ() {
      var value = this.form.HTJ
      if (this.form.TYPE == 'add') {
        if (value <= 100) {
          this.form.HTTYPE = '1'
        }
        if (value > 100 && value <= 200) {
          this.form.HTTYPE = '2'
        }
        if (value > 200) {
          this.form.HTTYPE = '3'
        }
      }
    },
    loadingexcel(res) {
      this.loading2 = res
      this.loadingtext = '导入数据中,请稍后'
    },
    loadingexcelerror() {
      this.loading2 = false
    },
    HTinfo() {
      this.dialogHT = 'HT' + new Date()
    },
    // 打开导入dialog
    showExcelDialog() {
      this.HTinfo()
      this.dialogExcelVisible = true
    },
    // 打开合同dialog
    showHTDialog() {
      this.dialogFormVisible = true
      this.disqdfs = true
      this.form.KTBH = this.xmxxRow.KTBH
      this.form.XMBH = this.xmxxRow.XMBH
      this.form.ID = NewGuid()
      this.form.TYPE = 'add'
    },
    // 打开上传文件dialog
    showFileDialog() {
      this.HTinfo()
      this.dialogFormUpload = true
    },
    // 双击编辑表单
    rowdblclick(row, event) {
      this.dialogFormVisible = true
      this.form = row
      this.form.TYPE = 'edit'
      this.disqdfs = false
    },
    getExcelData(data) {
      this.FormtableData = data
    },
    excelYear(year) {
      this.Dyear = year
    },
    // 获取合同信息
    getHTXX(row) {
      var _this = this
      this.loading = true
      getHTXX(row).then(response => {
        this.loading = false
        this.XMHTXX = response.data
      })
    },
    changeNY(val) {
      console.log(val)
    },
    // 保存excel入库
    submitExcel() {
      if (this.FormtableData.length == 0) {
        msg.showwarning('请先导入数据,再进行保存')
        return false
      }

      this.loading2 = true
      this.loadingtext = '保存数据中,请稍后'
      saveExcelData(this.FormtableData).then(response => {
        this.loading2 = false

        if (response.data.length > 0) {
          var ktbhnot = ''
          for (var i = 0; i < response.data.length; i++) {
            ktbhnot += response.data[i].KTBH + ','
          }
          if (ktbhnot.length > 0) {
            ktbhnot = ktbhnot.substring(0, ktbhnot.length - 1)
          }
          msg.showwarning(
            '合同导入成功，但计划中不存在下面' +
              response.data.length +
              '个课题编号:' +
              ktbhnot
          )
        } else {
          this.dialogExcelVisible = false
          msg.showsuccess('保存合同成功')
        }

        // 重新加载表格数据
        bus.$emit('on-getXMInfo')
      })
    },
    // 保存合同信息
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.TYPE == 'add') {
            var zfy = parseFloat(this.xmxxRow.ZFY)
            var zhtj = parseFloat(this.xmxxRow.HTJ)
            var htj = parseFloat(this.form.HTJ)
            var sl = parseFloat(this.form.SL)

            if (zfy < zhtj + htj * (100 - sl) / 100) {
              msg.showwarning('合同价累积不能超过计划总费用,请重新输入')
              return false
            }
          }

          _this.loadinght = true

          saveQTData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.loadinght = false
            _this.dialogFormVisible = false
            // 重新加载表格数据
            bus.$emit('on-getXMInfo')
          })
        } else {
          console.log('error submit!!')
          _this.loadinght = false
          return false
        }
      })
    },
    // 获取协作单位
    getXzdw() {
      getxzdwList({ mc: '', hmd: 'hmd' }).then(response => {
        this.opts_xzdw = response.data
      })
    },
    // 获取签订方式
    getqdfs() {
      getQdfs().then(response => {
        this.opts_qdfs = response.data
      })
    },
    // 取消
    cancelcreate(row) {
      this.rowEdit = false
      if (row.tpm) {
      } else {
        row.EDIT = false
      }
    },
    // 保存入库
    addrow(row) {
      if (row.WXDWDM == '') {
        msg.showwarning('推荐单位为空')
        return false
      }

      this.loading = true
      saveSQCL(row)
        .then(response => {
          row.EDIT = false
          row.tpm = false
          this.loading = false
          msg.showsuccess()
        })
        .catch(error => {
          this.loading = false
        })
    }
    // // 更改显示
    // changezy(e, row) {
    //   // console.info(row)
    //   // console.info(e)
    //   var r = _.find(this.opts_xzdw, function(o) { return o.WXDWDM === e })
    //   row.WXDWDM = e
    //   row.WXDWMC = r.WXDWMC
    //   row.LXR = r.LXR
    //   row.LXDH = r.LXDH
    //   // this.zyname = val
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.list {
  height: 100%;
}
</style>
