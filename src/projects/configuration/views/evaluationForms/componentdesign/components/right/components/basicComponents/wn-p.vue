<template>
  <div class="Wnp" :style="styleCss">{{title}}</div>
</template>

<script>
export default {
  name: 'Wnp',
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    } // 业务是true ,配置管理是false
  },
  data() {
    return {
      title: this.obj.title, // 标题
      textalign: this.obj.textalign, // 对齐方式
      moveInput: this.obj.moveInput, // 移动input
      verticalMove: this.obj.verticalMove, // 上下移
      levelMove: this.obj.levelMove // 左右移
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.title = obj.title
        this.textalign = obj.textalign
        this.moveInput = obj.moveInput
        this.verticalMove = obj.verticalMove
        this.levelMove = obj.levelMove
        this.$emit(
          'componentStyleCss',
          this.id,
          this.moveInput,
          this.verticalMove,
          this.levelMove
        )
      }
    }
  },
  computed: {
    /**
     *  头部宽度计算
     */
    styleCss() {
      const pData = {
        justifyContent: this.textalign == 'right' ? 'flex-end' : this.textalign
      }
      if (!this.edit) {
        // 业务是true ,配置管理是false
        return pData
      }
      if (this.moveInput) {
        Object.assign(pData, {
          position: 'absolute',
          top: this.verticalMove + 'px',
          left: this.levelMove + 'px'
        })
      } else {
        Object.assign(pData, { position: 'relative', top: 0, left: 0 })
      }
      return pData
    }
  },
  created() {
    this.$emit(
      'componentStyleCss',
      this.id,
      this.moveInput,
      this.verticalMove,
      this.levelMove
    )
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.Wnp {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
