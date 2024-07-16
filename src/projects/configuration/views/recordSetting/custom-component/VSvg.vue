<template>
  <svg :width="element.attr.svgSize||20" :style="{fill:element.attr.svgColor}" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px" y="0px" viewBox="0 0 20 20"
       style="enable-background:new 0 0 20 20;pointer-events: none;" xml:space="preserve">
    <path :d="element.dictAbbr" />
  </svg>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object
    },
    monECfg: {
      type: Object,
      default: () => {
        return {
          'dataLoaded': false,
          'drag': true,
          'isAdd': false,
          'selPoint': true,
          'dir': 'y',
          'event': [
            {}
          ],
          'contextMenu': true
        }
      }
    },
    monEOpt: {
      type: Object,
      default: () => {
        return { 'animation': false, 'grid': { 'bottom': 0, 'left': -1, 'right': 0, 'top': -1 }, 'series': [{ 'animation': false, 'color': '#E7086E', 'connectNulls': false, 'data': [], 'id': '体温', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': '体温', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 1, 'z': 3, 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010101', 'moniitemName': '体温', 'moniitemDesc': 'T', 'lineTypeDict': 'line', 'symbolDict': 'M10.4,1.5c-4.8,0-8.7,3.9-8.7,8.7s3.9,8.7,8.7,8.7c4.8,0,8.7-4,8.7-8.7C19.1,5.4,15.2,1.5,10.4,1.5z M10.5,2.5 c1.9,0,3.7,0.7,5,1.8l-5.1,5.1l-5-5C6.7,3.2,8.5,2.5,10.5,2.5z M2.8,10.2c0-1.9,0.7-3.7,1.9-5.1l5,5l-5,5 C3.5,13.8,2.8,12.1,2.8,10.2z M5.4,15.9l5-5l5.1,5.1c-1.4,1.1-3.1,1.8-5,1.8C8.6,17.8,6.8,17.1,5.4,15.9z M16.2,15.3l-5.1-5.1 L16.2,5c1.2,1.4,2,3.2,2,5.2C18.2,12.2,17.4,14,16.2,15.3z', 'colorDict': '#E7086E', 'statusDict': '1', 'minValue': 35, 'maxValue': 40, 'monItemList': null, 'yaxis': '1', 'symbolSize': 12, 'symbol': 'path://M10.4,1.5c-4.8,0-8.7,3.9-8.7,8.7s3.9,8.7,8.7,8.7c4.8,0,8.7-4,8.7-8.7C19.1,5.4,15.2,1.5,10.4,1.5z M10.5,2.5 c1.9,0,3.7,0.7,5,1.8l-5.1,5.1l-5-5C6.7,3.2,8.5,2.5,10.5,2.5z M2.8,10.2c0-1.9,0.7-3.7,1.9-5.1l5,5l-5,5 C3.5,13.8,2.8,12.1,2.8,10.2z M5.4,15.9l5-5l5.1,5.1c-1.4,1.1-3.1,1.8-5,1.8C8.6,17.8,6.8,17.1,5.4,15.9z M16.2,15.3l-5.1-5.1 L16.2,5c1.2,1.4,2,3.2,2,5.2C18.2,12.2,17.4,14,16.2,15.3z' }, { 'animation': false, 'color': '#0363FF', 'connectNulls': false, 'data': [[1641769200, '], [1641772800, '], [1641776400, '], [1641780000, '], [1641783600, '], [1641787200, '], [1641790800, '], [1641794400, '], [1641798000, '], [1641801600, '], [1641805200, '], [1641808800, '], [1641812400, '], [1641816000, '], [1641819600, '], [1641823200, '], [1641826800, '], [1641830400, '], [1641834000, '], [1641837600, '], [1641841200, '], [1641844800, '], [1641848400, '], [1641852000, ']], 'id': '脉搏', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': '脉搏', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 2, 'z': 3, 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010201', 'moniitemName': '脉搏', 'moniitemDesc': 'PR', 'lineTypeDict': 'line', 'symbolDict': 'M10.3,1.5c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5C18.8,5.3,14.9,1.5,10.3,1.5z M10.3,17.4 c-4.1,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c4.2,0,7.4,3.4,7.4,7.5S14.4,17.4,10.3,17.4z M12.1,6.1H8.4c-1.1,0-2,0.9-2,2v3.7 c0,1.1,0.9,2,2,2h3.7c1.1,0,2-0.9,2-2V8C14.1,7,13.2,6.1,12.1,6.1z', 'colorDict': '#0363FF', 'statusDict': '1', 'minValue': 40, 'maxValue': 140, 'monItemList': null, 'yaxis': '1', 'symbolSize': 12, 'symbol': 'path://M10.3,1.5c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5C18.8,5.3,14.9,1.5,10.3,1.5z M10.3,17.4 c-4.1,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c4.2,0,7.4,3.4,7.4,7.5S14.4,17.4,10.3,17.4z M12.1,6.1H8.4c-1.1,0-2,0.9-2,2v3.7 c0,1.1,0.9,2,2,2h3.7c1.1,0,2-0.9,2-2V8C14.1,7,13.2,6.1,12.1,6.1z' }, { 'animation': false, 'color': '#FF8C00', 'connectNulls': false, 'data': [[1641769200, '], [1641772800, '], [1641776400, '], [1641780000, '], [1641783600, '], [1641787200, '], [1641790800, '], [1641794400, '], [1641798000, '], [1641801600, '], [1641805200, '], [1641808800, '], [1641812400, '], [1641816000, '], [1641819600, '], [1641823200, '], [1641826800, '], [1641830400, '], [1641834000, '], [1641837600, '], [1641841200, '], [1641844800, '], [1641848400, '], [1641852000, ']], 'id': '收缩压', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': '收缩压', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 3, 'z': 3, 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010203', 'moniitemName': '收缩压', 'moniitemDesc': '无创收缩压', 'lineTypeDict': 'line', 'symbolDict': 'M16.8,9.27v1.05L3.24,17.43V16.1L15.39,9.85V9.77L3.24,3.49V2.16Z', 'colorDict': '#FF8C00', 'statusDict': '1', 'minValue': 70, 'maxValue': 200, 'monItemList': null, 'yaxis': '1', 'symbolSize': 12, 'symbol': 'path://M16.8,9.27v1.05L3.24,17.43V16.1L15.39,9.85V9.77L3.24,3.49V2.16Z' }, { 'animation': false, 'color': '#EB7405', 'connectNulls': false, 'data': [[1641769200, '], [1641772800, '], [1641776400, '], [1641780000, '], [1641783600, '], [1641787200, '], [1641790800, '], [1641794400, '], [1641798000, '], [1641801600, '], [1641805200, '], [1641808800, '], [1641812400, '], [1641816000, '], [1641819600, '], [1641823200, '], [1641826800, '], [1641830400, '], [1641834000, '], [1641837600, '], [1641841200, '], [1641844800, '], [1641848400, '], [1641852000, ']], 'id': '舒张压', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': '舒张压', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 4, 'z': 3, 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010204', 'moniitemName': '舒张压', 'moniitemDesc': '无创舒张压', 'lineTypeDict': 'line', 'symbolDict': 'M16.8,2.16V3.49L4.65,9.77v.08L16.8,16.1v1.33L3.24,10.32V9.27Z', 'colorDict': '#EB7405', 'statusDict': '1', 'minValue': 40, 'maxValue': 120, 'monItemList': null, 'yaxis': '1', 'symbolSize': 12, 'symbol': 'path://M16.8,2.16V3.49L4.65,9.77v.08L16.8,16.1v1.33L3.24,10.32V9.27Z' }, { 'animation': false, 'color': '#7700B2', 'connectNulls': false, 'data': [[1641769200, '], [1641772800, '], [1641776400, '], [1641780000, '], [1641783600, '], [1641787200, '], [1641790800, '], [1641794400, '], [1641798000, '], [1641801600, '], [1641805200, '], [1641808800, '], [1641812400, '], [1641816000, '], [1641819600, '], [1641823200, '], [1641826800, '], [1641830400, '], [1641834000, '], [1641837600, '], [1641841200, '], [1641844800, '], [1641848400, '], [1641852000, ']], 'id': '呼吸', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': '呼吸', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 5, 'z': 3, 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010207', 'moniitemName': '呼吸', 'moniitemDesc': '呼吸频率', 'lineTypeDict': 'line', 'symbolDict': 'M10.7,10.3l6.6,6.6c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0L10,11l-6.6,6.6c-0.2,0.2-0.5,0.2-0.7,0 c-0.2-0.2-0.2-0.5,0-0.7l6.6-6.6L2.7,3.7C2.5,3.5,2.5,3.2,2.7,3c0.2-0.2,0.5-0.2,0.7,0L10,9.6L16.6,3c0.2-0.2,0.5-0.2,0.7,0 c0.2,0.2,0.2,0.5,0,0.7L10.7,10.3z', 'colorDict': '#7700B2', 'statusDict': '1', 'minValue': 10, 'maxValue': 25, 'monItemList': null, 'yaxis': '1', 'symbolSize': 12, 'symbol': 'path://M10.7,10.3l6.6,6.6c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0L10,11l-6.6,6.6c-0.2,0.2-0.5,0.2-0.7,0 c-0.2-0.2-0.2-0.5,0-0.7l6.6-6.6L2.7,3.7C2.5,3.5,2.5,3.2,2.7,3c0.2-0.2,0.5-0.2,0.7,0L10,9.6L16.6,3c0.2-0.2,0.5-0.2,0.7,0 c0.2,0.2,0.2,0.5,0,0.7L10.7,10.3z' }], 'tooltip': { 'trigger': 'item', 'formatter': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> bound formatter()' } } }, 'xAxis': [{ 'axisLabel': { 'interval': 0, 'rotate': 15, 'show': false }, 'axisLine': { 'onZero': false, 'show': false }, 'axisTick': { 'show': false }, 'boundaryGap': false, 'interval': 3600, 'max': 1641855600, 'min': 1641769200, 'splitLine': { 'lineStyle': { 'color': '#000000', 'opacity': 1, 'type': 'dotted' }, 'show': true }, 'type': 'time' }], 'yAxis': [{ 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 20, 'max': 240, 'min': 0, 'splitLine': { 'lineStyle': { 'color': '#000000', 'opacity': 1, 'type': 'dotted' }, 'show': true }, 'type': 'value' }, { 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 1, 'max': 40, 'min': 35, 'splitLine': { 'show': false }, 'type': 'value', 'moniitemName': '体温', 'moniitemCode': 'WN_ICIS_MONI_10010101' }, { 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 1, 'max': 140, 'min': 40, 'splitLine': { 'show': false }, 'type': 'value', 'moniitemName': '脉搏', 'moniitemCode': 'WN_ICIS_MONI_10010201' }, { 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 1, 'max': 200, 'min': 70, 'splitLine': { 'show': false }, 'type': 'value', 'moniitemName': '收缩压', 'moniitemCode': 'WN_ICIS_MONI_10010203' }, { 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 1, 'max': 120, 'min': 40, 'splitLine': { 'show': false }, 'type': 'value', 'moniitemName': '舒张压', 'moniitemCode': 'WN_ICIS_MONI_10010204' }, { 'axisLabel': { 'show': false }, 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'interval': 1, 'max': 25, 'min': 10, 'splitLine': { 'show': false }, 'type': 'value', 'moniitemName': '呼吸', 'moniitemCode': 'WN_ICIS_MONI_10010207' }], 'series_0': { 'animation': false, 'color': 'red', 'connectNulls': false, 'data': [], 'id': 'RR', 'itemStyle': { 'normal': {} }, 'lineStyle': { 'normal': { 'width': 1 } }, 'max': 30, 'min': 8, 'name': 'RR', 'observeId': '100001', 'smooth': 0, 'S': 12, 'type': 'line', 'units': 'bpm', 'yAxisIndex': 0, 'z': 3 } }
      }
    }
  },
  computed: {
    ...mapState(['editMode']),
    id() {
      return 'id:' + this.element?.id + 'dictAbbr_' + (this.element.dictAbbr ?? '')
    }
  },
  methods: {
    handleInput(value) {
    }
  },
  watch: {
    'propStyle': function (newValue, oldValue) {
      if (oldValue != newValue) {
        this.$refs[this.id]?.chart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
