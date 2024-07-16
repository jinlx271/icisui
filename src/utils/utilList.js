import {
  getTraceObsRecord,
  getDigitalObsRecord_api, // 获取检测项数据
  getObsRecordNew_api, // 定时描点
  searchAllOrOut, // 查询事件列表
  saveIntervalObsRec_api, // 补点
  searchIOAmoutDetail_api, // 获取出入量汇总数据
  updateEventTime, // 更新事件时间 用药拖动后
  updobsdat, // 更新数据
  searchTimesByCode, // 查询时间
  totleIoEvent_api, // 出入量
  saveMedicalEventDetail // 拖动流速点
} from '@/api/anas'
import dayjs from 'dayjs'
import store from '@/store'
import variables from '@/styles/variables.scss'
import { Notification } from 'element-ui'
import { compareBeginEndTime } from './index'
function stringify(item) {
  var str = sessionStorage.getItem(item)
  if (str) {
    return JSON.parse(str)
  } else {
    return {}
  }
}
function getSpecialIconItem(list_item, vm, startTime, index, print) {
  const item = {
    ev_list: Object.assign({}, list_item),
    value: [self.translateTimeValue(startTime / 1000, vm.timeArr49[vm.view.pageCur]), globalConfig.xuhaoSignSpecialEventShowIcon == 1 ? (print ? 1 : 1.5) : 5],
    name: list_item.name,
    startTime: startTime,
    symbol: 'path://' + list_item.svg,
    symbolSize: 15,
    label: {
      show: true,
      formatter: '',
      position: [3, -13]
    },
    itemStyle: {
      normal: {
        color: list_item.color || 'black'
      }
    }
  }
  if (!list_item.svg) {
    item.name = list_item.codeName
    item.symbol = 'image://app/img/white.png'
    item.symbolSize = [10, 15]
    item.label.formatter = index + ''
    item.label.position = [0, 0]
    item.label.fontSize = print ? 12 : 15
    item.label.show = true
  }
  if (print) {
    item.symbolSize = 12
  }
  return item
}
function getNumItem(backlistCopy, value, print, startTime, index) {
  const item = {
    ev_list: Object.assign({}, backlistCopy),
    value,
    name: backlistCopy.title || backlistCopy.codeName || backlistCopy.name || (backlistCopy.eventName == 'checkeventList' ? '血气分析' : ''),
    symbol: 'image://app/img/white.png',
    startTime: startTime,
    symbolSize: print ? 12 : 15,
    label: {
      show: true,
      formatter: '',
      position: [3, print ? -3 : -4]
    },
    itemStyle: {
      normal: {
        color: '#000'
      }
    }
  }
  item.symbolSize = [10, 15]
  item.label.formatter = index + ''
  item.label.fontSize = print ? 12 : 15
  item.label.show = true
  return item
}
const self = {
  PAGES1: [],
  PAGES2: [],
  ev_list: {},
  timer: null,
  // 计算手术时长和麻醉监测时长
  computedTotalTime(timeArr, notDefaultNow) {
    let operStartTime = ''
    let operEndTime = ''
    let anesStartTime = ''
    let anesEndTime = ''
    let totalOperTime = ''
    let totalAnaesTime = ''
    timeArr.map(item => {
      if (item.code === 4) {
        operStartTime = item.value
      }
      if (item.code === 5) {
        operEndTime = item.value || (notDefaultNow ? '' : new Date().getTime())
      }
      if (item.code === 2) {
        anesStartTime = item.value
      }
      if (item.code === 8) {
        anesEndTime = item.value || (notDefaultNow ? '' : new Date().getTime())
      }
    })
    if (operStartTime && operEndTime) {
      totalOperTime = Math.ceil((operEndTime - operStartTime) / 1000)
    }
    if (anesStartTime && anesEndTime) {
      totalAnaesTime = Math.ceil((anesEndTime - anesStartTime) / 1000)
    }
    return {
      totalOperTime,
      totalAnaesTime
    }
  },
  /**
   * 比较事件时间 用于判断入室 出室 麻醉开始结束 时间顺序是否合理
   * @param {Array} timeArr 时间列表
   * @param {Number} index  当前修改的时间的index
   * @param {Number|String|Date} value  当前修改的时间的值
   * @param {Object} config  全局配置 globalConfig和一些其他配置
   * @return {Boolean}
   */
  compareEventTime(timeArr, index, value, config, vm) {
    let nextIndex = +index + 1
    let prevIndex = index - 1
    if (nextIndex === 2 || nextIndex === 5) {
      nextIndex++
    }
    if (prevIndex === 2 || prevIndex === 5) {
      prevIndex--
    }
    // 拔管时间必须大于插管时间
    if (+index === 5) {
      prevIndex = 2
      nextIndex = Infinity
    }
    // 插管时间必须大于麻醉开始时间小于拔管时间
    if (+index === 2) {
      nextIndex = 5
      prevIndex = -1
    }
    if (index > 0) {
      if (
        config.timearr_time_control !== '1' && timeArr[prevIndex] &&
          timeArr[prevIndex].value &&
          new Date(value) - new Date(timeArr[prevIndex].value) <= 0
      ) {
        vm.$message({
          message: `${timeArr[index].label}时间必须大于${timeArr[prevIndex].label}时间`,
          type: 'error'
        })
        return false
      } else if (
        config.timearr_time_control !== '1' && timeArr[nextIndex] &&
          timeArr[nextIndex].value &&
          new Date(value) - new Date(timeArr[nextIndex].value) > 0
      ) {
        vm.$message({
          message: `${timeArr[index].label}时间必须小于${timeArr[nextIndex].label}时间`,
          type: 'error'
        })
        return false
      } else {
        const compareResult = compareBeginEndTime(timeArr, index, value)
        if (compareResult) {
          vm.$message({
            message: compareResult.message,
            type: 'error'
          })
          return false
        }
        return true
      }
    } else {
      if (timeArr[1].value && new Date(value) > timeArr[1].value) {
        vm.$message.error(`入室时间不能大于${timeArr[1].label}时间`)
        return false
      }
      return true
    }
  },
  // 拖动用药/输液
  async upEOption1(
    vm,
    dataIndex,
    transdata,
    cb
  ) {
    if (transdata[dataIndex]['value'][0] < 0) {
      transdata[dataIndex]['value'][0] = 0
    }
    const eventObj = transdata[dataIndex].ev_list
    // 流速点
    if (
      typeof eventObj.dosage === 'undefined' &&
      !eventObj.dosageAmount &&
      !eventObj.value &&
      (eventObj.type == 'zl' || eventObj.type == 'mz')
    ) {
      const insertTime =
        this.translateTimeValue(transdata[dataIndex]['value'][0], vm.timeArr49[vm.view.pageCur]) *
        1000
      await saveMedicalEventDetail(
        Object.assign(
          {
            insertTime,
            docId: vm.docId
          },
          eventObj
        )
      )
    } else {
      const type = {
        zl: 1,
        mz: 2,
        zt: 3,
        sy: 'I',
        cl: 'O',
        sx: 'I'
      }
      let id = ''
      let key = ''
      switch (eventObj.type) {
        case 'zl':
          id = eventObj.medEventId
          key = 'medEventId'
          break
        case 'mz':
          break
        case 'zt':
          break
        case 'sy':
        case 'sx':
          id = eventObj.inEventId
          key = 'inEventId'
          break
        case 'cl':
          id = eventObj.egressId
          key = 'egressId'
          break
      }
      const _obj = {
        docId: vm.docId,
        id: id,
        type: type[eventObj.type],
        subType: '',
        docType: vm.docType
      }
      const startIndex = transdata.findIndex((item) => {
            return item.ev_list[key] === id
          })
      if (eventObj.endTime) {
        // 拖动的是结束点
        if (eventObj.dosage != undefined && eventObj.showFlow == undefined && eventObj.showThick == undefined) {
          _obj.startTime = dayjs(eventObj.startTime).format('YYYY-MM-DD HH:mm:ss')
          _obj.endTime = dayjs(
            this.translateTimeValue(transdata[dataIndex]['value'][0], vm.timeArr49[vm.view.pageCur]) *
            1000
          ).format('YYYY-MM-DD HH:mm:ss')
        } else {
          _obj.endTime = dayjs(eventObj.endTime).format('YYYY-MM-DD HH:mm:ss')
          _obj.startTime = dayjs(
            this.translateTimeValue(transdata[dataIndex]['value'][0], vm.timeArr49[vm.view.pageCur]) *
            1000
          ).format('YYYY-MM-DD HH:mm:ss')
        }
        // _obj.startTime = dayjs(eventObj.startTime).format('YYYY-MM-DD HH:mm:ss')
        // _obj.endTime = dayjs(
        //   this.translateTimeValue(transdata[dataIndex]['value'][0], vm.timeArr49[vm.view.pageCur]) *
        //     1000
        // ).format('YYYY-MM-DD HH:mm:ss')
      } else {
        _obj.startTime = dayjs(
          this.translateTimeValue(transdata[dataIndex]['value'][0], vm.timeArr49[vm.view.pageCur]) *
            1000
        ).format('YYYY-MM-DD HH:mm:ss')
        _obj.endTime = ''
      }
      await updateEventTime(_obj)
      eventObj.startTime = dayjs(_obj.startTime).valueOf()
      eventObj.endTime = _obj.endTime ? dayjs(_obj.endTime) : ''
      transdata[startIndex].ev_list.endTime = dayjs(_obj.endTime).valueOf()
      cb(startIndex)
    }
    // self.getobsData(vm, regOptId, docId, ev_list, mergeobj)
  },
  // 拖动监测项
  upEOption2(
    vm,
    dataIndex,
    transdata,
    entitydata,
    obj,
    config,
    regOptId,
    docId,
    ev_list,
    pageSize,
    mergeobj
  ) {
    let transdata_dataIndex = {}
    transdata_dataIndex = Object.assign(
      {},
      transdata.filter((v, i) => {
        return i === dataIndex
      })[0]
    )
    transdata_dataIndex.value = transdata_dataIndex.units === '℃' ? Math.round(transdata_dataIndex.value[1] * 10) / 10 : Math.round(transdata_dataIndex.value[1])

    updobsdat(
      Object.assign(
        {
          docId: vm.docId,
          docType: vm.docType
        },
        transdata_dataIndex
      )
    )
    self.getobsData(vm, regOptId, docId, ev_list, mergeobj)
  },
  filterNIBPART(vm, data) {
    if (!vm.obsMonitorShowList) {
      return data.value
    }
    const hidewu = vm.obsMonitorShowList.filter(v => v.type == '1')
    const hideyou = vm.obsMonitorShowList.filter(v => v.type == '2')
    if (hidewu.length > 0 && (data.observeId == '30004' || data.observeId == '30005')) {
      const inArea = hidewu.filter(v => data.time >= v.showStartTime && data.time <= v.showEndTime)
      if (inArea.length > 0) {
        return null
      } else {
        return data.value
      }
    } else if (hideyou.length > 0 && (data.observeId == '30043' || data.observeId == '30044')) {
      const inArea = hideyou.filter(v => data.time >= v.showStartTime && data.time <= v.showEndTime)
      if (inArea.length > 0) {
        return null
      } else {
        return data.value
      }
    } else {
      return data.value
    }
  },
  getSeries(result, vm, print) {
    // 生成检测项瞄点数据
    const res = []
    const svgPath = `M426.1,91.7H423c-11,0-19.8,8.8-19.8,19.8v212.4c0,11,8.8,19.8,19.8,19.8h3.1c11,0,19.8-8.8,19.8-19.8V111.3
    C446,100.5,437,91.7,426.1,91.7L426.1,91.7z M426.1,91.7,M223.5,439.9l1.6,2.7c5.5,9.5,17.6,12.7,27.1,7.3L436,343.6c9.5-5.5,12.7-17.6,7.3-27.1l-1.6-2.7
    c-5.5-9.5-17.6-12.7-27.1-7.3L230.6,412.9C221.2,418.3,218.1,430.5,223.5,439.9L223.5,439.9z M223.5,439.9,M624.1,442.6l1.6-2.7c5.5-9.5,2.3-21.6-7.3-27.1L434.5,306.6c-9.5-5.5-21.6-2.3-27.1,7.3l-1.6,2.7
    c-5.5,9.5-2.3,21.6,7.3,27.1l184.1,106.3C606.5,455.3,618.7,451.9,624.1,442.6L624.1,442.6z M624.1,442.6`
    const breathOpt = [{
      type: 'scatter',
      symbol: `path://${svgPath}`,
      label: {
        show: true,
        color: '#000',
        position: 'top',
        formatter: function(params) {
          return params.data.f
        }
      },
      data: [],
      z: 3
    },
    {
      type: 'scatter',
      symbol: `path://`, // 只展示一个图标
      label: {
        show: true,
        color: '#000',
        position: 'left',
        offset: [2, 8],
        formatter: function(params) {
          return params.data.vt
        }
      },
      data: [],
      z: 3
    },
    {
      type: 'scatter',
      symbol: `path://`,
      label: {
        show: true,
        color: '#000',
        position: 'right',
        offset: [-2, 8],
        formatter: function(params) {
          return params.data.ie
        }
      },
      data: [],
      z: 3
    }]
    for (let i = 0; i < result.series.length; i++) {
      res.push(
        Object.assign({}, JSON.parse(JSON.stringify(result.series[i])), {
          lineStyle: {
            normal: {
              width: 1,
              color: result.series[i].color ? result.series[i].color : 'black'
            }
          },
          itemStyle: {
            normal: {
              color: result.series[i].color ? result.series[i].color : undefined
            }
          },
          id: result.series[i].name,
          smooth: 0,
          symbol: result.series[i].symbolSvg ? 'path://' + result.series[i].symbolSvg : '',
          animation: false,
          connectNulls: false, // 断点不连线
          symbolSize: print ? 7 : 13, // 监测图标大小
          z: 3
        })
      )
      for (let j = 0; j < result.series[i].data.length; j++) {
        if (vm.timeArr49) {
          result.series[i].data[j].value = self.filterNIBPART(vm, result.series[i].data[j])
          res[i].data[j].value = [
            this.translateTimeValue(
              result.series[i].data[j].offsetTime
                ? result.series[i].data[j].offsetTime
                : result.series[i].data[j].time / 1000,
              vm.timeArr49[vm.view.pageCur]
            ),
            result.series[i].data[j].value
          ]

          res[i].data[j].numValue = result.series[i].data[j].value
          res[i].data[j].units = res[i].units
          if (result.series[i].data[j].symbolSvg) {
            res[i].data[j].symbol = 'path://' + result.series[i].data[j].symbolSvg
          } else {
            res[i].data[j].symbol = undefined
            res[i].data[j].symbolSvg = undefined
          }
          // 如果是控制呼吸 并且有呼吸机参数
          if (res[i].name === 'RR' && res[i].data[j].f) {
            if (res[i].data[j].value[1]) {
              breathOpt[0].data.push(Object.assign({}, res[i].data[j], {
                value: [res[i].data[j].value[0], +res[i].data[j].value[1] + 10],
                symbol: `path://${svgPath}`,
                symbolSize: print ? 7 : 13, // 监测图标大小
                isBreathOpt: 1,
                seriesName: 'RR'
              }))
              breathOpt[1].data.push(Object.assign({}, res[i].data[j], {
                value: [res[i].data[j].value[0], +res[i].data[j].value[1] + 10],
                symbol: `path://${svgPath}`,
                symbolSize: print ? 7 : 13, // 监测图标大小
                isBreathOpt: 1,
                seriesName: 'RR'
              }))
              breathOpt[2].data.push(Object.assign({}, res[i].data[j], {
                value: [res[i].data[j].value[0], +res[i].data[j].value[1] + 10],
                symbol: `path://${svgPath}`,
                symbolSize: print ? 7 : 13, // 监测图标大小
                isBreathOpt: 1,
                seriesName: 'RR'
              }))
            } else {
              breathOpt[0].data.push(Object.assign({}, res[i].data[j], {
                value: res[i].data[j].value,
                symbol: `path://${svgPath}`,
                isBreathOpt: 1,
                seriesName: 'RR',
                symbolSize: print ? 7 : 13 // 监测图标大小
              }))
              breathOpt[1].data.push(Object.assign({}, res[i].data[j], {
                value: res[i].data[j].value,
                symbol: `path://${svgPath}`,
                isBreathOpt: 1,
                seriesName: 'RR',
                symbolSize: print ? 7 : 13 // 监测图标大小
              }))
              breathOpt[2].data.push(Object.assign({}, res[i].data[j], {
                value: res[i].data[j].value,
                symbol: `path://${svgPath}`,
                isBreathOpt: 1,
                seriesName: 'RR',
                symbolSize: print ? 7 : 13 // 监测图标大小
              }))
            }
          }
        }
      }
    }
    res.push(...breathOpt)
    // 给监测项画Y轴实线
    var markLine = {
      silent: true,
      z: 1,
      symbolSize: 0,
      lineStyle: {
        normal: {
          color: globalConfig.label_color || variables.label_color // 这里改颜色
        }
      },
      tooltip: {
        trigger: 'none'
      },
      data: [{
        yAxis: 40,
        lineStyle: {
          normal: {
            type: 'solid'
          }
        }
      }, {
        yAxis: 60,
        lineStyle: {
          normal: {
          }
        }
      }, {
        yAxis: 120,
        lineStyle: {
          normal: {
          }
        }
      }, {
        yAxis: 180,
        lineStyle: {
          normal: {
            type: 'solid'
          }
        }
      }]
    }
    res[0].markLine = markLine // 配置了hideMarkLine就不要划横线
    var lineColor = globalConfig.label_color || variables.label_color // 默认是红色red
    if (!print) {
      const xMarkLine = vm.timeArr49[vm.view.pageCur].map((item, index) => {
        return {
          z: 1,
          name: '',
          xAxis: index,
          lineStyle: {
            type: 'dotted',
            width: 1,
            color: lineColor,
            opacity: 0
          },
          emphasis: {
            lineStyle: {
              type: 'solid',
              width: 1,
              color: lineColor,
              opacity: 0
            }
          }
        }
      })
      if ((vm.pageState === 0 && vm.operState === '04') ||
      (vm.pageState === 3 && vm.operState === '05')) {
        xMarkLine.push({
          xAxis: self.translateTimeValue(new Date().getTime() / 1000, vm.timeArr49[vm?.view?.pageCur]),
          lineStyle: {
            type: 'solid',
            width: 2,
            color: '#FE7B00'
          }
        })
      }

      res.push({
        animation: false,
        type: 'line',
        data: [],
        z: 1,
        markLine: {
          symbolSize: 0,
          name: '',
          tooltip: {
            trigger: 'item',
            formatter(params) {
              const name = dayjs(self.translateTimeValue(params.data.xAxis, vm.timeArr49[vm.view.pageCur]) * 1000).format('YYYY-MM-DD HH:mm:ss')
              return (
                '<div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
              params.color +
              '"></i>' +
              name +
              '</div>'
              )
            }
          },
          data: xMarkLine
        }
      })
    }
    return res
  },
  /**
   * 时间值与坐标相互转换
   * @param {Number} timestamp>100  时间戳  timestamp<100 坐标值
   * @param {Array} dataArr  当前页面的 时间轴  length 49
   */
  translateTimeValue(timestamp, dataArr) {
    if (timestamp < 0 || !dataArr) {
      return []
    }
    if (timestamp > 100) {
      // 传入时间戳
      for (var j = 0; j < dataArr.length; j++) {
        if (timestamp == dataArr[j][0]) {
          return j
        } else if (timestamp < dataArr[j][0]) {
          if (j < 1) {
            // 时间戳比第一个点还小
            return -1
          } else if (j < dataArr.length) {
            // 显示时间范围内的点
            var floatdiget = parseFloat(
              ((timestamp - dataArr[j - 1][0]) / dataArr[j - 1][2]).toFixed(3)
            )
            return j - 1 + floatdiget
          }
        } else if (timestamp > dataArr[dataArr.length - 1][0]) {
          // 比最后一个坐标还大
          return 50
        }
      }
    }
    if (timestamp < 100) {
      // 传入 数值轴
      for (let j = 0; j < dataArr.length; j++) {
        if (timestamp == j) {
          return dataArr[j][0]
        } else if (timestamp < j) {
          if (j < 1) {
            // 时间戳比第一个点还小
            return -1
          } else if (j < dataArr.length) {
            // 显示时间范围内的点
            // var floatdiget = parseFloat(((timestamp - dataArr[j - 1][0]) / dataArr[j - 1][2]).toFixed(3));
            var intD = dataArr[parseInt(timestamp)][0]
            var floatD = (timestamp - parseInt(timestamp)) * dataArr[j - 1][2]
            // return j - 1 + floatdiget;
            return parseInt(intD + floatD)
          }
        } else if (timestamp == -1) {
          // 比最后一个坐标还大
          return -1
        } else if (timestamp == 50) {
          // 比最后一个坐标还大
          return 50
        }
      }
    }
  },
  config(docType, isDrag, dir, eventList, obj) {
    const getMed = +docType === 2 ? this.getMed_pacu() : this.getMed() // 系统管理 基本配置  用药
    const getI = +docType === 2 ? this.getI_pacu() : this.getI() // 系统管理 基本配置  入量
    const getOther = +docType === 2 ? this.getOther_pacu() : this.getOther() // 系统管理 基本配置  其他
    const user = store.getters.userInfo
    const rowConfig = {
      // 各类配置项行数初始化
      mzConfig: getMed.mzyRows ? +getMed.mzyRows : 0,
      zlConfig: getMed.zlyRows ? +getMed.zlyRows : 0,
      ztConfig: 0,
      syConfig: getI.syRows ? +getI.syRows : 0,
      sxConfig: getI.sxRows ? +getI.sxRows : 0,
      clConfig: getOther.oRows ? +getOther.oRows : 0,
      mzyName: getMed.mzyName ? getMed.mzyName : '麻醉药',
      zlyName: getMed.zlyName ? getMed.zlyName : '治疗药',
      syName: getI.syName ? getI.syName : '输液',
      sxName: getI.sxName ? getI.sxName : '输血',
      oName: getOther.oName ? getOther.oName : '出量'
    }

    function splitNum(num) {
      var result = []
      for (var i = 0; i < num; i++) {
        result.push({
          index: i
        })
      }
      return result
    }

    if (user && !user.medIOSeparate) {
      return Object.assign(
        {},
        rowConfig,
        {
          // 返回各类别到最下边的总行数
          sum:
            rowConfig.clConfig +
            rowConfig.sxConfig +
            rowConfig.syConfig +
            rowConfig.ztConfig +
            rowConfig.zlConfig +
            rowConfig.mzConfig,
          mzTotal:
            rowConfig.clConfig +
            rowConfig.sxConfig +
            rowConfig.syConfig +
            rowConfig.ztConfig +
            rowConfig.zlConfig +
            rowConfig.mzConfig,
          zlTotal:
            rowConfig.clConfig +
            rowConfig.sxConfig +
            rowConfig.syConfig +
            rowConfig.ztConfig +
            rowConfig.zlConfig,
          ztTotal:
            rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig,
          syTotal: rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig,
          sxTotal: rowConfig.clConfig + rowConfig.sxConfig,
          clTotal: rowConfig.clConfig,
          mzArr: splitNum(rowConfig.mzConfig),
          zlArr: splitNum(rowConfig.zlConfig),
          ztArr: splitNum(rowConfig.ztConfig),
          syArr: splitNum(rowConfig.syConfig),
          sxArr: splitNum(rowConfig.sxConfig),
          clArr: splitNum(rowConfig.clConfig),
          dataLoaded: false,
          drag: isDrag, // 现在基本没限制 后期有需要再改
          dir: dir,
          event: [eventList]
        },
        obj
      )
    } else {
      return Object.assign(
        {},
        rowConfig,
        {
          // 返回各类别到最下边的总行数
          sum: rowConfig.ztConfig + rowConfig.zlConfig + rowConfig.mzConfig,
          mzTotal: rowConfig.ztConfig + rowConfig.mzConfig,
          zlTotal: rowConfig.ztConfig + rowConfig.zlConfig,
          ztTotal:
            rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig + rowConfig.ztConfig,
          syTotal: rowConfig.clConfig + rowConfig.sxConfig + rowConfig.syConfig,
          sxTotal: rowConfig.clConfig + rowConfig.sxConfig,
          clTotal: rowConfig.clConfig,
          mzArr: splitNum(rowConfig.mzConfig),
          zlArr: splitNum(rowConfig.zlConfig),
          ztArr: splitNum(rowConfig.ztConfig),
          syArr: splitNum(rowConfig.syConfig),
          sxArr: splitNum(rowConfig.sxConfig),
          clArr: splitNum(rowConfig.clConfig),
          dataLoaded: false,
          drag: isDrag != 1,
          dir: dir,
          event: [eventList]
        },
        obj
      )
    }
  },
  medOpt(col, vm, cfgSum) {
    var lineColor = globalConfig.label_color || variables.label_color // 默认是红色red
    document.body.style.setProperty('--label-color', lineColor)
    return {
      grid: {
        top: -1,
        right: 0,
        bottom: -1,
        left: -1
      },
      tooltip: {
        // 提示框显示
        formatter(params) {
          var intnum = parseInt(params.data.value[0])
          var floatnum = parseFloat((params.data.value[0] - intnum).toFixed(3))
          var timestamp
          if (!floatnum) {
            timestamp = vm.timeArr49[vm.view.pageCur][intnum][0]
          } else {
            timestamp =
              vm.timeArr49[vm.view.pageCur][intnum][0] +
              vm.timeArr49[vm.view.pageCur][intnum][2] * floatnum
          }
          return (
            '时间: ' +
            new Date(timestamp * 1000).toLocaleString() +
            '<br>' +
            '名称: ' +
            params.data.ev_list.name +
            '<br>'
          )
        }
      },
      xAxis: [
        {
          min: 0,
          max: 48,
          type: 'value',
          axisLine: {
            onZero: false,
            show: false
          },
          interval: 1,
          axisLabel: {
            rotate: 15,
            show: false,
            interval: 0,
            formatter(value, index) {
              // var date = new Date(value)
              // var texts = [date.getHours() + 1, date.getSeconds()]
              if (index % 2 === 0) {
                //  return new Date(parseInt(value) * 1000).toLocaleString();
                // + "," + dataArr[index][2]
                return index
              }
            }
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              type: 'dotted',
              opacity: 1// 0.5
            }
          }
        },
        {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              width: 1,
              opacity: 1
            }
          },
          data: [0, 1, 2, 3, 4, 5, 6, 7]
        }
      ],
      yAxis: [
        {
          min: 0,
          max: cfgSum * 3,
          interval: 3,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              type: 'dotted',
              opacity: 1// 0.5
            },
            interval: 0
          }
        }
      ],
      series: []
    }
  },
  monOpt(col, yArr) {
    return {
      grid: {
        top: -1,
        right: 0,
        bottom: 0,
        left: -1
      },
      tooltip: {
        formatter(params) {
          if (params.data.isBreathOpt == 1) {
            const seriesName = '呼吸机参数'
            const time = dayjs(params.data.time).format('YYYY-MM-DD HH:mm:ss')
            const f = params.data.f
            const vt = params.data.vt
            const ie = params.data.ie
            return (
              seriesName +
              '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
              params.color +
              '"></i>' +
              time +
              ' &nbsp;&nbsp;' +
              '<br/><span>f：' + f + '</span>' +
              '<br/><span>潮气量：' + vt + '</span>' +
              '<br/><span>I:E：' + ie + '</span>' +
              '</div>'
            )
          } else {
            const seriesName = params.seriesName
            const name = dayjs(params.data.time).format('YYYY-MM-DD HH:mm:ss')
            const value = Number(params.data.value[1]).toFixed(2)
            const unit = params.data.units
            return (
              seriesName +
            '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
            params.color +
            '"></i>' +
            name +
            ' &nbsp;&nbsp;' +
            value +
            '(' +
            unit +
            ')</div>'
            )
          }
        }
      },
      xAxis: [
        {
          min: 0,
          max: 48,
          type: 'value',
          axisLine: {
            onZero: false,
            show: false
          },
          interval: 1,
          axisLabel: {
            rotate: 15,
            show: false,
            interval: 0,
            formatter(value, index) {
              if (index % 2 == 0) {
                return index
              }
            }
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: globalConfig.label_color || variables.label_color, // 改颜色
              type: 'dotted',
              opacity: 1// 0.5
            }
          }
        },
        {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: globalConfig.label_color || variables.label_color, // 这里改颜色
              opacity: 1
            }
          },
          data: (() => {
            var list = []
            for (var i = 0; i < col; i++) {
              list.push(i)
            }
            return list
          })()
        }
      ],
      animation: false,
      yAxis: (() => {
        const res = []
        for (let i = 0; i < yArr.length; i++) {
          res.push({
            type: 'value',
            min: yArr[i].min,
            max: yArr[i].max,
            interval: yArr[i].interval,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          })
          // 显示找点区域X轴辅助线
          if (i === 0) {
            res[i].splitLine.show = true
            res[i].splitLine.lineStyle = {
              color: globalConfig.label_color || variables.label_color, // 这里改颜色
              type: 'dotted',
              opacity: 1// 0.5
            }
          }
        }
        return res
      })(),
      series: []
    }
  },
  markOpt(col) {
    var lineColor = globalConfig.label_color || variables.label_color // 默认是红色
    return {
      grid: {
        top: -1,
        right: 0,
        bottom: 0,
        left: -1
      },
      tooltip: {
        trigger: 'item',
        formatter(params) {
          const seriesName = params.data.ev_list && params.data.ev_list.codeName || params.data.name // 特殊事件
          const name = dayjs(params.data.startTime).format('YYYY-MM-DD HH:mm:ss')
          return (
            seriesName +
            '<br/><div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
            params.color +
            '"></i>' +
            name +
            '</div>'
          )
        }
      },
      xAxis: [
        {
          min: 0,
          max: 48,
          type: 'value',
          axisLine: {
            onZero: false,
            show: false
          },
          interval: 1,
          axisLabel: {
            rotate: 15,
            show: false,
            interval: 0,
            formatter(value, index) {
              // var date = new Date(value)
              // var texts = [date.getHours() + 1, date.getSeconds()]
              if (index % 2 == 0) {
                //  return new Date(parseInt(value) * 1000).toLocaleString();
                // + "," + dataArr[index][2]
                return index
              }
            }
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              type: 'dotted',
              opacity: 1// 0.5
            }
          }
        },
        {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: lineColor,
              opacity: 1
            }
          },
          data: (() => {
            var list = []
            for (var i = 0; i < col; i++) {
              list.push(i)
            }
            return list
          })()
        }
      ],
      yAxis: {
        type: 'value',
        min: 0,
        max: 10,
        interval: 10,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: []
    }
  },
  configMon(isDrag, dir, eventList, obj) {
    return Object.assign(
      {},
      {
        dataLoaded: false,
        drag: isDrag != 1,
        isAdd: false,
        selPoint: true,
        dir: dir,
        event: [eventList]
      },
      obj
    )
  },
  getArray(index) {
    var array = []
    for (var i = 0; i < index; i++) {
      array[i] = {}
    }
    return array
  },
  // 用药的配置
  getMed() {
    return stringify('Med')
  },
  // 入量的配置
  getI() {
    return stringify('I')
  },
  // 其它的配置
  getOther() {
    return stringify('Other')
  },
  // 用药的配置pacu
  getMed_pacu() {
    return stringify('Med_pacu')
  },
  // 入量的配置pacu
  getI_pacu() {
    return stringify('I_pacu')
  },
  // pacu其它的配置
  getOther_pacu() {
    return stringify('Other_pacu')
  },
  getInTime(EventList, vm) {
    let inRoomTime
    // pageState: 0(手术室) || 1(术中巡视) || 2(术后的麻醉记录单) || 3(复苏室) || 4(术后复苏室)
    const arry = EventList.filter(item => {
      return +vm.pageState === 3 || +vm.pageState === 4
        ? item.code === '入PACU时间'
        : item.code === 1
    })
    if (arry.length > 0) {
      inRoomTime = arry[0].startTime
    }
    return inRoomTime
  },
  initData(data) {
    data.regOpt.emergency = data.regOpt.emergency + '' // 类型转换
    data.regOpt.frontOperForbidTake = data.regOpt.frontOperForbidTake + ''
    data.eventList = self.dateFormat(data.eventList) // 日期格式化
    data.eventListPlus = self.dateFormat(data.eventListPlus || []) // 日期格式化  复苏获取麻醉的事件
    data.regOpt.weight = data.regOpt.weight ? data.regOpt.weight + '' : '/'
    data.regOpt.height = data.regOpt.height ? data.regOpt.height + '' : '/'
    try {
      // 强验证，数据类型
      if (data.anaesRecord.patAnalgesia) {
        data.anaesRecord.patAnalgesia_ = JSON.parse(data.anaesRecord.patAnalgesia)
      } else {
        data.anaesRecord.patAnalgesia_ = {}
      }
      if (data.anaesRecord.optBody) {
        // data.anaesRecord.optBody_ = JSON.parse(data.anaesRecord.optBody);
      } else {
        data.anaesRecord.optBody_ = []
      }
    } catch (e) {
      data.anaesRecord.patAnalgesia_ = {}
      data.anaesRecord.optBody_ = []
    }
    return JSON.parse(JSON.stringify(data))
  },
  stopTimerPt() {
    window.clearTimeout(self.timer)
  },
  dateFormat(list) {
    list.forEach(item => {
      if (typeof item.startTime === 'number') {
        item.strTime = dayjs(item.startTime).format('HH:mm')
      }
    })
    return list
  },
  option(type, array, ev_list, vm) {
    let site = 0
    for (let a = ev_list.length - 1; a >= 0; a--) {
      // 先清空需要设置的数据，有mz、sy、sx
      if (ev_list[a].type === type) {
        ev_list.splice(a, 1)
      }
    }
    if (array && array.length) {
      for (let a = 0; a < array.length; a++) {
        // 循环用药或者输血、输液数据
        if (type === 'mz' && a < vm.medECfg.mzConfig) {
          // 用药只需要6条，超过11条的数据不做显示，放到备注栏里面
          vm.medECfg.mzArr[a] = Object.assign(array[a], {
            index: a
          })
          site = vm.medECfg.mzTotal * 3 - 2 - a * 3 // 算出每一条用药信息的位置，及所在echart1上的行数
          for (let b = 0; b < array[a].medicalEventList.length; b++) {
            // 同一种药肯能在不同的时间段用，所以需要循环处理
            if (array[a].medicalEventList[b].medDetailList.length > 1) {
              // 持续用药有流速点
              for (let c = 0; c <= array[a].medicalEventList[b].medDetailList.length; c++) {
                if (c === 0) {
                  // 起点
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type
                      }
                    )
                  )
                } else if (c === array[a].medicalEventList[b].medDetailList.length && c > 0) {
                  // 终点
                  const json = Object.assign({}, array[a].medicalEventList[b], {
                    site: site,
                    type: type
                  })
                  // 持续用药没有结束点
                  if (array[a].medicalEventList[b].durable == 1 && !array[a].medicalEventList[b].endTime && array[a].medicalEventList[b].startTime < new Date().getTime()) {
                    json.curTime = true
                  }
                  ev_list.push(json)
                } else {
                  // 流速点
                  ev_list.push(
                    Object.assign({}, array[a].medicalEventList[b].medDetailList[c], {
                      site: site,
                      type: type,
                      name: array[a].medicalEventList[b].name,
                      changeData: 1
                    })
                  )
                }
              }
              // 持续无流速点
            } else if (array[a].medicalEventList[b].medDetailList.length === 1) {
              if (array[a].medicalEventList[b].durable + '' === '1') {
                // 如果持续用药没填结束时间的,做单点显示
                if (!array[a].medicalEventList[b].endTime) {
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type
                      }
                    )
                  )
                  if (array[a].medicalEventList[b].startTime < new Date().getTime()) {
                    ev_list.push(
                      Object.assign({}, array[a].medicalEventList[b], {
                        site: site,
                        type: type,
                        curTime: true
                      })
                    )
                  }
                  ev_list.push({
                    site: site
                  })
                } else {
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type
                      }
                    )
                  )
                  ev_list.push(
                    Object.assign({}, array[a].medicalEventList[b], {
                      site: site,
                      type: type
                    })
                  )
                }
              } else {
                // 单独点
                ev_list.push({
                  site: site
                })
                ev_list.push(
                  Object.assign(
                    {},
                    array[a].medicalEventList[b],
                    array[a].medicalEventList[b].medDetailList[0],
                    {
                      site: site,
                      type: type
                    }
                  )
                )
                ev_list.push({
                  site: site
                })
              }
            }
          }
        } else if (type === 'zl' && a < vm.medECfg.zlConfig) {
          // 用药只需要5条，超过11条的数据不做显示，放到备注栏里面
          const obj = {
            index: a,
            name: array[a].name,
            briefName: array[a].briefName || ''
          }
          if (globalConfig.isShowDrugUnit == 1) {
            obj.name = `${obj.name}(${array[a].dosageUnit})`
            obj.briefName = obj.briefName ? `${obj.briefName}(${array[a].dosageUnit})` : ''
          }
          if (globalConfig.isShowWay == 1 && array[a].medWay) {
            obj.name = `${obj.name}(${array[a].medWay})`
            obj.briefName = obj.briefName ? `${obj.briefName}(${array[a].medWay})` : ''
          }
          vm.medECfg.zlArr[a] = Object.assign(array[a], obj)
          site = vm.medECfg.zlTotal * 3 - 2 - a * 3 // 算出每一条用药信息的位置，及所在echart1上的行数
          for (let b = 0; b < array[a].medicalEventList.length; b++) {
            // 同一种药肯能在不同的时间段用，所以需要循环处理
            if (array[a].medicalEventList[b].medDetailList.length > 1) {
              // 持续用药有流速点
              for (let c = 0; c <= array[a].medicalEventList[b].medDetailList.length; c++) {
                if (c === 0) {
                  // 起点
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type,
                        endTime: array[a].medicalEventList[b].endTime
                      }
                    )
                  )
                } else if (c === array[a].medicalEventList[b].medDetailList.length && c > 0) {
                  // 终点
                  const json = Object.assign({}, array[a].medicalEventList[b], {
                    site: site,
                    type: type
                  })
                  // 持续用药没有结束点
                  if (array[a].medicalEventList[b].durable == 1 && !array[a].medicalEventList[b].endTime && array[a].medicalEventList[b].startTime < new Date().getTime()) {
                    json.curTime = true
                  }
                  ev_list.push(json)
                } else {
                  // 流速点
                  ev_list.push(
                    Object.assign({}, array[a].medicalEventList[b].medDetailList[c], {
                      site: site,
                      type: type,
                      name: array[a].medicalEventList[b].name,
                      changeData: 1
                    })
                  )
                }
              }
            } else if (array[a].medicalEventList[b].medDetailList.length === 1) {
              if (array[a].medicalEventList[b].durable + '' === '1') {
                // 持续无流速点
                if (!array[a].medicalEventList[b].endTime) {
                  // 如果持续用药没填结束时间的,做单点显示
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type
                      }
                    )
                  )
                  if (array[a].medicalEventList[b].startTime < new Date().getTime()) {
                    ev_list.push(
                      Object.assign({}, array[a].medicalEventList[b], {
                        site: site,
                        type: type,
                        curTime: true
                      })
                    )
                  }
                  ev_list.push({
                    site: site
                  })
                } else {
                  ev_list.push({
                    site: site
                  })
                  ev_list.push(
                    Object.assign(
                      {},
                      array[a].medicalEventList[b],
                      array[a].medicalEventList[b].medDetailList[0],
                      {
                        site: site,
                        type: type,
                        endTime: array[a].medicalEventList[b].endTime
                      }
                    )
                  )
                  ev_list.push(
                    Object.assign({}, array[a].medicalEventList[b], {
                      site: site,
                      type: type
                    })
                  )
                }
              } else {
                // 单独点
                ev_list.push({
                  site: site
                })
                ev_list.push(
                  Object.assign(
                    {},
                    array[a].medicalEventList[b],
                    array[a].medicalEventList[b].medDetailList[0],
                    {
                      site: site,
                      type: type
                    }
                  )
                )
                ev_list.push({
                  site: site
                })
              }
            }
          }
        } else if (
          type === 'sy' && a < vm.medECfg.syConfig || type === 'sx' && a < vm.medECfg.sxConfig
        ) {
          const obj = {
            index: a,
            name: array[a].name,
            briefName: array[a].briefName || ''
          }
          if (globalConfig.isShowDrugUnit == 1) {
            obj.name = `${obj.name}(${array[a].dosageUnit})`
            obj.briefName = obj.briefName ? `${obj.briefName}(${array[a].dosageUnit})` : ''
          }
          if (globalConfig.isShowWay == 1 && array[a].takeWayName) {
            obj.name = `${obj.name}(${array[a].takeWayName})`
            obj.briefName = obj.briefName ? `${obj.briefName}(${array[a].takeWayName})` : ''
          }

          // 输液 输血
          switch (type) {
            case 'sy':
              vm.medECfg.syArr[a] = Object.assign(array[a], obj)
              break
            case 'sx':
              vm.medECfg.sxArr[a] = Object.assign(array[a], obj)
              break
            default:
              break
          }
          site = type === 'sy' ? vm.medECfg.syTotal * 3 - 2 - a * 3 : vm.medECfg.sxTotal * 3 - 2 - a * 3

          // 手动计算总量
          // if (globalConfig.infusion_passage == 1) {
          array[a].totalAmout = 0
          array[a].dosageUnit = array[a].ioeventList?.[0]?.dosageUnit
          // }
          for (let c = 0; c < array[a].ioeventList.length; c++) {
            // if (
            //   store.getters.userInfo.user &&
            //   !store.getters.userInfo.user.infusionDurable
            // ) {
            //   ev_list.push({
            //     site: site
            //   })
            //   ev_list.push(
            //     Object.assign({}, array[a].ioeventList[c], {
            //       site: site,
            //       type: type,
            //       subType: type === 'sy' ? 1 : 2
            //     })
            //   )
            //   ev_list.push({
            //     site: site
            //   })
            // } else {
            // if (globalConfig.infusion_passage == 1) {
            // 只计算和前一个单位相同的输液
            // if (c > 0 && array[a].ioeventList[c].dosageUnit == array[a].ioeventList[c - 1].dosageUnit) {
            array[a].totalAmout += (array[a].ioeventList[c].dosageAmount - array[a].ioeventList[c].remainingDosage)
            // }
            // }
            if (!array[a].ioeventList[c].endTime) {
              // 如果持续用药没填结束时间的,做单点显示
              ev_list.push({
                site: site
              })
              ev_list.push(
                Object.assign({}, array[a].ioeventList[c], array[a].ioeventList[c], {
                  site: site,
                  type: type
                })
              )
              if (array[a].ioeventList[c].durable == 1 && array[a].ioeventList[c].startTime < new Date().getTime()) {
                ev_list.push(
                  Object.assign({}, array[a].ioeventList[c], {
                    site: site,
                    type: type,
                    curTime: true
                  })
                )
              }
              ev_list.push({
                site: site
              })
            } else {
              ev_list.push({
                site: site
              })
              ev_list.push(
                Object.assign({}, array[a].ioeventList[c], {
                  site: site,
                  type: type
                })
              )
              ev_list.push(
                Object.assign({}, array[a].ioeventList[c], {
                  site: site,
                  type: type,
                  dosage: '',
                  showFlow: undefined,
                  showThick: undefined
                })
              )
              ev_list.push({
                site: site
              })
            }
            // }
          }
        } else if (type === 'cl' && a < vm.medECfg.clConfig) {
          const obj = {
            index: a
          }
          if (globalConfig.isShowDrugUnit == 1) {
            obj.name = `${array[a].name}(${array[a].dosageUnit})`
            obj.briefName = array[a].briefName ? `${array[a].briefName}(${array[a].dosageUnit})` : ''
          }

          vm.medECfg.clArr[a] = Object.assign(array[a], obj)
          site = vm.medECfg.clTotal * 3 - 2 - a * 3
          for (var c = 0; c < array[a].egressList.length; c++) {
            ev_list.push({
              site: site
            })
            ev_list.push(
              Object.assign({}, array[a].egressList[c], {
                site: site,
                type: type
              })
            )
            ev_list.push({
              site: site
            })
          }
        }
      }
    }
    return ev_list
  },
  refChart(vm, result, print, mergeobj) {
    var ev_list = []
    self.option('mz', result.anaesMedevent, ev_list, vm)
    self.option('zl', result.medicalevent, ev_list, vm)
    self.option('sy', result.infusionList, ev_list, vm)
    if (globalConfig.infusionAndBloodSplit == 1) {
      self.option('sx', result.bloodList, ev_list, vm)
      vm.startOper.bloodList = result.bloodList //
    }
    self.option('cl', result.egress, ev_list, vm)
    vm.startOper.anaesMedevent = result.anaesMedevent
    vm.startOper.medicalevent = result.medicalevent //
    vm.startOper.infusionList = result.infusionList //
    self.initEvConfig(ev_list, vm, print, mergeobj, vm.view.pageCur, vm.timeArr49)
  },
  getbacklist(rs_all, rs_out, docType) {
    // 备注处理start
    var getEventName = {
      checkeventList: '血气分析',
      otherevent: '其它事件',
      ctlBreath: '呼吸事件',
      rescueevent: '抢救事件',
      shiftChange: '交换班事件',
      anaesMedevent: '麻醉用药',
      medicalevent: '治疗用药',
      pumpMedicalevent: '泵注用药',
      infusionList: globalConfig.infusionAndBloodSplit == 1 ? '输液' : '输血输液',
      bloodList: '输血',
      egress: '出量',
      eventList: docType == 1 ? '术中事件' : '复苏事件',
      analgesicMedEvt: '镇痛事件',
      creativeTechnologyList: '创三技术',
      inPacuInfo: '入复苏室',
      atPacuInfo: '复苏中',
      outPacuInfo: '出复苏室'
    }
    const list = [] // 对象数组，带isTitle的是事件的头
    let arr = []
    if (rs_out.eventList && rs_out.eventList.length > 0) {
      // 始终让术中事件放第一位
      list.push({
        isTitle: true,
        name: getEventName['eventList']
      })
      for (var n = 0; n < rs_out.eventList.length; n++) {
        rs_out.eventList[n].eventName = 'eventList'
        rs_out.eventList[n].eventIndex =
          1 +
          rs_out.eventList.findIndex(item => {
            return item.anaEventId === rs_out.eventList[n].anaEventId
          })
        list.push(rs_out.eventList[n])
      }
    }
    for (var i in rs_out) {
      arr = []
      if (
        i === 'eventList' ||
        i === 'anaesMedevent' ||
        i === 'resultCode' ||
        i === 'preOperMedEvt' ||
        i === 'resultMessage'
      ) {
        continue
      }
      if (
        (i === 'analgesicMedEvt') ||
        rs_out[i].length > 0
      ) {
        if (i === 'analgesicMedEvt') {
          list.push({
            isTitle: true,
            name: `${getEventName[i]}`,
            type: 'analgesicMedEvt',
            analgesicMethod: rs_out[i].analgesicMethod, // 镇痛方案：
            analgesicTotal: rs_out[i].analgesicTotal,
            continuedDosage: rs_out[i].continuedDosage,
            firstDosage: rs_out[i].firstDosage,
            lockingTime: rs_out[i].lockingTime,
            pcaBootTime: rs_out[i].pcaBootTime,
            pcaDosage: rs_out[i].pcaDosage,
            pcaModel: rs_out[i].pcaModel,
            analgesicMedEvtList: rs_out[i].analgesicMedEvtList,
            pcaStopTime: rs_out[i].pcaStopTime
          })
          arr = JSON.parse(JSON.stringify(rs_out[i].analgesicMedEvtList))
        } else if (i === 'creativeTechnologyList' && rs_out[i].length > 0) {
          list.push({
            isTitle: true,
            name: `${getEventName[i]}`,
            type: 'creativeTechnologyList'
          })
          arr = JSON.parse(JSON.stringify(rs_out[i]))
        } else {
          list.push({
            isTitle: true,
            name: getEventName[i]
          })
          arr = JSON.parse(JSON.stringify(rs_out[i]))
        }
      }
      for (var j = 0; j < arr.length; j++) {
        if (i === 'creativeTechnologyList') {
          list.push({
            eventName: i,
            text: arr[j].value + '-' + arr[j].name
          })
          continue
        }
        if (i === 'ctlBreath') {
          list.push({
            eventName: i,
            notes: arr[j].notes,
            type: arr[j].type,
            startTime: arr[j].startTime,
            pattern: arr[j].pattern
          })
          continue
        }
        if (i === 'otherevent') {
          list.push({
            eventName: i,
            notes: arr[j].notes,
            title: arr[j].title,
            startTime: arr[j].startTime
          })
          continue
        }
        if (i === 'shiftChange') {
          list.push({
            eventName: i,
            shiftChangedPeople: arr[j].shiftChangedPeople,
            shiftChangedPeopleId: arr[j].shiftChangedPeopleId,
            shiftChangePeople: arr[j].shiftChangePeople,
            shiftChangePeopleId: arr[j].shiftChangePeopleId,
            shiftChangeTime: arr[j].shiftChangeTime
          })
          continue
        }
        if (i === 'rescueevent') {
          list.push({
            eventName: i,
            notes: arr[j].notes,
            model: arr[j].model,
            startTime: arr[j].startTime
          })
          continue
        }
        if (i === 'checkeventList') {
          list.push({
            eventName: i,
            cheEventName: arr[j].cheEventName,
            cheEventDetail: arr[j].checkeventItemRelationList,
            startTime: arr[j].startTime,
            cheEventId: arr[j].cheEventId
          })
          continue
        }
        if (i === 'infusionList' || i === 'bloodList') {
          if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
            arr[j].ioeventList.forEach(item => {
              list.push({
                id: item.inEventId,
                type: 'I',
                eventName: i,
                name: item.name,
                dosageAmount: item.dosageAmount,
                dosageUnit: item.dosageUnit,
                startTime: item.startTime || '',
                endTime: item.endTime || '',
                realDosageAmount: item.realDosageAmount,
                passage: item.passage,
                remark: item.remark
              })
            })
          } else {
            list.push({
              eventName: i,
              name: arr[j].name,
              dosageAmount: arr[j].dosageAmount,
              dosageUnit: arr[j].dosageUnit,
              startTime: arr[j].startTime,
              endTime: arr[j].endTime
            })
          }
          continue
        }
        if (i === 'bloodList') {
          list.push({
            eventName: i,
            name: arr[j].name,
            blood: arr[j].blood,
            dosageAmount: arr[j].dosageAmount,
            dosageUnit: arr[j].dosageUnit,
            startTime: arr[j].startTime,
            endTime: arr[j].endTime
          })
          continue
        }
        if (arr[j].medicalEventList && arr[j].medicalEventList.length > 0) {
          arr[j].medicalEventList.forEach(item => {
            list.push({
              id: item.medEventId,
              type: 1,
              eventName: i,
              name: item.name,
              dosage: item.dosage,
              dosageUnit: item.dosageUnit,
              startTime: item.startTime,
              endTime: item.endTime,
              durable: item.durable,
              flow: item.flow,
              flowUnit: item.flowUnit,
              thickness: item.thickness,
              thicknessUnit: item.thicknessUnit,
              medWay: item.medTakeWayName,
              liquidName: item.liquidName,
              sort: arr[j].sort
            })
          })
          continue
        }
        if (arr[j].egressList && arr[j].egressList.length > 0) {
          arr[j].egressList.forEach(item => {
            list.push({
              id: item.egressId,
              type: 'O',
              eventName: i,
              name: item.name,
              value: item.value,
              dosageUnit: item.dosageUnit,
              startTime: item.startTime ? dayjs(new Date(item.startTime)).format('HH:mm') : ''
            })
          })
          continue
        }
        if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
          arr[j].ioeventList.forEach(item => {
            list.push({
              id: item.inEventId,
              type: 'I',
              eventName: i,
              name: item.name,
              dosageAmount: item.dosageAmount,
              medWay: item.takeWayName,
              dosageUnit: item.dosageUnit,
              startTime: item.startTime || '',
              endTime: item.endTime || ''
            })
          })
          continue
        }
        if (arr[j].vaildCheckItems && arr[j].vaildCheckItems.length > 0) {
          arr[j].vaildCheckItems.forEach(item => {
            list.push({
              eventName: 'checkdetail',
              name: item.name,
              value: item.value,
              unit: item.unit
            })
          })
          continue
        }
      }
    }
    // list = list.filter(_item => (_item.name && _item.name !== '呼吸事件') || !_item.name)
    return list
  },
  getbacklistXuhao(rs_all, rs_out, docType) {
    // 备注处理start
    var getEventName = {
      checkeventList: '血气分析',
      otherevent: '其它事件',
      ctlBreath: '呼吸事件',
      rescueevent: '抢救事件',
      shiftChange: '交换班事件',
      anaesMedevent: '麻醉用药',
      medicalevent: '治疗用药',
      pumpMedicalevent: '泵注用药',
      infusionList: globalConfig.infusionAndBloodSplit == 1 ? '输液' : '输血输液',
      bloodList: '输血',
      egress: '出量',
      eventList: docType == 1 ? '术中事件' : '复苏事件',
      analgesicMedEvt: '镇痛事件',
      creativeTechnologyList: '创三技术',
      inPacuInfo: '入复苏室',
      atPacuInfo: '复苏中',
      outPacuInfo: '出复苏室'
    }
    let list = [] // 对象数组，带isTitle的是事件的头
    let arr = []
    for (var i in rs_out) {
      arr = []
      if (
        i === 'anaesMedevent' || // 麻醉用药
        i === 'resultCode' ||
        i === 'preOperMedEvt' || // 麻醉前用药
        i === 'resultMessage'
      ) {
        continue
      }
      if (
        (i === 'analgesicMedEvt') ||
        rs_out[i].length > 0
      ) {
        if (i === 'analgesicMedEvt') {
          list.push({
            isTitle: true,
            name: `${getEventName[i]}`,
            type: 'analgesicMedEvt',
            analgesicMethod: rs_out[i].analgesicMethod, // 镇痛方案：
            analgesicTotal: rs_out[i].analgesicTotal,
            continuedDosage: rs_out[i].continuedDosage,
            firstDosage: rs_out[i].firstDosage,
            lockingTime: rs_out[i].lockingTime,
            pcaBootTime: rs_out[i].pcaBootTime,
            pcaDosage: rs_out[i].pcaDosage,
            pcaModel: rs_out[i].pcaModel,
            analgesicMedEvtList: rs_out[i].analgesicMedEvtList,
            pcaStopTime: rs_out[i].pcaStopTime
          })
          arr = JSON.parse(JSON.stringify(rs_out[i].analgesicMedEvtList))
        } else if (i === 'creativeTechnologyList' && rs_out[i].length > 0) {
          list.push({
            isTitle: true,
            name: `${getEventName[i]}`,
            type: 'creativeTechnologyList'
          })
          arr = JSON.parse(JSON.stringify(rs_out[i]))
        } else {
          arr = JSON.parse(JSON.stringify(rs_out[i]))
        }
      }
      for (var j = 0; j < arr.length; j++) {
        if (
          i === 'eventList' ||
          i === 'ctlBreath' ||
          i === 'otherevent' ||
          i === 'shiftChange' ||
          i === 'rescueevent'
        ) {
          arr[j].eventName = i
          arr[j].name = getEventName[i]
          list.push(arr[j])
          continue
        }
        if (i === 'creativeTechnologyList') {
          list.push({
            eventName: i,
            text: arr[j].value + '-' + arr[j].name
          })
          continue
        }
        if (i === 'checkeventList') {
          list.push({
            eventName: i,
            cheEventName: arr[j].cheEventName,
            cheEventDetail: arr[j].checkeventItemRelationList,
            cheEventId: arr[j].cheEventId,
            startTime: arr[j].startTime
          })
          continue
        }
        if (i === 'infusionList' || i === 'bloodList') {
          if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
            arr[j].ioeventList.forEach(item => {
              list.push({
                id: item.inEventId,
                type: 'I',
                eventName: i,
                name: item.name,
                dosageAmount: item.dosageAmount,
                dosageUnit: item.dosageUnit,
                startTime: item.startTime,
                medWay: item.takeWayName,
                endTime: item.endTime,
                realDosageAmount: item.realDosageAmount,
                passage: item.passage,
                remark: item.remark
              })
            })
          } else {
            list.push({
              eventName: i,
              name: arr[j].name,
              dosageAmount: arr[j].dosageAmount,
              dosageUnit: arr[j].dosageUnit,
              startTime: arr[j].startTime,
              endTime: arr[j].endTime
            })
          }
          continue
        }
        if (arr[j].medicalEventList && arr[j].medicalEventList.length > 0) {
          arr[j].medicalEventList.forEach(item => {
            const json = {
              id: item.medEventId,
              type: 1,
              eventName: i,
              name: item.name,
              dosage: item.dosage,
              dosageUnit: item.dosageUnit,
              endTime: item.endTime,
              durable: item.durable,
              flow: item.flow,
              flowUnit: item.flowUnit,
              thickness: item.thickness,
              thicknessUnit: item.thicknessUnit,
              medWay: item.medTakeWayName,
              liquidName: item.liquidName,
              sort: arr[j].sort
            }
            // 镇痛用药不按照时间排序
            if (i === 'analgesicMedEvt') {
              json.releaseTime = item.startTime
            } else {
              json.startTime = item.startTime
            }
            list.push(json)
          })
          continue
        }
        if (arr[j].egressList && arr[j].egressList.length > 0) {
          arr[j].egressList.forEach(item => {
            list.push({
              type: 'O',
              id: item.egressId,
              eventName: i,
              name: item.name,
              value: item.value,
              dosageUnit: item.dosageUnit,
              startTime: item.startTime
            })
          })
          continue
        }
        if (arr[j].ioeventList && arr[j].ioeventList.length > 0) {
          arr[j].ioeventList.forEach(item => {
            list.push({
              eventName: i,
              name: item.name,
              dosageAmount: item.dosageAmount,
              dosageUnit: item.dosageUnit,
              startTime: item.startTime,
              endTime: item.endTime
            })
          })
          continue
        }
        if (arr[j].vaildCheckItems && arr[j].vaildCheckItems.length > 0) {
          arr[j].vaildCheckItems.forEach(item => {
            list.push({
              eventName: 'checkdetail',
              name: item.name,
              value: item.value,
              unit: item.unit
            })
          })
          continue
        }
      }
    }
    const a_arr = list.filter(v => v.startTime || v.shiftChangeTime)
    const b_arr = list.filter(v => !v.startTime && !v.shiftChangeTime)
    a_arr.sort(this.sortBys_o_s())
    list = a_arr.concat(b_arr)
    list = list.map((v, idx) => {
      if (v.startTime || v.shiftChangeTime) {
        v.index = idx + 1
      }
      return v
    })
    return list
  },
  sortBys_o_s(rev) {
    // 第二个参数没有传递 默认升序排列
    if (rev == undefined) {
      rev = 1
    } else {
      rev = rev ? 1 : -1
    }
    return function(a, b) {
      a = a.startTime || a.startTime || a.shiftChangeTime
      b = b.startTime || b.startTime || b.shiftChangeTime
      if (a < b) {
        return rev * -1
      }
      if (a > b) {
        return rev * 1
      }
      return 0
    }
  },
  /**
   * 显示备注栏
   * @param {Vue} vm
   * @param {String} docId
   * @param {Boolean} print 是否是打印
   * @param {Object} mergeobj
   */
  async showRemark(vm, docId, print, mergeobj) {
    searchIOAmoutDetail_api(
      Object.assign(
        {
          docId: docId
        },
        mergeobj
      )
    ).then(rs => {
      // 备注栏总量
      if (rs.resultCode != '1') return
      rs.resultCode = rs.resultMessage = undefined
      vm.IOAmout = Object.assign({}, rs)
    })

    const { all: rs_all, out: rs_out } = await searchAllOrOut(
      Object.assign(
        {
          docId: vm.docId,
          bloodNum: vm.medECfg.sxConfig,
          infusionNum: vm.medECfg.syConfig,
          medEventNum: vm.medECfg.zlConfig,
          egressNum: vm.medECfg.clConfig,
          anaesMedNum: vm.medECfg.mzConfig,
          anaesEvtNum: 9,
          startTime: vm.timeArr49[vm.view.pageCur][0][0] * 1000,
          endTime: vm.timeArr49[vm.view.pageCur][48][0] * 1000
        },
        mergeobj
      )
    )
    vm.preOperMedEvt = rs_all.preOperMedEvt // 麻醉前用药
    vm.startOper.eventList = self.dateFormat(rs_all.eventList) // 更新麻醉事件
    vm.startOper.ctlBreath = [...rs_all.ctlBreath]
    vm.medicalEventType = rs_all?.analgesicMedEvt?.analgesicMethod
    vm.remarkevent = rs_out.remarkevent
    delete rs_all.remarkevent
    delete rs_out.remarkevent
    vm.backList =
      globalConfig.remarkStyleNum == 1
        ? self.getbacklistXuhao(rs_all, rs_out, vm.docType)
        : self.getbacklist(rs_all, rs_out, vm.docType)
    const checkEventList = vm.backList
      .filter(_ => _.eventName === 'checkeventList')
      .map((v, i) => {
        v.checkeventIndex = i
        return v
      })
    self.initCheckEvent(vm.monEOpt, checkEventList, print, vm)
    if (print) {
      // 打印就轮询
      self.newMonPrint(vm, vm.regOptId, vm.docId, vm['inTime' + mergeobj.docType], mergeobj)
    }
    // 备注处理end
    // 第一次请求所有事件
    const medECfg = self.config(vm.docType)
    vm.medECfg = Object.assign(vm.medECfg, {
      mzArr: medECfg.mzArr,
      zlArr: medECfg.zlArr,
      ztArr: medECfg.ztArr,
      syArr: medECfg.syArr,
      sxArr: medECfg.sxArr,
      clArr: medECfg.clArr
    })
    // vm.startOper.outIoeventList = rs_all.egress//删掉不要的
    // 显示备注方法麻醉记录单
    // 标记
    self.initSign(vm.markEOpt, vm.startOper, print, vm)
    self.refChart(vm, rs_all, print, mergeobj)
  },
  // 打印
  newMonPrint(vm, regOptId, docId, inTime, mergeobj) {
    getDigitalObsRecord_api(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, mergeobj).then(
      result => {
        // 遍历数据
        // monDataList(result);
        result.monDataList.forEach(item => {
          // 遍历内层数据
          item.monitorDataList.forEach(initem => {
            if (initem.observeName === 'TEMP1' || initem.observeName === 'Sev(%)') {
              if (initem.value === 0) {
                initem.value = '0.0'
              }
            }
          })
        })

        const bConfig = mergeobj.docType === 2 ? self.getOther_pacu() : self.getOther()
        vm.mongArrs = self.getArray(bConfig.mongRows)
        // 只判断最后一个点的数剧
        if (result.monDataList.length > 0) {
          var lastMonList = result.monDataList[result.monDataList.length - 1]
          lastMonList.monitorDataList.forEach((initem, index) => {
            vm.startOper?.leftShowList?.forEach((jcx) => {
              // if (index < vm.mongArrs.length) {
              //   vm.mongArrs[index] = jcx
              // }
              if (initem.observeId === jcx.eventId) {
                // 因为vm.startOper.leftShowList和result.monDataList[result.monDataList.length - 1]里面的顺序可能不一样 所有需要重新赋值
                vm.mongArrs[index - 1] = jcx
              }
            })
          })
        }
        if (mergeobj.docType == 1) {
          vm.monDataList = result.monDataList
          self.PAGES1.push({
            view: Object.assign({}, vm.view),
            timeArr49: Object.assign({}, vm.timeArr49),
            monEOpt: Object.assign({}, vm.monEOpt),
            medEOpt: Object.assign({}, vm.medEOpt),
            ioEOpt1:
              vm.userInfo.user && vm.userInfo.user.medIOSeparate
                ? Object.assign({}, vm.ioEOpt1)
                : undefined,
            markEOpt: Object.assign({}, vm.markEOpt),
            pageCur: vm.view.pageCur,
            monDataList: Object.assign({}, vm.monDataList),
            remarkevent: Object.assign({}, vm.remarkevent),
            backList: Object.assign({}, vm.backList),
            medicaleventStr: vm.startOper.medicaleventStr
          })
          if (vm.view.pageCur !== vm.view.pageCount) {
            vm.view.pageCur++
            this.getobsDataPrint(vm, regOptId, docId, this.ev_list, mergeobj)
          } else {
            vm.PAGES1 = self.PAGES1
            vm.PAGES = vm.PAGES1.concat(vm.PAGES2 ? vm.PAGES2 : [])
            store.dispatch('setrefresh', {
              type: '打印输出'
            })
          }
        }
        if (mergeobj.docType == 2) {
          vm.monDataList = result.monDataList
          self.PAGES2.push({
            view: Object.assign({}, vm.view),
            timeArr49: Object.assign({}, vm.timeArr49),
            monEOpt: Object.assign({}, vm.monEOpt),
            medEOpt: Object.assign({}, vm.medEOpt),
            ioEOpt1:
              vm.userInfo.user && vm.userInfo.user.medIOSeparate
                ? Object.assign({}, vm.ioEOpt1)
                : undefined,
            markEOpt: Object.assign({}, vm.markEOpt),
            pageCur: vm.view.pageCur,
            monDataList: Object.assign({}, vm.monDataList),
            remarkevent: Object.assign({}, vm.remarkevent),
            backList: Object.assign({}, vm.backList)
          })
          if (vm.view.pageCur !== vm.view.pageCount) {
            vm.view.pageCur++
            this.getobsDataPrint(vm, regOptId, docId, this.ev_list, mergeobj)
          } else {
            vm.PAGES2 = self.PAGES2
            vm.PAGES = vm.PAGES2.concat(vm.PAGES1 ? vm.PAGES1 : [])
            store.dispatch('setrefresh', {
              type: '打印输出'
            })
          }
        }
      }
    )
  },
  getobsDataPrint(vm, regOptId, docId, ev_list, mergeobj) {
    this.inTimeWrap = vm.startOper.eventList.filter(item => {
      return item.codeName === '入PACU时间' || item.code === 1
    })[0]
    this.inTime = this.inTimeWrap.startTime
    vm['inTime' + mergeobj.docType] = this.inTimeWrap.startTime
    if (this.inTimeWrap.codeName === '入PACU时间' || this.inTimeWrap.codeName === '入诱导室时间') {
      vm.startOper.anaesPacuRec.inTime = this.inTime
        ? dayjs(this.inTime).format('YYYY-MM-DD HH:mm')
        : ''
      vm.startOper.anaesPacuRec.outTime = this.outTime
        ? dayjs(this.outTime.startTime).format('YYYY-MM-DD HH:mm')
        : ''
    }
    getTraceObsRecord(regOptId, vm.view.pageCur, vm.view.pageSize, this.inTime, mergeobj).then(
      result => {
        if (result.resultCode !== '1') return
        vm.view.pageCount =
          result.total <= vm.view.pageSize
            ? 1
            : Math.ceil((result.total - 1) / (vm.view.pageSize - 1))
        this.createOrUpdateTimeArr49(vm, result)
        vm.monEOpt.series = this.getSeries(result, vm, 'print')
        this.anaesOperTimePrint(vm, docId, mergeobj)
      }
    )
  },
  anaesOperTimePrint(vm, docId, mergeobj) {
    searchTimesByCode({
      docId
    }).then(result => {
      if (result.resultCode !== '1') return
      if (result.anaesTime) {
        vm.view.anaesTime = parseInt(result.anaesTime / 60) + 'H' + (result.anaesTime % 60) + 'M'
      }
      if (result.operTime) {
        vm.view.operTime = parseInt(result.operTime / 60) + 'H' + (result.operTime % 60) + 'M'
      }
      this.totleIoEventPrint(vm, docId, mergeobj)
    })
  },
  totleIoEventPrint(vm, docId, mergeobj) {
    totleIoEvent_api({
      docId,
      docType: mergeobj.docType
    }).then(result => {
      if (result.resultCode !== '1') return
      if (result.blood) vm.view.blood = result.blood + 'ml'
      if (result.egress) vm.view.egress = result.egress + 'ml'
      if (result.emiction) vm.view.emiction = result.emiction + 'ml'
      if (result.ioevent) vm.view.ioevent = result.ioevent + 'ml'
      this.showRemark(vm, docId, true, mergeobj)
    })
  },
  // 显示检验事件值到eCharts  血气分析
  initCheckEvent(monEOpt, checkEventList, print, vm) {
    if (monEOpt.series.length > 0 && monEOpt.series[monEOpt.series.length - 1].name !== 'blood') {
      monEOpt.series.push({
        type: 'line',
        name: 'blood',
        yAxisIndex: 0,
        data: [],
        forbidBind: true,
        clip: false,
        z: 3,
        lineStyle: {
          normal: {
            color: '#fff',
            width: 1
          }
        }
      })

      if (store.getters.userInfo.user && store.getters.userInfo.user.preventCheckEventList) {
        return
      }
      for (var checkEvent of checkEventList) {
        const evIndex = self.translateTimeValue(
          checkEvent.startTime / 1000,
          vm.timeArr49[vm.view.pageCur]
        )
        const num = print ? 39 : 43
        checkEvent.value = [evIndex > num ? num : evIndex, print ? 232 : 230]
        checkEvent.symbolSize = 0.001
        checkEvent.label = {
          show: true,
          color: 'black',
          position: [1, 1],
          fontSize: print ? 9 : 12,
          // lineHeight:40,
          fontFamily: 'Microsoft YaHei',
          formatter(params) {
            var result = ''
            for (var checkItem of params.data.cheEventDetail) {
              var text = checkItem.value
                ? checkItem.name + ' ' + checkItem.value + '' + checkItem.unit
                : ''
              result += text + '\n'
            }
            return result
          }
        }
        monEOpt.series[monEOpt.series.length - 1].data.push(checkEvent)
      }
    }
  },
  // 监测数据赋值
  selfGetNewMon(vm, regOptId, inTime, mergeobj) {
    getDigitalObsRecord_api(regOptId, inTime, vm.view.pageSize, vm.view.pageCur, mergeobj).then(
      result => {
        // 遍历数据
        result.monDataList.forEach(item => {
          item.monitorDataList.forEach(initem => {
            if (initem.observeName === 'TEMP1' || initem.observeName === 'Sev(%)') {
              if (initem.value === 0) {
                initem.value = '0.0'
              }
            }
          })
        })
        const bConfig = mergeobj.docType === 2 ? self.getOther_pacu() : self.getOther()
        vm.mongArrs = self.getArray(bConfig.mongRows)
        // 只判断最后一个点的数剧
        if (result.monDataList.length > 0) {
          var lastMonList = result.monDataList[result.monDataList.length - 1]
          lastMonList.monitorDataList.forEach((initem, index) => {
            vm.startOper?.leftShowList?.forEach((jcx) => {
              // if (index < vm.mongArrs.length) {
              //   vm.mongArrs[index] = jcx
              // }
              if (initem.observeId === jcx.eventId) {
                // 因为vm.startOper.leftShowList和result.monDataList[result.monDataList.length - 1]里面的顺序可能不一样 所有需要重新赋值
                vm.mongArrs[index - 1] = jcx
                // 统一个
                if (initem.value) {
                  // 如果有值
                  if (initem.value > jcx.max) {
                    Notification({
                      title: '警告',
                      message:
                        '监测项' +
                        initem.observeName +
                        '在' +
                        dayjs(initem.time).format(' YYYY-MM-DD HH:mm') +
                        '大于' +
                        jcx.max,
                      position: 'bottom-right',
                      type: 'warning'
                    })
                  } else if (initem.value < jcx.min) {
                    Notification({
                      title: '警告',
                      message:
                        '监测项' +
                        initem.observeName +
                        '在' +
                        dayjs(initem.time).format(' YYYY-MM-DD HH:mm') +
                        '小于' +
                        jcx.min,
                      position: 'bottom-right',
                      type: 'warning'
                    })
                    // toastr.error('监测项' + initem.observeName + '在' +dayjs.format(initem.time, ' YYYY-MM-dd HH:mm') + '小于' + jcx.min);
                  }
                }
              }
            })
          })
        }
        // monDataList(result);
        vm.monDataList = result.monDataList
      }
    )
  },
  initEvConfig(ev_list, vm, print, mergeobj, pageCur, timeArr49) {
    // 绑定用药输液数据到表格上
    const medECfg = vm.medECfg
    const medEOpt = vm.medEOpt
    medECfg.dataLoaded = false
    medEOpt.series = []
    for (let i = 0; i < ev_list.length; i++) {
      if (i === 0 || ev_list[i].site != medEOpt.series[medEOpt.series.length - 1].id) {
        medEOpt.series.push({
          // 给每个series加基本样式
          id: ev_list[i].site,
          type: 'line',
          smooth: 0,
          symbolSize: medECfg.BeSmall ? [2, 5] : print ? [3, 6] : [5, 12],
          symbolOffset: print ? [0, 2] : [0, 3],
          symbol: 'rect',
          itemStyle: {
            normal: {
              color: 'black'
            }
          },
          lineStyle: {
            normal: {
              color: '#fff',
              width: 1,
              shadowColor: '#000',
              shadowOffsetY: print ? 4 : 6
            }
          },
          animation: false,
          z: 3
        })
      }
      if (!medEOpt.series[medEOpt.series.length - 1].data) {
        medEOpt.series[medEOpt.series.length - 1].data = []
      }
      var TimeValue
      // 开始
      if (
        ev_list[i].dosage != undefined &&
        ev_list[i].showFlow != undefined &&
        ev_list[i].showThick != undefined
      ) {
        //
        if (ev_list[i].durable == '1') {
          // 开始点
          TimeValue = self.translateTimeValue(
            ev_list[i].startTime / 1000,
            vm.timeArr49[vm.view.pageCur]
          )
        }
        if (ev_list[i].durable == '0') {
          // 单独点
          TimeValue = self.translateTimeValue(
            ev_list[i].startTime / 1000,
            vm.timeArr49[vm.view.pageCur]
          )
        }
      } else if (
        ev_list[i].dosage != undefined &&
        ev_list[i].showFlow == undefined &&
        ev_list[i].showThick == undefined
      ) {
        // if (ev_list[i].curTime) {
        //   // 持续用药 没有结束时间
        //   TimeValue = self.translateTimeValue(
        //     new Date().getTime() / 1000,
        //     vm.timeArr49[vm.view.pageCur]
        //   )
        // } else {
        // 结束点 终点
        TimeValue = self.translateTimeValue(
          ev_list[i].endTime / 1000,
          vm.timeArr49[vm.view.pageCur]
        )
        // }
        // 流速点（持续用药改变流速）
      } else if (
        ev_list[i].showFlow != undefined &&
        ev_list[i].showThick != undefined &&
        ev_list[i].dosage == undefined
      ) {
        TimeValue = self.translateTimeValue(
          ev_list[i].startTime / 1000,
          vm.timeArr49[vm.view.pageCur]
        )
      } else {
        // 空
        if (ev_list[i].type) {
          TimeValue = self.translateTimeValue(
            ev_list[i].startTime / 1000,
            vm.timeArr49[vm.view.pageCur]
          )
        } else {
          TimeValue = ''
        }
      }
      var labelPosition
      var xscsize = 11
      if (mergeobj.BeSmall && (ev_list[i].type === 'zl' || ev_list[i].type === 'mz')) {
        // 打印
        xscsize = 9
        labelPosition = [1, -6]
      } else if (!mergeobj.BeSmall && (ev_list[i].type === 'zl' || ev_list[i].type === 'mz')) {
        labelPosition = [1, -10]
      } else if (!mergeobj.BeSmall && ev_list[i].type !== 'zl' && ev_list[i].type !== 'mz') {
        labelPosition = [1, -12]
      } else {
        labelPosition = [1, -10]
      }
      if (ev_list[i].labelOffset) {
        // 如果设置了偏移就偏移
        const labelOffset_num = parseInt(ev_list[i].labelOffset)
        labelPosition[0] += (print ? labelOffset_num * 248 / 457 : labelOffset_num)
      }

      if (ev_list[i].curTime) {
        TimeValue = self.translateTimeValue(
          new Date().getTime() / 1000,
          vm.timeArr49[vm.view.pageCur]
        )
      }
      var itemObj = {
        value: [TimeValue, ev_list[i].site],
        ev_list: ev_list[i],

        label: {
          show: true,
          formatter(params) {
            var intnum = parseInt(params.data.value[0])
            var floatnum = parseFloat((params.data.value[0] - intnum).toFixed(3))
            var timestamp
            if (!floatnum) {
              timestamp = vm.timeArr49[pageCur][intnum][0]
            } else {
              timestamp =
              vm.timeArr49[pageCur][intnum][0] +
              vm.timeArr49[pageCur][intnum][2] * floatnum
            }
            var result = globalConfig.labelShowFormatterTime == 1 ? (dayjs(timestamp * 1000).format('HH:mm') + '  ') : ''
            if (params.data.ev_list.showOption == '3') {
              // 用药剂量
              // result += params.data.ev_list.dosage + params.data.ev_list.dosageUnit + ''

              if (globalConfig.isShowDrugUnit != 1) {
                result += params.data.ev_list.dosage
                result += params.data.ev_list.dosageUnit
              } else {
                result += params.data.ev_list.dosage
              }
            }
            // 是否显示浓度
            if (params.data.ev_list.showThick) {
              result += ('  ' + params.data.ev_list.thickness + params.data.ev_list.thicknessUnit)
            }
            if (params.data.ev_list.showFlow) {
              result += '  '
              result += params.data.ev_list.flow + params.data.ev_list.flowUnit
            }
            if (params.data.ev_list.pumpModel) {
              // 用药途径
              result += ('  ' + params.data.ev_list.pumpModel)
            }
            if (
              params.data.ev_list.dosage != undefined &&
              params.data.ev_list.showFlow == undefined &&
              params.data.ev_list.showThick == undefined
            ) {
              return '' // 结束点必须没有label9527
            }
            if (params.data.ev_list.value) {
              // 出血量
              // result += params.data.ev_list.value + params.data.ev_list.dosageUnit
              result += params.data.ev_list.value
              if (globalConfig.isShowDrugUnit != 1) {
                result += params.data.ev_list.dosageUnit + '  '
              }
            }
            if (params.data.ev_list.dosageAmount) {
              let Amount
              if (params.data.ev_list.realDosageAmount) {
                Amount = params.data.ev_list.realDosageAmount
              } else {
                Amount = params.data.ev_list.dosageAmount
              }
              if (globalConfig.infusion_passage == 1) {
                result += params.data.ev_list.name + Amount
              } else {
                result += Amount
              }
              // result += params.data.ev_list.dosageUnit // 输液单位
              if (globalConfig.isShowDrugUnit != 1) {
                result += params.data.ev_list.dosageUnit + '  '
              }
              result += params.data.ev_list.remark ? `（${params.data.ev_list.remark}）` : '' // 备注
              result += (globalConfig.isShowDrugUse == 1 ? params.data.ev_list.takeWayName : '') + '  ' + params.data.ev_list.frequencyName // 途径频率
            }
            // if(params.data.ev_list.passage){//输液通道
            //     result += params.data.ev_list.passage;
            // }
            if (params.data.ev_list.medTakeWayName && globalConfig.isShowDrugUse == 1) {
              // 用药方式
              result += ('  ' + params.data.ev_list.medTakeWayName)
            }
            return result
          },
          position: labelPosition,
          distance: 2,
          fontSize: xscsize,
          fontFamily: 'Microsoft YaHei',
          color: 'black'
        }
      }
      if (ev_list[i].curTime) {
        itemObj.symbol = 'path://M2.1,1.1l17,8.5l-17,8.5V1.1z'
        itemObj.symbolSize = medECfg.BeSmall ? [5, 6] : print ? [6, 7] : [10, 12]
        itemObj.symbolOffset = [0, 6]
        itemObj.label = {
          show: false
        }
      }
      if (ev_list[i].type == 'zl' || ev_list[i].type == 'mz') {
        // 浓度流速点
        if (
          ev_list[i].showFlow != undefined &&
          ev_list[i].showThick != undefined &&
          ev_list[i].dosage == undefined
        ) {
          Object.assign(itemObj, {
            symbolSize: medECfg.BeSmall ? [4, 4] : print ? [5, 5] : [7, 9]
          })
        }
      }
      medEOpt.series[medEOpt.series.length - 1].data.push(itemObj)
    }
    if (!print) {
      var lineColor = globalConfig.label_color || variables.label_color // 默认是红色red
      const xMarkLine = vm.timeArr49[vm.view.pageCur].map((item, index) => {
        return {
          name: '',
          xAxis: index,
          z: 1,
          lineStyle: {
            type: 'dotted',
            width: 1,
            color: lineColor,
            opacity: 0
          },
          emphasis: {
            lineStyle: {
              type: 'solid',
              width: 1,
              color: lineColor,
              opacity: 0
            }
          }
        }
      })
      if ((vm.pageState === 0 && vm.operState === '04') ||
      (vm.pageState === 3 && vm.operState === '05')) {
        xMarkLine.push({
          xAxis: self.translateTimeValue(new Date().getTime() / 1000, vm.timeArr49[vm?.view?.pageCur]),
          lineStyle: {
            type: 'solid',
            width: 2,
            color: '#FE7B00'
          }
        })
      }
      medEOpt.series.push({
        animation: false,
        type: 'line',
        data: [],
        markLine: {
          symbolSize: 0,

          tooltip: {
            formatter(params) {
              const name = dayjs(self.translateTimeValue(params.data.xAxis, vm.timeArr49[vm.view.pageCur]) * 1000).format('YYYY-MM-DD HH:mm:ss')
              return (
                '<div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
              params.color +
              '"></i>' +
              name +
              '</div>'
              )
            }
          },
          data: xMarkLine
        }
      })
    }
    store.dispatch('setrefresh', {
      type: '物理更新',
      docType: vm.docType,
      prefixId: vm.prefixId
    })
  },

  initSign(markEOpt, startOper, print, vm) {
    // 标记
    markEOpt.series = [
      {
        data: [],
        type: 'line',
        name: 'mark',
        connectNulls: false,
        animation: false,
        z: 3
      }
    ]
    var seriesList = markEOpt.series[markEOpt.series.length - 1].data // 得到最后一条标记的数据
    var index = 1
    if (globalConfig.remarkStyleNum != 1) {
      for (let a = 0; a < startOper.eventList.length; a++) {
        if (
          startOper.eventList[a].code >= 2 &&
              startOper.eventList[a].code != 9 &&
              startOper.eventList[a].code != 1004 &&
              startOper.eventList[a].code != 1003 || globalConfig.getCurPageAllEvent == 1
        ) {
          const startTime = startOper.eventList[a].startTime
          if (!startOper.eventList[a].svg) { continue }// 只渲染图标
          seriesList.push([])
          seriesList.push(getSpecialIconItem(startOper.eventList[a], vm, startTime, index, print))
          seriesList.push([])
          if (
            startOper.eventList[a].code != 1001 &&
              startOper.eventList[a].code != 1002 || globalConfig.getCurPageAllEvent == 1
          ) {
            index += 1
          }
        }
      }
    }
    var backlistCopy = JSON.parse(JSON.stringify(vm.backList))
    backlistCopy = backlistCopy.filter(v => v.startTime || v.shiftChangeTime)
    index = 1
    if (globalConfig.remarkStyleNum != 1) { // 按分类 序号只要麻醉事件
      backlistCopy = backlistCopy.filter(v => v.eventName == 'eventList')
    }
    for (let a = 0; a < backlistCopy.length; a++) {
      const startTime = backlistCopy[a].startTime || backlistCopy[a].shiftChangeTime
      const xAxis = self.translateTimeValue(startTime / 1000, vm.timeArr49[vm.view.pageCur])
      const value = [xAxis, 0]
      if (globalConfig.remarkStyleNum == 1 && a >= 1 && (xAxis - seriesList[seriesList.length - 2].value[0] < 0.3)) {
        const checkList = seriesList.filter(v => v.value)
        if (checkList.length <= 5 || checkList.length > 5 && (checkList[checkList.length - 5].value[1] === 0 || checkList[checkList.length - 4].value[1] === 0 || checkList[checkList.length - 3].value[1] === 0 || checkList[checkList.length - 2].value[1] === 0 || checkList[checkList.length - 1].value[1] === 0)) {
          value[1] = seriesList[seriesList.length - 2].value[1] + 1.5
        }
      }
      if (
        backlistCopy[a].code >= 9 &&
            backlistCopy[a].code != 1004 &&
            backlistCopy[a].code != 1003 || globalConfig.remarkStyleNum == 1
      ) {
        if (globalConfig.xuhaoSignSpecialEventShowIcon == 1) { // 序号特殊事件显示图标
          if (backlistCopy[a] && backlistCopy[a].svg) {
            seriesList.push([])
            seriesList.push(getSpecialIconItem(backlistCopy[a], vm, startTime, index, print))
            seriesList.push([])
          } else {
            seriesList.push([])
            seriesList.push(getNumItem(backlistCopy[a], value, print, startTime, index))
            seriesList.push([])
          }
        } else { // 麻醉一般事件显示数字
          seriesList.push([])
          seriesList.push(getNumItem(backlistCopy[a], value, print, startTime, index))
          seriesList.push([])
        }
      }
      index += 1
    }
    var lineColor = globalConfig.label_color || variables.label_color // 默认是红色red
    const xMarkLine = vm.timeArr49[vm.view.pageCur].map((item, idx) => {
      return {
        z: 1,
        name: '',
        xAxis: idx,
        lineStyle: {
          type: 'dotted',
          width: 1,
          color: lineColor,
          opacity: 0
        },
        emphasis: {
          lineStyle: {
            type: 'solid',
            width: 1,
            color: lineColor,
            opacity: 0
          }
        }
      }
    })
    if ((vm.pageState === 0 && vm.operState === '04') ||
      (vm.pageState === 3 && vm.operState === '05')) {
      xMarkLine.push({
        xAxis: self.translateTimeValue(new Date().getTime() / 1000, vm.timeArr49[vm?.view?.pageCur]),
        lineStyle: {
          type: 'solid',
          width: 2,
          color: '#FE7B00'
        }
      })
    }
    if (!print) {
      markEOpt.series.push({
        data: [],
        type: 'line',
        animation: false,

        markLine: {
          tooltip: {
            trigger: 'item',
            formatter(params) {
              const name = dayjs(self.translateTimeValue(params.data.xAxis, vm.timeArr49[vm.view.pageCur]) * 1000).format('YYYY-MM-DD HH:mm:ss')
              return (
                '<div><i style="display: inline-flex; margin-right:5px; width: 10px; height: 10px; border-radius: 50%; background-color: ' +
              params.color +
              '"></i>' +
              name +
              '</div>'
              )
            }
          },
          symbolSize: 0,
          data: xMarkLine
        }
      })
    }
  },
  // 创建或者更新timearr49 进入手术 修改间隔 修改模式的时候更新
  createOrUpdateTimeArr49(vm, result, data) {
    var dataArr = []
    var resultarr
    var Freq
    if (data) {
      // 采集点的时候更新
      if (!data.freq) {
        // 这里是数据异常状态
        return
      }
      resultarr = JSON.parse(JSON.stringify(result.xAxis[0].data))
      Freq = data.freq
    } else {
      resultarr = JSON.parse(JSON.stringify(result.xAxis[0].data))
      Freq = result.freq ? result.freq : resultarr[resultarr.length - 1].freq
    }
    if (
      vm.rescueevent &&
      vm.rescueevent.length > 0 &&
      vm.rescueevent[vm.rescueevent.length - 1].model === 'save'
    ) {
      // 抢救模式
      Freq = 30
    }
    for (var i = 0; i < 49; i++) {
      var tmp
      if (resultarr[i]) {
        tmp = [
          resultarr[i].value / 1000,
          '',
          resultarr[i].freq,
          {
            formatTime: dayjs(resultarr[i].value).format('HH:mm')
          }
        ]
        dataArr.push(tmp)
      } else {
        tmp = [
          dataArr[i - 1][0] + dataArr[i - 1][2],
          '',
          Freq,
          {
            formatTime: dayjs((dataArr[i - 1][0] + dataArr[i - 1][2]) * 1000)
          }
        ]
        dataArr.push(tmp)
      }
    }
    if (!vm.timeArr49) {
      vm.timeArr49 = []
    }
    if (vm.view.pageCur === 0) {
      // pageCur为0，后台就会查最后一页，这是要把0改为最后一页的数值
      vm.view.pageCur = vm.view.pageCount
      vm.timeArr49[vm.view.pageCount] = dataArr // 原始X轴节点
    }
    vm.timeArr49[vm.view.pageCur] = dataArr // 原始X轴节点
    return
  },

  /**
   * 处理数据，定时请求
   * @param vm vue实例
   * @param sideTime 下一个描点和当前时间差 补点 sideTime -1：不会LOAD pageing：描点  时间差补点
   * @param result getObsData请求结果
   * @param onlySave 是否只保存描点 不更新麻醉记录单
   * @param mergeObj 其他参数
   **/
  saveIntervalObsRec(vm, sideTime, result, onlySave, mergeobj) {
    // 补点 sideTime-1不会LOAD pageing描点  时间差补点
    vm.oldResult = result
    vm.monEOpt.series = this.getSeries(result, vm)
    if (result.total < vm.view.pageSize) {
      // 计算瞄点的索引
      vm.index = (result.total - 1) % vm.view.pageSize
    } else {
      vm.index =
        (result.total - 1) % (vm.view.pageSize - 1) === 0
          ? vm.view.pageSize - 1
          : (result.total - 1) % (vm.view.pageSize - 1)
    }
    vm.view.pageCount =
      result.total <= vm.view.pageSize ? 1 : Math.ceil((result.total - 1) / (vm.view.pageSize - 1))
    if (vm.view.pageCur === 0) {
      vm.view.pageCur = vm.view.pageCount
    }
    vm.view.pageDone = true
    // 进入补点后更新数据视图
    vm.seriesData = result.series // 补点没刷新数据描点数据
    if (vm.seriesData.length && vm.seriesData[0].data.length) {
      vm.dataTimeArr = vm.seriesData[0].data.map(item => {
        return item.time
      })
    }

    // 显示备注
    this.showRemark(vm, vm.docId, false, mergeobj)

    if (mergeobj.onlyGetObsdata) return
    // 监测数据赋值
    this.selfGetNewMon(vm, vm.regOptId, vm.inTime, mergeobj)
    if (sideTime < 0) return
    // 实时监测数据
    var startTime = result.md.time + result.md.intervalTime * 1000 // 计算下一个瞄点时间
    var onLoad = () => {
      // 瞄新点方法
      getObsRecordNew_api(vm.regOptId, vm.inTime, startTime, mergeobj).then(data => {
        self.createOrUpdateTimeArr49(vm, result, data)
        vm.seriesDvmata = data.series
        if (vm.seriesData.length && vm.seriesData[0].data.length) {
          vm.dataTimeArr = vm.seriesData[0].data.map(item => {
            return item.time
          })
        }
        if (data.series.length > vm.oldResult.series.length) {
          // 配置列比现有列还多的话重新调用
          self.getobsData(vm, vm.regOptId, vm.docId, vm.ev_list, mergeobj)
          return
        }
        // 数据异常
        if (data.resultCode != '1' || data.xAxis[0].data.length <= 0) {
          return
        }
        vm.freq = data.freq
        startTime += result.freq * 1000 // 下一点的开始时间
        start_point(vm.freq * 1000)
        for (const observe of data.series) {
          if (observe.name === 'RESP') {
            for (const item of observe.data) {
              if (item.symbolSvg) {
                item.symbol = 'path://' + item.symbolSvg
              }
            }
          }
          // 判断所有检测项
          for (const item of observe.data) {
            if (item.value) {
              // 如果有值
              if (item.value > observe.max) {
                Notification({
                  title: '警告',
                  message:
                    '采集项' +
                    observe.name +
                    '在' +
                    dayjs(item.time).format('YYYY-MM-DD HH:mm') +
                    '大于' +
                    observe.max,
                  position: 'bottom-right',
                  type: 'warning'
                })
              } else if (item.value < observe.min) {
                Notification({
                  title: '警告',
                  message:
                    '采集项' +
                    observe.name +
                    '在' +
                    dayjs(item.time).format('YYYY-MM-DD HH:mm') +
                    '小于' +
                    observe.min,
                  position: 'bottom-right',
                  type: 'warning'
                })
              }
            }
          }
        }
        if (data.total < vm.view.pageSize) {
          vm.index = (data.total - 1) % vm.view.pageSize
        } else {
          vm.index =
            (data.total - 1) % (vm.view.pageSize - 1) === 0
              ? vm.view.pageSize - 1
              : (data.total - 1) % (vm.view.pageSize - 1)
        }
        if (onlySave) return
        // 手动翻页了  当前页面不是最新页  不需要更新麻醉记录单 wxj
        if (vm.view.pageCur < vm.view.pageCount) {
          return
        }
        if (vm.index === 1 && data.total > vm.view.pageSize) {
          // 新页
          vm.view.pageCur++
          vm.view.pageCount =
            data.total <= vm.view.pageSize
              ? 1
              : Math.ceil((data.total - 1) / (vm.view.pageSize - 1))
          self.getobsData(vm, vm.regOptId, vm.docId, vm.ev_list, mergeobj)
        } else {
          var len = data.series.length
          for (var a = 0; a < len; a++) {
            // 循环series
            vm.oldResult.series[a].data.push(data.series[a].data[0])
          }
          vm.seriesData = vm.oldResult.series
          if (vm.seriesData.length && vm.seriesData[0].data.length) {
            // 更新数据描点时间轴
            vm.dataTimeArr = vm.seriesData[0].data.map(item => {
              return item.time
            })
          }
          vm.monEOpt.series = this.getSeries(vm.oldResult, vm)
          // 非新页面才执行 新页面重新_this.getobsData
          self.showRemark(vm, vm.docId, false, mergeobj)
          self.selfGetNewMon(vm, vm.regOptId, vm.inTime, mergeobj)
        }
      })
    }
    if (sideTime === 'paging') {
      // 翻页了，不是最后一页，下一个瞄点的时间-当前时间算出下一瞄点的时间
      var now_date = new Date().getTime()
      start_point(startTime - now_date)
      return
    }
    if (vm.pageState === 0 || vm.pageState === 3) {
      // 术中瞄点一般走这里
      start_point(sideTime)
    }

    function start_point(time) {
      // time毫秒后定时启动
      if (self.timer) {
        self.stopTimerPt()
      }
      self.timer = window.setTimeout(onLoad, time)
    }
  },
  deletePoint(_this, data, mergeObj, callBack) {
    _this
      .$confirm(
        '名称：' + data.seriesName + ' ，值：' + (+data.value[1]).toFixed(2),
        '确认信息',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      .then(() => {
        const data_p = Object.assign({}, data)
        data_p.value = ''
        updobsdat(data_p).then(() => {
          self.getobsData(_this, _this.regOptId, _this.docId, _this.ev_list, _this.mergeobj)
          callBack?.()
        })
      })
      .catch(() => {})
  },
  getobsData(_this, regOptId, docId, ev_list, mergeobj) {
    return new Promise(function(resolve) {
      if (_this.getobsdata_loading) {
        _this.getobsdata_loading.close()
      }
      _this.getobsdata_loading = _this.$loading({
        lock: false,
        text: '加载中...',
        customClass: 'loading_w_h',
        spinner: 'el-icon-loading',
        fullscreen: false,
        background: 'rgba(0, 0, 0, 0.1)'
      })
      self.inTimeWrap = _this.startOper.eventList.filter(item => {
        return (
          item.codeName === '入PACU时间' ||
          item.codeName === '入室' ||
          item.codeName === '入诱导室时间'
        )
      })[0]
      if (!self.inTimeWrap) {
        _this.getobsdata_loading.close()
        return
      }
      self.inTime = _this.inTime = self.inTimeWrap.startTime // 实时更新入室时间
      self.outTimeWrap = _this.startOper.eventList.filter(item => {
        return item.codeName === '出PACU时间'
      })[0] // 实时更新入室时间
      if (
        self.inTimeWrap.codeName === '入PACU时间' ||
        self.inTimeWrap.codeName === '入诱导室时间'
      ) {
        _this.startOper.anaesPacuRec.inTime = self.inTime
          ? dayjs(self.inTime).format('YYYY-MM-dd HH:mm')
          : ''
        _this.startOper.anaesPacuRec.outTime = self.outTimeWrap
          ? dayjs(self.outTimeWrap.startTime).format('YYYY-MM-dd HH:mm')
          : ''
      }
      _this.view.pageDone = false // 控制上一页下一页按钮不可以
      if (!mergeobj.onlyGetObsdata) self.stopTimerPt()
      getTraceObsRecord(
        regOptId,
        _this.view.pageCur == _this.view.pageCount ? 0 : _this.view.pageCur,
        _this.view.pageSize,
        _this.inTime,
        mergeobj
      ).then(data => {
        _this.getobsdata_loading.close()
        if (data.resultCode !== '1') return
        _this.monECfg.dataLoaded = false
        _this.markECfg.dataLoaded = false
        _this.seriesData = data.series
        if (_this.seriesData.length && _this.seriesData[0].data.length) {
          _this.dataTimeArr = _this.seriesData[0].data.map(item => {
            return item.time
          })
        }
        if (data.xAxis[0].data.length === 0) {
          data.xAxis[0].data.push({
            freq: data.freq,
            value: data.md.time + data.md.intervalTime * 1000
          })
        }
        _this.freq = data.freq
        _this.view.pageCount =
          data.total <= _this.view.pageSize
            ? 1
            : Math.ceil((data.total - 1) / (_this.view.pageSize - 1)) // 计算总页数
        _this.view.pageCur =
          _this.view.pageCur > _this.view.pageCount ? _this.view.pageCount : _this.view.pageCur
        // 计算时间轴
        self.createOrUpdateTimeArr49(_this, data)
        resolve()

        // 如果不是在术中或者不在复苏中就不要瞄点啦，只需要获取历史点数据
        if (
          (_this.pageState !== 0 || _this.operState !== '04') &&
          (_this.pageState !== 3 || _this.operState !== '05')
        ) {
          self.saveIntervalObsRec(_this, -1, data, undefined, mergeobj)
          return
        }
        // 代码能到这里说明它在术中且手术正在执行
        // 如果麻醉记录单不是在最后一页，点需要瞄，但是不需要更新echart
        if (_this.view.pageCur !== _this.view.pageCount) {
          self.saveIntervalObsRec(_this, 'paging', data, true, mergeobj)
          return
        }
        let t
        const hisTimes = []
        const times_ = new Date().getTime()
        t = data.md.time + data.md.intervalTime * 1000
        while (t < times_ && _this.freq !== 0) {
          // 计算要补点的时间点，累加频率后再和当前时间对比
          hisTimes.push(t)
          t += _this.freq * 1000
        }

        function budian() {
          if (_this.budian_loading) {
            _this.budian_loading.close()
          }
          _this.budian_loading = _this.$loading({
            lock: false,
            text: '补点中...',
            customClass: 'loading_w_h',
            spinner: 'el-icon-loading',
            fullscreen: false,
            background: 'rgba(0, 0, 0, 0.1)'
          })
          saveIntervalObsRec_api({
            docType: _this.docType,
            freq: _this.freq,
            inTime: _this.inTime,
            no: _this.view.pageCur,
            regOptId: _this.regOptId,
            size: _this.view.pageSize,
            isPauseState: _this.startInfo.regOpt.isPauseState,
            times: hisTimes
          }).then(() => {
            _this.budian_loading.close()
            // _this.seriesData = res.series // 补点没刷新数据描点数据
            // if (_this.seriesData.length && _this.seriesData[0].data.length) {
            //   _this.dataTimeArr = _this.seriesData[0].data.map(item => {
            //     return item.time
            //   })
            // }
            getTraceObsRecord(
              regOptId,
              _this.view.pageCur,
              _this.view.pageSize,
              _this.inTime,
              mergeobj
            ).then(result => {
              self.saveIntervalObsRec(_this, t - times_, result, undefined, mergeobj)
            })
          })
        }
        if (hisTimes.length > 0 && hisTimes.length < 500) {
          // 补点数组
          budian()
        } else {
          if (hisTimes.length === 0) {
            self.saveIntervalObsRec(_this, t - times_, data, undefined, mergeobj)
          } else {
            _this
              .$confirm('超过' + hisTimes.length + '个时间点无点及数据！是否补点？', '确认信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
              .then(() => {
                budian()
              })
              .catch(() => {
                self.saveIntervalObsRec(_this, t - times_, data, undefined, mergeobj)
              })
          }
        }
      })
    })
  },
  checkDisabled(item, index, timeArr) {
    // 检查时间是否可以填写
    if (
      item &&
      (item.label == '入手术间' ||
        item.label == '麻醉开始' ||
        item.label == '插管' ||
        item.label == '入复苏室')
    ) {
      return false
    } else if (item && item.label == '手术结束') {
      return !timeArr.filter(v => v.label == '手术开始')[0].value
    } else if (item && item.label == '手术开始') {
      return !timeArr.filter(v => v.label == '麻醉开始')[0].value
    } else if (item && item.label == '麻醉结束') {
      return !timeArr.filter(v => v.label == '麻醉开始')[0].value
    } else if (item && item.label == '拔管') {
      if (timeArr[0].label == '入复苏室') {
        return false
      }
      return !timeArr.filter(v => v.label == '插管')[0].value
    } else if (item && item.label == '出手术间') {
      return timeArr.filter(v => v.label != '出手术间' && v.require && !v.value).length !== 0
    } else if (item && item.label == '出复苏室') {
      return !timeArr.find(v => v.label == '入复苏室').value
    } else {
      return true
    }
  }
}
export default self
