
const wardOverview = [{
  path: '/',
  name: 'root',
  redirect: { name: 'wardOverview_homePage' },
  meta: {
    title: '病区概况'
  },
  children: [
    {
      path: '/wardOverview/homePage',
      name: 'wardOverview_homePage',
      component: () => import('@/views/wardOverview/homePage.vue'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/wardOverview/setupModule',
      name: 'wardOverview_setupModule',
      component: () => import('@/views/wardOverview/setupModule.vue'),
      meta: {
        title: '模块配置'
      }
    }
  ]
}]

export default wardOverview
