<!-- 解决table bug，固定fixed滚动条 -->
<!-- 如果出现问题的，可以使用xTable来解决 -->
<template>
  <div class="el-table" :class="[{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border || isGroup,
      'el-table--hidden': isHidden,
      'el-table--group': isGroup,
      'el-table--fluid-height': maxHeight,
      'el-table--scrollable-x': layout.scrollX,
      'el-table--scrollable-y': layout.scrollY,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }, tableSize ? `el-table--${ tableSize }` : '']" @mouseleave="handleMouseLeave($event)">
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>
    <div v-if="showHeader" v-mousewheel="handleHeaderFooterMousewheel" class="el-table__header-wrapper" ref="headerWrapper">
      <table-header ref="tableHeader" :store="store" :border="border" :default-sort="defaultSort" :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-header>
    </div>
    <div class="el-table__body-wrapper" ref="bodyWrapper" :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
         :style="[bodyHeight,cssVars]">
      <table-body :context="context" :store="store" :stripe="stripe" :row-class-name="rowClassName" :row-style="rowStyle"
                  :highlight="highlightCurrentRow" :style="{
           width: bodyWidth
        }">
      </table-body>
      <div v-if="!data || data.length === 0" class="el-table__empty-block" ref="emptyBlock" :style="emptyBlockStyle">
        <span class="el-table__empty-text">
        </span>
      </div>
      <div v-if="$slots.append" class="el-table__append-wrapper" ref="appendWrapper">
        <slot name="append"></slot>
      </div>
    </div>
    <div v-if="!data || data.length === 0" class="el-table__empty-block" ref="emptyBlock" :style="[bodyHeight, {
          position:'absolute',
          top: layout.headerHeight - (layout.scrollX ? scrollbarHeight : 0) + 'px'
        }]">
      <span class="el-table__empty-text">
        <slot name="empty">
          <span v-if="defaultText" > {{ emptyText || t('el.table.emptyText') }}</span>
          <el-empty v-else ></el-empty>
        </slot>
      </span>
    </div>
    <div v-if="showSummary" v-show="data && data.length > 0" v-mousewheel="handleHeaderFooterMousewheel" class="el-table__footer-wrapper"
         style="margin-top: 0px" ref="footerWrapper">
      <table-footer :store="store" :border="border" :sum-text="sumText || t('el.table.sumText')" :summary-method="summaryMethod"
                    :default-sort="defaultSort" :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }">
      </table-footer>
    </div>
    <div v-if="fixedColumns.length > 0" v-mousewheel="handleFixedMousewheel" class="el-table__fixed" ref="fixedWrapper" :style="[{
        width: layout.fixedWidth ? layout.fixedWidth + 'px' : ''
      },
      fixedHeight]">
      <div v-if="showHeader" class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper">
        <table-header ref="fixedTableHeader" fixed="left" :border="border" :store="store" :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body fixed="left" :store="store" :stripe="stripe" :highlight="highlightCurrentRow" :row-class-name="rowClassName" :row-style="rowStyle"
                    :style="{
            width: bodyWidth
          }">
        </table-body>
        <div v-if="$slots.append" class="el-table__append-gutter" :style="{ height: layout.appendHeight + 'px'}"></div>
      </div>
    </div>
    <div v-if="fixedColumns.length > 0 && showSummary" v-show="data && data.length > 0" class="el-table__fixed-footer-wrapper"
         ref="fixedFooterWrapper" :style="{
            width: layout.fixedWidth ? layout.fixedWidth + 'px' : '',
            overflow: 'hidden'
          }">
      <table-footer fixed="left" :border="border" :sum-text="sumText || t('el.table.sumText')" :summary-method="summaryMethod" :store="store" :style="{
            width: bodyWidth,
          }"></table-footer>
    </div>
    <div v-if="rightFixedColumns.length > 0" v-mousewheel="handleFixedMousewheel" class="el-table__fixed-right" ref="rightFixedWrapper" :style="[{
        width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
        right: layout.scrollY ? (border ? (scrollbarWidth - 3) : (scrollbarWidth || 0)) + 'px' : ''
      },
      fixedHeight]">
      <div v-if="showHeader" class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper">
        <table-header ref="rightFixedTableHeader" fixed="right" :border="border" :store="store" :style="{
            width: bodyWidth
          }"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" :style="[{
          top: layout.headerHeight + 'px'
        },
        fixedBodyHeight]">
        <table-body fixed="right" :store="store" :stripe="stripe" :row-class-name="rowClassName" :row-style="rowStyle"
                    :highlight="highlightCurrentRow" :style="{
            width: bodyWidth
          }">
        </table-body>
        <div v-if="$slots.append" class="el-table__append-gutter" :style="{ height: layout.appendHeight + 'px' }"></div>
      </div>
    </div>
    <div v-if="rightFixedColumns.length > 0 && showSummary" v-show="data && data.length > 0" class="el-table__fixed-right" ref="fixedFooterWrapper"
         :style="{
            width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',left: 'auto',top: 'auto',bottom: '0',
            right: layout.scrollY ? (border ? scrollbarWidth : (scrollbarWidth || 0)) + 'px' : 0,
            height: layout.footerHeight + 'px',
            overflow: 'hidden'
          }">
      <div class="el-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper" :style="[{
        left: 'auto',
        right: layout.scrollY ? (border ? scrollbarWidth : (scrollbarWidth || 0)) + 'px' : 0
      }]">
        <table-footer fixed="right" :border="border" :sum-text="sumText || t('el.table.sumText')" :summary-method="summaryMethod" :store="store"
                      :style="{
              width: bodyWidth
            }"></table-footer>
      </div>
    </div>
    <div v-if="rightFixedColumns.length > 0" class="el-table__fixed-right-patch" ref="rightFixedPatch" :style="{
        width: layout.scrollY ? scrollbarWidth + 'px' : '0',
        height: layout.headerHeight + 'px'
      }"></div>
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>
<script>
import ELTable from 'element-ui/lib/table'

export default {
  extends: ELTable,
  name: 'ElTable',
  props: {
    defaultText: {
      type: Boolean,
      default: false
    },
    barHeight: {
      type: [Number, String], // 滚动条高度
      default: 12
    },
    barWidth: {
      type: [Number, String], // 滚动条宽度
      default: 11
    },
    redHeight: {
      type: [Number, String], // 滚动条宽度
      default: 1
    }
  },
  watch: {
    data(v) {
      if (v && v.length > 0) {
        if (this.fixedColumns.length > 0 && this.showSummary) {
          this.$nextTick().then(async () => {
            this.layout.updateElsHeight()
            await this.$nextTick()
            this.layout.updateElsHeight()
          })
        }
      }
    }
  },
  computed: {
    scrollbarHeight() {
      return this.layout.gutterWidth >= 17 ? this.layout.gutterWidth : this.barHeight
    },
    scrollbarWidth() {
      return this.layout.gutterWidth >= 17 ? this.layout.gutterWidth : this.barWidth
    },
    cssVars() {
      return {
        '--scrollbarHeight': this.scrollbarHeight + 'px',
        '--scrollbarWidth': this.scrollbarWidth + 'px'
      }
    },
    fixedBodyHeight() {
      if (this.height) {
        return {
          height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight - (this.scrollbarHeight >= 17 ? 0 : this.scrollbarHeight - 10) + 'px' : ''
        }
      } else if (this.maxHeight) {
        let maxHeight = this.parseHeight(this.maxHeight)
        if (typeof maxHeight === 'number') {
          maxHeight = this.layout.scrollX ? maxHeight - this.scrollbarHeight : maxHeight
          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight
          }
          maxHeight -= this.layout.footerHeight
          return {
            'max-height': maxHeight + 'px'
          }
        }
      }
      return {}
    },
    fixedHeight() {
      if (this.maxHeight) {
        if (this.showSummary) {
          return {
            height: this.layout.tableHeight ? this.layout.tableHeight - this.layout.footerHeight - (this.layout.scrollX ? this.scrollbarHeight : 0) - this.redHeight + 'px' : ''
          }
        }
        return {
          bottom: this.layout.scrollX && this.data.length ? this.scrollbarHeight + 'px' : ''
        }
      } else {
        if (this.showSummary) {
          return {
            height: this.layout.tableHeight ? this.layout.tableHeight - this.layout.footerHeight - (this.layout.scrollX ? this.scrollbarHeight : 0) - this.redHeight + 'px' : ''
          }
        }
        return {
          height: this.layout.scrollX ? 'auto' : this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : '',
          bottom: this.layout.scrollX ? this.scrollbarHeight + 'px' : ''
        }
      }
    },
    bodyHeight() {
      const { headerHeight = 0, bodyHeight, footerHeight = 0 } = this.layout
      if (this.height) {
        if (this.showSummary) {
          return {
            height: this.layout.scrollX ? (bodyHeight ? bodyHeight - this.redHeight + 'px' : '') : bodyHeight ? bodyHeight + 'px' : ''
          }
        }
        return {
          height: bodyHeight ? bodyHeight + 'px' : ''
        }
      } else if (this.maxHeight) {
        const maxHeight = this.parseHeight(this.maxHeight)
        if (typeof maxHeight === 'number') {
          return {
            'max-height': (maxHeight - footerHeight - (this.showHeader ? headerHeight : 0) - this.redHeight) + 'px'
          }
        }
      }
      return {}
    }
  },
  methods: {
    parseHeight(height) {
      if (typeof height === 'number') {
        return height
      }
      if (typeof height === 'string') {
        if (/^\d+(?:px)?$/.test(height)) {
          return parseInt(height, 10)
        } else {
          return height
        }
      }
      return null
    }
  }
}
</script>
<style scoped lang="scss">
.imgwrap{
  height: 100%;
  line-height: 30px;
  // >div{
  //   height: 33%;
  //   >img{
  //    height: calc(100% - 30px);
  //   }
  // }
  // .el-empty{
  //   height: 100%;
  // }
}
.el-table__empty-text{
  line-height: 30px;
  .el-empty__description{
  margin-top: 0px;

  }
}
</style>
