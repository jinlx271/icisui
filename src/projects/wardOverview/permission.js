import router from './router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getCookie } from '@/utils/cookie' // 验权
import { cancelAjax } from '@/utils/request' //
import { sys_getUserWardList, getCurBeid } from '@/api/login'
import { patientInfo_getPaientInfo } from '@/api/patient'
import { handleCurrentSkin, patientInfoFormat, batchGetDictItemList, queryParam } from '@/utils/utils' // 验权
const whiteList = ['/login', '/patient/nurseRecordPrint', '/operate/winningReport', '/patient/recordView', '/error'] // 不重定向白名单
const loginRoleType = localStorage.getItem('loginRoleType')
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  cancelAjax('clearAll')
  if (from && to && to.path == from.path) {
    return next()
  }
  const { session_id, service_ticket, redirect, ticket, portalurl, token, inpatientID, wardCode, TOKEN, userID, width, height } = to.query // session_id=123&service_ticket=ST
  if ((session_id && service_ticket) || ticket) {
    const loginForm = {}
    loginForm.session_id = session_id || ''
    loginForm.service_ticket = service_ticket || ticket
    store
      .dispatch('ssoLogin', loginForm)
      .then(async function (result) {
        const cuBeidRes = await getCurBeid() // 单点登录 保存系统信息
        if (cuBeidRes.data) {
          store.commit('set_systemInfo', cuBeidRes.data)
        }

        const wardListRes = await sys_getUserWardList(result?.user?.userName)
        if (wardListRes.data.length > 0) { // 如果用户没有病区信息 可能是360 查询进来 查看患者的信息
          store.commit('set_userWardList', wardListRes.data)
          store.commit('set_currentUserWard', wardListRes.data[0])
        }
        // 单点登录 点击图标需要跳回之前页面
        if (portalurl) {
          store.commit('SET_SSOINDEXURL', decodeURIComponent(portalurl))
        }
        const query = {}

        if (width) {
          query.width = width
        }
        if (height) {
          query.height = height
        }
        next({
          path: redirect || store.getters.indexUrl,
          replace: true,
          query: query
        })
      })
      .catch(() => {
        if (portalurl) {
          setTimeout(() => {
            location.href = portalurl
          }, 1500)
        } else {
          next(loginRoleType ? `/login?${loginRoleType}` : `/login`)
        }
      })
    return
  }
  if (token || TOKEN) {
    // 779501 实现标准网页集成登入接口
    const query = {
      inpatientID: inpatientID, // 对应重症 patientInfo.inpatientEntity.hisInpatientId 患者详情必须
      wardCode: wardCode,
      token: token || TOKEN,
      userID
    }
    store
      .dispatch('redirectLogin', query)
      .then(async function (result) {
        const cuBeidRes = await getCurBeid() // 第三方登录 保存系统信息
        if (cuBeidRes.data) {
          store.commit('set_systemInfo', cuBeidRes.data)
        }
        sys_getUserWardList(result?.user?.userName).then(async (res) => {
          const wardListRes = res
          if (wardListRes?.data?.length > 0) {
            store.commit('set_userWardList', wardListRes.data)
            const currWardInfo = wardListRes.data.filter((item) => item.wardCode == result.wardCode)
            store.commit('set_currentUserWard', currWardInfo[0] || wardListRes.data[0])
            handleCurrentSkin('', result?.user?.userName, currWardInfo[0]?.wardCode || wardListRes.data[0]?.wardCode)
          } else if (result.icuInfo.icuAreaCode) {
            const wardInfo = {
              wardCode: result.icuInfo.icuAreaCode,
              wardName: result.icuInfo.icuAreaName
            }
            store.commit('set_currentUserWard', wardInfo)
          }
          if (inpatientID) {
            if (result.icuRecordId) {
              // 患者级别 返回正常的icuRecordId
              const patientInfo = await patientInfo_getPaientInfo(result.icuRecordId)
              const batchDictObj = await batchGetDictItemList(['HIS_DICT_SEX', 'HIS_DICT_RELATION_TYPE'])
              const sexDictData = batchDictObj['HIS_DICT_SEX']
              const patientRationData = batchDictObj['HIS_DICT_RELATION_TYPE']
              const xtcs0093 = await queryParam({
                paramGroupCode: 'XTCS',
                paramCode: 'XTCS0093'
              })
              const params = {
                XTCS0093: xtcs0093[0]?.paramValue || '0'
              }
              const patientInfoTemp = patientInfoFormat(patientInfo.data, params, sexDictData, patientRationData)
              patientInfoTemp.bedId = patientInfoTemp.patientInfo.icuInfoEntity.icuBed
              store.commit('set_patientInfo', patientInfoTemp)
              delete to.query.token
              delete to.query.TOKEN
              to.query.view360 = 1 // 增加360视图标志
              next({ path: to.path, query: to.query })
            } else {
              // 没有返回正常的icuRecordId 祥云跳转至空床位页面
              if (to.path.indexOf('recordView') > -1) {
                delete to.query.token
                delete to.query.TOKEN
                 to.query.view360 = 1 // 增加360视图标志
                next({ path: to.path, query: to.query })
              } else {
                delete to.query.token
                delete to.query.TOKEN
                 to.query.view360 = 1 // 增加360视图标志
                const queryTemp = Object.assign(to.query, { noData: 1 })
                next({ path: '/patientHome/homePage', query: queryTemp })
              }
            }
          } else {
            delete to.query.token
            delete to.query.TOKEN
            next({ path: to.path, query: to.query })
          }
        })
      })
      .catch((e) => {
        Message.error(e.data.msg)
        console.log('e', e)
        // next({ path: '/error', query: { msg: e.data.msg } }) // 【重症V6.0.2212.20230206】文书调阅：当用户名不存在时，页面一直在加载中，未出现提示 第三方错误 登录提示
      })
    return
  }
  handleCurrentSkin(null)
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const mainMenu = store.getters.mainMenu
    if (mainMenu == null || mainMenu.length == 0) {
      const menuPathList = JSON.parse(sessionStorage.getItem('menuPathList'))
      if (!menuPathList) {
        next(loginRoleType ? `/login?${loginRoleType}` : `/login`)
      } else {
        store.dispatch('setMenuPathList', menuPathList).then((response) => {
          // 处理一下一级菜单指定二级菜单.没有子菜单的情况

          for (let i = 0; i < response.length; i++) {
            // 一级菜单 为了break跳出去用for
            const item = response[i]
            item.existence = false // 是否能找到标识
            if (item.name == 'configuration') {
              // 配置页面特殊处理.3级菜单处理
              const list2 = item.children.filter((res) => {
                return item.redirect.name == res.name
              }) // 二级菜单是否能找到
              if (list2.length > 0) {
                // 判断2级菜单存在
                const list3 = list2[0].children.filter((res) => {
                  return list2[0].redirect.name == res.name
                }) // 三级菜单是否能找到
                if (list3.length > 0) {
                  // 判断2级找3级存在
                  item.existence = true
                }
              }
              // 找不到就拿最近一条赋值.不报错就行
              if (!item.existence) {
                if (item.children.length > 0) {
                  for (let j = 0; j < item.children.length; j++) {
                    if (item.children[j]) {
                      if (item.children[j].children.length > 0) {
                        let breakFlag = false
                        for (const k in item.children[j].children) {
                          if (item.children[j].children[k].name && item.children[j].redirect) {
                            item.redirect.name = item.children[j].name
                            item.children[j].redirect.name = item.children[j].children[k].name || ''
                            breakFlag = true
                            break
                          }
                        }
                        if (breakFlag) {
                          break
                        }
                      } else {
                        item.children.splice(j, 1) // 如果下面没有子元素.就删掉一级菜单
                        --j // 删除后,无法运行,所以减减
                      }
                    }
                  }
                } else {
                  response.splice(i, 1) // 如果下面没有子元素.就删掉一级菜单
                  --i // 删除后,无法运行,所以减减
                }
              }
            } else {
              // 普通处理二级菜单
              for (const j in item.children) {
                // 二级菜单
                if (item.redirect?.name == item.children[j].name || item.redirect?.name == item.children[j].path || item.redirect == item.children[j].name || item.redirect == item.children[j].path) {
                  item.existence = true
                  break
                }
              }
              if (!item.existence && item.name !== 'patient') {
                // 患者找不到下面子元素的  患者一般不会禁用床卡.这里就不做判断了
                if (item.children[0]?.name) {
                  item.redirect.name = item.children[0].name
                } else {
                  response.splice(i, 1) // 如果下面没有子元素.就删掉一级菜单
                  --i // 删除后,无法运行,所以减减
                }
              }
            }
          }
          // response.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(response)
          // next()
        })
      }
    }
    const tockenInfo = getCookie('token') // 用户是否有登录信息
    if (tockenInfo) {
      // 这里跳转
      if (to.path.indexOf('404') !== -1) {
        let mainMenuOne = true // 一级菜单 设为首页.但是被禁用
        // 修复bug 菜单跳转2级的时候.如果没有地址.就跳转第一条
        for (const i in mainMenu) {
          if (to.redirectedFrom.indexOf(`/${mainMenu[i]?.name}`) !== -1 && mainMenu[i]?.children[0]?.path) {
            // 找到相同二级菜单
            next(mainMenu[i].children[0].path)
            return
          }
          if (to.redirectedFrom == mainMenu[i]?.path) {
            mainMenuOne = false
          }
        }
        // 找不到.就跳转第一个首页
        if (mainMenuOne) {
          next(redirect || mainMenu[0]?.path || store.getters.indexUrl)
          return
        }
      }
      next()
    } else {
      // next()
      next(loginRoleType ? `/login?${loginRoleType}` : `/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
