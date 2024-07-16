/*
重症记录单配置接口
*/
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
// 保存重症记录单
export const patientMonitoringCenter_findPatientMonitorings = (data) => wrapHttp(`/patientMonitoringCenter/findPatientMonitorings`, data)

// 异常值详情列表
export const patientMonitoringCenter_findPatientMonitoringExceptions = (data) => wrapHttp(`/patientMonitoringCenter/findPatientMonitoringExceptions`, data)
export const patientMonitoringCenter_insert = (data) => wrapHttp(`/patientMonitoringCenter/insert`, data)
export const patientMonitoringCenter_edit = (data) => wrapHttp(`/patientMonitoringCenter/edit`, data)
export const patientMonitoringCenter_cancel = (data) => wrapHttp(`/patientMonitoringCenter/cancel`, data)

// 交班大屏-模板配置列表
export const shifthandoverScreen_findShifthandover = (data) => wrapHttp(`/shifthandoverScreen/findShifthandover`, data)
export const shifthandoverScreen_edit = (data) => wrapHttp(`/shifthandoverScreen/edit`, data)
// 病区概览
export const shifthandoverScreen_wardOverview = (data) => wrapHttp(`/shifthandoverScreenBusi/wardOverview`, data)
// 实时预警提醒
export const shifthandoverScreen_realtimeWarningReminder = (data) => wrapHttp(`/shifthandoverScreenBusi/realtimeWarningReminder`, data)
// 危急值提醒
export const shifthandoverScreen_criticalValueReminder = (data) => wrapHttp(`/shifthandoverScreenBusi/criticalValueReminder`, data)
// 重点患者情况
export const shifthandoverScreen_keyPatientSituation = (data) => wrapHttp(`/shifthandoverScreenBusi/keyPatientSituation`, data)
// 异常情况
export const shifthandoverScreen_abnormalCondition = (data) => wrapHttp(`/shifthandoverScreenBusi/abnormalCondition`, data)
// 风险预警
export const shifthandoverScreen_riskWarning = (data) => wrapHttp(`/shifthandoverScreenBusi/riskWarning`, data)
// 导管管理
export const shifthandoverScreen_catheterManagement = (data) => wrapHttp(`/shifthandoverScreenBusi/catheterManagement`, data)
// 评估结果高风险
export const shifthandoverScreen_highRiskAssessmentResults = (data) => wrapHttp(`/shifthandoverScreenBusi/highRiskAssessmentResults`, data)
// 当前正在用药
export const shifthandoverScreen_currentlyTakingMedication = (data) => wrapHttp(`/shifthandoverScreenBusi/currentlyTakingMedication`, data)
// 特殊事件
export const shifthandoverScreen_specialEvents = (data) => wrapHttp(`/shifthandoverScreenBusi/specialEvents`, data)
// 死亡风险预测
export const shifthandoverScreen_deathRiskPrediction = (data) => wrapHttp(`/shifthandoverScreenBusi/deathRiskPrediction`, data)
// 护士管床
export const shifthandoverScreen_nurseBedManagement = (data) => wrapHttp(`/shifthandoverScreenBusi/nurseBedManagement`, data)
// 医生管床
export const shifthandoverScreen_doctorBedManagement = (data) => wrapHttp(`/shifthandoverScreenBusi/doctorBedManagement`, data)
// 下个班次护理计划
export const shifthandoverScreen_nextShiftCarePlan = (data) => wrapHttp(`/shifthandoverScreenBusi/nextShiftCarePlan`, data)
// 患者监控-异常声音查询
export const personExceptionSound_findWithPage = (data) => wrapHttp(`/personExceptionSound/findWithPage`, data)
export const personExceptionSound_insert = (data) => wrapHttp(`/personExceptionSound/insert`, data)
export const personExceptionSound_edit = (data) => wrapHttp(`/personExceptionSound/edit`, data)
export const personExceptionSound_deleteById = (data) => wrapHttp(`/personExceptionSound/deleteById`, data)

