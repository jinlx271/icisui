<template>
  <el-select ref="selectRef" v-model="realValue" @input="handleInput" v-bind="$attrs" v-on="$listeners"
    @keydown.enter.native="handlerEnter" @keydown.space.native="handlerSpace"
    @keydown.left="changeFocus"
    @keydown.right="changeFocus"
    >
    <slot></slot>
  </el-select>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Array]
    }
  },
  data() {
    return {
      realValue: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.realValue = newVal
      }
    }
  },
  mounted() {
    this.$refs.selectRef.selectOption = function() {}
  },
  methods: {
    handleInput(e) {
      this.$emit('update:value', e)
    },
    handlerEnter(e) {
      this.$emit('save')
      this.$refs.selectRef.blur()
      e.stopPropagation()
      e.preventDefault()
    },
    changeFocus() {
      this.$refs.selectRef.blur()
    },
    /**
     * 空格键处理 处理下拉选择框 用空格键选择值s
     */
    handlerSpace(e) {
      if (this.$refs.selectRef.hoverIndex != -1) {
        if (this.$refs.selectRef.multiple) {
          const index = this.$refs.selectRef.value.findIndex(value => value == this.$refs.selectRef.options[this.$refs.selectRef.hoverIndex].value)
          if (index > -1) {
            this.$refs.selectRef.value.splice(index, 1)
          } else {
            this.$refs.selectRef.value.push(this.$refs.selectRef.options[this.$refs.selectRef.hoverIndex].value)
          }
        } else {
          this.realValue = this.$refs.selectRef.options[this.$refs.selectRef.hoverIndex].value
          this.$emit('change', this.realValue)
        }
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
}
</script>
