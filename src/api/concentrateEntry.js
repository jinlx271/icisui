// 集中录入业务相关接口
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
export const jzlr_getTableHeader = (data) => wrapHttp(`/jzlr/getTableHeader`, data) // 获取表头信息
export const jzlr_getRecords = (data) => wrapHttp(`/jzlr/getRecords`, data) // 集中页面获取数据
export const jzlr_countRecord = (data) => wrapHttp(`/jzlr/countRecord`, data) // 统计某个时间点是否录入数据
export const jzlr_saveLiquid = (data) => wrapHttp(`/jzlr/saveLiquid`, data) // 保存液体平衡数据
export const jzlr_deleteLiquid = (data) => wrapHttp(`/jzlr/deleteLiquid`, data) // 删除液体平衡数据
export const jzlr_deleteByRecordTime = (data) => wrapHttp(`/jzlr/deleteByRecordTime`, data) // 删除液体平衡数据
export const jzlr_editByRecordTime = (data) => wrapHttp(`/jzlr/editByRecordTime`, data)
