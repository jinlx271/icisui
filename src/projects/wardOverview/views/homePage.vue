<template>
  <div v-if="!loading" v-loading="loading" element-loading-text="加载中" id="homepage" class="homepage">
    <div v-for="item in data" :key="item.id" :style="item.style" @dblclick="clickHtml(item.moduleName)">
      <!-- 重点患者情况 -->
      <keyPatients :item="item" v-if="item.id == '202112311108240008' || item.moduleName == '重点患者情况'"> </keyPatients>
      <!-- 本月病区患者情况 -->
      <wardOfThisMonth :item="item" v-else-if="item.id == '202112311110110021' || item.moduleName == '本月病区患者情况'">
      </wardOfThisMonth>
      <!-- 待办事项 -->
      <toDoList :item="item" v-else-if="item.moduleId == '202112311112140034' || item.moduleName == '待办事项'"> </toDoList>
      <!-- Apache II 评分患者分布 -->
      <apacheIIScoringPatients :item="item"
        v-else-if="item.moduleId == '202112311112350035' || item.moduleName == 'Apache II 评分患者分布'">
      </apacheIIScoringPatients>
      <!-- 气管插管患者分布 -->
      <endotrachealIntubation :item="item"
        v-else-if="item.moduleId == '202112311112490036' || item.moduleName == '气管插管患者分布'"></endotrachealIntubation>
      <!-- ICU质控指标 -->
      <iCUQualityControlIndex :item="item"
        v-else-if="item.moduleId == '202112311113070043' || item.moduleName == 'ICU质控指标'"></iCUQualityControlIndex>
      <!-- 患者在区天数统计 -->
      <daysStatistics :item="item" v-else-if="item.moduleId == '202112311113570046' || item.moduleName == '患者在区天数统计'">
      </daysStatistics>
      <!-- 床位使用情况 -->
      <bedUseStatistics :item="item" v-else-if="item.moduleId == '202204111610310946' || item.moduleName == '床位使用情况'">
      </bedUseStatistics>
      <!-- 病区工作量汇总 -->
      <workloadStatistics :item="item" v-else-if="item.moduleId == '202204111610310947' || item.moduleName == '病区工作量汇总'">
      </workloadStatistics>
      <!-- 设备使用情况 -->
      <equipmentStatistics :item="item" v-else-if="item.moduleId == '202204181631310947' || item.moduleName == '设备使用情况'">
      </equipmentStatistics>
      <!-- 本月患者出区状态分布 -->
      <exitStatus :item="item" v-else-if="item.moduleId == '202206081507241353' || item.moduleName == '本月患者出区状态分布'">
      </exitStatus>
      <!-- 患者年龄分布 -->
      <patientAge :item="item" v-else-if="item.moduleId == '202304071500000000' || item.moduleName == '患者年龄分布'">
      </patientAge>
      <!-- Apache II24小时评估分布 -->
      <apacheII24Hour :item="item"
        v-else-if="item.moduleId == '202304101500000001' || item.moduleName == 'Apache II24小时评估分布'"></apacheII24Hour>
      <!-- 当前班次床医比 -->
      <currentShiftPhysician :item="item" :nurseDoctorBedList="nurseDoctorBedList"
        v-else-if="item.moduleId == '202310241333520010' || item.moduleName == '当前班次床医比'"></currentShiftPhysician>
      <!-- 当前班次床护比 -->
      <currentShiftNurses :item="item" :nurseDoctorBedList="nurseDoctorBedList"
        v-else-if="item.moduleId == '202310241333520009' || item.moduleName == '当前班次床护比'"></currentShiftNurses>
      <!-- 设备状态情况 -->
      <equipmentStatus :item="item" v-else-if="item.moduleId == '202407101123500351' || item.moduleName == '设备状态情况'">
      </equipmentStatus>
    </div>
  </div>
</template>

<script>
import keyPatients from './component/keyPatients' // 重点患者情况
import wardOfThisMonth from './component/wardOfThisMonth' // 本月病区患者情况
import apacheIIScoringPatients from './component/apacheIIScoringPatients' // Apache II 评分患者分布
import endotrachealIntubation from './component/endotrachealIntubation' // 气管插管患者分布
import currentShiftPhysician from './component/currentShiftPhysician' // 当前班次医师配备
import currentShiftNurses from './component/currentShiftNurses' // 当前班次护士配备
import daysStatistics from './component/daysStatistics' // 患者在区天数统计
import bedUseStatistics from './component/bedUseStatistics' // 患者在区天数统计
import workloadStatistics from './component/workloadStatistics' // 患者在区天数统计
import toDoList from './component/toDoList' // 待办事项
import iCUQualityControlIndex from './component/iCUQualityControlIndex' // ICU质控指标
import equipmentStatistics from './component/equipmentStatistics' // ICU质控指标
import equipmentStatus from './component/equipmentStatus' // ICU质控指标
import exitStatus from './component/exitStatus' // 本月患者出区状态分布
import patientAge from './component/patientAge' // 患者年龄分布
import apacheII24Hour from './component/apacheII24Hour' // Apache II24小时评估分布
import {
  overview_findOverviewWithPage // 查询
} from '@/api/configuration'
import {
  wardOverview_nurseDoctorBedRatio // 查询
} from '@/api/wardOverview'
import { mapGetters } from 'vuex'
export default {
  name: 'HomePage',
  components: {
    keyPatients,
    wardOfThisMonth,
    apacheIIScoringPatients,
    endotrachealIntubation,
    currentShiftPhysician,
    currentShiftNurses,
    daysStatistics,
    workloadStatistics,
    bedUseStatistics,
    toDoList,
    iCUQualityControlIndex,
    equipmentStatistics,
    exitStatus,
    patientAge,
    apacheII24Hour,
    equipmentStatus
  },
  data: function () {
    return {
      data: [],
      loading: true,
      nurseDoctorBedList: {}
    }
  },
  props: {},
  watch: {
    currentUserWard: function () {
      this.$router.go(0)
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'mainMenu'])
  },
  created() {
    this.init()
  },
  activated() { },
  mounted() { },
  methods: {
    /**
     * 拿数据
     */
    init() {
      overview_findOverviewWithPage({ wardCode: this.currentUserWard.wardCode }).then((res) => {
        // 计算页面的尺寸
        this.computeCss(res.data.result)
        this.loading = false
      })
      wardOverview_nurseDoctorBedRatio({
        wardCode: this.currentUserWard.wardCode,
        curTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }).then(res => {
        this.nurseDoctorBedList = res.data
      })
    },
    /**
     * 计算页面尺寸方法
     */
    computeCss(data) {
      this.data = data.map((item) => {
        item.style = this.computePosition(item)
        return item
      })
    },
    /**
     * 页面计算定位
     * item 一条数据处理
     * item.statusDict // 是否显示
     * item.style // css名称
     * item.yaxis // 起始列
     * item.xaxis // 起始行
     * item.yspan // 占用列
     * item.xspan // 占用行
     * 准备分成4格子.1920 / 4  = 480
     *
     */
    computePosition(item) {
      return {
        display: item.statusDict == '1' ? 'flex' : 'none',
        width: this.computeWidth(item.xspan) + 'vw',
        height: this.computeHeight(item.yspan, item.xspan) + 'px',
        top: this.computeTop(item.xaxis) + 'px',
        left: this.computeLeft(item.yaxis) + 'vw'
      }
    },
    /**
     * 小框 宽度计算
     * @line 占用行
     */
    computeWidth(line) {
      if (line < 1) return 0
      const width = this.vw(463) // 一个宽最小宽度
      return width * line + this.vw(12) * (line - 1)
    },
    /**
     * 小框 高度计算
     * @column 占用列表
     */
    computeHeight(column) {
      if (column < 1) return 0
      /**
       * 本来按ui设计稿来的.但是领导需要整屏显示
       * 974= 1080 - 50(顶部) - (2*16)外边框 - (2*12)内边框
       * const height = 974 / 3 // 一个框最小高度
       */
      const wHeifght = document.body.clientHeight // 屏幕高度
      const height = (wHeifght - 50 - 32 - 24) / 3
      return height * column + 12 * (column - 1)
    },
    /**
     * 小框 定位上下计算
     * @column 起始列
     */
    computeTop(column) {
      const top = 16 // 初始上边距
      /**
       * 本来按ui设计稿来的.但是领导需要整屏显示
       * 974= 1080 - 50(顶部) - (2*16)外边框 - (2*12)内边框
       * const height = 974 / 3 // 一个框最小高度
       */
      const wHeifght = document.body.clientHeight // 屏幕高度
      const height = (wHeifght - 50 - 32 - 24) / 3
      return top + height * (column - 1) + 12 * (column - 1)
    },
    /**
     * 小框 定位左右计算
     * @line 起始行
     */
    computeLeft(line) {
      const left = this.vw(16) // 初始左边距
      const width = this.vw(463) // 一个宽最小宽度
      return left + width * (line - 1) + this.vw(12) * (line - 1)
    },
    /**
     * 计算宽度尺寸
     */
    vw(val) {
      // 设计师屏幕宽度
      const allWidth = 1920
      // 拿设计的宽度把传进来的值百分比
      const calcWidth = (val / allWidth) * 100
      return (calcWidth / (calcWidth * 0 + 1)) * 1
    },
    /**
     * 跳转对应页面
     */
    clickHtml(name) {
      const mainMenu = JSON.stringify(this.mainMenu)
      const htmlObj = {
        '床位使用情况': { path: '/operate/operateBed' },
        '病区工作量汇总': { path: '/operate/workLoad' },
        'ICU质控指标': { path: '/qualityControl/dataStatistics' },
        '本月病区患者情况': { path: '/operate/patientTurnover', query: { tab: 1 } },
        '本月患者出区状态分布': { path: '/operate/patientTurnover', query: { tab: 1 } },
        'Apache II 评分患者分布': { path: '/operate/clinicalInfo', query: { tab: 1 } },
        'Apache II24小时评估分布': { path: '/operate/clinicalInfo', query: { tab: 2 } },
        '气管插管患者分布': { path: '/operate/clinicalInfo', query: { tab: 3 } },
        '设备使用情况': { path: '/operate/operateEquipment' }
      }
      const { path, query } = htmlObj[name]
      if (path && mainMenu.indexOf(path) != -1) {
        this.$router.push({ path, query })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homepage {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  background: #ebeff7;

  &>div {
    position: absolute;
    min-width: vw(463);
    min-height: calc(974 / 3);
  }

  &>section {
    position: absolute;
    min-width: vw(463);
    min-height: calc(974 / 3);
  }
}
</style>
