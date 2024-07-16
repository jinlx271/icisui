import Picker from '../picker'
import DatePanel from '../panel/date'
import DateRangePanel from 'element-ui/packages/date-picker/src/panel/date-range' // 这里访问nodemodules
import MonthRangePanel from 'element-ui/packages/date-picker/src/panel/month-range'

const getPanel = function(type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel
  } else if (type === 'monthrange') {
    return MonthRangePanel
  }
  return DatePanel
}

export default {
  mixins: [Picker],

  name: 'ElDatePicker',

  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean,
    isShowPickerPanel: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    type(type) {
      if (this.picker) {
        this.unmountPicker()
        this.panel = getPanel(type)
        this.mountPicker()
      } else {
        this.panel = getPanel(type)
      }
    }
  },

  created() {
    this.panel = getPanel(this.type)
  }
}
