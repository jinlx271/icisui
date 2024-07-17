import Layout from '../views/layout/Layout'
const operate = [{
  path: '/operate',
  name: 'operate',
  component: Layout,
  meta: {
    title: '运营管理'
  },
  // redirect: 'operate/operatePatient',
  redirect: { name: 'operate_operatePatient' },
  children: [
    // { 【重症V5.6.1 20220626】运营管理下的患者综合查询需隐藏
    //   path: '/operate/operatePatient',
    //   name: 'operate_operatePatient',
    //   component: () => import('@/views/operate/operatePatient.vue'),
    //   meta: {
    //     title: '患者综合查询'
    //   }
    // },
    {
      path: '/operate/operateWorkload',
      name: 'operate_operateWorkload',
      component: () => import('@/views/operate/operateWorkload.vue'),
      meta: {
        title: '工作量统计'
      }
    },
    {
      path: '/operate/consumable',
      name: 'operate_consumable',
      component: () => import('@/views/operate/consumable.vue'),
      meta: {
        title: '耗材使用情况'
      }
    },
    {
      path: '/operate/operateDrug',
      name: 'operate_operateDrug',
      component: () => import('@/views/operate/operateDrug.vue'),
      meta: {
        title: '药品使用情况'
      }
    },
    {
      path: '/operate/workLoad',
      name: 'operate_workLoad',
      component: () => import('@/views/operate/workLoad.vue'),
      meta: {
        title: '工作量统计',
        isDoc: true
      }
    },
    {
      path: '/operate/operateBed',
      name: 'operate_operateBed',
      component: () => import('@/views/operate/operateBed.vue'),
      meta: {
        title: '床位使用情况'
      }
    },
    {
      path: '/operate/operateEquipment',
      name: 'operate_operateEquipment',
      component: () => import('@/views/operate/operateEquipment.vue'),
      meta: {
        title: '设备使用情况'
      }
    },
    {
      path: '/operate/operateCost',
      name: 'operate_operateCost',
      component: () => import('@/views/operate/operateCost.vue'),
      meta: {
        title: '费用查询'
      }
    },
    {
      path: '/operate/winningReport',
      name: 'operate_winningReport',
      component: () => import('@/views/operate/winningReport.vue'),
      meta: {
        title: '卫宁报表'
      }
    },
    {
      path: '/operate/patientTurnover',
      name: 'operate_patientTurnover',
      component: () => import('@/views/operate/patientTurnover.vue'),
      meta: {
        title: '患者流转统计'
      }
    },
    {
      path: '/operate/patientPipe',
      name: 'operate_patientPipe',
      component: () => import('@/views/operate/patientPipe/index.vue'),
      meta: {
        title: '患者导管统计'
      }
    },
    {
      path: '/operate/patientSkin',
      name: 'operate_patientSkin',
      component: () => import('@/views/operate/patientSkin/index.vue'),
      meta: {
        title: '患者皮肤统计'
      }
    },
    {
      path: '/operate/clinicalInfo',
      name: 'operate_clinicalInfo',
      component: () => import('@/views/operate/clinicalInfo/index.vue'),
      meta: {
        title: '临床信息统计'
      }
    },
    {
      path: '/operate/assessmentStatistic',
      name: 'operate_assessmentStatistic',
      component: () => import('@/views/operate/assessmentStatistic/index.vue'),
      meta: {
        title: '评估单统计'
      }
    },
    {
      path: '/operate/infectStatistic',
      name: 'operate_infectStatistic',
      component: () => import('@/views/operate/infectStatistic/index.vue'),
      meta: {
        title: '患者感染统计'
      }
    },
    {
      path: '/operate/KPIStatis',
      name: 'operate_KPIStatis',
      component: () => import('@/views/operate/KPIStatis.vue'),
      meta: {
        title: '工作绩效统计'
      }
    }
  ]
}]

export default operate
