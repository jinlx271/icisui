<template>
  <div class="my-barcode component flex">
    <span class="my-label">{{ attr.label }}</span>
    <div class="barcode" style="pointer-events: none;"><barcode :value="888888" :format="attr.barCodeFormat"  :height="propStyle.height" width="1" :display-value="attr.barCodeValue" :fontSize="attr.barCodeValueSize" :margin="0"></barcode></div>
  </div>
</template>

<script>
import barcode from 'vue-barcode'

export default {
  components: {
    barcode
  },
  data() {
    return {

    }
  },
  props: {
    propStyle: {},
    attr: {

    }
  }
}
</script>

<style lang="scss" scoped>
  .my-barcode{
    font-size: 12px !important;
  }
</style>
