<template>
  <div ref="paneRef" class="inspection-report-pane">
    <div ref="paneTop" class="inspection-report-pane-top">
      <div class="inspection-report-pane-top-search">
        <el-button v-for="tableItem in tableData" :key="tableItem.id"
          :type="row.id == tableItem.id ? 'primary' : 'default'" :plain="row.id != tableItem.id" size="mini" round
          @click="getDetailDataList(tableItem)">
          {{ tableItem.receiveTime && $dayjs(tableItem.receiveTime).format('YYYY-MM-DD') }} {{ tableItem.reportType }}
        </el-button>
      </div>
      <div class="inspection-report-pane-top-title">{{ row.receiveTime && $dayjs(row.receiveTime).format('YYYY-MM-DD') }} {{ row.reportType
      }}</div>
      <div class="inspection-report-pane-top-desc">
        <span>报告日期: {{ row.receiveTime }}</span>
        <span>报告名称: {{ row.reportType }}</span>
        <span>标本: {{ row.specimenName }}</span>
        <span>送检时间: {{ row.applyTime }}</span>
        <span>检查科室: {{ row.executeDeptName }}</span>
      </div>
      <div class="inspection-report-pane-list-title">检验结果</div>
    </div>
    <div class="inspection-report-pane-list" :style="{ maxHeight: contentHeight, overflowY: 'auto' }">
      <div class="inspection-report-pane-list-item" v-for="tableDetailItem in tableDetailData" :key="tableDetailItem.id"
        @click="showGraph(tableDetailItem, tableDetailData)">
        <span>{{ tableDetailItem.itemName }}{{ tableDetailItem.reference ? ` (${tableDetailItem.reference})` : '' }}</span>
        <span :style="{ color: ['low', 'high', 'masculine'].includes(tableDetailItem.errorSignTag) ? 'rgb(245, 44, 44)' : '#000' }">
          {{ tableDetailItem.itemValue }}
          <svg-icon v-if="['low', 'high'].includes(tableDetailItem.errorSignTag)"
            :icon-class="tableDetailItem.errorSignTag"
            :style="{ color: signColor[tableDetailItem.errorSignTag] }"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  patientInspect_getList,
  patientInspectDetail_getList,
  patientInspectDetail_setInterest
} from '@/api/inspectionResult'
import { mapGetters } from 'vuex'
export default {
  name: 'InspectionReportItem',
  props: {
    icuRecordId: {
      type: String,
      default: ''
    },
    datetimerange: {
    }
  },
  data() {
    return {
      row: {},
      multipleSelection: [],
      // 加载
      loadingData: false,
      loadingDetailData: false,
      // 分页
      queryData: {
        pageNum: 1,
        pageSize: 1000
      },
      // 表格数据
      tableData: [],
      // 分页总量
      totolCount: 0,
      // 病区编码
      wardCode: '',
      // 详情数据
      tableDetailData: [],
      // 异常标识
      errorSignText: {
        'HH': {
          name: '非常高',
          sign: 'high'
        },
        'H': {
          name: '高',
          sign: 'high'
        },
        'L': {
          name: '低',
          sign: 'low'
        },
        'LL': {
          name: '非常低',
          sign: 'low'
        },
        'P': {
          name: '阳性',
          sign: 'masculine'
        },
        '0': {
          name: '正常',
          sign: 'normal'
        },
        'N': {
          name: '正常',
          sign: 'normal'
        }
      },
      signColor: {
        low: '#5DB730',
        high: '#F52C2C'
      },
      contentHeight: 'auto'
    }
  },
  inject: {
    pageFrom: {
      default: () => ''
    }
  },
  computed: {
    ...mapGetters(['patientInfo', 'currentUserWard'])
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    this.contentHeight = `calc(100% - ${(this.$refs.paneTop.offsetHeight / 20) + 5.8}rem)`
  },
  methods: {
    showGraph(row, tableDetailData) {
      this.$emit('showGraph', row, tableDetailData)
    },
    showTrendList(row, tableDetailData) {
      this.$emit('showTrendList', row, tableDetailData)
    },
    // 设置关注项
    handleInterest(row) {
      const { interest: interestStatus, itemCode } = row
      const query = {
        icuRecordId: this.icuRecordId || this.patientInfo.icuRecordId,
        interestStatus: interestStatus == 1 ? '0' : '1',
        itemCode
      }
      patientInspectDetail_setInterest(query).then(res => {
        if (interestStatus == '0') {
          this.$message.success('设置关注项成功')
        } else {
          this.$message.success('取消关注项成功')
        }
        this.getDetailDataList(this.row)
      })
    },
    // 回显已选中项目
    toggleSelection(rows) {
      if (rows.length > 0) {
        rows.forEach(row => {
          this.$refs.tableDetailData?.toggleRowSelection(row, true)
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('checkItem', { row: this.row, list: this.multipleSelection })
    },
    // 初始化
    async init() {
      this.wardCode = this.currentUserWard.wardCode
      this.getDataList(1)
    },
    // 查询数据
    getDataList(page) {
      if (page) {
        this.queryData.pageNum = page
      }
      this.loadingData = true
      this.addRoleVisible = true
      const query = {
        icuRecordId: this.icuRecordId || this.patientInfo.icuRecordId,
        ...this.queryData
      }
      if (this.datetimerange && this.datetimerange.length == 2) {
        query.startDateTime = this.datetimerange[0]
        query.endDateTime = this.datetimerange[1]
      }
      // else if (this.pageFrom == 'bedShift') {
      //   this.tableData = []
      //   this.totolCount = 0
      //   this.loadingData = false
      //   return
      // }
      patientInspect_getList(query).then(res => {
        this.loadingData = false
        if (!(res.code === 0)) {
          return
        }
        this.tableData = res.data.result
        this.totolCount = res.data.totolCount
        if (this.tableData.length) {
          this.getDetailDataList(this.tableData[0])
        }
      }).catch(() => {
        this.tableData = []
        this.totolCount = 0
      })
    },
    // 查询详情
    getDetailDataList(row) {
      this.loadingDetailData = true
      const query = {
        inspectId: row.id
      }
      this.row = row
      patientInspectDetail_getList(query).then(res => {
        this.loadingDetailData = false
        if (!(res.code === 0)) {
          return
        }
        this.tableDetailData = res.data
        this.tableDetailData.map(item => {
          if (Object.prototype.hasOwnProperty.call(this.errorSignText, item.errorSign)) {
            item.errorSignName = this.errorSignText[item.errorSign].name
            item.errorSignTag = this.errorSignText[item.errorSign].sign
          } else {
            item.errorSignName = item.errorSign
            item.errorSignTag = ''
          }
        })
        this.$nextTick(() => {
          this.$refs.tableDetailData && this.$refs.tableDetailData.doLayout()
        })
        this.$emit('rowSelect', this.row)
      })
    },
    // 分页变化
    changePagination(pageNum) {
      this.getDataList(pageNum)
    }
  }
}
</script>
<style lang="scss" scoped>
.inspection-report-pane {
  height: calc(100% - 2.9rem);

  .inspection-report-pane-top {
    .inspection-report-pane-top-search {
      display: flex;
      overflow-x: auto;
      padding: 1rem 0;
      margin-bottom: -1rem;
    }

    .inspection-report-pane-top-title {
      font-size: 1.3rem;
      font-weight: bold;
      padding: 1rem;
    }

    .inspection-report-pane-top-desc {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 20%));

      span {
        text-align: left;
      }
    }
    .inspection-report-pane-list-title {
      font-weight: bold;
      text-align: left;
      margin-top: 1rem;
    }
  }

  .inspection-report-pane-list {
    display: flex;
    flex-wrap: wrap;
    border-top: .05rem dashed #ddd;
    border-bottom: .05rem dashed #ddd;
    margin: 1rem 0;

    .inspection-report-pane-list-item {
      width: 50%;
      border-bottom: .05rem dashed #ddd;
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      padding-right: 2rem;

      &:nth-of-type(even) {
        padding-right: 0;
      }

      span {
        text-align: left;

        &:nth-last-of-type(1) {
          white-space: nowrap;
        }
      }
    }
  }
}</style>
