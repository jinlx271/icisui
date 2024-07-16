<template>
  <BodyImage v-if="isEdit" :isBabyBody="element.attr.bodyType == 1" class="backImag" :type="element.attr.bodyImageType"
    :isPrint="true" :bodyFront.sync="!element.attr.bodyFront" :style="resultStyle" :showLabel="true" ref="bodyImage"
    :bodyLeft='180' :showConvert="false" :fontSize="parseInt(resultStyle.fontSize)"
    :printBodyImageScale="printBodyImageScale" />
  <div v-else :style="propStyle">
    <BodyImage :isBabyBody="element.attr.bodyType == 1" class="backImag" :age="element.attr.age" :sex="element.attr.sex"
      :type="element.attr.bodyImageType" :isPrint="true" :bodyFront.sync="!element.attr.bodyFront" :style="resultStyle"
      :showLabel="true" ref="bodyImage" :bodyLeft='180' :showConvert="false" :fontSize="parseInt(resultStyle.fontSize)"
      :printBodyImageScale="printBodyImageScale" />
  </div>
</template>

<script>
import BodyImage from '@/views/patient/components/pipelineCare/bodyImage'
export default {
  components: {
    BodyImage
  },
  data() {
    return {
      resultStyle: {},
      printBodyImageScale: 1
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    propStyle: {
      type: Object,
      default: () => ({})
    },
    element: {
      type: Object
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.printBodyImageScale = parseInt(this.propStyle.height) / 768
      Object.keys(this.propStyle).forEach(item => {
        if (!['width', 'height', 'transform', 'top', 'left'].includes(item)) {
          this.resultStyle[item] = this.propStyle[item]
        }
      })
      if (!this.isEdit) {
        this.$set(this.resultStyle, 'transform', `scale(${this.printBodyImageScale})  translateX(-50%)`)
        this.$set(this.resultStyle, 'transform-origin', 'left top')
        this.$set(this.resultStyle, 'left', '50%')
      }
      if (this.element.isNeedGetData) {
        const list = this.element.attr.curPageData
        const hunanObject = {}
        list.forEach((item, index) => {
          const humanId = item.humanId
          let pipeList = hunanObject[humanId]
          if (!pipeList) {
            pipeList = []
            hunanObject[humanId] = pipeList
          }
          pipeList.push(item)
        })
        this.$refs.bodyImage.setDefaultSeleced(hunanObject)
      }
    })
  }
}
</script>
