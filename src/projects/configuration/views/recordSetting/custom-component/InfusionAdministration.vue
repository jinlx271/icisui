/* 输液给药图 */
<template>
  <chart :ref="id" class="flex-1 border-bottom chart" tabindex="1" :id="id" :class="id" :config="monECfg"
    :option="monEOpt" height="100%" />
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs' // 时间的处理模块
import _ from 'lodash'
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
      type: Object
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
  methods: {
    /**
     * 时间格子计算
     */
    lineTime(time, startTime, latticeTime) {
      const allTime = new Date(time).getTime() - new Date(startTime).getTime()
      const rqValue = allTime / latticeTime
      return rqValue > 0 ? rqValue : 0.01
    },
    /**
     * 相同的药品归类
     */
    classification(data) {
      // 处理数据，如果有相同的订单号，则合并
      var obj = {}
      var array = []
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        if (!obj[item.DRUG_CODE]) {
          array.push({
            code: item.DRUG_CODE,
            data: [item]
          })
          obj[item.DRUG_CODE] = item
        } else {
          for (var j = 0; j < array.length; j++) {
            var item2 = array[j]
            if (item2.code == item.DRUG_CODE) {
              item2.data.push(item)
              break
            }
          }
        }
      }
      return array
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
        const number = attr.lineCenter != 1 ? 1 : 0.5 // 线条居中显示
        let orderIdData = []
        if (attr.curPageData && this.element.attr.proApi == 'service_order_plan_record' && attr.curPageData.length > 0) {
          let pageData = []
          attr.curPageData.map(item => {
            pageData = pageData.concat(item)
          })
          const arr = _.groupBy(pageData, 'ORDER_ID')
          for (const key in arr) {
             orderIdData.push(arr[key])
          }
        } else {
          orderIdData = attr.curPageData
        }

        if (attr.curPageData && orderIdData.length > 0) {
          orderIdData.map((item, index) => {
            const echartsData = []
            index += number
            for (let i = 0; i < item.length; i++) {
              // 1-开始，2-暂停，3-继续，4-巡视，5-完成
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
                        let html = ''
                        const EXECUTE_TIME = (item[i].EXECUTE_TIME ?? '') != '' && attr.startTimeSelect && attr.startTimeSelect != '' ? dayjs(new Date(item[i].EXECUTE_TIME)).format(attr.startTimeSelect) : ''
                        if (attr.staggeredInput != 1) {
                          html = item[i].REAL_INPUT > 0 ? `(${item[i].SEQUENCE_NO})${EXECUTE_TIME}${item[i].REAL_INPUT}ml` : `(${item[i].SEQUENCE_NO})${EXECUTE_TIME}`
                        } else {
                          html = item[i].REAL_INPUT > 0 ? `${EXECUTE_TIME}${item[i].REAL_INPUT}ml\n(${item[i].SEQUENCE_NO})` : `${EXECUTE_TIME}\n(${item[i].SEQUENCE_NO})`
                        }
                        return html
                      },
                      color: '#000',
                      show: true,
                      position: attr.staggeredInput != 1 ? [0, -15] : [0, -25],
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
                      ]
                    })
                  }
                  break
                case '2':
                  // 2-暂停
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index]
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
                      formatter: function (params) {
                        let html = ''
                        if (attr.staggeredInput != 1) {
                          html = item[i].REAL_INPUT > 0 ? `(${item[i].SEQUENCE_NO})${item[i].REAL_INPUT}ml` : `(${item[i].SEQUENCE_NO})`
                        } else {
                          html = item[i].REAL_INPUT > 0 ? `\t\t\t${item[i].REAL_INPUT}ml\n(${item[i].SEQUENCE_NO})` : `\n(${item[i].SEQUENCE_NO})`
                        }
                        return html
                      },
                      color: '#000',
                      show: true,
                      position: attr.staggeredInput != 1 ? [0, -15] : [0, -25],
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
                  break
                case '3':
                  // 3-继续
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index]
                    })
                  }
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
                      formatter: function (params) {
                        let html = ''
                        if (attr.staggeredInput != 1) {
                          html = item[i].REAL_INPUT > 0 ? `(${item[i].SEQUENCE_NO})${item[i].REAL_INPUT}ml` : `(${item[i].SEQUENCE_NO})`
                        } else {
                          html = item[i].REAL_INPUT > 0 ? `\t\t\t${item[i].REAL_INPUT}ml\n(${item[i].SEQUENCE_NO})` : `\n(${item[i].SEQUENCE_NO})`
                        }
                        return html
                      },
                      color: '#000',
                      show: true,
                      position: attr.staggeredInput != 1 ? [0, -15] : [0, -25],
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
                      ]
                    })
                  }
                  break
                case '4':
                  // 4-巡视
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index]
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
                      formatter: function (params) {
                        let html = ''
                        if (attr.staggeredInput != 1) {
                          html = item[i].REAL_INPUT > 0 ? `(${item[i].SEQUENCE_NO})${item[i].REAL_INPUT}ml` : `(${item[i].SEQUENCE_NO})`
                        } else {
                          html = item[i].REAL_INPUT > 0 ? `\t\t\t${item[i].REAL_INPUT}ml\n(${item[i].SEQUENCE_NO})` : `\n(${item[i].SEQUENCE_NO})`
                        }
                        return html
                      },
                      color: '#000',
                      show: true,
                      position: attr.staggeredInput != 1 ? [0, -15] : [0, -25],
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
                      ]
                    })
                  }
                  break
                case '5':
                  // 5-完成,
                  if (i == 0) {
                    echartsData.push({
                      value: [0, index]
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
                      formatter: function (params) {
                        let html = ''
                        if (attr.staggeredInput != 1) {
                          html = item[i].REAL_INPUT > 0 ? `(${item[i].SEQUENCE_NO})${item[i].REAL_INPUT}ml` : `(${item[i].SEQUENCE_NO})`
                        } else {
                          html = item[i].REAL_INPUT > 0 ? `\t\t\t${item[i].REAL_INPUT}ml\n(${item[i].SEQUENCE_NO})` : `\n(${item[i].SEQUENCE_NO})`
                        }
                        return html
                      },
                      color: '#000',
                      show: true,
                      position: attr.staggeredInput != 1 ? [0, -15] : [0, -25],
                      fontSize: 12,
                      fontFamily: 'Microsoft YaHei'
                    },
                    symbolSize: 1
                  })
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
              }
            }
            seriesList.push({
              type: 'line',
              symbol: 'triangle',
              symbolSize: 0,
              symbolRotate: 180,
              itemStyle: {
                normal: {
                  color: 'black'
                }
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
              left: -2,
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
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                boundaryGap: true,
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
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                boundaryGap: true,
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
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                boundaryGap: true,
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
        console.log('this.monEOpt', this.monEOpt)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
