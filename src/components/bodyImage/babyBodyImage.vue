<template>
  <div class="bodyImage" :class="bodyImageDivClass">

    <template v-for="(item, index) in imageList">
      <div :key="'imageSection-' + index" :id="'imageSection-' + index" class="bodyImage" :class="`${item.key}`"
        :style="{ 'background-image': sliceBackImageStyle(item.key) }" @click="handelClick($event, item, index)">
        <!-- v-if="showLabel && selectedSlice[item.key] " {'background-color':sliceBackImageStyle(item.key),'border-radius':'50%','width': '30px','padding-bottom': '30px','height': '0'}" " -->
        <template v-if="showLabel && selectedSlice[item.key]">
          <BodyImageTag :isBabyBody="isBabyBody" :bodyLeft="bodyLeft" :type="type" :showPosiImage="showPosiImage"
            :showTag="showTag" :imageItem="item" :fontSize="fontSize" :pipeInfos="selectedSlice[item.key]"
            :isPrint="isPrint" :printBodyImageScale="printBodyImageScale"></BodyImageTag>
        </template>
      </div>
    </template>
    <template v-if="showConvert">
      <div class="bodyImage left-label-position" :class="rightLableImageDiv" @click="converImage"
        :style="{ 'transform': 'scale(' + labelPositionScale + ')' }">
        <div class="bodyImage left-convert"></div>
      </div>
      <div class="bodyImage right-label-position" :class="leftLableImageDiv"
        :style="{ 'transform': 'scale(' + labelPositionScale + ')' }" @click="converImage">
        <div class="bodyImage right-convert"></div>
      </div>
    </template>
  </div>
</template>

<script>
import BodyImageTag from './bodyImageTag'

export default {
  name: 'BodyImage',
  components: { BodyImageTag },
  filters: {},
  data: function () {
    return {
      labelPositionScale: 1,
      isFront: true,
      fromtImageSectionList: [
        {
          key: 'front_cheek_right',
          direction: 'right',
          tagLable: '正面右面颊',
          lineWidth: '30',
          style: 'bottom:32px'
        },
        {
          key: 'front_eye_right',
          direction: 'right',
          tagLable: '正面右眼',
          lineWidth: '43',
          style: 'bottom:6px'
        },
        {
          key: 'front_neck_right',
          direction: 'right',
          tagLable: '正面右脖',
          lineWidth: '41',
          style: 'bottom:11px'
        },
        {
          key: 'front_arm_right',
          direction: 'right',
          tagLable: '正面右臂',
          lineWidth: '40',
          style: 'bottom:16px;left:-47px'
        },
        {
          key: 'front_chest_right',
          direction: 'right',
          tagLable: '正面右胸',
          lineWidth: '87',
          style: 'bottom:31px;left:-96px;'
        },
        {
          key: 'front_biceps_right',
          direction: 'right',
          tagLable: '正面二头肌',
          lineWidth: '28',
          style: ''
        },
        {
          key: 'front_elbow_right',
          direction: 'right',
          tagLable: '正面右肘',
          lineWidth: '40',
          style: ''
        },
        {
          key: 'front_underarm_right',
          direction: 'right',
          tagLable: '正面右下臂',
          lineWidth: '30',
          style: 'bottom:20px;'
        },
        {
          key: 'front_wrist_right',
          direction: 'right',
          tagLable: '正面右腕',
          lineWidth: '20',
          style: 'left:-35px;'
        },
        {
          key: 'front_opisthenar_right',
          direction: 'right',
          tagLable: '正面右手背',
          lineWidth: '32',
          style: 'left: -39px;bottom: 8px;'
        },
        {
          key: 'front_finger_right',
          direction: 'right',
          tagLable: '正面右手',
          lineWidth: '23',
          style: 'bottom:10px;'
        },
        {
          key: 'front_waist_right',
          direction: 'right',
          tagLable: '正面右腰',
          lineWidth: '85',
          style: 'bottom:10px;left:-38px;'
        },
        {
          key: 'front_belly_right',
          direction: 'right',
          tagLable: '正面右肚',
          lineWidth: '105',
          style: 'bottom:11px;left:-103px;'
        },
        {
          key: 'front_abdomen_right',
          direction: 'right',
          tagLable: '正面右腹',
          lineWidth: '124',
          style: 'bottom:9px;'
        },
        {
          key: 'front_hip_right',
          direction: 'right',
          tagLable: '正面右臀',
          lineWidth: '48',
          style: 'left: -50px;bottom: 12px'
        },
        {
          key: 'front_prostate_right',
          direction: 'right',
          tagLable: '正面右腺',
          lineWidth: '41',
          style: 'bottom:14px;'
        },
        {
          key: 'front_thigh_right',
          direction: 'right',
          tagLable: '正面右大腿',
          lineWidth: '42',
          style: 'bottom:10px;'
        },
        {
          key: 'front_knee_right',
          direction: 'right',
          tagLable: '正面右膝',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_leg_right',
          direction: 'right',
          tagLable: '正面右小腿',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_ankle_right',
          direction: 'right',
          tagLable: '正面右脚踝',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_foot_right',
          direction: 'right',
          tagLable: '正面右脚',
          lineWidth: '23',
          style: ''
        },

        {
          key: 'front_cheek_left',
          direction: 'left',
          tagLable: '正面左面颊',
          lineWidth: '30',
          style: 'bottom:40px'
        },
        {
          key: 'front_eye_left',
          direction: 'left',
          tagLable: '正面左眼',
          lineWidth: '46',
          style: 'bottom:3px'
        },
        {
          key: 'front_neck_left',
          direction: 'left',
          tagLable: '正面左脖',
          lineWidth: '41',
          style: ''
        },
        {
          key: 'front_arm_left',
          direction: 'left',
          tagLable: '正面左臂',
          lineWidth: '40',
          style: 'left:42px;'
        },
        {
          key: 'front_chest_left',
          direction: 'left',
          tagLable: '正面左胸',
          lineWidth: '87',
          style: 'bottom:31px'
        },
        {
          key: 'front_biceps_left',
          direction: 'left',
          tagLable: '正面左二头肌',
          lineWidth: '25',
          style: ''
        },
        {
          key: 'front_elbow_left',
          direction: 'left',
          tagLable: '正面左肘',
          lineWidth: '40',
          style: 'bottom:10px;left:15px;'
        },
        {
          key: 'front_underarm_left',
          direction: 'left',
          tagLable: '正面左下臂',
          lineWidth: '30',
          style: 'bottom:15px;left:18px'
        },
        {
          key: 'front_wrist_left',
          direction: 'left',
          tagLable: '正面左腕',
          lineWidth: '15',
          style: 'bottom: 8px;left: 10px;'
        },
        {
          key: 'front_opisthenar_left',
          direction: 'left',
          tagLable: '正面左手背',
          lineWidth: '32',
          style: 'bottom:15px;'
        },
        {
          key: 'front_finger_left',
          direction: 'left',
          tagLable: '正面左手',
          lineWidth: '23',
          style: ''
        },
        {
          key: 'front_waist_left',
          direction: 'left',
          tagLable: '正面左腰',
          lineWidth: '29',
          style: 'bottom:10px;'
        },
        {
          key: 'front_belly_left',
          direction: 'left',
          tagLable: '正面左肚',
          lineWidth: '27',
          style: 'bottom:13px;'
        },
        {
          key: 'front_abdomen_left',
          direction: 'left',
          tagLable: '正面左腹',
          lineWidth: '44',
          style: 'bottom:8px;'
        },
        {
          key: 'front_hip_left',
          direction: 'left',
          tagLable: '正面左臀',
          lineWidth: '19',
          style: 'bottom:12px;left:15px;'
        },
        {
          key: 'front_prostate_left',
          direction: 'left',
          tagLable: '正面左腺',
          lineWidth: '41',
          style: 'bottom:6px;left:7px;'
        },
        {
          key: 'front_thigh_left',
          direction: 'left',
          tagLable: '正面左大腿',
          lineWidth: '42',
          style: 'bottom:10px;'
        },
        {
          key: 'front_knee_left',
          direction: 'left',
          tagLable: '正面左膝',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_leg_left',
          direction: 'left',
          tagLable: '正面左小腿',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_ankle_left',
          direction: 'left',
          tagLable: '正面左脚踝',
          lineWidth: '42',
          style: ''
        },
        {
          key: 'front_foot_left',
          direction: 'left',
          tagLable: '正面左脚',
          lineWidth: '23',
          style: ''
        },

        {
          key: 'front_forehead_center',
          direction: 'left',
          tagLable: '额头',
          lineWidth: '60',
          style: 'bottom:25px'
        },
        {
          key: 'front_nose_center',
          direction: 'right',
          tagLable: '鼻子',
          lineWidth: '58',
          style: 'bottom:5px;'
        },
        {
          key: 'front_mouth_center',
          direction: 'left',
          tagLable: '嘴',
          lineWidth: '61',
          style: ''
        },
        {
          key: 'front_neck_center',
          direction: 'right',
          tagLable: '颈',
          lineWidth: '125',
          style: 'bottom:5px'
        },
        {
          key: 'front_waist_center',
          direction: 'left',
          tagLable: '腰',
          lineWidth: '162',
          style: 'bottom:12px;'
        },
        {
          key: 'front_belly_center',
          direction: 'right',
          tagLable: '肚子',
          lineWidth: '97',
          style: 'bottom:10px;'
        },
        {
          key: 'front_abdomen_center',
          direction: 'left',
          tagLable: '腹部',
          lineWidth: '162',
          style: 'bottom:10px;'
        },
        {
          key: 'front_prostate_center',
          direction: 'right',
          tagLable: '前列腺',
          lineWidth: '38',
          style: 'bottom:7px;'
        }
      ],
      backImageSectionList: [
        {
          key: 'back_brain_left',
          direction: 'right',
          tagLable: '头部左侧',
          lineWidth: '40',
          style: ''
        },
        {
          key: 'back_neck_left',
          direction: 'right',
          tagLable: '颈部左侧',
          lineWidth: '50',
          style: 'bottom:15px;left:-50px'
        },
        {
          key: 'back_arm_left',
          direction: 'right',
          tagLable: '左肩',
          lineWidth: '110',
          style: ';left:-138px'
        },
        {
          key: 'back_biceps_left',
          direction: 'right',
          tagLable: '左上臂',
          lineWidth: '70',
          style: 'bottom:20px'
        },
        {
          key: 'back_aelbow_left',
          direction: 'right',
          tagLable: '左胳膊肘',
          lineWidth: '43',
          style: ''
        },
        {
          key: 'back_underarm_left',
          direction: 'right',
          tagLable: '左小臂',
          lineWidth: '48',
          style: ''
        },
        {
          key: 'back_wrist_left',
          direction: 'right',
          tagLable: '左手腕',
          lineWidth: '38',
          style: 'bottom:4px;'
        },
        {
          key: 'back_opisthenar_left',
          direction: 'right',
          tagLable: '左手背',
          lineWidth: '40',
          style: ''
        },
        {
          key: 'back_finger_left',
          direction: 'right',
          tagLable: '左手指',
          lineWidth: '27',
          style: ''
        },

        {
          key: 'back_rearSide_left',
          direction: 'right',
          tagLable: '左后背',
          lineWidth: '132',
          style: 'bottom:37px'
        },
        {
          key: 'back_backB_left',
          direction: 'right',
          tagLable: '左后背下',
          lineWidth: '132',
          style: 'bottom:10px'
        },
        {
          key: 'back_waistTop_left',
          direction: 'right',
          tagLable: '左腰上',
          lineWidth: '120',
          style: 'bottom:5px;'
        },
        {
          key: 'back_waist_left',
          direction: 'right',
          tagLable: '左腰',
          lineWidth: '35',
          style: ''
        },
        {
          key: 'back_buttocks_left',
          direction: 'right',
          tagLable: '左臀',
          lineWidth: '87',
          style: 'bottom:30px;left:-95px;'
        },

        {
          key: 'back_thigh_left',
          direction: 'right',
          tagLable: '左大腿',
          lineWidth: '96',
          style: ''
        },
        {
          key: 'back_knee_left',
          direction: 'right',
          tagLable: '左膝盖',
          lineWidth: '80',
          style: ''
        },
        {
          key: 'back_leg_left',
          direction: 'right',
          tagLable: '左小腿',
          lineWidth: '71',
          style: ''
        },
        {
          key: 'back_ankle_left',
          direction: 'right',
          tagLable: '左脚踝',
          lineWidth: '58',
          style: ''
        },
        {
          key: 'back_foot_left',
          direction: 'right',
          tagLable: '左脚',
          lineWidth: '60',
          style: 'bottom:10px'
        },

        {
          key: 'back_afterbrain_center',
          direction: 'left',
          tagLable: '后脑',
          lineWidth: '68',
          style: 'bottom:20px'
        },
        {
          key: 'back_cervical_center',
          direction: 'right',
          tagLable: '颈椎',
          lineWidth: '70',
          style: 'bottom:10px'
        },
        {
          key: 'back_lumbar_center',
          direction: 'left',
          tagLable: '腰椎',
          lineWidth: '179',
          style: 'bottom:37px'
        },
        {
          key: 'back_anus_center',
          direction: 'right',
          tagLable: '肛门',
          lineWidth: '65',
          style: ''
        },
        {
          key: 'back_brain_right',
          direction: 'left',
          tagLable: '头部右侧',
          lineWidth: '40',
          style: ''
        },
        {
          key: 'back_neck_right',
          direction: 'left',
          tagLable: '颈部右侧',
          lineWidth: '50',
          style: ''
        },
        {
          key: 'back_arm_right',
          direction: 'left',
          tagLable: '右肩',
          lineWidth: '110',
          style: 'bottom:15px;left:32px'
        },
        {
          key: 'back_biceps_right',
          direction: 'left',
          tagLable: '右上臂',
          lineWidth: '68',
          style: 'bottom:20px;'
        },
        {
          key: 'back_aelbow_right',
          direction: 'left',
          tagLable: '右胳膊肘',
          lineWidth: '41',
          style: ''
        },
        {
          key: 'back_underarm_right',
          direction: 'left',
          tagLable: '右小臂',
          lineWidth: '46',
          style: ''
        },
        {
          key: 'back_wrist_right',
          direction: 'left',
          tagLable: '右手腕',
          lineWidth: '38',
          style: 'bottom:2px;'
        },
        {
          key: 'back_opisthenar_right',
          direction: 'left',
          tagLable: '右手背',
          lineWidth: '40',
          style: ''
        },
        {
          key: 'back_finger_right',
          direction: 'left',
          tagLable: '右手指',
          lineWidth: '30',
          style: ''
        },

        {
          key: 'back_rearSide_right',
          direction: 'left',
          tagLable: '右后背',
          lineWidth: '122',
          style: 'bottom:37px'
        },
        {
          key: 'back_backB_right',
          direction: 'left',
          tagLable: '右后背下',
          lineWidth: '132',
          style: 'bottom:10px'
        },
        {
          key: 'back_waistTop_right',
          direction: 'left',
          tagLable: '右腰上',
          lineWidth: '120',
          style: ''
        },
        {
          key: 'back_waist_right',
          direction: 'left',
          tagLable: '右腰',
          lineWidth: '35',
          style: ''
        },
        {
          key: 'back_buttocks_right',
          direction: 'left',
          tagLable: '右臀',
          lineWidth: '87',
          style: ''
        },

        {
          key: 'back_thigh_right',
          direction: 'left',
          tagLable: '右大腿',
          lineWidth: '96',
          style: 'bottom:10px;left:10px'
        },
        {
          key: 'back_knee_right',
          direction: 'left',
          tagLable: '右膝盖',
          lineWidth: '80',
          style: ''
        },
        {
          key: 'back_leg_right',
          direction: 'left',
          tagLable: '右小腿',
          lineWidth: '71',
          style: ''
        },
        {
          key: 'back_ankle_right',
          direction: 'left',
          tagLable: '右脚踝',
          lineWidth: '58',
          style: ''
        },
        {
          key: 'back_foot_right',
          direction: 'left',
          tagLable: '右脚',
          lineWidth: '59',
          style: 'bottom:10px'
        }
      ],
      selectedSlice: {} // 选中的切片
    }
  },
  props: {
    isBabyBody: {
      type: Boolean, // 是否显示部位图片
      default: false
    },
    showPosiImage: {
      type: Boolean, // 是否显示部位图片
      default: true
    },
    showTag: {
      type: Boolean, // 点击隐藏切片
      default: true
    },
    scale: {
      type: Number, // 缩放比例
      default: 1
    },
    printBodyImageScale: {
      type: Number, // 缩放比例
      default: 1
    },
    fontSize: {
      type: Number,
      default: 14
    },
    // 显示类型  目前有导管 皮肤等数据
    type: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean, // 是否展示标签
      default: true
    },
    clickHideSlice: {
      type: Boolean, // 点击隐藏切片
      default: false
    },
    selectOneSlice: {
      type: Boolean, // 只允许选中一个切片
      default: false
    },
    bodyLeft: {
      type: Number, // 是否显示部位图片
      default: 0
    },
    // 是否展示转换按钮
    showConvert: {
      type: Boolean,
      default: true
    },
    // 人体正反面
    bodyFront: {
      type: Boolean,
      default: true
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    tagColor: {
      type: String,
      default: ''
    },
    showMenu: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    bodyFront: {
      immediate: true,
      handler(newVal) {
        this.isFront = newVal
      }
    },
    scale: function (newValue) {
      const staticScale = this.$h5 ? 1 : 0.6
      this.labelPositionScale = this.scale >= 1 ? this.scale : (staticScale / this.scale)
    }
  },
  computed: {
    imageList() {
      if (this.isFront) {
        return this.fromtImageSectionList
      } else {
        return this.backImageSectionList
      }
    },
    bodyImageDivClass() {
      if (this.isFront) {
        return 'front_body'
      } else {
        return 'back_body'
      }
    },
    rightLableImageDiv() {
      if (this.isFront) {
        return 'left-label-image'
      } else {
        return 'right-label-image'
      }
    },
    leftLableImageDiv() {
      if (this.isFront) {
        return 'right-label-image'
      } else {
        return 'left-label-image'
      }
    }
  },
  created() { },
  mounted() {
    const staticScale = this.$h5 ? 1 : 0.6
    this.labelPositionScale = this.scale >= 1 ? this.scale : (staticScale / this.scale)
  },
  methods: {
    reset() {
      this.selectedSlice = {}
    },
    showCatheterItem(item, existValue) {
      this.$emit('closeMenuContent')
      if (this.clickHideSlice) {
        if (this.selectOneSlice) {
          this.selectedSlice = {}
        } else {
          this.selectedSlice = { ...this.selectedSlice }
        }
        const key = item.key
        const image = document.getElementById(existValue).style[
          'background-image'
        ]
        let currentItemSelected = null
        if (image === '') {
          this.selectedSlice[key] = item
          currentItemSelected = true
        } else {
          delete this.selectedSlice[key]
          currentItemSelected = false
        }
        this.$emit(
          'selectSliceChange',
          this.selectedSlice,
          item,
          currentItemSelected
        )
      }
    },
    converImage() {
      this.isFront = !this.isFront
    },
    sliceBackImageStyle(key) {
      if (this.selectedSlice[key]) {
        if (this.showPosiImage) {
          const image = require('@/assets/img/3dBabyBody/' + key + '.png')
          return 'url(' + image + ')'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    setDefaultSeleced(humanIdList) {
      this.selectedSlice = { ...humanIdList }
    },
    /**
     * 右键逻辑
     */
    showContentMenu($event, humanId) {
      this.$emit('showContentMenu', $event, humanId)
    },
    /**
     * 左键点击事件
     * @param {*} $event
     * @param {*} item
     * @param {*} index
     */
    handelClick($event, item, index) {
      if (!this.showMenu) {
        this.showCatheterItem(item, 'imageSection-' + index)
      } else {
        this.showContentMenu($event, item.key)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bodyImage {
  background-repeat: no-repeat;
  position: absolute;
  background-position: center center;
  background-size: auto 100%;
  -webkit-print-color-adjust: exact !important;
}

.right-label-position {
  height: 24px;
  width: 24px;
  top: 565px;
  left: 48px;
}

.left-label-position {
  height: 24px;
  width: 24px;
  top: 565px;
  right: 50px;
}

.right-label-image {
  background-image: url('~@/assets/img/3dbody/right-label.png');
}

.left-label-image {
  background-image: url('~@/assets/img/3dbody/left-label.png');
}

.right-convert {
  background-image: url('~@/assets/img/3dbody/right-convert.png');
  height: 22px;
  width: 24px;
  top: 0px;
  left: 30px;
  position: relative;
}

.left-convert {
  background-image: url('~@/assets/img/3dbody/left-convert.png');
  height: 22px;
  width: 24px;
  top: 0px;
  right: 30px;
  position: relative;
}

@media (min-width: 1440px) and (max-width: 1680px) {
  .right-label-position {
    height: 24px;
    width: 24px;
  }

  .left-label-position {
    height: 24px;
    width: 24px;
  }

  .right-convert {
    height: 24px;
    width: 24px;
  }

  .left-convert {
    height: 24px;
    width: 24px;

  }
}

.front_body {
  background-image: url('~@/assets/img/3dBabyBody/front_body.png');
  height: 768px;
  width: 356px;
  background-size: auto 51.9662921348%;

  .front_cheek_right {
    width: 15px;
    height: 65px;
    top: 203px;
    left: 133px;
  }

  .front_forehead_center {
    width: 60px;
    height: 40px;
    top: 188px;
    left: 148px;
  }

  .front_cheek_left {
    width: 15px;
    height: 65px;
    top: 204px;
    left: 208px;
  }

  .front_eye_right {
    width: 25px;
    height: 14px;
    top: 242px;
    left: 146px;
  }

  .front_nose_center {
    width: 16px;
    height: 28px;
    top: 240px;
    left: 170px;
  }

  .front_eye_left {
    width: 25px;
    height: 14px;
    top: 242px;
    left: 184px;
  }

  .front_mouth_center {
    width: 29px;
    height: 16px;
    top: 271px;
    left: 163px;
  }

  .front_neck_right {
    width: 20px;
    height: 18px;
    top: 286px;
    left: 153px;
  }

  .front_neck_center {
    width: 14px;
    height: 11px;
    top: 293px;
    left: 172px;
  }

  .front_neck_left {
    width: 20px;
    height: 18px;
    top: 286px;
    left: 186px;
  }

  .front_arm_right {
    width: 59px;
    height: 27px;
    top: 294px;
    left: 114px;
  }

  .front_arm_left {
    width: 59px;
    height: 27px;
    top: 294px;
    left: 185px;
  }

  .front_chest_right {
    width: 42px;
    height: 60px;
    top: 312px;
    left: 136px;
  }

  .front_chest_left {

    width: 42px;
    height: 60px;
    top: 312px;
    left: 180px;
  }

  .front_biceps_right {
    width: 31px;
    height: 26px;
    top: 320px;
    left: 103px;
  }

  .front_elbow_right {
    width: 26px;
    height: 18px;
    top: 338px;
    left: 97px;
  }

  .front_underarm_right {
    width: 29px;
    height: 34px;
    top: 348px;
    left: 90px;
  }

  .front_wrist_right {
    width: 20px;
    height: 13px;
    top: 376px;
    left: 89px;
  }

  .front_opisthenar_right {
    width: 18px;
    height: 20px;
    top: 389px;
    left: 87px
  }

  .front_finger_right {
    width: 15px;
    height: 23px;
    top: 402px;
    left: 88px;
  }

  .front_waist_right {
    width: 34px;
    height: 22px;
    top: 369px;
    left: 137px;
  }

  .front_belly_right {
    width: 30px;
    height: 17px;
    top: 393px;
    left: 140px;
  }

  .front_abdomen_right {
    width: 32px;
    height: 17px;
    top: 404px;
    left: 135px;
  }

  .front_hip_right {
    width: 20px;
    height: 24px;
    top: 425px;
    left: 125px;
  }

  .front_prostate_right {
    width: 32px;
    height: 31px;
    top: 422px;
    left: 139px;

  }

  .front_waist_center {
    width: 12px;
    height: 26px;
    top: 364px;
    left: 172px;
  }

  .front_belly_center {
    width: 22px;
    height: 20px;
    top: 392px;
    left: 167px;
  }

  .front_abdomen_center {
    width: 21px;
    height: 21px;
    top: 411px;
    left: 168px;
  }

  .front_prostate_center {
    width: 21px;
    height: 24px;
    top: 433px;
    left: 169px;
  }

  .front_waist_left {
    width: 34px;
    height: 22px;
    top: 369px;
    left: 186px;
  }

  .front_belly_left {
    width: 30px;
    height: 17px;
    top: 393px;
    left: 187px;
  }

  .front_abdomen_left {
    width: 32px;
    height: 17px;
    top: 404px;
    left: 191px;
  }

  .front_hip_left {
    width: 20px;
    height: 24px;
    top: 426px;
    left: 213px;
  }

  .front_prostate_left {
    width: 32px;
    height: 31px;
    top: 422px;
    left: 189px;
  }

  // 上臂
  .front_biceps_left {
    width: 31px;
    height: 26px;
    top: 320px;
    left: 223px;
  }

  //手肘
  .front_elbow_left {
    width: 26px;
    height: 18px;
    top: 338px;
    left: 235px;
  }

  //小臂
  .front_underarm_left {
    width: 29px;
    height: 34px;
    top: 348px;
    left: 238px;
  }

  //手腕
  .front_wrist_left {
    width: 20px;
    height: 13px;
    top: 379px;
    left: 249px;
  }

  //手背
  .front_opisthenar_left {
    width: 18px;
    height: 20px;
    top: 390px;
    left: 251px;
  }

  //手指
  .front_finger_left {
    width: 15px;
    height: 23px;
    top: 402px;
    left: 254px;
  }

  .front_thigh_right {
    width: 47px;
    height: 23px;
    top: 450px;
    left: 121px;
  }

  .front_knee_right {
    width: 41px;
    height: 36px;
    top: 473px;
    left: 118px;
  }

  .front_leg_right {
    width: 36px;
    height: 32px;
    top: 508px;
    left: 124px;
  }

  .front_ankle_right {
    width: 24px;
    height: 15px;
    top: 537px;
    left: 138px;
  }

  .front_foot_right {
    width: 39px;
    height: 34px;
    top: 551px;
    left: 129px;
  }

  .front_thigh_left {
    width: 47px;
    height: 23px;
    top: 449px;
    left: 189px;
  }

  .front_knee_left {
    width: 41px;
    height: 36px;
    top: 473px;
    left: 198px;
  }

  .front_leg_left {
    width: 36px;
    height: 32px;
    top: 508px;
    left: 197px;
  }

  .front_ankle_left {
    width: 24px;
    height: 15px;
    top: 538px;
    left: 194px;
  }

  .front_foot_left {
    width: 39px;
    height: 34px;
    top: 551px;
    left: 189px;
  }
}

.back_body {
  background-image: url('~@/assets/img/3dBabyBody/back_body.png');
  height: 768px;
  width: 356px;
  background-size: auto 51.9662921348%;

  //头部左侧 brain
  .back_brain_left {
    width: 17px;
    height: 71px;
    top: 199px;
    left: 132px;
  }

  //颈部左侧 neck
  .back_neck_left {
    width: 24px;
    height: 24px;
    top: 259px;
    left: 144px;
  }

  //左肩 arm
  .back_arm_left {
    width: 53px;
    height: 30px;
    top: 284px;
    left: 120px;
  }

  //左上臂 biceps
  .back_biceps_left {
    width: 33px;
    height: 38px;
    top: 307px;
    left: 101px;
  }

  //左胳膊肘 elbow
  .back_aelbow_left {
    width: 31px;
    height: 28px;
    top: 335px;
    left: 90px;
  }

  //左小臂 underarm
  .back_underarm_left {

    width: 27px;
    height: 28px;
    top: 355px;
    left: 87px;
  }

  //左手腕 wrist
  .back_wrist_left {
    width: 20px;
    height: 14px;
    top: 376px;
    left: 87px;
  }

  //左手背 opisthenar
  .back_opisthenar_left {
    width: 16px;
    height: 16px;
    top: 388px;
    left: 86px;
  }

  //左手指 finger
  .back_finger_left {
    width: 18px;
    height: 23px;
    top: 398px;
    left: 87px;
  }

  //左后背 rearSide
  .back_rearSide_left {
    width: 37px;
    height: 74px;
    top: 297px;
    left: 136px;
  }

  .back_backB_left {
    width: 37px;
    height: 20px;
    top: 363px;
    left: 134px
  }

  //左腰上 waistTop
  .back_waistTop_left {
    width: 41px;
    height: 19px;
    top: 376px;
    left: 134px;
  }

  //左腰 waist
  .back_waist_left {
    width: 36px;
    height: 19px;
    top: 394px;
    left: 137px
  }

  //左臀 buttocks
  .back_buttocks_left {
    width: 45px;
    height: 49px;
    top: 415px;
    left: 127px;
  }

  //左大腿 thigh
  .back_thigh_left {
    width: 39px;
    height: 39px;
    top: 442px;
    left: 122px;
  }

  //左膝盖 knee
  .back_knee_left {
    width: 33px;
    height: 23px;
    top: 478px;
    left: 120px;
  }

  //左小腿 leg
  .back_leg_left {
    width: 35px;
    height: 41px;
    top: 504px;
    left: 124px;
  }

  //左脚踝 ankle
  .back_ankle_left {
    width: 25px;
    height: 19px;
    top: 544px;
    left: 137px;
  }

  //左脚 foot
  .back_foot_left {
    width: 36px;
    height: 21px;
    top: 562px;
    left: 132px;
  }

  //后脑 afterbrain
  .back_afterbrain_center {
    width: 50px;
    height: 39px;
    top: 190px;
    left: 153px
  }

  //颈椎 cervical
  .back_cervical_center {
    width: 24px;
    height: 25px;
    top: 258px;
    left: 166px;
  }

  //腰椎 lumbar
  .back_lumbar_center {
    width: 11px;
    height: 82px;
    top: 294px;
    left: 173px;
  }

  //肛门 anus
  .back_anus_center {
    width: 11px;
    height: 20px;
    top: 432px;
    left: 173px;
  }

  //头部右侧 brain
  .back_brain_right {
    width: 17px;
    height: 71px;
    top: 199px;
    right: 132px;
  }

  //颈部右侧 neck
  .back_neck_right {
    width: 24px;
    height: 24px;
    top: 259px;
    right: 142px;

  }

  //右肩 arm
  .back_arm_right {
    width: 53px;
    height: 30px;
    top: 284px;
    right: 119px;
  }

  //右上臂 biceps
  .back_biceps_right {
    width: 33px;
    height: 38px;
    top: 307px;
    right: 102px;
  }

  //右胳膊肘 elbow
  .back_aelbow_right {
    width: 31px;
    height: 28px;
    top: 335px;
    right: 92px;
  }

  //右小臂 underarm
  .back_underarm_right {
    width: 27px;
    height: 28px;
    top: 355px;
    right: 87px;
  }

  //右手腕 wrist
  .back_wrist_right {
    width: 20px;
    height: 14px;
    top: 376px;
    right: 87px;
  }

  //右手背 opisthenar
  .back_opisthenar_right {
    width: 16px;
    height: 16px;
    top: 388px;
    right: 86px;
  }

  //右手指 finger
  .back_finger_right {
    width: 18px;
    height: 23px;
    top: 398px;
    right: 86px;
  }

  //右后背 rearSide
  .back_rearSide_right {
    width: 37px;
    height: 74px;
    top: 298px;
    right: 135px;
  }

  .back_backB_right {
    width: 37px;
    height: 20px;
    top: 363px;
    right: 134px;
  }

  //右腰上 waistTop
  .back_waistTop_right {
    width: 41px;
    height: 19px;
    top: 376px;
    right: 134px;

  }

  //右腰 waist
  .back_waist_right {
    width: 36px;
    height: 19px;
    top: 394px;
    right: 138px;
  }

  //右臀 buttocks
  .back_buttocks_right {
    width: 45px;
    height: 49px;
    top: 415px;
    right: 129px;
  }

  //右大腿 thigh
  .back_thigh_right {
    width: 39px;
    height: 39px;
    top: 442px;
    right: 124px;
  }

  //右膝盖 knee
  .back_knee_right {
    width: 33px;
    height: 23px;
    top: 478px;
    right: 122px;
  }

  //右小腿 leg
  .back_leg_right {
    width: 35px;
    height: 41px;
    top: 504px;
    left: 197px;
  }

  //右脚踝 ankle
  .back_ankle_right {
    width: 25px;
    height: 19px;
    top: 544px;
    left: 194px;
  }

  //右脚 foot
  .back_foot_right {
    width: 36px;
    height: 21px;
    top: 562px;
    right: 131px;
  }
}
</style>
