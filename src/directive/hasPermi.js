/**
 * 操作权限处理
 */

import store from '@/store'

function checkPerm(el, binding) {
  const { value, modifiers } = binding
  const { checkAddUser } = modifiers
  const { userName } = store.getters && store.getters.userInfo
  const all_permission = '*:*:*'
  const permissions = store.getters && store.getters.permissionsBtn
  if (value && value instanceof Array && value.length > 0) {
    const permissionFlag = value.filter(v => v.indexOf('loginUserCode:') < 0 && v != 'patient:configuration:editauthbyself')
    const editauthbyself = value.filter(v => v == 'patient:configuration:editauthbyself').length > 0 && permissions.some(item => {
      return item == 'patient:configuration:editauthbyself'
    })
    const loginUserCodeList = value.filter(v => v.indexOf('loginUserCode:') >= 0)
    const loginUserCode = loginUserCodeList.length > 0 && loginUserCodeList[0].split(':')[1]
    const hasPermissions = permissions.some(item => {
      return all_permission === item || (permissionFlag.includes(item))
    })
    if (!checkAddUser && !hasPermissions) {
      try {
        el.style.display = 'none'
      } catch (error) {
        //
      }
    } else if (!checkAddUser && hasPermissions) {
      el.style.display = el.oldDisplay
    } else if (checkAddUser) {
      try {
        if (editauthbyself) {
          if (permissionFlag.length > 0 && hasPermissions || permissionFlag.length == 0) {
            el.style.display = el.oldDisplay
          } else {
            el.style.display = 'none'
          }
          el.style.display = el.oldDisplay
        } else if (!editauthbyself) { // 无修改他人数据权限的时候
          if (permissionFlag.length > 0 && hasPermissions || permissionFlag.length == 0) {
            // null是老数据新加接口取不到值
            el.style.display = loginUserCode == userName || loginUserCode == 'null' || loginUserCode == 'undefined' ? el.oldDisplay : 'none'
          } else {
            el.style.display = 'none'
          }
        } else {
          el.style.display = 'none'
        }
      } catch (error) {
        //
      }
    } else {
      el.style.display = el.oldDisplay
    }
  } else {
    throw new Error(`请设置操作权限标签值`)
  }
}
export default {
  inserted(el, binding) {
    const oldDisplay = getComputedStyle(el).display
    el.oldDisplay = oldDisplay
    checkPerm(el, binding)
  },
  componentUpdated(el, binding) {
    checkPerm(el, binding)
  }
}
