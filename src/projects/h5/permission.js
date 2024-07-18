import router from './router'
import store from './store'
// import my from 'mmcp-jsapi'
import { getCookie } from '@/utils/cookie' // 验权
import { handleCurrentSkin } from '@/utils/utils' // 验权
import { sys_getUserWardList, getCurBeid } from '@/api/login'
const whiteList = ['/login', '/404', '/error'] // 不重定向白名单
const loginRoleType = localStorage.getItem('loginRoleType')
router.beforeEach(async (to, from, next) => {
  if (from && to && to.path == from.path) {
    return next()
  }
  const { code } = to.query
  console.log('code==', code)
  if (code) { //
    const query = {
      code
    }
    // my.popup.showLoading({
    //   content: '加载中'
    // })
    store
      .dispatch('WinMYLogin', query)
      .then(async function (result) {
        const cuBeidRes = await getCurBeid() // 第三方登录 保存系统信息
        if (cuBeidRes.data) {
          store.commit('set_systemInfo', cuBeidRes.data)
        }
        sys_getUserWardList(result?.user?.userName).then((res) => {
          const wardListRes = res
          if (wardListRes.data.length > 0) {
            store.commit('set_userWardList', wardListRes.data)
            const currWardInfo = wardListRes.data.filter((item) => item.wardCode == result.wardCode)
            store.commit('set_currentUserWard', currWardInfo[0] || wardListRes.data[0])
            handleCurrentSkin('', result?.user?.userName, currWardInfo[0]?.wardCode || wardListRes.data[0]?.wardCode)
            delete to.query.code
            // my.popup.hideLoading()
            next({ path: to.path, query: to.query })
          }
        }).catch((e) => {
          // my.popup.hideLoading()
          next({ path: '/error', query: { msg: e?.data?.msg || e?.msg } })
        })
      })
      .catch((e) => {
        // my.popup.hideLoading()
        next({ path: '/error', query: { msg: e?.data?.msg || e?.msg } })
      })
    return
  }
  handleCurrentSkin(null)
  const { redirect } = to.query
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
                if (item?.children && item?.children[0]?.name) {
                  item.redirect.name = item.children[0].name
                } else {
                  if (item.path.indexOf('/patient/') == -1) {
                    response.splice(i, 1) // 如果下面没有子元素.就删掉一级菜单
                    --i // 删除后,无法运行,所以减减
                  }
                }
              }
            }
          }
          response.push({ path: '*', redirect: '/404', hidden: true })
          response.forEach((item) => {
            router.addRoute(item)
          })
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
      next(loginRoleType ? `/login?${loginRoleType}` : `/login`)
    }
  }
})

router.afterEach(() => {})
