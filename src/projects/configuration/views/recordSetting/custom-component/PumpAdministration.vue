<!-- 泵入给药图  -->
<template>
  <chart :ref="id" class="flex-1 border-bottom chart" tabindex="1" :id="id" :class="id" :config="monECfg"
    :option="monEOpt" height="100%" />
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs' // 时间的处理模块
import Chart from '@/components/Charts/anas'
export default {
  data() {
    return {
      monECfg: {
        dir: 'y'
      },
      monEOpt: {}
    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object,
      default: () => []
    },
    mode: { // 当一个页面中 有多个文书显示时  区分各个组件的id
      type: String,
      default: ''
    }
  },
  components: { Chart },
  computed: {
    ...mapState(['editMode']),
    id() {
      return (
        'id:' + this.mode +
        this.element?.id +
        'curPageNum_' +
        (this.element.attr.curPageNum ?? '') +
        'pageNum_' +
        (this.element.attr.pageNum ?? '')
      )
    }
  },
  created() { },
  methods: {
    handleInput(value) { },
    /**
     * 判断是否小数
     */
    decimal(number) {
      const str = number + ''
      return str.indexOf('.') == -1
    },
    /**
     * 时间格子计算
     */
    lineTime(time, startTime, latticeTime) {
      const allTime = new Date(time).getTime() - new Date(startTime).getTime()
      const rqValue = allTime / latticeTime
      return rqValue > 0 ? rqValue : 0.01
    }
  },
  watch: {
    /**
     * 改变组件大小
     */
    propStyle: function (newValue, oldValue) {
      if (oldValue != newValue) {
        this.$refs[this.id]?.chart.resize()
      }
    },
    element: {
      handler(data) {
        const { attr } = data
        const newDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // attr.lineCenter 进度条居中显示
        const getTime =
          new Date(attr.endTime).getTime() - new Date(attr.startTime).getTime() // 结束时间和结束时间 间隔
        const latticeTime = getTime / attr.hGridNum // 一个格子的时间
        const seriesList = []
        const number = attr.lineCenter != 1 ? 1 : 0.5
        if (attr.curPageData && attr.curPageData.length > 0) {
          attr.curPageData.map((item, index) => {
            const echartsData = []
            index += number
            for (let i = 0; i < item.length; i++) {
              // 1-开始，2-暂停，3-继续，4-巡视，5-完成, 6-续药 7-速推
              switch (item[i].ORDER_ACTION_DICT) {
                case '1':
                  // 1-开始
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: function (params) {
                        if (item[i].CONTINUATION == '1') { // 需要或者是换药开始点
                          const continueFlag = (attr.continueStyle == '2' || !attr.continueStyle) ? '换' : ''
                          return item[i - 1]
                        ? item[i].FLOW_RATE > 0 &&
                          item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                          ? `${continueFlag}${item[i].FLOW_RATE}`
                          : continueFlag
                        : continueFlag
                        } else {
                          let html = ''
                          const FLOW_RATE = item[i].FLOW_RATE || ''
                          const EXECUTE_TIME = (item[i].EXECUTE_TIME ?? '') != '' && attr.startTimeSelect && attr.startTimeSelect != '' ? dayjs(new Date(item[i].EXECUTE_TIME)).format(attr.startTimeSelect) : ''
                          if (attr.dislocation != 1) {
                            html = EXECUTE_TIME != '' ? `${EXECUTE_TIME}\t${FLOW_RATE}` : `${FLOW_RATE}`
                          } else {
                            html = FLOW_RATE > 0 ? EXECUTE_TIME != '' ? `${EXECUTE_TIME}\t${FLOW_RATE}` : `${FLOW_RATE}` : ''
                          }
                          return html
                        }
                      },
                      show: true,
                      color: 'red',
                      position: (attr.dislocation != 1 ? [12, 0] : [8, -13]),
                      offset: item[i].EXECUTE_TIME == attr.startTime ? [2, 0] : (item[i].EXECUTE_TIME == attr.endTime ? [-10, 0] : 0),
                      fontSize: 12,
                      distance: item[i].CONTINUATION == '1' ? -5 : 0,
                      fontFamily: 'Microsoft YaHei'
                    }
                  })
                  if (i + 1 == item.length) {
                    echartsData.push({
                      value: [
                        this.lineTime(newDate, attr.startTime, latticeTime),
                        index
                      ],
                      symbolSize: 1
                    })
                  }
                  break
                case '2':
                  // 2-暂停
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index],
                      symbolSize: 1
                    })
                  }
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: item[i - 1]
                        ? item[i].FLOW_RATE > 0 &&
                          item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                          ? `${item[i].FLOW_RATE}`
                          : ''
                        : item[i].FLOW_RATE > 0
                          ? `${item[i].FLOW_RATE}`
                          : '',
                      show: true,
                      color: 'red',
                      position: attr.dislocation != 1 ? [0, -7] : [0, -19],
                      distance: -5,
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  break
                case '3':
                  // 3-继续
                  echartsData.push({
                    value: []
                  })
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: function() {
                        const goonFlag = '续'
                        let lable = ''
                        if (i > 0) {
                          lable = item[i - 1]
                        ? item[i].FLOW_RATE > 0 &&
                          item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                          ? `${goonFlag}${item[i].FLOW_RATE}`
                          : goonFlag
                        : item[i].FLOW_RATE > 0
                          ? `${item[i].FLOW_RATE}`
                          : goonFlag
                        } else {
                          lable = `${goonFlag}${item[i].FLOW_RATE}`
                        }
                        return lable
                      },
                      show: true,
                      color: 'red',
                      position: attr.dislocation != 1 ? [0, -7] : [0, -19],
                      offset: item[i].EXECUTE_TIME == attr.startTime ? [2, 0] : (item[i].EXECUTE_TIME == attr.endTime ? [-10, 0] : 0),
                      distance: -5,
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  if (i + 1 == item.length) {
                    echartsData.push({
                      value: [
                        this.lineTime(newDate, attr.startTime, latticeTime),
                        index
                      ],
                      symbolSize: 1
                    })
                  }
                  break
                case '4':
                  // 4-巡视
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index],
                      symbolSize: 1
                    })
                  }
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: item[i - 1]
                        ? item[i].FLOW_RATE > 0 &&
                          item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                          ? `${item[i].FLOW_RATE}`
                          : ''
                        : item[i].FLOW_RATE > 0
                          ? `${item[i].FLOW_RATE}`
                          : '',
                      show: true,
                      color: 'red',
                      position: attr.dislocation != 1 ? [0, -7] : [0, -19],
                      distance: -5,
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  if (i + 1 == item.length) {
                    echartsData.push({
                      value: [
                        this.lineTime(newDate, attr.startTime, latticeTime),
                        index
                      ],
                      symbolSize: 1
                    })
                  }
                  break
                case '5':
                  // 5-完成  如果只有一个。前面需要补全
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index],
                      symbolSize: 1
                    })
                  }
                  if (item[i + 1] && item[i + 1].CONTINUATION == '1') {
                    echartsData.push({
                      value: [
                        this.lineTime(
                          item[i].EXECUTE_TIME,
                          attr.startTime,
                          latticeTime
                        ),
                        index
                      ],
                      label: {
                        formatter: item[i - 1]
                          ? item[i].FLOW_RATE > 0 &&
                            item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                            ? `${item[i].FLOW_RATE}`
                            : ''
                          : item[i].FLOW_RATE > 0
                            ? `${item[i].FLOW_RATE}`
                            : '',
                        show: true,
                        color: 'red',
                        position: attr.dislocation != 1 ? [0, -7] : [0, -19],
                        fontSize: 12,
                        fontFamily: 'Microsoft YaHei'
                      },
                      symbolSize: 1
                    })
                  } else {
                    echartsData.push({
                      value: [
                        this.lineTime(
                          item[i].EXECUTE_TIME,
                          attr.startTime,
                          latticeTime
                        ),
                        index
                      ],
                      label: {
                        formatter: item[i - 1]
                          ? item[i].FLOW_RATE > 0 &&
                            item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                            ? `${item[i].FLOW_RATE}`
                            : ''
                          : item[i].FLOW_RATE > 0
                            ? `${item[i].FLOW_RATE}`
                            : '',
                        show: true,
                        color: 'red',
                        position: attr.dislocation != 1 ? [12, 0] : [8, -13],
                        fontSize: 12,
                        fontFamily: 'Microsoft YaHei'
                      }
                    })
                  }
                  if (
                    i + 1 != item.length &&
                    item[i + 1] &&
                    item[i + 1].ORDER_ACTION_DICT != '5'
                  ) {
                    echartsData.push({
                      value: []
                    })
                  }
                  break
                case '6':
                  // 6-续药
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index],
                      symbolSize: 1
                    })
                  }
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: function() {
                        const continueFlag = (attr.continueStyle == '2' || !attr.continueStyle) ? '换' : ''
                        return item[i - 1]
                        ? item[i].FLOW_RATE > 0 &&
                          item[i - 1].FLOW_RATE != item[i].FLOW_RATE
                          ? `${continueFlag}${item[i].FLOW_RATE}`
                          : continueFlag
                        : continueFlag
                      },
                      show: true,
                      color: 'red',
                      position: attr.dislocation != 1 ? [0, -9] : [0, -20],
                      distance: -5,
                      offset: item[i].EXECUTE_TIME == attr.startTime ? [2, 0] : (item[i].EXECUTE_TIME == attr.endTime ? [-10, 0] : 0),
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  if (i + 1 == item.length) {
                    echartsData.push({
                      value: [
                        this.lineTime(newDate, attr.startTime, latticeTime),
                        index
                      ],
                      symbolSize: 1
                    })
                  }
                  break
                case '7':
                  // 7-速推
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index],
                      symbolSize: 1
                    })
                  }
                  echartsData.push({
                    value: [
                      this.lineTime(
                        item[i].EXECUTE_TIME,
                        attr.startTime,
                        latticeTime
                      ),
                      index
                    ],
                    label: {
                      formatter: item[i - 1]
                        ? `静推${item[i].REAL_INPUT}ml` : '',
                      show: true,
                      color: 'red',
                      position: [0, -19],
                      distance: -5,
                      offset: item[i].EXECUTE_TIME == attr.startTime ? [2, 0] : (item[i].EXECUTE_TIME == attr.endTime ? [-10, 0] : 0),
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  if (i + 1 == item.length) {
                    echartsData.push({
                      value: [
                        this.lineTime(newDate, attr.startTime, latticeTime),
                        index
                      ],
                      symbolSize: 1
                    })
                  }
                  break
                }
            }
            seriesList.push({
              type: 'line',
              symbol: 'triangle',
              symbolSize: 13,
              symbolRotate: 180,
              symbolOffset: [0, -6],
              name: '换',
              itemStyle: {
                color: '#000'
              },
              lineStyle: {
                color: 'red',
                width: 2
              },
              data: echartsData
            })
          })
        }
        if (attr.gridStyle == '2') {
          this.monEOpt = {
            grid: {
              bottom: 0,
              left: -1,
              right: 0,
              top: -1
            },
            xAxis: [
              {
                min: 0,
                max: attr.hGridNum, // 横轴格数
                interval: 1,
                type: 'value',
                axisLine: {
                  onZero: false,
                  show: false
                },
                axisLabel: {
                  rotate: 15,
                  show: false,
                  interval: 0
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: 'dotted',
                    opacity: 1
                  }
                }
              },
              {
                min: 0,
                max: attr.hGridNum, // 横轴格数
                interval: 2,
                type: 'value',
                axisLine: {
                  onZero: false,
                  show: false
                },
                axisLabel: {
                  rotate: 15,
                  show: false,
                  interval: 0
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: 'solid',
                    opacity: 1
                  }
                }
              }
            ],
            yAxis: [
              {
                min: 0,
                max: attr.vGridNum, // 纵轴格数
                interval: 1,
                inverse: true,
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true
                },
                axisLabel: {
                  show: true
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: 'dotted',
                    opacity: 1
                  },
                  interval: 0
                }
              },
              {
                min: 0,
                max: attr.vGridNum, // 纵轴格数
                interval: 2,
                inverse: true,
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true
                },
                axisLabel: {
                  show: true
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: 'solid',
                    opacity: 1
                  },
                  interval: 0
                }
              }
            ],
            series: seriesList
          }
        } else {
          this.monEOpt = {
            grid: {
              bottom: 0,
              left: -1,
              right: 0,
              top: -1
            },
            xAxis: [
              {
                min: 0,
                max: attr.hGridNum, // 横轴格数
                interval: 1,
                type: 'value',
                axisLine: {
                  onZero: false,
                  show: false
                },
                axisLabel: {
                  rotate: 15,
                  show: false,
                  interval: 0
                },
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: attr.gridStyle ? 'solid' : 'dotted',
                    opacity: 1
                  }
                }
              }
            ],
            yAxis: [
              {
                min: 0,
                max: attr.vGridNum, // 纵轴格数
                interval: 1,
                inverse: true,
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true
                },
                axisLabel: {
                  show: true
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#000',
                    type: attr.gridStyle ? 'solid' : 'dotted',
                    opacity: 1
                  },
                  interval: 0
                }
              }
            ],
            series: seriesList
          }
        }
        console.log(this.monEOpt)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
