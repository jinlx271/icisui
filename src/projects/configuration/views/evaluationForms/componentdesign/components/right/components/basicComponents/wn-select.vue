<template>
  <div class="Wnselect" ref="wnSelect" :style="styleCss">
    <!-- 标题 -->
    <span class="head" :style="labelCss">
      {{ title }}
      <span v-if="itemScore">{{ score }}</span>
    </span>
    <!-- 主体 -->
    <el-select @change="selectFc" :ref="id" :class="{ redCss: compare }" class="selectCss" v-model="value" placeholder="请选择" :disabled="!saveOrUpdate" popper-class="wnSelect">
      <el-option v-for="item in obj.options" :key="item.dictCode" :style="optionCss" :label="item.itemScore && item.itemText ? item.dictName + '(' + item.itemScore + '分)' + '(' + item.itemText + ')' : item.itemScore && !item.itemText ? item.dictName + '(' + item.itemScore + '分)' : !item.itemScore && item.itemText ? item.dictName + '(' + item.itemText + ')' : item.dictName" :value="item.dictCode" border style="height:fit-content">
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
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'Wnselect',
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
      fontSize: this.obj.fontSize, // 组件字体大小
      color: this.obj.color, // 组件字体颜色
      itemScore: this.obj.itemScore, // 是否显示分数
      score: this.obj.score, // 分数
      labelBr: this.obj.labelBr, // 标题是否换行
      labelBottom: this.obj.labelBottom, // 标题下边高度
      labelWidth: this.obj.labelWidth, // 组件标题宽度
      labelFontSize: this.obj.labelFontSize, // 标题字体大小
      labelColor: this.obj.labelColor, // 标题字体颜色
      uploaApi: process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API,
      clickFlag: true, // 是否配置参数。用户点击不用改
      compare: this.obj.compare // 差异化
    }
  },
  watch: {
    obj: {
      deep: true,
      immediate: true,
      handler: function (obj) {
        if (obj.val === '') {
          // 配置页面不能随便修改
          this.value = obj.val
        } else if (this.sureVal) {
          // 业务页面 可以去修改
          this.value = obj.val
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
        this.labelBr = obj.labelBr
        this.labelBottom = obj.labelBottom
        this.labelWidth = obj.labelWidth
        this.labelFontSize = obj.labelFontSize
        this.labelColor = obj.labelColor
        this.compare = obj.compare

        this.$nextTick(() => {
          // input 元素
          const inputEle = this.$refs[this.id].$el.getElementsByClassName('el-input__inner')[0].style
          inputEle.fontSize = this.fontSize + 'px' // 字体大小
          inputEle.color = this.color // 颜色

          // placeholder 颜色修改
          this.loadStyleString(
            `.${this.id} .el-input__inner{height:${this.fontSize * (32 / 13)}px !important;}
          .${this.id} .el-input__inner::-webkit-input-placeholder{color:${this.color};}
          .${this.id} .el-input__inner::-moz-input-placeholder{color:${this.color};}
          .${this.id} .el-input__inner::-ms-input-placeholder{color:${this.color};}`
          )

          const imgCss = this.$refs[this.id].$el.getElementsByClassName('imgCss')
          if (imgCss) {
            for (let i = 0; i < imgCss.length; i++) {
              const item = imgCss[i]
              item.style.marginLeft = '2px'
              item.style.marginRight = '2px'
            }
          }
        })
      }
    }
  },
  computed: {
    /**
     * 标题样式
     */
    labelCss() {
      return {
        width: this.labelWidth + 'px',
        whiteSpace: 'nowrap',
        color: this.labelColor,
        fontSize: this.labelFontSize + 'px',
        marginBottom: this.labelBottom + 'px'
      }
    },
    /**
     * 选择类型
     */
    optionCss() {
      return {
        color: this.color,
        fontSize: this.fontSize + 'px'
      }
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
    selectFc(item) {
      const optionsName = this.obj.options.filter((res) => {
        return res.dictCode == item
      })[0]
      if (this.obj.ruleLook) {
        this.obj.score = (optionsName?.itemScore || optionsName?.itemText) // 分数
        this.obj.val = item // 值
        // 规则演示
        // 旧规则
        if (this.obj.rule.showList && this.obj.rule.showList.length > 0 && Object.hasOwnProperty.call(this.obj.rule.showList[0], 'choice')) {
          this.obj.rule.showList.map((item, inddex) => {
            if (item.choice == optionsName?.dictCode) {
              // 编码对的上下面有显示和隐藏
              this.$emit('rightDataFc', item.itemKey, true)
            } else {
              this.$emit('rightDataFc', item.itemKey, false)
            }
          })
        } else {
          // 新规则
          // 那些组件有显示规则
          const rightDataNew = this.rightData.filter((res) => {
            return res.obj.rule && res.obj.rule.showList && res.obj.rule.showList.length > 0
          })
          rightDataNew.map((i) => {
            const reqObj = i.obj.rule.showList[0] // 要被显示的对象 只会有一个
            if (reqObj.list.length > 1) {
              // 多条的情况
              let expressionFc = ''
              reqObj.list.map((j) => {
                const isShow = this.rightData.filter((res) => {
                  return res.obj.itemKey == j.parent && (res.obj.val == j.parentItem || (typeof res.obj.val == 'object' && res.obj.val.join(',').indexOf(j.parentItem) !== -1))
                })
                expressionFc = expressionFc + j.bracketsLeft + (isShow.length > 0) + j.bracketsRight + j.rule
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
            } else if (reqObj.list.length == 1) {
              // 只有一条的时候
              const isShow = this.rightData.filter((res) => {
                return res.obj.itemKey == reqObj.list[0].parent && res.obj.val == reqObj.list[0].parentItem
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
     * 抽出自动勾选的方法
     */
    configFc(obj) {
      if (this.saveOrUpdate && obj.dataSources?.length > 0 && obj.valueArray?.length > 0) {
        let dictCode = ''
        // 选择项
        obj.options.map((item, index) => {
          if (item.ruleJson !== '') {
            const ruleJsonList = JSON.parse(item.ruleJson).list
            let allString = ''
            // 替换用户的数据
            ruleJsonList.map((item2) => {
              item2.dataSources = obj.valueObj[item2.dataSources] == null ? false : obj.valueObj[item2.dataSources]
              // 一个个表达式校验后返回true false
              allString = `${allString}${item2.bracketsLeft}${this.calculationFc(item2.dataSources, item2.expression, item2.text)}${item2.bracketsRight}${item2.rule != '' ? ' ' + item2.rule + ' ' : ''}`
            })
            // let expressionCode = JSON.parse(item.ruleJson).expressionCode
            // obj.valueArray.map(item2 => {
            //   expressionCode = expressionCode.replace(
            //     item2,
            //     obj.valueObj[item2] == null ? item2 : obj.valueObj[item2]
            //   )
            // })
            // const expressionFc = new Function(`return ${expressionCode}`)
            try {
              const expressionFc = new Function(`return ${allString}`)
              if (expressionFc() && dictCode == '') {
                dictCode = item.dictCode
              }
            } catch {
              //
            }
          }
        })
        dictCode != '' && this.selectFc(dictCode)
      }
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
      const expressionFc = new Function(`return ${calculationVal}`)
      try {
        if (expressionFc()) {
          return true
        } else {
          return false
        }
      } catch {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.Wnselect {
  width: 100%;
  display: flex;
  .head {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .selectCss {
    flex: 1;
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

.redCss {
  color: red;
  ::v-deep.el-input__inner {
    color: red !important;
  }
}
</style>
