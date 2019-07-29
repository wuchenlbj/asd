// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/' // vuex store状态管理
import router from 'src/config/router' // 路由配置文件

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'mini'
})
Vue.config.productionTip = false;

// v-dialogDrag: 弹窗拖拽  v-dialogDrag
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    const closeBtn = el.querySelector('.el-dialog__headerbtn')
    closeBtn.style = 'height: 31px;width: 40px;line-height: 31px;top:-1px;right:-1px;'
    // closeBtn.children[0].style = 'color:white;'
    // vnode.componentInstance.lockScroll = false
    dragDom.style.marginTop = '15vh'
    dialogHeaderEl.style = 'padding:15px 40px 10px;cursor:move;border: 1px solid #e2e2e4;background: url("../../../public/images/logo.png") 5px 10px no-repeat;background-size:30px 30px;'
    // dialogHeaderEl.style.backgroundColor = "blue";
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

require('swiper/dist/css/swiper.css')
import VueAwesomeSwiper from 'vue-awesome-swiper' // 首页轮播
Vue.use(VueAwesomeSwiper)

import '@/assets/css/index.scss' // 全局自定义的css样式
import NProgress from 'nprogress' // 页面顶部进度条  进度条插件
import 'nprogress/nprogress.css'
import './icons' // icon
import 'animate.css/animate.min.css' // 动画css
import {
  getToken
} from '@/utils/auth' // 验权
import * as filters from '@/config/filter' // 全局vue filter
Vue.config.productionTip = false

// 引入一些外部插件
import $ from '../public/webupload22/js/jquery'
import '../public/zTree/js/jquery.ztree.all.min.js'

// 将方法注册到全局过滤器中去
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'] // 不重定向白名单

//  1登陆判断
router.beforeEach((to, from, next) => {
  NProgress.start()

  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      if (Object.keys(store.getters.login).length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          const login = res.data.Login
          if (login === undefined) {
            next({
              path: '/login'
            })
          }
          // 获取用户信息之后再获取用户权限菜单
          store.dispatch('GetPermissionData', {
            login
          }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            // next(to.path) // hack方法 确保addRoutes已完成 ...
            // console.info(to)
            try {
              next({
                ...to,
                replace: true
              })
            } catch (e) {
              next(to.path)
            }
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            this.$message.error('验证失败，请重新登录')
            next({
              path: '/login'
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

// 路由完毕关闭进度条
router.afterEach(transition => {
  NProgress.done()
})

new Vue({
  el: '#app',
  router,
  store, // 单一状态树state
  render: h => h(App)
})

// 获取路由信息
Vue.prototype.getRouterListInfo = function (parentPath, path) {
  var tpmrouter = []
  store.getters.addRouters.filter(v => {
    if (parentPath === v.path) {
      v = v.children.filter(child => {
        if (path === child.path) {
          if (child && child.children.length > 0) {
            for (var p in child.children) {
              // console.info(child.children[p])
              if (child.children[p].path) {
                tpmrouter.push({
                  url: child.path + '/' + child.children[p].path,
                  title: child.children[p].name
                })
              }
            }
          }
        }
      })
      return v
    }
  })

  return tpmrouter
}
