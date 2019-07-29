<template>
  <div class="app">
    <el-alert title="选择下面附录类型，进行相应的字典维护" type="warning"> </el-alert>
    <el-tabs  v-model="activeName" @tab-click="tabClick" tab-position="left" :style="{height:tabHeight + 'px',float:'left',width:'100px',marginTop:'20px',marginLeft:'30px'}">
      <el-tab-pane label="项目级别" name="jb">
      </el-tab-pane>
      <el-tab-pane label="项目分类" name="fl">
      </el-tab-pane>
      <el-tab-pane label="项目批次" name="pc">
      </el-tab-pane>
    </el-tabs>
    <div style="float:left;margin-left:50px;">

      <el-select style="margin-top:20px;" v-show="show_fl" v-model="selndvalue" clearable @change='changeny' placeholder="请选择当前年">
        <el-option v-for="item in options" :key="item.DZND" :label="item.DZND" :value="item.DZND">
        </el-option>
      </el-select>
      <zTree :treeHeight="tabHeight" :nodeData="nodeData" :showDM="showDM" v-loading="loadingtab" @changedata='changetype' ref="ztreejb"></zTree>
      <el-button type="primary" @click="save" icon="el-icon-edit" style="margin-top:10px;">保存</el-button>
    </div>
  </div>
</template>

<script>
import zTree from 'src/components/Common/zTree.vue'
import { mapGetters } from 'vuex'
import {
  getXmJB,
  getXmFL,
  getXmPC,
  saveJBData,
  saveFLData,
  savePCData,
  getFLND
} from 'api/xtsz/fzdw.js'

export default {
  name: 'flall',
  components: {},
  data() {
    return {
      activeName: 'jb',
      options: [], // 年底下拉树 数据源
      loadingtab: false,
      show_fl: false, // 是否显示项目分类的年度
      showDM: false,
      tabHeight:300,
      selndvalue: '',
      curtab: '',
      nodeData: [],
      nodeDatafl: [{ ID: '0', NAME: '项目分类', open: true, isParent: true }], // 分类
      nodeDatapc: [{ ID: '0', NAME: '项目批次', open: true, isParent: true }], // 批次
      nodeDatajb: [{ ID: '0', NAME: '项目级别', open: true, isParent: true }] // 项目级别
    }
  },
  components: {
    zTree
  },
  methods: {
    // tab点击
    tabClick(tab) {
      this.loadingtab = true
      this.show_fl = false
      this.nodeData = []
      this.curtab = tab.name
      switch (tab.name) {
        case 'jb': // 项目级别
          this.getxmjb()
          break
        case 'fl': // 项目分类
          this.show_fl = true
          // 1。查询年度数据
          this.getSelFLND()
          // 2.查询最大年度的数据
          this.GetFLND('')
          break
        case 'pc': // 项目批次
          getXmPC().then(response => {
            this.nodeData = this.nodeDatapc.concat(response.data)
            this.loadingtab = false
          })
          break
      }
    },
    getxmjb() {
      getXmJB().then(response => {
        this.nodeData = this.nodeDatajb.concat(response.data)
        this.loadingtab = false
      })
    },
    // 查询项目分类
    GetFLND(nd) {
      getXmFL(nd).then(response => {
        this.nodeData = this.nodeDatafl.concat(response.data)
        this.loadingtab = false
      })
    },
    // 更改年度查询
    changeny(val) {
      this.loadingtab = true
      // 获取数据
      this.GetFLND(val)
    },
    changedialog(state) {
      // this.dialogstate =state
    },
    save(type) {
      // 触发子组件方法
      this.$refs.ztreejb.getData()
    },
    changetype(data) {
      switch (this.curtab) {
        case 'jb': // 项目级别
          this.changedata(data)
          break
        case 'fl': // 项目分类
          this.changefldata(data)
          break
        case 'pc': // 项目批次
          this.changepcdata(data)
          break
      }
    },
    // 获取项目分类-年度
    getSelFLND() {
      getFLND().then(response => {
        this.options = JSON.parse(response.data)
        this.loadingtab = false
      })
    },
    // 保存项目级别
    changedata(data) {
      var _this = this
      this.loadingtab = true
      saveJBData(data).then(response => {
        _this.$message({
          message: '保存数据成功',
          type: 'success'
        })
        this.loadingtab = false
      })
    },
    //保存分类
    changefldata(datas) {
      var _this = this
      this.loadingtab = true
      const data = datas
      const nd = this.selndvalue
      saveFLData(data).then(response => {
        _this.$message({
          message: '保存数据成功',
          type: 'success'
        })
        this.loadingtab = false
      })
    },
    //保存批次
    changepcdata(data) {
      var _this = this
      this.loadingtab = true
      savePCData(data).then(response => {
        _this.$message({
          message: '保存数据成功',
          type: 'success'
        })
        this.loadingtab = false
      })
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight(val) {
     this.tabHeight = parseInt(val * 0.85)
    }
  },
  mounted() {
    this.tabHeight = parseInt(this.rightHeight * 0.85)
    this.getxmjb()
  }
}
</script>

