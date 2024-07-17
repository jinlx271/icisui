import Layout from '../views/layout/LayoutPatient'
import HeadLayout from '../views/layout/HeadLayout'

const patient = [
{
  path: '/patient', // 和患者模块的路由做区分,避免path重复
  name: 'patient',
  component: Layout,
  redirect: '/patientHome',
  meta: {
    title: '患者管理'
  },
  children: [
    {
      path: '/patient/patientOverview',
      name: 'patientOverview',
      component: () => import('@/views/patient/patientOverview.vue'),
      meta: {
        title: '患者概览'
      },
      query: {
        toOutSide: ''
      }
    }, {
      path: '/patient/concentrateEntry',
      name: 'concentrateEntry',
      component: () => import('@/views/patient/concentrateEntry/index.vue'),
      meta: {
        title: '集中录入'
      }
    }, {
      path: '/patient/monitoringData',
      name: 'monitoringData',
      component: () => import('@/views/patient/monitoringData.vue'),
      meta: {
        title: '监护数据'
      }
    }, {
      path: '/patient/orderExecute',
      name: 'orderExecute',
      component: () => import('@/views/patient/orderExecute.vue'),
      meta: {
        title: '医嘱执行'
      }
    }, {
      path: '/patient/fluidBalance',
      name: 'fluidBalance',
      component: () => import('@/views/patient/fluidBalance.vue'),
      meta: {
        title: '液体平衡'
      }
    }, {
      path: '/patient/pipelineCare',
      name: 'pipelineCare',
      component: () => import('@/views/patient/pipelineCare.vue'),
      meta: {
        title: '管路护理'
      }
    }, {
      path: '/patient/dermaplus',
      name: 'dermaplus',
      component: () => import('@/views/patient/dermaplus.vue'),
      meta: {
        title: '皮肤管理'
      }
    }, {
      path: '/patient/oralManager',
      name: 'oralManager',
      component: () => import('@/views/patient/oralManager.vue'),
      meta: {
        title: '口腔管理'
      }
    }, {
      path: '/patient/inspectionResult',
      name: 'inspectionResult',
      component: () => import('@/views/patient/inspectionResult.vue'),
      meta: {
        title: '检验检查'
      }
    }, {
      path: '/patient/specificTreatment',
      name: 'specificTreatment',
      component: () => import('@/views/patient/specificTreatment.vue'),
      meta: {
        title: '特殊治疗'
      }
    }, {
      path: '/patient/patientAssessment',
      name: 'patientAssessment',
      component: () => import('@/views/patient/patientAssessment.vue'),
      meta: {
        title: '患者评估'
      }
    }, {
      path: '/patient/nursingRecord',
      name: 'nursingRecord',
      component: () => import('@/views/patient/nursingRecord.vue'),
      meta: {
        title: '护理文书'
      }
    }, {
      path: '/patient/shiftExchange',
      name: 'shiftExchange',
      component: () => import('@/views/patient/shiftExchange.vue'),
      meta: {
        title: '床旁交班'
      }
    }, {
      path: '/patient/anasManager',
      name: 'anasManager',
      component: () => import('@/views/patient/anasManager.vue'),
      meta: {
        title: '镇痛镇静管理'
      }
    }, {
      path: '/patient/circulationRecord',
      name: 'circulationRecord',
      component: () => import('@/views/patient/circulationRecord.vue'),
      meta: {
        title: '流转记录'
      }
    }, {
      path: '/patient/treatmentObjectives',
      name: 'treatmentObjectives',
      component: () => import('@/views/patient/treatmentObjectives.vue'),
      meta: {
        title: '治疗目标'
      }
    }, {
      path: '/patient/consuting',
      name: 'consuting',
      component: () => import('@/views/patient/consuting.vue'),
      meta: {
        title: '病情分析'
      }
    }, {
      path: '/patient/nutritionManage',
      name: 'nutritionManage',
      component: () => import('@/views/patient/nutritionManage.vue'),
      meta: {
        title: '营养管理'
      }
    }, {
      path: '/patient/iCUQualitySign',
      name: 'consuting',
      component: () => import('@/views/patient/iCUQualitySign.vue'),
      meta: {
        title: '质控标识'
      }
    }, {
      path: '/patient/infectMan',
      name: 'infectMan',
      component: () => import('@/views/patient/infectMan.vue'),
      meta: {
        title: '感染管理'
      }
    }, {
      path: '/patient/nursePlan',
      name: 'nursePlan',
      component: () => import('@/views/patient/nursePlan.vue'),
      meta: {
        title: '护理计划'
      }
    }
  ]
}, {
  path: '/patientHome', // 和患者模块的路由做区分,避免path重复
  name: 'patientHome',
  component: HeadLayout,
  redirect: '/patientHome/homePage',
  hidden: true,
  children: [
    {
      path: '/patientHome/homePage',
      name: 'patientHomePage',
      component: () => import('@/views/patient/homePage/index.vue'),
      meta: {
        title: '患者首页'
      }
    }
  ]
}]

export default patient
