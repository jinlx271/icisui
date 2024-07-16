<!-- 组件化配置新增页面 -->
<template>
  <el-container id="addComponentdesign" class="addComponentdesign" ref="addComponentdesign">
    <!-- 头部 -->
    <el-header class="border" ref="header">
      <!-- 标题 -->
      <div class="headerLeft">
        <span class="red">*</span>
        <span class="mini-title" v-if="state==='surface'">评估表名称：</span>
        <span class="mini-title" v-else-if="state==='assembly'">组件块名称：</span>
      </div>
      <!-- 右边输入框 -->
      <el-input class="headerInput" size="mini" type="text" v-model="title" disabled="disabled" placeholder="请输入" />
    </el-header>
    <!-- 主体 -->
    <el-main :style="mainStyle">
      <!-- 左边组件 -->
      <div class="mainLeft border">
        <div class="mini-title title">基础组件</div>
        <div ref="leftBasic">
          <el-button class="button sortable" size="mini" :data-ele="item.ele" v-for="(item) in leftData.basicComponent" :key="item.obj.name">{{ item.obj.name }}</el-button>
        </div>
        <div class="mini-title title">特殊组件</div>
        <div ref="leftSpecial">
          <el-button class="button sortable" size="mini" :data-ele="item.ele" v-for="(item) in leftData.specialComponents" :key="item.obj.name+item.ele">{{ item.obj.name }}</el-button>
        </div>
        <div class="mini-title title title2" v-if="state==='surface'">组件块</div>
        <div ref="leftSurfaceButton" v-if="state==='surface'">
          <el-button
            class="button sortable"
            size="mini"
            :data-ele="item.componentCode"
            v-for="(item) in surfaceList"
            :key="item.componentCode+item.componentName"
          >{{ item.componentName }}</el-button>
        </div>
      </div>
      <!-- 右边组件设计区 -->
      <div class="mainRight border" ref="rightRef">
        <div class="mini-title title" ref="titleRef">
          <span class="span" v-if="state==='surface'">评估表设计区</span>
          <span class="span" v-else-if="state==='assembly'">组件设计区</span>
          <div class="buttonDiv">
            <el-button class="button" @click.native.prevent="back" size="small">返回页面</el-button>
            <el-button class="button" @click.native.prevent="refresh" size="small" v-if="state==='surface'">刷新所有元数据</el-button>
            <el-button class="button" @click.native.prevent="solidShowHideFc" size="small">虚线隐藏显示</el-button>
            <el-button class="button" @click.native.prevent="cancel" size="small">取消选择</el-button>
            <el-button class="button" @click.native.prevent="rule" size="small" v-if="state==='surface'">规则配置</el-button>
            <el-button class="button" @click.native.prevent="ruleDemonstration" size="small" v-if="state==='surface'">
              <div class="flex">
                <i v-if="demonstration" class="iGreen"></i>
                <span>演 示</span>
              </div>
            </el-button>
            <el-button class="button" @click.native.prevent="reset" size="small">重 置</el-button>
            <el-button class="button" @click.native.prevent="save" type="primary" size="small">保 存</el-button>
          </div>
        </div>
        <div :style="transitionStyle" ref="transitionStyle">
          <!-- 子组件 rightData 是循环的组件对象 -->
          <right-components
            ref="rightComponents"
            :rightData="rightData"
            :solidShowHide="solidShowHide"
            :demonstration="demonstration"
            @selectEle="selectEle"
            @deleteFC="deleteFC"
            @editFC="editFC"
          ></right-components>
        </div>
      </div>
    </el-main>
    <!-- 组件配置细节 -->
    <wn-config-dialog
      v-if="dialogVisible"
      :form="oneDialogData"
      :formId="formId"
      :dialogVisible="dialogVisible"
      :dialog-close="dialogClose"
      :rightData="rightData"
      @dialogInput="dialogInput"
      @cancelData="cancelData"
    ></wn-config-dialog>
    <!-- 规则配置 -->
    <wn-rule-dialog
      v-if="ruleDialog"
      :calculationList="calculationList"
      :ruleShowList="ruleShowList"
      :ruleDada="ruleDada"
      :ruleDialog="ruleDialog"
      @ruleClose="ruleClose"
      @ruleSave="ruleSave"
    ></wn-rule-dialog>
  </el-container>
</template>

<script>
import leftComponents from './components/left/index' // 左边的组件数据
import rightComponents from './components/right/index.vue' // 左边的组件样式数据
// import wnConfigDialog from './components/wnConfigDialog.vue' // 组件配置细节
// import wnRuleDialog from './components/wnRuleDialog.vue' // 组件规则配置
import Sortable from 'sortablejs' // 拖拽组件
import {
  componentsection_list, // 组件查询 不用分页
  componentsection_getById, // 根据id查询单个组件块配置
  componentsection_update, // 修改组件块配置数据
  formconfig_update, // 修改表单配置数据
  formconfig_getById, // 根据id查询单个表单配置
  metadata_getById // 元数据
} from '@/api/configuration'
// import leaveConfirm from '@/mixins/leaveConfirm'
export default {
  // mixins: [leaveConfirm],
  components: {
    rightComponents,
    wnConfigDialog: () => import('./components/wnConfigDialog.vue'),
    wnRuleDialog: () => import('./components/wnRuleDialog.vue')
  },
  name: 'AddComponentdesign',
  data: function() {
    return {
      mainStyle: {
        height: '100px'
      }, // el-main 的高度计算
      transitionStyle: {
        height: '100px',
        overflow: 'auto'
      }, // 右边组件拖拽的时候 必须要高度.不然无法拖入

      loading: false, // 表单内容加载loading
      state: '', // 表/组件  surface/assembly
      title: '', // 标题
      id: '', // 修改是否有id
      solidShowHide: true, // 虚线显示隐藏
      dialogVisible: false, // 组件配置 显示隐藏
      dialogIndex: 0, // 点击编辑下标
      formId: '', // 正在编辑的表单
      oneDialogData: {}, // 点击编辑一条数据
      oldOneDialogData: {}, // 储存起来点击编辑一条数据

      leftData: {}, // 左边基础对象
      surfaceList: [], // 左边组件列表
      rightData: [], // 右边的对象
      saveData: [], // 保存所需要的数据
      ruleDada: [], // 规则List
      ruleShowList: [], // saveData过滤只有选过字典值的数据.去配置规则 显示
      calculationList: [], // saveData过滤只有选过字典值的数据.去配置规则 计算规则

      ruleDialog: false, // 规则的 显示隐藏
      demonstration: false, // 规则的演示
      backFlag: false
    }
  },
  props: {},
  watch: {},
  computed: {},
  beforeRouteLeave(to, from, next) {
    if (this.backFlag) {
      next()
      return
    }
    this.$confirm('此操作将直接离开设计界面，请确认新修改内容已保存。是否继续离开？', '确认信息', {
      confirmButtonText: '确定',
      distinguishCancelAndClose: true,
      customClass: 'width434',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        next()
      })
      .catch((e) => {

      })
  },
  destroyed() {
    window.removeEventListener('popstate', this.leaveConfirmBack, false)
  },
  created() {
    this.leftData = { ...leftComponents } // 左边的对象
    this.state = this.$route.query.state // 组件还是表
    // 修改过了就赋值名字,不能让其修改
    if (this.$route.query.name && this.$route.query.id) {
      this.title = this.$route.query.name
      this.id = this.$route.query.id
      this.queryData(this.id)
    }
  },
  mounted() {
    const self = this
    this.$nextTick(res => {
      // 组件高 = 画布总高 - 头部高度 - margin高度
      self.mainStyle.height =
        self.$refs.addComponentdesign.$el.clientHeight -
        self.$refs.header.$el.clientHeight -
        3 +
        'px' // el-main 高度计算
      self.transitionStyle.height =
        self.$refs.rightRef.clientHeight -
        1 -
        self.$refs.titleRef.clientHeight +
        'px' // 右边组件的高度.不设置无法拖入.
      this.setSort()
    })
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.leaveConfirmBack, false)
    }
  },
  methods: {
    /**
     * 请求之前编译过的数据
     */
    queryData(id) {
      let qeuryFC = componentsection_getById // 组件查询
      if (this.state == 'surface') {
        // 评估表的判断
        qeuryFC = formconfig_getById // 表查询
        // 左侧.评估表进入的时候.右边需要组件列表
        componentsection_list({}).then(res => {
          this.surfaceList = res.data.filter(item => {
            return item.statusDict == 1
          }) // 组件列表
        })
      }
      qeuryFC({ id }).then(res => {
        const resData = JSON.parse(res.data.structure)
        this.rightData = resData.rightData || [] // 组件集合
        this.ruleShowList = resData.ruleShowList || [] // 显示规则
        this.calculationList = resData.calculationList || [] // 计算规则
      })
    },
    /**
     * 设置左边拖拽
     */
    setSort() {
      const _this = this
      // 基础组件
      this.sortable = Sortable.create(this.$refs.leftBasic, {
        animation: 1000, // 动画世界
        draggable: '.sortable', // 拖拽的class
        sort: false,
        onEnd: evt => {
          // 拿取组件的对象数据
          const obj = _this.leftData.basicComponent.filter(res => {
            return res.ele == evt.item.dataset.ele
          })[0]
          // 传参数
          const data = {
            id: 'No' + new Date().getTime(), // 特有身份证
            ele: evt.item.dataset.ele, // 什么类型组件
            obj: obj.obj // 组件里面的数据
          }
          _this.rightData.push(JSON.parse(JSON.stringify(data))) // 必须是深度拷贝.不然数据会串
        }
      })
      // 特殊组件
      this.sortable = Sortable.create(this.$refs.leftSpecial, {
        animation: 1000, // 动画世界
        draggable: '.sortable', // 拖拽的class
        sort: false,
        onEnd: evt => {
          // 拿取组件的对象数据
          const obj = _this.leftData.specialComponents.filter(res => {
            return res.ele == evt.item.dataset.ele
          })[0]
          // 传参数
          const data = {
            id: 'No' + new Date().getTime(), // 特有身份证
            ele: evt.item.dataset.ele, // 什么类型组件
            obj: obj.obj // 组件里面的数据
          }
          _this.rightData.push(JSON.parse(JSON.stringify(data))) // 必须是深度拷贝.不然数据会串
        }
      })
      // 表数据才运行下面
      if (this.state == 'surface') {
        this.sortable = Sortable.create(this.$refs.leftSurfaceButton, {
          animation: 1000, // 动画世界
          draggable: '.sortable', // 拖拽的class
          sort: false,
          onEnd: evt => {
            // 拿取组件的对象数据
            const obj = _this.surfaceList.filter(res => {
              return res.componentCode == evt.item.dataset.ele
            })[0]
            const resData = JSON.parse(obj.structure)
            if (resData.length < 1) {
              return
            }
            resData.rightData.map((item, index) => {
              this.rightData.push(
                JSON.parse(
                  JSON.stringify({
                    id: 'No' + index + new Date().getTime(), // 特有身份证
                    ele: item.ele, // 什么类型组件
                    obj: item.obj // 组件里面的数据
                  })
                ) // 必须是深度拷贝.不然数据会串
              )
            })
          }
        })
      }
    },
    /**
     * 右边拖拽区域-虚线是否显示
     */
    solidShowHideFc(item) {
      this.solidShowHide = !this.solidShowHide
    },
    /**
     * 右边拖拽区域-选中状态
     */
    selectEle(item) {
      this.rightData.forEach(e => {
        e.click = false
      })
      item.click = true
      this.rightData = [...this.rightData]
    },
    /**
     * 右边拖拽区域-取消选择
     */
    cancel() {
      this.rightData.forEach(e => {
        e.click = false
      })
      this.rightData = [...this.rightData]
    },
    /**
     * 右边拖拽区域-重置按钮
     */
    reset() {
      if (this.rightData.length < 1) {
        this.$message({
          message: '组件区域没有数据!',
          type: 'warning'
        })
        return
      }
      this.$confirm('您确定重置所有组件吗?', '确认信息')
        .then(res => {
          this.rightData = [] // 清楚所有数据
          this.ruleShowList = [] // 清楚所有数据
          this.calculationList = [] // 清楚所有数据
          this.$message({
            message: '重置成功!',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    /**
     * 数据处理排序.丢给主页面排序
     */
    sortRightData() {
      // 拖动的时候.需要把rightData 排序一下.不然没排列
      this.saveData = []
      // 右边拖拽 data-id的排序
      const sortNumberList = this.$refs.rightComponents.sortable.toArray()
      for (let i = 0; i < sortNumberList.length; i++) {
        this.saveData.push(
          this.rightData.filter(res => {
            return sortNumberList[i] == res.id
          })[0]
        )
      }
    },
    /**
     * 右边拖拽区域-保存按钮
     */
    save() {
      // 新增苹果结果的判断
      this.sortRightData()
      if (!this.title) {
        this.$message({
          message: '请填写组件块名称!',
          type: 'warning'
        })
        return
      }
      if (this.saveData.length < 1) {
        this.$message({
          message: '组件区域没有数据!',
          type: 'warning'
        })
        return
      }
      let queryFC = '' //
      if (this.id) {
        queryFC =
          this.state == 'surface' ? formconfig_update : componentsection_update // 表/组件 修改
      }

      // 规则清除
      this.rightData.map(item => {
        item.obj.ruleLook = false // 规则关闭
        item.obj.visible = true // 都显示
        item.obj.score = '' // 配置页面不需要保存分
        item.obj.val = '' // 选择内容清除
        item.click = false // 取消选择
      })
      const scoreList = this.saveData.filter(res => {
        return res.ele == 'wn-score'
      })
      // 代表有评分组件
      if (scoreList.length > 0) {
        const scoreListTrue = this.saveData.filter(res => {
          return res.obj.isTotalScore
        })
        if (scoreListTrue.length < 1) {
          this.$confirm('该评估表未设置最终评估结果，是否保存！', '确认信息')
            .then(res => {
              this.saveFc(queryFC)
            })
            .catch(() => {})
          return
        }
      }
      this.saveFc(queryFC)
    },
    /**
     * 接口保存
     */
    saveFc(queryFC) {
      // 新增/修改组件
      queryFC({
        id: this.id, // 修改才有id 新增没有
        basicUpdate: false, // true: 修改基础信息：编码，名称，简称，描述  false: 组件所有数据
        structure: JSON.stringify({
          rightData: this.saveData,
          ruleShowList: this.ruleShowList,
          calculationList: this.calculationList
        }) // 组件所有数据 和 规则数据
      }).then(res => {
        this.$message({
          message: !this.id ? '新增成功!' : '修改成功!',
          type: 'success'
        })
        this.backFlag = true
        this.back()
      })
    },
    /**
     * 右边拖拽区域-返回按钮
     */
    back() {
      this.$router.push({
        path:
          this.state === 'assembly'
            ? '/configuration/evaluationForms/componentdesign'
            : '/configuration/evaluationForms/areaEvaluationForm'
      })
    },
    /**
     * 右边拖拽区域-单个组件删除
     */
    deleteFC(item, index, id) {
      this.sortRightData()
      this.$confirm('您确定删除当前组件吗?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          this.rightData = []
          this.saveData.map((item2, index2) => {
            if (item2.id == id) {
              this.saveData.splice(index2, 1)
            }
          })
          this.$message.success('删除成功！')
          this.$nextTick(req => {
            this.rightData = JSON.parse(JSON.stringify(this.saveData))
          })
        })
        .catch(() => {})
    },
    /**
     * 右边拖拽区域-单个组件配置
     */
    editFC(item, index) {
      this.dialogIndex = index // 记录第几个.
      this.oneDialogData = JSON.parse(
        JSON.stringify(this.rightData[index]?.obj)
      ) // 单个组件点击修改下标-需要传给组件设置框
      this.formId = this.rightData[index].id
      this.oldOneDialogData = JSON.parse(JSON.stringify(this.oneDialogData)) // 深度拷贝
      this.dialogVisible = true
    },
    /**
     * 组件配置-关闭
     */
    dialogClose() {
      this.dialogVisible = false
    },
    /**
     * 取消组件 数据要换回来
     */
    cancelData() {
      this.rightData = JSON.parse(JSON.stringify(this.rightData))
      this.$set(
        this.rightData,
        this.dialogIndex,
        Object.assign(this.rightData[this.dialogIndex], {
          obj: this.oldOneDialogData
        })
      )
    },
    /**
     * 单个配置区域-时实变化
     */
    dialogInput(item) {
      this.rightData = JSON.parse(JSON.stringify(this.rightData))
      this.$set(
        this.rightData,
        this.dialogIndex,
        Object.assign(this.rightData[this.dialogIndex], {
          obj: item
        })
      )
    },

    /**
     * 右边拖拽区域-规则配置
     */
    rule() {
      this.ruleDada = [] // 清空
      this.rightData.map((item, index) => {
        // 满足3个组件(下拉框,单选,复选) 并且itemkey有元数据值
        if (
          'wn-input,wn-select,wn-radio,wn-checkBox,wn-datePicker,wn-score'.indexOf(
            item.ele
          ) !== -1 &&
          item.obj.itemKey != ''
        ) {
          this.ruleDada.push({
            id: item.id, // 组件的独有id
            ele: item.ele, // 类型
            valueTypeDictCode: item?.obj?.valueTypeDictCode || '2',
            itemName: item.obj.itemName, // 元素数据名称
            itemKey: item.obj.itemKey, // 元素数据编码
            options: item.obj.options || [], // 元数据绑定的字典值
            isTotalScore: item.obj.isTotalScore
          })
        }
      })
      this.ruleShowList =
        this.ruleShowList.length > 0
          ? this.ruleShowList
          : [
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
              } // 规则集合
            ]
      this.calculationList =
        this.calculationList.length > 0
          ? this.calculationList
          : [
              {
                score: '',
                plus: [],
                number: 1
              }
            ] // 计算规则
      this.ruleDialog = true
    },
    /**
     * 规则配置-关闭弹框
     */
    ruleClose() {
      this.ruleDialog = false
    },

    /**
     * 规则演示
     */
    ruleDemonstration() {
      // 演示开关
      if (this.demonstration) {
        this.demonstration = false
        // 规则清除
        this.rightData.map(item => {
          item.obj.ruleLook = false // 显示规则是否应用
          item.obj.visible = true // 都显示
          item.obj.score = '' // 配置页面不需要保存分
          item.obj.val = '' // 选择的内容需要清除
        })
        this.$message({
          message: '演示关闭!',
          type: 'success'
        })
        return
      }
      this.demonstration = true
      this.$message({
        message: '演示开启!',
        type: 'success'
      })
      // 显示规则清除
      this.rightData.map(item => {
        item.click = false // 取消选择
        item.obj.ruleLook = true // 规则开启
        item.obj.visible = true // 都显示
        item.obj.score = '' // 配置页面不需要保存分
        item.obj.val = '' // 选择的内容需要清除
      })
      // 显示规则配置
      this.ruleShowList.map((item, index) => {
        this.rightData.map((item2, index2) => {
          // 被隐藏哪个
          if (item.child == item2.obj.itemKey) {
            item2.obj.visible = false // 备选的隐藏
          }
        })
      })
    },
    /**
     * 规则保存
     */
    ruleSave(showList, scoreList) {
      this.ruleShowSave(showList)
      this.ruleScoreSave(scoreList)
    },
    /**
     * 显示规则配置-保存弹框
     */
    ruleShowSave(data) {
      // 规则赋值
      this.ruleShowList = data
      // 规则清除
      this.rightData.map(item => {
        item.obj.rule = {
          showList: [],
          calculation: []
        } // 显示规则
      })
      // 显示规则配置合并
      this.ruleShowList.map((item, index) => {
        if (item.list.length > 0 && item.child) {
          this.rightData.map((item2, index2) => {
            // 选择哪个显示
            if (item.child == item2.obj.itemKey) {
              item2.obj.rule.showList = [item]
            }
          })
        }
      })
      this.ruleClose()
    },
    /**
     * 计算规则
     */
    ruleScoreSave(data) {
      // 规则赋值
      this.calculationList = data
      // 显示规则配置合并
      this.calculationList.map((item, index) => {
        this.rightData.map((item2, index2) => {
          // 被相加的项
          if (item.score == item2.obj.itemKey) {
            item2.obj.rule.calculation = item // 总值
          }
        })
      })
    },
    /**
     * 刷新元数据
     */
    refresh() {
      let flag = false
      let name = ''
      const queryAll = this.rightData.map(async item => {
        if (item.obj.itemKey && item.obj.itemKey != '') {
          const data = await this.metadata_getByIdFc({
            metaCode: item.obj.itemKey,
            cascade: true // 是否级联字典数据
          })
          if (!flag && item.obj.type != data.dataType) {
            flag = true
            name = data.metaName
          }
          if (data.dict?.dictItems) {
            item.obj.options = data.dict.dictItems
          }
          if (data.takeValueMode) {
            item.obj.takeValueMode = data.takeValueMode
          }
          if (data.dataSources) {
            item.obj.dataSources = data.dataSources
          }
          if (data.metaAbbr) {
            item.obj.itemAbbr = data.metaAbbr
          }
          if (data.conditionity) {
            item.obj.conditionity = data.conditionity
          }
        }
      })
      Promise.all(queryAll).then(() => {
        if (flag) {
          this.$message({
            message: `元数据类型与组件无法匹配，请删除"${name}"组件重新配置!`,
            type: 'error'
          })
          return
        }
        this.$message({
          message: '已刷新所有元数据,请点击保存按钮!',
          type: 'success'
        })
      })
    },
    metadata_getByIdFc(data) {
      return new Promise((resolve, reject) => {
        metadata_getById(data).then(res => {
          resolve(res.data)
        })
      })
    },
    leaveConfirmBack(e) {
      this.backFlag = true
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.addComponentdesign {
  // font-weight: 500;
  background: #ffffff;
  height: 100%;
  padding: 3px;
  .border {
    border: 1px solid #d3dce6;
  }
  ::v-deep .el-header {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .headerLeft {
      width: 110px;
    }
    .headerInput {
      flex: 1;
      input {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
      }
    }
  }
  ::v-deep .el-main {
    padding: 0;
    display: flex;
    margin-top: 3px;
    .mainLeft {
      width: 300px;
      margin-right: 3px;
      height: 100%;
      overflow: auto;
      .title {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
        text-indent: 10px;
      }
      .title2 {
        border-top: 1px solid #eee;
        margin-top: 10px;
      }
      .button {
        min-width: 83px;
        height: 30px;
        line-height: 30px;
        margin: 10px 8px 0 8px;
        padding: 0 5px;
        font-size: 12px;
        border-radius: 3px;
        text-align: center;
        font-family: sans-serif;
      }
    }
    .mainRight {
      flex: 1;
      height: 100%;
      overflow: auto;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee !important;
        text-indent: 10px;
        .span {
          width: 100px;
          text-align: left;
        }
        .buttonDiv {
          flex: 1;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .iGreen {
          background: #67c23a;
          width: 12px;
          height: 12px;
          display: inline-block;
          border-radius: 100%;
          margin-right: 3px;
          animation-name: breath;
          animation-duration: 2s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes breath {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
      }
    }
    .sortable-ghost {
      opacity: 0.8;
      color: #fff !important;
      background: #4184c2 !important;
    }
  }
  .red {
    color: #f7594b;
  }
}
</style>
