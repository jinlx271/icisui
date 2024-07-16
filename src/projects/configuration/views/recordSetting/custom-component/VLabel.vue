<template>
  <div class="label yjx" :style="{textAlign:propStyle.textAlign,lineHeight:propStyle.lineHeight,fontSize:propStyle.fontSize,color:propStyle.color}" :title="element.bindValue">
    <template v-if="!element.attr.field">
      {{element.propValue}}
    </template>
    <template v-else>
      <template v-if="element.attr.showBindValue">
        <template v-if="element.attr.formatStr!=''">
          {{element.bindValue|dateformat(element.attr.formatStr)}}
        </template>
        <template v-else-if="element.attr.maxLength">
          {{ formatStr(element.bindValue,element.attr.maxLength)}}
        </template>
        <template v-else>
          {{element.bindValue}}
        </template>
      </template>
      <template v-else>
        {{element.attr.field|labelFieldFilter(element.attr.field)}}
      </template>
    </template>
  </div>
</template>

<script>

export default {
  props: {
    bindValue: {

    },
    element: {
      type: Object
    },
    propStyle: {
      type: Object
    }
  },
  created() {

  },
  filters: {
    labelFieldFilter(e) {
      return e?.replace(/>/g, '.')
    }
  },
  methods: {
    formatStr(str, length) {
      if (str) {
         if (str.length > length && length != 0) {
          return str.substring(0, length) + '...'
        } else {
          return str
        }
      } else return ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
