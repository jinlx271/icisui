// 管着管理
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
// 液体平衡-出量查询
export const getFluidBalanceOutList = (data) => wrapHttp(`/NurseBalance/getFluidBalanceOutList`, data)
// 液体平衡-入量查询
export const getFluidBalanceInList = (data) => wrapHttp(`/NurseBalance/getFluidBalanceInList`, data)
// 液体平衡-大便查询
export const getFluidBalanceDefecateList = (data) => wrapHttp(`/NurseBalance/getFluidBalanceDefecateList`, data)
// 液体平衡-班次查询
export const getArrangeList = (data) => wrapHttp(`/SysShiftInfo/findWithPage`, data)
// 液体平衡-保存
export const save = (data) => wrapHttp(`/NurseBalance/save`, data)

// 液体平衡记录 : Liquid Record Controller
// 获取最小间隔
export const liquidRecord_getMinFrequency = (data) => wrapHttp(`/liquidRecord/getMinFrequency`, data)
// 液体平衡-分页获取LiquidRecord
export const liquidRecord_getLiquidRecordList = (data) => wrapHttp(`/liquidRecord/getLiquidRecordList`, data)
// 液体平衡-新增LiquidRecord
export const liquidRecord_insertLiquidRecords = (data) => wrapHttp(`/liquidRecord/insertLiquidRecords`, data)
// 液体平衡-修改LiquidRecord
export const liquidRecord_editLiquidRecords = (data) => wrapHttp(`/liquidRecord/editLiquidRecords`, data)
// 液体平衡-删除LiquidRecord
export const liquidRecord_deleteLiquidRecordListById = (data) => wrapHttp(`/liquidRecord/deleteById`, data)
// 液体平衡-获取统计数据
export const liquidRecord_getLiquidStatistics = (data) => wrapHttp(`/liquidRecord/getLiquidStatistics`, data)
// 液体平衡-液体平衡医嘱执行入量详情
export const liquidRecord_getOrderPlanDetail = (data) => wrapHttp(`/liquidRecord/getOrderPlanDetail`, data)
// 液体平衡-获取配置监测项
export const liquidRecord_getMoniitemList = (data) => wrapHttp(`/liquidRecord/getMoniitemList`, data)

// 液体平衡-液体明细- 获取带入药品集合
export const supplementDrug_getSupplementDrugList = (data) => wrapHttp(`/supplementDrug/getSupplementDrugList`, data)
// 液体平衡-液体明细- 新增带入药品集合
export const supplementDrug_insertSupplementDrug = (data) => wrapHttp(`/supplementDrug/insertSupplementDrug`, data)
// 液体平衡-液体明细- 修改带入药品集合
export const supplementDrug_editSupplementDrug = (data) => wrapHttp(`/supplementDrug/editSupplementDrug`, data)
// 液体平衡-液体明细- 删除带入药品集合
export const supplementDrug_deleteSupplementDrugById = (data) => wrapHttp(`/supplementDrug/deleteSupplementDrugById`, data)
// 液体平衡-液体明细- 根据患者IcuRecordId获取药品集合
export const supplementDrug_getDrugListByIcuRecordId = (data) => wrapHttp(`/supplementDrug/getDrugListByIcuRecordId`, data)
// 液体平衡-液体明细-  获取监护项下拉接口
export const supplementDrug_getMoniitemConfig = (data) => wrapHttp(`/supplementDrug/getMoniitemConfig`, data)

// 液体平衡监护项属性数值记录表
export const moniitemAttrRecord_deleteById = (data) => wrapHttp(`/moniitemAttrRecord/deleteById`, data)
export const moniitemAttrRecord_edit = (data) => wrapHttp(`/moniitemAttrRecord/edit`, data)
export const moniitemAttrRecord_findWithPage = (data) => wrapHttp(`/moniitemAttrRecord/findWithPage`, data)
export const moniitemAttrRecord_getById = (data) => wrapHttp(`/moniitemAttrRecord/getById`, data)
export const moniitemAttrRecord_insert = (data) => wrapHttp(`/moniitemAttrRecord/insert`, data)

// 获取液体平衡个人监护项
export const liquidRecord_getPersonConfigLiquid = (data) => wrapHttp(`/liquidRecord/getPersonConfigLiquid`, data)
// 保存液体平衡数据
export const liquidRecord_savePersonConfigLiquid = (data) => wrapHttp(`/liquidRecord/savePersonConfigLiquid`, data)

// 液体平衡详情记录
export const liquidRecord_getRecordDetailList = (data) => wrapHttp(`/liquidRecord/getRecordDetailList`, data)
// 删除液体平衡详情记录
export const liquidRecord_deleteRecord = (data) => wrapHttp(`/liquidRecord/deleteRecord`, data)

// 液体平衡 - 液体总结 - 获取列表
export const liquidSummary_getSummaryList = (data) => wrapHttp(`/liquidSummary/getSummaryList`, data)
// 液体平衡 - 液体总结 - 新增
export const liquidSummary_insertLiquidSummary = (data) => wrapHttp(`/liquidSummary/insertLiquidSummary`, data)
// 液体平衡 - 液体总结 - 修改
export const liquidSummary_editLiquidSummaryById = (data) => wrapHttp(`/liquidSummary/editLiquidSummaryById`, data)
// 液体平衡 - 液体总结 - 删除
export const liquidSummary_deleteLiquidSummaryById = (data) => wrapHttp(`/liquidSummary/deleteLiquidSummaryById`, data)
// 液体平衡 - 液体总结 - 获取液体平衡小结出、入量值
export const liquidSummary_getSummaryInOut = (data) => wrapHttp(`/liquidSummary/getSummaryInOut`, data)

// 护理文书页面通过id获取对应信息 药品表查询
export const supplementDrug_getSupplementDrugById = (data) => wrapHttp(`/supplementDrug/getSupplementDrugById`, data)
// 护理文书页面修改液体相关数据
export const supplementDrug_editSupplementDrugByDoc = (data) => wrapHttp(`/supplementDrug/editSupplementDrugByDoc`, data)
// 根据主键获取液体平衡记录
export const liquidRecord_getLiquidRecordById = (data) => wrapHttp(`/liquidRecord/getLiquidRecordById`, data)
// 修改
export const liquidRecord_editLiquidRecordById = (data) => wrapHttp(`/liquidRecord/editLiquidRecordById`, data)
// 获取液体平衡汇总
export const liquidRecord_getLiquidTotalList = (data) => wrapHttp(`/liquidRecord/getLiquidTotalList`, data)
// 获取最近一次属性值
export const moniitemAttrRecord_getRecentllyRecord = (data) => wrapHttp(`/moniitemAttrRecord/getRecentllyRecord`, data)
// 班次汇总
export const liquidSummary_getShiftSummaryInOut = (data) => wrapHttp(`/liquidSummary/getShiftSummaryInOut`, data)

// 液体平衡复制
export const liquidRecord_batchCopyItem = (data) => wrapHttp(`/liquidRecord/batchCopyItem`, data)
export const liquidSummary_liquidRecordCountStatistics = (data) => wrapHttp(`/liquidRecord/liquidRecordCountStatistics`, data)
export const liquidSummary_liquidRecordCountDetail = (data) => wrapHttp(`/liquidRecord/liquidRecordCountDetail`, data)
