<!-- 成果管理-专利 -->
<template>
  <div class="zlxx">
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click="add">添加专利基本信息</el-button>
    </el-button-group>

    <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetTGXX' placeholder="专利名称" v-model="listQuery.mc">
    </el-input>
    <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetTGXX' placeholder="专利权人" v-model="listQuery.wcry">
    </el-input>
    <h4>1.专利基本信息</h4>
    <!-- 专利基本信息 -->
    <el-table border @row-dblclick="rowdblclick" @select='selectRow' @select-all='selectallRow' @cell-click='cellclick' style="width: 100%;margin-top:10px;" height="300" :data="tableData" highlight-current-row v-loading="loading" header-row-class-name="headclass">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="专利名称" prop="ZLMC" min-width="100"></el-table-column>
      <el-table-column label="专利类型" prop="ZLLXMC" min-width="100"></el-table-column>
      <el-table-column label="专利权人" prop="ZLQR" width="100"></el-table-column>
      <el-table-column label="申请单位" show-overflow-tooltip prop="SQDWMC" width="100"></el-table-column>
      <el-table-column label="发明人" prop="FMR" width="100"></el-table-column>
      <el-table-column label="专利申请日期" min-width="110">
        <template slot-scope="scope">
          <span>{{scope.row.ZLSQRQ|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权公告日" min-width="110">
        <template slot-scope="scope">
          <span>{{scope.row.ZLSQR|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专利授权年度" min-width="110">
        <template slot-scope="scope">
          <span>{{scope.row.ZLSQR|parseTime3('yyyy')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专利(申请)号" prop="ZLSQH" min-width="100"></el-table-column>
      <el-table-column label="是否有效" prop="IFYX" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.IFYX|ifval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否实施" prop="IFSS" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.IFSS|ifval}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否转让" prop="IFZR" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.IFZR|ifval}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>
    <!-- 第二部分 -->
    <h4>2.上传扫描件(1对1)</h4>
    <el-alert v-show="!selectRows" title="请先选择专利信息然后进行扫描件的上传" type="warning">
    </el-alert>
    <el-row style="margin-top:10px;">
      受理证书扫描件:
      <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME1+'&filepath='+smjpic.FILEPATH1">{{smjpic.FILENAME1}}</a>
      <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload1" :headers="headersData" :on-success="filesuccess1" :data="uploadData" :multiple="false">
        <el-button type="warning" :loading="uploadbtn1">上传</el-button>
      </el-upload>
    </el-row>
    <el-row style="margin-top:10px;">
      授权证书扫描件:
      <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME2+'&filepath='+smjpic.FILEPATH2">{{smjpic.FILENAME2}}</a>
      <el-upload class="upload-demo" :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload2" :headers="headersData" :on-success="filesuccess2" :data="uploadData" :multiple="false">
        <el-button type="warning" :loading="uploadbtn2">上传</el-button>
      </el-upload>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="24">
        专利年费扫描件
        <a style="color:blue;" v-if="smjpic" :href="actiondownurl+'filename='+smjpic.FILENAME3+'&filepath='+smjpic.FILEPATH3">{{smjpic.FILENAME3}}</a>
        <el-upload class="upload-demo" :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload3" :headers="headersData" :on-success="filesuccess3" :data="uploadData" :multiple="false">
          <el-button type="warning" :loading="uploadbtn3">上传</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <!-- 第三部分 -->
    <el-alert v-show="checkRows.length==0" title="3.请先勾选专利信息然后进行专利的上传" type="warning"></el-alert>
    <formjl v-show="checkRows&&checkRows.length>0" :selectRows="checkRows" :smjpic="smjpic"></formjl>

    <!-- 第四五部分 专利权人变更 专利维持 -->
    <el-alert v-show="checkRows.length==0" title="4.请先选择专利信息然后进行专利权人变更" type="warning"></el-alert>
    <formzlq v-show="checkRows&&checkRows.length>0" :selectRows="checkRows" :smjpic="smjpic"></formzlq>
    <!-- 第六部分 专利应用评价 -->
    <el-alert v-show="checkRows.length==0" title="5.请先选择专利信息然后进行专利应用评价" type="warning"></el-alert>
    <formpj v-show="checkRows&&checkRows.length>0" :selectRows="checkRows" ></formpj>
    <!-- 表单 -->
    <el-dialog v-dialogDrag title="信息编辑" width="900px" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="专利名称" prop="ZLMC">
          <el-input v-model="form.ZLMC" style="width:150px;" placeholder="专利名称"></el-input>
        </el-form-item>
        <el-form-item label="专利类型" prop="ZLLX">
          <el-select v-model="form.ZLLX" placeholder="请选择" style="width:150px;">
            <el-option v-for="(item,index) in opts_zllx" :key="index" :label="item.NAME" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专利权人" prop="ZLQR">
          <el-input v-model="form.ZLQR" style="width:150px;" placeholder="专利权人"></el-input>
        </el-form-item>
        <el-form-item label="申请单位" prop="SQDW">
          <tree-select clearable :treeData="treeDataFZDW" style="width:150px;" :treeProps="treeProps" v-model="form.SQDW" :multiple="false" placeholder="申请单位" @setSelectedId="setSelectedIdSQDW">
          </tree-select>
        </el-form-item>
        <el-form-item label="发明人" prop="FMR">
          <el-input v-model="form.FMR" style="width:150px;" placeholder="发明人"></el-input>
        </el-form-item>

        <el-form-item label="专利申请日期" prop="ZLSQRQ">
          <el-date-picker v-model="form.ZLSQRQ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="专利申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专利授权日期" prop="ZLSQR">
          <el-date-picker v-model="form.ZLSQR" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="专利授权日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专利申请号" prop="ZLSQH">
          <el-input v-model="form.ZLSQH" style="width:150px;" placeholder="专利申请号"></el-input>
        </el-form-item>
        <el-form-item label="专业代理" prop="ZLDLJG">
          <el-input v-model="form.ZLDLJG" style="width:150px;" placeholder="代理机构名称"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="IFYX">
          <el-radio-group v-model="form.IFYX" style="width:150px;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否实施" prop="IFSS">
          <el-radio-group v-model="form.IFSS" style="width:150px;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否转让" prop="IFZR">
          <el-radio-group v-model="form.IFZR" style="width:150px;">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="终止日期" prop="ZZRQ">
          <el-date-picker v-model="form.ZZRQ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:150px;" placeholder="终止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="法律状态" prop="FLZT">
          <el-radio-group v-model="form.FLZT" style="width:450px;">
            <el-radio label="1">有效</el-radio>
            <el-radio label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left:110px;">
          <el-button type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
import { NewGuid } from '@/config/filter'
import { GetUnitTree } from 'api/common/xm.js'
import treeSelect from '../../../../components/Common/treeSelect/tree.vue'
import msg from 'utils/loadmsg'
import { getZLData, saveZLData, getFLZL, getOneZLXXPIC } from 'api/cggl/zscq.js'
import { saveFileByFID } from 'api/cggl/cgdj'

import formjl from './formjl'
import formzlq from './formzlq'
import formpj from './formpj'
export default {
  name: 'rjzzq',
  components: {
    treeSelect, formjl, formzlq, formpj
  },
  data() {
    return {
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      uploadbtn1: false,
      uploadbtn2: false,
      uploadbtn3: false,
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      // 上传参数
      uploadData: {
        id: ''
      },
      selectRows: null,
      checkRows: [],
      opts_zllx: [], // 专利类型
      opts_zt: [{ id: '0', name: '失效' }, { id: '1', name: '有效' }],
      tableData: [],
      treeDataFZDW: [], // 申请单位
      dialogFormVisible: false,
      loading: false,
      form: {
        ZLID: '',
        ZLMC: '',
        ZLLX: '',
        ZLQR: '',
        SQDW: '',
        FMR: '',
        ZLSQRQ: '',
        ZLSQR: '',
        ZLSQH: '',
        IFYX: '1',
        IFSS: '0',
        IFZR: '0',
        ZLDLJG: '',
        FLZT: '1',
        ZZRQ: '',
        ZLJJ: '',
        TYPE: 'add'
      },
      rules: {
        ZLMC: [{ required: true, message: '请输入专利名称', trigger: 'blur' }],
        ZLLX: [{ required: true, message: '请选择专利类型', trigger: 'change' }],
        SQDW: [{ required: true, message: '请选择申请单位', trigger: 'change' }],
        ZLSQRQ: [{ type: 'string', required: true, message: '请选择专利申请日期', trigger: 'change' }],
        ZLSQR: [{ type: 'string', required: true, message: '请选择专利授权日期', trigger: 'change' }],
        ZLSQH: [{ required: true, message: '请输入专利申请号', trigger: 'blur' }]
      },
      total: null,
      listQuery: {
        mc: '',
        wcry: '',
        page: 1,
        limit: 30
      },
      smjpic: null,
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      }
    }
  },
  methods: {
    // check行事件
    selectRow(selection, row) {
      this.checkRows = selection
    },
    // check所有行事件
    selectallRow(selection) {
      this.checkRows = selection
    },
    cellclick(row, column, cell, event) {
      if (column.type != 'selection') {
        this.checkRows = [row]
        // 查询相关信息
        this._getOneZLXX(row)
      }
    },
    _getOneZLXX(row) {
      // 获取扫描件
      getOneZLXXPIC({ id: row.ZLID }).then(response => {
        this.smjpic = response.data[0]
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },
    // 受理证书扫描件
    beforeAvatarUpload1(file,) {
      return this.beforeAvatarUpload(file, 1)
    },
    beforeAvatarUpload2(file) {
      return this.beforeAvatarUpload(file, 2)
    }, // 授权证书扫描件
    beforeAvatarUpload3(file) {
      return this.beforeAvatarUpload(file, 3)
    }, // 专利年费扫描件
    beforeAvatarUpload(file, index) {
      if (this.selectRows == null) {
        msg.showwarning('请先选择相关数据行')
        return false
      }
      var len = file.name.split('.')
      const extension = file.name.split('.')[len.length - 1]
      const isExcel = (extension === 'png' || extension === 'jpg')
      if (!isExcel) {
        msg.showwarning('请上传图片格式的文件')
        return false
      }
      if (index == 1) {
        this.uploadbtn1 = true
      } else if (index == 2) {
        this.uploadbtn2 = true
      } else if (index == 3) {
        this.uploadbtn3 = true
      }
      return true
    },
    filesuccess1(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'PICSLZS')
    },
    filesuccess2(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'PICSQZS')
    },
    filesuccess3(response, file, fileList) {
      this.filesuccess(response, file, fileList, 'PICZLNF')
    },
    // 文件上传成功
    filesuccess(response, file, fileList, lx) {
      var _this = this
      // 保存文档库以及业务库
      var fids = []
      fids.push(_this.selectRows.ZLID)

      _this.fileList = {
        tablename: 'kjglpt_cg_zl',
        name: fileList[0].name,
        fids: fids,
        lx: lx,
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')
        var ii = lx.substring(0, lx.length - 1)
        if (ii == 'PICSLZS') _this.uploadbtn1 = false
        else if (ii == 'PICSQZS') _this.uploadbtn2 = false
        else if (ii == 'PICZLNF') _this.uploadbtn3 = false
      })
    },
    // 添加
    add() {
      this.dialogFormVisible = true
      this.resetForm('ruleForm')
      this.$nextTick(function() {
        this.form.TYPE = 'add'
        this.form.ZLID = NewGuid()
      })
    },
    // 双击编辑
    rowdblclick(row, event) {
      this.dialogFormVisible = true
      this.$nextTick(function() {
        this.form = row
        this.form.TYPE = 'edit'
      })
    },
    // 申请单位赋值
    setSelectedIdSQDW(val) {
      this.form.SQDW = val
    },
    resetForm(formName) {
      this.$nextTick(function() {
        this.$refs[formName].resetFields()
      })
    },
    // 获取项目所属的软件著作权
    _GetTGXX() {
      this.loading = true
      getZLData(this.listQuery).then(response => {
        this.loading = false
        this.tableData = response.data.rows
        this.total = response.data.total
      })
    },
    // 保存项目立项
    submitForm(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveZLData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.$refs[formName].resetFields()
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 分页选中
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getZLData()
    },
    // 专利类型
    _getFLZL() {
      getFLZL().then(response => {
        this.opts_zllx = response.data
      })
    },
    // 申请单位
    getTreeData() {
      GetUnitTree({ type: 'children', ny: '' }).then(response => {
        this.treeDataFZDW = response.data
      })
    }
  },
  mounted() {
    this._getFLZL()
    this.getTreeData()
    this._GetTGXX()
  }
}
</script>
<style scoped>
.zlxx {
  overflow-y: auto;
  height: 100%;
}
label {
  font-weight: 500 !important;
}
.upload-demo {
  /* float: left; */
  /* margin-left: 20px; */
  margin-bottom: 10px;
}
</style>