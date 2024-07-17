import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}
import wardOverview from './wardOverview' // 病区概括路由
import configuration from './configuration' // 配置管理路由

export const indexRouter = [
  {
    path: '/',
    name: 'root',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    hidden: true
  },
  {
    path: '/login/:role',
    name: 'loginRole',
    hidden: true
  },
  {
    path: '/404',
    hidden: true
  },
  {
    path: '/error',
    hidden: true
  },
  {
    path: '/patient/nurseRecordPrint',
    hidden: true
  },
  {
    path: '/patient/recordView', // 外部文书调阅
    hidden: true
  },
  {
    path: '/monitoringCenter/shiftHandoverAllScreen',
    hidden: true
  }
]
export const settingRoutes = wardOverview.concat(configuration)

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    settingRoutes: settingRoutes,
    routes: indexRouter
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
