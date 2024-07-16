<template>
  <div class="deviceMonitor" id="deviceMonitor" ref="deviceMonitor" element-loading-text="加载中" v-loading="loading">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header class="deviceMonitorHeader">
        <div class="flex">
          <el-input class="inputclass" v-model="queryData.searchKey" size="small" placeholder="设备编码/设备名称/患者姓名/床号" clearable @input="debounceFC"
            suffix-icon="el-icon-search" style="width:300px; max-width:400px;"></el-input>
          <label style="width:40px;">病区</label>
          <el-select class="inputclass" filterable clearable v-model="queryData.icuAreaCode" placeholder="请选择" @change="debounceFC">
            <el-option v-for="ward in icuWardList" :key="ward.wardCode" :label="ward.wardName" :value="ward.wardCode" ></el-option>
          </el-select>
          <label style="width:65px;">设备类型</label>
          <el-select class="inputclass" filterable clearable v-model="queryData.deviceTypeDict" placeholder="请选择" @change="debounceFC">
            <el-option v-for="dict in deviceList" :key="dict.dictCode" :label="dict.dictName" :value="dict.dictCode" :forceHide="dict.statusDict!='1'"></el-option>
          </el-select>
        </div>
        <el-button size="mini" @click.native.prevent="debounceFC" type="primary">查 询</el-button>
      </el-header>
      <!-- 表格 -->
      <el-main style="height:calc(100% - 112px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="tableData" :data="tableData" highlight-current-row fit border height="100%"
          style="width:100%;overflow: auto;" row-key="id">
          <v-table-column prop="icuAreaName" label="病区" align="center" ></v-table-column>
          <v-table-column prop="bedNo" label="床位" align="center" width="100"></v-table-column>
          <v-table-column prop="patientName" label="患者姓名" align="center" width="100"></v-table-column>
          <v-table-column prop="deviceTypeName" label="设备类型" align="center" >
          </v-table-column>
          <v-table-column prop="deviceCode" label="设备编号" align="center">
          </v-table-column>
          <v-table-column prop="deviceName" label="设备名称" align="center">
          </v-table-column>
          <v-table-column prop="abnormalFlag" label="当前状态" align="center" width="100">
            <template slot-scope="scope">
              <span> {{scope.row.abnormalFlag===true?'正常':'异常'}}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="checkStatuts(scope.row)" type="text" v-if="!scope.row.abnormalFlag">故障排查</el-button>
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
    <el-dialog v-el-drag-dialog title="故障排查" :visible.sync="isShowDetail" :close-on-click-modal="false"
      width="1200px">
      <div class="flex align-items-center bg">
        <el-card v-for="(data,index) in statusErrorInfo" :key="index" style="width:320px;height:fit-content;margin-right:50px;margin-left:20px;" >
          <div style="text-align:center">
            <i :class="data.troubleFlag?'el-icon-warning warning':'el-icon-success  success'" style="font-size:40px;"></i>
            <p>{{data.nodeName}}</p>
            <div v-if="data.troubleFlag" style="text-align:left">
              <p v-html="'错误信息：'+data.troubleMsg"></p>
              <p v-html="'建议：'+data.troubleAdvise"></p>
            </div>
          </div>

        </el-card>
        <!-- <div v-for="(data,index) in statusErrorInfo" :key="index" class="card" :style="{
          background:data.troubleFlag?'#FF8A00':'#00C682'
        }">
          <i :class="data.troubleFlag?'el-icon-warning warning':'el-icon-success'" style="font-size:40px;"></i>
            <p>{{data.nodeName}}</p>
            <div v-if="data.troubleFlag" style="text-align:left">
              <p v-html="'错误信息：'+data.troubleMsg"></p>
              <p v-html="'建议：'+data.troubleAdvise"></p>
            </div>
        </div> -->
      </div>

    </el-dialog>
  </div>
</template>
<script>

import {
  deviceStatus_useringPageList,
  icuWard_findWithPage,
  deviceStatus_troubleshooting
} from '@/api/configuration'
import _ from 'lodash'

export default {
  name: 'DeviceMonitor',
  components: {},
  props: {},
  data() {
    return {
      icuWardList: [],
      deviceList: [],
      loading: false, // 表格的loding
      queryData: {
        deviceTypeDict: '',
        icuAreaCode: '',
        pageNum: 1, // 页码必传
        pageSize: 10, // 一页数量，必传
        searchKey: '' // 搜索关键字，非必传
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
      },
      statusErrorInfo: {
      },
      debounceFC: ''
    }
  },
  watch: {},
  computed: {},
  beforeCreated() { },
  async created() {
    this.deviceList = await this.$getDictItemList('ICIS_DICT_DEVICE_TYPE')
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
    getICUAreaList() {
      icuWard_findWithPage({
        pageSize: 1000,
        pageNum: 1
      }).then(res => {
        this.icuWardList = res.data.result
      })
    },
    /**
     * 初始化
     */
    init() {
      this.queryData.pageNum = 1
      this.queryTableFc()
      this.getICUAreaList()
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

      deviceStatus_useringPageList(this.queryData).then(res => {
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
    checkStatuts(row) {
      deviceStatus_troubleshooting(row.deviceConnectId).then(res => {
        this.isShowDetail = true
        this.statusErrorInfo = res.data
      })
    }

  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/config-common.scss'; // 公共css方法
.bg{
  background-image:linear-gradient(to right,#ddd 60%,rgba(255,255,255,0) 0%);
  background-position:0px calc(50% - 4px);
  background-size:8px 2px;
  background-repeat:repeat-x;
}
.card{
  width:320px;
  margin-right:50px;
  margin-left:20px;
}
.deviceMonitor {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background: #fff;
  .deviceMonitorHeader {
    ::v-deep .el-header .el-input{
      max-width:400px;
    }
    label{
      font-size:14px;
      margin-left:20px;
      margin-right:5px;
    }
  }
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
