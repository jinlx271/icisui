<template>
  <div class="flex">
    <span class="my-label">{{attr.label}}</span>
     <el-input
      :value="propValue"
      class="text value flex-1"
      @input="handleInput"
      :style="{height:height+'px','line-height':height-1+'px'}"
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
    },
    attr: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState([
      'editMode'
    ]),
    height() {
      return this.element?.style.height
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', this.element, e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  border-bottom:1px solid var(--label-color);
  color:var(--value-color);
  ::v-deep .el-input__inner{
    border:none;
    height:100%;
    line-height: 1;
  }
}

.disabled {
    border: none;
}
</style>
