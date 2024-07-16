/* 护理记录 */
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
// 护理记录查询数据
export const nurseRecord_findWithPage = (data) => wrapHttp(`/nurseRecord/findWithPage`, data)
// 插入护理记录
export const nurseRecord_insert = (data) => wrapHttp(`/nurseRecord/insert`, data)
// 编辑
export const nurseRecord_edit = (data) => wrapHttp(`/nurseRecord/edit`, data)
// 编辑
export const nurseRecord_deleteById = (data) => wrapHttp(`/nurseRecord/deleteById`, data)
// 审核
export const nurseRecord_examine = (data) => wrapHttp(`/nurseRecord/examine`, data)
// 取消审核
export const nurseRecord_cancelExamine = (data) => wrapHttp(`/nurseRecord/cancelExamine`, data)

// 获取病人观察项的监护数据
export const nursingaid_observationData = (data) => wrapHttp(`/nursingaid/observationData`, data)
// 获取病人检查数据
export const nursingaid_examineData = (data) => wrapHttp(`/nursingaid/examineData`, data)
// 获取病人检验指标数据
export const nursingaid_inspectIndexData = (data) => wrapHttp(`/nursingaid/inspectIndexData`, data)
// 获取病人医嘱数据
export const nursingaid_ordersData = (data) => wrapHttp(`/nursingaid/ordersData`, data)
// 获取病人导管数据
export const nursingaid_catheterData = (data) => wrapHttp(`/nursingaid/catheterData`, data)
// 获取病人皮肤数据
export const nursingaid_skinData = (data) => wrapHttp(`/nursingaid/skinData`, data)
// 获取病人其他监测项数据
export const nursingaid_otherData = (data) => wrapHttp(`/nursingaid/otherData`, data)
// 获取病人护理助手-病人危急值
export const nursingaid_criticalValueData = (data) => wrapHttp(`/nursingaid/criticalValueData`, data)
// 获取病人护理助手-液体平衡
export const nursingaid_nursingLiquidBalance = (data) => wrapHttp(`/nursingaid/nursingLiquidBalance`, data)
// 护理助手-医嘱余量接口
export const nursingaid_orderMargin = (data) => wrapHttp(`/nursingaid/orderMargin`, data)
// 护理助手-评估
export const nursingaid_assess = (data) => wrapHttp(`/nursingaid/assess`, data)
// 护理助手-检测是否第一次护理记录
export const nurseRecord_checkPreLogic = (data) => wrapHttp(`/nurseRecord/checkPreLogic`, data)
// 批量审核护理记录
export const dataManager_batchExamine = (data) => wrapHttp(`/nurseRecord/dataManager/batchExamine`, data)
// 获取首次护理记录
export const nurseRecord_getFirstNurseRecord = (data) => wrapHttp(`/nurseRecord/getFirstNurseRecord`, data)
// GPT生成首次护理记录
export const nurseRecord_getFirstNurseContentByGpt = (data) => wrapHttp(`/nurseRecord/dataManager/getFirstNurseContentByGpt`, data)
