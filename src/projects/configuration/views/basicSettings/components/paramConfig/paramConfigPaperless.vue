<!-- 基础参数 -->
<template>
  <div class="paperLessConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paperLessInfo">
      </el-form-item>
    </div>
    <div class="paperLessConfigContent">
      <el-form ref="form" :model="paperLessInfo" label-width="140px" :rules="rules">
        <el-form-item label="是否开启集团无纸化病案接口"  label-width="220px" prop="paperLessClock" class="line30" >
          <el-switch v-model="paperLessInfo.paperLessClock" active-value="1" inactive-value="0" @change="changeValidate"></el-switch>
        </el-form-item>
        <el-form-item label="存储接口地址" v-if="paperLessInfo.paperLessClock=='1'" prop="storageApiUrl">
          <el-input v-model="paperLessInfo.storageApiUrl" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="控制接口地址" v-if="paperLessInfo.paperLessClock=='1'" prop="controlApiUrl">
          <el-input v-model="paperLessInfo.controlApiUrl" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="撤销申请网页地址" v-if="paperLessInfo.paperLessClock=='1'" prop="cancelApplyUrl">
          <el-input v-model="paperLessInfo.cancelApplyUrl" placeholder="请输入" :maxlength="200" ></el-input>
        </el-form-item>
        <el-form-item label="FTP服务器地址" v-if="paperLessInfo.paperLessClock=='1'" prop="ftpServerUrl" class="shortInput">
          <div class="flex flex-between">
            <el-input v-model="paperLessInfo.ftpServerUrl" placeholder="请输入" :maxlength="200" ></el-input>
            <el-button @click="testFtp" type="primary" class="m-l10" :disabled="linkIng">FTP测试</el-button>
          </div>
        </el-form-item>
        <el-form-item label="FTP服务器端口号" v-if="paperLessInfo.paperLessClock=='1'" prop="ftpPort" >

          <div class="flex flex-between shortInput">
            <el-input v-model="paperLessInfo.ftpPort" placeholder="请输入" :maxlength="6" v-only-num :digit="0"> </el-input>
            <div v-loading="linkIng" element-loading-spinner="none"  :element-loading-text="loadingText" class="linkStatus m-l10">{{linkStatus}}</div>
          </div>
        </el-form-item>
        <el-form-item label="FTP服务器用户名" v-if="paperLessInfo.paperLessClock=='1'" prop="ftpUserName">
          <el-input v-model="paperLessInfo.ftpUserName" placeholder="请输入" :maxlength="100" ></el-input>
        </el-form-item>
        <el-form-item label="FTP服务器密码" v-if="paperLessInfo.paperLessClock=='1'" prop="ftpPassWord">
          <el-input v-model="paperLessInfo.ftpPassWord" placeholder="请输入" type="password" :maxlength="100" ></el-input>
        </el-form-item>
        <el-form-item label="重传频率" prop="frequency" v-if="paperLessInfo.paperLessClock=='1'">
          <!-- <div class="popup-result">
            <p class="title">时间表达式</p>
            <table>
              <thead>
                <th v-for="item of tabTitles" width="40" :key="item">{{item}}</th>
                <th>Cron 表达式</th>
              </thead>
              <tbody>
                <td>
                  <el-input v-model="crontabValueObj.second" @input="changeFrequency($event, 'second', 0,59,'* , - /')"  ></el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.min" @input="changeFrequency($event, 'min', 0,59,'* , - /')" ></el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.hour" @input="changeFrequency($event, 'hour', 0,23,'* , - /')"></el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.day" @input="changeFrequency($event, 'day', 1,31,'* , - / ? L W')" ></el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.month" @input="changeFrequency($event, 'month', 1,12,'* , - /')" > </el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.week" @input="changeFrequency($event, 'week', 1,7,'* , - / ? L #')" ></el-input>
                </td>
                <td>
                  <el-input v-model="crontabValueObj.year" @input="changeFrequency($event, 'year', year,2099,'* , - /')"></el-input>
                </td>
                <td>
                  <span>{{paperLessInfo.frequency}}</span>
                </td>
              </tbody>
            </table>
          </div> -->
          <Crontab  ref="crontab" @fill="(v)=>{paperLessInfo.frequency=v}" :expression="paperLessInfo.frequency" hideComponent="result"></Crontab>
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
  components: { Crontab },
  data: function () {
    return {
     // 无纸化办公
      paperLessInfo: {
        paperLessClock: '', // 无纸化开关
        storageApiUrl: '', // 存储api地址
        controlApiUrl: '', // 控制api地址
        cancelApplyUrl: '', // 撤销地址
        ftpServerUrl: '', // ftp服务地址
        ftpPort: '', // ftp端口地址
        ftpUserName: '', // ftp用户名
        ftpPassWord: '', // ftp密码
        frequency: '* * * * * ? *'
      },
      linkStatus: '测试结果',
      linkIng: false,
      loadingText: '连接中.',
      loadingCount: 0,
      loadingTimeout: -1,
      tabTitles: ['秒', '分钟', '小时', '日', '月', '周', '年'],
      //  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      rules: {

      },
      crontabValueObj: {
        second: '*',
        min: '*',
        hour: '*',
        day: '*',
        month: '*',
        week: '?',
        year: ''
      },
      year: this.$dayjs().format('YYYY')

    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paperLessInfo = JSON.parse(JSON.parse(n))
          this.paperLessInfo = paperLessInfo
          var valueArr = this.paperLessInfo.frequency.split(' ')
          let index = 0
          for (const key in this.crontabValueObj) {
            this.crontabValueObj[key] = valueArr[index]
            index++
          }
          this.changeValidate(this.paperLessInfo.paperLessClock)
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
                this.$emit('update:paramValue', JSON.stringify(this.paperLessInfo))
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
        'ip': this.paperLessInfo.ftpServerUrl, // --ip地址
        'port': Number(this.paperLessInfo.ftpPort), // --端口号
        'userName': this.paperLessInfo.ftpUserName, // --FTP用户名
        'userPassword': this.paperLessInfo.ftpPassWord// --FTP密码
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
          // frequency: [
          //     {
          //       required: true, message: '请输入重传频率如0 30 0 ? * *', trigger: 'blur'
          //     }
          //   ]
        }
      } else {
        this.rules = {
              storageApiUrl: [
              {
                required: true, message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur'
              }, {
              message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入http(s)://ip:port 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }],
            controlApiUrl: [
              {
                required: true, message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur'
              }, {
              message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入http(s)://ip:port 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }
            ],
            cancelApplyUrl: [
              {
                required: true, message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur'
              }, {
              message: '请输入http(s)://ip:port 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=..<>]+$/
                    if (!reg.exec(value)) {
                      callback(new Error('请输入http(s)://ip:port 格式的地址'))
                    } else {
                      callback()
                    }
                  } else {
                    callback()
                  }
                }
            }
            ],
            ftpServerUrl: [
              {
                required: true, message: '请输入ip格式的地址', trigger: 'blur'
              }, {
              message: '请输入ip 格式的地址', trigger: 'blur',
              validator: (rule, value, callback) => {
                  if (value !== '' && value != undefined) {
                    const reg = /^[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.<>]+$/
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
            ftpPort: [
              {
                required: true, message: '请输入端口号', trigger: 'blur'
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
               required: true, message: '请输入ftp用户名', trigger: 'blur'
            }],
            ftpPassWord: [{
               required: true, message: '请输入ftp密码', trigger: 'blur'
            }],
            frequency: [
              {
                required: true, message: '请输入重传频率如0 30 0 ? * *', trigger: 'blur'
              }
            ]
        }
      }
    },
    /**
     * 切换频率设置
     * e 当前值
     * key 当前切换属性
     * min 控制的最小变量
     * max 最大变量
     * str 特殊字符
     */
    changeFrequency(e, key, min, max, str) {
      const arr = str.split(' ')
      let regStr = ''
      for (var index = 0; index < arr.length; index++) {
        regStr += '\\' + arr[index]
      }
      const res = new RegExp(regStr, 'g')
      if (!res.test(e)) {
        this.$message('请输入' + min + '~' + max)
      } else {
        this.crontabValueObj[key] = e
        const valueArr = []
        for (const key in this.crontabValueObj) {
          valueArr.push(this.crontabValueObj[key])
        }
        this.paperLessInfo.frequency = valueArr.join(' ')
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
