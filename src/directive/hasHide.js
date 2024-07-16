/**
 * 操作权限处理 TH_BASIC_CONFIG_ANEST_DOC 手术流程里边配置
 */
export default {
  inserted(el, binding) {
    const { value } = binding
    if (value && globalConfig) {
      const result = Object.prototype.hasOwnProperty.call(globalConfig, value)
        ? globalConfig[value]
        : ''
      if (result) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // throw new Error(`请设置操作权限标签值`)
    }
  }
}
