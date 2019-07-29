<!-- 合同管理 资信管理 -->

<template>
  <!-- 协作单位 -->
  <div class="app">
    <div style="margin-bottom:5px;">

      <el-input placeholder="单位搜索" size="small" v-model="listQuery.mc" style="width:200px; " class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getXZDW"></el-button>
      </el-input>
    </div>
    <!-- 表格部分 -->
    <el-table :data="listdata" ref="tabler" :height="tableHeight" v-loading='loading'  border style="width: 100%" header-row-class-name="headclass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column min-width="70px" label="状态">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">
            <el-tag v-if="scope.row.HMD==1" type="danger">黑名单</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="230px" label="单位名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.WXDWMC}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="LXR"  label="联系人"></el-table-column>
      <el-table-column width="130" label="联系电话" prop="LXDH"  show-overflow-tooltip></el-table-column>
      <el-table-column width="130" label="开户银行"  prop="KHYX"  show-overflow-tooltip></el-table-column>
      <el-table-column width="160" label="税号"  prop="SH" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="130px" label="账号" prop="ZH" show-overflow-tooltip></el-table-column>
      <el-table-column min-width="150px" label="单位地址" prop="DWDZ" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="BZ" min-width="120"></el-table-column>

    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getXZDWHMD } from "api/xtsz/xzdw.js";
export default {
  name: "app",
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight(val) {
      this.setHeight()
    }
  },
  data() {
    return {
      tableHeight: 0,
      loading: false,
      listQuery: { mc: "" },
      listdata: [], // 表格数据
      aa: ""
    };
  },
  methods: {
    setHeight() {
      this.tableHeight = parseInt(this.rightHeight * 0.9)
    },
    // 获取协作单位数据
    getXZDW() {
      this.loading = true;

      getXZDWHMD(this.listQuery).then(response => {
        this.listdata = response.data;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getXZDW();
    this.setHeight()

    // GNM 添加简单的功能说明
    this.$store.dispatch('SetHelpContent', `
    <span style="font-size:14px;font-weight:bold">功能说明：</span><br/>
    <span>&nbsp;&nbsp;显示在"系统设置"中已拉入黑名单的公司信息</span>
    `)
  },
  destroyed () {
    this.$store.dispatch('SetHelpContent', '')
  }
};
</script>
<style scoped >
.app {
  margin-top: 5px;
}
</style>
