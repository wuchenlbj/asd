<!-- 成果管理-成果获奖登记 -->
<template>
  <div class="jfsb">
    <div class="filter-container">
      <el-button-group>
        <el-button class="filter-item" type="primary" @click="newGD">登记获奖</el-button>
        <el-button class="filter-item" type="primary" @click="exportdata">导入Excel</el-button>
        <el-button class="filter-item" type="primary" @click="del">删除</el-button>
      </el-button-group>
      <exxls :tb-obj="tbobj" :file-name="pagename" :tb-title="pagename" :itemStyle="'{display: inline-block;margin-bottom: 10px;vertical-align: middle;}'"></exxls>

      <el-upload class="upload-demo" style="margin-right:1px;" :action="actionurl" :show-file-list="false" :on-error="onerror" :before-upload="beforeAvatarUpload" :headers="headersData" :on-success="filesuccess" :data="uploadData" :multiple="false">
        <el-button type="warning" :loading="uploadbtn">上传获奖证书扫描件</el-button>
      </el-upload>
      <el-upload class="upload-demo" :action="actionurl" :show-file-list="false" :on-error="onerror" :before-upload="beforeAvatarUpload2" :headers="headersData" :on-success="filesuccess2" :data="uploadData" :multiple="false">
        <el-button type="warning" :loading="uploadbtn2">上传获奖文件</el-button>
      </el-upload>

      <el-input class="filter-item" style="width: 120px;" @change='_GetList' placeholder="获奖项目名称" v-model="listQuery.cgmc">
      </el-input>
      <el-input class="filter-item" style="width: 120px;" @change='_GetList' placeholder="主要完成人员" v-model="listQuery.wcry">
      </el-input>
    </div>

    <el-table ref="cghjdj" border style="width: 100%;" @select='selectRow' @select-all='selectallRow' highlight-current-row :data="tableData" @row-dblclick="rowdblclick" :height="tableHeight" v-loading="loading" header-row-class-name="headclass">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="HJXMMC" label="获奖项目名称" show-overflow-tooltip min-width="120px"></el-table-column>
      <el-table-column prop="ZYWCRY" label="主要完成人员" show-overflow-tooltip width="120px"></el-table-column>
      <el-table-column prop="JZ" label="奖种" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="HJDW" label="获奖单位" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="SSEJDW" label="所属二级单位" show-overflow-tooltip width="100px"></el-table-column>
      <el-table-column prop="HJDJ" label="获奖等级" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="SJDW" label="授奖单位" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="SSJB" label="所属级别" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="HJND" label="获奖年度" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="TJND" label="统计年度" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="ZSHM" label="证书号码" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="FZRQ" label="发证日期" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="TJDW" label="推荐单位" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="SLBH" label="受理编号" show-overflow-tooltip width="90px"></el-table-column>
      <el-table-column prop="XMJJ" label="项目简介" show-overflow-tooltip width="120px"></el-table-column>
      <el-table-column prop="FILEPATH" label="集体获奖证书扫描件" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH" :href="actiondownurl+'filename='+scope.row.FILENAME+'&filepath='+scope.row.FILEPATH">{{scope.row.FILENAME}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="FILEPATH2" label="获奖文件" show-overflow-tooltip width="130">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH2" :href="actiondownurl+'filename='+scope.row.FILENAME2+'&filepath='+scope.row.FILEPATH2">{{scope.row.FILENAME2}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column prop="BZ" label="备注" show-overflow-tooltip width="120px"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

    <!-- 导入Dialog -->
    <el-dialog v-dialogDrag title="导入Excel" width="1300px" top="2vh" max-height="600" :close-on-click-modal="false" :visible.sync="dialogExcelVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">

        <UploadExcel :hideYear="false" tableName="KJGLPT_CG_HJ" @loadingexcel="loadingexcel" @excelData="getExcelData" @loadingexcelerror="loadingexcelerror"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitExcelForm()">保存</el-button>

        <el-table :data="FormtableData" height="400" border style="width: 100%;margin-top:5px;" header-row-class-name="headclass">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="HJXMMC" label="获奖项目名称" show-overflow-tooltip min-width="120px"></el-table-column>
          <el-table-column prop="ZYWCRY" label="主要完成人员" show-overflow-tooltip width="120px"></el-table-column>
          <el-table-column prop="JZ" label="奖种" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="HJDW" label="获奖单位" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="SSEJDW" label="所属二级单位" show-overflow-tooltip width="100px"></el-table-column>
          <el-table-column prop="HJDJ" label="获奖等级" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="SJDW" label="授奖单位" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="SSJB" label="所属级别" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="HJND" label="获奖年度" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="TJND" label="统计年度" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="ZSHM" label="证书号码" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="FZRQ" label="发证日期" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="TJDW" label="推荐单位" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="SLBH" label="受理编号" show-overflow-tooltip width="90px"></el-table-column>
          <el-table-column prop="XMJJ" label="项目简介" show-overflow-tooltip width="120px"></el-table-column>
          <el-table-column prop="BZ" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--编辑Dialogxmsb-->
    <el-dialog v-dialogDrag title="成果获奖登记维护" width="960px" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false">

      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="110px" style="width:100%;">

        <el-form-item label="获奖项目名称" prop="HJXMMC">
          <el-input v-model="form.HJXMMC" style="width:150px;" placeholder="获奖项目名称"></el-input>
        </el-form-item>
        <el-form-item label="主要完成人员" prop="ZYWCRY">
          <el-input v-model="form.ZYWCRY" style="width:150px;" placeholder="主要完成人员"></el-input>
        </el-form-item>
        <el-form-item label="奖种" prop="JZ">
          <el-input v-model="form.JZ" style="width:150px;" placeholder="奖种"></el-input>
        </el-form-item>
        <el-form-item label="获奖单位" prop="HJDW">
          <el-input v-model="form.HJDW" style="width:150px;" placeholder="获奖单位"></el-input>
        </el-form-item>
        <el-form-item label="所属二级单位" prop="SSEJDW">
          <el-input v-model="form.SSEJDW" style="width:150px;" placeholder="所属二级单位"></el-input>
        </el-form-item>
        <el-form-item label="获奖等级" prop="HJDJ">
          <el-input v-model="form.HJDJ" style="width:150px;" placeholder="获奖等级"></el-input>
        </el-form-item>
        <el-form-item label="授奖单位" prop="SJDW">
          <el-input v-model="form.SJDW" style="width:150px;" placeholder="授奖单位"></el-input>
        </el-form-item>
        <el-form-item label="所属级别" prop="SSJB">
          <el-input v-model="form.SSJB" style="width:150px;" placeholder="所属级别"></el-input>
        </el-form-item>
        <el-form-item label="获奖年度" prop="HJND">
          <el-date-picker v-model="form.HJND" format="yyyy" value-format="yyyy" type="year" style="width:150px;" placeholder="获奖年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="统计年度" prop="TJND">
          <el-date-picker v-model="form.TJND" format="yyyy" value-format="yyyy" type="year" style="width:150px;" placeholder="统计年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证书号码" prop="ZSHM">
          <el-input v-model="form.ZSHM" style="width:150px;" placeholder="证书号码"></el-input>
        </el-form-item>
        <el-form-item label="发证日期" prop="FZRQ">
          <el-date-picker v-model="form.FZRQ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="发证日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推荐单位" prop="TJDW">
          <el-input v-model="form.TJDW" style="width:150px;" placeholder="推荐单位"></el-input>
        </el-form-item>
        <el-form-item label="受理编号" prop="SLBH">
          <el-input v-model="form.SLBH" style="width:150px;" placeholder="受理编号"></el-input>
        </el-form-item>

        <el-form-item label="项目简介" prop="XMJJ">
          <el-input type="textarea" v-model="form.XMJJ" placeholder="项目简介" style="width:320px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="BZ">
          <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:320px;"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:100px;">
          <el-button type="primary" :loading="loadingbtn" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script >
import exxls from 'common/xlsx/tabletoexcel'
import UploadExcel from '../../../../components/Common/UploadExcel'
import {
  getHJList,
  saveHJData,
  saveExcelData,
  dropCGHJ,
  saveFileByFID
} from 'api/cggl/cgdj'
import msg from 'utils/loadmsg'
import { NewGuid } from '@/config/filter'
import { mapGetters } from 'vuex'

export default {
  name: 'tgyy',
  data() {
    return {
      tbobj: {},
      pagename: '成果获奖登记',
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      uploadbtn: false,
      uploadbtn2: false,
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      // 上传参数
      uploadData: {
        id: ''
      },
      // 导入相关
      dialogExcelVisible: false,
      dialogFormVisible: false,
      loadingtext: '导入数据中,请稍后',
      loadingbtn: false,
      loading2: false,
      selectRows: [],
      FormtableData: [],
      tableHeight: '500',
      dialogVisible: false,
      fileList: {},
      form: {
        CGID: '',
        ZSHM: '',
        HJND: '',
        FZRQ: '',
        DOCID: '',
        DOCID2: '',
        HJDJ: '',
        LRYH: '',
        LRIPDZ: '',
        SSJB: '',
        LRSJ: '',
        JZ: '',
        HJDW: '',
        SSEJDW: '',
        SJDW: '',
        TJDW: '',
        SLBH: '',
        BZ: '',
        HJXMMC: '',
        TJND: '',
        ZYWCRY: '',
        XMJJ: '',
        TYPE: 'add'
      },
      total: null,
      tableData: [],
      loading: false,
      listQuery: {
        cgmc: '',
        wcry: '',
        page: 1,
        limit: 30
      },
      rules: {
        HJXMMC: [
          { required: true, message: '请输入获奖项目名称', trigger: 'blur' }
        ],
        HJDW: [{ required: true, message: '请输入获奖单位', trigger: 'blur' }],
        ZSHM: [{ required: true, message: '请输入证书号码', trigger: 'blur' }],
        ZYWCRY: [
          { required: true, message: '请输入主要完成人员', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    exxls,
    UploadExcel
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  mounted() {
    this._GetList()
    this.tableHeight = this.rightHeight - 130
    this.tbobj = this.$refs.cghjdj
  },
  watch: {
    rightHeight(val) {
      this.tableHeight = val - 130
    }
  },
  methods: {
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },
    beforeAvatarUpload(file) {
      if (this.selectRows.length == 0) {
        msg.showwarning('请先选择相关数据行')
        return false
      }

      var len = file.name.split('.')
      const extension = file.name.split('.')[len.length - 1]
      const isExcel = extension === 'jpg' || extension === 'png'
      if (!isExcel) {
        msg.showwarning('请上传图片格式的文件')
        return false
      }

      this.uploadbtn = true
    },
    beforeAvatarUpload2(file) {
      if (this.selectRows.length == 0) {
        msg.showwarning('请先选择相关数据行')
        return false
      }

      this.uploadbtn2 = true
    },
    // 文件上传成功
    filesuccess(response, file, fileList) {
      var _this = this

      var fids = []
      for (var i = 0; i < _this.selectRows.length; i++) {
        fids.push(_this.selectRows[i].CGID)
      }
      _this.fileList = {
        tablename: 'KJGLPT_CG_HJ',
        name: fileList[0].name,
        lx: '1',
        fids: fids,
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')
        _this.uploadbtn = false

        _this._GetList()
      })
    },
    // 文件上传成功
    filesuccess2(response, file, fileList) {
      var _this = this

      var fids = []
      for (var i = 0; i < _this.selectRows.length; i++) {
        fids.push(_this.selectRows[i].CGID)
      }
      _this.fileList = {
        tablename: 'KJGLPT_CG_HJ',
        name: fileList[0].name,
        fids: fids,
        lx: '2',
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')
        _this.uploadbtn2 = false

        _this._GetList()
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
          dropCGHJ(this.selectRows).then(response => {
            if (response.data) {
              msg.showwarning(response.data)
            } else {
              // 删除成功
              msg.showsuccess('删除成功')
              // 重新查询
              _this._GetList()
            }
          })
        })
        .catch(() => {})
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
        this._GetList()
      })
    },
    // 保存归档信息
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingbtn = true
          saveHJData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            this.loadingbtn = false
            this.dialogVisible = false
            // 重新加载数据
            this._GetList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 导入excel
    exportdata() {
      this.dialogExcelVisible = true
    },
    // 获取归档信息
    _GetList() {
      this.loading = true
      getHJList(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this._GetList()
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
