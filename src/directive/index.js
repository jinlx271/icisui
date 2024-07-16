const path = require('path')
const pageComponents = require.context('@/directive', false, /.js$/)
export const components = {}
const install = function (Vue) {
  pageComponents.keys().forEach(item => {
    const name = path.basename(item, '.js')
    if (name != 'index') {
      Vue.directive(name, pageComponents(item).default)
    }
  })
}
export default install
