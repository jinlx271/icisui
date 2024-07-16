import WnDatePicker from './WnDatePicker/src/picker/date-picker'
import WnTimePicker from './WnTimePicker/src/picker/time-picker'
import WnPagination from './pagination/src/pagination'
import Select from './select/select'
import Option from './select/option'

const path = require('path')
const pageComponents = require.context('@/components', false, /.vue$/)
export const components = {}
const install = function (Vue) {
  pageComponents.keys().forEach(item => {
    const name = path.basename(item, '.vue')
    Vue.component(name, pageComponents(item).default)
  })
  Vue.component('WnDatePicker', WnDatePicker)
  Vue.component('WnTimePicker', WnTimePicker)
  Vue.component('WnPagination', WnPagination)
  Vue.component(Select.name, Select)
  Vue.component(Option.name, Option)
}
export default install
