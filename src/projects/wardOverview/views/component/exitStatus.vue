<!-- 本月患者出区状态分布 -->
<template>
  <el-container id="exitStatus" class="exitStatus">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间内容部分 -->
    <el-main>
      <div v-show="this.option.series[0].data.length != 0" id="chartExitStatus" class="chartCss"></div>
      <el-empty v-show="this.option.series[0].data.length == 0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { wardOverview_outAreaStatic } from '@/api/wardOverview'
export default {
  name: 'ExitStatus',
  components: {},
  data: function () {
    return {
      option: {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (data) {
        //     return data.name + ':  ' + data.percent.toFixed(0) + '%'
        //     // return data.name + ':  ' + data.value + '人'
        //   },
        //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
        //   fontSize: 14,
        //   padding: [5, 20],
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        legend: {
          top: 'bottom',
          left: 'center',
          itemGap: 20, // 间隔
          itemWidth: 15,
          selectedMode: true,
          textStyle: {
            color: 'rgba(0, 6, 34, 0.7)',
            fontStyle: 'normal',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: '400',
            fontSize: 13
          }
        }, // 文案颜色注明
        series: [
          {
            name: '面积模式',
            width: '80%',
            type: 'pie',
            radius: '55%',
            // center: ['50%', '50%'],
            color: [
              '#91cc75',
              '#73c0de',
              '#5470c6',
              '#fac858',
              '#ee6666',
              '#3ba272',
              '#fc8452',
              '#9a60b4',
              '#ea7ccc'
            ],
            label: {
              show: true,
              formatter: '{c0}'
            }, // 圈圈旁边的文案
            itemStyle: {
              borderRadius: 8
            },
            data: [
              // { value: 0, name: '经口气管插管' },
              // { value: 0, name: '经鼻气管插管' },
              // { value: 5, name: '气管切开' }
            ]
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
    this.init()
  },
  mounted() {
    window.addEventListener('resize', this.echartsFC)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.echartsFC)
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryData()
    },
    /**
     * 请求数据
     */
    queryData() {
      const query = {
        wardCode: this.currentUserWard.wardCode // 病区code
      }
      if (this.queryParams && this.queryParams.startDate && this.queryParams.endDate) {
        query.startDate = this.queryParams.startDate
        query.endDate = this.queryParams.endDate
        this.option.toolbox = {
          show: true,
          feature: {
            saveAsImage: {
              name: '出区状态分布'
            }
          }
        }
      } else if (this.item?.moduleName == '出区状态分布') {
        return
      }
      wardOverview_outAreaStatic(query).then(res => {
        this.option.series[0].data = []
        // 这里做兼容。如果全部是0 显示暂无数据 start
        let flag = true
        for (const i in res.data) {
          if (res.data[i].count != 0) {
            flag = false
            break
          }
        }
        if (flag) {
          return
        }
        if (res.data.length > 5) {
          this.option.legend.type = 'scroll'
          this.option.legend.left = 10
          this.option.legend.right = 10
        }
        // 这里做兼容。如果全部是0 显示暂无数据 end
        res.data.map(req => {
          // 死亡颜色固定 红色
          if (req.ourAreaName == '死亡') {
            this.option.series[0].data.push({
              value: req.count,
              name: req.ourAreaName,
              itemStyle: {
                color: '#ee6666'
              }
            })
          } else {
            this.option.series[0].data.push({
              value: req.count,
              name: req.ourAreaName
            })
          }
        })
        this.echartsFC()
      })
    },
    /**
     * 渲染echarts图
     */
    echartsFC() {
      this.$nextTick(() => {
        // 绑定echarts 元素id
        this.myChart = echarts.init(document.getElementById('chartExitStatus'))
        // 画echarts图
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.exitStatus {
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
      height: 100%;
    }
  }
}
</style>
