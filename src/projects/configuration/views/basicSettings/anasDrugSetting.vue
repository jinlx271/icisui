<!-- 护理记录模板 -->
<template>
  <div class="templateConfig">
    <div class="templateConfig_left">
      <el-container style="height:100%">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <icu-region :defaultPermi="['configuration:basicSettings:anasDrugSetting']" style="height:calc(100% - 42px)" :defaultRegion="defaultRegion"
                    :module="'anasDrugSetting'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="templateConfig_right">
      <el-tabs class="tabPart" v-model="activeName" @tab-click="handleClick" :before-leave="tabClickBefore">
        <el-tab-pane v-for="item in typeList" :label="item.dictName" :name="item.templateCategory" :key="item.templateCategory">
        </el-tab-pane>
      </el-tabs>
      <el-container>
        <el-main style="height:calc(100% - 10px);width:100%">
          <el-header class="elHeader3">
            <!-- input输入 -->
            <div class="headerLeft">
              <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search" v-model="drugSearchKey"></el-input>
            </div>
            <div class="headerRight">
              <el-button v-hasPermi="['configuration:basicSettings:anasDrugSetting']" class="queryButton" type="primary"
                         @click.native.prevent="addDrug">新增</el-button>
            </div>
          </el-header>
          <ztzjTable ref="drugTable" :wardCode.sync="defaultRegion" :key="activeName" :activeName="activeName" :searchKey="drugSearchKey">
          </ztzjTable>
        </el-main>
      </el-container>
    </div>
  </div>

</template>

<script>

import icuRegion from '../basicSettings/components/icuRegion.vue'
import ztzjTable from './components/ztzjTable'
import { mapGetters } from 'vuex'
export default {
  name: 'AnasDrugSetting',
  components: {
    icuRegion, ztzjTable
  },
  data: function () {
    return {
      drugSearchKey: '',
      searchKey: '',
      defaultRegion: '',
      loading: false,
      // 模板分类信息
      typeList: [{
        templateCategory: '1',
        dictName: '镇痛类药品'
      }, {
        templateCategory: '2',
        dictName: '镇静类药品'
      }],
      addOrModify: '',
      activeName: '1',
      tabName: '',
      // 页面布局
      pagePartsList: [
        {
          width: 4,
          name: 'name1'
        },
        {
          width: 20,
          name: 'name2'
        }
      ],
      // 模板列表
      list: [
      ],
      wardList: [], // 获取分区项目
      currWard: '', // 当前病区
      leftIndex: 0, // 左侧模板列表下标
      dialogVisible: false,
      diaglogTitle: '',
      // 弹框显示信息对象
      formInfo: {
        templateName: ''

      },
      // 当前模板数据
      currentObj: {},
      content: '',

      formInfoRules: {
        templateName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('请输入30字以内的模板名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      pageNum: 1
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['userWardList', 'currentUserWard', 'userInfo'])
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
  },
  mounted() {

  },
  methods: {
    addDrug() {
      this.$refs.drugTable?.addDrug()
    },
    /**
     * 左侧区域切换病区
     */
    defaultRegionChange(e) {
      this.defaultRegion = e
      this.$nextTick(function () {
        this.$refs.drugTable?.getData()
      })
    },
    // 验证tab是否需要切换
    tabClickBefore(activeName, oldActiveName) {
    },
    /**
    模板的模糊搜索 */
    search() {
    },
    // 切换tab标签
    handleClick(e) {
      this.drugSearchKey = ''
    },
    // 隐藏弹框
    handleClose() {
      this.dialogVisible = false
      this.formInfo = {
        templateName: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';
.templateConfig {
  display: flex;
  width: 100%;
  background: #fff;
  height: 100%;

  &_left {
    width: 300px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    height: 100%;
  }
  &_right {
    flex: 1;
    display: block;

    background: #fff;
    height: 100%;
    padding: 0 20px;
    ::v-deep .el-row {
      display: flex;
      flex-wrap: wrap;
    }
    ::v-deep .el-main {
      padding: 0px;
      height: 100%;
    }
    #editor {
      display: flex;
      .el-textarea__inner {
        height: 650px;
        overflow-y: auto;
        /* overflow-y: auto;兼容ie  */
      }
    }
    .el-container {
      height: calc(100% - 55px);
    }
    .container {
      display: flex;
      height: 100%;
    }
    .left {
      width: 240px;
      height: 100%;
      margin-right: 10px;
      ::v-deep .el-input > .el-input__inner {
        width: 240px;
      }
    }
    .right {
      width: calc(100% - 240px);
      height: 100%;
      overflow: hidden;
      .queryButton {
        float: right;
      }
      #editor {
        height: calc(100% - 20px);
        overflow-y: auto;
      }
      ::v-deep .el-button {
        margin-bottom: 5px;
      }
    }
    .content {
      ::v-deep .el-textarea__inner {
        background: transparent;
        border: none;
        height: calc(100vh - 270px);
      }
    }
    .list {
      list-style: none;
      height: calc(100% - 80px);
      overflow-y: auto;
      li {
        font-size: 14px;
        line-height: 30px;
        background: rgb(243, 245, 249);
        padding: 5px 10px;
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          display: flex;
          flex-direction: column;
          span {
            width: 120px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:nth-of-type(2) {
              color: #999;
              font-size: 12px;
            }
          }
        }
        .text {
          width: 100px;
          color: var(--maincolor);
          font-size: 12px;
          text-align: right;
        }
        .redCss {
          color: #f52c2c;
        }
      }
      .active {
        background: rgb(207, 225, 255);
      }
    }
  }
}
</style>
