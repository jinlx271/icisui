import Layout from '../views/layout/Layout'

const qualityControl = [
  {
    path: '/qualityControl', // 和患者模块的路由做区分,避免path重复
    name: 'qualityControl',
    component: Layout,
    meta: {
      title: '质控管理'
    },
    // redirect: '/qualityControl/index',
    redirect: { name: 'qualityControl_index' },
    children: [
      {
        path: '/qualityControl/index',
        name: 'qualityControl_index',
        component: () => import('@/views/qualityControl/index.vue'),
        meta: {
          title: '患者质控标识',
          isDoc: true
        }
      },
      {
        path: '/qualityControl/dataStatistics',
        name: 'qualityControl_dataStatistics',
        component: () => import('@/views/qualityControl/dataStatistics.vue'),
        meta: {
          title: 'ICU质控报表',
          isDoc: true
        }
      },
      {
        path: '/qualityControl/reportEcharts',
        name: 'qualityControl_reportEcharts',
        component: () => import('@/h5Views/qualityControl/reportEcharts.vue'),
        meta: {
          title: '质控查询'
        }
      }
    ]
  }
]

export default qualityControl
