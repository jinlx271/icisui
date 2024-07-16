<template>
  <div class="moniitem-container r_c_center flex w100" :class="noBorder?'noBorder':''" style="height:inherit;">
    <template v-if="item.dataSourceDict == 7">
      <div class="w100 pointer" style="height: 28px;" @click="!isDblclickAccess && handleAssess(item)"
      :data-index="recordTime"
      :data-name="item.moniitemCode"
      @dblclick="isDblclickAccess && handleAssess(item)" >{{ curValue }}</div>
      <!-- 数据来源为评估表 -->
    </template>
    <div v-else-if="isEdit" class="w100 flex-1 flex r_c_center" style="height:100%;" v-clickoutside="outSideClick">
      <!-- 编辑模式 -->
      <template v-if="isCoolTmp">
        <el-input :disabled="disabled" :maxlength="10"
          :max="9999999999" type="number" placeholder="请输入" v-model="curValue" @input="handleChange" style="width:50%;">
        </el-input>
        <el-input  :disabled="disabled" :maxlength="10"
        :max="9999999999" type="number" placeholder="物理降温" v-model="curCoolTmp" @input="handleCoolTmp" style="width:50%;" class="coolTemp">
      </el-input>
      </template>
      <el-input v-else-if="item.contentTypeDict == 1"  :disabled="disabled" :maxlength="10"
        :max="9999999999" type="number" placeholder="请输入" v-model="curValue" @input="handleChange" >
      </el-input>
      <el-checkbox v-else-if="item.contentTypeDict == '5'" :disabled="disabled" true-label="1" false-label=""
        v-model="curValue" @change="handleChange" ></el-checkbox>
      <!-- 编辑状态且文本 -->
      <el-input v-else-if="!['3', '4'].includes(item.contentTypeDict)" :disabled="disabled"
        :type="item.contentTypeDict == '6' ? 'textarea' : 'text'" placeholder="请输入" v-model="curValue"
        @input="handleChange">
      </el-input>
      <!-- 编辑状态且数据源为字典 -->
      <template v-else-if="['3', '4'].includes(item.contentTypeDict)">
        <template v-if="moniitemDataPage">
          <!-- 下拉选择 -->
            <el-select v-model="curValue"  :ref="'ref'+cellNo"  filterable
              :multiple="item.contentTypeDict=='4'"
              :disabled="disabled"  clearable collapse-tags
              @visible-change="changeVisible"
              @keydown.enter.native="changeFocus($event,'enter')"
              @keydown.left.stop="changeFocus"
              @keydown.right.stop="changeFocus"
              @keydown.up.native.stop
              @keydown.down.native.stop
              @keydown.space.native="handlerSpace"
              @change="handleChange"
              @keydown.esc.native.capture ="changeFocus($event,'esc')"
              @scroll.stop
            >
              <el-option :forceHide="dictItem.statusDict != 1" v-for="dictItem in dictItemList" :key="dictItem.dictCode"
              :label="dictItem.dictName" :value="dictItem.dictCode" :disabled="dictItem.statusDict == '0'"></el-option>
            </el-select>
        </template>
        <template v-else>
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
      </template>
      <!-- 数据源为字典 且内容类型为选择 -->
      <!-- 物理降温 -->
    </div>
    <div v-else class="w100" style="height:100%" :class="nowrap&&item.contentTypeDict!='6'?'mynowrap':'textarea'"
      :data-index="recordTime"
      :data-name="item.moniitemCode"
      :style="{color:backgroundColorFn('#333',value,item,item.personExceptionLevelEntities)}"
    >
    <!-- 这里监护数据录入页面 需要index name 复制功能 -->
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
    </div>
    <patientAssessment v-if="assessmentVisible" :visible="assessmentVisible" :isEdit="isEditAccess" :isMock="isMockAccess"
      :mockData.sync="curMockData" :icuRecordId="assessmentData.icuRecordId" :obj="assessmentData.obj"
      :time="assessmentData.time" :timeFlag="moniitemDataPage" :value="assessmentData.value" :sourceKey="assessmentData.sourceKey"
      :moniItemFlag="assessmentData.moniItemFlag" @cancelFc="handleCancelPatientAssessment"
      @patientAssessmentCallback="handlePatientAssessmentCallback">
    </patientAssessment>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
import {
  filterArrValue
} from '@/utils/utils'
import { outLimitMinMaxValue, backgroundColorFn } from '@/utils'
import patientAssessment from '@/views/patient/components/monitoringData/patientAssessment'
export default {
  name: 'Moniitem',
  directives: { Clickoutside },
  props: {
    isCoolTmp: {
      type: Boolean,
      default: false
    },
    moniitemDataPage: { // 监护数据录入
      type: Boolean,
      default: false
    },
    nowrap: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array]
    },
    coolTmp: {
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
    },
    recordTime: {
       type: String
    },
    cellNo: {
      type: Number
    }
  },
  components: { patientAssessment },
  data() {
    return {
      dictItemList: [],
      curValue: '',
      curCoolTmp: '',
      assessmentVisible: false,
      assessmentData: {
        obj: {},
        time: '',
        value: '',
        sourceKey: ''
      },
      curMockData: null,
      selectRefShow: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (this.item.contentTypeDict == 4) {
          if (Array.isArray(newVal)) {
            this.curValue = JSON.parse(JSON.stringify(newVal))
          } else {
            if (newVal) {
              this.curValue = newVal.split(',')
            } else {
              this.curValue = []
            }
          }
        } else {
          this.curValue = newVal
        }
      }
    },
    coolTmp: {
      immediate: true,
      handler(newVal) {
        this.curCoolTmp = newVal
      }
    },
    selectRefShow: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (this.$refs['ref' + this.cellNo]) {
            // 重构select组件中enter按键的处理方式 采用当前页面的处理 空格键处理
            this.$refs['ref' + this.cellNo].selectOption = function() {
            }
          }
        }
        this.$emit('changeRefVisible', newVal)
      }
    }
  },
  async created() {
    console.log('this.item', this.item)
    if (this.item.dataSourceDict == 2 || this.item.valueDictCode) {
      const dictItemList = await this.$batchGetDictItemList([this.item.valueDictCode])
      this.dictItemList = dictItemList[this.item.valueDictCode]
    }
  },
  mounted() {
    if (this.$refs['ref' + this.cellNo]) {
      // 重构select组件中enter按键的处理方式 采用当前页面的处理 空格键处理
      this.$refs['ref' + this.cellNo].selectOption = function() {
        console.log('selectOption')
      }
    }
  },
  methods: {
    backgroundColorFn,
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
    handleChange(e) {
      if (this.moniitemDataPage) {
        this.curValue = e
      }

      if (this.item.contentTypeDict == 4) {
        if (this.moniitemDataPage) { // 兼容下监护数据叶面积的数据
          this.$emit('update:value', this.curValue)
        } else {
          this.$emit('update:value', this.curValue.join(','))
        }

        this.$emit('update:content', filterArrValue(this.curValue, this.dictItemList, 'dictCode', 'dictName'))
      } else {
        if (this.item.contentTypeDict == 3) {
          this.$emit('update:content', filterArrValue(this.curValue, this.dictItemList, 'dictCode', 'dictName'))
        } else if (this.item.contentTypeDict == 1) {
          this.$emit('input')
        }
        this.$emit('update:value', this.curValue)
      }
    },
    handleCoolTmp(e) {
      this.$emit('update:coolTmp', this.curCoolTmp)
    },
    handleAssess(item, isValidFormId = true) {
      if (this.disabled) return
      if (isValidFormId && !item?.formId) {
        this.$message.warning('请配置对应评估单')
        return
      }
      let obj = {}
      if (isValidFormId) {
        obj = {
          formId: item.formId,
          ...item
        }
      }
            this.assessmentData = {
        icuRecordId: item.icuRecordId,
        obj,
        time: this.recordTime || this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        value: '',
        sourceKey: item?.assessId || item.sourceKey || '',
        moniItemFlag: item.moniItemFlag || '0'
      }

      this.assessmentVisible = true
      this.$emit('assessment', true)
    },
    handleCancelPatientAssessment() {
      this.assessmentVisible = false
      this.$emit('assessment', false)
      this.$emit('cancelAssment')
    },
    handlePatientAssessmentCallback(res) {
      this.curMockData = res
      this.$emit('success', res)
    },
    changeVisible(e) {
      this.selectRefShow = e
      this.$emit('changeRefVisible', e)
    },
    changeFocus(e, type) {
      console.log('changeFocus=====', this.selectRefShow, type)
      if (this.selectRefShow) {
        const multipleFlag = this.$refs['ref' + this.cellNo]?.multiple
        if (multipleFlag) {
          this.$refs['ref' + this.cellNo].$refs.input.focus()
        }
        this.$refs['ref' + this.cellNo].blur()
        this.selectRefShow = false
        this.$emit('changeRefVisible', false)
        this.$refs['ref' + this.cellNo].setSoftFocus()
        e.stopPropagation()
      } else {
        if (type == 'esc') { this.$emit('exitEdit') }
        if (type == 'enter') {
          this.$emit('nextEdit')
          e.stopPropagation()
        }
      }
    },

    /**
     * 空格键处理 处理下拉选择框 用空格键选择值s
     */
    handlerSpace(e) {
      if (this.$refs['ref' + this.cellNo].hoverIndex != -1) {
        if (this.$refs['ref' + this.cellNo].multiple) {
            const index = this.$refs['ref' + this.cellNo].value.findIndex(value => value == this.$refs['ref' + this.cellNo].options[this.$refs['ref' + this.cellNo].hoverIndex].value)
            if (index > -1) {
              this.$refs['ref' + this.cellNo].value.splice(index, 1)
            } else {
              this.$refs['ref' + this.cellNo].value.push(this.$refs['ref' + this.cellNo].options[this.$refs['ref' + this.cellNo].hoverIndex].value)
            }
        } else {
          this.curValue = this.$refs['ref' + this.cellNo].options[this.$refs['ref' + this.cellNo].hoverIndex].value
          this.selectRefShow = false
          this.$emit('changeRefVisible', false)
          this.$refs['ref' + this.cellNo].blur()
        }
        this.$refs['ref' + this.cellNo].setSoftFocus()
        this.handleChange(this.curValue)
        e.stopPropagation()
        e.preventDefault()
      }
    },
    outSideClick() {
      if (!this.selectRefShow) {
        this.$emit('blurEdit')
      }
    }
  }
}
</script>

<style lang="scss">
  .moniitem-container input::-webkit-outer-spin-button,
  .moniitem-container input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .moniitem-container input[type="number"]{
    -moz-appearance: none;
  }
</style>
<style lang="scss" scoped>
.mynowrap {
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.textarea{
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1;
}
::v-deep .el-input__suffix{
  height:100%;
  right:15px;
  display: flex;
  height: var(--tizhenHeight);
  line-height: var(--tizhenHeight);
  align-items: center;
}
.noBorder{
  height:100%;
  ::v-deep .el-input__inner{
    border-color: transparent !important;
    border-width: 0px !important;
    border-style: none !important;
    border-radius: 0 !important;
    height: var(--tizhenHeight);
    line-height: var(--tizhenHeight);
  }
  ::v-deep  .coolTemp .el-input__inner{
    border-left : 1px solid #000 !important;
  }
  ::v-deep .el-textarea{
    &__inner{
      height:100%;
      outline: none;
      border-width: 10px !important;
      border-style: none !important;
      border-color: transparent !important;
      resize: none;
      box-shadow: none;
      border-radius: 0 !important;
    }
  }
  ::v-deep .el-textarea{
    height:100%;
  }
  ::v-deep .el-input .el-input__inner{
    border-radius: 0;
    height:100%;
    line-height: 1;
    border-color: transparent;
  }
  ::v-deep .el-select{
    width:100%;
    height: 100%;
  }
  ::v-deep .el-select:hover .el-input__inner{
    border-color: transparent;
    border-radius: 0;
  }
  ::v-deep .el-autocomplete{
    width:100%
  }
  ::v-deep input:hover{
    outline:none;
  }
  ::v-deep .el-input , .el-select{
    height:inherit;
  }
  ::v-deep .el-input__inner{
    padding-left:5px !important;
    padding-right:5px !important;
    border-color:transparent;
    height:inherit;
  }
  ::v-deep .el-input.el-input__inner{
    background-color: transparent;
    border-color: transparent;
    color: #000;
    cursor: not-allowed;
  }
}
</style>
