<!-- 合同管理 合同洽谈统计 -->
<template>
  <div class="httj">
    <div class="filter-container2">
      <el-date-picker style="width: 120px;" @change='GetXMXX' value-format="yyyy" align="right" type="year" v-model="listQuery.JHND" placeholder="年度">
      </el-date-picker>
      <el-input style="width: 120px;" @change='GetXMXX' placeholder="课题编号" v-model="listQuery.KTBH">
      </el-input>
      <el-input style="width: 120px;" @change='GetXMXX' placeholder="课题名称" v-model="listQuery.KTMC">
      </el-input>

      <el-button type="primary" @click="GetXMXX" icon="search">搜索</el-button>

      <exxls :tb-obj="tbobj"  :file-name="pagename" :header-num=1 :tb-title="pagename"></exxls>

      <span class="dtcount" v-if="xmxxSelect.length>0">已全部加载，共{{xmxxSelect.length}}个</span>
      <!-- <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidetopbar.opened"></Hamburger> -->
    </div>
    <el-table v-loading='loading' ref="htqt" border :data="xmxxSelect" :height="tableHeight" style="width: 100%;margin:10px 0;">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="XMBH" label="项目编号" width="110"></el-table-column>
      <el-table-column prop="XMMC" label="项目名称" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="KTBH" label="课题编号" width="130"></el-table-column>
      <el-table-column prop="KTMC" label="课题名称" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="FZDW" label="负责单位" show-overflow-tooltip width="110"></el-table-column>
      <!-- <el-table-column prop="XMFZR" label="项目负责人" show-overflow-tooltip  width="80"></el-table-column> -->
      <el-table-column prop="ZFY" label="计划费用(万元)" header-align="left" align="right" width="70"></el-table-column>
      <el-table-column prop="HTJ" label="合同价(万元)" header-align="left" align="right" width="60"></el-table-column>
      <el-table-column prop="WXDWMC" label="协作单位" show-overflow-tooltip min-width="130"></el-table-column>
      <el-table-column prop="LXDH" label="联系电话" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="项目批次" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.JHND" style="">{{ scope.row.JHND }}年{{ scope.row.XMPC }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="BZ" label="备注" width="100"></el-table-column>

    </el-table>

  </div>
</template>

<script >
import exxls from 'common/xlsx/tabletoexcel'
import { mapGetters } from "vuex"
import { getHTXXReport } from 'api/xmgl/htgl/index.js'
export default {
  name: 'httj',
  computed: {
    ...mapGetters(['rightHeight'])
  },
  props: {
    pagetype: {
      type: String,
      default: '1'
    },
     pagename: {
      type: String,
      default: '合同洽谈统计'
    }
  },
  components: {
    exxls
  },
  watch: {
    pagetype () {
      if (this.pagetype == '') {
        this.pagetype = 1
      }
    },
    rightHeight (val) {
      this.tableHeight = val - 90
    }
  },
  data () {
    return {
      tbobj: {},
      tableHeight: 0,
      listQuery: {
        KTBH: '',
        KTMC: '',
        PageType: '',
        JHND: '' // 年度
      },
      loading: false,
      xmxxSelect: []
    }
  },
  methods: {
    GetXMXX () {
      if (this.listQuery.JHND == null) {
        this.listQuery.JHND = ''
      }

      this.getHTXX()
    },
    // 获取合同信息
    getHTXX () {
      this.loading = true
      this.listQuery.PageType = this.pagetype

      getHTXXReport(this.listQuery).then(response => {
        this.xmxxSelect = response.data
        this.loading = false
      })
    }
  },
  mounted () {
    this.tableHeight = this.rightHeight - 90 // GNM
    this.getHTXX()
    this.tbobj = this.$refs.htqt
  }
}
</script>

<style scoped>
.filter-container2 {
  margin-bottom: 5px;
  /* float: left; */
}
</style>
