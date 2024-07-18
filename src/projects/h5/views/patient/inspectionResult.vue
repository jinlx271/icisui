<template>
  <div class="inspection-result-container">
    <div class="inspection-result-type">
      <el-radio-group v-model="inspectionResultType" size="small" @change="getInspectionResultList">
        <el-radio-button :label="item.dictCode" v-for="item in inspectionResultTypeOptionsList" :key="item.dictCode">
          {{ item.dictName }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <InspectionReportItem ref="inspectionReport" :icuRecordId="icuRecordId" @showGraph="showGraphFn"
      @showTrendList="showTrendListFn" :datetimerange="datetimerange" @rowSelect="rowSelect" @checkItem="checkItem"
      v-if="inspectionResultType === 'inspectionReport'"> </InspectionReportItem>
    <CheckReportItem ref="checkReport" :icuRecordId="icuRecordId" :datetimerange="datetimerange" @checkItem="checkItem"
      v-if="inspectionResultType === 'checkReport'"> </CheckReportItem>
    <el-drawer :title="'实时趋势图'" :visible.sync="showGraph" :modal-append-to-body="true" :append-to-body="true"
      custom-class="inspection-result-drawer" size="90%" direction="btt" top="10vh">
      <gragh v-if="showGraph" :rowCopy="row" :rowItemCopy="rowItem" :tableDetailData="tableDetailData"
        :datetimerangeCopy="datetimerange"></gragh>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InspectionReportItem from './components/inspectionResult/inspectionReportItem'
import CheckReportItem from './components/inspectionResult/checkReportItem'
import Gragh from './components/configDialog/gragh'
export default {
  components: { InspectionReportItem, CheckReportItem, Gragh },
  data() {
    return {
      showGraph: false,
      rowItem: {},
      row: {},
      datetimerange: [],
      inspectionResultType: 'inspectionReport',
      inspectionResultTypeOptionsList: [
        {
          dictCode: 'inspectionReport',
          dictName: '检验'
        },
        {
          dictCode: 'checkReport',
          dictName: '检查'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['patientInfo']),
    icuRecordId() {
      return this.patientInfo.icuRecordId
    }
  },
  created() { },
  methods: {
    getInspectionResultList() {

    },
    showGraphFn(row, tableDetailData) {
      this.rowItem = row
      this.showGraph = true
      this.tableDetailData = tableDetailData
    },
    showTrendListFn(row, tableDetailData) {
      this.rowItem = row
      this.showTrendList = true
      this.tableDetailData = tableDetailData
    },
    rowSelect(row) {
      this.row = row
    },
    checkItem() { }
  }
}
</script>
<style lang="scss">
.inspection-result-drawer {
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
.inspection-result-container {
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  padding: 10px;
  overflow: auto;

  .inspection-result-type {
    display: flex;
  }
}
</style>
