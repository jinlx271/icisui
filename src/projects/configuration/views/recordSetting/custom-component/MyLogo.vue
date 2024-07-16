<template>
    <div style="overflow: hidden">
       <img :src="propValue"  @error="loadError" width="100%" alt="请选择图片或上传图片" />
    </div>
</template>

<script>
export default {
  props: {
      propValue: {
          type: String,
          require: true
      }
  },

  methods: {
    loadError() {
      if (this.propValue != '') {
        this.$message.error('加载图片失败，请确认' + this.propValue + '文件是否存在')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
</style>
