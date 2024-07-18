<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <template v-if="onlyOneChild.meta">
        <app-link v-if="!isShortcut" :to="resolvePath(onlyOneChild.path)">
          <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
            <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title"
              :itemLength="item.length" />
          </el-menu-item>
        </app-link>
        <el-menu-item v-else :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }"
          @click.native.stop="redirectToPath(resolvePath(onlyOneChild.path))">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title"
            :itemLength="item.length" />
        </el-menu-item>
        <!-- <el-menu-item  :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }"
          @click.native.stop="redirectToPath(resolvePath(onlyOneChild.path))">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title"
            :itemLength="item.length" />
        </el-menu-item> -->
      </template>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"  style="text-align:left"/>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    patientInfoItem: {
      type: Object,
      default: () => {}
    },
    isShortcut: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    redirectToPath(routePath) {
      if (this.patientInfoItem?.patientInfo != null) {
        this.$store.commit('set_patientInfo', this.patientInfoItem)
        this.$router.push({ path: routePath, query: this.$route.query }) // /patient/11 找不到的路由。找不到路由，跳转第一个
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.redCircular {
  min-width: 16px;
  height: 16px;
  display: inline-flex;
  background: #f7594b;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 16px;
  font-weight: bold;
  margin-left: 8px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
::v-deep .el-submenu__title{
  text-align: left;
}
::v-deep .el-submenu .el-menu-item{
  text-align: left;
}
::v-deep .el-menu-item{
  text-align: left;
}
</style>
