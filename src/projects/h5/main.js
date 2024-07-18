import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs' // 时间的处理模块
import '@/icons' // icon svg的模块
import './permission' // 公共处理js
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/styles/h5.scss'

import components from '@/components'
import { getDictItemList, getParams, queryParam, batchGetDictItemList } from '@/utils/utils' // 时间的处理模块
Vue.use(components)
// 注册组件后即可使用
Vue.use(Vant)
Vue.prototype.$dayjs = dayjs
Vue.prototype.$h5 = true
// Vue.prototype.$my = my
Vue.prototype.$isWinMY = /mmcp/.test(window.navigator.userAgent.toLowerCase())
Vue.prototype.$getDictItemList = getDictItemList
Vue.prototype.$batchGetDictItemList = batchGetDictItemList
Vue.prototype.$batchGetValidDictItemList = function (dictGroupCodeList) {
  return batchGetDictItemList(dictGroupCodeList, 'valid')
}
Vue.prototype.$getParams = getParams
Vue.prototype.$queryParam = queryParam

Vue.config.productionTip = false
Vue.use(ElementUI, {
  locale
})
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  // 时间格式化
  return dataStr ? dayjs(dataStr).format(pattern) : ''
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})
