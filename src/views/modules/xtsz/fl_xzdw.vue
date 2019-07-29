
<template>
  <!-- 协作单位 -->
  <div class="app">
    <div style="margin-bottom:5px;">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="add">添 加</el-button>
        <el-button type="primary" size="small" icon="el-icon-delete" @click="delrow">删 除</el-button>
        <el-button type="danger" size="small" icon="el-icon-warning" @click="addhmd(1)">添加黑名单</el-button>
        <el-button type="warning" size="small" icon="el-icon-warning" @click="addhmd(-1)">移除黑名单</el-button>
      </el-button-group>
      <el-input placeholder="单位搜索" size="small" v-model="listQuery.mc" style="width:200px; margin-left:5px;" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getXZDW"></el-button>
      </el-input>
    </div>
    <!-- 表格部分 -->
    <el-table :data="listdata" ref="tabler" :height="tableHeight" v-loading='loading' @row-dblclick="rowdblclick" @select="rowselect" border style="width: 100%" header-row-class-name="headclass">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column min-width="70px" label="状态">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">
            <el-tag v-if="scope.row.HMD==1" type="danger">黑名单</el-tag>
            <el-tag v-else type="success">正常</el-tag>
          </span>
          <el-select v-if="scope.row.EDIT" v-model="scope.row.HMD" placeholder="请选择">
            <el-option label="是" value="1"> </el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="230px" label="单位名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.WXDWMC}}</span>
          <el-input v-if="scope.row.EDIT" style="" size="small" v-model="scope.row.WXDWMC"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="100" label="联系人">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.LXR}}</span>
          <el-input v-if="scope.row.EDIT" size="small" v-model="scope.row.LXR"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="130" label="联系电话" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.LXDH}}</span>
          <el-input v-if="scope.row.EDIT" size="small" v-model="scope.row.LXDH"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="130" label="开户银行" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.KHYX}}</span>
          <el-input v-if="scope.row.EDIT" style=" " size="small" v-model="scope.row.KHYX"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="160" label="税号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.SH}}</span>
          <el-input v-if="scope.row.EDIT" style="" size="small" v-model="scope.row.SH"></el-input>
        </template>
      </el-table-column>
      <el-table-column min-width="130px" label="账号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.ZH}}</span>
          <el-input v-if="scope.row.EDIT" style=" " size="small" v-model="scope.row.ZH"></el-input>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="单位地址" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.DWDZ}}</span>
          <el-input v-if="scope.row.EDIT" style=" " size="small" v-model="scope.row.DWDZ"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span class="span-title" v-if="!scope.row.EDIT">{{scope.row.BZ}}</span>
          <el-input v-if="scope.row.EDIT" style=" " size="small" v-model="scope.row.BZ"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.EDIT" size="small" type="success" plain @click="addrow(scope.row)">保存
          </el-button>
          <el-button v-if="scope.row.EDIT" size="small" type="danger" plain @click="cancelcreate(scope.row)">取消
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { NewGuid } from "@/config/filter";
import { saveXZDW, getxzdwList, delXzdw, updateHMD } from "api/xtsz/xzdw.js";
import msg from "utils/loadmsg";
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
      selectedids: [], // 选择行id
      listQuery: { mc: "", hmd: '0' },
      listdata: [], // 表格数据
      aa: ""
    };
  },
  methods: {
    setHeight() {
      this.tableHeight = this.rightHeight - 50
    },
    // 添加数据
    add() {
      var newrow = {
        XH: this.listdata.length + 1,
        WXDWDM: NewGuid(),
        WXDWMC: "",
        LXDH: "",
        KHYX: "",
        SH: "",
        ZH: "",
        DWDZ: "",
        BZ: "",
        EDIT: true,
        tpm: true
      };
      this.listdata.unshift(newrow); // 添加到第一位
    },
    // check事件
    rowselect(selection, row) {
      var ids = [];

      for (var i in selection) {
        var o = selection[i];
        if (o.tpm) {
          o.EDIT = false;
        } else {
          ids.push(o.WXDWDM);
        }
      }
      this.selectedids = ids;
    },
    // 删除数据
    delrow() {
      var _this = this;
      if (this.selectedids.length === 0) {
        msg.showwarning("您还未选择任何数据");
        return false;
      }
      this.$confirm("确定要删除该信息吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除数据
          msg.showloading("正在删除,请稍后...");
          delXzdw(this.selectedids).then(response => {
            _.forEach(_this.selectedids, function (value) {
              // 若一个参数，返回的便是其value值
              _this.listdata = _.remove(_this.listdata, function (data) {
                return data.WXDWDM != value;
              });
            });
            // 删除成功
            msg.showsuccess("删除成功");
          });
        })
        .catch(() => { });
    },
    // 添加黑名单
    addhmd(type) {
      var _this = this;
      if (this.selectedids.length === 0) {
        msg.showwarning("您还未选择任何数据");
        return false;
      }
      var msg = ''
      if (type == '1') {
        msg = '拉到黑名单中'
      } else {
        msg = '移除黑名单'
      }
      this.$confirm("确定要将所选单位" + msg + "吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 修改数据
          var qry = { ids: this.selectedids, type: type }
          updateHMD(qry).then(response => {
            this.getXZDW()
            // 删除成功
            // msg.showsuccess("删除成功");
          });
        })
        .catch(() => { });
    },
    // 取消
    cancelcreate(row) {
      if (row.tpm) {
        this.listdata = _.remove(this.listdata, function (data) {
          return data != row;
        });
      } else {
        row.EDIT = false;
      }
    },
    // 双击编辑
    rowdblclick(row, event) {
      row.EDIT = true;
    },
    // 保存入库
    addrow(row) {
      if (row.WXDWMC == "") {
        msg.showwarning("单位名称不能为空");
        return false;
      }
      if (row.SH == "") {
        msg.showwarning("税号不能为空");
        return false;
      }
      if (row.ZH == "") {
        msg.showwarning("账号号不能为空");
        return false;
      }
      this.loading = true;
      saveXZDW(row)
        .then(response => {
          row.EDIT = false;
          row.tpm = false
          this.loading = false;
          msg.showsuccess();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 获取协作单位数据
    getXZDW() {
      this.loading = true;

      getxzdwList(this.listQuery).then(response => {
        this.listdata = response.data;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.getXZDW();
    this.setHeight()
  }
};
</script>
<style scoped >
.app {
  margin-top: 5px;
}
</style>
