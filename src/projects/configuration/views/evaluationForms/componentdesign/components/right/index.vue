<template>
  <div class="rightIndex" ref="rightButton">
    <!-- 每个组件外边框 -->
    <div
      v-show="item.obj.visible"
      v-for="(item,index) in rightData"
      :key="item.ele+item.id"
      :style="styleCss(item)"
      class="rightIndex_div sortable"
      :data-id="item.id"
      @click="selectEle(item)"
      @dblclick="editFC(item,index)"
      :class="{checked:item.click}"
      :ref="item.id"
    >
      <!-- 2个点击操作按钮 -->
      <div class="tools" v-if="item.click">
        <div class="tools_edit" @click="editFC(item,index)">
          <i class="el-icon-s-tools"></i>
        </div>
        <div class="tools_delete" @click="deleteFC(item,index)">
          <i class="el-icon-delete-solid"></i>
        </div>
      </div>
      <!-- 组件区域 -->
      <component
        :is="item.ele"
        :obj="item.obj"
        :rightData="rightData"
        :id="item.id"
        :edit="false"
        :solidShowHide="solidShowHide"
        @rightDataFc="rightDataFc"
        @componentStyleCss="componentStyleCss"
      />
    </div>
  </div>
</template>
<script>
// 基础组件
const basicComponents = [
  'wn-checkBox',
  'wn-datePicker',
  'wn-hr',
  'wn-input',
  'wn-p',
  'wn-radio',
  'wn-select',
  'wn-title',
  'wn-textarea',
  'wn-img'
]
const basicObj = {}
basicComponents.forEach(key => {
  basicObj[key] = require(`./components/basicComponents/${key}.vue`).default
})
// 特殊组件
const specialComponents = ['wn-score']
const specialObj = {}
specialComponents.forEach(key => {
  specialObj[key] = require(`./components/specialComponents/${key}.vue`).default
})
import Sortable from 'sortablejs' // 拖拽组件
export default {
  name: 'RightIndex',
  components: { ...basicObj, ...specialObj },
  data: function() {
    return {
      idIndex: '' //
    }
  },
  props: {
    rightData: {
      type: Array,
      default: () => []
    },
    solidShowHide: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  computed: {},
  beforeDestroy() {},
  created() {},
  mounted() {
    this.setSort()
  },
  methods: {
    /**
     * 动态样式修改
     */
    styleCss(item) {
      const data = {
        width: item.obj.width + '%',
        height: item.obj.height + 'px',
        marginTop: item.obj.marginTop + 'px',
        marginBottom: item.obj.marginBottom + 'px',
        marginLeft: item.obj.marginLeft + 'px',
        marginRight: item.obj.marginRight + 'px',
        paddingTop: item.obj.paddingTop + 'px',
        paddingBottom: item.obj.paddingBottom + 'px',
        paddingLeft: item.obj.paddingLeft + 'px',
        paddingRight: item.obj.paddingRight + 'px',
        fontSize: (item.obj.fontSize || item.obj.labelFontSize) + 'px',
        color: item.obj.color
        // fontWeight: item.obj.fontWeight
      }
      // 边框是否显示
      if (!this.solidShowHide) {
        data.border = 0
      }
      return data
    },
    /**
     * input p
     * 定位
     * levelMove 水平
     * verticalMove 垂直
     */
    componentStyleCss(id, moveInput, verticalMove, levelMove) {
      this.$nextTick(() => {
        if (moveInput) {
          this.$refs[id][0].style['z-index'] = 999
          this.$refs[id][0].style.top = verticalMove + 'px'
          this.$refs[id][0].style.left = levelMove + 'px'
          this.$refs[id][0].style.position = 'absolute'
        } else {
          this.$refs[id][0].style.top = 0 + 'px'
          this.$refs[id][0].style.left = 0 + 'px'
          this.$refs[id][0].style.position = 'relative'
          this.$refs[id][0].style['z-index'] = 0
        }
      })
    },
    /**
     * 设置右边边拖拽
     */
    setSort() {
      this.sortable = Sortable.create(this.$refs.rightButton, {
        animation: 800, // 动画事件
        draggable: '.sortable', // 拖拽的class
        ghostClass: 'sortable-ghost', // 停靠的位置样式
        onEnd: evt => {
          console.dir(evt.item)
        },
        onChoose: evt => {
          this.idIndex = evt.item.dataset.id
        }
      })
    },
    /**
     * 右边组件.点击选择
     */
    selectEle(item) {
      this.$emit('selectEle', item)
    },
    /**
     * 单个组件修改按钮
     * @item 单条数据属性
     * @index 单条数据下标
     */
    editFC(item, index) {
      this.$emit('editFC', item, index)
    },
    /**
     * 单个组件删除按钮
     * @item 单条数据属性
     * @index 单条数据下标
     */
    deleteFC(item, index) {
      if (item.obj?.rule?.showList?.length > 0) {
        this.$message({
          message: '此条数据已配置规则.请先删除规则!',
          type: 'warning'
        })
        return
      }
      this.$emit('deleteFC', item, index, this.idIndex)
    },
    /**
     * 规则 组件过来出发显示隐藏
     */
    rightDataFc(itemKey, show) {
      const data = this.rightData.filter(res => {
        return res.obj.itemKey == itemKey
      })
      if (data && data[0]) {
        data[0].obj.visible = show
        data[0].obj.val = ''
        data[0].obj.score = 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rightIndex {
  padding: 0 2px;
  height: 100%;
  position: relative;
  &_div {
    width: 100%;
    float: left;
    position: relative;
    border: 1px dashed rgba(170, 170, 170, 0.5);
    padding: 5px;
    margin-top: 5px;
    .tools {
      position: absolute;
      top: 0;
      right: 0;
      width: 65px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      z-index: 10;
      color: #fff;
      cursor: pointer;
      &_edit {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #409eff;
        font-size: 25px;
      }
      &_delete {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #409eff;
        font-size: 22px;
      }
    }
  }
  &_div.checked {
    outline: 2px solid #409eff;
    border: 1px solid #409eff;
  }
}
</style>
