import { verification_queryVerifiyLog, dictItem_batchGetAllDict, dictItem_findAllWithPage, drug_findAllWithPage, param_findWithPage, userTheme_getUserThemeByWardCodeUsername, userTheme_insertUserTheme, verification_doVerifiy, userTheme_editUserTheme, param_queryParam } from '@/api/configuration'
import store from '@/store'
import axios from 'axios'
import dayjs from 'dayjs' // 时间的处理模块
import { cloneDeep, orderBy, map } from 'lodash'

export function changeIcon(XTCS0026) {
  var icon_url = ''
  switch (XTCS0026.replace(/[\r\n]/, '')) {
    case '0':
      icon_url = 'favicon.ico'
      break
    case '1':
      icon_url = 'favicon - 副本(2).ico'
      break
    default:
      break
  }
  const loginRoleType = localStorage.getItem('loginRoleType')
  if (loginRoleType) {
    icon_url = `${process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API}image/${loginRoleType}/favicon.ico`
  }
  if (!icon_url) return
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = icon_url
  document.getElementsByTagName('head')[0].appendChild(link)
}
export function totalScoreIsIn(needTreatmentList, totalScore) {
  const bool = needTreatmentList.some(function (item) {
    let boole
    try {
      const splitList = []
      if (item.minLink && item.minValue) {
        splitList.push({ minLink: item.minLink, minValue: item.minValue, totalScore: totalScore })
      }
      if (item.maxLink && item.maxValue) {
        splitList.push({ maxLink: item.maxLink, maxValue: item.maxValue, totalScore: totalScore })
      }
      boole = splitList.every(function (vv) {
        let exec
        if (vv.minLink && vv.minValue) {
          exec = new Function(`return ${+vv.minValue} ${vv.minLink} ${vv.totalScore}`)
        } else if (vv.maxLink && vv.maxValue) {
          exec = new Function(`return ${vv.totalScore} ${vv.maxLink} ${+vv.maxValue}`)
        }
        return exec()
      })
    } catch (error) {
      boole = false
    }
    return boole
  })
  return bool
}
/**
 * @description: 创建水印
 * @param {String} contentText 水印内容
 */
/**
 * @description: waterMaker.js 加水印功能
 */
let waterMarkDOM
const clearWaterMark = () => {
  if (waterMarkDOM) waterMarkDOM.remove()
}
export function WaterMark(waterMarkName, classData, opacity) {
  clearWaterMark()
  if (!waterMarkName) {
    return
  }
  const fragment = document.createDocumentFragment()
  if (document.getElementsByClassName('water-mark-wrap').length) {
    waterMarkDOM = document.getElementsByClassName('water-mark-wrap')[0]
  } else {
    waterMarkDOM = document.createElement('div')
    waterMarkDOM.className = 'water-mark-wrap'
  }
  let spanStr = ''
  const repeatNum = Math.ceil(window.screen.width / classData.width) * Math.ceil(window.screen.width / classData.height)
  for (let i = 0; i < repeatNum; i++) {
    spanStr += `<span class="water-word ${classData.name}" style="color: rgba(0,0,0,${opacity / 100});">${waterMarkName}</span>`
  }
  waterMarkDOM.innerHTML = spanStr
  fragment.appendChild(waterMarkDOM)
  document.body.appendChild(fragment)
}

/**
 * @param {*} StatusMinute  JS分钟转换为多少天多少小时多少分钟
 * @returns  天小时分钟
 */
export function timeStampFormat(StatusSecond) {
  var day = parseInt(StatusSecond / 60 / 60 / 24)
  var hour = parseInt((StatusSecond % (60 * 60 * 24)) / (60 * 60))
  var min = parseInt((StatusSecond % (60 * 60)) / 60)
  // var second = parseInt(StatusSecond % 60)
  StatusSecond = ''
  if (day > 0) {
    StatusSecond = day + '天'
  }
  if (hour > 0) {
    StatusSecond += hour + '小时'
  }
  if (min > 0) {
    StatusSecond += min + '分钟'
  }
  // if (second > 0) {
  //   StatusSecond += parseFloat(min) + '秒'
  // }
  return StatusSecond
}
export function formatNumber(n) {
  var arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  // n 就是这个一位或者两位的数字

  /*
    一位数

    两位数
      十几  11 12 13
      几十  20 30 40
      几十几  22 33 44
  */
  if (n <= 10) {
    // 几
    return arr[n]
  } else if (n < 20) {
    // 十几
    return '十' + arr[n - 10]
  } else if (n >= 20 && n % 10 === 0) {
    // 几十
    return arr[n / 10] + '十'
  } else {
    // 几十几
    var a = parseInt(n / 10)
    var b = n % 10

    return arr[a] + '十' + arr[b]
  }
}

export function formatYear(n) {
  var arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  // 把 n 转成 二零一九 返回
  var a = parseInt(n / 1000)
  var b = parseInt((n % 1000) / 100)
  var c = parseInt((n % 100) / 10)
  var d = n % 10

  // 拆出来的四位数字刚好和数组的索引对应
  return arr[a] + arr[b] + arr[c] + arr[d] + '年'
}
export function formatTime(time) {
  // 接受一个时间对象
  var str = ''

  // 1. 获取时间对象中的信息
  // var year = time.getFullYear()
  // var month = time.getMonth() + 1
  // var date = time.getDate()
  var hours = time.getHours()
  var minutes = time.getMinutes()
  // var seconds = time.getSeconds()
  // var day = time.getDay()

  // // 组装年份
  // str += formatYear(year)
  // // 组装月份
  // str += formatNumber(month) + '月'
  // // 组装日期
  // str += formatNumber(date) + '号 '
  // 组装上下午
  // if (hours > 12) {
  //     str += '下午 '
  // } else {
  //     str += '上午 '
  // }
  // // 组装小时
  // if (hours === 12) {
  //     str += formatNumber(hours) + '点'
  // } else {
  //     str += formatNumber(hours % 12) + '点'
  // }
  str += formatNumber(hours) + '点'
  // // 组装分钟
  if (minutes < 10) {
    str += '零' + formatNumber(minutes) + '分'
  } else {
    str += formatNumber(minutes) + '分'
  }
  // 组装秒钟
  // str += formatNumber(seconds) + '秒 星期'
  // 组装周几
  // if (day === 0) {
  //     str += '日'
  // } else {
  //     str += formatNumber(day)
  // }
  // 返回一组中国字
  return str
}
/**
 *
 * @param {*} this_monEOpt 图表option
 * @param {*} oldList 一般体征
 * @param {*} tdata 物理降温
 * @param {*} eventListAllOld 监护事件
 * @param {*} personMoniitem_findPersonConfigMoniitem 个人监护项配置
 * @param {*} MON_ITEM_CONFIG_symbolSize 体征图标尺寸 svg size
 * @param {*} coolingData  物理降温相关配置信息
 * @param {*} paramValue 系统参数配置信息
 * @param {*} params 页面相关参数 如起始时间，显示频率
 * @param {*} obj echartdom对象
 * @param {*} h5 是否h5项目
 * @returns
 */
export const translateMonEOpt = function (this_monEOpt, oldList, tdata, eventListAllOld, personMoniitem_findPersonConfigMoniitem, MON_ITEM_CONFIG_symbolSize, coolingData, paramValue, params, obj, h5) {
  const temp_monEOpt = cloneDeep(this_monEOpt) // 深度复制过来 需要对opt做处理
  const { freq, startDate, endDate } = params
  const { startTime, endTime } = params
  const { vGridNum, hGridNum, gridStyle, XTCS1024, XTCS0017, XTCS0061, nbpABP, showWarnningSynbol, outLimitFlag, outLimitFontSize, outLimitColor,
          centerDisplay,
          xAxisShowFlag, // 是否显示时间轴
          // xAxisLabelAlign, // 对齐格式
          timeFormat, // 时间轴的格式
          xAxisInterval //
         } = params
  let pageType
  let outLimitData = []
  const eventListAll = eventListAllOld.sort((a, b) => {
    return new Date(a.recordTime).getTime() - new Date(b.recordTime).getTime()
  })
  const eventList = eventListAll.filter((v) => v.inArea == '1')
  const start = new Date(startTime).getTime() / 1000
  const end = new Date(endTime).getTime() / 1000
  if (startTime && endTime) {
    // 护理文书
    pageType = '护理文书'
    let min = new Date(startTime).getTime() / 1000
    let max = new Date(endTime).getTime() / 1000
    if (gridStyle != '3' && centerDisplay && centerDisplay == 1) {
      min = min - 30 * 60
      max = max - 30 * 60
    }
    temp_monEOpt.xAxis = [ // 两个轴设置虚实相间的效果
      { // 虚线部分
        axisLabel: {
          interval: 0,
          rotate: 15,
          show: false
        },
        axisLine: {
          onZero: false,
          show: false
        },
        axisTick: {
          show: false
        },
        boundaryGap: false,
        interval: (max - min) / hGridNum,
        max: max,
        min: min,
        splitLine: {
          lineStyle: {
            color: '#000000',
            opacity: 1,
            type: 'dotted'
          },
          show: true
        },
        type: 'time'
      }, { // 实线部分 整点
        position: 'top',
        offset: -10,
        axisLabel: {
          interval: 0,
          rotate: 0,
          show: false,
          formatter: function (value) {
            return dayjs(value).format(timeFormat || 'HH')
          }
        },
        axisLine: {
          onZero: false,
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#000000',
            opacity: 1,
            type: 'dotted'
          },
          show: true
        },
        data: [],
        type: 'category'
      }, { // 这里轴用来计算居中处理 剩下的 最优一个小数数据
        axisLabel: {
          interval: 0,
          rotate: 15,
          show: false
        },
        axisLine: {
          onZero: false,
          show: false
        },
        axisTick: {
          show: false
        },
        boundaryGap: false,
        interval: (end - start - 24 * 60 * 60) / hGridNum,
        max: end,
        min: start - 24 * 60 * 60,
        splitLine: {
          show: false
        },
        type: 'time'
      }
    ]
    /**
     * 显示时间轴
     */
    if (xAxisShowFlag == '1') {
      temp_monEOpt.grid.top = 14
      temp_monEOpt.grid.left = 14
      // temp_monEOpt.xAxis[1].axisLabel.align = xAxisLabelAlign
      temp_monEOpt.xAxis[1].axisLabel.show = true
      temp_monEOpt.xAxis[1].axisLabel.interval = xAxisInterval
    } else {
      temp_monEOpt.grid.top = -1
      temp_monEOpt.grid.left = -1
    }
    const startTimeValue = dayjs(startTime).valueOf()
    const timeList = []
    for (let i = 0; i < hGridNum; i++) {
      timeList.push(dayjs(startTimeValue + i * temp_monEOpt.xAxis[0].interval * 1000).format('YYYY-MM-DD HH:mm:ss'))
    }
    temp_monEOpt.xAxis[1].data = timeList
  } else {
    // 普通页面
    pageType = '普通页面'
    if (!h5) {
      temp_monEOpt.xAxis = [
        {
          axisLabel: {
            interval: 0,
            rotate: 15,
            show: false
          },
          axisLine: {
            onZero: false,
            show: false
          },
          axisTick: {
            show: false
          },
          boundaryGap: false,
          splitNumber: 1,
          interval: freq,
          max: new Date(XTCS0061 == '1' ? dayjs(endDate).add(1, 'hours') : endDate).getTime() / 1000,
          min: new Date(startDate).getTime() / 1000,
          splitLine: {
            lineStyle: {
              color: '#000000',
              opacity: 1,
              type: 'dotted'
            },
            show: true
          },
          type: 'time'
        }
      ]
      // const splitNumber = Math.ceil((temp_monEOpt.xAxis[0].max - temp_monEOpt.xAxis[0].min) / freq) // 为了兼容不等的班次
      // temp_monEOpt.xAxis[0].interval = (temp_monEOpt.xAxis[0].max - temp_monEOpt.xAxis[0].min) / splitNumber
    }
  }
  temp_monEOpt.series = []
  temp_monEOpt.series.push(temp_monEOpt.series_0) // 添加一个空数据 用来兼容 数据加粗数据中默认的seriesIndex = 0
  temp_monEOpt.yAxis[0].interval = 240 / vGridNum
  if (pageType == '护理文书') {
    if (gridStyle == 1) { // 实线
      temp_monEOpt.yAxis[0].splitLine.lineStyle.type = 'solid' // 0 虚线 1 2 实线
      temp_monEOpt.xAxis[1].splitLine.interval = 0
      temp_monEOpt.xAxis[1].splitLine.lineStyle.type = 'solid' // x 1 2 都是实线
    } else if (gridStyle == 0) { // 虚线
      temp_monEOpt.yAxis[0].splitLine.lineStyle.type = 'dotted' // 0 虚线 1 2 实线
      if (temp_monEOpt.yAxis.length == 1) {
        temp_monEOpt.yAxis.push(cloneDeep(temp_monEOpt.yAxis[0]))
      }
      temp_monEOpt.yAxis[1].splitLine.lineStyle.type = 'dotted' // 0 虚线 1 2 实线
      temp_monEOpt.xAxis[1].splitLine.lineStyle.type = 'dotted'
    } else if (gridStyle == 2) { // 虚实相间
      temp_monEOpt.yAxis[0].splitLine.lineStyle.type = 'dotted' // 0 虚线 1 2 实线
      temp_monEOpt.xAxis[1].splitLine.interval = 1
      temp_monEOpt.xAxis[1].splitLine.lineStyle.type = 'solid'
      if (temp_monEOpt.yAxis.length == 1) {
        temp_monEOpt.yAxis.push(cloneDeep(temp_monEOpt.yAxis[0]))
      }
      temp_monEOpt.yAxis[1].interval = 240 / vGridNum * 2
      temp_monEOpt.yAxis[1].splitLine.lineStyle.type = 'solid'
    } else if (gridStyle == 3) { // 整点实线
      temp_monEOpt.yAxis[0].splitLine.lineStyle.type = 'dotted' // 0 虚线 1 2 实线
      temp_monEOpt.xAxis[0].splitLine.lineStyle.type = 'dotted' // x 1 2 都是实线
      if (temp_monEOpt.yAxis.length == 1) {
        temp_monEOpt.yAxis.push(cloneDeep(temp_monEOpt.yAxis[0]))
      }
      temp_monEOpt.yAxis[1].interval = 240 / vGridNum * 2
      temp_monEOpt.yAxis[1].splitLine.lineStyle.type = 'solid'
      temp_monEOpt.xAxis[1].splitLine.show = true
      temp_monEOpt.xAxis[1].splitLine.lineStyle.type = 'solid'
      // temp_monEOpt.xAxis[1].axisLabel.interval = function(index, value) {
      //   if (value?.endsWith('00:00')) {
      //       return true
      //     } else return false
      // }
      temp_monEOpt.xAxis[1].splitLine.interval = function(index, value) {
          if (value?.endsWith('00:00')) {
            return true
          } else return false
      }
    }
  }

  for (let index = 0; index < oldList.length; index++) { // y轴的匹配
    const yAxis = {
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      interval: 1,
      max: 42,
      min: 18,
      splitLine: {
        show: false
      },
      type: 'value'
    }
    if (temp_monEOpt.yAxis.filter((v) => v.moniitemCode == oldList[index].moniitemCode).length < 1) {
      temp_monEOpt.yAxis.push(Object.assign({}, yAxis, { min: oldList[index].minValue, max: oldList[index].maxValue, moniitemName: oldList[index].moniitemName, moniitemCode: oldList[index].moniitemCode }))
    }
  }
  for (let index = 0; index < oldList.length; index++) { // 数据的匹配
    const series = Object.assign({}, JSON.parse(JSON.stringify(temp_monEOpt.series_0)), oldList[index])
    series.name = oldList[index].moniitemName || oldList[index].moniitemDesc
    series.id = oldList[index].moniitemName + '__' + oldList[index].moniitemCode + '__' + oldList[index].moniitemDesc || ''
    series.yAxisIndex = temp_monEOpt.yAxis.findIndex((item) => item.moniitemCode == series.moniitemCode) > 0 ? temp_monEOpt.yAxis.findIndex((item) => item.moniitemCode == series.moniitemCode) : 0
    oldList[index].monItemList = oldList[index].monItemList ? oldList[index].monItemList : []
    const comparePer = personMoniitem_findPersonConfigMoniitem.filter((vv) => vv.moniitemCode == series.moniitemCode)
    const { minValue, maxValue, moniitemCode } = comparePer.length > 0 ? comparePer[0] : {}
    // console.log('lineTypeDict', moniitemName, series.lineTypeDict)
    if (series.lineTypeDict == 'point') series.lineStyle.normal.width = 0 // 只显示 点
    else if (series.lineTypeDict == 'line') series.lineStyle.normal.width = 2
    else if (series.lineTypeDict == 'vLine') {
      // series.lineStyle.normal.type = 'dotted'
      // series.lineStyle.normal.width = 2
    }
    let MoniitemList = cloneDeep(oldList[index].monItemList)
    if (centerDisplay && centerDisplay == 1) {
      MoniitemList = MoniitemList.filter(v => new Date(v.recordTime).getTime() / 1000 <= end - 60 * 60)
    }
    series.data = MoniitemList.map((v, i) => {
      const value = [new Date(v.recordTime).getTime() / 1000, v.moniitemValue]
      const v_value = +v.moniitemValue
      const show = (!isNaN(v_value) && v_value !== null && !isNaN(maxValue) && maxValue !== null && !isNaN(minValue) && minValue !== null && (v_value > maxValue || v_value < minValue))
      const warningIcon = (showWarnningSynbol == 1 && v.warning == '1') || (pageType != '护理文书' && !isNaN(v_value) && v_value !== null && !isNaN(maxValue) && maxValue !== null && !isNaN(minValue) && minValue !== null && (v_value > maxValue || v_value < minValue))
      const label = {
        show: show || warningIcon,
        formatter: '    ',
        position: [0, -5],
        fontSize: 12,
        backgroundColor: warningIcon
          ? {
              image: require('@/assets/感叹号_icon.svg')
            }
          : 'transparent'
      }
      if (show && outLimitFlag == 1) {
        v.position = v_value > maxValue ? 'up' : 'down'
        outLimitData.push(cloneDeep(v))
      }
      return { value, label }
    })
    series.xAxisIndex = 0
    series.color = oldList[index].colorDict
    series.symbolSize = h5 ? 15 : (MON_ITEM_CONFIG_symbolSize || 12)
    series.symbol = 'path://' + oldList[index].symbolDict
    if (oldList[index].symbolDict == 'M9.5,13.92a3.24,3.24,0,1,1,3.24-3.24A3.24,3.24,0,0,1,9.5,13.92Zm0-5.47a2.24,2.24,0,1,0,2.24,2.23A2.23,2.23,0,0,0,9.5,8.45Z' || oldList[index].symbolDict == 'M13.6,10a3,3,0,1,1-3-3A3,3,0,0,1,13.6,10Zm-.82-2.35a.06.06,0,1,0-.06.06A.06.06,0,0,0,12.78,7.61Z') {
      series.symbolSize = h5 ? 15 : series.symbolSize / 2
    }
    if (nbpABP == 1 && pageType == '护理文书' && (moniitemCode == 'WN_ICIS_MONI_10010203' || moniitemCode == 'WN_ICIS_MONI_10010205')) {
      if (series.data?.length > 0) {
        series.data[0].label.show = true
        series.data[0].label.position = [8, -8]
        switch (moniitemCode) {
          case 'WN_ICIS_MONI_10010203': // 无创
            series.data[0].label.formatter = 'nbp'
            break
          case 'WN_ICIS_MONI_10010205': // 有创
            series.data[0].label.formatter = 'ABP'
            break
          default:
            break
        }
      }
    }
    temp_monEOpt.series.push(series)
    if (gridStyle != '3' && centerDisplay && centerDisplay == 1) { // 居中处理
      const seriesTemp = cloneDeep(series)
      seriesTemp.data = oldList[index].monItemList.filter(v => new Date(v.recordTime).getTime() / 1000 >= end - 60 * 60).map((v, i) => {
        const value = [new Date(v.recordTime).getTime() / 1000, v.moniitemValue]
        const v_value = +v.moniitemValue
        const show = (!isNaN(v_value) && v_value !== null && !isNaN(maxValue) && maxValue !== null && !isNaN(minValue) && minValue !== null && (v_value > maxValue || v_value < minValue))
        const warningIcon = (showWarnningSynbol == 1 && v.warning == '1') || (pageType != '护理文书' && !isNaN(v_value) && v_value !== null && !isNaN(maxValue) && maxValue !== null && !isNaN(minValue) && minValue !== null && (v_value > maxValue || v_value < minValue))
        // 监护数据页面 超过最大最小值 需要显示异常图标。 护理文书 页面需要显示标志
        const label = {
          show: show || warningIcon,
          formatter: '    ',
          position: [0, -5],
          fontSize: 12,
          backgroundColor: warningIcon
            ? {
                image: require('@/assets/感叹号_icon.svg')
              }
            : 'transparent'
        }
        if (show && outLimitFlag == 1) {
          v.position = v_value > maxValue ? 'up' : 'down'
          outLimitData.push(cloneDeep(v))
        }
        return { value, label }
      })
      seriesTemp.xAxisIndex = 2
      seriesTemp.id = seriesTemp.id + '_center'
      temp_monEOpt.series.push(seriesTemp)
    }
  }
  for (let index = 0; index < tdata.length; index++) { // 物理降温
    const element = tdata[index]
    if (!element.recordTime || !element.moniitemValue || element.isDel == '1') continue
    const temp = oldList.filter((v) => {
      return v.moniitemCode == paramValue
    })
    if (temp.length <= 0) continue
    const tempPlus = temp[0].monItemList.filter((v) => v.recordTime == element.recordTime)[0]
    if (!tempPlus) {
      continue
    }
    const series = cloneDeep(temp_monEOpt.series_0)
    series.name = '物理降温'
    series.id = '物理降温' + element.recordTime
    series.lineStyle.normal.type = 'dotted'
    series.lineStyle.normal.width = 2
    series.yAxisIndex = temp_monEOpt.yAxis.findIndex((item) => item.moniitemCode == paramValue) > 0 ? temp_monEOpt.yAxis.findIndex((item) => item.moniitemCode == paramValue) : 0
    series.xAxisIndex = 0
    if (centerDisplay && centerDisplay == 1) { // 居中处理
      const time = new Date(element.recordTime).getTime() / 1000
      if (time > end - 60 * 60) {
        series.xAxisIndex = 1
      }
    }
    series.data = []
    // series.z = series.zlevel = 2
    series.lineStyle.normal.color = +tempPlus.moniitemValue > +element.moniitemValue ? 'red' : 'green'
    series.symbolSize = h5 ? 15 : (MON_ITEM_CONFIG_symbolSize || 12)
    switch (+tempPlus.moniitemValue > +element.moniitemValue) {
      case true:
        series.color = coolingData.successColorDict
        series.symbol = 'path://' + coolingData.successSymbolDict
        if (coolingData.successSymbolDict == 'M9.5,13.92a3.24,3.24,0,1,1,3.24-3.24A3.24,3.24,0,0,1,9.5,13.92Zm0-5.47a2.24,2.24,0,1,0,2.24,2.23A2.23,2.23,0,0,0,9.5,8.45Z' || coolingData.successSymbolDict == 'M13.6,10a3,3,0,1,1-3-3A3,3,0,0,1,13.6,10Zm-.82-2.35a.06.06,0,1,0-.06.06A.06.06,0,0,0,12.78,7.61Z') {
          series.symbolSize = h5 ? 15 : series.symbolSize / 2
        }
        break
      case false:
        series.color = coolingData.failColorDict
        series.symbol = 'path://' + coolingData.failSymbolDict
        if (coolingData.failSymbolDict == 'M9.5,13.92a3.24,3.24,0,1,1,3.24-3.24A3.24,3.24,0,0,1,9.5,13.92Zm0-5.47a2.24,2.24,0,1,0,2.24,2.23A2.23,2.23,0,0,0,9.5,8.45Z' || coolingData.failSymbolDict == 'M13.6,10a3,3,0,1,1-3-3A3,3,0,0,1,13.6,10Zm-.82-2.35a.06.06,0,1,0-.06.06A.06.06,0,0,0,12.78,7.61Z') {
          series.symbolSize = h5 ? 15 : series.symbolSize / 2
        }
        break
      default:
        break
    }
    series.data.push({ value: [new Date(element.recordTime).getTime() / 1000, tempPlus.moniitemValue], itemStyle: { normal: { opacity: 0 } }, S: 0 })
    series.data.push({ value: [new Date(element.recordTime).getTime() / 1000, element.moniitemValue] })
    temp_monEOpt.series.push(series)
  }
  // 参数控制监护数据 组件参数控制组件
  if ((XTCS1024 == 1 && pageType == '普通页面') || pageType == '护理文书') {
    for (let index = 0; index < eventList.length; index++) {
      const element = eventList[index]
      if (!element.recordTime) continue
      switch (pageType) {
        case '护理文书': {
          let xAxisIndex = 0
          if (centerDisplay && centerDisplay == 1) { // 居中处理
            const time = new Date(element.recordTime).getTime() / 1000
            if (time > end - 60 * 60) {
              xAxisIndex = 1
            }
          }
          if (element.position == 'down') {
            // 下标
            const downEvent = eventList.filter((v) => v.position == 'down')
            const selfIndex = downEvent.findIndex((v) => v.id == element.id)
            if (selfIndex > 0) {
              const timeDiffer = dayjs(endTime).diff(startTime, 'second')
              const unit = (timeDiffer / obj.element.style.width) * (element.size || 12)
              const isInUnit = dayjs(element.recordTime).diff(downEvent[selfIndex - 1].compareTime, 'second') < unit
              element.compareTime = isInUnit ? new Date(downEvent[selfIndex - 1].compareTime).getTime() + unit * 1000 : new Date(element.recordTime).getTime()
            } else {
              element.compareTime = new Date(element.recordTime).getTime()
            }
            temp_monEOpt.series.push({
              symbolSize: 1,
              symbolOffset: [0, 1],
              color: element.color,
              data: [
                {
                  value: [new Date(element.compareTime).getTime() / 1000, 2],
                  label: {
                    color: element.color,
                    show: true,
                    position: [0, 0],
                    align: 'center',
                    verticalAlign: 'bottom',
                    formatter: element.eventName.split('').join('\n'),
                    fontSize: element.size
                  },
                  itemStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    opacity: 1
                  }
                }
              ],
              yAxisIndex: 0,
              xAxisIndex: xAxisIndex,
              type: 'scatter'
            })
          } else if (element.position == 'up') {
            // 上标
            const upEvent = eventList.filter((v) => v.position == 'up')
            const selfIndex = upEvent.findIndex((v) => v.id == element.id)
            if (selfIndex > 0) {
              const timeDiffer = dayjs(endTime).diff(startTime, 'second')
              const unit = (timeDiffer / obj.element.style.width) * (element.size || 12)
              const isInUnit = dayjs(element.recordTime).diff(upEvent[selfIndex - 1].compareTime, 'second') < unit
              element.compareTime = isInUnit ? new Date(upEvent[selfIndex - 1].compareTime).getTime() + unit * 1000 : new Date(element.recordTime).getTime()
            } else {
              element.compareTime = new Date(element.recordTime).getTime()
            }
            temp_monEOpt.series.push({
              symbolSize: 1,
              symbolOffset: [0, -1],
              color: element.color,
              data: [
                {
                  value: [new Date(element.compareTime).getTime() / 1000, 238],
                  label: {
                    color: element.color,
                    show: true,
                    formatter: element.eventName.split('').join('\n'),
                    position: [0, 0],
                    fontSize: element.size
                  },
                  itemStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    opacity: 1
                  }
                }
              ],
              yAxisIndex: 0,
              xAxisIndex: xAxisIndex,
              type: 'scatter'
            })
          } else {
            continue
          }
          break
        }
        case '普通页面': {
          let height
          let $el = {}
          if (Array.isArray(obj.refs)) { // 患者概览页面 是放在v-for中  refs 为数组
            $el = obj.refs[0].$el
          } else {
            $el = obj.refs.$el
          }
          if (!$el.offsetHeight) break
          if (index > 0) {
            const maxLine = 5
            const unitY = (239 / $el.offsetHeight) * 12
            const timeDiffer = dayjs(endDate).diff(startDate, 'second')
            const unit = (timeDiffer / $el.offsetWidth) * 12
            const isInUnit = dayjs(element.recordTime).diff(eventList[index - 1].recordTime, 'second') < unit * (eventList[index - 1].eventAbbr?.length || 1)
            const lastHeight = temp_monEOpt.series[temp_monEOpt.series.length - 1].data[0].value[1] + unitY
            height = lastHeight <= unitY * (maxLine - 1) + 2 && isInUnit ? lastHeight : 2
          }
          temp_monEOpt.series.push({
            symbolSize: 1,
            symbolOffset: [0, 1],
            clip: false,
            data: [
              {
                value: [new Date(element.recordTime).getTime() / 1000, index === 0 ? 2 : height],
                label: {
                  show: true,
                  position: [0, 0],
                  verticalAlign: 'bottom',
                  formatter: element.eventAbbr || '',
                  fontSize: 12,
                  color: '#d30e0e'
                },
                seriesName: element.eventName,
                itemStyle: {
                  color: 'rgba(255, 255, 255, 0.1)',
                  opacity: 1
                }
              }
            ],
            yAxisIndex: 0,
            xAxisIndex: 0,
            type: 'scatter'
          })
          break
        }
        default:
          break
      }
    }
  }

  if (!XTCS0017?.lineType || XTCS0017?.lineType == '1') {
    let dis = []
    let con = []
    dis = XTCS0017 && XTCS0017.dis ? XTCS0017.dis : ['WN_ICIS_PATIENTEVENT_0501', 'WN_ICIS_PATIENTEVENT_0502']
    con = XTCS0017 && XTCS0017.con ? XTCS0017.con : ['WN_ICIS_PATIENTEVENT_0602', 'WN_ICIS_PATIENTEVENT_0603']
    const evnList = eventListAll.filter((v) => {
      // 手术
      return [...dis, ...con].indexOf(v.eventCode) >= 0
      // return v.eventCode == 'WN_ICIS_PATIENTEVENT_0501' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0502' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0602' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0603'
    })
    if (evnList.length > 0) {
      const clearTime = evnList.map((v) => {
        v.time = new Date(v.recordTime).getTime() / 1000
        // v.clearable = v.eventCode == 'WN_ICIS_PATIENTEVENT_0501' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0602'
        v.clearable = dis.indexOf(v.eventCode) >= 0 //
        return v
      })
      const insertClearTime = clearTime.filter((v) => v.clearable)
      for (let index = 0; index < temp_monEOpt.series.length; index++) {
        const element = temp_monEOpt.series[index]
        if (element.type != 'line' || element.name == '物理降温') continue
        for (let i = 0; i < insertClearTime.length; i++) {
          const insertIndex = element.data.findIndex((v) => {
            return v.value[0] > insertClearTime[i].time
          })
          if (insertIndex >= 0) {
            element.data.splice(insertIndex, 0, { value: [insertClearTime[i].time, ''], split: true })
          }
        }
        for (let i = 0; i < element.data.length; i++) {
          const element_1 = element.data[i]
          if (element_1.split) {
            continue
          }
          const clearfilter = clearTime.filter((t) => {
            return element_1.value[0] >= t.time
          })
          if (clearfilter.length > 0 && (!XTCS0017.mode || XTCS0017.mode == 1)) {
            const compareItem = clearfilter[clearfilter.length - 1]
            if (compareItem.clearable) {
              element_1.value[1] = ''
              element_1.clear = true
            }
          }
        }
      }
    }
  } else if (XTCS0017.lineType == '2') {
    const eventDisConInfo = XTCS0017.eventList
    for (let index = 0; index < temp_monEOpt.series.length; index++) {
      // 根据moniitemCode 查找需要断开的 数据
      const element = temp_monEOpt.series[index]
      if (element.type != 'line' || element.name == '物理降温') continue
      const moniitemCode = element.moniitemCode
      const dis = [] // 断开事件
      const con = []
      const matchData = [] // 必须强匹配的事件
      let mode = '1'
      let eventFlag = false
      eventDisConInfo.forEach(item => {
        const moniitemCodes = item.moniitemCodes.map(v => v.moniitemCode)
        if (moniitemCodes.includes(moniitemCode)) {
          if (item.mode == '2') { // 自动重连 只要匹配有重连
            mode = '2'
          }
          eventFlag = true
          dis.push(item.dis)
          con.push(item.con)
          matchData.push([item.dis, item.con]) // 断开重连组合
        }
      })

      if ((dis.length == 0 && con.length == 0) || !eventFlag) continue
      let evnList = eventListAll.filter((v) => {
        // 手术
        return [...dis, ...con].indexOf(v.eventCode) >= 0
        // return v.eventCode == 'WN_ICIS_PATIENTEVENT_0501' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0502' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0602' || v.eventCode == 'WN_ICIS_PATIENTEVENT_0603'
      })
      // 需要排除下 多余的事件  例如配对的 连续录两条断开事件
      const recombinationArr = []
      for (var i = 0; i < matchData.length; i++) {
        const arr = matchData[i]
        let temp = JSON.parse(JSON.stringify(evnList))
        let result = temp.length
        while (result > 0) {
          const disIndex = temp.findIndex(e => e.eventCode == arr[0])
          const conIndex = temp.findIndex(e => e.eventCode == arr[1])
          if (disIndex != -1 && conIndex != -1 && disIndex > conIndex) { // 断开前面有重连事件  从断开事件为起点开始取数据
            temp = temp?.slice(disIndex)
            result = temp.length
          } else if (disIndex != -1 && conIndex != -1 && disIndex < conIndex) { // 正常匹配数据 先断后连的情况
            recombinationArr.push(temp[disIndex])
            recombinationArr.push(temp[conIndex])
            temp = temp?.slice(conIndex + 1)
            result = temp.length
          } else if (conIndex == -1 && disIndex != -1) { // 只有断开事件  取第一个断开事件
            recombinationArr.push(temp[disIndex])
            result = 0
          } else if (conIndex != -1 && disIndex == -1) { // 只有重连事件 所有事件不用特殊处理
            result = 0
          } else if (conIndex == -1 && disIndex == -1) { // 没有任何断开重连事件
            result = 0
          }
        }
      }
      evnList = JSON.parse(JSON.stringify(orderBy(recombinationArr, 'recordTime')))
      if (evnList.length == 0) continue
      const clearTime = evnList.map((v, index) => {
        v.time = new Date(v.recordTime).getTime() / 1000
        const disCount = evnList.slice(0, index + 1).filter(item => dis.includes(item.eventCode)).length // 当前时间点 断开事件
        const currConIndex = evnList.slice(0, index + 1).filter(item => con.includes(item.eventCode)).length // 当前重连事件索引
        if (dis.indexOf(v.eventCode) >= 0) { // 如果是断点
          v.clearable = true
        } else { // 如果是连接点
          v.clearable = currConIndex < disCount
        }
        return v
      })
      const insertClearTime = clearTime.filter((v) => v.clearable)
      for (let i = 0; i < insertClearTime.length; i++) {
        const insertIndex = element.data.findIndex((v) => {
          return v.value[0] > insertClearTime[i].time
        })
        if (insertIndex >= 0) {
          element.data.splice(insertIndex, 0, { value: [insertClearTime[i].time, ''], split: true })
        }
      }
      for (let i = 0; i < element.data.length; i++) { // 看数据是否需要断开连接
        const element_1 = element.data[i]
        if (element_1.split) {
          continue
        }
        const clearfilter = clearTime.filter((t) => {
          return element_1.value[0] >= t.time
        })
        if (clearfilter.length > 0 && (mode == '1')) {
          const compareItem = clearfilter[clearfilter.length - 1]
          if (compareItem.clearable) {
            element_1.value[1] = ''
            element_1.clear = true
          }
        }
      }
    }
  }

  if (outLimitData.length > 0 && pageType == '护理文书' && outLimitFlag == 1) {
    for (let index = 0; index < outLimitData.length; index++) {
      const element = outLimitData[index]
      let xAxisIndex = 0
      if (centerDisplay && centerDisplay == 1) { // 居中处理
        const time = new Date(element.recordTime).getTime() / 1000
        if (time > end - 60 * 60) {
          xAxisIndex = 1
        }
      }
      if (element.position == 'down') {
        // 下标
        const timeDiffer = dayjs(endTime).diff(startTime, 'second')
        const unit = (timeDiffer / obj.element.style.width) * (outLimitFontSize || 9)
        const minBetween = Math.min(dayjs(element.recordTime).diff(startTime, 'second'), dayjs(endTime).diff(element.recordTime, 'second'))
        const offsetDirection = dayjs(element.recordTime).diff(startTime, 'second') > dayjs(endTime).diff(element.recordTime, 'second') ? 'toleft' : 'toright'
        const needOffset = minBetween < (unit * (element.moniitemValue + '').length) / 2
        const offsetPx = needOffset ? (obj.element.style.width / timeDiffer) * ((unit * (element.moniitemValue + '').length) / 2 - minBetween) : 0
        const offsetValue = needOffset ? (offsetDirection == 'toleft' ? 0 - offsetPx * 0.7 : offsetPx * 0.7) : 0
        temp_monEOpt.series.push({
          symbolSize: 1,
          symbolOffset: [offsetValue * 0.3, 1],
          color: outLimitColor,
          data: [
            {
              value: [new Date(element.recordTime).getTime() / 1000, 2],
              label: {
                show: true,
                color: outLimitColor,
                position: [offsetValue, outLimitFontSize * 0.3],
                align: 'center',
                fontWeight: 'bolder',
                verticalAlign: 'bottom',
                formatter: element.moniitemValue,
                fontSize: outLimitFontSize
              },
              itemStyle: {
                color: outLimitColor,
                opacity: 1
              }
            }
          ],
          yAxisIndex: 0,
          xAxisIndex: xAxisIndex,
          type: 'scatter'
        })
      } else if (element.position == 'up') {
        // 上标
        const timeDiffer = dayjs(endTime).diff(startTime, 'second')
        const unit = (timeDiffer / obj.element.style.width) * (outLimitFontSize || 9)
        const minBetween = Math.min(dayjs(element.recordTime).diff(startTime, 'second'), dayjs(endTime).diff(element.recordTime, 'second'))
        const offsetDirection = dayjs(element.recordTime).diff(startTime, 'second') > dayjs(endTime).diff(element.recordTime, 'second') ? 'toleft' : 'toright'
        const needOffset = minBetween < (unit * (element.moniitemValue + '').length) / 2
        const offsetPx = needOffset ? (obj.element.style.width / timeDiffer) * ((unit * (element.moniitemValue + '').length) / 2 - minBetween) : 0
        const offsetValue = needOffset ? (offsetDirection == 'toleft' ? 0 - offsetPx * 0.6 : offsetPx * 0.6) : 0
        temp_monEOpt.series.push({
          symbolSize: 1,
          symbolOffset: [offsetValue * 0.3, 0],
          color: outLimitColor,
          data: [
            {
              value: [new Date(element.recordTime).getTime() / 1000, 238],
              label: {
                show: true,
                formatter: element.moniitemValue,
                color: outLimitColor,
                position: [offsetValue, 0],
                align: 'center',
                fontWeight: 'bolder',
                fontSize: outLimitFontSize
              },
              itemStyle: {
                color: outLimitColor,
                opacity: 1
              }
            }
          ],
          yAxisIndex: 0,
          xAxisIndex: xAxisIndex,
          type: 'scatter'
        })
      }
    }
    outLimitData = []
  }
  // console.log('temp_monEOpt', temp_monEOpt)
  return temp_monEOpt
}
export const monECfg = {
  dir: 'y'
}
export const monEOpt = {
  animation: false,
  grid: {
    bottom: -1,
    left: -1,
    right: -1,
    top: -1
  },
  series_0: {
    animation: false,
    color: 'red',
    connectNulls: false,
    data: [],
    id: 'RR',
    itemStyle: {
      normal: {}
    },
    lineStyle: {
      normal: {
        width: 1
      }
    },
    max: 30,
    min: 8,
    name: 'RR',
    observeId: '100001',
    smooth: 0,
    S: 12,
    type: 'line',
    units: 'bpm',
    yAxisIndex: 0,
    z: 3
  },
  tooltip: {
    trigger: 'item',
    formatter: (p) => {
      const arr = p.data.value ? p.data.value : p.data
      return '<div>' + '时间:' + dayjs(new Date(arr[0]) * 1000).format('HH:mm') + '<br>' + '名称：' + p.seriesName + '<br>' + '值：' + arr[1] + '</div>'
    }
  },
  xAxis: [
    {
      axisLabel: {
        interval: 0,
        rotate: 15,
        show: false
      },
      axisLine: {
        onZero: false,
        show: false
      },
      axisTick: {
        show: false
      },
      boundaryGap: false,
      interval: 1,
      max: 48,
      min: 0,
      splitLine: {
        lineStyle: {
          color: '#000000',
          opacity: 1,
          type: 'dotted'
        },
        show: true
      },
      type: 'value'
    }
  ],
  yAxis: [
    {
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      interval: 20,
      max: 240,
      min: 0,
      splitLine: {
        lineStyle: {
          color: '#000000',
          opacity: 1,
          type: 'dotted'
        },
        show: true
      },
      type: 'value'
    }
  ]
}
export const monEOptFn = function () {
  return monEOpt
}
export const divisibleList = [10, 9, 8, 7, 6, 5, 4, 3, 2]
/**
 *
 * @param {*} list 图表左侧栏排序转换
 * @returns
 */
export const translateVitalSigns = function (list) {
  list
    .map((v) => {
      v.axisList = [v.minValue, v.maxValue]
      let maxFreq
      for (let index = 0; index < divisibleList.length; index++) {
        const element = divisibleList[index]
        if ((v.maxValue - v.minValue) % element === 0) {
          maxFreq = (v.maxValue - v.minValue) / element
          break
        }
      }
      if (maxFreq) {
        while (v.axisList[v.axisList.length - 1] - v.axisList[v.axisList.length - 2] > maxFreq) {
          v.axisList.splice(-1, 0, v.axisList[v.axisList.length - 2] + maxFreq)
        }
      }
      v.axisList = v.axisList.reverse()
      return v
    })
    .filter((v) => v.statusDict == '1')
  return list
}
export const shiftListWrap = function (shiftList) {
  const list = shiftList && shiftList.length > 0 ? shiftList : []
  const other = list.filter((v) => v.shiftCode !== 'D')
  const day = list.filter((v) => v.shiftCode == 'D')
  const result = [...day, ...other].map((v) => {
    v.shiftName = v.shiftAbbr ? v.shiftAbbr : v.shiftName
    return v
  })
  return result
}
export const isValidDate = function (date) {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  return date instanceof Date && !isNaN(date.getTime())
}
export const unique = function (arr) {
  return Array.from(new Set(arr))
}
export const timeToTimestamp = function (time) {
  var s = ''
  var hour = time.split(':')[0]
  var min = time.split(':')[1]
  var sec = time.split(':')[2]
  s = Number(hour * 3600) + Number(min * 60) + Number(sec)
  return s
}
export const getBase64 = function (url) {
  return new Promise((r) => {
    var Img = new Image()
    var dataURL = ''
    Img.src = url
    Img.onload = function () {
      // 要先确保图片完整获取到，这是个异步事件
      var canvas = document.createElement('canvas') // 创建canvas元素
      var width = Img.width // 确保canvas的尺寸和图片一样
      var height = Img.height
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
      r(dataURL)
    }
  })
}
export const getDictItemList = function (dictGroupCode) {
  return new Promise((resolve, reject) => {
    const query = {
      dictGroupCode,
      pageSize: 1000,
      pageNum: 1
    }
    if ({}.hasOwnProperty.call(store.getters.batchSearchSysCodeObj, dictGroupCode)) {
      resolve(store.getters.batchSearchSysCodeObj[dictGroupCode])
      return
    }
    dictItem_findAllWithPage(query).then((res) => {
      if (!(res.data && res.data.result)) {
        reject([])
      }
      store.commit('set_dict', { [dictGroupCode]: res.data.result })
      resolve(res.data.result)
    })
  })
}
export const batchGetDictItemList = function (dictGroupCodeList, valid) {
  return new Promise((resolve, reject) => {
    const cachedList = dictGroupCodeList.filter((dictGroupCode) => {
      return {}.hasOwnProperty.call(store.getters.batchSearchSysCodeObj, dictGroupCode)
    })
    const ajaxList = dictGroupCodeList.filter((dictGroupCode) => {
      return !{}.hasOwnProperty.call(store.getters.batchSearchSysCodeObj, dictGroupCode)
    })
    // 没有需要请求的 直接返回
    const batchObj = {}
    if (ajaxList.length === 0) {
      dictGroupCodeList.forEach((v) => {
        batchObj[v] = store.getters.batchSearchSysCodeObj[v].filter((vv) => (valid ? vv.statusDict == 1 : true))
      })
      resolve(batchObj)
      return
    }
    // 有需要请求的 一把请求完请求的 不管缓存有几个 一起返回
    cachedList.forEach((element) => {
      batchObj[element] = store.getters.batchSearchSysCodeObj[element]
    })
    dictItem_batchGetAllDict({ dictGroupCodeList: ajaxList }).then((res) => {
      if (!res.data) {
        reject([])
      } else {
        const array = res.data
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          element.list = element.list.filter((vv) => (valid ? vv.statusDict == 1 : true))
          batchObj[element.dictGroupCode] = element.list
          store.commit('set_dict', { [element.dictGroupCode]: element.list })
        }
      }
      resolve(batchObj)
    })
  })
}
/**
 * 路由跳转,防止相同路由报错
 * @param {url} 跳转地址
 */
export const setRoute = function (url) {
  const param = window.location.hash.split('?')[1]
  const hash = window.location.hash.split('#/')[1]
  if (hash != url) {
    if (url.indexOf('login') > -1) {
      window.location.href = `${window.location.origin}/#/${url}`
    } else {
      window.location.href = `${window.location.origin}/#/${url}?${param}`
    }
  }
}
// 排班时间转换
export function convertArrange(time) {
  switch (time) {
    case '00:00':
      return 0
    case '00:30':
      return 1
    case '01:00':
      return 2
    case '01:30':
      return 3
    case '02:00':
      return 4
    case '02:30':
      return 5
    case '03:00':
      return 6
    case '03:30':
      return 7
    case '04:00':
      return 8
    case '04:30':
      return 9
    case '05:00':
      return 10
    case '05:30':
      return 11
    case '06:00':
      return 12
    case '06:30':
      return 13
    case '07:00':
      return 14
    case '07:30':
      return 15
    case '08:00':
      return 16
    case '08:30':
      return 17
    case '09:00':
      return 18
    case '09:30':
      return 19
    case '10:00':
      return 20
    case '10:30':
      return 21
    case '11:00':
      return 22
    case '11:30':
      return 23
    case '12:00':
      return 24
    case '12:30':
      return 25
    case '13:00':
      return 26
    case '13:30':
      return 27
    case '14:00':
      return 28
    case '14:30':
      return 29
    case '15:00':
      return 30
    case '15:30':
      return 31
    case '16:00':
      return 32
    case '16:30':
      return 33
    case '17:00':
      return 34
    case '17:30':
      return 35
    case '18:00':
      return 36
    case '18:30':
      return 37
    case '19:00':
      return 38
    case '19:30':
      return 39
    case '20:00':
      return 40
    case '20:30':
      return 41
    case '21:00':
      return 42
    case '21:30':
      return 43
    case '22:00':
      return 44
    case '22:30':
      return 45
    case '23:00':
      return 46
    case '23:30':
      return 47
    case '24:00':
      return 48
  }
}

export function deepCopy(target) {
  if (typeof target == 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }

  return target
}

export function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
export function getDomPositionByClass(curDom, targetClass) {
  if (!curDom) {
    return
  }
  let offsetTop = 0
  let offsetLeft = 0
  function getOffsetWidth(dom) {
    if (dom.offsetParent && (dom.offsetParent?.className?.indexOf(targetClass) < 0 || !dom.offsetParent?.className)) {
      offsetTop += dom.offsetTop
      offsetLeft += dom.offsetLeft
      getOffsetWidth(dom.offsetParent)
    }
  }
  getOffsetWidth(curDom)
  const obj = {
    offsetTop,
    offsetLeft
  }
  offsetTop = null
  offsetLeft = null
  return obj
}
export function getStyle(style, filter = [], isPrint) {
  const needUnit = ['fontSize', 'width', 'height', 'top', 'left', 'borderWidth', 'letterSpacing', 'borderRadius', 'borderColor']
  const border = ['borderLeft', 'borderRight', 'borderTop', 'borderBottom']
  const result = {}
  Object.keys(style).forEach((key) => {
    if (!filter.includes(key)) {
      if (key != 'rotate') {
        result[key] = style[key]
        if (border.includes(key)) {
          if (!style[key]) {
            result[key] = 'none'
          } else {
            // result[key] = `${style.borderWidth}px solid var(--label-color)` 打印的时候无法显示边框
            result[key] = `${style.borderWidth}px solid ${style.borderColor || '#000'}`
            // result.borderColor = 'var(--label-color)'
            // result.borderStyle = 'solid'
          }
        }
        if (needUnit.includes(key)) {
          result[key] += 'px'
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })
  if (isPrint) {
    result.minWidth = result.width
    result.minHeight = result.height
    delete result.width
    delete result.height
  }
  return result
}
// 解析身份证号  根据身份证号获取 年龄 性别 出生日期
export function analyzeIDCard(IDCard) {
  var sexAndAge = {}
  // 获取用户身份证号码
  var userCard = IDCard
  // 如果身份证号码为undefind则返回空
  if (!userCard || IDCard.length != 18) {
    return sexAndAge
  }

  // 获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
    sexAndAge.sex = '男'
    sexAndAge.sexDict = '1'
  } else {
    sexAndAge.sex = '女'
    sexAndAge.sexDict = '2'
  }
  sexAndAge.birthday = userCard.substring(6, 10) + '-' + userCard.substring(10, 12) + '-' + userCard.substring(12, 14)
  // 得到年龄
  // sexAndAge.age = analyzeBirthday(sexAndAge.birthday).age
  // 返回性别和年龄
  return sexAndAge
}

/**
 * 解析身份证号 根据身份证号获取年龄
 * birthday 出生年月日
 * brnldw1 年龄单位
 *  */
export function analyzeBirthday(birthday) {
  var info = {}

  return info
}
/**
 * @param {*} startTime 起始时间
 * @param {*} endTime 结束时间
 * @param {*} type  0 1 按天 2 按小时算天数
 * @returns
 */
// 计算一个时间天数到目前的天数
export function durationFormat(startTime, endTime, type) {
  if (!startTime) return 0
  let result = 0
  let date0 = dayjs(startTime).valueOf()
  let date1
  let unit = '天'
  const inFuture = date0 > dayjs().valueOf()
  if (type == '4') {
    // 3按照24小时计算显示天数 小时  分钟
    date0 = dayjs(startTime).valueOf()
    unit = ''
    const daytype3 = parseInt(dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'hours', true) / 24, 10)
    const hours = parseInt(dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'hours', true) % 24)
    const minutes = parseInt(dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'minutes', true) - daytype3 * 24 * 60 - hours * 60, 10)
    result = (daytype3 == 0 ? '' : daytype3 + '天') + hours + '小时' + minutes + '分钟'
    return inFuture ? '0天0小时0分' : result
  } else if (type == '3') {
    // 3按照24小时计算显示天数和小时
    date0 = dayjs(startTime).valueOf()
    unit = ''
    const daytype3 = parseInt(dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'hours', true) / 24, 10)
    result = (daytype3 == 0 ? '当' : daytype3) + '天' + parseInt(dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'hours', true) % 24) + '小时'
    return inFuture ? '0天0小时' : result
  } else if (type == '2') {
    // 24小时计算只显示天数
    date0 = dayjs(startTime).valueOf()
    result = dayjs(dayjs(endTime || undefined).valueOf()).diff(dayjs(date0), 'days')
  } else {
    // 0按自然日当天算0天，1按自然日当天算1天
    date0 = dayjs(dayjs(startTime).format('YYYY-MM-DD') + ' 00:00:00').valueOf()
    date1 = dayjs(dayjs(endTime || undefined).format('YYYY-MM-DD') + ' 00:00:00').valueOf()
    let days = dayjs(date1).diff(dayjs(date0), 'days')
    if (type == '1') days = days + 1
    result = days // 自然天数
  }
  return inFuture ? (0 + unit) : result === 0 ? (type == '5' ? '术日' : '当' + unit) : (result + unit)
}
// 床位列表格式化
export function bedListFormat(arr, params, sexDictData, patientRationData) {
  const list = arr.map((item, index) => {
    if (item.patientInfo != null) {
      item.icuRecordId = item.patientInfo.icuInfoEntity.icuRecordId
      const patientInfo = patientInfoFormat(item.patientInfo, params, sexDictData, patientRationData)
      item.patientInfo = patientInfo.patientInfo // 格式化数据
    }
    item.authorExpirationDay = dayjs(dayjs(item.expireTime?.split(' ')[0] + ' 23:59:59').valueOf() + 1000).diff(dayjs(dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf()), 'days')
    return item
  })
  store.commit('set_patientList', list)
  return list
}
/**
 * 对患者信息进行格式化
 * @sexDictData 性别字典
 * @patientRationData 家庭关系字典
 */
export function patientInfoFormat(patientInfo, params, sexDictData, patientRationData) {
  const tempInfo = JSON.parse(JSON.stringify(patientInfo))
  if (tempInfo != null) {
    if (tempInfo.patientEntity != null) {
      if (sexDictData && tempInfo.patientEntity.sexDict != null) {
        tempInfo.patientEntity.sexDictName = filterArrValue(tempInfo.patientEntity.sexDict, sexDictData, 'dictCode', 'dictName', '未知')
      }
      if ((!tempInfo.patientEntity.sexDict || tempInfo.patientEntity.sexDict == '0') && tempInfo.patientEntity.idNo) {
        // 如果没有性别 且存在身份证号
        tempInfo.patientEntity.sexDict = analyzeIDCard(tempInfo.patientEntity.idNo).sexDict
        tempInfo.patientEntity.sexDictName = filterArrValue(tempInfo.patientEntity.sexDict, sexDictData, 'dictCode', 'dictName', '未知')
      }
      // if (tempInfo.patientEntity.birthday) {
      //     tempInfo.patientEntity.patientAge = analyzeBirthday(tempInfo.patientEntity.birthday).age
      // }

      if (patientRationData && tempInfo.patientEntity.emergencyRealName == null) {
        tempInfo.patientEntity.emergencyRealName = filterArrValue(tempInfo.patientEntity.emergencyReal, patientRationData, 'dictCode', 'dictName', tempInfo.patientEntity.emergencyReal || '')
      }
    } else {
      tempInfo.patientEntity = {
        address: '',
        birthday: '',
        bloodTypeDict: '',
        countryDict: '',
        educationDict: '',
        email: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyReal: '',
        idNo: '',
        nationDict: '',
        patientId: '',
        patientName: '',
        phone: '',
        professionDict: '',
        sexDict: '',
        patientAge: '',
        emergencyRealName: '',
        sexDictName: ''
      }
    }
    tempInfo.diagInfo = ''
    // 诊断信息
    if (tempInfo?.diagList?.length > 0) {
      // 系统里取诊断信息的排序规则：只取诊断类型为1/2的诊断，按优先主辅标识、其次诊断下达时间进行排序（主诊断时间早-主诊断时间晚-辅诊断时间早-辅诊断时间晚）

      const diagListTemp = cloneDeep(tempInfo.diagList)
      // 系统里取诊断信息的排序规则：只取诊断类型为1/2的诊断，按优先主辅标识、其次诊断下达时间进行排序（主诊断时间早-主诊断时间晚-辅诊断时间早-辅诊断时间晚）
      // diagListTemp = diagListTemp.filter(item => ['1', '2'].includes(item.diagTypeDict))
      // diagListTemp = orderBy(diagListTemp, ['diagLevelDict', 'diagTime'], ['asc', 'desc']) // 按照时间  以及诊断级别排序
      // diagListTemp = groupBy(diagListTemp, 'diagTime') // 按照时间分组
      // const diagListHistory = []
      // for (const diagTime in diagListTemp) {
      //   const diagInfoByTime = diagListTemp[diagTime]
      //   diagListHistory.push({
      //     diagTime: diagTime,
      //     diagName: map(diagInfoByTime, 'diagName'),
      //     diagCode: map(diagInfoByTime, 'diagCode')
      //   })
      // }
      if (params?.XTCS0093 == '1') {
        tempInfo.diagInfo = [...new Set(map(diagListTemp, 'diagName'))].join('、')
      } else tempInfo.diagInfo = map(diagListTemp, 'diagName').join('、')
    } else {
      tempInfo.diagInfo = ''
    }
    // 过敏信息
    if (tempInfo.allergyList.length > 0) {
      let list = tempInfo.allergyList.map((item) => {
        return JSON.parse(item.allergyInfo).dictName
      })
      list = [...new Set(list)]
      tempInfo.allergyInfo = list.toString()
    } else {
      tempInfo.allergyInfo = ''
    }
  }
  const resultPatient = {
    bedNo: tempInfo?.icuInfoEntity?.bedNo || '',
    patientInfo: tempInfo,
    icuRecordId: tempInfo.icuInfoEntity.icuRecordId
  }
  return resultPatient
}

// 获取icon.json数据
export function getStaticJson(path) {
  return new Promise((resolve, reject) => {
    axios.get(path).then(
      (response) => {
        resolve(response.data)
      },
      (error) => {
        reject(error)
      }
    )
  })
}
// 获取药品列表  drug list his同步  后续可能需要修改
export function getDrugBasicData(searchKey) {
  return new Promise((resolve, reject) => {
    const query = {
      pageSize: 200,
      pageNum: 1
    }
    if (searchKey != '') {
      query.searchKey = searchKey
    }
    drug_findAllWithPage(query).then((res) => {
      if (res.code == 0) {
        resolve(res.data.result)
      }
    })
  })
}
// 获取参数配置
export const getParams = function (paramGroupCode) {
  return new Promise((resolve, reject) => {
    const query =
      typeof paramGroupCode == 'string'
        ? {
            pageNum: 1,
            pageSize: 1000,
            paramGroupCode
          }
        : Object.assign(
            {
              pageNum: 1,
              pageSize: 1000
            },
            paramGroupCode
          )
    param_findWithPage(query)
      .then((res) => {
        if (res.code === 0) {
          const paramArr = []
          res.data.result.forEach((item) => {
            paramArr.push(item)
          })
          resolve(paramArr)
        } else {
          reject([])
        }
      })
      .catch(() => {
        reject([])
      })
  })
}
// 获取参数配置
export const queryParam = function (paramGroupCode) {
  return new Promise((resolve, reject) => {
    if (typeof paramGroupCode == 'object') {
      if ({}.hasOwnProperty.call(store.getters.paramCodeObj, paramGroupCode.paramCode)) {
        resolve(store.getters.paramCodeObj[ paramGroupCode.paramCode])
        return
      }
    }
    // console.log('paramGroupCode', paramGroupCode)
    const query =
      typeof paramGroupCode == 'string'
        ? {
            pageNum: 1,
            pageSize: 1000,
            paramGroupCode
          }
        : Object.assign(
            {
              pageNum: 1,
              pageSize: 1000
            },
            paramGroupCode
          )
    param_queryParam(query)
      .then((res) => {
        if (res.code === 0) {
          if (res.data) {
            store.commit('set_param', { [res.data.paramCode]: [res.data] })
            resolve([res.data])
          } else {
            resolve([{}])
          }
        } else {
          reject([])
        }
      })
      .catch(() => {
        reject([])
      })
  })
}
/**
 * 过滤数组中对应的值
 * @value 为唯一标识符 必填
 * @arr 是供筛选的数组 必填
 * @key 筛选关键字 必填
 * @callbackKey 返回的关键字 必填
 * @message 空值的替换值 非必填
 * @callbackType 返回结果的类型  有些页面是需要返回code集合 有些返回code 有些是返回name集合 主要有codeArr code nameArr Name
 */
export function filterArrValue(value, arr, key, callbackKey, message, callbackType) {
  let result = message || ''

  if (value == null) return result
  if (arr.length > 0) {
    let valueArr = []
    value = value + ''
    if (value.indexOf('[') > -1) valueArr = JSON.parse(value)
    // JSON.stringify() 处理过的值
    else if (value.indexOf(',') > -1) valueArr = value.split(',')
    // [].toString() 处理过的值
    else valueArr.push(value) // 单纯的字符串或者数组

    const resultValue = arr.filter((item) => valueArr.includes(item[key]))

    if (resultValue.length > 0) {
      result = resultValue.map((item) => {
        if (callbackType && callbackType.indexOf('code') > -1) {
          return item[key]
        } else {
          return item[callbackKey]
        }
      })
      if ((callbackType && callbackType.indexOf('name') > -1) || !callbackType) {
        result = result.toString()
      }
    }
  }
  return result
}
/**
 * // 对比两个对象的值是否完全相等 返回值 true/false
 */
export const isObjectValueEqual = function (a, b) {
  // 取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  // 判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false
  }
  // 循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

/**
 * hmtl字符串 删除所有 style的样式
 * 进入比如 '<p style="kkkkk"></p><span style="kkkkk"></span>'
 * 出去 '<p ></p><span ></span>'
 */
export const htmlDeleteStyle = (str) => {
  return str?.replace(/style=\"(.*?)\"/g, '')
}

/** 获取护理文书关键字列表  匹配${xxxx} */
export const getKey = function (str) {
  const arr = str?.match(/\${.*?\}/g) || []
  const keyList = []
  if (!arr) return []
  arr.forEach((item) => {
    let value = item.replace('${', '')
    value = value.replace('}', '')
    keyList.push(value)
  })
  return keyList
}
// 获取或新增或者修改用户关联病区主题皮肤
export const handleCurrentSkin = async function (val = '', username = store.getters.userInfo?.userName, wardCode = store.getters.currentUserWard?.wardCode) {
  // 系统主题皮肤
  const defaultSkinCode = store.getters.systemInfo?.defaultTheme
  // 用户关联病区主题皮肤
  let curSkin = val
  const root = document.documentElement
  // 用户工号和病区编码存在，当前皮肤取值
  if (username && wardCode) {
    localStorage.setItem(`${username}_wardCode`, wardCode)
    const query = {
      username,
      wardCode
    }
    // val = null时使用缓存皮肤
    if (val !== null) {
      // 获取用户关联病区主题皮肤
      await userTheme_getUserThemeByWardCodeUsername(query)
        .then(async (res) => {
          if (res.data) {
            if (val) {
              // 传入的皮肤有值并与用户关联病区主题皮肤不一致，修改
              if (val !== res.data.theme) {
                store.getters.userInfo &&
                  (await userTheme_editUserTheme({
                    theme: val,
                    id: res.data.id
                  })
                    .then(() => {
                      curSkin = val
                    })
                    .catch(() => {
                      // 接口调用失败，使用系统默认皮肤或主题蓝
                      curSkin = defaultSkinCode || store.getters.sysSkinList[0].id
                    }))
              }
            } else {
              // 传入的皮肤无值，使用用户关联病区主题皮肤
              curSkin = res.data.theme
            }
          } else {
            // 传入的皮肤有值，用户关联病区无主题皮肤，新增
            if (val) {
              store.getters.userInfo &&
                (await userTheme_insertUserTheme({
                  theme: val,
                  ...query
                })
                  .then(() => {
                    curSkin = val
                  })
                  .catch(() => {
                    // 接口调用失败，使用系统默认皮肤或主题蓝
                    curSkin = defaultSkinCode || store.getters.sysSkinList[0].id
                  }))
            } else {
              // 传入的皮肤无值，用户关联病区无主题皮肤，使用系统默认皮肤
              curSkin = defaultSkinCode
            }
          }
        })
        .catch(() => {
          // 接口调用失败，使用系统默认皮肤或主题蓝
          curSkin = defaultSkinCode || store.getters.sysSkinList[0].id
        })
    } else {
      // 使用缓存皮肤
      curSkin = store.getters.currentUserSkin
    }
  } else {
    // 用户工号和病区编码不存在，当前皮肤取值
    curSkin = val || defaultSkinCode || store.getters.sysSkinList[0].id
  }
  // 缓存当前使用的主题皮肤
  store.commit('set_currentUserSkin', curSkin || store.getters.sysSkinList[0].id)
  // 设置主题皮肤样式
  if (parseFloat(curSkin).toString() != 'NaN' && store.getters.sysSkinList[curSkin - 1].colorList) {
    let curSkinObj = store.getters.sysSkinList.find(item => item.id == curSkin)
    if (!curSkinObj) {
      curSkinObj = store.getters.sysSkinList[0]
    }
    curSkinObj.colorList.forEach((color) => {
      root.style.setProperty(color.name, color.color)
    })
  }
}

// 判断是否是JOSN字符串
export const isJSON_test = function (str) {
  if (typeof str == 'string') {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
}

export const verificationRuleUtils = async function (patientId, icuRecordId, templetId, beginTime, endTime, param, controlNode, operatorCode, operatorName, cb = () => {}) {
  const wardCode = store.getters.currentUserWard?.wardCode
  const rs = await verification_doVerifiy({ wardCode, patientId, icuRecordId, templetId, beginTime, endTime, param, controlNode, operatorCode, operatorName })
  const res = rs.data
  return new Promise((resolve, reject) => {
    try {
      if (res.success || res.controlType == '0') {
        resolve(res)
      } else {
        store.commit('set_dragMsg', { controlType: res.controlType, controlNode: controlNode, msg: res.msg, isFixShow: true, cb })
        reject(res)
      }
    } catch (error) {
      reject(error)
    }
  })
}
export const verification_queryVerifiyLogUtils = async function (wardCode, userName) {
  const res = await verification_queryVerifiyLog({ wardCode })
  const array = res.data
  let dragMsgText = ''
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    dragMsgText += `${element.patientName} ${element.bedNo || ''} ${element.sex || ''}\n`
    dragMsgText += element.messages.map((v) => v.messag).join('\n')
    dragMsgText += '\n'
  }
  store.commit('set_dragMsg', { dragMsgText: dragMsgText || '' })
  await store.dispatch('userPersonalizedConfig', { userName })
  const configCode = '提示框设置'
  const compare = store.state.app.userPersonalizedConfig.filter((v) => v.configCode == configCode)
  const defaultConfig = { isShow: true, w: 300, h: 200, x: document.documentElement.clientWidth - 300, y: document.documentElement.clientHeight - 200, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight }
  const newConfig = Object.assign({}, defaultConfig, compare[0]?.configValue || defaultConfig, { isShow: true })
  newConfig._w = newConfig._w || newConfig.w
  newConfig._h = newConfig._h || newConfig.h
  newConfig._x = newConfig._x || newConfig.x
  newConfig._y = newConfig._y || newConfig.y
  newConfig.clientWidth = newConfig.clientWidth || document.documentElement.clientWidth
  newConfig.clientHeight = newConfig.clientHeight || document.documentElement.clientHeight
  newConfig.w = Math.min((newConfig._w / newConfig.clientWidth) * document.documentElement.clientWidth, document.documentElement.clientWidth - 10)
  newConfig.h = Math.min((newConfig._h / newConfig.clientHeight) * document.documentElement.clientHeight, document.documentElement.clientHeight - 10)
  newConfig.x = Math.max((newConfig._x / newConfig.clientWidth) * document.documentElement.clientWidth, 0)
  newConfig.y = Math.max((newConfig._y / newConfig.clientHeight) * document.documentElement.clientHeight, 0)
  const configValue = compare.length == 1 ? newConfig : defaultConfig
  store.dispatch('userPersonalizedConfig', { configCode, configValue, userName })
  return new Promise((resolve, reject) => {
    try {
      resolve(dragMsgText)
    } catch (error) {
      reject(error)
    }
  })
}
export const findArray = function (list, code, name) {
  const array = list.filter((v) => v[code] == name)
  return array && array[0]
}

export const getStartAndEndTime = function(recordTime, shiftList, shiftCode) {
  const shiftObj = shiftList.find(item => item.shiftCode == shiftCode)
  let startTime = recordTime + ' ' + shiftObj.startTime
  let endTime = recordTime + ' ' + shiftObj.endTime
  if (dayjs(endTime).valueOf() <= dayjs(startTime).valueOf()) {
    endTime = dayjs(dayjs(endTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
  } else if (dayjs(startTime).valueOf() < dayjs(recordTime + ' ' + shiftList[0].startTime).valueOf()) {
    startTime = dayjs(dayjs(startTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
    endTime = dayjs(dayjs(endTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
  return {
    startTime,
    endTime
  }
}
