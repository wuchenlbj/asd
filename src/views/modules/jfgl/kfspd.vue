<!-- 全面预算-月度付款计划- -->

<template>
	<div class="jfsb">
    <el-alert v-show="!xmxxRow" title="请选择项目" style="margin-bottom:10px;"  show-icon type="warning"></el-alert>
    <div style="margin-bottom:10px;"> 
      <el-tag v-if="xmxxRow" type="warning">{{xmxxRow.XMMC}}----{{xmxxRow.KTMC}}</el-tag>
    </div>
    <template v-for="(item,index) in this.tableData">
       <div style="width:800px;margin:0 auto;">
       <div>
         <h1 class="spd_title">延长油田股份有限公司资金拨付审批单</h1>
         <div class="spd_sj">
           2017年12月22日
         </div>
        <table width="800px" class="table">
          <tr>
            <td class="tdtitle">收款单位全称</td>
            <td class="tdcon">{{item.WXDWMC}}</td>
            <td class="td">亿</td>
            <td class="td">千</td>
            <td class="td">百</td>
            <td class="td">十</td>
            <td class="td">万</td>
            <td class="td">千</td>
            <td class="td">百</td>
            <td class="td">十</td>
            <td class="td">元</td>
            <td class="td">角</td>
            <td class="td">分</td>
          </tr>
         <tr>
            <td class="tdtitle">开户行及账号</td>
            <td class="tdcon" style="line-height:25px;">
              <span  >{{item.KHYX}}</span><br/>
              <span  >{{item.ZH}}</span></td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
          </tr>
           <tr>
            <td class="tdtitle">付款内容</td>
              <td class="tdcon" style="line-height:25px;">
              <span  >{{item.BZ}}</span><br/>
              <span style="float:right;padding-right:20px;" >{{item.ZFPCMC}} {{item.BFB}}% </span>
            </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
            <td class="td"> </td>
          </tr>
           <tr>
            <td class="tdtitle">金额（大写）</td>
            <td class="tdcon">{{item.DXJE}}</td>
            <td class="td">{{item.BILLION}}</td>
            <td class="td">{{item.MUST}}</td>
            <td class="td">{{item.MILLION}}</td>
            <td class="td">{{item.TENWAN}}</td>
            <td class="td">{{item.WAN}}</td>
            <td class="td">{{item.THOUSAND}}</td> 
            <td class="td">{{item.HUNDRED}}</td>
            <td class="td">{{item.TEN}}</td>
            <td class="td">{{item.BIT}}</td>
            <td class="td">{{item.JIAO}}</td>
            <td class="td">{{item.FEN}}</td>
          </tr>
        </table>
        <div class="foot">
          <div class="foot1">领导签字:</div>
          <div class="foot2">会计主管审核:</div>
          <div class="foot3">经办人:<span style="padding-left:10px;" >{{item.JBR}} </span></div>
        </div>
       </div>
     </div>
    </template>
    
  </div>
</template>

<script >
import { NewGuid } from "@/config/filter"

import { mapGetters } from "vuex";

import { getFKJH2 } from "api/qmys/index.js"
import msg from "utils/loadmsg"
export default {
  name: 'cgdj',
  data() {
    return {
      opts_pc: [], // 项目批次的数据源
      tableData: [],

      rowOperation: false,
      loading: false,
      listQuery: {
        xmbh: '',
        ktbh: ''
      }
    }
  },
  mounted() {

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

    // 查询项目所属信息
    getXX(row) {

      this.listQuery.xmbh = row.XMBH
      this.listQuery.ktbh = row.KTBH
      if (row.HTJ == '0') {
        msg.showwarning('该项目没有添加过合同信息，请先[项目管理-合同管理]添加合同信息')

        return false
      }
      this.loading = true;
      getFKJH2(this.listQuery).then(response => {
        this.tableData = response.data;
        this.loading = false;
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jfsb {
  margin: 0 20px;
}
.spd_title {
  text-align: center;
  font-family: "宋体";
}
.spd_sj {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
}
td {
  border: 1px #383838 solid;
  height: 50px;
  line-height: 50px;
}
.table {
  border-collapse: collapse;
  margin: 0 auto;
}
.tdtitle {
  text-align: center;
  width: 250px;
}
.td {
  width: 10px;
}
.tdcon {
  padding-left: 20px;
}
.foot {
  width: 100%;
  height: 50px;
  line-height: 50px;
  .foot1 {
    margin-left: 100px;
    display: inline;
  }
  .foot2 {
    margin-left: 150px;
    display: inline;
  }
  .foot3 {
    margin-left: 150px;
    display: inline;
  }
}
</style>
