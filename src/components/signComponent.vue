<template>

  <!-- 签名组件 -->
  <el-dialog
    class="sign-components"
    v-el-drag-dialog
    title="患者签名"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="closeWindow"
    width="1200px"
    append-to-body
  >
    <div class="sign-box">
      <canvas class="sign" ref="canvas"></canvas>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeRect('cancel')" plain>关闭</el-button>
      <el-button type="primary" @click="clearCanvas" plain>清空</el-button>
      <el-button type="primary" @click="closeRect('determine')">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SignComponent',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      txt: '',
      canvas: null, // canvas dom节点
      ctx: null, // canvas
      width: null, // 签名区域宽度
      height: null, // 签名区域高度
      top: 0, // 签名区域到浏览器顶部的距离
      left: 0, // 签名区域到浏览器左边的距离，
      dialogVisible: false
    }
  },

  watch: {
    show() {
      this.dialogVisible = this.show
      this.$nextTick(() => {
        this.createRect()
      })
    }
  },

  created() {
    // if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
    // }
  },

  methods: {
    closeWindow() {
      this.$emit('update:show', false)
    },
    // 创建canvas画板
    createRect() {
      this.canvas = this.$refs.canvas
      this.top = this.canvas.offsetTop
      this.left = this.canvas.offsetLeft
      this.ctx = this.canvas.getContext('2d')

      this.width = this.canvas.offsetWidth
      this.height = this.canvas.offsetHeight
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.strokeStyle = '#000000'
      this.ctx.lineCap = 'round'
      this.ctx.lineWidth = 6
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
        this.canvas.addEventListener('touchstart', this.touchStartFunc)
        this.canvas.addEventListener('touchend', this.endFunc)
      } else {
        this.canvas.addEventListener('mousedown', this.startFunc)
        this.canvas.addEventListener('mouseup', this.endFunc)
      }
    },

    // 鼠标按下
    startFunc(e) {
      this.ctx.beginPath()
      this.ctx.moveTo(e.offsetX, e.offsetY)
      this.canvas.addEventListener('mousemove', this.moveFunc)
    },
    // 手指按下
    touchStartFunc(e) {
      try {
        const touch = e.touches[0]
        this.ctx.beginPath()
        this.ctx.moveTo(touch.clientX - this.left, touch.clientY - e.left)
        this.canvas.addEventListener('touchmove', this.touchMoveFunc)
      } catch (e) {
        alert(e)
      }
    },
    // 鼠标移动
    moveFunc(e) {
      this.ctx.lineTo(e.offsetX, e.offsetY)
      this.ctx.stroke()
    },
    // 手指移动
    touchMoveFunc(e) {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      this.txt += `${touch.clientX}`
      this.ctx.lineTo(touch.clientX - this.left, touch.clientY - this.top)
      this.ctx.stroke()
    },
    // 鼠标弹起
    endFunc() {
      this.ctx.closePath()
      this.canvas.removeEventListener('mousemove', this.moveFunc)
      this.canvas.addEventListener('touchmove', this.touchMoveFunc)
    },

    // 清空画布
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillRect(0, 0, this.width, this.height)
    },

    // 关闭签名画布传值给父组件，清空画布
    closeRect(type) {
      const url = this.canvas.toDataURL('image/jpeg', 0.5)
      const notFilled = this.createCanvas(url)

      this.$emit('sign_img', { url, type, notFilled })

      this.clearCanvas()
    },

    // 用于判断是否为空画布
    createCanvas(rect) {
      const check = document.createElement('canvas')
      const ctx = check.getContext('2d')
      check.width = this.width
      check.height = this.height
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, this.width, this.height)
      return rect === check.toDataURL('image/jpeg', 0.5)
    }
  }
}
</script>
<style lang="scss" scoped>
.sign-components{
  .sign-box {
    background: #ffffff;
  }
  .sign {
    width: 100%;
    height: 450px;
    border: 1px solid #eee;
  }
  .el-button{
    width: 90px;
  }
}
</style>
