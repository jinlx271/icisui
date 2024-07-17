<template>
  <div id="app" class="with-watermark">
    <draggable-msg :minHeight="105" :minWidth="150" :resizable="true"
      v-if="$route.path && $route.path != '/' && $route.path.indexOf('login') < 0 && userPersonalizedConfig.isShow && dragMsg.dragMsgText"
      :w="userPersonalizedConfig.w" :h="userPersonalizedConfig.h" :x="userPersonalizedConfig.x"
      :y="userPersonalizedConfig.y" @dragstop="dragstop" @resizing="onResize" :parent="true">
      <div class="draggable-msg flex flex-ver el-popover">
        <div class="flex-1 flex flex-ver">
          <div class="flex" @mousedown.stop>
            <div class="flex-1 el-dialog__title">
              <span>提示</span>
            </div>
          </div>
          <div class="flex-1 dragcontent">
            <i class="el-icon-warning" style="color:orange" />
            <div class="text text-wrapper el-textarea">{{ dragMsg.dragMsgText }}</div>
          </div>
        </div>
        <div class="flex " style="justify-content:space-around">
          <template>
            <div @mousedown.stop>
              <el-button @click="hideMsg" type="primary" size="mini">确认</el-button>
            </div>
          </template>
        </div>
      </div>
    </draggable-msg>
    <div class="v-modal" tabindex="0" style="z-index: 9999;"
      v-if="$route.path && $route.path != '/' && $route.path.indexOf('login') < 0 && dragMsg.isFixShow">
    </div>
    <draggable-msg :draggable="false" :resizable="false"
      v-if="$route.path && $route.path != '/' && $route.path.indexOf('login') < 0 && dragMsg.isFixShow" :w="fixedConfig.w"
      :h="fixedConfig.h" :x="fixedConfig.x" :y="fixedConfig.y" :parent="true">
      <div class="draggable-msg flex flex-ver el-popover">
        <div class="flex-1 flex flex-ver">
          <div class="flex">
            <div class="flex-1 el-dialog__title">
              <span v-if="dragMsg.controlType == 2">确认信息</span>
              <span v-else>提示</span>
            </div>
          </div>
          <div class="flex-1 dragcontent">
            <i class="el-icon-warning" style="color:orange" />
            <div class="text text-wrapper el-textarea">{{ dragMsg.msg }}<template
                v-if="dragMsg.msg && dragMsg.controlType == 2"><span v-if="dragMsg.controlNode == 2">,确认继续出区吗？</span><span
                  v-if="dragMsg.controlNode == 1">,确认继续归档吗？</span></template><template
                v-if="dragMsg.msg && dragMsg.controlType == 1"><span v-if="dragMsg.controlNode == 2">,出区失败!</span><span
                  v-if="dragMsg.controlNode == 1">,归档失败!</span></template></div>
          </div>
        </div>
        <div class="flex " style="justify-content:space-around">
          <template v-if="dragMsg.controlType == 1">
            <div @mousedown.stop>
              <el-button @click="$store.commit('set_dragMsg', { isFixShow: false })" type="primary"
                size="mini">确认</el-button>
            </div>
          </template>
          <template v-else-if="dragMsg.controlType == 2">
            <div @mousedown.stop>
              <el-button @click="$store.commit('set_dragMsg', { isFixShow: false })" size="mini">取消</el-button>
            </div>
            <div @mousedown.stop>
              <el-button @click="eventBus.$emit('dragMsg', 'continue')" type="primary" size="mini">确认</el-button>
            </div>
          </template>
          <template v-else>
            <div @mousedown.stop>
              <el-button @click="$store.commit('set_dragMsg', { isFixShow: false })" type="primary"
                size="mini">确认</el-button>
            </div>
          </template>
        </div>
      </div>
    </draggable-msg>
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- 重要消息提醒 文书打印页面不要显示-->
    <template v-if="noticeList.length && $route.path.indexOf('nurseRecordPrint') == -1">
      <i v-if="newsShow == '1'" ref="newsFc" @click="newsFc('2')" @mousedown="buttonStartFunc" :style="newsStyle"
        class="el-icon-d-arrow-left newsFc"></i>
      <div v-else-if="newsShow == '2'" ref="newsFrame" @mouseenter="honewsFrame" @mouseleave="mouseleave"
        class="newsFrame" :style="newsFrameStyle">
        <i @click="newsFc('1')" class="el-icon-d-arrow-right" style="cursor: pointer;"></i>
        <div ref="newsFrame_half" class="newsFrame_half" @mousedown="newsFrameStartFunc"
          :class="{ showNewsFrame: showNewsFrame }">
          <div class="newsDiv">
            <template v-if="noticeList[noticeListIndex]">
              <button type="button" class="newsButton">{{ noticeList[noticeListIndex].title }}</button>
              <span>{{ noticeList[noticeListIndex].summary }}</span>
            </template>
          </div>
        </div>
        <div class="newsFrame_button">
          <i @click="previousFc" class="el-icon-caret-left"></i>
          <el-button type="text" @click="toHandleFc(noticeListIndex)">去处理</el-button>
          <i @click="nextFc" class="el-icon-caret-right"></i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { getCookie } from '@/utils/cookie' // 验权
import { WaterMark, verification_queryVerifiyLogUtils } from '@/utils/utils'
import { moniitemRecord_getMoniitemWarningRecord } from '@/api/configuration'
import { concern_queryConcernMatters } from '@/api/news'
import eventBus from '@/utils/eventBus'
import {
  patientInfo_getPaientInfo
} from '@/api/patient'
import { patientInfoFormat, findArray } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      fixedConfig: { w: 300, h: 200, x: (document.documentElement.clientWidth - 300) / 2, y: (document.documentElement.clientHeight - 200) / 2 },
      eventBus: eventBus,
      WaterMarkText: '',
      WaterMarkClassList: [
        {
          name: 'tight',
          width: 300,
          height: 120
        },
        {
          name: 'middle',
          width: 500,
          height: 200
        },
        {
          name: 'loose',
          width: 650,
          height: 300
        }
      ],
      timer: null,
      abnormalSigns: false, // 异常体征
      queryData: {
        wardCode: '',
        startTime: ''
      },
      calculationNumber: 0,
      setTimeFlag: true,
      newsShow: '0', // 消息显示隐藏
      newsStyle: {
        top: '110px',
        left: (document.documentElement.clientWidth || document.body.clientWidth) - 30 + 'px'
      }, // 消息图片弹框样式
      newsFrameStyle: {
        top: '80px',
        left: (document.documentElement.clientWidth || document.body.clientWidth) - 530 + 'px'
      }, // 消息弹窗样式
      noticeList: [], // 重要提醒数据
      noticeListIndex: 0, // 第几条
      honewsFrameFlag: true, // 鼠标移入锁
      showNewsFrame: false, // 样式动画和数据不匹配
      xtcs43: '',
      noticeFcFlag: true, // 是否发请求
      limitFeat: '0',
      parentWidth: '',
      parentHeight: '',
      isMousedown: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentUserWard', 'msgFloat', 'dragMsg']),

    config() {
      return this.userInfo?.watermark || {}
    },
    userPersonalizedConfig() {
      const configCode = '提示框设置'
      const compare = this.$store.state.app.userPersonalizedConfig.filter(v => v.configCode == configCode)
      return compare.length == 1 ? compare[0].configValue : { w: 300, h: 200, x: (document.documentElement.clientWidth - 300) / 2, y: (document.documentElement.clientHeight - 200) / 2 }
    },
    appCss() {
      let cssText = ''
      if (this.parentWidth) {
        cssText += Number(this.parentWidth) < 1366 ? 'auto-x' : ''
      }
      if (this.parentHeight) {
        cssText += Number(this.parentHeight) < 768 ? 'auto-y' : ''
      }
      return cssText
    }
  },
  watch: {
    '$route.path': {
      handler: function (val) {
        if (val == '/login' && this.timer) {
          clearInterval(this.timer)
        }
        if (val.indexOf('nurseRecordPrint') > -1) {
          clearInterval(this.timer)
          return
        }
        const watermarkNode = document.getElementsByClassName('water-mark-wrap')
        if (watermarkNode.length) {
          watermarkNode[0].innerHTML = ''
        }
        const tockenInfo = getCookie('token') // 用户是否有登录信息
        this.limitFeat = this.$route.query.limitFeat
        this.refreshBodySize()
        if (tockenInfo) {
          if (this.noticeList.length > 0 && this.newsShow == '0') {
            this.newsShow = '2'
            this.noticeListIndex = 0
          }
          if (this.newsShow == '0' && tockenInfo && this.noticeList.length == 0) {
            this.noticeFc && this.noticeFc()
          }
        }
      },
      immediate: true
    },
    userInfo: {
      immediate: true,
      handler(val) {
        // 用户信息发生改变 及时清理定时器 防止多用户信息切换
        if (this.timer) {
          clearInterval(this.timer)
        }
        if (val) {
          if (this.config?.enableFlag == 1) {
            this.getWaterMark(val)
            if (this.config?.showSet.includes('showDate')) {
              this.timer = setInterval(() => {
                this.getWaterMark(val)
              }, 1000)
            }
          }
        } else {
          const watermarkNode = document.getElementsByClassName('water-mark-wrap')
          if (watermarkNode.length) {
            watermarkNode[0].innerHTML = ''
          }
        }
        const tockenInfo = getCookie('token') // 用户是否有登录信息
        if (!tockenInfo) {
          this.newsShow = '0'
        } else {
          this.init()
        }
      }
    },
    currentUserWard: {
      handler: function (val) {
        if (this.newsShow == '2' || this.newsShow == '1') {
          this.$store.commit('set_msgFloat', { newsStyle: this.newsStyle, newsFrameStyle: this.newsFrameStyle, newsShow: this.newsShow })
          this.insertOrUpdateFc()
        }
        this.queryData.wardCode = val.wardCode
        this.noticeFcFlag = true // 是否可以请求noticeFc
        // 隐藏切换病区不会在显示
        this.noticeFc()
      },
      deep: true
    },
    newsStyle(val) {
      if (val.left.split('px')[0] > ((document.documentElement.clientWidth || document.body.clientWidth) - 30)) {
        val.left = (document.documentElement.clientWidth || document.body.clientWidth) - 30 + 'px'
      }
    },
    newsFrameStyle(val) {
      if (val.left.split('px')[0] > ((document.documentElement.clientWidth || document.body.clientWidth) - 530)) {
        val.left = (document.documentElement.clientWidth || document.body.clientWidth) - 530 + 'px'
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.autoTime) {
      clearInterval(this.autoTime)
    }
    next()
  },
  created() {
    this.$store.commit('set_XTCS0169')
    window.addEventListener('resize', this.refreshBodySize)
    // 截流
    this.debounceFC = _.debounce(() => {
      this.abnormalSignsFc()
    }, 5000)

    // 截流
    this.autoHtml = _.debounce(() => {
      this.autoHtmlFc()
    }, 5000)

    // 截流
    this.insertOrUpdateFc = _.debounce(() => {
      this.insertOrUpdate()
    }, 1000)
    // 截流
    this.onResize = _.debounce((x, y, width, height) => {
      this.onResizeEntity(x, y, width, height)
    }, 1000)

    // 截流
    this.noticeFc = _.debounce(() => {
      this.newsShow = '0' //  是否显示弹框
      if (this.xtcs43 == '') {
        return
      }
      const tockenInfo = getCookie('token') // 用户是否有登录信息
      if (location.hash == '#/login' || !tockenInfo) {
        return
      }
      this.noticeQuery()
    }, 2000)
  },
  methods: {
    refreshBodySize() {
      if (this.$route.path.indexOf('nurseRecordPrint') > -1) {
        document.body.style.setProperty('--bodyWidth', window.innerWidth + 'px')
        document.body.style.setProperty('--bodyWidthValue', window.innerWidth)
      } else {
        this.parentWidth = this.$route.query.width
        this.parentHeight = this.$route.query.height
        if (this.parentWidth) {
          document.body.style.setProperty('--bodyWidth', Number(this.parentWidth) < 1366 ? '1366px' : (this.parentWidth + 'px'))
          document.body.style.setProperty('--bodyWidthValue', Number(this.parentWidth) < 1366 ? 1366 : Number(this.parentWidth))
          document.body.style.setProperty('--bodyOverflowX', Number(this.parentWidth) < 1366 ? 'auto' : 'hidden')
        } else {
          document.body.style.setProperty('--bodyWidth', window.innerWidth + 'px')
          document.body.style.setProperty('--bodyWidthValue', window.innerWidth)
          document.body.style.setProperty('--bodyOverflowX', 'hidden')
        }
        if (this.parentHeight) {
          document.body.style.setProperty('--bodyHeight', Number(this.parentHeight) < 768 ? '768px' : (this.parentHeight + 'px'))
          document.body.style.setProperty('--bodyHeightValue', Number(this.parentHeight) < 768 ? 768 : Number(this.parentHeight))
          document.body.style.setProperty('--bodyOverflowY', Number(this.parentHeight) < 768 ? 'auto' : 'hidden')
        } else {
          document.body.style.setProperty('--bodyHeight', '100%')
          document.body.style.removeProperty('--bodyHeightValue', '100%')
          document.body.style.setProperty('--bodyOverflowY', 'hidden')
        }
      }
    },
    hideMsg() {
      const configCode = '提示框设置'
      const compare = this.$store.state.app.userPersonalizedConfig.filter(v => v.configCode == configCode)
      const configValue = compare.length == 1 ? Object.assign({}, compare[0].configValue || {}, { isShow: false }) : { isShow: false }
      this.$store.dispatch('userPersonalizedConfig', Object.assign({}, { configCode, configValue, userName: this.userInfo.userName }))
    },
    onResizeEntity: function (x, y, width, height) {
      const configCode = '提示框设置'
      const compare = this.$store.state.app.userPersonalizedConfig.filter(v => v.configCode == configCode)
      const configValue = compare.length == 1 ? Object.assign({}, compare[0].configValue || {}, { _x: x, _y: y, _w: width, _h: height, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight }) : { _x: x, _y: y, _w: width, _h: height, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight }
      this.$store.dispatch('userPersonalizedConfig', Object.assign({}, { configCode, configValue, userName: this.userInfo.userName }))
    },
    dragstop: function (x, y) {
      const configCode = '提示框设置'
      const compare = this.$store.state.app.userPersonalizedConfig.filter(v => v.configCode == configCode)
      const configValue = compare.length == 1 ? Object.assign({}, compare[0].configValue || {}, { _x: x, _y: y, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight }) : { _x: x, _y: y, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight }
      this.$store.dispatch('userPersonalizedConfig', Object.assign({}, { configCode, configValue, userName: this.userInfo.userName }))
    },
    /**
     * 初始化
     */
    async init() {
      if (Object.keys(this.$store.state.app.userPersonalizedConfig).length == 0) {
        verification_queryVerifiyLogUtils(this.currentUserWard.wardCode, this.userInfo.userName)
      }
      const getParams43 = await this.$getParams({
        paramGroupCode: 'XTCS',
        paramCode: 'XTCS0043'
      })
      this.xtcs43 = getParams43[0]?.paramValue
      this.noticeFcFlag = true // 是否发请求
      this.noticeFc()
      const getParams = await this.$getParams({
        paramGroupCode: 'XTCS',
        paramCode: 'XTCS0031'
      })
      this.abnormalSigns = getParams[0]?.paramValue
      if (+this.abnormalSigns) {
        this.abnormalSignsFc()
      }
      // 拿个性化数据
      this.allCheckListOneObj = findArray(this.$store.state.app?.userPersonalizedConfig, 'configCode', '重要消息提醒框')
      if (this.allCheckListOneObj) {
        setTimeout(() => {
          const configValue = this.allCheckListOneObj?.configValue
          this.newsStyle = configValue.newsStyle
          this.newsFrameStyle = configValue.newsFrameStyle
          this.newsShow = configValue.newsShow
          this.$store.commit('set_msgFloat', { newsStyle: this.newsStyle, newsFrameStyle: this.newsFrameStyle, newsShow: this.newsShow })
        }, 1000)
      }
    },
    getWaterMark(val) {
      let name = ''
      let userName = ''
      let deptName = ''
      let ip = ''
      let mac = ''
      let date = ''
      this.WaterMarkText = ''
      this.config?.showSet.forEach((item) => {
        switch (item) {
          case 'showName':
            name = ` ${val?.name || ''}`
            break
          case 'showUsername':
            userName = ` ${val?.userName || ''}`
            break
          case 'showDept':
            deptName = ` ${val?.deptName || ''}`
            break
          case 'showIp':
            ip = ` ${val?.watermark.ip || ''}`
            break
          case 'showMac':
            mac = ` ${val?.watermark.mac || ''}`
            break
          case 'showDate':
            date = ` ${this.$dayjs().format('YYYY-MM-DD HH:mm:ss')}` || ''
            break
        }
      })
      this.WaterMarkText = name + userName + deptName + ip + mac + date
      this.WaterMarkText && WaterMark(this.WaterMarkText, this.WaterMarkClassList[this.config?.showLocation || '1'], this.config?.transparency || 7)
    },
    /**
     * 体征提醒
     */
    abnormalSignsFc() {
      const self = this
      const tockenInfo = getCookie('token') // 用户是否有登录信息
      if (!!tockenInfo && location.hash != '#/login' && this.currentUserWard && this.currentUserWard.wardCode) {
        this.queryData.wardCode = this.currentUserWard.wardCode
        moniitemRecord_getMoniitemWarningRecord(this.queryData)
          .then((res) => {
            this.queryData.startTime = res.data.endTime
            if (res.data.data.length > 0) {
              this.calculationNumber = 0
              this.calculation(res.data.data)
            }
            setTimeout(() => {
              if (self.setTimeFlag) {
                self.debounceFC()
              }
            })
          })
          .then(() => {
            self.debounceFC()
          })
      } else {
        self.debounceFC()
      }
    },
    /**
     * 计算
     */
    calculation(data) {
      this.setTimeFlag = false
      if (data[this.calculationNumber]) {
        setTimeout(() => {
          this.notifyFc(data[this.calculationNumber])
          ++this.calculationNumber
          if (data[this.calculationNumber]) {
            this.calculation(data)
          } else {
            this.setTimeFlag = true
            this.debounceFC()
          }
        }, 2000)
      }
    },
    /**
     * 提示框
     */
    notifyFc(data) {
      const router = this.$router
      this.$notify({
        title: data.title,
        dangerouslyUseHTMLString: true,
        message: `<p>${data.bedNo} ${data.patientName}</p><p>${data.moniitemName} ${data.moniitemValue} ${data.unit}</p>`,
        position: 'bottom-right',
        showClose: false,
        type: 'warning',
        duration: 1500,
        onClick() {
          router.push({
            path: '/inpatienArea/nurseOrder'
          })
        }
      })
    },
    /**
     * 重要通知
     */
    noticeQuery() {
      if (!this.noticeFcFlag || this.limitFeat == 1) {
        return
      }
      concern_queryConcernMatters({
        messageType: 2, // 1-待办事项、消息中心  2-消息弹窗   0043系统参数
        icuRecordId: '', // 个人信息查询
        wardCode: this.currentUserWard.wardCode // 有值查所有病区
      })
        .then((res) => {
          this.newsShow = '1'
          this.noticeList = res.data.allList || []
          // 有数据默认展开
          if (this.noticeList.length > 0) {
            this.$nextTick(() => {
              // 刷新后显示到上次移动的位置
              if (this.msgFloat['newsStyle'] && this.msgFloat['newsFrameStyle']) {
                this.newsStyle = this.msgFloat['newsStyle']
                this.newsFrameStyle = this.msgFloat['newsFrameStyle']
              }
              if (this.msgFloat['newsShow']) {
                this.newsShow = this.msgFloat['newsShow']
                if (this.newsShow == '1') {
                  this.noticeFcFlag = false // 关闭请求
                  return
                }
              } else {
                this.newsShow = '2'
              }
              this.noticeListIndex = 0
              this.autoHtml()
            })
          } else {
            this.newsShow = '0'
          }
        })
        .catch(() => {
          this.newsShow = '0'
          this.noticeListIndex = 0
          this.noticeList = []
        })
    },
    /**
     * 自动翻页数据
     */
    autoHtmlFc() {
      if (location.hash == '#/login') {
        this.noticeFc()
        return
      }
      if ((this.noticeList.length && this.noticeList.length - 1 == this.noticeListIndex) || this.noticeListIndex > this.noticeList.length - 1) {
        this.noticeFc()
        return
      } else {
        if (this.honewsFrameFlag) {
          this.newsShow = '2'
          this.showNewsFrame = true // 后面有时间在写动画效果
          setTimeout(() => {
            this.nextFc()
          }, 500)
          setTimeout(() => {
            this.showNewsFrame = false // 后面有时间在写动画效果
          }, 1000)
        }
      }
      this.autoHtml()
    },
    /**
     * 下一条
     */
    nextFc(e) {
      if (this.noticeListIndex > this.noticeList.length - 2) {
        return
      }
      this.noticeListIndex++
    },
    /**
     * 上一条
     */
    previousFc(e) {
      if (this.noticeListIndex < 1) {
        return
      }
      this.noticeListIndex--
    },
    /**
     * 鼠标移入不能翻动数据
     */
    honewsFrame() {
      this.honewsFrameFlag = false
    },
    /**
     * 鼠标移出能翻动数据
     */
    mouseleave() {
      this.honewsFrameFlag = true
    },
    /**
     * 重要消息提醒
     * 显示文案 或者 显示按钮
     */
    newsFc(type) {
      if (!this.isMousedown) {
        return
      }
      // 显示长的文案
      if (type == '2') {
        this.newsShow = type
        this.noticeFcFlag = true // 是否可以请求noticeFc
        this.noticeQuery()
        this.$nextTick(() => {
          this.honewsFrameFlag = true // 点击按钮,应该可以翻动
        })
      } else if (type == '1') {
        // 显示按钮
        this.noticeFcFlag = false // 关闭请求
        this.newsShow = type
      }
      if (this.newsShow == '2' || this.newsShow == '1') {
        this.$store.commit('set_msgFloat', { newsStyle: this.newsStyle, newsFrameStyle: this.newsFrameStyle, newsShow: this.newsShow })
        this.insertOrUpdateFc()
      }
    },
    /**
     * 重要消息提醒 关闭
     */
    newsColeFc() {
      this.newsShow = true
    },
    /**
     * 去处理
     */
    async toHandleFc(index) {
      const batchDictObj = await this.$batchGetDictItemList(['HIS_DICT_SEX', 'HIS_DICT_RELATION_TYPE'])
      this.sexDictData = batchDictObj['HIS_DICT_SEX']
      this.patientRationData = batchDictObj['HIS_DICT_RELATION_TYPE']
      const item = this.noticeList[index]
      const xtcs0093 = await this.$queryParam({
        paramGroupCode: 'XTCS',
        paramCode: 'XTCS0093'
      })
      const params = {
        XTCS0093: xtcs0093[0]?.paramValue || '0'
      }
      let mrn = ''
      if (item.type !== '患者入区') {
        // 存个人信息
        if (!item.icuRecordId) {
          return
        }
        patientInfo_getPaientInfo(item.icuRecordId).then((res) => {
          if (item.type !== '患者出区') {
            this.$store.commit('set_patientInfo', patientInfoFormat(res.data, params, this.sexDictData, this.patientRationData))
          } else {
            mrn = res?.data?.inpatientEntity?.mrn
          }
          this.toHtml(mrn, item)
          return
        })
      }
      this.toHtml(mrn, item)
    },
    /** 跳页面 */
    toHtml(mrn, item) {
      const urlConfig = {
        患者入区: '/patientHome',
        患者出区: '/patientHome',
        医嘱提取: '/patient/orderExecute',
        医嘱DC: '/patient/orderExecute',
        医嘱执行: '/patient/orderExecute',
        用药情况: '/patient/orderExecute',
        护嘱执行: '/patient/monitoringData',
        监护数据: '/patient/monitoringData',
        监护计划: '/patient/monitoringData',
        液体平衡: '/patient/fluidBalance',
        管路护理: '/patient/pipelineCare',
        患者评估: '/patient/patientAssessment',
        床旁交班: '/patient/shiftExchange'
      }
      if (item.type == '患者入区') {
        // 还没做 (第三方接口协议) #/patientHome/homePage
        this.$store.commit('SET_msgInIcu', item.icuRecordId)
      } else if (item.type == '患者出区') {
        // 还没做 (第三方接口协议) #/patientHome/homePage
        this.$store.commit('SET_msgOutIcu', item.icuRecordId)
      } else if (item.type == '患者换床') {
        // 还没做
      } else if (item.type == '医嘱提取') {
        this.$store.commit('set_msgExtract', item.icuRecordId)
      } else if (item.type == '患者评估') {
        item.type && urlConfig[item.type] && this.$router.push({ path: urlConfig[item.type], query: { ...this.$route.query, formId: item.formId } })
        return
      }
      item.type && urlConfig[item.type] && this.$router.push({ path: urlConfig[item.type], query: this.$route.query })
    },

    /**
     * 鼠标点击按钮
     */
    buttonStartFunc(e) {
      e.preventDefault()
      e.stopPropagation()
      document.onmousemove = (evt) => {
        this.isMousedown = false
        if (evt.clientY < 14 || evt.clientX < 1) {
          return
        }
        if (evt.clientY >= document.documentElement.clientHeight - 14 || evt.clientX >= document.documentElement.clientWidth - 14) {
          return
        }
        let top = evt.clientY
        let left = evt.clientX - 15
        if (left < 1) {
          left = evt.clientX
          return
        }
        this.newsStyle = {
          top: top + 'px',
          left: left + 'px'
        }
        top = evt.clientY - 22
        left = evt.clientX - 500
        if (top < 1) {
          top = evt.clientY
        }
        if (left < 1) {
          left = evt.clientX
        }
        this.newsFrameStyle = {
          top: top + 'px',
          left: left + 'px'
        }
        this.insertOrUpdateFc()
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        setTimeout(() => {
          this.isMousedown = true
        }, 500)
      }
    },
    /**
     * 鼠标点击弹框
     */
    newsFrameStartFunc(e) {
      e.preventDefault()
      e.stopPropagation()
      document.onmousemove = (evt) => {
        if (evt.clientY < 1 || evt.clientX < 1) {
          return
        }
        if (evt.clientY >= document.documentElement.clientHeight - 25 || evt.clientX >= document.documentElement.clientWidth - 290) {
          return
        }
        let top = evt.clientY
        let left = evt.clientX + 250
        if (left > document.documentElement.clientWidth) {
          left = evt.clientX
        }
        this.newsStyle = {
          top: top + 'px',
          left: left + 'px'
        }
        top = evt.clientY - 25
        left = evt.clientX - 210
        if (top < 1 || left < 1) {
          if (top < 1) {
            top = evt.clientY
          }
          if (left < 1) {
            left = evt.clientX
          }
          return
        }
        this.newsFrameStyle = {
          top: top + 'px',
          left: left + 'px'
        }
        this.insertOrUpdateFc()
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    /**
     * 存起来定位
     */
    insertOrUpdate() {
      this.$store.commit('set_msgFloat', { newsStyle: this.newsStyle, newsFrameStyle: this.newsFrameStyle, newsShow: this.newsShow })
      this.$store.dispatch('userPersonalizedConfig', Object.assign({}, { configCode: '重要消息提醒框', configValue: { newsStyle: this.newsStyle, newsFrameStyle: this.newsFrameStyle, newsShow: this.newsShow }, userName: this.userInfo.userName }))
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.refreshBodySize)
  }
}
</script>
<style lang="scss">
.draggable {
  z-index: 100000 !important;
}

.dragcontent {
  &>i {
    position: absolute;
    left: 10px;
    top: 42px;
    font-size: 20px;
  }

  padding: 0 20px;
  height: calc(100% - 24px);

  .text {
    height: calc(100% - 75px);
    position: absolute;
    left: 35px;
    top: 40px;
    width: calc(100% - 50px);
    overflow: scroll;

  }
}

.auto-x {
  overflow-x: auto;
}

.auto-y {
  overflow-y: auto;
}

.draggable-msg {
  width: 100%;
  height: 100%;
  z-index: 100000;
  background: white;
}

.water-mark-wrap {
  position: absolute;
  width: 150%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  top: 0;
  left: 0;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  font-family: inherit;
}

.water-word {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  user-select: none;
  font-size: 20px;
  font-weight: 500;
  transform: rotate(-15deg);
  display: inline-block;

  &.tight {
    width: 300px;
    height: 120px;
  }

  &.middle {
    width: 500px;
    height: 200px;
  }

  &.loose {
    width: 650px;
    height: 300px;
  }
}

.el-icon-d-arrow-left.newsFc {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  position: fixed;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  background-color: var(--maincolor2);
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.newsFrame {
  width: 500px;
  height: 50px;
  position: fixed;
  border-radius: 5px;
  font-size: 12px;
  z-index: 2000;
  background-color: var(--maincolor4);
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  &_half {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &_button {
    width: 105px;

    i {
      font-size: 15px;
    }
  }
}

.newsButton {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  color: #ffffff;
  background-color: var(--maincolor2);
  border: 1px solid var(--maincolor2);
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 7px;
  font-size: 12px;
  border-radius: 4px;
}

.newsDiv {
  display: inline-block;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;

  span {
    margin-left: 2px;
    width: 300px;
    display: block;
    /*内联对象需加*/
    word-break: keep-all;
    /* 不换行 */
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 1;
    top: 0;
  }

  40% {
    opacity: 0;
    top: -40px;
  }

  50% {
    opacity: 0;
    top: 40px;
  }

  100% {
    opacity: 1;
    top: 1px;
  }

  // 100% {
  //   opacity: 0;
  //   top: -30px;
  //   left: -100px;
  //   transform: rotate(-4deg);
  // }
}

.showNewsFrame {
  -webkit-animation-name: fadeIn;
  /*动画名称*/
  -webkit-animation-duration: 1s;
  /*动画持续时间*/
  -webkit-animation-iteration-count: 1;
  /*动画次数*/
  -webkit-animation-delay: 0s;
  /*延迟时间*/
}

.newsFrame:hover .showNewsFrame {
  -webkit-animation-play-state: paused;
}
</style>
