
const wardOverview = [{
  path: '/wardOverview', // 和患者模块的路由做区分,避免path重复
  name: 'wardOverview',
  // component:: HeadLayout,
  // redirect: '/wardOverview/homePage',
  redirect: { name: 'wardOverview_homePage' },
  meta: {
    title: '病区概况'
  },
  children: [
    {
      path: '/wardOverview/homePage',
      name: 'wardOverview_homePage',
      // component:: () => import('@/views/wardOverview/homePage.vue'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/wardOverview/setupModule',
      name: 'wardOverview_setupModule',
      // component:: () => import('@/views/wardOverview/setupModule.vue'),
      meta: {
        title: '模块配置'
      }
    }
  ]
}]

export default wardOverview
