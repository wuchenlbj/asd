<!--
/* 树形表格组件
 * @Author: 高年蒙
 * @Date: 2018-05-01 14:39:30
 * @Last Modified by: 高年蒙
 * @Last Modified time: 2018-05-01 21:50:04
 * @Descriptions: 基于一定层次关系，实现可折叠的树形表格
 * 属性：
        autoSerial：是否添加自动序列
        columns：表格数据列对象
          {
            label:''// 数据对象中对应的label列名
            prop:'' // 数据对象中对应的prop数据列名
          }
        tableHeight：表格的高度
        tableData：表格的数据对象,按elementui的要求组织
 */
-->
<template>
  <el-table ref="gridObj" header-cell-class-name="gridh" :header-cell-style="{backgroundColor:'#4169e1'}" :data="gridData" :height="tableHeight" border stripe fit header-align="center">
    <el-table-column v-if="autoSerial" width="60" label="序号" prop="XH">
    </el-table-column>
    <!-- :width="clnm.expand?450:''" -->
    <el-table-column :key='getRandomNum()' v-for='clnm in columns' :label="clnm.label" >
      <template slot-scope="scope">
        <!-- <i class="el-icon-plus" v-if="clnm.expand && scope.row.children" @click="displayChildren()" style="cursor:pointer"></i> -->
        <span>{{scope.row[clnm.prop]}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import TreeRow from './TreeRow'
export default {
  name: 'treegrid',
  components: {
    TreeRow
  },
  data() {
    return {
      randomID: 0,
      gridData: []
    }
  },
  props: {
    autoSerial: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number,
      default: 300
    },
    // 还没有实现复杂表头
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    tableData: {
      handler(newValue, oldValue) {
        this.appendChildren(newValue)
      },
      deep: true
    }
  },
  // computed: {
  //   gridData() {
  //     let gddata = [...this.tableData]
  //     return gddata
  //   }
  // },
  methods: {
    // 得到一个随机数作为ID号
    getRandomNum() {
      return Math.random()
    },
    displayChildren() {
      console.log('sass')
    },
    getChildren(dataObj) {
      let dataTemp = []
      dataObj.forEach((item, index) => {
        if (!item.child) item.XH = index + 1 // 添加自动序列号
        dataTemp.push(item) //  首先把当前元素填冲，再判断有无子元素
        if (item.children && item.children.length > 0) {
          item.children.forEach((child, cIndex) => {//先配置序列号
            child.XH = item.XH + '.' + (cIndex + 1) // 添加自动序列号
            child.child = true
          })
          // 有子元素,无限循环
          dataTemp.push(...this.getChildren(item.children))
        }
      })
      return dataTemp
    },
    appendChildren(dataObj) {
      if (!dataObj) dataObj = [...this.tableData] // 第一次加载组件
      // this.$refs.gridObj.$children.push(this.gridData)

      this.gridData = this.getChildren(dataObj)
    }
  },
  created() {},
  mounted() {
    this.appendChildren()
  }
}
</script>
<style lang="scss">
.gridh {
  height: 45px;
  div[class='cell'] {
    color: white;
  }
}
</style>
