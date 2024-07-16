<template>
  <div class="my-input flex">
    <span class="my-label">{{ element.attr.label }}</span>
    <el-input
      class="text value flex-1 border-bottom"
      @input="handleInput"
      :placeholder="element.attr.placeholder"
      :style="{
        height: height + 'px',
        'line-height': height - 1 + 'px',
        textAlign: element.style.textAlign,
      }"
      :maxlength="element.attr.maxLength"
      ref="v-text"
    ></el-input>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    propValue: {
      type: String
    },
    element: {
      type: Object
    }
  },
  computed: {
    ...mapState(['editMode']),
    height() {
      return this.element?.style.height
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', this.element, value)
    }
  }
}
</script>

<style lang="scss" scoped>
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
