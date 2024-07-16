
/* 口腔管理 */
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
// 添加口腔状况
export const mouthRecord_insertMouthRecord = (data) => wrapHttp(`/mouthRecord/insertMouthRecord`, data)
export const mouthRecord_getMouthRecordList = (data) => wrapHttp(`/mouthRecord/getMouthRecordList`, data)
export const mouthRecord_deleteMouthRecordById = (data) => wrapHttp(`/mouthRecord/deleteMouthRecordById`, data)
export const mouthRecord_updateMouthRecordById = (data) => wrapHttp(`/mouthRecord/updateMouthRecordById`, data)
// 牙齿情况
export const toothRecord_insertToothRecord = (data) => wrapHttp(`/toothRecord/insertToothRecord`, data)
export const toothRecord_deleteToothRecordById = (data) => wrapHttp(`/toothRecord/deleteToothRecordById`, data)
export const toothRecord_getToothRecordList = (data) => wrapHttp(`/toothRecord/getToothRecordList`, data)

