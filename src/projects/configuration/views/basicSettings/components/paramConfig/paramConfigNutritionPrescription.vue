<!-- 基础参数 -->
<template>
  <div class="syncPassModifyConfig">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="encryptionInfo">
      </el-form-item>
    </div>
    <div class="syncPassModifyConfigContent">
      <el-form ref="form" :model="encryptionInfo" label-width="10em" :rules="rules" align="left">
        <el-form-item label="默认的医嘱分类" prop="scene">
          <el-select v-model="encryptionInfo.orderUsageType" clearable filterable placeholder="请选择">
            <el-option v-for="item in ICIS_DICT_ORDER_USAGE_TYPE" :key="item.dictCode" :label="item.dictName"
              :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可选的用法" prop="scene">
          <el-select v-model="drugUsage" clearable filterable multiple placeholder="请选择"
            @change="handleChange('drugUsage', $event)">
            <el-option v-for="item in drugUsageList" :key="item.usageCode" :label="item.usageName" :value="item.usageCode"
              :disabled="item.statusDict == '0'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可选的频次" prop="scene">
          <el-select v-model="drugFrequency" clearable filterable multiple placeholder="请选择"
            @change="handleChange('drugFrequency', $event)">
            <el-option v-for="item in drugFrequencyList" :key="item.frequencyCode" :label="item.frequencyName"
              :value="item.frequencyCode" :disabled="item.statusDict == '0'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  drugUsage_findWithPage,
  drugFrequency_findDrugAllWithPage
} from '@/api/configuration'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'ParamConfigSyncPassModify',
  data: function () {
    return {
      // 隐私信息加密
      encryptionInfo: {
        orderUsageType: '', // 默认的医嘱分类
        drugUsage: '', // 可选的用法
        drugFrequency: '' // 可选的频次
      },
      drugUsage: [],
      drugFrequency: [],
      rules: {},
      scene: [],
      ICIS_DICT_ORDER_USAGE_TYPE: [], // 医嘱分类
      drugUsageList: [], // 医嘱用法
      drugFrequencyList: [] // 医嘱频次
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
          this.drugUsage = this.encryptionInfo.drugUsage ? this.encryptionInfo.drugUsage.split(',') : []
          this.drugFrequency = this.encryptionInfo.drugFrequency ? this.encryptionInfo.drugUsage.split(',') : []
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(['currentUserWard']),
    string() {
      return JSON.stringify(this.paramValue) || '[]'
    }
  },
  created: async function () {
    Promise.all([
      this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE']),
      this.getDrugUsageList(),
      this.getDrugFrequencyList()
    ]).then(res => {
      const { ICIS_DICT_ORDER_USAGE_TYPE } = res[0]
      this.ICIS_DICT_ORDER_USAGE_TYPE = ICIS_DICT_ORDER_USAGE_TYPE || []
      this.drugUsageList = res[1]
      this.drugFrequencyList = res[2]
    })
  },
  destroyed() {
  },
  mounted() { },
  methods: {
    async getDrugUsageList() {
      const res = await drugUsage_findWithPage({
        pageNum: 1,
        pageSize: 10000,
        wardCode: this.currentUserWard.wardCode,
        statusDict: '1'
      })
      return res.data.result
    },
    async getDrugFrequencyList() {
      const res = await drugFrequency_findDrugAllWithPage({
        pageNum: 1,
        pageSize: 10000,
        statusDict: '1'
      })
      return res.data.result
    },
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
    handleChange(key, v) {
      this.encryptionInfo[key] = v.join(',')
    }
  }
}
</script>
<style lang="scss" scoped>
.syncPassModifyConfig {
  height: fit-content;
  margin-bottom: 20px;

}

.syncPassModifyConfigContent {
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
