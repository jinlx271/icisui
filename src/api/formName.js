import request from '@/utils/request'

// 新增表单名称配置
export function insertFormName(query) {
    return request({
        url: '/formName/insertFormName',
        method: 'post',
        data: query
    })
}
// 查询表单配置集合
export function findFormNameDetailsList(query) {
    return request({
        url: '/formName/findFormNameDetailsList',
        method: 'post',
        data: query
    })
}
// 保存表单配置详情
export function saveFormNameDetails(object) {
    return request({
        url: '/formName/saveFormNameDetails',
        method: 'post',
        data: object
    })
}
// 删除表单以及表单配置
export function delFormNameDetails(object) {
    return request({
        url: '/formName/delFormNameDetails',
        method: 'post',
        data: object
    })
}
// 获取icu病区
export function getIcuWardList(object) {
    return request({
        url: '/icuWard/findWithPage',
        method: 'post',
        data: object
    })
}
// 获取icu病区
export function updateFormName(object) {
    return request({
        url: '/formName/updateFormName',
        method: 'post',
        data: object
    })
}
