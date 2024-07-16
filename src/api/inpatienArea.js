// 病区管理
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
// 患者查询-获取患者信息分页
export const getPatInfoWithPage = (data) => wrapHttp(`/pat/getPatInfoWithPage`, data)
/**
 * 患者查询-selete类型
 * @groupType
 * groupType:'patQueryType' // 患者查询分类
 * groupType:'areaSources' // 入区来源
 * groupType:'patStatus' // 患者状态
 * groupType:'patAllQueryType' // 患者综合查询分类
 */
export const getDictByGroupType = (data) => wrapHttp(`/dict/getDictByGroupType`, data, 'get')

// 晨会交班
export const morningChange_getMorningChangeList = (data) => wrapHttp(`/morningChange/getMorningChangeList`, data)
// 保存
export const morningChange_saveMorningChangeList = (data) => wrapHttp(`/morningChange/saveMorningChangeList`, data)
// 取消
export const morningChange_cancleMorningChange = (data) => wrapHttp(`/morningChange/cancleMorningChange`, data)
// 分页获取晨会交班日期列表
export const morningChange_queryMorningChangePage = (data) => wrapHttp(`/morningChange/queryMorningChangePage`, data)
// 校验是否存在交班日期数据
export const morningChange_checkMorningChange = (data) => wrapHttp(`/morningChange/checkMorningChange`, data)
// 晨会交班GPT
export const morningChange_getGptContent = (data) => wrapHttp(`/morningChange/getGptContent`, data)

// 患者查询
export const patientInfo_findPaientWithPage = (data) => wrapHttp(`/patientInfo/findPaientWithPage`, data)
// 患者查询
export const patientInfo_selectPatientPage = (data) => wrapHttp(`/patientInfo/selectPatientPage`, data)

// 归档管理 患者列表查询
export const archiveManager_patientList = (data) => wrapHttp(`/archiveManager/patientList`, data)
// 归档管理 文书列表
export const archiveManager_patientArchiveList = (data) => wrapHttp(`/archiveManager/patientArchiveList`, data)
// 批量归档
export const archiveManager_batchArchive = (data) => wrapHttp(`/archiveManager/batchArchive`, data)
// 病区刷新
export const archiveManager_refreshMidData = (data) => wrapHttp(`/archiveManager/refreshMidData`, data)

// 病区管理-审核管理-病区护理记录
export const dataManager_dataForAudit = (data) => wrapHttp(`/nurseRecord/dataManager/dataForAudit`, data)
// 病区管理-审核管理-医嘱执行审核
export const orderExecute_getOrderPlanAuditList = (data) => wrapHttp(`/order/orderExecute/getOrderPlanAuditList`, data)
// 病区管理-审核管理-评估查询
export const dataManager_dataForApprove = (data) => wrapHttp(`/assess/dataManager/dataForApprove`, data)

// 病区管理-排班管理-列表
export const schedule_findScheduleInfo = (data) => wrapHttp(`/schedule/findScheduleInfo`, data)
// 病区管理-排班管理-修改详情获取
export const schedule_getById = (data) => wrapHttp(`/schedule/getById`, data)
// 病区管理-排班管理-修改
export const schedule_edit = (data) => wrapHttp(`/schedule/edit`, data)
// 病区管理-排班管理-删除
export const schedule_deleteById = (data) => wrapHttp(`/schedule/deleteById`, data)
// 病区管理-排班管理-插入
export const schedule_insert = (data) => wrapHttp(`/schedule/insert`, data)
// 病区管理-排班管理-导入上周排班
export const schedule_importScheduleInfo = (data) => wrapHttp(`/schedule/importScheduleInfo`, data)
// 病区管理-排班管理-导入排班模板
export const schedule_importScheduleTemp = (data) => wrapHttp(`/schedule/importScheduleTemp`, data)
// 病区管理-管路查询-按插管记录查询
export const catheterRecord_getCatheterRecordList = (data) => wrapHttp(`/catheterRecord/getCatheterRecordList`, data)
// 病区管理-管路查询-按导管名称查询
export const catheterRecord_getCatheterSummaryList = (data) => wrapHttp(`/catheterRecord/getCatheterSummaryList`, data)
export const btsv_dataList = (data) => wrapHttp(`/btsv/dataList`, data)
export const liquidRecord_liquidRecordStatistics = (data) => wrapHttp(`/liquidRecord/liquidRecordStatistics`, data)
