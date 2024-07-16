// ICU病区
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

/* ============新接口 start ========== */
// 置管记录相关接口 插入置管
export const insertCatheterRecord = (data) => wrapHttp(`/catheterManager/insertCatheterRecord`, data)
// 分页查询置管记录
export const findCatheterRecordWithPage = (data) => wrapHttp(`/catheterManager/findCatheterRecordWithPage`, data)
// 修改置管信息
export const editCatheterRecord = (data) => wrapHttp(`/catheterManager/editCatheterRecord`, data)
// 删除置管信息
export const deleteCatheterRecordById = (data) => wrapHttp(`/catheterManager/deleteCatheterRecordById`, data)
// 拔管
export const endNursePipe = (data) => wrapHttp(`/catheterManager/endNursePipe`, data)
// 重插
export const repairNursePipe = (data) => wrapHttp(`/catheterManager/repairNursePipe`, data)
// 重插
export const replaceNursePipe = (data) => wrapHttp(`/catheterManager/replaceNursePipe`, data)
// 获取导管记录详情
export const getCatheterRecordById = (data) => wrapHttp(`/catheterManager/getCatheterRecordById`, data)
// 新增导管感染
export const insertRecordInfect = (data) => wrapHttp(`/catheterManager/insertRecordInfect`, data)
// 修改导管感染
export const editRecordInfect = (data) => wrapHttp(`/catheterManager/editRecordInfect`, data)
// 删除感染记录
export const deleteRecordInfectById = (data) => wrapHttp(`/catheterManager/deleteRecordInfectById`, data)
// 根据导管code查询监护项目
export const findCatheterMoniitemByCatherCode = (data) => wrapHttp(`/catheterMoniitem/findCatheterMoniitemByCatherCodeWithPage`, data)
// 插入导管记录详情
export const insertRecordDetail = (data) => wrapHttp(`/catheterManager/insertRecordDetail`, data)
// 编辑导管记录详情
export const editRecordDetail = (data) => wrapHttp(`/catheterManager/editRecordDetail`, data)
// 删除记录详情
export const deleteRecordDetailById = (data) => wrapHttp(`/catheterManager/deleteRecordDetailById`, data)
// 判断是否重插
export const catheterManager_isReintubation = (data) => wrapHttp(`/catheterManager/isReintubation`, data)
// 取消拔管
export const catheterManager_cancelEndNursePipe = (data) => wrapHttp(`/catheterManager/cancelEndNursePipe`, data)
// 获取导管未做记录
export const catheterManager_getCatheterInfectRiskList = (data) => wrapHttp(`/catheterManager/getCatheterInfectRiskList`, data)
/* ============新接口 end ========== */
export const catheterRecord_catheterRecordListSum = (data) => wrapHttp(`/catheterRecord/catheterRecordListSum`, data)
