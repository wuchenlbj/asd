<!-- 项目清单-汇总查看 -->
<template>
  <div class="jfsb">

  </div>
</template>

<script >
import { mapGetters } from "vuex";
import msg from "utils/loadmsg";

export default {
  name: 'bbgl',
  computed: {
    ...mapGetters(["xmxxRow", "xmxxSelectRow"])
  },
  watch: {
    xmxxSelectRow: function (rows) {
      this.getXMXX(rows)
    }
  },
  data() {
    return {
      space: 300,
      active: 0
    }
  },
  methods: {
    getXMXX(rows) {
      // console.info(rows)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jfsb {
  padding-left: 20px;
  margin-top: 10px;
}

.title {
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  padding-left: 20px;
  margin-bottom: 20px;
}
</style>
