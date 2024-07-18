const getters = {
    dragMsg: state => state.app.dragMsg,
    statisticsOpt: state => state.app.statisticsOpt,
    batchSearchSysCodeObj: state => state.app.batchSearchSysCodeObj,
    userPersonalizedConfig: state => state.app.userPersonalizedConfig,
    userInfo: state => state.user.userInfo,
    currentAeraId: state => state.user.currentAeraId,
    patientInfo: state => state.patient.patientInfo,
    timestamp: state => state.patient.timestamp,
    patientList: state => state.patient.patientList,
    dictData: state => state.dictData, // 基础字典数据
    // permissions: state => state.user.permissions,
    routes: state => state.app.routes,
    hospitalName: state => state.user.hospitalName,
    sysSetting: state => state.user.sysSetting,
    permissionsMenu: state => state.user.permissionsMenu,
    mainMenu: state => state.user.mainMenu,
    permissionsDoc: state => state.user.permissionsDoc,
    permissionsBtn: state => state.user.permissionsBtn,
    indexUrl: state => state.user.indexUrl,
    ssoIndexUrl: state => state.user.ssoIndexUrl,
    workbenchCode: state => state.user.workbenchCode,

    userWardList: state => state.user.userWardList,
    currentUserWard: state => state.user.currentUserWard,
    currWardShiftInfo: state => state.user.currWardShiftInfo,
    systemInfo: state => state.user.systemInfo,

    loginSource: state => state.user.loginSource,

    msgInIcu: state => state.user.msgInIcu,
    msgOutIcu: state => state.user.msgOutIcu,

    top8ListFlag: state => state.user.top8ListFlag,

    patientRoute: state => state.user.patientRoute,
    currentUserSkin: state => state.user.currentUserSkin,
    sysSkinList: state => state.user.sysSkinList,
    msgExtract: state => state.user.msgExtract,
    msgFloat: state => state.user.msgFloat,
    isLoginCA: state => state.user.isLoginCA,
    ca1014: state => state.user.ca1014,
    paramCodeObj: state => state.app.paramCodeObj
}
export default getters
