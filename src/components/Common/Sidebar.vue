<template>
  <el-menu  ref="elmenu" mode="vertical"      text-color="#fff" active-text-color="#2d8cf0" :default-openeds="[preMenu]" :default-active="$route.path" @open="handleOpen">
    <sidebar-item :routes='permission_routers' rootUrl="home111"></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  name: 'Sidebar',
  components: { SidebarItem },
  data() {
    return {
      rootUrl: '',
      preMenu: null
    }
  },
  computed: {
    ...mapGetters(['permission_routers'])
  },
  mounted() {
    // GNM
    this.preMenu = this.$route.matched[0].name
      ? this.$route.matched[0].name
      : null
  },
  methods: {
    // GNM 更改菜单展示样式，改为手风琴模式
    handleOpen(key, keyPath) {
      if (this.preMenu) {
        this.$refs.elmenu.close(this.preMenu)
        this.preMenu = key
      } else {
        this.preMenu = key
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.sidebar-wrapper .el-menu {
  min-height: 100%;
}
</style>

