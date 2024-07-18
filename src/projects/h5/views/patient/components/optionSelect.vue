<template>
  <div class="select-list">
    <template v-for="item in options">
      <span class="select-item" :class="valueArr.includes(item.dictCode) ? 'primary' : 'info'"
        @click="handlerSelect(item.dictCode)" :key="item.dictCode" v-if="item.statusDict == '1'">{{ item.dictName
        }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Selectcom',
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      valueArr: []
    }
  },
  watch: {
    value: function (newValue) {
      if (this.multiple) {
        this.valueArr = newValue.indexOf('[') > -1 ? JSON.parse(newValue) : []
      } else {
        this.valueArr = []
        this.valueArr.push(newValue)
      }
    }
  },
  mounted() {

  },
  methods: {
    handlerSelect(value) {
      if (this.valueArr.includes(value)) {
        this.valueArr = this.valueArr.filter(v => v != value)
      } else {
        if (!this.multiple) {
          this.valueArr = []
          this.valueArr.push(value)
        } else {
          this.valueArr.push(value)
        }
      }
      if (this.multiple) {
        this.$emit('change', {
          value: this.valueArr.length > 0 ? JSON.stringify(this.valueArr) : '',
          content: this.options.filter(item => this.valueArr.includes(item.dictCode)).map(item => item.dictName).toString(),
          abbr: this.options.filter(item => this.valueArr.includes(item.dictCode)).map(item => item.dictAbbr).toString()
        })
      } else {
        this.$emit('change', {
          value: this.valueArr.length > 0 ? value : '',
          content: this.valueArr.length > 0 ? this.options.find(item => this.valueArr[0] == item.dictCode).dictName : '',
          abbr: this.valueArr.length > 0 ? this.options.find(item => this.valueArr[0] == item.dictCode).dictAbbr : ''
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.select-list {
  display: inline-block;
  text-align: left;
  padding-top: rem(5);
  padding-left: 0;
}

.select-item {
  padding: rem(5) rem(15);
  margin: 0 rem(8) rem(5) 0;
  width: fit-content;
  height: rem(32);
  line-height: rem(22);
  display: inline-block;
  box-sizing: border-box;

}

.primary {
  background: var(--maincolor);
  border: 1px solid var(--maincolor);
  color: #fff;
}

.info {
  border: 1px solid #ededed;
  background-color: #ededed;
}
</style>

