<!-- ICU质控指标 -->
<template>
  <el-container id="iCUQualityControlIndex" class="iCUQualityControlIndex">
    <!-- 顶部类容 -->
    <el-header>
      <div>
        <i class="iconBlue"></i>
         <span>{{item.moduleName}}</span>
      </div>
    </el-header>
    <!-- 中间类容部分 -->
    <el-main>
      <div class="radioDiv">
        <el-radio-group @change="getStatisticsData" v-model="timeType">
          <el-radio label="1">本周</el-radio>
          <el-radio label="2">近7天</el-radio>
          <el-radio label="3">本月</el-radio>
          <el-radio label="4">近30天</el-radio>
        </el-radio-group>
      </div>

      <div class="lineDiv" v-for="(item,index) in listData" :key="item.deviceCode+'_'+index">
        <div class="lineDiv_left" >{{index+1}}、{{item.deviceName}}使用率：</div>
        <div class="lineDiv_right w110 ">
          <span class="title flex" title="按使用时间">{{Number(item.userTimeRata*100).toFixed(2)+'%'}}</span>、
          <span class="title flex" title="按使用次数"> {{Number(item.userCountRata*100).toFixed(2)+'%'}}</span>
          <!-- <svg-icon icon-class="top" class="svgcoloranaspacu iconSvg" /> 暂时没有趋势-->
        </div>
      </div>
      <el-empty v-show="listData.length==0" :image-size="100" description="暂无数据"></el-empty>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { deviceUserStatic_getDeviceUserRataTotal } from '@/api/qcReport'
export default {
  name: 'ICUQualityControlIndex',
  components: {},
  data: function () {
    return {
      timeType: '3',
      listData: [

      ]
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {} // 按最小的来算
      }
    } // 配置那边跳过了的高度宽度设置
  },
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() { },
  mounted() {
    this.getStatisticsData()
  },
  methods: {
    /** 获取icu质控数据 */
    getStatisticsData() {
      const { startTime, endTime } = this.timeFormat()
      const query = {
        wardCode: this.currentUserWard.wardCode,
        startDate: startTime,
        endDate: endTime,
        deviceUserStaticTypeCode: 5 // 5 按区间统计
      }
      deviceUserStatic_getDeviceUserRataTotal(query).then(res => {
        this.listData = res.data
      })
    },
    /**
     * 时间格式化
     * */
    timeFormat() {
      let startTime, endTime
      if (this.timeType == '1') {
        // 本周
        const week = this.$dayjs().day()
        const startTime1 = this.$dayjs().startOf('week').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
        const endTime1 = this.$dayjs().endOf('week').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
        const startTime2 = this.$dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        const endTime2 = this.$dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        startTime = week > 0 ? startTime2 : startTime1
        endTime = week > 0 ? endTime2 : endTime1
      }
      if (this.timeType == '2') {
        // 近7天
        endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        const time = this.$dayjs(endTime).valueOf()
        startTime = this.$dayjs(time - 7 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      if (this.timeType == '3') {
        // 本月
        startTime = this.$dayjs().format('YYYY-MM-01 00:00:00')
        const time = this.$dayjs(startTime).valueOf()
        endTime = this.$dayjs(
          time + this.mGetDate() * 24 * 60 * 60 * 1000 - 1000
        ).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.timeType == '4') {
        // 近30天
        endTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
        const time = this.$dayjs(endTime).valueOf()
        startTime = this.$dayjs(time - 30 * 24 * 60 * 60 * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      return {
        startTime: startTime,
        endTime: endTime
      }
    },
    /**
     * 获取当前月份天数
     */
    mGetDate() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var d = new Date(year, month, 0)
      return d.getDate()
    }
  }
}
</script>
<style lang="scss" scoped>

.iCUQualityControlIndex {
  box-shadow: 0px 3px 5px 0px rgba(203, 215, 238, 0.5);
  p {
    margin: 0;
  }
  background: #ffffff;
  ::v-deep .el-header {
    height: 46px !important;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    padding: 0;
    .iconBlue {
      margin-left: 15px;
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
    }
    span {
      margin-left: 8px;
      flex: 1;
      height: 22px;
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 22px;
      font-weight: bold;
      font-size: 18px;
      color: var(--maincolor);
    }
  }

  ::v-deep .el-main {
    padding: 0;
    overflow-x: none;
    overflow-y: auto;
    .radioDiv {
      padding-left: vw(20);
      margin-bottom: 20px;
      // radio 的字体颜色
      .el-radio {
        margin-right: vw(24);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 6, 34, 0.8);
      }
      .el-radio__label {
        padding-left: vw(8);
      }
    }
    .lineDiv {
      padding: 0 vw(20);
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .w110{
          width:110px;
        }
      &_left {
        flex: 1;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
      }

      &_right {
        width: vw(74);
        display: inline-flex;
        align-items: center;
        justify-content: space-between;

        .iconSvg {
          width: 16px;
          height: 16px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
        }
        .title {
          line-height: 24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

  // radio选择后的颜色
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: rgba(0, 6, 34, 0.8) !important;
  }
}
</style>
