<template>
  <el-form ref="customParam" :model="paramInfo" label-width="130px" >
    <el-form-item label="参数名称" prop="paramName">
      <span>{{paramInfo.paramName}}</span>
    </el-form-item>
    <!-- 自定义参数 -->
    <template v-if="paramInfo">
      <Flow0107 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0107'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></Flow0107>
      <FlowCom0108 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0108'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0108>
      <FlowCom0110 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0110'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0110>
      <FlowCom0111 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0111'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0111>
      <FlowCom0112 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0112'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0112>
      <FlowCom0113 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0113'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0113>
      <FlowCom0117 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'FLOW_0117'&& paramInfo.docPro == 'pro_flow_common'" ref="ref"></FlowCom0117>
      <ORDER0002 :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.paramCode == 'ORDER_0002'&& paramInfo.docPro == 'pro_flow_order_execute'" ref="ref"></ORDER0002>
      <FlowWordBreak :paramValue.sync="paramInfo.paramValue" v-if="paramInfo.selectType=='8'" ref="ref"></FlowWordBreak>
    </template>
    <el-form-item label="参数描述" prop="paramDesc">
      <el-input v-model="paramInfo.paramDesc" placeholder="请输入" type="textarea" autosize></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  docDataParams_update
} from '@/api/configuration'
export default {
  name: 'DataSourceList',
  components: {
    Flow0107: () => import('./Flow0107.vue'),
    FlowCom0108: () => import('./FlowCom0108.vue'),
    FlowCom0110: () => import('./FlowCom0110.vue'),
    FlowCom0111: () => import('./FlowCom0111.vue'),
    FlowCom0112: () => import('./FlowCom0112.vue'),
    FlowCom0113: () => import('./FlowCom0113.vue'),
    FlowCom0117: () => import('./FlowCom0117.vue'),
    ORDER0002: () => import('./OrderCom0002.vue'),
    FlowWordBreak: () => import('./FlowWordBreak.vue')
  },
  props: {
    paramInfo: {
      type: Object,
      default: () => {}
    }
  },
  data: function () {
    return {
    }
  },
  watch: {
  },
  computed: {

  },
  async created() {

  },
  mounted() { },
  methods: {

    /**
     * 自定义参数设置保存
     */
    modifySave() {
      this.$refs.ref.change().then(() => {
        docDataParams_update({
          id: this.paramInfo.id,
          paramValue: this.paramInfo.paramValue,
          paramDesc: this.paramInfo.paramDesc
        }).then(res => {
          if (res.code == 0) {
            const obj = {
              paramValue: this.paramInfo.paramValue,
              paramDesc: this.paramInfo.paramDesc,
              id: this.paramInfo.id
            }
            this.$emit('paramSaveSuccess', obj)
          }
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-footer {
  padding-left: 0px;
}
::v-deep .el-dialog {
  &__header {
    border-bottom: 1px solid #dfe7f5;
  }
  &__body {
    padding: 18px 20px 0 0;
    margin: 0 auto;
  }
  &__footer {
    border-top: 1px solid #dfe7f5;
    text-align: right;

    .el-button {
      width: 90px;
    }
  }
}
.dataSourceList {
  background: #ffffff;
  height: 100%;
  display: flex;
  padding: 1%;
  .redCss {
    color: #f52c2c;
  }
  .mainColor {
    color: $light-blue;
  }
  .elHeader1 {
    height: 34px !important;
    margin-top: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    justify-content: space-between;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .el-button {
      width: 90px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      span {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  &_left {
    width: 100%;
    &_div {
      height: 100%;
      display: block;
    }
    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      font-size:14px;
      border-radius: 2px;
      margin-bottom: 10px;
      .input {
        margin-right: 10px;
      }
      ::v-deep input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }
    &_main {
      height: calc(100% - 92px);
      padding: 0;
      &_table {
        border: none;
        background: none;
        padding-top: 8px;
        &::before {
          background: transparent;
        }
        &::after {
          background: transparent;
        }
        ::v-deep tr {
          background: none;
          &.current-row {
            color: var(--maincolor);
            td {
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: var(--maincolor);
              background: none;
              .cell {
                background: #d9e3ff;
                border-radius: 3px;
              }
            }
          }
          &:hover {
            color: var(--maincolor);
            td {
              background: none;
            }
          }
        }
        ::v-deep td {
          border: none;
          padding: 0 8px;
          color: #000622;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          .cell {
            padding: 8px;
          }
        }
      }
    }
    &_footer {
      .pagination {
        float: left;
        margin-top: 15px;
        margin-right: -30px;
      }
    }
    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
  }
}
</style>

