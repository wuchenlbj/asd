/*
 * @Author: lbq 
 * @Date: 2017-12-22 15:26:23 
 * @Last Modified by: lbq
 * @Last Modified time: 2018-01-08 14:18:32
 */

<!-- 全面预算-项目接转- -->

<template>
	<div class="jfsb">
    <el-alert v-show="!xmxxRow" title="请选择项目" style="margin-bottom:10px;"  show-icon type="warning"></el-alert>
    <div style="margin-bottom:10px;">
      <el-button-group >
        <el-button v-if="xmxxRow&&xmxxRow.HTJ!='0'" type="primary" size="small" icon="el-icon-edit" @click="add" >添 加</el-button>
      </el-button-group>     
    
      <el-tag v-if="xmxxRow" type="warning">{{xmxxRow.XMMC}}----{{xmxxRow.KTMC}}</el-tag>
    </div>

    <!-- 表格操作 -->
	 <el-table border  style="width: 100%" :data="tableData"  @row-dblclick="rowdblclick"  v-loading="loading" header-row-class-name="headclass"> 
    <el-table-column label="项目名称" prop="XMMC" min-width="110"></el-table-column>
    <el-table-column label="课题名称" prop="KTMC" min-width="110"></el-table-column>
    <el-table-column label="合同金额(万元)" prop="HTJ" width="110"></el-table-column>
    <el-table-column label="年度" width="130">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.NY|parseTime3('yyyy')}}</span>
        <el-date-picker value-format="yyyy"  style="width:115px;" format="yyyy" v-if="scope.row.EDIT"   v-model="scope.row.NY" type="month" placeholder="年月"></el-date-picker> 
      </template>
    </el-table-column>
  
    <el-table-column label="本年度已付金额" width="110">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.GZJE}}</span>
        <el-input-number controls-position="right" style="width:90px;"  v-if="scope.row.EDIT"  size="mini" v-model="scope.row.GZJE"></el-input-number>          
      </template>
    </el-table-column>
     <el-table-column label="剩余未付金额" width="110">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.GZJE}}</span>
        <el-input-number controls-position="right" style="width:90px;"  v-if="scope.row.EDIT"  size="mini" v-model="scope.row.GZJE"></el-input-number>          
      </template>
    </el-table-column>
    <el-table-column label="是否接转" width="110">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.ZFJE}}</span>
      <el-input-number controls-position="right" style="width:90px;"  v-if="scope.row.EDIT"  size="mini" v-model="scope.row.ZFJE"></el-input-number>           
      </template>
    </el-table-column>
    <el-table-column label="接转方式" min-width="80">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.JBR}}</span>
        <el-input   v-if="scope.row.EDIT"   v-model="scope.row.JBR"></el-input>      
      </template>
    </el-table-column>   
  </el-table>
  </div>
</template>

<script >
import { NewGuid } from "@/config/filter"
import { mapGetters } from "vuex";
import { getJzXX, saveFKJHXX } from "api/qmys/index.js"
import msg from "utils/loadmsg"
export default {
  name: 'cgdj',
  data() {
    return {
      tableData: [],
      loading: false,
      listQuery: {
        xmbh: '',
        ktbh: ''
      }
    }
  },
  mounted() {
    this.getJZXX()
  },
  computed: {
    ...mapGetters(['xmxxRow'])
  },
  watch: {
    xmxxRow: function (row) {
      if (!row) return
      this.getXX(row)
    }
  },
  methods: {
    // 添加项目到列表中及验证
    getXX(row) {

      this.listQuery.xmbh = row.XMBH
      this.listQuery.ktbh = row.KTBH
      if (row.HTJ == '0') {
        msg.showwarning('该项目没有添加过合同信息，请先[项目管理-合同管理]添加合同信息')
        return false
      }

      // this.loading = true;
      // getFKJH(this.listQuery).then(response => {
      //   this.tableData = response.data;
      //   this.loading = false;
      // });
    },

    // 1.获取接转信息
    getJZXX() {
      getJzXX().then(response => {

      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jfsb {
  margin: 0 20px;
}
</style>
