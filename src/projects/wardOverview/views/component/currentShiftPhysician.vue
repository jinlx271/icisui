<!-- 当前班次医师配备 -->
<template>
  <el-container id="currentShiftPhysician" class="currentShiftPhysician">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间内容部分 -->
    <el-main>
      <div v-if="showEchart" id="chartCurrentShiftPhysician" class="chartCss"></div>
      <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  name: 'CurrentShiftPhysician',
  components: {},
  data: function () {
    return {
      showEchart: false,
      option: {
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
        graphic: {
          type: 'text',
          top: 'center',
          left: '36%',
          style: {
            text: '111',
            textAlign: 'center',
            fill: '#73c0de',
            fontSize: 20
          }
        },
        series: [
          {
            name: '访问来源',
            width: '80%',
            type: 'pie',
            radius: ['45%', '60%'],
            color: [
              '#73c0de',
              '#5470c6',
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
              formatter: '{c0}'
            }, // 圈圈旁边的文案
            emphasis: {
              scale: true,
              scaleSize: 25
            }, // 鼠标移入的图放大
            data: []
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
    nurseDoctorBedList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    nurseDoctorBedList: {
      deep: true,
      handler: function (obj) {
        this.init()
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() { },
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
      if (this.nurseDoctorBedList) {
        this.option.graphic.style.text = this.nurseDoctorBedList.bedDoctorRatio
        this.option.series[0].data = [
          {
            name: '医生人数',
            value: this.nurseDoctorBedList.doctorCount
          },
          {
            name: '总床数',
            value: this.nurseDoctorBedList.bedCount
          }
        ]
        this.showEchart = true
        this.echartsFC()
      }
    },
    /**
     * 渲染echarts图
     */
    echartsFC() {
      this.$nextTick(() => {
        // 绑定echarts 元素id
        this.myChart = echarts.init(
          document.getElementById('chartCurrentShiftPhysician')
        )
        // console.log(JSON.stringify(this.option))
        // 画echarts图
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.currentShiftPhysician {
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
