<template>
  <div class="transitionLeftVisible">
    <!-- 文本内容 -->
    <transition name="left">
      <div class="transitionLeftVisible_leftVisible" v-show="!leftVisible">
        <div class="visible iShow" :style="{left:`${cssLeft-20}px`,zIndex:'99'}" @click="leftVisibleFc()">
          <i class="el-icon-d-arrow-left"></i>
        </div>
        <slot></slot>
      </div>
    </transition>
    <!-- 动画效果 适配用的 -->
    <div class="transitionLeftVisible_leftBG" :style="{width:`${cssLeft}px`}" :class="{'width0':leftVisible}"></div>
    <!-- 左边隐藏显示按钮 适配用的-->
    <transition name="visible">
      <div class="visible left0 iHide" v-show="leftVisible" @click="leftVisibleFc()">
        <i class="el-icon-d-arrow-left"></i>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'TransitionLeftVisible',
  components: {},
  props: {
    leftVisible: {
      type: Boolean,
      default: false
    },
    cssLeft: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {},
  beforeCreated() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    leftVisibleFc() {
      this.$emit('leftVisibleFc', !this.leftVisible)
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/transition.scss'; // 过度
.transitionLeftVisible {
  height: 100%;
  position: relative;
  &_leftVisible {
    height: 100%;
    position: absolute;
    background: #fff;
    z-index: 99;
  }
  &_leftBG {
    height: 100%;
    transition: width $animate-duration ease;
  }
  .visible {
    width: 20px;
    height: 20px;
    top: 0;
    display: flex;
    border-radius: 3px;
    align-items: center;
    justify-content: center;
    background: rgba($color: #000, $alpha: 0.3);
    position: absolute;
    color: rgba($color: #fff, $alpha: 0.9);
  }
  .iShow {
    transform: rotateY(0);
  }
  .iHide {
    transform: rotateY(180deg);
  }
  .left0 {
    left: 0;
  }
  .width0{
    width: 0px !important;
  }
}
</style>
