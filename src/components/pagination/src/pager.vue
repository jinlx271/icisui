<template>
  <ul @click="onPagerClick" class="el-pager">
    <li
      :class="{ active: currentPage === 1, disabled }"
      v-if="pageCount > 0"
      class="number" :data="1">1~{{pageSize}}</li>
    <li
      class="el-icon more btn-quickprev"
      :class="[quickprevIconClass, { disabled }]"
      v-if="showPrevMore"
      @mouseenter="onMouseenter('left')"
      @mouseleave="quickprevIconClass = 'el-icon-more'">
    </li>
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="{ active: currentPage === pager, disabled }"
      class="number" :data="pager">{{ (pager-1)*pageSize +1}} ~ {{ (pager-1)*pageSize+pageSize}}</li>
    <li
      class="el-icon more btn-quicknext"
      :class="[quicknextIconClass, { disabled }]"
      v-if="showNextMore"
      @mouseenter="onMouseenter('right')"
      @mouseleave="quicknextIconClass = 'el-icon-more'">
    </li>
    <li
      :class="{ active: currentPage === pageCount, disabled }"
      class="number"
      v-if="pageCount > 1" :data="pageCount">{{ (pageCount-1)*pageSize+1 }} ~ {{total}}</li>
  </ul>
</template>

<script type="text/babel">
  export default {
    name: 'ElPager',

    props: {
      pageSize: Number,

      currentPage: Number,

      pageCount: Number,

      pagerCount: Number,

      disabled: Boolean,

      total: Number
    },

    watch: {
      showPrevMore(val) {
        if (!val) this.quickprevIconClass = 'el-icon-more'
      },

      showNextMore(val) {
        if (!val) this.quicknextIconClass = 'el-icon-more'
      }
    },

    methods: {
      onPagerClick(event) {
        const target = event.target
        if (target.tagName === 'UL' || this.disabled) {
          return
        }

        let newPage = Number(event.target.getAttribute('data'))
        const pageCount = this.pageCount
        const currentPage = this.currentPage
        const pagerCountOffset = this.pagerCount - 2

        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - pagerCountOffset
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + pagerCountOffset
          }
        }

        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1
          }

          if (newPage > pageCount) {
            newPage = pageCount
          }
        }
        if (newPage !== currentPage) {
          this.$emit('change', newPage)
        }
      },

      onMouseenter(direction) {
        if (this.disabled) return
        if (direction === 'left') {
          this.quickprevIconClass = 'el-icon-d-arrow-left'
        } else {
          this.quicknextIconClass = 'el-icon-d-arrow-right'
        }
      }
    },

    computed: {
      pagers() {
        /* eslint-disable */
        const pagerCount = this.pagerCount
        const halfPagerCount = (pagerCount - 1) / 2

        const currentPage = Number(this.currentPage)
        const pageCount = Number(this.pageCount)

        let showPrevMore = false
        let showNextMore = false

        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - halfPagerCount) {
            showPrevMore = true
          }

          if (currentPage < pageCount - halfPagerCount) {
            showNextMore = true
          }
        }

        const array = []

        if (showPrevMore && !showNextMore) {
          const startPage = pageCount - (pagerCount - 2)
          for (let i = startPage; i < pageCount; i++) {
            array.push(i)
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = 2; i < pagerCount; i++) {
            array.push(i)
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(pagerCount / 2) - 1
          for (let i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i)
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i)
          }
        }
        this.showPrevMore = showPrevMore
        this.showNextMore = showNextMore
        return array
      }
    },

    data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 'el-icon-more',
        quickprevIconClass: 'el-icon-more'
      }
    }
  }
</script>
