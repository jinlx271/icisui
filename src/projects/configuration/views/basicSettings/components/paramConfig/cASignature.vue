<!-- CA签名-->
<template>
  <div class="cASignature">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy">
        <el-select style="width:350px" v-model="paramValueCopy.mode" @change="changeMode" placeholder="请选择">
          <el-option v-for="(item) in selectDict" :key="item.dictId" :label="item.dictName"
            :value="item.dictCode"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <div v-if="paramValueCopy.mode == '4'">
      <el-form ref="form" :model="paramValueCopy" label-width="130px" :rules="rules">
        <el-form-item label="云签地址" prop="url">
          <div class="flex flex-between">
            <el-input v-model="paramValueCopy.url" placeholder="请输入云签地址"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="回调地址" prop="url">
          <div class="flex flex-between">
            <el-input v-model="paramValueCopy.callBackUrl" placeholder="请输入回调地址"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="APPID" prop="appId">
          <div class="flex flex-between">
            <el-input v-model="paramValueCopy.appId" placeholder="请输入APPID"> </el-input>
          </div>
        </el-form-item>
        <el-form-item label="SECRET" prop="secret">
          <div class="flex flex-between">
            <el-input v-model="paramValueCopy.secret" placeholder="请输入SECRET"> </el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CASignature',
  data: function () {
    return {
      paramValueCopy: {
        mode: 0,
        url: '',
        callBackUrl: '',
        appId: '',
        secret: ''
      },
      rules: {}
    }
  },
  props: {
    selectDict: [],
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        this.paramValueCopy = JSON.parse(JSON.parse(n))
        this.changeMode(this.paramValueCopy.mode)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue)
    }
  },
  created: async function () {

  },
  destroyed() {
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.$refs.form) {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
              resolve()
            } else {
              reject()
            }
          })
        } else {
          this.paramValueCopy.url = ''
          this.paramValueCopy.callBackUrl = ''
          this.paramValueCopy.appId = ''
          this.paramValueCopy.secret = ''
          this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
          resolve()
        }
      })
    },
    /**
     * 修改CA模式
     */
    changeMode(e) {
      if (e == '4') {
        this.rules = {
          appId: [
            { required: true, message: '请输入机构编码', trigger: 'blur' }
          ],
          secret: [
            { required: true, message: '请输入机构编码', trigger: 'blur' }
          ],
          url: [
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
          callBackUrl: [
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
            }]
        }
      } else {
        this.rules = {}
      }
    }

  }
}
</script>
