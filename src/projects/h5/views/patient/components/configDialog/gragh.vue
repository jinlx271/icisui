<template>
  <div class="config-dialog">
    <div class="config-dialog-main">
      <div v-if="tableList.length" class="config-dialog-main-search">
        <el-button v-for="childrenItem in tableList[0].children" :key="childrenItem.itemCode"
          :type="selectCodeArr.includes(childrenItem.itemCode) ? 'primary' : 'default'"
          :plain="!selectCodeArr.includes(childrenItem.itemCode)" size="mini" round @click="selectionFC(childrenItem)">
          {{ childrenItem.itemName }}
        </el-button>
      </div>
      <div class="config-dialog-main-content">
        <chart ref="chart" class="flex-1 chart" tabindex="1" :id="'anasManager'" :config="{}" :option="option"
          height="100%" />
      </div>
    </div>
  </div>
</template>
<script>
import { patientInspect_getChartList, patientInspect_getReportTypeList } from '@/api/inspectionResult'
import { mapGetters } from 'vuex'
import Chart from '@/components/Charts/anas'
import { map } from 'lodash'
export default {
  name: 'ConfigDialog',
  components: { Chart },
  data: function () {
    return {
      datetimerange: [],
      row: {},
      rowItem: {},
      reportType: [],
      list: [],
      handleSelection: [],
      tableList: [],
      tableListAll: [],
      optionCopy: {
        dataZoom: [
          {
            xAxisIndex: 0,
            show: true,
            start: 0,
            end: 30,
            height: 12,
            bottom: 0,
            // left: 150,
            right: 10,
            fillerColor: 'rgba(167,183,204,0.4)'
          },
          {
            yAxisIndex: 0,
            show: true,
            start: 0,
            end: 100,
            width: 12,
            bottom: 60,
            top: 50,
            right: 0,
            fillerColor: 'rgba(167,183,204,0.4)'
          }
        ],
        grid: {
          containLabel: true,
          left: 0,
          right: 100,
          top: 50,
          bottom: 50,
          width: '100%'
        },
        legend: {
          bottom: 15,
          type: 'scroll',
          formatter: function (name) {
            return name.length > 10 ? name.substring(0, 10) + '...' : name
          },
          tooltip: {
            show: true
          }
        },
        series: [],
        tooltip: {
          formatter: function (params) {
            let html = `<div style="width: 300px;word-break: break-all;">时间：${params[0].axisValue}</br>`
            for (let i = 0; i < params.length; i++) {
              const item = params[i]
              if (!item.seriesName || !item.value) {
                continue
              }
              // const seriesName = item.seriesName.length > 20 ? item.seriesName.substring(0, 20) + '...' : item.seriesName
              const data = item.value != '' ? item.value : ''
              html += `<span style="white-space: pre-wrap;">${item.marker} ${item.seriesName}</span> &nbsp&nbsp${data}</br>`
            }
            html += '</div>'
            return html
          },
          trigger: 'axis',
          backgroundColor: '#fff',
          confine: true,
          borderColor: '#000',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
          padding: 5,
          textStyle: {
            color: '#000'
          },
          appendToBody: true
        },
        xAxis: [
          {
            axisTick: {
              show: true,
              interval: 0,
              alignWithLabel: true,
              length: 0
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              interval: 0,
              alignWithLabel: true,
              length: 0
            },
            data: []
          }
        ],
        yAxis: {
          type: 'value',
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
        }
      }
    }
  },
  props: {
    datetimerangeCopy: {},
    rowItemCopy: {},
    rowCopy: {}
  },
  computed: {
    ...mapGetters(['currentUserWard', 'patientInfo', 'batchSearchSysCodeObj']),
    option() {
      const optionCopy = this.optionCopy
      const xAxisData = []
      const selectItemIdArr = map(this.handleSelection, 'id')
      this.tableListAll.forEach(item => {
        item.detailList.forEach(detailItem => {
          if (selectItemIdArr.includes(detailItem.id)) {
            if (!xAxisData.includes(detailItem.receiveTime)) {
              xAxisData.push(detailItem.receiveTime)
            }
          }
        })
      })
      // optionCopy.xAxis[0].data = map(this.tableListAll, 'receiveTime')
      optionCopy.xAxis[0].data = xAxisData.sort((a, b) => this.$dayjs(a).valueOf() - this.$dayjs(b).valueOf())
      optionCopy.series = []
      const selectTableList = this.tableListAll.filter(item => optionCopy.xAxis[0].data.includes(item.receiveTime))
      for (let index = 0; index < this.handleSelection.length; index++) {
        const element = this.handleSelection[index]
        optionCopy.series.push({
          connectNulls: true,
          symbol: 'emptyCircle',
          name: `${element.itemName}(${element.parent})`,
          symbolSize: 10,
          type: 'line',
          label: {
            fontWeight: 800,
            show: true
          }
        })
        const data = []
        selectTableList.forEach((v) => {
          const filterList = v.detailList.filter((vv) => `${vv.itemCode}${vv.reportType}` == element.id)
          filterList.forEach(filterItem => {
            data[optionCopy.xAxis[0].data.indexOf(filterItem.receiveTime)] = filterItem.itemValue
          })
          // filterItem && (data[optionCopy.xAxis[0].data.indexOf(this.handleSelection[index].receiveTime)] = filterItem.itemValue)
        })
        optionCopy.series[optionCopy.series.length - 1].data = data
      }
      // const yAxislist = optionCopy.series.reduce(function (a, b) {
      //   return a.concat(b.data.map((v) => (!isNaN(+v[1]) ? +v[1] : null)))
      // }, [])
      // optionCopy.yAxis[0].min = Math.min(...yAxislist)
      // optionCopy.yAxis[0].max = Math.max(...yAxislist)
      if (optionCopy.xAxis[0].data?.length <= 7) {
        optionCopy.dataZoom[0].start = 0
        optionCopy.dataZoom[0].end = 100
      } else if (optionCopy.xAxis[0].data?.length > 7) {
        optionCopy.dataZoom[0].start = parseInt(100 - (7 / optionCopy.xAxis[0].data.length) * 100)
      }
      return optionCopy
    },
    selectCodeArr() {
      return map(this.handleSelection, 'itemCode')
    }
  },
  created: async function () {
    this.datetimerange = this.datetimerangeCopy || []
    this.row = this.rowCopy
    this.rowItem = this.rowItemCopy
    const list = await patientInspect_getReportTypeList({
      icuRecordId: this.patientInfo.icuRecordId
    })
    this.list = list.data
    this.reportType = [this.row.reportType]
    this.init('create')
  },
  mounted() { },
  methods: {
    init: async function (create) {
      this.datetimerange = this.datetimerange || []
      this.loading = true
      if (!this.reportType.length) {
        this.tableList = []
        this.tableListAll = []
        this.handleSelection = []
        return
      }
      const res = await patientInspect_getChartList({
        endDateTime: this.datetimerange[1],
        icuRecordId: this.patientInfo.icuRecordId,
        reportTypeList: this.reportType,
        startDateTime: this.datetimerange[0]
      })
      if (res.data && res.data.length > 0) {
        this.tableList = []
        this.tableListAll = res.data.map(item => {
          item.receiveTime = item.detailList.length ? item.detailList[0].receiveTime : ''
          item.detailList.map(detailItem => {
            detailItem.id = `${detailItem.itemCode}${detailItem.reportType}`
            return detailItem
          })
          return item
        }).sort((a, b) => this.$dayjs(a.receiveTime).valueOf() - this.$dayjs(b.receiveTime).valueOf())
        const itemObjArr = {}
        this.tableListAll.forEach((item, index) => {
          this.tableList.push({
            itemCode: index,
            itemName: item.reportType,
            id: index,
            children: []
          })
          item.detailList.forEach((detailItem) => {
            const { id, itemCode, itemName, reportType, receiveTime } = detailItem
            itemObjArr[`${itemCode}${reportType}`] = {
              id,
              itemCode,
              itemName,
              parentIndex: index,
              parent: item.reportType,
              receiveTime
            }
          })
        })
        Object.keys(itemObjArr).forEach((key) => {
          this.tableList[itemObjArr[key].parentIndex].children.push(itemObjArr[key])
        })
        if (create) {
          const selectRow = this.tableList[0].children.find(childrenItem => childrenItem.itemCode == this.rowItemCopy.itemCode)
          console.log('create-selectRow', selectRow, this.tableList, map(this.tableList[0].children, 'itemCode'), this.rowCopy.itemCode, this.rowItemCopy.itemCode)
          this.selectionFC(selectRow)
        }
      } else {
        this.tableListAll = this.tableList = []
      }
      this.$nextTick(() => {
        this.loading = false
        const selectCodeArr = map(this.handleSelection, 'itemCode')
        this.tableList.forEach(item => {
          if (item.children && item.children.length) {
            let childrenNum = 0
            item.children.forEach(children => {
              if (selectCodeArr.includes(children.itemCode)) {
                this.$refs.tablegragh?.toggleRowSelection(children, true)
                childrenNum++
              } else {
                this.$refs.tablegragh?.toggleRowSelection(children, false)
              }
            })
            if (childrenNum == item.children.length) {
              this.$refs.tablegragh?.toggleRowSelection(item, true)
            } else {
              this.$refs.tablegragh?.toggleRowSelection(item, false)
            }
          }
        })
      })
    },
    selectionFC(row) {
      if (this.selectCodeArr.includes(row.itemCode)) {
        const selectRowIndex = this.selectCodeArr.indexOf(row.itemCode)
        this.handleSelection.splice(selectRowIndex, 1)
      } else {
        this.handleSelection.push(row)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.config-dialog {
  padding: 1rem;
  height: 100%;

  .config-dialog-main {
    height: 100%;
    width: 100%;

    .config-dialog-main-search {
      width: 100%;
      padding-bottom: 1rem;
      margin-bottom: -1rem;
      display: flex;
      overflow-x: auto;
    }

    .config-dialog-main-content {
      height: calc(100% - 2.1rem);
      // overflow: hidden;
      padding-left: 20px;

      .config-dialog-main-content-top {
        height: 100%;
      }
    }
  }
}
</style>
