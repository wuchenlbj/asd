<!-- 成果管理-开发方案 -->
<template>
  <div class="kffa">

    <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetData' placeholder="课题编号" v-model="listQuery.ktbh">
    </el-input>
    <exxls :tb-obj="tbobj" :file-name="pagename" :header-num=2 :tb-title="pagename"></exxls>
    <!-- 表格操作 -->
    <el-table ref="kffa" border style="width: 100%;margin-top:10px;" :data="tableData" :height="tableHeight" v-loading="loading" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="XMBH" label="项目编号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="XMMC" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTBH" label="课题编号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTMC" label="课题名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="承担单位" width="100" show-overflow-tooltip prop="FZDWDMMC"></el-table-column>
      <el-table-column label="项目负责人" width="90" prop="XMFZR"></el-table-column>

      <el-table-column label="项目研究成果" align="center">
        <el-table-column label="研究工区面积（km2)"  :render-header="renderHeader1" prop="YJGQMJ" width="90"></el-table-column>
        <el-table-column label="研究工区井数（口)" prop="YJGQJS" width="80"></el-table-column>
        <el-table-column label="编制图件（幅）" prop="BJTJ" width="100"></el-table-column>
        <el-table-column label="部署注水井数（口）" prop="BSSJJS" width="100"></el-table-column>
        <el-table-column label="研究工区注水规模（m3/d）"  :render-header="renderHeader2" prop="YJGQZSGM" width="100"></el-table-column>
        <el-table-column label="部署采油井数（口）" prop="BSYJJS" width="100"></el-table-column>
        <el-table-column label="部署测试井数（口）" prop="BSCSJS" width="100"></el-table-column>
      </el-table-column>

      <el-table-column label="研究成果转化状况" align="center">
        <el-table-column label="建成注水站数（座）" prop="JCZSZS" width="90"></el-table-column>
        <el-table-column label="建成注水站注水规模合计（m3/d）"   :render-header="renderHeader3"  prop="JCZSZZSGMHJ" width="120"></el-table-column>
        <el-table-column label="完成采油井数（口）" prop="WCYJJS" width="90"></el-table-column>
        <el-table-column label="完成注水井数（口）" prop="WCSJJS" width="90"></el-table-column>
        <el-table-column label="测试井数（口）" prop="CSJS" width="100"></el-table-column>
        <el-table-column label="增加水驱面积（km2)"  :render-header="renderHeader4"  prop="ZJSQMJ" width="100"></el-table-column>
        <el-table-column label="增加水驱地质储量（万吨）" prop="ZJSQDZCL" width="110"></el-table-column>
        <el-table-column label="其它" prop="QT" width="100"></el-table-column>
      </el-table-column>

      <el-table-column prop="FILEPATH" label="项目评价报告" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH" :href="actiondownurl+'filename='+scope.row.FILENAME+'&filepath='+scope.row.FILEPATH">{{scope.row.FILENAME}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="TBR" label="填报人" width="100"></el-table-column>
      <el-table-column prop="LXFS" label="联系方式" width="100"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :total="total" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next">
    </el-pagination>

  </div>
</template>

<script >
import exxls from 'common/xlsx/tabletoexcel'
import { getDataKFFA } from "api/cggl/cgpj.js"
import msg from 'utils/loadmsg'
import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'ktdz',
  data () {
    return {
      tbobj: {},
      pagename: '开发方案',
      tableHeight: '500',
      total: null,
      tableData: [],
      loading: false,
      listQuery: {
        ktbh: '',
        page: 1,
        limit: 30
      }
    }
  },
  components: {
    exxls
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
    this._GetData()
    this.tbobj = this.$refs.kffa
  },
  methods: {
     renderHeader1 (h) {
      return (
        <span>
          研究工区面积（km<sup>2</sup>)
        </span>
      )
    },
    renderHeader4 (h) {
      return (
        <span>
          增加水驱面积（km<sup>2</sup>)
        </span>
      )
    },
     renderHeader2 (h) {
      return (
        <span>
          研究工区注水规模（m<sup>2</sup>/d)
        </span>
      )
    },
     renderHeader3 (h) {
      return (
        <span>
          建成注水站注水规模合计（m<sup>2</sup>/d)
        </span>
      )
    },
    // 获取分页数据
    _GetData () {
      this.loading = true
      getDataKFFA(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 分页选中
    handleCurrentChange (val) {
      this.listQuery.page = val
      this._GetData()
    }
  }
}
</script>

<style>
label {
  font-weight: 500 !important;
}
</style>
