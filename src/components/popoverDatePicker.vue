<template>
  <div class="PopoverDatePicker" style="text-align: center; margin: 0">
    <div>
      <div v-for="index in 12" :key="index" class="w25">
        <el-button size="mini" type="mini" @click="showTimeFc(index)">{{showTime(index)}}</el-button>
      </div>
    </div>
    <!-- <div>
      <div v-for="item in buttonList" :key="item.name" class="w25">
        <el-button @click="timeFc(item.value,item.type)" size="mini" type="mini">{{item.name}}</el-button>
      </div>
    </div>-->
  </div>
</template>
<script>
import dayjs from 'dayjs' // 时间的处理模块
export default {
  name: 'PopoverDatePicker',
  components: {},
  props: {
        time: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => { }
    },
    item: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
            buttonList: [
        {
          name: '前30分钟',
          value: '30',
          type: 'reduce'
        },
        {
          name: '前15分钟',
          value: '15',
          type: 'reduce'
        },
        {
          name: '后15分钟',
          value: '15',
          type: 'plus'
        },
        {
          name: '后30分钟',
          value: '30',
          type: 'plus'
        },
        {
          name: '前1小时',
          value: '60',
          type: 'reduce'
        },
        {
          name: '前45分钟',
          value: '45',
          type: 'reduce'
        },
        {
          name: '后45分钟',
          value: '45',
          type: 'plus'
        },
        {
          name: '后1小时',
          value: '60',
          type: 'plus'
        }
      ]
    }
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
    /**
     * 时间处理
     * @val 15 30 45 60
     * @type reduce plus
     */
    timeFc(val, type) {
      const myTime = new Date(this.time)
      const time =
        type == 'reduce'
          ? myTime.getTime() - val * 1000 * 60
          : myTime.getTime() + val * 1000 * 60

      this.$emit(
        'modifyTimeFc',
        dayjs(time).format('YYYY-MM-DD HH:mm:00'),
        this.name,
        this.index,
        this.row,
        this.item
      )
    },
    calculationFc(val, index, type) {
      const myTime = new Date(val)
      let getTime = myTime.getTime()
      const minutes = myTime.getMinutes()
      const number = index * 30 * 1000 * 60
      const myTimeFlag = minutes - 30 >= 0
      getTime = myTimeFlag
        ? getTime + (60 - minutes) * 1000 * 60
        : getTime + (30 - minutes) * 1000 * 60
      return dayjs(getTime - number).format(type)
    },
    showTime(index) {
      return this.calculationFc(this.time, index, 'DD日HH:mm')
    },
    showTimeFc(index) {
      this.$emit(
        'modifyTimeFc',
        this.calculationFc(this.time, index, 'YYYY-MM-DD HH:mm:00'),
        this.name,
        this.index,
        this.row,
        this.item
      )
    }
  }
}
</script>
<style lang='scss' scoped>
.line {
  display: flex;
  margin-bottom: 5px;
  justify-content: space-around;
}
.w25 {
  width: 25%;
  display: inline-flex;
  justify-content: center;
  margin-bottom: 5px;
}
</style>
