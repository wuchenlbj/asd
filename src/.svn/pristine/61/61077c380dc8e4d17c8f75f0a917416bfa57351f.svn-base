<!-- 验收管理 3.验收评审 -->

<template>
  <div class="ysps">
    <el-tabs activeName="yspstz" tabPosition="left">
      <el-tab-pane label="评审通知" name="yspstz">
        <!-- 评审通知 -->
        <file-upload :list-height="tableHeight" :spcFolder="psFolder">
        </file-upload>
      </el-tab-pane>
      <el-tab-pane label="会议纪要" name="yshyjy">
        <!-- 会议纪要 -->
        <file-upload :list-height="tableHeight" :spcFolder="jyFolder">
        </file-upload>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script >
import { mapGetters } from 'vuex'
import msg from 'utils/loadmsg'
import { savePSPZ, getPSDfXX, getYsapXX, saveYSPS } from 'api/xmgl/ysgl/index.js'
import FileUpload from 'views/FileUpload'
import { getysjl } from 'api/xmgl/ysgl/index.js'
// 293ba270-c83e-506b-a8f7-0109b4ca3608 会议纪要
export default {

  name: 'ysps',
  data() {
    return {
      loading: false,
      tableHeight: 0,

      psFolder: {
        // 指定需要打开的文件夹
        name: '验收评审材料', // 文件夹名称
        qdid: '4aad1d65-eb71-a888-94af-f07947377264,59fc9865-ae06-7276-82a0-bfef92af9ad7' // 文件夹所属清单
      },
      jyFolder: {
        // 指定需要打开的文件夹
        name: '验收评审材料', // 文件夹名称
        qdid: '2103b8c4-4cd4-569b-eee1-656dc6ce2cb6,293ba270-c83e-506b-a8f7-0109b4ca3608,baea6fc4-4a3d-09cf-d7bb-5ea0ec9bc083' // 文件夹所属清单
      },
    }
  },
  components: {
    FileUpload
  },
  computed: {
    ...mapGetters(['xmxxRow','panelHeight'])
  },
  watch: {
    panelHeight(val) {
      this.setHeight()
    },
  },

  mounted() {
    if (this.xmxxRow) {
      let tmpRow = this.xmxxRow
      tmpRow.autoQuery  = 'ysps'
      this.$store.dispatch('set_cur_xmrow', tmpRow)
    }
    this.setHeight()
  },
  methods: {
    setHeight(){
      this.tableHeight = this.panelHeight - 44
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
