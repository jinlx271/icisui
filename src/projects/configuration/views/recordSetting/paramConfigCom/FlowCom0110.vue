<!-- 基础参数 标准流式表0110-->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent" style="height:500px;">
      <el-button type="primary" @click="addLine()" class="fr m-b10">新增</el-button>
      <div style="height:calc(100% - 40px)">
        <el-table ref="table" border :data="paramValueCopy" row-key="id" height="100%">
          <v-table-column  label="小结计算时间段" align="center" width="360">
            <template slot-scope="scope">
              <div class="flex">
                <el-select v-model="scope.row.rangeLeftCode" placeholder="请选择" style="max-width:50px" :clearable='false'
                  @change="handleChangeRangLeft(scope.row)">
                  <el-option v-for="item in rangeLeftList" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode"></el-option>
                </el-select>
                <wn-time-picker placeholder="请选择开始时间" v-model="scope.row.startTimePickerValue" value-format="HH:mm:ss" prefix-icon="none"
                  format="HH:mm:ss"></wn-time-picker>
                <span style="min-width: 20px;">-</span>
                <wn-time-picker placeholder="请选择结束时间" v-model="scope.row.endTimePickerValue" value-format="HH:mm:ss" prefix-icon="none"
                  format="HH:mm:ss"></wn-time-picker>
                <el-select v-model="scope.row.rangeRightCode" placeholder="请选择" style="max-width:50px" :clearable='false'
                  @change="handleChangeRangRight(scope.row)">
                  <el-option v-for="item in rangeRightList" :key="item.dictCode" :label="item.dictName"
                    :value="item.dictCode"></el-option>
                </el-select>
              </div>
            </template>
          </v-table-column>
          <v-table-column prop="sumaryTime" label="小结时间点" align="center" >
            <template slot-scope="scope">
              <div class="flex">
                <wn-time-picker placeholder="请选择时间" v-model="scope.row.sumaryTime" value-format="HH:mm:ss" prefix-icon="none"
                  format="HH:mm:ss"></wn-time-picker>
              </div>
            </template>
          </v-table-column>
          <v-table-column prop="content" label="小结内容固定内容" align="center">
            <template slot-scope="scope">
              <div class="flex">
                <el-input v-model="scope.row.content" @input="validateContent($event, scope.row)"></el-input>
              </div>
            </template>
          </v-table-column>
          <v-table-column label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="deleteFn(scope.$index)" class="redCss">删除</el-button>
              <el-button size="mini" type="text" @click="addLine(scope.$index)">新增</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>
<script>
import {
  validateIllegalChar
} from './validateIllegalChar.js'
export default {
  name: 'ParamConfig0110',
  data: function () {
    return {
     // 隐私信息加密
      paramValueCopy: [],
      rangeLeftList: [
        {
          dictCode: '[',
          dictName: '['
        },
        {
          dictCode: '(',
          dictName: '('
        }
      ],
      rangeRightList: [
        {
          dictCode: ']',
          dictName: ']'
        },
        {
          dictCode: ')',
          dictName: ')'
        }
      ]
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
            this.paramValueCopy = arr.map(item => {
              const str = item.split(',')
              const obj = {
                rangeLeftCode: '[',
                startTimePickerValue: '',
                endTimePickerValue: '',
                rangeRightCode: ')',
                sumaryTime: '',
                content: ''
              }
              const timeArr = str[0].split('-')
              obj.startTimePickerValue = timeArr[0].substring(1, timeArr[0].length)
              obj.endTimePickerValue = timeArr[1].substring(0, timeArr[0].length - 1)
              obj.rangeLeftCode = str[0].substring(0, 1)
              obj.rangeRightCode = str[0].substring(str[0].length - 1, str[0].length)
              obj.sumaryTime = str[1]
              obj.content = str[2]
              console.log('obj', obj)
              return obj
            })
          } else {
            // this.paramValueCopy = [{
            //   rangeLeftCode: '[',
            //   startTimePickerValue: '',
            //   endTimePickerValue: '',
            //   rangeRightCode: ')',
            //   sumaryTime: '',
            //   content: ''
            // }]
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
    validateContent($event, row) {
      if (this.validateIllegalChar($event, ['|', ',', '[', ']', '(', ')'])) {
        const reg = /\||,|\[|\]|\(|\)/g
        row.content = $event.replaceAll(reg, '')
      }
    },
    addLine(index) {
      if (!index && index !== 0) {
        this.paramValueCopy.unshift({
          rangeLeftCode: '[',
          startTimePickerValue: '',
          endTimePickerValue: '',
          rangeRightCode: ')',
          sumaryTime: '',
          content: ''
        })
      } else {
        this.paramValueCopy.splice(index + 1, 0, {
          rangeLeftCode: '[',
          startTimePickerValue: '',
          endTimePickerValue: '',
          rangeRightCode: ')',
          sumaryTime: '',
          content: ''
        })
      }
    },
    deleteFn(index) {
      console.log('this.timeList', this.timeList)
      this.paramValueCopy.splice(index, 1)
    },
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => !v.startTimePickerValue || !v.endTimePickerValue).length > 0) {
          this.$message.error('请输入正确的时间范围!')
          reject()
          return
        }
         if (this.paramValueCopy.filter(v => !v.sumaryTime).length > 0) {
          this.$message.error('请输入正确的时间范围!')
          reject()
          return
        }
        const valueList = []
        this.paramValueCopy.forEach(item => {
          const rowValue = []
          rowValue.push(item.rangeLeftCode + item.startTimePickerValue + '-' + item.endTimePickerValue + item.rangeRightCode)
          rowValue.push(item.sumaryTime)
          rowValue.push(item.content)
          valueList.push(rowValue.join(','))
        })

        this.$emit('update:paramValue', valueList.join('|'))
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
