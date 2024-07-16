// 医嘱管理
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

// 医嘱管理-查询医嘱列表
export const order_getOrderList = (data) => wrapHttp(`/order/getOrderList`, data)
// 医嘱管理-修改医嘱
export const order_edit = (data) => wrapHttp(`/order/edit`, data)
// 医嘱管理-提取医嘱
export const order_extractedOrder = (data) => wrapHttp(`/order/extractedOrder`, data)
// 医嘱管理-提取医嘱列表
export const order_getExtractedOrderList = (data) => wrapHttp(`/order/getExtractedOrderList`, data)
// 剩余输液量
export const order_getleftoverOrderList = (data) => wrapHttp(`/order/getleftoverOrderList`, data)
// 获取待提取医嘱数量
export const order_getNotExtractedOrderNum = (data) => wrapHttp(`/order/getNotExtractedOrderNum`, data)
// 补录医嘱
export const order_addOrder = (data) => wrapHttp(`/order/addOrder`, data)
// 停止补录医嘱
export const order_stopOrder = (data) => wrapHttp(`/order/stopOrder`, data)
// 作废医嘱
export const order_deleteOrder = (data) => wrapHttp(`/order/deleteOrder`, data)
// 还原医嘱
export const order_rebackOrder = (data) => wrapHttp(`/order/rebackOrder`, data)
