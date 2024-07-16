<template>
  <div id="id" @keyup.enter="blurFunc" v-div-only-num="moniitemValueTypeDict==1" class="div-editable flex" :class="{r_c_center:isChange}" placeholder="请输入"
       contenteditable="true" v-text="innerText" @input="changeText" @focus="isChange = false" @blur="blurFunc"></div>
</template>

<script>
export default {
  name: 'DivEditable',
  props: {
    moniitemValueTypeDict: {
      type: String
    },
    id: {
      default: ''
    },
    value: {
      default: ''
    }
  },
  data() {
    return {
      innerText: this.value,
      isChange: true
    }
  },
  watch: {
    value() {
      if (this.isChange) {
        this.innerText = this.value
      }
    }
  },
  methods: {
    changeText() {
      this.$emit('input', this.$el.innerText)
    },
    blurFunc() {
      this.isChange = true
      this.$emit('blurFunc')
    }
  }
}
</script>
<style lang="scss" scoped>
.div-editable {
  background-color: white;
  width: 100%;
  height: 100%;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  &[contenteditable='true'] {
    -webkit-user-modify: read-write-plaintext-only;
    -moz-user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
}
</style>

