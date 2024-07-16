// 特殊治疗
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
// 特殊治记录-删除SpecialTreatmentRecord
export const specialTreatmentRecord_deleteById = (data) => wrapHttp(`/specialTreatmentRecord/deleteById`, data)
// 特殊治记录-修改SpecialTreatmentRecord
export const specialTreatmentRecord_edit = (data) => wrapHttp(`/specialTreatmentRecord/edit`, data)
// 特殊治记录-根据主键获取SpecialTreatmentRecord
export const specialTreatmentRecord_getById = (data) => wrapHttp(`/specialTreatmentRecord/getById`, data)
// 特殊治记录-新增SpecialTreatmentRecord
export const specialTreatmentRecord_insert = (data) => wrapHttp(`/specialTreatmentRecord/insert`, data)
export const specialTreatmentRecord_batchInsert = (data) => wrapHttp(`/specialTreatmentRecord/batchInsert`, data)
// 特殊治记录-根据输入时间从监护数据中获取数据
export const specialTreatmentRecord_autoGetValues = (data) => wrapHttp(`/specialTreatmentRecord/autoGetValues`, data)
// 特殊治记录-获取SpecialTreatmentRecord
export const specialTreatmentRecord_findSpecialTreatmentRecords = (data) => wrapHttp(`/specialTreatmentRecord/findSpecialTreatmentRecords`, data)
// 特殊治记录-获取治疗记录表头参数列表
export const specialTreatmentRecord_getTableHeadParamList = (data) => wrapHttp(`/specialTreatmentRecord/getTableHeadParamList`, data)
// 特殊治记录-获取治疗记录表头参数列表
export const specialTreatmentRecord_batchDelete = (data) => wrapHttp(`/specialTreatmentRecord/batchDelete`, data)

// 特殊治疗信息 - 删除TreatmentInfo
export const treatmentInfo_deleteById = (data) => wrapHttp(`/treatmentInfo/deleteById`, data)
// 特殊治疗信息 - 修改TreatmentInfo
export const treatmentInfo_edit = (data) => wrapHttp(`/treatmentInfo/edit`, data)
// 特殊治疗信息 - 分页获取TreatmentInfo
export const treatmentInfo_findTreatmentInfoList = (data) => wrapHttp(`/treatmentInfo/findTreatmentInfoList`, data)
// 特殊治疗信息 - 根据主键获取TreatmentInfo
export const treatmentInfo_getById = (data) => wrapHttp(`/treatmentInfo/getById`, data)
// 特殊治疗信息 - 新增TreatmentInfo
export const treatmentInfo_insert = (data) => wrapHttp(`/treatmentInfo/insert`, data)

// 特殊治疗医嘱 - 删除TreatmentOrder
export const treatmentOrder_deleteById = (data) => wrapHttp(`/treatmentOrder/deleteById`, data)
// 特殊治疗医嘱 - 修改TreatmentOrder
export const treatmentOrder_edit = (data) => wrapHttp(`/treatmentOrder/edit`, data)
// 特殊治疗医嘱 - 获取TreatmentOrder集合
export const treatmentOrder_extractTreatmentOrder = (data) => wrapHttp(`/treatmentOrder/extractTreatmentOrder`, data)
// 特殊治疗医嘱 - 获取TreatmentOrder集合
export const treatmentOrder_findTreatmentOrderList = (data) => wrapHttp(`/treatmentOrder/findTreatmentOrderList`, data)
// 特殊治疗医嘱 - 根据主键获取TreatmentOrder
export const treatmentOrder_getById = (data) => wrapHttp(`/treatmentOrder/getById`, data)
// 特殊治疗医嘱 - 新增TreatmentOrder
export const treatmentOrder_insert = (data) => wrapHttp(`/treatmentOrder/insert`, data)

// 特殊治医嘱明细 - 删除TreatmentOrderDetail
export const treatmentOrderDetail_deleteById = (data) => wrapHttp(`/treatmentOrderDetail/deleteById`, data)
// 特殊治医嘱明细 - 修改TreatmentOrderDetail
export const treatmentOrderDetail_edit = (data) => wrapHttp(`/treatmentOrderDetail/edit`, data)
// 特殊治医嘱明细 - 分页获取TreatmentOrderDetail
export const treatmentOrderDetail_findWithPage = (data) => wrapHttp(`/treatmentOrderDetail/findWithPage`, data)
// 特殊治医嘱明细 - 根据主键获取TreatmentOrderDetail
export const treatmentOrderDetail_getById = (data) => wrapHttp(`/treatmentOrderDetail/getById`, data)
// 特殊治医嘱明细 - 新增TreatmentOrderDetail
export const treatmentOrderDetail_insert = (data) => wrapHttp(`/treatmentOrderDetail/insert`, data)

// jlx 添加【750694】 【（CRRT治疗）【特殊治疗】CRRT治疗页面改造】 需求改造crrt接口
// 获取crrt 治疗记录
export const crrtTreatment_findWithPage = (data) => wrapHttp(`/crrtTreatment/findWithPage`, data)
// 删除治疗记录
export const crrtTreatment_deleteById = (data) => wrapHttp(`/crrtTreatment/deleteById`, data)
// 编辑治疗信息
export const crrtTreatment_edit = (data) => wrapHttp(`/crrtTreatment/edit`, data)
// 新增治疗信息
export const crrtTreatment_insert = (data) => wrapHttp(`/crrtTreatment/insert`, data)
// 获取对应治疗信息
export const crrtTreatment_getById = (data) => wrapHttp(`/crrtTreatment/getById`, data)
// 分页获取检测数据
export const crrtTreatment_findTreatmentCrrtMonitorWithPage = (data) => wrapHttp(`/crrtTreatment/findTreatmentCrrtMonitorWithPage`, data)
// 新增
export const crrtTreatment_insertTreatmentCrrtMonitor = (data) => wrapHttp(`/crrtTreatment/insertTreatmentCrrtMonitor`, data)
// 删除监测记录
export const crrtTreatment_deleteTreatmentCrrtMonitorById = (data) => wrapHttp(`/crrtTreatment/deleteTreatmentCrrtMonitorById`, data)
// 修改检测记录
export const crrtTreatment_editTreatmentCrrtMonitor = (data) => wrapHttp(`/crrtTreatment/editTreatmentCrrtMonitor`, data)
// 新增透析液记录
export const crrtTreatment_insertTreatmentCrrtDialysis = (data) => wrapHttp(`/crrtTreatment/insertTreatmentCrrtDialysis`, data)
// 分页获取透析配液
export const crrtTreatment_findTreatmentCrrtDialysisWithPage = (data) => wrapHttp(`/crrtTreatment/findTreatmentCrrtDialysisWithPage`, data)
// 修改透析配液
export const crrtTreatment_editTreatmentCrrtDialysis = (data) => wrapHttp(`/crrtTreatment/editTreatmentCrrtDialysis`, data)
// 删除透析配液记录
export const crrtTreatment_deleteTreatmentCrrtDialysisById = (data) => wrapHttp(`/crrtTreatment/deleteTreatmentCrrtDialysisById`, data)
// 获取监护项
export const crrtTreatment_getTableHeadParamList = (data) => wrapHttp(`/crrtTreatment/getTableHeadParamList`, data)
// 上机下机
export const crrtTreatment_upperOrDownMachine = (data) => wrapHttp(`/crrtTreatment/upperOrDownMachine`, data)
export const crrtTreatment_treatmentDiseaseAnalysis = (data) => wrapHttp(`/crrtTreatment/treatmentDiseaseAnalysis`, data)
export const syncTreatmentCrrtMonitorToLiquid = (data) => wrapHttp(`/crrtTreatment/syncTreatmentCrrtMonitorToLiquid`, data)

/** ****ECMO 接口 **** */
export const treatmentEcmo_insert = (data) => wrapHttp(`/treatmentEcmo/insert`, data)
export const treatmentEcmo_findWithPage = (data) => wrapHttp(`/treatmentEcmo/findWithPage`, data)
export const treatmentEcmo_edit = (data) => wrapHttp(`/treatmentEcmo/edit`, data)
export const treatmentEcmo_deleteById = (data) => wrapHttp(`/treatmentEcmo/deleteById`, data)
export const treatmentEcmo_getById = (data) => wrapHttp(`/treatmentEcmo/getById`, data)

// 新增透析液记录
export const treatmentEcmo_insertTreatmentMonitor = (data) => wrapHttp(`/treatmentEcmo/insertTreatmentMonitor`, data)
// 删除监测记录
export const treatmentEcmo_deleteTreatmentMonitorById = (data) => wrapHttp(`/treatmentEcmo/deleteTreatmentMonitorById`, data)
// 修改检测记录
export const treatmentEcmo_editTreatmentMonitor = (data) => wrapHttp(`/treatmentEcmo/editTreatmentMonitor`, data)
export const treatmentEcmo_findTreatmentMonitorWithPage = (data) => wrapHttp(`/treatmentEcmo/findTreatmentMonitorWithPage`, data)
export const treatmentEcmo_copyTreatmentMonitor = (data) => wrapHttp(`/crrtTreatment/copyTreatmentMonitor`, data)

