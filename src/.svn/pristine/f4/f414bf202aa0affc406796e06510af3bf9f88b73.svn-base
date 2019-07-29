<!-- 全面预算-月度付款计划- -->

<template>
	<div class="jfsb">
    <el-alert v-show="!xmxxRow" title="请选择项目" style="margin-bottom:10px;"  show-icon type="warning"></el-alert>
    <div style="margin-bottom:10px;">
      <el-button-group >
        <el-button v-if="xmxxRow&&xmxxRow.HTJ!='0'" type="primary" size="small" icon="el-icon-edit" @click="add" >添 加</el-button>
        <!-- <el-button  type="primary" size="small" icon="el-icon-upload" @click="uploadfile" >上传资料</el-button> -->
      </el-button-group>     
      <!-- <el-input placeholder="成果搜索" size="small" v-model="listQuery.name" style="width:200px; margin-left:50px;" class="input-with-select">        
        <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
      </el-input> -->
      <el-tag v-if="xmxxRow" type="warning">{{xmxxRow.XMMC}}----{{xmxxRow.KTMC}}</el-tag>
    </div>

    <!-- 表格操作 -->
	 <el-table border  style="width: 100%" :data="tableData"  @row-dblclick="rowdblclick"  v-loading="loading"> 
    <el-table-column label="项目名称" prop="XMMC" min-width="110"></el-table-column>
    <el-table-column label="课题名称" prop="KTMC" min-width="110"></el-table-column>
    <el-table-column label="合同金额(万元)" prop="HTJ" width="110"></el-table-column>
    <el-table-column label="年月" width="130">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.NY|parseTime3('yyyy-MM')}}</span>
        <el-date-picker value-format="yyyy-MM"  style="width:115px;" format="yyyy-MM" v-if="scope.row.EDIT"   v-model="scope.row.NY" type="month" placeholder="年月"></el-date-picker> 
      </template>
    </el-table-column>
    <el-table-column label="挂账批次" width="120">
      <template slot-scope="scope">
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.GZPCMC||''}}</span>
        <el-select v-model="scope.row.GZPC" v-if="scope.row.EDIT" @change="changepc1(scope.row)"  placeholder="请选择"  style="width:105px;" >
          <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </template>
    </el-table-column> 
    <el-table-column label="挂账金额(元)" width="110">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.GZJE}}</span>
        <el-input-number controls-position="right" style="width:90px;"  v-if="scope.row.EDIT"  size="mini" v-model="scope.row.GZJE"></el-input-number>          
      </template>
    </el-table-column>
    <el-table-column label="支付批次" prop="XMPCDM" width="120">
      <template slot-scope="scope">
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.ZFPCMC||''}}</span>
        <el-select v-model="scope.row.ZFPC"  v-if="scope.row.EDIT" @change="changepc2(scope.row)"  placeholder="请选择" style="width:105px;" >
          <el-option v-for="(item,index) in opts_pc" :key="index" :label="item.NAME" :value="item.ID">
          </el-option>
        </el-select>
      </template>
    </el-table-column> 
    <el-table-column label="支付金额(元)" width="110">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.ZFJE}}</span>
      <el-input-number controls-position="right" style="width:90px;"  v-if="scope.row.EDIT"  size="mini" v-model="scope.row.ZFJE"></el-input-number>           
      </template>
    </el-table-column>
    <el-table-column label="经办人" min-width="80">
      <template slot-scope="scope">        
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.JBR}}</span>
        <el-input   v-if="scope.row.EDIT"   v-model="scope.row.JBR"></el-input>      
      </template>
    </el-table-column>  
    <el-table-column  label="备注" min-width="200">
      <template slot-scope="scope">  
        <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.BZ}}</span>
        <el-input v-if="scope.row.EDIT"  size="small" v-model="scope.row.BZ"></el-input> 
      </template>
    </el-table-column> 
    <el-table-column  v-if="rowOperation"  label="操作"   fixed="right" width="150">
      <template slot-scope="scope">        
        <el-button v-if="scope.row.EDIT"  size="small" type="success" plain @click="addrow(scope.row)">保存
        </el-button>
        <el-button v-if="scope.row.EDIT"  size="small" type="danger" plain @click="cancelcreate(scope.row)">取消
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script >
import { NewGuid } from "@/config/filter"
import { getXmPC } from 'api/xtsz/fzdw.js';
import { mapGetters } from "vuex";
// import { saveCGDJXX, getcgdjList } from "api/cggl/cgdj.js"
import { getFKJH, saveFKJHXX } from "api/qmys/index.js"
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
    this.getXMPC()
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
      getFKJH(this.listQuery).then(response => {
        this.tableData = response.data;
        this.loading = false;
      });
    },
    // 保存入库
    addrow(row) {
      if (row.NY == "") {
        msg.showwarning("年月不能为空");
        return false;
      }
      if (row.GZJE == "") {
        msg.showwarning("挂账金额不能为空");
        return false;
      }
      if (row.ZFJE == "") {
        msg.showwarning("支付金额不能为空");
        return false;
      }
      var gzje = 0
      var zfje = 0
      var htj = parseFloat(row.HTJ) * 10000
      for (var i = 0; i < this.tableData.length; i++) {
        gzje += parseFloat(this.tableData[i].GZJE)
        zfje += parseFloat(this.tableData[i].ZFJE)
      }
      if (htj < gzje || htj < zfje) {
        msg.showwarning("挂账金额、支付金额不能大于合同价");
        return false;
      }
      this.loading = true;
      // saveFKJHXX(row).then(response => {
      //   row.EDIT = false;
      //   row.tpm = false
      //   this.loading = false;
      //   this.rowOperation = false
      //   msg.showsuccess();
      // })
      //   .catch(error => {
      //     this.loading = false;
      //   });
    },
    // 添加空数据
    add() {

      var newrow = {
        ID: NewGuid(),
        XMBH: this.xmxxRow.XMBH,
        KTBH: this.xmxxRow.KTBH,
        XMMC: this.xmxxRow.XMMC,
        KTMC: this.xmxxRow.KTMC,
        HTJ: this.xmxxRow.HTJ,
        NY: '',
        GZPC: '',
        GZJE: '',
        ZFPC: '',
        ZFJE: '',
        JBR: '',
        BZ: "",
        EDIT: true,
        TYPE: 'add',
        tpm: true
      };
      this.tableData.unshift(newrow); // 添加到第一位
      this.rowOperation = true // 显示操作列
    },
    delrow() {

    },
    // 取消
    cancelcreate(row) {
      if (row.tpm) {
        this.tableData = _.remove(this.tableData, function (data) {
          return data != row;
        });
      } else {
        row.EDIT = false;
      }
      this.rowOperation = false
    },
    // 模糊查询
    search() {

    },
    // 表格双击事件
    rowdblclick(row) {
      row.EDIT = true;
      row.TYPE = 'edit'
      this.rowOperation = true // 显示操作列
    },
    // 更改显示
    changepc1(row) {
      var r = _.find(this.opts_pc, function (o) { return o.ID === row.GZPC });
      row.GZPCMC = r.NAME
    },
    changepc2(row) {
      var r = _.find(this.opts_pc, function (o) { return o.ID === row.ZFPC });
      row.ZFPCMC = r.NAME
    },
    // 获取项目批次
    getXMPC() {
      getXmPC().then(response => {
        this.opts_pc = response.data
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
