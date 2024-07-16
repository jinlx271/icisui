import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { setRoute } from '@/utils/utils'
import { getCookie, removeCookie } from '@/utils/cookie'
import { debounce } from 'lodash'
import my from 'mmcp-jsapi'
const WINMYPlat = /mmcp/.test(window.navigator.userAgent.toLowerCase())
const cancelToken = {} // 数组用于储存每个请求的取消函数和请求标识
const accountInfo = JSON.parse(localStorage.getItem('accountInfo'))
// console.log('accountInfo ==', accountInfo)
// console.log('accountInfo == ' + localStorage.getItem('accountInfo'))
const appKey = 'ICIS'
let groupOrgId = '993716'
let orgId = '111'
const CancelToken = axios.CancelToken
const debounceMessage = debounce(function (msg) {
   Message({
            message: msg,
            type: 'warning',
            duration: 5 * 1000,
            showClose: true
          })
}, 500, { leading: true, trailing: false })
const service = axios.create({
  baseURL: ((process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API)),
  timeout: 300000 // 请求超时时间
})
// 创建axios实例
if (WINMYPlat) {
  my.biz.getRegionOrg().then((hospitalArea) => {
    groupOrgId = hospitalArea.groupOrgId
    orgId = hospitalArea.orgId
  })
  my.http.init(service, {
    group: true, // 开启集团化支持
    bizNo: 'ICIS' // 集团化支持时使用的业务系统代号 不开启集团化支持则不用传 appKey
  })
  my.http.init({
      group: true, // 开启集团化支持
      bizNo: 'ICIS' // 集团化支持时使用的业务系统代号 不开启集团化支持则不用传 appKey
  })
}
let configUrl = ''
// 多次请求保留最后一个名单
const forbidRepeatList = [
  '/archiveManager/patientArchiveList',
  '/sys/getUserListByExample',
  '/order/orderExecute/edit',
  '/order/orderExecute/delete',
  '/order/orderExecute/deleteSpecialDrug',
  '/order/orderExecute/editSpecialDrug',
  '/order/orderExecute/cancel',
  '/order/orderExecute/executeBegin',
  '/order/orderExecute/finish',
  '/order/orderExecute/formFinish',
  '/order/orderExecute/formCancelFinish',
  '/order/orderExecute/executeFinish',
  '/order/orderExecute/sign',
  '/order/orderExecute/executeAgain',
  '/order/orderExecute/formSign',
  '/order/editRealInput',
  '/order/orderExecute/batchExecuteBegin',
  '/order/orderExecute/batchExecuteFinish',
  '/order/orderExecute/addOrderPlan',
  '/order/orderExecute/deleteOrderPlan',
  '/order/orderExecute/deleteFrom',
  '/order/editOrder',
  '/order/cancelExtractOrder',
  '/order/orderExecute/patientOutSuspend',
  '/order/orderExecute/continueExecute',
  '/order/orderExecute/addBloodOrderPlan',
  '/orderPlanBlood/edit',
  '/order/stopOrder',
  '/order/addOrder',
  '/order/deleteOrder',
  '/order/rebackOrder',
  '/liquidRecord/liquidRecordStatistics'
]
// 取消被多次发起的请求，保留最后一个
export function cancelAjax (type, config = {}) {
  const key = config.url
  if (type === 'check') {
      if (!cancelToken[key]) {
          config.cancelToken = new CancelToken((c) => {
              cancelToken[key] = c
          })
      } else {
          cancelToken[key]()
          config.cancelToken = new CancelToken((c) => {
              cancelToken[key] = c
          })
      }
  } else if (type === 'remove') {
    delete cancelToken[key]
  } else if (type === 'clearAll') {
    for (const key in cancelToken) {
      if (Object.hasOwnProperty.call(cancelToken, key)) {
        cancelToken[key]()
        delete cancelToken[key]
      }
    }
  }
}
// request拦截器
service.interceptors.request.use(config => {
    const tokenInfo = getCookie('token')

    if (WINMYPlat) {
      groupOrgId = accountInfo.employee.groupOrgId
      orgId = accountInfo.employee.regionOrgId
      config.url = appKey + '/' + groupOrgId + '/' + orgId + config.url
    }
    // console.log('config.url', config.url)
    configUrl = config.url
    if (tokenInfo) {
        config.headers['X-Token'] = tokenInfo.tocken // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
    if (config.method === 'post' && config.params) {
        config.data = config.params
        delete config.params
    }
    if (config.method === 'get') {
        config.params = config.data
        delete config.data
    }
    if (forbidRepeatList.includes(config.url)) {
        cancelAjax('check', config)
    }
    return config
}, error => {
    // Do something with request error
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        if (forbidRepeatList.includes(response?.config?.url)) {
          cancelAjax('remove', response.config)
        }
        if (location.hash.indexOf('/patient/') > -1 && configUrl !== '/concern/queryConcernMatterCounts') {
          store.commit('SET_PATIENTROUTE', new Date().getTime())
        }
        const res = response.data || response
        const msg = res?.msg || res.Message
        res.message = msg
        res.resultMessage = res?.message
        if (WINMYPlat) {
          if (response.code == 0) {
            return response
          } else if (response.code == '403') {
            // Message({
            //   message: msg,
            //   type: 'warning',
            //   duration: 5 * 1000,
            //   showClose: true
            // })
            debounceMessage('登录超时，请重新登录')
            if (store.getters.ssoIndexUrl) {
              location.href = store.getters.ssoIndexUrl
            } else {
              removeCookie('token')
              cancelAjax('clearAll')
              setRoute('login') // 跳登录
            }
          } else if (response.code == '203') { // 已归档提示
            Message({
              message: msg,
              type: 'error',
              duration: 5 * 1000,
              showClose: true
            })
            return response
          } else if (response.code == '101') { // 集中录入错误
            Message({
              message: msg,
              type: 'error',
              duration: 5 * 1000,
              showClose: true
            })
            return response
          } else {
            if (!response.config.isHideMessage) { // 不弹出消息弹出框
              Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000,
                showClose: true
              })
            }
            return Promise.reject(res)
          }
        } else {
          if (res.Status === true || res.Status === false || res.success === true || res.resultCode === '1' || res.resultCode === '40000004' || res.code == '0' || res.code == '501' || res.code == '200' || response.config.responseType == 'blob' && response.status == '200') {
              return res
          } else if (res.code == '403') {
            // Message({
            //   message: msg,
            //   type: 'warning',
            //   duration: 5 * 1000,
            //   showClose: true
            // })
            debounceMessage('登录超时，请重新登录')
            if (store.getters.ssoIndexUrl) {
              location.href = store.getters.ssoIndexUrl
            } else {
              removeCookie('token')
              cancelAjax('clearAll')
              setRoute('login') // 跳登录
            }
          } else if (res.code == '203') { // 已归档提示
            Message({
              message: msg,
              type: 'error',
              duration: 5 * 1000,
              showClose: true
            })
            return res
          } else if (res.code == '101') { // 集中录入错误
            Message({
              message: msg,
              type: 'error',
              duration: 5 * 1000,
              showClose: true
            })
            return res
          } else {
            if (!response.config.isHideMessage) { // 不弹出消息弹出框
              Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000,
                showClose: true
              })
            }
            return Promise.reject(res)
          }
        }
    },
    error => {
        try {
          const msg = error.response.data.msg || error.response.data.resultMessage || error.response.data.message
          // console.log('service error==' + JSON.stringify(error))
          Message({
            message: msg || '系统错误!',
            type: 'error',
            duration: 5 * 1000,
            showClose: true
          })
          return Promise.reject(error)
        } catch (e) {
          return Promise.reject(error)
        }
    }
)

export default service
