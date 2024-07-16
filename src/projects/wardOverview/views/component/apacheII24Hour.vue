<!-- Apache II 24小时 -->
<template>
  <el-container id="apacheII24Hour" class="apacheII24Hour">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{ item.moduleName }}</span>
      </div>
    </el-header>
    <!-- 中间部分 -->
    <el-main>
      <div v-show="dataLength != 0" id="chartapacheII24Hour" class="chartCss"></div>
      <el-empty v-show="dataLength == 0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { wardOverview_apacheGroupData } from '@/api/wardOverview'
export default {
  name: 'ApacheII24Hour',
  components: {},
  data: function () {
    return {
      dataLength: 0,
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
      wardOverview_apacheGroupData({
        wardCode: this.currentUserWard.wardCode // 病区code
      }).then(res => {
        this.dataLength = res.data.length
        this.option.series[0].data = res.data
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
          document.getElementById('chartapacheII24Hour')
        )
        // 画echarts图
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.apacheII24Hour {
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
