<!-- 项目清单-清单维护 -->
<template>
  <div class="jfsb">
    <el-row :gutter="20">
      <el-col :span="5">
        <h3>系统功能目录</h3>
        <ul id="treeDemo" class="ztree" :style="{height:leftTreeHeight+'px'}"></ul>
      </el-col>
      <el-col :span="19">
        <h3>清单目录</h3>
        <div style="width:98%;overflow-x:auto;">
          <div class="el-steps el-steps--horizontal">
            <!-- 循环标签 -->
            <div v-for="(item,index) in stepNodeData" :key="index" class="el-step is-horizontal" style="flex-basis: 280px; margin-right: 0px;">
              <div class="el-step__head is-process">
                <div class="el-step__line" style="margin-right: 0px;">
                  <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; width: 0%;"></i>
                </div>
                <div class="el-step__icon is-icon">
                  <i class="el-step__icon-inner el-icon-tickets"></i>
                  <!---->
                </div>
              </div>
              <div class="el-step__main">
                <div v-show="!item.edit" @click="_toogleclick(item)" class="el-step__title is-process">{{item.name}}</div>
                <div v-show="item.edit">
                  <el-input v-model="item.name" @blur="_toogleclick(item)" style="width:200px;" placeholder="请输入内容"></el-input>
                </div>
                <div class="el-step__description is-process"></div>
              </div>
            </div>
            <!-- 循环标签 -->
          </div>

          <div v-for="(item,index) in treeDivData" :key="index" class="con" :style="{width:space-50+'px',float:'left'}">
            <ul :id="'treeDemo'+(index+1)" class="ztree ztreeDemo" :style="{height:rightTreeHeight+'px',width:'98%'}"></ul>
          </div>
        </div>

        <el-button :loading="loadingtreebtn" @click="saveData" type="primary" style="margin-top:20px;">保存配置</el-button>
        <!-- <ul id="treeQD" class="ztree" ></ul> -->
      </el-col>
      <el-col :span="8">
      </el-col>
    </el-row>

    <el-dialog v-dialogDrag title="添加节点" width="20%" append-to-body :visible.sync="dialog_creat">
      <el-form :model="form" ref="dwform" :rules="rules">

        <el-form-item v-show="false" label="节点代码" label-width='80px' prop="id">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="节点名称" label-width='80px' prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_creat = false">取 消</el-button>
        <el-button :loading="loadingtreebtn" type="primary" @click="addnode('dwform')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script >
import {
  _getUniq,
  showRenameBtn,
  removeHoverDom,
  showRemoveBtn
} from './qdwh.js'
import { getXMFLTree } from 'api/xtsz/fzdw.js'
import { mapGetters } from 'vuex'
import {
  editTreeData,
  addTreeData,
  saveTreeData,
  getZtreeData,
  getmrZtreedata
} from 'api/xmwdqd/index.js'
import { NewGuid } from '@/config/filter'
import msg from 'utils/loadmsg'
export default {
  name: 'bbgl',
  data() {
    return {
      // 下拉树配置项
      treeProps: {
        label: 'label',
        children: 'children',
        value: 'id'
      },
      leftTreeHeight: 500,
      rightTreeHeight: 300, // GNM 添加对版块高度的控制
      treeDivData: [],
      stepNodeData: [], // 节点配置数组
      XMFLDM: '', // 项目分类代码
      XMFLMC: '',
      loadingtreebtn: false,
      curTreeId: '',
      space: 250,
      active: 0,
      dialog_creat: false,

      form: {
        id: '',
        pid: '',
        name: ''
      },
      rules: {
        id: [{ required: true, message: '请输入节点代码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }]
      },
      setting: {
        edit: {
          showRemoveBtn: false,
          showRenameBtn: false,
          enable: true,
          drag: {
            isCopy: true,
            isMove: false
          }
        },
        callback: {
          beforeDrag: this._beforeDrag,
          onDrop: this._zTreeOnDrop
        }
      },
      setting2: {
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid'
          },
          key: {
            name: 'name'
          }
        },
        view: {
          addHoverDom: this.addHoverDom,
          removeHoverDom: removeHoverDom,
          selectedMulti: false
        },
        edit: {
          drag: {
            autoExpandTrigger: true,
            prev: true,
            inner: true,
            next: true
          },
          enable: true,
          removeTitle: '删除该节点',
          renameTitle: '编辑该配置',
          showRemoveBtn: showRemoveBtn,
          showRenameBtn: showRenameBtn
        },
        callback: {
          beforeRemove: this.beforeRemove,
          beforeRename: this.beforeRename
        }
      },
      zNodes: [],
      treeData: [] // 总的目录树
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'rightHeight'])
  },
  methods: {
    setSelectedIdXMFL(val) {
      this.XMFLDM = val
      this.XMFLMC = this.$refs.treeSelect.treeSelected
    },

    // 1-2根据类型获取ztree树数据
    nextStepGetData() {
      // 根据类型查询节点配置信息
      getZtreeData().then(response => {
        this.treeDivData = []
        this.stepNodeData = []
        this._getZtreeData(response.data)
      })
    },
    // 1-3 渲染树
    _getZtreeData(responseData) {
      this.treeDivData = _getUniq(responseData)

      for (var i = 1; i <= this.treeDivData.length; i++) {
        var d = responseData.filter(v => {
          if (v.xh == i) {
            if (v.pid == '0') {
              v.edit = false
              this.stepNodeData.push(v)
            }
            return v
          }
        })
        if (d[0]) {
          this._renderTreeAndData(i, d[0].children, true)
        }
      }
    },

    // 2-2 根据数据渲染出各个树
    _renderTreeAndData(index, data, flag) {
      this.$nextTick(function() {
        if (flag) {
          $.fn.zTree.init($('#treeDemo' + index + ''), this.setting2, data)
        } else {
          $.fn.zTree.init($('#treeDemo' + index + ''), this.setting2)
        }
      })
    },

    // 保存配置的节点数据
    saveData() {
      if (this.stepNodeData.length == 0) {
        msg.showwarning('您还未配置任何数据,请先配置')
        return false
      }

      var data = [] // 清单表数据
      var dataFl = [] // 清单分类数据

      for (var i = 0; i < this.stepNodeData.length; i++) {
        var index = this.stepNodeData[i].xh
        var nodedata = this._getTreeNodeData('treeDemo' + index + '', index) // 每个树的数据 排除根节点
        // 过滤根节点
        var ndata = nodedata
        if (nodedata.length > 0) {
          ndata = nodedata.filter(v => {
            if (v.pid != this.stepNodeData[i].id) {
              return v
            } else {
              dataFl.push(v)
            }
          })
        }
        //  console.info(ndata)
        data = data.concat(ndata)
      }
      const datafl = dataFl.concat(this.stepNodeData)

      this.loadingtreebtn = true

      saveTreeData({ d1: datafl, d2: data }).then(response => {
        msg.showsuccess('保存数据成功')
        this.loadingtreebtn = false
      })
    },
    // 获取树数据 给根节点排序
    _getTreeNodeData(treeId, xh) {
      var treeObj = $.fn.zTree.getZTreeObj(treeId)
      if (!treeObj) return []

      const data = treeObj.transformToArray(treeObj.getNodes())
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].pid) {
            // 处理pid为null情况
            data[i].pid = this._getStepVal(xh, 'id')
          }
        }
      }
      return data
    },
    // 通过属性获取根节点数据
    _getStepVal(xh, name) {
      var val = ''
      _.forEach(this.stepNodeData, function(n, key) {
        if (n.xh == xh) {
          val = n[name]
        }
      })
      return val
    },
    beforeRemove: function(treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj(treeId) // TODO
      zTree.selectNode(treeNode)
      return confirm('确认删除清单 -- ' + treeNode.name + ' 吗？')
    },
    // 节点重命名操作
    beforeRename(treeId, treeNode, newName, isCancel) {
      var _this = this

      var zTree = $.fn.zTree.getZTreeObj(treeId)
      zTree.selectNode(treeNode)
      var msg = '确认修改名称为: -- ' + newName + ' 吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 处理根节点
          // 好像没有等于0的吧...
          if (treeNode.id == '0') {
            const xh = treeId.substring(treeId.length - 1)

            _.forEach(_this.stepNodeData, function(n, key) {
              if (n.xh === xh) {
                n.name = newName
              }
            })
          }

          return true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
          return false
        })
    },
    // 渲染添加按钮
    addHoverDom: function(treeId, treeNode) {
      if (treeNode.id == '0') return ''
      var _this = this
      var sObj = $('#' + treeNode.tId + '_span')
      if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) {
        return
      }
      var addStr =
        "<span class='button add' id='addBtn_" +
        treeNode.tId +
        "' title='添加文件夹' onfocus='this.blur();'></span> "
      sObj.after(addStr)
      var btn = $('#addBtn_' + treeNode.tId)
      if (btn) {
        btn.bind('click', function() {
          _this.dialog_creat = true

          _this.form.id = NewGuid() // 显示手填 不显示默认赋值
          _this.form.name = ''
          _this.form.pid = treeNode.id
          _this.CurtreeNode = treeNode
          _this.curTreeId = treeId
          return false
        })
      }
    },
    // 添加保存单个节点数据
    addnode: function(formName) {
      var _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          var zTree = $.fn.zTree.getZTreeObj(_this.curTreeId)
          // var allnodes = zTree.getNodeByParam('name', _this.form.name)

          var adddata = {
            id: _this.form.id,
            pid: _this.form.pid,
            isParent: true,
            open: true,
            name: _this.form.name
          }
          zTree.addNodes(_this.CurtreeNode, adddata)
          _this.dialog_creat = false
        } else {
          return false
        }
      })
    },
    // 拖拽根节点赋值（左侧树）
    _zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
      if (treeId === 'treeDemo') {
        msg.showwarning('没有获取当前树id')
        return false
      }
      var treeObj = $.fn.zTree.getZTreeObj(treeId)
      const xh = treeId.substring(treeId.length - 1)

      var nodes = treeNodes // JSON.parse(JSON.stringify(treeNodes)) // 转化后的值
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]

        node.id = node.moduleid
        this.stepNodeData.filter(v => {
          if (v.xh === xh) {
            node.pid = v.id
          }
        })

        treeObj.updateNode(node)
        treeObj.removeChildNodes(node) // 移除子节点保证不混乱
      }
    },
    _beforeDrag(treeId, treeNodes) {
      for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (this.stepNodeData.length === 0) {
          return false
        }
        return true
      }
    },
    // 1.1初始化左侧导航树
    initData() {
      var vdata = JSON.parse(JSON.stringify(this.permission_routers))
      this.zNodes = vdata.filter(v => {
        if (!v.hidden && v.name !== '系统设置') {
          delete v.icon
          v.children.filter(child => {
            delete child.icon
          })
          if (v.children && v.children.length > 0) {
            //  v.drag = false
          }
          return v
        }
      })

      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
    },
    _toogleclick(item) {
      if (!item.name) return

      item.edit = !item.edit
    }
  },
  mounted() {
    this.initData()
    // 获取默认节点
    this.nextStepGetData()
    // GNM 配置高度
    if (this.rightHeight > 0) {
      this.leftTreeHeight = parseInt(this.rightHeight * 0.8)
      this.rightTreeHeight = parseInt(this.rightHeight * 0.6)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-step__title {
  font-weight: 500px;
  font-size: 13px;
}
.jfsb {
  padding-left: 20px;
  margin-top: 10px;
  position: relative;
  height: 95%;
  width: 99%;
}

.title {
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  padding-left: 20px;
  margin-bottom: 20px;
}

.bgtip {
  background-color: rgb(252, 248, 227);
  margin-top: 5px;
  height: 60px;
  line-height: 60px;
  border: 1px solid #eee;
  padding-left: 20px;
  font-size: 20px;
}
.ztreeDemo {
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f0f6e1;
  width: 200px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
<style>
@import '../../../../public/zTree/css/zTreeStyle.css';
.ztree li span.button.add {
  margin-left: 2px;
  margin-right: 2px;
  background-position: -144px 0;
  vertical-align: top;
  *vertical-align: middle;
}
ul.ztree {
  border: 1px solid #617775;
  background: #f0f6e4;
  width: 100%;
  overflow-y: scroll;
  overflow-x: auto;
}
</style>
