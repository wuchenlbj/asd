<!-- 资金管理-支付管理- -->
<template>
  <div class="jfsb">
    <div v-if="xmxxRow&&XMHTXX.length>0" class="pageTiptitle">该课题计划费用{{xmxxRow.ZFY}}万元， 累积签订合同{{XMHTXX.length}}份，合同签订累积额{{xmxxRow.HTJ}}万元。累积挂账{{GZZJE}}万元,累积支付{{ZFZJE}}万元
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <p class="pageTabletitle">合同列表信息</p>
        <el-table v-loading='loading' :height="tableHeight" @cell-click='cellclickHT' highlight-current-row ref="htqt" border :data="XMHTXX" style="width: 100%;" header-row-class-name="headclass">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="HTJ" label="合同价" width="70"></el-table-column>
          <el-table-column prop="SL" label="税率(%)" width="70"></el-table-column>
          <el-table-column prop="GZJE" label="累积挂账" width="70"></el-table-column>
          <el-table-column prop="ZFJE" label="累积支付" width="70"></el-table-column>
          <el-table-column prop="HTTYPEMC" label="合同类型" width="100"></el-table-column>
          <el-table-column prop="QDRQ" label="签订日期" width="90">
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
      <el-col :span="12">
        <div style="margin-left:100px;position:absolute;top:-5px;" >
          <el-button :disabled="!selectHTrow.KTBH" type="primary" size="mini" style="margin-left:30px;" icon="el-icon-edit" @click="add">添加支付</el-button>        </div>
        <!-- 表格操作 -->
        <p class="pageTabletitle">合同支付信息
        </p>

        <el-table border header-row-class-name="headclass" :height="tableHeight" style="width: 100%" :data="GZtableData" @row-dblclick="rowdblclick" v-loading="loading2">

          <el-table-column label="支付金额(元)" prop="ZFJE" width="110"></el-table-column>
          <el-table-column label="支付批次" prop="ZFPC" width="110">
            <template slot-scope="scope">
              <span class="span-title">{{scope.row.ZFPC|getPC(scope.row.ZFPC)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="经办人" prop="JBRNAME" min-width="80"> </el-table-column>
          <el-table-column label="支付日期" width="130">
            <template slot-scope="scope">
              <span class="span-title">{{scope.row.RQ|parseTime3('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="BZ" label="备注" min-width="200"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 添加编辑支付 -->
    <el-dialog  v-dialogDrag  append-to-body title="支付信息" width="800px" :visible.sync="dialogFormVisible">
      <table class="tbinfo" v-if="xmxxRow">
        <tr>
          <td class="t1">项目编号</td>
          <td class="t2"> {{this.xmxxRow.XMBH}}</td>
          <td class="t1">项目名称</td>
          <td class="t2"> {{this.xmxxRow.XMMC}}</td>
        </tr>
        <tr>
          <td class="t1">课题编号</td>
          <td class="t2"> {{this.xmxxRow.KTBH}}</td>
          <td class="t1">课题名称</td>
          <td class="t2"> {{this.xmxxRow.KTMC}}</td>
        </tr>
        <tr>
          <td class="t1">合同金额</td>
          <td class="t2"> {{selectHTrow.HTJ}}万元</td>
          <td class="t1"></td>
          <td class="t2"> </td>
        </tr>
        <tr>
          <td class="t1">累积挂账</td>
          <td class="t2"> {{selectHTrow.GZJE}}万元</td>
          <td class="t1">累积支付</td>
          <td class="t2"> {{selectHTrow.ZFJE}}万元</td>
        </tr>
      </table>

      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="90px" style="margin:10px 0;">
        <el-form-item label="支付金额" prop="ZFJE">
          <el-input v-model="form.ZFJE" style="width:250px;" placeholder="支付金额">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="支付批次" prop="ZFPC">
          <el-select filterable v-model="form.ZFPC" @change="" style="width: 250px;" placeholder="支付批次">
            <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:605px;"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:90px;">
          <el-button type="primary" :loading="loadinght" @click="submitForm('ruleForm')">添加支付</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
import bus from '../../../components/bus'
import { NewGuid } from '@/config/filter'
import { getXmPC } from 'api/xtsz/fzdw.js'
import { mapGetters } from 'vuex'
import { getHTXX } from 'api/xmgl/htgl/index.js'
import { saveZFData, getZFData } from 'api/qmys/index.js'
import msg from 'utils/loadmsg'
export default {
  name: 'cgdj',
  data() {
    return {
      loading: false,
      loadinght: false,
      loading2: false,
      dialogFormVisible: false,
      selectHTrow: {}, // 选中的合同信息
      tableHeight: 400,
      XMHTXX: [], // 合同信息
      GZZJE: 0, // 挂账累积金额
      ZFZJE: 0, // 支付累积金额
      opts_pc: [{ ID: 1, NAME: '第一批' }, { ID: 2, NAME: '第二批' }, { ID: 3, NAME: '第三批' }], // 项目批次的数据源
      GZtableData: [],
      form: {
        ID: '',
        HTID: '',
        KTBH: '',
        ZFJE: '',
        ZFPC: '',
        BZ: '',
        TYPE: ''
      },
      loading: false,
      listQuery: {
        xmbh: '',
        ktbh: ''
      },
      rules: {
        ZFPC: [{ required: true, message: '请输入支付批次', trigger: 'change' }],
        ZFJE: [{ type: 'float', required: true, trigger: 'blur',
          validator: function(rule, value, callback) {
            if (!/^\d+(\.\d+)?$/.test(value)) {
              callback(new Error('请输入正确数值'))
            } else {
              callback()
            }
          } }]

      }
    }
  },
  mounted() {
    this.setHeight()
  },
  computed: {
    ...mapGetters(['xmxxRow', 'panelHeight'])
  },
  watch: {
    xmxxRow: {
      handler: function(row, val){
        if (!row) return
        this.getHTXX(row)
        this.GZtableData = []
      },
      immediate: true
    },
    panelHeight(val) {
      this.setHeight()
    }
  },
  methods: {
    setHeight() {
      this.tableHeight = parseInt(this.panelHeight * 0.85)
    },
    // 添加支付
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.HTID = this.selectHTrow.ID
          this.form.KTBH = this.selectHTrow.KTBH
          if (this.form.TYPE == 'add') {
            var gzlje = parseFloat(this.selectHTrow.GZJE) // 挂账累积金额
            var zflje = parseFloat(this.selectHTrow.ZFJE) // 支付累积金额
            var zf = parseFloat(this.form.ZFJE)
            if (gzlje < (zflje + zf)) {
              msg.showwarning('支付金额累积不能超过挂账额,请重新输入')
              return false
            }
          }

          _this.loadinght = true

          saveZFData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.loadinght = false
            _this.dialogFormVisible = false
            // 重新加载表格数据
            bus.$emit('on-getXMInfo')
            _this.getHTXX(this.xmxxRow)
            _this._getZFData()
          })
        } else {
          console.log('error submit!!')
          _this.loadinght = false
          return false
        }
      })
    },
    // 1.根据项目信息获取合同信息
    getHTXX(row) {
      var _this = this
      this.loading = true
      getHTXX(row).then(response => {
        this.loading = false
        this.XMHTXX = response.data
        this._getGZJE(this.XMHTXX)
        this._getZFJE(this.XMHTXX)
      })
    },
    // 计算合同的挂账金额
    _getGZJE(data) {
      if (data.length == 0) {
        this.GZZJE = 0
      } else {
        this.GZZJE = 0
        for (var i = 0; i < data.length; i++) {
          this.GZZJE = +parseFloat(data[i].GZJE)
        }
      }
    },
    // 计算合同的支付金额
    _getZFJE(data) {
      if (data.length == 0) {
        this.ZFZJE = 0
      } else {
        this.ZFZJE = 0
        for (var i = 0; i < data.length; i++) {
          this.ZFZJE = +parseFloat(data[i].ZFJE)
        }
      }
    },
    // 获取合同选中信息
    cellclickHT(row, column, cell, event) {
      if (column.type != 'selection') {
        this.selectHTrow = row
        // 获取挂账信息
        this._getZFData()
      }
    },
    // 2.根据合同获取支付信息
    _getZFData() {
      this.loading2 = true
      var htid = this.selectHTrow.ID
      if (!htid) {
        msg.showwarning('没有获取到合同信息')
        return false
      }
      var d = { id: htid }
      getZFData(d).then(response => {
        this.loading2 = false
        this.GZtableData = response.data
      })
    },
    // 添加挂账信息表单
    add() {
      this.dialogFormVisible = true
      this.form.ID = NewGuid()
      this.form.TYPE = 'add'
      if (this.GZtableData.length < 3) {
        this.form.ZFPC = this.GZtableData.length + 1
      }
    },
    // 表格双击事件
    rowdblclick(row) {
      this.dialogFormVisible = true
      this.form = row
      this.form.TYPE = 'edit'
    },
    // 获取项目批次
    getXMPC() {
      getXmPC().then(response => {
        this.opts_pc = response.data
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jfsb {
  margin: 0 20px;
}
.t2 {
  width: 250px;
}
.t1 {
  width: 90px;
  text-align: right;
  padding: 0 12px 0 0;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
</style>


