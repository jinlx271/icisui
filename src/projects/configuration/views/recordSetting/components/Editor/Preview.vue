<template>
  <div class="bg" v-if="show">
    <el-button @click="close" class="close">关闭</el-button>
    <div class="canvas-container">
      <div class="container-box">
        <div
          class="container-bg"
          :style="{
            width: canvasStyleData.width + 20 + 'px',
            height: canvasStyleData.height + 20 + 'px'
          }"
        >
          <div
            class="canvas"
            :style="{
              width: canvasStyleData.width + 'px',
              height: canvasStyleData.height + 'px'
            }"
          >
            <ComponentWrapper
              v-for="item in componentData"
              :key="item"
              :config="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStyle } from '@/utils/utils'
import ComponentWrapper from './ComponentWrapper'

export default {
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: { ComponentWrapper },
  computed: {
    componentData() {
      return this.$store.state.formCreator.componentData
    },
    canvasStyleData() {
      return this.$store.state.formCreator.canvasStyleData
    }
  },
  methods: {
    getStyle,

    close() {
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 0px);

    display: flex;
    justify-content: center;
    .container-box {
      height: calc(100% - 0px);
      overflow: hidden;
      overflow-y: scroll;
      .container-bg {
        background: #fff;
        padding: 10px;
      }
      .canvas {
        background: #fff;
        position: relative;
        flex-shrink: 0;
      }
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
