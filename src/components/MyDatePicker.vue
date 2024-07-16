<template>
  <div>
    <template v-if="config.mode === 'input'">
      <template v-if="config.type === 'daterange'">
        <input :value="dateVal[0]" :placeholder="$attrs['start-placeholder']" :style="inputStyle" v-bind="$attrs"
               @input="handleInput($event, 'inputRangeValue1')" @focus="handleFocus($event, 'inputRangeValue1')"
               @blur="handleBlur($event, 'inputRangeValue1')" @change="handleChange($event, 'inputRangeValue1')" />
        <span>{{ $attrs['range-separator'] || '至' }}</span>
        <input :value="dateVal[1]" :placeholder="$attrs['end-placeholder']" :style="inputStyle" v-bind="$attrs"
               @input="handleInput($event, 'inputRangeValue2')" @focus="handleFocus($event, 'inputRangeValue2')"
               @blur="handleBlur($event, 'inputRangeValue2')" @change="handleChange($event, 'inputRangeValue2')" />
      </template>
      <div v-else-if="config.type === 'inputdatetime'" class="input-datetime">
        <input type="hidden" :value="inputDateTime">
        <input v-model="inputDate" type="date">
        <input v-model="inputTime" type="time">
      </div>
      <input v-else :value="dateVal" :style="inputStyle" v-bind="$attrs" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
             @change="handleChange" />
    </template>
    <wn-date-picker v-else-if="config.mode === 'datePicker'" v-model="dateVal" v-bind="$attrs" v-on="$listeners">
    </wn-date-picker>
    <wn-time-picker v-else-if="config.mode === 'timePicker'" v-model="dateVal" v-bind="$attrs" v-on="$listeners">
    </wn-time-picker>
    <el-time-select v-else-if="config.mode === 'timeSelect'" v-model="dateVal" v-bind="$attrs" v-on="$listeners">
    </el-time-select>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'MyDatePicker',
  props: {
    value: {
      required: true
    },
    inputStyle: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Object,
      default: () => {
        return {
          mode: 'input'
        }
      }
    }
  },
  data() {
    return {
      inputDate: dayjs().format('YYYY-MM-DD'),
      inputTime: '00:00'
    }
  },
  computed: {
    dateVal: {
      get() {
        if (this.config.mode === 'input' && this.config.type !== 'daterange' && this.$attrs.type !== 'time') {
          return Array.isArray(this.value) ? this.value.map(val => dayjs(new Date(val)).format('YYYY-MM-DD')) : dayjs(new Date(this.value)).format('YYYY-MM-DD')
        } else {
          return this.value
        }
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    inputDateTime() {
      this.$emit('input', `${this.inputDate} ${this.inputTime}`)
      return `${this.inputDate} ${this.inputTime}`
    }
  },
  mounted() {
  },
  methods: {
    handleInput(event, el) {
      this.isInputRange(event, el, 'input')
    },
    handleBlur(event, el) {
      this.isInputRange(event, el, 'blur')
    },
    handleFocus(event, el) {
      this.isInputRange(event, el, 'focus')
    },
    handleChange(event, el) {
      this.isInputRange(event, el, 'change')
    },
    isInputRange(event, el, type) {
      if (event.target.value) {
        let resultVal
        if (this.config.type === 'daterange') {
          let curTargetValue = this.dateVal
          if (el === 'inputRangeValue1') {
            curTargetValue = [event.target.value, this.dateVal[1]]
          } else {
            curTargetValue = [this.dateVal[0], event.target.value]
          }
          if (this.$attrs.type !== 'time') {
            if (this.$attrs['value-format'] === 'timestamp') {
              resultVal = curTargetValue.map(val => val ? dayjs(new Date(val)).valueOf() : '')
            } else {
              resultVal = curTargetValue.map(val => val ? dayjs(new Date(val)).format(this.$attrs['value-format'] || 'YYYY-MM-DD') : '')
            }
          } else {
            resultVal = curTargetValue.map(val => val || '')
          }
        } else {
          if (this.$attrs.type !== 'time') {
            if (this.$attrs['value-format'] === 'timestamp') {
              resultVal = dayjs(event.target.value).valueOf()
            } else {
              resultVal = dayjs(event.target.value).format(this.$attrs['value-format'] || 'YYYY-MM-DD')
            }
          } else {
            resultVal = event.target.value
          }
        }
        this.$emit(type, resultVal)
      } else {
        this.$emit(type, event.target.value)
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.drag-select {
  ::v-deep {
    .sortable-ghost {
      opacity: 0.8;
      color: #fff !important;
      background: #42b983 !important;
    }

    .el-tag {
      cursor: pointer;
    }
  }
}
.input-datetime {
  display: flex;
  border-radius: 4px;
  border: 1.5px solid #d1d5db;
  height: 32px;
  line-height: 32px;
  input {
    height: 28px;
    line-height: 28px;
    border: none;
    padding: 0 10px;
    font-size: 13px;
    &[type='date'] {
      width: 150px;
    }
    &[type='time'] {
      width: 84px;
    }
  }
}
</style>
