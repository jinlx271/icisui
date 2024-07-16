<template>
  <div @dragstart="handleDragStart" class="component-list">
    <h4 class="w100">公用组件</h4>
    <div v-for="(item, index) in commonList" :class="{myselected:criticlalRecordId?(item.criticlalRecordId==criticlalRecordId):(curComponent&&curComponent.name&&item.name==curComponent.name)}" :key="item.name" @mousedown="mouseDown" class="list" draggable data-type="commonList" :data-index="index">
      <span>{{ item.name }}</span>
    </div>
    <el-divider></el-divider>
    <div v-for="(item, index) in ICIS_DICT_MONI_SVG" :title="item.dictName" :key="item.dictId" @mousedown="mouseDown" data-type="ICIS_DICT_MONI_SVG" class="list" draggable
         :data-index="index">
      <svg width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px" y="0px"
           viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;pointer-events: none;" xml:space="preserve">
        <path :d="item.dictAbbr" />
      </svg>
    </div>
    <el-divider></el-divider>
    <h4 class="w100">
      <div class="flex align-items-center flex-between">其他组件 <el-input class="input" v-model="searchKey" size="small" clearable placeholder="表格组件" suffix-icon="el-icon-search" style="width:140px;"></el-input></div>
    </h4>
    <div class="wrapMode" v-loading="loading" element-loading-text="加载中">
      <div v-for="item in filterList" :title="item.name" :key="item.criticlalRecordId" :class="{myselected:criticlalRecordId?(item.criticlalRecordId==criticlalRecordId):(curComponent&&curComponent.name&&item.name==curComponent.name)}" @mousedown="mouseDown" class="list" draggable data-type="componentList"
           :data-index="item.criticlalRecordId">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  commonList
} from '../custom-component/component-list'
import {
  getDomPositionByClass
} from '@/utils/utils'
export default {
  data() {
    return {
      componentList: [],
      commonList,
      startX: '',
      startY: '',
      loading: false,
      searchKey: ''
    }
  },
  computed: {
    curComponent() {
      return this.$store.state.formCreator.curComponent
    },
    criticlalRecordId() {
      return this.$store.state.formCreator?.curComponent?.criticlalRecordId
    },
    filterList() {
      return this.componentList.filter(item => {
        if (this.searchKey) {
          return item.name.indexOf(this.searchKey) > -1
        } else return true
      })
    }
  },
  props: {
    ICIS_DICT_MONI_SVG: {},
    fieldsList: {},
    // 扩展组件
    extendList: {
      type: Array

    }
  },
  watch: {
    fieldsList: {
      handler() {
        if (this.fieldsList) {
          if (this.extendList.length > 0) {
            this.componentList = this.componentList.concat(this.extendList)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleLoading(bool) {
      this.loading = bool
    },
    handleDragStart(e) {
      e.dataTransfer.setData('index', e.target.dataset.index)
      e.dataTransfer.setData('type', e.target.dataset.type)
      e.dataTransfer.setData('startX', this.startX)
      e.dataTransfer.setData('startY', this.startY)
    },
    mouseDown(e) {
      const position = getDomPositionByClass(e.target)
      // const pageX=e.pageX,
      // const pageY=e.pageY
      const { pageX, pageY } = e
      this.startX = pageX - position.offsetLeft
      this.startY = pageY - position.offsetTop
    }
  }
}
</script>

<style lang="scss" scoped>
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  .wrapMode {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .list {
    width: 45%;
    height: 40px;
    border: 1px solid #c0c4cc;
    cursor: grab;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 5px;
    border-radius: 4px;
    max-width: 92px;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    &:active {
      cursor: grabbing;
    }
  }
  h4 {
    margin: 0;
    margin-bottom: 10px;
  }
  .myselected{
     background-color: silver;
  }
}
</style>
