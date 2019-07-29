<template>
  <div class="uploadDiv" :style="{'width':yearWidth}">
    <el-date-picker v-show="hideYear" v-model="Dyear" @change="changeyear" value-format="yyyy" align="right" type="year" class="dpicker" placeholder="选择年">
    </el-date-picker>
    <!-- 年月 -->
    <el-date-picker v-show="hideYearMonth" v-model="Dyear" @change="changeyear" value-format="yyyy-MM" align="right" type="month" class="dpicker2" placeholder="选择年月">
    </el-date-picker>

    <el-tooltip class="item" effect="dark" content="年度为当前导入的Excel数据所属年度" placement="top">
      <el-upload accept=".xls,.xlsx" class="upload-demo" :before-upload="beforeAvatarUpload" :headers="headersData" :data="uploadData" :on-error="onerror" :action="actionurl" :show-file-list=false :on-progress="fileprogress" :on-success="filesuccess">
        <el-button type="primary">{{ladingExportMsg}}</el-button>
      </el-upload>
    </el-tooltip>

  </div>

</template>


<script>
import msg from 'utils/loadmsg'
import { getcurNY, getcurYear } from 'utils/index'
export default {
  name: 'UploadExcel',
  // props: [],
  data() {
    return {
      Dyear: '',
      yearWidth: '225px',
      uploadData: {
        tbname: '',
        nd: '',
        type: ''
      },
      headersData: {
        moduleid: this.$store.getters.moduleid || ''
      },
      ladingExportMsg: '导入Excel数据',
      actionurl: process.env.BASE_API + 'api/ExcelOP/ExportExcelMB'
    }
  },
  mounted() {
    if (!this.hideYear) {
      this.Dyear = getcurYear()
      this.yearWidth = '140px'
    }
    // 显示年月的
    if (this.hideYearMonth) {
      this.Dyear = getcurNY()
      this.yearWidth = '260px'
    }

    this.setuploadData()
  },
  props: {
    // 是否显示年度处理
    hideYear: {
      type: Boolean,
      default: true
    },
    hideYearMonth: {
      type: Boolean,
      default: false
    },
    tableName: {
      type: String
    },
    // 0 新立 1 接转
    dataType: {
      type: String
    }
  },
  computed: {
    hideYearFn() {
      if (!this.hideYear) {
        this.yearWidth = '140px'
      }
    }
  },
  watch: {

    tableName() {
      this.setuploadData()
    }
  },
  methods: {
    changeyear(val) {
      this.Dyear = val
      this.setuploadData()
    },
    setuploadData() {
      this.uploadData.tbname = this.tableName
      this.uploadData.nd = this.Dyear
      this.uploadData.type = this.dataType
    },
    filesuccess(response, file, fileList) {
      this.$emit('loadingexcel', false)
      this.ladingExportMsg = '导入数据'
      if (response && response.status == 500) {
        msg.showwarning(response.msg)
      } else {
        msg.showsuccess('导入成功')
        // 获取数据提交父页面
        this.$emit('excelData', response)
        this.$emit('excelYear', this.Dyear)
      }
    },
    fileprogress(event, file, fileList) {
      this.$emit('loadingexcel', true)
      this.ladingExportMsg = '正在导入'
    },
    onerror(err, file, fileList) {
      this.$emit('loadingexcelerror')
      this.ladingExportMsg = '导入Excel数据'

      msg.showwarning('导入出现异常！')
    },
    beforeAvatarUpload(file) {
      if (!this.Dyear) {
        msg.showwarning('请先选择年度')
        return false
      }
      var len = file.name.split('.')
      const extension = file.name.split('.')[len.length - 1]
      const isExcel = (extension === 'xlsx' || extension === 'xls')
      if (!isExcel) {
        msg.showwarning('请上传excel格式的文件')
        return false
      }
    }
  }
}
</script>

<style scoped>
.dpicker {
  float: left;
  width: 100px;
}
.dpicker2 {
  float: left;
  width: 120px;
}
.upload-demo {
  float: left;
  margin-left: 1px;
}
.uploadDiv {
  height: 35px;
  width: 255px;
  float: left;
}
</style>
