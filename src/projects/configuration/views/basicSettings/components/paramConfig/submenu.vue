<template>
  <div>
    <!-- 有子元素 -->
    <template v-if="item.child">
      <el-submenu :class="{'highlight':item.click }" :index="item.menuCode">
        <template slot="title">
          <i class="el-icon-folder-opened"></i>
          <span>{{item.menuName}}</span>
        </template>
        <!-- 自己调用自己递归 -->
        <submenu v-for="item2 in item.child" :key="item2.menuCode" :item="item2"></submenu>
      </el-submenu>
    </template>
    <!-- 没有子元素 -->
    <template v-else>
      <el-menu-item :class="{'highlight':item.click }" :index="item.menuCode">
        <i class="el-icon-document"></i>
        <span slot="title">{{item.menuName}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    submenu: () => import('./submenu')
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {},
  beforeCreated() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  update() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法
::v-deep .highlight {
  background-color: var(--maincolor4) !important;
}
::v-deep .highlight > .el-submenu__title {
  background-color: var(--maincolor4) !important;
}
::v-deep .el-menu-item.is-active {
  color: #000 !important;
}
</style>
