<template>
  <div class="WnScore">
    <div :style="styleCss" :ref="id" :class="id">
      <span :style="labelCss">{{ title }}</span>
      <span :class="{ 'redCss': compare }">{{ score }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WnScore',
  props: {
    rightData: {
      type: Array,
      default: () => []
    },
    obj: {
      type: Object,
      default: () => { }
    },
    id: {
      type: String,
      default: ''
    },
    sureVal: {
      type: Boolean,
      default: false
    } // 业务页面独有
  },
  data() {
    return {
      title: this.obj.title, // 输入名称
      fontSize: this.obj.fontSize, // 字体大小
      color: this.obj.color, // 字体颜色
      score: this.obj.score, // 分数
      textalign: this.obj.textalign, // 对齐方式
      itemKey: this.obj.itemKey, // 编码

      labelWidth: this.obj.labelWidth, // 组件标题宽度
      labelColor: this.obj.labelColor, // 标题字体颜色
      labelFontSize: this.obj.labelFontSize, // 标题字体大小
      isTotalScore: this.obj.isTotalScore, // 是否为最终评分
      compare: this.obj.compare, // 差异化
      htmlNumber: true
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function (obj) {
        this.title = obj.title
        this.itemKey = obj.itemKey
        this.fontSize = obj.fontSize
        this.color = obj.color
        this.score = obj.score
        this.textalign = obj.textalign

        this.labelWidth = obj.labelWidth
        this.labelFontSize = obj.labelFontSize
        this.labelColor = obj.labelColor
        this.isTotalScore = obj.isTotalScore
        this.compare = obj.compare
      }
    },
    rightData: {
      deep: true,
      immediate: true,
      handler: function (obj) {
        // 当前的评分对象
        const myData = obj.filter(res => {
          return this.itemKey === res.obj.itemKey
        })[0]
        if (myData.obj.itemKey == '' && myData.obj.isTotalScore) {
          myData.obj.isTotalScore = false
          this.$message.error('请先绑定元数据！')
          return
        }

        // 需要相加的string
        if (
          myData.obj?.rule?.calculation?.plus?.length > 0 &&
          this.obj.ruleLook
        ) {
          // 满足条件的数据
          const data = obj.filter(item => {
            return myData.obj.rule.calculation.plus.some(item2 => {
              return item2 == item.obj.itemKey && item.obj.visible && item.obj.score !== '' && item.obj.score !== null
            })
          })
          // 分数清零
          this.score = null
          let scoreNumber = 0
          // 分数相加
          data.map(item => {
            if (item.obj.score === '') {
              scoreNumber++
            }
            if (!isNaN(Number(item.obj.score))) {
              this.score = this.score * 1 + item.obj.score * 1
            }
          })
          if (scoreNumber == data.length) {
            this.score = ''
          }
          if (this.obj.score === this.score) {
            return
          }
          this.obj.score = this.score
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
                res.ele == 'wn-score' &&
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
                if (!isNaN(Number(item.obj.score))) {
                  leftVal = leftVal * 1 + item.obj.score * 1
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
                res.ele == 'wn-score' &&
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
                if (!isNaN(Number(item.obj.score))) {
                  rightVal = rightVal * 1 + item.obj.score * 1
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
          if (this.obj.score == +this.score) {
            return
          }
          this.obj.score = this.score
        } else if (myData.obj.linkageMetaData && myData.obj.linkageMetaData.length > 0 && myData.obj.valueObj) {
          this.$emit('getDataSources', (data) => {
            const sourceArr = []
            myData.obj.dataSources.map((item) => {
              sourceArr.push(item.sourceCode)
            })
            // 映射数据
            let valString = ''
            sourceArr.map((item) => {
              if (((myData.obj.valueObj[item] ?? '') + '') != '') {
                valString = myData.obj.valueObj[item]
              }
            })
            this.obj.score = valString
            return
          })
          // 元数据 数据源选项
          const sourceArr = []
          myData.obj.dataSources.map((item) => {
            sourceArr.push(item.sourceCode)
          })
          // 映射数据
          let valString = ''
          sourceArr.map((item) => {
            if (((myData.obj.valueObj[item] ?? '') + '') != '') {
              valString = myData.obj.valueObj[item]
            }
          })
          this.obj.score = valString
        }
      }
    }
  },
  computed: {
    /**
     *  头部宽度计算
     */
    styleCss() {
      return {
        textAlign: this.textalign
      }
    },
    /**
     * 标题样式
     */
    labelCss() {
      return {
        width: this.labelWidth + 'px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        fontSize: this.labelFontSize + 'px',
        color: this.labelColor
      }
    }
  },
  created() { },
  mounted() { },
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
            res.ele == 'wn-score' &&
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
          if (!isNaN(Number(item.obj.score))) {
            leftVal = leftVal * 1 + item.obj.score * 1
          }
        })
      }
      // 计算右边表达式
      if (myData.obj.rule.calculation.plus2 == '') {
        rightVal = myData.obj.rule.calculation.plus2Name
      } else {
        const rightScoreList = obj.filter(res => {
          return (
            res.ele == 'wn-score' &&
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
          if (!isNaN(Number(item.obj.score))) {
            rightVal = rightVal * 1 + item.obj.score * 1
          }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.WnScore {
  // display: flex;
}
</style>
