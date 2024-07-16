<!-- 护理单表头设计 -->
<template>
  <div id="THeader">
  </div>
</template>

<script>
// import Spreadsheet from '../x-data-spreadsheet/index.js'
export default {
  name: 'THeader',
  components: {
  },
  data: function () {
    return {
      sheetObj: {},
      data: { 'name': 'sheet2', 'freeze': 'A1', 'styles': [{ 'font': { 'bold': true } }, { 'font': { 'bold': true }, 'align': 'center' }, { 'font': { 'bold': true, 'size': 16 }, 'align': 'center' }, { 'align': 'center' }, { 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] } }, { 'align': 'center', 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] } }, { 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] }, 'font': { 'size': 12 } }, { 'align': 'center', 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] }, 'font': { 'size': 12 } }, { 'align': 'center', 'font': { 'size': 12 } }, { 'font': { 'size': 12 } }], 'merges': ['A1:N1', 'A1', 'A2:A3', 'B2:B3', 'D2:D3', 'E2:G2', 'H2:K2', 'N2:N3', 'C2:C3'], 'rows': { '0': { 'cells': { '0': { 'text': '监护室护理记录单', 'merge': [-1, 12], 'style': 2 }, '1': { 'style': 2 }, '3': { 'style': 2 }, '4': { 'style': 2 }, '5': { 'style': 2 }, '6': { 'style': 2 }, '7': { 'style': 2 }, '8': { 'style': 2 }, '10': { 'style': 2 }, '11': { 'style': 2 }, '12': { 'style': 2 }, '13': { 'style': 2 } }, 'height': 47 }, '1': { 'cells': { '0': { 'merge': [1, 0], 'text': '日期\n       时间', 'style': 6 }, '1': { 'merge': [1, 0], 'text': '体温\n     末梢温', 'style': 6 }, '2': { 'style': 6, 'merge': [1, 0], 'text': '心率\n        脉搏' }, '3': { 'merge': [1, 0], 'text': '血压', 'style': 7 }, '4': { 'merge': [0, 2], 'text': '机械通气', 'style': 7 }, '5': { 'style': 8 }, '6': { 'style': 8 }, '7': { 'merge': [0, 3], 'text': '入量', 'style': 7 }, '8': { 'style': 8 }, '9': { 'style': 9 }, '10': { 'style': 8 }, '11': { 'text': '出量', 'style': 7 }, '12': { 'style': 7 }, '13': { 'style': 7, 'merge': [1, 0], 'text': '签名' } } }, '2': { 'cells': { '0': { 'style': 9 }, '1': { 'style': 6 }, '2': { 'style': 9 }, '3': { 'style': 8 }, '4': { 'text': '模式2', 'style': 6 }, '5': { 'text': '频率', 'style': 6 }, '6': { 'text': 'PEEP', 'style': 6 }, '7': { 'text': '项目', 'style': 6 }, '8': { 'text': '颜色', 'style': 6 }, '9': { 'text': '其他', 'style': 6 }, '10': { 'text': '量(ml)', 'style': 6 }, '11': { 'text': '项目', 'style': 6 }, '12': { 'text': '量(ml)', 'style': 6 }, '13': { 'style': 6 } } }, 'len': 95 }, 'cols': { '0': { 'width': 66 }, '1': { 'width': 77 }, '2': { 'width': 80 }, '4': { 'width': 51 }, '7': { 'width': 84 }, '12': { 'width': 83 }, 'len': 23 }, 'validations': [], 'autofilter': {} },
      options: {
        onlyPrint: {
          // w: 1800,
          // h: 700
        },
        mode: 'edit', // edit | read
        showToolbar: false,
        showGrid: false,
        showContextmenu: false,
        showBottomBar: false,
        view: {
          height: () => document.documentElement.clientHeight,
          width: () => document.documentElement.clientWidth
        },
        row: {
          len: 23,
          height: 25,
          minWidth: 10
        },
        col: {
          len: 26,
          width: 100,
          indexWidth: 60,
          minWidth: 10
        },
        style: {
          bgcolor: '#ffffff',
          align: 'left',
          valign: 'middle',
          textwrap: false,
          strike: false,
          underline: false,
          color: '#0a0a0a',
          font: {
            name: 'Helvetica',
            size: 10,
            bold: false,
            italic: false
          }
        }
      }
    }
  },
  props: {
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object
    }
  },
  watch: {
    'propStyle': {
      immediate: true,
      handler: function (newValue, oldValue) {
        let flag = false
        if (!oldValue || oldValue && newValue.height != oldValue.heigh) {
          flag = true
          this.options.onlyPrint.h = parseInt(newValue.height, 10) * 2
        }
        if (!oldValue || oldValue && newValue.width != oldValue.width) {
          flag = true
          this.options.onlyPrint.w = parseInt(newValue.width, 10) * 2
        }
        if (flag) {
          this.renderTable()
        }
      }
    }
  },
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    // 渲染表格
    renderTable() {
      document.getElementById('THeader').innerHTML = ''
    }
  }
}
</script>

<style lang="scss" scoped>
#THeader {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
</style>
