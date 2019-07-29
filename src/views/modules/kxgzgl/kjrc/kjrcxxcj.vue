<!-- 科技人才-人才库 -->
<template>
  <div class="jfsb">
    <div class="filter-container">
      <el-button-group>
        <el-button size="mini" class="filter-item" type="primary" @click="newGD">添加</el-button>
        <el-button size="mini" class="filter-item" type="primary" @click="del">删除</el-button>
      </el-button-group>

      <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetTGXX' placeholder="姓名" v-model="listQuery.mc">
      </el-input>

    </div>

    <el-table border style="width: 100%;margin-top:5px;" @select='selectRow' @select-all='selectallRow' :data="tableData" @row-dblclick="rowdblclick" :height="tableHeight" v-loading="loading" header-row-class-name="headclass">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="姓名" prop="NAME"></el-table-column>
      <el-table-column label="年度" prop="ND"></el-table-column>
      <el-table-column label="工作部门" width="90" show-overflow-tooltip prop="GZBM"></el-table-column>
      <el-table-column label="性别" width="60" prop="SEX">
        <template slot-scope="scope">
          <a v-if="scope.row.SEX==0">男</a>
          <a v-else-if="scope.row.SEX==1">女</a>
          <a v-else>未填写</a>
        </template>
      </el-table-column>
      <el-table-column label="出生年月" show-overflow-tooltip prop="BIRTH"></el-table-column>
      <el-table-column label="籍贯" show-overflow-tooltip width="80" prop="JG"></el-table-column>
      <el-table-column label="所在单位 " prop="DWDMMC" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column label="文化程度" prop="WHCD"></el-table-column>
      <el-table-column label="参加工作时间 " prop="CJGZNY" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="是否党员" prop="SFDY"></el-table-column>
      <el-table-column label="行政职务" prop="XZZW" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="工作岗位" prop="GZGW" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="技术职称" show-overflow-tooltip width="100" prop="JSZC"></el-table-column>
      <el-table-column label="任职时间" prop="RZNY" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="现从事专业" prop="CSZY" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否在聘" prop="SFZP"></el-table-column>
      <el-table-column label="第一学历" prop="DYXL" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="毕业院校" prop="BYXX" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="毕业时间" prop="BYNY"></el-table-column>
      <el-table-column label="所学专业" prop="SXZY" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="在职教育" prop="ZZJY"></el-table-column>
      <el-table-column label="毕业院校" prop="ZZBYXX" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="毕业时间" prop="ZZBYNY"></el-table-column>
      <el-table-column label="所学专业" prop="ZZSXZY" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="系列" prop="XL" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="级别" prop="JB" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column label="身份证号" show-overflow-tooltip width="100" prop="SFZ"></el-table-column>
      <el-table-column label="备注" show-overflow-tooltip width="150" prop="BZ"></el-table-column>

    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

    <!--编辑Dialogxmsb-->
    <el-dialog  v-dialogDrag  title="人才库信息维护" width="960px" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false">

      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="110px" style="width:100%;">

        <el-form-item label="姓名" prop="NAME">
          <el-input v-model="form.NAME" style="width:150px; " placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="年度" prop="ND">
          <el-date-picker v-model="form.ND" format="yyyy" value-format="yyyy" type="year" style="width:150px;" placeholder="年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作部门" prop="GZBM">
          <el-input v-model="form.GZBM" style="width:150px; " placeholder="工作部门"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="SEX">
          <el-select v-model="form.SEX" placeholder="请选择" style="width:150px;">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月" prop="BIRTH">
          <el-date-picker v-model="form.BIRTH" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="出生年月"></el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" prop="JG">
          <el-input v-model="form.JG" style="width:150px; " placeholder="籍贯"></el-input>
        </el-form-item>
        <el-form-item label="所在单位 " prop="DWDM">
          <tree-select clearable :treeData="treeDataFZDW" :treeProps="treeProps" v-model="form.DWDM" style="width:150px;" :multiple="false" placeholder="所在单位" @setSelectedId="setSelectedIdFZDW">
          </tree-select>
        </el-form-item>
        <el-form-item label="文化程度" prop="WHCD">
          <el-input v-model="form.WHCD" style="width:150px; " placeholder="文化程度"></el-input>
        </el-form-item>
        <el-form-item label="参加工作时间 " prop="CJGZNY">
          <el-date-picker v-model="form.CJGZNY" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="参加工作时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否党员" prop="SFDY">
          <el-input v-model="form.SFDY" style="width:150px; " placeholder="是否党员"></el-input>
        </el-form-item>
        <el-form-item label="行政职务" prop="XZZW">
          <el-input v-model="form.XZZW" style="width:150px; " placeholder="行政职务"></el-input>
        </el-form-item>
        <el-form-item label="工作岗位" prop="GZGW">
          <el-input v-model="form.GZGW" style="width:150px; " placeholder="工作岗位"></el-input>
        </el-form-item>
        <el-form-item label="技术职称" prop="JSZC">
          <el-input v-model="form.JSZC" style="width:150px; " placeholder="技术职称"></el-input>
        </el-form-item>
        <el-form-item label="任职时间" prop="RZNY">
          <el-date-picker v-model="form.RZNY" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="任职时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="现从事专业" prop="CSZY">
          <el-input v-model="form.CSZY" style="width:150px; " placeholder="现从事专业"></el-input>
        </el-form-item>
        <el-form-item label="是否在聘" prop="SFZP">
          <el-select v-model="form.SFZP" placeholder="请选择" style="width:150px;">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第一学历" prop="DYXL">
          <el-input v-model="form.DYXL" style="width:150px; " placeholder="第一学历"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" prop="BYXX">
          <el-input v-model="form.BYXX" style="width:150px; " placeholder="毕业院校"></el-input>
        </el-form-item>
        <el-form-item label="毕业时间" prop="BYNY">
          <el-date-picker v-model="form.BYNY" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="毕业时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="所学专业" prop="SXZY">
          <el-input v-model="form.SXZY" style="width:150px; " placeholder="所学专业"></el-input>
        </el-form-item>
        <el-form-item label="在职教育" prop="ZZJY">
          <el-input v-model="form.ZZJY" style="width:150px; " placeholder="在职教育"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" prop="ZZBYXX">
          <el-input v-model="form.ZZBYXX" style="width:150px; " placeholder="毕业院校"></el-input>
        </el-form-item>
        <el-form-item label="毕业时间" prop="ZZBYNY">
          <el-date-picker v-model="form.ZZBYNY" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="毕业时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="所学专业" prop="ZZSXZY">
          <el-input v-model="form.ZZSXZY" style="width:150px; " placeholder="所学专业"></el-input>
        </el-form-item>
        <el-form-item label="系列" prop="XL">
          <el-input v-model="form.XL" style="width:150px; " placeholder="系列"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="JB">
          <el-input v-model="form.JB" style="width:150px; " placeholder="级别"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="SFZ">
          <el-input v-model="form.SFZ" style="width:150px; " placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="BZ">
          <el-input type="textarea" v-model="form.BZ" style="width:350px; " placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item style="margin-left:100px;">
          <el-button type="primary" :loading="loadingbtn" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script >
// import CsvExport from '@/utils/CsvExport.ts'

import treeSelect from '../../../../components/Common/treeSelect/tree.vue'
import { getList, saveData, dropRck } from 'api/kxgzgl/kjrc'
import msg from 'utils/loadmsg'
import { NewGuid } from '@/config/filter'
import { GetUnitTree } from 'api/common/xm.js'

import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'tgyy',
  data() {
    return {
      treeDataFZDW: [], // 负责单位
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      uploadbtn: false,
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      },
      // 导入相关
      dialogExcelVisible: false,
      dialogFormVisible: false,
      loadingbtn: false,
      loading2: false,
      selectRows: [],
      FormtableData: [],
      tableHeight: '500',
      dialogVisible: false,
      fileList: {},
      form: {
        ID: '',
        NAME: '',
        ND: '',
        GZBM: '',
        SEX: '',
        BIRTH: '',
        JG: '',
        DWDM: '',
        WHCD: '',
        CJGZNY: '',
        SFDY: '',
        XZZW: '',
        GZGW: '',
        JSZC: '',
        RZNY: '',
        CSZY: '',
        SFZP: '',
        DYXL: '',
        BYXX: '',
        BYNY: '',
        SXZY: '',
        ZZJY: '',
        ZZBYXX: '',
        ZZBYNY: '',
        ZZSXZY: '',
        BZ: '',
        XL: '',
        JB: '',
        SFZ: '',
        XH: '',
        TYPE: 'add'

      },
      total: null,
      tableData: [],
      loading: false,
      listQuery: {
        mc: '',
        page: 1,
        limit: 30
      },
      rules: {
        CGMC: [{ required: true, message: '请输入成果名称', trigger: 'blur' }]

      }
    }
  },
  components: {
    treeSelect
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
    this._GetTGXX()
    this.getTreeData()
  },
  methods: {
    setSelectedIdFZDW(val) {
      this.form.DWDM = val
    },
    // 负责单位
    getTreeData() {
      GetUnitTree().then(response => {
        this.treeDataFZDW = response.data
      })
    },
    // 删除
    del() {
      if (this.selectRows.length == 0) {
        msg.showwarning('请先选择数据行')
        return false
      }
      var _this = this
      this.$confirm('确定要删除所选信息吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除数据
          msg.showloading('正在删除,请稍后...')
          dropRck(this.selectRows).then(response => {
            if (response.data) {
              msg.showwarning(response.data)
            } else {
              // 删除成功
              msg.showsuccess('删除成功')
              // 重新查询
              _this._GetTGXX()
            }
          })
        })
        .catch(() => { })
    },
    // 打开归档窗口
    newGD() {
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs['ruleForm'].resetFields()
        this.form.CGID = NewGuid()
        this.form.TYPE = 'add'
      })
    },
    rowdblclick(row, event) {
      this.dialogVisible = true
      this.$nextTick(function() {
        this.form = row
        this.form.KTBH = row.KTBH
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

    // 保存归档信息
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingbtn = true
          saveData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            this.loadingbtn = false
            this.dialogVisible = false
            // 重新加载数据
            this._GetTGXX()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取信息
    _GetTGXX() {
      this.loading = true
      getList(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this._GetTGXX()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  width: 750px;
}
</style>
<style>
label {
  font-weight: 500 !important;
}
.upload-demo {
  float: left;
  margin-right: 20px;
}
</style>
