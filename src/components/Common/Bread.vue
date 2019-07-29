<!--菜单导航组件 -->

<template>
  <el-menu class="navbar" mode="horizontal">

    <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></Hamburger>
    <el-breadcrumb separator="/" class='el-bread'>
      <el-breadcrumb-item v-if="$route.matched.length>2" :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item class="crumbitem" v-if="item.name" v-for='(item,index) in $route.matched' :key='index'>{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <screenfull class='screenfull'></screenfull>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from './Hamburder'
import Screenfull from './Screenfull'
export default {
  components: {
    Hamburger,
    Screenfull
  },
  data() {
    return {
      strong: ''
    }
  },
  // watch: {
  //   $route(to, from) {
  //     console.info(this.$route.matched)
  //   }
  // },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    // 左侧菜单伸缩
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    getPageText(name) {
      return name = name.replace('编辑', this.$route.query.id ? '修改' : '添加')
    }
  }
}
</script>
 

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  color: #484744;
  background: #f8f6f2;
  border-radius: 0px !important;
  .el-bread {
    display: inline-block;
    float: left;
    outline: none;
    text-align: right;
    line-height: 40px;
  }
  .hamburger-container {
    line-height: 50px;
    height: 30px;
    float: left;
    padding: 0 10px;
    outline: none;
  }

  .screenfull {
    position: absolute;
    right: 15px;
    top: 6px;
    outline: none;
  }
}
</style>
