<!-- ICU质控指标 -->
<template>
  <el-container id="daysStatistics" class="daysStatistics">
    <!-- 顶部类容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
         <span>{{item.moduleName}}</span>
      </div>
    </el-header>
    <!-- 中间类容部分 -->
    <el-main>
      <div v-if="dataLength!=0" :id="item.moduleName+'chartId'" class="chartCss"></div>
      <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { device_getDeviceStatusCount } from '@/api/wardOverview'
import echarts from 'echarts'
export default {
  name: 'DeviceStatusCount',
  components: {},
  data: function () {
    return {
      myChart: {},
      dataLength: 0,
      option: {
        legend: {
          show: true,
          position: 'top'
        },
        grid: {
          left: '3%',
          right: 25,
          top: 30,
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
        ],
        tooltip: {
          show: true
        },
        xAxis: [
          {
            type: 'category',
            data: [

            ]
          }
        ],
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
    this.getStatisticsData()
  },
  methods: {
    /** 获取icu质控数据 */
    getStatisticsData() {
      // const { startTime, endTime } = this.timeFormat()
      const query = {
        wardCode: this.currentUserWard.wardCode
      }
      device_getDeviceStatusCount(query).then(res => {
        this.option.xAxis[0].data = res.data.map(item => item.deviceTypeName)
        this.option.series = []
        this.option.series.push({
          type: 'bar',
          name: '闲置',
          barWidth: 12,
          barMinWidth: 5,
          barMaxWidth: 30,
          color: '#5ad8a6',
          data: res.data.map(item => item.emptyCount)
        })
        this.option.series.push({
          type: 'bar',
          name: '借出',
          barWidth: 12,
          barMinWidth: 5,
          barMaxWidth: 30,
          color: '#f6bd16',
          data: res.data.map(item => item.lendCount)
        })
        this.option.series.push({
          type: 'bar',
          name: '在用',
          barWidth: 12,
          barMinWidth: 5,
          barMaxWidth: 30,
          color: '#588ff9',
          data: res.data.map(item => item.usedCount)
        })
        this.option.series.push({
          type: 'line',
          name: '总数',
          data: res.data.map(item => item.total)
        })
        this.option.dataZoom[0].end = 4 * 100 / res.data.length
        if (res.data.length <= 4) {
          this.option.dataZoom[0].show = false
        } else {
          this.option.dataZoom[0].show = true
        }
        this.dataLength = res.data.length
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
    .radioDiv {
      padding-left: vw(20);
      margin-bottom: 0px;
      // radio 的字体颜色
      .el-radio {
        margin-right: vw(24);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 6, 34, 0.8);
      }
      .el-radio__label {
        padding-left: vw(8);
      }
    }
    .chartCss {
      width: 100%;
      height: calc(100% - 20px);
    }
  }
}
</style>
