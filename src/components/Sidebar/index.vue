<template>
  <div class="scrollbar-wrapper">
    <el-header class="flex r_c_center" >
      <el-input placeholder="菜单名称" size="small" clearable suffix-icon="el-icon-search" v-model="filterText"  v-if="activeMenu.indexOf('configuration') > -1">
      </el-input>
    </el-header>
    <el-scrollbar style="flex:1">
      <el-menu :default-active="activeMenu" :background-color="variables.menuBg" :text-color="variables.menuText"
        :unique-opened="false" :default-openeds="openeds" mode="vertical" ref="menu">
        <sidebar-item v-for="route in filterMenu" :isShortcut="isShortcut" :key="route.path" :item="route"
          :base-path="route.path" :patientInfoItem="patientInfoItem" />
        <template v-if="isShortcut">
          <sidebar-item v-for="route in otherRoutes" :isShortcut="isShortcut" :key="route.path" :item="route"
            :base-path="route.path" :patientInfoItem="patientInfoItem" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import _ from 'lodash'
import { concern_queryConcernMatterCounts } from '@/api/news'
import path from 'path'
import { isExternal } from '@/utils/validate'
export default {
  components: { SidebarItem },
  props: {
    isShortcut: {
      type: Boolean,
      default: false
    },
    shortcutRootPath: {
      type: String,
      default: '/patient'
    },
    patientInfoItem: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      routes: [],
      selectName: [
        { name: '管路护理', value: 'catheter' },
        { name: '液体平衡', value: 'fluid' },
        { name: '监护数据', value: 'monitor' },
        { name: '医嘱执行', value: 'orderExe' },
        { name: '患者评估', value: 'patientAssess' }
        // { name: '医嘱提取', value: 'orderExtract医嘱提取' } 不在菜单内.可以不用做
      ],
      rootPath: '', // 当前url的路由
      targetRoutes: '', // 菜单里面找出来 1级菜单
      XTCS0021List: [], // 系统参数控制是否显示提醒
      filterText: '',
      openeds: []
    }
  },
  created() {
    this.init()
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryConcernFC()
    }, 5000)
  },
  mounted() { },
  watch: {
    activeMenu(val) {
      if (val.indexOf('configuration/') == -1) {
        this.filterText = ''
      }
      // 调用changeRouter
      // 切换患者,搜索条件保存
      sessionStorage.removeItem('patientInfoSelect')
      this.pathFc()
    },
    /**
     * 监控请求是否有变化 5s去请求
     */
    patientRoute(val) {
      if (val) {
        this.debounceFC() // 截流
      }
    },
    filterMenu: {
      immediate: true,
      handler(newValue) {
        if (newValue.length > 0 && this.filterText) {
          newValue.forEach(item => {
            this.$refs.menu.openMenu(item.path)
          })
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'mainMenu', 'patientInfo', 'patientRoute']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    filterMenu() {
      const routes = JSON.parse(JSON.stringify(this.routes))
      if (!this.filterText) {
        return routes
      }
      const tempRoutes = routes.map(item => {
        if (item.meta.title.indexOf(this.filterText) > -1) {
          return item
        } else {
          item.children = item.children.filter(c => c.meta.title.indexOf(this.filterText) > -1)
        }

        return item
      })
      return tempRoutes.filter(item => {
        if (item.meta.title.indexOf(this.filterText) > -1) return true
        else if (item.children.length > 0) {
          return true
        } else return false
      })
    },
    otherRoutes() {
      const routes = []
      if (this.filterMenu.length) {
        routes.push(
          {
            path: `${this.filterMenu[0].path}?isShowAKeyToRescue=true`,
            name: 'aKeyToRescue',
            meta: {
              title: '一键抢救'
            }
          }
        )
        // 护理记录
        const authRoute = ['监护数据', '医嘱执行', '液体平衡', '管路护理', '皮肤管理', '口腔管理', '患者评估', '护理文书', '营养管理']
        let firstAuthRoute = null
        this.filterMenu.forEach(item => {
          if (!firstAuthRoute && authRoute.includes(item.meta.title)) {
            firstAuthRoute = item
            routes.push(
              {
                path: `${item.path}?isShowNurseRecord=true`,
                name: 'nurseRecord',
                meta: {
                  title: '护理记录'
                }
              }
            )
          }
        })
      }
      // [
      //   // 护理记录
      //   {
      //     path: '/patient/monitoringData?isShowNurseRecord: true',
      //     name: 'nurseRecord',
      //     meta: {
      //       title: '护理记录'
      //     }
      //   }
      // ]
      return routes
    }
  },
  methods: {
    /**
     * 初始化接口
     * 应老付要求.进来每一个接口调用一次
     */
    async init() {
      this.XTCS0021List = await this.$queryParam({
        paramGroupCode: 'XTCS',
        paramCode: 'XTCS0021'
      })
      this.pathFc()
      this.queryConcernFC()
    },
    /**
     * 代办事件请求
     */
    queryConcernFC() {
      if (!this.patientInfo.icuRecordId || this.rootPath != '/patient') {
        return
      }
      const objName = {
        '待办事项': 'backlog',
        '待入区患者数': 'stayInICU',
        '待出区患者数': 'toBeOutICU',
        '监护数据': 'monitor',
        '医嘱执行': 'orderExe',
        '提取医嘱': 'orderExtract',
        '液体平衡': 'fluid',
        '管路护理': 'catheter',
        '患者评估': 'patientAssess'
      }
      // 代办事项处理
      concern_queryConcernMatterCounts({
        icuRecordId: this.patientInfo.icuRecordId || '' // 个人信息查询
      }).then(res => {
        if (!res.data) {
          return
        }
        this.selectName.map(item => {
          this.routes.map(item2 => {
            if (item.name == item2.meta.title) {
              if (this.XTCS0021List[0]?.paramValue.indexOf(objName[item.name]) !== -1) {
                this.$set(item2, 'length', res.data[item.value]) // 数量赋值
              }
            }
          })
        })
        // 监控值改回来
        this.$store.commit('SET_PATIENTROUTE', false)
      })
    },
    /**
     * 当前路由获取
     */
    pathFc() {
      // 当前url的路由
      if (this.isShortcut) {
        this.rootPath = this.shortcutRootPath
      } else {
        this.rootPath = this.$route.path
      }
      // 菜单里面找出来 1级菜单
      this.targetRoutes = this.mainMenu?.find(element => {
        return element.path === this.rootPath
      })
      this.routes = this.targetRoutes?.children
    },
    resolvePath(basictPath, routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basictPath)) {
        return basictPath
      }
      return path.resolve(basictPath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar-wrapper {
  overflow-y: none;
  overflow-x: none;
  height: 100%;
  display: flex;
  flex-direction: column;

  /* 工号/姓名 的样式 */
  ::v-deep.el-input--small .el-input__inner {
    background: #f3f5f9;
    border-radius: 2px 0px 0px 2px;
    border: initial;
  }
}
</style>
