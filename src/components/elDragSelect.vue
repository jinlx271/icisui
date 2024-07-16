<template>
  <el-select ref="dragSelect" v-model="selectVal" v-bind="$attrs" placeholder="请选择" class="drag-select" multiple v-on="$listeners">
    <slot />
  </el-select>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'DragSelect',
  props: {
    value: {
      required: true
    }
  },
  computed: {
    selectVal: {
      get() {
        return this.value?.length ? [...this.value] : []
      },
      set(val) {
        this.$emit('input', [...val])
      }
    }
  },
  mounted() {
    if (this.value?.length) {
      this.setSort()
    }
  },
  methods: {
    setSort() {
      const el = this.$refs.dragSelect?.$el?.querySelectorAll(
        '.el-select__tags > span'
      )?.[0]
      if (!el) {
        return
      }
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt) => {
          const _this = this
          const targetRow = this.value?.splice(evt.oldIndex, 1)[0]
          this.value?.splice(evt.newIndex, 0, targetRow)
          _this.$emit('change', this.value)
        }
      })
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (!(oldVal?.length) && newVal?.length) {
        this.setSort()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-select {
  ::v-deep {
    .sortable-ghost {
      opacity: 0.8;
      color: #fff !important;
      background: #42b983 !important;
    }

    .el-tag {
      cursor: pointer;
    }
  }
}
</style>
