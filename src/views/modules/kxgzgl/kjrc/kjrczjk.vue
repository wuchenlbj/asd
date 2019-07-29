<!-- 科技人才-专家库 -->
<template>
  <div class="jfsb">
    <div style="margin-bottom:10px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-edit" @click="add">添 加</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delrow">删 除</el-button>
        <el-button type="primary" @click="dialogExcelVisible =true">导入Excel</el-button>
      </el-button-group>

      <el-input class="filter-item" style="width: 120px;" @change='_getData' placeholder="姓名搜索" v-model="listQuery.mc"></el-input>
      <span class="span_download" :href="smjpic.actiondownurl+'filename='+smjpic.FILENAME+'&filepath='+smjpic.FILEPATH">下载Excle模版</span>
    </div>

    <el-table border :data="tableData" ref="tabler" v-loading='loading' :height="tableHeight" @row-dblclick="rowdblclick" @select='selectRow' @select-all='selectallRow' style="width: 100%" header-row-class-name="headclass">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="XH" label="序号" width="50"></el-table-column>
      <el-table-column label="姓名" prop="NAME"></el-table-column>
      <el-table-column label="单位" prop="DWDMMC"></el-table-column>
      <el-table-column label="职称" prop="ZC"></el-table-column>
      <el-table-column label="专业" prop="ZY"></el-table-column>
      <el-table-column label="最高学历" prop="XL"></el-table-column>
      <el-table-column label="职务" prop="POST"></el-table-column>
      <el-table-column label="联系方式" prop="TEL"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

    <!--编辑Dialogxmsb-->
    <el-dialog  v-dialogDrag title="评审专家维护" width="960px" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false">

      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="90px" style="width:100%;">

        <el-form-item label="姓名" prop="NAME">
          <el-input v-model="form.NAME" style="width:150px; " placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="单位代码" prop="DWDM">
          <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.DWDM" style="width:150px;" :multiple="false" placeholder="所在单位" @setSelectedId="setSelectedIdFZDW">
          </tree-select>
        </el-form-item>
        <el-form-item label="职称" prop="ZC">
          <el-input v-model="form.ZC" style="width:150px; " placeholder="职称"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="ZY">
          <el-input v-model="form.ZY" style="width:150px; " placeholder="专业"></el-input>
        </el-form-item>
        <el-form-item label="最高学历" prop="XL">
          <el-input v-model="form.XL" style="width:150px; " placeholder="最高学历"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="POST">
          <el-input v-model="form.POST" style="width:150px; " placeholder="职务"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="TEL">
          <el-input v-model="form.TEL" style="width:150px; " placeholder="联系方式"></el-input>
        </el-form-item>

        <el-form-item style="margin-left:100px;width:100%;">
          <el-button type="primary" :loading="loadingbtn" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- 导入Dialog -->
    <el-dialog  v-dialogDrag title="导入Excel" width="1300px" top="2vh" max-height="600" :close-on-click-modal="false" :visible.sync="dialogExcelVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">
        <UploadExcel :hideYear="false" tableName="KJGLPT_RY_PS" @loadingexcel="loadingexcel" @excelData="getExcelData" @loadingexcelerror="loadingexcelerror"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitExcelForm()">保存</el-button>

        <el-table :data="FormtableData" height="400" border style="width: 100%;margin-top:5px;" header-row-class-name="headclass">
          <el-table-column prop="XH" label="序号" width="50"></el-table-column>
          <el-table-column label="姓名" prop="NAME"></el-table-column>
          <el-table-column label="单位" prop="DWDMMC"></el-table-column>
          <el-table-column label="职称" prop="ZC"></el-table-column>
          <el-table-column label="专业" prop="ZY"></el-table-column>
          <el-table-column label="最高学历" prop="XL"></el-table-column>
          <el-table-column label="职务" prop="POST"></el-table-column>
          <el-table-column label="联系方式" prop="TEL"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>

<script >
import treeSelect from '../../../../components/Common/treeSelect/tree.vue'
import UploadExcel from '../../../../components/Common/UploadExcel'
import { NewGuid } from '@/config/filter'
import { getKJRCXXData, saveExcelData, saveZJData, dropPszj } from 'api/kxgzgl/kjrc.js'
import msg from 'utils/loadmsg'
import { GetUnitTree } from 'api/common/xm.js'
import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'xxcj',
  data() {
    return {
      smjpic: {
        actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
        FILENAME: '',
        FILEPATH: ''
      },
      treeDataFZDW: [], // 负责单位
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      },
      total: null,
      dialogExcelVisible: false,
      loadingbtn: false,
      loading2: false,
      FormtableData: [],
      loadingtext: '导入数据中,请稍后',
      dialogVisible: false,
      downloadInfo: {
        tbname: 'KJGLPT_KJRCXX',
        title: '科技人才信息'
      },
      rules: {
        NAME: [{ required: true, message: '请输入专家名称', trigger: 'blur' }],
        DWDM: [{ required: true, message: '请选择单位', trigger: 'change' }]
      },
      tableData: [], // 表格数据
      loading: false,
      listQuery: {
        mc: '',
        page: 1,
        limit: 30
      },
      form: {
        NAME: '',
        XH: '',
        ZC: '',
        ZY: '',
        XL: '',
        POST: '',
        TEL: '',
        DWDM: '',
        ID: '',
        TYPE: 'add'
      },
      tableHeight: 500
    }
  },
  components: {
    UploadExcel, treeSelect
  },
   // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 90
    }
  },
  mounted () {

    this.tableHeight = this.rightHeight - 90 // GNM

    this._getData()
    this.getTreeData()
  },
  methods: {
    // 保存归档信息
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingbtn = true
          saveZJData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            this.loadingbtn = false
            this.dialogVisible = false
            // 重新加载数据
            this._getData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setSelectedIdFZDW(val) {
      this.form.DWDM = val
    },
    // 负责单位
    getTreeData() {
      GetUnitTree().then(response => {
        this.treeDataFZDW = response.data
      })
    },
    // 打开添加窗口
    add() {
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs['ruleForm'].resetFields()
        this.form.ID = NewGuid()
        this.form.TYPE = 'add'
        this.form.XH = parseInt(this.total) + 1
      })
    },
    // 保存导入的excel
    submitExcelForm() {
      if (this.FormtableData.length == 0) {
        msg.showwarning('请先导入数据,再进行保存')
        return false
      }

      this.loading2 = true
      this.loadingtext = '保存数据中,请稍后'
      saveExcelData(this.FormtableData).then(response => {
        this.dialogExcelVisible = false
        // 重新加载数据
        this._GetTGXX()
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this._GetTGXX()
    },
    loadingexcel(res) {
      this.loading2 = res
      this.loadingtext = '导入数据中,请稍后'
    },
    loadingexcelerror() {
      this.loading2 = false
    },
    getExcelData(data) {
      this.FormtableData = data
    },
    // 科技人才信息
    _getData() {
      this.loading = true
      getKJRCXXData(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this._getData()
    },
    rowdblclick(row, event) {
      this.dialogVisible = true
      this.$nextTick(function() {
        this.form = row
        this.form.TYPE = 'edit'
      })
    },
    // check行事件
    selectRow(selection, row) {
      this.selectRows = selection
    },
    // check所有行事件
    selectallRow(selection) {
      this.selectRows = selection
    },
    // 删除行
    delrow() {
      var _this = this
      if (this.selectRows.length == 0) {
        msg.showwarning('请先选择数据行')
        return false
      }
      this.$confirm('确定要删除该信息吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除数据
          msg.showloading('正在删除,请稍后...')

          dropPszj(this.selectRows).then(response => {
            if (response.data) {
              msg.showwarning(response.data)
            } else {
              // 删除成功
              msg.showsuccess('删除成功')
              // 重新查询
              _this._getData()
            }
          })

        })
        .catch(() => { })
    }
  }
}
</script>
<style>
.upload-demo {
  display: inline;
}
.span_download {
  cursor: pointer;
  color: blue;
  font-size: 13px;
  margin-left: 10px;
}
</style>

