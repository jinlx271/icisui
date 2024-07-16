<!-- 基础参数 -->
<template>
  <div class="syncPassModifyConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramInfo">
      </el-form-item>
    </div>
    <div class="syncPassModifyConfigContent">
      <el-form ref="form" :model="paramInfo" label-width="10em" :rules="rules" align="left">
        <el-form-item label="是否启用" prop="enable" class="line30" >
          <el-switch v-model="paramInfo.enable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
          <el-form-item label="地址" prop="serviceUrl" v-if="paramInfo.enable=='1'&&paramCode==''">
            <el-input v-model="paramInfo.serviceUrl" placeholder="请输入" :maxlength="1000" ></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="url" v-if="paramInfo.enable=='1'&&paramCode=='XTCS0150'">
            <el-input v-model="paramInfo.url" placeholder="请输入" :maxlength="1000" ></el-input>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamConfig129',
  data: function () {
    return {
     // 隐私信息加密
      paramInfo: {
        enable: '', // 加密开关
        url: '', // 存储api地址
        key: '',
        scene: ''
      },
      rules: {},
      scene: [],
      ICIS_DICT_GPT_SCENE: [] // 场景字典
    }
  },
  props: {
    paramValue: {},
    paramCode: {
      type: String,
      default: ''
    }
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramInfo = JSON.parse(JSON.parse(n))
          this.paramInfo = paramInfo
          this.changeValidate(this.paramInfo.enable)
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
    const { ICIS_DICT_GPT_SCENE } = await this.$batchGetDictItemList(['ICIS_DICT_GPT_SCENE'])
    this.ICIS_DICT_GPT_SCENE = ICIS_DICT_GPT_SCENE || []
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
        this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('update:paramValue', JSON.stringify(this.paramInfo))
                resolve()
            } else reject()
        })
      })
    },
    /**
     * 切换开关 规则变化
     */
    changeValidate(e) {
      if (e == '0') {
        this.rules = {

        }
      } else {
        if (this.paramCode == 'XTCS0150') {
          this.rules = {
            url: [
              {
                required: true, message: '请输入http://ip:port 格式的地址', trigger: 'blur'
              }, {
              message: '请输入http://ip:port 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入http://ip:port 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }]
          }
        } else {
          this.rules = {
            serviceUrl: [
              {
                required: true, message: '请输入http://ip:port 格式的地址', trigger: 'blur'
              }, {
              message: '请输入http://ip:port 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入http://ip:port 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }]
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.syncPassModifyConfig {
  height: fit-content;
  margin-bottom:20px;

}
.syncPassModifyConfigContent{
  padding:5px 10px;
  // background:var(--maincolor4);
  background:#f3f5f9;
  max-height: 300px;
  height:fit-content;
  overflow-y: auto;
  margin-left: 130px;
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
