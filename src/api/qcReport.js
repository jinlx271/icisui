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

// ICU15项质控指标统计:
export const qcReport_indexSummary = (data) => wrapHttp(`/qcReport/indexSummary`, data)
// 1.时间段内ICU收治患者分页数据
export const qcReport_patAdmis = (data) => wrapHttp(`/qcReport/patAdmis/listPage`, data)
// 1.时间段内ICU收治患者分页数据-同期医院收治患者
export const qcReport_correspondingPeriod = (data) => wrapHttp(`/qcReport/correspondingPeriod/listPage`, data)
// 2.时间段内收治床日患者分页数据
export const qcReport_patAdmisDaily = (data) => wrapHttp(`/qcReport/patAdmisDaily/listPage`, data)
// 2.时间段内收治床日患者分页数据-同期医院收治患者总床日数
export const qcReport_correspondingPeriodDaily = (data) => wrapHttp(`/qcReport/correspondingPeriodDaily/listPage`, data)
// 3.时间段内ApacheⅡ评分患者收治分页数据
export const qcReport_apacheIIScores = (data) => wrapHttp(`/qcReport/apacheIIScores/listPage`, data)
// 3.时间段内ApacheⅡ评分患者收治分页数据 - 同期ICU收治患者
export const qcReport_icuPeriodPatients = (data) => wrapHttp(`/qcReport/icuPeriodPatients/listPage`, data)
// 4.时间段内ICU非计划插管拔管分页数据
export const qcReport_unplanIntuba = (data) => wrapHttp(`/qcReport/unplanIntuba/listPage`, data)
// 5.时间段内ICU呼吸机相关性肺炎（VAP）发病分页数据
export const qcReport_vap = (data) => wrapHttp(`/qcReport/vap/listPage`, data)
// 6.时间段内ICU深静脉血栓（DVT）预防分页数据
export const qcReport_dvt = (data) => wrapHttp(`/qcReport/dvt/listPage`, data)
// 7.时间段内非计划转入ICU分页数据
export const qcReport_unplanTransfer = (data) => wrapHttp(`/qcReport/unplanTransfer/listPage`, data)
// 8.时间段内ICU患者预计病死分页数据
export const qcReport_expectedFatality = (data) => wrapHttp(`/qcReport/expectedFatality/listPage`, data)
// 9.时间段内ICU非计划插管拔管后48小时再插管分页数据
export const qcReport_unplanIntubaExt48h = (data) => wrapHttp(`/qcReport/unplanIntubaExt48h/listPage`, data)
// 10.时间段内ICU血管内导管相关血流感染（CRBSI）发病分页数据
export const qcReport_crbsi = (data) => wrapHttp(`/qcReport/crbsi/listPage`, data)
// 11.时间段内感染性休克3h集束化治疗（bundle）分页数据
export const qcReport_bundle = (data) => wrapHttp(`/qcReport/bundle/listPage`, data)
// 12.时间段内转出ICU后48小时内重返分页数据
export const qcReport_reentry48h = (data) => wrapHttp(`/qcReport/reentry48h/listPage`, data)
export const qcReport_reentry24h = (data) => wrapHttp(`/qcReport/reentry24h/listPage`, data)
// 13.时间段内ICU患者标化病死分页数据
export const qcReport_fataIndex = (data) => wrapHttp(`/qcReport/fataIndex/listPage`, data)
// 14.时间段内ICU抗菌药物治疗前病原学送检分页数据
export const qcReport_pdbat = (data) => wrapHttp(`/qcReport/pdbat/listPage`, data)
// 15.时间段内ICU导尿管相关泌尿系感染（CAUTI）发病分页数据
export const qcReport_cauti = (data) => wrapHttp(`/qcReport/cauti/listPage`, data)
// 16.人工气道
export const qcReport_airwayProlapse = (data) => wrapHttp(`/qcReport/airwayProlapse/listPage`, data)
// 17.各类导管管路滑脱例数
export const qcReport_prolapseGroup = (data) => wrapHttp(`/qcReport/prolapseGroup/listPage`, data)
// 22.各类导管滑脱后48小时再插数
export const qcReport_prolapseIntubateGroup = (data) => wrapHttp(`/qcReport/prolapseIntubateGroup/listPage`, data)

// 1.时间段内ICU收治患者分页数据--分子分母
export const qcReport_patAdmisData = (data) => wrapHttp(`/qcReport/patAdmis/data`, data)
// 2.时间段内收治床日患者分页数据--分子分母
export const qcReport_patAdmisDailyData = (data) => wrapHttp(`/qcReport/patAdmisDaily/data`, data)
// 3.时间段内ApacheⅡ评分患者收治分页数据--分子分母
export const qcReport_apacheIIScoresData = (data) => wrapHttp(`/qcReport/apacheIIScores/data`, data)
// 4.时间段内ICU非计划插管拔管分页数据--分子分母
export const qcReport_unplanIntubaData = (data) => wrapHttp(`/qcReport/unplanIntuba/data`, data)
// 5.时间段内ICU呼吸机相关性肺炎（VAP）发病分页数据--分子分母
export const qcReport_vapData = (data) => wrapHttp(`/qcReport/vap/data`, data)
// 6.时间段内ICU深静脉血栓（DVT）预防分页数据--分子分母
export const qcReport_dvtData = (data) => wrapHttp(`/qcReport/dvt/data`, data)
// 7.时间段内非计划转入ICU分页数据--分子分母
export const qcReport_unplanTransferData = (data) => wrapHttp(`/qcReport/unplanTransfer/data`, data)
// 8.时间段内ICU患者预计病死分页数据--分子分母
export const qcReport_expectedFatalityData = (data) => wrapHttp(`/qcReport/expectedFatality/data`, data)
// 9.时间段内ICU非计划插管拔管后48小时再插管分页数据--分子分母
export const qcReport_unplanIntubaExt48hData = (data) => wrapHttp(`/qcReport/unplanIntubaExt48h/data`, data)
// 10.时间段内ICU血管内导管相关血流感染（CRBSI）发病分页数据--分子分母
export const qcReport_crbsiData = (data) => wrapHttp(`/qcReport/crbsi/data`, data)
// 11.时间段内感染性休克3h集束化治疗（bundle）分页数据--分子分母
export const qcReport_bundleData = (data) => wrapHttp(`/qcReport/bundle/data`, data)
// 12.时间段内转出ICU后48小时内重返分页数据--分子分母
export const qcReport_reentry48hData = (data) => wrapHttp(`/qcReport/reentry48h/data`, data)
// 12.时间段内转出ICU后24小时内重返分页数据--分子分母
export const qcReport_reentry24hData = (data) => wrapHttp(`/qcReport/reentry24h/data`, data)
// 13.时间段内ICU患者标化病死分页数据--分子分母
export const qcReport_fataIndexData = (data) => wrapHttp(`/qcReport/fataIndex/data`, data)
// 14.时间段内ICU抗菌药物治疗前病原学送检分页数据--分子分母
export const qcReport_pdbatData = (data) => wrapHttp(`/qcReport/pdbat/data`, data)
// 15.时间段内ICU导尿管相关泌尿系感染（CAUTI）发病分页数据--分子分母
export const qcReport_cautiData = (data) => wrapHttp(`/qcReport/cauti/data`, data)
// 16.人工气道
export const qcReport_airwayProlapseData = (data) => wrapHttp(`/qcReport/airwayProlapse/data`, data)
// 17.各类导管管路滑脱例数
export const qcReport_prolapseGroupData = (data) => wrapHttp(`/qcReport/prolapseGroup/data`, data)
// 17.各类导管滑脱后48小时再插数
export const qcReport_prolapseIntubateGroupData = (data) => wrapHttp(`/qcReport/prolapseIntubateGroup/data`, data)

export const qc_bedCollect_list = (data) => wrapHttp(`/qc/bedCollect/list`, data)

export const qc_bedCollect_listDetailPage = (data) => wrapHttp(`/qc/bedCollect/listDetailPage`, data)
// 质控科研-监护项执行统计
export const wlStatistics_monItemExecuteStatistics = (data) => wrapHttp(`/wlStatistics/monItemExecuteStatistics`, data)
// 质控科研-监护项执行统计明细
export const wlStatistics_monItemExecuteStatisticsDetail = (data) => wrapHttp(`/wlStatistics/monItemExecuteStatisticsDetail`, data)
// 质控科研-护理操作执行统计
export const wlStatistics_nurseOprExecuteStatistics = (data) => wrapHttp(`/wlStatistics/nurseOprExecuteStatistics`, data)
// 质控科研-护理操作执行统计明细
export const wlStatistics_nurseOprExecuteStatisticsDetail = (data) => wrapHttp(`/wlStatistics/nurseOprExecuteStatisticsDetail`, data)
// 质控科研-工作量统计
export const wlStatistics_patientDataStatistics = (data) => wrapHttp(`/wlStatistics/patientDataStatistics`, data)
// 质控科研-工作量统计详情
export const wlStatistics_patientDataStatisticsDetail = (data) => wrapHttp(`/wlStatistics/patientDataStatisticsDetail`, data)
// 病区工作量汇总
export const wlStatistics_wardWorkLoadStatics = (data) => wrapHttp(`/wlStatistics/wardWorkLoadStatics`, data)
// 换着流转统计
export const wlStatistics_icuPeriodInLeavePatients_listPage = (data) => wrapHttp(`/wlStatistics/icuPeriodInLeavePatients/listPage`, data)

export const deviceUserStatic_getDeviceUserRataTotal = (data) => wrapHttp(`/deviceUserStatic/getDeviceUserRataTotal`, data)

// ICU患者院内压力性损伤发生率
export const qcReport_stressInjury_listPage = (data) => wrapHttp(`/qcReport/stressInjury/listPage`, data)
export const qcReport_stressInjury_data = (data) => wrapHttp(`/qcReport/stressInjury/data`, data)
// 危重患者护理质量达标率
export const qcReport_nursingQuality_listPage = (data) => wrapHttp(`/qcReport/nursingQuality/listPage`, data)
export const qcReport_nursingQuality_data = (data) => wrapHttp(`/qcReport/nursingQuality/data`, data)

// ICU患者身体约束日数页数据
export const qcReport_physicalRestraint_listPage = (data) => wrapHttp(`/qcReport/physicalRestraint/listPage`, data)
export const qcReport_physicalRestraint_data = (data) => wrapHttp(`/qcReport/physicalRestraint/data`, data)
// ICU患者身体约束率
export const qcReport_physicalRestraintRate_data = (data) => wrapHttp(`/qcReport/physicalRestraintRate/data`, data)

// 血液净化非计划下机发生率
export const qcReport_unplanDownBloodPurification_listPage = (data) => wrapHttp(`/qcReport/unplanDownBloodPurification/listPage`, data)
export const qcReport_unplanDownBloodPurification_data = (data) => wrapHttp(`/qcReport/unplanDownBloodPurification/data`, data)

export const patientTurnoverStatistics_listPage = (data) => wrapHttp(`/wlStatistics/patientTurnoverStatistics/listPage`, data)
export const patientTurnoverStatistics_download = (data) => wrapHttp(`/wlStatistics/patientTurnoverStatistics/download`, data)
export const patientTurnoverStatistics_detail_download = (data) => wrapHttp(`/wlStatistics/patientTurnoverStatistics/detail/download`, data)
export const patientTurnoverStatistics_detail = (data) => wrapHttp(`/wlStatistics/patientTurnoverStatistics/detail`, data)

// 运营管理 - 临床信息统计
export const statistics_apacheIIRegion = (data) => wrapHttp(`/assess/statistics/apacheIIRegion`, data)
export const statistics_apacheIIRegionPatientList = (data) => wrapHttp(`/assess/statistics/apacheIIRegionPatientList`, data)
export const statistics_apacheII24hours = (data) => wrapHttp(`/assess/statistics/apacheII24hours`, data)
export const statistics_apacheII24hoursPatientList = (data) => wrapHttp(`/assess/statistics/apacheII24hoursPatientList`, data)
export const clinicalStatistics_tracheaCannulaType = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/tracheaCannulaType`, data)
export const clinicalStatistics_tracheaCannulaTypePatientList = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/tracheaCannulaTypePatientList`, data)

export const qcReport_catherUseRate_listPage = (data) => wrapHttp(`/qcReport/catherUseRate/listPage`, data)
export const qcReport_catherUseRate_data = (data) => wrapHttp(`/qcReport/catherUseRate/data`, data)

export const qcReport_rescure_listPage = (data) => wrapHttp(`/qcReport/rescure/listPage`, data)
export const qcReport_rescure_data = (data) => wrapHttp(`/qcReport/rescure/data`, data)

export const clinicalStatistics_dialysisStatistics = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/dialysisStatistics`, data)
export const clinicalStatistics_dialysisStatisticsPatientList = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/dialysisStatisticsPatientList`, data)

export const qcReport_catherTypeEndcather_listPage = (data) => wrapHttp(`/qcReport/catherTypeEndcather/listPage`, data)
export const qcReport_catherTypeEndcather_data = (data) => wrapHttp(`/qcReport/catherTypeEndcather/data`, data)

export const clinicalStatistics_specialStatistics = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/specialStatistics`, data)
export const clinicalStatistics_specialStatisticsPatientList = (data) => wrapHttp(`/wlStatistics/clinicalStatistics/specialStatisticsPatientList`, data)

export const qcReport_unplanIntuba_listPage = (data) => wrapHttp(`/qcReport/unplanIntuba/listPage`, data)
export const qcReport_unplanIntuba_data = (data) => wrapHttp(`/qcReport/unplanIntuba/data`, data)

export const batchSync60CisApacheiiData = (data) => wrapHttp(`/qc/batchSync60CisApacheiiData`, data)
