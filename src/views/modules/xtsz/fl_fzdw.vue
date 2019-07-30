<template>
  <div class="app">
 
  <el-select v-model="seldwvalue"  clearable  @change='changeny' placeholder="请选择当前年月">
    <el-option
      v-for="item in options"
      :key="item.DZNY"
      :label="item.DZNY"
      :value="item.DZNY">
    </el-option>
  </el-select>


    <zTree  :nodeData="nodeData" ParentTag='fzdw' :showDM="false" v-loading="loadingtree" @adddata='adddata' @editdata='editdata'   @changedata='changedata' ref="childztree" ></zTree>
    <el-button type="primary" @click="saveNyDw" style="margin-top:20px;">保存到当前年月</el-button>
  </div>
</template>

<script>
// import VueDragTree from 'vue-drag-tree'
import zTree from '../../../components/Common/zTree.vue';
import { getDWNY, saveTreeData, addTreeData, editTreeData } from 'api/xtsz/fzdw.js';
import { GetUnitTree } from 'api/common/xm.js';
export default {
  name: 'app',
  components: {
    zTree
  },
  data() {
    return {
      loadingtree: false,
      seldwvalue: '',
      options: [], // 下拉树 数据源
      nodeData: [{ ID: '0', NAME: '单位', open: true, isParent: true }], // 树数据源
      ysnodeData: [{ ID: '0', NAME: '单位', open: true, isParent: true }],
      dialogstate: false
    }
  },
  methods: {
    curNodeClicked(model, component) {
      // 当前被点击节点的主要信息
    },
    // 获取保存数据
    saveNyDw() {
      // 触发子组件方法
      this.$refs.childztree.getData()
    },
    // 保存数据
    changedata(data) {
      var _this = this
      if (data.length == 0) {
        this.$message({
          message: '请先选择年月查询单位数据',
          type: 'warning'
        })
        return false
      } else {
        // console.info(data)
        // return
        this.loadingtree = true
        saveTreeData(data).then(response => {
          // console.info(response.data);
          _this.$message({
            message: '保存数据成功',
            type: 'success'
          })
          this.loadingtree = false
          // 重新加载年月下拉
          _this.seldwvalue = '';
          _this.getSelectDWNY()
        })
      }
    },
    // 保存添加的数据
    adddata(data) {
      var _this = this

      addTreeData(data).then(response => {
       //  console.info(response.data);
        if (typeof (response.data) === 'string') { // 存在该单位
          _this.$message({
            message: response.data,
            type: 'warning'
          })
          // 触发子组件方法 删除添加的节点
          this.$refs.childztree.delnodeData(data.ID)
        }
      })
    },
    // 编辑单位重命名
    editdata(data) {
      var _this = this

      editTreeData(data).then(response => {
        if (typeof (response.data) === 'string') { // 存在该单位
          _this.$message({
            message: response.data,
            type: 'warning'
          })
          // 触发子组件方法 删除添加的节点
          this.$refs.childztree.delnodeData(data.ID)
        }
      })
    },
    changedialog(state) {
      this.dialogstate = state
    },
    // 获取单位年月
    getSelectDWNY() {
      getDWNY().then(response => {
        this.options = response.data
      })
    },
    // 更改年月查询
    changeny(val) {
      var parm = val === '' ? '' : encodeURI(val)
      // 获取数据
      this.GetUNItTree(parm)
    },
    // 获取单位数据
    GetUNItTree(parm) {
      if (parm === '') return []
      this.loadingtree = true
      GetUnitTree({ ny: parm, type: 'fid' }).then(response => {
        this.nodeData = this.ysnodeData.concat(response.data)
        this.loadingtree = false
      })
    }
  },
  mounted() {
    this.seldwvalue = '默认值';
    this.getSelectDWNY()
    this.changeny(this.seldwvalue)
  }
}
</script>
<style scoped >
.app {
  margin: 20px;
}
</style>
