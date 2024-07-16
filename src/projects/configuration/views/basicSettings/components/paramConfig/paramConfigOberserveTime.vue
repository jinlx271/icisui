<!-- 基础参数 -->
<template>
  <div class="paramConfigOberserveTime">
    <el-form :label-position="'right'" label-width="118px" :model="paramValueCopy">
      <!-- <el-form-item label="待交班提醒">
        <el-input-number  v-model="paramValueCopy['pre-shift']"></el-input-number>
      </el-form-item>
      <el-form-item label="提醒交班持续时间" style="letter-spacing: -1px;">
        <el-input-number  v-model="paramValueCopy['suf-shift']"></el-input-number>
      </el-form-item> -->
      <el-form-item label="待拔管提醒">
        <el-input-number  v-model="paramValueCopy['pre-pipeline']" placeholder="请输入"></el-input-number>
      </el-form-item>
      <el-form-item label="待执行监护提醒" style="letter-spacing: -1px;">
        <el-input-number  v-model="paramValueCopy['pre-monitor']" placeholder="请输入"></el-input-number>
      </el-form-item>
      <el-form-item label="待填评估表提醒" style="letter-spacing: -1px;">
        <el-input-number  v-model="paramValueCopy['pre-assess']" placeholder="请输入"></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="待执行护嘱提醒" style="letter-spacing: -1px;">
        <el-input-number  v-model="paramValueCopy['pre-exeorder']"></el-input-number>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ParamConfigOberserveTime',
  components: {},
  data: function () {
    return {
      paramValueCopy: [],
      moniitemDictList: [],
      moniitemDictListAll: []
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        this.paramValueCopy = JSON.parse(JSON.parse(n))
        for (const key in this.paramValueCopy) {
          if (Object.hasOwnProperty.call(this.paramValueCopy, key)) {
            this.paramValueCopy[key] = +this.paramValueCopy[key]
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue)
    }
  },
  created: async function () {
  },
  mounted() { },
  methods: {
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    filterMethod(val) {
    },
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
