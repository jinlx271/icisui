<template>
  <el-select :value="value" v-loadmore:rangeNum="loadMore(rangeNumber)" placeholder="请选择" @change="getChange" @input="$emit('input',$event)" :loading="loading"
             v-bind="$attrs" :multiple="multiple"  v-on="$listeners" clearable  @focus="() => {remoteMethod('', value)}"
             :remote-method="(query) => {remoteMethod(query, value)}" filterable remote :size="selectSize" style="width: 100%"
             @visible-change="visibleChange">
    <el-option v-for="item in optionWrap" :key="item[moniitemCode]" class="flex" :label="item[moniitemName]" :disabled="settingOption.optionDisabled == 1?item.statusDict == '0':false" :value="item[moniitemCode]">
      <span class="flex-1 " style="height:100%;padding:0 auto">{{ item[moniitemName] }}</span>&nbsp;&nbsp;&nbsp;
      <span class="flex-1 text-right" style=" color: #8492a6; font-size: 13px ; height:100%; padding:0 auto">{{ item[moniitemCode] }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { frontFilter } from '@/utils'
export default {
  name: 'VSelectMon',
  props: {
    //  组件size
    moniitemName: {
      type: String,
      default: 'moniitemName'
    },
    //  组件size
    moniitemCode: {
      type: String,
      default: 'moniitemCode'
    },
    //  组件size
    selectSize: {
      type: String,
      default: 'medium'
    },
    // 组件options
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 传入的数据
    value: {
      type: [String, Number, Array]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    settingOption: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    optionWrap() {
      return this.originalOptions.slice(0, this.rangeNumber)
    }
  },
  // 使用监听器监听传入的options,赋值给originalOptions
  watch: {
    options: {
      handler(val) {
        if (this.multiple && Array.isArray(this.value)) {
          this.originalOptions = this.options.filter(item => this.value?.some(x => x === item[this.moniitemCode])) //  选中的值 数组
        } else {
          this.originalOptions = this.options.filter(item => this.value === item[this.moniitemCode]) //  选中的值 数组
        }
      },
      immediate: true,
      deep: true
    },
    // 监听所选项变化，进行搜索回显/或初始化列表数据并回显
    value(val) {
      this.remoteMethod(this.text, val)
    }
  },
  data() {
    return {
      text: '', // 默认搜索项
      loading: false, // 搜索loading
      rangeNumber: 10, // 默认显示列表数量
      originalOptions: []// 下拉列表数据
    }
  },
  methods: {
    //  下拉框显示/隐藏触发，下来框显示初始话值为20
    visibleChange(flag) {
      if (flag) {
        this.rangeNumber = 20
      }
    },
    // 远程搜索方法
    remoteMethod(query, checkedData) {
      // this.text = query
      this.loading = true
      // setTimeout(() => {
      this.loading = false
      // checkedData 可能数组 可能字符串
      // 获取已经选择的数据防止因数据初始化匹配不到显示为ID
      const initUserList = checkedData ? this.initUserSelectData(checkedData) : []
      // 从完整数据中筛选所匹配项并过滤已选数据
      const arr = frontFilter(query, this.options).filter(v => {
        return !initUserList.some(x => x[this.moniitemCode] === v[this.moniitemCode])
      })
      // 删除搜索列表相同ID，并重新赋值
      this.originalOptions = [...initUserList, ...arr]
      // }, 80)
    },
    //  解决回显时显示为id的问题
    initUserSelectData(arr) {
      // 获取当前所选值
      if (this.multiple) {
        return this.options.filter(item => arr.some(x => x === item[this.moniitemCode])) //  选中的值 数组
      } else {
        return this.options.filter(item => arr === item[this.moniitemCode]) //  选中的值 数组
      }
    },
    //  下拉框滚动触发添加待选数据
    loadMore(n) {
      // n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
      return () => { this.rangeNumber += 10 } // 每次滚动到底部可以新增条数  可自定义
    },
    getChange(val) {
      if (this.multiple) {
        this.text = undefined
      }
      this.$emit('getChange', val)
    }
  },
  mounted() {
    this.originalOptions = []
  }
}
</script>

<style scoped>
</style>
