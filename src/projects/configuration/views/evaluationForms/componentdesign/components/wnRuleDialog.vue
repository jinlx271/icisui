<template>
  <div class="WnRuleDialog">
    <el-dialog :close-on-click-modal="false" title="规则配置" :visible.sync="ruleDialog" :before-close="cancel" width="1000px" :Key="freshDom">
      <el-tabs tab-position="left" style="height: 400px;">
        <el-tab-pane label="显示规则">
          <div class="ruleShowCss" v-for="(ruleShowList_item,ruleShowList_index) in ruleShowList" :key="'ruleShowList'+ruleShowList_index">
            <div class="leftCss">
              <div class="lineLeftCss" v-for="(list_item,list_index) in ruleShowList_item.list" :key="'list_item'+list_index">
                <el-select v-model="list_item.bracketsLeft" placeholder="请选择" clearable style="width:50px">
                  <el-option value="(" label="("></el-option>
                </el-select>
                <span class="text">当</span>
                <el-select v-model="list_item.parent" placeholder="请选择" @change="parentFc(ruleShowList_item, list_item,list_index)" style="width:150px" clearable>
                  <el-option
                    v-for="(parentList_item) in parentList"
                    :key="parentList_item.itemKey+parentList_item.itemName"
                    :value="parentList_item.itemKey"
                    :label="parentList_item.itemName"
                  ></el-option>
                </el-select>
                <span class="text">选择</span>
                <el-select v-model="list_item.parentItem" :disabled="list_item.parentItemList.length<1" style="width:150px" class="r10" clearable>
                  <el-option
                    v-for="(parentItemList_item) in list_item.parentItemList"
                    :key="parentItemList_item.dictCode+parentItemList_item.dictName"
                    :value="parentItemList_item.dictCode"
                    :label="parentItemList_item.dictName"
                  ></el-option>
                </el-select>
                <el-select v-model="list_item.bracketsRight" placeholder="请选择" clearable style="width:50px" class="r10">
                  <el-option value=")" label=")"></el-option>
                </el-select>
                <el-select v-model="list_item.rule" placeholder="请选择" clearable style="width:55px" class="r10">
                  <el-option value="&&" label="且"></el-option>
                  <el-option value="||" label="或"></el-option>
                </el-select>
                <el-button size="mini" type="text" @click.native.prevent="listAdd(ruleShowList_item.list,list_index)" icon="el-icon-plus"></el-button>
                <el-button size="mini" type="text" @click.native.prevent="listDelete(ruleShowList_item,list_index)" icon="el-icon-delete" style="color:#000"></el-button>
              </div>
            </div>
            <div class="rightCss">
              <span class="text">显示</span>
              <el-select v-model="ruleShowList_item.child" placeholder="请选择" style="width:150px" class="r10" clearable>
                <el-option
                  v-for="(childList_item) in ruleShowList_item.childList"
                  :key="childList_item.itemKey+childList_item.itemName"
                  :value="childList_item.itemKey"
                  :label="childList_item.itemName"
                ></el-option>
              </el-select>
              <el-button size="mini" @click.native.prevent="addRow" icon="el-icon-plus"></el-button>
              <el-button size="mini" @click.native.prevent="deleteRow(ruleShowList_item,ruleShowList_index)" icon="el-icon-delete"></el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="计算规则">
          <div class="lineDiv" v-for="(item,index) in calculationList" :key="item.score + item.plus">
            <div>
              <el-select v-model="item.score" placeholder="请选择" @click.native.prevent="clickScoreListFc(item)">
                <el-option v-for="(item) in scoreList" :key="item.itemKey+item.itemName" :value="item.itemKey" :label="item.itemName" :disabled="item.disabled"></el-option>
              </el-select>
              <span class="text">等于</span>

              <el-select v-if="item.plus" placeholder="请选择" v-model="item.plus" multiple class="w400 r10">
                <el-option v-for="(item) in parentList" :key="item.itemKey+item.itemName" :value="item.itemKey" :label="item.itemName"></el-option>
              </el-select>
              <template v-if="item.expression">
                <el-popover placement="bottom-start" title width="250" trigger="hover" @show="expressionFc('plus1List',item,index)">
                  <p v-for="(item) in item.plus1List" :key="item.itemKey+item.itemName">
                    <el-link @click="elLinkFc('plus1Name',index,item.itemName,item.itemKey)" :underline="false">{{item.itemName}}</el-link>
                  </p>
                  <input class="inputCss" slot="reference" v-model="item.plus1Name" placeholder="请输入" @input="scoreListFc(item.plus1Name,index,'plus1List')" />
                </el-popover>
                <span class="text">{{item.expression}}</span>
                <!-- <span class="text">{{item.expression|filtersName}}</span> -->
                <el-popover placement="bottom-start" title width="250" trigger="hover" @show="expressionFc('plus2List',item,index)">
                  <p v-for="(item) in item.plus2List" :key="item.itemKey+item.itemName">
                    <el-link @click="elLinkFc('plus2Name',index,item.itemName,item.itemKey)" :underline="false">{{item.itemName}}</el-link>
                  </p>
                  <input class="inputCss" slot="reference" v-model="item.plus2Name" placeholder="请输入" @input="scoreListFc(item.plus2Name,index,'plus2List')" />
                </el-popover>
              </template>
            </div>
            <div>
              <el-popover placement="bottom" title width="50" trigger="hover">
                <p v-for="item in radioList" :key="item.value">
                  <el-link @click.native.prevent="addScoreRow(item.value)" :underline="false">{{item.label}}</el-link>
                </p>
                <el-button slot="reference" size="mini" icon="el-icon-plus"></el-button>
              </el-popover>
              <el-button size="mini" @click.native.prevent="deleteScoreRow(item,index)" icon="el-icon-delete"></el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {} from '@/api/configuration'
export default {
  name: 'WnRuleDialog',
  components: {},
  props: {
    ruleDialog: {
      type: Boolean,
      default: false
    }, // 显示隐藏
    ruleDada: {
      type: Array,
      default: () => []
    }, // 入参对象
    ruleShowList: {
      type: Array,
      default: () => [
        {
          list: [
            {
              bracketsLeft: '', // 左括号
              parent: '', // parent 对象
              parentItem: '', // parent 的选择
              parentItemList: [], // 选择parent的时候下面字典对象
              bracketsRight: '', // 右括号
              rule: '' // 运算符
            }
          ],
          new: true,
          child: '', // 显示类容的选择
          childList: [] // 选择parent的时候显示类容
        }
      ]
    }, // 规则显示的列表
    calculationList: {
      type: Array,
      default: () => []
    } // 规则计算
  },
  data() {
    return {
      freshDom: '', // 刷新dom
      parentList: [], // 过滤不能选择 input 和 datePicker
      scoreList: [], // 评分的选择
      radioList: [
        {
          label: '元数据',
          value: '1'
        },
        {
          label: '加法',
          value: '2'
        },
        {
          label: '减法',
          value: '3'
        },
        {
          label: '乘法',
          value: '4'
        },
        {
          label: '除法',
          value: '5'
        }
      ],
      oldRuleShowList: [],
      oldCalculationList: []
    }
  },
  filters: {
    filtersName(val) {
      let name = ''
      switch (val) {
        case '+':
          name = '加'
          break
        case '-':
          name = '减'
          break
        case '*':
          name = '乘'
          break
        case '/':
          name = '除'
          break
      }
      return name
    }
  },
  watch: {
    ruleDada: {
      deep: true,
      immediate: true,
      handler: function(obj) {
        // 去除 input 和 datepicker 和 分数
        // 只有 单选 多选 下拉框
        this.parentList = obj.filter(res => {
          return res.options.length > 0 || res.ele == 'wn-score'
        })
        this.scoreList = obj.filter(res => {
          return res.ele == 'wn-score' || !!res.isTotalScore
        })
      }
    }
  },
  computed: {},
  beforeCreated() {},
  created() {
    // 兼容老 新版本
    if (this.ruleShowList.length > 0) {
      this.ruleShowList.map((item, index) => {
        if (!Object.hasOwnProperty.call(item, 'new')) {
          this.$set(this.ruleShowList[index], 'list', [
            {
              bracketsLeft: '', // 左括号
              parent: item.parent || '', // parent 对象
              parentItem: item.parentItem || '', // parent 的选择
              parentItemList: item.parentItemList || [], // 选择parent的时候下面字典对象
              bracketsRight: '', // 右括号
              rule: '' // 运算符
            }
          ])
          this.$set(this.ruleShowList[index], 'new', true)
        }
      })
    }
    this.oldRuleShowList =
      this.ruleShowList.length > 0
        ? JSON.parse(JSON.stringify(this.ruleShowList))
        : []
    this.calculationList.map(item => {
      if (item.expression && item.expression != '') {
        item.plus1List = JSON.parse(JSON.stringify(this.scoreList))
        item.plus2List = JSON.parse(JSON.stringify(this.scoreList))
      }
    })
    this.oldCalculationList =
      this.calculationList.length > 0
        ? JSON.parse(JSON.stringify(this.calculationList))
        : []
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * 刷新dom
     */
    fresh() {
      this.freshDom = +new Date().getTime()
    },
    /**
     * 保存按钮
     */
    save() {
      // 计算规则判断
      if (this.calculationList.length > 0) {
        let alertFlag = false
        // 不是默认值提醒
        this.calculationList.map(item => {
          if (item.expression) {
            if (
              item.plus1Name == '' ||
              item.plus2Name == '' ||
              item.score == ''
            ) {
              alertFlag = true
            }
          } else if (item.score == '' || item.plus.length < 1) {
            alertFlag = true
          }
        })
        const data = this.calculationList[0]
        if (
          !(
            data.score == '' &&
            data.number == 1 &&
            data.plus.length < 1 &&
            this.calculationList.length === 1
          )
        ) {
          if (alertFlag) {
            this.$message({
              message: '空值，请输入!',
              type: 'error'
            })
            return
          }
        }
      }
      // 显示规则判断
      if (this.ruleShowList.length > 0) {
        const map = new Map()
        const childList = this.ruleShowList.filter(
          item => !map.has(item.child) && map.set(item.child, 1)
        )
        if (childList.length != this.ruleShowList.length) {
          this.$message({
            message: '“规则重复”，保存失败!',
            type: 'error'
          })
          return
        }
        for (let i = 0; i < this.ruleShowList.length; i++) {
          const iList = this.ruleShowList[i]
          let expressionFc = ''
          for (let j = 0; j < iList.list.length; j++) {
            const jiList = iList.list[j]
            // 不是最后一个，必须要符号 && ||
            if (iList.list.length != (j + 1) && !jiList.rule) {
              this.$message({
                message: '表达式错误，保存失败!',
                type: 'error'
              })
              return
            }
            expressionFc =
              expressionFc +
              jiList.bracketsLeft +
              true +
              jiList.bracketsRight +
              jiList.rule
          }
          try {
            const expression = new Function(`return ${expressionFc}`)
            // 当自己被人有规则，不能再次显示了。不然数据点击没用
            if (!expression()) {
              this.$message({
                message: '表达式错误，保存失败!',
                type: 'error'
              })
              return
            }
          } catch {
            this.$message({
              message: '表达式错误，保存失败!',
              type: 'error'
            })
            return
          }
        }
      }
      this.$message({
        message: '请记得点击 "桌面保存按钮" !',
        type: 'warning'
      })
      this.$emit('ruleSave', this.ruleShowList, this.calculationList) // 规则保存
    },
    /**
     * 取消显示
     */
    cancel() {
      this.$message({
        message: '请记得点击 "桌面保存按钮" !',
        type: 'warning'
      })
      this.$emit('ruleSave', this.oldRuleShowList, this.oldCalculationList)
    },
    /**
     * 显示-新增
     */
    addRow() {
      this.ruleShowList.push({
        list: [
          {
            bracketsLeft: '', // 左括号
            parent: '', // parent 对象
            parentItem: '', // parent 的选择
            parentItemList: [], // 选择parent的时候下面字典对象
            bracketsRight: '', // 右括号
            rule: '' // 运算符
          }
        ],
        new: true,
        child: '', // 显示类容的选择
        childList: [] // 选择parent的时候显示类容
      })
    },
    /**
     * 显示-删除这条数据
     */
    deleteRow(item, index) {
      this.ruleShowList.splice(index, 1)
      // 最后一条需要增加一条空配置
      if (this.ruleShowList.length < 1) {
        this.addRow()
      }
    },
    /**
     *  显示-父元素改变需要 字典值变化
     */
    parentFc(parent_item, item, index) {
      item.parentItem = '' // 清空之前的值
      // 选择的 select集合
      item.parentItemList = this.ruleDada.filter(res => {
        return res.itemKey === item.parent
      })[0].options
      const parent = []
      parent_item.list.map(item => {
        parent.push(item.parent)
      })
      // 显示的 select集合
      parent_item.childList = this.ruleDada.filter(res => {
        return !parent.some(req => res.itemKey == req)
      })
      if (parent_item.child) {
        const childArray = parent_item.childList.filter(res => {
          return res.itemKey == parent_item.child
        })
        if (childArray.length < 1) {
          this.$message({
            message: '显示组件不能和判断条件一致 !',
            type: 'warning'
          })
          parent_item.child = '' // 清空之前的值
        }
      }
    },
    /**
     * 计算-新增计算分数规则
     * @number 1：元数据 2：加法 3：减法 4：乘法 5：除法
     */
    addScoreRow(number) {
      let expression = ''
      switch (number) {
        case '1':
          this.calculationList.push({
            score: '',
            plus: [],
            number: number
          })
          return
        case '2':
          expression = '+'
          break
        case '3':
          expression = '-'
          break
        case '4':
          expression = '*'
          break
        case '5':
          expression = '/'
          break
      }
      this.calculationList.push({
        score: '',
        expression: expression,
        plus1Name: [], // 可以输入值，也可以选择评分组件
        plus1: [], // 可以输入值，也可以选择评分组件
        plus1List: JSON.parse(JSON.stringify(this.scoreList)), // 可以输入值，也可以选择评分组件
        plus2Name: [], // 可以输入值，也可以选择评分组件
        plus2: [], // 可以输入值，也可以选择评分组件
        plus2List: JSON.parse(JSON.stringify(this.scoreList)), // 可以输入值，也可以选择评分组件
        number: number
      })
    },
    /**
     * 计算-删除
     */
    deleteScoreRow(item, index) {
      this.calculationList.splice(index, 1)
      // 最后一条需要增加一条空配置
      if (this.calculationList.length < 1) {
        this.addScoreRow('1')
      }
    },
    /**
     * 评分的相加
     */
    scoreListFc(val, index, key) {
      if (isNaN(+val)) {
        this.calculationList[index][
          key == 'plus1List' ? 'plus1Name' : 'plus2Name'
        ] = ''
        return
      }
      if (
        key == 'plus2List' &&
        val == '0' &&
        this.calculationList[index].expression == '/'
      ) {
        this.$message({
          message: '除数不能为0！',
          type: 'warning'
        })
        this.calculationList[index].plus2Name = ''
        return
      }
      this.calculationList[index][key == 'plus1List' ? 'plus1' : 'plus2'] = ''
    },
    /**
     * link点击事件
     */
    elLinkFc(key, index, name, val) {
      this.calculationList[index][key] = name
      this.calculationList[index][key == 'plus1Name' ? 'plus1' : 'plus2'] =
        val || ''
    },
    /**
     * 左边类容不能重复选择
     */
    clickScoreListFc(item) {
      this.scoreList.map((i, iIndex) => {
        this.$set(this.scoreList[iIndex], 'disabled', false)
        this.calculationList.map(j => {
          if ((i.itemKey == j.score) & (item.score != j.score)) {
            i.disabled = true
            this.$set(this.scoreList[iIndex], 'disabled', true)
          }
        })
      })
    },
    /**
     * 右边类容不能和 综合值相同
     */
    expressionFc(key, item, index) {
      const plus = key == 'plus1List' ? 'plus2' : 'plus1'
      item[key] = this.scoreList.filter(res => {
        return res.itemKey != item.score && item[plus] != res.itemKey
      })
    },
    /**
     * 子项规则添加
     */
    listAdd(item, index) {
      const data = {
        bracketsLeft: '', // 左括号
        parent: '', // parent 对象
        parentItem: '', // parent 的选择
        parentItemList: [], // 选择parent的时候下面字典对象
        bracketsRight: '', // 右括号
        rule: '' // 运算符
      }
      item.push(data)
      // item.splice(index, 0, data) // 一条数据前面插入
      this.fresh()
    },
    /**
     * 子项规则删除
     */
    listDelete(item, index) {
      item.list.splice(index, 1)
      if (item.list.length < 1) {
        this.listAdd(item.list)
      }
      const parent = []
      item.list.map(item => {
        parent.push(item.parent)
      })
      // 显示的 select集合
      item.childList = this.ruleDada.filter(res => {
        return !parent.some(req => res.itemKey == req)
      })
      this.fresh()
    }
  }
}
</script>
<style lang='scss' scoped>
.WnRuleDialog {
  ::v-deep .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #eee;
      margin-bottom: 0;
    }
    .el-dialog__body {
      margin: 10px 0;
      padding: 0 10px;
    }
    .el-dialog__footer {
      padding: 10px;
      border-top: 1px solid #eee;
    }
    .el-tabs__content {
      height: 100%;
      overflow: auto;
    }
    .lineDiv {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 5px;
      div {
        display: inline-flex;
        align-items: center;
      }
      .text {
        display: inline-block;
        margin: 0 5px;
        font-size: 13px;
        font-weight: bold;
        color: rgb(96, 98, 102);
        display: block; /*内联对象需加*/
        word-break: keep-all; /* 不换行 */
        white-space: nowrap; /* 不换行 */
      }
      .r10 {
        margin-right: 10px;
      }
      .w110 {
        width: 110px;
      }
      .w400 {
        width: 400px;
      }
      .inputCss {
        width: 188px;
        height: 32px;
        border: 1px solid rgb(234, 238, 254);
      }
    }
    .ruleShowCss {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 5px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #aaa;
      .lineLeftCss {
        display: inline-flex;
        align-items: center;
        margin-bottom: 2px;
      }
      .rightCss {
        display: inline-flex;
        align-items: center;
      }
      .text {
        display: inline-block;
        margin: 0 5px;
        font-size: 13px;
        font-weight: bold;
        color: rgb(96, 98, 102);
        display: block; /*内联对象需加*/
        word-break: keep-all; /* 不换行 */
        white-space: nowrap; /* 不换行 */
      }
      .r10 {
        margin-right: 10px;
      }
      .w110 {
        width: 110px;
      }
      .w400 {
        width: 400px;
      }
      .inputCss {
        width: 188px;
        height: 32px;
        border: 1px solid rgb(234, 238, 254);
      }
    }
  }
}
</style>
