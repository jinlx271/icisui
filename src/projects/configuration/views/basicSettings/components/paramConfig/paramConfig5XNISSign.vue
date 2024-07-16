<!-- 基础参数 -->
<template>
  <div class="param-config-contaier">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy">
      </el-form-item>
    </div>
    <div class="param-config-content">
      <el-form ref="form" :model="paramValueCopy" label-width="10em" :rules="rules" align="left">
        <el-form-item label="是否启用" prop="enable" class="line30">
          <el-switch v-model="paramValueCopy.enable" active-value="1" inactive-value="0"
            @change="changeValidate"></el-switch>
        </el-form-item>
        <template v-if="paramValueCopy.enable == '1'">
          <el-form-item label="接口地址" prop="serviceUrl">
            <el-input v-model="paramValueCopy.serviceUrl" placeholder="请输入http://ip:port" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="同步频率" prop="corn">
            <el-input v-model="paramValueCopy.corn" placeholder="请输入" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="限定时间点" prop="limitTimes">
            <el-input v-model="paramValueCopy.limitTimes" placeholder="如：02:00:00,06:00:00,10:00:00"
              :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="重置出入量时间点" prop="resetTime">
            <el-input v-model="paramValueCopy.resetTime" placeholder="如：02:00:00,06:00:00,10:00:00"
              :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="首次是否同步所有" prop="syncPolicy">
            <el-switch v-model="paramValueCopy.syncPolicy" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="排除监护项" prop="excludeCodes">
            <el-select filterable clearable multiple v-model="excludeCodes" placeholder="请选择"
              :filter-method="(val) => filterMethod(excludeCodes, val)" :value-key="'moniitemCode'" style="width:100%" @focus="() => selectFocusFc(excludeCodes)" @change="handleChangeExcludeCodes(excludeCodes)">
              <el-option v-for="item in moniitemDictList" :key="item.moniitemCode" :label="item.moniitemName"
                :value="item.moniitemCode" :forceHide="item.statusDict != 1">{{ item.moniitemName + '(' +
                  item.moniitemCode + ')' }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="血压取值规则" prop="xySetRule">
            <el-select filterable clearable v-model="paramValueCopy.xySetRule" placeholder="请选择" :value-key="'value'"
              style="width:calc(100% - 20px)">
              <el-option v-for="item in xySetRuleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="呼吸频率取值规则" prop="hxplSetRule">
            <el-select filterable clearable v-model="paramValueCopy.hxplSetRule" placeholder="请选择" :value-key="'value'"
              style="width:calc(100% - 20px)">
              <el-option v-for="item in hxplSetRuleList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  moniitem_multipleListPage // 监护数据
} from '@/api/configuration'
export default {
  name: 'ParamConfig5XNISSign',
  data: function () {
    return {
      paramValueCopy: {
        enable: '', // 加密开关
        serviceUrl: '', // 存储api地址
        corn: '0 0/5 * * * ?',
        limitTimes: '',
        resetTime: '',
        syncPolicy: '',
        excludeCodes: '',
        xySetRule: '',
        hxplSetRule: ''
      },
      excludeCodes: [],
      xySetRuleList: [
        {
          label: '取有创血压',
          value: '1'
        },
        {
          label: '取无创血压',
          value: '2'
        },
        {
          label: '优先取有创血压其次无创',
          value: '3'
        },
        {
          label: '优先取无创血压其次有创',
          value: '4'
        }
      ],
      hxplSetRuleList: [
        {
          label: '取监测呼吸',
          value: '1'
        },
        {
          label: '取辅助呼吸',
          value: '2'
        },
        {
          label: '优先取监测呼吸其次辅助',
          value: '3'
        },
        {
          label: '优先取辅助呼吸其次监测',
          value: '4'
        }
      ],
      moniitemDictList: []
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          const paramValueCopy = JSON.parse(JSON.parse(n))
          if (!paramValueCopy.resetTime) {
            paramValueCopy['resetTime'] = ''
          }
          this.paramValueCopy = paramValueCopy
          this.changeValidate(this.paramValueCopy.enable)
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
    this.excludeCodes = this.paramValueCopy?.excludeCodes ? this.paramValueCopy.excludeCodes.split(',') : []
    this.multipleListPageFc(this.excludeCodes)
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
            this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
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
            }
          ]
        }
      }
    },
    /**
     * 下拉框搜索方法
     */
    filterMethod(list, val) {
      const code = []
      list.map(i => {
        code.push(i)
      })
      // 获取监护数据
      this.multipleListPageFc(code.length > 0 ? code : [], val)
    },
    /**
     * 下拉框选择的时候
     */
    selectFocusFc(list) {
      const code = []
      list.map(i => {
        code.push(i)
      })
      // 获取监护数据
      this.multipleListPageFc(code.length > 0 ? code : [])
    },
    /**
     * 获取监护数据
     */
    async multipleListPageFc(code, val) {
      const res = await moniitem_multipleListPage({
        moniitemCodes: code, // 本条数据放第一条查询出来
        searchKey: val || '' // 搜索条件
      })
      // 获取监护项字典数据
      this.moniitemDictList = res.data.result
    },
    handleChangeExcludeCodes(v) {
      this.paramValueCopy.excludeCodes = v.join(',')
    }
  }
}
</script>
<style lang="scss" scoped>
.param-config-contaier {
  height: fit-content;
  margin-bottom: 20px;

}

.param-config-content {
  padding: 5px 10px;
  // background:var(--maincolor4);
  background: #f3f5f9;
  max-height: 300px;
  height: fit-content;
  overflow-y: auto;
  margin-left: 130px;

  ::v-deep .el-input>.el-input__inner {

    border: 1px solid #ddd;
    background: #fff;
  }

  .line30 {
    .el-form-item--small .el-form-item__content {
      line-height: 30px;
      ;
    }
  }

  .shortInput {
    .el-button {
      width: 130px;
    }

    .linkStatus {
      width: 130px;
    }

    .m-l10 {
      margin-left: 10px;
    }

    ::v-deep .el-input {
      flex: 1;
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
