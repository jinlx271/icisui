<template>
  <div ref="paneRef" class="check-report-pane">
    <div ref="paneTop" class="check-report-pane-top">
      <div class="check-report-pane-top-search">
        <el-button v-for="tableItem in tableData" :key="tableItem.id"
          :type="row.id == tableItem.id ? 'primary' : 'default'" :plain="row.id != tableItem.id" size="mini" round
          @click="getDetailDataList(tableItem)">
          {{ tableItem.receiveTime && $dayjs(tableItem.receiveTime).format('YYYY-MM-DD') }} {{ tableItem.reportType }}
        </el-button>
      </div>
      <div class="check-report-pane-top-title">{{ row.receiveTime && $dayjs(row.receiveTime).format('YYYY-MM-DD') }} {{
        row.reportType
      }}</div>
      <div class="check-report-pane-top-desc">
        <span>报告日期: {{ row.receiveTime }}</span>
        <span>报告名称: {{ row.reportType }}</span>
        <span>部位: {{ row.position }}</span>
        <span>送检时间: {{ row.applyTime }}</span>
        <span>检查科室: {{ row.executeDeptName }}</span>
      </div>
      <div class="inspection-report-pane-list-title">检查结果</div>
    </div>
    <div class="check-report-pane-list" :style="{ height: contentHeight, overflowY: 'auto' }">
      <div class="check-report-pane-list-item" v-for="tableDetailItem in tableDetailData" :key="tableDetailItem.id">
        <p>{{ tableDetailItem.itemName }}:</p>
        <p v-html="tableDetailItem.itemValue"></p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  patientExamine_getList,
  patientExamineDetail_getList
} from '@/api/inspectionResult'
import { mapGetters } from 'vuex'
export default {
  name: 'CheckReportItem',
  data() {
    return {
      multipleSelection: [],
      row: {},
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
      // 统计时间轴
      timetitleList: [],
      // 详情数据
      tableDetailData: [],
      tableHeight: null,
      contentHeight: 'auto'
    }
  },
  inject: {
    pageFrom: {
      default: () => ''
    }
  },
  props: {
    icuRecordId: {
      type: String,
      default: ''
    },
    datetimerange: {
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
    this.contentHeight = `calc(100% - ${(this.$refs.paneTop.offsetHeight / 20) + 6.5}rem)`
  },
  methods: {
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
      patientExamine_getList(query).then(res => {
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
        examineId: row.id
      }
      this.row = row
      patientExamineDetail_getList(query).then(res => {
        this.loadingDetailData = false
        if (!(res.code === 0)) {
          return
        }
        this.tableDetailData = res.data
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
.check-report-pane {
  height: calc(100% - 2.9rem);

  .check-report-pane-top {
    .check-report-pane-top-search {
      display: flex;
      overflow-x: auto;
      padding: 1rem 0;
      margin-bottom: -1rem;
    }

    .check-report-pane-top-title {
      font-size: 1.3rem;
      font-weight: bold;
      padding: 1rem;
    }

    .check-report-pane-top-desc {
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

  .check-report-pane-list {
    border: .05rem dashed #ddd;
    padding: 1rem;
    margin-top: 1rem;

    .check-report-pane-list-item {
      text-align: left;
      margin-bottom: 1rem;
    }
  }
}
</style>
