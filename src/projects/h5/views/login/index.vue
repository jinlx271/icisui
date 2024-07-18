<template>
  <div class="login-container ">
    <div class="title">
      {{ globalConfig.title }}
    </div>
    <div class="form">
      <div class="flex flex-direction-column align-item-center " style="margin:auto;">
        <el-form label-width="0px" :model="loginForm" ref="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input placeholder="请输入工号" v-model="loginForm.username" @change="querySelectUserIcu"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="workbenchCode">
            <el-input placeholder="请选择病区" @focus="pickerFlag = true" v-model="loginForm.wardName"></el-input>
          </el-form-item>
        </el-form>
        <el-button round @click="handleLogin" class="loginBtn" :loading="loading">登录</el-button>
      </div>
    </div>
    <div class="copyright" v-if="currentVersion">
      <!-- 获取版本号 -->
      <span :class="{ unifiedClass: unifiedClass }">{{ currentVersion }}</span>
    </div>
    <van-popup v-model="pickerFlag" position="bottom">
      <van-picker :columns="userWardList" @change="onChange" :visible-item-count="3" show-toolbar
        @cancel="pickerFlag = false" @confirm="onConfirm" class="fixedPicker" :default-index="pickerIndex"
        value-key="wardName" />
    </van-popup>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import {
  getCurBeid,
  getUserWardList,
  version_getSystemInfo // 版本版权信息
} from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      console.log('value', value)
      if (value.length < 5 && 1 + 1 !== 2) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginRoleType: localStorage.getItem('loginRoleType'),
      currentVersion: '',
      globalConfig: globalConfig,
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
        gbName: '',
        wardCode: '',
        wardName: ''
      },
      loginRules: {
        workbenchCode: [{ required: true, message: '请选择病区', trigger: 'blur' }],
        username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', validator: validatePass, trigger: 'blur' }]
      },
      XTCS0026: 1,
      pickerFlag: false,
      columns: [],
      pickerIndex: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['indexUrl', 'userWardList', 'systemInfo', 'sysSkinList', 'currentUserSkin']),
    unifiedClass() {
      return this.XTCS0026 == 1 && !this.loginRoleType
    }
  },
  created() {
    // 初始化
    this.init()
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    async init() {
      this.getCurBeidFC()
    },
    login() {
      this.$router.push({ path: '/patientHome' })
    },
    onChange(picker, value, index) {
      this.pickerIndex = index
    },
    /**
     * 病区选择
     */
    onConfirm() {
      this.loginForm.workbenchCode = this.userWardList[this.pickerIndex].wardCode
      this.loginForm.wardName = this.userWardList[this.pickerIndex].wardName
      this.handleSelectWorkbench(this.loginForm.workbenchCode)
      this.pickerFlag = false
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
      })
    },
    /**
     * 获取用户病区
     */
    querySelectUserIcu() {
      //  没有用户信息不发请求
      if (!this.loginForm.username) {
        return
      }
      // 清空  原因有病区用户登录.再次更换没有病区的用户病区列表没有清空
      this.$store.commit('set_userWardList', [])
      this.loginForm.workbenchCode = ''
      // 获取默认病区选择
      getUserWardList(this.loginForm.username).then(res => {
        this.$store.commit('set_userWardList', res.data)
        this.$nextTick(() => {
          const username_wardCode = localStorage.getItem(`${this.loginForm.username}_wardCode`)
          const wardIndex = res.data.findIndex((item) => {
            return item.wardCode == username_wardCode
          })
          this.pickerIndex = wardIndex >= 0 ? wardIndex : 0
          this.loginForm.workbenchCode = res.data[this.pickerIndex].wardCode
          this.loginForm.workbenchName = res.data[this.pickerIndex].wardName
          this.loginForm.wardCode = res.data[this.pickerIndex].wardCode
          this.loginForm.wardName = res.data[this.pickerIndex].wardName
          this.$store.commit('set_currentUserWard', res.data[this.pickerIndex])
        })
      })
    },
    handleSelectWorkbench(value) {
      if (!value) {
        this.$store.commit('set_currentUserWard', null)
      } else {
        const ward = this.userWardList.find(item => {
          return item.wardCode == value
        })
        this.$store.commit('set_currentUserWard', ward)
      }
    },
    /**
     * 登录
     */
    handleLogin() {
      // const me = this
      this.loading = true
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
                // this.$router.push({ path: me.indexUrl, query: this.$route.query }).catch(e => {
                //   console.error('router erro ', e)
                // })
                this.$router.push({ path: '/patientHome', query: this.$route.query }).catch(e => {
                  console.error('router erro ', e)
                })
              }, 2000)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  // background: url('@/assets/bg-anes.png') no-repeat -1px 0 #175399;
  background: #fff;
  // background-size: 100% 100%;
  overflow: hidden;
  display: block;

  .title {
    margin-top: rem(127);
    width: 100vw;
    height: 8vh;
    opacity: 1;
    /** 文本1 */
    font-size: rem(40);
    font-weight: 700;
    line-height: 1;
    color: rgba(42, 130, 228, 1);
    text-align: center;
    vertical-align: top;
  }

  .form {
    width: rem(539);
    margin: rem(53) auto;

    .el-input,
    .el-select,
    .el-button {
      width: rem(539);
      height: 7vh;
      font-size: 1rem;
    }

    ::v-deep .el-input .el-input__inner {
      height: 7vh;
      line-height: 1;
      border-radius: 3vh;
      font-size: 1rem;
      background: rgba(246, 246, 246, 1);
      border: none;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item.el-form-item {
      margin-bottom: 3.5vh;
    }

    .loginBtn {
      background: linear-gradient(90deg, rgba(91, 202, 255, 1) 0%, rgba(42, 130, 228, 1) 100%);
      font-size: rem(20);
      font-weight: 400;
      border-radius: 3.5vh;
      color: rgba(255, 255, 255, 1);
      margin-top: 6vh;
    }

    .wardList {
      width: rem(539);
      height: 7vh;
      border-radius: 3.5vh;
      border: none;
      height: 7vh;
      line-height: 1;
      border-radius: 3vh;
      font-size: 1rem;
      background: rgb(246, 246, 246);
    }
  }

  .copyright {
    /** 文本1 */
    font-size: rem(12);
    font-weight: 400;
    color: rgb(166, 166, 166);
    position: fixed;
    height: rem(12);
    bottom: 11vh;
    width: 100vw;
    font-size: rem(12);
  }
}
</style>
