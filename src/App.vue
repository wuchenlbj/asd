<template>
  <transition name="el-fade-in-linear">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  name: 'app',
  watch: {
    $route(to, from) {
      if (!to.matched.length) {
        this.$router.push('/404')
      }
    }
  }
}

// const closeBtn = el.querySelector('.el-dialog__headerbtn')
// closeBtn.style = 'height: 31px;width: 40px;line-height: 31px;background:red;top:0px;right:0px;'
// closeBtn.children[0].style = 'color:white;'
</script>
<style >
html,
body {
  color: #484744;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  padding-right: 0 !important;
}

</style>

