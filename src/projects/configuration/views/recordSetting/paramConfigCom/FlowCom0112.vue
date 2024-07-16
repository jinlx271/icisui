<!-- 基础参数 0112 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <el-form ref="form" :model="paramInfo" label-width="12em"  label-position="left">
        <el-form-item label="小结内容输出字段"  class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value0" @input="validateContent($event, ['|','^'], /\||\^/g ,paramInfo, 'value0' )"></el-input>
        </el-form-item>
        <el-form-item label="小结内容折行字数" class="line30" >
          <el-input-number v-model="paramInfo.value1" placeholder="请输入" type="number" style="width:80px" class="m-r10" :clearable="false" :min="1" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="汇总层默认配置"  class="line30" >
          <el-switch v-model="paramInfo.value2" active-value="1" inactive-value="0"
                  active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="出入量分类需要输出"  class="line30" >
          <el-switch v-model="paramInfo.value3" active-value="1" inactive-value="0"
              active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="出入量监护项输出配置"  class="line30" >
          <div class="flex flex-ver">
            <div class="flex align-items-center m-b10">
              <span class="longSpan">是否输出</span>
              <el-switch v-model="moniitemValue.value0" active-value="1" inactive-value="0" @change="moniitemValueChange"
                  active-text="是" inactive-text="否"></el-switch>
            </div>
            <div class="flex align-items-center m-b10">
              <span class="longSpan">监护项和值之间连接符</span>
              <el-input placeholder="请输入" v-model="moniitemValue.value1" @change="moniitemValueChange" @input="validateContent($event, ['|','^'], /\||\^/g , moniitemValue, 'value1' )"></el-input>
            </div>
            <div class="flex align-items-center m-b10">
              <span class="longSpan">不同监护项之间连接符</span>
              <el-input placeholder="请输入" v-model="moniitemValue.value2" @change="moniitemValueChange" @input="validateContent($event, ['|','^'], /\||\^/g , moniitemValue, 'value2' )"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="出入量详情输出配置"  class="line30" >
          <div class="flex flex-ver">
            <div class="flex align-items-center  m-b10">
              <span class="longSpan">是否输出</span>
              <el-switch v-model="detailValue.value0" active-value="1" inactive-value="0" @change="detailValueChange"
                  active-text="是" inactive-text="否"></el-switch>
            </div>
            <div class="flex align-items-center  m-b10">
              <span class="longSpan">详情项和值之间连接符</span>
              <el-input placeholder="请输入" v-model="detailValue.value1" @change="detailValueChange" @input="validateContent($event, ['|','^'],  /\||\^/g ,detailValue, 'value1' )"></el-input>
            </div>
            <div class="flex align-items-center  m-b10">
              <span class="longSpan">不同详情项之间连接符</span>
              <el-input placeholder="请输入" v-model="detailValue.value2" @change="detailValueChange" @input="validateContent($event, ['|','^'],  /\||\^/g ,detailValue, 'value2' )"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="单元格样式"  class="line30" >
          <el-select v-model="paramInfo.value6"  clearable filterable>
            <el-option value="777" label="777:上边框加粗效果"></el-option>
            <el-option value="444" label="444:下边框加粗效果"></el-option>
            <el-option value="555" label="555:上下边框都加粗效果"></el-option>
            <el-option value="888" label="888:横向合并单元格效果"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输出模板内容"  class="line30" >
          <el-input v-model="paramInfo.value7" @input="validateContent($event, ['|'],  /\|/g , paramInfo, 'value7' )"></el-input>
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
  name: 'ParamConfig0112',
  data: function () {
    return {
     // 隐私信息加密
      paramInfo: {
        value0: '',
        value1: '',
        value2: '1',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: ''
      },
      moniitemValue: {
        value0: '',
        value1: '',
        value2: ''
      },
      detailValue: {
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
              if (!this.paramInfo.value2) this.paramInfo.value2 = '1'
            })
            if (this.paramInfo.value4 != '' && this.paramInfo.value4) {
              const moniitemInfo = this.paramInfo.value4.split('^')
              moniitemInfo.forEach((item, index) => {
                this.moniitemValue['value' + index] = item
              })
            }
            if (this.paramInfo.value5 != '' && this.paramInfo.value5) {
              const detailValue = this.paramInfo.value5.split('^')
              detailValue.forEach((item, index) => {
                this.detailValue['value' + index] = item
              })
            }
          }
        } catch (error) {
          console.log('error', error)
        }
      },
      immediate: true,
      deep: true
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
    validateIllegalChar,
    validateContent($event, chars, reg, row, key) {
      if (this.validateIllegalChar($event, chars)) {
        row[key] = $event.replaceAll(reg, '')
      }
    },
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        const valueList = []
        for (const key in this.paramInfo) {
          valueList.push(this.paramInfo[key])
        }
        const str = valueList.join('|')
        this.$emit('update:paramValue', str)
        resolve()
      })
    },
    moniitemValueChange() {
      const valueList = []
      for (const key in this.moniitemValue) {
          valueList.push(this.moniitemValue[key])
        }
      this.paramInfo.value4 = valueList.join('^')
    },
    detailValueChange() {
      const valueList = []
      for (const key in this.detailValue) {
          valueList.push(this.detailValue[key])
        }
      this.paramInfo.value5 = valueList.join('^')
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
  .longSpan{
    width:200px;
  }
  .longLine{

  }
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
