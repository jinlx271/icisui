import store from '@/store'
/**
 * 判断这个按钮是否有权限
 * @param {String} btnPermissionIds 按钮权限标志
 * @returns {Boolean}  是否有权限
 */
export function btnHasPerm(btnPermissionIds) {
  const all_permission = '*:*:*'
  const permissions = store.getters.permissionsBtn
  const hasPermissions = permissions.some(item => {
    return all_permission === item || (btnPermissionIds.includes(item))
  })
  return hasPermissions
}
