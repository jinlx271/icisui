/*
重症记录单配置接口
*/
import request from '@/utils/request'
import qs from 'qs'

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

// 获取pdf
export const loadFile = function (url) {
  return request({
    url: url,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'get'
  })
}
/**
 * 请求一个接口 返回的数据是axios原始数据
 * @param {*} url
 * @param {*} data
 * @returns
 */
export const axiosPost = function (url, data) {
  return request({
    isHideMessage: true,
    url: url,
    method: 'post',
    data: data
  })
}

// 托盘服务 http://localhost:10808/api/ACIS/ShowInvestigate
export const ShowInvestigate = function (data) {
  const { patid } = data
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/ACIS/ShowInvestigate',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: `brlb=1&patid=${patid}`
  })
}

// CA检查 是否有10808托盘服务
export const CACheck = (flag = false) => {
  let baseURL = 'http://localhost:10808/api/CA/Check'
  if (flag) {
    baseURL += '?flag=1'
  }
  return request({
    isHideMessage: true,
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'get'
  })
}
// 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
export const CAKeyVerify = () => {
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/CA/Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: qs.stringify({
      Type: 'KeyVerify',
      Data: '',
      Mkdm: 78
    })
  })
}
// CA获取工号
export const CAGetYsgh = () => {
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/CA/Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: qs.stringify({
      Type: 'GetYsgh',
      Data: '',
      Mkdm: 78
    })
  })
}

// CA密码登陆
export const CALoginVerify = (pwd) => {
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/CA/Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: qs.stringify({
      Type: 'CALoginVerify',
      Data: window.btoa(pwd),
      Mkdm: 78
    })
  })
}

// CA获取签名图片
export const CAGetYsImg = (userName) => {
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/CA/Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: qs.stringify({
      Type: 'GetYsImg',
      Data: userName || '',
      Mkdm: 78
    })
  })
}

// CA签名写入ca
export const RunCASignEx = (params) => {
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/CA/Post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data: qs.stringify({
      Type: 'RunCASignEx',
      Data: JSON.stringify(params)
    })
  })
}

/**
 * 患者签名托盘服务
 * 调用接口推送pdf文件至签字板
 * @param {*} data
 * {
 *    "hzxm":"患者姓名",
 *    "zjlx":"证件类型：1身份证2护照3户口本，默认传1",
 *    "zjhm":"证件号码：zjlx传1 对应身份证号",
 *    "ywxx":"原文信息：base64格式的pdf内容",
 *    "memo":"<MemoXml><DepartmentCode>科室ID</DepartmentCode><DocumentName>模板名称</DocumentName><Keyword>患者签名</Keyword></MemoXml>",
 *    "czyh":"操作员ID",
 *    "czymc":"操作员名称",
 *  }
 *
 */
export const patientSign_pushPdf = function (data) {
  const { hzxm, zjlx, zjhm, ywxx, deptCode, tempName, czyh, czymc } = data
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/XinShoushu/AnySignData',
    headers: {
      'Content-Type': 'application/json'
    },
    async: true,
    method: 'post',
    data: qs.stringify({
      hzxm,
      zjlx,
      zjhm,
      ywxx,
      memo: `<MemoXml><DepartmentCode>${deptCode}</DepartmentCode><DocumentName>${tempName}</DocumentName><Keyword>患者签名</Keyword></MemoXml>`,
      czyh,
      czymc
    })
  })
}
/**
 * 获取签名图片
 * @param {*} data
 * { "qmxh": qmxh, "nInfolx": 1 }
 */
export const patientSign_getSignImage = function (data) {
  const { qmxh } = data
  return request({
    isHideMessage: true,
    baseURL: 'http://localhost:10808/api/XinShoushu/AnySignGetInfo',
    headers: {
      'Content-Type': 'application/json'
    },
    async: false,
    method: 'post',
    data: qs.stringify({
      qmxh,
      nInfolx: 1
    })
  })
}
// 广东CA 获取二维码
export const signservice_getQRCode = (data) => wrapHttp(`/signservice/getQRCode`, data)
// 广东CA 轮询的接口
export const signservice_verifyCallBack = (data) => wrapHttp(`/signservice/verifyCallBack`, data)
export const signservice_msg_pull = (data) => wrapHttp(`/signservice/msg/pull`, data)
// 广东CA 签名图片拿取
export const signservice_getStampBase64 = (data) => wrapHttp(`/signservice/getStampBase64`, data)
export const CAGetUserInfo = (data) => wrapHttp(`/ca/getUserInfo`, data)
