<template>
  <van-pull-refresh @refresh="onRefresh" :animation-duration="10" v-model="vanPull" :disabled="vanDiabled">
    <div class="patient" v-loading="loading" ref="patientBedList" @scroll.prevent="scroll">
      <template v-if="bedList.length > 0">
        <div class="patient_container">
          <div class="patient_main_list" v-for="(item, index) in bedList" :key="index" @click="toPath(item)">
            <!-- 正常入住床位 -->
            <div class="normal" v-if="item.bedStatusDict == '3' && item.patientInfo">
              <div class="aLine flex" @click="toPath">
                <div style="position:relative;">
                  <!-- 临时数据标志 -->
                  <svg-icon icon-class="temporary" class="temporary"
                    v-if="item.patientInfo != null && item.patientInfo.icuInfoEntity != null && item.patientInfo.icuInfoEntity.icuStatusDict == '0'" />
                  <span class="title">{{ item.bedNo }}</span>
                  <span class="text">{{ item.patientInfo && item.patientInfo.patientEntity ?
                    item.patientInfo.patientEntity.patientName : '' }}</span>
                </div>

              </div>
              <div class="twoLine">
                <div class="twoLine_leftDiv">
                  <svg-icon icon-class="portraitGirl" class="sexMaleGirl" />
                </div>
                <div class="twoLine_rightDiv">
                  <p class="text">
                    <span>{{ item.patientInfo.patientEntity.patientAge }}</span>
                    <span>{{ item.patientInfo.patientEntity.sexDictName }}</span>
                    <span :title="item.patientInfo.inpatientEntity.mrn">{{ item.patientInfo.inpatientEntity.mrn }}</span>
                  </p>
                  <p class="text">
                    <span>入区时间:</span>
                    <span>
                      {{ item.patientInfo.icuInfoEntity.icuAreaTime | dateformat('YYYY/MM/DD HH:mm') }}</span>
                  </p>
                </div>
              </div>
              <div class="threeLine">
                <span class="diagInfo" :title="item.patientInfo.diagInfo">
                  诊断：{{
                    item.patientInfo.diagInfo }}
                </span>
              </div>
              <div class="fourLine">
                <template v-for="iconItem in iconDictList">
                  <div :key="iconItem.dictCode"
                    v-if="patientIconList[iconItem.dictCode] && item[patientIconList[iconItem.dictCode].flagCode] && item[patientIconList[iconItem.dictCode].flagCode] != '0'">
                    <PatientIcon :patientIconList="patientIconList" :iconItem.sync="iconItem" :bedId.sync="item.bedId"
                      :bedDeviceStatusObj.sync="bedDeviceStatusObj" :patientIconInfo="item"
                      :dictList="patientIconList[iconItem.dictCode].dictList" :userInfo="userInfo"
                      @click="gotoDetail($event, item)"></PatientIcon>
                  </div>
                </template>
              </div>
            </div>
            <!-- 锁定床位 -->
            <div class="locking" v-else-if="item.bedStatusDict == '2'">
              <div class="aline">
                <span>{{ item.bedNo }} </span>
              </div>
              <div class="twoLine flex">
                <svg-icon icon-class="redLock" class="redLock" />
                <span>锁定原因：</span>
              </div>
              <div class="threeLine flex">
                <p class="lockReson" :title="item.lockBedInfo.recordDesc">{{ item.lockBedInfo.recordDesc }}</p>
              </div>
              <div class="oneLine">
                <p style="text-align:right">{{ item.lockBedInfo.recordTime }}<span style="padding-left:rem(20);">{{
                  item.lockBedInfo.actionOperatorName }}</span></p>
              </div>
              <div class="fourLine">
                <el-button type="text" @click.native.stop="bedUnLockingFc(index, item)">床位解锁</el-button>
              </div>
            </div>
            <!-- 预约床位 -->
            <div class="locking" v-else-if="item.bedStatusDict == '4'">
              <div class="aline">
                <span>{{ item.bedNo }} </span>
              </div>
              <div class="twoLine">

                <span>预约信息：</span>
              </div>
              <div class="fiveLine">
                <p>患者姓名：{{ item.patientInfo && item.patientInfo.patientEntity ? item.patientInfo.patientEntity.patientName
                  :
                  '--' }}</p>
                <p>住院号：{{ item.patientInfo && item.patientInfo.patientEntity ? item.patientInfo.patientEntity.mrn : '--'
                }}
                </p>
              </div>
              <div class="fourLine">
                <div class="grey">
                  <el-button type="text">患者入区</el-button>
                </div>
              </div>
            </div>
            <!-- 空床床位 -->
            <div class="empty" v-else>
              <div class="aline">
                <span>{{ item.bedNo }} </span>
              </div>
              <!-- 平板端暂时不显示 对应的操作 -->
              <div class="fourLine">
              </div>
            </div>

          </div>
        </div>
      </template>

      <w-empty v-else>
      </w-empty>
    </div>
  </van-pull-refresh>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import {
  deviceStatus_getDeviceStatusList, // 设备连接状态
  patientInfo_getBedList // 获取床位列表
} from '@/api/patient'
import {
  filterArrValue,
  bedListFormat
} from '@/utils/utils'
import { patientIcon_list } from '@/api/configuration'
import WEmpty from '@/components/elEmpty'
import PatientIcon from '@/components/patientIcon.vue'
export default {
  name: 'PatientHome',
  components: {
    WEmpty, PatientIcon
  },
  data() {
    return {
      criticalLevelList: [],
      bedList: [],
      loading: false,
      setInter: -1,
      iconDictList: [],
      outStatusList: {},
      waitOutVisisble: false, // 待出区弹框
      skinTipsContent: '',
      catherTipsContent: '',
      selectDiagVisible: false, // 患者诊断弹窗
      handleSelectDiagObj: { patientInfo: { patientEntity: {} } }, // 患者诊断数据
      diagLevelDictList: [], // 患者诊断级别
      diagTypeDictList: [], // 患者诊断类型
      diagDataList: [], // 诊断基础数据
      selectDiagDataList: [],
      diagCodes: [], // 诊断的编码
      params: {},
      patientIconList: {
        '0001': {
          abbreviation: '',
          warningColor: '',
          color: '',
          linkUrl: 1,
          tips: '',
          flagCode: 'criticalLevelDict',
          dictList: [],
          colorCode: 'criticalLevelDict'
        },
        '0002': {
          contentCode: 'allergyInfo',
          abbreviation: '敏',
          warningColor: '',
          color: 'blue',
          linkUrl: 2,
          tips: '',
          flagCode: 'allergyFlag'
        },
        '0003': {
          abbreviation: '医',
          warningColor: '',
          color: 'blue',
          linkUrl: 3,
          tips: '有待提取医嘱',
          flagCode: 'hasOrderFlag'
        },
        '0004': {
          abbreviation: '压',
          warningColor: '',
          color: 'yellow',
          linkUrl: 4,
          content: 'skinRecords',
          flagCode: 'hasSkinFlag'
        },
        '0005': {
          abbreviation: '管',
          warningColor: '',
          color: 'yellow',
          linkUrl: 5,
          flagCode: 'hasCatherFlag',
          content: 'catheterRecords'
        },
        '0006': {
          abbreviation: '监',
          warningColor: 'warnningColor',
          color: 'green',
          linkUrl: 6,
          flagCode: 'hasMonitorFlag',
          tips: '已连接监护仪'
        },
        '0007': {
          abbreviation: '呼',
          warningColor: 'warnningColor',
          color: 'green',
          linkUrl: 7,
          flagCode: 'hasVentilatorFlag',
          tips: '已连接呼吸机'
        },
        '0008': {
          abbreviation: '',
          dictList: [],
          colorCode: '',
          flagCode: 'nurseLevel'
        },
        '0009': {
          flagCode: 'VAPFlag',
          abbreviation: 'VAP',
          color: 'red',
          name: '气管',
          linkUrl: 5,
          contentCode: 'VAPText'
        },
        '0010': {
          flagCode: 'CAUTIFlag',
          abbreviation: 'CAU',
          color: 'red',
          name: '尿管',
          linkUrl: 5,
          contentCode: 'CAUTIText'
        },
        '0011': {
          flagCode: 'CRBSIFlag',
          abbreviation: 'CRB',
          color: 'red',
          name: '血管',
          linkUrl: 5,
          contentCode: 'CRBSIText'
        },
        '0012': {
          flagCode: 'cvFlag',
          abbreviation: 'CV',
          color: 'red',
          contentCode: 'cvText'
        },
        '0013': {
          flagCode: 'quarantine',
          abbreviation: '隔',
          color: 'red',
          tips: '隔离'
        },
        '0014': {
          flagCode: 'rescureCount',
          abbreviation: '救',
          color: 'red',
          tips: '24小时内抢救'
        },
        '0015': {
          code: '',
          flagCode: 'eatCode',
          abbreviation: '',
          dictList: [],
          colorCode: ''
        },
        '0016': {
          flagCode: 'fastBacteriaFlag',
          abbreviation: '耐',
          color: 'red',
          contentCode: 'fastBacterias'
        },
        '0017': {
          flagCode: 'temperatureFlag',
          abbreviation: '热',
          color: 'red',
          contentCode: 'temperature'
        },
        '0018': {
          flagCode: 'firstApacheiiScore',
          abbreviation: '',
          color: 'firstApacheiiRiskColor',
          contentCode: 'firstApacheiiScore',
          linkUrl: 18
        },
        '0019': {
          flagCode: 'infectiousSituation',
          abbreviation: '染',
          color: 'red',
          contentCode: 'infectiousSituation'
        }
      },
      bedDeviceStatusObj: {

      },
      vanPull: false,
      vanDiabled: false
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userInfo'])
  },
  watch: {
    currentUserWard: function () {
      this.getBedList()
    }
  },
  async mounted() {
    const xtcs0093 = await this.$queryParam({
      paramGroupCode: 'XTCS',
      paramCode: 'XTCS0093'
    })
    this.params = {
      XTCS0093: xtcs0093[0]?.paramValue || '0'
    }
    const params1006 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1006' })
    const params1008 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: '1008' })
    this.countDaysType = params1006[0]?.paramValue || '1'
    this.waitRefreshRate = params1008[0]?.paramValue || 60
    const dictCodeList = ['HIS_DICT_SEX', 'HIS_DICT_RELATION_TYPE', 'ICIS_DICT_CRITICAL_LEVEL', 'HIS_DICT_DIAG_LEVEL', 'HIS_DICT_DIAG_TYPE', 'ICIS_DICT_NURSE_LEVEL', 'ICIS_DICT_EAT']
    const batchObj = await this.$batchGetDictItemList(dictCodeList)

    this.sexDictData = batchObj['HIS_DICT_SEX']
    this.patientRationData = batchObj['HIS_DICT_RELATION_TYPE']
    this.criticalLevelList = batchObj['ICIS_DICT_CRITICAL_LEVEL']
    this.diagLevelDictList = batchObj['HIS_DICT_DIAG_LEVEL']
    this.diagTypeDictList = batchObj['HIS_DICT_DIAG_TYPE']

    this.patientIconList['0001'].dictList = batchObj['ICIS_DICT_CRITICAL_LEVEL'] // 重症级别
    this.patientIconList['0008'].dictList = batchObj['ICIS_DICT_NURSE_LEVEL'] // 护理级别
    this.patientIconList['0015'].dictList = batchObj['ICIS_DICT_EAT'] // 饮食
    this.getBedList() // 床卡信息
    // 5分钟 定时器去拉床卡.  不清楚是否需这个定时器.
    this.setInter = setInterval(() => {
      this.getBedList()
    }, 300 * 1000)
  },
  created() { },
  methods: {
    filterArrValue,
    // 获取危重级别显示不同颜色
    getCriticalLevel(level) {
      let className = ''
      switch (level) {
        case '1':
          className = 'orange'
          break
        case '2':
          className = 'yellow'
          break
        case '3':
          className = 'green'
          break
        case '4':
          className = 'blue'
          break
        default:
          className = 'blue'
          break
      }
      return className
    },
    toPath(patientInfo) {
      this.$store.commit('set_patientInfo', patientInfo)
      this.$router.push({ path: '/patient/patientOverview' })
    },
    // 获取床位列表
    async getBedList(callback) {
      const wardCode = this.currentUserWard.wardCode
      this.loading = true
      patientInfo_getBedList(wardCode)
        .then(res => {
          if (res.code == 0) {
            this.bedList = []
            const result = bedListFormat(res.data.filter(item => item.bedStatusDict == '3'), this.params, this.sexDictData, this.patientRationData)
            this.deviceList = []
            res.data.forEach(item => {
              item.firstApacheiiRiskColor = item?.patientInfo?.icuInfoEntity?.firstApacheiiRiskColor || 'red'
              item.firstApacheiiScore = item?.patientInfo?.icuInfoEntity?.firstApacheiiScore || '未评'
              item.allergyInfo = item?.patientInfo?.allergyInfo
              item.eatCode = item?.patientInfo?.icuInfoEntity?.eatCode
              item.nurseLevel = item?.patientInfo?.icuInfoEntity?.nurseLevel
              item.quarantine = item?.patientInfo?.icuInfoEntity?.quarantine
              item.infectiousSituation = item?.patientInfo?.icuInfoEntity?.infectiousSituation
              item.VAPFlag = item?.catheterRecords?.filter(item => item.catheterGroupDict == 'VAP' && item.infectStatusDict == '1').length > 0 // 尿管标志
              item.VAPText = item.VAPFlag ? (item?.catheterRecords?.filter(item => item.catheterGroupDict == 'VAP' && item.infectStatusDict == '1').map(item => item.catheterName).toString(', ')) : ''
              item.CAUTIFlag = item?.catheterRecords?.filter(item => item.catheterGroupDict == 'CAUTI' && item.infectStatusDict == '1').length > 0 // 尿管标志
              item.CAUTIText = item.CAUTIFlag ? (item?.catheterRecords?.filter(item => item.catheterGroupDict == 'CAUTI' && item.infectStatusDict == '1').map(item => item.catheterName).toString(', ')) : ''
              item.CRBSIFlag = item?.catheterRecords?.filter(item => item.catheterGroupDict == 'CRBSI' && item.infectStatusDict == '1').length > 0 // 血管标志
              item.CRBSIText = item.CRBSIFlag ? (item?.catheterRecords?.filter(item => item.catheterGroupDict == 'CRBSI' && item.infectStatusDict == '1').map(item => item.catheterName).toString(', ')) : ''
              item.cvFlag = item.warningDtos?.length > 0
              item.cvText = item.warningDtos?.map(item => (item.createTime + ' ' + item.content)).join('; ')
              item.bedDeviceList?.forEach(deviceInfo => {
                this.deviceList.push({
                  deviceId: deviceInfo.deviceId,
                  deviceTypeCode: deviceInfo.deviceTypeCode,
                  bedId: item.bedId,
                  deviceStatusCode: '2'
                })
              })
            })
            this.getPatientIconData()
            // this.getDeviceStatus()
            // this.getOutwardRuleStatusList(res.data)
            this.$nextTick(() => {
              this.bedList = result
              this.loading = false

              callback && callback()
            })
          }
          setTimeout(() => {
            this.refreshFlag = false
            this.vanPull = false
          }, 300)
        })
        .catch(() => {
          this.loading = false
          this.vanPull = false
          this.bedList = []
        })
    },
    /**
     * 获取当前病区患者标识数据
     */
    getPatientIconData() {
      if (this.iconDictList.length == 0) {
        patientIcon_list({ wardCode: this.currentUserWard.wardCode }).then(res => {
          const tempIconList = res.data
          this.iconDictList = _.sortBy(
            tempIconList.filter(item => item.statusDict == 1),
            'sortNo'
          )
        })
      }
    },
    // 获取危重级别显示不同颜色
    getColor(level, type) {
      let className = ''
      if (type == '0001') {
        switch (level) {
          case '1':
            className = 'orange'
            break
          case '2':
            className = 'yellow'
            break
          case '3':
            className = 'green'
            break
          case '4':
            className = 'blue'
            break
          default:
            className = 'blue'
            break
        }
      } else if (type == '0008') {
        switch (level) {
          case '01':
            className = 'red'
            break
          case '02':
            className = 'orange'
            break
          case '03':
            className = 'blue'
            break
          case '04':
            className = 'green'
            break
        }
      } else if (type == '0015') {
        switch (level) {
          case '01':
            className = 'red'
            break
          case '02':
            className = 'yellow'
            break
          case '03':
            className = 'blue'
            break
          case '04':
            className = 'purple'
            break
          case '05':
            className = 'green'
            break
        }
      }

      return className
    },
    /**
     * 获取设备状态
     */
    getDeviceStatus() {
      // 设备类型结构
      let query = []
      this.deviceList.forEach(item => {
        if (item.deviceId && item.deviceId != '') {
          query.push(item.deviceId)
        }
      })
      query = [...new Set(query)]
      deviceStatus_getDeviceStatusList(query).then(res => {
        res.data?.forEach(item => {
          this.deviceList
            .filter(device => device.deviceId == item.deviceId)
            .forEach(device => {
              device.deviceStatusCode = item.deviceStatusCode
            })
        })
        const tempData = _.groupBy(this.deviceList, 'bedId') // 根据bedId分组 获取到每个床位的 设备连接状态 以及每个设备的连接状态
        const bedStatusInfo = {}
        for (var key in tempData) {
          // 床位id
          bedStatusInfo[key] = Object.assign({}, _.keyBy(tempData[key], 'deviceTypeCode')) // 每个床位每种类型的状态
          const statusList = tempData[key].map(item => {
            return item.deviceStatusCode
          }) // 设备合集
          bedStatusInfo[key]['deviceStatusCode'] = statusList.includes('3') ? '3' : '2' // 每个床位设备的总状态 只要有一个设备是连接异常的状态就需要显示设备异常。
        }
        this.bedDeviceStatusObj = bedStatusInfo
      })
    },
    toPage(url) {

    },
    /**
     * 刷新数据
     */
    onRefresh() {
      this.vanPull = true
      this.getBedList()
      this.vanPull = false
    },
    scroll() {
      this.vanDiabled = this.$refs.patientBedList.scrollTop > 0
    }
  },
  beforeDestroy() {
    clearInterval(this.setInter)
  }
}
</script>

<style lang="scss" scoped>
.patient {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #000;

  &_container {
    display: grid;
    // grid-template-columns: repeat(auto-fill, clamp(3rem(20), 32.411%, 386px));
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 1rem;
  }

  &_main {
    .patientNameEllipsis {
      --patient-name-width: 7rem;
    }

    &_list {
      width: 100%;
      box-shadow: 0px 3px 5px 0px rgba(203, 215, 238, 0.5);
      border-radius: 2px;
      font-size: 0;
      position: relative;
      height: 224px;
      overflow: hidden;
      background: #fff;

      .normal {
        padding: 1rem 1rem 0 1rem;

        .aLine {
          height: rem(30);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          div {
            .title {
              min-width: 56px;
              margin-right: 10px;
              display: inline-block;
              font-size: rem(22);
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: var(--maincolor);
            }

            .text {
              display: inline-block;
              font-size: rem(22);
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #000622;
              vertical-align: bottom;
            }

            .equipmentGrey {
              width: rem(14);
              height: rem(14);
              margin-right: rem(12);
            }

            .goout {
              width: rem(14);
              height: rem(14);
              margin-right: rem(12);
            }

            .temporary {
              width: 60px;
              height: 60px;
              transform: rotate(-30deg);
              position: absolute;
              top: rem(-22);
              left: rem(-33);
              opacity: 0.6;
              color: var(--maincolor);
            }

            .canOutZone {
              width: rem(20);
              height: rem(20);
              position: absolute;
              top: rem(30);
              left: 33px;
              // color: $green;
            }

            .personalInformation {
              width: rem(14);
              height: 15px;
              margin-right: rem(12);
            }

            .changingBeds {
              width: rem(14);
              height: rem(14);
              margin-right: rem(12);
            }

            .outOfDistrict {
              width: 15px;
              height: rem(14);
              margin-right: rem(5);
              color: #6a6f8a;
              // cursor: not-allowed;
            }

            .blue {
              color: #6480eb;
            }

            // .outOfDistrictGreen{
            //   color:#11B36B;
            //   cursor: initial;
            // }
          }
        }

        .twoLine {
          height: rem(48);
          margin-bottom: rem(15);
          display: flex;

          &_leftDiv {
            width: rem(48);
            margin-right: rem(11);

            .sexMaleGirl {
              width: 48px;
              height: 48px;
            }

            .patientOut {
              position: relative;
              left: 0px;
              top: -48px;
              width: 48px;
              height: 48px;
              font-weight: 800;
              line-height: 48px;
              z-index: 100;
              font-size: 19px;
              text-align: center;
              border-radius: 50%;
              background: #f9f6f6ba;
              color: var(--maincolor);
            }
          }

          &_rightDiv {
            flex: 1;

            .text {
              margin: 0;
              height: rem(20);
              line-height: rem(20);
              margin-top: 4px;
              font-size: 0;
              white-space: nowrap;
              overflow: hidden;
              text-align: left;
              padding-right: 5px;

              span {

                white-space: nowrap;
                /*强制单行显示*/
                text-overflow: ellipsis;
                /*超出部分省略号表示*/
                overflow: hidden;
                /*超出部分隐藏*/
                display: inline-block;
              }

            }

            .text:first-of-type {
              margin-top: 0;
            }

            span {
              margin-right: rem(12);
              font-size: rem(14);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 6, 34, 0.7);
            }

            span:last-of-type {
              margin-right: 0;
            }
          }
        }

        .threeLine {
          height: rem(22);
          margin-bottom: 11px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000622;
          text-align: left;

          .diagInfo {
            white-space: nowrap;
            /*强制单行显示*/
            text-overflow: ellipsis;
            /*超出部分省略号表示*/
            overflow: hidden;
            /*超出部分隐藏*/
            width: 100%;
            /*设置显示的最大宽度*/
            display: inline-block;
            cursor: pointer;
          }
        }

        .fourLine {
          display: inline-flex;
          width: 100%;

          .iconTransform {
            width: rem(24);
            height: rem(24);
          }

          div {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: rem(14);
          }

          .orange {
            background: #ffffff;
            border: 1px solid #f7594b;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f7594b;
          }

          .blue {
            background: #ffffff;
            border: 1px solid #6480eb;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #6480eb;
          }

          .yellow {
            background: #ffffff;
            border: 1px solid #fe980b;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fe980b;
          }

          .green {
            background: #ffffff;
            border: 1px solid #11b36b;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #11b36b;
          }

          .red {
            background: #ffffff;
            border: 1px solid #f52c2c;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f52c2c;
          }

          .purple {
            background: #ffffff;
            border: 1px solid #d42cf5;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #d42cf5;
          }

          .warnningColor {
            background: #ffffff;
            border: 1px solid #ff6600;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff6600;
          }

          .grey {
            background: #ffffff;
            border: 1px solid #999;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999;
          }

          ::v-deep .el-button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: rem(24);
            height: rem(24);
            box-sizing: border-box;
            margin-bottom: 5px;
            padding: 0px !important;
            font-size: 1rem;
            margin-right: rem(5);

            &.minFont {
              font-size: 11px;

              span {
                transform: scale(0.8);
              }
            }
          }

          .is-disabled,
          .is-disabled:hover,
          .is-disabled:focus {
            color: #c0c4cc;
            cursor: not-allowed;
            background-image: none;
            background-color: #ffffff;
            border-color: #e4e7ed;
          }
        }
      }

      .locking {
        height: 100%;
        width: 100%;
        background: url('~@/assets/img/patient/redBed.png') no-repeat center #ffeded;
        background-size: rem(104) rem(82);
        padding: rem(12) rem(12) 0 rem(12);

        .aline {
          height: rem(30);
          margin-bottom: rem(18);
          display: flex;
          align-items: center;

          span {
            font-size: rem(22);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
          }
        }

        .twoLine {
          margin-bottom: 5px;

          .redLock {
            width: 13px;
            height: 16px;
            margin-right: rem(8);
          }

          span {
            font-size: rem(16);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #f7594b;
          }
        }

        .threeLine {
          padding: 0 rem(26);
          min-height: 48px;

          p {
            margin: 0;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000622;
            line-height: rem(20);
            overflow: hidden;
            word-break: break-all;
            width: 100%;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //（行数）
            -webkit-box-orient: vertical;
          }
        }

        .oneLine {
          padding: 0 rem(26);
          min-height: rem(30);

          p {
            margin: 0;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000622;
            line-height: rem(20);
          }
        }

        .fiveLine {
          padding: 0 rem(26);
          min-height: rem(48);

          p {
            margin: 0;
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000622;
            line-height: 24px;
          }
        }

        .fourLine {
          text-align: center;

          ::v-deep .el-button {
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #f7594b;
            text-decoration: underline;
          }
        }
      }

      .empty {
        height: 100%;
        width: 100%;
        background: url('~@/assets/img/patient/bed.png') no-repeat center;
        background-size: rem(104) rem(82);
        padding: 12px rem(12) 0 rem(12);
        display: flex;
        flex-flow: column;
        justify-content: space-between;

        .aline {
          height: rem(30);
          margin-bottom: rem(18);
          display: flex;
          align-items: center;

          span {
            font-size: rem(22);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
          }
        }

        .fourLine {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 80%;
          margin: 0 auto rem(20) auto;

          .grey {
            ::v-deep .el-button {
              font-size: rem(14);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #6b6e7c;
              text-decoration: underline;
            }
          }

          .orange {
            ::v-deep .el-button {
              font-size: rem(14);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #f7594b;
              text-decoration: underline;
            }
          }
        }
      }

      .authorExpirationDay {
        font-size: 12px;
        width: 100%;
        text-align: center;
        height: 15px;
        bottom: 5px;
        margin-top: 8px;
        position: absolute;
        bottom: 2px;
      }
    }
  }
}</style>
