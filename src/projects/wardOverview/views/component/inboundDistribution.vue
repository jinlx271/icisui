<!-- 入区分布 -->
<template>
  <el-container id="inboundDistribution" class="inboundDistribution">
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
  wlStatistics_inAreaStatic
} from '@/api/wardOverview'
import echarts from 'echarts'
export default {
  name: 'InboundDistribution',
  components: {},
  data: function () {
    return {
      timeType: '3',
      dataLength: 0,
      option: {
        grid: {
          left: '3%',
          right: 25,
          top: '15%',
          bottom: 0,
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: '入区分布'
            }
          }
        },
        xAxis: [{
          type: 'category',
          data: [],
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
            margin: 5
          }
        }],
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
            data: [],
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
    }, // 配置那边跳过了的高度宽度设置
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.getData()
  },
  mounted() {
    window.addEventListener('resize', this.echartsFc)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.echartsFc)
  },
  methods: {
    /**
     * 获取数据统计
     */
    getData() {
      const query = {
        icuAreaCode: this.currentUserWard.wardCode, // 病区code
        startDateTime: this.queryParams.startDate || '',
        endDateTime: this.queryParams.endDate || ''
      }
      if (query.startDateTime == '' && query.endDateTime == '') {
        return
      }
      wlStatistics_inAreaStatic(query).then(res => {
        this.option.xAxis[0].data = []
        this.option.series[0].data = []
        this.dataLength = res.data?.length
        res.data.map(i => {
          this.option.xAxis[0].data.push(i.distributionName)
          this.option.series[0].data.push(i.count)
        })
        this.echartsFc()
      }).catch(res => {
        this.dataLength = 0
      })
    },
    /**
     * echarts
     */
    echartsFc() {
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
.inboundDistribution {
  width: 100%;
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
      height: calc(100% - 20px);
    }
  }
}
</style>
