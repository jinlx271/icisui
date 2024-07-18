import {
  cooling_getById, // 物理降温
  vitalSigns_findWithPage,
  moniitemRecord_findMoniItemRecord,
  moniitemRecord_getVitalSignData
} from '@/api/configuration'
import {
  personMoniitem_findPersonConfigMoniitem
} from '@/api/patient'
import { translateMonEOpt, translateVitalSigns } from '@/utils/utils'
const max = new Date().valueOf()
const min = max - 24 * 3600 * 1000
export default {
  data() {
    return {
      signAxis: [], // Y轴
      timestamp1: '',
      optionsTemp: {
        legend: {
          data: [],
          left: 'center',
          width: 'auto',
          type: 'scroll'
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left',
            color: '#333'
          },
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          axisPointer: {
            lineStyle: {
              type: 'dashed',
              color: '#ccc'
            },
            animation: false
          }
        },
        grid: {
          top: '30px',
          bottom: '10px',
          right: '10px',
          left: '20px',
          containLabel: true
        },
        xAxis: [
          {
            axisLabel: {
              interval: 0,
              show: true
            },
            axisLine: {
              onZero: false,
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#e4e7ed',
                opacity: 1
              },
              show: false
            },
            boundaryGap: false,
            type: 'time',
            interval: (max - min) / 24,
            min: min,
            max: max
          }
        ],
        yAxis: [],
        series: [],
        series_0: {
          animation: false,
          color: 'red',
          connectNulls: false,
          data: [],
          id: 'RR',
          itemStyle: {
            normal: {}
          },
          lineStyle: {
            normal: {
              width: 1
            }
          },
          max: 30,
          min: 8,
          name: 'RR',
          observeId: '100001',
          smooth: 0,
          S: 12,
          type: 'line',
          units: 'bpm',
          yAxisIndex: 0,
          symbolSize: 15,
          z: 3
        }
      },
      options: {
        title: {
          text: ''
        },
        series: []
      },
      moniitemTypeData: [],
      loadMoniitemData: false,
      loadMoniitemFlag: false,
      MON_ITEM_CONFIG_symbolSize: [],
      paramValue: {},
      XTCS0035: '',
      XTCS1024: '',
      XTCS0061: '',
      XTCS0017: '',
      coolingData: {},
      vitalSigns_findWithPage_List: []
    }
  },
  mounted() {},
  methods: {
    refreshVitalSignData() {
      if (this.moniitemTypeData.length > 0) this.getVitalSignData()
      else {
        this.getPersonType()
      }
    },
    async getPersonType() {
      const params_p = {
        'wardCode': this.currentUserWard.wardCode
      }
      const coolingData = await cooling_getById(params_p)
      this.coolingData = coolingData.data
      const res0035 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0035' })
      this.XTCS0035 = res0035[0]?.paramValue || '0'
      const res = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1014' })
      this.areaObj = res[0]?.paramValue ? JSON.parse(res[0]?.paramValue) : {}
      const res1024 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1024' })
      this.XTCS1024 = res1024[0]?.paramValue ? JSON.parse(res1024[0]?.paramValue) : {}
      const res0017 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0017' })
      this.XTCS0017 = res0017[0]?.paramValue ? JSON.parse(res0017[0]?.paramValue) : {}
      const res0061 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0061' })
      this.XTCS0061 = res0061[0]?.paramValue ? JSON.parse(res0061[0]?.paramValue) : {}
      const commonSetting = await this.$queryParam({ paramGroupCode: 'MON_ITEM_CONFIG', paramCode: '1' })
      this.MON_ITEM_CONFIG_symbolSize = await this.$queryParam({ paramGroupCode: 'MON_ITEM_CONFIG', paramCode: '2' })
      this.paramValue = commonSetting[0]?.paramValue
      this.paramValue = this.paramValue ? JSON.parse(this.paramValue).moniitemCode : 'WN_ICIS_MONI_10010101'
      const __vitalSigns_findWithPage = await vitalSigns_findWithPage({
        'pageNum': 1,
        'pageSize': 1000,
        'wardCode': this.currentUserWard.wardCode,
        'searchKey': ''
      })
      this.vitalSigns_findWithPage_List = translateVitalSigns(__vitalSigns_findWithPage.data.result)
      const _personMoniitem_findPersonConfigMoniitem = await personMoniitem_findPersonConfigMoniitem({
        wardCode: this.currentUserWard.wardCode,
        busiTypeDictCode: '2',
        icuRecordId: this.patientInfo.icuRecordId
      })
      this.moniitemTypeData = _personMoniitem_findPersonConfigMoniitem.data
      this.getVitalSignData()
      // this.getMonitemData(this.moniitemTypeData, this.getVitalSignData)
    },
    /**
     * 生命体征曲线图
     * @param {} moniitemData
     */
    getVitalSignData(moniitemData) {
      this.loadMoniitemFlag = true
      const params = {
        endDate: this.endTime,
        freq: 3600,
        wardCode: this.currentUserWard.wardCode,
        icuRecordId: this.patientInfo.icuRecordId,
        startDate: this.startTime
      }
      moniitemRecord_getVitalSignData(params).then((res) => {
        if (res.code == 0) {
          this.signAxis = res.data
          this.loadMoniitemData = true
          this.loadMoniitemFlag = false
          this.optionsTemp.legend.data = this.signAxis.map((item) => item.moniitemName)
          const self = this
          const startTime = this.$dayjs(this.startTime).valueOf() / 1000
          const endTime = this.$dayjs(this.endTime).valueOf() / 1000
          this.optionsTemp.xAxis[0].min = startTime
          this.optionsTemp.xAxis[0].max = endTime
          this.optionsTemp.xAxis[0].interval = (endTime - startTime) / 24
          this.optionsTemp.xAxis[0].axisLabel.formatter = function (value) {
            return self.$dayjs(value * 1000).format('HH')
          }
          this.optionsTemp.xAxis[0].axisLabel.interval = 0
          this.optionsTemp.yAxis = []
          this.optionsTemp.yAxis.push({
            show: true,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#DFE7F5'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            min: 0,
            max: 240,
            interval: 24
          })
          this.optionsTemp.tooltip.formatter = function (p) {
            // trigger: 'axis' p 为list
            // trigger: 'item' p 为对象
            const arr = p[0].data.value ? p[0].data.value : p[0].data
            let htmlStr = '<div"><span>' + self.$dayjs(new Date(arr[0] * 1000)).format('YYYY-MM-DD HH:mm') + '</span><br>'
            p.forEach((item) => {
              const data = item.data.value ? item.data.value : item.data
              // htmlStr += item.marker + '<span style="color:' + item.color + '">' + item.seriesName + ' ：' + data[1] + '</span><br>'
              htmlStr += '<span style="color:' + item.color + '">' + item.seriesName + ' ：' + data[1] + '</span><br>'
            })

            return htmlStr
          }
          const vGridNum = Math.max(...this.vitalSigns_findWithPage_List.map(v => v.axisList.length))
          this.options = translateMonEOpt(Object.assign({}, this.optionsTemp), res.data, res.tdata, res.eventList, this.moniitemTypeData, this.MON_ITEM_CONFIG_symbolSize.length == 1 && +this.MON_ITEM_CONFIG_symbolSize[0]?.paramValue || 12, this.coolingData, this.paramValue, Object.assign({}, params, { vGridNum, XTCS1024: this.XTCS1024, XTCS0017: this.XTCS0017, XTCS0061: 0 }), { refs: this.$refs.signCode }, true)
        }
      })
    },
    getMonitemData(monitemList, callback) {
      const results = monitemList.map(async (item) => {
        const _moniitemRecord_findMoniItemRecord = await moniitemRecord_findMoniItemRecord({
          wardCode: this.currentUserWard.wardCode,
          monitypeCode: item.monitypeCode,
          monitypeName: item.monitypeName,
          freq: 3600,
          icuRecordId: this.patientInfo.icuRecordId,
          busiTypeDictCode: item.busiTypeDictCode,
          busiTypeDictName: item.busiTypeDictName,
          pageNum: 1,
          pageSize: 1000,
          startDateTime: this.startTime,
          endDateTime: this.endTime
        })
        return _moniitemRecord_findMoniItemRecord.data
      })
      Promise.all(results).then(function (res) {
        let arr = []
        res.forEach((item) => {
          arr = arr.concat(item)
        })
        callback(arr)
      })
    }
  }
}
