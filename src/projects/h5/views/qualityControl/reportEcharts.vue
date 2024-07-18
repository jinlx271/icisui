<template>
  <div class="HCContiner">
    <div class="searchBar flex">
      <div class="flex">
        <el-radio-group v-model="timeType" @change="changeTimeType" size="small" class="flex">
          <el-radio-button label="1">{{ lastMonth }}月</el-radio-button>
          <el-radio-button label="0">{{ currMonth }}月</el-radio-button>
          <el-radio-button label="2">选择时间</el-radio-button>
        </el-radio-group>
        <el-select v-model="dateType" class="dateType" size="small" @change="reset" :disabled="timeType!='2'">
          <el-option label="按月" value="month"></el-option>
          <el-option label="按季度" value="quarterOfYear"></el-option>
          <el-option label="按年" value="year"></el-option>
          <el-option label="自定义" value="custom"></el-option>
        </el-select>
        <wn-date-picker class="month-picker" v-model="forMonth" type="month" value-format="yyyy-MM" size="small" :editable="datePickerEditor"
          placeholder="请选择月" @blur="getSearchValue" @focus="getFocus('m')" :clearable="false" :disabled="timeType!='2'"
          v-if="dateType == 'month'"></wn-date-picker>
        <QuaterCom :radio="6" :quaterComTime="quaterComTime"  :flag="flag" @getRadio="getRadio" @getRadioValue="getRadioValue" class="month-picker" :disabled="timeType!='2'"
          isShowValue ref="quarterOfYear" size="small" v-else-if="dateType == 'quarterOfYear'">
        </QuaterCom>
        <wn-date-picker class="month-picker" value-format="yyyy" v-model="forYear" type="year" placeholder="请选择年"  :editable="datePickerEditor"
          size="small" @focus="getFocus('y')" @blur="getSearchValue" :clearable="false" :disabled="timeType!='2'"
          v-else-if="dateType == 'year'"></wn-date-picker>
        <wn-date-picker class="custom-month-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="customValue" type="daterange" placeholder="请选择"
          size="small" @blur="getSearchValue"  :clearable="false" :disabled="timeType!='2'"  :editable="datePickerEditor"
          v-else-if="dateType == 'custom'"></wn-date-picker>
      </div>
      <el-button type="primary" size="small" @click="refresh"> <i class="el-icon-refresh"></i> </el-button>
    </div>
    <div class="echartsArea flex-1" ref="container">
      <el-popover
          v-if="popoverVisible"
          ref='pop'
          :reference='reference'
          placement="bottom"
          title=""
          width="300"
          trigger="hover"
          @hide="hidePopoverVisible"
        >
          <div v-if="leftData.newEcharts">
            <p v-if="leftData.calculation" style="font-size:rem(12)">
              <template v-for="(item) in leftData.calculation" >
                <span :key="item.label + item.code">
                  {{ item.label }}：
                  <template v-if="leftData.valueKey == 'fataIndexRate'">
                    <template v-if="item.code == 'molecule'">
                      {{ molecule }}%
                    </template>
                    <template v-else-if="item.code == 'denominator'">
                      {{ denominator }}%
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="item.code == 'molecule'">
                      {{ molecule }}
                    </template>
                    <template v-else-if="item.code == 'denominator'">
                      {{ denominator }}
                    </template>
                  </template>
                </span>
                <br  :key="item.label + item.code">
              </template>
            </p>
            <p style="font-size:rem(12);">定义：{{ leftData.definition }}</p>
            <p style="font-size:rem(12)">公式：{{ leftData.expression }}</p>
          </div>
          <div v-else>
            <p style="font-size:rem(12);">{{ leftData.definition }}: {{ leftData.value }}</p>
            <p style="font-size:rem(12)">定义：{{ leftData.expression }}</p>
          </div>
      </el-popover>
      <div class="top flex">
        <div class="flex-1 card " v-for="index of 4" :key="index" v-loading="loading" @click="linkToDetail(reportObj['panelCode' + (index + 5)])">
          <div class="title">
            <span>
              {{ reportObj['panelCode' + (index +5)].reportShowName || reportObj['panelCode' + (index + 5)].reportDictName }}</span>
              <div class="icon">
                  <i  class="el-icon-question" @click.stop @touchstart.stop="showExpress(reportObj['panelCode' + (index + 5)])"  @mouseenter.stop="showExpress(reportObj['panelCode' + (index + 5)])" :ref="'popover-' + 'panelCode' + (index + 5)"> </i>
              </div>
          </div>
          <div class="value" >
            <div v-if="reportObj['panelCode' + (index + 5)].reportStyleCode == '5'" >
              {{ reportObj['panelCode' + (index + 5)].value }}
            </div>
            <chart :option.sync="reportObj['panelCode' + (index + 5)].options" :id="'panelCode' + (index + 5)" v-else>
            </chart>
            <svg-icon icon-class="trend" @click.native.stop="showTrend(reportObj['panelCode' + (index + 5)])"></svg-icon>
          </div>
        </div>

      </div>
      <div class="center">
        <div class="card panel1" v-loading="loading">
          <div class="title">
            <span> {{ reportObj.panelCode1.reportShowName || reportObj.panelCode1.reportDictName }}</span>
             <div class="icon">
            </div>
          </div>
          <div class="value" >
            <div v-if="reportObj['panelCode1'].reportStyleCode == '5'">
              {{ reportObj['panelCode1'].value }}
            </div>
            <chart :option.sync="reportObj['panelCode1'].options" id="panelCode1" v-else>
            </chart>
          </div>
        </div>
        <div class="center_right">
          <div class="card" v-for="index of 4" :key="index" v-loading="loading" @click="linkToDetail(reportObj['panelCode' + (index + 1)])">
            <div class="title">
              <span>{{ reportObj['panelCode' + (index + 1)].reportShowName
                || reportObj['panelCode' + (index + 1)].reportDictName }}</span>
              <div class="icon">
                <i class="el-icon-question" @click.stop @touchstart.stop="showExpress(reportObj['panelCode' + (index + 1)])" @mouseenter.stop="showExpress(reportObj['panelCode' + (index + 1)])" :ref="'popover-' + 'panelCode' + (index + 1)"></i>
              </div>
            </div>
            <div class="value" >
              <div v-if="reportObj['panelCode' + (index + 1)].reportStyleCode == '5'">
                {{ reportObj['panelCode' + (index + 1)].value }}
              </div>
              <chart :option.sync="reportObj['panelCode' + (index + 1)].options" :id="'panelCode' + (index + 1)" v-else>
              </chart>
              <svg-icon icon-class="trend" @click.native.stop="showTrend(reportObj['panelCode' + (index + 1)])" ></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom flex">
        <div class="card" v-for="index of 8" :key="index" v-loading="loading" @click="linkToDetail(reportObj['panelCode' + (index + 9)])">
          <div class="icon">
            <svg-icon icon-class="trend" @click.native.stop="showTrend(reportObj['panelCode' + (index + 9)])"></svg-icon>
            <i class="el-icon-question" @click.stop  @touchstart.stop="showExpress(reportObj['panelCode' + (index + 9)])" @mouseenter.stop="showExpress(reportObj['panelCode' + (index + 9)])" :ref="'popover-' + 'panelCode' + (index + 9)"></i>
          </div>
          <div class="value" >
            <div v-if="reportObj['panelCode' + (index + 9)].reportStyleCode == '5'">
              {{ reportObj['panelCode' + (index + 9)].value }}
            </div>
            <chart :option.sync="reportObj['panelCode' + (index + 9)].options" :id="'panelCode' + (index + 9)" v-else>
            </chart>
          </div>
          <div class="title">
            <span
              :title="reportObj['panelCode' + (index + 9)].reportShowName || reportObj['panelCode' + (index + 9)].reportDictName">
              {{
                reportObj['panelCode' + (index + 9)].reportShowName || reportObj['panelCode' + (index + 9)].reportDictName
              }}
            </span>
          </div>
        </div>
      </div>
      <el-drawer :title="trendTitle" :visible.sync="trendVisible" :modal-append-to-body="true" :append-to-body="true"
        custom-class="inspection-result-drawer" size="60%" direction="btt" top="40vh" v-if="isH5">
        <div style="height:100%;width:100%;padding:20px 40px;">
          <chart :option.sync="trendOption" id="trend" style="height:100%"></chart>
        </div>
      </el-drawer>
      <el-dialog :title="trendTitle" :visible.sync="trendVisible" :append-to-body="true"  width="80%"  v-else >
        <div style="height:400px;width:100%;padding:20px 40px;">
          <chart :option.sync="trendOption" id="trend" style="height:100%"></chart>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import QuaterCom from '@/components/quater'
import { mapGetters } from 'vuex'
import 'echarts-liquidfill'
import {
  report_findList
} from '@/api/configuration'
import {
  qcReport_indexSummary
} from '@/api/qcReport'
import {
  wardOverview_getApacheII
} from '@/api/wardOverview'
import _ from 'lodash'
import Chart from '@/components/Charts/anas'
import echarts from 'echarts'
import {
  dataStatistics_leftData
} from '@/utils/generator/dataStatistics'
export default {
  name: 'Layout',
  components: { QuaterCom, Chart },
  data() {
    return {
      trendTitle: '',
      trendVisible: false,
      isH5: false,
      timeType: '1',
      currMonth: '', // 当前月
      lastMonth: '', // 上一个月
      formObj: {
        endDate: '',
        startDate: '',
        curDateTime: '',
        icuAreaCode: '',
        reportCodes: []
      },
      reportObj: {
        'panelCode1': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode2': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode3': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode4': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode5': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode6': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode7': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode8': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode9': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode10': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode11': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode12': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode13': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode14': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode15': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode16': {
          'reportDictName': '',
          'reportShowName': ''
        },
        'panelCode17': {
          'reportDictName': '',
          'reportShowName': ''
        }
      },
      reportList: [],
      dateType: 'month',
      forMonth: '',
      forYear: '',
      flag: false,
      year: '',
      customValue: ['', ''],
      season: '',
      options: {
        title: {
          text: '0%',
          subtext: '',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 20
          },
          subtextStyle: {
            fontSize: 20
          },
          show: true
        },
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'Access From',
            silent: 'false',
            type: 'pie',
            radius: ['65%', '80%'],
            legendHoverLink: true,
            avoidLabelOverlap: false,
            top: 10,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: '0',
                itemStyle: {
                  color: '#64bcff'
                }
              },
              {
                value: '10',
                itemStyle: {
                  color: '#F5F8F9'
                }
              }
            ]
          }
        ]
      },
      quaterComTime: '',
      loading: false,
      datePickerEditor: true,
      leftData: {},
      // content: '',
      molecule: '', // 分子
      denominator: '', // 分母
      reference: {},
      popoverVisible: false,
      statisticsBasic: [],
      trendOptionObj: { // 趋势图
        grid: {
          top: 10,
          width: '100%',
          height: '90%',
          left: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: [],
            axisLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#6E7079'
              }
            },
            splitLine: {
              show: false
            }

          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            max: 180,
            min: 60,
            boundaryGap: [0.2, 0.2],
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            type: 'line',
            data: [],
            // 折线
            symbol: 'emptyCircle',
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: 'rgba(15,73,237,1)'
              }
            },
            // 点标记圆圈
            itemStyle: {
              normal: {
                color: 'rgba(15,73,237,1)',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .12)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            },
            // 阴影
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [{
                    offset: 0,
                    color: 'rgba(15,73,237,0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(15,73,237,0.1)'
                  }
                  ],
                  false
                ),
                shadowColor: 'rgba("15,73,237,0.1)',
                shadowBlur: 10
              }
            }
          }
        ]
      },
      trendOption: {}
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userWardList', 'mainMenu', 'systemInfo']),
    datePickerChange() {
      const obj = {
        forMonth: '',
        forYear: '',
        dataType: 3,
        year: '',
        season: '',
        startTime: '',
        endTime: '',
        customValue: []
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = this[key]
        }
      }
      return obj
    }
  },
  mounted() {
    this.formObj.icuAreaCode = this.currentUserWard.wardCode
    this.customValue = [this.$dayjs().format('YYYY-MM-01'), this.$dayjs().format('YYYY-MM-DD')]
    this.isH5 = this.$h5 ?? false
    this.currMonth = this.$dayjs().month() + 1
    this.forMonth = this.$dayjs().format('YYYY-MM')
    this.forYear = this.$dayjs().format('YYYY')
    this.lastMonth = this.currMonth - 1
    const qcSearchInfo = sessionStorage.getItem('qcSearchInfo')
    const reportDetailBack = sessionStorage.getItem('reportDetailBack')
    if (qcSearchInfo && reportDetailBack) {
      const {
        dateType, forYear, forMonth, forSelf, year, season, timeType, customValue
      } = JSON.parse(qcSearchInfo)
      this.dateType = dateType
      this.forYear = forYear
      this.forMonth = forMonth
      this.forSelf = forSelf
      this.year = year
      this.season = season
      this.timeType = timeType
      this.customValue = customValue
      this.quaterComTime = `${this.year } 年 ${this.season} 季度`
    }
    if (this.currMonth > 1) {
      this.lastMonth = this.currMonth - 1
    } else {
      this.lastMonth = 12
      // this.forYear = this.$dayjs().subtract(1, 'year').format('YYYY')
    }

    this.refresh()
  },
  watch: {
    datePickerChange: function () {
      this.changeTimeType()
    },
    currentUserWard: function () {
      this.formObj.icuAreaCode = this.currentUserWard.wardCode
      this.refresh()
    }
  },
  created() {
    this.datePickerEditor = !(/mmcp/.test(window.navigator.userAgent.toLowerCase()))
    for (var i = 1; i < 18; i++) {
      this.reportObj['panelCode' + i] = {
        reportDictName: '',
        reportShowName: ''
      }
    }
    // 截流 首次请求
    this.getSearchValue = _.debounce(() => {
      this.getSearchValueDebounce()
    }, 800)
  },
  methods: {
    async refresh() {
      const res = await report_findList({ wardCode: this.formObj.icuAreaCode })
      if (res.data.result.length > 0) {
        this.formObj.reportCodes = res.data.result.map(item => item.reportDictCode)
        this.reportList = res.data.result
        res.data.result.forEach(item => {
          this.reportObj['panelCode' + item.panelCode] = {
            value: '',
            options: this.options,
            ...item
          }
        })
        this.changeTimeType()
      } else {
        this.reportList = []
        this.reportObj = {
          'panelCode1': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode2': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode3': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode4': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode5': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode6': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode7': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode8': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode9': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode10': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode11': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode12': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode13': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode14': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode15': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode16': {
            'reportDictName': '',
            'reportShowName': ''
          },
          'panelCode17': {
            'reportDictName': '',
            'reportShowName': ''
          }
        }
        this.$message.info('当前病区未配置质控查询')
      }
    },
    /**
     * 切换时间类型
     */
    changeTimeType() {
      if (this.reportList.length == 0) return
      if (this.timeType == '0') {
        this.formObj.startDate = this.$dayjs().format('YYYY-MM-01 00:00:00')
        this.formObj.endDate = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else if (this.timeType == '1') { // 上一个月
        if (this.currMonth > 1) {
          this.lastMonth = this.currMonth - 1
          this.formObj.startDate = this.$dayjs().format('YYYY') + this.$dayjs().month(this.lastMonth - 1).format('-MM-01') + ' 00:00:00'
          const daysInMonth = this.$dayjs().month(this.lastMonth - 1).daysInMonth()
          this.formObj.endDate = this.$dayjs().format('YYYY') + this.$dayjs().month(this.lastMonth - 1).format('-MM-' + daysInMonth) + ' 23:59:59'
        } else {
          this.lastMonth = 12
          this.formObj.startDate = this.$dayjs().subtract(1, 'year').format('YYYY') + this.$dayjs().month(this.lastMonth - 1).format('-MM-01') + ' 00:00:00'
          const daysInMonth = this.$dayjs().month(this.lastMonth - 1).daysInMonth()
          this.formObj.endDate = this.$dayjs().subtract(1, 'year').format('YYYY') + this.$dayjs().month(this.lastMonth - 1).format('-MM-' + daysInMonth) + ' 23:59:59'
          // this.forYear = this.$dayjs().subtract(1, 'year').format('YYYY')
        }
      } else if (this.timeType == '2') {
        this.getSearchValueDebounce()
      }
      this.formObj.curDateTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (this.formObj.startDate.indexOf('-') == -1 || this.formObj.endDate.indexOf('-') == -1) return
      this.loading = true
      qcReport_indexSummary(this.formObj).then(res => {
        this.statisticsBasic = dataStatistics_leftData
        let leftData = _.cloneDeep(this.statisticsBasic)
        leftData = res.data.map(i => {
        for (const k in leftData) {
            const j = leftData[k]
            if (i.key == j.valueKey) {
              j.value = i.result
              j.label = i.reportName
              j.sortNo = i.sortNo
              i = j
              break
            }
          }
          return i
        })
        this.statisticsBasic = leftData
        // 排序
        for (var key in this.reportObj) {
          const reportDictCode = this.reportObj[key].reportDictCode
          if (reportDictCode.indexOf('_1') == -1) {
            const result = res.data.find(item => item.key == reportDictCode)
            this.loading = false
            this.reportDataFormat(result, key)
          } else if (reportDictCode == 'apacheIIScores_1') { // 特殊报表apach分布
            this.getApacheII(key)
          }
        }
      })
    },
    /**
     * 普通报表格式化 options
     * res 数据
     */
    reportDataFormat(result, key) {
      this.reportObj[key].value = result.result
      const options = {
        title: {
          text: '0%',
          subtext: '',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 20
          },
          subtextStyle: {
            fontSize: 20
          },
          show: true
        },
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: '',
            silent: 'false',
            type: 'pie',
            radius: ['70%', '85%'],
            legendHoverLink: true,
            avoidLabelOverlap: false,
            top: 10,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: '0',
                itemStyle: {
                  color: '#a1c1fd'
                }
              },
              {
                value: '10',
                itemStyle: {
                  color: '#F5F8F9'
                }
              }
            ]
          }
        ]
      }

      if (this.reportObj[key].reportStyleCode == '2') { // 环形图

      } else if (this.reportObj[key].reportStyleCode == '3') { // 饼图
        options.series[0].radius = ['0%', '85%']
        options.series[0].left = '40%'
        options.title = {
          text: '0%',
          subtext: '',
          left: '10%',
          top: 'middle',
          textStyle: {
            fontSize: 25,
            color: '#5470c6'
          },
          subtextStyle: {
            fontSize: 20
          },
          show: true
        }
      }
      let resultValue = result.result
      options.title.text = result.result || '0.0%'
      if (typeof resultValue === 'number') {
        this.reportObj[key].reportStyleCode = '5'
        return
      }
      if (resultValue && this.reportObj[key].reportStyleCode == '4') { // 水球
        options.series[0] = {
          type: 'liquidFill',
          data: [{
            value: '0.0',
            direction: 'left',
            itemStyle: {
              color: 'red'
            }
          }],
          itemStyle: {
            shadowBlur: 0
          },
          amplitude: 0,
          waveAnimation: 0,
          radius: '75%',
          backgroundStyle: {
            borderWidth: 1,
            borderColor: '',
            color: ''
          },
          outline: {
            show: false
          },
          label: {
            show: false
          }
        }
        if (resultValue.indexOf('%') > -1) {
          resultValue = resultValue.replace('%', '')
        } else if (resultValue.indexOf('‰') > -1) {
          resultValue = resultValue.replace('‰', '')
          resultValue = Number / 10
        }
        // '#5470c6','#73c0de','#91cc75','#fac858','#ee6666','#3ba272','#fc8452','#9a60b4','#ea7ccc'
        // '#588ff9', '#6dc8ec', '#5ad8a6', '#f6bd16', '#e8684a'
        if (Number(resultValue) <= 30) {
          options.series[0].data[0].itemStyle.color = '#5ad8a6'
          options.series[0].backgroundStyle.borderColor = '#5ad8a6'
          options.series[0].backgroundStyle.color = '#f4fffa'
        } else if (Number(resultValue) > 30 && Number(resultValue) <= 70) {
          options.series[0].data[0].itemStyle.color = '#f6bd16'
          options.series[0].backgroundStyle.borderColor = '#f6bd16'
          options.series[0].backgroundStyle.color = '#fff4e5'
        } else {
          options.series[0].data[0].itemStyle.color = '#e8684a'
          options.series[0].backgroundStyle.borderColor = '#e8684a'
          options.series[0].backgroundStyle.color = '#fff7f8'
        }
        options.series[0].data[0].value = Number(resultValue) != 0 ? Number(resultValue) / 100 + '' : '0'
      } else if (resultValue && (this.reportObj[key].reportStyleCode == '2' || this.reportObj[key].reportStyleCode == '3')) {
        if (resultValue.indexOf('%') > -1) {
          resultValue = resultValue.replace('%', '')
          options.series[0].data[0].value = Number(resultValue)
          options.series[0].data[1].value = 100 - Number(resultValue)
        } else if (resultValue.indexOf('‰') > -1) {
          resultValue = resultValue.replace('‰', '')
          options.series[0].data[0].value = Number(resultValue)
          options.series[0].data[1].value = 1000 - Number(resultValue)
        }
      } else {
        options.series[0].data[0].value = '0'
        options.series[0].data[1].value = '10'
      }
      this.loading = false
      this.reportObj[key].options = options
    },
    getApacheII(key) {
      const query = { ...this.formObj }
      query.wardCode = query.icuAreaCode
      delete query.reportCodes
      delete query.curDateTime
      wardOverview_getApacheII(query).then(res => {
        const options = {
          legend: {
            top: 'middle', // 居中
            right: '10%', // charts位置方向
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
              name: '',
              width: '85%',
              type: 'pie',
              radius: ['55%', '80%'],
              color: [
                '#588ff9', '#6dc8ec', '#5ad8a6', '#f6bd16', '#e8684a'
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
                formatter: function (data) {
                  return data.percent.toFixed(0) + '%'
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
        options.series[0].data[0].value = res.data.sourceRange_10
        options.series[0].data[1].value = res.data.sourceRange10_15
        options.series[0].data[2].value = res.data.sourceRange15_20
        options.series[0].data[3].value = res.data.sourceRange20_25
        options.series[0].data[4].value = res.data.sourceRange25_
        this.loading = false
        this.reportObj[key].options = options
      })
    },
    /** */
    getSearchValueEntity(obj) {
      const { dateType, forYear, forMonth, year, season } = obj
      let val = ''
      let startTime = ''
      let endTime = ''
      if (dateType === 'year') {
        if (forYear === null || forYear === '') {
          return { startTime, endTime }
        }
        val = forYear
        if (isNaN(parseInt(val))) {
          val = val.getFullYear()
        }
        return { startTime: val + '-01-01', endTime: val + '-12-31' }
      } else if (dateType === 'month') {
        if (forMonth === null || forMonth === '') {
          return { startTime, endTime }
        }
        val = forMonth
        startTime = val + '-01'
        var monthStr = val.split('-')[1]
        var yearStr = val.split('-')[0]
        if (
          monthStr === '06' ||
          monthStr === '09' ||
          monthStr === '02' ||
          monthStr === '04' ||
          monthStr === '11'
        ) {
          if (monthStr === '02') {
            yearStr % 4 === 0
              ? (endTime = val + '-29')
              : (endTime = val + '-28')
          } else {
            endTime = val + '-30'
          }
        } else {
          endTime = val + '-31'
        }
        return { startTime, endTime }
      } else if (dateType === 'quarterOfYear') {
        if (year === null || year === '') {
          return { startTime, endTime }
        }
        val = year
        if (season === 1) {
          startTime = val + '-01-01'
          endTime = val + '-03-31'
        } else if (season === 2) {
          startTime = val + '-04-01'
          endTime = val + '-06-30'
        } else if (season === 3) {
          startTime = val + '-07-01'
          endTime = val + '-09-30'
        } else {
          startTime = val + '-10-01'
          endTime = val + '-12-31'
        }
        return { startTime, endTime }
      } else if (dateType === 'custom') {
        startTime = this.customValue[0]
        endTime = this.customValue[1]
        return { startTime, endTime }
      }
    },
    getSearchValueDebounce() {
      const { startTime, endTime } = this.getSearchValueEntity({ dateType: this.dateType, forYear: this.forYear, forMonth: this.forMonth, forSelf: this.forSelf, year: this.year, season: this.season })
      if (this.timeType == '2') {
        this.formObj.startDate = startTime + ' 00:00:00'
        this.formObj.endDate = endTime + ' 23:59:59'
      }
    },
    getRadioValue(year, season) {
      this.year = year
      this.season = season
      this.getSearchValue()
    },
    getRadio(data) {
      this.dateType = 'quarterOfYear'
    },
    getFocus(time) {
      if (time === 'y') {
        this.dateType = 'year'
        this.forYear = this.forYear || new Date()
        this.forMonth = ''
        this.forSelf = ''
        this.forQuater = ''
      } else if (time === 'm') {
        if (!this.forMonth) {
          var timestamp = new Date()
          var month = timestamp.getMonth() + 1
          if (month.toString().length === 1) {
            month = '0' + month
          }
          this.forMonth = timestamp.getFullYear() + '-' + month
        }
        this.dateType = 'month'
        this.forYear = ''
        this.forSelf = ''
        this.forQuater = ''
      } else {
        this.dateType = 'quarterOfYear'
        this.forYear = ''
        this.forSelf = ''
        this.forMonth = ''
      }
    },
    reset(val) {
      if (val === 'year') {
        this.forMonth = ''
        this.forSelf = ''
        this.forQuater = ''
        this.getFocus('y')
      } else if (val === 'month') {
        if (!this.forMonth) {
          var timestamp = new Date()
          var month = timestamp.getMonth() + 1
          if (month.toString().length === 1) {
            month = '0' + month
          }
          this.forMonth = timestamp.getFullYear() + '-' + month
        }
        this.forYear = ''
        this.forSelf = ''
        this.forQuater = ''
      } else {
        this.flag = true
        this.forYear = ''
        this.forSelf = ''
        this.forMonth = ''
      }
      if (val != 'quarterOfYear') {
        this.getSearchValue()
      }
    },
    linkToDetail(item) {
      if (this.$h5) {
        sessionStorage.setItem('qcSearchInfo', JSON.stringify({ timeType: this.timeType, dateType: this.dateType, forYear: this.forYear, forMonth: this.forMonth, forSelf: this.forSelf, year: this.year, season: this.season, customValue: this.customValue }))
        this.$router.push({
          path: '/qualityControl/reportDetail',
          query: {
            title: item.reportShowName || item.reportDictName,
            valueKey: item.reportDictCode,
            startTime: this.formObj.startDate,
            endTime: this.formObj.endDate,
            timeType: this.timeType
          }
        })
      }
    },
    /**
     * 显示公式
     */
    showExpress(report) {
       this.leftData = this.statisticsBasic.find(item => item.valueKey == report.reportDictCode)
       this.getData(report, 'express')
    },
    /**
     * 获取数据
     */
    getData(report, type) {
      const timeType = {
        month: '3',
        quarterOfYear: '6',
        year: '9',
        custom: '10'
      }
      const param = {
        'curDateTime': this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        'startDate': this.formObj.startDate,
        'endDate': this.formObj.endDate,
        'pageNum': 1,
        'bundleFlag': this.leftData.label && this.leftData.label == '感染性休克6h集束化治疗（bundle）完成率',
        'icuAreaCode': this.currentUserWard.wardCode,
        'pageSize': 10,
        'timeType': this.timeType != '2' ? '3' : timeType[this.dateType], // 按月是3 季度 6 年：9  自定义 10,
        'queryType': '0' // 0:一个表格查询 1:两个表格查询
      }
      if (this.leftData.valueKey == 'dvtDrugRate') {
        param.dvtType = '1' // ICU深静脉血栓（DVT药品）预防率
      } else if (this.leftData.valueKey == 'dvtPhysicalRate') {
        param.dvtType = '2' // ICU深静脉血栓（DVT物理）预防率
      }
      if (this.leftData.valueKey == '感染性休克1h集束化治疗（bundle）完成率') {
        param.bundleFlag = '1'
      }
      if (this.leftData.valueKey == 'unplanIntubaRate') {
        param.catherGroupCode = 'VAP'
      }

      this.leftData.dataApi(param).then(data => {
        if (type == 'express') {
          this.denominator = data.data.denominator
          this.molecule = data.data.molecule
          this.popoverVisible = false
          this.reference = this.$refs['popover-panelCode' + report.panelCode][0]
          this.$nextTick(() => {
              this.popoverVisible = true
              this.$nextTick(() => {
                  // 此时才能获取refs引用
                  this.$refs.pop.doShow()
              })
          })
        } else {
          const option = _.cloneDeep(this.trendOptionObj)
          this.trendTitle = (report.reportShowName || report.reportDictName) + '趋势分析'
          // option 格式化
          option.xAxis = data.data.options.xaxis
                option.yAxis = data.data.options.yaxis
                if (['prolapseIntubateGroupCount', 'airwayProlapseCount', 'prolapseGroupCount', 'physicalRestraintCount'].includes(this.leftData.valueKey)) {
                  option.legend = data.data.options.legend
                  option.legend.type = 'scroll'
                  option.legend.right = 30
                  option.grid.top = '40'
                  option.grid.bottom = '100'
                  option.grid.height = '70%'
                  option.series = data.data.options.series.map(i => {
                    i.type = 'bar'
                    i.label = {
                      show: true,
                      position: 'top'
                    }
                    i.data = i.data.map(j => {
                      j = j == '0' ? '' : j
                      return j
                    })
                    return i
                  })
                  option.dataZoom = [
                    {
                      show: true,
                      start: 0,
                      end: this.timeType == '2' && this.dateType == 'quarterOfYear' ? 100 : (this.leftData.valueKey == 'airwayProlapseCount' ? 50 : 10),
                      height: 12,
                      bottom: 0
                    }
                  ]
                } else {
                  option.grid.height = '90%'
                  option.series = [
                    {
                      type: 'line',
                      data: [],
                      // 折线
                      symbol: 'emptyCircle',
                      symbolSize: 10,
                      lineStyle: {
                        normal: {
                          color: 'rgba(15,73,237,1)'
                        }
                      },
                      // 点标记圆圈
                      itemStyle: {
                        normal: {
                          color: 'rgba(15,73,237,1)',
                          shadowBlur: 2,
                          shadowColor: 'rgba(0, 0, 0, .12)',
                          shadowOffsetX: 2,
                          shadowOffsetY: 2
                        }
                      },
                      // 阴影
                      areaStyle: {
                        normal: {
                          color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [{
                              offset: 0,
                              color: 'rgba(15,73,237,0.3)'
                            },
                            {
                              offset: 1,
                              color: 'rgba(15,73,237,0.1)'
                            }
                            ],
                            false
                          ),
                          shadowColor: 'rgba("15,73,237,0.1)',
                          shadowBlur: 10
                        }
                      }
                    }
                  ]
                  option.grid.top = '10'
                }
                if (this.leftData.newHtml && this.leftData.newLineEcharts) {
                  if (['nursingQualityRate'].includes(this.leftData.valueKey)) {
                    option.legend = data.data.options.legend
                    option.legend.type = 'scroll'
                    option.legend.right = 80
                    option.tooltip = {
                      formatter: function (params) {
                        let html = `<div>时间：${params[0].axisValue}</br>`
                        params.forEach(param => {
                          const unit = data.data.unit ? '‰' : '%'
                          html += `${param.marker}危重患者护理质量${param.seriesName}率：${param.data.valueList[1]}${unit}</br>`
                          html += `${param.marker}危重患者护理质量督查条目${param.seriesName}总人次数：${param.data.valueList[2]}</br>`
                        })
                        html += `同期ICU危重患者护理质量督查条目总人次数：${params[0].data.valueList[3]}`
                        return html
                      },
                      trigger: 'axis',
                      backgroundColor: '#fff',
                      confine: true,
                      borderColor: '#000',
                      extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                      padding: 5,
                      textStyle: { color: '#000' },
                      appendToBody: true
                    }
                    const originSeries = option.series[0]
                    option.series = []
                    originSeries.areaStyle = {
                      normal: {
                        color: 'transparent'
                      }
                    }
                    originSeries.itemStyle = {}
                    originSeries.lineStyle = {}
                    data.data.options.series.forEach((seriesItem, seriesIndex) => {
                      option.series.push({ ...originSeries })
                      let optionsData2 = seriesItem.data2 || []
                      optionsData2 = optionsData2.map(i => {
                        i = i.map(j => {
                          j = j != null ? (+j) : 0
                          return j
                        })
                        return i
                      })
                      const newData = optionsData2.map(optionsDataItem => {
                        return {
                          value: optionsDataItem[1],
                          valueList: [...optionsDataItem]
                        }
                      })
                      option.series[seriesIndex].data = [...newData]
                      option.series[seriesIndex].name = seriesItem.name
                    })
                  } else {
                    const leftData = this.leftData
                    option.tooltip = {
                      formatter: function (params) {
                        let html = `<div>时间：${params[0].axisValue}</br>`
                        if (leftData.label) {
                          const unit = data.data.unit ? '‰' : '%'
                          html += `${leftData.label}：${params[0].data[1]}${unit}</br>`
                        }
                        if (leftData.calculation[0] && leftData.calculation[0].label) {
                          html += `${leftData.calculation[0].label}：${params[0].data[2]}</br>`
                        }
                        if (leftData.calculation[1] && leftData.calculation[1].label) {
                          html += `${leftData.calculation[1].label}：${params[0].data[3]}`
                        }
                        return html
                      },
                      trigger: 'axis',
                      backgroundColor: '#fff',
                      confine: true,
                      borderColor: '#000',
                      extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                      padding: 5,
                      textStyle: { color: '#000' },
                      appendToBody: true
                    }
                    const originSeries = option.series[0]
                    option.series = []
                    data.data.options.series.forEach((seriesItem, seriesIndex) => {
                      option.series.push({ ...originSeries })
                      let optionsData2 = seriesItem.data2 || []
                      optionsData2 = optionsData2.map(i => {
                        i = i.map(j => {
                          j = j != null ? (+j) : 0
                          return j
                        })
                        return i
                      })
                      option.series[seriesIndex].data = [...optionsData2]
                      option.series[seriesIndex].name = seriesItem.name
                    })
                  }
                  option.yAxis = [{}]
                  option.dataZoom = [
                    {
                      show: true,
                      start: 0,
                      end: this.timeType == '2' && this.dateType == 'quarterOfYear' ? 100 : 30,
                      height: 12,
                      bottom: 20
                    }
                  ]
                  option.grid.top = '30'
                  option.grid.height = '70%'
                  option.grid.containLabel = true
                  option.yAxis[0].name = data.data.unit ? data.data.unit : '百分比'
                } else {
                  option.series[0].data = data.data.options.series[0].data
                }

          this.trendOption = option
          this.trendVisible = true
        }
      })
    },
    hidePopoverVisible() {
      this.popoverVisible = false
    },
    showTrend(report) {
       this.leftData = this.statisticsBasic.find(item => item.valueKey == report.reportDictCode)
       this.getData(report, 'trend')
    }

  },
  beforeDestroy() {
    sessionStorage.removeItem('reportDetailBack')
  }
}
</script>

<style lang="scss" scoped>
.HCContiner {
  padding: 0px;
  margin: 0px;
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;

  .searchBar {
    width: 100%;
    // height: rem(30);
    background-color: #fff;
    box-sizing: border-box;
    padding: rem(10);
    align-items: center;
    justify-content: space-between;

    i {
      font-size: rem(18);
    }

    ::v-deep .el-radio-button {
      margin-right: rem(5);

    }

    ::v-deep .el-button--small,
    .el-button--small.is-round {
      padding: 6px 15px;
    }

    ::v-deep .el-radio-button__inner {
      border-radius: 4px;
      border: 1px solid #c0c4cc;
    }

    ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      border-left: 1px solid var(--maincolor);
    }

    ::v-deep .el-button--primary {
      background-color: var(--maincolor);
      border-color: var(--maincolor);
    }

    .dateType {
      width: rem(85);
      margin-right: rem(10);
    }
    .custom-month-picker{
      width: rem(220);
    }
    .month-picker {
      width: rem(120);

      .el-month-table td.current:not(.disabled) div .cell,
      .el-year-table td.current:not(.disabled) .cell,
      .selectedseason {
        color: #fff;
        background-color: var(--maincolor);
        ;
        border-radius: 18px;
        padding: 0;
        line-height: rem(32);
      }
    }
  }

  .echartsArea {
    height: calc(100% - rem(42));
    width: 100%;

    .card {
      background: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .top {
      min-width:80vw;
      height: calc(20% - rem(10));
      width: 100%;
      margin-top: rem(10);
      grid-template-columns: 25% 25% 25% 25%;
      grid-gap: rem(10);
      margin-top: rem(10);

      .card {
        height: 100%;
      }
    }

    .center {
      min-width:80vw;
      height: calc(60% - rem(10));
      width: 100%;
      display: flex;
      margin-top: rem(10);

      .panel1 {
        height: 100%;
        margin-right: rem(10);
        width: calc(50% - rem(5));
      }

      &_right {
        height: 100%;
        width: calc(50% - rem(5));
        display: grid;
        grid-template-columns: calc(50% - rem(5)) calc(50% - rem(5));
        grid-template-rows: calc(50% - rem(5)) calc(50% - rem(5));
        grid-gap: rem(10);
      }
    }

    .bottom {
      min-width:80vw;
      margin-top: rem(10);
      height: calc(20% - rem(10));
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-gap: rem(10);
    }

    .title {
      width: 100%;
      font-size: rem(14);
      text-align: left;
      position: relative;
      display: flex;
      align-items: center;
      height: rem(14);
      padding-top: rem(15);
      padding-left: rem(5);

      span {
        width: calc(100% - rem(80));
        position: absolute;
        margin-left: rem(10);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
      }
      .icon{
        position: absolute;
        right:rem(5);
        width:rem(20);
        height:rem(20);
        svg{
           z-index:10;
          font-size:rem(20);
          color:var(--maincolor)
        }
        i{
          position: relative;
          left:0;
          top: 0;
          width:rem(20);
          height:rem(20);
          font-size:rem(20);
          color:var(--maincolor)
        }
      }

      &::before {
        content: ' ';
        position: absolute;
        width: rem(2.5);
        height: rem(14);
        margin-right: rem(10);
        background-color: var(--maincolor);
      }

    }
    .bottom .icon{
      z-index:10;
      position: absolute;
      right:0;
      margin-right:rem(5);
      margin-top:rem(5);
      svg{
         z-index:10;
        font-size:rem(20);
        color:var(--maincolor)
      }
      i{
        width:rem(20);
        height:rem(20);
        font-size:rem(20);
        color:var(--maincolor)
      }
    }
    .bottom .title {
      text-align: center;
      padding-top: rem(5);

      span {
        width: 100%;
        margin-left: 0px;
      }

      &::before {
        display: hidden;
        width: 0;
        height: 0;

      }
    }

    .value {
      height: calc(100% - rem(30));
      top:rem(14);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: rem(30);
      width: 100%;
      position: relative;
      .chart {
        width: 100%;
        height: 100%;
      }
      svg{
        z-index:10;
        position: absolute;
        right:0;
        bottom:rem(2);
        font-size:rem(20);
        color:var(--maincolor);
        margin-right:rem(5);
      }
    }
  }
}
</style>
