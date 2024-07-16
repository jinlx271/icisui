<!-- 基础参数 -->
<template>
  <div class="encryptionConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="encryptionInfo">
      </el-form-item>
    </div>
    <div class="encryptionConfigContent">
      <el-form ref="form" :model="encryptionInfo" label-width="140px" :rules="rules">
        <el-form-item label="启用集团统一患者隐私加密"  label-width="220px" prop="encryptionClock" class="line30" >
          <el-switch v-model="encryptionInfo.encryptionClock" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="加密请求地址" v-if="encryptionInfo.encryptionClock=='1'" prop="responseUrl">
          <el-input v-model="encryptionInfo.responseUrl" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="TOKEN验签" v-if="encryptionInfo.encryptionClock=='1'" prop="token">
          <el-input v-model="encryptionInfo.token" placeholder="请输入" :maxlength="200" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamEncryptionConfig',
  data: function () {
    return {
     // 隐私信息加密
      encryptionInfo: {
        encryptionClock: '', // 加密开关
        responseUrl: '', // 存储api地址
        token: ''
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
          const encryptionInfo = JSON.parse(JSON.parse(n))
          this.encryptionInfo = encryptionInfo
          this.changeValidate(this.encryptionInfo.encryptionClock)
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
  },
  mounted() { },
  methods: {
    /**
     * 数据变更 保存数据
     */
    change() {
      return new Promise((resolve, reject) => {
        this.$refs?.crontab?.submitFill()
        this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('update:paramValue', JSON.stringify(this.encryptionInfo))
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
        this.rules = {
              responseUrl: [
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
            }],
            token: [
              {
                required: true, message: '请输入验签', trigger: 'blur'
              }
            ]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.encryptionConfig {
  height: fit-content;
  margin-bottom:20px;

}
.encryptionConfigContent{
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
