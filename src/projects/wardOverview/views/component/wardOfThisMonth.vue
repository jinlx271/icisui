<!-- 本月病区患者情况 -->
<template>
  <el-container id="wardOfThisMonth" class="wardOfThisMonth">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间部分 -->
    <el-main ref="elMain">
      <div v-show="number != 0" id="chartWardOfThisMonth" class="chartCss"></div>
      <el-empty v-show="number == 0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { wardOverview_wardOfThisMonth } from '@/api/wardOverview'
export default {
  name: 'WardOfThisMonth',
  data: function () {
    return {
      colorIndex: 0, // 记录颜色的下标
      wardName: '', // 当前病区截取 太长的。。。替代
      colorList: [
        '#1FB190',
        '#00A0E9',
        '#8F82BC',
        '#F19149',
        '#018CBF',
        '#2EC9A6',
        '#9E8FD4',
        '#F6A76C',
        '#018CBF',
        '#4DA9FF',
        '#8F82BC'
      ], // 桑基图的颜色数组.
      colorList2: [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ],
      number: 0, // 计数器.代表数据多少个
      option: {
        backgroundColor: '#FFFFFF',
        series: [
          {
            type: 'sankey', // 桑基图标准
            nodeWidth: 30, // 桑基图中每个矩形节点的宽度。
            nodeGap: 6, // 桑基图中每一列任意两个矩形节点之间的间隔
            draggable: true, // 控制节点拖拽的交互
            nodeAlign: 'justify',
            left: '5%',
            top: 'middle',
            width: '90%',
            height: '80%',
            lineStyle: {
              color: 'source',
              curveness: 1
            }, // 连线的控制
            itemStyle: {}, // 桑基图节点矩形的样式
            label: {
              color: 'rgba(0,0,0,0.7)',
              fontFamily: 'Arial',
              fontSize: 12,
              position: 'left' // 右边的描述位置
            }, // 字体颜色控制
            levels: [
              {
                depth: 0,
                label: {
                  show: true,
                  position: 'right', // 左边描述的位置
                  distance: 9, // 距离图形元素的距离
                  formatter: '{b}（{c}人）',
                  fontSize: this.vw(14)
                },
                itemStyle: {
                  borderWidth: 0
                },
                lineStyle: {
                  color: 'source',
                  curveness: 0.5
                }
              },
              {
                depth: 1,
                itemStyle: {
                  color: '#F6A76C',
                  borderWidth: 0
                },
                label: {
                  show: true,
                  color: '#fff',
                  position: 'inside',
                  fontWeight: 'normal',
                  fontSize: this.vw(16),
                  width: 1,
                  height: 200,
                  overflow: 'breakAll',
                  formatter: function (val) {
                    return val.name.split('').join('\n')
                  }
                }
              },
              {
                depth: 2,
                label: {
                  formatter: '{b}（{c}人）',
                  fontSize: this.vw(14)
                },
                itemStyle: {
                  borderWidth: 0
                },
                lineStyle: {
                  color: 'source',
                  curveness: 0.5
                }
              }
            ], // 标签的控制
            data: [
              {
                name: '',
                depth: 1
              }
            ],
            links: []
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
      this.wardName =
        this.currentUserWard.wardName.length > 8
          ? this.currentUserWard.wardName.substr(0, 8) + '…'
          : this.currentUserWard.wardName
      this.option.series[0].data[0].name = this.wardName
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
              name: '患者出入区情况'
            }
          }
        }
      } else if (this.item?.moduleName == '患者出入区情况') {
        return
      }
      wardOverview_wardOfThisMonth(query).then(res => {
        this.option.series[0].data = [
          {
            name: this.wardName,
            depth: 1
          }
        ]
        this.option.series[0].links = []
        this.number = 0
        // 排序
        if (res.data?.outArea.length < 1 && res.data?.originalArea.length < 1) {
          return
        }
        const outArea = this.sortFc(res.data.outArea)
        const originalArea = this.sortFc(res.data.originalArea)
        // 出院排序最后一个
        let outData = {}
        for (let i = 0; i < outArea.length; i++) {
          outArea[i].areaName = ' ' + outArea[i].areaName // 相同的名称无法显示在echarts 前面加一个空格
          if (outArea[i].areaName.trim() == '出院') {
            outData = outArea.splice(i, 1)
            i--
          }
        }
        if (outData[0]) {
          outArea.push(outData[0])
        }
        // 如果相同科室给一样颜色
        outArea.map(item => {
          originalArea.map(item2 => {
            if (item.areaCode === item2.areaCode) {
              item.color = this.colorList2[this.colorIndex]
              item2.color = this.colorList2[this.colorIndex]
              this.colorIndex++
            }
          })
        })
        // 出区|死亡|出院
        outArea.map(req => {
          // echarts主要数据
          this.option.series[0].data.push({
            name: req.areaName,
            depth: 2,
            value: 1,
            itemStyle: {
              color:
                req.color ||
                this.colorList[this.number % (this.colorList.length - 1)] // 选取颜色数组
            },
            label: {
              formatter: `{b}（${req.count}人）`
            }
          })
          // echarts连线数据
          this.option.series[0].links.push({
            source: this.wardName,
            target: req.areaName,
            value: 1,
            lineStyle: {
              color:
                req.color ||
                this.colorList[this.number % (this.colorList.length - 1)] // 选取颜色数组
            }
          })
          this.number++
        })
        // 其他科室过来icu病人
        originalArea.map(req => {
          // echarts主要数据
          this.option.series[0].data.push({
            name: req.areaName,
            depth: 0,
            value: 1,
            itemStyle: {
              color:
                req.color ||
                this.colorList[this.number % (this.colorList.length - 1)]
            },
            label: {
              formatter: `{b}（${req.count}人）`
            }
          })
          // echarts连线数据
          this.option.series[0].links.push({
            source: req.areaName,
            target: this.wardName,
            value: 1
          })
          this.number++
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
        this.myChart = echarts.init(
          document.getElementById('chartWardOfThisMonth')
        )
        // 画echarts图
        this.myChart.setOption(this.option)
      })
    },
    /**
     * 排序  小的排前面
     */
    sortFc(data) {
      return data.sort((a, b) => a.areaCode - b.areaCode)
    },
    /**
     * 计算宽度尺寸
     */
    vw(val) {
      // 设计师屏幕宽度
      const allHeight = 1080
      // 拿设计的宽度把传进来的值百分比
      const calcWidth = (val / allHeight) * 100
      const fs = (calcWidth * document.body.clientHeight) / 100
      return (fs / (fs * 0 + 1)) * 1
    }
  }
}
</script>

<style lang="scss" scoped>
.wardOfThisMonth {
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
