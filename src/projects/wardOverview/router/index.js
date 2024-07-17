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
const routerList = []
const wardOverview = [{
  path: '/wardOverview',
  name: 'root',
  redirect: { name: 'wardOverview_homePage' },
  meta: {
    title: '病区概况'
  },
  children: [
    {
      path: '/wardOverview/homePage',
      name: 'wardOverview_homePage',
      component: () => import('../views/homePage.vue'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/wardOverview/setupModule',
      name: 'wardOverview_setupModule',
      component: () => import('../views/setupModule.vue'),
      meta: {
        title: '模块配置'
      }
    }
  ]
}]
wardOverview.forEach(item => {
  if (item.children.length > 0) {
    const info = { ...item }
    if (info.children) {
      delete info.children
    }
    routerList.push(info)
    item.children?.forEach(c1 => {
      const obj = { ...c1 }
      if (c1.children) {
        delete obj.children
      }
      routerList.push(obj)
      c1.children?.forEach(c2 => {
        routerList.push(c2)
      })
    })
  } else {
    routerList.push(item)
  }
})
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    settingRoutes: wardOverview,
    routes: routerList
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
