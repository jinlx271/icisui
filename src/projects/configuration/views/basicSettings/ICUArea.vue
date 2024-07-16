<!-- ICU病区设置 -->
<template>
  <div id="ICUArea" class="ICUArea">
    <div class="ICUArea_left">
      <el-container>
        <el-header class="elHeader1">
          <div class="iconBlueDiv">
            <i class="iconBlue"></i>
            <span>病区列表</span>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:icuWardConfig']" class="queryButton" size="small" type="primary" @click="insertIcuArea">转为ICU病区</el-button>
          </div>
        </el-header>
        <el-main v-loading="leftLoading" style="height:100%">
          <el-table height="100%" @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="tableData" :data="tableData" highlight-current-row fit border row-key="id">
            <v-table-column type="selection" width="55"></v-table-column>
            <v-table-column prop="wardCode" label="病区代码" align="center"></v-table-column>
            <v-table-column prop="wardName" label="病区名称" align="center"></v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <div class="ICUArea_right">
      <el-container>
        <el-header class="elHeader1">
          <div class="iconBlueDiv">
            <i class="iconBlue"></i>
            <span>ICU病区列表</span>
          </div>
          <div>
            <el-button v-hasPermi="['configuration:basicSettings:icuWardConfig']" class="queryButton" size="small" type="primary" @click="deleteIcuArea">转为普通病区</el-button>
          </div>
        </el-header>
        <el-main v-loading="rightLoaing" style="height:100%">
          <el-table height="100%" @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)" ref="icuData" :data="icuData" highlight-current-row border row-key="id">
            <v-table-column type="selection" width="55"></v-table-column>
            <v-table-column prop="wardCode" label="病区代码" align="center"></v-table-column>
            <v-table-column prop="wardName" label="病区名称" align="center"></v-table-column>
            <v-table-column label="病区标识" prop="wardIdentification"  align="center">
              <template slot-scope="scope" >
                <el-select v-if="scope.row.isEdit" v-model="scope.row.wardIdentification" placeholder="请选择" filterable :disabled="!scope.row.isEdit">
                  <el-option v-for="option in wardInfo.list" :key="option.dictCode+'wardIdentification'" :label="option.dictName" :value="option.dictCode" :disabled="option.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ scope.row.wardIdentification ? wardInfo.list.filter((item) => item.dictCode == scope.row.wardIdentification)[0].dictName : '' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="所属院区" prop="areaCode"  align="center">
              <template slot-scope="scope" >
                <el-select v-if="scope.row.isEdit" v-model="scope.row.areaCode" placeholder="请选择" filterable :disabled="!scope.row.isEdit">
                  <el-option v-for="item in areaList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" :disabled="item.statusDict == '0'"></el-option>
                </el-select>
                <span v-else>{{ scope.row.areaCode ? areaList.filter((res) => res.areaCode == scope.row.areaCode)[0].areaName : '' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="100px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']" @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']" type="text" @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:drugUsageConfig']" type="text" @click="saveItemRow(scope.$index, scope.row)">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { icuWard_update, icuWard_deleteById, icuWard_findWithPage, icuWard_insert, ward_findWithPage, area_findAll } from '@/api/configuration'
export default {
  name: 'ICUArea',
  components: {},
  data: function () {
    return {
      wardInfo: {
        code: 'ICIS_DICT_WARD_IDENTIFICATION',
        list: []
      },
      curRow: [],
      leftLoading: false,
      rightLoaing: false,
      total: 0,
      searchKey: '',
      pagerCount: 0,
      ICUTotal: 0,
      // 病区列表
      tableData: [],
      // ICU病区列表
      icuData: [],
      pageNum: 1,
      icuPageSize: 10,
      areaList: [] // 院区集合
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.initData()
  },
  methods: {
    // 修改药品用法目
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.icuData = JSON.parse(JSON.stringify(this.icuData))
    },
    // 取消当前行编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (row.isCreate) {
        this.icuData.splice(index, 1)
      } else {
        this.icuData[index] = this.curRow[index]
        this.icuData = JSON.parse(JSON.stringify(this.icuData))
      }
    },
    // 保存药品用法目
    saveItemRow(index, row) {
      icuWard_update(row).then(() => {
        this.initData()
      })
    },
    // 初始化数据
    async initData() {
      this.loading = true
      this.leftLoading = true
      this.areaList = await this.areaFindAll()
      const batchObj = await this.$batchGetDictItemList([this.wardInfo.code])
      this.wardInfo.list = batchObj[this.wardInfo.code]
      this.getIcuAreaList()
    },
    // 获取病区列表
    getAreaList(pageNum) {
      ward_findWithPage({
        pageNum: 1,
        pageSize: 1000,
        searchKey: ''
      }).then((res) => {
        this.leftLoading = false
        this.totalCount = res.data.totolCount
        // 将ICU病区过滤掉
        const arr = []
        res.data.result.map((item) => {
          const result = this.icuData.filter((icuObj) => icuObj.wardCode == item.wardCode)
          if (result.length == 0) {
            arr.push(item)
          }
        })
        this.tableData = arr
        this.totalCount = this.tableData.length
      })
    },
    // 获取icu病区
    getIcuAreaList() {
      this.rightLoaing = true
      const query = {
        pageNum: 1,
        pageSize: 1000,
        searchKey: ''
      }
      icuWard_findWithPage(query).then((res) => {
        this.rightLoaing = false
        if (res.code == 0) {
          this.icuData = res.data.result
          this.icuTotalCount = res.data.totolCount
          this.getAreaList()
        }
      })
    },
    // 将普通病区转为ICU病区
    insertIcuArea() {
      const selectionData = this.$refs.tableData.selection
      const promise = selectionData.map((item) => {
        return new Promise((resolve, reject) => {
          const query = {
            wardCode: item.wardCode,
            wardName: item.wardName
          }
          this.insertArea(query, resolve)
        })
      })
      Promise.all(promise).then(() => {
        // 执行完毕后 刷新icu病区列表
        this.getIcuAreaList()
      })
    },
    async insertArea(query, resolve) {
      await icuWard_insert(query)
      resolve()
    },
    // 将ICU病区转为普通病区
    deleteIcuArea() {
      const selectionData = this.$refs.icuData.selection
      const promise = selectionData.map((item) => {
        return new Promise((resolve, reject) => {
          const query = item.wardCode
          this.deleteArea(query, resolve)
        })
      })
      Promise.all(promise).then(() => {
        // 执行完毕后 刷新icu病区列表
        this.getIcuAreaList()
      })
    },
    async deleteArea(query, resolve) {
      await icuWard_deleteById(query)
      resolve()
    },
    /**
     * 请求院区列表
     */
    areaFindAll() {
      return new Promise((resolve, reject) => {
        area_findAll({}).then(res => {
          resolve(res.data)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法
.ICUArea {
  height: 100%;
  display: flex;
  background: #fff;
  &_left {
    width: calc(50% - 10px);
    flex: 1;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    height: 100%;
  }
  &_right {
    flex: 1;
    height: 100%;
  }
  ::v-deep .el-container {
    height: 100%;
    width: 100%;
    padding: 10px;
  }
  .iconBlueDiv {
    display: inline-flex;
    align-items: center;
  }
}
</style>
