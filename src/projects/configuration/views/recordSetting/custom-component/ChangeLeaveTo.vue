<template>
  <div class="flex change-leave-to">
    <span class="label">{{attr.label}}：</span>
    <div class="leave-to-select" :style="{borderBottomWidth: propStyle.borderBottom?'1px':0}">
      <el-select
      style="max-width:80px"
placeholder="请选择"
v-model="leaveTo">
        <el-option
          v-for="(item, index) in leave_to"
          :label="item.codeName"
          :key="item.codeValue + index"
          :value="item.codeValue"
          >{{ item.codeName }}</el-option
        >
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leaveTo: '',
      leave_to: []
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.change-leave-to {
  flex-wrap: wrap;
  .label{
    font-size: 12px;
  }
  .leave-to-select{
    border-color: var(--label-color);
    border-style: solid;
    border-width: 0;
  }
  ::v-deep .el-input {
    height: 14px;
    line-height: 1;
    .el-input__inner {
      border: none;
      font-size: 12px;
      height: 100%;
      line-height: inherit;
      padding: 0 2px;
      color: var(--value-color);
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
</style>
