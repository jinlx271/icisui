import Layout from '../views/layout/Layout'

const inpatienArea = [{
  path: '/inpatienArea', // 和患者模块的路由做区分,避免path重复
  name: 'inpatienArea',
  component: Layout,
  meta: {
    title: '病区管理'
  },
  // redirect: 'inpatienArea/inpatientAreaPatient',
  redirect: { name: 'inpatienArea_inpatientAreaPatient' },
  children: [
    {
      path: '/inpatienArea/inpatientAreaPatient',
      name: 'inpatienArea_inpatientAreaPatient',
      component: () => import('@/views/inpatienArea/inpatientAreaPatient.vue'),
      meta: {
        title: '患者查询'
      }
    },
    {
      path: '/inpatienArea/docOrder',
      name: 'inpatienArea_docOrder',
      component: () => import('@/views/inpatienArea/docOrder.vue'),
      meta: {
        title: '医嘱管理'
      }
    },
    {
      path: '/inpatienArea/nurseOrder',
      name: 'inpatienArea_nurseOrder',
      component: () => import('@/views/inpatienArea/nurseOrder.vue'),
      meta: {
        title: '护嘱管理'
      }
    },
    {
      path: '/inpatienArea/shiftHandover',
      name: 'inpatienArea_shiftHandover',
      component: () => import('@/views/inpatienArea/shiftHandover.vue'),
      meta: {
        title: '班次交班'
      }
    },
    {
      path: '/inpatienArea/morningShift',
      name: 'inpatienArea_morningShift',
      component: () => import('@/views/inpatienArea/morningShift.vue'),
      meta: {
        title: '晨会交班'
      }
    },
    {
      path: '/inpatienArea/rescuePatient',
      name: 'inpatienArea_rescuePatient',
      component: () => import('@/views/inpatienArea/rescuePatient.vue'),
      meta: {
        title: '抢救查询'
      }
    },
    {
      path: '/inpatienArea/shiftChangeInfo',
      name: 'inpatienArea_shiftChangeInfo',
      component: () => import('@/views/inpatienArea/shiftChangeInfo.vue'),
      meta: {
        title: '交班查询'
      }
    },
    {
      path: '/inpatienArea/recordFileMan',
      name: 'inpatienArea_recordFileMan',
      component: () => import('@/views/inpatienArea/recordFileMan.vue'),
      meta: {
        title: '归档管理'
      }
    },
    {
      path: '/inpatienArea/accessNursingDocuments',
      name: 'inpatienArea_accessNursingDocuments',
      component: () => import('@/views/inpatienArea/accessNursingDocuments.vue'),
      meta: {
        title: '东华护理文书'
      }
    }, {
      path: '/inpatienArea/searchModifyRecord',
      name: 'inpatienArea_searchModifyRecord',
      component: () => import('@/views/inpatienArea/searchModifyRecord.vue'),
      meta: {
        title: '修改记录查询'
      }
    },
    {
      path: '/inpatienArea/auditsManagement',
      name: 'inpatienArea_auditsManagement',
      component: () => import('@/views/inpatienArea/auditsManagement.vue'),
      meta: {
        title: '审核管理'
      }
    },
    {
      path: '/inpatienArea/workforceManagement',
      name: 'inpatienArea_workforceManagement',
      component: () => import('@/views/inpatienArea/workforceManagement.vue'),
      meta: {
        title: '排班管理'
      }
    },
    {
      path: '/inpatienArea/pipelineMan',
      name: 'inpatienArea_pipelineMan',
      component: () => import('@/views/inpatienArea/pipelineMan.vue'),
      meta: {
        title: '管路查询'
      }
    },
    {
      path: '/inpatienArea/moniitemCheck',
      name: 'inpatienArea_moniitemCheck',
      component: () => import('@/views/inpatienArea/moniitemCheck.vue'),
      meta: {
        title: '体温单核查'
      }
    },
    {
      path: '/inpatienArea/liquidStatistics',
      name: 'inpatienArea_liquidStatistics',
      component: () => import('@/views/inpatienArea/liquidStatistics.vue'),
      meta: {
        title: '出入量查询'
      }
    }
  ]
}]

export default inpatienArea
