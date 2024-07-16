<template>
  <div class="flex border-bottom remark">
    <div class="left-area-title pointer">{{attr.label}}</div>
    <div  class="flex-1 flex flex-ver remarks">

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    }
  }

}
</script>
<style lang="scss" scoped>
.remark{
  width:100%
}
  .remarks {
    padding: 6px;
    flex-wrap: wrap;
    .remark-item{
      max-width: 33%;
      word-break: break-all;
    }
  }
</style>
