<template>
  <chart :ref="id" v-if="handlerFlag" class="flex-1 border-bottom chart" tabindex="1" :id="id" :class="id" :config="monECfg" :option="monEOpt" height="100%" />
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { monECfg, monEOpt, translateMonEOpt, formatTime } from '@/utils/utils'
import Chart from '@/components/Charts/anas'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      handlerFlag: false,
      monECfg,
      monEOpt: cloneDeep(monEOpt)
    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object
    },
    mode: { // 当一个页面中 有多个文书显示时  区分各个组件的id
      type: String,
      default: ''
    }
  },
  components: { Chart },
  created() {
  },
  computed: {
    ...mapState(['editMode']),
    ...mapGetters([
      'currWardShiftInfo'
    ]),
    id() {
      console.log('this.mode', this.mode)
      console.log('id:' + this.mode + this.element?.id + 'dataStr_' + (this.element.attr.dateStr ?? 'yy') + '_curPageNum_' + (this.element.attr.curPageNum ?? '') + 'pageNum_' + (this.element.attr.pageNum ?? ''))
      return 'id:' + this.mode + this.element?.id + 'dataStr_' + (this.element.attr.dateStr ?? 'yy') + '_curPageNum_' + (this.element.attr.curPageNum ?? '') + 'pageNum_' + (this.element.attr.pageNum ?? '')
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
    },
    'element.attr': {
      handler() {
        this.handlerFlag = false
        const monEOpt = Object.assign({}, this.monEOpt)
        // 过滤掉组件里没配置的项目
        //  EVENT 监护事件
        //  DAQ 采集数据
        // COOL 物理降温
        const curPageData = (this.element.attr.curPageData || []).filter(v => v.valueType != 'DAQ' || v.valueType == 'DAQ' && this.element.attr.vitalSigns.filter(vv => vv.moniitemCode == v.moniitemCode).length > 0)
        const oldList = (curPageData.filter(v => v.valueType == 'DAQ') || []).map(v => {
          v = Object.assign({}, this.element.attr.vitalSigns.filter(vv => vv.moniitemCode == v.moniitemCode)[0], v)
          v.monItemList = v.valueList
          return v
        })
        const sync = curPageData.filter(v => v.valueType == 'COOL')// 物理降温
        const tdata = sync.reduce(function (a, b) {
          return a.concat(b.valueList)
        }, [])
        const EVENT = curPageData.filter(v => v.valueType == 'EVENT')// 监护事件
        const eventList = EVENT.reduce(function (a, b) {
          return a.concat(b.valueList)
        }, []).filter(v => {
          return this.element.attr.moniEventConfig.filter(vv => vv.eventCode == v.moniitemCode).length > 0
        }).map((v, i) => {
          const set = this.element.attr.moniEventConfig.filter(vv => vv.eventCode == v.moniitemCode)[0]
          v.eventName = set.showTimeStyle == '1' ? (set.position == 'down' ? formatTime(new Date(v.recordTime)) + ' ' + set.eventName : set.eventName + ' ' + formatTime(new Date(v.recordTime))) : set.eventName
          return Object.assign(v, set, { eventName: v.eventName })
        }).map((v, i) => {
          v.id = v.id + i
          return v
        })
        console.log('currWardShiftInfo', this.currWardShiftInfo)
        if (this.currWardShiftInfo) {
          this.element.attr.startTime = this.$dayjs().format('YYYY-MM-DD') + ' ' + this.currWardShiftInfo[0].startTime
          this.element.attr.endTime = this.$dayjs(new Date().getTime() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD') + ' ' + this.currWardShiftInfo[0].startTime
        }

        this.monEOpt = translateMonEOpt(monEOpt, oldList, tdata, eventList, this.element.attr.vitalSigns, this.element.attr.MON_ITEM_CONFIG_symbolSize, this.element.attr.coolingObj, this.element.attr.moniitemCode, this.element.attr,
            { element: this.element })
        this.handlerFlag = true
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
