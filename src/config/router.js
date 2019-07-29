import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const _import = require('./_import_' + process.env.NODE_ENV)

import changepwd from '@/components/Common/changepwd.vue'
import Home from 'views/routeview/Home'

function getComponent(name) {
  return ''
}

export const constantRouterMap = [
  {
    path: '/login',
    component: _import('Login'),
    name: '登录页面',
    hidden: true
  },
  {
    path: '/homedetail',
    name: 'homedetail',
    hidden: true,
    component: _import('modules/HomeDetail')
  },
  {
    path: '',
    component: Home,
    hidden: true,
    redirect: 'dashboard',
    children: [{
      name: '首页',
      path: 'dashboard',
      component: _import('modules/DashBoard')
    }]
  },
  {
    hidden: true,
    path: '/rtcnt',
    component: _import('routeview/Home'),
    children: [{
      path: '',
      name: '路由信息',
      component: _import('routeview/routerContent')
    }]
  },
  {
    path: '/changepwd',
    hidden: true,
    component: _import('routeview/Home'),
    children: [{
      path: '',
      name: '修改密码',
      icon: 'shenbao',
      component: changepwd
    }]
  },
  // 会议纪要 更新日志
  {
    path: '/changelog',
    hidden: true,
    component: _import('routeview/Home'),
    children: [{
      path: '',
      name: '更新日志',
      icon: 'shenbao',
      component: _import('changelog')
    }]
  },
  {
    path: '/errorpage',
    component: _import('routeview/Home'),
    hidden: true,
    icon: '404',
    children: [{
      path: '',
      name: '错误页面',
      component: _import('modules/NotFound')
    }]
  },
  {
    path: '/404',
    name: '错误页面1',
    component: _import('modules/NotFound'),
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
