<template>
  <div class="moniitem-container">
    <template v-if="item.dataSourceDict == 7">
      <div class="w100 pointer" style="height: 28px;" @click="!isDblclickAccess && handleAssess(item)"
        @dblclick="isDblclickAccess && handleAssess(item)">{{ curValue }}</div>
      <!-- 数据来源为评估表 -->
    </template>
    <template v-else>
      <!-- 编辑状态且数字 -->
      <el-input v-if="isEdit && item.contentTypeDict == 1" size="mini" :disabled="disabled" :maxlength="10"
        :max="9999999999" type="number" placeholder="请输入内容" v-model="curValue" @input="handleChange">
      </el-input>
      <el-checkbox v-else-if="isEdit && item.contentTypeDict == '5'" :disabled="disabled" true-label="1" false-label=""
        v-model="curValue" @change="handleChange"></el-checkbox>
      <!-- 编辑状态且文本 -->
      <el-input v-else-if="isEdit && !['3', '4'].includes(item.contentTypeDict)" size="mini" :disabled="disabled"
        :type="item.contentTypeDict == '6' ? 'textarea' : 'text'" placeholder="请输入内容" v-model="curValue"
        @input="handleChange">
      </el-input>
      <!-- 编辑状态且数据源为字典 -->
      <template v-else-if="isEdit && ['3', '4'].includes(item.contentTypeDict)">
        <el-select v-if="item.contentTypeDict == '3'" :disabled="disabled" v-model="curValue" placeholder="请选择"
          @change="handleChange">
          <el-option :forceHide="dictItem.statusDict != 1" v-for="dictItem in dictItemList" :key="dictItem.dictCode"
            :label="dictItem.dictName" :value="dictItem.dictCode" :disabled="dictItem.statusDict == '0'"></el-option>
        </el-select>
        <el-select v-else-if="item.contentTypeDict == '4'" :disabled="disabled" v-model="curValue" placeholder="请选择"
          multiple :collapse-tags="isEdit" @change="handleChange">
          <el-option :forceHide="dictItem.statusDict != 1" v-for="dictItem in dictItemList" :key="dictItem.dictCode"
            :label="dictItem.dictName" :value="dictItem.dictCode" :disabled="dictItem.statusDict == '0'"></el-option>
        </el-select>
      </template>
      <!-- 数据源为字典 且内容类型为选择 -->
      <span v-else>
        <template v-if="item.contentTypeDict == '3'">
          {{ value | showDictNameFilter(dictItemList, 'dictCode_to_dictName') }}
        </template>
        <template v-else-if="item.contentTypeDict == '4'">
          {{ curValue | showDictNameFilter(dictItemList, 'list_code_to_name') }}
        </template>
        <template v-else-if="item.contentTypeDict == '5'">
          {{ value == 1 ? '√' : '' }}
        </template>
        <template v-else>{{ value }}</template>
      </span>
    </template>
    <patientAssessment v-if="assessmentVisible" :visible="assessmentVisible" :isEdit="isEditAccess" :isMock="isMockAccess"
      :mockData.sync="curMockData" :icuRecordId="assessmentData.icuRecordId" :obj="assessmentData.obj"
      :time="assessmentData.time" :timeFlag="false" :value="assessmentData.value" :sourceKey="assessmentData.sourceKey"
      :moniItemFlag="assessmentData.moniItemFlag" @cancelFc="handleCancelPatientAssessment"
      @patientAssessmentCallback="handlePatientAssessmentCallback">
    </patientAssessment>
  </div>
</template>

<script>
import {
  filterArrValue
} from '@/utils/utils'
import { outLimitMinMaxValue } from '@/utils'
import patientAssessment from '@/views/patient/components/monitoringData/patientAssessment'
export default {
  name: 'Moniitem',
  props: {
    value: {
      type: [String, Number]
    },
    content: { // 选择内容
      type: String
    },
    item: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isEditAccess: {
      type: Boolean,
      default: true
    },
    isMockAccess: {
      type: Boolean,
      default: true
    },
    isDblclickAccess: {
      type: Boolean,
      default: true
    }
  },
  components: { patientAssessment },
  data() {
    return {
      dictItemList: [],
      curValue: '',
      assessmentVisible: false,
      assessmentData: {
        obj: {},
        time: '',
        value: '',
        sourceKey: ''
      },
      curMockData: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (this.item.contentTypeDict == 4) {
          if (newVal) {
            this.curValue = newVal.split(',')
          } else {
            this.curValue = []
          }
        } else {
          this.curValue = newVal
        }
      }
    }
  },
  async created() {
    if (this.item.dataSourceDict == 2 || this.item.valueDictCode) {
      const dictItemList = await this.$batchGetDictItemList([this.item.valueDictCode])
      this.dictItemList = dictItemList[this.item.valueDictCode]
    }
  },
  methods: {
    validate() {
      if (outLimitMinMaxValue({ ...this.item, visible: true, moniitemValueTypeDict: this.item.contentTypeDict }, this.item.moniitemValue)) {
        this.$message.error(`${this.item.moniitemName}只能输入${this.item.baseMinValue}-${this.item.baseMaxValue}的数字`)
        return false
      }
      if (this.item.moniitemValue === null || this.item.moniitemValue === undefined || this.item.moniitemValue === '' || this.item.moniitemValue == '[]') {
        this.$message({
          type: 'error',
          message: '请输入监护结果'
        })
        return false
      }
      return true
    },
    handleChange() {
      if (this.item.contentTypeDict == 4) {
        this.$emit('update:value', this.curValue.join(','))
        this.$emit('update:content', filterArrValue(this.curValue, this.dictItemList, 'dictCode', 'dictName'))
      } else {
        if (this.item.contentTypeDict == 3) {
          this.$emit('update:content', filterArrValue(this.curValue, this.dictItemList, 'dictCode', 'dictName'))
        }
        this.$emit('update:value', this.curValue)
      }
    },
    handleAssess(item, isValidFormId = true) {
      if (isValidFormId && !item?.formId) {
        this.$message.warning('请配置对应评估单')
        return
      }
      let obj = {}
      if (isValidFormId) {
        obj = {
          formId: item.formId
        }
      }
      this.assessmentData = {
        icuRecordId: item.icuRecordId,
        obj,
        time: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        value: '',
        sourceKey: item?.assessId || '',
        moniItemFlag: item.moniItemFlag || '0'
      }
      this.assessmentVisible = true
    },
    handleCancelPatientAssessment() {
      this.assessmentVisible = false
    },
    handlePatientAssessmentCallback(res) {
      this.curMockData = res
      this.$emit('success', res)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
