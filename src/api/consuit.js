import request from '@/utils/request'
/**
 * 公用post
 * @param url 请求接口
 * @param data 入参
 */
const wrapHttp = (url, data = {}, method = 'post', otherConfig) => {
  return request({
    url: url,
    method,
    data,
    otherConfig
  })
}
// 病区
export const consuitType_deleteById = (data) => wrapHttp(`consuitType/deleteById`, data)
export const consuitType_edit = (data) => wrapHttp(`consuitType/edit`, data)
export const consuitType_findWithPage = (data) => wrapHttp(`consuitType/findWithPage`, data)
export const consuitType_insert = (data) => wrapHttp(`consuitType/insert`, data)
export const consuitType_getMaxSort = (data) => wrapHttp(`consuitType/getMaxSort`, data)

export const consuitTypeGroup_deleteById = (data) => wrapHttp(`consuitTypeGroup/deleteById`, data)
export const consuitTypeGroup_edit = (data) => wrapHttp(`consuitTypeGroup/edit`, data)
export const consuitTypeGroup_findWithPage = (data) => wrapHttp(`consuitTypeGroup/findWithPage`, data)
export const consuitTypeGroup_getById = (data) => wrapHttp(`consuitTypeGroup/getById`, data)
export const consuitTypeGroup_insert = (data) => wrapHttp(`consuitTypeGroup/insert`, data)
export const consuitTypeGroup_getMaxSort = (data) => wrapHttp(`consuitTypeGroup/getMaxSort`, data)

export const consuitTypeGroupMoniitem_deleteById = (data) => wrapHttp(`consuitTypeGroupMoniitem/deleteById`, data)
export const consuitTypeGroupMoniitem_edit = (data) => wrapHttp(`consuitTypeGroupMoniitem/edit`, data)
export const consuitTypeGroupMoniitem_findConfigItemWithPage = (data) => wrapHttp(`consuitTypeGroupMoniitem/findConfigItemWithPage`, data)
export const consuitTypeGroupMoniitem_findWithPage = (data) => wrapHttp(`consuitTypeGroupMoniitem/findWithPage`, data)
export const consuitTypeGroupMoniitem_getMaxSort = (data) => wrapHttp(`consuitTypeGroupMoniitem/getMaxSort`, data)
export const consuitTypeGroupMoniitem_insert = (data) => wrapHttp(`consuitTypeGroupMoniitem/insert`, data)
export const moniitemRecord_getMoniitemConsuitDataList = (data) => wrapHttp(`moniitemRecord/getMoniitemConsuitDataList`, data) // 病情分析获取对应监护项数据
export const consuitType_copyWardConfig = (data) => wrapHttp(`consuitType/copyWardConfig`, data)
