<!-- 血糖回传-->
<template>
  <div class="bloodGlucoseConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="bloodGlucoseInfo">
      </el-form-item>
    </div>
    <div class="bloodGlucoseConfigContent">
      <el-form ref="form" :model="bloodGlucoseInfo" label-width="140px" :rules="rules">
        <el-form-item label="启用"  label-width="220px" prop="enable" class="line30" >
          <el-switch v-model="bloodGlucoseInfo.enable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="请求地址" v-if="bloodGlucoseInfo.enable=='1'" prop="url" class="shortInput">
          <div class="flex flex-between">
            <el-input v-model="bloodGlucoseInfo.url" placeholder="请输入云签地址" ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="APPID" v-if="bloodGlucoseInfo.enable=='1'" prop="appId" >
          <div class="flex flex-between shortInput">
            <el-input v-model="bloodGlucoseInfo.appId" placeholder="请输入appId"  > </el-input>
          </div>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
import {
  axiosPost
} from '@/api/otherApi'
export default {
  name: 'ParamPaperlessConfig',
  data: function () {
    return {
     // 血糖回传
      bloodGlucoseInfo: {
        enable: '', // 血糖回传开关
        url: '', // 回传地址
        appId: '' // appId
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
          const bloodGlucoseInfo = JSON.parse(JSON.parse(n))
          this.bloodGlucoseInfo = bloodGlucoseInfo

          this.changeValidate(this.bloodGlucoseInfo.enable)
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
        this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('update:paramValue', JSON.stringify(this.bloodGlucoseInfo))
                resolve()
            } else reject()
        })
      })
    },
    /**
     * 测试连接FTP
     */
    testFtp() {
      const query = {
        'ip': this.bloodGlucoseInfo.url, // --ip地址
        'port': Number(this.bloodGlucoseInfo.ftpPort), // --端口号
        'userName': this.bloodGlucoseInfo.ftpUserName, // --FTP用户名
        'userPassword': this.bloodGlucoseInfo.ftpPassWord// --FTP密码
      }
      this.linkIng = true
      clearTimeout(this.loadingTimeout)
      this.refreshLoadText()
      axiosPost('archive/connectFtp', query
      ).then(res => {
        this.linkIng = false
        this.linkStatus = res.msg
        clearTimeout(this.loadingTimeout)
      }).catch(res => {
        this.linkIng = false
        this.linkStatus = res.msg
      })
    },
    /**
     * 刷新连接提示语
     */
    refreshLoadText() {
      if (this.loadingCount > 6) {
        this.loadingCount = 0
        this.loadingText = '连接中.'
      }
      this.loadingCount++
      this.loadingText += '.'
      this.loadingTimeout = setTimeout(() => {
        this.refreshLoadText()
      }, 400)
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
            url: [
              {
                required: true, message: '请输入云签地址', trigger: 'blur'
              }, {
                message: '请输入http(s)://ip:port格式的地址', trigger: 'blur',
                validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入ip 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }
            ],
            appId: [
              {
                required: true, message: '请输入appId', trigger: 'blur'
              }
            ]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bloodGlucoseConfig {
  height: fit-content;
  margin-bottom:20px;

}
.bloodGlucoseConfigContent{
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
