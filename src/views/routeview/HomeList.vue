<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="head-wrapper">
      <HeadNav></HeadNav>
    </div>

    <div class="sidebar-wrapper">
      <Sidebar class="sidebar-container" />
    </div>

    <div class="main-container">
      <Bread/>
      <div id="rightContainer" class="right-container" :style="{height:winheight+'px'}">
        <div class="listwapper " :class="{hideSidebar:!sidetopbar.opened}">

          <div class="main-container">
            <el-row style=''>
              <el-col v-show="condata.length>1" :span="3">
                <div class="navleft">
                  <template v-for="(item,index) in this.condata">
                    <div :key='index' :title='item.title' :index='index' @click="toRoute(index,item.url)" :class='{navdiv:true,activediv:curRoutename==item.title}'>
                      <a class="spantitle">
                        <i class="el-icon-document"></i> {{item.title}}</a>
                    </div>
                  </template>
                </div>
              </el-col>
              <!--判断生成的结构-->
              <el-col v-if="condata.length<=1" :span="24">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
              </el-col>
              <el-col v-else :span="21">
                <router-view></router-view>
              </el-col>
            </el-row>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { HeadNav, Bread, Sidebar } from 'common'

export default {
  name: 'home',
  data() {
    return {
      condata: [], // 路由信息
      winheight: '100%'
    }
  },
  components: {
    HeadNav,
    Bread,
    Sidebar
  },
  methods: {
    // 跳转
    toRoute(index, url) {
      this.$router.push({ path: url })
    },
    // 获取页面内容
    getChildList() {
      var parname = this.$route.matched[0].name
      var name = this.$route.matched[1].name
      this.condata = this.getRouterListInfo(parname, name)
    },
    setHeight() {
      var h = document.body.clientHeight
      this.winheight = h - 120
      this.$store.dispatch('SetrightHeight', this.winheight)
    }
  },
  mounted() {
    this.setHeight()
    window.onresize = () => {
      return (() => {
        this.setHeight()
      })()
    }
  },
  watch: {
    '$route'(to, from) {
      this.getChildList()
    }
  },
  computed: {
    ...mapGetters([
      'sidetopbar'
    ]),
    curRoutename: function() {
      return this.$route.name
    },
    sidebar() {
      return this.$store.state.global.sidebar
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.hideSidebar {
    .sidebar-wrapper {
      transform: translate(-140px, 0);
      .sidebar-container {
        transform: translate(132px, 0);
      }
      &:hover {
        transform: translate(0, 0);
        .sidebar-container {
          transform: translate(0, 0);
        }
      }
    }
    .main-container {
      margin-left: 40px;
    }
  }
  .head-wrapper {
    height: 80px;
    width: 100%;
    position: fixed;
    z-index: 1999;
    top: 0;
    left: 0;
  }
  .sidebar-wrapper {
    width: 180px;
    position: fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    transition: all 0.28s ease-out;
  }
  .sidebar-container {
    transition: all 0.28s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -17px;
    overflow-y: scroll;
  }
  .main-container {
    min-height: 100%;
    box-sizing: border-box;
    transition: all 0.28s ease-out;
    margin-left: 180px;
    margin-top: 80px;
    .right-container {
      height: 600px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 5px 0 0 0;
    }
  }
}
.listwapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .main-container {
    transition: all 0.28s ease-out; // margin-left: 180px;
    position: relative;
    height: 100%;
    overflow-y: auto;
  }
}

.navleft {
  width: 100%;
  .navdiv {
    width: 95%;
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
}
</style>

 
