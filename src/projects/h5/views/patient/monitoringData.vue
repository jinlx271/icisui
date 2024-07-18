<template>
  <div class="moniData">
    <div class="moniData_left">
      <el-radio-group v-model="mode" size="small" class=" el-card box-card is-always-shadow flex"
        @change="changeDateShift">
        <el-radio-button label="1">录入</el-radio-button>
        <el-radio-button label="2">查看</el-radio-button>
      </el-radio-group>
      <div class="el-card box-card is-always-shadow menu">
        <el-tabs v-model="activeIndex" class="LMContiner " ref="menu" :before-leave="beforeTabClick" tab-position="left">
          <el-tab-pane class="centerDiv_itemDiv " :name="index + ''" v-for="(item, index) in mainMenu"
            :key="item.monitypeCode" :label="item.monitypeName">
            <!-- <span class="menuTitle">{{  }}</span> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="main  el-card box-card is-always-shadow">
      <div class="flex align-item-center flex-between ">
        <div @click="showTimePicker" class="flex el-button el-button--primary el-button--small" v-if="mode == '1'">
          {{ searchDate | dateformat('YYYY-MM-DD HH:mm') }}
        </div>
        <div class="flex searchTime align-item-center" v-else>
          <div @click="showTimePicker"
            class="flex align-item-center mr-10 el-date-editor el-input el-input--small el-input--prefix el-input--suffix el-date-editor--month el-input--small el-input__inner"
            style="width:135px; height:32px;">
            <i class="el-icon-date mr-10"></i><span class="m-110">{{ searchDate | dateformat('YYYY-MM-DD') }}</span>
          </div>
          <el-button type="primary" @click="gotoToday" circle>今</el-button>
          <el-button type="primary" circle class="el-icon-back" title="前一天" @click="gotoPreDay()"></el-button>
          <el-button type="primary" circle class="el-icon-right" title="后一天" @click="gotoNextDay()"></el-button>
        </div>
        <!-- <SearchTimeCom :shiftList="currWardShiftInfo" @change="$event => { searchDate = $event; changeDateShift() }"
          :value="searchDate" noLimit :icuAreaTime="patientInfo.icuInfoEntity.icuAreaTime"
          :icuLeaveTime="patientInfo.icuInfoEntity.icuLeaveTime || $dayjs().format('YYYY-MM-DD HH:mm:ss')"
          style="margin-right:10px;" v-else>
        </SearchTimeCom> -->
        <!-- 录入模式 -->
        <div class="flex" v-if="mode == '1'">
          <el-button size="small" type="primary" @click="importLastData">引用上次</el-button>
          <el-button size="small" type="primary" @click="autoGetMoniitem">自动获取</el-button>
          <el-button size="small" type="primary" @click="batchSaveMoniitem">保存</el-button>
        </div>
        <!-- 查看模式 -->
        <el-radio-group v-model="search_shift" @change=" changeDateShift()" size="small" v-else>
          <el-radio-button v-for="item in shiftListWrap" :key="item.shiftCode" :label="item.shiftCode">{{ item.shiftName
          }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="list" v-if="mode == '1'">
        <div v-for="( item, index) in children" :key="item.moniitemCode">
          <div class="flex w100 align-item-center line m-b10" v-if="index>0&&item.contentTypeDict != '5'">
            <span class="title flex flex-start">{{ item.moniitemName }}
              <!-- <span v-if="item.unit" class="unit">({{filterArrValue(item.unit,dictCodeList['ICIS_DICT_UNIT'],'dictCode','dictName')}})</span> -->
            </span>
            <div class="flex-1 flex">
              <!-- 评估单 -->
              <template v-if="item.dataSourceDict == '7'">
                <div v-if="value[item.moniitemCode]" class="w100 el-input__inner flex align-item-center"
                  @click="showAssement(item)">
                  {{ value[item.moniitemCode] }}
                </div>
                <div v-else class="assement w100 el-input__inner flex align-item-center" @click="showAssement(item)">评估单
                </div>
              </template>
              <template v-else-if="item.contentTypeDict == '1'">
                <el-input v-model="value[item.moniitemCode]" placeholder="请输入" type="number" clearable
                  @clear="clearMoniitemValue(item.moniitemCode)" @change="saveRecord(item.moniitemCode)">
                  <template slot="append" v-if="item.unit" class="unit">({{ filterArrValue(item.unit,
                    dictCodeList['ICIS_DICT_UNIT'], 'dictCode', 'dictName') }})</template>
                </el-input>
              </template>
              <template v-else-if="item.contentTypeDict == '2'">
                <el-input v-model="value[item.moniitemCode]" placeholder="请输入" clearable
                  @clear="clearMoniitemValue(item.moniitemCode)" @change="saveRecord(item.moniitemCode)">
                  <template slot="append" v-if="item.unit" class="unit">({{ filterArrValue(item.unit,
                    dictCodeList['ICIS_DICT_UNIT'], 'dictCode', 'dictName') }})</template>
                </el-input>
              </template>
              <template v-else-if="item.contentTypeDict == '3'">
                <SelectListCom :options="dictCodeList[item.valueDictCode]" v-model="value[item.moniitemCode]"
                  @change="saveRecord(item.moniitemCode, $event)"></SelectListCom>
              </template>
              <template v-else-if="item.contentTypeDict == '4'">
                <SelectListCom :options="dictCodeList[item.valueDictCode]" multiple v-model="value[item.moniitemCode]"
                  @change="saveRecord(item.moniitemCode, $event)"></SelectListCom>
              </template>
              <template v-else-if="item.contentTypeDict == 'doList'">
                <ExcuteListCom :options="item.doList" v-model="value[item.monitypeCode+'_doList']" multiple  :recordTime="searchDate" :icuRecordId="patientInfo.icuRecordId"
                :moniTypeCode="item.monitypeCode" :monitypeName="item.monitypeName" :recordId.sync="moniitemRecordId">
                </ExcuteListCom>
              </template>
              <!-- <template v-else-if="item.contentTypeDict == '5'">
                <SelectListCom :options="dictFlag" v-model="value[item.moniitemCode]"
                  @change="saveRecord(item.moniitemCode, $event)"></SelectListCom>
              </template> -->
              <template v-else-if="item.contentTypeDict == '6'">
                <el-input v-model="value[item.moniitemCode]" placeholder="请输入" clearable type="textarea"
                  @change="saveRecord(item.moniitemCode)" />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="table flex" v-else>
        <el-table :data="tableData" border ref="table" style="width:100%" height="100%" v-loading="tableLoading" :span-method="arraySpanMethod" :row-class-name="rowClassName">
          <el-table-column label="项目名称" prop="moniitemName" width="200px" fixed="left"></el-table-column>
          <el-table-column :label="$dayjs(time).format('HH:mm')" v-for="(time, index) in timeList" :key="index">
            <template slot-scope="scope">
              <span :style="{color:scope.row.warnColor[time],fontWeight:'600'}">{{scope.row.recordList[time] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <van-popup v-model="pickerFlag" position="bottom">
      <van-datetime-picker v-model="datePicker" :type="mode == '1' ? 'datetime' : 'date'" @cancel="pickerFlag = false"
        @confirm="onConfirm" @change="changeTime" />
    </van-popup>
    <el-drawer :title="'评估表'" :visible.sync="patientAssessmentVisible" :modal-append-to-body="true" :append-to-body="true"
      custom-class="inspection-result-drawer" size="400px" direction="btt" top="20vh">
      <PatientAssessment v-if="patientAssessmentVisible" :obj="patientAssessmentData.obj"
        :time="patientAssessmentData.time" :value="patientAssessmentData.value"
        :sourceKey="patientAssessmentData.sourceKey" @cancelFc="patientAssessmentVisible = false"
        @patientAssessmentCallback="patientAssessmentCallback">
      </PatientAssessment>
    </el-drawer>
  </div>
</template>
<script>
import {
  backgroundColorFn // 监护项预警颜色
} from '@/utils/index'
import { filterArrValue, shiftListWrap } from '@/utils/utils'
import SelectListCom from './components/optionSelect.vue'
import ExcuteListCom from './components/excuteListCom.vue'
import { mapGetters } from 'vuex'
import {
  moniitemRecord_findMoniItemRecord,
  personMoniitem_findPersonMonType,
  moniitemRecord_save,
  moniitemRecord_findAvailableTime,
  moniitemRecord_autoGetMoniItemRecordByTime,
  moniitemRecord_batchSaveRecords
} from '@/api/configuration'
import {
  personMoniitem_findPersonConfigMoniitem,
  moniitemRecord_getRecentMoniRecord
} from '@/api/patient'
import PatientAssessment from './components/patientAssessment.vue'
import _ from 'lodash'
export default {
  components: {
    SelectListCom, PatientAssessment, ExcuteListCom
  },
  data() {
    return {
      mode: '1',
      mainMenu: [
        // {
        //   monitypeName: '监护仪参数',
        //   monitypeCode: '1'
        // },
        // {
        //   monitypeName: '呼吸机参数',
        //   monitypeCode: '2'
        // },
        // {
        //   monitypeName: 'CRRT监测',
        //   monitypeCode: '3'
        // },
        // {
        //   monitypeName: 'ECMO监测',
        //   monitypeCode: '4'
        // },
        // {
        //   monitypeName: 'PICCO监测',
        //   monitypeCode: '5'
        // },
        // {
        //   monitypeName: '床旁观察',
        //   monitypeCode: '6'
        // },
        // {
        //   monitypeName: '床旁检测',
        //   monitypeCode: '7'
        // },
        // {
        //   monitypeName: '护理执行',
        //   monitypeCode: '8'
        // }
      ],
      activeIndex: '0',
      children: [], // 显示分组下面对应的监护项code
      value: {},
      dictCodeList: {},
      dictFlag: [
        { dictName: '√', dictCode: '1', statusDict: '1' },
        { dictName: '×', dictCode: '0', statusDict: '1' }
      ],
      keyboardShow: false,
      searchDate: '',
      datePicker: new Date(),
      pickerFlag: false,
      moniitemRecordId: {},
      fileValue: '',
      patientAssessmentVisible: false, // 评估单
      patientAssessmentData: {
        obj: {},
        time: '',
        moniitemValue: '',
        sourceKey: ''
      },
      currTime: '',
      currShiftInfo: [],
      search_shift: 'D',
      startTime: '',
      endTime: '',
      timeList: [], // 时间列表
      tableLoading: false,
      debounceGetMoniitemData: -1,
      importDataNoSave: false, //
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'patientInfo', 'userInfo', 'currWardShiftInfo']),
    shiftListWrap() {
      return shiftListWrap(this.currWardShiftInfo) //
    }
  },
  async mounted() {
    this.debounceGetMoniitemData = _.debounce(() => {
      if (this.mode == '1') {
        this.getMoniitemRecordList()
      } else {
        this.getTableMoniitemList()
      }
    }, 500)
    this.currTime = this.$dayjs().format('HH:00')
    this.searchDate = this.$dayjs().format('YYYY-MM-DD HH:00:00')
    const moduleListP = await personMoniitem_findPersonMonType({ busiTypeDictCode: '2', icuRecordId: this.patientInfo.icuRecordId })
    const _personMoniitem_findPersonConfigMoniitem = await personMoniitem_findPersonConfigMoniitem({
      wardCode: this.currentUserWard.wardCode,
      busiTypeDictCode: '2',
      icuRecordId: this.patientInfo.icuRecordId
    })
    const dictCodes = _personMoniitem_findPersonConfigMoniitem.data.filter(item => item.valueDictCode).map(item => item.valueDictCode)
    dictCodes.push('ICIS_DICT_UNIT')
    const obj = {}

    this.mainMenu = moduleListP.data.map(item => {
      item.children = []
      item.children = _personMoniitem_findPersonConfigMoniitem.data.filter(p => p.monitypeCode == item.monitypeCode).map(item => {
        obj[item.moniitemCode] = ''
        return item
      })
      item.children.unshift({
        moniitemName: item.monitypeName,
        moniitemCode: item.monitypeCode
      })
      // 整理执行项目
      const doList = item.children.filter(item => item.contentTypeDict == '5')
      if (doList.length > 0) {
        item.children.push({
          moniitemName: '执行项',
          moniitemCode: item.monitypeCode + '_doList',
          contentTypeDict: 'doList',
          monitypeCode: item.monitypeCode,
          monitypeName: item.monitypeName,
          dataSourceDict: 'doList',
          doList: doList.map(moni => {
            moni.dictCode = moni.moniitemCode
            moni.dictName = moni.moniitemName
            moni.statusDict = '1'
            return moni
          })
        })
        obj[item.monitypeCode + '_doList'] = '[]'
      }

      return item
    })
    this.value = { ...obj }
    this.moniitemRecordId = { ...obj }
    this.dictCodeList = await this.$batchGetDictItemList(dictCodes)
    this.activeIndex = '0'
    this.children = this.mainMenu[this.activeIndex].children
    this.changeDateShift()
  },
  methods: {
    filterArrValue,
    // 返回
    // onClickLeft() {
    //   this.$router.back()
    // },
    /**
     * 切换日期班次
     */
    async changeDateShift() {
      if (this.importDataNoSave) {
        this.mode = '1'
        this.$confirm('当前数据未保存，是否继续', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mode = '2'
          this.importDataNoSave = false
          this.doChangeDateShift()
        }).catch(() => {
          this.mode = '1'
        })
      } else {
        this.doChangeDateShift()
      }
    },
    // 执行日期切换
    async doChangeDateShift() {
      if (this.mode == '1') { // 录入
        if (this.searchDate.indexOf(' ') == -1) {
          this.searchDate += this.$dayjs().format(' HH:00:00')
        }
        this.startTime = this.searchDate
        this.endTime = this.searchDate
        this.timeList = []
      } else {
        const currDay = this.$dayjs(this.searchDate).format('YYYY-MM-DD')
        const firstShiftTime = this.$dayjs(currDay + ' ' + this.currWardShiftInfo[0].startTime).valueOf()
        this.startTime = currDay + ' ' + this.currWardShiftInfo.find(item => item.shiftCode == this.search_shift).startTime
        this.endTime = currDay + ' ' + this.currWardShiftInfo.find(item => item.shiftCode == this.search_shift).endTime
        if (this.$dayjs(this.endTime).valueOf() <= this.$dayjs(this.startTime).valueOf()) {
          this.endTime = this.$dayjs(this.$dayjs(this.endTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        if (this.$dayjs(this.startTime).valueOf() < firstShiftTime) {
          this.startTime = this.$dayjs(this.$dayjs(this.startTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
          this.endTime = this.$dayjs(this.$dayjs(this.endTime).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        let timeValue = 0
        let i = 0
        let tempTime = []
        while (timeValue < this.$dayjs(this.endTime).valueOf()) {
          tempTime.push(this.$dayjs(this.$dayjs(this.startTime).valueOf() + i * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'))
          i++
          timeValue = this.$dayjs(this.startTime).valueOf() + i * 60 * 60 * 1000
        }
        this.tableLoading = true
        const availabelTime = await this.getAvailableTime()
        if (availabelTime.length > 0) {
          tempTime = tempTime.concat(availabelTime)
          tempTime = _.sortBy(tempTime, (a) => {
            return this.$dayjs(a).valueOf()
          })
        }
        this.timeList = [... new Set(tempTime)]
      }
      this.debounceGetMoniitemData()
    },
    // 左侧菜单跳转功能
    async beforeTabClick(activeName, oldName) {
      if (this.importDataNoSave) {
        await this.$confirm('当前数据未保存，是否继续', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.importDataNoSave = false
          this.handleSelect(activeName, oldName)
        }).catch(() => {
          return Promise.reject()
        })
      } else this.handleSelect(activeName, oldName)
    },
    /**
     * 监护项显示分组
     * @param {*} e
     */
    handleSelect(e, oldName) {
      if (this.activeIndex == e) {
        return
      }
      this.activeIndex = e
      this.children = this.mainMenu[this.activeIndex].children
      this.children.forEach(item => {
        this.value[item.moniitemCode] = ''
      })
      this.importDataNoSave = false
      if (this.mode == '1') {
        this.debounceGetMoniitemData()
      } else {
        // 表格滚动对应的位置
        const rowIndex = this.tableData.findIndex(item => item.moniitemCode == this.mainMenu[this.activeIndex].monitypeCode)
        const bodyWrapper = this.$refs.table.$el.querySelector('.el-table__body')
        const tr = bodyWrapper.querySelectorAll('tr')[rowIndex]
        this.$refs.table.bodyWrapper.style.scrollBehavior = 'smooth'
        this.$refs.table.bodyWrapper.scrollTop = tr.offsetTop // 固定顶部  行在底部   tr.offsetTop-bodyWrapper.clientHeight + tr.clientHeight
      }
    },
    /**
     * 显示时间选择器
     */
    showTimePicker() {
      if (this.importDataNoSave) {
        this.$confirm('当前数据未保存，是否继续', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.importDataNoSave = false
          this.datePicker = new Date(this.searchDate)
          this.pickerFlag = true
        }).catch(() => {
          return Promise.reject()
        })
      } else {
        this.datePicker = new Date(this.searchDate)
        this.pickerFlag = true
      }
    },
    /**
     * 时间选择器
     * @param {*} picker
     * @param {*} value
     * @param {*} index
     */
    changeTime(picker) {
      this.datePicker = new Date(picker.getValues().join('-'))
    },
    /**
     * 时间选择
     */
    onConfirm() {
      this.pickerFlag = false
      this.searchDate = this.$dayjs(this.datePicker).format('YYYY-MM-DD HH:mm:ss')
      this.currTime = this.$dayjs(this.datePicker).format('HH:mm')
      this.changeDateShift()
    },
    /**
     * 获取
     */
    getAvailableTime() {
      return new Promise((resolve, reject) => {
        moniitemRecord_findAvailableTime({
          endDateTime: this.endTime,
          icuRecordId: this.patientInfo.icuRecordId,
          startDateTime: this.startTime,
          wardCode: this.currentUserWard.wardCode
        }).then(res => {
          resolve(res.data || [])
        })
      })
    },
    /**
     * 获取记录
     */
    async getMoniitemRecordList() {
      const _moniitemRecord_findMoniItemRecord = await moniitemRecord_findMoniItemRecord({
        'wardCode': this.currentUserWard.wardCode,
        'monitypeCode': this.mainMenu[this.activeIndex].monitypeCode,
        'monitypeName': this.mainMenu[this.activeIndex].monitypeName,
        'icuRecordId': this.patientInfo.icuRecordId,
        'busiTypeDictCode': '2',
        'busiTypeDictName': '监护数据',
        'pageNum': 1,
        'pageSize': 1000,
        'startDateTime': this.startTime,
        'endDateTime': this.endTime
      })
      const tempChidren = _.cloneDeep(this.children)
      tempChidren.forEach(item => { // 评估单
        item.dataSourceDict = _moniitemRecord_findMoniItemRecord.data.find(moni => moni.moniitemCode == item.moniitemCode)?.dataSourceDict
        if (item.dataSourceDict == '7') { // 个人监护项中没有数据来源
          const formInfo = _moniitemRecord_findMoniItemRecord.data.find(moni => moni.moniitemCode == item.moniitemCode)
          item.formId = formInfo.formId
        }
        const moduleItemList = _moniitemRecord_findMoniItemRecord.data.find(moni => moni.moniitemCode == item.moniitemCode)?.moduleItemList || []
        const recordList = moduleItemList.length > 0 ? _.keyBy(moduleItemList, 'recordTime') : {}
        item.recordList = {}
        item.warnColor = {}
        for (const time of this.timeList) { // 查看表格处显示数据  将每个监护项对应时间的值 以为预警颜色 计算好
          if (recordList && recordList[time] && moduleItemList.length > 0) {
             if (item.contentTypeDict == '5') {
              item['recordList'][time] = recordList[time]?.moniitemValue == '1' ? '✔' : ''
              item['warnColor'][time] = ''
             } else {
              item['recordList'][time] = recordList[time]?.moniitemContent || recordList[time]?.moniitemValue || ''
              item['warnColor'][time] = backgroundColorFn('#333', recordList[time]?.moniitemValue, item)
             }
          } else {
             item['recordList'][time] = ''
             item['warnColor'][time] = '#333'
          }
        }
        item.moduleItemList = moduleItemList
      })
      this.children = tempChidren
      const doListRe = tempChidren.filter(item => item.contentTypeDict == 'doList')
      if (doListRe.length > 0) {
        this.value[this.mainMenu[this.activeIndex].monitypeCode + '_doList'] = JSON.stringify(_moniitemRecord_findMoniItemRecord.data.filter(item => item.contentTypeDict == '5' && item.moduleItemList.length == 1).map(item => item.moniitemCode) || [])
      }
      // 对应分类下面的执行项目
      _moniitemRecord_findMoniItemRecord.data.forEach(item => {
        if (item.moduleItemList.length > 0) {
          this.value[item.moniitemCode] = item.moduleItemList[0].moniitemValue
          this.moniitemRecordId[item.moniitemCode] = item.moduleItemList[0].moniitemRecordId
        } else {
          this.value[item.moniitemCode] = ''
          this.moniitemRecordId[item.moniitemCode] = ''
        }
      })
    },
    getTableMoniitemList() {
      const pro = this.mainMenu.map(item => {
        return moniitemRecord_findMoniItemRecord({
          'wardCode': this.currentUserWard.wardCode,
          'monitypeCode': item.monitypeCode,
          'monitypeName': item.monitypeName,
          'icuRecordId': this.patientInfo.icuRecordId,
          'busiTypeDictCode': '2',
          'busiTypeDictName': '监护数据',
          'pageNum': 1,
          'pageSize': 1000,
          'startDateTime': this.startTime,
          'endDateTime': this.endTime
        })
      })
      Promise.all(pro).then(res => {
        let tempChidren = []
        this.mainMenu.forEach((item, mIndex) => {
          item.children.forEach(item => { // 评估单
            item.dataSourceDict = res[mIndex].data.find(moni => moni.moniitemCode == item.moniitemCode)?.dataSourceDict || item.dataSourceDict
            if (item.dataSourceDict == '7') { // 个人监护项中没有数据来源
              const formInfo = res[mIndex].data.find(moni => moni.moniitemCode == item.moniitemCode)
              item.formId = formInfo.formId
            }
            const moduleItemList = res[mIndex].data.find(moni => moni.moniitemCode == item.moniitemCode)?.moduleItemList || []
            const recordList = moduleItemList.length > 0 ? _.keyBy(moduleItemList, 'recordTime') : {}
            item.recordList = {}
            item.warnColor = {}
            for (const time of this.timeList) { // 查看表格处显示数据  将每个监护项对应时间的值 以为预警颜色 计算好
              if (recordList && recordList[time] && moduleItemList.length > 0) {
                if (item.contentTypeDict == '5') {
                  item['recordList'][time] = recordList[time]?.moniitemValue == '1' ? '✔' : ''
                  item['warnColor'][time] = ''
                } else {
                  item['recordList'][time] = recordList[time]?.moniitemContent || recordList[time]?.moniitemValue || ''
                  item['warnColor'][time] = backgroundColorFn('#333', recordList[time]?.moniitemValue, item)
                }
              } else {
                item['recordList'][time] = ''
                item['warnColor'][time] = '#333'
              }
            }
            item.moduleItemList = moduleItemList
          })
          tempChidren = tempChidren.concat(item.children)
        })
        this.tableData = tempChidren.filter(item => item.dataSourceDict != 'doList')
        this.$refs?.table?.doLayout()
        this.$refs?.table?.bodyWrapper?.removeEventListener('scroll', this.debounceScroll)
        this.$refs?.table?.bodyWrapper?.addEventListener('scroll', this.debounceScroll) // 这个地方不能加 光标图片有问题 左右键切换光标会
        this.tableLoading = false
      })
    },
    /**
     * 表格合并单元格
     */
    arraySpanMethod({ rowIndex, columnIndex }) {
      if (!this.tableData[rowIndex].dataSourceDict) {
        if (columnIndex === 0) {
          return [1, this.timeList.length + 1]
        }
      }
    },
    rowClassName({ rowIndex }) {
      if (!this.tableData[rowIndex].dataSourceDict) {
        return 'moniTypeName'
      } else return ''
    },
    /**
     *
     * @param {监护项code} code
     * @param {选择类型数据 给出对应的值和content} valueObj
     */
    saveRecord(code, valueObj) {
      if (valueObj) {
        this.value[code] = valueObj.value
      }
      const content = valueObj ? valueObj.content : ''
      const abbr = valueObj ? valueObj.abbr : ''
      const moniitemName = this.children.find(item => item.moniitemCode == code).moniitemName
      const query = {
        moniitemValue: valueObj ? valueObj.value : this.value[code],
        moniitemCode: code,
        moniitemName: moniitemName,
        icuRecordId: this.patientInfo.icuRecordId,
        recordTime: this.searchDate,
        moniitemContent: content,
        moniitemAbbr: abbr,
        updateCode: this.userInfo.userName,
        updateCodeName: this.userInfo.name
      }
      if (this.moniitemRecordId[code]) {
        query.moniitemRecordId = this.moniitemRecordId[code]
      }
      moniitemRecord_save(query).then(res => {
        if (res.code == 0) {
          this.moniitemRecordId[res.data.moniitemCode] = res.data.moniitemRecordId
        }
      })
    },
    /**
     * 清空数据
     * @param {*} code
     */
    clearMoniitemValue(code) {
      this.value[code] = ''
      this.saveRecord(code, { value: this.value[code] })
    },
    /**
     * 显示评估单
     */
    showAssement(row, code) {
      if (this.searchDate == '') {
        this.$message.warning('先选择时间')
        return
      }
      if (!row.formId) {
        this.$message.warning('请配置对应评估单')
        return
      }
      const sourceKey = row.moduleItemList.length > 0 ? row.moduleItemList[0]?.sourceKey : ''
      this.patientAssessmentData = {
        obj: row, // this.children.find(item => item.moniiitemCode == code),
        time: this.searchDate,
        moniitemValue: this.value[code],
        sourceKey: sourceKey || ''
      }
      this.patientAssessmentVisible = true
    },
    /**
     * 评估单保存后回显问题
     */
    patientAssessmentCallback(e) {
      this.value[e.moniItemRecord.moniitemCode] = e.totalScore
      this.debounceGetMoniitemData() // 评估单保存后需要获取id
    },
    /**
     * 批量保存数据
     */
    batchSaveMoniitem() {
      let query = this.children.map(item => {
        const obj = { ...item }
        obj['icuRecordId'] = this.patientInfo.icuRecordId
        obj['moniitemCode'] = item.moniitemCode
        obj['moniitemValue'] = this.value[item.moniitemCode]
        obj['recordTime'] = this.searchDate
        let moniitemContent = ''
        if (item.contentTypeDict == '3' && this.value[item.moniitemCode]) {
          const value = this.value[item.moniitemCode]
          moniitemContent = this.dictCodeList[item.valueDictCode].filter(item => value == item.dictCode && item.statusDict == '1')?.map(item => item.dictName).toString() || ''
        } else if (item.contentTypeDict == '4' && this.value[item.moniitemCode]) {
          const arr = JSON.parse(this.value[item.moniitemCode])
          moniitemContent = this.dictCodeList[item.valueDictCode].filter(item => arr.includes(item.dictCode) && item.statusDict == '1').map(item => item.dictName).toString()
        }
        delete obj.moduleItemList
        delete obj.recordList
        obj['moniitemContent'] = moniitemContent
        return obj
      })
      query = query.filter(item => item.moniitemValue && item.contentTypeDict != 'doList')
      if (query.length > 0) {
        moniitemRecord_batchSaveRecords(query).then(res => {
          this.importDataNoSave = false
          if (res.code == 0) { this.$message.success('保存成功') }
        })
      } else {
        this.$message.info('无数据可保存')
      }
    },
    /**
     * 引入上次数据
     */
    importLastData() {
      const moniitemCodes = this.children.map(item => item.moniitemCode)
      moniitemRecord_getRecentMoniRecord({
        icuRecordId: this.patientInfo.icuRecordId,
        moniitemCodeList: moniitemCodes
      }).then(res => {
        if (res.code == 0) {
          const doListValue = []
          const doList = this.children.find(item => item.contentTypeDict == 'doList')?.doList || []
          doList?.forEach(item => {
            if (res.data[item.moniitemCode] && res.data[item.moniitemCode] == '1') {
              this.importDataNoSave = true
              doListValue.push(item.moniitemCode)
            }
          })
          if (doListValue) {
            this.value[this.mainMenu[this.activeIndex].monitypeCode + '_doList'] = JSON.stringify(doListValue)
          }

          this.children.forEach(item => {
            if (item.dataSourceDict !== '7' && item.dataSourceDict) {
              if (res.data[item.moniitemCode]) {
                this.importDataNoSave = true
                this.value[item.moniitemCode] = res.data[item.moniitemCode]
              }
            }
          })
        }
      })
    },
    /**
     * 自动获取数据
     */
    autoGetMoniitem() {
      moniitemRecord_autoGetMoniItemRecordByTime({
        icuRecordId: this.patientInfo.icuRecordId,
        recordTime: this.searchDate
      }).then(res => {
        if (res.data && res.code == 0) {
          const monitypeCode = this.mainMenu[this.activeIndex].monitypeCode
          const moduleItemList = res.data.filter(item => item.monitypeCode == monitypeCode).moduleItemList
          moduleItemList?.forEach(item => {
            if (item.moniitemValue) this.importDataNoSave = true
            this.value[item.moniitemCode] = item.moniitemValue || '1'
          })
        }
      })
    },
    gotoToday() {
      this.searchDate = this.$dayjs().format('YYYY-MM-DD')
      this.changeDateShift()
    },
    /**
     * 前一天
     */
    gotoPreDay() {
      this.searchDate = this.$dayjs(this.$dayjs(this.searchDate).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      this.changeDateShift()
    },
    /**
    * 后一天
    * */
    gotoNextDay() {
      this.searchDate = this.$dayjs(this.$dayjs(this.searchDate).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      this.changeDateShift()
    },
    /**
     * 滚动条滑动 防抖处理 隐藏焦点框
     */
    debounceScroll() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const bodyWrapper = this.$refs.table.$el.querySelector('.el-table__body')
        const trList = bodyWrapper.querySelectorAll('tr')
        let rowIndex = 0
        for (let i = 0; i < trList.length; i++) {
          if (trList[i].offsetTop > this.$refs.table.bodyWrapper.scrollTop) {
            rowIndex = i - 1 < 0 ? 0 : i - 1
            break
          }
        }
        const monitypeCode = this.tableData[rowIndex].monitypeCode || this.tableData[rowIndex].moniitemCode
        this.activeIndex = this.mainMenu.findIndex(item => item.monitypeCode == monitypeCode) + ''
      }, 1000)
    }
  }
}

</script>
<style lang="scss">
.moniData .list input::-webkit-outer-spin-button,
.moniData .list input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.moniData .list input[type="number"] {
  -moz-appearance: none;
}
</style>
<style lang='scss' scoped>
.Header {
  background-color: #fff;
  justify-content: left;
  padding: 0 rem(15);
  position: fixed;
  z-index: 9;
  background-color: #fff;
  justify-content: left;
  box-shadow: 0 10px 20px rgba(0, 0, 0, .1);

}

.moniData {
  width: 100vw;
  display: flex;
  background-color: #fff;

  // background-color: #fff;
  ::v-deep .el-menu {

    border-right: none;

    &-item {
      font-weight: 800;
      height: 100%;
    }
  }

  &_left {
    width: 112px;
    height: calc(100% - rem(16));
    background-color: #fff;
    padding: 0;
    margin: rem(8);

    .menu {
      margin-top: rem(2);
      height: calc(100% - 34px - rem(2));

      ::v-deep .el-tabs__item {
        width: 110px;
      }

      ::v-deep .el-tabs--left .el-tabs__item.is-left {
        text-align: center;
      }
    }
  }

  .main {
    width: calc(100% - 112px);
    height: calc(100% - rem(16));
    overflow-y: hidden;
    padding: rem(8);
    margin: rem(8) rem(8) rem(8) 0;
    background-color: #fff;

    .searchTime {

      ::v-deep .el-button--primary,
      .el-button--info {
        width: rem(26);
        height: rem(26);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: rem(12);
      }
    }

    // .timePicker {
    //   // align-items: baseline;
    //   // ::v-deep .el-button--primary,
    //   // .el-button--info {
    //   //   width: rem(24);
    //   //   height: rem(24);
    //   //   display: flex;
    //   //   justify-content: center;
    //   //   align-items: center;
    //   //   font-size: rem(12);
    //   // }
    // }
    .list {
      padding: rem(10) 0;
      height: calc(100% - rem(40));
      overflow-y: auto;
    }

    .table {
      padding: rem(10) 0;
      height: calc(100% - rem(15));
      overflow: hidden;
      position: relative;
      ::v-deep .el-table .moniTypeName{
        background-color: var(--maincolor4) !important;
      }
    }

    .line {
      min-height: rem(36);
      background: #fff;
      // border-bottom:1px solid #ddd;
    }

    .title {
      width: rem(120);
      height: rem(32);
      box-sizing: border-box;
      align-items: center;
      padding-left: rem(10);
      font-weight: 600;
      // word-break: keep-all;
      text-align: left;
      overflow: hidden;
      margin-right: rem(5);

      >.unit {
        font-size: rem(12);
        color: #999;
      }
    }

    .assement {
      color: #c8c9cc;
      font-size: rem(12);
      padding: rem(10) rem(16);
      font-size: 600;
      text-align: left;

    }

    ::v-deep .van-cell {
      background-color: transparent;
    }
  }
}

.rightBar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 100%;
  padding: rem(20) 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: rem(6) solid #2d5afa;

  >div {
    background-color: #fff;
    padding: rem(8) rem(12);
    border-radius: rem(20) 0 0 rem(20);
    box-shadow: -2px 0px 8px rgba(0, 0, 0, 0.4);
    margin-bottom: rem(5);
    box-sizing: border-box;
    width: rem(50);
    position: relative;
    font-size: rem(12);
  }

  .active {
    background-color: #2d5afa;
    color: #fff;
    right: rem(-2);
    width: rem(60);
    z-index: 99;
    padding-left: rem(15);

    &::before {
      content: '';
      background-image: url('/static/svg/sector.svg');
      position: absolute;
      right: rem(-2);
      top: rem(-16);
      width: rem(20);
      height: rem(20);
      color: #2d5afa;
      // transform: translate(50px, 50px);
      // background-color:  var(--maincolor);
      // /* 针对不支持渐变的浏览器 */
      // background-image: radial-gradient(to bottom right, rgba(255,255,255,0),  var(--maincolor));
    }

    &::after {
      content: '';
      background-image: url('/static/svg/sector.svg');
      transform: scaleY(-1);
      position: absolute;
      right: rem(-2);
      bottom: rem(-16);
      width: rem(20);
      height: rem(20);
    }
  }

}

.rightBarBox {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 100%;
  width: rem(6);
  background-image: linear-gradient(180deg, rgba(0, 0, 0, .1) 0%, var(--maincolor) 50%, rgba(0, 0, 0, 0.1) 100%);
  // box-shadow: 0 0 10px #00000030;
}
</style>
