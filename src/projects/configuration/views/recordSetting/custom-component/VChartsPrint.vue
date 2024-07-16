<template>
  <chart :ref="id"  class="flex-1 border-bottom chart" tabindex="1" :id="id" :class="id" :config="monECfg" :option="element.monEOpt" height="100%" />
</template>
<script>
import { mapState } from 'vuex'
import { monECfg } from '@/utils/utils'
import Chart from '@/components/Charts/anas'
export default {
  data() {
    return {
      handlerFlag: false,
      monECfg
    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      required: true,
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
    id() {
      return 'id:' + this.mode + this.element?.id + 'dataStr_' + (this.element.attr.dateStr ?? 'yy') + '_curPageNum_' + (this.element.attr.curPageNum ?? '') + 'pageNum_' + (this.element.attr.pageNum ?? '')
    }
  },
  methods: {
    handleInput(value) {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
