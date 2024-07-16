<!-- 基础参数 标准流式表0108-->
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
      <div v-for="(item, index) in timeList" :key="index">
        <div class="flex align-items-center m-b10">
          <span class="m-r10">累计量重置时间点{{index+1}}</span>
          <wn-time-picker v-model="item.time" value-format="HH:mm:ss"  class="m-r10" placeholder="请选择时间" size="small" :clearable="false">
          </wn-time-picker>
          <el-button class="el-icon-delete " @click="deleteRow(index)" type="danger"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ParamConfig0108',
  data: function () {
    return {
     // 隐私信息加密
      timeList: []
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
            this.timeList = arr.map(item => {
              return { time: item }
            })
          } else {
            // this.timeList = [{ time: '' }]
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
    addRow(index) {
      this.timeList.splice(index + 1, 0, { time: '' })
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
        const str = this.timeList.map(item => item.time).join('|')
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
