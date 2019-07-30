import {
  constantRouterMap
} from '../../config/router'
import Cookies from 'js-cookie'
import {
  getPermissionData
} from '@/api/permission'

const _import = require('@/config/_import_' + process.env.NODE_ENV)

// 显示加载
const SHOW_LOADING = 'SHOW_LOADING'
// 关闭加载
const HIDE_LOADING = 'HIDE_LOADING'

const global = {
  state: {
    ajax_loading: false,
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    sidetopbar: {
      opened: !+Cookies.get('sidetopbarStatus')
    },
    rightHeight: 0,
    panelHeight: 0,
    routers: constantRouterMap, // 路由数据
    moduleid: Cookies.get('setmoduleid'),
    addRouters: [],
    helpContent: '' // 模块功能说明
  },

  mutations: {
    [SHOW_LOADING](state) {
      state.ajax_loading = true
    },

    [HIDE_LOADING](state) {
      state.ajax_loading = false
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    TOGGLE_SIDETOPBAR: state => {
      if (state.sidetopbar.opened) {
        Cookies.set('sidetopbarStatus', 1)
      } else {
        Cookies.set('sidetopbarStatus', 0)
      }
      state.sidetopbar.opened = !state.sidetopbar.opened
    },
    // 设置当前页面的moduleid
    SET_MODULID: (state, data) => {
      //  console.info('SET_MODULID:'+data)
      if (data) {
        state.moduleid = data
      } else {
        state.moduleid = ''
      }
    },
    // 设置路由
    SET_ROUTERS: (state, routers) => {
      // 递归处理component
      function recur(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].componentJson) {
            // console.info(data[i].componentJson)
            var componentJson = JSON.parse(data[i].componentJson)
            data[i].component = componentJson.component ? _import(componentJson.component) : _import('modules/NotFound')
            // 路径处理
            if (data[i].isparent) {
              data[i].path = componentJson.path
            }
            // 菜单下拉
            if (componentJson.noDropdown == true) {
              data[i].noDropdown = true
            }
            // 图标
            if (componentJson.icon) {
              data[i].icon = componentJson.icon
            }
            // 描述
            if (componentJson.detail) {
              data[i].redirect = componentJson.detail
            }
            // 节点隐藏
            if (componentJson.hasOwnProperty('hidden') && componentJson.hidden === true) {
              data[i].hidden = true
            }
            // 单一节点
            if (componentJson.noDropdown == true) {
              data[i].noDropdown = true
            }
            // 是否转向
            if (componentJson.redirect) {
              data[i].redirect = componentJson.redirect
            }
          }
          if (data[i].children.length > 0) {
            data[i].children = recur(data[i].children)
          }
        }
        return data
      }
      var routs = recur(routers)
      state.addRouters = routs//constantRouterMap.concat(routs) // 此处不用合并，在进入系统时，静态路由已添加
      // 默认静态路由跟数据库数据合并
      state.routers = constantRouterMap.concat(routs)
    },
    SET_RIGHTHEIGHT: (state, data) => {
      state.rightHeight = data
    },
    SET_PANELHEIGHT: (state, data) => {
      state.panelHeight = data
    },
    SET_HELPCONTENT: (state, data) => {
      state.helpContent = data
    }
  },
  actions: {
    SetHelpContent: ({
      commit
    }, data) => {
      commit('SET_HELPCONTENT', data)
    },
    // 存储窗体高度
    SetrightHeight: ({
      commit
    }, data) => {
      commit('SET_RIGHTHEIGHT', data)
    },
    // 存储窗体高度
    SetPanelHeight: ({
      commit
    }, data) => {
      commit('SET_PANELHEIGHT', data)
    },

    // 获取数据库权限数据
    GetPermissionData: ({
      commit
    }) => {
      return new Promise(function (resolve, reject) {
        getPermissionData().then(response => {
          commit('SET_ROUTERS', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置传递的模块id
    SetActiceModuleid({
      commit
    }, data) {
      if (data) {
        Cookies.set('setmoduleid', data)
        commit('SET_MODULID', data)
      }
    },
    show_loading: ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        commit(types.SHOW_LOADING)
        resolve()
      })
    },
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR')
    },
    ToggleSideTopBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDETOPBAR')
    },
    hide_loading: ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        commit(types.HIDE_LOADING)
        resolve()
      })
    }

  }
}

export default global
