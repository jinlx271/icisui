<template>
  <div class="flex">
    <span class="my-label">{{ attr.label }}</span>
    <el-popover
      class="flex-1"
      placement="bottom"
      title="手术"
      width="480"
      v-model="visible"
      trigger="click"
    >
      <div class="flex table" style="justify-content: space-between">
        <el-button class="but-con" @click="visible = false">取消</el-button>
        <el-button
class="but-con"
@click="confirm"
type="primary"
          >确定</el-button
        >
      </div>
      <span
        slot="reference"
        class="flex-1"
        :class="{ readonly: element.readonly }"
        style="color: #3f6df1; cursor: pointer; font-size: 12px"
      >
        <el-input
          :value="propValue"
          class="text value flex-1"
          @input="handleInput"
          :style="{ height: height + 'px', 'line-height': height - 1 + 'px' }"
          placeholder="请输入"
          ref="v-text"
        ></el-input>
      </span>
    </el-popover>
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
    confirm() {},
    handleInput(e) {
      this.$emit('input', this.element, e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.diagnose-item {
  color: #000622;
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
