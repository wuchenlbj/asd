<template>
  <div class="listwapper " :class="{hideSidebar:!sidetopbar.opened}">
    <div class="main-container">
      <el-row style='height:100%;'>
        <el-col v-show="condata.length>1" :span="3">
          <div class="navleft">
            <template v-for="(item,index) in this.condata">
              <div :key='index' :title='item.title' :index='index' @click="toRoute(index,item.url)" :class='{navdiv:true,activediv:curRoutename==item.title}'>
                <a class="spantitle">
                  <i class="el-icon-document"></i> {{item.title}}</a>
              </div>
            </template>
            <div class="helpcnt" v-html="helpCnt">
            </div>
          </div>
        </el-col>
        <!--判断生成的结构-->
        <el-col :span="condata.length<=1?24:21"  style="height:100%">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '../../components/bus'
export default {
  name: 'list',
  data() {
    return {
      condata: [], // 路由信息
      helpCnt:'' // 右侧模块相关帮助说明
    }
  },
  computed: {
    ...mapGetters(['sidetopbar', 'helpContent']),
    curRoutename: function() {
      return this.$route.name
    }
  },
  methods: {
    // 跳转
    toRoute(index, url) {
      this.$router.push({ path: url })
    },
    // 获取页面内容
    getChildList() {
      var parname = this.$route.matched[0].path
      var name = this.$route.matched[1].path
      this.condata = this.getRouterListInfo(parname, name)
      // console.info(this.condata)
    }
  },
  watch: {
    $route(to, from) {
      this.getChildList()
    },
    helpContent(val) {
      this.helpCnt = val
    }
  },
  mounted() {
    this.getChildList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
  .helpcnt {
    padding:0 20px;
    color:rgb(2, 4, 85);
    line-height: 30px;
    font-size: 12px;
  }
}
</style>
