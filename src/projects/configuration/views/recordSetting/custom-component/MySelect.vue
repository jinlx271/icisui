<template>
  <div class="flex">
    <span class="my-label">{{attr.label}}</span>
    <el-select v-if="!attr.multi" v-model="value" class="my-select flex-1 border-bottom flex" placeholder="请选择" :popper-append-to-body="false"
               :filterable="true" :allow-create="attr.allowCreate" :style="{ lineHeight: propStyle.height }">
      <template v-if="attr.option.from === 'local'">
        <el-option v-for="item in attr.option.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </template>
      <template v-else>
        <!-- <el-radio label="测试选项" :value="1"></el-radio> -->
        <el-option :label="'测试选项'" :value="1"> </el-option>
      </template>
    </el-select>
    <div v-else class=" flex-1 border-bottom"></div>
    <span class="my-label">{{attr.unit}}</span>
  </div>
</template>

<script>
// import optionMixins from '@/components/formComponents/optionMixins'
export default {
  // mixins: [optionMixins],
  data() {
    return {
      value: '',
      options: [
      ]
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {}
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.my-select {
  ::v-deep .el-input {
    height: 100%;
    line-height: inherit;
    .el-input__inner {
      border: none;
      font-size: 12px;
      height: 100%;
      line-height: inherit;
      padding: 0 2px;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      &:focus {
        border: none;
      }
    }
  }

  ::v-deep .el-input__suffix .el-icon-arrow-up {
    //因为不能清除数据 所以只隐藏三角  不隐藏叉叉
    display: none;
  }
}

.slot-content,
.slot-trigger {
  font-size: 12px;
}
</style>
