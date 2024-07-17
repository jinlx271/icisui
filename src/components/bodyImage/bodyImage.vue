<template>
  <div id="bodyImage" class="bodyImage" :class="[bodyImageDivClass, theme]">

    <div v-for="(item, index) in imageList" :key="'imageSection-' + index" :id="'imageSection-' + index" class="bodyImage"
      :class="`${item.key}`" :style="{ 'background-image': sliceBackImageStyle(item.key) }"
      @click="handelClick($event, item, index)">
      <!-- {'background-color':sliceBackImageStyle(item.key),'border-radius':'50%','width': '30px','padding-bottom': '30px','height': '0'}" -->
      <template v-if="showLabel && selectedSlice[item.key]">
        <BodyImageTag :bodyLeft="bodyLeft" :type="type" :showPosiImage="showPosiImage" :showTag="showTag"
          :imageItem="item" :fontSize="fontSize" :pipeInfos="selectedSlice[`${item.key}`]" :isPrint="isPrint"
          :printBodyImageScale="printBodyImageScale"></BodyImageTag>
      </template>
    </div>
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
import { ageToDays } from '@/utils'
export default {
  name: 'BodyImage',
  components: { BodyImageTag },
  filters: {},
  props: {
    isBabyBody: {
      type: Boolean,
      default: false
    },
    age: {
      type: [Number, String, null],
      default: null
    },
    sex: {
      type: String,
      default: '男'
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
  data: function () {
    return {
      theme: '',
      labelPositionScale: 1,
      isFront: true,
      fromtImageSectionList: [
        {
          key: 'front_cheek_right',
          direction: 'right',
          tagLable: '正面右面颊',
          lineWidth: '30',
          style: 'bottom:50px'
        },
        {
          key: 'front_eye_right',
          direction: 'right',
          tagLable: '正面右眼',
          lineWidth: '43',
          style: 'bottom:5px'
        },
        {
          key: 'front_neck_right',
          direction: 'right',
          tagLable: '正面右脖',
          lineWidth: '41',
          style: 'bottom:26px'
        },
        {
          key: 'front_arm_right',
          direction: 'right',
          tagLable: '正面右臂',
          lineWidth: '40',
          style: 'bottom:30px;left:-100px'
        },
        {
          key: 'front_chest_right',
          direction: 'right',
          tagLable: '正面右胸',
          lineWidth: '87',
          style: 'bottom:95px'
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
          style: 'bottom:50px;'
        },
        {
          key: 'front_wrist_right',
          direction: 'right',
          tagLable: '正面右腕',
          lineWidth: '20',
          style: ''
        },
        {
          key: 'front_opisthenar_right',
          direction: 'right',
          tagLable: '正面右手背',
          lineWidth: '32',
          style: 'bottom:20px;'
        },
        {
          key: 'front_finger_right',
          direction: 'right',
          tagLable: '正面右手',
          lineWidth: '23',
          style: 'bottom:12px;'
        },
        {
          key: 'front_waist_right',
          direction: 'right',
          tagLable: '正面右腰',
          lineWidth: '15',
          style: 'bottom:10px;left:-50px;'
        },
        {
          key: 'front_belly_right',
          direction: 'right',
          tagLable: '正面右肚',
          lineWidth: '15',
          style: 'bottom:14px;left:-40px;'
        },
        {
          key: 'front_abdomen_right',
          direction: 'right',
          tagLable: '正面右腹',
          lineWidth: '24',
          style: 'bottom:16px;'
        },
        {
          key: 'front_hip_right',
          direction: 'right',
          tagLable: '正面右臀',
          lineWidth: '9',
          style: 'bottom:35px;'
        },
        {
          key: 'front_prostate_right',
          direction: 'right',
          tagLable: '正面右腺',
          lineWidth: '41',
          style: 'bottom:16px;'
        },
        {
          key: 'front_thigh_right',
          direction: 'right',
          tagLable: '正面右大腿',
          lineWidth: '81',
          style: 'bottom:40px;'
        },
        {
          key: 'front_knee_right',
          direction: 'right',
          tagLable: '正面右膝',
          lineWidth: '69',
          style: ''
        },
        {
          key: 'front_leg_right',
          direction: 'right',
          tagLable: '正面右小腿',
          lineWidth: '62',
          style: ''
        },
        {
          key: 'front_ankle_right',
          direction: 'right',
          tagLable: '正面右脚踝',
          lineWidth: '50',
          style: ''
        },
        {
          key: 'front_foot_right',
          direction: 'right',
          tagLable: '正面右脚',
          lineWidth: '38',
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
          style: 'left:80px;'
        },
        {
          key: 'front_chest_left',
          direction: 'left',
          tagLable: '正面左胸',
          lineWidth: '87',
          style: 'bottom:95px'
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
          style: 'bottom:24px;left:25px;'
        },
        {
          key: 'front_underarm_left',
          direction: 'left',
          tagLable: '正面左下臂',
          lineWidth: '30',
          style: 'bottom:30px;left:30px'
        },
        {
          key: 'front_wrist_left',
          direction: 'left',
          tagLable: '正面左腕',
          lineWidth: '15',
          style: 'bottom:22px;left:25px;'
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
          lineWidth: '24',
          style: 'bottom:15px;'
        },
        {
          key: 'front_hip_left',
          direction: 'left',
          tagLable: '正面左臀',
          lineWidth: '9',
          style: 'bottom:25px;left:5px;'
        },
        {
          key: 'front_prostate_left',
          direction: 'left',
          tagLable: '正面左腺',
          lineWidth: '45',
          style: 'bottom:6px;left:7px;'
        },
        {
          key: 'front_thigh_left',
          direction: 'left',
          tagLable: '正面左大腿',
          lineWidth: '82',
          style: 'bottom:40px;'
        },
        {
          key: 'front_knee_left',
          direction: 'left',
          tagLable: '正面左膝',
          lineWidth: '70',
          style: ''
        },
        {
          key: 'front_leg_left',
          direction: 'left',
          tagLable: '正面左小腿',
          lineWidth: '61',
          style: ''
        },
        {
          key: 'front_ankle_left',
          direction: 'left',
          tagLable: '正面左脚踝',
          lineWidth: '50',
          style: ''
        },
        {
          key: 'front_foot_left',
          direction: 'left',
          tagLable: '正面左脚',
          lineWidth: '38',
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
          style: 'bottom:26px;'
        },
        {
          key: 'front_belly_center',
          direction: 'right',
          tagLable: '肚子',
          lineWidth: '157',
          style: 'bottom:12px;'
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
          lineWidth: '178',
          style: 'bottom:3px;'
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
          style: 'bottom:35px;left:-50px'
        },
        {
          key: 'back_arm_left',
          direction: 'right',
          tagLable: '左肩',
          lineWidth: '110',
          style: ';left:-145px'
        },
        {
          key: 'back_biceps_left',
          direction: 'right',
          tagLable: '左上臂',
          lineWidth: '70',
          style: 'bottom:40px'
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
          style: ''
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
          style: 'bottom:110px'
        },
        {
          key: 'back_waistTop_left',
          direction: 'right',
          tagLable: '左腰上',
          lineWidth: '20',
          style: ''
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
          lineWidth: '30',
          style: 'bottom:60px'
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
          style: 'bottom:40px'
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
          style: 'bottom:95px'
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
          style: 'bottom:50px;left:63px'
        },
        {
          key: 'back_biceps_right',
          direction: 'left',
          tagLable: '右上臂',
          lineWidth: '68',
          style: 'bottom:25px;'
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
          style: ''
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
          style: 'bottom:110px'
        },
        {
          key: 'back_waistTop_right',
          direction: 'left',
          tagLable: '右腰上',
          lineWidth: '20',
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
          lineWidth: '35',
          style: ''
        },

        {
          key: 'back_thigh_right',
          direction: 'left',
          tagLable: '右大腿',
          lineWidth: '96',
          style: ''
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
          style: 'bottom:40px'
        }
      ],
      selectedSlice: {}, // 选中的切片
      XTCS0149: []
    }
  },
  watch: {
    isBabyBody(newVal) {
      this.init()
    },
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
    defaultTheme() {
      if (this.sex == '女') {
        return this.isBabyBody ? 'girl' : 'woman'
      } else {
        return this.isBabyBody ? 'boy' : 'man'
      }
    },
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
  async created() {
    const XTCS0149 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0149' })
    this.XTCS0149 = JSON.parse(XTCS0149[0]?.paramValue || '[]') || this.XTCS0149
    this.init()
  },
  mounted() {
    const staticScale = this.$h5 ? 1 : 0.6
    this.labelPositionScale = this.scale >= 1 ? this.scale : (staticScale / this.scale)
    this.$emit('loadSuccess', true)
  },
  methods: {
    init() {
      if (this.age === null) {
        this.theme = this.defaultTheme
      } else {
        const age = ageToDays(this.age)
        const imageConfig = this.XTCS0149.find(item => age >= item.ageMinValue && age <= item.ageMaxValue)
        if (imageConfig) {
          this.theme = imageConfig.imageList[+(this.sex == '女')]
        } else {
          this.theme = this.defaultTheme
        }
      }
    },
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
      if (this.theme && this.selectedSlice[key]) {
        if (this.showPosiImage) {
          const image = require(`@/assets/img/3dbody/${this.theme}/${key}.png`)
          return 'url(' + image + ')'
        } else {
          return '' // this.type == 'catheter' ? 'rgb(39,94,252)' : 'rgb(243,45,45)'
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
@import "@/assets/img/3dbody/body.scss";

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
  bottom: 0;
  left: -30px;
}

.left-label-position {
  height: 24px;
  width: 24px;
  bottom: 0;
  right: -30px;
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
    height: 32px;
    width: 32px;
  }

  .left-label-position {
    height: 32px;
    width: 32px;
  }

  .right-convert {
    height: 32px;
    width: 32px;
  }

  .left-convert {
    height: 32px;
    width: 32px;

  }
}
</style>
