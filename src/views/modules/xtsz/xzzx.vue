<!-- 科协工作-下载中心 -->
<template>
  <div class="contation">

    <div style="margin-bottom:10px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="del">删除</el-button>
      </el-button-group>
      <el-input placeholder="标题搜索" size="small" v-model="listQuery.title" style="width:200px; margin-left:50px;" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getList" ></el-button>
      </el-input>
    </div>

    <el-table :height="tableHeight" @row-dblclick="rowdblclick"  @row-click="rowclick" highlight-current-row  v-loading="loading" :data="tableData" border style="width: 99.8%" header-row-class-name="headclass">
      <el-table-column prop="TITLE" label="标题" min-width="120"></el-table-column>
      <el-table-column prop="SJ" label="发布日期" width="90">
         <template slot-scope="scope">
          <span >{{scope.row.SJ|parseTime3('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <div class="pagination-container">
      <el-pagination background   @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-size="listQuery.limit" layout="total,prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 表单 -->
     <el-dialog  v-dialogDrag title="信息编辑"  width="900px"  top="2vh"  append-to-body :visible.sync="dialogFormVisible">
      <el-form  v-loading='loadingform'  style="width:800px;margin-left:20px;" ref="ruleForm" :model="form" label-width="90px">
        <el-form-item label="文件标题" prop="TITLE">
          <el-input style="width:700px" v-model="form.TITLE"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="SJ">
          <el-date-picker    type="date" placeholder="发布日期" v-model="form.SJ"></el-date-picker>
        </el-form-item>
         <el-form-item label="上传附件">
            <el-upload  class="upload-demo"
              :action="actionurl"
              :on-error="onerror"
              :before-upload="beforeAvatarUpload"
              :headers="headersData"
              :on-success="filesuccess"
              :on-remove="handleRemove"
              :data="uploadData"
              :before-remove="beforeRemove"
              :multiple ="false"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary"  :loading="uploadbtn">选择上传</el-button>
              <div slot="tip" class="el-upload__tip">选择相关的标题文件进行上传</div>
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
import { getTZList, getDetail, saveOneDownLoad, dropTzgg, getDocDetail } from 'api/xtsz/sy'
import { NewGuid } from "@/config/filter"
import { getcurDay } from 'utils/index'
import msg from 'utils/loadmsg'

import { mapGetters } from 'vuex'; // GNM
export default {
  name: 'xzzx',
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
      listQuery: {
        tbanem: 2, // 下载中心
        page: 1,
        limit: 20,
        title: ''
      },
      OneQuery: {
        tbanem: 'bd_msg_download', // 通知公告
        id: ''
      },
      // 文件上传的列表
      fileList: [],
      form: {
        ID: '',
        TITLE: '',
        SJ: '',
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
    this.getList()
  },
  methods: {
    // 提价表单
    submitForm(formName) {
      var _this = this
      this.form.fileList = _this.fileList

      if (_this.form.TITLE == '') {
        msg.showwarning('请先输入标题')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingform = true
          saveOneDownLoad(this.form).then(response => {
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
      var _this = this
      this.$nextTick(function () {
        _this.$refs[formName].resetFields()
        _this._resetformVal()
      })
    },
    _resetformVal() {
      var did = NewGuid()
      this.form.TYPE = 'add'
      this.form.ID = did
      this.form.SJ = getcurDay()
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
          dropTzgg({ id: _this.selectRow.ID, tbname: 'bd_msg_download' }).then(response => {
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
      this._resetformVal()
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
        if (response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            // response.data
            var id = response.data[i].ID
            var name = response.data[i].NAME
            var path = response.data[i].PATH
            var wjsize = response.data[i].WJSIZE
            this.fileList.push({ name: name, id: id, path: path, wjsize: wjsize })
          }
        }

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
