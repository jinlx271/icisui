<template>
  <div class="label yjx" :style="{textAlign:propStyle.textAlign,lineHeight:propStyle.height,fontSize:propStyle.fontSize,color:propStyle.color}">
    <template v-if="element.attr.showBindValue">
      {{dayStr|dateformat(element.attr.formatStr)}}<template v-if="nextDayStr">~{{nextDayStr|dateformat(element.attr.formatStr)}}</template>
    </template>
    <template v-else>
      {{element.attr.formatStr}}
    </template>

  </div>
</template>

<script>

export default {
  props: {
    bindValue: {
      type: String
    },
    element: {
      type: Object
    },
    propStyle: {
      type: Object
    }
  },
  data: function() {
    return {
      dayStr: '',
      nextDayStr: ''
    }
  },
  created() {
    console.log('this.element.bindValue', this.element.bindValue)
    if (this.element.bindValue.indexOf('~') > -1) {
      this.dayStr = this.element.bindValue.split('~')[0]
      this.nextDayStr = this.element.bindValue.split('~')[1]
    } else {
      this.dayStr = this.element.bindValue
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
