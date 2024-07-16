<!--
 * @Author: shenxh
 * @Date: 2020-07-10 16:40:30
 * @LastEditors: shenxh
 * @LastEditTime: 2022-05-06 10:32:10
 * @Description: 组件-拖动缩放
-->
<template>
  <div ref="xx-drag-zoom" :class="allowZoom===true?'xx-drag-zoom':''" :style="dragZoomNodeStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'XxDragZoom',
  components: {},
  props: {
    /* 被操作的元素 start */
    // X 坐标
    left: {
      type: Number,
      default: 0
    },
    // Y 坐标
    top: {
      type: Number,
      default: 0
    },
    // 宽度
    width: Number,
    // 高度
    height: Number,
    // 允许缩放
    allowZoom: Boolean,
    // 缩放比例
    zoom: {
      type: Number,
      default: 1
    },
    // 最大缩放比例
    maxZoom: {
      type: Number,
      default: 2
    },
    // 最小缩放比例
    minZoom: {
      type: Number,
      default: 0.5
    },
    // 缩放幅度
    range: {
      type: Number,
      default: 0.1
    },
    /* 被操作的元素 end */

    /* 活动区域 start */
    // 节点 (注: 传入节点后可以自动获取数据, 不需要再传坐标与宽高了)
    areaNode: HTMLDivElement,
    // X 坐标 (未设置 areaNode 时生效)
    areaLeft: {
      type: Number,
      default: 0
    },
    // Y 坐标 (未设置 areaNode 时生效)
    areaTop: {
      type: Number,
      default: 0
    },
    // 宽度 (未设置 areaNode 时生效)
    areaWidth: {
      type: Number,
      default: 200
    },
    // 高度 (未设置 areaNode 时生效)
    areaHeight: {
      type: Number,
      default: 100
    }
    /* 活动区域 end */
  },
  data() {
    return {
      currentZoom: this.zoom,
      initLeft: this.left,
      initTop: this.top
    }
  },
  computed: {
    // 被操作的元素节点
    dragZoomNode() {
      return this.$refs['xx-drag-zoom']
    },
    // 活动区域数据
    areaNodeData() {
      let obj = {}
      const node = this.areaNode

      if (node) {
        obj = {
          left: node.clientLeft,
          top: node.clientTop,
          width: node.offsetWidth, // 忽略边框
          height: node.offsetHeight // 忽略边框
        }
      } else {
        obj = {
          left: this.areaLeft,
          top: this.areaTop,
          width: this.areaWidth,
          height: this.areaHeight
        }
      }

      return obj
    },
    // 设置样式
    dragZoomNodeStyle() {
        return {
          transform: `scale(${this.currentZoom})`,
          left: `${this.initLeft}px`,
          top: `${this.initTop}px`,
          width: this.width + 'px',
          height: this.height + 'px'
        }
    }
  },
  watch: {
    zoom(val) {
      this.currentZoom = val
      this.initStyle()
    },
    left(val) {
      this.initLeft = val
      this.initStyle()
    },
    top(val) {
      this.initTop = val
      this.initStyle()
    },
    allowZoom() {
      if (this.allowZoom === true) {
         this.dragZoomNode.addEventListener('wheel', this.mousescroll)
         this.dragZoomNode.addEventListener('mousedown', this.mousedown)
      } else {
        this.dragZoomNode.removeEventListener('wheel', this.mousescroll)
        this.dragZoomNode.removeEventListener('mousedown', this.mousedown)
      }
    }

  },
  created() {},
  mounted() {
    this.initStyle()
  },
  beforeDestroy() {
    this.dragZoomNode.removeEventListener('mousedown', null)
    this.dragZoomNode.removeEventListener('wheel', null)
  },
  methods: {
    // 鼠标点击事件
    mousedown(evt) {
      const {
        offsetLeft: dragL, // 当前drag位置
        offsetTop: dragT
      } = this.dragZoomNode
      const x = evt.clientX // 鼠标点击位置坐标
      const y = evt.clientY

      // 鼠标拖动事件
      document.onmousemove = evt => {
        const styleL = evt.clientX - x
        const styleT = evt.clientY - y
        this.dragZoomNode.style.left = (dragL + styleL) + 'px'
        this.dragZoomNode.style.top = (dragT + styleT) + 'px'
        this.initLeft = (dragL + styleL)
        this.initTop = (dragT + styleT)
        this.$emit('mousemove', evt)
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },

    // 鼠标滚轮事件
    mousescroll(evt) {
      // 阻止默认行为
      if (evt.preventDefault) {
        evt.preventDefault()
      } else {
        evt.returnValue = false
      }
      const { deltaY } = evt
      let zoom = this.currentZoom

      // 不允许缩放
      if (!this.allowZoom) {
        return
      }
      // 上滑
      if (deltaY < 0) {
        if (zoom >= this.maxZoom) {
          return
        }

        zoom += this.range
      } else {
        if (zoom <= this.minZoom) {
          return
        }

        zoom -= this.range
      }
      this.currentZoom = Number(zoom.toFixed(1))
      this.$emit('mousescroll', evt)
    },

    // 样式初始化
    initStyle() {
      let tmpLeft = this.left
      let tmpTop = this.top
      const { offsetWidth: dragW, offsetHeight: dragH } = this.dragZoomNode

      tmpLeft = this.left - (dragW * (1 - this.zoom)) / 2
      tmpTop = this.left - (dragH * (1 - this.zoom)) / 2

      this.initLeft = tmpLeft
      this.initTop = tmpTop
    }
  }
}
</script>

<style scoped>
.xx-drag-zoom {
  position: absolute;
  user-select: none;
  cursor: grab;
}

</style>
