<template>
  <div v-clickoutside="handleClose" class="jidudatepicker w100">

      <!-- <mark
        style="position:fixedtop:0bottom:0left:0right:0background:rgba(0,0,0,0)z-index:999"
        v-show="showSeason"
        @click.stop="showSeason=false"
      ></mark>-->
      <el-input placeholder="请选择季度" v-model="showValue" :size="size" @focus="getFocus" @blur="getshowValue(showValue)"
        class="w100" :disabled="disabled">
        <i slot="prefix" class="el-input__icon el-icon-date"></i>
      </el-input>
      <el-card class="box-card" style="
                                                  width: 322px;
                                                  padding: 0 3px 20px;
                                                  margin-top: 10px;
                                                  position: fixed;
                                                  z-index: 9999;
                                                " v-show="showSeason">
        <div slot="header" class="firstBtn">
          <button type="button" aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="prev"></button>
          <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
          <button type="button" aria-label="后一年" @click="next"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"></button>
        </div>
        <div class="text container cssDiv">
          <!-- {{defaultyear}}{{month}} -->
          <!-- 如下，绑定class,disabled为禁止选择的时间的设置 -->
          <el-button type="text"
            :class="{ season: true, curseason: this.curseason == '1', selectedseason: this.season == '1' }" size="medium"
            style="width: 47%;  float: left" @click="selectSeason(0)">第一季度</el-button>
          <el-button type="text"
            :class="{ season: true, curseason: this.curseason == '2', selectedseason: this.season == '2' }" size="medium"
            style="float: right; width: 47%; " @click="selectSeason(1)">第二季度</el-button>
        </div>
        <!-- :class="{'colorDis': this.year === this.beforeyear && this.season <= 2 || this.year > this.defaultyear}"
        :disabled="this.year === this.beforeyear && this.season <= 2 || this.year > this.defaultyear" -->
        <!-- :class="{'colorDis': this.year === this.beforeyear && this.season <= 1 || this.year > this.defaultyear}" -->
        <!-- :disabled="this.year === this.beforeyear && this.season <= 1 || this.year > this.defaultyear" -->
        <!-- :class="{'colorDis': this.year === this.beforeyear && this.season <= 3 || this.year > this.defaultyear}"
            :disabled="this.year === this.beforeyear && this.season <= 3 || this.year > this.defaultyear" -->
        <!-- :class="{'colorDis': this.year === this.beforeyear && this.season <= 4 || this.year > this.defaultyear}"
            :disabled="this.year === this.beforeyear && this.season <= 4 || this.year > this.defaultyear" -->
        <div class="item container cssDiv" style="text-align: center">
          <el-button type="text"
            :class="{ season: true, curseason: this.curseason == '3', selectedseason: this.season == '3' }" size="medium"
            style="width: 47%;  float: left" @click="selectSeason(2)">第三季度</el-button>
          <el-button type="text"
            :class="{ season: true, curseason: this.curseason == '4', selectedseason: this.season == '4' }" size="medium"
            style="float: right; width: 47%; " @click="selectSeason(3)">第四季度</el-button>
        </div>
      </el-card>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { mapGetters } from 'vuex'
export default {
  name: 'Jududatepicker',
  // props: ['radio'],
  props: {
    size: {},
    disabled: {},
    flag: {
      type: Boolean
    },
    radio: {
      type: Number
    },
    valueArr: {
      default: () => {
        return ['01-03', '04-06', '07-09', '10-12']
      },
      type: Array
    },
    getValue: {
      default: (val) => {
        return val
      },
      type: Function
    },
    quaterComTime: {
      type: String,
      default: ''
    },
    isShowValue: {
      type: Boolean
    }
  },
  directives: {
    Clickoutside
  },
  data() {
    return {
      season: '',
      selectedseason: 0,
      showSeason: false,
      year: new Date().getFullYear(), // input显示时间，会随着用户操作改变
      defaultyear: new Date().getFullYear(), // 当前年份，不变
      month: new Date().getMonth() + 1, // 当前月份，不变
      showValue: '',
      beforeyear: null // 默认显示上一季度所用时间，可能是去年
    }
  },
  created() {
    // if (this.defaultValue) {
    //   let value = this.defaultValue
    //   let arr = value.split('-')
    //   this.year = arr[0].slice(0, 4)
    //   let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
    //   let arrAll = this.valueArr
    //   // valueArr ['01-03', '04-06', '07-09', '10-12']
    //   this.showValue = `${this.year} 年 ${arrAll.indexOf(str) + 1} 季度`
    // }
  },
  computed: {
    ...mapGetters(['statisticsOpt']),
    curseason() {
      const today = new Date() // 获取当前时间
      const month = today.getMonth() + 1 // getMonth返回0-11
      let season = null
      if (month <= 3) {
        season = 1
      } else if (month > 3 && month <= 6) {
        season = 2
      } else if (month > 6 && month <= 9) {
        season = 3
      } else if (month > 9 && month <= 12) {
        season = 4
      }
      return season
    }
  },
  watch: {
    statisticsOpt: {
      handler: function () {
        this.season = this.statisticsOpt.season
        this.year = this.statisticsOpt.year
        if (!this.year) {
          this.year = this.defaultyear
        }
        if (this.season && this.radio == 6) {
          this.showValue = `${this.year} 年 ${this.season} 季度`
        } else {
          this.getDefaultTime()
        }
      },
      immediate: true
    },
    showValue(val) {
      if (val === '' && this.radio == 6) {
        this.$emit('getRadioValue', '', '')
      }
    },
    radio() {
      if (this.radio == 6) {
        this.$emit('getRadioValue', this.year, this.season)
      } else {
        this.showValue = ''
      }
    }
  },
  mounted() {
    this.c = ''
    // 每次挂在时都对组件进行重置，那么就不需要在上级组件中进行重置
    if (!this.season) {
      this.getDefaultTime()
    }
    if (this.radio !== 6) {
      this.showValue = ''
      this.year = ''
      this.season = ''
    }
    if (this.quaterComTime) {
      this.showValue = this.quaterComTime
    }
  },
  methods: {
    getshowValue(val) { },
    handleClose() {
      this.showSeason = false
    },
    getFocus() {
      this.showSeason = true
      this.$emit('getRadio', 6)
    },
    one() {
      this.showSeason = false
    },
    prev() {
      this.year = this.year * 1 - 1
      this.getDefaultTime()
    },
    next() {
      this.year = this.year * 1 + 1
      this.getDefaultTime()
    },
    selectSeason(i) {
      var that = this
      that.season = i + 1
      that.showSeason = false
      this.showValue = `${this.year} 年 ${this.season} 季度`
      if (this.radio == 6) {
        that.$emit('getRadioValue', this.year, this.season)
      } else {
        this.showValue = ''
      }
    },
    reset() {
      // 季度重置 上一季度
      this.getDefaultTime()
    },
    getDefaultTime() {
      // 获取默认的上一个季度
      var year = this.defaultyear
      var month = this.month
      // var season = null
      if (month <= 3) {
        this.season = 1
        year -= 1
        // season = 4
        this.beforeyear = year
      } else if (month > 3 && month <= 6) {
        this.season = 2
        // season = 1
        this.beforeyear = year
      } else if (month > 6 && month <= 9) {
        this.season = 3
        // season = 2
        this.beforeyear = year
      } else if (month > 9 && month <= 12) {
        this.season = 4
        // season = 3
        this.beforeyear = year
      }
      if (this.isShowValue) {
        this.showValue = `${this.year} 年 ${this.season} 季度`
        this.selectSeason(this.season - 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.season {
  color: #606266;
}

.curseason {
  color: var(--maincolor);
  font-weight: bold;
}

// .selectedseason {
//   color: var(--maincolor);
// }
.selectedseason {
  color: #fff;
  background-color: #409eff;
  border-radius: 18px;
  padding: 0;
  line-height: 32px;
}

::v-deep .el-card__body {
  height: 100px;
}

.cssDiv {
  height: 40px;
}

.jidudatepicker {
  display: inline-block;
  width: 135px;

  .firstBtn {
    height: 30px;
    line-height: 34px;
    width: 100%;
    text-align: center;
  }

  .text {
    text-align: center;
    margin: 15px 0 10px;
  }

  .item {
    text-align: center;
  }
}

.colorDis {
  color: #999 !important;
}
</style>
<style lang="scss">
.jidudatepicker {
  .el-card__header {
    padding: 12px;
  }
}
</style>
