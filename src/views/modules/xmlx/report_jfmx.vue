<!-- 经费明细 -->
<template>
  <div class="jfmx" style="height:100%;overflow-y:hidden;">

    <el-form :inline="true" label-width="80px" style="width:250px;margin:0 auto;">
      <el-form-item label="年度查询:">
        <el-date-picker v-model="nd" align="right" style="width:100px;" type="year" @change='changedata' placeholder="选择年">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="headtitle">延长石油集团{{ndfa}}年科技投资计划新立项目经费构成明细
      <span class="dwspan">(单位：万元)</span>
    </div>
    <el-table :height="tableHeight" :data="tableData" v-loading='loading' border style="width: 99.5%;margin:2px;">
      <el-table-column label="申报单位：延长油田股份有限公司" align="left">
        <el-table-column type="index" label="序号" width="65"></el-table-column>
        <el-table-column prop="XMMC" label="项目名称" show-overflow-tooltip width="200"> </el-table-column>
        <el-table-column prop="KTMC" label="课题名称" show-overflow-tooltip width="200"> </el-table-column>
        <el-table-column prop="FZDW" label="负责单位" show-overflow-tooltip width="120"> </el-table-column>
        <el-table-column label="起止时间" :fit="false" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.QSSJ }}-</span>
            <span style="margin-left: 10px">{{ scope.row.ZZSJ }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划总投资(万元)" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.ZFY }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="LWF" align="right" label="劳务费" width="60"> </el-table-column>
        <el-table-column prop="SBF" align="right" label="设备费" width="60"> </el-table-column>
        <el-table-column prop="NYCLF" align="right" label="能源材料费" width="90"> </el-table-column>
        <el-table-column prop="SYWXF" align="right" label="试验外协费" width="90"> </el-table-column>
        <el-table-column prop="JSYJF" align="right" label="技术引进费" width="90"> </el-table-column>
        <el-table-column prop="WXF" align="right" label="外协费" width="60"> </el-table-column>
        <el-table-column prop="ZLF" align="right" label="租赁费" width="60"> </el-table-column>
        <el-table-column prop="XXZXF" align="right" label="信息咨询费" width="90"> </el-table-column>
        <el-table-column prop="CLF" align="right" label="差旅费" width="70"> </el-table-column>
        <el-table-column prop="HYJPXF" align="right" label="会议及培训费" width="100"> </el-table-column>
        <el-table-column prop="GLF" align="right" label="管理费" width="70"> </el-table-column>
        <el-table-column prop="QTFY" align="right" label="其他费用" width="70"> </el-table-column>
        <el-table-column prop="BZ" align="right" label="备注" min-width="100"> </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>
<script >
import { parseTime } from 'utils/index.js'
import { getJfmxByNd } from 'api/xmlx/index.js'
import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'jfmx',
  data() {
    return {
      tableHeight: '700',
      nd: '2017',
      loading: false,
      tableData: []
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight']),
    ndfa: function() {
      return parseTime(this.nd, '{y}')
    }
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 90
    }
  },
  mounted() {
    this.tableHeight = this.rightHeight - 90 // GNM
    this.changedata()
  },
  methods: {
    changedata() {
      var nd = this.ndfa
      var _this = this
      this.loading = true
      // 查询年度经费构成明细 getJfmxByNd
      getJfmxByNd({ nd: nd })
        .then(response => {
          _this.tableData = response.data
          _this.loading = false
        })
        .catch(() => {
          _this.loading = false
        })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.headtitle {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  widows: 100%;
  box-sizing: inherit;
  margin: 0 0 5px 20px;
  font-weight: 800;
  position: relative;
  .dwspan {
    position: absolute;
    right: 20%;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
