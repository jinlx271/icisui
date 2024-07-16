<template>
  <div class="Wnhr">
    <div :style="styleCss"></div>
  </div>
</template>

<script>
export default {
  name: 'Wnhr',
  props: {
    obj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      background: this.obj.background, // 背景颜色
      height: this.obj.height // 线宽
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.background = obj.background
        this.height = obj.height
      }
    }
  },
  computed: {
    styleCss() {
      return {
        background: this.background,
        height: this.height + 'px'
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.Wnhr {
  div {
    height: 1px;
    width: 100%;
    background: #eee;
    border: 0;
  }
}
</style>
