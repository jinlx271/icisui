<template>
  <div class="flex oxygen-chart">
    <div class="left-area text-center border-bottom" :style="{lineHeight:propStyle.height}">
      O
      <sub>2</sub>&nbsp;L/min
    </div>
    <div class="flex time-box flex-1">
      <div class="flex-1" v-for="j in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" :key="'shiba'+j">
        <el-input
          class="chart-input padding-0"
          type=""
        ></el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.oxygen-chart{
  height: 100%;
  line-height: 100%;
  .time-box{
    font-size: 0;
    border-bottom: 1px solid var(--label-color);
    >div{
    border-left: 1px solid var(--label-color);
    &:first-child{
      border-left:none
    }
  }
  }

}
</style>
