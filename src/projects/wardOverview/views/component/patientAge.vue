<!-- 患者在区天数统计 -->
<template>
  <el-container id="patientAge" class="patientAge">
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
import { wardOverview_getPatientAgeDistribute } from '@/api/wardOverview'
import echarts from 'echarts'
export default {
  name: 'PatientAge',
  components: {},
  data: function () {
    return {
      dataLength: 0,
      option: {
        grid: {
          left: '3%',
          right: 60,
          top: 0,
          bottom: 15,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['男', '女', '未知'],
          top: 'middle', // 居中
          right: 'right', // charts位置方向
          orient: 'vertical', // 垂直和横
          align: 'left', // 对齐
          itemGap: 10, // 间隔
          itemWidth: 15,
          selectedMode: true,
          textStyle: {
            color: 'rgba(0, 6, 34, 0.7)',
            fontStyle: 'normal',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: '400',
            fontSize: 13
          }
        },

        xAxis: [
          {
            type: 'value',
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
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true
            },
            data: []
          }
        ],
        series: [
          {
            name: '男',
            type: 'bar',
            color: '#0B93FB',
            barGap: 0,
            label: {
              show: true,
              fontSize: 8,
              position: 'right',
              color: '#000'
            },
            data: []
          },
          {
            name: '女',
            type: 'bar',
            color: '#1FE1FD',
            label: {
              show: true,
              fontSize: 8,
              position: 'right',
              color: '#000'
            },
            data: []
          },
          {
            name: '未知',
            type: 'bar',
            color: '#E29C30',
            label: {
              show: true,
              fontSize: 8,
              position: 'right',
              color: '#000'
            },
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
  created() {},
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
        wardCode: this.currentUserWard.wardCode
      }
      wardOverview_getPatientAgeDistribute(query).then((res) => {
        this.dataLength = res.data.length
        this.option.series[0].data = []
        this.option.series[1].data = []
        this.option.series[2].data = []
        const yData = []
        res.data.forEach((item) => {
          // 下标
          // ['0~10岁', '11~20岁', '21~30岁', '31~40岁', '41~50岁', '51~60岁', '61~70岁', '81~90岁', '≥90']
          yData.push(item.ageRangeDisplay + '岁')
          // 男
          this.option.series[0].data.push(item.maleCount)
          // 女
          this.option.series[1].data.push(item.femaleCount)
          // 未知
          this.option.series[2].data.push(item.unKnowCount)
        })
        this.option.yAxis[0].data = yData
        this.queryData()
      })
    },
    /**
     * 设置echarts画布
     */
    queryData() {
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById(this.item.moduleName + 'chartId'))
        this.myChart.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.patientAge {
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
