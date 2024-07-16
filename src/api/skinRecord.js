// 皮肤管理
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
// 分页查询皮肤记录数据
export const findSkinRecordWithPage = (data) => wrapHttp(`/skinManager/findSkinRecordWithPage`, data)
// 分页查询置管记录
export const insertSkinRecord = (data) => wrapHttp(`/skinManager/insertSkinRecord`, data)
// 删除皮肤创面记录
export const deleteSkinRecordById = (data) => wrapHttp(`/skinManager/deleteSkinRecordById`, data)
// 修改皮肤创面记录
export const editSkinRecord = (data) => wrapHttp(`/skinManager/editSkinRecord`, data)
// 转归
export const backSkinRecord = (data) => wrapHttp(`/skinManager/backSkinRecord`, data)
// 新增记录详情
export const insertSkinRecordDetail = (data) => wrapHttp(`/skinManager/insertSkinRecordDetail`, data)
// 编辑记录详情
export const editSkinRecordDetail = (data) => wrapHttp(`/skinManager/editSkinRecordDetail`, data)
// 根据recordId获取详情
export const getSkinRecordById = (data) => wrapHttp(`/skinManager/getSkinRecordById`, data)
// 删除当前详情
export const deleteSkinRecordDetailById = (data) => wrapHttp(`/skinManager/deleteSkinRecordDetailById`, data)
// 查询皮肤映射数据 按照排序给出
export const skinManager_getSkinPosiList = (data) => wrapHttp(`/skinManager/getSkinPosiList`, data)

