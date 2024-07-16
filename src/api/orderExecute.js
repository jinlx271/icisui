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
// 医嘱执行-查询执行计划列表
export const order_orderExecute_getOrderPlanList = (data) => wrapHttp(`/order/orderExecute/getOrderPlanList`, data)
// 医嘱执行-获取执行详情
export const order_orderExecute_getExecuteList = (data) => wrapHttp(`/order/orderExecute/getExecuteList`, data)
// 医嘱执行-修改
export const order_orderExecute_edit = (data) => wrapHttp(`/order/orderExecute/edit`, data)
// 医嘱执行-删除
export const order_orderExecute_delete = (data) => wrapHttp(`/order/orderExecute/delete`, data)
// 医嘱执行-删除特殊用药
export const order_orderExecute_deleteSpecialDrug = (data) => wrapHttp(`/order/orderExecute/deleteSpecialDrug`, data)
// 医嘱执行-设置特殊用药
export const order_orderExecute_editSpecialDrug = (data) => wrapHttp(`/order/orderExecute/editSpecialDrug`, data)
// 医嘱执行-取消
export const order_orderExecute_cancel = (data) => wrapHttp(`/order/orderExecute/cancel`, data)
// 医嘱执行-开始
export const order_orderExecute_executeBegin = (data) => wrapHttp(`/order/orderExecute/executeBegin`, data)
// 医嘱执行-暂停
// export const order_orderExecute_suspend = (data) => wrapHttp(`/order/orderExecute/suspend`, data)
// 医嘱执行-完成
export const order_orderExecute_finish = (data) => wrapHttp(`/order/orderExecute/finish`, data)
// 医嘱执行-表格模式完成-临时医嘱
export const order_orderExecute_formFinish = (data) => wrapHttp(`/order/orderExecute/formFinish`, data)
// 医嘱执行-表格模式取消完成-临时医嘱
export const order_orderExecute_formCancelFinish = (data) => wrapHttp(`/order/orderExecute/formCancelFinish`, data)
// 医嘱执行-非持续性输药完成
export const order_orderExecute_executeFinish = (data) => wrapHttp(`/order/orderExecute/executeFinish`, data)
// 医嘱执行-巡视
export const order_orderExecute_sign = (data) => wrapHttp(`/order/orderExecute/sign`, data)
// 医嘱执行-查询执行计划中药物总量
export const order_orderExecute_getDrugTotal = (data) => wrapHttp(`/order/orderExecute/getDrugTotal`, data)
// 医嘱执行-续药
export const order_orderExecute_executeAgain = (data) => wrapHttp(`/order/orderExecute/executeAgain`, data)
// 开启自动巡视
export const order_orderExecute_setAutoSign = (data) => wrapHttp(`/order/orderExecute/setAutoSign`, data)
// 获取给药图数据
export const order_orderExecute_getGiveDrugList = (data) => wrapHttp(`/order/orderExecute/getGiveDrugList`, data)
// 医嘱执行-是否续药
export const order_editContinuation = (data) => wrapHttp(`/order/editContinuation`, data)
// 医嘱执行-审核医嘱执行
export const order_orderExecute_audit = (data) => wrapHttp(`/order/orderExecute/audit`, data)
// 医嘱执行-审核医嘱执行
export const order_orderExecute_cancelAudit = (data) => wrapHttp(`/order/orderExecute/cancelAudit`, data)
// 医嘱执行-表格模式巡视
export const order_orderExecute_formSign = (data) => wrapHttp(`/order/orderExecute/formSign`, data)

// 同步PDA医嘱执行记录
export const pda_orderExeSync = (data) => wrapHttp(`/pda/orderExeSync`, data)
// 修改入量
export const order_editRealInput = (data) => wrapHttp(`/order/editRealInput`, data)
// 医嘱批量审核
export const orderExecute_batchAudit = (data) => wrapHttp(`/order/orderExecute/batchAudit`, data)

// 批量开始执行
export const orderExecute_batchExecuteBegin = (data) => wrapHttp(`/order/orderExecute/batchExecuteBegin`, data)
// 非持续性输药批量完成
export const orderExecute_batchExecuteFinish = (data) => wrapHttp(`/order/orderExecute/batchExecuteFinish`, data)
// 获取流速单位
export const orderExecute_getStandardFlowRate = (data) => wrapHttp(`/order/orderExecute/getStandardFlowRate`, data)
// 手动添加执行计划
export const orderExecute_addOrderPlan = (data) => wrapHttp(`/order/orderExecute/addOrderPlan`, data)
// 手动添加执行计划
export const orderExecute_deleteOrderPlan = (data) => wrapHttp(`/order/orderExecute/deleteOrderPlan`, data)
// 重巡
export const orderExecute_deleteFrom = (data) => wrapHttp(`/order/orderExecute/deleteFrom`, data)
// 获取上次执行完成时间
export const orderExecute_getTheLastFinishTime = (data) => wrapHttp(`/order/orderExecute/getTheLastFinishTime`, data)
// 获取医嘱组
export const orderExecute_getOrderGroup = (data) => wrapHttp(`/order/getOrderGroup`, data)
// 修改补录医嘱
export const orderExecute_editOrder = (data) => wrapHttp(`/order/editOrder`, data)
// 取消提取医嘱
export const order_cancelExtractOrder = (data) => wrapHttp(`/order/cancelExtractOrder`, data)
// 获取已执行计划列表
export const orderExecute_getExecutePlanList = (data) => wrapHttp(`/order/orderExecute/getExecutePlanList`, data)
export const order_orderExecute_getPlanList = (data) => wrapHttp(`/order/orderExecute/getPlanList`, data)
// 外出暂停执行医嘱
export const orderExecute_patientOutSuspend = (data) => wrapHttp(`/order/orderExecute/patientOutSuspend`, data)
// 外出暂停执行医嘱
export const orderExecute_continueExecute = (data) => wrapHttp(`/order/orderExecute/continueExecute`, data)
// 新增医嘱执行计划
export const orderExecute_addBloodOrderPlan = (data) => wrapHttp(`/order/orderExecute/addBloodOrderPlan`, data)
// 修改输血明细
export const orderPlanBlood_edit = (data) => wrapHttp(`/orderPlanBlood/edit`, data)
// 根据执行计划ID获取明细
export const orderPlanBlood_getByOrderPlanId = (data) => wrapHttp(`/orderPlanBlood/getByOrderPlanId`, data)

// 设置营养医嘱
export const order_setNutritionTag = (data) => wrapHttp(`/order/setNutritionTag`, data)

// 输血医嘱监测列表
export const orderPlanMoniitemRecord_getRecordList = (data) => wrapHttp(`/orderPlanMoniitemRecord/getRecordList`, data)
export const orderPlanMoniitemRecord_saveRecord = (data) => wrapHttp(`/orderPlanMoniitemRecord/saveRecord`, data)
export const orderPlanMoniitemRecord_updateRecord = (data) => wrapHttp(`/orderPlanMoniitemRecord/updateRecord`, data)
export const orderPlanMoniitemRecord_delete = (data) => wrapHttp(`/orderPlanMoniitemRecord/delete`, data)

// 营养明细表
export const orderPlanNutritionDetail_getListByOrderPlanId = (data) => wrapHttp(`/orderPlanNutritionDetail/getListByOrderPlanId`, data)
export const orderPlanNutritionDetail_edit = (data) => wrapHttp(`/orderPlanNutritionDetail/edit`, data)
export const orderPlanNutritionDetail_deleteById = (data) => wrapHttp(`/orderPlanNutritionDetail/deleteById`, data)
export const orderPlanNutritionDetail_getPatientEnergyDetail = (data) => wrapHttp(`/orderPlanNutritionDetail/getPatientEnergyDetail`, data)

// 修改配药组数
export const orderExecute_editDrugAddCount = (data) => wrapHttp(`/order/orderExecute/editDrugAddCount`, data)

// 治疗监测
export const orderPlanTreatement_getTreamentDetail = (data) => wrapHttp(`/orderPlanTreatement/getTreamentDetail`, data)
export const orderPlanTreatement_insert = (data) => wrapHttp(`/orderPlanTreatement/insert`, data)
export const orderPlanTreatement_edit = (data) => wrapHttp(`/orderPlanTreatement/edit`, data)
export const orderPlanTreatement_deleteById = (data) => wrapHttp(`/orderPlanTreatement/deleteById`, data)
// 自动生成巡视记录接口
export const orderExecute_autoSign = (data) => wrapHttp(`/order/orderExecute/autoSign`, data)
export const getOrderPlanListDiseaseAnalysis = (data) => wrapHttp(`/order/orderExecute/getOrderPlanListDiseaseAnalysis`, data)
