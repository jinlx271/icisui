/**
 * @param {*} newWidth 新宽
 * @param {*} oldWidth 旧宽
 * @param {*} column 列
 * @param {*} event
 */
export function headerdragend(newWidth, oldWidth, column, event, refs) {
  const obj = localStorage.getItem('colsWidth') ? JSON.parse(localStorage.getItem('colsWidth')) : {}
  obj[`${window.location.hash + column.property + column.label}`] = Math.max(15, newWidth)
  localStorage.setItem('colsWidth', JSON.stringify(obj))
  for (const key in refs) {
    if (Object.hasOwnProperty.call(refs, key)) {
      const element = refs[key]
      element.doLayout ? element.doLayout() : ''
    }
  }
}
/**
 * 集中录入页面表格宽度的计算保留
 * @param {*} newWidth 新宽
 * @param {*} oldWidth 旧宽
 * @param {*} column 列
 * @param {*} event
 */
export function entryHeaderRagend(newWidth, oldWidth, column, event, refs) {
  const userInfo = JSON.parse(sessionStorage.getItem('winning-ICIS-userInfo'))
  const currentUserWard = JSON.parse(sessionStorage.getItem('winning-ICIS-currentUserWard'))
  const obj = localStorage.getItem('moniitemWidth') ? JSON.parse(localStorage.getItem('moniitemWidth')) : {}
  obj[`${window.location.hash + column.property + column.label}`] = Math.max(15, newWidth)
  localStorage.setItem('moniitemWidth', JSON.stringify(obj))
  for (const key in refs) {
    if (Object.hasOwnProperty.call(refs, key)) {
      const element = refs[key]
      element.doLayout ? element.doLayout() : ''
    }
  }
  if (userInfo.userName == 'admin') { // 管理员用户保存当前宽度
    const configValue = this.$store.state.app.userPersonalizedConfig.find(item => item.configCode == '集中录入')?.configValue || {}
    configValue[currentUserWard.wardCode] = JSON.stringify(obj)
    this.$store.dispatch('userPersonalizedConfig', Object.assign({}, { configCode: '集中录入', configValue, userName: 'admin' }))
  }
}
/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */

// const baseURL = process.env.VUE_APP_BASE_API

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId, onlyMenu) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || '0'

  let cloneData = []
  // 选出C类的菜单来
  if (onlyMenu) {
    cloneData = data.filter(item => {
      return item.menutype == 'C'
    })
  } else {
    // 对源数据深度克隆
    cloneData = JSON.parse(JSON.stringify(data))
  }
  /**
   * 菜单分割说明
   * 1级菜单在顶上.
   * 2级菜单通过 isLeftMenu  字段判断是顶上还是左侧
   * 3级菜单是2级菜单的2种情况,不过都在左侧(左侧1级,和左侧2级),
   */
  const tree1 = cloneData.filter(tree1 => {
    if (!tree1.path) {
      tree1.path = tree1.url // 1级菜单路由
    }
    const tree2 = cloneData.filter(tree2 => {
      if (tree1[id] === tree2[parentId]) { // 判断是否是一级菜单的子集
        tree2.path = tree1.path + tree2.url // 2级菜单路由
        return true
      }
      const tree3 = cloneData.filter(tree3 => {
        if (tree2[id] === tree3[parentId]) { // 判断是否是二级菜单的子集
          tree3.path = tree2.path + tree3.url // 3级菜单路由
          return true
        }
      })
      tree3.length > 0 ? tree2.children = tree3 : '' // 丢给2级的子集
    })
    tree2.length > 0 ? tree1.children = tree2 : '' // 丢给1级的子集
    return tree1[parentId] === rootId // 是否第一级
  }).sort((a, b) => {
    return a.sort - b.sort
  })
  return tree1 != '' ? tree1 : data.sort((a, b) => {
    return a.sort - b.sort
  })
}

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap, parent) {
  return asyncRouterMap.filter(route => {
    const componentStr = route.component
    if (componentStr && route.menutype != 'F') {
      // if (parent) {
      //   route.path = parent + route.url
      // } else {
      //   route.path = route.url
      // }

      if (route.children != null && route.children && route.children.length) {
        const menuCount = route.children.filter(item => item.menutype != 'F')
        if (menuCount.length > 0) {
          route.redirect = route.path + route.children[0].url
          route.children = filterAsyncRouter(route.children, route.path)
        } else {
          route.children = []
        }
      }

      route.component = loadView(componentStr)
      route.meta = { id: route.id }
      return true
    }
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

