import { login, logout, ssoLogin } from '@/api/login'
import store from '@/store'
// import { setRoute } from '@/utils/utils'
import { setCookie, getCookie, cleanCookie } from '@/utils/cookie' // 存储方式
import { handleTree } from '@/utils/ruoyi'
import md5 from 'js-md5' // md5加密
import router from '@/router' // 路由
import { resetRouter } from '@/router' // 路由
import axios from 'axios'
import { shiftListWrap, queryParam } from '@/utils/utils'
import {
  findShiftWithPage
} from '@/api/configuration'
const userInfo = getCookie('userInfo')
const systemInfo = getCookie('systemInfo') || {}
const userWardList = JSON.parse(sessionStorage.getItem('userWardList')) || []
const ssoIndexUrl = sessionStorage.getItem('ssoIndexUrl') || ''
const currentUserWard = getCookie('currentUserWard')
const currWardShiftInfo = getCookie('currWardShiftInfo')
const currentUserSkin = getCookie('currentUserSkin')
const loginSource = JSON.parse(sessionStorage.getItem('loginSource')) || 'common'
let permissionsBtn = []
const permissionsBtnStr = sessionStorage.getItem('permissionsBtn')
if (permissionsBtnStr && permissionsBtnStr != 'undefined') {
  permissionsBtn = JSON.parse(permissionsBtnStr)
}
const msgExtract = sessionStorage.getItem('msgExtract') || false
const msgFloat = JSON.parse(sessionStorage.getItem('msgFloat')) || []
const isLoginCA = sessionStorage.getItem('isLoginCA')
const ca1014 = JSON.parse(sessionStorage.getItem('ca1014')) || []
const loginValidNum = JSON.parse(sessionStorage.getItem('loginValidNum')) || []

const user = {
  state: {
    permissionsMenu: [], // 权限菜单树
    permissionsDoc: [], // 权限文书
    sysSetting: [],
    role: '',
    hospitalName: '', // 医院名称
    beid: '',
    static: false,
    noticeMessge: {},
    workbenchCode: '',
    noticeFlag: false,
    indexUrl: sessionStorage.getItem('indexUrl'), // 登陆首页调整地址
    ssoIndexUrl: ssoIndexUrl, // 单点登录的 地址

    permissionsBtn: permissionsBtn, // 权限按钮
    menuPathList: [], // 菜单集合
    mainMenu: null, // 当前工作区主菜单
    userInfo: userInfo, // 当前登陆用户信息
    systemInfo: systemInfo, // 系统信息
    userWardList: userWardList, // 用户关联病区集合 非管理原用户需要设置
    currentUserWard: currentUserWard, // 用户当前选中病区 非管理原用户需要设置
    currWardShiftInfo: currWardShiftInfo,
    msgInIcu: null, // 代办事项-入区
    msgOutIcu: null, // 代办事项-出区

    top8ListFlag: 0, // 患者管理- 标题栏检测- 患者评估删除新增修改事件
    patientRoute: true, // 患者管理路由 刷新代办事项
    currentUserSkin: currentUserSkin,
    loginSource: loginSource, // 常规登录方式 通过login页面进行登录
    msgExtract: msgExtract || false, // 重要消息跳页面需要弹框
    msgFloat: msgFloat,
    sysSkinList: [
      {
        id: 1,
        skinName: '主色蓝',
        colorList: [
          {
            name: '--maincolor',
            color: '#2D5AFA'
          },
          {
            name: '--maincolor2',
            color: '#5175F4'
          },
          {
            name: '--maincolor3',
            color: '#1D39C4'
          },
          {
            name: '--maincolor4',
            color: '#EAEEFE'
          },
          {
            name: '--maincolor5',
            color: '#C9D6FB'
          }
        ]
      },
      {
        id: 2,
        skinName: '主题紫',
        colorList: [
          {
            name: '--maincolor',
            color: '#9e7eee'
          },
          {
            name: '--maincolor2',
            color: '#b096f0'
          },
          {
            name: '--maincolor3',
            color: '#5630b4'
          },
          {
            name: '--maincolor4',
            color: '#F2EDFF'
          },
          {
            name: '--maincolor5',
            color: '#F8F5FF'
          }
        ]
      },
      {
        id: 3,
        skinName: '主题绿',
        colorList: [
          {
            name: '--maincolor',
            color: '#13892f'
          },
          {
            name: '--maincolor2',
            color: '#82c48b'
          },
          {
            name: '--maincolor3',
            color: '#04661c'
          },
          {
            name: '--maincolor4',
            color: '#E4FFEC'
          },
          {
            name: '--maincolor5',
            color: '#F4FFF8'
          }
        ]
      },
      {
        id: 4,
        skinName: '天镜蓝',
        colorList: [
          {
            name: '--maincolor',
            color: '#0791EF'
          },
          {
            name: '--maincolor2',
            color: '#48ADF3'
          },
          {
            name: '--maincolor3',
            color: '#068BDD'
          },
          {
            name: '--maincolor4',
            color: '#ECF7FF'
          },
          {
            name: '--maincolor5',
            color: '#F5FBFF'
          }
        ]
      },
      {
        id: 5,
        skinName: '山梗紫',
        colorList: [
          {
            name: '--maincolor',
            color: '#722ED1'
          },
          {
            name: '--maincolor2',
            color: '#9E6EE1'
          },
          {
            name: '--maincolor3',
            color: '#551AA7'
          },
          {
            name: '--maincolor4',
            color: '#F5EDFF'
          },
          {
            name: '--maincolor5',
            color: '#F9F5FF'
          }
        ]
      },
      {
        id: 6,
        skinName: '水湘青',
        colorList: [
          {
            name: '--maincolor',
            color: '#2DB7A0'
          },
          {
            name: '--maincolor2',
            color: '#60E0CB'
          },
          {
            name: '--maincolor3',
            color: '#089881'
          },
          {
            name: '--maincolor4',
            color: '#EDFDFB'
          },
          {
            name: '--maincolor5',
            color: '#F0F8F8'
          }
        ]
      },
      {
        id: 7,
        skinName: '竹月蓝',
        colorList: [
          {
            name: '--maincolor',
            color: '#005D97'
          },
          {
            name: '--maincolor2',
            color: '#0A74B6'
          },
          {
            name: '--maincolor3',
            color: '#004E7E'
          },
          {
            name: '--maincolor4',
            color: '#DAF1FF'
          },
          {
            name: '--maincolor5',
            color: '#E9F7FF'
          }
        ]
      },
      {
        id: 8,
        skinName: '罗兰紫',
        colorList: [
          {
            name: '--maincolor',
            color: '#8142B0'
          },
          {
            name: '--maincolor2',
            color: '#9553C6'
          },
          {
            name: '--maincolor3',
            color: '#5F1C91'
          },
          {
            name: '--maincolor4',
            color: '#F2E0FF'
          },
          {
            name: '--maincolor5',
            color: '#F9F0FF'
          }
        ]
      },
      {
        id: 9,
        skinName: '松柏绿',
        colorList: [
          {
            name: '--maincolor',
            color: '#1F8970'
          },
          {
            name: '--maincolor2',
            color: '#1FA585'
          },
          {
            name: '--maincolor3',
            color: '#046A52'
          },
          {
            name: '--maincolor4',
            color: '#D5FFF5'
          },
          {
            name: '--maincolor5',
            color: '#E3FFF8'
          }
        ]
      },
      {
        id: 10,
        skinName: '深海蓝',
        colorList: [
          {
            name: '--maincolor',
            color: '#0043B2'
          },
          {
            name: '--maincolor2',
            color: '#1B5ED0'
          },
          {
            name: '--maincolor3',
            color: '#003793'
          },
          {
            name: '--maincolor4',
            color: '#E0EBFF'
          },
          {
            name: '--maincolor5',
            color: '#F4F8FF'
          }
        ]
      },
      {
        id: 11,
        skinName: '木槿紫',
        colorList: [
          {
            name: '--maincolor',
            color: '#7753BD'
          },
          {
            name: '--maincolor2',
            color: '#9067DF'
          },
          {
            name: '--maincolor3',
            color: '#5935A0'
          },
          {
            name: '--maincolor4',
            color: '#E9DEFF'
          },
          {
            name: '--maincolor5',
            color: '#F4EFFF'
          }
        ]
      },
      {
        id: 12,
        skinName: '冬青绿',
        colorList: [
          {
            name: '--maincolor',
            color: '#196C35'
          },
          {
            name: '--maincolor2',
            color: '#278B49'
          },
          {
            name: '--maincolor3',
            color: '#0D4F23'
          },
          {
            name: '--maincolor4',
            color: '#DAFFE7'
          },
          {
            name: '--maincolor5',
            color: '#ECFFF3'
          }
        ]
      },
      {
        id: 13,
        skinName: '石涧蓝',
        colorList: [
          {
            name: '--maincolor',
            color: '#2996AA'
          },
          {
            name: '--maincolor2',
            color: '#39AFC5'
          },
          {
            name: '--maincolor3',
            color: '#177B8D'
          },
          {
            name: '--maincolor4',
            color: '#E3FBFF'
          },
          {
            name: '--maincolor5',
            color: '#EFFDFF'
          }
        ]
      },
      {
        id: 14,
        skinName: '星云紫',
        colorList: [
          {
            name: '--maincolor',
            color: '#422AA8'
          },
          {
            name: '--maincolor2',
            color: '#5235CB'
          },
          {
            name: '--maincolor3',
            color: '#2A1681'
          },
          {
            name: '--maincolor4',
            color: '#E3DCFF'
          },
          {
            name: '--maincolor5',
            color: '#F2EFFF'
          }
        ]
      },
      {
        id: 15,
        skinName: '芙蓉粉',
        colorList: [
          {
            name: '--maincolor',
            color: '#F24F86'
          },
          {
            name: '--maincolor2',
            color: '#FF82AC'
          },
          {
            name: '--maincolor3',
            color: '#D03469'
          },
          {
            name: '--maincolor4',
            color: '#FFE4EF'
          },
          {
            name: '--maincolor5',
            color: '#FFEEF5'
          }
        ]
      },
      {
        id: 16,
        skinName: '檀木棕',
        colorList: [
          {
            name: '--maincolor',
            color: '#B16C3D'
          },
          {
            name: '--maincolor2',
            color: '#C57036'
          },
          {
            name: '--maincolor3',
            color: '#985528'
          },
          {
            name: '--maincolor4',
            color: '#FFEBDD'
          },
          {
            name: '--maincolor5',
            color: '#FFF6EF'
          }
        ]
      },
      {
        id: 18,
        skinName: '落栗棕',
        colorList: [
          {
            name: '--maincolor',
            color: '#7B4A36'
          },
          {
            name: '--maincolor2',
            color: '#92604C'
          },
          {
            name: '--maincolor3',
            color: '#5C2E1B'
          },
          {
            name: '--maincolor4',
            color: '#FFEBE3'
          },
          {
            name: '--maincolor5',
            color: '#FFF5F1'
          }
        ]
      },
      {
        id: 17,
        skinName: '苍山棕',
        colorList: [
          {
            name: '--maincolor',
            color: '#60493B'
          },
          {
            name: '--maincolor2',
            color: '#805C47'
          },
          {
            name: '--maincolor3',
            color: '#433024'
          },
          {
            name: '--maincolor4',
            color: '#FFF3EB'
          },
          {
            name: '--maincolor5',
            color: '#FFFBF9'
          }
        ]
      }
    ],
    isLoginCA: isLoginCA || false,
    ca1014: ca1014,
    loginValidNum: loginValidNum,
    XTCS0169: null
  },

  mutations: {
    // 设置用户病区集合
    set_userWardList(state, userWardList) {
      sessionStorage.setItem('userWardList', JSON.stringify(userWardList))
      // 注释原因 病区太多cookie存储不了那么内容.
      // setCookie('userWardList', userWardList)
      state.userWardList = userWardList
    },
    // 设置当前用户病区
    async set_currentUserWard(state, currentUserWard) {
      setCookie('currentUserWard', currentUserWard)
      state.currentUserWard = currentUserWard
      const shiftList = await getShiftList(currentUserWard.wardCode)
      setCookie('currWardShiftInfo', shiftList)
      state.currWardShiftInfo = shiftList
    },
    // 设置系统信息
    set_systemInfo(state, systemInfo) {
      setCookie('systemInfo', systemInfo)
      state.systemInfo = systemInfo
    },
    // 设置当前登陆用户
    SET_USER: (state, userInfo) => {
      state.userInfo = userInfo // 保存用户信息
      setCookie('userInfo', userInfo)
    },
    SET_NENUPATHLIS: (state, menuPathList) => {
      sessionStorage.setItem('menuPathList', JSON.stringify(menuPathList))
      state.menuPathList = menuPathList // 保存用户菜单信息
    },
    // 设置主菜单
    SET_MAINMENU(state, menuPathList) {
      const mainMenu = filterRootRouter(menuPathList)
      state.mainMenu = mainMenu
    },
    // 设置登陆首页
    SET_INDEXURL(state, indexUrl) {
      sessionStorage.setItem('indexUrl', indexUrl)
      state.indexUrl = indexUrl
    },
    // 单点登录地址
    SET_SSOINDEXURL(state, indexUrl) {
      sessionStorage.setItem('ssoIndexUrl', indexUrl)
      state.ssoIndexUrl = indexUrl
    },
    // 记录登录来源 777133 【GA优化】单点登陆/外部调用屏蔽关闭按钮
    set_loginSource(state, loginSource) {
      sessionStorage.setItem('loginSource', JSON.stringify(loginSource))
      state.loginSource = loginSource
    },
    SET_workbenchCode(state, workbenchCode) {
      state.workbenchCode = workbenchCode
    },
    set_noticeMessage(state, noticeMessge) {
      state.noticeMessge = noticeMessge
    },
    set_role(state, role) {
      state.role = role
    },
    set_sysSetting: (state, sysSetting) => {
      state.sysSetting = sysSetting
    },

    SET_PERMISSIONS_MENU: (state, menuTree) => {
      state.permissionsMenu = menuTree
    },
    SET_PERMISSIONS_DOC: (state, permissionsDoc) => {
      state.permissionsDoc = permissionsDoc
    },
    SET_PERMISSIONS_BUTTON: (state, permissionsBtn) => {
      sessionStorage.setItem('permissionsBtn', JSON.stringify(permissionsBtn))
      // setCookie('permissionsBtn', permissionsBtn)
      state.permissionsBtn = permissionsBtn
    },
    set_hospitalName(state, hospitalName) {
      state.hospitalName = hospitalName
    },
    set_beid(state, beid) {
      state.beid = beid
    },

    SET_staticData(state, msg) {
      state.static = msg
    },
    SET_noticeFlag(state, noticeFlag) {
      state.noticeFlag = noticeFlag
    },
    SET_timer(state, timer) {
      state.timer = timer
    },
    SET_msgInIcu(state, val) {
      // 代办事项-入区
      state.msgInIcu = val
    },
    SET_msgOutIcu(state, val) {
      // 代办事项-出区
      state.msgOutIcu = val
    },
    SET_TOP8LISTFC(state, val) {
      // 患者管理- 标题栏检测- 患者评估删除新增修改事件
      state.top8ListFlag = val
    },
    SET_PATIENTROUTE(state, val) {
      // 患者管理路由 刷新代办事项
      state.patientRoute = val
    },
    // 设置系统主题皮肤
    set_currentUserSkin(state, currentUserSkin) {
      setCookie('currentUserSkin', currentUserSkin)
      state.currentUserSkin = currentUserSkin
    },
    // 设置重要消息
    set_msgExtract(state, currentUserSkin) {
      sessionStorage.setItem('msgExtract', currentUserSkin)
      state.msgExtract = currentUserSkin
    },
    // 设置重要消息弹框的位置
    set_msgFloat(state, currentUserSkin) {
      sessionStorage.setItem('msgFloat', JSON.stringify(currentUserSkin))
      state.msgFloat = currentUserSkin
    },
    // 缓存CA签名是否登录
    set_isLoginCA(state, currentUserSkin) {
      sessionStorage.setItem('isLoginCA', JSON.stringify(currentUserSkin))
      state.isLoginCA = currentUserSkin
    },
    // ca 用的1014编码一次请求
    set_ca1014(state, currentUserSkin) {
      sessionStorage.setItem('ca1014', JSON.stringify(currentUserSkin))
      state.ca1014 = currentUserSkin
    },
    // 设置登录失败累计次数
    set_loginValidNum(state, loginValidNum) {
      const curLoginValidNum = state.loginValidNum.find(item => item.username == loginValidNum.username)
      if (curLoginValidNum) {
        state.loginValidNum = state.loginValidNum.map(item => {
          if (item.username == curLoginValidNum.username) {
            item.num = loginValidNum.num
          }
           return item
         })
      } else {
        state.loginValidNum.push(loginValidNum)
      }
      sessionStorage.setItem('loginValidNum', JSON.stringify(state.loginValidNum))
    },
    async set_XTCS0169(state, XTCS0169) {
      if (XTCS0169) {
        state.XTCS0169 = XTCS0169
      } else {
        const paramConfigXTCS0169 = await queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0169' })
        if (paramConfigXTCS0169[0]?.paramValue) {
          state.XTCS0169 = JSON.parse(paramConfigXTCS0169[0].paramValue)
        } else {
          state.XTCS0169 = null
        }
      }
    }
  },

  actions: {
    /**
     * 登录
     * userInfo 登录页面传来的所有参数
     * */
    Login({ commit, dispatch }, userInfo) {
      const loginName = userInfo.username.trim() // 登录用户
      return new Promise((resolve, reject) => {
        const param = { ...userInfo } // 用户登录相关数据
        param.password = md5(userInfo.password) // 密码加密
        login(param)
          .then(response => {
            const user = response.user
            const homepage = response.homepage
            const menuRoot = response.menus
            const menuPathList = response.menuPathList
            const permissions = response.permissions
            commit('SET_NENUPATHLIS', menuPathList)
            commit('SET_PERMISSIONS_BUTTON', permissions)

            const userMenus = menuRoot.sort(compare('sort')) // 菜单重新排列
            const menuTree = handleTree(userMenus, 'id', '', '', '', true) // 用户权限菜单树
            const indexUrl = (homepage && homepage.url) || (menuTree && menuTree[0].path) || '/wardOverview'
            commit('SET_INDEXURL', indexUrl)
            commit('SET_SSOINDEXURL', '')
            sessionStorage.removeItem('ssoIndexUrl')
            sessionStorage.removeItem('userPersonalizedConfig')
            store.dispatch('userPersonalizedConfig', { userName: loginName })
            // 验签-相关数据
            setCookie('token', {
              username: loginName, // 用户名
              tocken: response.user.token, // 验签
              workbenchCode: userInfo.workbenchCode, // 病区编码
              beid: response.user.beid // 分院id
            })
            commit('SET_USER', user)
            commit('set_loginSource', 'common')
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    caLogin({ commit, dispatch }, response) {
      const user = response.user
      const homepage = response.homepage
      const menuRoot = response.menus
      const menuPathList = response.menuPathList
      const permissions = response.permissions
      commit('SET_NENUPATHLIS', menuPathList)
      commit('SET_PERMISSIONS_BUTTON', permissions)
      const userMenus = menuRoot.sort(compare('sort')) // 菜单重新排列
      const menuTree = handleTree(userMenus, 'id', '', '', '', true) // 用户权限菜单树
      const indexUrl = (homepage && homepage.url) || (menuTree && menuTree[0].path) || '/wardOverview'
      commit('SET_INDEXURL', indexUrl)
      commit('SET_USER', user)
      // 验签-相关数据
      setCookie('token', {
        username: user.userName, // 用户名
        tocken: response.user.token, // 验签
        workbenchCode: response.workbenchCode, // 病区编码
        beid: response.user.beid // 分院id
      })
      commit('set_loginSource', 'common')
      // 登录的信息
      setCookie(
        'login',
        {
          user: response.user || '' //, // 用户信息
        },
        true
      )
    },
    // 单点登陆
    ssoLogin({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        const { session_id, service_ticket } = userInfo
        ssoLogin({ sessionId: session_id, serviceTicket: service_ticket })
          .then(response => {
            const user = response.user
            const homepage = response.homepage
            const menuRoot = response.menus
            const menuPathList = response.menuPathList
            const permissions = response.permissions
            commit('SET_NENUPATHLIS', menuPathList)
            commit('SET_PERMISSIONS_BUTTON', permissions)
            const userMenus = menuRoot.sort(compare('sort')) // 菜单重新排列
            const menuTree = handleTree(userMenus, 'id', '', '', '', true) // 用户权限菜单树
            const indexUrl = (homepage && homepage.url) || (menuTree && menuTree[0].path) || '/wardOverview'
            commit('SET_INDEXURL', indexUrl)
            commit('SET_USER', user)
            // 验签-相关数据
            setCookie('token', {
              username: user.userName, // 用户名
              tocken: response.user.token, // 验签
              workbenchCode: response.workbenchCode, // 病区编码
              beid: response.user.beid // 分院id
            })
            // 登录的信息
            setCookie(
              'login',
              {
                user: response.user || '' //, // 用户信息
              },
              true
            )
            commit('set_loginSource', 'ssoLogin')
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * token登录
     * @param {*} param0
     * @param {*} userInfo
     */
    redirectLogin({ commit, dispatch }, loginInfo) {
      // 779501 实现标准网页集成登入接口
      return new Promise((resolve, reject) => {
        const { inpatientID, wardCode, token, userID } = loginInfo
        const query = {
          inpatientID,
          wardCode,
          userID
        }
        axios
          .post((process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + 'redirect', query, {
            headers: {
              'Content-Type': 'application/json',
              'X-Token': token
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              const response = res.data
              const user = response.user
              const homepage = response.homepage
              const menuRoot = response.menus
              const menuPathList = response.menuPathList
              const permissions = response.permissions
              commit('SET_NENUPATHLIS', menuPathList)
              commit('SET_PERMISSIONS_BUTTON', permissions)
              const userMenus = menuRoot.sort(compare('sort')) // 菜单重新排列
              const menuTree = handleTree(userMenus, 'id', '', '', '', true) // 用户权限菜单树
              const indexUrl = (homepage && homepage?.url) || (menuTree && menuTree.length > 0 && menuTree[0].path) || '/wardOverview'
              commit('SET_INDEXURL', indexUrl)
              commit('SET_USER', user)
              // 验签-相关数据
              setCookie('token', {
                username: user.userName, // 用户名
                tocken: response.user.token, // 验签
                workbenchCode: response.workbenchCode, // 病区编码
                beid: response.user.beid // 分院id
              })
              // 登录的信息
              setCookie(
                'login',
                {
                  user: response.user || '' //, // 用户信息
                },
                true
              )
              commit('set_loginSource', 'redirectLogin')
              resolve(response)
            } else {
              reject(res)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    setMenuPathList({ commit, state }, menuPathList) {
      return new Promise((resolve, reject) => {
        commit('SET_MAINMENU', menuPathList)
        resolve(state.mainMenu)
      })
    },
    /**
     * 登出
     */
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        const tockenInfo = getCookie('token')
        // 检测是否有登录,如果没有登录就退出.
        if (!tockenInfo) {
          resolve()
          return
        }
        logout({ username: tockenInfo.username })
          .then(() => {
            cleanCookie()
            sessionStorage.removeItem('permissionsBtn')
            sessionStorage.removeItem('menuPathList')
            sessionStorage.removeItem('userPersonalizedConfig')
            state.mainMenu = []
            // state.mainMenu = null // 登出代码报错
            // setRoute('login') // 跳登录
            window.location.reload()
            commit('SET_PATIENTROUTE', false)
            resetRouter()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     *
     * 获取配置信息
     */
    async getSysConfigureList({ commit }) {}
  }
}
// 数组排序
function compare(property) {
  return function(a, b) {
    return a[property] - b[property]
  }
}

// 过滤父层元素
function filterRootRouter(menuPathList) {
  if (menuPathList == null || menuPathList.length == 0) {
    return []
  }
  const rootRoutes = []
  const settingRoutes = router.options.settingRoutes
  settingRoutes.forEach(element => {
    const key = element.path
    if (menuPathList.indexOf(key) > -1) {
      rootRoutes.push(element)
      const children = element.children
      if (children && children.length > 0) {
        filterRouter(menuPathList, element)
      }
    }
  })
  return rootRoutes
}

// 过滤子元素
function filterRouter(menuPathList, element) {
  const children = element.children
  element.children = children.filter(subelement => {
    const key = subelement.path
    if (menuPathList.indexOf(key) < 0) {
      return false
    }
    const subChildren = subelement.children
    if (subChildren == null) {
      return true
    }
    if (subChildren.length < 1) {
      return false
    }
    filterRouter(menuPathList, subelement)
    return true
  })
}
function getShiftList(wardCode) {
  return new Promise((resolve, reject) => {
    const query = {
      wardCode: wardCode
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

        resolve(shiftListWrap(shiftList))
      }
    })
  })
}

export default user
