<!-- 患者标志 -->
<template >
      <!-- 压疮 -->
      <el-tooltip class="patientIconInfo" placement="top" :disabled="patientIconInfo.hasSkinFlag != '1' || !patientIconInfo.skinRecords"
        v-if="iconItem.dictCode == '0004'&&abbreviation!=''">
        <div slot="content" class="tooltip">
          {{ patientIconInfo.hasSkinFlag == '1' && patientIconInfo.skinRecords ? patientIconInfo.skinRecords.map((patientIconInfo) =>
            patientIconInfo.skinPosiDictName).join(', ') : '' }}
        </div>
        <el-button :class="patientIconList[iconItem.dictCode].color" class="iconTransform"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="patientIconInfo.hasSkinFlag != '1'">{{ abbreviation
          }}</el-button>
      </el-tooltip>
      <!-- 管路 -->
      <el-tooltip class="patientIconInfo" placement="top"
        :disabled="patientIconInfo.hasCatherFlag != '1' || !patientIconInfo.catheterRecords"
        v-else-if="iconItem.dictCode == '0005'&&abbreviation!=''">
        <div slot="content" class="tooltip">
          {{ patientIconInfo.hasCatherFlag == '1' && patientIconInfo.catheterRecords ? patientIconInfo.catheterRecords.map((patientIconInfo) =>
            patientIconInfo.catheterName).join(', ') : '' }}
        </div>
        <el-button :class="patientIconList[iconItem.dictCode].color" class="iconTransform"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="patientIconInfo.hasCatherFlag != '1'">{{ abbreviation
          }}</el-button>
      </el-tooltip>
      <!-- 监护仪 -->
      <el-tooltip class="patientIconInfo" content="已连接监护仪" placement="top"
        :disabled="!bedDeviceStatusObj[patientIconInfo.bedId] || (bedDeviceStatusObj[patientIconInfo.bedId] && !bedDeviceStatusObj[patientIconInfo.bedId]['1'])"
        v-else-if="iconItem.dictCode == '0006'">
        <el-button class="iconTransform"
          :class="bedDeviceStatusObj[patientIconInfo.bedId] && bedDeviceStatusObj[patientIconInfo.bedId]['1'] ? (bedDeviceStatusObj[patientIconInfo.bedId]['1'].deviceStatusCode == '3' ? patientIconList[iconItem.dictCode].warningColor : patientIconList[iconItem.dictCode].color) : ''"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="!bedDeviceStatusObj[patientIconInfo.bedId] || (bedDeviceStatusObj[patientIconInfo.bedId] && !bedDeviceStatusObj[patientIconInfo.bedId]['1'])">
          {{ patientIconList[iconItem.dictCode].abbreviation }}</el-button>
      </el-tooltip>
      <!-- 呼吸机 -->
      <el-tooltip class="patientIconInfo" content="已连接呼吸机" placement="top"
        :disabled="!bedDeviceStatusObj[patientIconInfo.bedId] || (bedDeviceStatusObj[patientIconInfo.bedId] && !bedDeviceStatusObj[patientIconInfo.bedId]['2'])"
        v-else-if="iconItem.dictCode == '0007'">
        <el-button class="iconTransform"
          :class="bedDeviceStatusObj[patientIconInfo.bedId] && bedDeviceStatusObj[patientIconInfo.bedId]['2'] ? (bedDeviceStatusObj[patientIconInfo.bedId]['2'].deviceStatusCode == '3' ? patientIconList[iconItem.dictCode].warningColor : patientIconList[iconItem.dictCode].color) : ''"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="!bedDeviceStatusObj[patientIconInfo.bedId] || (bedDeviceStatusObj[patientIconInfo.bedId] && !bedDeviceStatusObj[patientIconInfo.bedId]['2'])">
          {{ patientIconList[iconItem.dictCode].abbreviation }}</el-button>
      </el-tooltip>
      <!-- 字典类型 如重症级别  护理级别  饮食 需要字典值的 -->
      <el-tooltip v-else-if="dictList.length>0" class="patientIconInfo" placement="top">
        <template v-if="patientIconList[iconItem.dictCode].contentCode">
          <div slot="content" class="tooltip">
            {{ filterArrValue(patientIconInfo[patientIconList[iconItem.dictCode].contentCode],
              dictList, 'dictCode', 'dictName') ||
              patientIconList[iconItem.dictCode].dictTips }}
          </div>
        </template>
        <template v-else>
          <div slot="content" class="tooltip">
            {{ filterArrValue(patientIconInfo[patientIconList[iconItem.dictCode].flagCode],
              dictList, 'dictCode', 'dictName') }}
          </div>
        </template>
        <template v-if="patientIconList[iconItem.dictCode].dictTips">
          <el-button class="iconTransform"
            :class="patientIconList[iconItem.dictCode].color + (patientIconList[iconItem.dictCode].abbreviation.length > 1 ? ' minFont' : '')"
            @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
            :disabled="patientIconInfo[patientIconList[iconItem.dictCode].flagCode] == ''">{{
              patientIconList[iconItem.dictCode].abbreviation }}</el-button>
        </template>
        <template v-else>
          <el-button class="iconTransform"
            :class="getColor(patientIconInfo[patientIconList[iconItem.dictCode].flagCode], iconItem.dictCode)"
            @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
            :disabled="patientIconInfo[patientIconList[iconItem.dictCode].flagCode] == ''">
            {{ abbreviation }}
          </el-button>
        </template>
      </el-tooltip>
      <!-- 评分类 -->
      <el-tooltip v-else-if="patientIconList[iconItem.dictCode].flagCode == 'firstApacheiiScore'" class="patientIconInfo"
        placement="top">
        <div slot="content" class="tooltip">
          首次APACHEII评分
        </div>
        <el-button class="iconTransform"
          :class="(patientIconInfo[patientIconList[iconItem.dictCode].contentCode].length > 1 ? 'customColor minFont' : 'customColor')" :style="{'--patientIconColor':patientIconInfo.firstApacheiiRiskColor}"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="patientIconInfo[patientIconList[iconItem.dictCode].flagCode] == '0'">
          {{ patientIconInfo[patientIconList[iconItem.dictCode].contentCode] }}</el-button>
      </el-tooltip>
      <!-- 通用类型 -->
      <el-tooltip v-else-if="!!patientIconInfo[patientIconList[iconItem.dictCode].flagCode]" class="patientIconInfo"
        placement="top">
        <div slot="content" class="tooltip">
          {{ patientIconList[iconItem.dictCode].tips || patientIconInfo[patientIconList[iconItem.dictCode].contentCode]
          }}
        </div>
        <el-button class="iconTransform"
          :class="patientIconList[iconItem.dictCode].color + (patientIconList[iconItem.dictCode].abbreviation.length > 1 ? ' minFont' : '')"
          @click.stop="toPage(patientIconList[iconItem.dictCode].linkUrl, patientIconInfo)"
          :disabled="patientIconInfo[patientIconList[iconItem.dictCode].flagCode] == ''">
          {{ patientIconList[iconItem.dictCode].abbreviation}}</el-button>
      </el-tooltip>
</template>
<script>
import {
  filterArrValue
} from '@/utils/utils'
export default {
  props: {
    iconItem: {
      type: Object,
      default: () => {}
    },
    bedDeviceStatusObj: {
      type: Object,
      default: () => {}
    },
    bedId: {
      type: String,
      default: ''
    },
    patientIconInfo: {
      type: Object,
      default: () => {}
    },
    dictList: {
      type: Array,
      default: () => []
    },
    patientIconList: {
      type: Object,
      default: () => {}
    },
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
  return {
    }
  },

  computed: {
    abbreviation: function() {
      return this.patientIconList[this.iconItem.dictCode].abbreviation ||
          filterArrValue(this.patientIconInfo[this.patientIconList[this.iconItem.dictCode].flagCode], this.dictList, 'dictCode', 'dictAbbr') ||
          filterArrValue(this.patientIconInfo[this.patientIconList[this.iconItem.dictCode].flagCode], this.dictList, 'dictCode', 'dictName').substring(0, 1) ||
              ''
    }
  },
  mounted() {

  },
  methods: {
    filterArrValue,
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
    toPage(page, patientInfo) {
      //   let name = ''
      let path = this.userInfo.userType == 'NURSE' ? '/patient/monitoringData' : '/patient/patientOverview' // /patient/11 找不到的路由。找不到路由，跳转第一个
      switch (page) {
        case 1:
          //   name = '特'
          break
        case 2:
          //   name = '敏'
          break
        case 3:
          //   name = '医'
          path = '/patient/orderExecute'
          break
        case 4:
          //   name = '压'
          path = '/patient/dermaplus'
          break
        case 5:
          //   name = '管'
          path = '/patient/pipelineCare'
          break
        case 6:
          //   name = '监'
          path = '/patient/monitoringData'
          break
        case 7:
          //   name = '呼'
          break
        case 18:
          path = '/patient/patientAssessment'
          break
        default:
      }
      this.$emit('click', path)
    }
  }
}
</script>
<style scoped lang="scss">

.orange {
  background: #ffffff;
  border: 1px solid #f7594b;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f7594b;
}

.blue {
  background: #ffffff;
  border: 1px solid #6480eb;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #6480eb;
}

.yellow {
  background: #ffffff;
  border: 1px solid #fe980b;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fe980b;
}

.green {
  background: #ffffff;
  border: 1px solid #11b36b;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #11b36b;
}

.red {
  background: #ffffff;
  border: 1px solid #f52c2c;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f52c2c;
}

.purple {
  background: #ffffff;
  border: 1px solid #d42cf5;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #d42cf5;
}

.warnningColor {
  background: #ffffff;
  border: 1px solid #ff6600;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ff6600;
}

.grey {
  background: #ffffff;
  border: 1px solid #999;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999;
}
.customColor{
  background: #ffffff;
  border: 1px solid var(--patientIconColor);
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--patientIconColor);
}
</style>
