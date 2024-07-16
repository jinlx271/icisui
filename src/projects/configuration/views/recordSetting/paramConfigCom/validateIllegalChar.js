import { Message } from 'element-ui'
export const validateIllegalChar = function (e, illegalChars, ref) {
  let flag = false
  const illegalCharList = []
  illegalChars.forEach(item => {
    if (e.indexOf(item) > -1) {
      illegalCharList.push(item)
    }
  })
  if (illegalCharList.length > 0) {
    Message.warning('含有非法字符：' + illegalCharList.toString())
    flag = true
  }
  return flag
}
