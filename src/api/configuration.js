import request from '@/utils/request'
/**
 * 公用post
 * @param url 请求接口
 * @param data 入参
 */
const wrapHttp = (url, data = {}, method = 'post', otherConfig) => {
  return request({
    url: url,
    method,
    data,
    otherConfig
  })
}
// 根据主键获取VerificationRules
export const verification_doVerifiy = (data) => wrapHttp(`verification/doVerifiy`, data)
export const verification_queryVerifiyLog = (data) => wrapHttp(`verification/queryVerifiyLog`, data)
export const verificationOperation_copy = (data) => wrapHttp(`verificationOperation/copy`, data)
export const verificationOperation_deleteById = (data) => wrapHttp(`verificationOperation/deleteById`, data)
export const verificationOperation_edit = (data) => wrapHttp(`verificationOperation/edit`, data)
export const verificationOperation_findVerificationOperations = (data) => wrapHttp(`verificationOperation/findVerificationOperations`, data)
export const verificationOperation_getById = (data) => wrapHttp(`verificationOperation/getById`, data)
export const verificationOperation_insert = (data) => wrapHttp(`verificationOperation/insert`, data)

// 删除
export const verificationRules_deleteById = (data) => wrapHttp(`verificationRules/deleteById`, data)
// 修改
export const verificationRules_edit = (data) => wrapHttp(`verificationRules/edit`, data)
// 分页获取VerificationRules
export const verificationRules_findVerificationRules = (data) => wrapHttp(`verificationRules/findVerificationRules`, data)
// 分页获取VerificationRules
export const verificationRules_getById = (data) => wrapHttp(`verificationRules/getById`, data)
// 分页获取VerificationRules
export const verificationRules_insert = (data) => wrapHttp(`verificationRules/insert`, data)

// 新增图片信息
export const base_image_addImage = (url, data) => wrapHttp(url, data)
// 查询列表
export const base_image_backGroundLogos = (data) => wrapHttp(`base/image/backGroundLogos`, data, 'get')
// 删除用户
export const base_image_deleteImage = (data) => wrapHttp(`base/image/deleteImage`, data)
// 修改图片信息
export const base_image_updateImage = (url, data) => wrapHttp(url, data)
// 上传图片
export const base_image_uploadPicture = (data) => wrapHttp(`base/image/uploadPicture`, data)

// 新增公式分组
export const medFormulaGroup_insert = (data) => wrapHttp(`medFormulaGroup/insert`, data)
// 修改公式分组：
export const medFormulaGroup_edit = (data) => wrapHttp(`medFormulaGroup/edit`, data)
// 分页获取公式分组
export const medFormulaGroup_findWithPage = (data) => wrapHttp(`medFormulaGroup/findWithPage`, data)
// 复制公式分组病区数据
export const medFormulaGroup_copyOutwardRuleWard = (data) => wrapHttp(`medFormulaGroup/copyOutwardRuleWard`, data)
// 获取病区的公式分组集合
export const medFormulaGroup_getFormulaGroupByWardCode = (data) => wrapHttp(`medFormulaGroup/getFormulaGroupByWardCode`, data)

// 新增公式接口
export const medCalc_insert = (data) => wrapHttp(`medCalc/insert`, data)
// 修改公式接口
export const medCalc_edit = (data) => wrapHttp(`medCalc/edit`, data)
// 删除公式接口
export const medCalc_deleteById = (data) => wrapHttp(`medCalc/deleteById`, data)
// 分页获取公式接口结合
export const medCalc_findWithPage = (data) => wrapHttp(`medCalc/findWithPage`, data)

// 医学计算器配置 - 自定义公式配置 - 公式 查询
export const medicalDefine_findList = (data) => wrapHttp(`medicalDefine/findList`, data)
// 医学计算器配置 - 自定义公式配置 - 新增
export const medicalDefine_insert = (data) => wrapHttp(`medicalDefine/insert`, data)
// 医学计算器配置 - 自定义公式配置 - 修改
export const medicalDefine_edit = (data) => wrapHttp(`medicalDefine/edit`, data)
// 医学计算器配置 - 自定义公式配置 - 删除
export const medicalDefine_deleteById = (data) => wrapHttp(`medicalDefine/deleteById`, data)
// 医学计算器 患者信息那边的查询
export const medicalDefine_findMedicalInfoByID = (data) => wrapHttp(`medicalDefine/findMedicalInfoByID`, data)

// 医学计算器配置 - 自定义公式配置 - 入参表 查询
export const medicalParam_findList = (data) => wrapHttp(`medicalParam/findList`, data)
// 医学计算器配置 - 自定义公式配置 - 新增
export const medicalParam_insert = (data) => wrapHttp(`medicalParam/insert`, data)
// 医学计算器配置 - 自定义公式配置 - 修改
export const medicalParam_edit = (data) => wrapHttp(`medicalParam/edit`, data)
// 医学计算器配置 - 自定义公式配置 - 删除
export const medicalParam_deleteById = (data) => wrapHttp(`medicalParam/deleteById`, data)

// 医学计算器配置 - 自定义公式配置 - 出参表 查询
export const medicalResult_findList = (data) => wrapHttp(`medicalResult/findList`, data)
// 医学计算器配置 - 自定义公式配置 - 出参表 新增
export const medicalResult_insert = (data) => wrapHttp(`medicalResult/insert`, data)
// 医学计算器配置 - 自定义公式配置 - 出参表 修改
export const medicalResult_edit = (data) => wrapHttp(`medicalResult/edit`, data)
// 医学计算器配置 - 自定义公式配置 - 出参表 修改
export const medicalDefine_edit_medicalDefineDesc = (data) => wrapHttp(`medicalDefine/edit/medicalDefineDesc`, data)
// 医学计算器配置 - 自定义公式配置 - 出参表 删除
export const medicalResult_deleteById = (data) => wrapHttp(`medicalResult/deleteById`, data)

// 新增
export const drugFrequency_insertDrugFrequency = (data) => wrapHttp(`drugFrequency/insertDrugFrequency`, data)
// 修改
export const drugFrequency_editDrugFrequency = (data) => wrapHttp(`drugFrequency/editDrugFrequency`, data)
// 分页获取
export const drugFrequency_findDrugAllWithPage = (data) => wrapHttp(`drugFrequency/findDrugAllWithPage`, data)

// 拷贝
export const pain_painDrug_copy = (data) => wrapHttp(`pain/painDrug/copy`, data)
// 删除
export const pain_painDrug_deleteById = (data) => wrapHttp(`pain/painDrug/deleteById`, data)
// 分页获取
export const pain_painDrug_findWithPage = (data) => wrapHttp(`pain/painDrug/findWithPage`, data)
// 新增
export const pain_painDrug_insert = (data) => wrapHttp(`pain/painDrug/insert`, data)

// 采集数据
export const focalPatient_refresh = (data) => wrapHttp(`/focalPatient/refresh`, data)
// 采集数据
export const dataCollect_getSignData = (data) => wrapHttp(`/dataCollect/getSignData`, data)

// 用户管理-查询
export const getUserListByExample = (data) => wrapHttp(`/sys/getUserListByExample`, data)
//  用户管路-根据角色查询用户集合
export const getUserListByRoleId = (data) => wrapHttp(`/sys/getUserListByRoleId`, data)
// 用户管理-新增用户基本信息
export const addUserBaseInfo = (data) => wrapHttp(`/sys/addUser`, data)
// 用户管理-修改用户基本信息
export const updateUserBaseInfo = (data) => wrapHttp(`/sys/updateUserBaseInfo`, data)
// 用户管理-启用禁用
export const enableUser = (data) => wrapHttp(`/sys/enableUser`, data)
// 用户管理-重置密码
export const resetUserPassword = (data) => wrapHttp(`/sys/resetUserPassword`, data)
// 用户管理-校验工号是否重复
export const selectByUsername = (data) => wrapHttp(`/sys/selectByUsername`, data)

// 角色管理-查询角色
export const getRoleList = (data) => wrapHttp(`/sys/getRoleList`, data)
export const getAllRoleList = (data) => wrapHttp(`/sys/getAllRoleList`, data)
// 角色管理-查询菜单
export const getTreeMenuList = (data) => wrapHttp(`/sys/getTreeMenuList`, data, 'get')
// 角色管理-新增角色
export const saveRole = (data) => wrapHttp(`/sys/saveRole`, data)
// 角色管理-修改角色
export const updateRole = (data) => wrapHttp(`/sys/updateRole`, data)
// 角色管理-删除角色
export const deleteRole = (data) => wrapHttp(`/sys/deleteRole`, data)
// 角色管理-新增角色首页
export const insertRoleHomepage = (data) => wrapHttp(`/sys/insertRoleHomepage `, data)

// 用户角色管理-批量给用户增加角色
export const batchSaveUserRole = (data) => wrapHttp(`/sys/batchSaveUserRole`, data)
// 删除角色绑定用户
export const delUserRole = (data) => wrapHttp(`/sys/delUserRole`, data)
// 用户角色管理-新增查询用户
export const getNonExistUserListByExample = (data) => wrapHttp(`/sys/getNonExistUserListByExample`, data)

// 基础设置-基础字典-查询his相关的字典分组
export const dictGroup_findHisDictGroupWithPage = (data) => wrapHttp(`/dictGroup/findHisDictGroupWithPage`, data) // 815696 废弃
// 基础设置-基础字典-查询字典分类
export const dictGroup_findIcisDictGroupWithPage = (data) => wrapHttp(`/dictGroup/findIcisDictGroupWithPage`, data) // 815696 废弃
// 基础设置-基础字典-查询字典分类 启用禁用接口
export const dictGroup_findAllWithPage = (data) => wrapHttp(`/dictGroup/findAllWithPage`, data) // 815696 废弃
// 基础设置-基础字典-查询字典分类 -- 所有的没有分页
export const dictGroup_findAllIcisDictGroup = (data) => wrapHttp(`/dictGroup/findAllIcisDictGroup`, data) // 815696 废弃
// 基础设置-基础字典-查询字典分类 -- 所有的没有分页  没有关闭
export const dictGroup_findAllStatusIcisDictGroup = (data) => wrapHttp(`/dictGroup/findAllStatusIcisDictGroup`, data) // 815696 废弃
// 基础设置-基础字典-查询字典分类 -- dictGroupType 字典类型：("1","基础字典"), ("2","监护字典"), ("3","元数据字典")
export const dictGroup_listDictGroup = (data) => wrapHttp(`/dictGroup/listDictGroup`, data) // 815696 废弃
// 分页获取字典项
export const dictGroup_getDictGroupWithPage = (data) => wrapHttp(`/dictGroup/getDictGroupWithPage`, data) // 815696  新增
// 不分页获取字典
export const dictGroup_getDictGroupList = (data) => wrapHttp(`/dictGroup/getDictGroupList`, data) // 815696  新增            不分页
// 基础设置-基础字典-新增系统字典分组
export const dictGroup_insert = (data) => wrapHttp(`/dictGroup/insert`, data)
// 基础设置-基础字典-删除系统字典分组
export const dictGroupById_delete = (data) => wrapHttp(`/dictGroup/deleteById`, data)
// 基础设置-基础字典-修改系统字典分组
export const dictGroup_edit = (data) => wrapHttp(`/dictGroup/edit`, data)
// 基础设置-基础字典-根据主键获取系统字典分组--暂时没有使用后续有页面开发可能要用
export const dict_getDictGroupById = (data) => wrapHttp(`/dict/getDictGroupById`, data)
// 基础设置-基础字典-分页获取系统字典分组--暂时没有使用后续有页面开发可能要用
export const dict_findDictGroupWithPage = (data) => wrapHttp(`/dict/findDictGroupWithPage`, data)
// 基础设置-基础字典-字典项列表
export const dictItem_findWithPage = (data) => wrapHttp(`/dictItem/findWithPage`, data)
export const dictItem_findAllWithPage = (data) => wrapHttp(`/dictItem/findAllWithPage`, data)
// 批量字典
export const dictItem_batchGetDict = (data) => wrapHttp(`/dictItem/batchGetDict`, data)
export const dictItem_batchGetAllDict = (data) => wrapHttp(`/dictItem/batchGetAllDict`, data)
// 基础设置-基础字典-字典项列表-集合查询
export const dictItem_findDictWithItemsByGroupCodes = (data) => wrapHttp(`/dictItem/findDictWithItemsByGroupCodes`, data)
// 基础设置 -基础字典 - 字典项 - 添加字典项
export const dictItem_insert = (data) => wrapHttp(`/dictItem/insert`, data)
// 基础设置-基础字典-字典项-修改
export const dictItem_edit = (data) => wrapHttp(`/dictItem/edit`, data)
// 基础设置-基础字典-字典项-删除
export const dictItem_delete = (data) => wrapHttp(`/dictItem/deleteById`, data)
// 获取字典最大排序
export const dictItem_getMaxSort = (data) => wrapHttp(`/dictItem/getMaxSort`, data)

// 基础设置-班次设置--获取班次列表
export const findShiftWithPage = (data) => wrapHttp(`/shift/findWithPage`, data)
// 基础设置-班次设置--增加排班
export const insertShift = (data) => wrapHttp(`/shift/insert`, data)
// 基础设置-班次设置--编辑已有班次信息
export const editShift = (data) => wrapHttp(`/shift/edit`, data)
// 基础设置-班次设置--删除已有班次信息
export const deleteShift = (data) => wrapHttp(`/shift/deleteById`, data)
export const shift_deleteByWardCode = (data) => wrapHttp(`/shift/deleteByWardCode`, data)
export const shift_copy = (data) => wrapHttp(`/shift/copy`, data)

// 基础设置-监护配置-病区
export const getRegionList = (data) => wrapHttp(`/sys/findRegionWithAll`, data, 'get')
// 基础设置-监护配置-模块开启/关闭
export const changeMudole = (data) => wrapHttp(`/dict/changeMudole`, data)
// 基础设置-监护配置-病区模块
export const getMonitorModuleByIcuCode = (data) => wrapHttp(`/dict/getMonitorModuleByIcuCode`, data)
// 基础设置-监护配置-根据模块获取分类
export const getClassifyByModuleId = (data) => wrapHttp(`/dict/getClassifyByModuleId`, data)
// 基础设置-监护配置-删除监护数据显示分组
export const deleteClassify = (data) => wrapHttp(`/dict/deleteDictMonitorClassifyById`, data)
// 基础设置-监护配置-新增监护数据显示分组
export const saveClassifyRow = (data) => wrapHttp(`/dict/insertDictMonitorClassify`, data)
// 基础设置-监护配置-根据监护数据显示分组获取监护项
export const getItemListByClassifyId = (data) => wrapHttp(`/dict/getItemListByClassifyId`, data)
// 基础设置-监护字典-获取监护项字典
export const getDictItemList = (data) => wrapHttp(`/dict/getDictItemList`, data)
// 基础设置-监护字典-保存监护项
export const saveItem = (data) => wrapHttp(`/dict/saveItem`, data)

// 评估单配置-元数据管理-启用元数据
export const metadata_enable = (data) => wrapHttp(`/assess/metadata/enable`, data)
// 评估单配置-元数据管理-禁用元数据
export const metadata_disable = (data) => wrapHttp(`/assess/metadata/disable`, data)
// 评估单配置-元数据管理-元数据管理
export const metadata_listPage = (data) => wrapHttp(`/assess/metadata/listPage`, data)
// 评估单配置-元数据管理-根据id获取单个评估表元数据
export const metadata_getById = (data) => wrapHttp(`/assess/metadata/getById`, data)
// 评估单配置-元数据管理-删除元数据
export const metadata_delete = (data) => wrapHttp(`/assess/metadata/delete`, data)
// 评估单配置-元数据管理-修改元数据
export const metadata_update = (data) => wrapHttp(`/assess/metadata/update`, data)
// 评估单配置-元数据管理-新增元数据
export const metadata_add = (data) => wrapHttp(`/assess/metadata/add`, data)
// 获取元数据关联项
export const metadata_linkDictItems = (data) => wrapHttp(`/assess/metadata/linkDictItems`, data)
// 评估单配置-元数据管理-图片删除
export const dict_deleteImg = (data) => wrapHttp(`/assess/dict/deleteImg`, data)

// 评估单配置-元数据管理-字典项带分值
export const dict_getItems = (data) => wrapHttp(`/assess/dict/getItems`, data)
// 评估单配置-元数据管理-获取可见数据源列表
export const datasources_listVisibleDataSource = (data) => wrapHttp(`/assess/datasources/listVisibleDataSource`, data)

// 评估单配置-评估表配置-分页查询
export const formconfig_listPage = (data) => wrapHttp(`/assess/formconfig/listPage`, data)
// 评估单配置-评估表配置-查询
export const formconfig_list = (data) => wrapHttp(`/assess/formconfig/list`, data)
// 评估单配置-评估表配置-根据id查询单个表单配置
export const formconfig_getById = (data) => wrapHttp(`/assess/formconfig/getById`, data)
export const formconfig_getByCode = (data) => wrapHttp(`/assess/formconfig/getByCode`, data)

// 评估单配置-评估表配置-新增表单配置
export const formconfig_add = (data) => wrapHttp(`/assess/formconfig/add`, data)
// 评估单配置-评估表配置-修改表单配置数据
export const formconfig_update = (data) => wrapHttp(`/assess/formconfig/update`, data)
// 评估单配置-评估表配置-禁用表单
export const formconfig_disable = (data) => wrapHttp(`/assess/formconfig/disable`, data)
// 评估单配置-评估表配置-启用表单
export const formconfig_enable = (data) => wrapHttp(`/assess/formconfig/enable`, data)
// 评估单配置-评估表配置-删除表单
export const formconfig_delete = (data) => wrapHttp(`/assess/formconfig/delete`, data)
// 评估单配置-评估表配置-评估单导出SQL接口
export const formconfig_exportSql = (data) => wrapHttp(`/assess/formconfig/exportSql`, data, 'get')

// 评估单配置-评估表配置-启用
export const riskfrequency_enable = (data) => wrapHttp(`/assess/riskfrequency/enable`, data)
// 评估单配置-评估表配置-禁用
export const riskfrequency_disable = (data) => wrapHttp(`/assess/riskfrequency/disable`, data)
// 评估单配置-评估表配置-风险频次列表数据
export const riskfrequency_list = (data) => wrapHttp(`/assess/riskfrequency/list`, data)
// 评估单配置-评估表配置-新增风险频次
export const riskfrequency_saveOrUpdate = (data) => wrapHttp(`/assess/riskfrequency/saveOrUpdate`, data)
// 评估单配置-评估表配置-删除风险批次配置数据
export const riskfrequency_delete = (data) => wrapHttp(`/assess/riskfrequency/delete`, data)
// 评估单配置-评估表配置-删除风险批次详情项数据
export const riskfrequency_deleteDetail = (data) => wrapHttp(`/assess/riskfrequency/deleteDetail`, data)
// 评估单配置-评估表配置-修改病区配置评估表数据-自定义排序
export const config_updateSortNo = (data) => wrapHttp(`/wardassess/config/updateSortNo`, data)
// 评估单配置-评估表配置-病区评估单启用
export const config_enable = (data) => wrapHttp(`/wardassess/config/enable`, data)
// 评估单配置-评估表配置-病区评估单禁用
export const config_disable = (data) => wrapHttp(`/wardassess/config/disable`, data)
// 评估单配置-根据表单查询配置首次提醒配置列表
export const firstReminder_list = (data) => wrapHttp(`/assess/firstReminder/list`, data)
// 评估单配置-新增评估单首次提醒配置
export const firstReminder_add = (data) => wrapHttp(`/assess/firstReminder/add`, data)
// 评估单配置-修改评估单首次提醒配置
export const firstReminder_update = (data) => wrapHttp(`/assess/firstReminder/update`, data)
// 评估单配置-启用评估单首次提醒配置
export const firstReminder_enable = (data) => wrapHttp(`/assess/firstReminder/enable`, data)
// 评估单配置-禁用评估单首次提醒配置
export const firstReminder_disable = (data) => wrapHttp(`/assess/firstReminder/disable`, data)

// 评估单配置-评估表分数描述及治疗设置-列表数据
export const treatmentconfig_list = (data) => wrapHttp(`/assess/treatmentconfig/list`, data)
// 评估单配置-评估表分数描述及治疗设置-保存or修改
export const treatmentconfig_saveOrUpdate = (data) => wrapHttp(`/assess/treatmentconfig/saveOrUpdate`, data)
// 评估单配置-评估表分数描述及治疗设置-删除（没用了）
export const treatmentconfig_delete = (data) => wrapHttp(`/assess/treatmentconfig/delete`, data)
// 评估单配置-评估表分数描述及治疗设置-启用
export const treatmentconfig_enable = (data) => wrapHttp(`/assess/treatmentconfig/enable`, data)
// 评估单配置-评估表分数描述及治疗设置-禁用
export const treatmentconfig_disable = (data) => wrapHttp(`/assess/treatmentconfig/disable`, data)
// 评估单配置-评估表分数描述及治疗设置-删除某一条
export const treatmentconfig_deleteDetail = (data) => wrapHttp(`/assess/treatmentconfig/deleteDetail`, data)
// 评估单配置-评估表分数描述及治疗设置-使用那个配置
export const config_updateTreatment = (data) => wrapHttp(`/wardassess/config/updateTreatment`, data)

// 评估单配置-组件块配置-启用
export const componentsection_enable = (data) => wrapHttp(`/assess/componentsection/enable`, data)
// 评估单配置-组件块配置-禁用
export const componentsection_disable = (data) => wrapHttp(`/assess/componentsection/disable`, data)
// 评估单配置-组件块配置-请求接口 需要分页
export const componentsection_listPage = (data) => wrapHttp(`/assess/componentsection/listPage`, data)
// 评估单配置-组件块配置-请求接口 不用分页
export const componentsection_list = (data) => wrapHttp(`/assess/componentsection/list`, data)
// 评估单配置-组件块配置-根据id查询单个组件块
export const componentsection_getById = (data) => wrapHttp(`/assess/componentsection/getById`, data)
// 评估单配置-组件块配置-新增组件块
export const componentsection_add = (data) => wrapHttp(`/assess/componentsection/add`, data)
// 评估单配置-组件块配置-修改组件块
export const componentsection_update = (data) => wrapHttp(`/assess/componentsection/update`, data)
// 评估单配置-组件块配置-删除组件块
export const componentsection_delete = (data) => wrapHttp(`/assess/componentsection/delete`, data)
// 批量获取评估单
export const formapply_batchGetList = (data) => wrapHttp(`/assess/formapply/batchGetList`, data)

// 评估单配置-病区评估表管理-根据病区获取未配置已启用的评估表列表
export const config_listFormWithout = (data) => wrapHttp(`/wardassess/config/listFormWithout`, data)
// 评估单配置-病区评估表管理-根据病区获取配置的分页评估表列表
export const config_listPage = (data) => wrapHttp(`/wardassess/config/listPage`, data)
// 评估单配置-病区评估表管理-保存单个病区评估表关系
export const config_add = (data) => wrapHttp(`/wardassess/config/add`, data)
// 评估单配置-病区评估表管理-删除单个病区评估表配置数据
export const config_delete = (data) => wrapHttp(`/wardassess/config/delete`, data)
// 评估单配置-病区评估表管理-更新病区评估表配置选定的风险频次
export const config_updateRiskFrequency = (data) => wrapHttp(`/wardassess/config/updateRiskFrequency`, data)
// 评估单配置-病区评估表管理-更新病区评估表配置选定首次提醒配置
export const config_updateReminder = (data) => wrapHttp(`/wardassess/config/updateReminder`, data)

// 评估单配置-元数据配置-启用
export const datasources_enable = (data) => wrapHttp(`/assess/datasources/enable`, data)
// 评估单配置-元数据配置-禁用
export const datasources_disable = (data) => wrapHttp(`/assess/datasources/disable`, data)
// 评估单配置-元数据配置-分页查询数据源列表
export const datasources_listPage = (data) => wrapHttp(`/assess/datasources/listPage`, data)
// 评估单配置-元数据配置-新增或修改数据源
export const datasources_saveOrUpdate = (data) => wrapHttp(`/assess/datasources/saveOrUpdate`, data)
// 评估单配置-元数据配置-删除数据源，如果作为父层级被引用，需要先清除引用关系再删除
export const datasources_delete = (data) => wrapHttp(`/assess/datasources/delete`, data)
// 评估单配置-元数据配置-数据源预演
export const datasources_dryRun = (data) => wrapHttp(`/assess/datasources/dryRun`, data)
// 评估单配置-元数据配置-根据编码获取数单个数据源
export const datasources_getByCode = (data) => wrapHttp(`/assess/datasources/getByCode`, data)

// 评估单配置-获取NIS评估单对照配置列表 不分页
export const assessNisMapper_list = (data) => wrapHttp(`/assessNisMapper/list`, data)
// 评估单配置-获取NIS评估单对照配置列表 分页
export const assessNisMapper_listPage = (data) => wrapHttp(`/assessNisMapper/listPage`, data)
// 评估单配置-新增 获取NIS评估单对照配置
export const assessNisMapper_add = (data) => wrapHttp(`/assessNisMapper/add`, data)
// 评估单配置-修改 获取NIS评估单对照配置
export const assessNisMapper_update = (data) => wrapHttp(`/assessNisMapper/update`, data)
// 评估单配置-启用 获取NIS评估单对照配置
export const assessNisMapper_enable = (data) => wrapHttp(`/assessNisMapper/enable`, data)
// 评估单配置-禁用 获取NIS评估单对照配置
export const assessNisMapper_disable = (data) => wrapHttp(`/assessNisMapper/disable`, data)

// ICIS基础配置-ICU病区设置--删除IcuWard
export const icuWard_deleteById = (data) => wrapHttp(`/icuWard/deleteById`, data)
// ICIS基础配置-ICU病区设置--分页获取
export const icuWard_findWithPage = (data) => wrapHttp(`/icuWard/findWithPage`, data)
// ICIS基础配置-ICU病区设置--获取用户有权限的病区列表
export const icuWard_findWithPageByUser = (data) => wrapHttp(`/icuWard/findWithPageByUser`, data)
// ICIS基础配置-ICU病区设置--新增IcuWard
export const icuWard_insert = (data) => wrapHttp(`/icuWard/insert`, data)
// ICIS基础配置-ICU病区设置--修改IcuWard
export const icuWard_update = (data) => wrapHttp(`/icuWard/update`, data)

// 基础数据HIS 院区
// ICIS基础配置-院区--修改院区
export const area_edit = (data) => wrapHttp(`/area/edit`, data)
// ICIS基础配置-院区--获取列表
export const area_findAll = (data) => wrapHttp(`/area/findAll`, data)
// ICIS基础配置-院区--新增Ward
export const area_insert = (data) => wrapHttp(`/area/insert`, data)

// 基础数据HIS 病区
// ICIS基础配置-病区--删除Ward
export const ward_deleteById = (data) => wrapHttp(`/ward/deleteById`, data)
// ICIS基础配置-病区--修改Ward
export const ward_edit = (data) => wrapHttp(`/ward/edit`, data)
// ICIS基础配置-病区--分页获取Ward
export const ward_findWithPage = (data) => wrapHttp(`/ward/findWithPage`, data)
// ICIS基础配置-病区--根据主键获取Ward
export const ward_getById = (data) => wrapHttp(`/ward/getById`, data)
// ICIS基础配置-病区--新增Ward
export const ward_insert = (data) => wrapHttp(`/ward/insert`, data)

// 基础数据HIS 耗材
// ICIS基础配置-耗材--删除Material
export const material_deleteById = (data) => wrapHttp(`/material/deleteById`, data)
// ICIS基础配置-耗材--修改Material
export const material_edit = (data) => wrapHttp(`/material/edit`, data)
// ICIS基础配置-耗材--分页获取Material
export const material_findWithPage = (data) => wrapHttp(`/material/findWithPage`, data)
// ICIS基础配置-耗材--根据主键获取Material
export const material_getById = (data) => wrapHttp(`/material/getById`, data)
// ICIS基础配置-耗材--新增Material
export const material_insert = (data) => wrapHttp(`/material/insert`, data)

// 基础数据HIS 手术
// ICIS基础配置-手术--删除Surgery
export const surgery_deleteById = (data) => wrapHttp(`/surgery/deleteById`, data)
// ICIS基础配置-手术--修改Surgery
export const surgery_edit = (data) => wrapHttp(`/surgery/edit`, data)
// ICIS基础配置-手术--分页获取Surgery
export const surgery_findWithPage = (data) => wrapHttp(`/surgery/findWithPage`, data)
// ICIS基础配置-手术--根据主键获取Surgery
export const surgery_getById = (data) => wrapHttp(`/surgery/getById`, data)
// ICIS基础配置-手术--新增Surgery
export const surgery_insert = (data) => wrapHttp(`/surgery/insert`, data)

// 基础数据HIS 诊断
// 根据id删除诊断
export const diag_deleteById = (data) => wrapHttp(`/diag/deleteById`, data)
// 修改诊断
export const diag_edit = (data) => wrapHttp(`/diag/edit`, data)
// 分页获取诊断
export const diag_findWithPage = (data) => wrapHttp(`/diag/findWithPage`, data)
// 分页获取诊断
export const diag_findAllWithPage = (data) => wrapHttp(`/diag/findAllWithPage`, data)
// 或者诊断信息
export const diag_getById = (data) => wrapHttp(`/diag/getById`, data)
// 新增诊断信息
export const diag_insert = (data) => wrapHttp(`/diag/insert`, data)

// 基础数据--药品
export const drug_deleteById = (data) => wrapHttp(`/drug/deleteById`, data)
// 修改药品信息
export const drug_edit = (data) => wrapHttp(`/drug/edit`, data)
// 分页获取药品信息 获取的数据有有效数据 不包含被禁用的数据
export const drug_findWithPage = (data) => wrapHttp(`/drug/findWithPage`, data)
// 分页获取药品信息
export const drug_findAllWithPage = (data) => wrapHttp(`/drug/findAllWithPage`, data)
// 获取诊药品信息
export const drug_getById = (data) => wrapHttp(`/drug/getById`, data)
// 新增药品
export const drug_insert = (data) => wrapHttp(`/drug/insert`, data)

// 基础数据--科室
// 删除科室信息
export const dept_deleteById = (data) => wrapHttp(`/dept/deleteById`, data)
// 修改科室信息
export const dept_edit = (data) => wrapHttp(`/dept/edit`, data)
// 分页获取科室信息
export const dept_findWithPage = (data) => wrapHttp(`/dept/findWithPage`, data)
// 获取科室信息
export const dept_getById = (data) => wrapHttp(`/dept/getById`, data)
// 新增科室
export const dept_insert = (data) => wrapHttp(`/dept/insert`, data)

// 基础设置-参数设置
// 基础设置-参数设置-参数分组--分页获取ParamGroup
export const paramGroup_findAllWithPage = (data) => wrapHttp(`/paramGroup/findAllWithPage`, data)
// 基础设置-参数设置-参数分组--根据主键获取ParamGroup
export const paramGroup_getById = (data) => wrapHttp(`/paramGroup/getById`, data)
// 基础设置-参数设置-参数分组--新增ParamGroup
export const paramGroup_insert = (data) => wrapHttp(`/paramGroup/insert`, data)
// 基础设置-参数设置-参数分组--删除ParamGroup
export const paramGroup_deletById = (data) => wrapHttp(`/paramGroup/deleteById`, data)
// 基础设置-参数设置-参数分组--修改ParamGroup
export const paramGroup_edit = (data) => wrapHttp(`/paramGroup/edit`, data)
// 基础设置-参数设置-参数项--分页获取Param
export const param_findWithPage = (data) => wrapHttp(`/param/findWithPage`, data)
// 基础设置-参数设置-参数项--不分页
export const param_queryParam = (data) => wrapHttp(`/param/queryParam`, data)
// 基础设置-参数设置-参数项--根据主键获取Param
export const param_getById = (data) => wrapHttp(`/param/getById`, data)
// 基础设置 -参数设置-参数项--新增Param
export const param_insert = (data) => wrapHttp(`/param/insert`, data)
// 基础设置-参数设置-参数项--删除Param
export const param_edit = (data) => wrapHttp(`/param/edit`, data)
// 基础设置-参数设置-参数项--修改Param
export const param_delete = (data) => wrapHttp(`/param/deleteById`, data)
// 基础设置-参数设置-菜单列表
export const paramMenu_getParamMenuList = (data) => wrapHttp(`/paramMenu/getParamMenuList`, data)
// 基础设置-参数设置-菜单列表-搜索详情
export const paramMenu_getParamListByMultiCondition = (data) => wrapHttp(`/paramMenu/getParamListByMultiCondition`, data)
// 批量获取参数
export const param_batchGetParam = (data) => wrapHttp(`/param/batchGetParam`, data)
export const param_batchGetAllParam = (data) => wrapHttp(`/param/batchGetAllParam`, data)
// 基础数据--导管
// 删除导管信息
export const catheter_deleteById = (data) => wrapHttp(`/catheter/deleteById`, data)
// 修改导管信息
export const catheter_edit = (data) => wrapHttp(`/catheter/edit`, data)
// 分页获取导管信息
export const catheter_findWithPage = (data) => wrapHttp(`/catheter/findWithPage`, data)
// 获取诊导管信息
export const catheter_getById = (data) => wrapHttp(`/catheter/getById`, data)
// 新增导管
export const catheter_insert = (data) => wrapHttp(`/catheter/insert`, data)
export const catheter_insertCatheterCustom = (data) => wrapHttp(`/catheter/insertCatheterCustom`, data)
export const catheter_getCatheterViewList = (data) => wrapHttp(`/catheterRecord/getCatheterViewList`, data)
export const catheter_getCatheterRecordInfectList = (data) => wrapHttp(`/catheterRecordInfect/getCatheterRecordInfectList`, data)

// ICIS基础数据-护理记录模板 : Nursing Template Controller
export const nursingTemplate_deleteById = (data) => wrapHttp(`/nursingTemplate/deleteById`, data)
export const nursingTemplate_edit = (data) => wrapHttp(`/nursingTemplate/edit`, data)
export const nursingTemplate_findWithPage = (data) => wrapHttp(`/nursingTemplate/findWithPage`, data)
export const nursingTemplate_findAllWithPage = (data) => wrapHttp(`/nursingTemplate/findAllWithPage`, data)
export const nursingTemplate_getById = (data) => wrapHttp(`/nursingTemplate/getById`, data)
export const nursingTemplate_insert = (data) => wrapHttp(`/nursingTemplate/insert`, data)
// 获取最大排序数
export const nursingTemplate_getMaxSortNo = (data) => wrapHttp(`/nursingTemplate/getMaxSortNo`, data)

// ICIS基础数据-监护字典  Moniitem Controller
// {
//   "contentTypeDict": null,--非必填，内容样式（支持单个）
//   "moniitemTypeDict": null,--非必填，监护项类型（支持单个）
//   "moniitemValueTypeDict": null,--非必填，监护项值类型（支持单个）
//   "dataSourceDict": null,--非必填，数据来源（支持单个）
//   "valueDictCode": null,--非必填，值来源字典编码（支持单个）
//   "statusDict": null,--非必填，启用禁用代码-"0":禁用；"1":启用
//   "searchKey": null,--非必填，模糊搜索关键字，目前搜索的是监护项编码、监护项名称、拼音码、五笔码
//   "limit": null,--非必填，查询前多少条（TOP N）；优先级高于分页
//   "cascade": false,--非必填，默认false：是否级联查询关联列表数据（两个监护项属性列表）
//   "pageNum": 1,--非必填，当前页码（注意分页时，两个分页参数必传，否则分页不生效）
//   "pageSize": 10,--非必填，一页数量（注意分页时，两个分页参数必传，否则分页不生效）
//   "moniitemCodes": [--非必填，已选择的监护项列表数据（会叠加到数据列表上面，后面的是分页数据，比如已选2条，分页10条，返回列表是12条）
//       "WN_ICIS_INSPECT_1011078",
//       "WN_ICIS_INSPECT_1011111"
//   ]
// }
export const moniitem_multipleListPage = (data) => wrapHttp(`/moniitem/multipleListPage`, data)
export const moniitem_deleteById = (data) => wrapHttp(`/moniitem/deleteById`, data)
export const moniitem_edit = (data) => wrapHttp(`/moniitem/edit`, data)
export const moniitem_findWithPage = (data) => wrapHttp(`/moniitem/findWithPage`, data)
export const moniitem_findAllWithPage = (data) => wrapHttp(`/moniitem/findAllWithPage`, data)
export const moniitem_findWithPageNotAttr = (data) => wrapHttp(`/moniitem/findWithPageNotAttr`, data)
export const moniitem_getById = (data) => wrapHttp(`/moniitem/getById`, data)
export const moniitem_insert = (data) => wrapHttp(`/moniitem/insert`, data)
export const moniitem_getMoniitemList = (data) => wrapHttp(`/moniitem/getMoniitemList`, data)
export const moniitem_batchQueryMonItem = (data) => wrapHttp(`/moniitem/batchQueryMonItem`, data)

// ICIS基础数据-设备管理 : Device Controller
export const device_deleteById = (data) => wrapHttp(`/device/deleteById`, data)
export const device_edit = (data) => wrapHttp(`/device/edit`, data)
export const device_findWithPage = (data) => wrapHttp(`/device/findWithPage`, data)
export const device_findAllWithPage = (data) => wrapHttp(`/device/findAllWithPage`, data)
export const device_getById = (data) => wrapHttp(`/device/getById`, data)
export const device_insert = (data) => wrapHttp(`/device/insert`, data)

// ICIS基础配置-病区功能模块管理监护数据显示分组 : Ward Module Monitype Controller
export const wardModuleMonGroup_deleteById = (data) => wrapHttp(`/wardModuleMonGroup/deleteById`, data)
export const wardModuleMonGroup_edit = (data) => wrapHttp(`/wardModuleMonGroup/edit`, data)
export const wardModuleMonGroup_findWithPage = (data) => wrapHttp(`/wardModuleMonGroup/findWithPage`, data)
export const wardModuleMonGroup_findAllWithPage = (data) => wrapHttp(`/wardModuleMonGroup/findAllWithPage`, data)
// export const wardModuleMonGroup_getById = (data) => wrapHttp(`/wardModuleMonGroup/getById`, data)
export const wardModuleMonGroup_insert = (data) => wrapHttp(`/wardModuleMonGroup/insert`, data)
export const wardModuleMonGroup_getMaxSort = (data) => wrapHttp(`/wardModuleMonGroup/getMaxSort`, data)

// ICIS基础配置-病区关联功能模块 : Ward Module Controller
export const wardModule_deleteById = (data) => wrapHttp(`/wardModule/deleteById`, data)
export const wardModule_edit = (data) => wrapHttp(`/wardModule/edit`, data)
export const wardModule_findWithPage = (data) => wrapHttp(`/wardModule/findWithPage`, data)
export const wardModule_getById = (data) => wrapHttp(`/wardModule/getById`, data)
export const wardModule_insert = (data) => wrapHttp(`/wardModule/insert`, data)
export const wardModule_copyWardMonitorConfig = (data) => wrapHttp(`/wardModule/copyWardMonitorConfig`, data)
export const wardModule_deleteByWardCode = (data) => wrapHttp(`/wardModule/deleteByWardCode`, data)

// ICIS基础配置-床位管理设备 : Bed Device Controller
export const bedDevice_deleteById = (data) => wrapHttp(`/bedDevice/deleteById`, data)
export const bedDevice_edit = (data) => wrapHttp(`/bedDevice/edit`, data)
export const bedDevice_findWithPage = (data) => wrapHttp(`/bedDevice/findWithPage`, data)
export const bedDevice_getById = (data) => wrapHttp(`/bedDevice/getById`, data)
export const bedDevice_insert = (data) => wrapHttp(`/bedDevice/insert`, data)
export const bedDevice_save = (data) => wrapHttp(`/bedDevice/save`, data)
export const bedDevice_findPortalWithPage = (data) => wrapHttp(`/bedDevice/findPortalWithPage`, data)
export const bedDevice_findBedDeviceByWard = (data) => wrapHttp(`/bedDevice/findBedDeviceByWard`, data)
// ICIS基础配置 - 导管部位配置 : Cath Posi Controller
export const cathPosi_batchInsert = (data) => wrapHttp(`cathPosi/batchInsert`, data)
export const cathPosi_copy = (data) => wrapHttp(`cathPosi/copy`, data)
export const cathPosi_deleteById = (data) => wrapHttp(`/cathPosi/deleteById`, data)
export const cathPosi_deleteByWardCode = (data) => wrapHttp(`/cathPosi/deleteByWardCode`, data)
export const cathPosi_edit = (data) => wrapHttp(`/cathPosi/edit`, data)
export const cathPosi_findWithPage = (data) => wrapHttp(`/cathPosi/findWithPage`, data)
export const cathPosi_findAllWithPage = (data) => wrapHttp(`/cathPosi/findAllWithPage`, data)
// export const cathPosi_getById = (data) => wrapHttp(`/cathPosi/getById`, data)
export const cathPosi_insert = (data) => wrapHttp(`/cathPosi/insert`, data)
// ICIS基础配置-导管部位映射导管 : Cath Posi Mp Controller
export const cathPosiMp_deleteById = (data) => wrapHttp(`/cathPosiMp/deleteById`, data)
export const cathPosiMp_findAllWithPage = (data) => wrapHttp(`/cathPosiMp/findAllWithPage`, data)
export const cathPosiMp_findWithPage = (data) => wrapHttp(`/cathPosiMp/findWithPage`, data)
export const cathPosiMp_batchInsert = (data) => wrapHttp(`/cathPosiMp/batchInsert`, data)
// ICIS基础配置-关注诊断 : Concern Diag Controller
export const concernDiag_deleteById = (data) => wrapHttp(`/concernDiag/deleteById`, data)
// export const concernDiag_edit = (data) => wrapHttp(`/concernDiag/edit`, data)
export const concernDiag_findAllWithPage = (data) => wrapHttp(`/concernDiag/findAllWithPage`, data)
// export const concernDiag_getById = (data) => wrapHttp(`/concernDiag/getById`, data)
export const concernDiag_insert = (data) => wrapHttp(`/concernDiag/insert`, data)
export const concernDiag_batchInsert = (data) => wrapHttp(`/concernDiag/batchInsert`, data)
// ICIS基础配置-监护项详细配置 : Ward Module Moniitem Controller
export const wardModuleMoniitem_deleteById = (data) => wrapHttp(`/wardModuleMoniitem/deleteById`, data)
export const wardModuleMoniitem_edit = (data) => wrapHttp(`/wardModuleMoniitem/edit`, data)
export const wardModuleMoniitem_findAllWithPage = (data) => wrapHttp(`/wardModuleMoniitem/findAllWithPage`, data)
// export const wardModuleMoniitem_getById = (data) => wrapHttp(`/wardModuleMoniitem/getById`, data)
export const wardModuleMoniitem_insert = (data) => wrapHttp(`/wardModuleMoniitem/insert`, data)
export const wardModuleMoniitem_getWardMoniitemList = (data) => wrapHttp(`/wardModuleMoniitem/getWardMoniitemList`, data)
export const wardModuleMoniitem_getMaxSort = (data) => wrapHttp(`/wardModuleMoniitem/getMaxSort`, data)
// ICIS基础配置-生命体征曲线设置 : Vital Signs Controller
export const vitalSigns_cleanVitalSigns = (data) => wrapHttp(`/vitalSigns/cleanVitalSigns`, data)
export const vitalSigns_copyVitalSigns = (data) => wrapHttp(`/vitalSigns/copyVitalSigns`, data)
export const vitalSigns_deleteById = (data) => wrapHttp(`/vitalSigns/deleteById`, data)
export const vitalSigns_edit = (data) => wrapHttp(`/vitalSigns/edit`, data)
export const vitalSigns_findWithPage = (data) => wrapHttp(`/vitalSigns/findWithPage`, data)
export const vitalSigns_findAllWithPage = (data) => wrapHttp(`/vitalSigns/findAllWithPage`, data)
export const vitalSigns_insertList = (data) => wrapHttp(`/vitalSigns/insertList`, data)
// export const vitalSigns_getById = (data) => wrapHttp(`/vitalSigns/getById`, data)
export const vitalSigns_insert = (data) => wrapHttp(`/vitalSigns/insert`, data)
// ICIS基础配置-物理降温图标配置 : Cooling Controller
// export const cooling_deleteById = (data) => wrapHttp(`/ cooling / deleteById`, data)
export const cooling_edit = (data) => wrapHttp(`/cooling/edit`, data)
// export const cooling_findWithPage = (data) => wrapHttp(`/ cooling / findWithPage`, data)
export const cooling_getById = (data) => wrapHttp(`/cooling/getById`, data)
// export const cooling_insert = (data) => wrapHttp(`/ cooling / insert`, data)
// ICIS基础配置-药品剂量换算设置 : Drug Convert Controller
export const drugConvert_deleteById = (data) => wrapHttp(`/drugConvert/deleteById`, data)
export const drugConvert_edit = (data) => wrapHttp(`/drugConvert/edit`, data)
export const drugConvert_findAllWithPage = (data) => wrapHttp(`/drugConvert/findAllWithPage`, data)
export const drugConvert_getById = (data) => wrapHttp(`/drugConvert/getById`, data)
export const drugConvert_insert = (data) => wrapHttp(`/drugConvert/insert`, data)
export const drugConvert_synConvert = (data) => wrapHttp(`/drugConvert/synConvert`, data)
// ICIS基础配置-预警设置 : Moniitem Warning Controller
export const moniitemWarning_deleteById = (data) => wrapHttp(`/moniitemWarning/deleteById`, data)
export const moniitemWarning_edit = (data) => wrapHttp(`/moniitemWarning/edit`, data)
export const moniitemWarning_findAllWithPage = (data) => wrapHttp(`/moniitemWarning/findAllWithPage`, data)
export const moniitemWarning_findWithPage = (data) => wrapHttp(`/moniitemWarning/findWithPage`, data)
export const moniitemWarning_getById = (data) => wrapHttp(`/moniitemWarning/getById`, data)
export const moniitemWarning_insert = (data) => wrapHttp(`/moniitemWarning/insert`, data)
export const moniitemWarning_copyWardMonWarningConfig = (data) => wrapHttp(`/moniitemWarning/copyWardMonWarningConfig`, data)
export const moniitemWarning_deleteByWardCode = (data) => wrapHttp(`/moniitemWarning/deleteByWardCode`, data)

// ICIS基础配置-诊断关注项 : Diag Moniitem Controller
export const diagMoniitem_deleteById = (data) => wrapHttp(`/diagMoniitem/deleteById`, data)
export const diagMoniitem_edit = (data) => wrapHttp(`/diagMoniitem/edit`, data)
export const diagMoniitem_findAllWithPage = (data) => wrapHttp(`/diagMoniitem/findAllWithPage`, data)
export const diagMoniitem_getById = (data) => wrapHttp(`/diagMoniitem/getById`, data)
export const diagMoniitem_insert = (data) => wrapHttp(`/diagMoniitem/insert`, data)
export const diagMoniitem_batchInsert = (data) => wrapHttp(`/diagMoniitem/batchInsert`, data)
export const diagMoniitem_getMaxSort = (data) => wrapHttp(`/diagMoniitem/getMaxSort`, data)

// ICIS基础配置-床位管理 : Bed Controller
export const bed_deleteById = (data) => wrapHttp(`/bed/deleteById`, data)
export const bed_edit = (data) => wrapHttp(`/bed/edit`, data)
export const bed_findWithPage = (data) => wrapHttp(`/bed/findWithPage`, data)
export const bed_getById = (data) => wrapHttp(`/bed/getById`, data)
export const bed_insert = (data) => wrapHttp(`/bed/insert`, data)
export const bed_getMaxSort = (data) => wrapHttp(`bed/getMaxSort`, data)
export const bed_getIcuWardBedList = (data) => wrapHttp(`bed/getIcuWardBedList`, data)

// ICIS基础配置-皮肤部位配置 : Skin Posi Controller
export const skinPosi_batchInsert = (data) => wrapHttp(`/skinPosi/batchInsert`, data)
export const skinPosi_copy = (data) => wrapHttp(`/skinPosi/copy`, data)
export const skinPosi_deleteById = (data) => wrapHttp(`/skinPosi/deleteById`, data)
export const skinPosi_deleteByWardCode = (data) => wrapHttp(`/skinPosi/deleteByWardCode`, data)
export const skinPosi_edit = (data) => wrapHttp(`/skinPosi/edit`, data)
export const skinPosi_findWithPage = (data) => wrapHttp(`/skinPosi/findWithPage`, data)

// ICIS基础配置-导管监护项设置 : Catheter Moniitem Controller
export const catheterMoniitem_copy = (data) => wrapHttp(`/catheterMoniitem/copy`, data)
export const catheterMoniitem_deleteById = (data) => wrapHttp(`/catheterMoniitem/deleteById`, data)
export const catheterMoniitem_deleteByWardCode = (data) => wrapHttp(`/catheterMoniitem/deleteByWardCode`, data)
export const catheterMoniitem_edit = (data) => wrapHttp(`/catheterMoniitem/edit`, data)
export const catheterMoniitem_findAllWithPage = (data) => wrapHttp(`/catheterMoniitem/findAllWithPage`, data)
export const catheterMoniitem_insert = (data) => wrapHttp(`/catheterMoniitem/insert`, data)
export const catheterMoniitem_getMaxSort = (data) => wrapHttp(`/catheterMoniitem/getMaxSort`, data)

// ICIS基础配置 - 置管规则风险配置 : Catheter Rule Controller //导管感染风险配置
export const catheterRule_copy = (data) => wrapHttp(`/catheterRule/copy`, data)
export const catheterRule_deleteById = (data) => wrapHttp(`/catheterRule/deleteById`, data)
export const catheterRule_deleteByWardCode = (data) => wrapHttp(`/catheterRule/deleteByWardCode`, data)
export const catheterRule_edit = (data) => wrapHttp(`/catheterRule/edit`, data)
export const catheterRule_findWithPage = (data) => wrapHttp(`/catheterRule/findWithPage`, data)
export const catheterRule_findAllWithPage = (data) => wrapHttp(`/catheterRule/findAllWithPage`, data)
export const catheterRule_insert = (data) => wrapHttp(`/catheterRule/insert`, data)

// -监护数据记录 : Moniitem Record Controller
export const moniitemRecord_batchAutoGetMoniItemRecordByTime = (data) => wrapHttp(`/moniitemRecord/batchAutoGetMoniItemRecordByTime`, data)
export const moniitemRecord_batchCopyItem = (data) => wrapHttp(`/moniitemRecord/batchCopyItem`, data)
// 批量删除
export const moniitemRecord_batchDelMoniItemRecordByTime = (data) => wrapHttp(`/moniitemRecord/batchDelMoniItemRecordByTime`, data)
export const personMoniitem_findPersonMonType = (data) => wrapHttp(`/personMoniitem/findPersonMonType`, data)
export const personMoniitem_findOptionalMonItem = (data) => wrapHttp(`/personMoniitem/findOptionalMonItem`, data)
export const personMoniitem_findPersonObserveMonType = (data) => wrapHttp(`/personMoniitem/findPersonObserveMonType`, data)
export const personMoniitem_findOptionalObserveMonItem = (data) => wrapHttp(`/personMoniitem/findOptionalObserveMonItem`, data)
export const personMoniitem_getMoniitemObserverDataList = (data) => wrapHttp(`/personMoniitem/getMoniitemObserverDataList`, data) // 个人配置项优化
export const personMoniitem_updateMoniitemObserverDataList = (data) => wrapHttp(`/personMoniitem/updateMoniitemObserverDataList`, data) // 个人配置项优化
export const moniitemRecord_autoGetMoniItemRecordByTime = (data) => wrapHttp(`/moniitemRecord/autoGetMoniItemRecordByTime`, data)
export const moniitemRecord_copyItem = (data) => wrapHttp(`/moniitemRecord/copyItem`, data)
export const moniitemRecord_deleteById = (data) => wrapHttp(`/moniitemRecord/deleteById`, data)
export const moniitemRecord_findMoniItemRecord = (data) => wrapHttp(`/moniitemRecord/findMoniItemRecord`, data)
export const moniitemRecord_findAvailableTime = (data) => wrapHttp(`/moniitemRecord/findAvailableTime`, data)
export const moniitemRecord_batchSaveRecords = (data) => wrapHttp(`/moniitemRecord/batchSaveRecords`, data)
export const moniitemRecord_findMoniItemRecordByTime = (data) => wrapHttp(`/moniitemRecord/findMoniItemRecordByTime`, data)
export const moniitemRecord_findWithPage = (data) => wrapHttp(`/moniitemRecord/findWithPage`, data)
export const moniitemRecord_getById = (data) => wrapHttp(`/moniitemRecord/getById`, data)
export const moniitemRecord_save = (data) => wrapHttp(`/moniitemRecord/save`, data)
export const moniitemRecord_autoCalMoniItemRecord = (data) => wrapHttp(`/moniitemRecord/autoCalMoniItemRecord`, data)
export const moniitemRecord_getVitalSignData = (data) => wrapHttp(`/moniitemRecord/getVitalSignData`, data)
export const moniitemRecord_getMoniitemWarningRecord = (data) => wrapHttp(`/moniitemRecord/getMoniitemWarningRecord`, data)
// 批量修改监护项数据
export const moniitemRecord_batchModifyMoniItemRecord = (data) => wrapHttp(`/moniitemRecord/batchModifyMoniItemRecord`, data)

export const moniitemRecord_getMoniitemRecord = (data) => wrapHttp(`/moniitemRecord/getMoniitemRecord`, data)
// 审核监护数据
export const moniitemRecord_auditUpdate = (data) => wrapHttp(`/moniitemRecord/auditUpdate`, data)
// 取消审核数据
export const moniitemRecord_cancelAudit = (data) => wrapHttp(`/moniitemRecord/cancelAudit`, data)
// export const moniitemRecord_getVitalSignData = (data) => wrapHttp(`/ dataCollect / getSignData`, data)
// 质控统计
export const qc_listPage = (data) => wrapHttp(`/qc/listPage`, data)
export const qc_saveOrUpdate = (data) => wrapHttp(`/qc/saveOrUpdate`, data)

// 平台对接 设备盒子对接
// 获取采集盒子列表
export const dataCollect_getCollectorList = (data) => wrapHttp(`/dataCollect/getCollectorList`, data)
// 绑定盒子
export const dataCollect_connectDevice = (data) => wrapHttp(`/dataCollect/connectDevice`, data)
// 绑定盒子
export const dataCollect_unBindDevice = (data) => wrapHttp(`/dataCollect/unBindDevice`, data)
// 断开连接
export const dataCollect_disconnectDevice = (data) => wrapHttp(`/dataCollect/disconnectDevice`, data)
// 绑定盒子
export const dataCollect_getDeviceDetail = (data) => wrapHttp(`/dataCollect/getDeviceDetail`, data)
// 获取设备最近数据
export const dataCollect_getDeviceLatestData = (data) => wrapHttp(`/dataCollect/getDeviceLatestData`, data)
// 获取设备最近数据 分页
export const dataCollect_getDeviceLatestDataByPage = (data) => wrapHttp(`/dataCollect/getDeviceLatestDataByPage`, data)
// 获取连接信息
export const dataCollect_getDeviceConnectDetail = (data) => wrapHttp(`/dataCollect/getDeviceConnectDetail`, data)
// 获取历史记录数据
export const dataCollect_getHistoryDevices = (data) => wrapHttp(`/dataCollect/getHistoryDevices`, data)
// 保存默认值
export const dataCollect_saveDefaultParams = (data) => wrapHttp(`/dataCollect/saveDefaultParams`, data)
// 修改历史连接记录
export const dataCollect_editHistoryDeviceConParams = (data) => wrapHttp(`/dataCollect/editHistoryDeviceConParams`, data)
// 作废历史记录
export const dataCollect_delHistoryDeviceConnection = (data) => wrapHttp(`/dataCollect/delHistoryDeviceConnection`, data)
// 获取采集转换版本配置
export const dataCollect_convertVersion = (data) => wrapHttp(`/dataCollect/convertVersion`, data, 'get')
// 文书配置  数据源列表
/**
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const formProSql_addFormProSql = (data) => wrapHttp(`/formProSql/addFormProSql`, data)
/**
 *
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const apiParam_addApiParam = (data) => wrapHttp(`/apiParam/addApiParam`, data)
/**
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const formProSql_getFormProList = (data) => wrapHttp(`/formProSql/getFormProList`, data)
/**
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const formProSql_getAllFormProList = (data) => wrapHttp(`/formProSql/getAllFormProList`, data)

export const formProSql_listPage = (data) => wrapHttp(`/formProSql/listPage`, data)
/**
 *
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const apiParam_getAllApiParamList = (data) => wrapHttp(`/apiParam/getAllApiParamList`, data)
/**
 * 更新主界面
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const formProSql_updateFormProSql = (data) => wrapHttp(`/formProSql/updateFormProSql`, data)
/**
 * 复制数据源
 * @param {*} data
 * @returns
 */
export const formProSql_copyFormProSql = (data) => wrapHttp(`/formProSql/copyFormProSql `, data)
/**
 * 更新删除
 * @param {*}
 * { "id":"202111081408120000" }
 */
export const apiParam_updateApiParam = (data) => wrapHttp(`/apiParam/updateApiParam`, data)
/**
 * @param {*} 参数删除
 * { "id":"202111081408120000" }
 */
export const apiParam_enable = (data) => wrapHttp(`/apiParam/enable`, data)
/**
 * @param {*} 主界面删除
 * { "id":"202111081408120000" }
 */
export const formProSql_deleteFormProSqlById = (data) => wrapHttp(`/formProSql/deleteFormProSqlById`, data)
/** 获取图片列表 */
export const basedata_getDocPictureList = (data) => wrapHttp(`/basedata/getDocPictureList`, data)
/** 删除图片 */
export const basedata_deleteDocPicture = (data) => wrapHttp(`/basedata/deleteDocPicture`, data)

// 药品用法
// 药品用法-查询列表
export const drugUsage_list = (data) => wrapHttp(`/drugUsage/list`, data)
// 药品用法-分页获取
export const drugUsage_findWithPage = (data) => wrapHttp(`/drugUsage/findWithPage`, data)
// 药品用法-新增药品用法
export const drugUsage_insert = (data) => wrapHttp(`/drugUsage/insert`, data)
// 药品用法-新增药品用法
export const drugUsage_edit = (data) => wrapHttp(`/drugUsage/edit`, data)
// 药品用法-复制配置
export const drugUsage_copyTo = (data) => wrapHttp(`/drugUsage/copyTo`, data)

// 病区概况-模块配置-新建 没用到
// export const overview_insertOverview = (data) => wrapHttp(`/overview/insertOverview`, data)
// 病区概况-模块配置-修改
export const overview_editOverview = (data) => wrapHttp(`/overview/editOverview`, data)
// 病区概况-模块配置-查询
export const overview_findOverviewWithPage = (data) => wrapHttp(`/overview/findOverviewWithPage`, data)

// 监护事件设置-分页获取
export const config_monitoringEvent_listPage = (data) => wrapHttp(`/config/monitoringEvent/listPage`, data)
// 监护事件设置-新增监护事件
export const config_monitoringEvent_add = (data) => wrapHttp(`/config/monitoringEvent/add`, data)
// 监护事件设置-修改监护事件
export const config_monitoringEvent_update = (data) => wrapHttp(`/config/monitoringEvent/update`, data)
// 监护事件设置-删除监护事件
export const config_monitoringEvent_delete = (data) => wrapHttp(`/config/monitoringEvent/delete`, data)
// 病种分类配置 --分页获取诊断分类列表
// {
//   "surgicalPatients": "0",   --必传，是否手术患者：0，非手术患者；1，手术患者
//   "searchKey": "",   		   --非必传，模糊搜索关键字
//   "statusDict": null, --非必传，启用禁用状态(0:禁用；1:启用)
//   "pageNum": 1,--必传，页码
//   "pageSize": 10 --必传，一页数量
// }
export const diagnosis_classify_listPage = (data) => wrapHttp(`/diagnosis/classify/listPage`, data)
// {
//   "surgicalPatients": "0",--必传，是否手术患者：0，非手术患者；1，手术患者
//   "classifyCode": "5677",--必传，分类编码
//   "classifyName": "哮喘或过敏症状引起的呼吸衰竭或不全",--必传，分类名称
//   "score": -2.108,--必传，分值
//   "sortNo": 1,--必传，排序码
//   "statusDict": "1"，--必传，启用禁用状态(0:禁用；1:启用)
// }
// --新增诊断分类
export const diagnosis_classify_add = (data) => wrapHttp(`/diagnosis/classify/add`, data)
// {
//   "id": "202203150955390013",--必传，主键
//   "classifyName": "哮喘或过敏症状引起的呼吸衰竭或不全",--必传，
//   "score": -2.108,--必传，分值
//   "sortNo": 1,--必传，排序码
//   "statusDict": "1"--必传，启用禁用状态(0:禁用；1:启用)
// }
// --修改诊断分类
export const diagnosis_classify_update = (data) => wrapHttp(`/diagnosis/classify/update`, data)
// {
//   "id": "202203150955390013"--必传，主键
// }
// --启用诊断分类（也可以复用上面的修改接口，但参数要求必传）
export const diagnosis_classify_enable = (data) => wrapHttp(`/diagnosis/classify/enable`, data)
export const diagnosis_classify_disable = (data) => wrapHttp(`/diagnosis/classify/disable`, data)
export const diagnosis_adscription_getMaxSort = (data) => wrapHttp(`diagnosis/adscription/getMaxSort`, data) // 获取诊断系统最大方式
// --查询诊断分类下诊断分页数据
// {
//   "classifyId": "202203150955390013",--必传，病种分类ID
//   "pageNum": 1,--必传，页码
//   "pageSize": 10 --必传，一页数量
// }
export const diagnosis_adscription_listPage = (data) => wrapHttp(`/diagnosis/adscription/listPage`, data)
// --查询诊断分类下未配置的诊断列表数据(TOP200)
// {
//   "classifyId": "202203150955390013",--必传，病种分类ID
//   "searchKey": null,--非必传，模糊搜索关键字
// }
export const diagnosis_adscription_withoutConfig = (data) => wrapHttp(`/diagnosis/adscription/withoutConfig`, data)
// --新增诊断到诊断分类
// {
//   "classifyId": "202203150955390013", --必传，病种分类ID
//   "diagnoseCode": "A00.000x001"--必传，诊断编码
// }
export const diagnosis_adscription_add = (data) => wrapHttp(`/diagnosis/adscription/add`, data)
// --删除诊断在诊断分类中配置数据
// {
//   "id": "202203151309540006"--业务主键，查询接口中的id
// }
export const diagnosis_adscription_delete = (data) => wrapHttp(`/diagnosis/adscription/delete`, data)
// 病种基础配置--分页查询病种数据列表
// 入参：
// {
//     "searchKey": "",--非必传，模糊搜索关键字
//     "statusDict": null,--非必传，启用禁用状态(0:禁用；1:启用)
//     "pageNum": 1,--必传，页码
//     "pageSize": 10 --必传，一页数量
// }
export const base_diseases_listPage = (data) => wrapHttp(`/base/diseases/listPage`, data)
// --查询所有病种数据
// 入参：
// {
//     "searchKey": "",--非必传，模糊搜索关键字
//     "statusDict": null,--非必传，启用禁用状态(0:禁用；1:启用)
//   "belongClassify":"",--归属分类：非手术患者:0，手术患者:1
// }
export const base_diseases_list = (data) => wrapHttp(`/base/diseases/list`, data)
// --新增病种数据
// {
//   "diseasesCode": "WN_ICIS_DISEASES_0002",--必传，病种编码
//   "diseasesName":"COPD",--必传，病种名称
//   "classfyDictCode":"1",--非必传，病种分类编码
//   "statusDict": "1"--必传，启用禁用状态(0:禁用；1:启用)
// "belongClassify":"",--非必传，归属分类：非手术患者:0，手术患者:1，既属于手术又属于非手术：0,1【注意顺序】
// }
export const base_diseases_add = (data) => wrapHttp(`/base/diseases/add`, data)
// --修改病种数据
// {
//   "id": "202203161350060007",--业务主键
// "diseasesCode": "WN_ICIS_DISEASES_0002",--必传，病种编码
//   "diseasesName":"COPD",--必传，病种名称
//   "classfyDictCode":"1",--必传，病种分类编码
//   "statusDict": "1"--必传，启用禁用状态(0:禁用；1:启用)
// "belongClassify":"",--必传，归属分类：非手术患者:0，手术患者:1，既属于手术又属于非手术：0,1【注意顺序】
// }
export const base_diseases_update = (data) => wrapHttp(`base/diseases/update`, data)
// --启用病种（也可以复用上面的修改接口，但参数要求必传）
// 入参：
// {
//     "id": "202203161412110060"--必传，主键
// }
export const base_diseases_disable = (data) => wrapHttp(`/base/diseases/disable`, data)

// --基于是否手术病人查询病种及分值数据列表
// {
//     "surgicalPatients": "0",--必传，是否手术患者：0，非手术患者；1，手术患者
//     "statusDict": ""--非必传，启用禁用状态(0:禁用；1:启用)
// }
export const diagnosis_baseWihtScoreList = (data) => wrapHttp(`/diagnosis/baseWihtScoreList`, data)
// --查询病人的病种数据列表
// {
//     "icuRecordId":"202111120121390008",--必传，病人ICUID
//     "surgicalPatients":"0"--必传，是否手术患者：0，非手术患者；1，手术患者
// }
export const diagnosisadscription_recordList = (data) => wrapHttp(`/diagnosisadscription/recordList`, data)

// =============质控部分接口==================
// 1./qc/listPage   --质控查询列表接口
// 返回数据字段中加入：
// clasifyLables: "哮喘或变态反应[-2.1080];\\bCOPD[-0.3670]"   --前端展示的病种分类数据（前端按照'\b'折行显示）

// 2./qc/saveOrUpdate   --质控修改接口
// 新增
// classifyModify："1";--ICU病人配置病种修改标识，"1"：需要同步修改，否则不修改
// classifyIds: "id1,id2" ,将分类id用英文逗号拼接，如果上面classifyModify='1'，必传，否则是清空数据；

// 检验指标对照-分页获取监护项和检查检验映射关系列表
export const moniitemInspection_listPage = (data) => wrapHttp(`/moniitemInspection/listPage`, data)
// 检验指标对照-获取监护项和检查检验映射关系列表
export const moniitemInspection_list = (data) => wrapHttp(`/moniitemInspection/list`, data)
// 检验指标对照-新增监护项和检查检验映射
export const moniitemInspection_add = (data) => wrapHttp(`/moniitemInspection/add`, data)
// 检验指标对照-修改监护项和检查检验映射
export const moniitemInspection_update = (data) => wrapHttp(`/moniitemInspection/update`, data)
// 检验指标对照-启用监护项和检查检验映射
export const moniitemInspection_enable = (data) => wrapHttp(`/moniitemInspection/enable`, data)
// 检验指标对照-禁用监护项和检查检验映射
export const moniitemInspection_disable = (data) => wrapHttp(`/moniitemInspection/disable`, data)
// 检验指标对照-LIS检查检验配置
export const lisItem_findWithPage = (data) => wrapHttp(`/lisItem/findWithPage`, data)
export const lisItem_getById = (data) => wrapHttp(`/lisItem/getById`, data)
export const lisItem_insert = (data) => wrapHttp(`/lisItem/insert`, data)
export const lisItem_edit = (data) => wrapHttp(`/lisItem/edit`, data)
export const lisItem_deleteById = (data) => wrapHttp(`/lisItem/deleteById`, data)

// 复制模板病区配置
export const template_copyTemplateListConfig = (data) => wrapHttp(`/template/copyTemplateListConfig`, data)
// 删除模板
export const template_deleteTemplateById = (data) => wrapHttp(`/template/deleteTemplateById`, data)
// 修改Template
export const template_editTemplate = (data) => wrapHttp(`/template/editTemplate`, data)
// 根据主键获取Template
export const template_getTemplateById = (data) => wrapHttp(`/template/getTemplateById`, data)
// 分页获取Template
export const template_getTemplateList = (data) => wrapHttp(`/template/getTemplateList`, data)
// 新增模板
export const template_insertTemplate = (data) => wrapHttp(`/template/insertTemplate`, data)
// 获取最大排序数
export const template_getMaxSortNo = (data) => wrapHttp(`template/getMaxSortNo`, data)

// 监护数据汇总
export const moniitemRecord_summarizeMonItemRecord = (data) => wrapHttp(`/moniitemRecord/summarizeMonItemRecord`, data)

// 操作手册配置-上传文件
export const operationManual_uploadPdfFile = (data) => wrapHttp(`/operationManual/uploadPdfFile`, data)
// 操作手册配置-文件列表
export const operationManual_list = (data) => wrapHttp(`/operationManual/list`, data)
// 操作手册配置-删除文件
export const operationManual_delete = (data) => wrapHttp(`/operationManual/delete`, data)

// 重点患者情况设置 - 分页获取
export const focalPatient_findWithPage = (data) => wrapHttp(`/focalPatient/findWithPage`, data)
// 重点患者情况设置 - 禁用
export const focalPatient_disable = (data) => wrapHttp(`/focalPatient/disable`, data)
// 重点患者情况设置 - 修改
export const focalPatient_edit = (data) => wrapHttp(`/focalPatient/edit`, data)
// 重点患者情况设置 - 复制病区重点患者情况设置到另一病区
export const focalPatient_copyWardConfig = (data) => wrapHttp(`/focalPatient/copyWardConfig`, data)

// ICU质控报表配置 - 列表
export const qcReportConfig_findWithPage = (data) => wrapHttp(`/qcReportConfig/findWithPage`, data)
// ICU质控报表配置 - 刷新
export const qcReportConfig_refresh = (data) => wrapHttp(`/qcReportConfig/refresh`, data)
// ICU质控报表配置 - 启用禁用
export const qcReportConfig_disable = (data) => wrapHttp(`/qcReportConfig/disable`, data)
// ICU质控报表配置 - 修改
export const qcReportConfig_edit = (data) => wrapHttp(`/qcReportConfig/edit`, data)
// ICU质控报表配置 - 复制
export const qcReportConfig_copyWardConfig = (data) => wrapHttp(`/qcReportConfig/copyWardConfig`, data)

// 设置主题皮肤 - 获取用户皮肤
export const userTheme_getUserThemeByWardCodeUsername = (data) => wrapHttp(`/userTheme/getUserThemeByWardCodeUsername`, data)
// 设置主题皮肤 - 新增用户皮肤
export const userTheme_insertUserTheme = (data) => wrapHttp(`/userTheme/insertUserTheme`, data)
// 设置主题皮肤 - 修改用户皮肤
export const userTheme_editUserTheme = (data) => wrapHttp(`/userTheme/editUserTheme`, data)

// 患者标识接口
// 患者标识设置页面 列表接口
export const patientIcon_list = (data) => wrapHttp(`/config/patientIcon/list`, data)
// 患者标识页面 刷新图表接口
export const patientIcon_refresh = (data) => wrapHttp(`/config/patientIcon/refresh`, data)
// 患者标识页面 编辑功能
export const patientIcon_update = (data) => wrapHttp(`/config/patientIcon/update`, data)
// 患者标识页面 复制功能
export const patientIcon_copyData = (data) => wrapHttp(`/config/patientIcon/copyData`, data)
// 患者标识页面 设置启用
export const patientIcon_enable = (data) => wrapHttp(`/config/patientIcon/enable`, data)
// 患者标识页面 设置禁用
export const patientIcon_disable = (data) => wrapHttp(`/config/patientIcon/disable`, data)

// 透析药物配置页面接口

// 获取可选择药品列表
export const dialysisDispensing_getDialysisDispensingDrugList = (data) => wrapHttp(`/dialysisDispensing/getDialysisDispensingDrugList`, data)
// 插入药物
export const dialysisDispensing_insertDialysisDispensing = (data) => wrapHttp(`/dialysisDispensing/insertDialysisDispensing`, data)
// 编辑药品
export const dialysisDispensing_editDialysisDispensing = (data) => wrapHttp(`/dialysisDispensing/editDialysisDispensing`, data)
// 查询
export const dialysisDispensing_findDialysisDispensingWithPage = (data) => wrapHttp(`/dialysisDispensing/findDialysisDispensingWithPage`, data)
// 复制透析配液药品
export const dialysisDispensing_copyDialysisDispensing = (data) => wrapHttp(`/dialysisDispensing/copyDialysisDispensing`, data)
// 删除信息
export const dialysisDispensing_deleteById = (data) => wrapHttp(`/dialysisDispensing/deleteById`, data)

// 出区标准规则

// 删除OutwardRuleWard
export const outwardRuleWard_deleteById = (data) => wrapHttp(`/outwardRuleWard/deleteById`, data)
// 修改OutwardRuleWard
export const outwardRuleWard_edit = (data) => wrapHttp(`/outwardRuleWard/edit`, data)
// 分页获取OutwardRuleWard
export const outwardRuleWard_findWithPage = (data) => wrapHttp(`/outwardRuleWard/findWithPage`, data)
// 新增
export const outwardRuleWard_insert = (data) => wrapHttp(`/outwardRuleWard/insert`, data)
// 复制病区出区标准数据
export const outwardRuleWard_copyOutwardRuleWard = (data) => wrapHttp(`/outwardRuleWard/copyOutwardRuleWard`, data)
// 个人出区标准数据
export const outwardRulePerson_findWithPage = (data) => wrapHttp(`/outwardRulePerson/findWithPage`, data)
// 批量处理个人数据
export const outwardRulePerson_insert = (data) => wrapHttp(`/outwardRulePerson/insert`, data)

// 医嘱分类-删除
export const orderTypeContainerConfig_deleteById = (data) => wrapHttp(`/orderTypeContainerConfig/deleteById`, data)
// 医嘱分类-修改
export const orderTypeContainerConfig_edit = (data) => wrapHttp(`/orderTypeContainerConfig/edit`, data)
// 医嘱分类-查询
export const orderTypeContainerConfig_findWithPage = (data) => wrapHttp(`/orderTypeContainerConfig/findWithPage`, data)
// 医嘱分类-新增
export const orderTypeContainerConfig_insert = (data) => wrapHttp(`/orderTypeContainerConfig/insert`, data)
// 运维管理
// 运维管理 - 接口日志查询
export const outerLog_findPage = (data) => wrapHttp(`/outerLog/findPage`, data)
// 运维管理 - 系统异常日志查询
export const logsystem_findPage = (data) => wrapHttp(`/logsystem/findPage`, data)
// 运维管理 - 医嘱查询
export const outerLog_orderQuery = (data) => wrapHttp(`/outerLog/orderQuery`, data)

// 集中录入接口
export const jzlrModule_column_disable = (data) => wrapHttp(`/jzlrModule/column/disable`, data) // 展示列禁用
export const jzlrModule_column_enable = (data) => wrapHttp(`/jzlrModule/column/enable`, data) // 展示列启用
export const jzlrModule_copy = (data) => wrapHttp(`/jzlrModule/copy`, data) // 复制配置
export const jzlrModule_disable = (data) => wrapHttp(`/jzlrModule/disable`, data) // 模块禁用
export const jzlrModule_enable = (data) => wrapHttp(`/jzlrModule/enable`, data) // 模块启用
export const jzlrModule_column_edit = (data) => wrapHttp(`/jzlrModule/column/edit`, data) // 修改列名
export const jzlrModule_list = (data) => wrapHttp(`/jzlrModule/list`, data) // 修改列名

// 基础配置-字典转换对照-查询
export const outerDictConvert_findWithPage = (data) => wrapHttp(`/outerDictConvert/findWithPage`, data)
// 基础配置-字典转换对照-增
export const outerDictConvert_insert = (data) => wrapHttp(`/outerDictConvert/insert`, data)
// 基础配置-字典转换对照-删
export const outerDictConvert_deleteById = (data) => wrapHttp(`/outerDictConvert/deleteById`, data)
// 基础配置-字典转换对照-改
export const outerDictConvert_edit = (data) => wrapHttp(`/outerDictConvert/edit`, data)
// 基础配置-字典转换对照-查询详情
export const outerDictConvert_getById = (data) => wrapHttp(`/outerDictConvert/getById`, data)

// 流速换算
export const flowrateConvert_deleteById = (data) => wrapHttp(`/flowrateConvert/deleteById`, data)
export const flowrateConvert_edit = (data) => wrapHttp(`/flowrateConvert/edit`, data)
export const flowrateConvert_findWithPage = (data) => wrapHttp(`/flowrateConvert/findWithPage`, data)
export const flowrateConvert_getById = (data) => wrapHttp(`/flowrateConvert/getById`, data)
export const flowrateConvert_insert = (data) => wrapHttp(`/flowrateConvert/insert`, data)

// 产品授权
export const grant_getApplyCode = (data) => wrapHttp(`/grant/getApplyCode`, data)
export const grant_confirm = (data) => wrapHttp(`/grant/confirm`, data)

// 基础配置-数据采集对照-查询
export const collToMoniitem_list = (data) => wrapHttp(`/config/collToMoniitem/list`, data)
// 基础配置-数据采集对照-增
export const collToMoniitem_add = (data) => wrapHttp(`/config/collToMoniitem/add`, data)
// 基础配置-数据采集对照-改
export const collToMoniitem_update = (data) => wrapHttp(`/config/collToMoniitem/update`, data)
// 基础配置-数据采集对照-删
export const collToMoniitem_delete = (data) => wrapHttp(`/config/collToMoniitem/delete`, data)
export const collToMoniitem_manualConfigList = (data) => wrapHttp(`/config/collToMoniitem/manualConfigList`, data)
export const collToMoniitem_oneToManyRelationship = (data) => wrapHttp(`/config/collToMoniitem/oneToManyRelationship`, data)
export const collToMoniitem_updatePriority = (data) => wrapHttp(`/config/collToMoniitem/updatePriority`, data)
// 自定义引流液
export const moniitemRecord_insertMoniitemCustom = (data) => wrapHttp(`/moniitemRecord/insertMoniitemCustom`, data)

// 获取质控配置列表
export const report_findList = (data) => wrapHttp(`/qcReportQuery/findPageList`, data)
// 编辑质控配置界面
export const report_edit = (data) => wrapHttp(`/qcReportQuery/edit`, data)
// 质控页面复制功能
export const qcReportQuery_copyWardConfig = (data) => wrapHttp(`/qcReportQuery/copyWardConfig`, data)

export const aidConfig_findWithPage = (data) => wrapHttp(`/aidConfig/findWithPage`, data)
export const aidConfig_copyWardConfig = (data) => wrapHttp(`/aidConfig/copyWardConfig`, data)
export const aidConfig_edit = (data) => wrapHttp(`/aidConfig/edit`, data)
export const aidConfig_disable = (data) => wrapHttp(`/aidConfig/disable`, data)

export const schedule_queryWorkSchedules = (data) => wrapHttp(`/schedule/queryWorkSchedules`, data)

// 患者监控配置
export const patientMonitoring_insert = (data) => wrapHttp(`/patientMonitoring/insert`, data)
export const patientMonitoring_delete = (data) => wrapHttp(`/patientMonitoring/delete`, data)
export const patientMonitoring_edit = (data) => wrapHttp(`/patientMonitoring/edit`, data)
export const patientMonitoring_findWithPage = (data) => wrapHttp(`/patientMonitoring/findWithPage`, data)
export const patientMonitoring_copyWardConfig = (data) => wrapHttp(`/patientMonitoring/copyWardConfig`, data)

// 获取功能模块下配置的监护项列表
export const wardModuleMoniitem_getMoniitemConfig = (data) => wrapHttp(`/wardModuleMoniitem/getMoniitemConfig`, data)
// 获取数据采集数据
export const dataCollection_getCollectData = (data) => wrapHttp(`/dataCollection/getCollectData`, data)

// 膳食字典
export const nutrition_findWithPage = (data) => wrapHttp(`/nutrition/findWithPage`, data)
export const nutrition_insert = (data) => wrapHttp(`/nutrition/insert`, data)
export const nutrition_edit = (data) => wrapHttp(`/nutrition/edit`, data)
export const nutrition_enable = (data) => wrapHttp(`/nutrition/enable`, data)

// 应急因素
export const stress_findWithPage = (data) => wrapHttp(`/stress/findWithPage`, data)
export const stress_insert = (data) => wrapHttp(`/stress/insert`, data)
export const stress_edit = (data) => wrapHttp(`/stress/edit`, data)
export const stress_deleteById = (data) => wrapHttp(`/stress/deleteById`, data)
export const stress_getById = (data) => wrapHttp(`/stress/getById`, data)
export const stress_copy = (data) => wrapHttp(`/stress/copy`, data)

// 营养配置换算
export const nutritionConvert_findWithPage = (data) => wrapHttp(`/nutritionConvert/findWithPage`, data)
export const nutritionConvert_insert = (data) => wrapHttp(`/nutritionConvert/insert`, data)
export const nutritionConvert_edit = (data) => wrapHttp(`/nutritionConvert/edit`, data)
export const nutritionConvert_deleteById = (data) => wrapHttp(`/nutritionConvert/deleteById`, data)
export const nutritionConvert_getById = (data) => wrapHttp(`/nutritionConvert/getById`, data)
export const nutritionConvert_syncConvertFromDrug = (data) => wrapHttp(`/nutritionConvert/syncConvertFromDrug`, data)
export const nutritionConvert_syncAllNutritionConvert = (data) => wrapHttp(`/nutritionConvert/syncAllNutritionConvert`, data)
export const nutritionConvert_getList = (data) => wrapHttp(`/nutritionConvert/getList`, data)
export const nutritionConvert_batchSave = (data) => wrapHttp(`/nutritionConvert/batchSave`, data)
export const nutritionConvert_copy = (data) => wrapHttp(`/nutritionConvert/copy`, data)

export const moniitemRecord_findEarliestMoniItemRecordTime = (data) => wrapHttp(`/moniitemRecord/findEarliestMoniItemRecordTime`, data)

// 质控标识配置
export const qcConfig_findWithPage = (data) => wrapHttp(`/qcConfig/findWithPage`, data)
export const qcConfig_getQcConfigs = (data) => wrapHttp(`/qcConfig/getQcConfigs`, data)
export const qcConfig_edit = (data) => wrapHttp(`/qcConfig/edit`, data)

// 绩效
export const performanceConfig_findWithPage = (data) => wrapHttp(`/performanceConfig/findWithPage`, data)
export const performanceConfig_edit = (data) => wrapHttp(`/performanceConfig/edit`, data)
export const performanceConfig_insert = (data) => wrapHttp(`/performanceConfig/insert`, data)
export const performanceConfig_copy = (data) => wrapHttp(`/performanceConfig/copyWardConfig`, data)

export const docDataParams_getParamsList = (data) => wrapHttp(`/docDataParams/getParamsList`, data)
export const docDataParams_update = (data) => wrapHttp(`/docDataParams/update`, data)
export const docDataParams_updateList = (data) => wrapHttp(`/docDataParams/updateList`, data)
export const docDataParams_getParamsModuleList = (data) => wrapHttp('/docDataParams/getParamsModuleList/' + data, {}, 'get')

export const nurseRecord_selectByParam = (data) => wrapHttp(`/nurseRecord/selectByParam`, data)

export const deviceStatus_useringPageList = (data) => wrapHttp(`/deviceStatus/useringPageList`, data)
export const deviceStatus_troubleshooting = (data) => wrapHttp('/deviceStatus/troubleshooting/' + data, {}, 'get')
// 标准工时
export const classDurationConfig_insert = (data) => wrapHttp(`/classDurationConfig/insert`, data)
export const classDurationConfig_edit = (data) => wrapHttp(`/classDurationConfig/edit`, data)
export const classDurationConfig_deleteById = (data) => wrapHttp(`/classDurationConfig/deleteById`, data)
export const classDurationConfig_findWithPage = (data) => wrapHttp(`/classDurationConfig/findWithPage`, data)

// 流速单位换算配置
export const rateUnitConverter_findWithPage = (data) => wrapHttp(`/rateUnitConverter/findWithPage`, data)
export const rateUnitConverter_insert = (data) => wrapHttp(`/rateUnitConverter/insert`, data)
export const rateUnitConverter_edit = (data) => wrapHttp(`/rateUnitConverter/edit`, data)

// 剂量单位换算配置
export const doseUnitConverter_findWithPage = (data) => wrapHttp(`/doseUnitConverter/findWithPage`, data)
export const doseUnitConverter_insert = (data) => wrapHttp(`/doseUnitConverter/insert`, data)
export const doseUnitConverter_edit = (data) => wrapHttp(`/doseUnitConverter/edit`, data)

// 药品流速配置
export const drugFlowrate_findWithPage = (data) => wrapHttp(`/drugFlowrate/findWithPage`, data)
export const drugFlowrate_edit = (data) => wrapHttp(`/drugFlowrate/edit`, data)
export const drugFlowrate_insert = (data) => wrapHttp(`/drugFlowrate/insert`, data)
export const drugFlowrate_deleteById = (data) => wrapHttp(`/drugFlowrate/deleteById`, data)
export const drugFlowrate_selectList = (data) => wrapHttp(`/drugFlowrate/selectList`, data)

// 护理计划模板配置
export const nurseDiag_copyTo = (data) => wrapHttp(`/nurseDiag/copyTo`, data)
export const nurseDiag_findWithPage = (data) => wrapHttp(`/nurseDiag/findWithPage`, data)
export const nurseDiag_edit = (data) => wrapHttp(`/nurseDiag/edit`, data)
export const nurseDiag_insert = (data) => wrapHttp(`/nurseDiag/insert`, data)
export const nurseDiag_deleteById = (data) => wrapHttp(`/nurseDiag/deleteById`, data)

// 护理诊断详情配置表
export const nurseDiagDetail_getByNurseDiagId = (data) => wrapHttp(`/nurseDiagDetail/getByNurseDiagId`, data)
export const nurseDiagDetail_findWithPage = (data) => wrapHttp(`/nurseDiagDetail/findWithPage`, data)
export const nurseDiagDetail_insert = (data) => wrapHttp(`/nurseDiagDetail/insert`, data)
export const nurseDiagDetail_edit = (data) => wrapHttp(`/nurseDiagDetail/edit`, data)
export const nurseDiagDetail_deleteById = (data) => wrapHttp(`/nurseDiagDetail/deleteById`, data)
export const exceptionLevel_insert = (data) => wrapHttp(`/exceptionLevel/insert`, data)
export const exceptionLevel_edit = (data) => wrapHttp(`/exceptionLevel/edit`, data)
export const exceptionLevel_findAllLevels = (data) => wrapHttp(`/exceptionLevel/findAllLevels`, data)

// 自动触发场景配置
export const triggerScene_findWithPage = (data) => wrapHttp(`/triggerScene/findWithPage`, data)
export const triggerScene_insert = (data) => wrapHttp(`/triggerScene/insert`, data)
export const triggerScene_edit = (data) => wrapHttp(`/triggerScene/edit`, data)
export const triggerScene_deleteById = (data) => wrapHttp(`/triggerScene/deleteById`, data)

// 自动触发业务场景配置规则
export const triggerSceneRule_findWithPage = (data) => wrapHttp(`/triggerSceneRule/findWithPage`, data)
export const triggerSceneRule_insert = (data) => wrapHttp(`/triggerSceneRule/insert`, data)
export const triggerSceneRule_edit = (data) => wrapHttp(`/triggerSceneRule/edit`, data)
export const triggerSceneRule_deleteById = (data) => wrapHttp(`/triggerSceneRule/deleteById`, data)
