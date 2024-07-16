<!-- 基础参数 0107 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <el-form ref="form" :model="paramInfo" label-width="18em"  label-position="left">
        <el-form-item label="相同时间下首条记录的时间输出格式" prop="timeFormat0" class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.timeFormat0"></el-input>
        </el-form-item>
        <el-form-item label="相同时间下非首条记录的时间输出格式" prop="timeFormat1" class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.timeFormat1" ></el-input>
        </el-form-item>
        <el-form-item label="只输出折行的第一行的特殊时间字段" prop="showTime0" class="line30" >
          <el-switch v-model="paramInfo.showTime0" active-value="1" inactive-value="0"
              active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="不输出小结的特殊时间字段" prop="showTime1" class="line30" >
          <el-switch v-model="paramInfo.showTime1" active-value="1" inactive-value="0"
              active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  validateIllegalChar
} from './validateIllegalChar.js'
export default {
  name: 'ParamConfig0107',
  data: function () {
    return {
     // 隐私信息加密
      paramInfo: {
        timeFormat0: '', // 加密开关
        timeFormat1: '', // 存储api地址
        showTime0: '0',
        showTime1: '0'
      }
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramInfo = n
          if (n != '' && n) {
            const arr = paramInfo.split('|')
            this.paramInfo.timeFormat0 = arr[0] || ''
            this.paramInfo.timeFormat1 = arr[1] || ''
            this.paramInfo.showTime0 = arr[2] || '0'
            this.paramInfo.showTime1 = arr[3] || '0'
          }
        } catch (error) {
          console.log('error', error)
        }
      },
      immediate: true,
      deep: true
    },
    'paramInfo.timeFormat0': function(newValue, oldValue) {
      if (validateIllegalChar(newValue, ['|'])) {
        this.paramInfo.timeFormat0 = oldValue
      }
    },
    'paramInfo.timeFormat1': function(newValue, oldValue) {
      if (validateIllegalChar(newValue, ['|'])) {
        this.paramInfo.timeFormat1 = oldValue
      }
    }
  },
  computed: {
    string() {
      return this.paramValue
    }
  },
  created: function () {
    console.log('this.paramValue', this.paramValue)
  },
  destroyed() {
  },
  mounted() { },
  methods: {
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        const str = (this.paramInfo.timeFormat0 || '') + '|' + (this.paramInfo.timeFormat1 || '') + '|' + (this.paramInfo.showTime0 || '') + '|' + (this.paramInfo.showTime1 || '')
        this.$emit('update:paramValue', str)
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.config {
  height: fit-content;
  margin-bottom:20px;

}
.configContent{
  width: 100%;
  padding:5px 10px;
  max-height: 300px;
  // background:var(--maincolor4);
  background:#f3f5f9;
  height:fit-content;
  overflow-y: auto;
  .line30{
    .el-form-item--small .el-form-item__content {
      line-height: 30px;;
    }
  }
  .shortInput{
    .el-button{
      width: 130px;
    }
    .linkStatus{
      width: 130px;
    }
    .m-l10{
      margin-left: 10px;
    }
    ::v-deep .el-input{
      flex:1;
    }
  }
}
.popup-result {
  box-sizing: border-box;
  line-height: 24px;
  margin: 25px auto;
  padding: 15px 10px 10px;
  border: 1px solid #ccc;
  position: relative;
}
.popup-result .title {
  position: absolute;
  top: -28px;
  left: 50%;
  width: 140px;
  font-size: 14px;
  margin-left: -70px;
  text-align: center;
  line-height: 30px;
  background: #f3f5f9;
}
.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}
.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}
.popup-result-scroll {
  font-size: 12px;
  line-height: 24px;
  height: 10em;
  overflow-y: auto;
}
</style>
