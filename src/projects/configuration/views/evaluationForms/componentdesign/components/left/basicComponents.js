import { titleObj } from './components/basicComponents/title' // 标题
import { pObj } from './components/basicComponents/p' // 文本
import { textareaObj } from './components/basicComponents/textarea' // 文本
import { inputObj } from './components/basicComponents/input' // 输入框
import { radioObj } from './components/basicComponents/radio' // 单选框
import { selectObj } from './components/basicComponents/select' // 下拉框
import { checkBoxObj } from './components/basicComponents/checkBox' // 复选框
import { hrObj } from './components/basicComponents/hr' // 线条
import { datePickerObj } from './components/basicComponents/datePicker' // 时间
// import { imgObj } from './components/basicComponents/img' // 图片
const basic = {
  'wn-title': titleObj, // 标题
  'wn-p': pObj, // 文本
  'wn-textarea': textareaObj, // 文本域
  'wn-input': inputObj, // 输入框
  'wn-select': selectObj, // 下拉框
  'wn-radio': radioObj, // 单选框
  'wn-checkBox': checkBoxObj, // 复选框
  'wn-hr': hrObj, // 线条
  'wn-datePicker': datePickerObj // 时间
  // 'wn-img': imgObj // 图片
} // 左边对象数据
const basicList = []
for (const i in basic) {
  basicList.push({
    ele: i, // key值名称
    obj: basic[i] // 返回组件的对象
  })
}
export default basicList // 导出所有
