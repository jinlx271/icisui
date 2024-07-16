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
// 修改历史记录
export const nurseRecord_editHistory = (data, method) => wrapHttp(`/nurseRecord/editHistory`, data, method)
// 查询患者非整点监护配置
export const moniitemRecord_getGrowthCurve = (data, method) => wrapHttp(`/moniitemRecord/getGrowthCurve`, data, method)
// ICIS-业务模块-医学计算器
// 查询患者非整点监护配置
export const patiMoniitem_findPatiMoniitem = (data, method) => wrapHttp(`/patiMoniitem/findPatiMoniitem`, data, method)
// 保存患者非整点监护配置
export const patiMoniitem_savePatiMoniitem = (data, method) => wrapHttp(`/patiMoniitem/savePatiMoniitem`, data, method)

export const medicalc_batchGetRecentCalcResult = (data, method) => wrapHttp(`/medicalc/batchGetRecentCalcResult`, data, method)
export const medicalc_calcResult = (data, method) => wrapHttp(`/medicalc/calcResult`, data, method)
export const medicalc_getRecentCalcResult = (data, method) => wrapHttp(`/medicalc/getRecentCalcResult`, data, method)
// 添加明细
export const releasePain_addOperation = (data, method) => wrapHttp(`/releasePain/addOperation`, data, method)
// 取消结束
export const releasePain_cancelFinish = (data, method) => wrapHttp(`/releasePain/cancelFinish`, data, method)
// 取消开始
export const releasePain_cancelStart = (data, method) => wrapHttp(`/releasePain/cancelStart`, data, method)
// 删除明细
export const releasePain_deleteOperation = (data, method) => wrapHttp(`/releasePain/deleteOperation`, data, method)
// 删除医嘱执行
export const releasePain_deleteOrderExecute = (data, method) => wrapHttp(`/releasePain/deleteOrderExecute`, data, method)
// 结束治疗
export const releasePain_finishReleasePain = (data, method) => wrapHttp(`/releasePain/finishReleasePain`, data, method)
// 获取评估方法列表
export const releasePain_getAssessFormList = (data, method) => wrapHttp(`/releasePain/getAssessFormList`, data, method)
// 获取评估记录列表
export const releasePain_getAssessRecordList = (data, method) => wrapHttp(`/releasePain/getAssessRecordList`, data, method)
// 获取医嘱执行明细
export const releasePain_getExecuteRecord = (data, method) => wrapHttp(`/releasePain/getExecuteRecord`, data, method)
// 保存医嘱执行
export const releasePain_saveOrderExecute = (data, method) => wrapHttp(`/releasePain/saveOrderExecute`, data, method)
// 开始治疗
export const releasePain_startReleasePain = (data, method) => wrapHttp(`/releasePain/startReleasePain`, data, method)

// 镇痛镇静  取消结束节点
export const ztzj_cancelOverPoint4ZTZJ = (data, method) => wrapHttp(`/ztzj/cancelOverPoint4ZTZJ`, data, method)
// 镇痛镇静  取消开始节点
export const ztzj_cancelStartPoint4ZTZJ = (data, method) => wrapHttp(`/ztzj/cancelStartPoint4ZTZJ`, data, method)
// 镇痛镇静  删除治疗记录
export const ztzj_deleteZTZJRecord = (data, method) => wrapHttp(`/ztzj/deleteZTZJRecord`, data, method)
// 镇痛镇静  获取评分记录和治疗记录
export const ztzj_getAssessAndZTZJRecord = (data, method) => wrapHttp(`/ztzj/getAssessAndZTZJRecord`, data, method)
// 镇痛镇静  获取镇痛镇静评估表模板
export const ztzj_getAssessModel = (data, method) => wrapHttp(`/ztzj/getAssessModel`, data, method)
// 镇痛镇静  获取药品执行记录
export const ztzj_getDrugExcuteRecord = (data, method) => wrapHttp(`/ztzj/getDrugExcuteRecord`, data, method)
// 镇痛镇静  获取目标配置
export const ztzj_getTargetConfig = (data, method) => wrapHttp(`/ztzj/getTargetConfig`, data, method)
// 镇痛镇静  获取评估记录趋势数据
export const ztzj_getZTZJRecord = (data, method) => wrapHttp(`/ztzj/getZTZJRecord`, data, method)
// 镇痛镇静  修改治疗记录
export const ztzj_modifyZTZJRecord = (data, method) => wrapHttp(`/ztzj/modifyZTZJRecord`, data, method)
// 镇痛镇静  保存治疗记录
export const ztzj_saveZTZJRecord = (data, method) => wrapHttp(`/ztzj/saveZTZJRecord`, data, method)
// 镇痛镇静  设置结束节点
export const ztzj_setOverPoint4ZTZJ = (data, method) => wrapHttp(`/ztzj/setOverPoint4ZTZJ`, data, method)
// 镇痛镇静  设置开始节点
export const ztzj_setStartPoint4ZTZJ = (data, method) => wrapHttp(`/ztzj/setStartPoint4ZTZJ`, data, method)

// 床位卡-我分管的床位
export const userBed_findUserBedList = (data) => wrapHttp(`/userBed/findUserBedList`, data)
// 床位卡-我分管的床位设置
export const userBed_setUserBedList = (data) => wrapHttp(`/userBed/setUserBedList`, data)
// 获取当前登录用户的有效的床位列表信息
export const userBed_getLoginUserBedList = (data) => wrapHttp(`/userBed/getLoginUserBedList`, data)
// 床位卡-患者统计数量
export const getPatientTotal = (data) => wrapHttp(`/pat/getPatientTotal`, data, 'get')
// 床位卡-床位卡患者信息
export const getBedCardPatientInfo = (data) => wrapHttp(`/pat/getBedCardPatientInfo`, data, 'get')
// 床位卡-患者基本信息
export const getPatientInfo = (data) => wrapHttp(`/pat/getPatientInfo`, data, 'get')
// 获取床位出区标准状态
export const getOutwardRuleStatusList = (data) => wrapHttp(`/patientInfo/getOutwardRuleStatusList`, data)
/**
 * 床位卡-selete类型
 * @groupType
 * groupType:'patQueryType' // 患者查询分类
 * groupType:'areaSources' // 入区来源
 * groupType:'patStatus' // 患者状态
 */

// 床位卡-换床
export const changeBed = (data) => wrapHttp(`/pat/changeBed`, data)
// 床位卡-设备连接
export const deviceConnect = (data) => wrapHttp(`/pat/deviceConnect`, data)
// 床位卡-编辑患者
export const editPatient = (data) => wrapHttp(`/pat/editPatient`, data)
// 床位卡-床位锁定与解锁
export const lockAndUnlock = (data) => wrapHttp(`/pat/lockAndUnlock`, data)
// 床位卡-患者正常入区
export const patientNormalIntoArea = (data) => wrapHttp(`/pat/patientNormalIntoArea`, data)
// 床位卡-患者出区
export const patientOutArea = (data) => wrapHttp(`/pat/patientOutArea`, data)
// 床位卡-患者临时入区
export const patientTempIntoArea = (data) => wrapHttp(`/pat/patientTempIntoArea`, data)
// 床位卡-患者入区信息
export const getPatientIntoAreaInfo = (data) => wrapHttp(`/pat/getPatientIntoAreaInfo`, data, 'get')
// 床位卡-患者入区条数
export const getPatientIntoAreaTotal = (data) => wrapHttp(`/pat/getPatientIntoAreaTotal`, data, 'get')
// 系统消息刷新时间(单位秒)
export const getBasicSysParameterById = (data) => wrapHttp(`/sys/getBasicSysParameterById`, data, 'get')
// 患者取消入区
export const patientCancelIntoArea = (data) => wrapHttp(`/pat/patientCancelIntoArea`, data, 'get')
/**
 * 获取用户医疗人员下拉集合
 * 可选参数用户类型：  typeList:[
 * 系统管理员       'ADMIN'
 * 床旁护士         'NURSE'
 * 护士长           'HEAD_NURSE'
 * 主班护士|责任护士  'MAIN_NURSE'
 * 主治医师          'ATTENDING_DOCTOR'
 * 主任医师         'CHIEF_PHYSICIAN'
 * 住院医师         'RESIDENTS'
 * 副主任医师       'DEPUTY_CHIEF_PHYSICIAN'
 */
export const getUserSelectList = (data) => wrapHttp(`/sys/getUserSelectList`, data)
// 所有护士 最好别用 用下面那个
export const getNurseUserList = (data) => wrapHttp(`/sys/getNurseUserList`, data)
// 病区所有工作人 护士 医生
export const getWardUserList = (data) => wrapHttp(`/sys/getWardUserList`, data)
// 患者查询-来源科室
export const getDeptList = (data) => wrapHttp(`/sys/getDeptList`, data)

// 护理文书 获取重症护理数据
export const getFormData_patientRecord = (data) => wrapHttp(`/patientRecord/getFormData`, data)
export const patientRecord_getPatientInfo = (data) => wrapHttp(`/patientRecord/getPatientInfo`, data)
export const patientRecord_getPatientPropertyList = (data) => wrapHttp(`/patientRecord/getPatientPropertyList`, data)

/** ******************新接口*******************/
// 获取床位信息
export const patientInfo_getBedList = (data) => wrapHttp(`/patientInfo/getBedList`, data)
// 按自定义排序top8查询配置的病区评估单
export const config_top8BySortNo = (data) => wrapHttp(`/wardassess/config/top8BySortNo`, data)
// 获取患者带入区列表
export const patientInfo_getMatchPatienList = (data) => wrapHttp(`/patientInfo/getMatchPatienList`, data)
// 获取待入区患者列表
export const patientInfo_getWaitPatienList = (data) => wrapHttp(`/patientInfo/getWaitPatienList`, data)
// 获取临时患者列表
export const patientInfo_getTempPatienList = (data) => wrapHttp(`/patientInfo/getTempPatienList`, data)
// 获取待入区患者人数
export const patientInfo_statusGroupCount = (data) => wrapHttp(`/patientInfo/statusGroupCount`, data)
// 根据区号获取床位信息列表  精简版
export const patientInfo_getBedPatientInfo = (data) => wrapHttp(`/patientInfo/getBedPatientInfo`, data)
// 获取患者信息
export const patientInfo_getPaientInfo = (data) => wrapHttp(`/patientInfo/getPaientInfo`, data)
// 是否48小时内再入区
export const patientInfo_getReentryDict = (data) => wrapHttp(`/patientInfo/getReentryLogic`, data)
// 获取手术信息
export const patientInfo_getPatientSurgeryInfo = (data) => wrapHttp(`/patientInfo/getPatientSurgeryInfo`, data)
// 锁定床位
export const patientBusi_lockBed = (data) => wrapHttp(`/patientBusi/lockBed`, data)
// 解锁床位
export const patientBusi_unlockBed = (data) => wrapHttp(`/patientBusi/unlockBed`, data)
// 患者正常入区
export const patientBusi_inArea = (data) => wrapHttp(`/patientBusi/inArea`, data)
// 患者临时入区
export const patientBusi_tempInArea = (data) => wrapHttp(`/patientBusi/tempInArea`, data)
// 换成
export const patientBusi_changeBed = (data) => wrapHttp(`/patientBusi/changeBed`, data)
// 编辑患者信息
export const patientBusi_editorPatientInfo = (data) => wrapHttp(`/patientBusi/editorPatientInfo`, data)
// 患者出区
export const patientBusi_outArea = (data) => wrapHttp(`/patientBusi/outArea`, data)
// 修改应激因素
export const patientBusi_editorStress = (data) => wrapHttp(`/patientBusi/editorStress`, data)
// 获取监护时间列表
// export const patientInfo_getMoniitemEvents = (data) => wrapHttp(`/patientInfo/getMoniitemEvents`, data)
export const busi_monitoringEvent_list = (data) => wrapHttp(`/busi/monitoringEvent/list`, data)
// 患者匹配入区
export const patientBusi_matchInArea = (data) => wrapHttp(`/patientBusi/matchInArea`, data)
// 患者统计数据
export const patientInfo_getPatientManagetStatic = (data) => wrapHttp(`/patientInfo/getPatientManagetStatic`, data)
// 撤销匹配
export const patientBusi_matchCancel = (data) => wrapHttp(`/patientBusi/matchCancel`, data)
// 取消入区
export const patientBusi_cancelInICU = (data) => wrapHttp(`/patientBusi/cancelInICU`, data)
// 取消入区
export const patientBusi_rebackICU = (data) => wrapHttp(`/patientBusi/rebackICU`, data)
// 获取下一个ICU编号
export const patientBusi_getNextIcuNo = (data) => wrapHttp(`/patientBusi/getNextIcuNo`, data)
// 获取患者出区信息
export const patientBusi_getOutAreaInfo = (data) => wrapHttp(`/patientBusi/getOutAreaInfo`, data)
/** ******************患者评估*******************/
// 评估单配置-病区评估表管理-根据病区获或者评估表 不分页
export const config_list = (data) => wrapHttp(`/wardassess/config/list`, data)
// 按照条件查询病区护理记录数据
export const nurseRecord_dataManager_dataList = (data) => wrapHttp(`nurseRecord/dataManager/dataList`, data)
// 按照条件查询病人评估单评分修改记录数据
export const assess_formapply_editHistoryData = (data) => wrapHttp(`/assess/formapply/editHistoryData`, data)
// 按照条件查询病人评估单评分修改记录数据
export const assess_dataManager_dataList = (data) => wrapHttp(`/assess/dataManager/dataList`, data)
// 评估单配置-获取某个病人评分应用数据列表
export const formapply_scoreList = (data) => wrapHttp(`/assess/formapply/scoreList`, data)
// 评估单配置-获取单个评分应用数据
export const formapply_getById = (data) => wrapHttp(`/assess/formapply/getById`, data)
// 评估单配置-保存单个评分应用数据
export const formapply_add = (data) => wrapHttp(`/assess/formapply/add`, data)
// 评估单配置-修改表单应用数据
export const formapply_update = (data) => wrapHttp(`/assess/formapply/update`, data)
// 评估单配置-删除评分数据
export const formapply_delete = (data) => wrapHttp(`/assess/formapply/delete`, data)
// 评估单配置-查询上一次表单数据
export const formapply_getPreScoreData = (data) => wrapHttp(`/assess/formapply/getPreScoreData`, data)
// 评估单配置-获取表单上配置的病人数据源
export const datasources_getDataSources = (data) => wrapHttp(`/assess/datasources/getDataSources`, data)
// 评估单配置-查询折线图数据
export const formapply_lineChartData = (data) => wrapHttp(`/assess/formapply/lineChartData`, data)
// 评估单配置-查询评估单趋势表格数据
export const formapply_tableData = (data) => wrapHttp(`/assess/formapply/tableData`, data)
// 评估单配置-评估单审核 新加入
export const formapply_approve = (data) => wrapHttp(`/assess/formapply/approve`, data)
// 评估单配置-评估单批量审核 新加入
export const dataManager_batchApprove = (data) => wrapHttp(`/assess/dataManager/batchApprove`, data)
// 评估单配置-取消评估单审核 新加入
export const formapply_cancelApprove = (data) => wrapHttp(`/assess/formapply/cancelApprove`, data)
// 评估单配置-获取单次评分的历史修改记录数据列表
export const formapply_editHistory = (data) => wrapHttp(`/assess/formapply/editHistory`, data)
// 评估单配置-修改记录 评审人
export const formapply_editHistoryUserList = (data) => wrapHttp(`/assess/formapply/editHistoryUserList`, data)
// 获取病区配置评估单类型的最新列表数据
export const formapply_classificationTopList = (data) => wrapHttp(`/assess/formapply/classificationTopList`, data)
// 根据评估表编码获取患者评估记录
export const formapply_getPatientScoreRecord = (data) => wrapHttp(`/assess/formapply/getPatientScoreRecord`, data)

// 患者概览医嘱执行
export const patientOverview_getOrderDataList = (data) => wrapHttp(`/patientOverview/getOrderDataList`, data)
// 患者护嘱
export const patientOverview_getNursingDataList = (data) => wrapHttp(`/patientOverview/getNursingDataList`, data)
// 液体平衡
export const patientOverview_getLuquidDataList = (data) => wrapHttp(`/patientOverview/getLuquidDataList`, data)
// 液体平衡 班次
export const patientOverview_getLuquidDataListByShift = (data) => wrapHttp(`/patientOverview/getLuquidDataListByShift`, data)
// 其他监测指标
export const patientOverview_getObserverOtherDataList = (data) => wrapHttp(`/patientOverview/getObserverOtherDataList`, data)
// 患者观察项目
export const patientOverview_getPathObserveDataList = (data) => wrapHttp(`/patientOverview/getPathObserveDataList`, data)
// 实验室指标
// export const patientOverview_getLabDataList = (data) => wrapHttp(`/patientOverview/getLabDataList`, data)
export const patientInspectDetail_getInterestList = (data) => wrapHttp(`/patientInspectDetail/getInterestList`, data)
// 根据时间获取患者最近的监护数据
export const patientOverview_getMoniitemRecordListByTime = (data) => wrapHttp(`/patientOverview/getMoniitemRecordListByTime`, data)
// 修改患者概览配置
export const patientOverviewConfig_edit = (data) => wrapHttp(`/patientOverviewConfig/edit`, data)
// 获取系统用户配置
export const patientOverviewConfig_getUserConfig = (data) => wrapHttp(`/patientOverviewConfig/getUserConfig`, data)

// 获取配置项目基础数据
export const personMoniitem_findConfigMoniitem = (data) => wrapHttp(`/personMoniitem/findConfigMoniitem`, data)
// 获取个人已配置项
export const personMoniitem_findPersonConfigMoniitemExistData = (data) => wrapHttp(`/personMoniitem/findPersonConfigMoniitemExistData`, data)
// 获取个人已配置项
export const personMoniitem_findPersonConfigMoniitem = (data) => wrapHttp(`/personMoniitem/findPersonConfigMoniitem`, data)
// 修改配置项数据
export const personMoniitem_updatePersonConfigMoniitem = (data) => wrapHttp(`/personMoniitem/updatePersonConfigMoniitem`, data)

// 获取关注配置的基础数据
export const personMoniitem_findObserverMoniitem = (data) => wrapHttp(`/personMoniitem/findObserverMoniitem`, data)
// 获取关注配置的基础数据
export const personMoniitem_findPersonObserverMoniitem = (data) => wrapHttp(`/personMoniitem/findPersonObserverMoniitem`, data)
// 修改关注配置的基础数据
export const personMoniitem_updatePersonObserverMoniitem = (data) => wrapHttp(`/personMoniitem/updatePersonObserverMoniitem`, data)
// 获取患者信息
export const patientOverview_getRecentMoniitemRecordList = (data) => wrapHttp(`/patientOverview/getRecentMoniitemRecordList`, data)
// 获取患者信息
export const moniitemRecord_getRecentMoniRecord = (data) => wrapHttp(`/moniitemRecord/getRecentMoniRecord`, data)
export const cancelCheckMoniitemRecord = (data) => wrapHttp(`/moniitemRecord/cancelCheckMoniitemRecord`, data)
export const checkMoniitemRecord = (data) => wrapHttp(`/moniitemRecord/checkMoniitemRecord`, data)
export const getMoniitemCheckList = (data) => wrapHttp(`/moniitemRecord/getMoniitemCheckList`, data)
// 患者 360视图 获取sessionid
export const clever_getCleverSessionId = (data) => wrapHttp(`/clever/getCleverSessionId`, data)
// 患者 360视图 登录360视图
export const clever_loginClever = (data) => wrapHttp(`/clever/loginClever`, data)
export const clever_getCleverUrlBZ = (data) => wrapHttp(`/clever/getCleverUrlBZ`, data)

// 获取监护事件自定义配置列表
export const config_monitoringEvent_listSelfConfig = (data) => wrapHttp(`/config/monitoringEvent/listSelfConfig`, data)
// 新增病人监护事件业务数据
export const busi_monitoringEvent_add = (data) => wrapHttp(`/busi/monitoringEvent/add`, data)
// 修改病人监护事件业务数据
export const busi_monitoringEvent_update = (data) => wrapHttp(`/busi/monitoringEvent/update`, data)
// 删除病人监护事件业务数据
export const busi_monitoringEvent_delete = (data) => wrapHttp(`/busi/monitoringEvent/delete`, data)

// 获取患者入区以来的护理项目项
export const nursingaid_nurseMoniitemData = (data) => wrapHttp(`/nursingaid/nurseMoniitemData`, data)
// 获取患者入区以来的抢救
export const nursingaid_getRescureEventList = (data) => wrapHttp(`/nursingaid/getRescureEventList`, data)

// CDSS 接口对接获取监护项临床建议
export const cdss_getCdssInfo = (data) => wrapHttp(`/cdss/getCdssInfo`, data)

// 设备连接状态的货
export const deviceStatus_getDeviceStatusList = (data) => wrapHttp(`/deviceStatus/getDeviceStatusList`, data)

// 无纸化归档接口申明
// 获取护理文书是否已经归档
export const archive_getData = (data) => wrapHttp(`/archive/getData`, data)
// 归档
export const archive_add = (data) => wrapHttp(`/archive/add`, data)
// 取消归档
export const archive_cancel = (data) => wrapHttp(`/archive/cancel`, data)
// 测试ftp连接
export const archive_connectFtp = (data) => wrapHttp(`/archive/connectFtp`, data)
// 归档异常 重新传
export const archive_refresh = (data) => wrapHttp(`/archive/refresh`, data)
// 耐药菌
export const patientInfo_drugFastBacteria_list = (data) => wrapHttp(`/patientInfo/drugFastBacteria/list`, data)

// 查看患者是否需要设备提示框
export const patientConfig_getById = (data) => wrapHttp(`/patientConfig/getById`, data)
// 设置患者已经提示
export const patientConfig_save = (data) => wrapHttp(`/patientConfig/save`, data)

// 电子病历列表
export const patientOverview_getDocumentList = (data) => wrapHttp(`/patientOverview/getDocumentList`, data)

// 治疗目标 - 治疗目标表格 - 列表
export const treamentTarget_list = (data) => wrapHttp(`/treamentTarget/list`, data)
// 治疗目标 - 治疗目标表格 - 新增
export const treamentTarget_add = (data) => wrapHttp(`/treamentTarget/add`, data)
// 治疗目标 - 治疗目标表格 - 修改
export const treamentTarget_update = (data) => wrapHttp(`/treamentTarget/update`, data)
// 治疗目标 - 治疗目标表格 - 删除
export const treamentTarget_delete = (data) => wrapHttp(`/treamentTarget/delete`, data)
// 治疗目标 - 治疗目标表格 - 目标项弹框 - 列表
export const treamentTarget_listMoniitem = (data) => wrapHttp(`/treamentTarget/listMoniitem`, data)
// 治疗目标 - 治疗目标表格 - 目标项弹框 - 新增
export const treamentTarget_addMoniitem = (data) => wrapHttp(`/treamentTarget/addMoniitem`, data)
// 治疗目标 - 治疗目标表格 - 目标项弹框 - 修改
export const treamentTarget_updateMoniitem = (data) => wrapHttp(`/treamentTarget/updateMoniitem`, data)
// 治疗目标 - 治疗目标表格 - 目标项 - 删除
export const treamentTarget_deleteMoniitem = (data) => wrapHttp(`/treamentTarget/deleteMoniitem`, data)
// 治疗目标 - 目标项表格 - 列表
export const treamentTarget_tableData = (data) => wrapHttp(`/treamentTarget/tableData`, data)
// 治疗目标 - 目标项表格 - 新增时间按钮
export const treamentTarget_addTime = (data) => wrapHttp(`/treamentTarget/addTime`, data)
// 治疗目标 - 目标项表格 - 删除时间按钮
export const treamentTarget_deleteTime = (data) => wrapHttp(`/treamentTarget/deleteTime`, data)
// 治疗目标 - 目标项表格 - 保存or修改
export const treamentTarget_saveOrUpdateValue = (data) => wrapHttp(`/treamentTarget/saveOrUpdateValue`, data)
// 治疗目标趋势图
export const treamentTarget_lineChartData = (data) => wrapHttp(`/treamentTarget/lineChartData`, data)
/**
 *
 * @param {*} 通过住院流水号获取患者信息
 * @returns
 */
export const threePlatform_inAreaList = (data) => wrapHttp(`/patient/threePlatform/inAreaList`, data)

// 个性化储存 查询
export const userPersonalizedConfig_findWithPage = (data) => wrapHttp(`/userPersonalizedConfig/findWithPage`, data)
// 个性化储存 新增或者修改
export const userPersonalizedConfig_insertOrUpdate = (data) => wrapHttp(`/userPersonalizedConfig/insertOrUpdate`, data)

// 患者诊断
// 患者诊断-新增诊断
export const patientDiag_add = (data) => wrapHttp(`/patientDiag/add`, data)
// 患者诊断-作废诊断
export const patientDiag_delete = (data) => wrapHttp(`/patientDiag/delete`, data)
// 获取患者诊断列表
export const patientDiag_list = (data) => wrapHttp(`/patientDiag/list`, data)
// 取消作废/隐藏诊断
export const patientDiag_cancelDelete = (data) => wrapHttp(`/patientDiag/cancelDelete`, data)
// 获取患者诊断
export const patientDiag_getPatientDiagNames = (data) => wrapHttp(`/patientDiag/getPatientDiagNames`, data)

// 编辑患者出区
export const patientBusi_editOutAreaInfo = (data) => wrapHttp(`/patientBusi/editOutAreaInfo`, data)

// 获取交班病人统计
export const patientInfo_getPatientChangeStatic = (data) => wrapHttp(`/patientInfo/getPatientChangeStatic`, data)
// 获取床位授权到期时间
export const patientInfo_getBedExpireTime = (data) => wrapHttp(`/patientInfo/getBedExpireTime`, data)

// 目标热量
export const patientEnergy_getList = (data) => wrapHttp(`/patientEnergy/getList`, data)
export const patientEnergy_getById = (data) => wrapHttp(`/patientEnergy/getById`, data)
export const patientEnergy_insert = (data) => wrapHttp(`/patientEnergy/insert`, data)
export const patientEnergy_edit = (data) => wrapHttp(`/patientEnergy/edit`, data)
export const patientEnergy_deleteById = (data) => wrapHttp(`/patientEnergy/deleteById`, data)
export const patientDict_getDictList = (data) => wrapHttp(`/patientDict/getDictList`, data)
// 获取最近的监护项指标
export const patientDict_getRecentllyMoniitemList = (data) => wrapHttp(`/patientEnergy/getRecentllyMoniitemList`, data)

// 用户设置
export const patientSet_getByIcuRecordId = (data) => wrapHttp(`/patientSet/getByIcuRecordId`, data)
export const patientSet_insert = (data) => wrapHttp(`/patientSet/insert`, data)
export const patientSet_edit = (data) => wrapHttp(`/patientSet/edit`, data)
export const patientSet_deleteById = (data) => wrapHttp(`/patientSet/deleteById`, data)

// 指控标识
export const qc_qcIdentification = (data) => wrapHttp(`/qc/qcIdentification`, data)

// 获取泵速
export const orderExecute_getPumpFlowRate = (data) => wrapHttp(`/order/orderExecute/getPumpFlowRate`, data)
// 获取剂量流速
export const orderExecute_getDoseFlowRate = (data) => wrapHttp(`/order/orderExecute/getDoseFlowRate`, data)

// apachii评分的数据同步
export const qc_sync60CisApacheiiData = (data) => wrapHttp('/qc/sync60CisApacheiiData/' + data, {}, 'get')
export const personMoniitem_findPersonExceptionLevels = (data) => wrapHttp('/personMoniitem/findPersonExceptionLevels', data)
export const personMoniitem_savePersonExceptionLevels = (data) => wrapHttp('/personMoniitem/savePersonExceptionLevels', data)
