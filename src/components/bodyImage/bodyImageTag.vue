<template>
  <div :class="lineCss" :style="showPosiImage ? divStyle : {}" ref="line">
    <template v-if="isPrint">
      <el-tag slot="reference" :class="`imageTag-${imageItem.direction} ${isPrint ? 'is-print' : ''}`" :style="tagStyle">
        {{ tagLables }}
      </el-tag>
    </template>
    <template v-else>
      <el-popover placement="bottom-end" width="300" trigger="hover" v-if="type == 'catheter'">
        <div style="max-height:230px; overflow-y:auto">
          <div v-for="(item, index) in pipeInfos" :key="item.catheterRecordId"
            :style="index == pipeInfos.length - 1 ? { 'padding-bottom': '10px', 'padding-top': '10px' } : { 'border-bottom': '1px solid #ddd', 'padding-bottom': '10px', 'padding-top': '10px' }">

            <div><span class="label">管路类型:</span>{{ item['catheterName'] }}</div>
            <div><span class="label">管路编号:</span>{{ item['catheterCode'] }}</div>
            <div v-if="item['leakageLength']"><span class="label">外露长度:</span>{{ item['leakageLength'] + 'cm' }}</div>
            <div v-if="item['startTime']"><span class="label">置管时间:</span>{{ item['startTime'] }}</div>
            <div v-if="item['planDuration'] || item['endTime']"><span class="label">计划更换/拔管时间:
              </span>{{ item.planEndTime || item['endTime'] }}</div>

          </div>
        </div>
        <template slot="reference">
          <el-tag :class="`tagLabel imageTag-${imageItem.direction}`" v-if="showTag" :style="tagStyle" ref="tag">
            {{ tagLables }}
          </el-tag>
          <div v-else :class="'circle-' + imageItem.direction" :style="divStyle"></div>
        </template>

      </el-popover>
      <el-popover placement="bottom-end" width="300" trigger="hover" v-if="type == 'skin'">
        <div style="max-height:230px; overflow-y:auto">
          <div v-for="(item, index) in pipeInfos" :key="item.catheterRecordId"
            :style="index == pipeInfos.length - 1 ? { 'padding-bottom': '10px', 'padding-top': '10px' } : { 'border-bottom': '1px solid #ddd', 'padding-bottom': '10px', 'padding-top': '10px' }">
            <div v-if="item['skinType']"><span class="label">皮肤类型:</span>{{ item['skinType'] | showDictNameFilter(ICIS_DICT_SKIN_TYPES, 'dictCode_to_dictName') }}</div>
            <div><span class="label">部位名称:</span>{{ item['skinPosiDictName'] }}</div>
            <div v-if="item['areaLength'] && item['areaWidth']"><span class="label">面积:</span>{{ item['areaLength'] +
              'cm*' + item['areaWidth'] + 'cm' }}</div>
            <div v-if="item['pressureStagesDictName']"><span class="label">分期:</span>{{ item['pressureStagesDictName'] }}
            </div>
            <!-- <div><span class="label">渗液量:</span>{{item['leakageLength']}}</div> -->
            <div v-if="item['push']"><span class="label">PUSH评分:</span>{{ item['push'] }}</div>

          </div>
        </div>

        <el-tag slot="reference" :class="`tagLabel imageTag-${imageItem.direction}`" :style="tagStyle" v-if="showTag"
          ref="tag">
          {{ tagLables }}
        </el-tag>
        <div slot="reference" v-else :class="'circle-' + imageItem.direction" :style="divStyle"></div>
      </el-popover>
      <el-tag slot="reference" :class="`imageTag-${imageItem.direction}`" :style="tagStyle" v-else-if="type == 'skin'">
        {{ tagLables }}
      </el-tag>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BodyImageTag',
  components: {},
  filters: {},
  data: function () {
    return {
      ICIS_DICT_SKIN_TYPES: []
    }
  },
  props: {
    isBabyBody: {
      type: Boolean, // 是否显示部位图片
      default: false
    },
    showPosiImage: {
      type: Boolean, // 是否显示部位图片
      default: true
    },
    showTag: {
      type: Boolean, // 是否显示部位图片
      default: true
    },
    fontSize: {
      type: Number,
      default: 14
    },
    // 显示类型  目前有导管 皮肤等数据
    type: {
      type: String,
      default: ''
    },
    imageItem: {
      type: Object // 选中的人体切片信息
    },
    pipeInfos: {
      type: Array // 切片对于的导管信息集合
    },
    bodyLeft: {
      type: Number, // 是否显示部位图片
      default: null
    },
    domItem: {
      type: Object, // 是否显示部位图片
      default: () => { }
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    printBodyImageScale: {
      type: Number, // 缩放比例
      default: 1
    }
  },
  watch: {
    pipeInfos: function () {
      this.$nextTick(() => {
        this.resetWidth()
      })
    }
  },
  computed: {
    'lineCss': function () {
      let cssStr = ''
      if (this.showPosiImage) {
        cssStr += (' line-' + this.imageItem.direction)
      }
      if (this.isPrint) {
        cssStr += ' pointNone'
      }
      return cssStr
    },
    tagStyle() {
      const lineWidth = this.imageItem.lineWidth
      if (this.isPrint) {
        const printStyle = {
          color: 'inherit',
          fontSize: `${(this.fontSize / this.printBodyImageScale)}px`,
          lineHeight: `${(this.fontSize / this.printBodyImageScale) + 6}px`,
          border: 'none',
          background: 'none'
        }
        if (this.imageItem.direction === 'right') {
          return {
            marginRight: `${lineWidth}px`,
            width: 'max-content',
            maxWidth: '130px',
            textAlign: 'right',
            ...printStyle
          }
        } else {
          return {
            left: `${lineWidth}px`,
            width: 'max-content',
            maxWidth: '130px',
            textAlign: 'left',
            ...printStyle
          }
        }
      } else {
        if (this.imageItem.direction === 'right') {
          return 'margin-right:' + lineWidth + 'px;font-size:' + this.fontSize + 'px;line-height:' + (this.fontSize + 6) + 'px;' + (this.bodyLeft ? 'width:max-content;max-width:130px;' : 'width:max-content;max-width:130px;')
        } else {
          return 'left:' + lineWidth + 'px;font-size:' + this.fontSize + 'px;line-height:' + (this.fontSize + 6) + 'px;width:max-content;max-width:130px;'
        }
      }
    },
    divStyle() {
      const lineWidth = this.imageItem.lineWidth
      const itemStyle = this.imageItem.style

      if (this.showPosiImage) {
        if (this.imageItem.direction === 'right') {
          return (
            'width:' + lineWidth + 'px;left:-' + lineWidth + 'px;' + itemStyle
          )
        } else {
          return 'width:' + lineWidth + 'px;' + itemStyle
        }
      } else {
        // +
        if (this.imageItem.direction === 'right') {
          return (
            'width:30px;height:30px;left:-5px;background-color:' + (this.type == 'catheter' ? 'rgb(39,94,252)' : 'rgb(243,45,45)') + ';' + itemStyle
          )
        } else {
          return 'width:30px;height:30px;margin-left:-10px;background-color:' + (this.type == 'catheter' ? 'rgb(39,94,252)' : 'rgb(243,45,45)') + ';' + itemStyle
        }
      }
    },
    tagLables() {
      const pipeList = this.pipeInfos
      if (pipeList && pipeList.length > 0) {
        // const posiId = []
        const tagLables = []
        pipeList.forEach((element) => {
          const pipeposiname = element.posiDictName || element.skinPosiDictName

          if (this.type == 'catheter') { // 导管  需要显示导管名称
            tagLables.push(element.catheterName)
          } else {
            tagLables.push(pipeposiname)
          }
        })
        return tagLables.toString()
        // return pipeList[0].pipeposiname
      }
      return this.imageItem.tagLable
    }
  },
  async created() {
    if (this.type == 'skin') {
      const batchDictObj = await this.$batchGetDictItemList(['ICIS_DICT_SKIN_TYPES'])
      this.ICIS_DICT_SKIN_TYPES = batchDictObj['ICIS_DICT_SKIN_TYPES']
    }
  },
  mounted() {
    this.resetWidth()
  },
  methods: {
    getLeftToBody(obj) {
      var t = obj?.offsetTop // 获取该元素对应父容器的上边距
      var l = obj?.offsetLeft // 对应父容器的上边距
      // 判断是否有父容器，如果存在则累加其边距

      while (obj != document.body && obj != null) { // 等效 obj = obj.offsetParent;while (obj != undefined)
        obj = obj.offsetParent
        t += obj?.offsetTop // 叠加父容器的上边距
        l += obj?.offsetLeft // 叠加父容器的左边距
      }
      return {
        t, l
      }
    },
    resetWidth() {
      if (this.$refs?.tag?.$el) { // tag的标签
        const { l } = this.getLeftToBody(this.$refs?.tag?.$el) // 获取tag的绝对位置
        // 获取tag的left值
        if (!this.isBabyBody && l + 15 < this.bodyLeft) {
          this.$refs.tag.$el.style.width = (l + 15) + 'px'
        } else if (l + 15 < this.bodyLeft) {
          this.$refs.tag.$el.style.width = (l - 5) + 'px'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tag {
  white-space: normal;
  height: fit-content;
}

.line-left {
  border-bottom: 1px solid crimson;
  position: absolute;
  top: 0%;
  right: 0px;
  bottom: 50%;
  margin: auto;
  left: 50%;
  // pointer-events: none;
}

.circle-left {
  border-radius: 50%;
  position: absolute;
  top: 0%;
  right: 0px;
  bottom: 50%;
  margin: auto;
  left: 50%;
}

.circle-right {
  border-radius: 50%;
  position: absolute;
  top: 0%;
  right: 0%;
  bottom: 50%;
  margin: auto;
}

.imageTag-left {
  position: absolute;
  margin: auto;
  margin-left: 1px;
  top: 100%;
  bottom: 0%;
  right: 0px;
  line-height: 12px;
  ;
  width: fit-content;
  padding: 3px;

  &:hover {
    z-index: 999;
    box-shadow: 0px 2px 15px rgba(42, 59, 80, 0.8);
  }

  &.is-print:hover {
    box-shadow: none;
  }
}

.line-right {
  border-bottom: 1px solid crimson;
  position: absolute;
  top: 0%;
  right: 0%;
  bottom: 50%;
  margin: auto;
  // pointer-events: none;
}

.imageTag-right {
  position: absolute;
  margin: auto;
  top: 100%;
  bottom: 0%;
  right: 1px;
  line-height: 12px;
  ;
  width: fit-content;
  padding: 3px;

  &:hover {
    z-index: 999;
    box-shadow: 0px 2px 15px rgba(42, 59, 80, 0.8);
  }

  &.is-print:hover {
    box-shadow: none;
  }
}

.tagLabel {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //（行数）
  -webkit-box-orient: vertical;
}

.pointNone {
  pointer-events: none;
}
</style>
