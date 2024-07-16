<template>
  <div class="WnTitle" :style="styleCss">
    <i :style="iCss" v-if="iShow"></i>
    <span>{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'WnTitle',
  props: {
    obj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: this.obj.title, // 标题
      textalign: this.obj.textalign, // 对齐方式

      iWidth: this.obj.iWidth, // i标签宽度
      iHeight: this.obj.iHeight, // i标签高度
      iColor: this.obj.iColor, // i标签颜色
      iShow: this.obj.iShow // i标签显示隐藏
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.title = obj.title
        this.textalign = obj.textalign

        this.iWidth = obj.iWidth
        this.iHeight = obj.iHeight
        this.iColor = obj.iColor
        this.iShow = obj.iShow
      }
    }
  },
  computed: {
    /**
     *  头部宽度计算
     */
    styleCss() {
      return {
        justifyContent: this.textalign == 'right' ? 'flex-end' : this.textalign
      }
    },
    /**
     * i标签样式
     */
    iCss() {
      return {
        width: this.iWidth + 'px',
        height: this.iHeight + 'px',
        background: this.iColor
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.WnTitle {
  display: flex;
  align-items: center;
  i {
    display: inline-block;
    width: 3px;
    height: 16px;
    background: var(--maincolor);
    margin: 5px 10px;
  }
}
</style>
