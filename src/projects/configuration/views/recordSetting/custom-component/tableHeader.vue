<!-- 表头设计 -->
<template>
  <div id="indexPrint">
  </div>
</template>

<script>
// import Spreadsheet from '../x-data-spreadsheet/index.js'
export default {
  name: 'TableHeader',
  components: {
  },
  data: function () {
    return {
      sheetObj: {},
      data: {
        'name': 'sheet2',
        'freeze': 'A1',
        'styles': [{ 'font': { 'bold': true } }, { 'font': { 'bold': true }, 'align': 'center' }, { 'font': { 'bold': true, 'size': 16 }, 'align': 'center' }, { 'align': 'center' }, { 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] } }, { 'align': 'center', 'border': { 'bottom': ['thin', '#000'], 'top': ['thin', '#000'], 'left': ['thin', '#000'], 'right': ['thin', '#000'] } }], 'merges': ['A1:O1', 'A1', 'A2:A3', 'B2:B3', 'D2:D3', 'E2:G2', 'H2:K2', 'N2:N3', 'C2:C3'],
        'rows': {
          '0': {
            'cells': {
              '0': { 'text': '监护室护理记录单', 'merge': [-1, 13], 'style': 2 },
              '1': { 'style': 2 },
              '3': { 'style': 2 },
              '4': { 'style': 2 },
              '5': { 'style': 2 },
              '6': { 'style': 2 },
              '7': { 'style': 2 },
              '8': { 'style': 2 },
              '10': { 'style': 2 },
              '11': { 'style': 2 },
              '12': { 'style': 2 },
              '13': { 'style': 2 }
            },
            'height': 47
          },
          '1': {
            'cells': {
              '0': { 'merge': [1, 0], 'text': '日期\n            时间', 'style': 4 },
              '1': { 'merge': [1, 0], 'text': '体温\n            末梢温', 'style': 4 },
              '2': { 'style': 4, 'merge': [1, 0], 'text': '心率\n                脉搏' },
              '3': { 'merge': [1, 0], 'text': '血压', 'style': 5 },
              '4': { 'merge': [0, 2], 'text': '机械通气', 'style': 5 },
              '5': { 'style': 3 },
              '6': { 'style': 3 },
              '7': { 'merge': [0, 3], 'text': '入量', 'style': 5 },
              '8': { 'style': 3 },
              '10': { 'style': 3 },
              '11': { 'text': '出量', 'style': 5 },
              '12': { 'style': 5 },
              '13': { 'style': 5, 'merge': [1, 0], 'text': '签名' }
            }
          },
          '2': {
            'cells': {
              '1': { 'style': 4 },
              '3': { 'style': 3 },
              '4': { 'text': '模式', 'style': 4 },
              '5': { 'text': '频率', 'style': 4 },
              '6': { 'text': 'PEEP', 'style': 4 },
              '7': { 'text': '项目', 'style': 4 },
              '8': { 'text': '颜色', 'style': 4 },
              '9': { 'text': '其他', 'style': 4 },
              '10': { 'text': '量(ml)', 'style': 4 },
              '11': { 'text': '项目', 'style': 4 },
              '12': { 'text': '量(ml)', 'style': 4 },
              '13': { 'style': 4 }
            }
          },
          'len': 95
        }, 'cols': { 'len': 28 }, 'validations': [], 'autofilter': {}
      },
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
  props: {},
  watch: {},
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    // 渲染表格
    renderTable() {

      // this.sheetObj.loadData(this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
#indexPrint {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
</style>
