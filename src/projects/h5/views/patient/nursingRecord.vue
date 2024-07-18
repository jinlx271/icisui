<template>
    <div class="nurseingRecord" >
      <div class="formList">
        <el-button v-for="(item, index) in tempList" :key="index"  :class="item.tempId==tempId?'active':' '" @click="changeTableLeft(item,true)" size="small" type="primary" plain round>
          {{ item.tempName }}
        </el-button>
      </div>
        <!-- <NurseRecord :dataType="2" :returnType="2" modeType="2"  :startTime.sync="startTime"
          @loadFinish="pageDataLoadFlag = true" @startLoad="pageDataLoadFlag = false"
          @dataLoadError="pageDataLoadFlag = true" :endTime.sync="endTime" :tempId.sync="tempId"
          ref="container" :offSetWidth.sync="offSetWidth"  :offSetHeight="offSetHeight"></NurseRecord> -->
    </div>
</template>
<script>
// import NurseRecord from '@/views/patient/components/nurseingRecord/components/nurseRecord.vue'
import { getTmpDocWardListByWardCode } from '@/api/anas'
import { mapGetters } from 'vuex'
import patientInfoCompute from '@/mixins/patientInfoCompute'
export default {
  mixins: [patientInfoCompute],
  computed: {
    ...mapGetters([
      'userInfo',
      'patientInfo',
      'currentUserWard',
      'currWardShiftInfo'
    ])
  },
  components: { },
  data() {
    return {
      tempList: [
      ],
      searchDate: '',
      startTime: '',
      endTime: '',
      tempId: '',
      currTemp: {},
      shiftList: [],
      pageDataLoadFlag: false,
      offSetWidth: 0,
      vanPull: false
    }
  },
  mounted() {
      const self = this
      this.$bus.$on('updateSearchData', function (date) {
          if (date) {
            self.searchDate = date
            if (self.tempList.length > 0) {
              self.searchDateFormat()
              self.$nextTick(() => {
                self.$refs?.container?.$refs.printContent?.componentListFormat()
              })
            }
          }
      })
      window.onresize = function () {
          self.offSetWidth = document.body.offsetWidth
          self.offSetHeight = (document.body.offsetHeight - 170) + 'px'
      }
  },
  created() {
    this.offSetWidth = document.body.offsetWidth
    this.offSetHeight = (document.body.offsetHeight - 170) + 'px'
    this.shiftList = this.currWardShiftInfo
    this.computeLeaveTimeInfo()
    this.computeIcuTimeInfo()
    this.searchDate = this.leaveTimeInfo.leaveShiftDay
    this.getTempList()
  },
  methods: {
     /**
      * 下拉刷新数据
      */
    onRefresh() {
      this.vanPull = true
      this.searchDateFormat()
      this.$nextTick(() => {
        this.vanPull = false
        this.$refs?.container?.$refs.printContent?.componentListFormat()
      })
    },
    searchDateFormat() {
      if (!this.shiftList) return
      const shiftTime0 = this.searchDate + ' ' + this.shiftList[0].startTime
      this.startTime = this.searchDate + ' ' + this.shiftList[0].startTime
      this.endTime = this.searchDate + ' ' + this.shiftList[this.shiftList.length - 1].endTime
      const firstShiftTime = this.$dayjs(shiftTime0).valueOf()
      const endTimeSecond = this.$dayjs(this.endTime).valueOf()
      const startTimeSecond = this.$dayjs(this.startTime).valueOf()
      if (startTimeSecond < firstShiftTime) { // 与第一个班次比较
        this.startTime = this.$dayjs(startTimeSecond + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
        this.endTime = this.$dayjs(endTimeSecond + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else if (endTimeSecond <= startTimeSecond) {
        this.endTime = this.$dayjs(endTimeSecond + 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.searchDate == this.leaveTimeInfo.leaveShiftDay) { // 出区班次日期
          if (this.currTemp.leaveTimeRule && this.currTemp.leaveTimeRule == '1') { // 截止出区时间点
            this.endTime = this.leaveTimeInfo.icuLeaveTime
          } else {
            this.endTime = this.leaveTimeInfo.leaveShiftDateTime
          }
      }
      if (this.searchDate == this.icuTimeInfo.icuAreaShiftDay) { // 查询日期为 入区所在班次的日期
          if (this.currTemp.inAreaTimeRule && this.currTemp.inAreaTimeRule == '1') { // 入区时间
            this.startTime = this.icuTimeInfo.icuAreaTime
          } else {
            this.startTime = this.icuTimeInfo.icuAreaShiftDateTime
          }
      }
    },
    /**
     * 获取当前病区的文书摸板列表
     */
     getTempList() {
      const query = { wardCode: this.currentUserWard.wardCode, tempType: '1' }
      getTmpDocWardListByWardCode(query).then(res => {
        const list = res.data.filter(item => item.docStatusDict == '1' && item.statusDict == '1')// 中间表格数据集合
        this.tempList = list
        // 切换患者,搜索条件保存
        if (list.length > 0) {
          this.changeTableLeft(list[0])
        } else {
          this.$message.error('请先设置文书')
        }
      })
    },
    /**
      切换左侧文书模板列表
      */
    changeTableLeft(item, flag) {
      if (!this.pageDataLoadFlag && flag) {
        this.$message.info('页面正在加载中，请稍后重试...')
        return
      }
      this.currTemp = JSON.parse(JSON.stringify(item))
      this.scrollTop = 0
      this.searchDateFormat()
      this.tempId = this.currTemp.tempId
    }
  },
  beforeDestroy() {
      this.$bus.$off('updateSearchData')
  }
}
</script>
<style lang="scss" scoped>
.nurseingRecord {
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  background:#fff;
  .formList {
    width: 100%;
    text-align: left;
    padding: 0.5rem;
    display: inline-flex;
    overflow-x: auto;
    .active{
      color: #fff !important;
      background:var(--maincolor) !important;
    }
    .el-button--primary.is-plain {
      color: var(--maincolor);
      border-color: var(--maincolor);
      background:var(--maincolor4);
    }
  }
}
</style>
