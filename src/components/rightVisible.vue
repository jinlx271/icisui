<template>
  <div class="transitionRightVisible">
    <!-- 文本内容 -->
    <transition name="right">
      <div class="transitionRightVisible_rightVisible" v-show="!rightVisible">
        <div class="visible iShow" :style="{right:`${cssRight - 20}px`}" @click="rightVisibleFc()">
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <slot></slot>
      </div>
    </transition>
    <!-- 动画效果 适配用的 -->
    <div class="transitionRightVisible_rightBG" :style="{width:`${cssRight}px`}" :class="{'width0':rightVisible}"></div>
    <!-- 左边隐藏显示按钮 -->
    <transition name="visible">
      <div class="visible right0 iHide" v-show="rightVisible" @click="rightVisibleFc()">
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'TransitionRightVisible',
  components: {},
  props: {
    rightVisible: {
      type: Boolean,
      default: false
    },
    cssRight: {
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
    rightVisibleFc() {
      this.$emit('rightVisibleFc', !this.rightVisible)
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/transition.scss'; // 过度
.transitionRightVisible {
  height: 100%;
  position: relative;
  &_rightVisible {
    height: 100%;
    position: absolute;
    background: #fff;
    z-index: 2;
  }
  &_rightBG {
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
  .right0 {
    right: 0;
  }
  .width0 {
    width: 0px !important;
  }
}
</style>
