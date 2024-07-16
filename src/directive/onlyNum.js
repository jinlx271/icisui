import { feeDisplay } from '@/filters/index'
/**
 * [setValueWithExpressionVue 更新数据模型]
 * @param {Boolean} toString    [是否转化为字符串]
 * @param {[type]}  currObj    [当前的数据模型]
 * @param {[type]}  expression [指令表达式]
 * @param {[type]}  value      [指令的值]
 * @param {[type]}  key        [用于批量渲染时的跟踪键]
 * @param {[type]}  arg        [指令的参数]
 */
function setValueWithExpressionVue(option = {}) {
  const expression = option.expression?.split('.')
  if (!expression) {
    return
  }
  expression.forEach((item, i) => {
    if (i < expression.length - 1) {
      option.currObj = option.currObj[item]
    } else {
      if (option.key !== undefined && option.currObj[item]) {
        if (option.currObj[item][option.key]) {
          option.currObj[item][option.key][option.arg] = (option.value === '' || option.toString) ? option.value : option.value * 1
        }
      } else {
        option.currObj[item] = (option.value === '' || option.toString) ? option.value : option.value * 1
      }
    }
  })
}
/**
 * [handleInput 在输入阶段的处理逻辑]
 * @param  {[DOM]} ele   [当前指令操作的dom对象]
 * @param  {[虚拟节点]} vnode [当前指令渲染的虚拟节点]
 * @param  {[指令信息]} rel   [当前指令的所有指令信息]
 * @param  {[校验类型]} type  [输入阶段的校验类型]
 *      "number": 仅支持输入数字
 */
function handleInput(ele, vnode, rel) {
  let rule
  // switch (true) {
  //   case rel.modifiers.float: // 浮点型
  //     rule = /[^\d\.]/g
  //     break
  //   default: // 默认仅支持输入数字
  //     rule = /\D/g
  // }
  let val = ele.value
  const maxLen = vnode.data.attrs && vnode.data.attrs['max-len'] ? vnode.data.attrs['max-len'] : 0
  const digit = vnode.data.attrs && typeof vnode.data.attrs['digit'] !== 'undefined' ? vnode.data.attrs['digit'] : ''
  const min = vnode.data.attrs && typeof vnode.data.attrs['min'] !== 'undefined' ? vnode.data.attrs['min'] : ''
  const max = vnode.data.attrs && typeof vnode.data.attrs['max'] !== 'undefined' ? vnode.data.attrs['max'] : ''
  if (maxLen > 0) {
    if (digit > 0) {
      rule = new RegExp(`^\\d{1,${maxLen}}(\\.\\d{0,${digit}})?$`, 'g')
    } else if (digit === 0) {
      rule = new RegExp(`^\\d{1,${maxLen}}$`, 'g')
    } else {
      rule = new RegExp(`^\\d{1,${maxLen}}(\\.\\d*)?$`, 'g')
    }
  } else {
    if (digit > 0) {
      rule = new RegExp(`^\\d{1,}(\\.\\d{0,${digit}})?$`, 'g')
    } else if (digit === 0) {
      rule = /^\d{1,}$/g
    } else {
      rule = /^\d{1,}(\.\d*)?$/g
    }
  }
  if (val.match(rule) || val === '') {
    if (min && val < min) {
      if (val !== '') {
        val = min
      }
    }
    if (max && val > max) {
      val = max
    }
    vnode.oldValue = (val && digit !== '') ? feeDisplay(val, digit) : val
  } else {
    val = (vnode.oldValue && digit !== '') ? feeDisplay(vnode.oldValue, digit) : vnode.oldValue || ''
  }
  ele.value = val
  // rel.value = val
  vnode.data?.model?.callback(val)
  // vnode.elm.dispatchEvent(new CustomEvent('input'))

  setValueWithExpressionVue({
    currObj: vnode.context.$data,
    expression: rel.expression,
    value: val,
    key: vnode.key,
    arg: rel.arg,
    toString: rel?.modifiers?.string || rel?.modifiers?.float
  })
}
/**
 * [handleBlur 在失焦处理逻辑]
 * @param  {[DOM]} ele   [当前指令操作的dom对象]
 * @param  {[虚拟节点]} vnode [当前指令渲染的虚拟节点]
 * @param  {[指令信息]} rel   [当前指令的所有指令信息]
 * @param  {[校验类型]} type  [输入阶段的校验类型]
 *      "number": 仅支持输入数字
 */
function handleBlur(ele, vnode, rel) {
  let val = ele.value
  if (val !== '') {
    val = +val
  }
  ele.value = val
  // rel.value = val
  vnode.data?.model?.callback(val)
  // vnode.elm.dispatchEvent(new CustomEvent('input'))

  setValueWithExpressionVue({
    currObj: vnode.context.$data,
    expression: rel.expression,
    value: val,
    key: vnode.key,
    arg: rel.arg,
    toString: rel?.modifiers?.string || rel?.modifiers?.float
  })
}
/**
 * 限制输入框只能输入数字 目前只能输入正数
 * 只能限制输入 如果对输入框的值做了watch v-modal必须使用number修饰符
 * max 最大值
 * min 最小值
 * digit 小数后面保存几位  默认不限制
 * max-len 整数部分最大限制 默认不限制
 *  */
const onlyNum = {
  bind(el, binding, vnode) {
    if (binding.value === false) {
      return
    }
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    vnode.oldValue = (typeof binding.value == 'boolean' ? '' : binding.value) || ''
    ele.value = vnode.oldValue
    el.handlerInput = () => {
      // 获取相关的指令配置信息
      const rel = vnode.data.directives.filter(item => {
        return item.name === 'only-num'
      })[0]
      if (binding.value === true) {
        rel.expression = ''
      }
      handleInput(ele, vnode, el)
    }
    el.handlerBlur = () => {
      // 获取相关的指令配置信息
      const rel = vnode.data.directives.filter(item => {
        return item.name === 'only-num'
      })[0]
      if (binding.value === true) {
        rel.expression = ''
      }
      handleBlur(ele, vnode, el)
    }
    ele.addEventListener('input', el.handlerInput)
    ele.addEventListener('blur', el.handlerBlur)
  },
  unbind(el) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.removeEventListener('input', el.handler)
  }
}
// 只能输入整数
export default onlyNum
