<template>
  <div class="progress flex align-item-center">
    <el-progress :text-inside="true" :stroke-width="20" :show-text="false" v-if="status == '3'" status="exception"
      :percentage="percentage">
    </el-progress>
    <el-progress :text-inside="true" :stroke-width="20" :show-text="false" v-else :percentage="percentage">
    </el-progress>
    <span>
      {{ filterArrValue(status, orderPlanStatusList, 'dictCode', 'dictName') }}
    </span>
  </div>
</template>
<script>
import { filterArrValue } from '@/utils/utils'
export default {
  name: 'Axis',
  props: {
    // 医嘱分类
    orderInfo: {
      type: Object,
      default: () => { }
    },
    orderPlanStatusList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      remainValue: 0, // 剩余量
      percentage: 0,
      status: '2'
    }
  },
  watch: {

  },
  mounted() {
    this.status = this.orderInfo.orderPlanStatusDict
    this.computedPercent()
    setTimeout(() => {
      this.computedPercent()
    }, 10000)
  },
  methods: {
    filterArrValue,
    computedPercent() {
      if (this.status == '3') { // 暂停的话 显示最后一次余量
        this.remainValue = this.orderInfo.executeList[this.orderInfo.executeList.length - 1].surplus
      } else {
        const lastExcuteTime = this.orderInfo.executeList[this.orderInfo.executeList.length - 1].executeBeginTime
        const second = this.$dayjs(this.$dayjs().valueOf()).diff(this.$dayjs(lastExcuteTime), 'second', true)
        const flowRate = this.orderInfo.executeList[this.orderInfo.executeList.length - 1].flowRate
        const surplus = this.orderInfo.executeList[this.orderInfo.executeList.length - 1].surplus // 上次余量
        this.remainValue = surplus - flowRate * second / 60 / 60
        if (this.remainValue <= 0) this.remainValue = 0
      }
      this.percentage = (this.orderInfo.inputQuantity - this.remainValue) * 100 / this.orderInfo.inputQuantity
    }
  }
}
</script>
<style lang="scss" scoped>
.progress {
  font-size: rem(12);

  .el-progress {
    width: rem(100);
  }

  span {
    width: rem(45);
    text-align: left;
    padding-left: rem(5);
  }
}
</style>
