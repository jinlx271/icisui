<template>
  <div class="label " :style="{textAlign:propStyle.textAlign,lineHeight:propStyle.height,fontSize:propStyle.fontSize,color:propStyle.color}"   >
    <template v-if="element.attr.showBindValue">
        <span class="page"  :contenteditable="element.attr.customValue==1" @keydown="keydown"
        :style="{justifyContent:textalign[propStyle.textAlign]}"
        >{{bindValue}}</span>
    </template>
    <template v-else>
      {{element.propValue}}
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
    keydown(e) {
      if (e.keyCode == '13') { // enter键完成输入
        e.preventDefault()
        e.currentTarget.blur()
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
