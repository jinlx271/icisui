<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { mapGetters } from 'vuex'
export default {
  mixins: [resize],
  props: {
    devicePixelRatio: {
      type: Number,
      default: () => {
        return 3
      }
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    lineClickFlag: { // 折线加粗效果
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  computed: {
    // 当前拖动添加的series
    ...mapGetters(['curSeries']),
    getDom() {
      return {}
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (document.getElementById(this.id)) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    dispatchAction(p) {
      const { start, end } = p
      this.chart.dispatchAction({
        type: 'dataZoom',
        start,
        end
      })
    },
    initChart() {
      document.getElementById(this.id).oncontextmenu = () => {
        return false
      } // 屏蔽右键默认事件
      this.chart = echarts.init(document.getElementById(this.id), null, {
        renderer: 'canvas'
      })
      const mouseover = function (params) {
        this.$emit('mouseover', params)
      }.bind(this)
      this.chart.on('mouseover', mouseover)
      this.chart.on('datazoom', (p) => {
        this.$emit('dataZoom', p)
      })
      this.chart.clear()
      this.chart.on('finished', () => {
        this.$bus.$emit('chartFinished')
      })
      this.chart.setOption(this.option)
      this.chart._zr.on('click', this.clickHandler)
      this.chart.resize()
    },
    clickHandler(event) {
      if (this.lineClickFlag) {
        const { target, topTarget } = event
        // 判断点击的点在  点击在折线的拐点 || 折线上
        // if (target?.z === 2 || topTarget?.z === 2) {
        // 获取这条折线的 信息 也就是 index
        // 如果是拐点，直接读取 target.seriesIndex
        // 如果是折线上的点，读取 topTarget 对象下的继续寻找parent的信息的index
        const seriesIndex = target
            ? target.seriesIndex
            : topTarget?.parent?.parent?.__ecComponentInfo?.index
            console.log('seriesIndex', seriesIndex)
            console.log('optionTemp', this.option)
        if (seriesIndex) {
          const optionTemp = JSON.parse(JSON.stringify(this.option))
          console.log('optionTemp.series[seriesIndex]', optionTemp.series[seriesIndex])
          if (optionTemp.series[seriesIndex].lineTypeDict != 'point') {
            optionTemp.series[seriesIndex].lineStyle.normal.width = 3
          }
          optionTemp.series[seriesIndex].symbolSize = optionTemp.series[seriesIndex].symbolSize * 1.5
          optionTemp.series[seriesIndex].data = optionTemp.series[seriesIndex].data.map(item => {
            if (item.label) {
              item.label.show = true
              item.label.fontSize = 14
              item.label.position = [0, -10]
              item.label.color = '#000'
              item.label.formatter = function(p) {
                return p.data.value[1]
              }
            }
            return item
          })
          optionTemp.xAxis = this.option.xAxis
          this.chart.clear()
          this.chart.setOption(optionTemp)
        } else {
          this.chart.clear()
          this.chart.setOption(this.option)
        }
      }
    }
  },
  watch: {
    readonly() {
      this.initChart()
    },
    option: {
      handler() {
        this.chart?.clear()
        const dom = document.getElementById(this.id)
        if (dom) {
          dom.removeAttribute('_echarts_instance_')
          dom.oncontextmenu = () => {
            return false
          } // 屏蔽右键默认事件
          this.chart = echarts.init(dom, null, {
            devicePixelRatio: this.devicePixelRatio
          })
        }
        this.chart?.setOption(this.option)
        this.chart?.resize()
        this.chart?._zr.on('click', this.clickHandler)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
.markspecial,
.markspecial_print {
  position: absolute !important;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 74px !important;
}

.markspecial_print {
  height: 60px !important;
}
</style>
