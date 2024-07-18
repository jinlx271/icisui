<template>
  <div class="patientAssement">
    <div class="formList">
      <div>
        <template v-for="(item, index) in tabList">
          <el-button v-if="index % 2 == 0" :key="index" class="formList_item round" effect="plain" size="small"
            type="primary" plain round :class="item.formId == formId ? 'active' : ' '" @click="changeTab(item)">
            {{ item.formName }}
          </el-button>
        </template>
      </div>
      <div>
        <template v-for="(item, index) in tabList">
          <el-button v-if="index % 2 == 1" :key="index" class="formList_item round" effect="plain" size="small"
            type="primary" plain round :class="item.formId == formId ? 'active' : ' '" @click="changeTab(item)">
            {{ item.formName }}
          </el-button>
        </template>
      </div>
    </div>
    <el-empty v-show="!showFlag" style="background: #fff;"></el-empty>
    <div id="echarts" ref="echarts" class="echarts"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import {
  config_list, // 表数据
  formapply_scoreList // 时间数据
} from '@/api/patient'
export default {
  computed: {
    ...mapGetters([
      'userInfo',
      'patientInfo',
      'currentUserWard',
      'currWardShiftInfo'
    ])
  },
  components: {},
  data() {
    return {
      vanPullModel: false, // 刷新
      tabQuery: {
        searchKey: '', // 模糊搜索关键字，非必传
        wardCode: '', // 病区编码
        patientFlag: true, // 是否关联病人数据，如果是，icuRecordId不能传空
        icuRecordId: '', // 病人id
        applicableType: '', // tab 类型 空 全部 1 医生 2 护理
        auditStatus: '' // 空空 全部 1 已审核 0 未审核
      }, // 左边请求入参
      showFlag: false,
      tabList: [],
      formId: '',
      legendData: [], // 名称集合
      xAxisData: [], // 时间
      seriesData: [] // 数据
    }
  },
  mounted() {
    const self = this
    window.onresize = function () {
      self.myChart.resize()
    }
  },
  created() {
    this.tabQuery.wardCode = this.currentUserWard.wardCode // 病区
    this.tabQuery.icuRecordId = this.patientInfo.icuRecordId // 病人id
    this.init()
  },
  methods: {
    /**
     * 初始号
     */
    init() {
      // 获取表单列表
      config_list(this.tabQuery).then((res) => {
        if (res.data.length > 0) {
          this.tabList = res.data
          this.changeTab(this.tabList[0])
        }
      })
    },
    /**
      切换左侧文书模板列表
      */
    changeTab(item) {
      this.formId = item.formId
      this.rightEchartsData(item)
    },
    /**
     * 右边 echarts
     */
    rightEchartsData(item) {
      formapply_scoreList({
        formId: item.formId,
        icuRecordId: this.patientInfo.icuRecordId,
        auditStatus: this.tabQuery.auditStatus,
        sortType: 'ASC'
      }).then((res) => {
        this.legendData = [item.formName] // 名称集合
        this.xAxisData = [] // 时间
        this.seriesData = [] // 数据
        const myData = []
        for (let i = 0; i < res.data.length; i++) {
          const item_i = res.data[i]
          this.xAxisData.push(item_i.scoreTime)
          myData.push({ value: item_i.totalScore, name: item.formName })
        }
        this.showFlag = this.xAxisData.length > 0
        this.seriesData.push({
          name: item.formName, // 名称
          type: 'line',
          data: myData,
          connectNulls: true,
          lineStyle: {
            color: '#5175f4'
          },
          itemStyle: {
            color: '#5175f4'
          }
        })
        this.echartsFc()
      })
    },
    /**
     * echars 渲染
     */
    echartsFc() {
      const self = this
      this.myChart = echarts.init(this.$refs.echarts)
      this.chartData = {
        title: {
          subtext: '',
          left: 'left',
          top: 'left',
          subtextStyle: {
            fontSize: 14
          },
          show: true
        },
        tooltip: {
          formatter: function (params) {
            return `<div style="widht: '100%'">${params[0].axisValue}</br>
              项目：<span style="color:#5175f4">${params[0].name}</span></br>
              总分：<span style="color:#5175f4">${params[0].value}分</span></div>`
          },
          trigger: 'axis',
          backgroundColor: '#fff',
          confine: true,
          borderColor: '#000',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
          padding: 5,
          textStyle: { align: 'left', color: '#000' }
          // appendToBody: true
        },
        legend: {
          top: 8,
          type: 'scroll',
          data: this.legendData
        },
        toolbox: {},
        dataZoom: {
          type: 'inside'
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            formatter: function (params) {
              return self.$dayjs(params).format('MM-DD')
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '总分',
          nameTextStyle: {
            align: 'right',
            color: '#5175f4'
          },
          axisLabel: {
            show: true,
            color: '#5175f4'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: this.seriesData
      }
      this.myChart?.clear()
      console.log(this.chartData)
      this.myChart.setOption(this.chartData)
      this.myChart.resize()
    }
  },
  beforeDestroy() {
    this.$bus.$off('updateSearchData')
  }
}
</script>
<style lang="scss" scoped>
.patientAssement {
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  .formList {
    width: 100%;
    text-align: left;
    padding: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    overflow-x: auto;
    background: #fff;

    div {
      white-space: nowrap;
    }

    div:first-child {
      margin-bottom: 5px;
    }

    .active {
      color: #fff !important;
      background: var(--maincolor) !important;
    }

    .el-button--primary.is-plain {
      color: var(--maincolor);
      border-color: var(--maincolor);
      background: var(--maincolor4);
    }
  }

  .echarts {
    width: 100%;
    height: calc(100% - 85px);
    background: #fff;
  }
}

.van-pull-refresh {
  width: 100%;
}
</style>
