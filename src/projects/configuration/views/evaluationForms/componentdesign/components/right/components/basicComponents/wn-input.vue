<template>
  <div class="Wninput" :style="inputlCss">
    <span class="head" :style="labelCss">{{ title }}</span>
    <el-input :class="{ redCss: compare }" v-if="!multiline" @change.native="inputChange" :ref="id" v-model="value" :placeholder="placeholder" :maxlength="maxlength" :disabled="!saveOrUpdate||(obj.isTotalScore)" :readonly="!isItemKey"  :type="valueTypeDictCode=='1'?'number':''" />
    <el-input :class="{ redCss: compare }" v-else type="textarea" :rows="rows" @change.native="inputChange" :ref="id" v-model="value" :placeholder="placeholder" :maxlength="maxlength" :disabled="!saveOrUpdate||obj.isTotalScore"
:readonly="!isItemKey" />
  </div>
</template>

<script>
import { filterArrValue } from '../../../../../../../../utils/utils'
export default {
  name: 'Wninput',
  props: {
    rightData: { // 输入类型也有对应相关联的数据
      type: Array,
      default: () => []
    },
    obj: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    },
    saveOrUpdate: {
      type: Boolean,
      default: true
    }, // 新增/修改
    edit: {
      type: Boolean,
      default: false
    } // 业务是true ,配置管理是false
  },
  data() {
    return {
      itemKey: this.obj.itemKey, // 编码
      valueTypeDictCode: this.obj.valueTypeDictCode,
      title: this.obj.title, // 输入名称
      value: this.obj.val, // 重新定义不然会报错
      placeholder: this.obj.placeholder, // 控件备注
      maxlength: this.obj.maxlength, // 最大输入长度
      fontSize: this.obj.fontSize, // 组件字体大小
      color: this.obj.color, // 组件字体颜色
      allBorder: this.obj.allBorder, // 边框 全包 半包
      labelBr: this.obj.labelBr, // 标题是否换行
      labelBottom: this.obj.labelBottom, // 标题下边高度
      labelWidth: this.obj.labelWidth, // 组件标题宽度
      labelFontSize: this.obj.labelFontSize, // 标题字体大小
      labelColor: this.obj.labelColor, // 标题字体颜色

      moveInput: this.obj.moveInput, // 移动input
      verticalMove: this.obj.verticalMove, // 上下移
      levelMove: this.obj.levelMove, // 左右移
      clickFlag: true, // 是否配置参数。用户点击不用改
      multiline: this.obj.multiline, // 多行切换
      rows: this.obj.rows, // 组件可见行数
      compare: this.obj.compare, // 差异化
      isItemKey: this.obj.isItemKey, // 是否能修改
      score: null
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function (obj) {
        this.title = obj.title
        let valString = ''
        let dataUpdate = false
        if (this.clickFlag) {
          if (this.saveOrUpdate && obj.valueArray && obj.valueArray.length > 0 && obj.dataSources && obj.dataSources.length > 0) {
            // 元数据 数据源选项
            const sourceArr = []
            obj.dataSources.map((item) => {
              sourceArr.push(item.sourceCode)
            })
            // 映射数据
            const keyList = Object.keys(obj.valueObj)
            sourceArr.map((item) => {
              // 判断一下返回的数据中是否有该项目
              if (keyList.includes(item)) { // 存在该项目
                if (((obj.valueObj[item] ?? '') + '') != '') {
                  valString += obj.valueObj[item]
                  dataUpdate = true
                }
              } else {
                if (((obj.valueObj[item] ?? '') + '') != '') {
                  valString += obj.valueObj[item] || ''
                }
              }
            })
          }
        }
        this.clickFlag = true
        if (dataUpdate) {
          // 这里是后台返回了值
          this.value = valString
          // this.obj.val = valString
        } else {
          if (this.obj.val) {
            this.value = this.obj.val
          } else if (valString) {
            this.value = valString
            if (!this.obj.val) this.obj.val = valString
          }
        }

        this.placeholder = obj.placeholder
        this.maxlength = obj.maxlength
        this.fontSize = obj.fontSize
        this.color = obj.color
        this.allBorder = obj.allBorder

        this.labelWidth = obj.labelWidth
        this.labelFontSize = obj.labelFontSize
        this.labelColor = obj.labelColor
        this.labelBr = obj.labelBr
        this.labelBottom = obj.labelBottom
        this.moveInput = obj.moveInput
        this.verticalMove = obj.verticalMove
        this.levelMove = obj.levelMove
        this.multiline = obj.multiline
        this.rows = obj.rows
        this.compare = obj.compare
        this.isItemKey = obj.isItemKey
        this.valueTypeDictCode = obj.valueTypeDictCode
        if (this.isItemKey === undefined) {
          this.isItemKey = true
        }
        if (!this.edit) {
          this.$emit('componentStyleCss', this.id, this.moveInput, this.verticalMove, this.levelMove)
        }
        this.$nextTick(() => {
          // input 元素
          const inputEle = this.$refs[this.id].$el.getElementsByClassName('el-input__inner')[0]?.style || this.$refs[this.id].$el.getElementsByClassName('el-textarea__inner')[0]?.style
          inputEle.fontSize = this.fontSize + 'px' // 字体大小
          inputEle.color = this.color // 颜色
          // 下边框切换
          if (!this.allBorder) {
            inputEle.border = 'none'
            inputEle.borderBottom = '1px solid #c0c4cc'
            inputEle.borderRadius = 0
          } else {
            inputEle.border = '1px solid #c0c4cc'
            inputEle.borderRadius = '4px'
          }
          // placeholder 颜色修改
          this.loadStyleString(
            `.${this.id} .el-input__inner{height:${this.fontSize * (32 / 13)}px !important;}
          .${this.id} .el-input__inner::-webkit-input-placeholder{color:${this.color};}
          .${this.id} .el-input__inner::-moz-input-placeholder{color:${this.color};}
          .${this.id} .el-input__inner::-ms-input-placeholder{color:${this.color};}`
          )
        })
      }
},
    /** 相关联的数据发生变化后 需要更新数值 */
    rightData: {
      deep: true,
      immediate: true,
      handler: function (obj) {
        // 当前的评分对象
        const myData = obj.filter(res => {
          return this.itemKey === res.obj.itemKey
        })[0]

        if (
          myData.obj?.rule?.calculation?.plus?.length > 0 &&
          this.obj.ruleLook
        ) {
          // 满足条件的数据
          const data = obj.filter(item => {
            return myData.obj.rule.calculation.plus.some(item2 => {
              return item2 == item.obj.itemKey && item.obj.visible && (item.obj.val !== '' || item.obj.score !== '') && (item.obj.val !== null || item.obj.score !== null)
            })
          })
          // 分数清零
          this.score = null
          if (this.obj?.valueTypeDictCode == '1') { // 值类型
            let scoreNumber = 0
            // 分数相加
            data.map(item => {
              if (item.obj.val === '') {
                scoreNumber++
              }
              if (!isNaN(Number(item.obj.val))) {
                this.score = this.score * 1 + item.obj.val * 1
              }
            })
            if (scoreNumber == data.length) {
              this.score = ''
            }
            if (this.obj.val === this.score) {
              return
            }
          } else { // 文本型
            let scoreNumber = 0
            // 分数相加
            this.score = '' // 用来记录数值性分数
            let textScore = '' // 文本性结果
            const scoreList = []
            let totalScore = '' // 用来记录该评估单中的数值
            data.map(item => {
              if (item.obj.val === '') {
                scoreNumber++
              }
              if (!!item.obj.isTotalScore && item.ele == 'wn-score') {
                totalScore = item.obj.score // 获取总分
              } else {
                if (this.obj.resultRule == '1' || this.obj.resultRule == '3') { // 非最终结果类元数据简称及值拼接
                  scoreList.push((item.obj.itemAbbr || item.obj.itemName) + (item.obj.score || ''))
                } else if (this.obj.resultRule == '2' && item.obj.conditionity == '1') { // 条件元数据值+数值型最终评估结果值拼接
                  if (item.obj.options.length > 0) {
                    let text = ''
                    if (filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'itemText')) {
                      text = filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'itemText')
                    } else if (filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'itemScore')) {
                      text = filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'itemScore') + '分'
                    } else if (filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'dictName')) {
                      text = filterArrValue(item.obj.val, item.obj.options, 'dictCode', 'dictName')
                    }
                    scoreList.push(text)
                  }
                }
                if (!isNaN(Number(item.obj.score))) {
                  totalScore = totalScore * 1 + item.obj.score * 1
                }
              }
            })
            // 最终结果的 显示
            if (this.obj.isTotalScore) {
              if (this.obj.resultRule == '1') {
                textScore = scoreList.join(' ')
              } else if (this.obj.resultRule == '2') {
                textScore = scoreList.join(' ') + ' ' + totalScore
              } else if (this.obj.resultRule == '3') {
                textScore = totalScore + '=' + scoreList.join('+')
              }
              this.score = textScore
            } else {
              this.score = totalScore
            }

            if (scoreNumber == data.length) {
              this.score = ''
            }
            if (this.obj.val === this.score) {
              return
            }
            this.obj.score = totalScore
          }

          this.obj.val = this.score
          this.value = this.score
        } else if (
          myData.obj?.rule?.calculation?.expression &&
          this.obj.ruleLook
        ) {
          let leftVal = 0
          let rightVal = 0
          // 计算左边表达式
          if (myData.obj.rule.calculation.plus1 == '') {
            leftVal = myData.obj.rule.calculation.plus1Name
          } else {
            const leftScoreList = obj.filter(res => {
              return (
                res.ele == 'wn-input' && res.obj?.valueTypeDictCode == '1' &&
                res.obj.itemKey == myData.obj.rule.calculation.plus1
              )
            })[0]
            // 满足条件的数据
            if (leftScoreList.obj.rule.calculation.plus) {
              // 满足条件的数据
              const leftData = obj.filter(item => {
                return leftScoreList.obj.rule.calculation.plus.some(item2 => {
                  return item2 == item.obj.itemKey && item.obj.visible
                })
              })
              // 分数相加
              leftData.map(item => {
                if (!isNaN(Number(item.obj.val))) {
                  leftVal = leftVal * 1 + item.obj.val * 1
                }
              })
            } else {
              // 特殊递归
              leftVal = this.recursion(obj, leftScoreList)
            }
          }
          // 计算右边表达式
          if (myData.obj.rule.calculation.plus2 == '') {
            rightVal = myData.obj.rule.calculation.plus2Name
          } else {
            const rightScoreList = obj.filter(res => {
              return (
                res.ele == 'wn-input' && res.obj?.valueTypeDictCode == '1' &&
                res.obj.itemKey == myData.obj.rule.calculation.plus2
              )
            })[0]
            // 满足条件的数据
            if (rightScoreList.obj.rule.calculation.plus) {
              // 普通二层
              const rightData = obj.filter(item => {
                return rightScoreList.obj.rule.calculation.plus.some(item2 => {
                  return item2 == item.obj.itemKey && item.obj.visible
                })
              })
              // 分数相加
              rightData.map(item => {
                if (!isNaN(Number(item.obj.val))) {
                  rightVal = rightVal * 1 + item.obj.val * 1
                }
              })
            } else {
              // 特殊递归
              rightVal = this.recursion(obj, rightScoreList)
            }
          }
          if (myData.obj.rule.calculation.plus1 == '' && rightVal == 0) {
            leftVal = 0
          } else if (myData.obj.rule.calculation.plus2 == '' && leftVal == 0) {
            rightVal = 0
          }
          const expressionCode =
            leftVal + myData.obj?.rule?.calculation.expression + rightVal
          const expressionFc = new Function(`return ${expressionCode}`)
          this.score = 0
          this.score =
            expressionFc() == 'Infinity' ? 0 : expressionFc().toFixed(0)
          this.score = isNaN(this.score) ? 0 : this.score
          if (this.obj.val == +this.score) {
            return
          }
          this.obj.val = this.score
          this.value = this.score
        } else if (myData.obj.linkageMetaData && myData.obj.linkageMetaData.length > 0) {
         // 联动数据
          this.$emit('getDataSources', (data) => {
            const sourceArr = []
            myData.obj.dataSources.map((item) => {
              sourceArr.push(item.sourceCode)
            })
            // 映射数据
            // let valString = ''
            const keyList = Object.keys(myData.obj.valueObj)
            sourceArr.map((item) => {
              if (keyList.includes(item)) { // 存在该项目
                valString = myData.obj.valueObj[item]
              } else if (((myData.obj.valueObj[item] ?? '') + '') != '') {
                valString = myData.obj.valueObj[item]
              }
            })
            this.obj.val = valString
            return
          })
          // 元数据 数据源选项
          const sourceArr = []
          myData.obj.dataSources.map((item) => {
            sourceArr.push(item.sourceCode)
          })
          // 映射数据
          let valString = ''
          const keyList = Object.keys(myData.obj.valueObj)
            sourceArr.map((item) => {
              if (keyList.includes(item)) { // 存在该项目
                valString = myData.obj.valueObj[item]
              } else if (((myData.obj.valueObj[item] ?? '') + '') != '') {
              valString = myData.obj.valueObj[item]
            }
          })
          this.obj.val = valString
        }
      }
    }
  },
  created() {
    if (this.edit) {
      return
    }

    this.$emit('componentStyleCss', this.id, this.moveInput, this.verticalMove, this.levelMove)
  },
  computed: {
    /**
     * 标题样式
     */
    labelCss() {
      return {
        width: this.labelWidth + 'px',
        whiteSpace: 'nowrap',
        'font-size': this.labelFontSize + 'px',
        color: this.labelColor,
        marginBottom: this.labelBottom + 'px'
      }
    },
    /**
     * input样式
     */
    inputlCss() {
      const inputData = {}
      if (this.labelBr) {
        inputData.flexDirection = 'column'
      }
      if (!this.edit) {
        // 业务是true ,配置管理是false
        return inputData
      }
      if (this.moveInput) {
        Object.assign(inputData, {
          position: 'absolute',
          top: this.verticalMove + 'px',
          left: this.levelMove + 'px'
        })
      } else {
        Object.assign(inputData, { position: 'relative', top: 0, left: 0 })
      }
      return inputData
    }
  },
  mounted() {},
  methods: {
/**
     * 递归
     * obj 所有元数据
     * myData 当前评分的元数据
     * type 返回的data是那个
     */
    recursion(obj, myData, type) {
      let leftVal = 0
      let rightVal = 0
      // 计算左边表达式
      if (myData.obj.rule.calculation.plus1 == '') {
        leftVal = myData.obj.rule.calculation.plus1Name
      } else {
        const leftScoreList = obj.filter(res => {
          return (
            res.ele == 'wn-input' && res.obj.valueTypeDictCode == '1' &&
            res.obj.itemKey == myData.obj.rule.calculation.plus1
          )
        })[0]
        let leftData = []
        if (leftScoreList.obj.rule.calculation.plus) {
          // 满足条件的数据
          leftData = obj.filter(item => {
            return leftScoreList.obj.rule.calculation.plus.some(item2 => {
              return item2 == item.obj.itemKey && item.obj.visible
            })
          })
        } else {
          // 特殊递归
          leftData = this.recursion(obj, leftScoreList)
        }
        // 分数相加
        leftData.map(item => {
          if (!isNaN(Number(item.obj.val))) {
            leftVal = leftVal * 1 + item.obj.val * 1
          }
        })
      }
      // 计算右边表达式
      if (myData.obj.rule.calculation.plus2 == '') {
        rightVal = myData.obj.rule.calculation.plus2Name
      } else {
        const rightScoreList = obj.filter(res => {
          return (
            res.ele == 'wn-input' && res.obj?.valueTypeDictCode == '1' &&
            res.obj.itemKey == myData.obj.rule.calculation.plus2
          )
        })[0]
        // 满足条件的数据
        let rightData = []
        if (rightScoreList.obj.rule.calculation.plus) {
          // 普通二层
          rightData = obj.filter(item => {
            return rightScoreList.obj.rule.calculation.plus.some(item2 => {
              return item2 == item.obj.itemKey && item.obj.visible
            })
          })
        } else {
          // 特殊递归
          rightData = this.recursion(obj, rightScoreList)
        }
        // 分数相加
        rightData.map(item => {
          rightVal = rightVal * 1 + item.obj.val * 1
        })
      }
      if (myData.obj.rule.calculation.plus1 == '' && rightVal == 0) {
        leftVal = 0
      } else if (myData.obj.rule.calculation.plus2 == '' && leftVal == 0) {
        rightVal = 0
      }
      const expressionCode =
        leftVal + myData.obj?.rule?.calculation.expression + rightVal
      const expressionFc = new Function(`return ${expressionCode}`)
      let score = 0
      score = expressionFc() == 'Infinity' ? 0 : expressionFc().toFixed(0)
      score = isNaN(score) ? 0 : score
      return score
    },
    /**
     * 动态添加css 改变组件样式
     * 字体大小 颜色
     */
    loadStyleString(css) {
      const style = document.createElement('style')
      style.type = 'text/css'
      try {
        style.appendChild(document.createTextNode(css))
      } catch (ex) {
        style.styleSheet.cssText = css
      }
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(style)
    },
    /**
     * 修改值不保存,需要弄一个修改方法
     */
    inputChange() {
      this.obj.val = this.value // 值
      if (this.value == '') {
        this.obj.val = null
      }
      this.clickFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
.Wninput {
  display: flex;
  .head {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .colorFC {
    color: #f7594b;
  }
  ::v-deep .el-textarea__inner {
    resize: none;
  }
  .redCss {
    color: red;
    ::v-deep.el-input__inner {
      color: red !important;
    }
    ::v-deep.el-textarea__inner {
      color: red !important;
    }
  }
}
</style>
