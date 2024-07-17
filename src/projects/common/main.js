import Vue from 'vue'
/**
 * normalize.css
 * 保留有用的默认值，不同于许多 CSS 的重置
 * 标准化的样式，适用范围广的元素。
 * 纠正错误和常见的浏览器的不一致性。
 * 一些细微的改进，提高了易用性。
 * 使用详细的注释来解释代码。
 */
import VueWorker from 'vue-worker'
import 'normalize.css/normalize.css'

import locale from 'element-ui/lib/locale/lang/zh-CN' // 引入element语言包
import '@/app/font_u3mkqq03ywc/iconfont.css' // 引入外部小图标css
import '@/app/font_3504012_l8dtwawve9s/iconfont.css' // 引入外部小图标css
import '@/app/font_3390012_gapvtcyjdao/iconfont.css' // 引入外部小图标css
import '@/styles/draggableMsg.css'
import App from './App' // 小图片的包
import router from './router' // 引入公共路由模块
import store from '@/store' // 引入公共缓存模块
import dayjs from 'dayjs' // 时间的处理模块
// import '@/assets/CA/multibrowser.js'
// import '@/assets/CA/ca.js'
import { getDictItemList, getParams, queryParam, batchGetDictItemList } from '@/utils/utils' // 时间的处理模块
import '@/icons' // icon svg的模块
import './permission' // 也是公共处理js
import * as filters from '@/filters' // 过滤的一些方法
import directive from '@/directive'
import components from '@/components'
import Print from '@/assets/printarea.js'
import Visibility from '@/assets/visibility.js'
import { handleTree, headerdragend } from '@/utils/ruoyi'
import { linkBtnHasPerm } from '@/utils/linkBtnHasPerm'
import { btnHasPerm } from '@/utils/btnHasPerm'
import 'vue-context/src/sass/vue-context.scss'
// import htmlToPdf from '@/components/utils/htmlToPdf' // 导出pdf 有用,先放着
import VueCompositionAPI from '@vue/composition-api'
// import WinningWinfromMenu from '@winning-plugin/winning-titles'
import ElementUI from 'element-ui' // 主要的pc端ui框架
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'small',
  locale
})
import '@/styles/index.scss' // 公共css设置
Vue.use(components)
Vue.use(Visibility)
Vue.use(VueCompositionAPI)
Vue.use(VueWorker)
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return dataStr ? dayjs(dataStr).format(pattern) : ''
})
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$dayjs = dayjs
Vue.prototype.$getDictItemList = getDictItemList
Vue.prototype.$batchGetDictItemList = batchGetDictItemList
Vue.prototype.$batchGetValidDictItemList = function (dictGroupCodeList) {
  return batchGetDictItemList(dictGroupCodeList, 'valid')
}
Vue.prototype.$getParams = getParams
Vue.prototype.$queryParam = queryParam
Vue.prototype.$linkBtnHasPerm = linkBtnHasPerm
Vue.prototype.$btnHasPerm = btnHasPerm

Vue.prototype.$handleTree = handleTree
Vue.prototype.$headerdragend = headerdragend

Vue.prototype.$print = function (options) {
  new Print(options)
}
Vue.use(directive)
// 内存释放
const cleanVnode = (vnode) => {
  if (vnode) {
    vnode._renderChildren = null
    vnode.children = null
    vnode.componentOptions = null
  }
}

Vue.mixin({
  destroyed() {
    cleanVnode(this._vnode)
    cleanVnode(this.$vnode)
  }
})
Vue.config.productionTip = false // ;
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})
