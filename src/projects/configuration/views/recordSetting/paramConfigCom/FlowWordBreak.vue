<!-- 基础参数 标准流式表折行公用组件-->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <div class="w100" >
        <el-button class="m-r10" @click="addRow(0)" type="primary" style="color:#fff;position:relative; left:0px;">新增</el-button>
      </div>
      <div v-for="(item, index) in dataList" :key="index">
        <div class="flex align-items-center m-b10">
          <span class="m-r10">折行字段{{index+1}}</span>
          <el-input v-model="item.code" placeholder="请输入折行字段" style="width:180px" class="m-r10" @input="validateContent($event, item )"></el-input>
          <span class="m-r10">折行字数{{index+1}}</span>
          <el-input-number v-model="item.wordCount" placeholder="请输入折行字数" type="number" style="width:80px" class="m-r10" :clearable="false" :min="1" :controls="false"></el-input-number>
          <el-button class="el-icon-delete " @click="deleteRow(index)" type="danger"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  validateIllegalChar
} from './validateIllegalChar.js'
export default {
  name: 'ParamConfig0108',
  data: function () {
    return {
     // 隐私信息加密
      dataList: []
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
            const arr = paramInfo.split(',')
            this.dataList = arr.map(item => {
              const valueArr = item.split('|')
              return { code: valueArr[0], wordCount: valueArr[1] }
            })
          } else {
            // this.dataList = [{ code: '', wordCount: 0 }]
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
      if (this.validateIllegalChar($event, ['|', ','])) {
        const reg = /\||,/g
        row.code = $event.replaceAll(reg, '')
      }
    },
    addRow(index) {
      this.dataList.splice(index + 1, 0, { code: '', wordCount: 0 })
    },
    deleteRow(index) {
      this.dataList.splice(index, 1)
    },
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        if (this.dataList.length > 0 && this.dataList.filter(v => !v.code || !v.wordCount).length > 0) {
          this.$message.error('请输入折行字段/折行字数!')
          reject()
          return
        }
        let str = ''
        if (this.dataList.length > 0) {
          str = this.dataList.map(item => item.code + '|' + item.wordCount).join(',')
        }

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
  min-height:80px;
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
