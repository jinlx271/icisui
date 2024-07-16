// 医嘱管理
import request from '@/utils/request'
/**
 * 外部接口 esb
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
export const esbQuery_getPatientInfo = (data) => wrapHttp(`/esbQuery/getInpatientInfo`, data)
export const esbQuery_getOrderInfo = (data) => wrapHttp(`/esbQuery/getOrderInfo`, data)
