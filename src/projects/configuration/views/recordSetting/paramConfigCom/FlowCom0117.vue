<!-- 基础参数 0112 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <!-- NURSERECORD|08:00:00^20:00:00|0|CONCAT(CONVERT(VARCHAR(20),T.RECORD_TIME,120),' ')|20|888 -->
      <el-form ref="form" :model="paramInfo" label-width="12em"  label-position="left">
        <el-form-item label="小结内容输出占位符字段"  class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value0" @input="validateContent($event, ['|','^'], /\||\^/g ,paramInfo, 'value0' )"></el-input>
        </el-form-item>
        <el-form-item label="小结时间点列表" class="line30" >
          <div v-for="(item, index) in timeList" :key="index">
            <div class="flex align-items-center m-b10">
              <wn-time-picker v-model="item.time" value-format="HH:mm:ss"  class="m-r10" placeholder="请选择时间" size="small" :clearable="false">
              </wn-time-picker>
              <el-button class="el-icon-plus" @click="addRow" type="primary"></el-button>
              <el-button class="el-icon-delete" @click="deleteRow(index)" type="danger" v-if="index!=0"></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="输出时间点偏移量"  class="line30" >
          <el-input-number v-model="paramInfo.value2" placeholder="请输入" type="number" style="width:80px" class="m-r10" :clearable="false"  :controls="false" :precision="0"></el-input-number>
        </el-form-item>
        <el-form-item label="动态SQL配置"  class="line30" >
          <el-input placeholder="请输入" v-model="paramInfo.value3"  @input="validateContent($event, ['|','^'], /\||\^/g , paramInfo, 'value3' )" type="textarea" autosize></el-input>
        </el-form-item>
        <el-form-item label="折行字符数"  class="line30" >
          <el-input-number v-model="paramInfo.value4" placeholder="请输入" type="number" style="width:80px" class="m-r10" :clearable="false" :min="1" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="单元格样式"  class="line30" >
          <el-select v-model="paramInfo.value5" clearable filterable>
            <el-option value="777" label="777:上边框加粗效果"></el-option>
            <el-option value="444" label="444:下边框加粗效果"></el-option>
            <el-option value="555" label="555:上下边框都加粗效果"></el-option>
            <el-option value="888" label="888:横向合并单元格效果"></el-option>
          </el-select>
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
  name: 'ParamConfig0117',
  data: function () {
    return {
     // 隐私信息加密
      paramInfo: {
        value0: 'NURSERECORD',
        value1: '',
        value2: '',
        value3: "CONCAT(CONVERT(VARCHAR(20),T.RECORD_TIME,120),' ')",
        value4: '',
        value5: ''
      },
      timeList: [{ time: '' }]

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
            if (this.paramInfo.value3 == '') {
              this.paramInfo.value3 = "CONCAT(CONVERT(VARCHAR(20),T.RECORD_TIME,120),' ')"
            }
            if (this.paramInfo.value0 == '') {
              this.paramInfo.value0 = 'NURSERECORD'
            }
            if (this.paramInfo.value1 != '' && this.paramInfo.value1) {
              if (this.paramInfo.value1.indexOf('^') > -1) {
                const arr = this.paramInfo.value1.split('^')
                this.timeList = arr.map(item => {
                  return { time: item }
                })
              } else {
                this.timeList = [{ time: this.paramInfo.value1 }]
              }
            } else {
              this.timeList = [{ time: '08:00:00' }]
            }
          }
        } catch (error) {
          // this.timeList = [{ time: '08' }]
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
    addRow(index) {
      this.timeList.push({ time: '' })
    },
    deleteRow(index) {
      console.log('this.timeList', this.timeList)
      this.timeList.splice(index, 1)
    },
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        const valueList = []
        this.paramInfo.value1 = this.timeList.map(item => item.time).join('^')
        for (const key in this.paramInfo) {
          valueList.push(this.paramInfo[key])
        }
        const str = valueList.join('|')
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
