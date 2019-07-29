<template>
  <div id='exDiv' style='display:inline'>
    <el-button type="primary" icon="el-icon-download" size="mini" :style="itemStyle" @click="exportExcel">导出</el-button>
    <div id="expDiv" style="display:'none'">
    </div>
  </div>
</template>
<script>
export default {
  name: 'exxls',
  data: function() {
    return {
      _tbObj: this.tbObj,
      _tbTitle: this.tbTitle,
      _fileName: this.fileName,
      _headerNum: this.headerNum,
      _sheetName: this.sheetName
    }
  },
  watch: {

    $route(to, from) {
      this.resetObject() // 组件在转换页面时清空
    },
    tbObj: {
      handler: function(val, oldVal) {
        this._tbObj = val
      },
      immediate: true
    },
    tbTitle: {
      handler: function(val, oldVal) {
        this._tbTitle = val
      },
      immediate: true
    },
    fileName: {
      handler: function(val, oldVal) {
        this._fileName = val
      },
      immediate: true
    },
    headerNum: {
      handler: function(val, oldVal) {
        this._headerNum = val
      },
      immediate: true
    },
    sheetName: {
      handler: function(val, oldVal) {
        this._sheetName = val
      },
      immediate: true
    }
  },
  props: {
    /**
     * {
     *  fileName:'生成的文件名'
     *  expTables:[{
     *   tableObj:'vue的ref名'
     *   tableTitle:'本表的标题'
     *   headerNum:'本表表头的行数（不算标题行）'
     *   sheetName:'本表对应sheet页的名字'
     *  },
     *  {……}]
     * }
     */
    tbObj: {
      type: Object,
      default: null
    },
    itemStyle: {
      type: String,
      default: ''
    },
    tbTitle: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: '导出的数据文件'
    },
    headerNum: {
      type: Number,
      default: 0
    },
    sheetName: {
      type: String,
      default: 'Sheet1'
    }
  },
  methods: {
    exportExcel() {
      if (!this._tbObj) {
        alert('表参数为空')
        return
      }
      this._tbObj.fileName = this._fileName
      if (!this._tbObj.expTables) {
        // 如果无此属性，说明是要导一个table,重新组装
        this._tbObj.expTables = [
          {
            tableObj: this._tbObj,
            tbTitle: this._tbTitle,
            headerNum: this._headerNum,
            sheetName: this._sheetName
          }
        ]
      }
      let expTbArr = []
      let divObj = document.getElementById('expDiv')
      this._tbObj.expTables.forEach((tb, index) => {
        let tbTmp = document.createElement('TABLE')
        divObj.appendChild(tbTmp)
        tbTmp.setAttribute('id', 'tbExport' + index)

        /** element-ui中的el-table对象含有多个table对象
         * 需要找出所需要的表头、表体、表尾三部分
         * 一是通过元素的tagName属性过滤div
         * 二是通过元素的fixed(elementui中的自定议属性)属性过滤锁定辅助内容
         */
        let eltbObj = tb.tableObj.$children.filter(child => {
          return child.$el.tagName === 'TABLE' && child.fixed === undefined //
        })
        this.setTableHeader(tbTmp, eltbObj[0])
        this.setTableBody(tbTmp, eltbObj[1])
        if (eltbObj.length === 3) this.setTableFooter(tbTmp, eltbObj[2])
        expTbArr.push({
          id: 'tbExport' + index,
          tbTitle: tb.tbTitle, // 可以不传
          shName: tb.sheetName, // 可以不传,取默认值Sheet1
          hRow: tb.headerNum // 表格表头的行数（不算标题行），可以不传,表头字符不进行特殊处理
        })
      })
      /* eslint-disable global-require */
      let { export2excel } = require('./libs/xlsx')
      /* eslint-disable global-require */

      export2excel({
        fName: this._tbObj.fileName, // 可以不传，取默认值export
        expTbArr
      })
        .then(() => { // GNM 解决通用模块数据缓存的问题
          // this.resetObject() // 清空临时数据
          document.getElementById('expDiv').innerHTML = '' // 清空临时表格
        })
        .catch(err => {
          this.$message(err)
        })
    },
    setTableHeader(exptb, hobj) {
      // console.log(hobj.$el.childNodes)
      exptb.appendChild(
        [...hobj.$el.childNodes]
          .filter(child => {
            return child.tagName === 'THEAD'
          })[0]
          .cloneNode(true)
      )
    },
    setTableBody(exptb, bobj) {
      exptb.appendChild(
        [...bobj.$el.childNodes]
          .filter(child => {
            return child.tagName === 'TBODY'
          })[0]
          .cloneNode(true)
      )
    },
    setTableFooter(exptb, fobj) {
      exptb.appendChild(
        [...fobj.$el.childNodes]
          .filter(child => {
            return child.tagName === 'TBODY'
          })[0]
          .children[0].cloneNode(true)
      )
    },
    resetObject() {
      this._tbObj.expTables = null
      this._tbObj.fileName = ''
      this._tbTitle = ''
      this._fileName = '导出的数据文件'
      this._headerNum = 1
      this._sheetName = 'Sheet1'
    }
  }
}
</script>
<style scoped>

</style>
