<!--项目立项资料上传-测试solt内容分发-->
<template>
  <div class="list">
    <FileUpload :list-height="docHeight">
      <querylist @on-query="GetXMXX" :show-export="true" :tb-obj="tbobj" file-name="立项资料统计" :header-num=1 tb-title="立项资料统计"></querylist>
      <el-table v-loading="loadingtb" :height="tableHeight" :data="tableData" border style="width: 100%;margin-bottom:10px;border-bottom: 3px solid #ffc000;" @cell-click='cellclick' @select='selectRow' @select-all='selectallRow' ref="xmlxxxTable" highlight-current-row header-row-class-name="headclass">
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="55"></el-table-column>
        <el-table-column fixed label="总" width="50" prop="XMXHZ"></el-table-column>
        <el-table-column fixed label="分" width="50" prop="XMXHF"></el-table-column>
        <el-table-column fixed label="项目名称" show-overflow-tooltip width="120" prop="XMMC"> </el-table-column>
        <el-table-column fixed label="课题编号" width="140" prop="KTBH"></el-table-column>
        <el-table-column fixed label="课题名称" show-overflow-tooltip min-width="120" prop="KTMC"></el-table-column>
        <el-table-column fixed label="项目批次" prop="XMPC" width="100"></el-table-column>
        <el-table-column label="计划总费用" width="90" prop="ZFY"></el-table-column>
        <el-table-column label="负责单位" width="120" prop="FZDW"></el-table-column>
        <el-table-column label="项目负责人" width="90" prop="XMFZR"></el-table-column>

        <!-- 动态配置列 -->
        <el-table-column :key='qdname.ID' v-for='qdname in qdList' show-overflow-tooltip :label="qdname.MC" :width="qdname.CWIDTH">
          <template slot-scope="scope">
            <div class="tooltip">
              <span class="duihao" v-if='scope.row[qdname.MC]' v-html="staticDH"></span>
              <span class="tooltiptext" v-if="scope.row[qdname.MC]">当前有{{scope.row[qdname.MC]}}个文件（夹）
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </FileUpload>
  </div>
</template>

<script>
import querylist from '../../../components/Common/QueryList'
import FileUpload from 'views/FileUpload'
import { mapGetters } from 'vuex'
import { getLxData } from 'api/xmlx/index.js'
import { getQDName } from 'api/common/xm.js'

import { isEmptyObjecct } from 'utils/validate' // GNM
export default {
  name: 'lxzlsc',
  components: {
    FileUpload,
    querylist
  },
  computed: {
    ...mapGetters(['moduleid', 'listquery', 'rightHeight'])
  },
  watch: {
    listquery: {
      handler: function(obj, oldobj) {
        if (!isEmptyObjecct(obj, 'MODULEID,XMTYPE')) {
          // GNM
          this.GetXMXX()
        }
      },
      deep: true
    },

  },
  data() {
    return {
      tbobj:null,
      staticDH: '&radic;',
      tableHeight: 300,
      docHeight: 200,
      loadingtb: false,
      tableData: [],
      qdList: [] // GNM 清单动态列
    }
  },
  created() {
    this._getQDName() // 获取清单所属的文件夹名

    if (!isEmptyObjecct(this.listquery, 'MODULEID,XMTYPE')) {
      // GNM 当前已配置过条件，则查询
      this.GetXMXX()
    }
  },
  mounted() {
    var rcon = this.rightHeight
    this.tableHeight = parseInt(rcon * 0.5)
    this.docHeight = parseInt(rcon * 0.35)

    this.tbobj = this.$refs.xmlxxxTable
    // GNM 添加简单的功能说明
    this.$store.dispatch(
      'SetHelpContent',
      `
    <span style="font-size:14px;font-weight:bold">功能说明：</span><br/>
    <span>&nbsp;&nbsp;1、点击上面项目数据时，下方会显示当前项目文档.</span><br/>
    <span>&nbsp;&nbsp;2、在项目数据表后面的文档上传结果列,有鼠标提示</span><br/>
    <span>&nbsp;&nbsp;3、同一文件夹下，同名文件会以历史版本的方式显示</span>
    `
    )
  },
  destroyed() {
    this.$store.dispatch('SetHelpContent', '')
  },
  methods: {
    // 获取清单所属的文件夹名
    _getQDName() {
      var qry = { moduleid: this.moduleid }
      getQDName(qry).then(response => {
        this.qdList = response.data
      })
    },
    // 根据条件查询立项数据
    GetXMXX() {
      this.getXMInfo()
    },
    // 获取项目信息
    getXMInfo() {
      // 公共模块id
      this.loadingtb = true
      getLxData(this.listquery).then(response => {
        this.loadingtb = false
        this.tableData = response.data
      })
    },
    cellclick(row, column, cell, event) {
      if (column.type !== 'selection') {
        this.$refs.xmlxxxTable.clearSelection()
        this.$store.dispatch('set_cur_xmrow', row)
        // this.$store.dispatch('set_select_xmrow', [row])
      }
    },
    // check行事件
    selectRow(selection, row) {
      this.$store.dispatch('set_select_xmrow', selection)
    },
    // check所有行事件
    selectallRow(selection) {
      this.$store.dispatch('set_select_xmrow', selection)
    }
  }
}
</script>
<style scoped>
.filter-container2 {
  margin-bottom: 5px;
}
.duihao {
  font-size: 1.2em;
}
.list {
  height: 100%;
}
</style>
