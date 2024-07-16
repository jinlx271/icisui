<template>
  <div class="flex-start my-metaData" >
    <div class="metaContent" :id="divId" ></div>
  </div>
</template>

<script>
import { getKey } from '@/utils/utils'
export default {
  data() {
    return {
      scale: 1,
      value: null,
      tdContent: '元数据'
    }
  },
  computed: {
    divId() {
      // 由于按照日期创建组件 需要增加以日期来区分的id  以及 页码
      return 'metaData' + this.element?.id + 'dataStr_' + (this.element.attr.dateStr ?? 'yy') + 'curPageNum_' + (this.element.attr.curPageNum ?? '') + 'pageNum_' + (this.element.attr.pageNum ?? '')
    }
  },
  props: {
    bindValue: {},
    attr: {
      type: Object,
      default: () => ({})
    },
    propStyle: {
      type: Object
    },
    element: {
      type: Object,
      default: () => ({})
    }

  },
  watch: {
    'attr.tdContent': function() {
      this.setValue()
    },
    bindValue: {
      handler() {
        this.value = this.bindValue
        this.setValue()
      },
      immediate: true
    },
    propStyle: function() {
      document.querySelector('#' + this.divId).style.setProperty('--value-fontSize', this.propStyle.fontSize || '12px')
    }
  },
  mounted() {
    document.querySelector('#' + this.divId).style.setProperty('--value-fontSize', this.propStyle.fontSize || '12px')
  },
  methods: {
    getKey,
    // 创建Fragment
    createDocumentFragment(txt) {
      const frag = document.createRange().createContextualFragment(txt)
      return frag
    },
    setValue() {
        let tempContent = this.attr.tdContent

        const keyList = this.getKey(tempContent)
        keyList.forEach(key => {
          if (this.value && this.value[key]) {
             tempContent = tempContent.replace('${' + key + '}', this.value[key])
          }
        })

        const tableDom = this.createDocumentFragment(tempContent)
        const domlist = Array.from(tableDom.querySelectorAll('[data-expression]'))
        domlist.forEach(dom => {
          const expression = dom.getAttribute('data-expression')
          const valueList = expression.split('==')

          if (valueList[0].indexOf(',') > -1) valueList[0] = valueList[0].split(',') // 多选情况
          if (valueList[0].includes(valueList[1]) && Array.isArray(valueList[0])) {
            dom.setAttribute('checked', 'checked')
            const isShowCheckbox = dom.getAttribute('data-show-checkbox')
            const type = dom.getAttribute('type')
            if (!isShowCheckbox && type && type == 'checkbox') {
              dom.parentNode.innerHTML = '√'
            }
          } else if (valueList[0] === valueList[1] && valueList[0]) {
            dom.setAttribute('checked', 'checked')
            const isShowCheckbox = dom.getAttribute('data-show-checkbox')
            const type = dom.getAttribute('type')
            if (!isShowCheckbox && type && type == 'checkbox') {
              dom.parentNode.innerHTML = '√'
            }
          } else {
            dom.removeAttribute('checked')
            dom.removeAttribute('data-expression')
          }
        })
        // this.tdContent = tableDom
        this.$nextTick(() => {
          document.querySelector('#' + this.divId).innerHTML = ''
          document.querySelector('#' + this.divId).appendChild(tableDom)
        })
    }

  }
}
</script>

<style lang="scss" scoped>
.my-metaData{
  p {
    margin: 0 !important;
    padding:0 !important;
  }

}

</style>
