<template>
  <div class="HCContiner">
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
      <div class="w100 flex flex-justify-content Header" slot="title">
        <el-menu :default-active="activeIndex" @select="handleSelect" class="LMContiner el-menu-demo" mode="horizontal"
          ref="menu">
          <div v-for="(item, index) in mainMenu" :key="item.path">
            <router-link :ref="`menuPathList${item.path}`" :to="{ path: item.path, query: { menuId: item.id } }" replace>
              <el-menu-item class="centerDiv_itemDiv " v-bind:index="index + ''">
                <span class="menuTitle">{{ item.meta.title }}</span>
              </el-menu-item>
            </router-link>
          </div>
        </el-menu>

      </div>
    </van-nav-bar>
    <div class="patientInfo">
      <div class="flex align-item-center">
        <span class="patientInfo_bedNo">{{ patientInfo.bedNo }}</span>
        <span class="patientInfo_name">{{ patientInfo.patientEntity.patientName }}</span>
        <span class="patientInfo_text">{{ patientInfo.patientEntity.sexDictName }}</span>
        <span class="patientInfo_text">{{ patientInfo.patientEntity.patientAge }}</span>
        <span class="patientInfo_text">入区{{ inAreaTime }}</span>
      </div>
      <div class="timePicker flex align-item-center" v-if="showSearchBar">
        <div @click="showTimePicker" class="date flex ">
          <i class="el-icon-date "></i>{{ searchDate }}
        </div>
        <el-button type="primary" @click="gotoToday" circle>今</el-button>
        <el-button :type="!lastDayShowFlag ? 'primary' : 'info'" circle class="el-icon-back" title="前一天"
          @click="gotoPreDay()" :disabled="lastDayShowFlag"></el-button>
        <el-button :type="!nextDayShowFlag ? 'primary' : 'info'" circle class="el-icon-right" title="后一天"
          @click="gotoNextDay()" :disabled="nextDayShowFlag"></el-button>
      </div>
    </div>
    <!-- 下拉刷新页面 -->
    <div class="main flex-1 flex">
      <router-view></router-view>
    </div>
    <van-popup v-model="pickerFlag" position="bottom">
      <van-datetime-picker v-model="datePicker" type="date" :min-date="minDate" :max-date="maxDate"
        @cancel="pickerFlag = false" @confirm="onConfirm" @change="changeTime" />
    </van-popup>

  </div>
</template>

<script>
import {
  findShiftWithPage
} from '@/api/configuration'
import { mapGetters } from 'vuex'
import {
  durationFormat
} from '@/utils/utils'
import patientInfoCompute from '@/mixins/patientInfoCompute'
export default {
  name: 'Layout',
  mixins: [patientInfoCompute],
  data() {
    return {
      timestamp: 0,
      mainMenu: [],
      activeIndex: '',
      searchKey: '',
      countDaysType: null,
      searchDate: '',
      datePicker: new Date(),
      pickerFlag: false,
      shiftList: [],
      vanPull: false,
      searchDateTimeout: -1,
      showSearchBar: false
    }
  },
  computed: {
    ...mapGetters(['patientInfo', 'currentUserWard']),
    inAreaTime: function () {
      return durationFormat(this.patientInfo.icuInfoEntity.icuAreaTime, this.patientInfo.icuInfoEntity.icuLeaveTime || null, this.countDaysType)
    },
    minDate() {
      return new Date(this.icuTimeInfo.icuAreaShiftDay)
    },
    maxDate() {
      return new Date(this.leaveTimeInfo.leaveShiftDay)
    },
    lastDayShowFlag() {
      if (this.shiftList.length == 0) return true
      let formDate = this.icuAreaTime.split(' ')[0]
      const shiftValue = this.$dayjs(formDate + ' ' + this.shiftList[0].startTime).valueOf()
      if (this.$dayjs(this.icuAreaTime).valueOf() < shiftValue) { // 开始时间处理上一个班次
        formDate = this.$dayjs(this.$dayjs(formDate).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
      }
      const inAreaShiftTime = this.$dayjs(formDate + ' ' + this.shiftList[0].startTime).valueOf()
      const lastDay = this.$dayjs(this.searchDate + ' ' + this.shiftList[0].startTime).valueOf() - 24 * 60 * 60 * 1000
      return lastDay < inAreaShiftTime
    },
    nextDayShowFlag() {
      if (this.shiftList.length == 0) return true
      const icuLeaveTime = this.icuLeaveTime || this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      let leaveShiftTime = 0
      // 计算结束时间
      if (this.$dayjs(icuLeaveTime).valueOf() < this.$dayjs(icuLeaveTime.split(' ')[0] + ' ' + this.shiftList[0].startTime).valueOf()) {
        leaveShiftTime = this.$dayjs(icuLeaveTime.split(' ')[0] + ' ' + this.shiftList[this.shiftList.length - 1].endTime).valueOf()
      } else {
        const timeValue = this.$dayjs(icuLeaveTime.split(' ')[0] + this.shiftList[this.shiftList.length - 1].endTime).valueOf()
        leaveShiftTime = this.$dayjs(timeValue + 24 * 60 * 60 * 1000).valueOf()
      }
      const nextDay = this.$dayjs(this.searchDate + ' ' + this.shiftList[this.shiftList.length - 1].endTime).valueOf() + 24 * 60 * 60 * 1000
      return nextDay >= leaveShiftTime
    }

  },
  async mounted() {
    this.shiftList = await this.getShiftList()
    this.computeLeaveTimeInfo()
    this.computeIcuTimeInfo()
    if (this.icuLeaveTime) { //
      this.searchDate = this.leaveTimeInfo.leaveShiftDay
    } else {
      this.searchDate = this.$dayjs(this.$dayjs(this.leaveTimeInfo.leaveShiftDay).valueOf() - 24 * 3600 * 1000).format('YYYY-MM-DD')
    }

    const params1006 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1006' })
    this.countDaysType = params1006[0]?.paramValue || '1'
    this.mainMenu = this.$router.options.settingRoutes.find(item => item.name == 'patient').children
    const routerPath = location.hash.split('#')[1]
    this.mainMenu.forEach((item, index) => {
      if (item.path == routerPath) {
        this.activeIndex = index + ''
      }
    })
    const val = routerPath
    if (val.indexOf('patientOverview') > -1 || val.indexOf('nursingRecord') > -1) {
      this.showSearchBar = true
    } else {
      this.showSearchBar = false
    }
  },
  watch: {
    searchDate: function (newValue) {
      clearTimeout(this.searchDateTimeout)
      this.searchDateTimeout = setTimeout(() => {
        this.$bus.$emit('updateSearchData', newValue)
      }, 500)
    },
    '$route.path': {
      handler: function (val) {
        this.$nextTick(() => {
          this.$bus.$emit('updateSearchData', this.searchDate)
          if (val.indexOf('patientOverview') > -1 || val.indexOf('nursingRecord') > -1) {
            this.showSearchBar = true
          } else {
            this.showSearchBar = false
          }
        })
      },
      immediate: true
    }
  },
  created() {

  },
  provide() {
    return {
      shiftListFn: () => this.shiftList || []
    }
  },
  methods: {
    /**
     * 查询班次列表
     */
    getShiftList() {
      return new Promise((resolve, reject) => {
        const query = {
          wardCode: this.currentUserWard.wardCode
        }
        findShiftWithPage(query).then(res => {
          if (res.code == 0) {
            const shiftList = res.data.result
            shiftList.unshift({
              shiftName: '全班',
              sortNo: 0,
              startTime: shiftList[0].startTime,
              endTime: shiftList[shiftList.length - 1].endTime,
              shiftCode: 'D'
            })
            resolve(shiftList)
          }
        })
      })
    },
    refresh() {
    },
    handleSelect() {

    },
    logout() {
      this.$router.push({ path: '/login' })
    },
    onClickLeft() {
      this.$router.back()
    },
    gotoToday() {
      this.searchDate = this.$dayjs().format('YYYY-MM-DD')
    },
    /**
     * 前一天
     */
    gotoPreDay() {
      this.searchDate = this.$dayjs(this.$dayjs(this.searchDate).valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
    },
    /**
     * 后一天
     */
    gotoNextDay() {
      this.searchDate = this.$dayjs(this.$dayjs(this.searchDate).valueOf() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
    },
    /**
     * 显示时间选择器
     */
    showTimePicker() {
      this.datePicker = new Date(this.searchDate)
      this.pickerFlag = true
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
     * 病区选择
     */
    onConfirm() {
      this.pickerFlag = false
      this.searchDate = this.$dayjs(this.datePicker).format('YYYY-MM-DD')
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.vanPull = true
      const oriSearchDate = this.searchDate
      this.searchDate = ''
      this.$nextTick(() => {
        this.searchDate = oriSearchDate
        this.vanPull = false
      })
    }
  },
  beforeDestroy() {
    clearTimeout(this.searchDateTimeout)
  }
}
</script>

<style lang="scss" scoped>
.HCContiner {
  padding: 0px;
  margin: 0px;
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .el-menu.el-menu--horizontal {
    border-bottom: none !important;
  }

  ::v-deep .van-nav-bar__left,
  ::v-deep.van-nav-bar__text,
  ::v-deep.van-nav-bar .van-icon {
    font-size: rem(14);
    font-weight: 600;
    color: var(--maincolor) !important;
  }

  .LMContiner {
    width: 100%;
    height: 2rem;
    display: flex;
    overflow: hidden;
    justify-content: center;
    background: #fff;

    .leftMenu {
      width: rem(100);

      div {
        justify-content: center;
      }
    }

    .menuTitle {
      line-height: rem(14);
      height: rem(18);
    }

    .centerDiv_itemDiv {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0px;
      margin: 0px 1rem;
    }

    ::v-deep .el-menu {
      &-item {
        font-size: rem(14);
        font-weight: 800;
        line-height: 2rem;
        height: 100%;
      }

    }

    ::v-deep .el-menu-item.is-active {
      color: var(--maincolor);
      border-bottom: 2px solid var(--maincolor);
      background: transparent;
    }
  }

  .patientInfo {
    width: 100vw;
    height: rem(58);
    opacity: 1;
    border-radius: 8px;
    padding: 0px 1rem;
    background: rgba(236, 241, 255, 1);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    z-index: 99;
    justify-content: space-between;

    span {
      margin-right: 1rem;
    }

    &_bedNo {
      color: var(--maincolor);
      font-size: 1.4rem;
      font-weight: 800;
    }

    &_name {
      color: #333;
      font-size: 1.4rem;
      font-weight: 800;
    }

    &_text {
      font-size: 1rem;
      color: #333;
    }

    .timePicker {
      align-items: baseline;

      .date {
        width: rem(130);
        border-radius: rem(4);
        border: 1px solid var(--maincolor);
        justify-content: flex-start;
        margin: rem(8);
        color: var(--maincolor);
        padding: rem(5);
        background: #fff;
        align-items: center;

        i {
          margin-right: rem(10);
        }
      }

      ::v-deep .el-button--primary,
      .el-button--info {
        width: rem(24);
        height: rem(24);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: rem(12);
      }
    }

  }

  .main {
    overflow-y: hidden;
    height: 100%;
  }
}
</style>
