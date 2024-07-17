<template>
  <div @click="handleClick">
    <component class="conponent" :is="config.component" :style="getStyle(config.style)" :propValue="config.propValue" :element="config"
               :propStyle="getStyle(config.style)" :attr="config.attr" :docType="docType" />
  </div>
</template>

<script>
import { getStyle } from '@/utils/utils'
const components = [
  'Picture',
  'VText',
  'VButton',
  'VLabel',
  'OxygenChart',
  'Remark',
  'Vline',
  'Border',
  'DiagnoseSelect',
  'MyRadio',
  'MyCheckbox',
  'MySelect',
  'MyDate',
  'CheckRoom',
  'EventTime',
  'PreOperaMed',
  'PacuGrade',
  'ChangeLeaveTo',
  'MyLogo',
  'AnaesPlane',
  'THeader',
  'TinymceEdit',
  'VPageNum',
  'VRecordDate'
]
const obj = {}
// const context=require.context(`@//views/configuration/recordSetting/custom-component/`,false,)
components.forEach(key => {
  obj[key] = require(`../../custom-component/${key}.vue`).default
})

export default {
  props: {
    config: {
      type: Object,
      require: true
    },
    docType: {
      default: 1
    }
  },
  components: obj,
  methods: {
    getStyle,
    handleClick() {
      const events = this.config.events
      Object.keys(events).forEach((event) => {
        this[event](events[event])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.conponent {
  position: absolute;
}
</style>
