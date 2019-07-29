<!-- 成果管理-油藏描述 -->
<template>
  <div class="ycms">
    <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetData' placeholder="课题编号" v-model="listQuery.ktbh">
    </el-input>
    <exxls :tb-obj="tbobj" :file-name="pagename" :header-num=2 :tb-title="pagename"></exxls>
    <!-- 表格操作 -->
    <el-table ref="ycms" border style="width: 100%;margin-top:10px;" :data="tableData" :height="tableHeight" v-loading="loading" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="XMBH" label="项目编号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="XMMC" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTBH" label="课题编号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTMC" label="课题名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="承担单位" width="100" show-overflow-tooltip prop="FZDWDMMC"></el-table-column>
      <el-table-column label="项目负责人" width="90" prop="XMFZR"></el-table-column>

      <el-table-column label="项目研究成果" align="center">
        <el-table-column label="研究工区面积（km2)" :render-header="renderHeader1" prop="YJGQMJ" width="90"></el-table-column>
        <el-table-column label="研究工区采油井井数（口)" prop="YJGQYJJS" width="80"></el-table-column>
        <el-table-column label="研究工区注水井井数（口）" prop="YJGQSJJS" width="100"></el-table-column>
        <el-table-column label="编制图件（幅）" prop="BZTJ" width="90"></el-table-column>
        <el-table-column label="建议调整方案工作量（口）" prop="JYTZGZL" width="100"></el-table-column>

      </el-table-column>

      <el-table-column label="研究成果转化状况" align="center">
        <el-table-column label="实际完成调整措施井数（口）" prop="SJWCTZCSJS" width="90"></el-table-column>
        <el-table-column label="采油井措施效果分析" prop="YJCSXGFX" width="70"></el-table-column>
        <el-table-column label="注水井措施效果分析" prop="SJCSXGFX" width="90"></el-table-column>
        <el-table-column label="实施前水驱面积（km2）" :render-header="renderHeader2" prop="SSQSQMJ" width="70"></el-table-column>
        <el-table-column label="实施后水驱面积（km3）" :render-header="renderHeader3" prop="SSHSQMJ" width="100"></el-table-column>
        <el-table-column label="实施前水驱储量动用程度（%）" prop="SSQSQCLDYCD" width="100"></el-table-column>
        <el-table-column label="实施后水驱储量动用程度（%）" prop="SSHSQCLDYCD" width="110"></el-table-column>
        <el-table-column label="实施前分注井数（口）" prop="SSQFZJS" width="100"></el-table-column>
        <el-table-column label="实施后分注井数（口）" prop="SSHFZJS" width="100"></el-table-column>
        <el-table-column label="其它" prop="QT" width="100"></el-table-column>
      </el-table-column>

      <el-table-column prop="FILEPATH" label="项目评价报告" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH" :href="actiondownurl+'filename='+scope.row.FILENAME+'&filepath='+scope.row.FILEPATH">{{scope.row.FILENAME}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="TBR" label="填报人" width="100"></el-table-column>
      <el-table-column prop="LXFS" label="联系方式" width="110"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :total="total" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next">
    </el-pagination>

  </div>
</template>

<script >
import exxls from 'common/xlsx/tabletoexcel'
import { getDataYCMS } from "api/cggl/cgpj.js"
import msg from 'utils/loadmsg'
import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'ktdz',
  data () {
    return {
      tbobj: {},
      pagename: '油藏描述',
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
    this.tbobj = this.$refs.ycms
  },
  methods: {
    renderHeader1 (h) {
      return (
        <span>
          研究工区面积（km<sup>2</sup>)
        </span>
      )
    },
    renderHeader2 (h) {
      return (
        <span>
         实施前水驱面积（km<sup>2</sup>)
        </span>
      )
    },
      renderHeader3 (h) {
      return (
        <span>
         实施后水驱面积（km<sup>3</sup>)
        </span>
      )
    },
    // 获取分页数据
    _GetData () {
      this.loading = true
      getDataYCMS(this.listQuery).then(response => {
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
