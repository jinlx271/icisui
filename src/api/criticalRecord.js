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
export const insert_criticalRecord = (data) => wrapHttp(`/criticalRecord/insert`, data)
// 通过id 获取对应信息
export const getById_criticalRecord = (data) => wrapHttp(`/criticalRecord/getById`, data)
// 获取重症列表
export const findWithPage_criticalRecord = (data) => wrapHttp(`/criticalRecord/findWithPage`, data)
export const findAllWithPage_criticalRecord = (data) => wrapHttp(`/criticalRecord/findAllWithPage`, data)
// 编辑已有重症记录单
export const edit_criticalRecord = (data) => wrapHttp(`/criticalRecord/edit`, data)
// 根据id 删除对应的重症记录单
export const deleteById_criticalRecord = (data) => wrapHttp(`/criticalRecord/deleteById`, data)
export const criticalRecord_updateDocId = (data) => wrapHttp(`/criticalRecord/updateDocId`, data)
export const fixedPlaceHolder_freshConfig = (data) => wrapHttp('/fixedPlaceHolder/freshConfig/' + data, {}, 'get')
export const fixedPlaceHolder_dataList = (data) => wrapHttp(`/fixedPlaceHolder/dataList`, data)
export const fixedPlaceHolder_nonFixed = (data) => wrapHttp(`/fixedPlaceHolder/nonFixed`, data)

