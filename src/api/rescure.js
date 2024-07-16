// 患者抢救
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

// 患者抢救-开始抢救
export const rescure_begin = (data) => wrapHttp(`/rescure/begin`, data)
// 患者抢救-修改抢救记录
export const rescure_edit = (data) => wrapHttp(`/rescure/edit`, data)
// 患者抢救-结束抢救
export const rescure_finish = (data) => wrapHttp(`/rescure/finish`, data)
// 删除抢救记录
export const rescure_deleteRescure = (data) => wrapHttp(`/rescure/deleteRescure`, data)
// 患者抢救-获取列表
export const rescure_getRescureList = (data) => wrapHttp(`/rescure/getRescureList`, data)
// 患者抢救-获取基础病情监护项配置
export const rescure_getBaseMoniitemConfig = (data) => wrapHttp(`/rescure/getBaseMoniitemConfig`, data)
// 患者抢救-获取护理监护项配置
export const rescure_getNurseMoniitemConfig = (data) => wrapHttp(`/rescure/getNurseMoniitemConfig`, data)
// 患者抢救-获取抢救记录日志列表
export const rescure_getRescureRecordList = (data) => wrapHttp(`/rescure/getRescureRecordList`, data)
// 患者抢救-删除抢救日志记录
export const rescure_deleteRecord = (data) => wrapHttp(`/rescure/deleteRecord`, data)

// 患者抢救-基础病情
// 患者抢救-基础病情-获取列表
export const rescure_rescureBaseMoniitemRecord_getRecordList = (data) => wrapHttp(`/rescure/rescureBaseMoniitemRecord/getRecordList`, data)
// 患者抢救-基础病情-新增
export const rescure_rescureBaseMoniitemRecord_insert = (data) => wrapHttp(`/rescure/rescureBaseMoniitemRecord/insert`, data)
// 患者抢救-基础病情-删除
export const rescure_rescureBaseMoniitemRecord_deleteById = (data) => wrapHttp(`/rescure/rescureBaseMoniitemRecord/deleteById`, data)

// 患者抢救-护理-获取列表
export const rescure_rescureNurseMoniitemRecord_getRecordList = (data) => wrapHttp(`/rescure/rescureNurseMoniitemRecord/getRecordList`, data)
// 患者抢救-护理-新增
export const rescure_rescureNurseMoniitemRecord_insert = (data) => wrapHttp(`/rescure/rescureNurseMoniitemRecord/insert`, data)
// 患者抢救-护理-删除
export const rescure_rescureNurseMoniitemRecord_deleteById = (data) => wrapHttp(`/rescure/rescureNurseMoniitemRecord/deleteById`, data)
// 护理监护项目列表获取
export const rescure_rescureNurseMoniitem_findWithPage = (data) => wrapHttp(`/rescure/rescureNurseMoniitem/findWithPage`, data)
// 护理删除监护项
export const rescure_rescureNurseMoniitem_deleteById = (data) => wrapHttp(`/rescure/rescureNurseMoniitem/deleteById`, data)

// 患者抢救-用药记录
// 患者抢救-用药记录-获取列表
export const rescure_rescureDrugRecord_getRecordList = (data) => wrapHttp(`/rescure/rescureDrugRecord/getRecordList`, data)
// 患者抢救-用药记录-新增
export const rescure_rescureDrugRecord_insert = (data) => wrapHttp(`/rescure/rescureDrugRecord/insert`, data)
// 患者抢救-用药记录-删除
export const rescure_rescureDrugRecord_deleteById = (data) => wrapHttp(`/rescure/rescureDrugRecord/deleteById`, data)

// 患者抢救-用药配置模板
// 患者抢救-用药配置模板-获取列表
export const rescure_rescureDrugTemplate_findWithPage = (data) => wrapHttp(`/rescure/rescureDrugTemplate/findWithPage`, data)
export const rescure_rescureDrugTemplate_findAllWithPage = (data) => wrapHttp(`/rescure/rescureDrugTemplate/findAllWithPage`, data)
// 患者抢救-用药配置模板-根据主键获取
export const rescure_rescureDrugTemplate_getById = (data) => wrapHttp(`/rescure/rescureDrugTemplate/getById`, data)
// 患者抢救-用药配置模板-新增
export const rescure_rescureDrugTemplate_insert = (data) => wrapHttp(`/rescure/rescureDrugTemplate/insert`, data)
// 患者抢救-用药配置模板-编辑
export const rescure_rescureDrugTemplate_edit = (data) => wrapHttp(`/rescure/rescureDrugTemplate/edit`, data)
// 患者抢救-用药配置模板-删除
export const rescure_rescureDrugTemplate_deleteById = (data) => wrapHttp(`/rescure/rescureDrugTemplate/deleteById`, data)

// 患者抢救-用药模板药品关联表
// 患者抢救-用药模板药品关联表-获取列表
export const rescure_rescureTemplateDrug_findWithPage = (data) => wrapHttp(`/rescure/rescureTemplateDrug/findWithPage`, data)
export const rescure_rescureTemplateDrug_findAllWithPage = (data) => wrapHttp(`/rescure/rescureTemplateDrug/findAllWithPage`, data)
// 患者抢救-用药模板药品关联表-根据主键获取
export const rescure_rescureTemplateDrug_getById = (data) => wrapHttp(`/rescure/rescureTemplateDrug/getById`, data)
// 患者抢救-用药模板药品关联表-新增
export const rescure_rescureTemplateDrug_insert = (data) => wrapHttp(`/rescure/rescureTemplateDrug/insert`, data)
// 患者抢救-用药模板药品关联表-编辑
export const rescure_rescureTemplateDrug_edit = (data) => wrapHttp(`/rescure/rescureTemplateDrug/edit`, data)
// 患者抢救-用药模板药品关联表-删除
export const rescure_rescureTemplateDrug_deleteById = (data) => wrapHttp(`/rescure/rescureTemplateDrug/deleteById`, data)

// 患者抢救-事件记录
// 患者抢救-事件记录-获取列表
export const rescure_rescureEventRecord_getRecordList = (data) => wrapHttp(`/rescure/rescureEventRecord/getRecordList`, data)
// 患者抢救-事件记录-新增
export const rescure_rescureEventRecord_insert = (data) => wrapHttp(`/rescure/rescureEventRecord/insert`, data)
// 患者抢救-事件记录-删除
export const rescure_rescureEventRecord_deleteById = (data) => wrapHttp(`/rescure/rescureEventRecord/deleteById`, data)

// 抢救配置-用药分页获取
export const rescure_rescureDrug_findWithPage = (data) => wrapHttp(`/rescure/rescureDrug/findWithPage`, data)
export const rescure_rescureDrug_findAllWithPage = (data) => wrapHttp(`/rescure/rescureDrug/findAllWithPage`, data)

// 抢救配置-事件配置模板
export const rescure_rescureEventTemplate_findWithPage = (data) => wrapHttp(`/rescure/rescureEventTemplate/findWithPage`, data)
export const rescure_rescureEventTemplate_findAllWithPage = (data) => wrapHttp(`/rescure/rescureEventTemplate/findAllWithPage`, data)
export const rescure_rescureEventTemplate_getById = (data) => wrapHttp(`/rescure/rescureEventTemplate/getById`, data)
export const rescure_rescureEventTemplate_insert = (data) => wrapHttp(`/rescure/rescureEventTemplate/insert`, data)
export const rescure_rescureEventTemplate_deleteById = (data) => wrapHttp(`/rescure/rescureEventTemplate/deleteById`, data)
export const rescure_rescureEventTemplate_edit = (data) => wrapHttp(`/rescure/rescureEventTemplate/edit`, data)
// 抢救配置
// 抢救配置  基础病情 数据查询
export const rescure_rescureBaseMoniitem_findAllWithPage = (data) => wrapHttp(`/rescure/rescureBaseMoniitem/findAllWithPage`, data)
// 抢救配置  基础病情 批量插入数据
export const rescure_rescureBaseMoniitem_batchInsert = (data) => wrapHttp(`/rescure/rescureBaseMoniitem/batchInsert`, data)
// 抢救配置  基础病情 删除
export const rescure_rescureBaseMoniitem_deleteById = (data) => wrapHttp(`/rescure/rescureBaseMoniitem/deleteById`, data)

// 抢救配置  基础病情 批量插入数据
export const rescure_rescureDrug_batchInsert = (data) => wrapHttp(`/rescure/rescureDrug/batchInsert`, data)
// 抢救配置  基础病情 插入数据
export const rescure_rescureDrug_insert = (data) => wrapHttp(`/rescure/rescureDrug/insert`, data)
// 抢救配置  基础病情 插入数据
export const rescure_rescureDrug_edit = (data) => wrapHttp(`/rescure/rescureDrug/edit`, data)
// 抢救配置  基础病情 删除
export const rescure_rescureDrug_deleteById = (data) => wrapHttp(`/rescure/rescureDrug/deleteById`, data)
// 抢救配置 基础病情清除设置
export const rescure_rescureBaseMoniitem_clear = (data) => wrapHttp(`/rescure/rescureBaseMoniitem/clear`, data)
// 抢救配置 基础病情复制配置
export const rescure_rescureBaseMoniitem_copy = (data) => wrapHttp(`/rescure/rescureBaseMoniitem/copy`, data)
// 抢救记录项-->输液/用药
// export const rescure_rescureDrug_copy = (data) => wrapHttp(`/rescure/rescureDrug/copy`, data)//废弃
// 抢救记录项-->其他事件
// export const rescure_rescureEventTemplate_copy = (data) => wrapHttp(`/rescure/rescureEventTemplate/copy`, data)// 废弃
// 抢救查询
export const rescure_queryRescureList = (data) => wrapHttp(`/rescure/queryRescureList`, data)
