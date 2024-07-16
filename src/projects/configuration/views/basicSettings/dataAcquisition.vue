<!-- 监护事件设置 -->
<template>
  <div class="dataAcquisition">
    <el-container class="container" element-loading-text="加载中" v-loading="loading">
      <el-header class="container_head">
        <div>
          <el-input size="small" placeholder="编码/名称" suffix-icon="el-icon-search" v-model="qeuryData.searchKey"
            @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
        </div>
        <div>
          <el-button v-hasPermi="['configuration:basicSettings:dictionaryConversion']" size="small" type="primary"
            @click="oneToMany">一对多对照关系</el-button>
          <el-button v-hasPermi="['configuration:basicSettings:dictionaryConversion']" size="small" type="primary"
            @click="operation('add')">新增</el-button>
        </div>
      </el-header>
      <el-main class="container_body">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
          fit border highlight-current-row style="width: 100%;overflow: auto;">
          <v-table-column prop="dataType" label="数据类型" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.dataType" placeholder="请选择" remote
                clearable style="width:100%">
                <el-option v-for="item in icisDataType" :key="item.dictCode + item.dictName" :value="item.dictCode"
                  :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.dataTypeName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="deviceType" label="归属设备" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.deviceType" placeholder="请选择"
                remote clearable style="width:100%">
                <el-option v-for="item in deviceType" :key="item.dictCode + item.dictName" :value="item.dictCode"
                  :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.deviceTypeName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="moniitemCode" label="监护项编码" align="center"></v-table-column>
          <v-table-column prop="moniitemName" label="监护项名称" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.moniitemCode" placeholder="请选择"
                filterable :filter-method="(val) => filterMethod(scope.row.moniitemCode, val)"
                @focus="() => filterMethod(scope.row.moniitemCode, '')" clearable style="width:100%">
                <el-option v-for="item in sonDictionaries" :key="item.moniitemCode" :value="item.moniitemCode"
                  :disabled="item.statusDict == '0'" :label="item.moniitemName">
                  <span style="float: left">{{ item.moniitemName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.moniitemCode }}</span>
                </el-option>
              </el-select>
              <span v-else>{{ scope.row.moniitemName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="collectionCode" label="对照采集平台编码" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.collectionCode" :maxlength="20"
                placeholder="请输入" clearable></el-input>
              <span v-else>{{ scope.row.collectionCode }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="collectionName" label="对照采集平台名称" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.collectionName" :maxlength="20"
                placeholder="请输入" clearable></el-input>
              <span v-else>{{ scope.row.collectionName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="priority" label="优先级" align="center">
            <template slot-scope="scope">
              <el-input-number :min="0" :max="99999999999999" :controls="false" v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.priority" :maxlength="20" placeholder="请输入" clearable class="w100"></el-input-number>
              <span v-else>{{ scope.row.priority }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="selectRange" label="误差范围（秒）" align="center">
            <template slot-scope="scope">
              <el-input-number :min="0" :max="99999999999999" :controls="false" v-if="scope.row.isEdit || scope.row.isAdd"
                v-model="scope.row.selectRange" :maxlength="20" placeholder="请输入" clearable class="w100"></el-input-number>
              <span v-else>{{ scope.row.selectRange }}</span>
            </template>
          </v-table-column>
          <v-table-column label="保留小数位数" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.decimalPlace" placeholder="请选择" clearable>
                <el-option v-for="item in decimalPlaceList" :key="item.dictCode + item.dictName" :value="item.dictCode"
                  :label="item.dictName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.decimalPlace }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="normal" label="常规模式对码" align="center">
            <template slot-scope="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.normal" :disabled="!(scope.row.isEdit || scope.row.isAdd)"></el-checkbox>
            </template>
          </v-table-column>
          <v-table-column prop="rescure" label="抢救模式对码" align="center">
            <template slot-scope="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.rescure" :disabled="!(scope.row.isEdit || scope.row.isAdd)"></el-checkbox>
            </template>
          </v-table-column>
          <v-table-column prop="rescure" label="仅手工获取" align="center">
            <template slot-scope="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.manual" :disabled="!(scope.row.isEdit || scope.row.isAdd)"></el-checkbox>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="140px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                v-hasPermi="['configuration:basicSettings:dictionaryConversion']"
                @click.native.prevent="operation('update', scope.row, scope.$index)" type="text"
                size="small">修改</el-button>
              <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                v-hasPermi="['configuration:basicSettings:dictionaryConversion']"
                @click.native.prevent="operation('delete', scope.row, scope.$index)" style="color:#F56C6C" type="text"
                size="small">删除</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text"
                v-hasPermi="['configuration:basicSettings:dictionaryConversion']"
                @click="operation('cancel', scope.row, scope.$index)">取消</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text"
                v-hasPermi="['configuration:basicSettings:dictionaryConversion']"
                @click="operation('save', scope.row, scope.$index)">保存</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog :close-on-click-modal="false"  v-el-drag-dialog title="一对多对照关系" :visible.sync="dialogFlag" width="1200px" :before-close="closeDiaglog">
      <el-table :data="dialogTable" border fit height="height" @cell-click="cellClick" :span-method="arraySpanMethod" >
        <el-table-column label="数据类型" prop="dataTypeName"></el-table-column>
        <el-table-column label="监护项编码" prop="moniitemCode"></el-table-column>
        <el-table-column label="监护项名称" prop="moniitemName"></el-table-column>
        <el-table-column label="归属设备" prop="deviceTypeName"></el-table-column>
        <el-table-column label="对照采集编码" prop="collectionCode"></el-table-column>
        <el-table-column label="对照采集名称" prop="collectionName"></el-table-column>
        <v-table-column prop="priority" label="优先级" align="center">
            <template slot-scope="scope">
              <el-input-number :min="0" :max="99999999999999" :controls="false" v-if="scope.row.isEdit"
                v-model="scope.row.priority" :maxlength="20" placeholder="请输入" clearable class="w100" @blur="savePriority(scope.row)" :ref="scope.row.id"></el-input-number>
              <div v-else >{{ scope.row.priority }}</div>
            </template>
        </v-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
// import { frontFilter } from '@/utils/index' // 模糊查询方法
import {
  collToMoniitem_list, // 查询
  collToMoniitem_add, // 增
  collToMoniitem_update, // 改
  collToMoniitem_delete, // 删
  moniitem_multipleListPage, // 字典分组列表
  collToMoniitem_oneToManyRelationship,
  collToMoniitem_updatePriority
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'DictionaryConversion',
  components: {},
  filters: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      qeuryData: {
        searchKey: '' // 编码或名称
      },
      oneTableData: {}, // 取消用来还原
      tableData: [], // 右边表格数据

      icisDataType: [], // 数据类型字典
      deviceType: [], // 设备类型字典
      sonDictionaries: [], // 监护项
      decimalPlaceList: [
        {
          dictCode: '0',
          dictName: '0'
        },
        {
          dictCode: '1',
          dictName: '1'
        },
        {
          dictCode: '2',
          dictName: '2'
        }
      ],
      dialogFlag: false, // 一对多对照关系 弹框
      dialogTable: [], // 一对多对照关系表
      oldPriority: 0
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.debounceSearch = debounce((val) => {
      this.queryFc(val)
    }, 300)
    this.init()
  },
  mounted() {

  },
  methods: {
    /**
     * 初始化
     */
    async init() {
      const { ICIS_DICT_C2M_DATATYPE, ICIS_DICT_DEVICE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_C2M_DATATYPE', 'ICIS_DICT_DEVICE_TYPE'])
      // 数据类型字典
      this.icisDataType = ICIS_DICT_C2M_DATATYPE
      // 设备类型
      this.deviceType = ICIS_DICT_DEVICE_TYPE
      // 列表查询
      this.queryFc()
    },
    /**
     * 查询列表
     */
    queryFc(val) {
      if (typeof val != 'string') {
        val = ''
      }
      this.qeuryData.searchKey = val
      collToMoniitem_list(this.qeuryData).then((res) => {
        const data = res.data
        data.map(i => {
          i.isEdit = false
        })
        this.tableData = data
      })
    },
    /**
     * 监护项名称下拉框搜索方法
     */
    filterMethod(code, val) {
      // 获取监护数据
      this.multipleListPageFc(code ? [code] : [], val)
    },
    /**
     * 监护字典详情
     */
    async multipleListPageFc(code, val) {
      const res = await moniitem_multipleListPage({
        moniitemCodes: code, // 本条数据放第一条查询出来
        limit: 50, // 查询前多少条
        statusDict: '1', // 查询启用的
        contentTypeDicts: '1,2', // 数字类型
        searchKey: val || '' // 搜索条件
      })
      // 获取监护项字典数据
      this.sonDictionaries = res.data.result
    },
    /**
     * 表格增删改查
     */
    operation(type, item, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      const data = {
        dataType: '', // 数据类型
        dataTypeName: '', // 数据类型名称
        deviceType: '', // 归属设备类型
        deviceTypeName: '', // 归属设备类型名称
        moniitemCode: '', // 监护项编码
        moniitemName: '', // 监护项名称
        collectionCode: '', // 对照采集平台编码
        collectionName: '', // 对照采集平台名称
        selectRange: '300', // 误差范围
        normal: '1', // 常规模式对码
        rescure: '1', // 抢救模式对码
        isEdit: false, // 修改状态
        manual: '',
        isAdd: true, // 新增状态,
        priority: 0 // 优先级
      }
      switch (type) {
        case 'add':
          // 校验有没有其他修改情况
          if (this.stateJudgement(this.tableData)) {
            break
          }
          this.tableData.unshift(data)
          // 监护下拉数据
          this.filterMethod()
          return
        case 'delete':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.tableData)) {
            break
          }
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              collToMoniitem_delete({
                id: item.id
              })
                .then(res => {
                  this.loading = false
                  this.$message.success('删除成功！')
                  // 列表查询
                  this.queryFc()
                })
                .catch(() => {
                  this.loading = false
                })
            })

          return
        case 'update':
          // 校验有没有其他修改情况
          if (this.stateJudgement(this.tableData)) {
            break
          }
          // 监护下拉数据
          this.filterMethod(item.moniitemCode)
          this.oneTableData = JSON.parse(JSON.stringify(item))
          item.isEdit = true
          return
        case 'cancel':
          if (item.isEdit) {
            this.$set(this.tableData, index, {
              ...JSON.parse(JSON.stringify(this.oneTableData)),
              isEdit: false
            })
          } else {
            this.tableData.shift()
          }
          return
        case 'save':
          if (!item.dataType) {
            this.$message.error('请选择数据类型!')
            break
          }
          if (!item.deviceType) {
            this.$message.error('请选择归属设备!')
            break
          }
          if (item.priority === '' || item.priority === null) {
            this.$message.error('请输入优先级!')
            break
          }
          if (!item.moniitemCode) {
            this.$message.error('请选择监护项!')
            break
          }
          if (!item.collectionCode) {
            this.$message.error('请输入对照采集平台编码!')
            break
          }
          if (!item.collectionName) {
            this.$message.error('请输入对照采集平台名称!')
            break
          }
          if ((item.selectRange ?? '') === '') {
            this.$message.error('请输入误差范围!')
            break
          }
          if (item.isEdit) {
            query = collToMoniitem_update
            successName = '修改成功'
          } else if (item.isAdd) {
            query = collToMoniitem_add
            successName = '保存成功'
          }
          this.loading = true
          query(item).then(res => {
            this.$message.success(successName)
            // 列表查询
            this.queryFc()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          return
      }
    },
    /**
     *  状态判断
     */
    stateJudgement(data) {
      if (
        data.filter(res => {
          return res.isAdd
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有新增数据没有保存,请先保存!'
        })
        return true
      }
      if (
        data.filter(res => {
          return res.isEdit
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有修改数据没有保存,请先保存!'
        })
        return true
      }
      return false
    },
    /**
     * 显示一对多对照关系
     */
    oneToMany() {
      this.dialogTable = []
      collToMoniitem_oneToManyRelationship().then(res => {
        this.dialogFlag = true
        res.data.forEach(item => {
          item.collectionList.forEach((c, index) => {
            this.dialogTable.push({
              'rowIndex': index,
              'rowSpan': item.collectionList.length,
              'dataType': item.dataType,
              'dataTypeName': item.dataTypeName,
              'moniitemCode': item.moniitemCode,
              'moniitemName': item.moniitemName,
              'id': c.id,
              'priority': c.priority,
              'deviceTypeName': c.deviceTypeName,
              'collectionCode': c.collectionCode,
              'collectionName': c.collectionName
            })
          })
        })
        console.log('this.dialogTable', this.dialogTable)
      })
    },
    /**
     * 保存优先级
     */
    savePriority(row) {
      if (this.oldPriority != row.priority) {
        collToMoniitem_updatePriority({
          'id': row.id,
          'priority': row.priority
        }).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.dialogTable = [...this.dialogTable]
            this.$message.success('保存成功')
          }
        })
      } else {
        row.isEdit = false
        this.dialogTable = [...this.dialogTable]
      }
    },
    /**
     * 关闭弹框
     */
    closeDiaglog() {
      this.dialogFlag = false
      this.queryFc()
    },
    cellClick(row, column, cell, event) {
      if (column.property == 'priority') {
        row.isEdit = true
        this.oldPriority = row.priority
        this.dialogTable = [...this.dialogTable]
        this.$nextTick(() => {
          console.log('dom', this.$refs[row.id]?.$el.querySelector('input'))
          this.$refs[row.id]?.$el.querySelector('input').focus()
        })
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property == 'dataTypeName' || column.property == 'moniitemCode' || column.property == 'moniitemName') {
        if (row.rowIndex == 0) {
          return {
            rowspan: row.rowSpan,
            colspan: 1
          }
        } else {
           return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.dataAcquisition {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;

  .container {
    height: 100%;

    &_head {
      div {}
    }

    &_body {
      height: calc(100% - 102px);
    }

    &_footer {}
  }
}
</style>
