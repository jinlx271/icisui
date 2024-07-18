import { liquidRecord_getLiquidStatistics } from '@/api/fluidBalance.js'

export default {
  data() {
    return {
      liquidLoading: false,
      luquidOption: {
        // 液体平衡的数据
        legend: {
          data: ['平衡量', '入量', '出量'],
          left: 'center'
        },
        grid: {
          top: '30px',
          bottom: '10px',
          right: '15px',
          left: '10px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left',
            color: '#333'
          },
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          axisPointer: {
            lineStyle: {
              type: 'dashed',
              color: '#ccc'
            }
          },
          formatter: function (p, ticket, callback) {
            let htmlStr = '<div"><span>' + p[0].name + '</span><br>'
            p.forEach((item) => {
              const data = item.data.value ? item.data.value : item.data
              if (item.seriesName == '出量') htmlStr += '<span style="color:' + item.color + '">' + item.seriesName + ' ：' + Math.abs(data) + '</span><br>'
              else htmlStr += '<span style="color:' + item.color + '">' + item.seriesName + ' ：' + data + '</span><br>'
            })
            return htmlStr
          }
        },
        xAxis: [
          {
            axisLine: {
              show: false,
              onZero: true,
              color: '#000622'
            },
            // 纵向的分割线
            splitLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#DFE7F5'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: (p) => {
                return p.split(':')[0]
              }
            },
            position: 'bottom',
            offset: 0,
            data: [],
            boundaryGap: true // 这个false x轴文字会与刻度线对齐   true x轴文字 在刻度线中间
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed', // 虚线
                color: '#DFE7F5'
              }
            },
            axisLine: {
              show: false
            },
            axisLable: {
              show: true,
              color: '#000622'
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '入量',
            type: 'bar',
            barWidth: 10,
            color: '#43CF7C',
            data: [],
            barGap: '-100%',
            silent: true,
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: 0,
                  lineStyle: {
                    color: '#F52C2C',
                    type: 'solid'
                  },
                  label: {
                    show: false
                  }
                }
              ]
            }
          },
          {
            name: '出量',
            type: 'bar',
            barWidth: 10,
            color: '#FF8D1A',
            data: []
          },
          {
            name: '平衡量',
            type: 'line',
            color: '#2A82E4',
            data: []
          }
        ]
      },
      luquidDataByHour: {},
      luquidOpt1: {}
    }
  },
  mounted() {},
  methods: {
    // 获取液体平衡
    getLuquidDataList() {
      this.liquidLoading = true
      const query = {
        wardCode: this.currentUserWard.wardCode,
        frequency: '1',
        icuRecordId: this.patientInfo.icuRecordId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      liquidRecord_getLiquidStatistics(query)
        .then((res) => {
          this.liquidLoading = false
          if (res.code == 0) {
            this.luquidDataByHour = res.data
            this.luquidOpt1 = { ...this.luquidOption }
            this.luquidOpt1.xAxis[0].data = res.data.title
            this.luquidOpt1.series[2].data = res.data.balanceSectionList
            this.luquidOpt1.series[0].data = res.data.inSectionList
            this.luquidOpt1.series[1].data = res.data.outSectionList.map((item) => {
              return -1 * item
            })
          }
        })
        .catch((e) => {
          this.liquidLoading = false
        })
    }
  }
}
