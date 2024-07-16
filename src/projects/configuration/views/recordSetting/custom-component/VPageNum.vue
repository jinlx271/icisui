<template>
  <div class="label " :style="{textAlign:propStyle.textAlign,lineHeight:propStyle.height,fontSize:propStyle.fontSize,color:propStyle.color}"   >
    <template v-if="element.attr.showBindValue">
      <template v-if="element.attr.showTotalPage=='1'" >
        <!-- <template v-if="element.attr.customValue==1&&isEdit">
          <el-input v-model="currPage"  @blur="isEdit=false"></el-input>
          {{element.attr.connectorChar}}
          <el-input v-model="totalPageNums"  @blur="isEdit=false"></el-input>
        </template> -->
        <span class="page" :contenteditable="element.attr.customValue==1"
          :style="{justifyContent:textalign[propStyle.textAlign]}"
          @keydown="keydown"
          >
          <span :vn-pagenum="currPage">{{currPage}}</span><span>{{element.attr.connectorChar+ totalPageNums}}</span>
        </span>
      </template>
      <template v-else>
        <!-- <el-input v-model="currPage" v-if="element.attr.customValue==1&&isEdit" @blur="isEdit=false"></el-input> -->
        <span class="page"  :contenteditable="element.attr.customValue==1" @keydown="keydown"
        :style="{justifyContent:textalign[propStyle.textAlign]}" :vn-pagenum="currPage">{{currPage}}</span>
      </template>
    </template>
    <template v-else>
      <span vn-pagenum>
        {{element.propValue}}
      </span>
    </template>

  </div>
</template>

<script>

export default {
  props: {
    bindValue: {
      type: String
    },
    element: {
      type: Object
    },
    propStyle: {
      type: Object
    }
  },
  data() {
    return {
      currPage: '',
      totalPageNums: '',
      isEdit: false,
      textalign: {
        'right': 'flex-end',
        'left': 'flex-start',
        'center': 'center'
      }
    }
  },
  created() {
    this.currPage = this.bindValue
    this.totalPageNums = this.element.attr.totalPageNums
  },
  methods: {
    activeEdit() {
        this.isEdit = !this.isEdit
    },
    keydown(e) {
      if (e.keyCode == '13') { // enter键完成输入
        e.preventDefault()
        e.currentTarget.blur()
        // this.$nextTick(() => {
        //   const childNodes = e.currentTarget.childNodes
        //   childNodes.forEach(item => {
        //     if (item.nodeName == 'DIV') { e.currentTarget.removeChild(item) }
        //   })
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.page{
  display: flex;
  &:focus{
     border: 2px solid var(--maincolor);
  }

}
// 页码输入状态 样式
  [contenteditable="true"]  {
    outline: none;
    &:focus{
      border-radius: 4px;
      background: #fff;
      border: 1px solid var(--maincolor);
    }
  }
</style>
