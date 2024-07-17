import { mapGetters } from 'vuex'
import { analyzeIDCard } from '@/utils/utils'
import _ from 'lodash'
// const { body } = document
export default {
  data: function () {
    return {
      XTCS0093: '0',
      leaveTimeInfo: {},
      icuTimeInfo: {}
    }
  },
  computed: {
    ...mapGetters(['patientInfo']),
    outTreatFlag: function () {
      return this.currPatient.outTreatFlag || '0'
    },
    currPatient: function () {
      // currPatientInfo为 组件传进来的 患者信息  patientInfo为保存
      return this.currPatientInfo || this.patientInfo
    },
    // 过敏标志
    allergyFlag: function () {
      return this.currPatient?.allergyFlag || '0'
    },
    // 过敏列表
    allergyList: function () {
      return this.currPatient?.allergyList || []
    },
    // 过敏信息
    allergyInfo: function () {
      return this.currPatient?.allergyList?.map((item) => item.allergyName).toString()
    },
    patientAllergy: function () {
      return this.currPatient?.patientAllergy || ''
    },
    // 患者床位设备列表
    bedDeviceList: function () {
      return this.currPatient?.bedDeviceList || []
    },
    bedId: function () {
      return this.currPatient?.bedId || this.currPatient?.icuInfoEntity?.icuBed
    },
    // 患者床位号
    bedNo: function () {
      return this.currPatient?.bedNo || this.currPatient?.icuInfoEntity?.bedNo
    },
    // 床位状态
    bedStatusDict: function () {
      return this.currPatient?.bedStatusDict || ''
    },
    // 床位类型
    bedTypeDict: function () {
      return this.currPatient?.bedTypeDict || ''
    },
    // 重症级别
    criticalLevelDict: function () {
      return this.currPatient?.criticalLevelDict || this.currPatient?.icuInfoEntity?.criticalLevelDict
    },
    // 诊断信息
    diagList: function () {
      return this.currPatient?.diagList || []
    },
    // 患者id
    icuRecordId: function () {
      return this.currPatient?.icuRecordId || this.currPatient?.icuInfoEntity?.icuRecordId
    },
    // 是否插管标志
    hasCatherFlag: function () {
      return this.currPatient?.hasCatherFlag || '0'
    },
    // 是否有监护仪
    hasMonitorFlag: function () {
      return this.currPatient?.hasMonitorFlag || '0'
    },
    // 是否有压疮数据
    hasSkinFlag: function () {
      return this.currPatient?.hasSkinFlag || '0'
    },
    // 是否有呼吸机
    hasVentilatorFlag: function () {
      return this.currPatient?.hasVentilatorFlag || '0'
    },
    // 是否有待提取医嘱
    hasOrderFlag: function () {
      return this.currPatient?.hasOrderFlag || '0'
    },
    // 诊断信息
    diagInfo: function () {
      let diagInfo = ''
      if (this.currPatient?.diagList) {
        const diagListTemp = _.cloneDeep(this.currPatient?.diagList)
        // 系统里取诊断信息的排序规则：只取诊断类型为1/2的诊断，按优先主辅标识、其次诊断下达时间进行排序（主诊断时间早-主诊断时间晚-辅诊断时间早-辅诊断时间晚）
        // diagListTemp = diagListTemp?.filter(item => ['1', '2'].includes(item.diagTypeDict))
        // diagListTemp = _.orderBy(diagListTemp, ['diagLevelDict', 'diagTime'], ['asc', 'desc']) // 按照时间  以及诊断级别排序
        diagInfo = _.map(diagListTemp, 'diagName').join('、')
        if (this.XTCS0093 == '1') {
          diagInfo = [...new Set(_.map(diagListTemp, 'diagName'))].join('、')
        } else diagInfo = _.map(diagListTemp, 'diagName').join('、')
      }

      return diagInfo || (this.currPatient?.diagName ?? '')
    },
    // 身份证信息
    idNo: function () {
      return this.currPatient.patientEntity.idNo || ''
    },
    // 住院信息
    inpatientDate: function () {
      return this.currPatient.inpatientEntity.inpatientDate
    },
    // 患者性别
    sexDict: function () {
      return this.currPatient?.patientEntity?.sexDict || '3'
    },
    sexDictName: function () {
      return this.currPatient?.patientEntity?.sexDictName || this.currPatient?.sex || '未知'
    },
    // icu状态
    icuStatusDict: function () {
      return this.currPatient?.icuInfoEntity?.icuStatusDict || '0'
    },
    // 患者信息
    patientName: function () {
      return this.currPatient?.patientEntity?.patientName || this.currPatient?.patientName || ''
    },
    patientAge: function () {
      return this.currPatient?.patientEntity?.patientAge || this.currPatient?.patientAge || ''
    },
    weight: function () {
      return this.currPatient?.icuInfoEntity?.weight
    },
    weightRemark: function () {
      return this.currPatient?.icuInfoEntity?.weightRemark
    },
    height: function () {
      return this.currPatient?.icuInfoEntity?.height
    },
    birthday: function () {
      if (!this.currPatient?.patientEntity?.birthday && this.currPatient?.patientEntity?.idNo) {
        return analyzeIDCard(this.currPatient?.patientEntity?.idNo).birthday || ''
      } else if (this.currPatient?.patientEntity?.birthday) {
        return this.$dayjs(this.currPatient?.patientEntity?.birthday).format('YYYY-MM-DD') || ''
      }
    },
    // 住院号
    mrn: function () {
      return this.currPatient?.inpatientEntity?.mrn || this.currPatient?.mrn || ''
    },
    // 入区时间
    icuAreaTime: function () {
      return this.currPatient?.icuInfoEntity?.icuAreaTime || this.currPatient?.icuAreaTime || ''
    },
    inpatientId: function () {
      return this.currPatient?.inpatientEntity?.inpatientId || this.currPatient?.icuInfoEntity?.inpatientId
    },
    patientNo: function () {
      return this.currPatient?.patientEntity?.patientNo
    },
    // apachII评分
    apacheiiScope: function () {
      return this.currPatient?.icuInfoEntity?.apacheiiScope
    },
    // 主任医师
    icuArchiaterDocCode: function () {
      return this.currPatient?.icuInfoEntity?.icuArchiaterDocCode
    },
    icuArchiaterDocName: function () {
      return this.currPatient?.icuInfoEntity?.icuArchiaterDocName
    },
    // icu 病区
    icuAreaCode: function () {
      return this.currPatient?.icuInfoEntity?.icuAreaCode
    },
    icuAreaName: function () {
      return this.currPatient?.icuInfoEntity?.icuAreaName
    },
    icuAreaOperatorCode: function () {
      return this.currPatient?.icuInfoEntity?.icuAreaOperatorCode
    },
    icuAreaOperatorName: function () {
      return this.currPatient?.icuInfoEntity?.icuAreaOperatorName
    },
    // 副主任医师
    icuAssociateDocCode: function () {
      return this.currPatient?.icuInfoEntity?.icuAssociateDocCode
    },
    // 副主任医师
    icuAssociateDocName: function () {
      return this.currPatient?.icuInfoEntity?.icuAssociateDocName
    },
    // 主治操作
    icuAttendingDocCode: function () {
      return this.currPatient?.icuInfoEntity?.icuAttendingDocCode
    },
    icuAttendingDocName: function () {
      return this.currPatient?.icuInfoEntity?.icuAttendingDocName
    },
    // 管床护士
    icuBedNurseCode: function () {
      return this.currPatient?.icuInfoEntity?.icuBedNurseCode
    },
    icuBedNurseName: function () {
      return this.currPatient?.icuInfoEntity?.icuBedNurseName
    },
    // 责任护士
    icuPrimaryNurseCode: function () {
      return this.currPatient?.icuInfoEntity?.icuPrimaryNurseCode
    },
    icuPrimaryNurseName: function () {
      return this.currPatient?.icuInfoEntity?.icuPrimaryNurseName
    },
    // 住院医师
    icuResidentDocCode: function () {
      return this.currPatient?.icuInfoEntity?.icuResidentDocCode
    },
    icuResidentDocName: function () {
      return this.currPatient?.icuInfoEntity?.icuResidentDocName
    },
    // 死亡时间
    icuDeathTime: function () {
      return this.currPatient?.icuInfoEntity?.icuDeathTime
    },
    // 转入病区
    icuLeaveAreaCode: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveAreaCode
    },
    icuLeaveAreaName: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveAreaName
    },
    // 转入科室
    icuLeaveDeptCode: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveDeptCode
    },
    icuLeaveDeptName: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveDeptName
    },
    // icuLeaveInfo: null
    // 注意事项
    icuLeaveNote: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveNote
    },
    // icuLeaveOperatorCode: null
    // icuLeaveOperatorName: null
    // 出区时间
    icuLeaveTime: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveTime
    },
    // 出区状态
    icuLeaveToDict: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveToDict
    },
    // 出区类型
    icuLeaveToType: function () {
      return this.currPatient?.icuInfoEntity?.icuLeaveToType
    },
    // 入区序号
    icuNo: function () {
      return this.currPatient?.icuInfoEntity?.icuNo
    },

    // 患者来源
    icuSourceDict: function () {
      return this.currPatient?.icuInfoEntity?.icuSourceDict
    },
    // 原病区
    originalAreaCode: function () {
      return this.currPatient?.icuInfoEntity?.originalAreaCode
    },
    originalAreaName: function () {
      return this.currPatient?.icuInfoEntity?.originalAreaName
    },
    // 原科室
    originalDeptCode: function () {
      return this.currPatient?.icuInfoEntity?.originalDeptCode
    },
    originalDeptName: function () {
      return this.currPatient?.icuInfoEntity?.originalDeptName
    },

    hisInpatientId: function () {
      return this.currPatient?.inpatientEntity?.hisInpatientId
    },
    inpatientDeptCode: function () {
      return this.currPatient?.inpatientEntity?.inpatientDeptCode
    },
    inpatientDeptName: function () {
      return this.currPatient?.inpatientEntity?.inpatientDeptName
    }
  },
  watch: {},

  beforeMount() {},
  mounted() {},
  created() {},
  methods: {
    computeLeaveTimeInfo() { // 计算出区时间所在班次的日期
      const icuLeaveTime = this?.icuLeaveTime || this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      let leaveShiftTime, leaveShiftDate
      if (this.$dayjs(icuLeaveTime).valueOf() < this.$dayjs(icuLeaveTime.split(' ')[0] + ' ' + this.shiftList[0].startTime).valueOf()) {
        leaveShiftTime = icuLeaveTime.split(' ')[0] + ' ' + this.shiftList[this.shiftList.length - 1].endTime
        leaveShiftDate = this.$dayjs(this.$dayjs(leaveShiftTime).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      } else {
        const timeValue = this.$dayjs(icuLeaveTime.split(' ')[0] + this.shiftList[this.shiftList.length - 1].endTime).valueOf()
        leaveShiftTime = this.$dayjs(timeValue + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        leaveShiftDate = this.$dayjs(timeValue).format('YYYY-MM-DD')
      }
      this.leaveTimeInfo = {
        icuLeaveTime: icuLeaveTime, // 实际出区时间
        leaveShiftDateTime: leaveShiftTime, // 出区时间所在班次的结尾时间
        leaveShiftDay: leaveShiftDate // 出区所在班次的日
      }
    },
    computeIcuTimeInfo() { // 计算入区时间信息 实际入区时间 所在班次
      const icuAreaTimeValue = this.$dayjs(this?.icuAreaTime).valueOf()
      const shiftValue = this.$dayjs(this?.icuAreaTime.split(' ')[0] + ' ' + this.shiftList[0].startTime).valueOf()
      let startTime
      if (icuAreaTimeValue < shiftValue) { // 入区时间处于晚班
        startTime = this.$dayjs(this.$dayjs(this?.icuAreaTime.split(' ')[0] + ' ' + this.shiftList[0].startTime).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else {
        startTime = this.icuAreaTime.split(' ')[0] + ' ' + this.shiftList[0].startTime
      }
      this.icuTimeInfo = {
        icuAreaTime: this.icuAreaTime, // 实际入区时间
        icuAreaShiftDateTime: startTime, // 入区时间所在班次的结尾时间
        icuAreaShiftDay: startTime.split(' ')[0] // 入区所在班次的日
      }
    }
  }
}
