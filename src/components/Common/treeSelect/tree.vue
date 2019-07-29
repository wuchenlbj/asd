<template>
  <div class="ats-tree" v-clickoutside="handleClose" ref="atsTree">
    <div class="ats-input">
      <div class="ats-input-single">
        <el-input size="mini" type="text" v-model="treeSelected" :placeholder="placetext" @input="handleFilter" @focus="visible=true" @blur="handleAutoComplete" @mousedown.native="handleMouseDown" @keydown.native.esc.stop.prevent="visible = false" @keydown.native.tab="visible = false" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :class="{ 'is-focus': visible }" ref="input">
          <i slot="suffix" :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass,{'is-reverse': !visible}]" @click="handleIconClick(!visible)"></i>
        </el-input>
      </div>
    </div>
    <el-scrollbar v-show="visible" class="ats-tree-scrollbar" ref="treeScrollbar">
      <div class="ats-tree-wrapper">
        <ul class="ats-tree-nodes">
          <tree-node v-for="child in treeNodes[treeProps.children]" :node="child" :key="child.id" :currentNodeId="currentNodeId" :treeProps="treeProps" :eventHub="eventHub" :query="query" :isQuering="isQuering">
          </tree-node>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tag, Scrollbar } from 'element-ui'
import treeNode from './tree-node.vue'
import Clickoutside from './utils/clickoutside'
import debounce from 'throttle-debounce/throttle'
import { objArrDeepCopy } from './utils/tools'

Vue.component(Scrollbar.name, Scrollbar)
Vue.component(Tag.name, Tag)

export default {
  name: 'tree',
  components: {
    treeNode
  },
  props: {
    clearable: Boolean, // 单选时是否可以清空选项
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    treeProps: {
      type: Object,
      default: {
        label: 'label',
        children: 'children'
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {}
  },
  created() {
    this.eventHub.$on('node-click', this.handleNodeClick)
  },
  updated() {
    this.isDefault = true
  },
  computed: {
    iconClass() {
      const criteria =
        this.clearable &&
        this.inputHovering &&
        this.value !== undefined &&
        this.value !== ''
      return criteria ? 'circle-close is-show-close' : 'arrow-up'
    }
  },
  watch: {
    value(val) {
      if (this.isDefault) {
        this.setDefaultValue()
      }
    },
    treeData(val) {
      if (val) {
        this.treeNodes = {
          [this.treeProps.children]: objArrDeepCopy(val, { visible: true }),
          visible: true
        }
        if (this.isDefault) {
          this.setDefaultValue()
        }
      }
    },
    checkedKeys(val) {
      if (val.length) {
        this.placetext = ''
      } else {
        this.placetext = this.placeholder
      }
    }
  },
  data() {
    return {
      treeNodes: {
        [this.treeProps.children]: objArrDeepCopy(this.treeData, {
          visible: true
        }),
        visible: true
      },
      inputHovering: false,
      placetext: this.placeholder,
      currentNodeId: '',
      currentSelected: '',
      treeSelected: '',
      visible: false,
      eventHub: new Vue(),
      isQuering: false,
      query: '',
      checkedItems: [],
      checkedKeys: [],
      isDefault: true,
      error: {
        message: '',
        data: ''
      },
      hovering: false
    }
  },
  methods: {
    // 清空
    resetValue() {
      this.treeSelected = ''
      this.currentNodeId = ''
      this.$emit('setSelectedId', '')
    },
    // 下拉箭头点击
    handleIconClick(event) {
      if (this.iconClass.indexOf('circle-close') > -1) {
        this.resetValue(event)
      } else {
        this.toggleMenu()
      }
    },
    // 隐藏显示
    toggleMenu() {
      this.visible = !this.visible
      if (this.visible) {
        this.$refs.input.focus()
      }
    },
    // input mousedown
    handleMouseDown(event) {
      if (event.target.tagName !== 'INPUT') return
      if (this.visible) {
        this.handleClose()
        event.preventDefault()
      }
    },
    handleClose() {
      this.visible = false
    },
    // 标题点击事件
    handleNodeClick(node, event) {
      if (event) {
        this.isDefault = false
      }
      this.currentNodeId = node.id
      this.treeSelected = node[this.treeProps.label]
      this.currentSelected = this.treeSelected
      this.$emit('setSelectedId', node.id)
      this.visible = false // 隐藏窗体
    },
    setDefaultValue() {
      // this.setCheckedKeys(this.value)
      this.setSelected(this.value)
    },
    // 单选设置初始值
    setSelected(val) {
      const self = this
      const treeNodes = self.treeNodes

      self.resetValue()
      self.findTreeItem(val, treeNodes)
      if (!this.currentNodeId) {
        this.setErrorMessage(val)
      }
    },
    findTreeItem(id, treeNodes) {
      const self = this
      const childNodes = treeNodes[self.treeProps.children]

      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].id == id) {
          self.handleNodeClick(childNodes[i])
          break
        } else {
          self.findTreeItem(id, childNodes[i])
        }
      }
    },
    handleFilter: debounce(1000, function() {
      this.isQuering = true
      if (this.isQuering) {
        this.query = this.treeSelected
        this.treeFilterMethod(this.treeNodes)
      }
    }),
    treeFilterMethod(node) {
      const self = this
      const childNodes = node[self.treeProps.children]
      if (childNodes.length) { // GNM childNodes为空时，下面的语句会报错
        childNodes.forEach(child => {
          child.visible =
            child[self.treeProps.label]
              .toLowerCase()
              .indexOf(self.query.toLowerCase()) > -1
          self.treeFilterMethod(child)
        })
      }
      if (!node.visible && childNodes.length) {
        let allHidden = true
        childNodes.forEach(child => {
          if (child.visible) allHidden = false
        })
        node.visible = allHidden === false
      }
      if (node.visible) {
        this.$set(node, 'expanded', true)
        if (self.query === '') {
          node.expanded = false
        }
      }
    },
    handleAutoComplete() {
      setTimeout(
        function() {
          this.query = ''
          if (this.currentNodeId) {
            this.treeSelected = this.currentSelected
          } else {
            this.treeSelected = ''
            this.handleFilter()
          }
          if (this.isQuery) {
            this.visible = false
          }
          this.isQuery = false
        }.bind(this),
        250
      )
    },
    handleAddItem(item) {
      this.checkedItems.push(item)
      this.checkedKeys.push(item.id)
      this.$set(item, 'checked', true)
    },
    handleDelItem(item, event) {
      if (event) {
        this.isDefault = false
      }
      this.checkedKeys.splice(this.checkedKeys.indexOf(item.id), 1)
      this.checkedItems.splice(this.checkedItems.indexOf(item), 1)
      this.$set(item, 'checked', false)
      this.$emit('setSelectedId', this.checkedKeys)
    },
    hasSameItem(obj, item) {
      return obj.indexOf(item) > -1
    },
    setErrorMessage(data) {
      if (!data || !data.toString()) return
      const errorText = data instanceof Array ? data.toString() : data

      this.error.message = '发现不存在的部门id:' + errorText
      this.error.data = data
      this.$emit('errorCallback', this.error)
    },
    resetTreeTop() {
      this.$nextTick(function() {
        const inputMultiple = this.$refs.atsTree.querySelector(
          '.ats-input-multiple'
        )
        const treeScrollbar = this.$refs.atsTree.querySelector(
          '.ats-tree-scrollbar'
        )
        const inputMultipleHeight = inputMultiple.offsetHeight

        treeScrollbar.style.top = inputMultipleHeight + 5 + 'px'
      })
    },
    setInputFocus() {
      const multipleInput = this.$refs.multipleInput

      multipleInput.focus()
    },
    handleTitleVisible(str) {
      if (!str) return ''
      let tempLen = 0

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2
        } else {
          tempLen += 1
        }
      }
      if (tempLen >= 15) {
        return str
      } else {
        return ''
      }
    }
  },
  filters: {
    // 截取前18个字节
    showEllips(str) {
      if (!str) return ''
      let tempLen = 0

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2
        } else {
          tempLen += 1
        }
        if (tempLen >= 15) {
          str = str.substring(0, i) + '...'
          break
        }
      }
      return str
    }
  },
  directives: { Clickoutside }
}
</script>

<style lang="scss">
.ats-tree-nodes {
  margin: 0;
  padding: 0;
}
.ats-tree {
  display: inline-block;
  position: relative;
  .ats-input {
    position: relative;
    .el-select__caret {
      cursor: pointer;
      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }
  }

  .ats-tree-scrollbar {
    top: 40px;
    min-width: 260px;
    min-height: 180px;
    position: absolute;
    z-index: 1001;
    background: #fff;
    border: 1px solid #d1dbe5;
    .el-scrollbar__view {
      height: 180px;
    }
    transition: all 0.1s linear;
  }
  .ats-tree-wrapper {
    background-color: #fff;
  }
}
</style>
