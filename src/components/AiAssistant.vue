<template>
  <div v-if="show" class="ai-btn" :class="{ disabled }" @click="!disabled && handleAiAssistant()">
    <svg-icon icon-class="ai" width="100%" height="100%"></svg-icon>
  </div>
</template>

<script>
import { timeToTimestamp } from '@/utils/utils'
import {
  shiftChange_getShiftChangeContent
} from '@/api/shiftExchange'
import {
  morningChange_getGptContent
} from '@/api/inpatienArea'
import {
  nurseRecord_getFirstNurseContentByGpt
} from '@/api/nurseRecord'
import { mapGetters } from 'vuex'
export default {
  name: 'AiAssistant',
  props: {
    scene: {
      type: String,
      default: ''
    },
    icuRecordId: {
      type: String
    },
    form: {
      type: Object,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      XTCS0089: '0', // 重要交班内容交班模式
      XTCS0118: {
        enable: 0
      },
      recordTime: '',
      shiftList: [],
      completeShift: {},
      loadingTimer: null,
      loadingText: ''
    }
  },
  inject: ['recordTimeFn', 'shiftListFn', 'addFormFn'],
  computed: {
    ...mapGetters(['userInfo', 'currentUserWard', 'patientInfo']),
    addForm() {
      return this.addFormFn()
    }
  },
  created() {
    Promise.all([
      this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0089' }),
      this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0118' }),
      this.$batchGetDictItemList(['ICIS_DICT_GPT_SCENE'])
    ]).then(res => {
      this.XTCS0089 = res[0][0]?.paramValue || this.XTCS0089
      this.XTCS0118 = res[1][0]?.paramValue ? JSON.parse(res[1][0]?.paramValue) : this.XTCS0118
      const { ICIS_DICT_GPT_SCENE } = res[2]
      this.ICIS_DICT_GPT_SCENE = ICIS_DICT_GPT_SCENE || []
      const scene = this.XTCS0118?.scene ? this.XTCS0118.scene.split(',') : []
      this.show = !!+this.XTCS0089 && !!+this.XTCS0118.enable && scene.includes(this.scene)
      const time = this.recordTimeFn() || new Date()
      this.recordTime = this.$dayjs(time).format('YYYY-MM-DD')
      this.shiftList = this.shiftListFn()
      this.completeShift = {
        shiftName: '全班',
        sortNo: 0,
        startTime: this.shiftList[0].startTime,
        endTime: this.shiftList[this.shiftList.length - 1].endTime,
        shiftCode: 'D'
      }
    })
  },
  methods: {
    handleAiAssistant() {
      // this.setLoadingTimer()
      this.$emit('successGetAiSuggest', '数据获取中')
      // 床旁交班GPT
      if (this.scene == 1) {
        // 获取S、B、A、R内容并返回
        const recordTime = this.$dayjs(this.addForm.changeDate).format('YYYY-MM-DD') || this.$dayjs().format('YYYY-MM-DD')
        let hhmm = new Date().getTime()
        if (recordTime != this.$dayjs().format('YYYY-MM-DD')) {
          hhmm = this.$dayjs(recordTime).valueOf()
        }
        const shiftList = this.shiftListFn()
        let shiftObj = shiftList.filter(v => {
          const startTime = timeToTimestamp(v.startTime) >= timeToTimestamp(shiftList[0].startTime) ? new Date(recordTime + ' ' + v.startTime).getTime() : new Date(recordTime + ' ' + v.startTime).getTime() + 3600000 * 24
          const endTime = timeToTimestamp(v.endTime) > timeToTimestamp(shiftList[0].startTime) ? new Date(recordTime + ' ' + v.endTime).getTime() : new Date(recordTime + ' ' + v.endTime).getTime() + 3600000 * 24
          v.startDateTime = startTime
          v.endDateTime = endTime
          if (this.addForm.fromShiftCode) {
            return v.shiftCode == this.addForm.fromShiftCode
          } else {
            return startTime <= hhmm && hhmm < endTime
          }
        })
        if (!shiftObj.length) {
          shiftObj = [shiftList[0]]
        }
        const query = {
          icuRecordId: this.icuRecordId,
          startTime: this.$dayjs(shiftObj[0].startDateTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: this.$dayjs(shiftObj[0].endDateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        shiftChange_getShiftChangeContent(query).then(res => {
          clearInterval(this.loadingTimer)
          if (res.code === 0) {
            this.$emit('successGetAiSuggest', res.data)
          } else {
            this.$emit('successGetAiSuggest', '')
          }
        })
      } else if (this.scene == 2) {
        // 晨会交班GPT
        morningChange_getGptContent({ ...this.form }).then(res => {
          clearInterval(this.loadingTimer)
          if (res.code === 0) {
            this.$emit('successGetAiSuggest', res.data)
          } else {
            this.$emit('successGetAiSuggest', '')
          }
        })
      } else if (this.scene == 3) {
        // 获取首次护理记录
        nurseRecord_getFirstNurseContentByGpt(this.icuRecordId).then(res => {
          clearInterval(this.loadingTimer)
          if (res.code === 0) {
            this.$emit('successGetAiSuggest', res.data)
          } else {
            this.$emit('successGetAiSuggest', '')
          }
        })
      } else {
        clearInterval(this.loadingTimer)
        this.$emit('successGetAiSuggest', '')
      }
    },
    setLoadingTimer() {
      if (this.loadingTimer) {
        clearInterval(this.loadingTimer)
      }
      let i = 1
      this.loadingText = ''
      this.loadingTimer = setInterval(() => {
        this.$emit('successGetAiSuggest', `数据获取中${this.loadingText}`)
        if (i > 3) {
          i = 0
          this.loadingText = ''
        } else {
          this.loadingText += '.'
        }
        i++
      }, 500)
    }
  },
  beforeDestroy() {
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer)
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-btn {
  width: 120px;
  height: 32px;
  position: relative;
  color: #FFF;
  margin-left: 5px;
  cursor: pointer;

  &.disabled {
    opacity: 0.5;
    cursor: no-drop;
  }

  .svg-icon {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  span {
    width: 100%;
    padding-left: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}</style>
