<!--公共项目导航-->
<template>
  <div class="xmna" style="border: none;  border-bottom: 3px solid #ffc000;">
    <!-- 查询条件 -->
    <!-- <div class="filter-container2">
    </div> -->
    <querylist @on-query="getXMInfo" :show-export="showexport" :tb-obj="tbobj" :file-name="xlsname" :header-num=1 :tb-title="titlename"></querylist>
    <!-- 表格内容 -->
    <el-table :row-key="getRowKey" border ref="xmxxTable" header-row-class-name="headclass" :height="gettableheight" :data="xmxx" style="width:100%;height:100%;margin-top:5px;" highlight-current-row v-loading='loadingtb' @cell-click='cellclick' @select='selectRow' @select-all='selectallRow'>
      <el-table-column type="selection" width="35"></el-table-column>
      <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
      <el-table-column fixed label="序号" align='center'>
        <el-table-column label="总" width="40" prop="XMXHZ" align='center'></el-table-column>
        <el-table-column label="分" width="45" prop="XMXHF" align='center'></el-table-column>
      </el-table-column>
      <el-table-column fixed prop="XMBH" label="项目编号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="XMMC" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="KTBH" label="课题编号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="KTMC" label="课题名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="JHND" label="计划年度" width="80"></el-table-column>
      <el-table-column prop="ZFY" label="计划费用" align="right" width="80"></el-table-column>
      <el-table-column prop="HTJ" label="合同累积额" align="right" width="90"></el-table-column>
      <el-table-column prop="XMPC" label="项目批次" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <span style="">{{ scope.row.JHND }}年{{ scope.row.XMPCDMMC }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="FZDWDMMC" label="负责单位" show-overflow-tooltip width="90"></el-table-column>
      <el-table-column prop="XMFZR" label="项目负责人" width="90"></el-table-column>
      <el-table-column prop="XMJBDMMC" label="项目级别" show-overflow-tooltip width="80"> </el-table-column>
      <!-- 81359494-7a9d-41cb-a6a7-4e62e7dd0223 实施方案 -->

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
  </div>
</template>
<script >
import Hamburger from './Hamburder'
import treeSelect from '@/components/Common/treeSelect/tree.vue'
import { mapGetters } from 'vuex'
import { GetUnitTree, getQDName } from 'api/common/xm.js'

import querylist from '@/components/Common/QueryList'
import { isEmptyObjecct } from 'utils/validate' // GNM
// import { getXmPC, getXmFL, getXmJB, getXMFLTree } from 'api/xtsz/fzdw.js'
import bus from '@/components/bus.js'
export default {
  computed: {
    ...mapGetters(['sidetopbar', 'moduleid', 'xmxx', 'listquery', 'xmxxRow']),
    gettableheight() {
      return this.tableheight - 60 // GNM 高度调整，因有横向滚动条不出现的问题
    },
    showexport() {
      return this.showExport
    },
    xlsname(val) {
      return this.xlsName
    },
    titlename() {
      return this.titleName
    }
  },
  components: {
    Hamburger,
    treeSelect,
    querylist
  },
  props: {
    tableheight: {
      type: Number,
      default: 200
    },
    showExport: {
      type: Boolean,
      default: false
    },
    xlsName: {
      type: String,
      default: 'Sheet1'
    },
    titleName: {
      type: String,
      default: ''
    }
  },
  watch: {
    moduleid() {
      this._getQDName() // 获取清单所属的文件夹名
      this.getXMInfo() // GNM 当都引用此组件的模块加载时，要重新获取数据
    },
    listquery: {
      handler: function(obj, oldVal) {
        if (!isEmptyObjecct(this.listquery, 'MODULEID,XMTYPE')) {
          this.getXMInfo()
        }
      },
      deep: true
    },
    $route(to, from) {
      // GNM 因组件共用，在切换页面时，清空保存的选择数据
      this.$refs.xmxxTable.clearSelection()
      this.$store.dispatch('set_select_xmrow', null)
    }
  },
  data() {
    return {
      tbobj: null,
      staticDH: '&radic;',
      qdList: [], // 清单动态列
      loadingtb: false,
      dialog_lock: false,
      selectDefaultvalue: '',
      dialog_creat: false,
      opts_pc: []
      // tableData: []
    }
  },
  created() {
    this._getQDName() // 获取清单所属的文件夹名
    // this.getXMInfo() // 查询项目信息 // GNM 为提高页面展示效率，在载入时不执行查询
    if (!isEmptyObjecct(this.listquery, 'MODULEID,XMTYPE')) {
      this.getXMInfo()
    }
  },
  mounted() {
    this.tbobj = this.$refs.xmxxTable
    bus.$on('on-getXMInfo', () => {
      this.getXMInfo()
    })
  },
  methods: {
    getRowKey(row) {
      return row.KTBH
    },
    // 获取清单所属的文件夹名
    _getQDName() {
      var qry = { moduleid: this.moduleid }
      getQDName(qry).then(response => {
        this.qdList = response.data
      })
    },
    setSelectedIdCJDW(val) {
      if (val.trim() !== '') this.listquery.FZDWDM = val
    },
    // 更改事件
    GetXMXX() {
      this.getXMInfo()
    },
    // 获取项目信息
    getXMInfo() {
      // 公共模块id
      this.loadingtb = true
      this.$store
        .dispatch('GetXMInfo', this.listquery)
        .then(res => {
          this.loadingtb = false
          // this.$store.dispatch('set_cur_xmrow', null) // 重新获取数据后，更新已选行数据
          if (this.xmxxRow) {
            // GNM 根据当前行数据，对数据表进行选中控制
            let rowKey = this.xmxxRow.KTBH
            let crntRow = this.xmxx.filter(item => {
              return item.KTBH === rowKey
            })
            // 如果当前数据表没有选中项目的数据，则将当前选中行清空
            if (crntRow.length === 0)
              this.$store.dispatch('set_cur_xmrow', null)
            else this.$refs.xmxxTable.setCurrentRow(...crntRow)
          }
        })
        .catch(err => {
          this.loadingtb = false
          console.log('Xmtree' + err)
        })
    },
    cellclick(row, column, cell, event) {
      if (column.type != 'selection') {
        this.$refs.xmxxTable.clearSelection()
        this.$store.dispatch('set_cur_xmrow', row)
      }
    },
    // check行事件
    selectRow(selection, row) {
      this.$store.dispatch('set_select_xmrow', selection)
    },
    // check所有行事件
    selectallRow(selection) {
      this.$store.dispatch('set_select_xmrow', selection)
    },
    // 表格选中--用cellclick 替换了
    handleCurrentChange(row) {
      this.$store.dispatch('set_cur_xmrow', row)
      // this.$refs.xmxxTable.clearSelection();
    }
  }
}
</script>
 <style>
.page-component__nav .el-scrollbar__wrap {
  overflow-x: auto;
}

.is-current > .el-tree-node__content > .el-tree-node__label {
  color: #409eff;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.xmna {
  position: relative;
  width: 100%;
}
.hamburger-container {
  line-height: 50px;
  height: 30px;
  right: 10px;
  top: 1px;
  position: absolute;
  // float: right;
  padding: 0 10px;
}

.page-component__nav {
  height: 228px;
}
.page-component__nav2 {
  height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
