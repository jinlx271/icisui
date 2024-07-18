import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout'
import PatientLayout from '../views/patient/patientLayout'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}
const routes = [
  {
    path: '/qualityControl/reportDetail', // 外部文书调阅
    component: () => import('../views/qualityControl/reportDetail'),
    hidden: true
  }
]
const settingRoutes = [
  {
    path: '/patient', // 和患者模块的路由做区分,避免path重复
    name: 'patient',
    component: PatientLayout,
    redirect: '/patientHome',
    meta: {
      title: '患者管理'
    },
    hidden: true,
    children: [
      {
        path: '/patient/patientOverview',
        name: 'PatientOverview',
        component: () => import('../views/patient/patientOverview.vue'),
        meta: {
          title: '概览'
        }
      },
      {
        path: '/patient/patientAssessment',
        name: 'PatientAssessment',
        component: () => import('../views/patient/patientAssessment.vue'),
        meta: {
          title: '评估'
        }
      },
      {
        path: '/patient/inspectionResult',
        name: 'InspectionResult',
        component: () => import('../views/patient/inspectionResult.vue'),
        meta: {
          title: '报告'
        }
      },
      {
        path: '/patient/nursingRecord',
        name: 'NursingRecord',
        component: () => import('../views/patient/nursingRecord.vue'),
        meta: {
          title: '文书'
        }
      }, {
          path: '/patient/monitoringData',
          name: 'MonitoringData',
          hidden: true,
          component: () => import('../views/patient/monitoringData.vue'),
          meta: {
            title: '监护'
          }
        }
    ]
  },
  // {
  //   path: '/patient/monitoringData',
  //   name: 'MonitoringData',
  //   hidden: true,
  //   component: () => import('../views/patient/monitoringData.vue'),
  //   meta: {
  //     title: '监护数据'
  //   }
  // },
  {
    path: '/patientHome', // 和患者模块的路由做区分,避免path重复
    name: 'patientHome',
    component: Layout,
    redirect: '/patientHome/homePage',
    icon: 'el-icon-user-solid',
    meta: {
      title: '患者'
    },
    children: [
      {
        path: '/patientHome/homePage',
        name: 'PatientHomePage',
        component: () => import('../views/patient/home.vue'),
        meta: {
          title: '患者'
        }
      }
    ]
  },
  {
    path: '/qualityControl', // 和患者模块的路由做区分,避免path重复
    name: 'QualityControl',
    component: Layout,
    redirect: '/qualityControl/reportEcharts',
    icon: 'el-icon-s-claim',
    meta: {
      title: '质控'
    },
    children: [
      {
        path: '/qualityControl/reportEcharts',
        name: 'qualityControl_reportEcharts',
        component: () => import('../views/qualityControl/reportEcharts.vue'),
        meta: {
          title: '质控查询'
        }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    settingRoutes: settingRoutes,
    routes: routes
  })

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
