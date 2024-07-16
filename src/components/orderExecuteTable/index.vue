<template>
  <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="multipleTable" :defaultText="true" :data="tableData" border tooltip-effect="dark" style="width: 100%">
    <v-table-column prop="orderValidityTypeName" label="类型" align="center" width="40" v-if="isShowType">
      <template slot-scope="scope">
        {{ scope.row.orderValidityTypeDict | dictCodeToName(orderExecuteTypeList, 'dictAbbr') }}
      </template>
    </v-table-column>
    <v-table-column align="center" width="50" label="组">
      <template slot-scope="scope">
        <div class="table-list">
          <div v-for="(contentItem, contentIndex) in scope.row.orderGroupItemList" :key="contentIndex" class="table-item"
               :class="{ 'first': scope.row.orderGroupItemList.length > 1 && contentIndex === 0, 'normal': scope.row.orderGroupItemList.length > 1 && contentIndex !== 0 && contentIndex !== scope.row.orderGroupItemList.length - 1 , 'last': scope.row.orderGroupItemList.length > 1 && contentIndex === scope.row.orderGroupItemList.length - 1 }">
          </div>
        </div>
      </template>
    </v-table-column>
    <v-table-column label="医嘱内容" align="center" min-width="300">
      <template slot-scope="scope">
        <div class="table-list">
          <div v-for="(contentItem, contentIndex) in scope.row.orderGroupItemList" :key="contentIndex" class="table-item">
            {{ contentItem.orderContent }}
          </div>
        </div>
      </template>
    </v-table-column>
    <v-table-column label="剂量" align="center">
      <template slot-scope="scope">
        <div class="table-list center">
          <div v-for="(contentItem, contentIndex) in scope.row.orderGroupItemList" :key="contentIndex" class="table-item">
            {{ contentItem.dose }}
          </div>
        </div>
      </template>
    </v-table-column>
    <v-table-column label="剂量单位" align="center" min-width="60" show-overflow-tooltip>
      <template slot-scope="scope">
        <div class="table-list center">
          <div v-for="(contentItem, contentIndex) in scope.row.orderGroupItemList" :key="contentIndex" class="table-item">
            {{ contentItem.doseUnit }}
          </div>
        </div>
      </template>
    </v-table-column>
    <!-- <v-table-column label="余液" align="center" min-width="60" show-overflow-tooltip>
      <template slot-scope="scope">
        <div class="table-list center">
          {{scope.row.surplus}}
        </div>
      </template>
    </v-table-column> -->
    <v-table-column prop="drugFrequency" label="频次" align="center" show-overflow-tooltip v-if="isShowFrequency">
    </v-table-column>
    <v-table-column prop="createTime" label="开立时间" align="center" min-width="140" show-overflow-tooltip v-if="isShowCreateTime"></v-table-column>
    <!-- <v-table-column prop="beginTime" label="开始日期" align="center" min-width="140" show-overflow-tooltip v-if="isShowBeginTime"></v-table-column> -->

    <slot></slot>
  </el-table>
</template>
<script>
export default {
  name: 'OrderExecuteTable',
  filters: {
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : ''
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    isShowFrequency: {
      type: Boolean,
      default: false
    },
    isShowCreateTime: {
      type: Boolean,
      default: false
    },
    isShowBeginTime: {
      type: Boolean,
      default: false
    },
    isShowType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 医嘱执行类型
      orderExecuteTypeList: [],
      // 医嘱执行用法类型
      orderUsageTypeList: []
    }
  },
  watch: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { ICIS_DICT_ORDER_USAGE_TYPE, HIS_DICT_ORDER_VALIDITY_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE', 'HIS_DICT_ORDER_VALIDITY_TYPE'])
      this.orderUsageTypeList = ICIS_DICT_ORDER_USAGE_TYPE
      this.orderExecuteTypeList = HIS_DICT_ORDER_VALIDITY_TYPE
    }
  }
}
</script>
<style lang="scss" scoped>
.table-list {
  ::v-deep.el-table__body {
    td {
      padding: 0;
    }
  }
  text-align: left;
  &.center {
    text-align: center;
  }
  .table-item {
    width: 100%;
    min-height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-bottom: 1px dashed #e4e7ed;
    &:nth-last-of-type(1) {
      border-bottom: none;
    }
    &.first {
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 50%;
        border-top: 1px solid #dbdbdb;
        border-left: 1px solid #dbdbdb;
        transform: translateX(-50%);
      }
    }
    &.normal {
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        width: 10px;
        height: 100%;
        border-left: 1px solid #dbdbdb;
        transform: translateX(-50%);
      }
    }
    &.last {
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        width: 10px;
        height: 50%;
        border-left: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
