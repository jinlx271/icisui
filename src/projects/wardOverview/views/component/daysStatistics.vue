  <!-- 患者在区天数统计 -->
<template>
  <el-container id="daysStatistics" class="daysStatistics">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间内容部分 -->
    <el-main>
      <div v-show="dataLength != 0" :id="item.moduleName + 'chartId'" class="chartCss"></div>
      <el-empty v-show="dataLength == 0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  wardOverview_getInHospitalDays
} from '@/api/wardOverview'
import echarts from 'echarts'
export default {
  name: 'DaysStatistics',
  components: {},
  data: function () {
    return {
      dataLength: 0,
      option: {
        grid: {
          left: '3%',
          right: 25,
          top: '5%',
          bottom: 15,
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 30,
            height: 12,
            bottom: 0,
            fillerColor: 'rgba(167,183,204,0.4)'
          }
          // { type: 'inside', start: 0, end: 10 }
        ],
        tooltip: {
          trigger: 'item',
          formatter: function (data) {
            let userName = ''
            for (let i = 0; i < data.name.length; i++) {
              if (i % 15 == 0 && i !== 0) {
                userName += '<br>'
              }
              userName += data.name[i]
            }
            return `${userName}: ${data.data.detail}`
          },
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          fontSize: 14,
          padding: [5, 10],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: [
            '01床',
            '02床',
            '03床',
            '04床',
            '05床',
            '06床',
            '07床',
            '08床',
            '09床',
            '10床'
          ],
          nameTextStyle: {
            color: 'rgba(0, 6, 34, 0.7)',
            fontStyle: 'italic',
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular, PingFang SC'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'E9E9E9',
              type: 'dashed'
            }
          },
          axisTick: {
            show: true,
            interval: 0,
            alignWithLabel: true,
            length: 0
          },
          axisLabel: {
            color: 'rgba(0, 6, 34, 0.7)',
            interval: 0,
            margin: 5,
            formatter: function (value) {
              if (value.length > 3) {
                return value.substring(0, 3) + '...'
              } else {
                return value
              }
            }
          }
        },
        yAxis: {
          type: 'value',
          nameTextStyle: {
            color: '#fff',
            fontStyle: 'italic',
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular, PingFang SC'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            data: [8, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            type: 'bar',
            barWidth: 12,
            barMinWidth: 5,
            barMaxWidth: 30,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4DA9FF' },
                { offset: 1, color: '#0A94FF' }
              ])
            }
          }
        ]
      }
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {} // 按最小的来算
      }
    } // 配置那边跳过了的高度宽度设置
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() { },
  mounted() {
    this.getData()
    window.addEventListener('resize', this.queryData)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.queryData)
  },
  methods: {
    /**
     * 获取数据统计
     */
    getData() {
      const query = {
        'wardCode': this.currentUserWard.wardCode
      }
      wardOverview_getInHospitalDays(query).then(res => {
        const xData = []
        const yData = []
        this.dataLength = res.data.length
        const seriesData = []
        res.data.forEach(item => {
          xData.push(item.patientName)
          yData.push(item.inHospitalDays)
          seriesData.push({
            detail: item.inHospitalDaysDetail,
            value: item.inHospitalDays
          })
        })
        if (xData?.length <= 8) {
          this.option.dataZoom[0].end = 100
          // this.option.dataZoom[1].end = 100
        } else if (xData?.length > 8) {
          this.option.dataZoom[0].end = parseInt(8 / xData.length * 100)
          // this.option.dataZoom[1].end = parseInt(8 / xData.length * 100)
        }
        this.option.xAxis.data = xData

        this.option.series[0].data = seriesData
        this.queryData()
      })
    },
    queryData() {
      this.$nextTick(() => {
        this.myChart = echarts.init(
          document.getElementById(this.item.moduleName + 'chartId')
        )
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.daysStatistics {
  box-shadow: 0px 3px 5px 0px rgba(203, 215, 238, 0.5);
  background: #fff;

  p {
    margin: 0;
  }

  ::v-deep .el-header {
    height: 46px !important;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding: 0;

    .iconBlue {
      margin-left: vw(15);
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }

    div {
      display: inline-flex;
      align-items: center;
    }

    span {
      flex: 1;
      margin-left: vw(8);
      height: 22px;
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 22px;
      font-weight: bold;
      font-size: 18px;
      color: var(--maincolor);
    }
  }

  ::v-deep .el-main {
    padding: 0;
    height: calc(100% - 50px);

    .chartCss {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
