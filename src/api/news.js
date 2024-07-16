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
// 消息-关注事项
export const concern_queryConcernMatters = (data) => wrapHttp(`/concern/queryConcernMatters`, data)
// 消息-单个患者  代办事项nubmer数量
export const concern_queryConcernMatterCounts = (data) => wrapHttp(`/concern/queryConcernMatterCounts`, data)

// 下面接口禁用
// 消息-查询医嘱待提取事项数量 这个不用做.在医嘱执行菜单界面有一个医嘱提起取按钮
// export const concern_selectOrderExtractMatterCount = (data) => wrapHttp(`/concern/selectOrderExtractMatterCount`, data)
// 消息-查询管路护理事项数量
// export const concern_selectCatheterMatterCount = (data) => wrapHttp(`/concern/selectCatheterMatterCount`, data)
// 消息-查询监护事项数量
// export const concern_selectMonitorMatterCount = (data) => wrapHttp(`/concern/selectMonitorMatterCount`, data)
// 消息-查询液体平衡事项数量
// export const concern_selectFluidBalanceMatterCount = (data) => wrapHttp(`/concern/selectFluidBalanceMatterCount`, data)
// 消息-查询医嘱执行事项数量
// export const concern_selectOrderExeMatterCount = (data) => wrapHttp(`/concern/selectOrderExeMatterCount`, data)
// 消息-查询患者评估事项数量
// export const concern_selectPatientAssessMatterCount = (data) => wrapHttp(`/concern/selectPatientAssessMatterCount`, data)
