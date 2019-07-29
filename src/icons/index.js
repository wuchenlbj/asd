import Vue from 'vue'
import IconSvg from '@/components/Common/Icon-svg'// svg组件
import generateIconsView from '@/components/Common/Icon-svg/generateIconsView.js'// just for views/icons , you can delete it

import '@/assets/iconfont/iconfont' // 字体图标
import '@/assets/font-awesome/css/font-awesome.min.css' // 字体图标css

// register globally
Vue.component('icon-svg', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
const iconMap = requireAll(req)

generateIconsView.generate(iconMap) // just for views/icons , you can delete it
