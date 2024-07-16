import request from '@/utils/request'
import { intersection } from 'lodash'
// 除法
export function accDiv(arg1, arg2) {
  let t1 = 0
  let t2 = 0
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  try { t1 = arg1.toString().split('.')[1].length } catch (e) {
    //
  }
  try { t2 = arg2.toString().split('.')[1].length } catch (e) {
    //
  }
  return accMul((r1 / r2), Math.pow(10, t2 - t1))
}
// 乘法
export function accMul(arg1, arg2) {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {
    //
  }
  try { m += s2.split('.')[1].length } catch (e) {
    //
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
// 加法
export function accAdd(arg1, arg2) {
  var r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
// 减法
export function Subtr(arg1, arg2) {
  var r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
/**
 *
 * @param {预警级别信息列表} levelList
 * @param {当前值} value
 * @param {类型} contentTypeDict
 */
export function getPersonWarningLevel(levelList, value, contentTypeDict) {
  let flag = true
  let color = ''
  if (contentTypeDict == '4') {
    levelList.forEach((item, dindex) => {
      // 这里value是数组
      const reArr = Array.isArray(item.referValues) ? item.referValues : JSON.parse(item.referValues || '[]')
      if (intersection(reArr, value).length > 0 && reArr.length > 0) {
        flag = false
        color = item.colorDict
      }
    })
  } else if (contentTypeDict == '3') {
    levelList.forEach((item, dindex) => {
        // 这里value是数组
        const reArr = Array.isArray(item.referValues) ? item.referValues : JSON.parse(item.referValues || '[]')
        if (reArr.length > 0 && reArr.includes(value)) {
          flag = false
          color = item.colorDict
        }
    })
  } else if (contentTypeDict == '1') {
    for (let i = 0; i < levelList.length; i++) {
      const item = levelList[i]
      if ((item.minValue || item.maxValue) && (item.minValue && value >= item.minValue) && (item.maxValue && value <= item.maxValue)) {
        flag = false
        color = item.colorDict
        break
      }
    }
  }
  return {
    flag,
    color
  }
}
export function outLimitMinMaxValue(moniitem, value) {
  if (value == '' || Object.hasOwnProperty.call(moniitem, 'visible') && moniitem.visible == false || moniitem.moniitemValueTypeDict && moniitem.moniitemValueTypeDict != 1 || (typeof moniitem.baseMinValue != 'number' && typeof moniitem.baseMaxValue != 'number')) {
    return false
  }
  const compareList = []
  if (!isNaN(+value) && !isNaN(+moniitem.baseMinValue)) {
    compareList.push({ baseMinValue: +moniitem.baseMinValue })
  }
  if (!isNaN(+value) && !isNaN(+moniitem.baseMaxValue)) {
    compareList.push({ baseMaxValue: +moniitem.baseMaxValue })
  }
  const boole = compareList.every(function (item) {
    if (Object.hasOwnProperty.call(item, 'baseMinValue')) {
      return item.baseMinValue <= +value
    } else if (Object.hasOwnProperty.call(item, 'baseMaxValue')) {
      return item.baseMaxValue >= +value
    }
  })
  return !(boole || compareList.length === 0)
}
export function uniques(arr) {
  var res = arr.filter(function ({ moniitemName, moniitemCode }, key) {
    return !this.has(key = moniitemName + moniitemCode) && this.add(key)
  }, new Set())
  arr.splice(0, arr.length, ...res)
}
/**
 * @param {*} getUserIP((ip) => {
    this.ip = ip
  })
 */
export function getUserIP(onNewIP) {
  const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  const pc = new MyPeerConnection({
    iceServers: []
  })
  const noop = () => {
  }
  const localIPs = {}
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
  const iterateIP = (ip) => {
    if (!localIPs[ip]) onNewIP(ip)
    localIPs[ip] = true
  }
  pc.createDataChannel('')
  pc.createOffer().then((sdp) => {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return
      line.match(ipRegex).forEach(iterateIP)
    })
    pc.setLocalDescription(sdp, noop, noop)
  }).catch((reason) => {
  })
  pc.onicecandidate = (ice) => {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}
/**
 * @param {*} bgColor  预警颜色
 * @param {*} moniitemValue
 * @param {*} v
 * @returns
 */
export function backgroundColorFn(bgColor, moniitemValue, v, personWarningLevel) {
  let referValues
  switch (v.contentTypeDict) {
    case '1':
      if (v.minValue === null || v.maxValue === null) {
        // break
        console.log('没有异常范围读取个人监测项目')
      } else {
        if (!(!v.minValue && !v.maxValue) && !isNaN(v.minValue) && !isNaN(v.maxValue) && moniitemValue < v.minValue || moniitemValue > v.maxValue) {
          bgColor = '#d9001b'
        }
      }

      if (personWarningLevel) {
        const levelObj = getPersonWarningLevel(personWarningLevel, moniitemValue, '1')
        if (levelObj.color != '') {
          bgColor = levelObj.color
        }
      }
      break
    case '2':
      // 文本不处理
      break
    case '3': {
      //   单选
      referValues = v.referValues?.length > 0 ? JSON.parse(v.referValues) : []
      bgColor = !v.referValues || v.referValues == '' || v.referValues == '[]' || referValues.indexOf(moniitemValue) >= 0 ? bgColor : '#d9001b'
      if (personWarningLevel) {
        const levelObj = getPersonWarningLevel(personWarningLevel, moniitemValue, '3')
        if (levelObj.color != '') {
          bgColor = levelObj.color
        }
      }
      break
    }
    case '4': {
      referValues = v.referValues?.length > 0 ? JSON.parse(v.referValues) : []
      let result
      let value = moniitemValue
      if (moniitemValue && !Array.isArray(moniitemValue) && moniitemValue?.indexOf(']') > -1) {
        value = JSON.parse(moniitemValue)
      }
      if (value) {
        result = value.every((v) => {
          return referValues.indexOf(v) >= 0
        })
        bgColor = !v.referValues || v.referValues == '' || v.referValues == '[]' || result ? bgColor : '#d9001b'
      } else {
        bgColor = '#d9001b'
      }

      if (personWarningLevel) {
        const levelObj = getPersonWarningLevel(personWarningLevel, value, '4')
       if (levelObj.color != '') {
          bgColor = levelObj.color
        }
      }

      break
    }
    default:
      break
  }
  return bgColor
}
/**
 * @param {*} bkBoolean  超出值返回true false
 * @param {*} moniitemValue
 * @param {*} v
 * @returns
 */
export function backgroundWarningFc(bkBoolean, moniitemValue, v, grid, personWarningLevel) {
  let referValues
  if (v?.lineData && v.lineData[grid?.formatTime] && v.lineData[grid?.formatTime]?.exceptionFlag) {
    return true
  }
  switch (v.contentTypeDict) {
    case '1':

      if (!(!v.minValue && !v.maxValue) && !isNaN(v.minValue) && !isNaN(v.maxValue) && moniitemValue < v.minValue || moniitemValue > v.maxValue) {
        bkBoolean = true
      }
      if (personWarningLevel) {
        const levelObj = getPersonWarningLevel(personWarningLevel, moniitemValue, '1')
        if (levelObj.color != '') {
          bkBoolean = levelObj.color != ''
        }
      }
      break
    case '2':
      // 文本不处理
      break
    case '3': {
      //   单选
      referValues = v.referValues?.length > 0 ? JSON.parse(v.referValues) : []
      bkBoolean = !v.referValues || v.referValues == '' || v.referValues == '[]' || referValues.indexOf(moniitemValue) >= 0 ? bkBoolean : true
      if (personWarningLevel) {
        const levelObj = getPersonWarningLevel(personWarningLevel, moniitemValue, '3')
        if (levelObj.color != '') {
          bkBoolean = levelObj.color != ''
        }
      }
      break
    }
    case '4': {
      referValues = v.referValues?.length > 0 ? JSON.parse(v.referValues) : []
      let result
      let value = moniitemValue
      if (moniitemValue && !Array.isArray(moniitemValue) && moniitemValue?.indexOf(']') > -1) {
        value = JSON.parse(moniitemValue)
      }
      if (Array.isArray(value)) {
        result = moniitemValue.every((v) => {
          return referValues.indexOf(v) >= 0
        })
        bkBoolean = !v.referValues || v.referValues == '' || v.referValues == '[]' || result ? bkBoolean : true

        if (personWarningLevel) {
          const levelObj = getPersonWarningLevel(personWarningLevel, value, '4')
          if (levelObj.color != '') {
          bkBoolean = levelObj.color != ''
        }
        }
      } else {
        bkBoolean = typeof moniitemValue == 'object'
      }
      break
    }
    default:
      break
  }
  return bkBoolean
}
/*
 * @description:moniitemContent转换
 * @author: yjx
 * @date: 2021-12-14 15:59:11
*/
export function transMoniitemContent(valueDictCodeOption = [], dataSourceDict, contentTypeDict, moniitemValue) {
  if (valueDictCodeOption.length === 0 || dataSourceDict != 2 || (contentTypeDict != 3 && contentTypeDict != 4)) return ''
  let text
  switch (contentTypeDict) {
    case 3: // 单选
    case '3': // 单选
      text = valueDictCodeOption.filter(v => v.dictCode == moniitemValue)[0]?.dictName
      break
    case '4': // 多选
    case 4: // 多选
      if (moniitemValue.length > 0) {
        const list = JSON.parse(moniitemValue)
        const arr = valueDictCodeOption.filter(v => list.includes(v.dictCode)).map(v => v.dictName)
        text = arr.length > 0 ? arr.join(',') : ''
      }
      break
    default:
      break
  }
  return text
}

/**
 * Created by jiachenpan on 16/11/18.
 */
export function tooltipByOperBegin(eventList, globalConfig, _this) {
  if (globalConfig.tooltipByOperBegin) {
    clearTimeout(globalConfig.tooltipByOperBegin)
  }
  const shouShuKaiShi = eventList.filter(v => v.codeName == '手术开始' || v.code == 4)
  if (shouShuKaiShi.length == 1) {
    const operTime3 = shouShuKaiShi[0].startTime + 10800000 // 三小时
    const nowTime = new Date().getTime()
    const compareTime = operTime3 - nowTime
    if (compareTime >= 2000) { // 大于两秒 还没到
      globalConfig.tooltipByOperBegin = setTimeout(() => {
        tooltipByOperBegin(eventList, globalConfig, _this)
      }, compareTime - nowTime % 1000)
    } else if (compareTime < 2000 && compareTime > -2000) { // 最后两秒
      _this.$alert('【手术已进行三小时，是否使用抗生素】', '提示', {
        confirmButtonText: '确定'
      })
    }
  }
}
// add by smart 18/08/23
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
// 模糊匹配 使用于filter-method 方法，以及 前端模糊匹配功能
export function frontFilter(val = '', list, obj = {}) {
  // 给el-select 前端过滤用 filter-method 有name 有pinyin
  if (val) {
    list = list.filter(item => {
      return (
        (item.templateName ? item.templateName.indexOf(val) >= 0 : '') || // 模板名字
        (item.templateContent ? item.templateContent.indexOf(val) >= 0 : '') || // 模板内容
        (item.medicalCalcAbbr ? item.medicalCalcAbbr.indexOf(val) >= 0 : '') || // 公式
        (item.medicalCalcDictName ? item.medicalCalcDictName.indexOf(val) >= 0 : '') || // 公式
        (item.medicalCalcDictCode ? item.medicalCalcDictCode.indexOf(val) >= 0 : '') || // 公式
        (item.formulaGroupDictName ? item.formulaGroupDictName.indexOf(val) >= 0 : '') || // 公式分组
        (item.formulaGroupDictCode ? item.formulaGroupDictCode.indexOf(val) >= 0 : '') || // 公式分组
        (item.templateRichContent ? item.templateRichContent.indexOf(val) >= 0 : '') || // 疼痛模板
        (item.templateRichContent ? item.templateRichContent.indexOf(val) >= 0 : '') || // 疼痛模板
        (item.templateContent ? item.templateContent.indexOf(val) >= 0 : '') || // 疼痛模板
        (item.cathPosiDictName ? item.cathPosiDictName.indexOf(val) >= 0 : '') || // 导管部位
        (item.cathPosiDictCode ? item.cathPosiDictCode.indexOf(val) >= 0 : '') || // 导管部位
        (item.catheterName ? item.catheterName.indexOf(val) >= 0 : '') || // 导管名字
        (item.catheterCode ? item.catheterCode.indexOf(val) >= 0 : '') || // 导管名字
        (item.moniitemName ? item.moniitemName.indexOf(val) >= 0 : '') || // 监测项名字
        (item.moniitemDesc ? item.moniitemDesc.indexOf(val) >= 0 : '') || // 监测项描述
        (item.moniitemCode ? item.moniitemCode.indexOf(val) >= 0 : '') || // 监测项编码
        (item.dictName ? item.dictName.indexOf(val) >= 0 : '') || // 新字典名字
        (item.dictCode ? item.dictCode.indexOf(val) >= 0 : '') || // 新字典code
        (item.sourceCode ? item.sourceCode.indexOf(val) >= 0 : '') || // 数据源编码
        (item.sourceName ? item.sourceName.indexOf(val) >= 0 : '') || // 数据源名称
        (item.wubi ? item.wubi.indexOf(val) >= 0 : '') || // 新字典五笔
        (item.tmpName ? item.tmpName.indexOf(val) >= 0 : '') || // 其他事件
        (item.codeName ? item.codeName.indexOf(val) >= 0 : '') || // 数据字典来源
        (item.groupName ? item.groupName.indexOf(val) >= 0 : '') || // 数据字典来源
        (item.groupCode ? item.groupCode.indexOf(val) >= 0 : '') || //
        (item.codeValue ? item.codeValue.indexOf(val) >= 0 : '') || // 数据字典来源
        (item.name ? item.name.indexOf(val) >= 0 : '') || // 一般人物
        (item.deptName ? item.deptName.indexOf(val) >= 0 : '') || // 科室名称
        (item.wardName ? item.wardName.indexOf(val) >= 0 : '') || // 病区名称
        (item.wardCode ? item.wardCode.indexOf(val) >= 0 : '') || // 病区编码
        (item.pinyin ? item.pinyin.toUpperCase().indexOf(val.toUpperCase()) >= 0 : '') || // 麻醉事件
        (item.pinYin ? item.pinYin.toUpperCase().indexOf(val.toUpperCase()) >= 0 : '') || // 一般人物
        (item.pharmacyName ? item.pharmacyName.indexOf(val) >= 0 : '') ||
        (item.drugName ? item.drugName.indexOf(val) >= 0 : '') || // 费用项目名称
        (item.userName ? item.userName.indexOf(val) >= 0 : '') || // 医生护士名称
        (item.drugId ? item.drugId.indexOf(val) >= 0 : '') // 费用项目名称
      )
    })
  } else {
    list = [...list]
  }
  if (obj) {
    const { key, value } = obj
    if (key && value) {
      return list.filter(v => {
        return v[key].includes(value)
      })
    }
  }
  return list
}
/** 根据名字返回配置的默认值*/
export function getDefaultValueByName(name) {
  let result = ''
  let arr
  if (globalConfig.medicalTakeWayList) {
    arr = globalConfig.medicalTakeWayList.filter(va => va.name === name)
  }
  switch (name) {
    case '输氧途径':
    case '用药途径':
    case '输液输血途径':
      if (arr && arr.length === 1) {
        result = arr[0].default_value
      }
      break
    default:
      break
  }
  return result
}
/** 根据麻醉开始返回默认事件开始时间*/
export function gettimeByAnasTime(startInfo, docType = 1) {
  let result
  const anesBegin = startInfo.eventList.filter(v => v.code === (docType == 1 ? 2 : 1001))
  if (anesBegin && anesBegin[0] && anesBegin[0].startTime) {
    result = new Date(anesBegin[0].startTime).getTime()
  } else {
    result = ''
  }
  return result
}
/** 开始结束时间基础对比*/
export function compareBeginEndTime(timeArr, index, value) {
  let result
  const beginItem = timeArr.filter(
    v => {
      if (timeArr[index].label == '手术结束') {
        return v.label == '手术开始'
      }
      if (timeArr[index].label == '麻醉结束') {
        return v.label == '麻醉开始'
      }
      if (timeArr[index].label == '拔管') {
        return v.label == '插管'
      }
      if (timeArr[index].label == '出手术间') {
        return v.label == '入手术间'
      }
    }
  )[0]
  const endItem = timeArr.filter(
    v => {
      if (timeArr[index].label == '手术开始') {
        return v.label == '手术结束'
      }
      if (timeArr[index].label == '麻醉开始') {
        return v.label == '麻醉结束'
      }
      if (timeArr[index].label == '插管') {
        return v.label == '拔管'
      }
      if (timeArr[index].label == '入手术间') {
        return v.label == '出手术间'
      }
    }
  )[0]
  const curItem = timeArr[index]
  if (beginItem && beginItem.value) {
    if (new Date(value).getTime() - new Date(beginItem.value).getTime() < 0) {
      result = { message: `${curItem.label}时间必须大于${beginItem.label}时间` }
    }
  }
  if (endItem && endItem.value) {
    if (new Date(endItem.value).getTime() - new Date(value).getTime() < 0) {
      result = { message: `${curItem.label}时间必须小于${endItem.label}时间` }
    }
  }
  return result
}
// 出室是判断是否剂量为0
export function queryDurableDrugEvt0(params) {
  return request({
    url: '/operation/queryDurableDrugEvt0',
    method: 'post',
    data: params
  })
}

// 去除小数末尾0
export function removeTrailingZeros(num) {
  if (isNaN(num) || num === '' || num === null) {
    return num
  } else {
    return (Number(num)).toString().replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
  }
}

// 年龄转换成天
export function ageToDays(age) {
  const years = age.match(/(\d+)岁/g) ? age.match(/(\d+)岁/g) : 0
  const months = age.match(/(\d+)月/g) ? age.match(/(\d+)月/g) : 0
  const days = age.match(/(\d+)天/g) ? age.match(/(\d+)天/g) : 0
  return parseInt(years) * 365 + parseInt(months) * 30 + parseInt(days)
}
