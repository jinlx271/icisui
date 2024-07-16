<template>
  <div class="WnImg">
    <!-- <el-image :style="imageCss" :src="url" fit="cover"></el-image> -->
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
      imgWidth: this.obj.imgWidth, // 图片宽度
      imgHeight: this.obj.imgHeight, // 图片宽度
      url: this.obj.url// 图片地址
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        this.imgWidth = obj.imgWidth
        this.imgHeight = obj.imgHeight
        this.url = obj.url
      }
    }
  },
  computed: {
    /**
     * 图片样式
     */
    imageCss() {
      return {
        width: this.imgWidth + 'px',
        height: this.imgHeight + 'px'
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
