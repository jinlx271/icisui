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
export const indexRouter = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login/:role',
    name: 'loginRole',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/error',
    component: () => import('@/views/error'),
    hidden: true
  },
  {
    path: '/patient/nurseRecordPrint',
    component: () => import('@/views/patient/nurseRecordPrint'),
    hidden: true
  },
  {
    path: '/patient/recordView', // 外部文书调阅
    component: () => import('@/views/patient/recordView'),
    hidden: true
  },
  {
    path: '/monitoringCenter/shiftHandoverAllScreen',
    component: () => import('@/views/monitoringCenter/shiftHandoverScreen'),
    hidden: true
  }
]
export const settingRoutes = wardOverview.concat(patient).concat(inpatienArea).concat(qualityControl).concat(operate).concat(monitoringCenter).concat(knowledgeBaseManager).concat(configuration)

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
