// 检验结果
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
// 检验结果-皮试结果
export const patientAllergyResult_findPage = (data) => wrapHttp(`/patientAllergyResult/findPage`, data)
// 检验结果-血气分析/血糖检测
// 检验结果-查询表头参数
export const inspection_bloodGas_getTableHeadParamList = (data) => wrapHttp(`/inspection/bloodGas/getTableHeadParamList`, data)
// 检验结果-查询表头
export const inspection_bloodGas_tableHeadList = (data) => wrapHttp(`/inspection/bloodGas/tableHeadList`, data)
// 检验结果-查询
export const inspection_bloodGas_list = (data) => wrapHttp(`/inspection/bloodGas/list`, data)
// 检验结果-新增
export const inspection_bloodGas_insert = (data) => wrapHttp(`/inspection/bloodGas/insert`, data)
// 检验结果-修改
export const inspection_bloodGas_edit = (data) => wrapHttp(`/inspection/bloodGas/edit`, data)
// 检验结果-删除
export const inspection_bloodGas_delete = (data) => wrapHttp(`/inspection/bloodGas/delete`, data)
// 检验结果-查询检验报告
export const patientInspect_getList = (data) => wrapHttp(`/patientInspect/getList`, data)
// 检验结果-获取图表数据
export const patientInspect_getChartList = (data) => wrapHttp(`/patientInspect/getChartList`, data)
// 检验结果-获取报告类别列表
export const patientInspect_getReportTypeList = (data) => wrapHttp(`/patientInspect/getReportTypeList`, data)
// 检验结果-查询检验报告详情
export const patientInspectDetail_getList = (data) => wrapHttp(`/patientInspectDetail/getList`, data)
// 检验结果-查询检查报告
export const patientExamine_getList = (data) => wrapHttp(`/patientExamine/getList`, data)
// 检验结果-查询检查报告详情
export const patientExamineDetail_getList = (data) => wrapHttp(`/patientExamineDetail/getList`, data)
// 检验结果-设置关注项
export const patientInspectDetail_setInterest = (data) => wrapHttp(`/patientInspectDetail/setInterest`, data)
