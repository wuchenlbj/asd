<!--项目立项 经费申报-->
<template>
  <div class="jfsb">

    <!-- <UploadExcel :hideYear="true" tableName="" ></UploadExcel> -->
    <el-button type="primary" @click="exportdata">导入Excel</el-button>

      <exxls :tb-obj="tbobj"  :file-name="pagename" :header-num=1 :tb-title="pagename"></exxls>
    <el-table ref="tbobj" border style="width: 100%;margin-top:5px;" :height="tableHeight" :data="jfgcData" @row-dblclick="rowdblclick" v-loading="loading" header-row-class-name="headclass">

      <el-table-column prop="XMMC" label="项目名称" fixed width="120">
      </el-table-column>
      <el-table-column prop="KTMC" label="课题名称" fixed width="120">
      </el-table-column>
      <el-table-column label="计划总投资" fixed width="100">
        <template slot-scope="scope">
          <span class="span-title">{{scope.row.LWF+scope.row.SBF+scope.row.NYCLF+scope.row.SYWXF+scope.row.JSYJF+scope.row.WXF+scope.row.XXZXF+scope.row.CLF+scope.row.HYJPXF+scope.row.GLF+scope.row.QTFY+scope.row.ZLF}}</span>
        </template>
      </el-table-column>
      <el-table-column label="劳务费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.LWF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.LWF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="设备费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.SBF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.SBF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="能源材料费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.NYCLF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.NYCLF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="试验外协费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.SYWXF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.SYWXF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="技术引进费" width="130">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.JSYJF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.JSYJF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="外协费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.WXF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.WXF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="信息咨询费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.XXZXF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.XXZXF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="差旅费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.CLF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.CLF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="会议及培训费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.HYJPXF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.HYJPXF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="管理费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.GLF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.GLF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="租赁费" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.ZLF}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.ZLF"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="其他费用" width="120">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.QTFY}}</span>
          <el-input-number controls-position="right" style="width:100px;" v-if="scope.row.EDIT" size="mini" v-model="scope.row.QTFY"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.BZ}}</span>
          <el-input v-if="scope.row.EDIT" size="small" v-model="scope.row.BZ"></el-input>
        </template>
      </el-table-column>
      <el-table-column v-if="rowOperation" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.EDIT" size="small" type="success" plain @click="addrow(scope.row)">保存
          </el-button>
          <el-button v-if="scope.row.EDIT" size="small" type="danger" plain @click="cancelcreate(scope.row)">取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 导入Dialog -->
    <el-dialog v-dialogDrag title="导入Excel" width="1300px"  max-height="600" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">

        <UploadExcel :hideYear="true" tableName="KJGLPT_JH_FYGCMX" @loadingexcel="loadingexcel" @excelData="getExcelData" @excelYear="excelYear"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitForm()">保存</el-button>

        <el-table :data="FormtableData" height="400" border style="width: 100%;margin-top:5px;">
          <el-table-column prop="KTBH" label="课题名称" width="120"></el-table-column>
          <el-table-column label="劳务费" prop="LWF" width="120"> </el-table-column>
          <el-table-column label="设备费" prop="SBF" width="120"> </el-table-column>
          <el-table-column label="能源材料费" prop="NYCLF" width="120"></el-table-column>
          <el-table-column label="试验外协费" prop="SYWXF" width="120"> </el-table-column>
          <el-table-column label="技术引进费" prop="JSYJF" width="130"> </el-table-column>
          <el-table-column label="外协费" prop="WXF" width="120"> </el-table-column>
          <el-table-column label="信息咨询费" prop="XXZXF" width="120"></el-table-column>
          <el-table-column label="差旅费" prop="CLF" width="120"> </el-table-column>
          <el-table-column label="会议及培训费" prop="HYJPXF" width="120"> </el-table-column>
          <el-table-column label="管理费" prop="GLF" width="120"> </el-table-column>
          <el-table-column label="租赁费" prop="ZLF" width="120"> </el-table-column>
          <el-table-column label="其他费用" prop="QTFY" width="120"> </el-table-column>
          <el-table-column label="备注" prop="BZ" width="200"> </el-table-column>
        </el-table>
      </div>

    </el-dialog>

  </div>
</template>

<script >
import UploadExcel from '../../../components/Common/UploadExcel'
import { mapGetters } from 'vuex'
import msg from 'utils/loadmsg'
import { getJfmx, saveJFGC } from 'api/xmlx/index.js'
import exxls from 'common/xlsx/tabletoexcel' // GNM 更改导出方式
export default {
  name: 'jfsb',
  components: {
    UploadExcel,exxls
  },
  computed: {
    ...mapGetters(['rightHeight'])
  },
  mounted() {
    this.tbobj = this.$refs.tbobj // GNM
    this.tableHeight = this.rightHeight - 40

    // GNM 添加简单的功能说明
    this.$store.dispatch('SetHelpContent', `
    <span style="font-size:14px;font-weight:bold">功能说明：</span><br/>
    <span>&nbsp;&nbsp;1、双击一行，在弹出的窗口进行编辑</span><br/>
    <span>&nbsp;&nbsp;2、导入Excel时，请下载相应的模板后再导入</span><br/>
    <span>&nbsp;&nbsp;3、鼠标放到单元格时，会显示详细内容</span><br/>
    `)
  },
  destroyed () {
    this.$store.dispatch('SetHelpContent', '')
  },
  data() {
    return {
      tbobj: null,
      pagename:"科技投资计划新立项目经费构成明细",
      tableHeight: 0,
      Dyear: '',
      loading2: false,
      loadingtext: '导入数据中,请稍后',
      dialogFormVisible: false,
      rowOperation: false,
      FormtableData: [],
      jfgcData: [],
      form: {
        XMBH: '',
        XMMC: '',
        CZND: '',
        KTMC: '',
        KTBH: '',
        LWF: '',
        SBF: '',
        NYCLF: '',
        SYWXF: '',
        JSYJF: '',
        WXF: '',
        XXZXF: '',
        CLF: '',
        HYJPXF: '',
        GLF: '',
        QTFY: '',
        ZLF: '',
        BZ: '',
        TYPE: '',
        EDIT: true
      },
      ediRow: false,
      loading: false
    }
  },
  methods: {
    // 导入数据保存入库
    submitForm() {
      if (this.FormtableData.length == 0) {
        msg.showwarning('请先导入数据,再进行保存')
        return false
      }
      var rekt = true
      for (var i = 0; i < this.FormtableData.length; i++) {
        if (!this.FormtableData[i].KTBH) {
          rekt = false
          break
        }
      }
      if (!rekt) {
        msg.showwarning('导入数据有误,课题编号不能为空,请重新导入')
        return false
      }
      this.loading2 = true
      this.loadingtext = '保存数据中,请稍后'
      saveExcelData(this.FormtableData).then(response => {
        this.dialogFormVisible = false
        // 查询当前年度的立项数据
        this.getXMLXData()
      })
    },
    excelYear(year) {
      this.Dyear = year
    },
    loadingexcel(res) {
      this.loading2 = res
      this.loadingtext = '导入数据中,请稍后'
    },
    getExcelData(data) {
      this.FormtableData = data
    },
    // 保存入库
    addrow(row) {
      this.loading = true
      saveJFGC(row).then(response => {
        row.EDIT = false
        this.loading = false
        this.rowOperation = true
        msg.showsuccess()
      })
        .catch(error => {
          this.loading = false
        })
    },
    // 双击编辑
    rowdblclick(row, event) {
      this.rowOperation = true // 显示操作列
      row.EDIT = true
    },
    getJFMX(row) {
      this.loading = true

      // 获取经费明细
      getJfmx({ xmbh: row.XMBH, ktbh: row.KTBH }).then(response => {
        if (response.data.length === 0) { // 添加数据
          this.form.XMMC = row.XMMC
          this.form.KTMC = row.KTMC
          this.form.XMBH = row.XMBH
          this.form.KTBH = row.KTBH
          this.form.CZND = row.JHND // 计划年度
          this.form.TYPE = 'add'
          this.jfgcData = [this.form]
          this.rowOperation = true // 显示操作列
        } else { // 展示数据
          response.data[0].EDIT = false
          response.data[0].TYPE = 'edit'
          response.data[0].XMMC = row.XMMC
          response.data[0].KTMC = row.KTMC
          response.data[0].XMBH = row.XMBH
          response.data[0].KTBH = row.KTBH
          response.data[0].CZND = row.JHND // 计划年度
          this.jfgcData = response.data
        }
        this.loading = false
      })
    },
    // 取消
    cancelcreate(row) {
      row.EDIT = false
      this.rowOperation = true
    },
    exportdata() {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.actions-top {
  margin-bottom: 20px;
}
</style>
