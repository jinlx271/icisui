// 护嘱管理
// 医嘱执行
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
// 护嘱管理-查询护嘱列表
export const moniitemManager_getMoniitemManagerList = (data) => wrapHttp(`/moniitemManager/getMoniitemManagerList`, data)
// 护嘱管理-编辑护嘱信息
export const moniitemManager_editMoniitemManager = (data) => wrapHttp(`/moniitemManager/editMoniitemManager`, data)
//
export const moniitemManager_delMoniitemManager = (data) => wrapHttp(`/moniitemManager/delMoniitemManager`, data)

// 监护数据执行汇总
export const moniitemManager_sumMoniitemManager = (data) => wrapHttp(`/moniitemManager/sumMoniitemManager`, data)
export const moniitemManager_sumMoniitemManagerDetail = (data) => wrapHttp(`/moniitemManager/sumMoniitemManagerDetail`, data)
