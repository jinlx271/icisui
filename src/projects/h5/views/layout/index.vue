<template>
  <div class="HCContiner">
    <template v-if="$isWinMY">
      <div>
        <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" >
          <div class="w100 flex flex-justify-content" slot="title">
            <div @click="showPicker">{{ currentUserWard.wardName }}</div>
          </div>
        </van-nav-bar>
      </div>
      <div class="LMContiner">
        <div class="Main flex-1">
          <router-view></router-view>
        </div>
      </div>
    </template>
    <template v-else>
        <div class="Header flex align-items-center">
          <div class="title">
            <img src="@/assets/img/logo.png" style="width:24px;height:24px" alt class="m-r10" />
            <span class="system">{{ globalConfig.title }}</span><span v-if="systemInfoName">-{{ systemInfoName }}</span>
          </div>
          <div class="logout">
            <div class="currWard" @click="showPicker">{{ currentUserWard.wardName }}</div>
            <el-button @click="logout" icon="el-icon-switch-button" type="text"> </el-button>
          </div>
        </div>
        <div class="LMContiner">
          <el-menu :default-active="activeIndex" @select="handleSelect" class="el-menu-vertical-demo leftMenu" ref="menu">
            <div v-for="(item, index) in mainMenu" :key="item.path">
              <router-link :ref="`menuPathList${item.path}`" :to="{ path: item.path, query: { menuId: item.id } }"
                v-if="showItem(item)">
                <el-menu-item class="centerDiv_itemDiv " v-bind:index="index + ''">
                  <span class="menuTitle"><i :class="item.icon"></i></span>
                  <span class="menuTitle">{{ item.meta.title }}</span>
                </el-menu-item>
              </router-link>
            </div>
          </el-menu>
          <!-- 下拉刷新页面 -->
          <div class="Main flex-1">
              <router-view></router-view>
          </div>
        </div>
    </template>

    <van-popup v-model="pickerFlag" position="bottom">
      <van-picker :columns="userWardList" @change="onChange" :visible-item-count="3" show-toolbar
        @cancel="pickerFlag = false" @confirm="onConfirm" class="fixedPicker" :default-index="pickerIndex"
        value-key="wardName" />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { handleCurrentSkin } from '@/utils/utils'
export default {
  name: 'Layout',

  data() {
    return {
      globalConfig: globalConfig,
      timestamp: 0,
      activeIndex: '0',
      searchKey: '',
      pickerFlag: false,
      pickerIndex: 0,
      wardCode: 1,
      vanPull: '',
      systemInfoName: '',
      currentWardCode: ''
      // mainMenu: []
    }
  },
  computed: {
    ...mapGetters(['currentUserWard', 'userWardList', 'mainMenu', 'systemInfo', 'userInfo'])
  },
  mounted() {
    console.log('this.activeIndex', this.$store, this.mainMenu)
    const routerPath = location.hash.split('#')[1]
    this.mainMenu.forEach((item, index) => {
      if (item.path == routerPath) {
        this.activeIndex = index + ''
      } else if (item.children?.length > 0) {
        item.children.forEach((c, cIndex) => {
          if (c.path == routerPath) {
            this.activeIndex = index + ''
          }
        })
      }
    })
    if (this.currentUserWard) {
      this.currentWardCode = this.currentUserWard.wardCode
      handleCurrentSkin('', this.userInfo?.userName, this.currentWardCode)
    }
    if ((this.currentUserWard.areaName ?? '') != '') {
      this.systemInfoName = this.currentUserWard.areaName
    } else if (this.systemInfo) {
      this.systemInfoName =
        this.systemInfo.name && this.systemInfo.name.substr(0, 10)
    }
  },
  watch: {
  },
  created() {
    const routerPath = location.hash.split('#')[1]

    this.mainMenu.forEach((item, index) => {
      if (item.path == routerPath) {
        this.activeIndex = index + ''
      } else if (item.children?.length > 0) {
        item.children.forEach((c, cIndex) => {
          if (c.path == routerPath) {
            this.activeIndex = index + ''
          }
        })
      }
    })
  },
  methods: {
    /**
     * 路由的显示
     * @param {u} item
     */
    showItem(item) {
      const hidden = item.hidden
      if (hidden == null) {
        return true
      }
      if (hidden === false) {
        return true
      }
      return false
    },
    refresh() {
    },
    handleSelect() {

    },
    /**
     * 退出
     */
    logout() {
      const this_ = this
      this.$confirm('是否需要注销', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        this_.$store.dispatch('LogOut')
      })
    },
    /**
     * picker 选择器 切换数据
     * @param {*} picker
     * @param {*} value
     * @param {*} index
     */
    onChange(picker, value, index) {
      this.pickerIndex = index
    },
    /**
     * 显示病区选择器
     */
    showPicker() {
      this.pickerIndex = this.userWardList.findIndex(item => item.wardCode == this.currentUserWard.wardCode)
      this.pickerFlag = true
    },
    /**
     * 病区选择
     */
    onConfirm() {
      this.handleSelectWorkbench(this.userWardList[this.pickerIndex].wardCode)
      this.pickerFlag = false
    },
    /**
     * 设置当前病区
     * @param {*} value
     */
    handleSelectWorkbench(value) {
      if (!value) {
        this.$store.commit('set_currentUserWard', null)
      } else {
        const ward = this.userWardList.find(item => {
          return item.wardCode == value
        })
        this.$store.commit('set_currentUserWard', ward)
        if ((this.currentUserWard.areaName ?? '') != '') {
          this.systemInfoName = this.currentUserWard.areaName
        } else if (this.systemInfo) {
          this.systemInfoName =
            this.systemInfo.name && this.systemInfo.name.substr(0, 10)
        }
        this.$emit('refresh')
        handleCurrentSkin('', this.userInfo?.userName, ward.wardCode)
      }
    },
    /**
     * 下拉刷新
     */
    onRefresh() {
      this.timestamp = this.$dayjs().valueOf()
    },
    onClickLeft() {
      this.$my.route.navigateBack()
    }
  },
  beforeDestroy() {

  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .system {
    display: none;
  }
}

.HCContiner {
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  ::v-deep .van-nav-bar__left,
  ::v-deep.van-nav-bar__text,
  ::v-deep.van-nav-bar .van-icon {
    font-size: rem(14);
    font-weight: 600;
    color: var(--maincolor) !important;
  }
  .Header {
    height: 50px;
    width: 100%;
    opacity: 1;
    display: flex;
    background: var(--maincolor);
    justify-content: space-between;

    .title {
      width: 50vw;
      text-align: left;
      padding: 17px;
      align-items: center;
      display: flex;
      color: #fff;
      font-size: 18px;

      span {
        /** 文本1 */
        font-size: 18px;
        font-weight: 700;
        color: rgba(255, 255, 255, 1);
        padding-left: 10px;
      }
    }

    .logout {
      display: flex;
      justify-content: flex-end;
      padding-right: rem(8);
      align-items: center;

      .currWard {
        font-size: rem(16);
        justify-content: center;
        align-items: center;
        width: rem(220);
        height: rem(32);
        background: #fff;
        border-radius: rem(16);
        margin-right: rem(20);
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 rem(5);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          right: rem(-10);
          height: rem(28);
          width: 2px;
          background: #fff;
        }
      }

      .el-button {
        color: #fff;
        font-size: rem(24);
      }
    }
  }

  .LMContiner {
    flex: 1;
    display: flex;
    overflow: hidden;
    background: #ebeff7;

    .leftMenu {
      width: rem(100);
      min-width: 65px;

      div {
        justify-content: center;
      }

      .el-menu-item i {
        margin-right: 0;
        margin-bottom: 5px;
      }
    }

    .menuTitle {
      line-height: 18px;
      height: 18px;
      margin-bottom: rem(8);

      i {
        font-size: rem(24);
      }
    }

    .centerDiv_itemDiv {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: rem(60) rem(20);
    }

    .Main {
      flex: 1;
      overflow: hidden;
      margin: 0;
      height: 100%;
      padding: rem(10);

      ::v-deep .van-pull-refresh {
        height: 100%;
      }
    }

    ::v-deep .el-menu-item.is-active {
      color: var(--maincolor);
    }
  }
}
</style>
