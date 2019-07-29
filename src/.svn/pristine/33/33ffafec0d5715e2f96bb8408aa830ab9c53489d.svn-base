<!-- 验收管理 验收安排 -->
<template>
  <div class="">
    <div class="topnav">
     &nbsp;&nbsp;延长油田股份有限公司科技项目验收安排表
      <el-button type="primary" @click="setPS">添加验收信息</el-button>
      &nbsp;&nbsp;
       <el-button plain type="primary" @click="goback">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      <!-- <el-button type="warning" @click="setPS">添加评委</el-button> -->
    </div>

    <el-table :height="tableHeight" v-loading='loading' @select='selectRow' @select-all='selectallRow' ref="htqt" border :data="tableData" style="width: 100%;margin-top:20px;" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="XMBH" label="项目编号" show-overflow-tooltip width="110"></el-table-column>
      <el-table-column prop="XMMC" label="项目名称" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="KTBH" label="课题编号" show-overflow-tooltip width="110"></el-table-column>
      <el-table-column prop="KTMC" label="课题名称" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="FZDWDMMC" label="项目承担单位" show-overflow-tooltip width="110"></el-table-column>
      <el-table-column prop="XMFZR" label="项目负责人" width="85"></el-table-column>
      <el-table-column label="验收时间" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.YSSJ">{{scope.row.YSSJ|parseTime3("yyyy-MM-dd HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="PWMC" label="评审专家" show-overflow-tooltip width="110"></el-table-column>
      <el-table-column label="备注" prop="BZ" min-width="100"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

    <!--编辑Dialogxmsb-->
    <el-dialog  v-dialogDrag title="验收时间安排" width="1200px" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false">
      <pspz :psdata="selectRows" @closewin="closewin"></pspz>
    </el-dialog>

  </div>
</template>

<script >
import pspz from './yspspz'
import { getYsapXX, saveYsap } from 'api/xmgl/ysgl/index.js'
import msg from 'utils/loadmsg'
import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'ysap',
  components: {
    pspz
  },
  data() {
    return {
      dialogVisible: false,
      tableHeight: '500',
      loading: false,
      loadingbtnsave: false,
      form: {
        YSSJ: ''
      },
      rules: {

      },
      total: null,
      listQuery: {
        cgmc: '',
        wcry: '',
        page: 1,
        limit: 30
      },
      tableData: [],
      selectRows: []
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 115
    }
  },
  mounted() {
    this.tableHeight = this.rightHeight - 115 // GNM
    this._GetData()
  },
  methods: {
    // 添加评委
    setPS() {
      if (this.selectRows.length == 0) {
        msg.showwarning('未选择项目，请先勾选项目')
        return false
      }
      this.dialogVisible = true
    },
    closewin() {
      this._GetData()
      this.dialogVisible = false
    },
    goback() {
      this.$router.push({ path: '/xmgl/ysgl/ysps' }) // 打开路径页面
    },
    // 添加验收安排
    _saveYsap() {
      if (this.selectRows.length === 0) {
        msg.showwarning('未选择项目，请先勾选项目')
        return false
      }

      var res = false
      for (var i = 0; i < this.selectRows.length; i++) {
        if (this.selectRows[i].YSSJ) {
          res = true
        }
        this.selectRows[i].YSSJ = this.form.YSSJ
        this.selectRows[i].ZTFL = '4'
      }
      if (res) {
        msg.showwarning('选择数据中包含验收过的项目，请重新选择')
        return false
      }
      this.loadingbtnsave = true
      saveYsap(this.selectRows).then(response => {
        msg.showsuccess('保存数据成功')
        this.loadingbtnsave = false
        this.dialogVisible = false
        this._GetData()
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this._GetData()
    },
    // check行事件
    selectRow(selection, row) {
      this.selectRows = selection
    },
    // check所有行事件
    selectallRow(selection) {
      this.selectRows = selection
    },
    // 获取验收信息
    _GetData() {
      this.loading = true
      getYsapXX(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.topnav {
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #e7e7e7;
  line-height: 24px;
  font-size: 16px;
  padding-left: 20px;
}
.icon-back {
  color: red;
  font-weight: blod;
  cursor: pointer;
}
</style>
