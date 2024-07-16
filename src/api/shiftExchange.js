// 床旁交班
import request from '@/utils/request'
/**
 * 公用post
 * @param url 请求接口
 * @param data 入参
 */
const wrapHttp = (url, data = {}, method = 'post') => {
  return request({
    url: url,
    method,
    data
  })
}
// 床旁交班:Shift Change Controller
// 床旁交班-获取列表
export const shiftChange_list = (data) => wrapHttp(`/shiftChange/list`, data)
// 床旁交班-根据主键获取交班记录
export const shiftChange_getById = (data) => wrapHttp(`/shiftChange/getById`, data)
// 床旁交班-新增
export const shiftChange_insert = (data) => wrapHttp(`/shiftChange/insert`, data)
// 床旁交班-修改
export const shiftChange_edit = (data) => wrapHttp(`/shiftChange/edit`, data)
// 床旁交班-删除
export const shiftChange_deleteById = (data) => wrapHttp(`/shiftChange/deleteById`, data)
// 床旁交班-获取置管记录
export const shiftChange_getCatheterRecrod = (data) => wrapHttp(`/shiftChange/getCatheterRecrod`, data)
// 床旁交班-获取医嘱执行记录
export const shiftChange_getOrderRecord = (data) => wrapHttp(`/shiftChange/getOrderRecord`, data)
// 床旁交班-获取危急值列表
export const patientWarning_getWarningList = (data) => wrapHttp(`/patientWarning/getWarningList`, data)
// 床旁交班-出入量汇总
export const shiftChange_getLiquidRecordStatistics = (data) => wrapHttp(`/shiftChange/getLiquidRecordStatistics`, data)
// 交班查询
export const shiftChange_findPatientShiftWithPage = (data) => wrapHttp(`/shiftChange/findPatientShiftWithPage`, data)
// 交班查询
export const shiftChange_findFirstNurseRecord = (data) => wrapHttp(`/shiftChange/findFirstNurseRecord`, data, 'get')
// 班次交班
export const shiftChange_queryPatientShiftChangeList = (data) => wrapHttp(`/shiftChange/queryPatientShiftChangeList`, data)
// 皮肤情况
export const shiftChange_getSkinRecrod = (data) => wrapHttp(`/shiftChange/getSkinRecrod`, data)
// 审核
export const shiftChange_batchAudit = (data) => wrapHttp(`/shiftChange/batchAudit`, data)
// 取消审核
export const shiftChange_cancelAudit = (data) => wrapHttp(`/shiftChange/cancelAudit`, data)
// Ai助手
export const shiftChange_getShiftChangeContent = (data) => wrapHttp(`/shiftChange/getShiftChangeContent`, data)
