<template>
  <div class="listwapper " :class="{hideSidebar:!sidetopbar.opened}">
    <multipane class="horizontal-panes" layout="horizontal" @paneResizeStop="paneresizestop">
      <div class="pane" :style="{ minHeight: '50px', height: tableheight +'px',maxHeight:'99%'  }">
        <!-- 内容区域 -->
        <XmTree class="top-container" :tableheight="tableheight" showExport :xls-name="curRoutename" :title-name="titleName"></XmTree>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane">
        <!-- 内容区域 -->
        <div :style="{height:bottomPanelHeight+'px'}">
          <el-row style='margin-top:10px;height:100%'>
            <el-col v-show="condata.length>1" :span="2">
              <div class="navleft">
                <template v-for="(item,index) in this.condata">
                  <div :key='index' :title='item.title' :index='index' @click="toRoute(index,item.url)" :class="{navdiv:true,activediv:curRoutename==item.title}">
                    <i class="el-icon-document"></i> {{item.title}}</div>
                </template>
              </div>
            </el-col>
            <!--判断生成的结构-->
            <el-col :span="condata.length<=1?24:22">
              <router-view></router-view>
            </el-col>

          </el-row>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XmTree } from 'common'
import { Multipane, MultipaneResizer } from 'vue-multipane'

export default {
  name: 'list',
  components: {
    XmTree,
    Multipane,
    MultipaneResizer
  },
  data() {
    return {
      tableheight: 300,
      bottomPanelHeight: '30%',
      user_list: [], // 用户列表数组
      batch_id: '', // 批量删除时这是多个用逗号隔开的id字符串
      batch_flag: true, // 符合批量删除为true,否则为false
      indexdiv: '',
      condata: [] // 路由信息
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidetopbar', 'rightHeight']),
    curRoutename: function() {
      return this.$route.name // GNM 同时作为导出的文件名
    },

    titleName: function() {
      // 生成标题名
      return this.$route.name.includes('统计')
      ? this.$route.name
      : this.$route.name + '统计'
    }
  },
  methods: {
    setHeight() {
      this.tableheight = parseInt(this.rightHeight * 0.55)
      this.bottomPanelHeight = this.rightHeight - this.tableheight - 10
      this.$store.dispatch('SetPanelHeight', this.bottomPanelHeight)
    },
    paneresizestop(pane, container, size) {
      var s = parseInt(size.substring(0, size.length - 2)) - 20
      this.tableheight = s
      this.setHeight()
    },
    // 跳转
    toRoute(index, url) {
      this.indexdiv = index
      this.$router.push({ path: url })
    },
    // 获取页面内容
    getChildList() {
      var parname = this.$route.matched[0].path
      var name = this.$route.matched[1].path
      this.condata = this.getRouterListInfo(parname, name)
    }
  },
  watch: {
    $route(to, from) {
      this.getChildList()
    },
    rightHeight(val) {
      this.setHeight()
    }
  },
  mounted() {
    this.getChildList()
    this.setHeight()
  }
}
</script>
<style lang="scss">
.horizontal-panes {
  width: 100%;
  height: 100%;
  // border: 1px solid #ccc;
}
.horizontal-panes > .pane {
  text-align: left;
  overflow: hidden;
  // background: #eee;
}

.horizontal-panes > .multipane-resizer {
  margin: 0;
  left: 0;
  position: relative;
  &:before {
    display: block;
    content: '';
    width: 40px;
    height: 3px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -20px;
    margin-top: -3px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  &:hover {
    &:before {
      border-color: #999;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.listwapper {
  position: relative;
  height: 100%;
  width: 100%;

  .top-container {
    transition: all 0.28s ease-out; // background-color: #ccc;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0px;
    overflow-y: hidden;
    overflow-x: hidden;
  }
}
.navleft {
  width: 100%;
}

.navdiv {
  width: 98%;
  height: 35px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  background: #e6e5e5;
  color: #666;
  cursor: pointer;
  line-height: 35px;
  margin-top: 5px;
  padding-left: 10px;
  border-radius: 4px;
}

.navleft > div:hover {
  color: white;
  background-color: #ccc;
}

.activediv {
  -webkit-transition: all 0.4s linear;
  -moz-transition: all 0.4s linear;
  -ms-transition: all 0.4s linear;
  -o-transition: all 0.4s linear;
  transition: all 0.4s linear;
  padding-left: 20px;
  background: #aad4ff !important;
  color: white;
  font-size: 14px;
}
</style>
