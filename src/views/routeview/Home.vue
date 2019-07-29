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
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { HeadNav, Bread, Sidebar } from 'common'

export default {
  name: 'home',
  data () {
    return {
      winheight: '100%'
    }
  },
  components: {
    HeadNav,
    Bread,
    Sidebar
  },
  methods: {
    setHeight () {
      var h = document.body.clientHeight
      this.winheight = h - 120
      this.$store.dispatch('SetrightHeight', this.winheight)
    }
  },
  mounted () {
    this.setHeight()
    window.onresize = () => {
      return (() => {
        this.setHeight()
      })()
    }
  },
  computed: {
    sidebar () {
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
    width: 190px;
    position: fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    transition: all 0.28s ease-out;

    .jss11 {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      display: block;
      position: absolute;
      background-size: cover;
      background-position: center center;
    }
    .jss11:after {
      width: 100%;
      height: 100%;
      z-index: 3;
      content: "";
      display: block;
      opacity: 0.8;
      position: absolute;
      background: #000;
    }
  }
  .sidebar-container {
    transition: all 0.28s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    right: -17px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .main-container {
    min-height: 100%;
    box-sizing: border-box;
    transition: all 0.28s ease-out;
    margin-left: 190px;
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
</style>


