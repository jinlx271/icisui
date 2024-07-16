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

/* ============新接口 start ========== */
// 分页查询护理诊断计划
export const nurseDiagPlan_findWithPage = (data) => wrapHttp(`/nurseDiagPlan/findWithPage`, data)
// 修改护理诊断计划
export const nurseDiagPlan_insert = (data) => wrapHttp(`/nurseDiagPlan/insert`, data)
// 修改护理诊断计划
export const nurseDiagPlan_edit = (data) => wrapHttp(`/nurseDiagPlan/edit`, data)
// 删除护理诊断计划
export const nurseDiagPlan_deleteById = (data) => wrapHttp(`/nurseDiagPlan/deleteById`, data)
