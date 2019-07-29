<template>
	<div class="list">
    <el-row :gutter="20">
      <el-col :span="4"  >
        <el-scrollbar class="page-component__nav leftbar" :style="{height:leftheight}">
          <el-tree  node-key="id" :default-expanded-keys="['0']" :data="data" highlight-current 
          :props="defaultProps" @node-click="treeNodeClick" :render-content="renderContent">
          </el-tree>
        </el-scrollbar>        
      </el-col>
      <el-col :span="20">
         <!-- <el-alert    title="点击"    type="warning">  </el-alert> -->
        <div style="margin-bottom:10px;">
          <el-button-group >
            <el-button :disabled='disabledBtn' type="primary" size="small" icon="el-icon-edit" @click="add" >添 加</el-button>
            <el-button :disabled='disabledBtn'  type="primary" size="small" icon="el-icon-delete" @click="delrow" >删 除</el-button>
            <el-button :disabled='disabledBtn'  type="primary" size="small" icon="el-icon-upload">Excle 导入</el-button>
          </el-button-group>     
          <el-input placeholder="姓名搜索" size="small" v-model="listQuery.name" style="width:200px; margin-left:50px;" class="input-with-select">        
            <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
          </el-input>
        </div>
        <!-- 表格数据 -->
        	<el-table v-loading='loading' border style="width: 99%" align='center' :data="txlList" header-row-class-name="headclass">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="姓名"   width="150">
            <template slot-scope="scope">        
              <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.NAME}}</span>
              <el-input v-if="scope.row.EDIT"  size="small" v-model="scope.row.NAME"></el-input> 
            </template>
					</el-table-column>
					<el-table-column prop="TEL" label="手机号"   width="150" >
             <template slot-scope="scope">        
              <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.TEL}}</span>
              <el-input v-if="scope.row.EDIT"  size="small" v-model="scope.row.TEL"></el-input> 
            </template>
					</el-table-column>	
					<el-table-column prop="PHONE" label="座机号"   width="150">
              <template slot-scope="scope">        
              <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.PHONE}}</span>
              <el-input v-if="scope.row.EDIT"  size="small" v-model="scope.row.PHONE"></el-input> 
            </template>
					</el-table-column>
					<el-table-column prop="BZ" label="备注"   min-width="130" >
               <template slot-scope="scope">        
              <span class="span-title" v-if="!scope.row.EDIT" >{{scope.row.BZ}}</span>
              <el-input v-if="scope.row.EDIT"  size="small" v-model="scope.row.BZ"></el-input> 
            </template>
					</el-table-column>
				 <el-table-column  label="操作" v-if="showMenu"  width="150">
            <template slot-scope="scope">        
                <el-button v-if="scope.row.EDIT"  size="small" type="success" plain @click="addrow(scope.row)">保存
                </el-button>
                <el-button v-if="scope.row.EDIT"  size="small" type="danger" plain @click="cancelcreate(scope.row)">取消
                </el-button>
            </template>
          </el-table-column>
				</el-table>
      </el-col>
    </el-row>
	 
 
 
	</div>
</template>

<script>
import { NewGuid } from "@/config/filter"
import { GetYCUnitTreeTxl } from "api/common/xm.js"
import { getTxlXX, saveTxl } from 'api/kxgzgl/txl.js'
// import _ from "lodash"
export default {
  name: "txl",
  data() {
    return {
      loading: false,
      txlList: [], // 通讯录数据
      showMenu: false,
      disabledBtn: true,
      leftheight: 0,
      listQuery: {
        name: "",
        dwdm: ''
      },
      data: [{
        label: "组织结构",
        id: "0",
        children: []
      }],
      defaultProps: {
        children: "children",
        num: 'num',
        label: "label"
      }
    }
  },
  methods: {
    // 获取通讯录
    GetTxlXX() {
      getTxlXX(this.listQuery).then(response => {
        this.txlList = response.data
      })
    },
    // 左侧树点击事件
    treeNodeClick(data) {
      this.disabledBtn = false
      this.listQuery.dwdm = data.id
      this.GetTxlXX()
    },
    // 获取左侧树数据
    getTreeData() {
      GetYCUnitTreeTxl({ type: "children", ny: "" }).then(response => {
        this.data[0].children = response.data;
      });
    },
    // 搜索
    search() {
       this.GetTxlXX()
    },
    // 添加行
    add() {
      // var 
      var newrow = {
        ID: NewGuid(),
        NAME: "",
        TEL: "",
        PHONE: "",
        DWDM: this.listQuery.dwdm,
        BZ: "",
        EDIT: true,
        TYPE: 'add',
        tpm: true
      };
      this.showMenu = true
      this.txlList.unshift(newrow); // 添加到第一位
    },
    // 保存入库
    addrow(row) {
      if (row.NAME == "") {
        msg.showwarning("姓名不能为空");
        return false;
      }
      if (row.TEL == "") {
        msg.showwarning("手机号不能为空");
        return false;
      }

      this.loading = true;
      saveTxl(row).then(response => {
        row.EDIT = false;
        row.tpm = false
        this.loading = false;
        msg.showsuccess();
      })
        .catch(error => {
          this.loading = false;
        });
    },
    // 删除选择
    delrow() {

    },
    // 取消
    cancelcreate(row) {
      if (row.tpm) {
        this.txlList = _.remove(this.txlList, function (data) {
          return data != row;
        });
      } else {
        row.EDIT = false;
      }
    },
    // 左侧树列表渲染
    renderContent(h, { node, data, store }) {
      return (<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
        <span >
          {node.label == '组织结构' ? <span>{node.label}</span> : <span>{node.label}<el-badge class="mark" value={data.num} /></span>}
        </span>
      </span>);
    }

  },
  mounted() {
    this.leftheight = (document.body.clientHeight - 145) + 'px'
    this.getTreeData();

  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.page-component__nav {
  height: 100%;
}
.el-scrollbar__wrap {
  overflow: auto;
}
.leftbar {
  overflow: hidden;
}
</style>
