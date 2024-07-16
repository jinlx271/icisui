<!-- 基础参数 0111 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <el-form ref="form" :model="paramInfo" label-width="8em"  label-position="left">
        <el-form-item label="固定文字占位符" prop="value0" class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value0" ></el-input>
        </el-form-item>
        <el-form-item label="总入量占位符" prop="value1" class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value1" ></el-input>
        </el-form-item>
        <el-form-item label="总出量占位符" prop="value2" class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value2" ></el-input>
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
  name: 'ParamConfig0111',
  data: function () {
    return {
     // 隐私信息加密
      paramInfo: {
        value0: '',
        value1: '',
        value2: ''
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
            arr.forEach((item, index) => {
              this.paramInfo['value' + index] = item
            })
          }
        } catch (error) {
          console.log('error', error)
        }
      },
      immediate: true,
      deep: true
    },
    'paramInfo.value0': function(newValue, oldValue) {
      if (validateIllegalChar(newValue, ['|', ','])) {
        this.paramInfo.value0 = oldValue
      }
    },
    'paramInfo.value1': function(newValue, oldValue) {
      if (validateIllegalChar(newValue, ['|', ','])) {
        this.paramInfo.value1 = oldValue
      }
    },
    'paramInfo.value2': function(newValue, oldValue) {
      if (validateIllegalChar(newValue, ['|', ','])) {
        this.paramInfo.value2 = oldValue
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
        const str = (this.paramInfo.value0 || '') + '|' + (this.paramInfo.value1 || '') + '|' + (this.paramInfo.value2 || '')
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
