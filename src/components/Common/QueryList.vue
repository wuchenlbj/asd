<!--计划查询条件-->
<template>
  <!-- 查询条件 -->
  <div class="filter-container2">

    <el-date-picker size="mini" style="width: 90px;" @change='GetXMXX' value-format="yyyy" align="right" type="year" v-model="listquery.JHND" placeholder="年度" :clearable="false">
    </el-date-picker>

    <tree-select @setSelectedId="setSelectedIdCJDW" v-show="treeDataFZDW.length>0" clearable size="mini" :treeData="treeDataFZDW" :treeProps="treeProps" placeholder="负责单位" v-model="listquery.FZDWDM" style="width:120px;" :multiple="false">
    </tree-select>

    <el-select size="mini" clearable v-model="listquery.XMPCDM" @change='GetXMXX' style="width: 95px;" placeholder="项目批次">
      <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
      </el-option>
    </el-select>
    <el-input size="mini" style="width: 100px;" @change='GetXMXX' placeholder="课题编号" v-model="listquery.KTBH">
    </el-input>
    <el-input size="mini" style="width: 100px;" @change='GetXMXX' placeholder="课题名称" v-model="listquery.KTMC">
    </el-input>
    <el-select size="mini" v-model="listquery.XMJBDM" placeholder="项目级别" style="width:90px;">
      <el-option v-for="(item,index) in opts_jb" :key="index" :label="item.NAME" :value="item.ID">
      </el-option>
    </el-select>
    <el-button size="mini" type="primary" @click="GetSearch" icon="search">搜索</el-button>
    <!-- <span class="dtcount" v-if="xmxx.length>0">已全部加载，共{{xmxx.length}}个</span> -->
    <exxls v-if="showExport" :tb-obj="tbobj" :file-name="filename" :header-num="headernum" :tb-title="tbtitle"></exxls>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { GetUnitTree } from 'api/common/xm.js'
import { getXmPC, getXmJB } from 'api/xtsz/fzdw.js'
import treeSelect from '@/components/Common/treeSelect/tree.vue'
import { getcurYear } from 'utils/index'
import exxls from 'common/xlsx/tabletoexcel' // GNM 添加导出
export default {
  name: 'querylist',
  computed: {
    ...mapGetters(['xmxx', 'moduleid', 'listquery']),

    filename(){
      return this.fileName
    },
    headernum(val){
      return this.headerNum
    },
    tbtitle(){
      return this.tbTitle
    },
    tbobj(){
      return this.tbObj
    },
    showexport(val){
      return this.showExport
    }
  },
  components: {
    treeSelect,
    exxls
  },
  props: {
    fileName: {
      type: String,
      default: '导出的表格'
    },
    headerNum: {
      type: Number,
      default: 1
    },
    tbTitle: {
      type: String,
      default: ''
    },
    tbObj: {
      type: Object,
      default: null
    },
    showExport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeDataFZDW: [], // 负责单位
      opts_pc: [],
      opts_jb: [],
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      }
    }
  },
  created() {
    this.listquery.JHND = this.listquery.JHND || getcurYear()
    this._getTreeData()
    this._getXMPC()
    this._getxmjb()
  },
  methods: {
    // 触发事件查询
    GetXMXX(isBtn) {
      this.$store.dispatch('set_cur_listQuery', this.listquery) // 这里通过vuex统一存储变量 外面通过watch监听处理
    },
    // 搜索按钮触发
    GetSearch() {
      this.$emit('on-query', this.listquery)
    },
    // 项目级别
    _getxmjb() {
      getXmJB().then(response => {
        this.opts_jb = response.data
      })
    },
    // 负责单位
    _getTreeData() {
      GetUnitTree().then(response => {
        this.treeDataFZDW = response.data
        // 只有本单位的权限
        if (response.data.length == 0) {
          this.listquery.FZDWDM = this.$store.getters.user.Dwdm
        }
      })
    },
    setSelectedIdCJDW(val) {
      this.listquery.FZDWDM = val
      this.GetXMXX()
    },
    // 获取项目批次
    _getXMPC() {
      getXmPC().then(response => {
        this.opts_pc = response.data
      })
    }
  }
}
</script>
<style>
.filter-container2 {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 5px;
}

.exxls {
  margin-bottom: 10px;
  vertical-align: middle;
  position: absolute;
  top: 0px;
  left: 680px;
}
</style>
