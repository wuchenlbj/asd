<!-- 科协工作-成果年鉴 -->
<template>
  <div class="contation">

    <div style="margin-bottom:10px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="del">删除</el-button>
      </el-button-group>

       <el-select clearable v-model="listQuery.typeid" @change='getList' style="width: 120px;" placeholder="年鉴分类">
        <el-option v-for="(item,index) in opts_nj" :key="index" :label="item.NAME" :value="item.ID">
        </el-option>
       </el-select>
      <el-input placeholder="标题搜索" size="small" v-model="listQuery.title" style="width:200px; " class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getList" ></el-button>
      </el-input>
    </div>

    <el-table :height="tableHeight" @row-dblclick="rowdblclick"  @row-click="rowclick" highlight-current-row  v-loading="loading" :data="tableData" border style="width: 99.8%" header-row-class-name="headclass">
      <el-table-column prop="TITLE" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="FBDATE" label="发布日期" width="90">
          <template slot-scope="scope">
          <span >{{scope.row.FBDATE|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
        <!-- <el-table-column prop="SUBTITLE" label="文件号" show-overflow-tooltip width="100"></el-table-column> -->
        <el-table-column prop="SOURCE" label="来源" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="WRITER" label="作者" width="80"></el-table-column>
      <el-table-column prop="FLMC" label="分类" width="140">
        <!-- <template slot-scope="scope">
            <span v-if="scope.row.ZT==null||scope.row.ZT=='0'">所有单位</span>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <div class="pagination-container">
      <el-pagination background   @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total,prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 表单 -->
     <el-dialog  v-dialogDrag title="信息编辑"  width="900px"  top="2vh"   :visible.sync="dialogFormVisible">
      <el-form  v-loading='loadingform' :inline="true" style="width:800px;margin-left:20px;" ref="ruleForm" :model="form" label-width="90px">
        <el-form-item label="文鉴标题" prop="TITLE" >
          <el-input style="width:700px" v-model="form.TITLE"></el-input>
        </el-form-item>
        <el-form-item label="选择分类"  prop="FL" >
          <el-select  style="width:290px"  v-model="form.FL" placeholder="选择年鉴分类">
            <el-option v-for="(item,index) in opts_nj" :key="index" :label="item.NAME" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间"  prop="FBDATE" >
          <el-date-picker style="width:290px"  type="date" placeholder="发布日期" v-model="form.FBDATE"></el-date-picker>
        </el-form-item>
        <el-form-item label="来源"  prop="SOURCE" >
            <el-input   style="width:290px"  placeholder="公告来源" v-model="form.SOURCE"></el-input>
        </el-form-item>
        <div class="editor-container"  prop="NEWSCONTENT" >
          <Tinymce :height=300 ref="editor" v-model="form.NEWSCONTENT"  ></Tinymce>
        </div>
         <el-form-item>
            <el-upload  class="upload-demo"
              :action="actionurl"
              :on-error="onerror"
              :before-upload="beforeAvatarUpload"
               :headers="headersData"
              :on-success="filesuccess"
              :on-remove="handleRemove"
              :data="uploadData"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button   type="primary"  :loading="uploadbtn">选择上传</el-button>
              <div slot="tip" class="el-upload__tip">选择成果文鉴的相关资料进行上传</div>
            </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="submitForm('ruleForm')" >立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">清空新建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

 <script >
import Tinymce from '../../../components/Common/Tinymce/index'
import { getTZList, getDetail, saveOneYearBook, dropTzgg, getDocDetail, getNJFL } from 'api/xtsz/sy'
import { NewGuid } from "@/config/filter"
import { getcurDay } from 'utils/index'
import msg from 'utils/loadmsg'

import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'tzgg',
  components: { Tinymce },
  data() {
    return {
      actionurl: process.env.WDK_BASE_API + 'api/doc/SaveFileInfo',
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      tableHeight: 600, // GNM
      uploadbtn: false,
      loadingform: false,
      loading: false,
      dialogFormVisible: false,
      tableData: [],
      content: '公告内容',
      total: null,
      // 选择的表格行
      selectRow: {},
      // 上传参数
      uploadData: {
        id: ''
      },
      opts_nj: [], // 分类数据
      listQuery: {
        tbanem: 1, // 成果年鉴
        page: 1,
        limit: 20,
        typeid: '',
        title: ''
      },
      OneQuery: {
        tbanem: 'bd_msg_yearbook', // 成果年鉴
        id: ''
      },
      // 文件上传的列表
      fileList: [],
      form: {
        ID: '',
        TITLE: '',
        FBDATE: '',
        NEWSCONTENT: '',
        SOURCE: '',
        WRITER: '',
        FL: '',
        fileList: [],
        TYPE: ''
      }
    }
  },

  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 120
    }
  },
  mounted() {

    this.tableHeight = this.rightHeight - 120 // GNM
    this._getNJFL()
    this.getList()

  },
  methods: {
    // 获取年鉴分类
    _getNJFL() {
      getNJFL().then(response => {
        this.opts_nj = response.data
      });
    },
    // 提价表单
    submitForm(formName) {
      var _this = this
      this.form.fileList = _this.fileList

      if (_this.form.TITLE == '') {
        msg.showwarning('请先输入标题')
        return false
      }
      if (_this.form.NEWSCONTENT == '') {
        msg.showwarning('请录入通知内容')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingform = true
          saveOneYearBook(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.loadingform = false
            _this.dialogFormVisible = false
            _this.getList()
          })
        } else {
          console.log('error submit!!')
          _this.loadingform = false
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$nextTick(function () {
        this.$refs[formName].resetFields();
        this._resetform()
      })
    },
    _resetform() {
      var did = NewGuid()
      this.form.TYPE = 'add'
      this.form.ID = did
      this.form.FBDATE = getcurDay()
      this.uploadData.id = did
      this.fileList = []
    },
    // 分页获取数据
    getList() {
      this.loading = true
      getTZList(this.listQuery).then(response => {
        this.tableData = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 删除
    del() {
      if (!this.selectRow.ID) {
        msg.showwarning('请先选择数据行')
        return false
      }
      var _this = this
      this.$confirm("确定要删除标题为《" + this.selectRow.TITLE + "》的信息吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除数据
          msg.showloading("正在删除,请稍后...");
          dropTzgg({ id: _this.selectRow.ID, tbname: 'bd_msg_yearbook' }).then(response => {
            if (response.data) {
              msg.showwarning(response.data)
            } else {
              // 删除成功
              msg.showsuccess("删除成功");
              // 重新查询
              _this.getList()
            }

          });
        })
        .catch(() => { });
    },
    add() {

      this.dialogFormVisible = true
      this.resetForm('ruleForm')
      this._resetform()
    },
    rowclick(row, event, column) {
      this.selectRow = row
    },
    // 双击编辑
    rowdblclick(row, event) {
      this.dialogFormVisible = true
      // 查询当前数据
      this.OneQuery.id = row.ID
      this.uploadData.id = row.ID
      getDetail(this.OneQuery).then(response => {

        this.form = response.data[0]
      })
      this.form.TYPE = 'edit'
      // 查询文档库数据 TODO
      var q = { id: row.ID }
      getDocDetail(q).then(response => {
        this.fileList = response.data
      })
    },
    // 上传限制
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 移除上传的文件
    handleRemove(file, fileList) {
      var _this = this
      _this.fileList = _.remove(_this.fileList, function (data) {
        return data.name != fileList.name;
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },
    beforeAvatarUpload(file) {
      this.uploadbtn = true
    },
    // 文件上传成功
    filesuccess(response, file, fileList) {
      var _this = this
      this.uploadbtn = false
      for (var i = 0; i < fileList.length; i++) {
        _this.fileList.push({ name: fileList[i].name, id: response.docid, path: response.docpath, wjsize: fileList[i].size })
      }
    },
    // 每页条数size
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    // 当前页currentPage改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// @import "src/styles/mixin.scss";
.editor-container {
  min-height: 300px;
  margin: 0 0 30px;
  .editor-upload-btn-container {
    text-align: right;
    margin-right: 10px;
    .editor-upload-btn {
      display: inline-block;
    }
  }
}
.contation {
  margin: 10px;
}
</style>
