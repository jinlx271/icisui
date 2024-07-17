import Layout from '../views/layout/Layout'

const knowledgeBaseManager = [{
    path: '/knowledgeBaseManager', // 和患者模块的路由做区分,避免path重复
    name: 'knowledgeBaseManager',
    component: Layout,
    meta: {
        title: '知识库管理'
    },
    // redirect: '/qualityControl/index',
    redirect: { name: 'knowledgeBaseManager_medicineKnow' },
    children: [
        {
            path: '/knowledgeBaseManager/medicineKnow',
            name: 'knowledgeBaseManager_medicineKnow',
            component: () => import('@/views/knowledgeBaseManager/medicineKnow.vue'),
            meta: {
                title: '医学知识库',
                isDoc: true
            }
        }
    ]
}]

export default knowledgeBaseManager
