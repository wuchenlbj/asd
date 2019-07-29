<template>
  <div class="left" :class="{leftborder:isActive}" id='admin-left'>
    <!-- 经典模式 -->
    <div id='left-menu' v-bind:class="{ ishidden: isActive}">
      <el-row class='tac' v-for="(route,index) in $router.options.routes" :key='index' v-if='!route.hidden && $route.matched.length && $route.matched[0].path===route.path'>
        <el-col :span="24">
          <el-menu class="el-menu-vertical-demo" theme="dark" :default-active="$route.path" unique-opened router>

            <template v-for="(item,index) in route.children" v-if="!item.hidden">
              <el-submenu :index="item.path">
                <template slot="title">
                  <el-tooltip class="item" effect="dark" placement="right" :disabled="$store.state.leftmenu.menu_flag" :content="item.name">
                    <i :class="'fa fa-'+item.icon"></i>
                  </el-tooltip>
                  <span class='menu-name' v-if="$store.state.leftmenu.menu_flag">{{item.name}}</span>
                </template>

                <el-menu-item v-for='(child,cindex) in item.children' :key='cindex' v-if="!child.hidden" :style="{'padding-left':$store.state.leftmenu.menu_flag? '40px' : '23px'}" :index='$store.state.router.headerCurRouter+"/"+item.path+"/"+child.path'>
                  <el-tooltip class="item" effect="dark" placement="right" :disabled="$store.state.leftmenu.menu_flag" :content="child.name">
                    <i :class="'fa fa-'+child.icon"></i>
                  </el-tooltip>
                  <span class='menu-name' v-if="$store.state.leftmenu.menu_flag">{{child.name}}
                  </span>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <!-- 炫动模式 -->
    <div id="leftmenu2" v-bind:class="{ active: !isActive}" style='margin-top:20px;'>
      <div class="lefttitle">{{lefttitle}}</div>
      <el-row class='tac2' v-for="(obj,index) in steps" :key='index'>
        <el-col :span="24">
          <div v-bind:class="{list:true ,activediv:indexdiv==index}" v-on:click="dorouter(obj.url,index)">{{obj.title}} </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "left-menu",
  data() {
    return {
      lefttitle: "",
      indexdiv: "",
      isActive: true,
      menu_list: [],
      steps: [] //列表项

    }
  },
  methods: {

    updateCurMenu(route) {
      var theme = localStorage.theme; // 1.经典 0 炫动

      var route = route || this.$route;
      if (route.matched.length) {
        var rootPath = route.matched[0].path,
          fullPath = route.path;
        //设置当前路由
        this.$store.dispatch("set_cur_route", {
          rootPath,
          fullPath
        });

        if (theme === "0") {
          this.isActive = true;
          this.steps = [];
          var parentName = route.matched[1].name; //获取类型名称

          for (
            var i = 0, mm = this.$router.options.routes.length;
            i < mm;
            i++
          ) {
            if (this.$router.options.routes[i].path === "/home") {
              var rous = this.$router.options.routes[i].children; //node1
              for (var j = 0; j < rous.length; j++) {
                if (rous[j].name === parentName) {
                  this.lefttitle = parentName;
                  var childs = rous[j].children; //当前所属列表

                  for (var p = 0; p < childs.length; p++) {
                    if (!childs[p].hidden) {
                      this.steps.push({
                        url: "/home/" + rous[j].path + "/" + childs[p].path,
                        title: childs[p].name
                      });
                    }
                  }
                }
              }
            }
          }
        } else {
          this.isActive = false;
          var routes = this.$router.options.routes;
          for (var i = 0; i < routes.length; i++) {
            if (routes[i].path === rootPath && !routes[i].hidden) {
              this.menu_list = routes[i].children;
              break
            }
          }
        }
      } else {
        this.$router.push("/404");
      }
    }
  },
  created() {
    this.updateCurMenu();
  },
  mounted() { },
  watch: {
    $route(to, from) {  
      this.updateCurMenu(to)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fa {
  margin-right: 8px;
}

.left-fixed-right-auto {
  padding-top: 60px;
}

.right-content {
  float: right;
  width: 100%;
}

#left-menu {
  height: 100%;
  background: #324057;
  position: relative;
  overflow-x: hidden;
}

.ishidden {
  display: none;
}

.leftborder {
  border: 2px solid #ffc000;
}

.lefttitle {
  color: #20a0ff;
  line-height: 30px;
  font-size: 1.3em;
  text-align: center;
}

.list {
  width: 150px;
  height: 150px;
  background: #a5a5a5;
  color: white;
  text-align: center;
  vertical-align: middle;
  margin: 1px auto;
  line-height: 150px;
  font-size: 1.3em;
  cursor: pointer;
}

.list:hover {
  background: #70ad47;
}

.activediv {
  background: #70ad47;
}
</style>
