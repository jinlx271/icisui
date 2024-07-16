<template>
  <div class="my-date" :style="{lineHeight:propStyle.height}">
    <span class="my-label">{{ attr.label }}</span>
    <span class="text">{{date|dateFormat(attr.format)}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date()
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
  .my-date{
    font-size: 12px !important;
    .text{
      border-bottom: 1px solid var(--label-color);
    }
  }
</style>
