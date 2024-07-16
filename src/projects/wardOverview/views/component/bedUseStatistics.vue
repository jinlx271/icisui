<!-- 患者在区天数统计 -->
<template>
  <el-container id="daysStatistics" class="daysStatistics">
    <!-- 顶部内容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
        <span>{{item.moduleName}}</span>
      </div>
    </el-header>
    <!-- 中间内容部分 -->
    <el-main>
      <div class="radioDiv flex align-items-center">
        <el-radio-group @change="getData" v-model="timeType">
          <el-radio label="1">本周</el-radio>
          <el-radio label="2">近7天</el-radio>
          <el-radio label="3">本月</el-radio>
          <el-radio label="4">近30天</el-radio>
          <!-- <el-radio label="5">本年</el-radio> -->
        </el-radio-group>
        <el-select @change="getData" v-model="bedTag" filterable style="width:80px;">
          <el-option v-for="item in bedTagList" :label="item.dictName" :value="item.dictCode" :key="item.dictCode"></el-option>
        </el-select>
      </div>
      <div v-if="dataLength!=0" :id="item.moduleName+'chartId'" class="chartCss"></div>
      <el-empty v-else :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  qc_bedCollect_list
} from '@/api/qcReport'
import echarts from 'echarts'
export default {
  name: 'DaysStatistics',
  components: {},
  data: function () {
    return {
      timeType: '3',
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
        ],
        xAxis: [{
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
            data: [8, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            type: 'line',
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
      },
      bedTagList: [],
      bedTag: ''
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
  async mounted() {
    this.bedTagList = await this.$getDictItemList('ICIS_DICT_BED_TAG')
    this.bedTagList = this.bedTagList.filter(item => item.statusDict == '1')
    this.bedTag = this.bedTagList[0].dictCode
    this.bedTagList.unshift({
          dictCode: '0',
          dictName: '全部'
    })
    this.getData()
    window.addEventListener('resize', this.queryData)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.queryData)
  },
  methods: {
    /**
    * 时间格式化
    * */
    timeFormat() {
      let startTime, endTime
      if (this.timeType == '1') {
        // 本周
        const week = this.$dayjs().day()
        const startTime1 = this.$dayjs().startOf('week').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
        const endTime1 = this.$dayjs().endOf('week').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
        const startTime2 = this.$dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        const endTime2 = this.$dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        startTime = week > 0 ? startTime2 : startTime1
        endTime = week > 0 ? endTime2 : endTime1
      }
      if (this.timeType == '2') {
        // 近7天
        endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        const time = this.$dayjs(endTime).valueOf()
        startTime = this.$dayjs(time - 7 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      if (this.timeType == '3') {
        // 本月
        startTime = this.$dayjs().format('YYYY-MM-01 00:00:00')
        const time = this.$dayjs(startTime).valueOf()
        endTime = this.$dayjs(
          time + this.mGetDate() * 24 * 60 * 60 * 1000
        ).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.timeType == '4') {
        // 近30天
        endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        const time = this.$dayjs(endTime).valueOf()
        startTime = this.$dayjs(time - 30 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      return {
        startTime: startTime,
        endTime: endTime
      }
    },
    /**
     * 获取当前月份天数
     */
    mGetDate() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    /**
     * 获取数据统计
     */
    getData() {
      const { startTime, endTime } = this.timeFormat()
      const query = {
        curDateTime: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        endDate: endTime,
        icuAreaCode: this.currentUserWard.wardCode,
        startDate: startTime,
        timeType: '3',
        queryType: this.bedTag // 床位类型
      }
      qc_bedCollect_list(query).then(pro => {
        pro.data.echartData = pro.data.echartData || { xaxis: [{ data: [] }], yaxis: [{ max: 100, min: 0 }], series: [{ data: [] }] }
        this.option.xAxis[0].data = pro.data.echartData.xaxis[0].data
        this.option.yAxis = pro.data.echartData.yaxis

        this.option.yAxis[0].axisLabel = {
          show: true,
          formatter: '{value} %'
        }
        this.option.series[0].data = pro.data.echartData.series[0].data
        this.dataLength = this.option.series[0].data.length
        if (this.option.xAxis[0].data?.length <= 3) {
          this.option.dataZoom[0].end = 100
        } else if (this.option.xAxis[0].data?.length > 3) {
          this.option.dataZoom[0].end = parseInt(3 / this.option.xAxis[0].data.length * 100)
        }
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
