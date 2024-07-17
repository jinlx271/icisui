<template>
  <div class="login-container" v-if="role" :style="unifiedStyle">
    <!-- 左上角文案 -->
    <p class="head" :class="{unifiedClass:unifiedClass}">
      <!-- <span class="head-span1">ICIS</span> -->
      <img style="margin-right:10px;" class="logoimg" :class="{unifiedClass:unifiedClass,isLogoCss:isLogoCss}" :src="unifiedImg" width="24" alt />
      <span :class="{isLogoCssColor:isLogoCss}" class="head-span2">{{globalConfig.title}}</span>
      <span :class="{isLogoCssColor:isLogoCss}" class="head-span2 head-line">|</span>
      <span :class="{isLogoCssColor:isLogoCss}" class="head-span3">{{systemInfo.name}} {{systemInfo.gbCode&&XTCS0027=='1'?'医院国家医保编码：'+systemInfo.gbCode:''}}</span>
    </p>
    <!-- 白色登录主体 -->
    <div class="login">
      <el-dialog title="医信签" v-el-drag-dialog top="2vh" height="550px" @close="checkStatus" :visible.sync="qrpageVisible" :close-on-click-modal="false" width="1433px" append-to-body>
        <qr-page v-if="qrpageVisible" @transactionId="(e)=>transactionId=e" :visible.sync="qrpageVisible"></qr-page>
      </el-dialog>
      <svg-icon v-if="systemInfo.ca==1" icon-class="二维码" class="二维码 qr" @click.native="openQrcode" />
      <div class="login-body">
        <p class="login-title">欢迎登录</p>
        <p class="login-remarks">Welcome aboard</p>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              @blur="querySelectUserIcu"
              v-model="loginForm.username"
              name="username"
              type="text"
              auto-complete="on"
              placeholder="请输入您的工号"
              maxlength="32"
              @keyup.enter.native="handleUsername"
              @change="getGbInfo"
            >
              <img slot="prefix" src="@/assets/img/icon-user.png?v=2" width="20" />
              <span v-if="loginForm.username" slot="suffix" class="loginDelWrap" @click="loginForm.username = ''">
                <svg-icon icon-class="loginDel" style="width:14px;height:14px" />
              </span>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              ref="password"
              :type="pwdType"
              v-model="loginForm.password"
              class="password"
              name="password"
              auto-complete="on"
              placeholder="请输入您的密码"
              maxlength="32"
              @keyup.enter.native="handlePassword"
              @change="getGbInfo"
            >
              <img slot="prefix" src="@/assets/img/icon-password.png?v=2" width="20" />
              <span slot="suffix" @click="showPwd">
                <svg-icon :icon-class="pwdType?'eyeInvisible':'eyeVisible'" style="width:16px;height:10px;" />
              </span>
              <span v-if="loginForm.password" slot="suffix" class="loginDelWrap" @click="loginForm.password = ''">
                <svg-icon icon-class="loginDel" style="width:14px;height:14px" />
              </span>
            </el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item v-if="showCode" prop="verificationCode">
            <div class="flex">
              <el-input
                v-model="loginForm.verificationCode"
                name="verificationCode"
                type="text"
                auto-complete="on"
                placeholder="请输入验证码"
                maxlength="4"
                @keyup.enter.native="handleLogin"
              >
                <img slot="prefix" src="@/assets/img/icon-code.png?v=2" width="20" />
                <span v-if="loginForm.username" slot="suffix" class="loginDelWrap" @click="loginForm.username = ''">
                  <svg-icon icon-class="loginDel" style="width:14px;height:14px" />
                </span>
              </el-input>
              <img :src="verificationCodeImgUrl" width="88px" height="44px" />
              <el-button type="text" @click="getVerificationCode">换一张</el-button>
            </div>
          </el-form-item>
          <!-- 病区 -->
          <el-form-item v-if="showArea" prop="workbenchCode">
            <el-select v-model="loginForm.workbenchCode" name="workbenchCode" placeholder="请选择" @change="handleSelectWorkbench">
              <img slot="prefix" src="@/assets/img/icon-region.png?v=2" width="20" />
              <el-option v-for="item in userWardList" :key="item.wardCode" :label="item.wardName" :value="item.wardCode"></el-option>
            </el-select>
          </el-form-item>
          <!-- v-if="loginForm.gbCode" -->
          <el-form-item prop="gbCode" v-if="loginForm.gbCode!=''" style="margin-top:15px;">{{'国家医保医师/护士编码: '+loginForm.gbCode}}</el-form-item>
          <!-- ca -->
          <!-- <el-form-item v-if="isCa" class="flex">
            <el-select v-model="signCert" style="width:calc(100% - 110px)" placeholder="使用Ukey登录" type="mini" @change="getCertTest">
              <el-option v-for="item in globalConfig.SIGNCERTS" :key="item.guid" :label="item.guid" :value="item">
              </el-option>
            </el-select>
            <el-input class="pin" style="width:105px" v-model="PIN" name="PIN" type="text" auto-complete="on" placeholder="请输入PIN" maxlength="32"
                      @keyup.enter.native="()=>setPin(PIN)">
            </el-input>
          </el-form-item>-->
          <!-- 登录按钮 -->
          <el-form-item style="margin-top:'64px';">
            <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin" class="btn-login">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyright" :class="{isCurrentCss:isLogoCss}" v-if="currentVersion">
      <!-- 获取版本号 -->
      <span :class="{unifiedClass:unifiedClass}">{{currentVersion}}</span>
    </div>
    <el-dialog title="病区配置" :visible.sync="dialogVisible" width="60%" :show-close="false" :close-on-click-modal="false">
      <div class="dialogBody">
        <div class="col">
          <div class="title">普通病区列表</div>
          <draggable class="draggable" v-model="sysWardList" group="site" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass">
            <transition-group>
              <div class="item" v-for="item in sysWardList" :key="item.wardCode">{{item.wardName}}</div>
            </transition-group>
          </draggable>
        </div>
        <!-- <div class="colText" @click="colTextFc">
          <i class="el-icon-back"></i>
          <i class="el-icon-right"></i>
        </div> -->
        <div class="col">
          <div class="title">ICU病区列表</div>
          <draggable class="draggable" v-model="icuSysWardList" group="site" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass">
            <transition-group>
              <div class="item" v-for="item in icuSysWardList" :key="item.wardCode">{{item.wardName}}</div>
            </transition-group>
          </draggable>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transitionFc">全部转移</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
    <!-- CA登录 -->
    <el-dialog :title="CALoginForm.username+'CA证书登录'" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="CAVisible" width="500px">
      <el-form ref="CALoginForm" :model="CALoginForm" :rules="CAloginRules">
        <el-form-item prop="username">
          <el-select :disabled="userNames.length <= 0" v-model="CALoginForm.username" placeholder="请选择" style="width:100%">
            <el-option v-for="item in userNames" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <el-input ref="password" :type="pwdType" v-model="CALoginForm.password" class="password" name="password" auto-complete="new-password" placeholder="请输入" maxlength="32">
            <img slot="prefix" src="@/assets/img/icon-password.png?v=2" width="20" />
            <!-- 显示密码 -->
            <span slot="suffix" @click="showPwd">
              <svg-icon :icon-class="pwdType?'eyeInvisible':'eyeVisible'" style="width:16px;height:10px;" />
            </span>
            <!-- 清空密码 -->
            <span v-if="CALoginForm.password" slot="suffix" class="loginDelWrap" @click="CALoginForm.password = ''">
              <svg-icon icon-class="loginDel" style="width:14px;height:14px" />
            </span>
          </el-input>
        </el-form-item>
        <!-- 病区 -->
        <el-form-item v-if="showArea" prop="workbenchCode">
          <el-select v-model="CALoginForm.workbenchCode" name="workbenchCode" placeholder="请选择" @change="handleSelectWorkbench">
            <img slot="prefix" src="@/assets/img/icon-region.png?v=2" width="20" />
            <el-option v-for="item in userWardList" :key="item.wardCode" :label="item.wardName" :value="item.wardCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loginByCa">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getCurBeid,
  getUserWardList,
  sysConfig_isICUWardConfiged, // 检测是否配置病区
  sysConfig_getSysWardList, // 获取病区信息
  sysConfig_icuWardConfig, // 设置病区
  ca_getAccesstoken,
  ca_getOauthStatus,
  sys_oauth2Login,
  version_getSystemInfo, // 版本版权信息
  sys_getUserInfo,
  sys_updataUserPic,
  getLoginFailueTimes
} from '@/api/login'
import {
  loadFile,
  signservice_getQRCode,
  signservice_verifyCallBack,
  // signservice_msg_pull,
  signservice_getStampBase64
} from '@/api/otherApi'
import {
  CACheck, // CA检查 是否有10808托盘服务
  CAKeyVerify, // 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
  CAGetYsgh, // CA获取工号
  CALoginVerify, // CA密码登陆
  CAGetYsImg, // CA获取签名图片
  CAGetUserInfo
} from '@/api/otherApi'
import draggable from 'vuedraggable'
import { caInit, getCertTest } from '@/utils/ca'
import { handleCurrentSkin, changeIcon } from '@/utils/utils'
import qrPage from './qrPage'
import md5 from 'js-md5' // md5加密
export default {
  components: {
    draggable,
    qrPage
  },
  name: 'Login',
  computed: {
    ...mapGetters(['indexUrl', 'userWardList', 'systemInfo', 'sysSkinList', 'currentUserSkin', 'loginValidNum']),
    unifiedStyle() {
      const image = require('@/assets/img/bg-' + this.role + '.png')
      const icisImg = require('@/assets/img/bg-icis-login.jpg')
      return this.loginRoleType ? `background-image: url(${(process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API)}image/${this.loginRoleType}/bg.png)` : this.XTCS0026 == 0 ? 'background-image: url(' + image + ')' : 'background-image: url(' + icisImg + ')'
    },
    unifiedImg() {
      return this.loginRoleType ? (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + `image/${this.loginRoleType}/logo1.png` : this.XTCS0026 == 0
      ? require('@/assets/img/winex-logo.png') : require('@/assets/img/bg-icis-login.png')
    },
    unifiedClass() {
      return this.XTCS0026 == 1 && !this.loginRoleType
    },
    isLogoCss() {
      return this.XTCS0026 == 0 && !this.loginRoleType
    },
    curLoginValidNum() {
      return this.loginValidNum.find(item => item.username == this.loginForm.username)
    },
    showCode() {
      return this.curLoginValidNum && this.curLoginValidNum.num >= 5
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 && 1 + 1 !== 2) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginRoleType: localStorage.getItem('loginRoleType'),
      XTCS0026: '0',
      currentVersion: '',
      globalConfig: globalConfig, // 配置信息
      transactionId: '',
      qrpageVisible: false,
      signCert: '',
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
        workbenchCode: [{ required: true, message: '请选择病区', trigger: 'blur' }],
        username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', validator: validatePass }],
        verificationCode: [
          { required: true, message: '请输入验证码' }
        ]
      },
      loading: false,
      pwdType: 'password',
      rememberMe: true,
      showArea: true,
      role: '',
      failTime: 0,
      beid: '', // 病区获取的id
      dialogVisible: false, // 病区设置弹框
      sysWardList: [], // 病区列表
      icuSysWardList: [], // icu病区列表
      XTCS0027: '0', // 是否开启国标码展示
      CAVisible: false, // CA签名弹框
      CALoginForm: {
        username: '',
        password: '',
        workbenchCode: ''
      }, // CA登录的请求参数
      CAloginRules: {
        workbenchCode: [{ required: true, message: '请选择病区', trigger: 'blur' }],
        username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }, // CA 登录的校验
      userNames: [], // 插了多少u盾
      areaObj: {}, // ca 签名的数据
      validCode: '3n3D',
      verificationCodeImgUrl: '',
      XTCS1015: ''
    }
  },
  created() {
    // 初始化

    this.init()
  },
  mounted() {
    this.$store.dispatch('LogOut')
  },
  watch: {
    $route() {
      this.init()
    }
  },
  methods: {
    checkStatus: async function() {
      const token = await ca_getAccesstoken()
      const result = await ca_getOauthStatus({ accessToken: token?.data?.accessToken, transactionId: this.transactionId })
      if (result?.data?.oauthStatus == 1) {
        const caRes = await sys_oauth2Login({ username: result?.data?.userId })
        const wardListRes = await getUserWardList(result?.data?.userId)
        if (wardListRes.data.length > 0) {
          this.$store.commit('set_userWardList', wardListRes.data)
          this.loginForm.workbenchCode = wardListRes.data[0].wardCode
          this.loginForm.workbenchName = wardListRes.data[0].wardName
          caRes.workbenchCode = this.loginForm.workbenchCode
          this.$store.commit('set_currentUserWard', wardListRes.data[0])
          this.$store.dispatch('caLogin', caRes)
          this.getUserSignInfo(token?.data?.accessToken, result?.data?.userId)
          this.$router.push({ path: '/layout', query: { currentModel: this.indexUrl, ...this.$route.query } })
        } else {
          this.$message.warning('该用户无病区权限!')
        }
      }
    },
    /**
     * 获取签名图片
     */
    getUserSignInfo(accessToken, userId) {
      console.log('accessToken', accessToken)
      console.log('accessToken', userId)
      CAGetUserInfo({ accessToken: accessToken, userId: userId }).then(res => {
        console.log('res', res)
        if (res.data.data.signatureImg) {
          sys_updataUserPic({
            userName: userId,
            picPath: 'data:image/png;base64,' + res.data.data.signatureImg
          }).then(respone => {
            console.log('同步图片')
          })
        }
      })
    },
    openQrcode() {
      this.qrpageVisible = true
    },
    /**
     * 初始化
     */
    async init() {
      this.$store.commit('set_dragMsg', { dictControlTypeCode: '1', isShow: true })
      // 系统切换医院版权和背景图
      const params = await this.$getParams({ paramGroupCode: 'XTCS', paramCode: 'XTCS0026' })
      this.XTCS0026 = params[0]?.paramValue || this.XTCS0026
      globalConfig.XTCS0026 = this.XTCS0026
      changeIcon(this.XTCS0026)
      // 浏览器参数
      const loginRoleType = Object.keys(this.$route.query)
      localStorage.setItem('loginRoleType', loginRoleType.length == 1 ? loginRoleType[0] : '')
      this.loginRoleType = localStorage.getItem('loginRoleType')
      this.role = this.$route.params.role || 'anes' // 浏览器参数
      // 是否开启国标码展示
      const paramInfo = await this.$getParams({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
      this.XTCS0027 = paramInfo[0]?.paramValue || this.XTCS0027
      // 获取1014 ca权限的模块
      const getParams1014 = await this.$getParams({ paramGroupCode: 'XTCS', paramCode: '1014' })
      this.areaObj = getParams1014[0]?.paramValue ? JSON.parse(getParams1014[0]?.paramValue) : {}
      const getParams1015 = await this.$getParams({ paramGroupCode: 'XTCS', paramCode: '1015' })
      this.XTCS1015 = getParams1015[0]?.paramValue ? getParams1015[0]?.paramValue : ''
      // 进来先调用哪个医院 包括CA签名 主题
      this.getCurBeidFC()
      // 是否初始化ICU病区 有配置 false 就进入
      if (await this.sysConfig_isICUWardConfigedFc()) {
        this.sysConfig_getSysWardListFc() // 病区列表获取
      }
    },
    /**
     * 获取医院地址
     */
    getCurBeidFC() {
      version_getSystemInfo().then(res => {
        this.currentVersion = `${res.data?.copyright} ${res.data?.versionNo}`
      })
      // 获取医院
      getCurBeid().then(res => {
        this.$store.commit('set_systemInfo', res.data)
        this.$store.commit('set_ca1014', this.areaObj)
        if (this.systemInfo.ca == 'yjx') {
          caInit({ clearGuid: true }).then(res => {
            const { SIGNCERTS, signCert, guid } = res
            if (SIGNCERTS.length >= 1) {
              getCertTest(this, signCert, guid)
            }
          })
        }
        // 管理员不需要走ca流程
        let adminFlag = true
        if (location.hash.indexOf('admin') != -1) {
          adminFlag = false
        }
        // 1012 是否启用CA签名 2代表 ”卫宁his封装北京ca“
        if (adminFlag) {
          if (this.systemInfo.ca == 2) {
            // CA签名相关 ukey
            this.CAFunction()
          } else if (this.systemInfo.ca == 3) {
            // CA签名相关 软签
            this.CAFunctionSoftLabel()
          } else if (this.systemInfo.ca == 4) {
            // 广东CA签名
            this.CAGuangdong()
          } else if (this.systemInfo.ca == 1) {
            // 医信签 直接打开弹框
            this.openQrcode()
          }
        }
        // 主题
        handleCurrentSkin('', this.loginForm.username, this.loginForm.workbenchCode)
      })
    },
    /**
     * 显示密码
     * */
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    /**
     * 用户名回车聚焦
     */
    handleUsername() {
      this.$refs['password'].focus()
    },
    /**
     * 用户密码回车聚焦
     */
    handlePassword() {
      if (this.showCode) {
        this.$refs['verificationCode'].focus()
      } else {
        this.handleLogin()
      }
    },
    /**
     * 获取用户病区
     */
    querySelectUserIcu() {
      //  没有用户信息不发请求
      if (!this.loginForm.username) {
        return
      }
      // 获取用户登录失败次数
      getLoginFailueTimes(this.loginForm.username).then(res => {
        this.$store.commit('set_loginValidNum', { username: this.loginForm.username, num: +res.data })
        if (+res.data >= 5) {
          this.getVerificationCode()
        }
      })
      // 清空  原因有病区用户登录.再次更换没有病区的用户病区列表没有清空
      this.$store.commit('set_userWardList', [])
      this.loginForm.workbenchCode = ''
      // 获取默认病区选择
      getUserWardList(this.loginForm.username).then(res => {
        this.$store.commit('set_userWardList', res.data)
        this.$nextTick(() => {
         const username_wardCode = localStorage.getItem(`${this.loginForm.username}_wardCode`)
          let wardIndex = res.data.findIndex((item) => {
            return item.wardCode == username_wardCode
          })
          wardIndex = wardIndex >= 0 ? wardIndex : 0
          this.loginForm.workbenchCode = res.data[wardIndex].wardCode
          this.loginForm.workbenchName = res.data[wardIndex].wardName
          this.$store.commit('set_currentUserWard', res.data[wardIndex])
          handleCurrentSkin('', this.loginForm.username, this.loginForm.workbenchCode)
        })
      })
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
        handleCurrentSkin('', this.loginForm.username, this.loginForm.workbenchCode)
      }
    },
    /**
     * 登录
     */
    handleLogin() {
      const me = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(res => {
              if (res.code == 0) {
                if (res.checkUserPwd) {
                  this.$message({
                    message: res.checkUserPwd,
                    type: 'warning'
                  })
                }
                // if (res.user) {
                //   res.user.wardCode = this.loginForm.workbenchCode // 将病区存放在 userInfo
                //   res.user.wardName = this.loginForm.workbenchName // 将病区存放在 userInfo
                //   this.$store.commit('SET_USER', res.user)
                // }
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
              if (this.XTCS0027 == '1') {
                this.loginForm.gbCode = res.user.gbCode || ''
              }
              setTimeout(() => {
                this.loading = false
                this.$router.push({ path: '/layout', query: { currentModel: this.indexUrl, ...this.$route.query } }).catch(e => {
                  console.error(e)
                })
              }, 2000)
              this.$store.commit('set_loginValidNum', { username: this.loginForm.username, num: 0 })
            })
            .catch(error => {
              this.loading = false
              if (error.code == 20000001) {
                if (this.curLoginValidNum) {
                  const num = this.curLoginValidNum.num + 1
                  this.$store.commit('set_loginValidNum', { username: this.loginForm.username, num })
                  if (num >= 5) {
                    this.getVerificationCode()
                  }
                } else {
                  this.$store.commit('set_loginValidNum', { username: this.loginForm.username, num: 1 })
                }
              }
            })
        } else {
          return false
        }
      })
    },
    /**
     * 是否初始化ICU病区 有配置
     */
    sysConfig_isICUWardConfigedFc() {
      return new Promise((resolve, reject) => {
        sysConfig_isICUWardConfiged({})
          .then(res => {
            resolve(!res.data)
          })
          .catch(() => {
            reject(false)
          })
      })
    },
    /**
     * 病区列表
     */
    sysConfig_getSysWardListFc() {
      sysConfig_getSysWardList({}).then(res => {
        this.sysWardList = res.data // 病区列表
        this.dialogVisible = true // 打开病区设置
        setTimeout(req => {
          this.$message.success('首次登录,请设置病区再登录!')
        }, 300)
        setTimeout(req => {
          this.$message.success('请将左侧(普通病区)拖拽至右侧(icu病区)!')
        }, 1000)
      })
    },
    /**
     * 全部转移按钮
     */
    transitionFc() {
      const length = this.sysWardList.length
      if (length < 1) {
        this.$message.warning('已无转移普通病区!')
        return
      }
      this.sysWardList.map(res => {
        this.icuSysWardList.push(res)
      })
      this.sysWardList = []
      this.$message.success('转移成功!')
    },
    /**
     * 病区配置保存
     */
    save() {
      if (this.icuSysWardList < 1) {
        this.$message.error('请将左侧病区拖拽至右侧!')
        return
      }
      // 处理请求入参
      const icuWardList = []
      this.icuSysWardList.map(res => {
        icuWardList.push({
          wardCode: res.wardCode,
          wardName: res.wardName
        })
      })
      // 设置icu病区
      sysConfig_icuWardConfig(icuWardList).then(res => {
        this.$message.success('设置成功,请用管理员(admin)登录,设置用户权限信息!')
        this.dialogVisible = false // 关闭病区
      })
    },
    /**
     * 提醒事项
     */
    colTextFc() {
      this.$message.warning('请将左侧病区拖拽至右侧!')
    },
    /**
     * 获取国标编码
     */
    getGbInfo() {
      if (this.XTCS0027 != '1') return
      if (this.loginForm.username != '' && this.loginForm.password != '') {
        sys_getUserInfo({
          username: this.loginForm.username,
          password: md5(this.loginForm.password)
        }).then(res => {
          this.loginForm.gbCode = res.data.gbCode || ''
        })
      }
    },
    /**
     * CA 签名相关需求
     */
    CAFunction() {
      // CA检查 是否有10808托盘服务
      CACheck()
        .then(rq1 => {
          if (!rq1.Status) {
            this.$message.error(rq1.Message || 'CA客户端没有正常运行')
            return
          }
          // 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
          CAKeyVerify()
            .then(rq2 => {
              if (!rq2.Status) {
                this.$message.error(rq2.Message || '未检测CA插入')
                this.recursion() // 定时调用是否插入key
                return
              }
              // CA获取工号
              CAGetYsgh()
                .then(rq3 => {
                  if (!rq3.Status) {
                    this.$message.error(rq3.Message || 'CA工号获取失败')
                    return
                  }
                  this.CAVisible = true // 显示弹框让CA签名
                  this.userNames = rq3?.Data?.split('|||') // 可能存在多个U盾，好几个插在电脑上所以需要分割
                  this.CALoginForm.username = this.userNames[0] // 第一个名称
                  this.CAUserIcu()
                })
                .catch(() => {
                  this.$message.error('CA客户端没有正常运行')
                })
            })
            .catch(() => {
              this.$message.error('CA客户端没有正常运行')
            })
        })
        .catch(() => {
          this.$message.error('CA客户端没有正常运行')
        })
    },
    /**
     * CA输入密码后登录
     */
    loginByCa() {
      this.$refs.CALoginForm.validate(valid => {
        if (valid) {
          // CA密码登陆
          CALoginVerify(this.CALoginForm.password).then(rq => {
            if (!rq.Status) {
              this.$message.error(rq.Message || 'CA验证失败')
              return
            }
            // 这里要存起来ca登录成功
            this.$store.commit('set_isLoginCA', true)
            // 或者图片签名流
            CAGetYsImg(rq.Data).then(respone => {
              if (!respone.Status) {
                return
              }
              // 第三方登录接口
              sys_oauth2Login({ username: this.CALoginForm.username, ticket: 'CAoauth2Login' }).then(CAres => {
                CAres.workbenchCode = this.CALoginForm.workbenchCode
                this.$store.dispatch('caLogin', CAres)
                // 存入重症后台签名
                sys_updataUserPic({
                  userName: rq.Data,
                  picPath: respone.Data
                }).then(respone => {
                  this.$router.push({ path: '/layout', query: { currentModel: this.indexUrl, ...this.$route.query } })
                })
              })
            })
          })
        }
      })
    },
    /**
     * ca 获取签名
     */
    /**
     * 获取用户病区
     */
    CAUserIcu() {
      //  没有用户信息不发请求
      if (!this.CALoginForm.username) {
        return
      }
      // 清空  原因有病区用户登录.再次更换没有病区的用户病区列表没有清空
      this.$store.commit('set_userWardList', [])
      this.CALoginForm.workbenchCode = ''
      // 获取默认病区选择
      getUserWardList(this.CALoginForm.username).then(res => {
        this.$store.commit('set_userWardList', res.data)
        this.$nextTick(() => {
          this.CALoginForm.workbenchCode = res.data[0].wardCode
          this.CALoginForm.workbenchName = res.data[0].wardName
          this.$store.commit('set_currentUserWard', res.data[0])
          // 主题
          handleCurrentSkin('', this.CALoginForm.username, this.CALoginForm.workbenchCode)
        })
      })
    },
    /**
     * 定时插入key
     */
    recursion() {
      // 判断是否插入Key 就是医生的一个usb（像u盾）工卡一样
      CAKeyVerify()
        .then(rq2 => {
          if (rq2.Status) {
            this.CAFunction()
          } else {
            setTimeout(() => {
              this.recursion() // 定时调用是否插入key
            }, 2000)
          }
        })
    },
    /**
     * 换一张验证码
     */
    getVerificationCode() {
      loadFile(`/sys/changeVerificationCode?username=${this.loginForm.username}`).then(res => {
        const blob = new Blob([res], {
          type: 'image/jpeg'
        })
        const objectUrl = URL.createObjectURL(blob)
        if (!objectUrl || objectUrl == '') {
          this.$message({
            type: 'warning',
            message: '验证码获取失败，请稍后重试....'
          })
        } else {
          this.verificationCodeImgUrl = objectUrl
        }
      })
    },
    /**
     * CA 北京 软签
     */
    CAFunctionSoftLabel() {
      // CA检查 是否有10808托盘服务
      CACheck(true).then(res => {
        if (!res.Status) {
          this.$message.error(res.Message || 'CA客户端没有正常运行')
          return
        }
        CALoginVerify('').then(req => {
          if (!req.Status) {
            this.$message.error(req.Message || 'CA验证失败')
            return
          }
          // 这里要存起来ca登录成功
          this.$store.commit('set_isLoginCA', true)
          // 获取图片签名流
          CAGetYsImg(req.Data).then(respone => {
            if (!respone.Status) {
              return
            }
            // 第三方登录接口
            sys_oauth2Login({ username: req.Data, ticket: 'CAoauth2Login' }).then(CAres => {
              // 获取默认病区选择
              getUserWardList(req.Data).then(getRes => {
                this.$store.commit('set_userWardList', getRes.data)
                const username_wardCode = localStorage.getItem(`${req.Data}_wardCode`)
                let wardIndex = getRes.data.findIndex((item) => {
                  return item.wardCode == username_wardCode
                })
                wardIndex = wardIndex >= 0 ? wardIndex : 0
                this.$store.commit('set_currentUserWard', getRes.data[wardIndex])
                handleCurrentSkin('', req.Data, getRes.data[wardIndex].wardCode)
                CAres.workbenchCode = getRes.data[wardIndex].wardCode
                this.$store.dispatch('caLogin', CAres)
                // 存入重症后台签名
                sys_updataUserPic({
                  userName: req.Data,
                  picPath: respone.Data
                }).then(() => {
                  this.$router.push({ path: '/layout', query: { currentModel: this.indexUrl, ...this.$route.query } })
                })
              })
            })
          })
        })
      }).catch(() => {
        this.$message.error('CA客户端没有正常运行')
      })
    },
    /**
     * CA 广东
     */
    CAGuangdong() {
      signservice_getQRCode().then(res => {
        this.$alert(`<h3>请用户进行扫码验证</h3>
        <img src="data:image/png;base64,${res.QRCode}" width="300" />`, '验证', {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          showConfirmButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: true,
          center: true
        })
        this.inspectFc(res)
      })
    },
    /**
     * 检查是否扫码成功
     */
    inspectFc(data) {
      setTimeout(() => {
        signservice_verifyCallBack({
          identifyUuid: data.identifyUuid
        }).then(result => {
          if (result.code == '0') {
            const bizNum = result.data.bizNums
            signservice_getStampBase64({
              bizNum
            }).then(respone => {
              // 第三方登录接口
              sys_oauth2Login({ username: bizNum, ticket: 'CAoauth2Login' }).then(CAres => {
                // 获取默认病区选择
                this.$msgbox.close()
                getUserWardList(bizNum).then(getRes => {
                  this.$store.commit('set_userWardList', getRes.data)
                  const username_wardCode = localStorage.getItem(`${bizNum}_wardCode`)
                  let wardIndex = getRes.data.findIndex((item) => {
                    return item.wardCode == username_wardCode
                  })
                  wardIndex = wardIndex >= 0 ? wardIndex : 0
                  this.$store.commit('set_currentUserWard', getRes.data[wardIndex])
                  handleCurrentSkin('', bizNum, getRes.data[wardIndex].wardCode)
                  CAres.workbenchCode = getRes.data[wardIndex].wardCode
                  this.$store.dispatch('caLogin', CAres)
                  // 存入重症后台签名
                  sys_updataUserPic({
                    userName: bizNum,
                    picPath: respone.data
                  }).then(() => {
                    this.$router.push({ path: '/layout', query: { currentModel: this.indexUrl, ...this.$route.query } })
                  })
                })
              })
            }).catch(() => {
              this.$message.error('获取签名图片失败!')
              this.$msgbox.close()
            })
          } else if (result.code == '101') {
            this.$message.error('授权失败!')
            this.$msgbox.close()
          } else {
            this.inspectFc(data)
          }
        }).catch(() => {
          this.inspectFc(data)
        })
      }, 2000)
    }
  }
}
</script>

<style  lang="scss" scoped>
.copyright {
  text-align: center;
  color: #fff;
  padding-bottom: 26px;
  font-size: 14px;
  .unifiedClass {
    color: #666666;
  }
}
p {
  margin: 0;
}
.login-container {
  position: relative;
  height: 100%;
  min-height: 600px;
  width: 100%;
  background:no-repeat -1px 0 #175399;
  background-image: url('~@/assets/img/bg-anes.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .logoimg.unifiedClass {
    width: 100px;
  }
  .isLogoCss {
    width: 90px;
  }
  .isCurrentCss{
    background: #000;
    padding-bottom: 0;
    line-height: 23px;
  }
  .qr {
    position: absolute;
    right: 0;
    font-size: 30px;
    color: silver;
    cursor: pointer;
  }
  .head {
    margin-top: 43px;
    margin-left: 59px;
    display: flex;
    align-items: center;
    &-span1 {
      width: 57px;
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 42px;
      margin-right: 20px;
    }
    &-span2 {
      width: fit-content;
      height: 37px;
      font-size: 26px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 37px;
    }
    &-span3 {
      width: fit-content;
      height: 37px;
      font-size: 26px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 37px;
    }

    &-line {
      padding: 0px 10px;
    }
    @media (min-width: 1680px) and (max-width: 1920px) {
      &-span1 {
        font-size: 30px;
      }

      &-span2 {
        font-size: 26px;
      }
      &-span3 {
        font-size: 26px;
      }
    }
    @media (max-width: 1680px) {
      &-span1 {
        font-size: 24px;
      }

      &-span2 {
        font-size: 22px;
      }
      &-span3 {
        font-size: 22px;
      }
    }
  }
  .unifiedClass {
    .head-span1,
    .head-span2,
    .head-span3 {
      color: #2173f9;
    }
  }
  // .copyright {
  //   text-align: center;
  //   color: #fff;
  //   padding-bottom: 26px;
  //   font-size: 14px;
  // }
  .login {
    position: absolute;
    top: 50%;
    right: 15.6%;
    width: 500px;
    height: auto;
    background: #ffffff;
    box-shadow: 0px 6px 12px 0px rgba(25, 38, 60, 0.45);
    border-radius: 6px;
    transform: translateY(calc(-50% - 10px));
    &-body {
      margin: 47px 60px 62px;
    }
    &-title {
      width: 130px;
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000622;
      line-height: 45px;
    }
  }

  h3 {
    color: #8a8a8a;
    margin: 0;
    font-weight: lighter;
    margin-top: 14px;
    padding-bottom: 10px;
  }
  .el-form {
    margin-top: 0;
    ::v-deep .el-form-item {
      margin-top: 46px;
      .el-input {
        border: none;
        font-size: 16px;
      }
      .el-select {
        width: 100%;
      }

      .btn-login {
        width: 100%;
        height: 56px;
        letter-spacing: 5px;
        font-size: 20px;
        border-radius: 28px;
      }

      .el-input__inner {
        border: none;
        border-bottom: 1px solid #c8cace;
        border-radius: 0;
        padding-left: 55px;
        line-height: 44px;
        height: 44px;
        background: none;
        &:-webkit-autofill {
          // 覆盖 自动填入密码时背景色
          // -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
          -webkit-text-fill-color: #000622 !important;
        }
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
          // 去掉自动填充时默认背景色
          -webkit-transition-delay: 99999s;
          -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
        }
        &::-webkit-input-placeholder {
          color: rgba(0, 6, 34, 0.4);
        }
      }
      .el-input__prefix {
        left: 12px;
        height: auto;
        img {
          vertical-align: bottom;
        }
      }
      .pin .el-input__inner {
        padding-left: 10px;
      }
      &.is-error .el-input__inner {
        border-bottom: 1px solid #f52c2c !important;
      }
      .el-form-item__error {
        padding-top: 8px;
        padding-left: 60px;
        font-size: 16px;
      }
    }
  }
}
.isLogoCssColor {
  color: #2A4FF4 !important;
}
::v-deep .el-dialog {
  .dialogBody {
    height: 500px;
    display: flex;
  }
  .title {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
  .colText {
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-back {
      width: 23px;
      text-align: left;
    }
    .el-icon-right {
      width: 23px;
      text-align: right;
    }
  }
  .col {
    width: 40%;
    height: 100%;
    flex: 1;
    border: solid 1px #eee;
    border-radius: 5px;
  }
  .col + .col {
    margin-left: 10px;
  }
  .item {
    padding: 8px 15px;
    margin: 5px 10px 0px 10px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
    border-radius: 5px;
  }
  .item:hover {
    background-color: #fdfdfd;
    cursor: move;
  }
  .item + .item {
    border-top: none;
    margin-top: 6px;
  }
  .draggable {
    height: calc(100% - 41px);
    overflow: auto;
    span {
      height: 100%;
      display: block;
    }
  }
  .el-button {
    width: 80px;
  }
}
</style>
