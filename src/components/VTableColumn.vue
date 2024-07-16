<template>
  <!--使用 slot 自定义 header-->
  <el-table-column :width="newWidth||$attrs.width" v-if="$scopedSlots.header" v-bind="$attrs" :key="$attrs.label">
    <template slot="header" slot-scope="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
    <template  slot-scope="scope">
      <slot v-bind="scope"></slot>
    </template>
  </el-table-column>
  <!--判断scopedSlots.default可知道是否存在子元素-->
  <el-table-column :width="newWidth||$attrs.width" v-else-if="$scopedSlots.default&&!$slots.default" v-bind="$attrs" :key="$attrs.label">
    <template  slot-scope="scope">
      <slot v-bind="scope"></slot>
    </template>
  </el-table-column>
  <el-table-column :width="newWidth||$attrs.width" v-else-if="$scopedSlots.default&&$slots.default" v-bind="$attrs" :key="$attrs.label">
    <slot></slot>
  </el-table-column>
  <!--默认情况使用原始 el-table-column-->
  <el-table-column :width="newWidth||$attrs.width" v-else v-bind="$attrs" :key="$attrs.label"></el-table-column>
</template>

<script>
export default {
  name: 'VTableColumn',
  props: {
    colType: {
      type: String,
      default: 'colsWidth'
    },
    tableWidth: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    newWidth() {
      const obj = localStorage.getItem(this.colType) ? JSON.parse(localStorage.getItem(this.colType)) : {}
      const newWidth = obj[`${window.location.hash + this.$attrs.prop + this.$attrs.label}`]
      let remenberWidth = ''
      if (this.tableWidth) {
        remenberWidth = this.tableWidth[`${window.location.hash + this.$attrs.prop + this.$attrs.label}`]
      }
      if (this.$attrs.prop) {
        return newWidth || remenberWidth || this.$attrs.width
      } else {
        return ''
      }
      // admin 设置的宽度
    }
  }
}
</script>
