/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  // 单独设置报表路径为外部路径
  if (path.endsWith('winningReport')) {
    return true
  }
  return /^(https?:|mailto:|tel:)/.test(path)
}
// 手机校验
export function isPhoneNumber(phoneNum) {
  const reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
  return reg.test(phoneNum)
}

