<!--系统设置-网站链接-->
<template>
  <div >
    <el-row>
      <el-col :span="15">
        <el-table :height="tableHeight" @row-click="rowclick"   v-loading="loading" :data="tableData" border header-row-class-name="headclass">
          <el-table-column prop="XH" label="序号" width="50"></el-table-column>
          <el-table-column prop="NAME" label="网站名称" min-width="110"></el-table-column>
          <el-table-column prop="URL" label="网站链接" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column prop="IMGURL" label="图片预览" width="180">
            <template slot-scope="scope">
              <img :src="weburl+scope.row.IMGURL" width="142" height="40" alt="">
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
         <el-form v-loading='loadingform' :model="form" ref="ruleForm" :rules="rules" :inline="true" label-width="100px" >

          <el-form-item label="序号" prop="XH">
            <el-input  v-model="form.XH"  placeholder="序号"></el-input>
          </el-form-item>
          <el-form-item label="链接名称" prop="NAME">
            <el-input v-model="form.NAME"     placeholder="链接名称" ></el-input>
          </el-form-item>
          <el-form-item label="链接网址" prop="URL">
            <el-input v-model="form.URL"    placeholder="链接网址"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="IMGURL">
            <el-upload   class="avatar-uploader"  :before-upload="beforeAvatarUpload"  :data="uploadData" :on-error="onerror"  :action="actionurl" :show-file-list=false
              :on-progress="fileprogress" :on-success="filesuccess"      >
              <img v-if="form.IMGURL" :src="weburl+form.IMGURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <span>{{ladingExportMsg}}</span>
            </el-upload>
          </el-form-item>
          <el-form-item   style="margin-left:100px;margin-top:5px;">
            <el-button type="primary"  @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">清空新加</el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import md5 from 'js-md5'
import msg from 'utils/loadmsg'
import { NewGuid } from "@/config/filter"
import { getLinks, saveLink } from 'api/xtsz/sy'
import { mapGetters } from 'vuex' // GNM
export default {
  name: "wzlj",
  components: {},
  data() {
    return {
      loadingform: false,
      ladingExportMsg: '',
      weburl: process.env.BASE_API + "images/",
      actionurl: process.env.BASE_API + 'api/SysConfig/UploadLinks',
      tableData: [],
      tableHeight: 600, // GNM
      uploadData: {
        md5: ''
      },
      loading: false,
      form: {
        ID: '',
        XH: '',
        NAME: '',
        URL: '',
        IMGURL: '',
        TYPE: ''
      },
      rules: {}
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight(val) {
      this.tableHeight = val - 120
    }
  },
  mounted() {
    this.tableHeight = this.rightHeight - 120 // GNM
    this._getLinks()
  },
  methods: {
    submitForm(formName) {
      var _this = this

      if (_this.form.URL == '') {
        msg.showwarning('请先输入网站链接')
        return false
      }
      if (_this.form.IMGURL == '') {
        msg.showwarning('请先上传链接图片')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loadingform = true
          saveLink(this.form).then(response => {
            msg.showsuccess('保存数据成功')
            _this.loadingform = false
            _this._getLinks()
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
        this.form.ID = NewGuid()
        this.form.TYPE = 'add'
      })
    },
    // 获取数据
    _getLinks() {
      getLinks().then(response => {
        this.tableData = response.data
      })
    },
    rowclick(row, event, column) {
      this.form = row
      this.form.TYPE = 'edit'
    },
    filesuccess(response, file, fileList) {
      var iurl = this.weburl + response;

      this.form.IMGURL = response
      this.ladingExportMsg = ''
    },
    fileprogress(event, file, fileList) {
      this.ladingExportMsg = '正在上传,请稍后...'
    },
    onerror(err, file, fileList) {
      msg.showwarning(err)
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPng = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      const isPic = !isJPG || !isPng;
      if (!isPic) {
        msg.showwarning('请上传图片格式的文件')
        return false
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!');
      }

      this.uploadData.md5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size)
      return isPic && isLt2M;

    }
  }

};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 132px;
  height: 41px;
  line-height: 41px;
  text-align: center;
}
.avatar {
  width: 140px;
  height: 41px;
  display: block;
}
.contation {
  margin: 10px;
}
</style>




