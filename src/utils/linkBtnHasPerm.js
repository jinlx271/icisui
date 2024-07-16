import store from '@/store'
/**
 * 判断这个按钮是否有权限
 * @param {String} targetUrl 目标路由
 * @returns {Boolean}  是否有权限
 */
export function linkBtnHasPerm(targetUrl) {
  const menu = store.getters.permissionsMenu
  let flag = false
  function deep(_menu) {
    for (let index = 0; index < _menu.length; index++) {
      const item = _menu[index]
      if (item.url === targetUrl) {
        flag = true
        break
      }
      if (item.children?.length) {
        deep(item.children)
        if (flag) {
          break
        }
      }
    }
  }
  deep(menu)
  return flag
}
