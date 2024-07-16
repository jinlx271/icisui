<!-- 基础字典 -->
<template>
  <div class="basicData">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="ICIS基础数据" name="ICIS">
      </el-tab-pane>
      <el-tab-pane label="HIS基础数据" name="HIS">
      </el-tab-pane>
    </el-tabs>
    <div class="bottom">
      <div class="bottom_left">
        <div v-for="(item, index) in leftData[activeName]" :key="item.label"
          :class="currLeftIndex == index ? 'list active' : 'list'" @click="changeLeftData(index)">
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="bottom_right">
        <component v-if="curComponent" :is='curComponent'></component>
      </div>
    </div>
  </div>
</template>

<script>
const components = [
  'hisOrgan',
  'hisCourtyardArea',
  'hisWard',
  'hisSurgery',
  'hisDiagnose',
  'hisMaterial',
  'hisInspection',
  'Drug',
  'hisDept',
  'icisCatheter',
  'icisEquipment',
  'icisGuardianshipItem',
  'icisMealsItem'
]

const obj = {}

components.forEach(key => {
  obj[key] = require(`@/views/configuration/basicSettings/components/${key}.vue`).default
})

export default {
  name: 'BasicData',
  components: { ...obj },
  data: function () {
    return {
      activeName: 'ICIS',
      currLeftIndex: 0,
      curComponent: {},
      leftData: {
        ICIS: [
          {
            label: '导管数据',
            component: 'icisCatheter'
          }, {
            label: '设备数据',
            component: 'icisEquipment'
          }, {
            label: '监护字典',
            component: 'icisGuardianshipItem'
          }, {
            label: '膳食字典',
            component: 'icisMealsItem'
          }
        ],
        HIS: [
          {
            label: '机构',
            component: 'hisOrgan'
          },
          {
            label: '院区',
            component: 'hisCourtyardArea'
          },
          {
            label: '病区',
            component: 'hisWard'
          }, {
            label: '科室',
            component: 'hisDept'
          }, {
            label: '手术',
            component: 'hisSurgery'
          }, {
            label: '诊断',
            component: 'hisDiagnose'
          }, {
            label: '耗材',
            component: 'hisMaterial'
          }, {
            label: '药品',
            component: 'Drug'
          },
          {
            label: '检验指标',
            component: 'hisInspection'
          }
        ]
      }
    }
  },
  props: {},
  watch: {},
  computed: {

  },
  created() {
    this.init()
  },
  mounted() { },
  methods: {
    init() {
      this.curComponent = this.leftData[this.activeName][this.currLeftIndex].component
    },
    // tabs切换
    handleClick() {
      this.currLeftIndex = 0
      this.curComponent = this.leftData[this.activeName][this.currLeftIndex].component
    },
    // 切换左侧菜单
    changeLeftData(index) {
      this.currLeftIndex = index
      this.curComponent = this.leftData[this.activeName][this.currLeftIndex].component
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.basicData {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;

  .tabs {
    height: 60px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none
  }

  .bottom {
    height: calc(100% - 60px);
    display: flex;

    &_left {
      width: 150px;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      background: #f0f4ff;
      margin-right: 10px;
      padding: 10px;

      .list {
        height: 48px;
        display: flex;
        align-items: center;
        color: #000;
        padding: 5px 10px;
        font-size: 14px;

        span {
          margin-right: 10px;
        }
      }

      .active {
        background: var(--maincolor);
        color: #fff;
        border-radius: 2px;
        padding: 5px 10px;
      }
    }

    &_right {
      width: calc(100% - 160px);
      height: 100%;
      background: #fff;
      margin-right: 10px;
      padding: 10px 10px 0 10px;
      border-left: 2px solid rgba(203, 215, 238, 0.3);
    }
  }
}</style>
