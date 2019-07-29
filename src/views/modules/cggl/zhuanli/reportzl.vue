<!-- 成果管理-信息采集 -->
<template>
  <div class="cggd">
    <div class="filter-container">
      <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetGDXX' placeholder="专利名称" v-model="listQuery.mc">
      </el-input>
      <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetGDXX' placeholder="专利权人" v-model="listQuery.wcry">
      </el-input>
      <exxls :tb-obj="tbobj" :file-name="pagename" :header-num=2 :tb-title="pagename" :itemStyle="'{display: inline-block;margin-bottom: 10px;vertical-align: middle;}'"></exxls>
    </div>
    <!-- 表格操作 -->
    <el-table ref="zhuanli" border style="width: 100%;margin-top:5px;" :data="tableData"  :height="tableHeight" v-loading="loading" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>

      <el-table-column label="专利基本信息" align="center">

        <el-table-column label="专利名称" prop="ZLMC" min-width="100"></el-table-column>
        <el-table-column label="专利类型" prop="ZLLXMC" min-width="100"></el-table-column>
        <el-table-column label="专利权人" prop="ZLQR" width="100"></el-table-column>
        <el-table-column label="申请单位" show-overflow-tooltip prop="SQDWMC" width="100"></el-table-column>
        <el-table-column label="发明人" prop="FMR" width="100"></el-table-column>
        <el-table-column label="专利申请日期" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.ZLSQRQ|parseTime3('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权公告日" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.ZLSQR|parseTime3('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="专利授权年度" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.ZLSQR|parseTime3('yyyy')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="专利(申请)号" prop="ZLSQH" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column prop="FILEPATH1" label="受理证书扫描件" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH1" :href="actiondownurl+'filename='+scope.row.FILENAME1+'&filepath='+scope.row.FILEPATH1">{{scope.row.FILENAME1}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="FILEPATH2" label="授权证书扫描件" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH2" :href="actiondownurl+'filename='+scope.row.FILENAME2+'&filepath='+scope.row.FILEPATH2">{{scope.row.FILENAME2}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="FILEPATH3" label="专利年费扫描件" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH3" :href="actiondownurl+'filename='+scope.row.FILENAME3+'&filepath='+scope.row.FILEPATH3">{{scope.row.FILENAME3}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" prop="IFYX" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.IFYX|ifval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否实施" prop="IFSS" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.IFSS|ifval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否转让" prop="IFZR" width="50">
        <template slot-scope="scope">
          <span>{{scope.row.IFZR|ifval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="集团申报及奖励">
        <el-table-column label="集团月报表上报受理" prop="JTSBSL" min-width="110"> </el-table-column>
        <el-table-column label="集团月报表上报授权" prop="JTSBSQ" min-width="110"> </el-table-column>
        <el-table-column label="集团奖励年度" prop="JTSBSND" min-width="110"> </el-table-column>
        <el-table-column prop="FILEPATH4" label="集团申报及奖励" show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <a style="color:blue;" v-if="scope.row.FILEPATH4" :href="actiondownurl+'filename='+scope.row.FILENAME4+'&filepath='+scope.row.FILEPATH4">{{scope.row.FILENAME4}}</a>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="油田专利奖励">
        <el-table-column label="油田奖励年度" prop="YTJLND" min-width="110"> </el-table-column>
        <el-table-column prop="FILEPATH5" label="油田专利奖励" show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <a style="color:blue;" v-if="scope.row.FILEPATH5" :href="actiondownurl+'filename='+scope.row.FILENAME5+'&filepath='+scope.row.FILEPATH5">{{scope.row.FILENAME5}}</a>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="FILEPATH6" label="油田奖励反馈表" show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <a style="color:blue;" v-if="scope.row.FILEPATH6" :href="actiondownurl+'filename='+scope.row.FILENAME6+'&filepath='+scope.row.FILEPATH6">{{scope.row.FILENAME6}}</a>
            <span v-else>未上传</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="专利代理" prop="ZLDLJG" min-width="110"> </el-table-column>
      <el-table-column label="专利法律状态">
        <el-table-column label="法律状态" prop="FLZT" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.IFYX|Validval}}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止日期" prop="ZZRQ" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.ZZRQ|parseTime3('yyyy')}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="ZLJJ" label="专利简介" min-width="100"></el-table-column>
      <el-table-column label="专利应用评价">
        <el-table-column prop="YYQK" label="应用状况" min-width="100"></el-table-column>
        <el-table-column prop="JJXY" label="取得效果" min-width="100"></el-table-column>
        <el-table-column prop="YYQJ" label="应用前景" min-width="100"></el-table-column>
        <el-table-column prop="TBR" label="填报人" min-width="100"></el-table-column>
        <el-table-column prop="LXFS" label="联系方式" min-width="100"></el-table-column>
      </el-table-column>
      <el-table-column prop="BZ" label="备注" min-width="100"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

  </div>
</template>

<script >
import exxls from 'common/xlsx/tabletoexcel'
import { getZLXXList } from 'api/cggl/zscq.js'
import msg from 'utils/loadmsg'

import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'reportzl',
  data () {

    return {
      tbobj: {},
      pagename: '专利汇总',
      // 导入相关
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
    this._GetGDXX()
    this.tbobj = this.$refs.zhuanli
  },
  methods: {

    // 获取归档信息
    _GetGDXX () {
      this.loading = true
      getZLXXList(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 分页选中
    handleCurrentChange (val) {
      this.listQuery.page = val
      this._GetGDXX()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  width: 750px;
}
</style>
<style>
label {
  font-weight: 500 !important;
}
</style>
