<!-- 成果管理-信息采集 -->
<template>
  <div class="cggd">
    <div class="filter-container">
      <el-button-group>
        <el-button size="mini" class="filter-item" type="primary" @click="exportdata">导入Excel</el-button>
        <el-button size="mini" class="filter-item" type="primary" @click="newGD">添加归档</el-button>
        <el-button size="mini" class="filter-item" type="primary" @click="newZL">全部成果资料上传</el-button>
      </el-button-group>
      <el-button size="mini" class="filter-item" type="warning" @click="newPJ">添加成果评价</el-button>

      <el-input size="mini" class="filter-item" style="width: 120px;" @change='_GetGDXX' placeholder="课题编号" v-model="listQuery.ktbh">
      </el-input>

      <exxls :tb-obj="tbobj" :file-name="pagename" :header-num=2 :tb-title="pagename" :itemStyle="'{display: inline-block;margin-bottom: 10px;vertical-align: middle;}'"></exxls>
    </div>
    <!-- 表格操作 -->
    <el-table ref="cggd" border style="width: 100%;margin-top:5px;" @cell-click='cellclick' :data="tableData" @row-dblclick="rowdblclick" :height="tableHeight" v-loading="loading" highlight-current-row header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="XMBH" label="项目编号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="XMMC" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTBH" label="课题编号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="KTMC" label="课题名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="承担单位" width="120" prop="FZDWDMMC"></el-table-column>
      <el-table-column label="协作单位" width="120" prop="XZDW"></el-table-column>

      <el-table-column label="最终通过验收时间" prop="YSSJ" width="80"></el-table-column>
      <el-table-column label="成果归档时间" width="110">
        <template slot-scope="scope">
          <span class="span-title" style="color:red;">{{scope.row.GDSJ|getTimeDays(scope.row.GDSJ
            <365? "1": "2")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否评价" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="scope.row.ZYFL" style="color:green;">(已评价){{scope.row.ZYFLMC}}</span>
        </template>
      </el-table-column>

      <el-table-column label="全部成果资料上传" width="80">
        <template slot-scope="scope">
          <span class="span-title">查看</span>
        </template>
      </el-table-column>

      <el-table-column prop="FILEPATH" label="各厂成果交接单上传" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <a style="color:blue;" v-if="scope.row.FILEPATH" :href="actiondownurl+'filename='+scope.row.FILENAME+'&filepath='+scope.row.FILEPATH">{{scope.row.FILENAME}}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="提交成果资料数量">
        <el-table-column label="报告(册)" prop="NUMBG" width="50"> </el-table-column>
        <el-table-column label="附图册(册)" prop="NUMFT" width="70"></el-table-column>
        <el-table-column label="附表册(册)" prop="NUMFB" width="70"></el-table-column>
        <el-table-column label="光盘(张)" prop="NUMGP" width="50"></el-table-column>
        <el-table-column label="分析化验资料资料" prop="NUMFXHY" width="80"></el-table-column>
        <el-table-column label="项目过程管理材料汇编" prop="NUMHB" width="90"></el-table-column>
        <el-table-column label="其他资料" prop="NUMQT" width="50"></el-table-column>
      </el-table-column>

      <el-table-column label="档案馆归档">
        <el-table-column label="提交人" show-overflow-tooltip prop="TJR" width="70"></el-table-column>
        <el-table-column label="提交时间" prop="TJSJ" width="85">
          <template slot-scope="scope">
            <span class="span-title">{{scope.row.TJSJ|parseTime3('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="LXDH" width="95" show-overflow-tooltip></el-table-column>
        <el-table-column label="归档时间" prop="GDSJ" width="85">
          <template slot-scope="scope">
            <span class="span-title">{{scope.row.GDSJ|parseTime3('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="档号" prop="DH" width="100"></el-table-column>
      </el-table-column>

      <el-table-column prop="BZ" label="备注" min-width="100"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total, prev, pager, next" :total="total">
    </el-pagination>

    <!-- 导入Dialog -->
    <el-dialog  v-dialogDrag title="导入Excel" width="1300px" top="2vh" max-height="600" :close-on-click-modal="false" :visible.sync="dialogExcelVisible">
      <div v-loading="loading2" :element-loading-text="loadingtext">
        <UploadExcel :hideYear="false" tableName="KJGLPT_CG_GD" dataType="0" @loadingexcel="loadingexcel" @excelData="getExcelData"></UploadExcel>
        <el-button style="margin-left:2px;" type="primary" @click="submitExcelForm()">保存</el-button>

        <el-table :data="FormtableData" height="400" border style="width: 100%;margin-top:5px;" header-row-class-name="headclass">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column fixed label="项目编号" width="110" show-overflow-tooltip prop="XMBH"> </el-table-column>
          <el-table-column fixed label="项目名称" width="100" show-overflow-tooltip prop="XMMC"> </el-table-column>
          <el-table-column fixed label="课题编号" width="120" show-overflow-tooltip prop="KTBH"></el-table-column>
          <el-table-column fixed label="课题名称" width="120" show-overflow-tooltip prop="KTMC"></el-table-column>
          <el-table-column label="承担单位" width="120" prop="FZDWDMMC"></el-table-column>

          <el-table-column label="最终通过验收时间" prop="YSSJ" width="80"></el-table-column>

          <el-table-column label="提交成果资料数量">
            <el-table-column label="报告(册)" prop="NUMBG" width="50"> </el-table-column>
            <el-table-column label="附图册(册)" prop="NUMFT" width="70"></el-table-column>
            <el-table-column label="附表册(册)" prop="NUMFB" width="70"></el-table-column>
            <el-table-column label="光盘(张)" prop="NUMGP" width="50"></el-table-column>
            <el-table-column label="分析化验资料资料" prop="NUMFXHY" width="80"></el-table-column>
            <el-table-column label="项目过程管理材料汇编" prop="NUMHB" width="90"></el-table-column>
            <el-table-column label="其他资料" prop="NUMQT" width="50"></el-table-column>
          </el-table-column>

          <el-table-column label="档案馆归档">
            <el-table-column label="提交人" prop="TJR" width="70"></el-table-column>
            <el-table-column label="提交时间" prop="TJSJ" width="80"></el-table-column>
            <el-table-column label="联系电话" prop="LXDH" width="90"></el-table-column>
            <el-table-column label="归档时间" prop="GDSJ" width="80"></el-table-column>
            <el-table-column label="档号" prop="DH" width="100"></el-table-column>
          </el-table-column>

          <el-table-column prop="BZ" label="备注" min-width="100"></el-table-column>
        </el-table>
      </div>

    </el-dialog>

    <!--编辑Dialogxmsb-->
    <el-dialog v-dialogDrag title="成果归档维护" width="1300px" append-to-body :visible.sync="dialogVisible" :close-on-click-modal="false">
      <XmTree v-show="xmtreeShow" class="top-container" :tableheight="120"></XmTree>
      <el-alert v-show="!xmxxRow&&xmtreeShow" title="请先选择项目课题" style="margin-bottom:10px;" show-icon type="warning"></el-alert>

      <el-form v-show="xmxxRow||!xmtreeShow" :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="90px" style="width:1200px;">
        <h4>档案馆归档</h4>
        <el-form-item label="档号" prop="DH">
          <el-input v-model="form.DH" style="width:130px;" placeholder="档号"></el-input>
        </el-form-item>
        <el-form-item label="归档时间" prop="GDSJ">
          <el-date-picker v-model="form.GDSJ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:130px;" placeholder="归档时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提交人" prop="TJR">
          <el-input v-model="form.TJR" style="width:130px;" placeholder="提交人"></el-input>
        </el-form-item>
        <el-form-item label="提交时间" prop="TJSJ">
          <el-date-picker v-model="form.TJSJ" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:130px;" placeholder="提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话" prop="LXDH">
          <el-input v-model="form.LXDH" style="width:130px;" placeholder="联系电话"></el-input>
        </el-form-item>
        <h4>成果资料提交</h4>
        <el-form-item label="报告(册)" prop="NUMBG">
          <el-input v-model="form.NUMBG" style="width:130px;" placeholder="册"></el-input>
        </el-form-item>
        <el-form-item label="附图册(册)" prop="NUMFT">
          <el-input v-model="form.NUMFT" style="width:130px;" placeholder="册"></el-input>
        </el-form-item>
        <el-form-item label="附表册(册)" prop="NUMFB">
          <el-input v-model="form.NUMFB" style="width:130px;" placeholder="册"></el-input>
        </el-form-item>
        <el-form-item label="光盘(张)" prop="NUMGP">
          <el-input v-model="form.NUMGP" style="width:130px;" placeholder="张"></el-input>
        </el-form-item>
        <el-form-item label="分析化验" prop="NUMFXHY">
          <el-input v-model="form.NUMFXHY" style="width:130px;" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="其他资料" prop="NUMQT">
          <el-input v-model="form.NUMQT" style="width:130px;" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="项目过程管理材料汇编" prop="NUMHB" label-width="170px">
          <el-input v-model="form.NUMHB" style="width:60px;" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="BZ" label-width="80px">
          <el-input v-model="form.BZ" placeholder="备注" style="width:370px;"></el-input>
        </el-form-item>

        <h4>各厂成果交接单上传</h4>
        <el-form-item prop="BZ" label-width="80px">
          <a style="color:blue;" v-if="form.FILENAME" :href="actiondownurl+'filename='+smjpic.FILENAME+'&filepath='+smjpic.FILEPATH">{{smjpic.FILENAME}}</a>
          <el-upload :action="actionurl" :on-error="onerror" :before-upload="beforeAvatarUpload" :headers="headersData" :on-success="filesuccess" :data="uploadData" :multiple="false">
            <el-button type="warning" :loading="uploadbtn">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item style="margin-left:100px;width:100%;">
          <el-button type="primary" :loading="loadingbtn" @click="submitForm('ruleForm')">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--编辑Dialogxmsb-->
    <el-dialog v-dialogDrag title="成果评价维护" width="900px" append-to-body :visible.sync="dialogVisible2" :close-on-click-modal="false">
      <el-radio-group v-model="zlfl" size="mini" @change="changezyfl" style="margin-bottom:30px;" v-show="currentFormType=='add'">
        <el-radio-button v-for="(item,index) in opts_zyfl" :label="item.ID" :key="item.ID">{{item.NAME}}</el-radio-button>
      </el-radio-group>
      <component :is="currentForm" :currentFormName="currentForm" :selectRows="selectRows" @refreshList="refreshList"></component>

    </el-dialog>

    <!--资料上传Dialog-->
    <el-dialog v-dialogDrag title="全部成果资料上传" width="900px" append-to-body :visible.sync="dialogVisible3" :close-on-click-modal="false">
      <AllFile :gdrow="selectRows"></AllFile>
    </el-dialog>
  </div>
</template>

<script >
import { mapGetters } from 'vuex';
import UploadExcel from '../../../../components/Common/UploadExcel'
import AllFile from './fileupload'
import { getGDXXList, saveGDData, saveExcelData, getZYFL } from 'api/cggl/cggd'
import { XmTree } from 'common';
import msg from 'utils/loadmsg'
import { NewGuid } from '@/config/filter';
import { saveFileByFID } from 'api/cggl/cgdj'
// 组件
import formktdz from '../cgpj/formktdz'
import formkffa from '../cgpj/formkffa'
import formtzfa from '../cgpj/formtzfa'
import formycms from '../cgpj/formycms'
import formyjyy from '../cgpj/formyjyy'
import exxls from 'common/xlsx/tabletoexcel'
export default {
  name: 'cggj',
  components: {
    UploadExcel, XmTree, formktdz, formycms, formkffa, formtzfa, formyjyy, AllFile, exxls
  },
  data () {
    const validDF = (rule, value, callback) => {

      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确数值'))
      } else {
        callback()
      }
    }
    return {
      tbobj: {},
      pagename: '成果归档',
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      uploadData: {
        id: ''
      },
      uploadbtn: false,
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      actiondownurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      currentForm: '',
      currentFormType: '',
      // 导入相关
      dialogExcelVisible: false,
      dialogFormVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      loadingtext: '导入数据中,请稍后',
      loadingbtn: false,
      loading2: false,
      FormtableData: [],
      tableHeight: '500',
      xmtreeShow: true,
      dialogVisible: false,
      selectRows: null,
      form: {
        KTBH: '',
        ID: '',
        DH: '',
        GDSJ: '',
        TJR: '',
        TJSJ: '',
        LXDH: '',
        NUMBG: '',
        NUMFT: '',
        NUMFB: '',
        NUMGP: '',
        NUMFXHY: '',
        NUMQT: '',
        NUMHB: '',
        BZ: '',
        TYPE: 'add'
      },
      total: null,
      tableData: [],
      opts_zyfl: [], // 专业分类
      zlfl: '',
      loading: false,
      listQuery: {
        ktbh: '',
        page: 1,
        limit: 30
      },
      rules: {
        DH: [{ required: true, message: '请输入档号', trigger: 'blur' }],
        GDSJ: [{ type: 'string', required: true, message: '请选择归档时间', trigger: 'change' }],
        NUMBG: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMFT: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMFB: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMGP: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMFXHY: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMHB: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }],
        NUMQT: [{ type: 'int', required: true, trigger: 'blur', validator: validDF }]
      }
    }
  },
  computed: {
    ...mapGetters(['xmxxRow','rightHeight'])
  },
  watch: {
    xmxxRow: function (row) {
      this.form.KTBH = row.KTBH
    },

    rightHeight (val) {
      this.tableHeight = val - 90
    }
  },
  mounted () {
    this.tableHeight = this.rightHeight - 90
    this._GetGDXX()
    this._getZyfl()
    this.tbobj = this.$refs.cggd
  },
  methods: {
    newZL () {
      if (this.selectRows == null) {
        msg.showwarning('请先选择归档信息')
        return false
      }

      this.dialogVisible3 = true
    },
    onerror (err, file, fileList) {
      msg.showwarning(err)
    },
    beforeAvatarUpload (file) {
      if (this.selectRows == null) {
        msg.showwarning('请先选择相关数据行')
        return false
      }

      this.uploadbtn = true
    },
    // 文件上传成功
    filesuccess (response, file, fileList) {
      var _this = this
      // 保存文档库以及业务库
      var fids = []
      fids.push(_this.selectRows.ID)

      _this.fileList = {
        tablename: 'kjglpt_cg_gd',
        name: fileList[0].name,
        fids: fids,
        lx: '',
        id: response.docid,
        path: response.docpath,
        wjsize: fileList[0].size
      }

      saveFileByFID(this.fileList).then(response => {
        msg.showsuccess('上传成功')

        _this.uploadbtn = false
      })
    },
    // 打开归档窗口
    newGD () {
      this.dialogVisible = true
      this.$nextTick(function () {
        this.$refs['ruleForm'].resetFields()
        this.xmtreeShow = true
        this.form.ID = NewGuid()
        this.form.TYPE = 'add'
      })
    },

    // 打开评价窗口
    newPJ () {
      if (this.selectRows == null) {
        msg.showwarning('请先选择归档信息')
        return false
      }
      //获取归档时间
      var gdsj = this.selectRows.GDSJ
      var data1 = new Date(gdsj).getTime()
      var date2 = new Date()
      var date3 = date2.getTime() - data1
      var days = Math.floor(date3 / (24 * 3600 * 1000))
      if (days < 365 && !this.selectRows.ZYFL) {
        this.$confirm("归档期限未到1年，是否现在进行评价上报?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 专业分类
            var zyfl = this.selectRows.ZYFL

            if (zyfl == null) {
              this.zlfl = 'formktdz'
              this.currentForm = 'formktdz'
              this.currentFormType = 'add'

            } else { // 编辑表单
              this.zlfl = zyfl
              this.currentForm = zyfl
              this.currentFormType = 'edit'
            }

            this.dialogVisible2 = true

          })
          .catch(() => { });
      } else {
        var zyfl = this.selectRows.ZYFL

        if (zyfl == null) {
          this.zlfl = 'formktdz'
          this.currentForm = 'formktdz'
          this.currentFormType = 'add'

        } else { // 编辑表单
          this.zlfl = zyfl
          this.currentForm = zyfl
          this.currentFormType = 'edit'
        }

        this.dialogVisible2 = true
      }
    },
    changezyfl (val) {
      this.currentForm = val
    },
    cellclick (row, column, cell, event) {
      if (column.type != 'selection') {
        this.selectRows = row
      }
    },
    rowdblclick (row, event) {

      this.dialogVisible = true
      this.$nextTick(function () {

        this.xmtreeShow = false
        this.form = row
        this.form.KTBH = row.KTBH
        this.form.TYPE = 'edit'
      })
    },
    // 保存导入的excel
    submitExcelForm () {
      if (this.FormtableData.length == 0) {
        msg.showwarning('请先导入数据,再进行保存')
        return false
      }
      const diff = validData(this.FormtableData)
      if (diff.length > 0) {
        msg.showwarning('课题编号[' + diff + ']存在重复请先处理再导入')
        return false
      }

      this.loading2 = true
      this.loadingtext = '保存数据中,请稍后'
      saveExcelData(this.FormtableData).then(response => {
        this.dialogExcelVisible = false
        // 查询当前年度的立项数据
        this.getXMLXData()
      })
    },
    // 保存归档信息
    submitForm (formName) {

      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingbtn = true
          saveGDData(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            this.loadingbtn = false
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 导入excel
    exportdata () {
      this.dialogExcelVisible = true
    },
    refreshList () {
      this.dialogVisible2 = false
      this._GetGDXX()
    },
    // 获取归档信息
    _GetGDXX () {
      this.loading = true
      getGDXXList(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 专业分类附录
    _getZyfl () {
      getZYFL().then(response => {
        this.opts_zyfl = response.data
      })
    },
    // 分页选中
    handleCurrentChange (val) {
      this.listQuery.page = val
      this._GetGDXX()
    },
    loadingexcel (res) {
      this.loading2 = res
      this.loadingtext = '导入数据中,请稍后'
    },
    getExcelData (data) {
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
</style>
