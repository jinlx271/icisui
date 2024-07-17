<template>
  <div id="menuHead" class="menuHead" v-if="limitFeat != 1">
    <!-- 左边文案 -->
    <div class="leftDiv" @click="leftDivFc" @dblclick="systemInfoNameFc"
      :title="globalConfig.title + '-' + systemInfo.name">
      <!-- <svg-icon icon-class="logo" class="logoCss" /> -->
      <img v-show="XTCS0026" :src="unifiedImg" style="width:24px;height:24px" alt class="m-r10" />
      <span class="leftDiv_remarks">{{ globalConfig.title }}</span>
      <span class="leftDiv_remarks" v-if="systemInfoName">-{{ systemInfoName }}</span>
    </div>
    <!-- 中间的菜单按钮 -->
    <div class="centerDiv" ref="centerDiv">
      <el-menu :default-active="activeIndex" mode="horizontal" background-color="var(--maincolor)" text-color="#ffffff"
        @select="handleSelect">
        <!-- 可能只有一级,可能有二级 -->
        <div @click="noticeFc" v-for="item in mainMenu" :key="item.path">
          <router-link v-if="showItem(item)" :class="acitiveClass(item.path)" :ref="`menuPathList${item.path}`"
            :to="{ path: '/layout', query: { menuId: item.id, width: width, height: height,currentModel:item.path } }">
            <!-- 二级菜单的 -->
            <!-- <el-submenu v-if="item.isLeftMenu !== 1 && item.children && item.children.lenght > 0"  :index="index">
              <template slot="title">{{item.name}}</template>
              <el-menu-item v-for="(item2,index2) in item.children" :key="index2" :index="index+'-'+index2">{{item2.name}}</el-menu-item>
            </el-submenu>-->
            <!-- 只有一级菜单的 -->
            <el-menu-item class="centerDiv_itemDiv">{{ item.meta.title }}</el-menu-item>
          </router-link>
        </div>
      </el-menu>
    </div>
    <!-- 右边的一些按键总合 -->
    <div class="rightDiv">
      <div v-if="isIconSet" class="rightSmallMenu">
        <el-tooltip class="item" effect="dark" content="病区概览配置" placement="bottom">
          <svg-icon icon-class="moduleConfiguration" @click.native.prevent="iconSet" class="svgcoloranaspacu iconSet" />
        </el-tooltip>
      </div>
      <!-- 换肤 -->
      <div class="rightSmallMenu">
        <el-popover placement="top" :width="240">
          <div id="popoverDiv">
            <ul class="changeSkin">
              <li v-for="item in sysSkinList" :key="item.id" @click="handleCurrentSkin(item.id)">
                <div class="skinTop" :style="{ background: item.colorList[0].color }"></div>
                <div class="skinBottom"
                  :style="{ background: item.colorList[4].color, border: `1px solid ${item.colorList[0].color}` }">
                  <i v-if="currentUserSkin == item.id" class="el-icon-success"
                    :style="{ color: item.colorList[0].color }"></i>
                </div>
              </li>
            </ul>
          </div>
          <div slot="reference">
            <!-- 登录人头像显示  男女 医生护士 -->
            <el-tooltip class="item" effect="dark" content="换肤" placement="bottom">
              <svg-icon icon-class="skin" class="svgcoloranaspacu iconSkin" />
            </el-tooltip>
          </div>
        </el-popover>
      </div>
      <!-- 区域选择 -->
      <el-tooltip class="item" effect="dark" content="切换病区" placement="bottom">
        <el-select class="select" @change="handleSelectWorkbench" v-model="currentWardCode" placeholder="请选择">
          <el-option v-for="item in userWardList" :key="item.wardCode" :label="item.wardName"
            :value="item.wardCode"></el-option>
        </el-select>
      </el-tooltip>
      <!-- 头像名字 -->
      <el-tooltip class="item" effect="dark" content="账号管理" placement="bottom">
        <div class="headPortraitDiv rightSmallMenu">
          <el-popover placement="top" width="160">
            <div id="popoverDiv">
              <p class="restP" @click="changePasswordVisible = true">
                <svg-icon icon-class="password" class="topMenuIcon" :style="{ color: 'var(--maincolor)' }" />修改密码
              </p>
              <p class="restP" @click="changeUserFn">
                <i class="el-icon-sort" style="transform: rotate(90deg);font-size: 18px;padding: 0px 4px"
                  :style="{ color: 'var(--maincolor)' }"></i>切换账号
              </p>
              <p class="restP" @click="logOut" v-if="loginSource == 'common'">
                <svg-icon icon-class="cencellation" class="topMenuIcon" :style="{ color: 'var(--maincolor)' }" />退出登录
              </p>
              <el-divider></el-divider>
              <p class="timeP">最近登录：</p>
              <p class="timeP">{{ userInfo.loginDate | dateformat('YYYY-MM-DD HH:mm') }}</p>
              <p class="timeP">{{ systemInfo.name }}</p>
            </div>

            <div slot="reference">
              <!-- 登录人头像显示  男女 医生护士 -->
              <svg-icon :icon-class="headPortrait" class="svgcoloranaspacu iconHeadPortrait" />
              <span>{{ userInfo.name }}</span>
            </div>
          </el-popover>
        </div>
      </el-tooltip>
      <!-- 帮助按钮 -->
      <div class="rightSmallMenu">
        <el-tooltip class="item" effect="dark" content="操作指南" placement="bottom">
          <svg-icon @click.native.prevent="handleShowHelpPdf" icon-class="help" class="svgcoloranaspacu iconHelp" />
        </el-tooltip>
      </div>
      <!-- 通知按钮 -->
      <el-tooltip class="item" effect="dark" content="消息中心" placement="bottom">
        <div class="rightSmallMenu">
          <el-popover v-show="noticeList.length > 0" placement="top-start" v-model="popoverVisible"
            @hide="noticeListHideFc()" width="450" class="notice">
            <ul id="noticeDiv" v-show="noticeList.length > 0" v-infinite-scroll="infiniteListFc"
              infinite-scroll-distance="200" class="infinite-list">
              <li class="lineDiv infinite-list-item" v-for="item, index in infiniteList" :key="index"
                @click="clickLine(item)">
                <p class="h1P">{{ item.title }}</p>
                <!-- <p class="informationP">
                  患者：
                  <span>01床</span>
                  <span>张磊</span>
                  <span>男</span>
                </p>-->
                <p class="textP" :title="item.summary.split('\n')[0]">{{ item.summary.split('\n')[0] }}</p>
                <p class="textP" :title="item.summary.split('\n')[1]">{{ item.summary.split('\n')[1] }}</p>
                <el-divider></el-divider>
              </li>
            </ul>
            <div v-show="noticeList.length < 1" class="body">
              <el-empty :image-size="200" description="暂无消息"></el-empty>
            </div>
            <div slot="reference">
              <!-- 铃铛 -->
              <el-badge v-if="elBadge" :value="this.noticeList.length" class="item" :max="99">
                <svg-icon @click.native.prevent="noticeFc" icon-class="notice" class="svgcoloranaspacu iconNotice" />
              </el-badge>
              <svg-icon v-else @click.native.prevent="noticeFc" icon-class="notice" class="svgcoloranaspacu iconNotice" />
            </div>
          </el-popover>
          <!-- 铃铛 -->
          <svg-icon v-show="noticeList.length < 1" @click.native.prevent="noticeFc" icon-class="notice"
            class="svgcoloranaspacu iconNotice" />
        </div>
      </el-tooltip>
      <!-- 工作日程 -->
      <el-tooltip class="item" effect="dark" content="工作日程" placement="bottom">
        <div class="rightSmallMenu">
          <svg-icon @click.native.prevent="showSchedule" icon-class="schedule" class="svgcoloranaspacu iconSchedule" />
        </div>
      </el-tooltip>
      <!-- 777133【GA优化】单点登陆/外部调用屏蔽关闭按钮 普通登录方式可以获取退出登录 -->
      <template v-if="loginSource == 'common'">
        <!-- 分割线 -->
        <i class="iconVerticalLine"></i>
        <!-- 注销按钮 -->
        <div class="rightSmallMenu">
          <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <svg-icon @click.native.prevent="logOut" icon-class="cencellation" class="svgcoloranaspacu iconCancellation"
              :style="{ color: '#fff' }" />
          </el-tooltip>
        </div>
      </template>
      <!-- 右侧选择一个空图标 占位 -->
      <!-- <svg-icon v-else    /> -->
    </div>
    <winning-winfrom-menu v-if="showWinfrom" :wnClose="wnClose" :wnMin="wnMin" :wnMax="wnMax" :wnNoMax="wnNoMax" />
    <!-- 切换账号 -->
    <el-dialog title="切换账号" :visible.sync="changeUser" width="350px" :before-close="() => changeUser = false">
      <!-- 显示部分 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="70px" class="login-form"
        auto-complete="on" label-position="left">
        <!-- 用户名 -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入您的工号"
            maxlength="32">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input ref="password" type="password" v-model="loginForm.password" class="password" name="password"
            auto-complete="on" placeholder="请输入您的密码" maxlength="32" @keyup.enter.native="handleLogin">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => changeUser = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="changePasswordVisible" width="50%" :before-close="handleClose">
      <!-- 显示部分 -->
      <el-form ref="passwordForm" :model="form" :rules="rules" label-width="100px" status-icon>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input placeholder="请输入" v-model="form.oldPassword" type="password" autocomplete="off"
            show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input :placeholder="passTip" v-model="form.newPassword" type="password" autocomplete="off"
            show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input placeholder="请输入" v-model="form.confirmPassword" type="password" autocomplete="off"
            show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="changepasswordSubmit">保存</el-button>
      </span>
    </el-dialog>
    <!-- 查看pad的文档 -->
    <seepdf v-if="showSeepdf" :url="pdfUrl" @showSeepdfFC="showSeepdfFC"></seepdf>
    <el-dialog title="工作日程" :visible.sync="scheduleFlag" width="1280px">
      <div class="el-calendar__header" v-if="scheduleFlag">
        <div class="flex align-items-center">
          <span style="margin-right:20px;width:95px;">{{ scheduleMonth }}</span>
          <el-button type="primary" @click="gotoToday" circle>今</el-button>
          <el-button type="primary" circle class="el-icon-back" title="上一个月" @click="gotoPreMonth()"></el-button>
          <el-button type="primary" circle class="el-icon-right" title="下一个月" @click="gotoNextMonth()"></el-button>
        </div>
      </div>
      <el-calendar ref="calendar" v-model="scheduleValue" v-loading="loadSchedule" v-if="scheduleFlag">
        <template slot="dateCell" slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected flex flex-between scheduleDay' : 'flex flex-between scheduleDay'">
            <span class="day">
              {{ data.day.split('-')[2] }}
            </span>
            <span>
              {{ showLunarInfo(data.day) }}
            </span>
          </p>
          <template
            v-if="scheduleData[data.day] && scheduleTypeData[data.day].title && scheduleTypeData[data.day].title.length > 0">
            <p v-for="(item, index) in scheduleTypeData[data.day].title.slice(0, 2)" :key="index" class="scheduleInfo">
              <span @click="showMoreSchedule(data)">{{ item }}</span>
            </p>
            <p class="scheduleMore" v-if="scheduleData[data.day] && scheduleTypeData[data.day].title.length > 2"
              @click="showMoreSchedule(data)">更多</p>
          </template>
        </template>
      </el-calendar>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="scheduleMoreFlag" append-to-body width="60%">
      <div class="p-t10 p-b10 ">
        {{ scheduleDay }}
      </div>
      <el-table :data="scheduleData[scheduleDay]" height="480px" border @row-dblclick="openSchedule">
        <el-table-column label="时间" prop="scheduleTime" width="80px">
          <template slot-scope="scope">
            <span>{{ scope.row.scheduleTime.substr(0, 5) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行项分类" prop="scheduleType" width="100px"></el-table-column>
        <el-table-column label="执行项" prop="scheduleContent"></el-table-column>
        <el-table-column label="患者姓名" prop="patientName" width="120px"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce, groupBy, keyBy } from 'lodash'
import Cookie from 'js-cookie'
import { changePassword } from '@/api/login'
import { setRoute, handleCurrentSkin, changeIcon, verification_queryVerifiyLogUtils } from '@/utils/utils'
import md5 from 'js-md5' // 加密
import seepdf from '@/components/seePDF/pdf' // 查看pdf文档
import { concern_queryConcernMatters } from '@/api/news'
import { patientInfo_getPaientInfo } from '@/api/patient'
import { patientInfoFormat } from '@/utils/utils'
import {
  operationManual_list,
  schedule_queryWorkSchedules
} from '@/api/configuration'
import limitFeatMixin from '@/mixins/limitFeatMixin'
import { getUserWardList } from '@/api/login'
import { solar2lunar } from 'solarlunar'
import {
  axiosPost
} from '@/api/otherApi'
export default {
  name: 'MenuHead',
  components: {
    seepdf
  },
  mixins: [limitFeatMixin],
  computed: {
    ...mapGetters([
      'currentUserWard',
      'userWardList',
      'mainMenu',
      'userInfo',
      'indexUrl',
      'systemInfo',
      'sysSkinList',
      'currentUserSkin',
      'ssoIndexUrl',
      'loginSource'
    ]),
    unifiedImg() {
      const icon_url = this.loginRoleType ? (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + `image/${this.loginRoleType}/logo1.png` : ''
      return this.loginRoleType ? icon_url : this.XTCS0026 == 0 ? require('@/assets/img/logo.png') : require('@/assets/img/logo-fuxing-white.png')
    }
  },
  data: function () {
    const validatePass = (rule, value, callback) => {
      if (value === null || value === '') {
        callback(new Error('新密码不能为空!'))
      }
      if (value === this.form.oldPassword) {
        this.form.newPassword = ''
        callback(new Error('新密码不能和原密码一致!'))
      }
      if (value.length < 8 || value.length > 20) {
        this.form.newPassword = ''
        callback(new Error('密码长度应在8至20个字符之间!'))
      }
      // 等保三级校验 0033参数
      if (this.XTCS0033 == 1) {
        let num1 = 0
        let num2 = 0
        let num3 = 0
        let num4 = 0
        if (value.match(/\d+/g)) {
          num1 = 1
        }
        if (value.match(/[a-z]+/g)) {
          num2 = 1
        }
        if (value.match(/[A-Z]+/g)) {
          num3 = 1
        }
        if (value.match(/[^\w]+/g)) {
          num4 = 1
        }
        const num = num1 + num2 + num3 + num4
        if (num < 3) {
          this.form.newPassword = ''
          callback(new Error('新密码不符合等保要求，请重新设置!'))
        } else {
          callback()
        }
      } else {
        var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
        if (!reg.test(value)) {
          this.form.newPassword = ''
          callback(new Error('密码应是包含数字和字母的组合!'))
        } else {
          callback()
        }
      }
    }
    const confirmPasswordValidate = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        this.form.confirmPassword = ''
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateOldPass = (rule, value, callback) => {
      if (value === null || value === '') {
        this.form.oldPassword = ''
        callback(new Error('原密码不能为空!'))
      }
      // const tokenInfo = getCookie('token')
      axiosPost('sys/validataPassword', {
        'loginName': this.userInfo.userName,
        'password': md5(value)
      }
      ).then(res => {
        if (res.code === 0) callback()
        else {
          this.form.oldPassword = ''
          callback(new Error('原密码错误，请重新输入'))
        }
      }).catch(e => {
        this.form.oldPassword = ''
        callback(new Error('原密码错误，请重新输入'))
      })
      // sys_validataPassword({
      //  'loginName': this.userInfo.userName,
      //   'password': md5(value)
      // }).then(res => {
      //   if (res.code === 0) callback()
      //   else {
      //     this.form.oldPassword = ''
      //     callback(new Error('原始密码错误，请重新输入'))
      //   }
      // }).catch(e => {
      //   this.form.oldPassword = ''
      //   callback(new Error('原始密码错误，请重新输入'))
      // })
    }
    return {
      loginForm: {
        appid: '',
        deptId: '',
        icuCode: '',
        logionBeid: '',
        ticket: '',
        userid: '',
        password: '', // 登录密码
        username: '', // 登录账号
        workbenchCode: '', // 登录病区
        gbCode: '',
        gbName: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [{
          required: true, message: '请输入密码', validator: (rule, value, callback) => {
            if (value.length < 5 && 1 + 1 !== 2) {
              callback(new Error('密码不能小于5位'))
            } else {
              callback()
            }
          }
        }]
      },
      XTCS0026: globalConfig.XTCS0026,
      loginRoleType: localStorage.getItem('loginRoleType'),
      currentColor: 'red',
      currentWardCode: null, // 当前选择病区编码
      activeIndex: '0',
      globalConfig: globalConfig, // 公共参数
      changeUser: false,
      changePasswordVisible: false, // 修改密码的弹框显示
      popoverVisible: false, // 消息中心的弹框显示
      form: {
        oldPassword: '', // 原始密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码
      }, // 修改密码的v-model
      rules: {
        oldPassword: [
          { required: true, validator: validateOldPass, trigger: 'blur' }
        ], // 原始密码校验
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ], // 新密码校验
        confirmPassword: [
          { required: true, validator: confirmPasswordValidate, trigger: 'blur' }
        ] // 确认密码校验
      }, // 修改密码的验证条件
      pdfUrl: '/static/管理配置中心.pdf', // pdf文件地址
      showSeepdf: false, // 是否显示组件
      cssP: true, // css样式切换
      noticeList: [], // 待办事项
      sexDictData: [], // 性别字典
      patientRationData: [], // 家庭关系字典
      isIconSet: false, // 配置管着管理页面按钮
      headPortrait: '', // 头像 男女 医生护士
      handleCurrentSkin: handleCurrentSkin,
      systemInfoName: '', // 医院名称
      showWinfrom: window.winning, // 判断混合框架
      elBadge: false,
      XTCS0033: 0, // 等保三级开关
      passTip: '8-20个字符，至少包含数字，字母，下划线“_”中的两种',
      params: {},
      noticePageNum: 1, // 消息中无限翻页
      infiniteList: [], // 消息中心数据集合
      width: '',
      height: '',
      scheduleFlag: false,
      scheduleValue: '',
      scheduleMonth: '',
      scheduleData: {},
      scheduleTypeData: {},
      loadSchedule: false,
      scheduleMoreFlag: false,
      scheduleDay: '',
      startDateStr: ' ',
      endDateStr: ' '
    }
  },
  props: {},
  filters: {},
  watch: {
    '$route.path': {
      handler: function (val) {
        this.width = this.$route.query.width
        this.height = this.$route.query.height
      },
      immediate: true
    },
    mainMenu: {
      handler: function (val) {
        this.isIconSet = false
        for (let i = 0; i < val.length; i++) {
          if (val[i].name == 'wardOverview') {
            if (val[i].children.length > 0) {
              for (let j = 0; j < val[i].children.length; j++) {
                if (val[i].children[j].name == 'wardOverview_setupModule') {
                  this.isIconSet = true
                  break
                }
              }
            }
          }
        }
      },
      immediate: true
    },
    currentUserWard: function (newValue) {
      this.currentWardCode = this.currentUserWard.wardCode
      this.systemInfoName = this.currentUserWard.areaName
    },
    scheduleValue: function (newValue, oldValue) {
      this.$nextTick(() => {
        this.scheduleMonth = this.$refs?.calendar?.i18nDate
        this.getRangeArr()
      })
    }
  },
  async created() {
    const params = !globalConfig.XTCS0026 && await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0026' })
    this.XTCS0026 = globalConfig.XTCS0026 || params[0]?.paramValue
    globalConfig.XTCS0026 = this.XTCS0026
    changeIcon(this.XTCS0026)
    const params_33 = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0033' })
    this.XTCS0033 = params_33[0]?.paramValue
    if (this.XTCS0033 == 1) {
      this.passTip = '请输入新密码≥8个字符，至少包含大写字母、小写字母、数字、特殊字符中的三种'
    } else {
      this.passTip = '8-20个字符，至少包含数字，字母，下划线“_”中的两种'
    }
    const xtcs0093 = await this.$queryParam({
      paramGroupCode: 'XTCS',
      paramCode: 'XTCS0093'
    })
    this.params = {
      XTCS0093: xtcs0093[0]?.paramValue || '0'
    }
    const userType = this.userInfo.userType // ˙职级  "DOCTOR" "NURSE" "ADMIN"
    const sex = this.userInfo.sex // 男女
    if (userType == 'DOCTOR') {
      // 医生
      this.headPortrait = sex == '男' ? 'maleDoctor' : 'femaleDoctor'
    } else if (userType == 'NURSE') {
      // 护士
      this.headPortrait = sex == '男' ? 'maleNurse' : 'femaleNurse'
    } else {
      // 管理员
      this.headPortrait = 'dorctor'
    }
    const batchDictObj = await this.$batchGetDictItemList([
      'HIS_DICT_SEX',
      'HIS_DICT_RELATION_TYPE'
    ])
    this.sexDictData = batchDictObj['HIS_DICT_SEX']
    this.patientRationData = batchDictObj['HIS_DICT_RELATION_TYPE']
    // this.noticeFc()
  },
  mounted() {
    console.log('this.mainMenu', this.mainMenu)
    if (this.currentUserWard) {
      this.currentWardCode = this.currentUserWard.wardCode
      this.systemInfoName = this.currentUserWard.areaName || this.systemInfo.name && this.systemInfo.name.substr(0, 10) || ''
    }
    this.$bus.$on('updateCurWard', data => {
      this.handleSelectWorkbench(data)
    })
  },
  methods: {
    /**
     * 显示农历日期
     * @param {*} day
     */
    showLunarInfo(day) {
      var dayInfo = solar2lunar(
        day.split('-')[0],
        day.split('-')[1],
        day.split('-')[2]
      )
      return dayInfo.lDay == '1' ? dayInfo.monthCn : dayInfo.dayCn
    },

    changeUserFn() {
      this.changeUser = true
      this.$nextTick(() => {
        this.$refs.loginForm.resetFields()
      })
    },
    acitiveClass: function (path) {
      const routePath = this.$route.path
      if (routePath.indexOf(path) == 0) {
        return 'router-link-active'
      } else {
        return ''
      }
    },
    showItem(item) {
      const hidden = item.hidden
      if (hidden == null) {
        return true
      }
      if (hidden === false) {
        return true
      }
      return false
    },
    handleSelect(key, path) {
    },
    /**
     * 点击LOGO和名称，页面跳转到“病区概况”页面
     */
    leftDivFc(val) {
      const width = this.$route.query.width
      const height = this.$route.query.height
      const query = {
        width: width,
        height: height
      }
      if (this.ssoIndexUrl) {
        // 单点登录 需要返回之前的页面
        location.href = this.ssoIndexUrl
      } else if (this.indexUrl) {
        // 有首页类容
        // 判断是否有width  height
        this.$router.push({ path: this.indexUrl, query: query })
      } else {
        // 没有首页类容 默认第一个
        const mainMenu = this.$store.getters.mainMenu
        const path = mainMenu[0]?.path
        this.$router.push({ path: path, query: query })
      }
    },
    /**
     * 配置模块
     */
    iconSet() {
      setRoute('wardOverview/setupModule')
    },
    /**
     * 退出登录
     */
    logOut(e) {
      e.target.blur()
      const this_ = this
      this.$confirm('是否需要注销', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        this_.$store.dispatch('LogOut')
      })
    },
    handleLogin() {
      this.$refs['loginForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.loginForm.workbenchCode = this.currentUserWard.wardCode
        this.$store
          .dispatch('Login', this.loginForm)
          .then(async function (res) {
            if (res.code == 0) {
              if (res.checkUserPwd) {
                this.$message({
                  message: res.checkUserPwd,
                  type: 'warning'
                })
              }
              const wardListRes = await getUserWardList(this.loginForm.username)
              if (wardListRes.data.length > 0) {
                this.$store.commit('set_userWardList', wardListRes.data)
              }
              this.$router.go(0)
              // window.location.reload()
              // this.$store.commit('set_timestamp')
            } else {
              const passwordInfo = res.msg
              if (passwordInfo) {
                this.$notify({
                  title: '警告',
                  message: passwordInfo,
                  type: 'warning'
                })
              }
            }
          }.bind(this))
          .catch(() => {
            this.loading = false
          })
      })
    },
    /**
     * 修改密码的提交
     */
    changepasswordSubmit() {
      this.$refs['passwordForm'].validate(valid => {
        if (!valid) {
          return
        }
        changePassword({
          loginName: this.userInfo.userName,
          newPasswordPlaintext: this.form.newPassword,
          newPassword: md5(this.form.newPassword),
          oldPassword: md5(this.form.oldPassword)
        }).then(res => {
          this.handleClose()
          this.form = {
            oldPassword: '', // 原始密码
            newPassword: '', // 新密码
            confirmPassword: '' // 确认密码
          }
          this.$notify({
            title: '成功',
            message: '密码修改成功！',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    /**
     * 修改密码弹框关闭
     */
    handleClose() {
      this.$refs.passwordForm.clearValidate()
      this.$refs.passwordForm.resetFields()
      this.changePasswordVisible = false
    },
    /**
     * pdf文件查看参数设置
     */
    showSeepdfFC() {
      this.showSeepdf = false
    },
    /**
     * 病区选择
     */
    handleSelectWorkbench(value) {
      if (!value) {
        this.$store.commit('set_currentUserWard', null)
      } else {
        const ward = this.userWardList.find(item => {
          return item.wardCode == value
        })
        this.$store.commit('set_currentUserWard', ward)
        if ((this.currentUserWard.areaName ?? '') != '') {
          this.systemInfoName = this.currentUserWard.areaName
        } else if (this.systemInfo) {
          this.systemInfoName =
            this.systemInfo.name && this.systemInfo.name.substr(0, 10)
        }
        verification_queryVerifiyLogUtils(value, this.userInfo.userName)
        this.$emit('refresh')
        handleCurrentSkin()
      }
      this.noticeFc()
    },
    /**
     * 通知
     */
    noticeFcEntity() {
      concern_queryConcernMatters({
        messageType: 1, // 1-待办失效、消息中心  2-消息弹窗   0091系统参数
        icuRecordId: '', // 个人信息查询
        wardCode: this.currentWardCode || this.currentUserWard.wardCode // 有值查所有病区
      })
        .then(res => {
          this.noticeList = res.data.allList
          this.infiniteListFc()
        })
        .catch(() => {
          this.noticeList = []
        })
      this.$queryParam({
        paramGroupCode: 'XTCS',
        paramCode: 'XTCS0021'
      }).then(res => {
        this.elBadge = res[0]?.paramValue.indexOf('backlog') !== -1
      })
    },
    noticeFc() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.noticeFcEntity()
      }, 500, { leading: true, trailing: false })
      this.debounceSearchSymbol()
    },
    /**
     * 双击点击 代表事项
     */
    clickLine(item) {
      let mrn = ''
      if (item.type !== '患者入区') {
        // 存个人信息
        patientInfo_getPaientInfo(item.icuRecordId).then(res => {
          if (item.type !== '患者出区') {
            this.$store.commit(
              'set_patientInfo',
              patientInfoFormat(
                res.data,
                this.params,
                this.sexDictData,
                this.patientRationData
              )
            )
          } else {
            mrn = res?.data?.inpatientEntity?.mrn
          }
          this.toHtml(mrn, item)
          return
        })
      }
      this.popoverVisible = false
      this.toHtml(mrn, item)
    },
    toHtml(mrn, item) {
      switch (item.type) {
        case '患者入区': // 还没做 (第三方接口协议) #/patientHome/homePage
          this.$store.commit('SET_msgInIcu', item.icuRecordId)
          this.$router.push({ path: '/patient', query: this.$route.query })
          return
        case '患者出区': // 还没做 (第三方接口协议) #/patientHome/homePage
          this.$store.commit('SET_msgOutIcu', item.icuRecordId)
          this.$router.push({ path: '/patient', query: this.$route.query })
          return
        case '患者换床': // 还没做
          // this.$router.push({path: '/patientHome/homePage', query: this.$route.query })
          return
        case '医嘱提取': // 还没做 (第三方接口协议)
          this.$store.commit('set_msgExtract', item.icuRecordId)
          this.$router.push({
            path: '/patient/orderExecute',
            query: this.$route.query
          })
          return
        case '医嘱DC': // 还没做 (第三方接口协议)
          this.$router.push({
            path: '/patient/orderExecute',
            query: this.$route.query
          })
          return
        case '医嘱执行': // 跳转 医嘱执行 #/patient/orderExecute
          this.$router.push({
            path: '/patient/orderExecute',
            query: this.$route.query
          })
          return
        case '用药情况': // 跳转 医嘱执行 #/patient/orderExecute
          this.$router.push({
            path: '/patient/orderExecute',
            query: this.$route.query
          })
          return

        case '护嘱执行': // 跳转 监护数据 #/patient/monitoringData
          this.$router.push({
            path: '/patient/monitoringData',
            query: this.$route.query
          })
          return
        case '监护数据': // 跳转 监护数据 #/patient/monitoringData
          this.$router.push({
            path: '/patient/monitoringData',
            query: this.$route.query
          })
          return
        case '监护计划': // 跳转 监护数据 #/patient/monitoringData
          this.$router.push({
            path: '/patient/monitoringData',
            query: this.$route.query
          })
          return

        case '液体平衡': // 跳转 液体平衡 #/patient/fluidBalance
          this.$router.push({
            path: '/patient/fluidBalance',
            query: this.$route.query
          })
          return
        case '管路护理': // 跳转 管路护理 #/patient/pipelineCare
        case '导管拔管': // 跳转 管路护理 #/patient/pipelineCare
          this.$router.push({
            path: '/patient/pipelineCare',
            query: this.$route.query
          })
          return
        case '患者评估': // 评估计划 跳转 患者评估 #/patient/patientAssessment
          this.$router.push({ path: '/patient/patientAssessment', query: { ...this.$route.query, formId: item.formId } })
          return
        case '床旁交班': // 交班换班 跳转 床旁交班 #/patient/shiftExchange
          this.$router.push({
            path: '/patient/shiftExchange',
            query: this.$route.query
          })
          return
      }
    },
    handleShowHelpPdf() {
      operationManual_list().then(res => {
        this.showSeepdf = true
      })
    },
    /**
     * 名称是否显示全
     */
    systemInfoNameFc() {
      if ((this.currentUserWard.areaName ?? '') != '') {
        if (this.currentUserWard.areaName == this.systemInfoName) {
          this.systemInfoName = this.currentUserWard.areaName.substr(0, 10)
        } else {
          this.systemInfoName = this.currentUserWard.areaName
        }
      } else {
        if (this.systemInfo.name == this.systemInfoName) {
          this.systemInfoName = this.systemInfo.name.substr(0, 10)
        } else {
          this.systemInfoName = this.systemInfo.name
        }
      }
    },
    wnClose() {
      if (window.winning && window.winning.dispatchEvent) {
        window.winning.dispatchEvent('950258', {
          header: {
            Authorization: Cookie.get('BEARER_TOKEN') || '',
            'W-SEQ': Cookie.get('W-SEQ') || '1569595974015_2',
            'W-FLOW': Cookie.get('W-FLOW') || 'default'
          }
        })
        window.sessionStorage.clear()
        for (var i = 0; i < window.localStorage.length; i++) {
          var key = window.localStorage.key(i)
          if (key.indexOf('loc_') === -1) {
            window.localStorage.removeItem(key)
            i--
          }
        }
        Object.keys(Cookie.get()).forEach(item => {
          Cookie.remove(item)
        })
      }
    },
    wnMin() {
      if (window.winning && window.winning.dispatchEvent) {
        window.winning.dispatchEvent('950257', {
          header: {
            Authorization: Cookie.get('BEARER_TOKEN') || '',
            'W-SEQ': Cookie.get('W-SEQ') || '1569595974015_2',
            'W-FLOW': Cookie.get('W-FLOW') || 'default'
          }
        })
      }
    },
    /**
     * 消息中心翻页数据拿取
     */
    infiniteListFc() {
      const num = 5
      // 计算数据显示 模拟翻页
      this.infiniteList = this.infiniteList.concat(this.noticeList.slice(((this.noticePageNum - 1) * num), this.noticePageNum * num))
      this.noticePageNum++
    },
    /**
     * 弹框消除
     */
    noticeListHideFc() {
      this.infiniteList = []
      this.noticePageNum = 1
    },
    /**
     * 显示日程表
     */
    showSchedule() {
      this.scheduleFlag = true
      this.startDateStr = ''
      this.endDateStr = ''
      this.scheduleValue = new Date()
    },
    /**
     * 上个月
     */
    gotoPreMonth() {
      this.$refs?.calendar?.selectDate('prev-month')
    },
    gotoToday() {
      this.$refs?.calendar?.selectDate('today')
    },
    /**
     * 上个月
     */
    gotoNextMonth() {
      this.$refs?.calendar?.selectDate('next-month')
    },
    /**
     * 获取日历开始 结束日期
     */
    getRangeArr() {
      const startDate = this.$refs?.calendar?.$children[1].rows[0][0]
      const endDate = this.$refs?.calendar?.$children[1].rows[5][6]
      let startDateStr = ''
      let endDateStr = ''
      const year = this.scheduleMonth.split(' ')[0]
      const month = parseInt(this.scheduleMonth.split(' ')[2])
      if (startDate.type == 'prev') {
        startDateStr = this.$dayjs(new Date(year, month - 2, startDate.text)).format('YYYY-MM-DD')
      } else if (startDate.type == 'current') {
        startDateStr = this.$dayjs(new Date(year, month - 1, startDate.text)).format('YYYY-MM-DD')
      }
      if (endDate.type == 'next') {
        endDateStr = this.$dayjs(new Date(year, month, endDate.text)).format('YYYY-MM-DD')
      } else if (startDate.type == 'current') {
        endDateStr = this.$dayjs(new Date(year, month - 1, endDate.text)).format('YYYY-MM-DD')
      }
      if (startDateStr == this.startDateStr && this.endDateStr == endDateStr) return
      this.loadSchedule = true
      schedule_queryWorkSchedules({
        wardCode: this.currentUserWard.wardCode,
        beginDate: startDateStr + ' 00:00:00',
        endDate: endDateStr + ' 23:59:59'
      }).then(res => {
        this.startDateStr = startDateStr
        this.endDateStr = endDateStr
        this.scheduleData = groupBy(res.data, 'scheduleDate')
        this.scheduleTypeData
        for (const date in this.scheduleData) {
          const item = JSON.parse(JSON.stringify(this.scheduleData[date]))
          const summaryData = keyBy(item, function (o) {
            return o.scheduleTime + ' ' + o.scheduleType + ' ' + o.patientName
          })
          const summaryList = Object.keys(summaryData)
          this.scheduleTypeData[date] = {
            title: summaryList,
            list: item
          }
        }
        this.loadSchedule = false
      })
    },
    /**
     * 显示更多信息
     * @param {点击日期显示日程详情} day
     */
    showMoreSchedule(date) {
      if (date.type == 'current-month') {
        this.scheduleMoreFlag = true
        this.scheduleDay = date.day
      }
    },
    /**
     * 双击详情跳转对应患者信息页面
     * @param {*} row
     * @param {*} column
     * @param {*} event
     */
    openSchedule(row, column, event) {
      // 关闭日程弹框
      row.type = row
      this.scheduleMoreFlag = false
      this.scheduleFlag = false
      this.clickLine(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.menuHead {
  width: 100%;
  height: 50px;
  background: var(--maincolor);
  // flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .leftDiv {
    margin: 0 1%;
    white-space: nowrap;
    min-width: 250px;
    display: flex;
    align-items: center;

    .logoCss {
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }

    &_remarks {
      margin-left: 0.7%;
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 25px;
    }
  }

  .centerDiv {
    flex: 1;
    white-space: nowrap;
    padding-left: 1vw;

    &_itemDiv {
      width: 100%;
      padding: 0 10px;
      display: inline-block;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }

    .router-link-active>.centerDiv_itemDiv {
      background-color: var(--maincolor2) !important;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .centerDiv_itemDiv {
      &:hover {
        background-color: var(--maincolor3) !important;
      }
    }
  }

  .rightDiv {
    margin: 0px;
    padding: 0px 5px;
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;

    .select {
      margin-left: 3%;
      width: 128px;
      height: 32px;
      background: rgb(12, 50, 190);
      border-radius: 4px;
    }

    .rightSmallMenu {
      padding: 0px 5px;
      margin: 0px;
      height: 100%;
      display: inline-flex;
      align-items: center;
    }

    .rightSmallMenu:hover {
      background: var(--maincolor3);
    }

    .headPortraitDiv {
      margin-left: 2.3%;
      display: inline-flex;
      align-items: center;

      .iconHeadPortrait {
        width: 32px;
        height: 32px;
      }

      span {
        white-space: nowrap;
        /*强制span不换行*/
        display: inline-block;
        /*将span当做块级元素对待*/
        min-width: 70px;
        /*限制宽度 可设px*/
        overflow: hidden;
        /*超出宽度部分隐藏*/
        text-overflow: ellipsis;
        /*超出部分以点号代替*/
        margin-left: 5%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
      }
    }

    .headPortrait {
      display: inline-block;
    }

    .iconHelp {
      width: 24px;
      height: 24px;
      margin-left: 1%;
    }

    .notice {
      margin-left: 1.9%;
      margin-right: 10px;
      width: fit-content;

      ::v-deep .el-badge__content {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 10px;
        margin-left: 10px;
        transform: translateY(-50%) translateX(100%);
      }
    }

    .iconNotice {
      width: 24px;
      height: 24px;
      margin-left: 1.9%;
    }

    .iconSchedule {
      width: 22px;
      height: 22px;
    }

    .iconVerticalLine {
      width: 1px;
      height: 22px;
      background: rgba($color: #ffffff, $alpha: 0.7);
      margin: 0 5px 0 8px;
    }

    .iconCancellation {
      width: 24px;
      height: 24px;
      margin: 0 2%;
    }
  }

  // 处理顶部菜单的点击样式 start
  ::v-deep.el-menu--horizontal {
    display: flex;

    a {
      flex: 1;
    }
  }

  ::v-deep.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 0;
    background-color: rgb(12, 58, 190) !important;
  }

  ::v-deep.el-menu--horizontal>.el-menu-item {
    border-bottom: 0;
  }

  // 处理顶部菜单的点击样式 end

}

// 处理点击头像出来的框 start
#popoverDiv {
  .h1P {
    margin: 5px 0 15px 0;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }

  .timeP {
    margin: 3px 0;
    font-size: 14px;
    color: #666;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 300;
  }

  .restP {
    padding: 10px 0px;
    font-size: 14px;
    color: #000622;
    font-family: PingFangSC-Regular, PingFang SC;
    box-sizing: border-box;
    margin: 0px;
    border-radius: 4px;
  }

  .restP:hover {
    background-color: #e9efff;
  }

  ::v-deep.topMenuIcon {
    color: var(--maincolor);
    width: 20px;
    height: 20px;
    margin: 0 2%;
    position: relative;
    top: 1px;
  }

  // 框里面的线 start
  .el-divider--horizontal {
    margin: 12px 0;
    color: rgba($color: #d9d9d9, $alpha: 0.8);
  }

  .iconSkin {
    color: #ffffff;
  }

  .changeSkin {
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;

    li {
      width: calc(33.33% - 4px);
      display: inline-block;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      overflow: hidden;

      .skinTop {
        width: 100%;
        height: 10px;
      }

      .skinBottom {
        width: 100%;
        height: 24px;
        background-color: #cad2ea;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;

        &::before {
          content: '';
          display: block;
          width: calc(100% - 4px);
          height: calc(100% - 2px);
          position: absolute;
          top: 0;
          left: 0;
          border-left: 1px solid #ffffff;
          border-right: 1px solid #ffffff;
          border-bottom: 1px solid #ffffff;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
          margin: 0 2px 1px;
        }
      }
    }
  }
}

// 处理点击头像出来的框 end
// 处理点击消息出来的框 start
#noticeDiv {
  height: 530px;
  overflow: auto;

  .lineDiv {
    cursor: pointer;

    p {
      margin: 0;
    }

    .h1P {
      font-size: 17px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 800;
      color: rgba($color: #000000, $alpha: 0.8);
    }

    .informationP {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba($color: #000000, $alpha: 0.8);
    }

    .textP {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba($color: #000000, $alpha: 0.8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // 框里面的线 start
    .el-divider--horizontal {
      margin: 12px 0;
    }
  }

  .textButton {
    width: 100%;
    color: initial;
    font-size: 17px;
    color: rgba($color: #000000, $alpha: 0.7);
    font-family: PingFangSC-Medium, PingFang SC;
  }
}

.scheduleInfo {
  background: #f0f0f0;
  padding: 2px 5px;
  margin: 0px 0px 2px 0px;
  display: inline-block;
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  display: inline-block;
  color: #ccc;

  span {
    margin-right: 3px;
  }

}

.current .scheduleInfo {
  color: #666;
}

.scheduleDay {
  line-height: 24px;
  height: 24px;
  margin: 0px;
}

.scheduleMore {
  font-size: 12px;
  text-align: center;
  width: 100%;
  margin: 0px;
  padding: 0px;

}

.current .scheduleMore {
  cursor: pointer;
  color: var(--maincolor);
}

::v-deep .el-calendar-table .el-calendar-day {
  height: 95px;
}

::v-deep .el-calendar__header {
  padding-top: 0px;
}

// 处理点击消息出来的框 end
</style>
