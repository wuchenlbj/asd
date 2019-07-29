<!-- 资金管理-全面预算- -->
<template>
  <div class="xmtj" style="height:100%;overflow-y:hidden;">
    <el-button type="primary" @click="exportdata">导入Excel</el-button>

    <el-form :inline="true" label-width="120px" style='float:right;display: block;'>
      <el-form-item label="项目汇总明细:">
        <el-date-picker align="right" type="month" value-format="yyyyMM" format="yyyy年MM月" @change="changeyear" v-model="DyearMonth" placeholder="选择年月">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <h2 class="headtitle">{{DyearMonth}}科技项目投资预算</h2>
    <el-table v-loading="loadingtb" :data="tableData" :height="tableHeight" @row-dblclick="rowdblclick" border tooltip-effect="light" style="width: 100%" header-row-class-name="headclass">
      <el-table-column fixed type="index" label="序号" width="50"> </el-table-column>
      <el-table-column fixed label="项目名称" width="120" prop="XMMC"> </el-table-column>
      <el-table-column fixed label="课题编号" min-width="100" prop="KTBH"></el-table-column>
      <el-table-column fixed label="课题名称" min-width="120" prop="KTMC"></el-table-column>
      <el-table-column label="建设单位" width="120" prop="FZDWDMMC"></el-table-column>
      <el-table-column label="计划总投资" width="100" prop="ZFY"></el-table-column>
      <el-table-column label="本年计划投资" width="100" prop="ZFY"></el-table-column>
      <el-table-column label="投资信息(形象进度)">
        <el-table-column label="项目累计完成投资（截至上月）" width="100" prop="ZFY"></el-table-column>
        <el-table-column label="项目本年累计投资预算（截至上月）" width="100" prop="ZFY"></el-table-column>
        <el-table-column label="项目本年累计完成投资（截至上月）" width="100" prop="ZFY"></el-table-column>
        <el-table-column label="项目本年累计投资预算完成率%（截至上月）" width="110" prop="ZFY"></el-table-column>
        <el-table-column label="项目本年累计投资完成率%（截至上月）" width="100" prop="ZFY"></el-table-column>
        <el-table-column label="上月">
          <el-table-column label="投资预算" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="预计完成投资" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="预计投资完成率%" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="主要完成工作" width="80" prop="ZFY"></el-table-column>
        </el-table-column>
        <el-table-column label="本月">
          <el-table-column label="投资预算" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="预计完成投资" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="预计投资完成率%" width="80" prop="ZFY"></el-table-column>
          <el-table-column label="计划完成工作" width="80" prop="ZFY"></el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="资金计划信息">
        <el-table-column label="项目累计完成资金（截至上月）" width="100" prop="ZFY"></el-table-column>
        <el-table-column label="本月资金计划" width="80" prop="ZFY"></el-table-column>
        <el-table-column label="资金来源" width="80" prop="ZFY"></el-table-column>
        <el-table-column label="本月资金付款说明" width="80" prop="ZFY"></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 导入Dialog -->
    <el-dialog  v-dialogDrag title="导入Excel" width="1300px" top="2vh" max-height="600" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">
        <UploadExcel :hideYear="false" :hideYearMonth="true" tableName="KJGLPT_YS_TZYS" @loadingexcel="loadingexcel" @excelData="getExcelData" @excelYear="excelYear"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitForm()">保存</el-button>

        <el-table :data="FormtableData" height="400" border style="width: 100%;margin-top:5px;" header-row-class-name="headclass">
          <el-table-column fixed type="index" label="序号" width="50"> </el-table-column>
          <el-table-column fixed label="项目编号" width="120" prop="XMBH"> </el-table-column>
          <el-table-column fixed label="项目名称" width="120" prop="XMMC"> </el-table-column>
          <el-table-column fixed label="课题编号" width="120" prop="KTBH"></el-table-column>
          <el-table-column fixed label="课题名称" width="120" prop="KTMC"></el-table-column>
          <el-table-column label="年月" width="120" prop="NY"></el-table-column>
          <el-table-column label="投资预算" width="90" prop="TZYS"></el-table-column>
          <el-table-column label="主要完成工作" width="130" prop="ZYWCGZ"></el-table-column>
          <!-- <el-table-column label="资金计划" width="100" prop="XMFZR"></el-table-column> -->
          <el-table-column label="资金来源" width="120" prop="CJRY"></el-table-column>
          <el-table-column label="付款说明" prop="BZ"></el-table-column>
        </el-table>
      </div>

    </el-dialog>
    <!--编辑Dialogxmsb-->
    <el-dialog  v-dialogDrag title="立项资料修改" width="1000px" append-to-body :visible.sync="dialogVisible">
      <!-- <xmsb ref="childform" ></xmsb> -->
    </el-dialog>
  </div>
</template>
<script>
// import xmsb from './xmsb'
import UploadExcel from '../../../components/Common/UploadExcel'
import { saveExcelData, getQMYSData } from 'api/qmys/index.js'
import msg from 'utils/loadmsg'
import { validData } from 'utils/index'
import { getcurNY } from 'utils/index'

import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'xmlx',
  components: {
    UploadExcel
  },
  data() {
    return {
      tableHeight: 600,
      loadingtext: '导入数据中,请稍后',
      loading2: false,
      loadingtb: false,
      syjh: [], // 使用计划
      tableData: [], // 页面table数据
      FormtableData: [], // 表单table数据
      editRowData: {}, // 编辑行数据
      DyearMonth: '',
      dialogVisible: false,
      dialogFormVisible: false
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 90
    }
  },
  mounted () {

    this.tableHeight = this.rightHeight - 90 // GNM

    this.DyearMonth = getcurNY() // 当前年月

    // 查询年月全面预算数据
    this._getQMYSData()
  },
  methods: {
    // 双击编辑
    rowdblclick(row, event) {

      // 触发子组件方法 删除添加的节点
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.childform.getXMXX(row)
      })

    },
    loadingexcel(res) {
      this.loading2 = res
      this.loadingtext = '导入数据中,请稍后'
    },
    // 导入数据保存入库
    submitForm() {
      if (this.FormtableData.length == 0) {
        msg.showwarning('请先导入数据,再进行保存')
        return false
      }

      const diff = validData(this.FormtableData)
      if (diff.length > 0) {
        msg.showwarning('课题编号[' + diff + ']存在重复请先处理再导入')
        return false
      }

      this.loading2 = true
      this.loadingtext = '保存数据中,请稍后'
      saveExcelData(this.FormtableData).then(response => {
        this.dialogFormVisible = false
        // 查询当前年度的立项数据
        this._getQMYSData()
      })
    },
    // 获取年度立项数据
    _getQMYSData() {
      var qry = {
        ny: this.DyearMonth
      }
      this.loadingtb = true
      getQMYSData(qry).then(response => {
        this.tableData = response.data
        this.loading2 = false
        this.loadingtb = false
      })
    },

    getExcelData(data) {
      this.FormtableData = data
    },
    excelYear(year) {
      this.DyearMonth = year
    },
    changeyear(val) {
      this.DyearMonth = '' + val
      // this.getsyjh()
      // 查询年度数据
      this._getQMYSData()
    },
    exportdata() {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style>
.is-light {
  max-width: 90%;
}
</style>

<style scoped>
.xmtj {
  margin-right: 5px;
}
.headtitle {
  text-align: center;
  line-height: 30px;
}
</style>
