<template>
  <div style="width:100%;">
    <h4 style="text-align:center">当前路由信息</h4>
    <el-tabs v-model="activeName">
      <el-tab-pane label="数据库注册信息" name="dbinfo">
        <tree-grid :tableHeight="rightHeight - 140" :autoSerial="true" :tableData="tbDataDB" :columns="columnsDB"></tree-grid>
      </el-tab-pane>
      <el-tab-pane label="VueRouter内容" name="vuerouter">
        <tree-grid :tableHeight="rightHeight - 140" :autoSerial="true" :tableData="tbDataRouter" :columns="columnsDB"></tree-grid>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import store from '@/store/' // vuex store状态管理
import router from '../../config/router' // 路由配置文件
import { TreeGrid } from '../../components/Common/treegrid'
import { mapGetters } from 'vuex'
// import { getPermissionData } from 'api/permission'
import { constantRouterMap } from '../../config/router'
const _import = file => {
  return 'views/' + file + '.vue'
}

export default {
  name: 'routerContent',
  components: {
    TreeGrid
  },
  computed: {
    ...mapGetters(['rightHeight'])
  },
  data() {
    return {
      activeName: 'dbinfo',
      routerJson: null,
      // 不同级别的模块，配置不同的字段名
      // 后面根据此配置生成tbData
      levelProp: {
        '1key': 'name',
        '1value': 'component',
        '2key': 'subname',
        '2value': 'subpath',
        '3key': 'cmpname',
        '3value': 'cmppath'
      },
      columnsDB: [],
      tbDataDB: [],
      columnsRouter: [],
      tbDataRouter: []
    }
  },
  methods: {
    prepareDataDB(data, level) {
      let routers = []
      data.forEach(item => {
        let rtObject = {}
        rtObject.level = level
        let lvtmp = level //> 2 ? level - 1 : level
        // 首先处理从数据库中获取的内容
        if (item.moduleid) {
          let componentJson = JSON.parse(item.componentJson)
          // 根据level属性，配置模块层次关系
          rtObject[this.levelProp[lvtmp + 'key']] = item.name
          rtObject[this.levelProp[lvtmp + 'value']] = componentJson.component
            ? _import(componentJson.component)
            : _import('modules/NotFound')
          if (item.children && item.children.length === 1) {
            // 右边直接显示具体模块，直接配置不再循环
            let childJson = JSON.parse(item.children[0].componentJson)
            rtObject[this.levelProp[lvtmp + 'value']] = childJson.component
          }
        } else {
          // 读取静态路由信息
          rtObject[this.levelProp[lvtmp + 'key']] =
            item.name || item.path || '/'
          rtObject[this.levelProp[lvtmp + 'value']] = item.component.__file
          if (!item.children) {
            // 如果没有children对象则读取组件信息
            // console.log(item.component.components)
            if (item.component.components) {
              let keyStr = '',
                valStr = ''
              for (const itemObj of Object.keys(item.component.components)) {
                keyStr += keyStr === '' ? itemObj : '\n' + itemObj
                valStr +=
                  valStr === ''
                    ? item.component.components[itemObj].__file
                    : '\n' + item.component.components[itemObj].__file
              }
              rtObject[this.levelProp['3key']] = keyStr
              rtObject[this.levelProp['3value']] = valStr
            }
          }
          // rtObject.name
        }
        // 没有children或二级菜单下只有一个模块时不循环，前面已处理
        if (item.children && !(item.children.length === 1 && level === 2)) {
          rtObject.children = this.prepareDataDB(item.children, level + 1)
        }
        routers.push(rtObject)
      })
      return routers
    },
    prepareDataRoutes(rotersInfo, level) {
      let routers = []
      rotersInfo.forEach(item => {

      })
    },
    setCloumns() {
      this.columnsDB = [
        {
          label: '模块名称',
          prop: this.levelProp['1key'],
          expand: true
        },
        {
          label: '路由地址',
          prop: this.levelProp['1value']
        },
        {
          label: '菜单名称',
          prop: this.levelProp['2key']
        },
        {
          label: '菜单路由',
          prop: this.levelProp['2value']
        },
        {
          label: '组件名称',
          prop: this.levelProp['3key']
        },
        {
          label: '组件地址',
          prop: this.levelProp['3value']
        }
      ]
      this.columnsRouter = [
        {
          label: '模块名称',
          prop: this.levelProp['1key'],
          expand: true
        },
        {
          label: '路由地址',
          prop: this.levelProp['1value']
        },
        {
          label: '文件地址',
          prop: this.levelProp['2key']
        },
        {
          label: '菜单路由',
          prop: this.levelProp['2value']
        },
        {
          label: '组件名称',
          prop: this.levelProp['3key']
        },
        {
          label: '组件地址',
          prop: this.levelProp['3value']
        }
      ]
    }
  },
  created() {},
  mounted() {
    this.setCloumns()
    // console.log(store.getters.addRouters)
    console.info(router)
    this.tbDataDB = this.prepareDataDB(
      constantRouterMap.concat(store.getters.addRouters),
      1
    ) //
    // getPermissionData()
    //   .then(response => {
    //     //
    //     console.log(store.getters.addRouters)
    //     this.tbData = this.prepareDataDB(store.getters.addRouters, 1) //
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
