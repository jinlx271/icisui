<template>
  <div class="flex">
    <span class="my-label">{{ attr.label }}</span>
      <span  class="flex-1" :class="{ readonly: element.readonly }" style="color: #3f6df1; cursor: pointer; font-size: 12px">
        <el-input :value="propValue" class="text value flex-1" @input="handleInput" placeholder="请输入"
                  :style="{ height: height + 'px', 'line-height': height - 1 + 'px' }" ref="v-text"></el-input>
      </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: false
    }
  },
  props: {
    propValue: {
      type: String
    },
    element: {
      type: Object
    },
    attr: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState(['editMode']),
    height() {
      return this.element?.style.height
    }
  },
  methods: {
    confirm() { },
    handleInput(e) {
      this.$emit('input', this.element, e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.diagnose-item {
  & + .diagnose-item {
    margin-left: 6px;
  }
}
.pointer.readonly {
  cursor: not-allowed;
}
.table {
  ::v-deep .el-table__body .warning-row {
    background: #b4dbe9;
  }
}
.text {
  border-bottom: 1px solid var(--label-color);
  color: var(--value-color);
  ::v-deep .el-input__inner {
    border: none;
    height: 100%;
    line-height: 1;
  }
}

.disabled {
  border: none;
}
</style>
