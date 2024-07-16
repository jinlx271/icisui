<template>
  <div class="flex">
    <span class="my-label">{{ attr.label }}</span>
    <el-radio-group class="flex-1" v-model="value">
        <el-radio
          label="是"
          value="1"
        ></el-radio>
        <el-radio
          label="否"
          value="0"
        ></el-radio>
    </el-radio-group>
    <span class="my-label">呕吐次数</span>
    <el-input
      class="text value border-bottom"
      :style="{
        width:'50px',
        height: height + 'px',
        'line-height': height - 1 + 'px',
        textAlign: element.style.textAlign,
      }"
      :maxlength="3"
      ref="v-text"
    ></el-input>
    <span class="my-label">次</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  props: {
    attr: {
      type: Object,
      default: () => ({})
    },
    element: {
      default: () => ({})
    }
  },
  computed: {
    height() {
      return this.element?.style.height
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio{
  margin-right:10px;
  .el-radio__label{
    padding-left:2px
  }
}
 ::v-deep .el-radio__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    ::v-deep .el-radio__input.is-checked .el-radio__inner {
      background-color: #409eff;
      border-color: #409eff;
  }
    ::v-deep .el-radio__input.is-checked .el-radio__inner:after {
      transform: rotate(45deg) scaleY(1);
    }
    ::v-deep .el-radio__inner:after {
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        border-radius: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
        background-color: #409eff;
    }
.text {
  border-bottom: 1px solid var(--label-color);
  color: var(--value-color);
  font-size: 0;
  ::v-deep .el-input__inner {
    border: none;
    height: 100%;
    line-height: 1;
    text-align: inherit;
    padding: 0 2px;
  }
}

.disabled {
  border: none;
}
</style>
