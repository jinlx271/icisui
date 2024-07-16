<!-- 基础参数 0107 标准流式表 -->
<template>
  <div class="config flex">
    <div class="flex flex-between ">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="configContent">
      <el-form ref="form" :model="paramInfo" label-width="12em"  label-position="left">
        <el-form-item label="不满一小时特殊规则" prop="value0" class="line30" >
          <el-select placeholder="请选择" v-model="paramInfo.value0">
            <el-option value="1" label="1:不满一小时取0.5小时"></el-option>
            <el-option value="2" label="2:不满一小时取1小时"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算小时数保留位数" prop="value1" class="line30" >
          <el-input-number v-model="paramInfo.value1" placeholder="请输入" type="number" style="width:80px" class="m-r10" :clearable="false" :min="0" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="计算小时数舍入规则" prop="value2" class="line30" >
          <el-select placeholder="请选择" v-model="paramInfo.value2" >
            <el-option value="1" label="1:向下取"></el-option>
            <el-option value="2" label="2:四舍五入"></el-option>
            <el-option value="3" label="3:向上取">3:向上取</el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamConfig0107',
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
            this.paramInfo.value0 = arr[0] || ''
            this.paramInfo.value1 = arr[1] || ''
            this.paramInfo.value2 = arr[2] || ''
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
