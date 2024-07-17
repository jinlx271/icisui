import Layout from '../views/layout/Layout'

const monitoringCenter = [{
    path: '/monitoringCenter', // 和患者模块的路由做区分,避免path重复
    name: 'monitoringCenter',
    component: Layout,
    meta: {
        title: '监控中心'
    },
    // redirect: '/qualityControl/index',
    redirect: { name: 'monitoringCenter_patientMonitoring' },
    children: [
        {
            path: '/monitoringCenter/patientMonitoring',
            name: 'monitoringCenter_patientMonitoring',
            component: () => import('@/views/monitoringCenter/patientMonitoring.vue'),
            meta: {
                title: '患者监控'
            }
        },
        {
            path: '/monitoringCenter/shiftHandoverScreen',
            name: 'monitoringCenter_shiftHandoverScreen',
            component: () => import('@/views/monitoringCenter/shiftHandoverScreen.vue'),
            meta: {
                title: '交班大屏'
            }
        }
    ]
}]

export default monitoringCenter
