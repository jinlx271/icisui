<template>
  <div class="orderQuery" id="orderQuery" ref="orderQuery" element-loading-text="加载中" v-loading="loading">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header class="orderQueryHeader">
        <el-form>
          <el-form-item>
            <el-input class="inputclass" v-model="queryData.hisOrderNo" size="small" placeholder="请输入hisOrderNo/v5xh"
              clearable suffix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item label="接口模式">
            <el-select class="inputclass" filterable clearable v-model="queryData.apiType" placeholder="请选择">
              <el-option label="点对点" value="1"></el-option>
              <el-option label="ESB消息库" value="2"></el-option>
              <el-option label="ESB解耦+60护士站" value="3"></el-option>
              <el-option label="ESB解耦+5x护士站" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <wn-date-picker size="mini" style="margin-right: 5px" value-format="yyyy-MM-dd HH:mm:ss"
              v-model="datetimerange" range-separator="-" type="datetimerange" unlink-panels start-placeholder="开始时间"
              :default-time="['00:00:00', '23:59:59']" end-placeholder="结束时间"
              :picker-options="pickerOptions"></wn-date-picker>
          </el-form-item>
        </el-form>
        <el-button size="mini" @click.native.prevent="debounceFC" type="primary">查 询</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <div class="m-b10">
          <span>message: </span>
          <span class="redCss">{{ message }}</span>
        </div>
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="tableData" :data="tableData" highlight-current-row fit border height="calc(100% - 26px)"
          style="width:100%;overflow: auto;" row-key="id">
          <v-table-column prop="createTime" label="创建时间" align="center" width="150"></v-table-column>
          <v-table-column prop="servicName" label="服务名称" align="center" width="150"></v-table-column>
          <v-table-column prop="content" label="内容" align="center">
            <template slot-scope="scope">
              <span class="patientNameEllipsis pointer" style="--patient-name-width: 100%;--patient-name-columns: 4;"
                title="点击查看详情" @click="handleShowDetail('内容', scope.row.content)">{{ scope.row.content
                }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="exceptionContent" label="异常内容" align="center" width="280px">
            <template slot-scope="scope">
              <span class="patientNameEllipsis pointer" style="--patient-name-width: 100%;--patient-name-columns: 4;"
                title="点击查看详情" @click="handleShowDetail('异常内容', scope.row.exceptionContent)">{{ scope.row.exceptionContent
                }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="statusName" label="状态" align="center" width="100"></v-table-column>
          <v-table-column label="操作" align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.statusName == '已提取'" size="mini" type="text"
                @click="handleCheckExecuteRecord(scope.row)">查看已执行计划</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <!-- 分页 -->
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryData.pageNum" :total="totolCount" :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="queryData.pageSize" :hide-on-single-page="false" layout="total, sizes, prev, pager, next"
          class="pagination" background></el-pagination>
      </el-footer>
    </el-container>
    <el-dialog v-el-drag-dialog :title="detailTitle" :visible.sync="isShowDetail" :close-on-click-modal="false"
      width="1200px">
      <pre class="detail-content" v-html="detailContent"></pre>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="default" @click="() => { isShowDetail = false }">取消</el-button>
        <el-button size="small" type="primary" @click="copyText(detailContent)">复制</el-button>
      </span>
    </el-dialog>
    <!-- <OrderExecuteRecord :show.sync="isVisibleExecuteRecordDialog" :order-data="curOrderRow"
      :showExecuteOperateBtn="false">
    </OrderExecuteRecord> -->
  </div>
</template>
<script>

import { outerLog_orderQuery } from '@/api/configuration'
import _ from 'lodash'
// import OrderExecuteRecord from '@/views/inpatienArea/components/docOrder/orderExecuteRecord.vue'
export default {
  name: 'DataSourceConfig',
  // components: { OrderExecuteRecord },
  props: {},
  data() {
    return {
      XTCS0172: '1',
      loading: false, // 表格的loding
      queryData: {
        startDateTime: this.$dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00'),
        endDateTime: this.$dayjs().format('YYYY-MM-DD 23:59:59'),
        pageNum: 1, // 页码必传
        pageSize: 10, // 一页数量，必传
        apiType: '2', // 接口对接模式，1-点对点，2-ESB消息库，3-ESB解耦
        hisOrderNo: '' // hisOrderNo/v5xh
      },
      datetimerange: [this.$dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00'), this.$dayjs().format('YYYY-MM-DD 23:59:59')],
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据
      isShowDetail: false,
      detailTitle: '',
      detailContent: '',
      pickerOptions: {
        disabledDate: (time) => {
          const endTime = this.$dayjs().format('YYYY-MM-DD 23:59:59')
          const startTime = this.$dayjs(endTime).subtract(29, 'day').format('YYYY-MM-DD 00:00:00')
          return time.getTime() > this.$dayjs(endTime).valueOf() || time.getTime() < this.$dayjs(startTime).valueOf()
        }
      },
      curOrderRow: {},
      isVisibleExecuteRecordDialog: false,
      message: ''
    }
  },
  provide() {
    return {
      timeFormat: () => this.XTCS0172 == 1 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm'
    }
  },
  watch: {},
  computed: {},
  beforeCreated() { },
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    this.init() // 初始化
  },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  update() { },
  beforeDestroy() { },
  destroyed() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryData.pageNum = 1
      this.queryTableFc()
    },
    /**
     * 查询事件
     */
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : _.debounce(function () {
        this.queryTableFc(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    /**
     * 列表请求
     */
    queryTableFc(pageNum) {
      this.loading = true
      pageNum && (this.queryData.pageNum = pageNum)
      this.tableData = []
      if (this.datetimerange && this.datetimerange.length) {
        this.queryData.startDateTime = this.datetimerange[0]
        this.queryData.endDateTime = this.datetimerange[1]
      } else {
        this.queryData.startDateTime = ''
        this.queryData.endDateTime = ''
      }
      outerLog_orderQuery(this.queryData).then(res => {
        const list = res.data.list || []
        this.totolCount = list.length
        list.map(item => {
          item.editOrSave = false
        })
        this.tableData = list
        this.message = res.data.message
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.queryTableFc()
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.queryTableFc()
    },
    handleShowDetail(title, detail) {
      this.isShowDetail = true
      this.detailTitle = title
      this.detailContent = JSON.stringify(JSON.parse(detail), null, 4)
    },
    copyText(text) {
      const tempElement = document.createElement('textarea')
      tempElement.value = text
      document.body.appendChild(tempElement)
      tempElement.select()
      document.execCommand('copy')
      document.body.removeChild(tempElement)
      this.$message.success('复制成功')
    },
    handleCheckExecuteRecord(row) {
      this.isVisibleExecuteRecordDialog = true
      const { groupNo, icuRecordId } = row
      this.curOrderRow = { groupNo, icuRecordId }
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.orderQuery {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background: #fff;

  .inputclass {
    margin-right: 10px;
  }

  .redCss {
    color: #f52c2c;
  }

  .pagination {
    float: right;
    margin-top: 15px;
    margin-right: -15px;
  }

  .elDialogCss {
    .lineP {
      display: flex;
      align-items: center;

      .name {
        flex: 3;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .value {
        flex: 6.5;
      }
    }
  }

  .detail-content {
    height: 60vh;
    overflow-y: auto;
    white-space: pre-wrap;
    margin: 0;
  }
}
</style>
