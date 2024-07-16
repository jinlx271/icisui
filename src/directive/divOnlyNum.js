
/**
 * 限制输入框只能输入数字 目前只能输入正数
 * 只能限制输入 如果对输入框的值做了watch v-modal必须使用number修饰符
 * max 最大值
 * min 最小值
 * digit 小数后面保存几位  默认不限制
 * max-len 整数部分最大限制 默认不限制
 *  */
const divonlyNum = {
    bind(el, binding, vnode) {
        if (binding.value === false) {
            return
        }
        const ele = el.className.indexOf('div-editable') > -1 ? el : el.querySelector('input')
        vnode.oldValue = (typeof binding.value == 'boolean' ? '' : binding.value) || ''
        // ele.value = vnode.oldValue
        el.handler = () => {
            // 获取相关的指令配置信息
            el.innerText = el.innerText.replace(/[^\d^\.]/g, '')
            // 这个函数是从vue.js源码中复制的，方便我们手动触发事件
            function trigger(el, type) {
                var e = document.createEvent('HTMLEvents')
                e.initEvent(type, true, true)
                // el.dispatchEvent(e)
            }
            trigger(el, 'input')
            function keepLastIndex(obj) {
                if (window.getSelection) { // ie11 10 9 ff safari
                    obj.focus() // 解决ff不获取焦点无法定位问题
                    const range = window.getSelection() // 创建range
                    range.selectAllChildren(obj) // range 选择obj下所有子内容
                    range.collapseToEnd() // 光标移至最后
                } else if (document.selection) { // ie10 9 8 7 6 5
                    const range = document.selection.createRange() // 创建选择对象
                    // var range = document.body.createTextRange();
                    range.moveToElementText(obj) // range定位到obj
                    range.collapse(false) // 光标移至最后
                    range.select()
                }
            }
            setTimeout(() => {
                keepLastIndex(el)
            }, 5)
        }
        ele.addEventListener('input', el.handler)
    },
    unbind(el) {
        const ele = el.className.indexOf('div-editable') > -1 ? el : el.querySelector('input')
        ele.removeEventListener('input', el.handler)
    }
}
// 只能输入整数
export default divonlyNum
