<!-- 基础参数 -->
<template>
  <div class="paperLessConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="autoFileInfo">
      </el-form-item>
    </div>
    <div class="paperLessConfigContent">
      <el-tabs type="border-card"  v-model="activeName" :before-leave="beforeClick" @tab-click="tabClick">
        <el-tab-pane label="出区归档模式" name="outArea">
          <el-form ref="outArea" :model="autoFileInfo" label-width="140px" :rules="rules" label-position="left">
            <el-form-item label="是否启用自动归档:"  prop="outAreaEnable" class="line30" >
              <el-switch v-model="autoFileInfo.outAreaEnable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
            </el-form-item>
            <div class="flex">
            <el-form-item label="执行时间:" v-if="autoFileInfo.outAreaEnable==1" prop="outAreaInterval">
                <span>出区后第<el-input v-model="autoFileInfo.outAreaInterval" placeholder="请输入" :maxlength="2" style="width:80px;margin:0px 5px;" :clearable="false" type="number" ></el-input>天</span>
            </el-form-item>
            <el-form-item label="" v-if="autoFileInfo.outAreaEnable==1" prop="outAreaExecuteTime" label-width="0px" style="margin-left:50px;">
                <wn-time-picker  v-model="autoFileInfo.outAreaExecuteTime" placeholder="请选择时间" type="time" style="width:120px; " value-format="HH:mm:ss"></wn-time-picker>
            </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="全班次归档模式" name="class">
          <el-form ref="class" :model="autoFileInfo" label-width="140px" :rules="rules" label-position="left">
            <el-form-item label="是否启用自动归档:"   prop="classEnable" class="line30" >
              <el-switch v-model="autoFileInfo.classEnable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
            </el-form-item>
            <div class="flex">
            <el-form-item label="执行时间:" v-if="autoFileInfo.classEnable==1" prop="classInterval">
                <span>班次结束后第<el-input v-model="autoFileInfo.classInterval" placeholder="请输入" :maxlength="2" style="width:80px;margin:0px 5px; " :clearable="false" type="number" ></el-input>天</span>
            </el-form-item>
            <el-form-item label="" v-if="autoFileInfo.classEnable==1" prop="classExecuteTime" label-width="0px" style="margin-left:50px;">
                <wn-time-picker  v-model="autoFileInfo.classExecuteTime" placeholder="请选择时间" type="time" style="width:120px; " value-format="HH:mm:ss"></wn-time-picker>
            </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamPaperlessConfig',
  data: function () {
    return {
     // 无纸化办公
      autoFileInfo: {
        'classEnable': '0',
        'classExecuteTime': '',
        'classInterval': null,
        'outAreaEnable': '0',
        'outAreaExecuteTime': '',
        'outAreaInterval': null
      },
      rules: {},
      activeName: 'outArea'
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const autoFileInfo = JSON.parse(JSON.parse(n))
          this.autoFileInfo = autoFileInfo
          this.changeValidate(this.autoFileInfo.outAreaEnable)
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue) || '[]'
    }
  },
  created: async function () {

  },
  destroyed() {
    clearTimeout(this.loadingTimeout)
  },
  mounted() { },
  methods: {
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        this.$refs[this.activeName]?.validate(valid => {
            if (!valid) {
              reject()
            } else {
              this.$emit('update:paramValue', JSON.stringify(this.autoFileInfo))
              resolve()
            }
        })
      })
    },
    /**
     * 切换开关 规则变化
     */
    changeValidate(e) {
      if (this.autoFileInfo.outAreaEnable == 0) {
        this.autoFileInfo.outAreaExecuteTime = ''
        this.autoFileInfo.outAreaInterval = 0
        this.rules.outAreaExecuteTime = [{}]
        this.rules.outAreaInterval = [{}]
      } else {
        this.rules.outAreaExecuteTime = [{ required: true, trigger: 'blur', message: '请输入执行时间' }]
        this.rules.outAreaInterval = [{ required: true, trigger: 'blur', message: '请输入执行时间' }]
      }
      if (this.autoFileInfo.classEnable == 0) {
        this.autoFileInfo.classExecuteTime = ''
        this.autoFileInfo.classInterval = 0
        this.rules.classExecuteTime = [{}]
        this.rules.classInterval = [{}]
      } else {
        this.rules.classExecuteTime = [{ required: true, trigger: 'blur', message: '请输入执行时间' }]
        this.rules.classInterval = [{ required: true, trigger: 'blur', message: '请输入执行时间' }]
      }
    },
    /**
     * 跳转前校验
     */
    beforeClick(activeName, oldActiveName) {
      return new Promise((resolve, reject) => {
        this.$refs[oldActiveName]?.validate(valid => {
            if (!valid) {
              reject()
            } else resolve()
        })
      })
    },
    /**
     * 切换标签
     */
    tabClick() {
      this.changeValidate()
    }

  }
}
</script>
<style lang="scss" scoped>
.paperLessConfig {
  height: fit-content;
  margin-bottom:20px;

}
.paperLessConfigContent{
  padding:5px 10px;
  // background:var(--maincolor4);
  background:#f3f5f9;
  max-height: 300px;
  height:fit-content;
  overflow-y: auto;

  ::v-deep .el-input > .el-input__inner{

    border:1px solid #ddd;
    background:#fff;
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
