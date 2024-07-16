<template>
  <!-- :style="{lineHeight:propStyle.height}" -->

  <div class="my-rp component" :style="{'font-size': attr.rpList.fontSize+'px'}">
    <template v-for="(item) in  attr.rpList.keys" >
      <span :key="item.type+item.value" v-if="item.type===1">{{'{'+item.value+'}'}}</span>
      <span :key="item.type+item.value" v-else-if="item.type===2">{{item.value}}</span>
      <br :key="item.type+item.value" v-else-if="item.type===3" />
      <span :key="item.type+item.value" v-else-if="item.type===4" style="display:inline-block" :style="{width:item.value+'em'}"></span>
    </template>
    <div class="blank" :style="{'width': attr.rpList.blankWidth+'px', 'border-top-style': attr.rpList.blankBorderStyle,'text-align':attr.rpList.blankTextAlign}">
      {{attr.rpList.blankText}}
    </div>
  </div>
</template>

<script>

export default {
  components: {

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
  .my-rp{
    // font-size: 12px !important;
    line-height: 1.5;
    .blank{
      border-top: 1px solid #333;
      padding-top: 10px;
      margin-top: 10px;
    }
  }
</style>
