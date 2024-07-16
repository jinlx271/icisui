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

// 查询皮肤护理集合
export const findNursePressureWithPage = (data) => wrapHttp(`/nursePressure/findNursePressureWithPage`, data)
// 新增皮肤护理
export const insertNursePressure = (data) => wrapHttp(`/nursePressure/insertNursePressure`, data)
// 修改皮肤护理
export const editNursePressure = (data) => wrapHttp(`/nursePressure/editNursePressure`, data)
// 删除皮肤护理
export const deleteNursePressureById = (data) => wrapHttp(`/nursePressure/deleteNursePressureById`, data)

// 查询皮肤护理详情集合
export const findNursePressureDetailWithPage = (data) => wrapHttp(`/nursePressureDetail/findNursePressureDetailWithPage`, data)
// 新增皮肤护理详情
export const insertNursePressureDetail = (data) => wrapHttp(`/nursePressureDetail/insertNursePressureDetail`, data)
// 修改皮肤护理详情
export const editNursePressureDetail = (data) => wrapHttp(`/nursePressureDetail/editNursePressureDetail`, data)
// 删除皮肤护理详情
export const deleteNursePressureDetailById = (data) => wrapHttp(`/nursePressureDetail/deleteNursePressureDetailById`, data)

// 查询护理记录集合
export const findNurseSkinWithPage = (data) => wrapHttp(`/nurseSkin/findNurseSkinWithPage`, data)
// 新增护理记录
export const insertNurseSkin = (data) => wrapHttp(`/nurseSkin/insertNurseSkin`, data)
// 修改护理记录
export const editNurseSkin = (data) => wrapHttp(`/nurseSkin/editNurseSkin`, data)
// 删除护理记录
export const deleteNurseSkinById = (data) => wrapHttp(`/nurseSkin/deleteNurseSkinById`, data)
