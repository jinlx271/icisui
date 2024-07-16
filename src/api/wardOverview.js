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
// 本月病区患者情况
export const wardOverview_wardOfThisMonth = (data) => wrapHttp(`/wardOverview/wardOfThisMonth`, data)
// 本月ApacheII评分患者分布
export const wardOverview_getApacheII = (data) => wrapHttp(`/wardOverview/getApacheII`, data)
// 气管插管患者分布
export const wardOverview_getEndotrachealIntubation = (data) => wrapHttp(`/wardOverview/getEndotrachealIntubation`, data)
// 患者在区天数统计
export const wardOverview_getInHospitalDays = (data) => wrapHttp(`/wardOverview/getInHospitalDays`, data)
// 重点患者情况
export const statistics_collectFocalPatientData = (data) => wrapHttp(`/statistics/collectFocalPatientData`, data)
// 本月患者出区状态分布
export const wardOverview_outAreaStatic = (data) => wrapHttp(`/wardOverview/outAreaStatic`, data)
// 患者年龄分布
export const wardOverview_getPatientAgeDistribute = (data) => wrapHttp(`/wardOverview/getPatientAgeDistribute`, data)
// Apache II未评分患者
export const wardOverview_apacheGroupData = (data) => wrapHttp(`/wardOverview/apacheGroupData`, data)
// 入区分部
export const wlStatistics_inAreaStatic = (data) => wrapHttp(`/wlStatistics/inAreaStatic`, data)
// 医生护士比例
export const wardOverview_nurseDoctorBedRatio = (data) => wrapHttp(`/wardOverview/nurseDoctorBedRatio`, data)
export const device_getDeviceStatusCount = (data) => wrapHttp(`/device/getDeviceStatusCount`, data)
