<!-- 基础参数 -->
<template>
  <div class="paperLessConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="viewForm">
      </el-form-item>
    </div>
    <div class="paperLessConfigContent">
      <el-form ref="form" :model="viewForm" label-width="140px" :rules="rules">
        <el-form-item label="是否开启PDF上传到FTP地址配置"  label-width="220px" prop="enable" class="line30" >
          <el-switch v-model="viewForm.enable" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="FTP服务器地址" v-if="viewForm.enable=='1'" prop="ftpServerUrl" class="shortInput">
          <div class="flex flex-between">
            <el-input v-model="viewForm.ftpServerUrl" placeholder="请输入" :maxlength="200" ></el-input>
            <el-button @click="testFtp" type="primary" class="m-l10" :disabled="linkIng">FTP测试</el-button>
          </div>
        </el-form-item>
        <el-form-item label="FTP服务器端口号" v-if="viewForm.enable=='1'" prop="ftpPort" >
          <div class="flex flex-between shortInput">
            <el-input v-model="viewForm.ftpPort" placeholder="请输入" :maxlength="6" v-only-num :digit="0"> </el-input>
            <div v-loading="linkIng" element-loading-spinner="none"  :element-loading-text="loadingText" class="linkStatus m-l10">{{linkStatus}}</div>
          </div>
        </el-form-item>
        <el-form-item label="FTP服务器用户名" v-if="viewForm.enable=='1'" prop="ftpUserName">
          <el-input v-model="viewForm.ftpUserName" placeholder="请输入" :maxlength="100" ></el-input>
        </el-form-item>
        <el-form-item label="FTP服务器密码" v-if="viewForm.enable=='1'" prop="ftpPassWord">
          <el-input v-model="viewForm.ftpPassWord" type="password" placeholder="请输入" :maxlength="10" ></el-input>
        </el-form-item>
        <el-form-item label="重传频率" prop="corn" v-if="viewForm.enable=='1'">
          <!-- this.$refs?.crontab?.submitFill() 触发值修改 -->
          <Crontab  ref="crontab" @fill="(v)=>{viewForm.corn=v}" :expression="viewForm.corn" hideComponent="result"></Crontab>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import Crontab from '@/components/Crontab'
import {
  axiosPost
} from '@/api/otherApi'
export default {
  name: 'ParamPaperlessConfig',
  data: function () {
    return {
     // 无纸化办公
      viewForm: {
        enable: '', // 无纸化开关
        ftpServerUrl: '', // ftp服务地址
        ftpPort: '', // ftp端口地址
        ftpUserName: '', // ftp用户名
        ftpPassWord: '', // ftp密码
        corn: ''// 定时任务corn表达式
      },
      linkStatus: '测试结果',
      linkIng: false,
      loadingText: '连接中.',
      loadingCount: 0,
      loadingTimeout: -1,
      rules: {

      }

    }
  },
  components: { Crontab },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const viewForm = JSON.parse(JSON.parse(n))
          this.viewForm = viewForm
          this.changeValidate(this.viewForm.enable)
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
        this.$refs?.crontab?.submitFill()
        this.$refs.form.validate(valid => {
            if (valid) {
                this.$emit('update:paramValue', JSON.stringify(this.viewForm))
                resolve()
            } else reject()
        })
      })
    },
    /**
     * 测试连接FTP
     */
    testFtp() {
      this.$refs.form.validate(valid => {
          if (valid) {
              const query = {
                'ip': this.viewForm.ftpServerUrl, // --ip地址
                'port': Number(this.viewForm.ftpPort), // --端口号
                'userName': this.viewForm.ftpUserName, // --FTP用户名
                'userPassword': this.viewForm.ftpPassWord// --FTP密码
              }
              this.linkIng = true
              clearTimeout(this.loadingTimeout)
              this.refreshLoadText()
              axiosPost('archive/connectFtp', query
              ).then(res => {
                this.linkIng = false
                this.linkStatus = res?.message || res?.msg
                clearTimeout(this.loadingTimeout)
              }).catch(res => {
                this.linkIng = false
                this.linkStatus = res.msg
                clearTimeout(this.loadingTimeout)
              })
          }
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
          // frequency: [
          //     {
          //       required: true, message: '请输入重传频率如0 30 0 ? * *', trigger: 'blur'
          //     }
          //   ]
        }
      } else {
        this.rules = {
            ftpServerUrl: [
              {
                required: true, message: '请输入ip地址', trigger: 'blur'
              }, {
              message: '请输入ip地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('ip地址输入错误'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }
            ],
            ftpPort: [
              {
                required: true, message: '请输入port', trigger: 'blur'
              }, {
              message: '请输入由数字组成的port', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^((6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])|[0-5]?\d{0,4})$/g
                    if (!reg.exec(value)) {
                      callback(new Error('请输入由数字组成的port'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
              }
            ],
            ftpUserName: [{
               required: true, message: '请输入username', trigger: 'blur'
            }],
            ftpPassWord: [{
               required: true, message: '请输入password', trigger: 'blur'
            }]
        }
      }
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
