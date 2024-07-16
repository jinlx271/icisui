import request from '@/utils/request'

// 获取菜单集合
export function getMenuList(params) {
  return request({
    url: '/sys/getMenuList',
    method: 'post',
    data: params
  })
}

// 修改菜单
export function updateMenu(params) {
  return request({
    url: '/sys/updateMenu',
    method: 'post',
    data: params
  })
}
// 新增菜单
export function addMenu(params) {
  return request({
    url: '/sys/addMenu',
    method: 'post',
    data: params
  })
}
// 删除菜单
export function deleteMenu(params) {
  return request({
    url: '/sys/deleteMenu',
    method: 'post',
    data: params
  })
}

// 修改麻醉方法类型
export function updateAnaType(p) {
  return request({
    url: '/basdata/anaes_method/updateAnaType',
    method: 'post',
    data: p
  })
}
// 修改手术等级
export function updateNurseDegree(p) {
  return request({
    url: '/basdata/oper/updateNurseDegree',
    method: 'post',
    data: p
  })
}
// 获取角色列表
export function getRoleList(param) {
  return request({
    url: '/sys/getRoleList',
    method: 'post',
    data: param
  })
}

// 保存角色
export function saveRole(param) {
  return request({
    url: '/sys/saveRole',
    method: 'post',
    data: param
  })
}
export function updateRole(param) {
  return request({
    url: '/sys/updateRole',
    method: 'post',
    data: param
  })
}

// 删除角色
export function deleteRole(param) {
  return request({
    url: '/sys/deleteRole',
    method: 'post',
    data: param
  })
}

// 获取角色菜单
export function getMenuByRole(param) {
  return request({
    url: '/sys/getMenuByRole',
    method: 'post',
    data: param
  })
}

// 保存角色菜单
export function saveRoleMenu(param) {
  return request({
    url: '/sys/saveRoleMenu',
    method: 'post',
    data: param
  })
}

// 获取树形菜单
export function getTreeMenuList(params) {
  return request({
    url: '/sys/getTreeMenuList',
    method: 'get',
    params: params
  })
}

// 获取用户列表
export function getUserList(param) {
  return request({
    url: '/sys/getUserListByExample',
    method: 'post',
    data: param
  })
}

// 用户启用禁用
export function enableUser(param) {
  return request({
    url: '/sys/enableUser',
    method: 'post',
    data: param
  })
}

// 批量启用禁用用户
export function batchUpdateUserEnableStatus(param) {
  return request({
    url: '/sys/batchUpdateUserEnableStatus',
    method: 'post',
    data: param
  })
}

// 批量重置密码
export function batchResetUserPassword(param) {
  return request({
    url: '/sys/batchResetUserPassword',
    method: 'post',
    data: param
  })
}

// 重置密码
export function resetPassword(param) {
  return request({
    url: '/sys/resetPassword',
    method: 'post',
    data: param
  })
}

// 批量删除用户
export function batchDeleteUser(param) {
  return request({
    url: '/sys/batchDeleteUser',
    method: 'post',
    data: param
  })
}

// 删除用户
export function deleteUser(param) {
  return request({
    url: '/sys/deleteUser',
    method: 'post',
    data: param
  })
}

// 重置密码
export function resetUserPassword(param) {
  return request({
    url: '/sys/resetUserPassword',
    method: 'post',
    data: param
  })
}

// 新增保存用户
export function addUser(param) {
  return request({
    url: '/sys/addUser',
    method: 'post',
    data: param
  })
}

// 获取手术集合
export function getSurgeryList(param) {
  return request({
    url: '/basdata/oper/query/by_keyword',
    method: 'post',
    data: param
  })
}

// 修改手术状态
export function enableSurgery(param) {
  return request({
    url: '/basdata/oper/enable',
    method: 'post',
    data: param
  })
}

// 获取麻醉方法集合
export function getAnaesMethodList(param) {
  return request({
    url: '/basdata/anaes_method/query/by_keyword',
    method: 'post',
    data: param
  })
}

// 修改麻醉方法状态
export function enableAnaesMethod(param) {
  return request({
    url: '/basdata/anaes_method/enable',
    method: 'post',
    data: param
  })
}

// 获取诊断集合
export function getDiagnoseList(param) {
  return request({
    url: '/basdata/diagnose/query/by_keyword',
    method: 'post',
    data: param
  })
}

// 修改诊断状态
export function enableDiagnose(param) {
  return request({
    url: '/basdata/diagnose/enable',
    method: 'post',
    data: param
  })
}

// 获取手术室集合
export function getOperatingRoomList(param) {
  return request({
    url: '/basdata/getOperatingRoomList',
    method: 'post',
    data: param
  })
}

// 删除手术室
export function deleteOperatingRoom(param) {
  return request({
    url: '/basdata/deleteOperatingRoom',
    method: 'post',
    data: param
  })
}

// 修改手术室
export function updateOperatingRoom(param) {
  return request({
    url: '/basdata/updateOperatingRoom',
    method: 'post',
    data: param
  })
}

// 添加手术室
export function addOperatingRoom(param) {
  return request({
    url: '/basdata/addOperatingRoom',
    method: 'post',
    data: param
  })
}

// 获取手术间集合
export function getOperRoomList(param) {
  return request({
    url: '/basdata/getOperRoomList',
    method: 'post',
    data: param
  })
}

// 删除手术间
export function deleteOperRoom(param) {
  return request({
    url: '/basdata/deleteOperRoom',
    method: 'post',
    data: param
  })
}

// 修改手术间
export function updateOperRoom(param) {
  return request({
    url: '/basdata/updateOperRoom',
    method: 'post',
    data: param
  })
}

// 添加手术间
export function addOperRoom(param) {
  return request({
    url: '/basdata/addOperRoom',
    method: 'post',
    data: param
  })
}

// 获取文书集合
export function getDocumentList(param) {
  return request({
    url: '/basdata/document/query/by_keyword',
    method: 'post',
    data: param
  })
}
// 获取都昌文书集合
export function queryDocumentModule(param) {
  return request({
    url: '/basdata/document/queryDocumentModule',
    method: 'post',
    data: param
  })
}
// 新增文书
export function addDocument(param) {
  return request({
    url: '/basdata/document/add',
    method: 'post',
    data: param
  })
}
// 修改文书
export function updateDoucument(param) {
  return request({
    url: '/basdata/document/update',
    method: 'post',
    data: param
  })
}

// 获取病区
export function getRegionList(param) {
  return request({
    url: '/basdata/region/query',
    method: 'post',
    data: param
  })
}

// 修改病区状态
export function enableRegion(param) {
  return request({
    url: '/basdata/region/enable',
    method: 'post',
    data: param
  })
}

// 获取科室集合
export function getDeptList(param) {
  return request({
    url: '/basdata/dept/query',
    method: 'post',
    data: param
  })
}

// 修改科室状态
export function enableDept(param) {
  return request({
    url: '/basdata/dept/enable',
    method: 'post',
    data: param
  })
}

// 获取器材集合
export function getInstrumentList(param) {
  return request({
    url: '/basdata/instrument/query',
    method: 'post',
    data: param
  })
}

// 修改器材状态
export function enableInstrument(param) {
  return request({
    url: '/basdata/instrument/enable',
    method: 'post',
    data: param
  })
}

// 获取收费项目集合
export function getChargeItemList(param) {
  return request({
    url: '/basdata/chargeItem/query',
    method: 'post',
    data: param
  })
}

// 修改收费项目状态
export function enableChargeItem(param) {
  return request({
    url: '/basdata/chargeItem/enable',
    method: 'post',
    data: param
  })
}

// 获取手术医生集合
export function getOperationPeopleList(param) {
  return new Promise(function(reslove) {
    request({
      url: '/basdata/operationPeople/query',
      method: 'post',
      data: param
    }).then((rs) => {
      rs.resultList = rs.data.result.map((v) => { // 加工号
        v.name = v.name + '(' + v.operatorId + ')'
        return v
      })
      reslove(rs)
    })
  })
}

// 修改手术医生状态
export function enableOperationPeople(param) {
  return request({
    url: '/basdata/operationPeople/enable',
    method: 'post',
    data: param
  })
}

// 获取出入量定义集合
export function getIoDefinitionList(param) {
  return request({
    url: '/basdata/ioDefinition/query',
    method: 'post',
    data: param
  })
}

// 修改出入量状态
export function enableIoDefinition(param) {
  return request({
    url: '/basdata/ioDefinition/updateEnableStatus',
    method: 'post',
    data: param
  })
}

// 新增出入量
export function addIoDefinition(param) {
  return request({
    url: '/basdata/ioDefinition/add',
    method: 'post',
    data: param
  })
}
// 修改出入量
export function updateIoDefinition(param) {
  return request({
    url: '/basdata/ioDefinition/update',
    method: 'post',
    data: param
  })
}
// 增加出入量
export function updateIoDefination(param) {
  return request({
    url: 'basedata/updateIoDefination',
    method: 'post',
    data: param
  })
}

// 获取术中事件集合
export function getIoAnaesEventList(param) {
  return request({
    url: '/basdata/anaesEvent/query',
    method: 'post',
    data: param
  })
}

// 修改术中事件状态
export function enableAnaesEvent(param) {
  return request({
    url: '/basdata/anaesEvent/updateEnableStatus',
    method: 'post',
    data: param
  })
}

// 新增术中事件
export function addAnaesEvent(param) {
  return request({
    url: '/basdata/anaesEvent/add',
    method: 'post',
    data: param
  })
}

// 修改术中事件
export function updateAnaesEvent(param) {
  return request({
    url: '/basdata/anaesEvent/update',
    method: 'post',
    data: param
  })
}
// 其他事件所有
export function getOtherEventList(param) {
  return request({
    url: '/basedata/otherEvent/query',
    method: 'post',
    data: param
  })
}

// 其他事件修改和新增
export function saveOrUpdate(param) {
  return request({
    url: '/basedata/otherEvent/saveOrUpdate',
    method: 'post',
    data: param
  })
}
// 其他事件删除
export function deleteOtherEvent(param) {
  return request({
    url: '/basedata/otherEvent/delete',
    method: 'post',
    data: param
  })
}

// 获取用药途径集合
export function getMedicalTakeWayList(param) {
  return request({
    url: '/basdata/medicalTakeWay/query',
    method: 'post',
    data: param
  })
}

// 新增用药途径
export function addMedicalTakeWay(param) {
  return request({
    url: '/basdata/medicalTakeWay/add',
    method: 'post',
    data: param
  })
}

// 修改用药途径
export function updateMedicalTakeWay(param) {
  return request({
    url: '/basdata/medicalTakeWay/update',
    method: 'post',
    data: param
  })
}

// 删除用药途径
export function delMedicalTakeWay(param) {
  return request({
    url: '/basdata/medicalTakeWay/delete',
    method: 'post',
    data: param
  })
}

// 修改用药途径状态
export function enableMedicalTakeWay(param) {
  return request({
    url: '/basdata/medicalTakeWay/enable',
    method: 'post',
    data: param
  })
}

// 获取给药原因集合
export function getMedicalTakeReasonList(param) {
  return request({
    url: '/basdata/medicalTakeReason/query',
    method: 'post',
    data: param
  })
}

// 新增给药原因
export function addMedicalTakeReason(param) {
  return request({
    url: '/basdata/medicalTakeReason/add',
    method: 'post',
    data: param
  })
}

// 删除给药原因
export function delMedicalTakeReason(param) {
  return request({
    url: '/basdata/medicalTakeReason/delete',
    method: 'post',
    data: param
  })
}

// 修改给药原因
export function updateMedicalTakeReason(param) {
  return request({
    url: '/basdata/medicalTakeReason/update',
    method: 'post',
    data: param
  })
}

// 获取病区床位集合
export function getRegionBedList(param) {
  return request({
    url: '/basdata/regionBed/query',
    method: 'post',
    data: param
  })
}

// 新增病区床位
export function addRegionBed(param) {
  return request({
    url: '/basdata/regionBed/add',
    method: 'post',
    data: param
  })
}

// 删除病区床位
export function delRegionBed(param) {
  return request({
    url: '/basdata/regionBed/delete',
    method: 'post',
    data: param
  })
}

// 修改病区床位
export function updateRegionBed(param) {
  return request({
    url: '/basdata/regionBed/update',
    method: 'post',
    data: param
  })
}

// 获取领药代办人
export function getAgentList(param) {
  return request({
    url: '/basdata/agent/query',
    method: 'post',
    data: param
  })
}

// 新增领药代办人
export function addAgent(param) {
  return request({
    url: '/basdata/agent/add',
    method: 'post',
    data: param
  })
}

// 修改领药代办人
export function updateAgent(param) {
  return request({
    url: '/basdata/agent/update',
    method: 'post',
    data: param
  })
}

// 获取自定义字段列表
export function getDatasourceDefinitionList(param) {
  return request({
    url: '/basedata/getDatasourceDefinitionList',
    method: 'post',
    data: param
  })
}
// 保存自定义字段列表
export function saveDatasourceDefinition(param) {
  return request({
    url: '/basedata/saveDatasourceDefinition',
    method: 'post',
    data: param
  })
}
// 删除自定义字段列表
export function deleteDatasourceByIds(param) {
  return request({
    url: '/basedata/deleteDatasourceByIds',
    method: 'post',
    data: param
  })
}

// basedata/queryInstrsuitList     {"pageNo":1,"pageSize":15,"sort":"","orderBy":"","filters":[]}  分页查询所有器械包接口
export function queryInstrsuitList(param) {
  return request({
    url: '/basedata/queryInstrsuitList',
    method: 'post',
    data: param
  })
}

// basedata/queryInstrsuitById   {"instrsuitId":"13"}   查询单个器械包详情
export function queryInstrsuitById(param) {
  return request({
    url: '/basedata/queryInstrsuitById',
    method: 'post',
    data: param
  })
}

// 修改器械包
export function updateInstrsuit(param) {
  return request({
    url: '/basedata/updateInstrsuit',
    method: 'post',
    data: param
  })
}
// 查询液体药品列表和液体类型  晶体液或者胶体液
export function queryLiquidtype(param) {
  return request({
    url: '/liquidtype/basic/query',
    method: 'post',
    data: param
  })
}

// 更新液体药品列表和液体类型  晶体液或者胶体液
export function updateLiquidtype(param) {
  return request({
    url: '/liquidtype/basic/update',
    method: 'post',
    data: param
  })
}

// 查询事件提醒配置列表数据
export function configList(param) {
  return request({
    url: '/basdata/eventReminder/configList',
    method: 'post',
    data: param
  })
}
// 新增事件提醒配置
export function addConfig(param) {
  return request({
    url: '/basdata/eventReminder/addConfig',
    method: 'post',
    data: param
  })
}
// 修改事件提醒配置
export function updateConfig(param) {
  return request({
    url: '/basdata/eventReminder/updateConfig',
    method: 'post',
    data: param
  })
}
// 删除事件提醒配置
export function deleteConfig(param) {
  return request({
    url: '/basdata/eventReminder/deleteConfig',
    method: 'post',
    data: param
  })
}
// 查询未配置的麻醉事件消息提醒列表
export function getNotConfigEvtRemind(param) {
  return request({
    url: '/basedata/getNotConfigEvtRemind',
    method: 'post',
    data: param
  })
}
