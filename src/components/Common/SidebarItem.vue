<template>
  <div>
    <!-- 经典模式 -->
    <div v-if="ishidden">
      <template v-for="(item,index) in this.routes">
        <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden&&item.children.length>0" :key="index">
          <template slot="title">
            <icon-svg :icon-class="item.icon" />
            <span> {{item.name}}</span>
          </template>
          <template v-for="child in item.children" v-if='!child.hidden&&!child.lastchild'>
            <!-- <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.name"> </sidebar-item> -->
            <el-menu-item @click="goRouter(child)" :class="{'cur-active': child.name==curRoutename}" :key="child.name" :index="child.path">
              <icon-svg :icon-class="child.icon" /> {{child.name}}
            </el-menu-item>
          </template>
        </el-submenu>
        <a v-else-if="!item.hidden&&item.children.length==0||item.noDropdown" @click="goRouter(item)" :key="index">
          <el-menu-item :index="item.path" class="m-item">
            <icon-svg :icon-class="item.icon" /> {{item.name}}1
          </el-menu-item>
        </a>
      </template>

    </div>
    <div v-else>
      <!-- 炫动模式 -->
      <div class="lefttitle">
        <span @click="goback">
          <icon-svg class="svgback" icon-class="fanhui" />
        </span> &nbsp;&nbsp; {{lefttitle}}</div>
      <el-row class='tac2' v-for="(obj,index) in steps" :key='index'>
        <el-col :span="24">
          <div v-bind:class="{list:true ,activediv:obj.name==lefttitle}" @click="goRouter(obj)">
            <span :class="bigiconClass">
              <icon-svg :icon-class="obj.icon" :bigicon="bigicon" />
            </span>
            <span :class="bigicontextClass">{{obj.name}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  data () {
    return {
      backgroundColor: '',
      clickName: '',
      lefttitle: '',
      indexdiv: '',
      steps: [], // 列表项
      bigicon: false,
      bigiconClass: '',
      bigicontextClass: '',
      ishidden: false
    }
  },
  props: {
    routes: {
      type: Array
    }
  },
  methods: {
    showmenucolor (item) {
      this.clickName = item.name
      // console.info(item.name,this.curRoutename)
      this.$el.querySelector('li').style.backgroundColor = '#2d8cf0'
      // this.$el.style.backgroundColor = '#2d8cf0'
    },
    onMouseEnter () {
      // this.$el.querySelector('li').style.backgroundColor = '#2d8cf0'
      // this.$el.style.backgroundColor = '#2d8cf0'
      //  this.backgroundColor ='#2d8cf0'
    },
    onMouseLeave (item) {
      // this.$el.style.backgroundColor = ''
      // this.backgroundColor = ''
    },
    // 路由跳转方法
    goRouter (router) {
      // console.log(router)
      this.$store.dispatch('SetActiceModuleid', router.moduleid).then(() => {
        // 生成可访问的路由表
        if (!router.moduleid) {
          console.log('moduleid获取为空')
        }
        if (!router.path) {
          console.log('注册地址为空')
        }
        // console.info(router)
        this.$router.push({ path: router.path })
      })
    },
    goback () {
      this.$router.push('/homedetail')
    },
    updateCurMenu (route) {
      var theme = localStorage.theme // 1.经典 0 炫动

      route = route || this.$route
      if (route.matched.length) {
        var rootPath = route.matched[0].path,
          fullPath = route.matched[1].path
        // 设置当前路由
        // this.$store.dispatch('set_cur_route', {
        //   rootPath,
        //   fullPath
        // })

        // 1.经典 0 炫动
        if (theme === '0') {
          this.ishidden = false
          this.bigicon = true
          this.bigiconClass = 'bigiconClass'
          this.bigicontextClass = 'bigicontextClass'
          this.lefttitle = route.matched[1].name // 获取类型名称
          this.steps = []
          // 过滤获取菜单
          this.routes.filter(v => {
            if (route.matched[0].name === v.name) {
              v = v.children.filter(child => {
                if (child.path.indexOf('/') > -1) {
                  this.steps.push(child)
                } else {
                  this.steps.push(child)
                }
              })
              return v
            }
          })
        } else {
          this.ishidden = true
        }
      } else {
        this.ishidden = true
      }
    }
  },
  created () {
    this.updateCurMenu()
  },
  computed: {
    curRoutename: function () {
      return this.$route.matched[1].name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cur-active {
  background-color: #2d8cf0 !important;
  color: #fff !important;
}
.fa {
  margin-right: 10px;
}

.fa2 {
  margin-right: 4px;
}

.wscn-icon {
  margin-right: 10px;
}

.hideSidebar .menu-indent {
  display: block;
  text-indent: 10px;
}

.lefttitle {
  color: #f8f6f2;
  line-height: 50px;
  // background-color: rgb(73, 86, 106);
  font-size: 1.2em;
  text-align: center;
}

.list {
  width: 120px;
  height: 120px;
  background: #a5a5a5;
  color: white;
  text-align: center;
  vertical-align: middle;
  margin: 10px auto; // line-height: 150px;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: pointer;
}

.list:hover {
  background: #70ad47;
}

.activediv {
  background: #70ad47;
}

.bigiconClass {
  display: block;
  height: 90px;
  padding-top: 15px;
}

.bigicontextClass {
  display: block;
  height: 30px;
  width: 100%;
}
.svgback {
  cursor: pointer;
}
.svgback:hover {
  color: #70ad47;
}
</style>

