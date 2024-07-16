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
// 设备使用情况-趋势接口
export const deviceUserStatic_getDeviceUserRata = (data) => wrapHttp(`/deviceUserStatic/getDeviceUserRata`, data)
// 设备使用情况-表格接口
export const deviceUserStatic_getDeviceUserPage = (data) => wrapHttp(`/deviceUserStatic/getDeviceUserPage`, data)
// 设备使用情况-表格接口-详情表格
export const deviceUserStatic_getDeviceUserDetailPage = (data) => wrapHttp(`/deviceUserStatic/getDeviceUserDetailPage`, data)

// 患者导管统计
export const patientCatherStatistics_listPage = (data) => wrapHttp(`/wlStatistics/patientCatherStatistics/listPage`, data)
export const patientCatherStatistics_detail = (data) => wrapHttp(`/wlStatistics/patientCatherStatistics/detail`, data)

// 患者皮肤统计
export const patientSkinStatistics_listPage = (data) => wrapHttp(`/wlStatistics/patientSkinStatistics/listPage`, data)
export const patientSkinStatistics_detail = (data) => wrapHttp(`/wlStatistics/patientSkinStatistics/detail`, data)

// 评估单统计
export const statistics_itemRatio = (data) => wrapHttp(`/assess/statistics/itemRatio`, data)
export const statistics_itemPatientList = (data) => wrapHttp(`assess/statistics/itemPatientList`, data)
export const statistics_resultRatio = (data) => wrapHttp(`/assess/statistics/resultRatio`, data)
export const statistics_resultData = (data) => wrapHttp(`/assess/statistics/resultData`, data)

// 感染统计
// 查询感染数据性别分组
export const statistics_sexGroupRatio = (data) => wrapHttp(`/catheter/statistics/sexGroupRatio`, data)
// 查询感染数据性别分组详情（POST）
export const statistics_sexGroupDetail = (data) => wrapHttp(`/catheter/statistics/sexGroupDetail`, data)
// 查询感染数据年龄分组比
export const statistics_ageGroupRatio = (data) => wrapHttp(`/catheter/statistics/ageGroupRatio`, data)
// 查询感染数据年龄分组详情（POST）
export const statistics_ageGroupDetail = (data) => wrapHttp(`/catheter/statistics/ageGroupDetail`, data)
// 查询感染数据致病菌分组比例（POST）
export const statistics_pathogenicBacteriaGroupRatio = (data) => wrapHttp(`/catheter/statistics/pathogenicBacteriaGroupRatio`, data)
// 查询感染数据致病菌分组详情（POST）
export const statistics_pathogenicBacteriaGroupDetail = (data) => wrapHttp(`/catheter/statistics/pathogenicBacteriaGroupDetail`, data)
// 查询感染数据抗生素分组比率
export const statistics_antibioticGroupRatio = (data) => wrapHttp(`/catheter/statistics/antibioticGroupRatio`, data)
// 查询感染数据抗生素分组详情
export const statistics_antibioticGroupDetail = (data) => wrapHttp(`/catheter/statistics/antibioticGroupDetail`, data)
export const performance_insert = (data) => wrapHttp(`/performance/insert`, data)
export const performance_edit = (data) => wrapHttp(`/performance/edit`, data)
export const performance_deleteById = (data) => wrapHttp(`/performance/deleteById`, data)
export const performance_findPerformances = (data) => wrapHttp(`/performance/findPerformances`, data)
export const performance_statisticsPerformances = (data) => wrapHttp(`/performance/statisticsPerformances`, data)
export const patientInfo_findInAreaPatientsByDate = (data) => wrapHttp(`/patientInfo/findInAreaPatientsByDate`, data)
export const performancePatient_insert = (data) => wrapHttp(`/performancePatient/insert`, data)
export const performancePatient_edit = (data) => wrapHttp(`/performancePatient/edit`, data)
export const performancePatient_deleteById = (data) => wrapHttp(`/performancePatient/deleteById`, data)
export const performancePatient_findWithPage = (data) => wrapHttp(`/performancePatient/findWithPage`, data)

// 查询导管跟踪项
export const wlStatistics_catheterTracking = (data) => wrapHttp(`/wlStatistics/catheterTracking`, data)
export const wlStatistics_catheterTrackingDetail = (data) => wrapHttp(`/wlStatistics/catheterTrackingDetail`, data)
