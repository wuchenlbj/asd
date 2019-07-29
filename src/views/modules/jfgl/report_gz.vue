<!-- 资金管理-挂账管理- -->

<template>
  <div class="jfsb">
    <el-form :model="form" :inline="true" label-width="80px" style='display: block;'>
      <el-form-item label="计划年度:">
        <el-date-picker type="year" value-format="yyyy" style="width:100px;" @change="changeyear" v-model="form.JHND" placeholder="选择年">
        </el-date-picker>
        <exxls :tb-obj="tbobj" :file-name="pagename" :tb-title="pagename"></exxls>
      </el-form-item>
    </el-form>
    <el-table ref="htqt" v-loading='loading' :height="tableHeight" highlight-current-row border :data="XMHTXX" style="width: 100%;" header-row-class-name="headclass">
      <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
      <el-table-column fixed label="项目编号" width="120" prop="XMBH"> </el-table-column>
      <el-table-column fixed label="项目名称" width="120" prop="XMMC"> </el-table-column>
      <el-table-column fixed label="课题编号" width="120" prop="KTBH"></el-table-column>
      <el-table-column fixed label="课题名称" width="120" prop="KTMC"></el-table-column>
      <el-table-column label="承担单位" width="120" prop="CJDWDMMC"></el-table-column>
      <el-table-column label="项目负责人" width="120" prop="XMFZR"></el-table-column>
      <el-table-column label="计划总投资(万元)" width="90" prop="ZFY"></el-table-column>

      <el-table-column label="含税合同价(万元)" prop="HTJ" width="120"></el-table-column>
      <el-table-column label="累积挂账金额(万元)" prop="GZJE"></el-table-column>
      <el-table-column prop="WXDWMC" label="协作单位" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="LXR" label="联系人" width="70"></el-table-column>
      <el-table-column prop="LXDH" label="联系电话" show-overflow-tooltip width="100"></el-table-column>

      <el-table-column label="挂账记录">
        <el-table-column prop="DYCRQ" label="第一次时间" width="90">
          <template slot-scope="scope">
            <span class="span-title">{{scope.row.DYCRQ|parseTime3('yyyy-MM')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(万元)" prop="DYCGZJE" width="100"></el-table-column>

        <el-table-column prop="DECRQ" label="第二次时间" width="90">
          <template slot-scope="scope">
            <span class="span-title">{{scope.row.DECRQ|parseTime3('yyyy-MM')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(万元)" prop="DECGZJE" width="100"></el-table-column>

        <el-table-column prop="DSCRQ" label="第三次时间" width="90">
          <template slot-scope="scope">
            <span class="span-title">{{scope.row.DSCRQ|parseTime3('yyyy-MM')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(万元)" prop="DSCGZJE" width="100"></el-table-column>
      </el-table-column>

      <el-table-column prop="BZ" label="备注" min-width="100"></el-table-column>
    </el-table>
  </div>
</template>

<script >
import { mapGetters } from "vuex"
import { getGZTJData } from "api/qmys/index.js"
import msg from "utils/loadmsg"
import exxls from 'common/xlsx/tabletoexcel'
export default {
  name: 'gzbb',
  data () {
    return {
      tbobj: {},
      pagename: '挂账统计',
      loading: false,
      tableHeight: 400,
      XMHTXX: [], // 合同信息
      form: {
        JHND: ''
      }
    }
  },
  computed: {
    ...mapGetters(['panelHeight'])
  },
  watch: {
    panelHeight (val) {
      this.setHeight()
    }
  },
  mounted () {
    this.setHeight()
     this.tbobj = this.$refs.htqt
  },
  components: {
    exxls
  },
  methods: {
    setHeight () {
      this.tableHeight = this.panelHeight - 65
    },
    changeyear (val) {
      this.form.JHND = '' + val
      // 查询年度数据
      this._getGZTJData()
    },
    // 1.根据项目信息获取合同信息
    _getGZTJData () {
      var _this = this
      this.loading = true
      getGZTJData(_this.form).then(response => {
        this.loading = false
        this.XMHTXX = response.data
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
