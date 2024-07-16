<template>
  <div class="sysErrorLog" id="sysErrorLog" ref="sysErrorLog" element-loading-text="加载中" v-loading="loading">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header class="sysErrorLogHeader">
        <div class="flex">
          <el-input class="inputclass" v-model="queryData.exceptionKey" size="small" placeholder="请输入异常内容" clearable
            suffix-icon="el-icon-search"></el-input>
          <el-input class="inputclass" v-model="queryData.module" size="small" placeholder="请输入操作模块" clearable
            suffix-icon="el-icon-search"></el-input>
          <wn-date-picker size="mini" style="margin-right: 5px" value-format="yyyy-MM-dd HH:mm:ss" v-model="datetimerange"
            range-separator="-" type="datetimerange" unlink-panels start-placeholder="开始时间"
            :default-time="['00:00:00', '23:59:59']" end-placeholder="结束时间"
            :picker-options="pickerOptions"></wn-date-picker>
        </div>
        <el-button size="mini" @click.native.prevent="debounceFC" type="primary">查 询</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="tableData" :data="tableData" highlight-current-row fit border height="100%"
          style="width:100%;overflow: auto;" row-key="id">
          <v-table-column label="操作模块" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.operModule }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作时间" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.operTime }}</span>
            </template>
          </v-table-column>
          <v-table-column label="异常内容" align="center">
            <template slot-scope="scope">
              <span class="patientNameEllipsis pointer" style="--patient-name-width: 100%;--patient-name-columns: 4;"
                title="点击查看详情" @click="handleShowDetail('异常内容', scope.row.description)">{{ scope.row.description
                }}</span>
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
  </div>
</template>
<script>

import { logsystem_findPage } from '@/api/configuration'
import _ from 'lodash'
import {
  isJSON_test
} from '@/utils/utils'
export default {
  name: 'SysErrorLog',
  components: {},
  props: {},
  data() {
    return {
      loading: false, // 表格的loding
      queryData: {
        startDateTime: this.$dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00'),
        endDateTime: this.$dayjs().format('YYYY-MM-DD 23:59:59'),
        pageNum: 1, // 页码必传
        pageSize: 10, // 一页数量，必传
        searchKey: '',
        exceptionKey: '',
        module: ''
      },
      datetimerange: [this.$dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00'), this.$dayjs().format('YYYY-MM-DD 23:59:59')],
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据
      isShowDetail: false,
      detailTitle: '',
      detailContent: '',
      pickerOptions: {
        disabledDate: (time) => {
          const createTime = this.$dayjs().format('YYYY-MM-DD 23:59:59')
          return time.getTime() > this.$dayjs(createTime).valueOf()
        }
      }
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
      logsystem_findPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount
        res.data.result.map(item => {
          item.editOrSave = false
        })
        this.tableData = res.data.result
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
      if (isJSON_test(detail)) {
        this.detailContent = JSON.stringify(JSON.parse(detail), null, 4)
      } else {
        this.detailContent = detail
      }
    },
    copyText(text) {
      const tempElement = document.createElement('textarea')
      tempElement.value = text
      document.body.appendChild(tempElement)
      tempElement.select()
      document.execCommand('copy')
      document.body.removeChild(tempElement)
      this.$message.success('复制成功')
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.sysErrorLog {
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
