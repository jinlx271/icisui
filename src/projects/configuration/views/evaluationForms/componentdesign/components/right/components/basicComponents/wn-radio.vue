<template>
  <div class="WnRadio" :style="styleCss">
    <!-- 标题 -->
    <div class="head" :style="styleHead">
      <i :style="iCss" v-if="iShow"></i>
      <span :style="labelCss">
        {{title}}
        <span v-if="itemScore">{{score}}</span>
      </span>
    </div>
    <!-- 主体 -->
    <el-radio-group :style="radioGroupCss" @change="radioFc" class="radioGroup" size="mini" v-model="value">
      <el-radio
        @click.native.prevent="cancelradioFc(item.dictCode)"
        v-for="item in options"
        :key="item.dictCode"
        :label="item.dictCode"
        :value="item.dictCode"
        border
        :ref="id"
        :class="id"
        :disabled="!saveOrUpdate"
      >
        <el-tooltip v-if="item.itemDesc" class="item" effect="dark" :content="item.itemDesc" placement="top" :open-delay="500">
          <div :class="{'redCss':item.compare,'pWidth':item.positionCode!='1'&&item.positionCode!='2','pBlock':item.positionCode&&(item.positionCode=='1'||item.positionCode=='2')}">
            <template v-if="item.positionCode=='3'">
              <!-- 前 -->
              <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
              <div class='flex'>
                {{item.dictName}}
                <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
                <span v-if="item.itemText">({{item.itemText}})</span>
              </div>
            </template>
            <template v-else-if="item.positionCode=='1'">
            <!-- 上 -->
              <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
              <div class='flex'>
                {{item.dictName}}
                <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
                <span v-if="item.itemText">({{item.itemText}})</span>
              </div>
            </template>
            <template v-else-if="item.positionCode=='2'">
            <!-- 下 -->
              <div class='flex'>
                {{item.dictName}}
                <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
                <span v-if="item.itemText">({{item.itemText}})</span>
              </div>
              <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
            </template>
            <template v-else>
                {{item.dictName}}
                <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
                <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
                <span v-if="item.itemText">({{item.itemText}})</span>
            </template>
          </div>
        </el-tooltip>
        <div v-else :class="{'redCss':item.compare,'pWidth':item.positionCode!='1'&&item.positionCode!='2','pBlock':item.positionCode&&(item.positionCode=='1'||item.positionCode=='2')}">
          <template v-if="item.positionCode=='3'">
            <!-- 前 -->
            <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
            <div class='flex'>
              {{item.dictName}}
              <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
              <span v-if="item.itemText">({{item.itemText}})</span>
            </div>
          </template>
          <template v-else-if="item.positionCode=='1'">
           <!-- 上 -->
            <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
            <div class='flex'>
              {{item.dictName}}
              <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
              <span v-if="item.itemText">({{item.itemText}})</span>
            </div>
          </template>
           <template v-else-if="item.positionCode=='2'">
           <!-- 下 -->
            <div class='flex'>
              {{item.dictName}}
              <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
              <span v-if="item.itemText">({{item.itemText}})</span>
            </div>
            <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
          </template>
          <template v-else>
              {{item.dictName}}
              <img v-if="item.imageUrl" class="imgCss" :src="uploaApi + item.imageUrl" :style="{zoom:item.scale}"/>
              <span v-if="item.itemScore && itemScore">({{item.itemScore}}分)</span>
              <span v-if="item.itemText">({{item.itemText}})</span>
          </template>
        </div>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'WnRadio',
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    },
    sureVal: {
      type: Boolean,
      default: false
    }, // 业务页面独有
    saveOrUpdate: {
      type: Boolean,
      default: true
    }, // 新增/修改
    rightData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: this.obj.title, // 输入名称
      value: this.obj.val, // 重新定义不然会报错
      fontSize: this.obj.fontSize, // 字体大小
      color: this.obj.color, // 字体颜色
      itemScore: this.obj.itemScore, // 是否显示分数
      score: this.obj.score, // 分数

      labelWidth: this.obj.labelWidth, // 组件标题宽度
      labelColor: this.obj.labelColor, // 标题字体颜色
      labelFontSize: this.obj.labelFontSize, // 标题字体大小
      labelBr: this.obj.labelBr, // 标题是否换行
      labelBottom: this.obj.labelBottom, // 标题下边高度

      iWidth: this.obj.iWidth, // i标签宽度
      iHeight: this.obj.iHeight, // i标签高度
      iColor: this.obj.iColor, // i标签颜色
      iShow: this.obj.iShow, // i标签显示隐藏

      options: this.obj.options, // option List

      selectLineFeed: this.obj.selectLineFeed, // 选项换行
      selectFull: this.obj.selectFull, // 选项是否满屏
      selectBorder: this.obj.selectBorder, // 选项外包围
      valueFlag: false,
      uploaApi:
        process.env.NODE_ENV === 'production'
          ? globalConfig.PRO_BASE_API || './'
          : globalConfig.BASE_API,
      clickFlag: true // 是否配置参数。用户点击不用改
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        if (obj.val === '') {
          // 初始化赋值
          this.value = obj.val
        } else if (this.sureVal) {
          // 业务页面 可以去修改
          this.value = this.valueFlag ? '' : obj.val // valueFlag 取消
        }
        if (this.clickFlag) {
          // dataSources 有配置规则
          this.configFc(obj)
        }
        this.clickFlag = true

        this.title = obj.title
        this.fontSize = obj.fontSize
        this.color = obj.color
        this.itemScore = obj.itemScore
        this.score = obj.score

        this.labelWidth = obj.labelWidth
        this.labelFontSize = obj.labelFontSize
        this.labelColor = obj.labelColor
        this.labelBr = obj.labelBr
        this.labelBottom = obj.labelBottom

        this.iWidth = obj.iWidth
        this.iHeight = obj.iHeight
        this.iColor = obj.iColor
        this.iShow = obj.iShow
        this.options = obj.options

        this.selectLineFeed = obj.selectLineFeed
        this.selectFull = obj.selectFull
        this.selectBorder = obj.selectBorder
        this.$nextTick(() => {
          // 修改组件font-size
          const el = this.$refs[this.id]
          el.map((item, index) => {
            if (!this.selectBorder) {
              item.$el.style.border = 'none'
            } else {
              item.$el.style.border = '1px solid #C0C4CC'
            }
            const frame = item.$el.getElementsByClassName('el-radio__inner')[0]
            const name = item.$el.getElementsByClassName('el-radio__label')[0]
            // 整体外边框大小
            item.$el.style.fontSize = this.fontSize + 'px' // 整体大小
            // 选择框大小
            frame.style.width = this.fontSize + 'px'
            frame.style.height = this.fontSize + 'px'
            // 修改 字体大小 颜色
            name.style.fontSize = this.fontSize + 'px'
            name.style.color = this.color
            // 选择框勾上的大小
            // const allCss = this.fontSize / 12 // 变化宽度计算
            // this.loadStyleString(
            //   `.${this.id} .el-radio__inner::after{width:${2 *
            //     allCss}px !important;height:${6 * allCss}px !important;top:${1 *
            //     allCss}px !important;left:${4 *
            //     allCss}px !important;border:${1 *
            //     allCss}px solid #ffffff !important;}`
            // )
            // 图片设计
            const imgCss = item.$el.getElementsByClassName('imgCss')[0]
            if (imgCss) {
              // console.log('item', this.options[index])
              // 这里根据位置大小
              // imgCss.style.width = this.fontSize * 1.1 + 'px'
              // imgCss.style.height = this.fontSize * 1.1 + 'px'
              // imgCss.style.marginLeft = '2px'
              // imgCss.style.marginRight = '2px'
            }
          })
        })
      }
    }
  },
  computed: {
    /**
     *  头部宽度计算
     */
    styleHead() {
      return {
        width: this.labelWidth + this.iWidth + 'px',
        marginBottom: this.labelBottom + 'px'
      }
    },
    /**
     * i标签样式
     */
    iCss() {
      return {
        width: this.iWidth + 'px',
        height: this.iHeight + 'px',
        background: this.iColor
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
    },
    /**
     * 单选的样式
     */
    radioGroupCss() {
      if (this.selectLineFeed && this.selectFull) {
        return {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'flex-start'
        }
      }
      if (this.selectLineFeed) {
        return {
          display: 'flex',
          'flex-direction': 'column'
        }
      }
      if (this.selectFull) {
        return {
          display: 'flex',
          'align-items': 'flex-start'
        }
      }
      return {}
    },
    /**
     * 总样式
     */
    styleCss() {
      if (this.labelBr) {
        return {
          flexDirection: 'column'
        }
      }
      return {}
    }
  },
  created() {},
  mounted() {},
  methods: {
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
     * 单选框选择
     */
    radioFc(item, flag) {
      const optionsName = this.obj.options.filter(res => {
        return res.dictCode == item
      })[0]
      if (this.obj.ruleLook) {
        this.obj.score = flag ? null : (optionsName?.itemScore || optionsName?.itemText) // 分数  //附文字
        this.obj.val = flag ? '' : item || ''
        this.value = flag ? '' : item || ''
        // 规则演示
        // 旧规则
        if (
          this.obj.rule.showList &&
          this.obj.rule.showList.length > 0 &&
          Object.hasOwnProperty.call(this.obj.rule.showList[0], 'choice')
        ) {
          this.obj.rule.showList.map((item, inddex) => {
            if (item.choice == optionsName?.dictCode) {
              // 编码对的上下面有显示和隐藏
              this.$emit('rightDataFc', item.itemKey, !flag)
            } else {
              this.$emit('rightDataFc', item.itemKey, false)
            }
          })
        } else {
          // 新规则
          // 那些组件有显示规则
          const rightDataNew = this.rightData.filter(res => {
            return (
              res.obj.rule &&
              res.obj.rule.showList &&
              res.obj.rule.showList.length > 0
            )
          })
          rightDataNew.map(i => {
            const reqObj = i.obj.rule.showList[0] // 要被显示的对象 只会有一个
            if (reqObj?.list?.length > 1) {
              // 多条的情况
              let expressionFc = ''
              reqObj.list.map(j => {
                const isShow = this.rightData.filter(res => {
                  return (
                    res.obj.itemKey == j.parent &&
                    (res.obj.val == j.parentItem ||
                      (typeof res.obj.val == 'object' &&
                        res.obj.val.join(',').indexOf(j.parentItem) !== -1))
                  )
                })
                expressionFc =
                  expressionFc +
                  j.bracketsLeft +
                  (isShow.length > 0) +
                  j.bracketsRight +
                  j.rule
              })
              try {
                const expression = new Function(`return ${expressionFc}`)
                // 当自己被人有规则，不能再次显示了。不然数据点击没用
                if (i.obj.visible && expression()) {
                  return
                }
                this.$emit('rightDataFc', i.obj.itemKey, expression())
              } catch {
                this.$emit('rightDataFc', i.obj.itemKey, false)
              }
            } else if (reqObj?.list?.length == 1) {
              // 只有一条的时候
              const isShow = this.rightData.filter(res => {
                return (
                  res.obj.itemKey == reqObj.list[0].parent &&
                  res.obj.val == reqObj.list[0].parentItem
                )
              })
              if (i.obj.visible && isShow.length > 0) {
                return
              }
              this.$emit('rightDataFc', i.obj.itemKey, isShow.length > 0)
            }
          })
        }
      }
      this.clickFlag = false
    },
    /**
     * 单选 需要取消选择。双击就行
     */
    cancelradioFc(e) {
      if (!this.saveOrUpdate) {
        return
      }
      this.valueFlag = this.value == e
      this.radioFc(e, this.valueFlag)
    },
    /**
     * 单条数据运算
     */
    calculationFc(leftVal, calculation, rightVal) {
      if (!/^[0-9]*$/.test(rightVal)) {
        rightVal = `'${rightVal}'`
      }
      if (leftVal == false) {
        return false
      }
      let calculationVal = ' '
      switch (calculation) {
        case '包含':
          calculationVal = `${leftVal}.indexOf(${rightVal})!=-1`
          break
        case '不包含':
          calculationVal = `${leftVal}.indexOf(${rightVal})==-1`
          break
        case '等于':
          calculationVal = `${leftVal}==${rightVal}`
          break
        case '不等于':
          calculationVal = `${leftVal}!=${rightVal}`
          break
        case '小于':
          calculationVal = `${leftVal}<${rightVal}`
          break
        case '小于等于':
          calculationVal = `${leftVal}<=${rightVal}`
          break
        case '大于':
          calculationVal = `${leftVal}>${rightVal}`
          break
        case '大于等于':
          calculationVal = `${leftVal}>=${rightVal}`
          break
      }
      try {
        const expressionFc = new Function(`return ${calculationVal}`)
        if (expressionFc()) {
          return true
        } else {
          return false
        }
      } catch {
        return false
      }
    },
    /**
     * 抽出自动勾选的方法
     */
    configFc(obj) {
      if (
        this.saveOrUpdate &&
        obj.dataSources?.length > 0 &&
        obj.valueArray?.length > 0
      ) {
        let takeValueModeValue = obj.takeValueMode == '0' ? 9999 : -1
        let dictCode = ''
        // 选择项
        obj.options.map((item, index) => {
          if (item.ruleJson !== '') {
            const ruleJsonList = JSON.parse(item.ruleJson).list
            let allString = ''
            // 替换用户的数据
            ruleJsonList.map(item2 => {
              item2.dataSources =
                obj.valueObj[item2.dataSources] == null
                  ? false
                  : obj.valueObj[item2.dataSources]
            })
            // 一个个表达式校验后返回true false
            ruleJsonList.map(item2 => {
              allString = `${allString}${
                item2.bracketsLeft
              }${this.calculationFc(
                item2.dataSources,
                item2.expression,
                item2.text
              )}${item2.bracketsRight}${
                item2.rule != '' ? ' ' + item2.rule + ' ' : ''
              }`
            })
            // 这里是以前写的判断逻辑
            // let expressionCode = JSON.parse(item.ruleJson).expressionCode
            // obj.valueArray.map(item2 => {
            //   expressionCode = expressionCode.replace(
            //     new RegExp(item2, 'ig'),
            //     obj.valueObj[item2] == null ? item2 : obj.valueObj[item2]
            //   )
            // })
            // const expressionFc = new Function(`return ${expressionCode}`)
            try {
              const expressionFc = new Function(`return ${allString}`)
              if (expressionFc()) {
                if (
                  (obj.takeValueMode == '0' &&
                    takeValueModeValue > item.itemScore) ||
                  (obj.takeValueMode == '1' &&
                    takeValueModeValue < item.itemScore)
                ) {
                  takeValueModeValue = item.itemScore
                  dictCode = item.dictCode
                } else if (
                  obj.takeValueMode != '0' &&
                  obj.takeValueMode != '1'
                ) {
                  dictCode = item.dictCode || this.value
                }
              }
            } catch {
              //
            }
          }
        })
        dictCode != '' && this.radioFc(dictCode, false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.WnRadio {
  display: flex;
  // ::v-deep.el-radio__inner {
  //   border-radius: 2px;
  //   transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
  //     background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  // }
  // ::v-deep.el-radio__input.is-disabled.is-checked .el-radio__inner {
  //   background-color: #0f49ed !important;
  //   border-color: #0f49ed !important;
  // }
  // ::v-deep.el-radio__input.is-checked .el-radio__inner::after {
  //   transform: rotate(45deg) scaleY(1);
  //   background-color: #0f49ed !important;
  // }
  // ::v-deep.el-radio__inner::after {
  //   box-sizing: content-box;
  //   content: '';
  //   border: 1px solid #ffffff;
  //   border-left: 0 !important;
  //   border-top: 0 !important;
  //   height: 6px;
  //   left: 4px;
  //   position: absolute;
  //   top: 1px;
  //   transform: rotate(45deg) scaleY(0);
  //   width: 2px;
  //   transition: transform 0.15s ease-in 0.05s;
  //   transform-origin: center;
  //   background: var(--maincolor);
  //   border-radius: 0;
  // }
  .head {
    display: flex;
    align-items: center;
    margin-right: 10px;
    i {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .radioGroup {
    flex: 1;
    margin: 8px 0;
    ::v-deep.el-radio {
      display: inline-flex;
      align-items: center;
      margin: 5px !important;
      padding: 6.5px 10px !important;
      height: auto;
      .el-radio__input {
        display: inline-flex;
        align-items: center;
      }
    }
  }
  .pWidth {
    display: inline-flex;
    align-items: center;
  }
  .pBlock{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
