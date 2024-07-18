<template>
  <div class='axis'>
    <div v-if="name" :style="{ color: color }" class="name">{{ name }}</div>
    <div class="flex flex-1 flex-direction-column list">
      <div v-for="( item, index) in numArr " :key="index" class="flex-1  axisLabel" :style="{ color: color }">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Axis',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },

    name: {
      type: String,
      default: ''
    },
    axisNum: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: '#999'
    }
  },
  data() {
    return {
      numArr: [],
      interval: 1
    }
  },
  watch: {

  },
  mounted() {
    this.interval = Number((this.max - this.min) / this.axisNum).toFixed(1)
    let i = 0
    while (i <= this.axisNum) {
      if (this.interval < 1) {
        this.numArr.push(Number(this.max - this.interval * i).toFixed(1))
      } else {
        this.numArr.push(this.max - this.interval * i)
      }

      i++
    }
  },
  methods: {

  }
}
</script>
<style lang='scss' scoped>
.axis {
  // min-width: rem(40);
  width: fit-content;
  height: 100%;
  margin: rem(0) rem(2);

  .name {
    white-space: nowrap;
    font-size: rem(12);

  }

  .list {
    width: 100%;
    height: calc(100% - rem(14));
    display: flex;
    flex-direction: column;

    .axisLabel {
      font-size: rem(12);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
