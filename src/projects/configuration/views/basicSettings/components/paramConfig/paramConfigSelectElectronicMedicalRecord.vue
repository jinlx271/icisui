<!-- 基础参数 -->
<template>
  <div class="paramConfigSelectElectronicMedicalRecord">
    <div>
      <el-form-item label="参数值" prop="paramValueCopy">
      </el-form-item>
      <div class="flex-1" style="padding-left: 100px">
        <el-form :label-position="'right'" label-width="10em" :rules="rules" :model="paramValueCopy">
          <el-form-item label="接口方式" prop="method">
            <el-select filterable v-model="paramValueCopy.method" placeholder="请选择" :value-key="'value'" style="width:calc(100% - 20px)">
              <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据服务IP" prop="ip" style="letter-spacing: -1px;">
            <el-input v-model="paramValueCopy.ip" placeholder="请输入" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="数据服务端口" prop="port">
            <el-input v-model="paramValueCopy.port" placeholder="请输入" :maxlength="20"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamConfigSelectElectronicMedicalRecord',
  components: {},
  data: function () {
    return {
      option: [
        { value: '1', label: '集团CIS5.6数据服务接口' }
      ],
      paramValueCopy: {},
      rules: {
        method: {
          required: true, message: '请输入ip地址', trigger: 'blur'
        },
        ip: [
          {
            required: true, message: '请输入ip地址', trigger: 'blur'
          }, {
            message: '请输入ip格式的地址', trigger: 'blur',
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
        port: [
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
        ]
      }
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        this.paramValueCopy = JSON.parse(JSON.parse(n))
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
  created() { },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
