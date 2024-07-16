<!-- Apache II 评分患者分布 -->
<template>
  <el-container id="apacheIIScoringPatients" class="apacheIIScoringPatients">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间部分 -->
    <el-main>
      <div v-show="dataLength!=0" id="chartApacheIIScoringPatients" class="chartCss"></div>
      <el-empty v-show="dataLength==0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { wardOverview_getApacheII } from '@/api/wardOverview'
export default {
  name: 'ApacheIIScoringPatients',
  components: {},
  data: function () {
    return {
      dataLength: 0,
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
          top: 'middle', // 居中
          right: 'right', // charts位置方向
          orient: 'vertical', // 垂直和横
          align: 'left', // 对齐
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
            name: '访问来源',
            width: '85%',
            type: 'pie',
            radius: ['45%', '60%'],
            color: [
              '#5470c6',
              '#73c0de',
              '#91cc75',
              '#fac858',
              '#ee6666',
              '#3ba272',
              '#fc8452',
              '#9a60b4',
              '#ea7ccc'
            ],
            itemStyle: {
              borderRadius: 0,
              borderColor: '#fff',
              borderWidth: 2
            },
            labelLine: {
              show: true
            }, // 圈圈旁边文案的连线
            label: {
              show: true,
              // formatter: '{c0}人'
              formatter: function (data) {
                return data.percent.toFixed(0) + '%'
                // return data.name + ':  ' + data.value + '人'
              }
            }, // 圈圈旁边的文案
            emphasis: {
              scale: true,
              scaleSize: 25
            }, // 鼠标移入的图放大
            data: [
              { value: 0, name: '<10' },
              { value: 0, name: '10-15' },
              { value: 0, name: '15-20' },
              { value: 0, name: '20-25' },
              { value: 0, name: '>25' }
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
    } // 配置那边跳过了的高度宽度设置
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
      wardOverview_getApacheII({
        wardCode: this.currentUserWard.wardCode // 病区code
      }).then(res => {
        if (
          !(res.data.sourceRange_10 == '0' &&
            res.data.sourceRange10_15 == '0' &&
            res.data.sourceRange15_20 == '0' &&
            res.data.sourceRange20_25 == '0' &&
            res.data.sourceRange25_ == '0')
        ) {
          this.dataLength = 1
          this.option.series[0].data.map(req => {
            switch (req.name) {
              case '<10':
                req.value = res.data.sourceRange_10
                break
              case '10-15':
                req.value = res.data.sourceRange10_15
                break
              case '15-20':
                req.value = res.data.sourceRange15_20
                break
              case '20-25':
                req.value = res.data.sourceRange20_25
                break
              case '>25':
                req.value = res.data.sourceRange25_
                break
            }
          })
        }
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
          document.getElementById('chartApacheIIScoringPatients')
        )
        // 画echarts图
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.apacheIIScoringPatients {
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
