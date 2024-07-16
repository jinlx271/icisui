/* eslint-disable */
import { Message } from 'element-ui'
import store from '@/store'
import { setRoute } from '@/utils/utils'
import { ca_getAccesstoken, ca_getRandom } from '@/api/login'
import { ca_verifyCert, ca_saveCaRecord } from '@/api/login'
import { getParams } from '@/utils/utils'
import {
  CACheck, // CA检查 是否有10808托盘服务
  CAKeyVerify, // 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
  CAGetYsgh, // CA获取工号
  RunCASignEx // 数据签名
} from '@/api/otherApi'
/**
 * 医信ca 处理逻辑
 * @_this 哪里调用哪里this
 * @name ca签名名称
 * @code 类型编码
   assess: "1"患者评估
   dermaplus: "1"皮肤管理
   docOrder: "1"医嘱管理
   fluidBalance: "1"液体平衡
   monitor: "1" 监护数据
   nurseOrder: "1"护嘱管理
   orderExecute: "1" 医嘱执行
   pipelineCare: "1"管路护理
   shiftExchange: "1"床旁交班
 * @id 不清楚
 * @callBack 目前监护数据的评估单用
 */
export function caHandle(_this, name, code, id, callBack) {
  // 医院参数里面有ca的字段  0:不启用CA签名，1：开启医信签CA签名，2：卫宁his封装北京ca
  const caNumber = store.getters?.systemInfo?.ca || 0
  // 登录页面传来的所有参数
  const userInfo = store.getters?.userInfo
  // 1014参数 需要CA验证的功能操作点
  const ca1014 = store?.getters?.ca1014 || {}

  // 开启医信签CA签名 && 是否开启此功能
  if (caNumber == 1 && ca1014[code] == 1) {
    caInit()
      .then(res => {
        const { SIGNCERTS, signCert, guid } = res
        if (SIGNCERTS.length >= 1) {
          getCertTest(_this, signCert, guid)
            .then(res => {
              if (id) {
                ca_saveCaRecord({
                  userId: userInfo?.userName,
                  userType: userInfo?.userType,
                  userName: userInfo?.name,
                  signatureImg: res.signatureImg,
                  imageUpdateTime: res.imageUpdateTime,
                  verifyType: 'Pkcs7',
                  transactionId: id || '',
                  fileName: name || ''
                })
              }
              callBack && callBack()
            })
            .catch(() => {
              callBack && callBack()
            })
        } else {
          callBack && callBack()
        }
      })
      .catch(() => {
        callBack && callBack()
      })
  } else {
    callBack && callBack()
  }
}
/**
 * 北京CA业务模块处理
 * * @code 类型编码
   assess: "1"患者评估
   dermaplus: "1"皮肤管理
   docOrder: "1"医嘱管理
   fluidBalance: "1"液体平衡
   monitor: "1" 监护数据
   nurseOrder: "1"护嘱管理
   orderExecute: "1" 医嘱执行
   pipelineCare: "1"管路护理
   shiftExchange: "1"床旁交班
 */
export function caBJHandle(code, callback) {
  return new Promise(function(resolve, reject) {
    // 是否有登录状态
    const isLoginCA = store.getters?.isLoginCA
    // 当前登录人
    const userName = store.getters?.userInfo.userName
    // 医院参数里面有ca的字段  0:不启用CA签名，1：开启医信签CA签名，2：卫宁his封装北京ca ukey 3:卫宁北京软签 1012
    const caNumber = store.getters?.systemInfo?.ca || 0
    // 1014参数 需要CA验证的功能操作点
    const ca1014 = store?.getters?.ca1014 || {}
    // admin 不进去判断
    if (userName == 'admin') {
      resolve(false)
      return false
    }
    // 是否北京ca开启 是否开启对应模块权限
    if (!((caNumber == '2' || caNumber == '3')  && ca1014[code] == 1)) {
      resolve(false)
      return false
    }
    // 检测登录是否有，没有就跳出去
    if (!isLoginCA) {
      Message.error('没有登录状态！')
      setRoute('login')
      resolve(true)
      return true
    }
    // 检测ca托盘
    CACheck().then(rq1 => {
      if (!rq1.Status) {
        Message.error(rq1.Message || 'CA客户端没有正常运行')
        resolve(true)
        return true
      }
      if (caNumber == '2') {
        // 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
        CAKeyVerify().then(rq2 => {
          if (!rq2.Status) {
            Message.error(rq2.Message || '未检测key插入')
            resolve(true)
            return true
          }
          // CA获取工号
          CAGetYsgh().then(rq3 => {
            if (!rq3.Status) {
              Message.error(rq3.Message || 'CA工号获取失败')
              resolve(true)
              return true
            }
            if (rq3?.Data.indexOf(userName) != -1) {
              resolve(false)
              return false
            } else {
              Message.error('CA工号和登录人工号不匹配')
              resolve(true)
              return true
            }
          }).catch(() => {
            Message.error('CA客户端没有正常运行')
            resolve(true)
            return true
          })
        }).catch(() => {
          Message.error('CA客户端没有正常运行')
          resolve(true)
          return true
        })
      } else if(caNumber == '3') {
        // CA获取工号
        CAGetYsgh().then(rq3 => {
          if (!rq3.Status) {
            Message.error(rq3.Message || 'CA工号获取失败')
            resolve(true)
            return true
          }
          if (rq3?.Data.indexOf(userName) != -1) {
            resolve(false)
            return false
          } else {
            Message.error('CA工号和登录人工号不匹配')
            resolve(true)
            return true
          }
        }).catch(() => {
          Message.error('CA客户端没有正常运行')
          resolve(true)
          return true
        })
      }
    }).catch(() => {
      Message.error('CA客户端没有正常运行')
      resolve(true)
      return true
    })
  })
}
/**
 * 数据签名
 */
export async function isRunCASignEx(type,code,data) {
  // 医院参数里面有ca的字段  0:不启用CA签名，1：开启医信签CA签名，2：卫宁his封装北京ca 1012
  const caNumber = store.getters?.systemInfo?.ca || 0
  // 系统参数处理
  const paramInfo = await getParams({ paramGroupCode: 'XTCS', paramCode: 'XTCS0098' })
  // 1.医嘱执行的新增，2.医嘱执行的审核，3.评估单的新增，4.评估单的审核，5.护理记录的新增，6.护理记录的审核
  const XTCS0098 = paramInfo[0]?.paramValue
  // 是否北京ca开启 是否开启对应模块权限
  if(!(caNumber == '2' && XTCS0098.indexOf(type) !== -1)){
    return false
  }
  let obj = {
    Data: [],
    Mkdm: '78', // 模块代码 必传
    mkmc: '急危重症', // 模块名称
    ysdm:store.getters.userInfo.userName , // 医生代码 必传
    No: store.getters.userInfo.userName, // 工号
    UserName: store.getters.userInfo.name, // 登录人姓名
    // signdata:'' // 必传托盘处理
  }
  // 患者信息
  obj.Data.push({
    hzxx: {
      icuRecordId : store.state.patient.patientInfo.icuRecordId, // 病人id
      wardCode: store.state.patient.patientInfo.wardCode, // 病区编码
      wardName: store.state.patient.patientInfo.wardName, // 病区名称
      patientId: store.state.patient.patientInfo.patientEntity.patientId, // 患者id
      patientName: store.state.patient.patientInfo.patientEntity.patientName // 患者姓名
    }
  })

  switch(code){
    case 'yzzx':
      // 医嘱执行
      obj.Data.push({
        yzzx: []
      })
      data.map( i => {
        obj.Data[1].yzzx.push({
          createTime: i.createTime, // 时间
          orderContent: i.orderContent, // 医嘱名称
          type: type // 1.医嘱执行的新增，2.医嘱执行的审核，3.评估单的新增，4.评估单的审核，5.护理记录的新增，6.护理记录的审核
        })
      })
    break
    case 'pgd':
      // 评估单
      // data = {
      //   id:this.centerData.id, // 表id
      //   formCode:this.centerData.formCode, // 表编码
      //   formName:this.centerData.formName, // 表名称
      //   scoreTime:queryData.scoreTime // 评估时间
      // }
      obj.Data.push({
        pgd: [data]
      })
    break
    case 'hljl':
      // 护理记录
      // data = {
      //   nurseRecordContent: query.nurseRecordContent, // 内容
      //   nurseRecordTime: query.nurseRecordTime, // 时间
      // }
      obj.Data.push({
        hljl: [data]
      })
    break
  }
  obj.Data = JSON.stringify(obj.Data)
  RunCASignEx(obj).then(res=>{
    //手麻没处理回调.我们也先不处理
  })
}
export function caInit(p = {}) {
  return new Promise(function(resolve, reject) {
    try {
      const { clearGuid } = p
      if (clearGuid) {
        window.localStorage.removeItem('guid')
        window.localStorage.removeItem('FriendlyName')
      }
      const { SIGNCERTS, UK_NUM } = initCertObj() // 初始化证书
      let signCert
      // 获取缓存的guid
      const guid = getGuid()
      if (UK_NUM == 0 && isEmpty(guid)) {
        Message('请插入UsbKey！')
      } else if (UK_NUM >= 1) {
        signCert = SIGNCERTS[0]
      }
      resolve({ SIGNCERTS, signCert, UK_NUM, guid })
    } catch (err) {
      console.info(err)
      Message('证书初始化失败，请检查是否插入UsbKey！') // 可执行
    }
  })
}
export function getCertTest(vm, signCert, guid) {
  // 获取UsbKey证书
  return new Promise(function(resolve, reject) {
    Promise.all([ca_getAccesstoken(), ca_getRandom()])
      .then(res => {
        const accessToken = res[0].data.accessToken
        const random = res[1].data.random
        if (signCert && guid) {
          const signedData = getPKCS7String(random, undefined, signCert)
          ca_verifyCert({ signedData, accessToken })
            .then(res => {
              resolve(res.data)
            })
            .catch(res => {
              resolve(res)
            })
        } else {
          vm.$prompt('请输入用户【】的CA证书PIN', 'CA验证', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: value => {
              return !!value && value.trim() !== ''
            },
            inputErrorMessage: 'PIN不能为空',
            inputType: 'text',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            closeOnHashChange: true,
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                const inputValue = instance.inputValue
                setPin(inputValue, signCert)
                const signedData = getPKCS7String(random, inputValue, signCert)
                if (signCert.getLastError() == 87) {
                  Message('PIN错误')
                  return
                }
                ca_verifyCert({ signedData, accessToken })
                  .then(res => {
                    if (store.getters.userInfo.userName == res.data.userId) {
                      done()
                      resolve(res.data)
                    } else {
                      window.localStorage.removeItem('guid')
                      window.localStorage.removeItem('FriendlyName')
                      Message('登录用户与Ukey不匹配！')
                      done()
                      reject()
                    }
                  })
                  .catch(res => {
                    window.localStorage.removeItem('guid')
                    window.localStorage.removeItem('FriendlyName')
                    done()
                    resolve(res)
                  })
              } else {
                done()
              }
            }
          })
            .then(value => {})
            .catch(() => {
              Message('取消CA验证')
            })
        }
        if (signCert == undefined || signCert == null) {
          Message('请选择证书')
          return
        }
      })
      .catch(() => {})
  })
}
/**
 * 初始化签名证书对象
 */
function initCertObj() {
  const SIGNCERTS = []
  let signCert
  let UK_INDEX
  let UK_NUM = 0
  if (signCert == undefined || signCert == null) {
    var certs = new CerticateCollectionX()
    // 2、设置属性过滤想要的证书对象：
    certs.setCryptoInterface(1)
    // 软证书过滤标识(0禁用，1允许，默认0)
    certs.setCF_SoftEnabled(1)
    //  过滤签名证书算法('sm2','rsa')
    certs.setCF_CertAlg('sm2')
    // 获取签名证书
    certs.setCF_KeyUsage(0x20)
    // 3、加载证书集（加载证书集返回值等于0表示成功）：
    var loadResult = certs.Load()
    // 4、获取签名证书对象：
    // signCert = certs.GetAt(0);
    // console.info('签名对象：')
    // console.info(signCert.getFriendlyName());
    // console.info(signCert.getDeviceName());
    UK_NUM = certs.getSize() // 设置证书个数
    // 获取缓存的证书
    var guid = getGuid()
    var friendlyName = getFriendlyName()
    // 初始化多个证书对象
    for (var i = 0; i < UK_NUM; i++) {
      SIGNCERTS[i] = certs.GetAt(i)
      // 默认选中，已输入PIN缓存的证书
      if (SIGNCERTS[i].getSerialNumber() == friendlyName) {
        UK_INDEX = i
        SIGNCERTS[i].guid = guid
        signCert = SIGNCERTS[i]
      }
    }
  }
  return { SIGNCERTS, signCert, UK_NUM, UK_INDEX }
}

/**
 * 设置pin值
 * @param pin
 */
function setPin(pin, signCert) {
  signCert.setUserPIN(pin)
  guidIntoStorage(signCert.guid) // 缓存当前证书，防止跨页面再次输入PIN
  friendlyNameIntoStorage(signCert.getSerialNumber()) // 缓存当前证书，防止跨页面再次输入PIN
}
/**
 * PKCS7加签
 * @param str 加签明文数据
 * @returns {*}
 */
function getPKCS7String(str, PIN, signCert) {
  if (PIN == undefined || PIN == null) {
    var guid = window.localStorage.getItem('guid') // 新页面如果之前其他页面输入过pin不需要再次输入
    if (guid != undefined) {
      signCert.guid = guid
    } else {
      Message('请先输入PIN')
      return
    }
  }
  return signCert.PKCS7String(str, 0, 'OUT')
}
/**
 * 将guid写入localStorage解决新页面重新输入pin
 * @param guid
 */
function guidIntoStorage(guid) {
  // 写入localStorage
  window.localStorage.setItem('guid', guid)
}
function friendlyNameIntoStorage(fn) {
  // 写入localStorage
  window.localStorage.setItem('FriendlyName', fn)
}
/**
 * 获取guid
 */
function getGuid() {
  return window.localStorage.getItem('guid')
}
function getFriendlyName() {
  return window.localStorage.getItem('FriendlyName')
}

/* 业务方法 */
function isEmpty(str) {
  if (str != null && str.trim().length > 0) {
    return false
  }
  return true
}
