import request from '@/utils/request'
/**
 * 公用post
 * @param url 请求接口
 * @param data 入参
 */
const wrapHttp = (url, data = {}, method = 'post', otherConfig = {}) => {
  return request({
    url: url,
    method,
    data,
    ...otherConfig
  })
}

// 当前医院
export const getCurBeid = (data) => wrapHttp(`/sys/getCurBeid`, data)
// 登录
export const login = (data) => wrapHttp(`/sys/login`, data)
// 登出
export const logout = (data) => wrapHttp(`/sys/logout`, data)
// 单点登陆
export const ssoLogin = (data) => wrapHttp(`/sys/ssoLogin`, data)
// 第三方登陆认证
export const oauth2Login = (data) => wrapHttp(`/sys/oauth2Login`, data)
// 获取登录失败次数
export const getLoginFailueTimes = (data) => wrapHttp(`/sys/getLoginFailueTimes`, data)

// 查询用户病区集合
export const getUserWardList = (data) => wrapHttp(`/sys/getUserWardList`, data)
export const sys_getUserWardList = (data) => wrapHttp(`/sys/getUserWardList`, data, 'post', { isHideMessage: true })
// 修改密码
export const changePassword = (data) => wrapHttp(`/sys/changePassword`, data)
// 左侧菜单-查询菜单
export const getLeftMenuList = (data) => wrapHttp(`sys/getLeftMenuList`, data, 'get')

// 获取系统病区
export const sysConfig_getSysWardList = (data) => wrapHttp(`sysConfig/getSysWardList`, data)
// 初始化ICU病区
export const sysConfig_icuWardConfig = (data) => wrapHttp(`sysConfig/icuWardConfig`, data)
// 是否初始化ICU病区
export const sysConfig_isICUWardConfiged = (data) => wrapHttp(`sysConfig/isICUWardConfiged`, data)
// CA
export const ca_getAccesstoken = (data) => wrapHttp(`/ca/getAccesstoken`, data)
export const ca_getRandom = (data) => wrapHttp(`/ca/getRandom`, data)
// {"accessToken":""}
export const ca_verifyCert = (data) => wrapHttp(`/ca/verifyCert`, data)
// {"SignedData":"",
// "transactionId":"",
// "fileName":"",
// "accessToken":"",
// "userId":""
// }
export const ca_saveSigndataP7 = (data) => wrapHttp(`/ca/saveSigndataP7`, data)
// {"accessToken":"",
// "tsaData":""  ----这个在保存接口返回有，时间base64
// }
export const ca_verifyTsa = (data) => wrapHttp(`/ca/verifyTsa`, data)
// {
//   "userId":"",             ------必传
//   "userType":"",
//   "userName":"",
//   "signatureImg":"",     ------必传
//   "imageUpdateTime":"",
//   "verifyType":"",       ------ 固定传 "Pkcs7"
//   "transactionId":"",    ------必传  业务Id
//   "fileName":"",         ------必传
//   "data":"",
//   "signedData":"",
//   "accessToken":"",
//   "tsaData":"",
//   "signTime":"",
//   "verify":""
//   }
export const ca_saveCaRecord = (data) => wrapHttp(`/ca/saveCaRecord`, data)
export const ca_saveCaRecordList = (data) => wrapHttp(`/ca/saveCaRecordList`, data)
// /sys/oauth2Login
// {"username":"lb"}
// -----------------------------
// /ca/oauth
// {"accessToken":"774cf06fd6df467e87ac491be6f261a7_24","oauthMethod":"3"}  --oauthMethod:授权方法,3：微信,4：企业微信扫码7：钉钉
// -------------------------------
// /ca/getOauthStatus
// {"accessToken":"774cf06fd6df467e87ac491be6f261a7_24","transactionId":""}
export const sys_oauth2Login = (data) => wrapHttp(`/sys/oauth2Login`, data)
export const ca_oauth = (data) => wrapHttp(`/ca/oauth`, data)
export const ca_getOauthStatus = (data) => wrapHttp(`/ca/getOauthStatus`, data)

// 版本版权信息
export const version_getSystemInfo = (data) => wrapHttp(`/version/getSystemInfo`, data)
/**
 * 密码校验
 * @param {*} data
 * @returns
 */
export const sys_validataPassword = (data) => wrapHttp(`/sys/validataPassword`, data)
/**
 * 获取国标信息 用户国标信息
 * @param {*} data
 * @returns
 */
export const sys_getUserInfo = (data) => wrapHttp(`/sys/getUserInfo`, data)
/**
 * 获取机构
 * @param {*} data
 * @returns
 */
export const sys_getSysEnty = (data) => wrapHttp(`/sys/getSysEnty`, data)
/**
 * 编辑机构
 * @param {*} data
 * @returns
 */
export const sys_editSysEnty = (data) => wrapHttp(`/sys/editSysEnty`, data)

/**
 * 更新CA图片
 * userName 登录名
 * picPath 图片路径
 */
export const sys_updataUserPic = (data) => wrapHttp(`/sys/updataUserPic`, data)
