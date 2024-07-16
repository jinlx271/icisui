<!-- 监护事件设置 -->
<template>
  <div class="dictionaryConversion">
    <el-container class="container" element-loading-text="加载中" v-loading="loading">
      <el-header class="container_head">
        <div>
          <el-input size="small" placeholder="字典项编码/名称" suffix-icon="el-icon-search" v-model="qeuryTableData.searchKey"
            @keyup.enter.native="debounceSearch" @input="debounceSearch"></el-input>
        </div>
        <div>
          <el-button v-hasPermi="['configuration:basicSettings:editDictionary']" size="small" type="primary"
            @click="operation('add')">新增</el-button>
        </div>
      </el-header>
      <el-main class="container_body">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="table" height="100%" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData"
          fit border highlight-current-row style="width: 100%;overflow: auto;">
          <v-table-column prop="dictGroupName" label="字典分组名称" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.dictGroup" placeholder="请选择"
                :filter-method="(val) => { filterGroupData(scope.row, val) }"
                @focus="(val) => { filterGroupData(scope.row) }" @change="filterGroupFc(scope.row, scope.$index)"
                @clear="(val) => { filterGroupData(val, scope.row) }" filterable remote clearable style="width:100%">
                <el-option v-for="item in dictionaries" :key="item.groupCode" :value="item.groupCode"
                  :disabled="item.statusDict == '0'" :label="item.groupName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.dictGroupName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="icisDictValue" label="字典项编码" align="center"></v-table-column>
          <v-table-column prop="icisDictName" label="字典项名称" align="center">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.icisDictValue" placeholder="请选择"
                @change="filterSonFc(scope.row, scope.$index)" clearable style="width:100%">
                <el-option v-for="item in sonDictionaries" :key="item.dictCode" :value="item.dictCode"
                  :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
              </el-select>
              <span v-else>{{ scope.row.icisDictName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="outerDictValue" label="对照编码" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.outerDictValue" :maxlength="60"
                placeholder="请输入" clearable></el-input>
              <span v-else>{{ scope.row.outerDictValue }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictDesc" label="对照名称" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit || scope.row.isAdd" v-model="scope.row.dictDesc" :maxlength="100"
                placeholder="请输入" clearable></el-input>
              <span v-else>{{ scope.row.dictDesc }}</span>
            </template>
          </v-table-column>

          <v-table-column label="操作" width="140px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                v-hasPermi="['configuration:basicSettings:editDictionary']"
                @click.native.prevent="operation('update', scope.row, scope.$index)" type="text"
                size="small">修改</el-button>
              <el-button v-if="!scope.row.isEdit && !scope.row.isAdd"
                v-hasPermi="['configuration:basicSettings:editDictionary']"
                @click.native.prevent="operation('delete', scope.row, scope.$index)" style="color:#F56C6C" type="text"
                size="small">删除</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text"
                v-hasPermi="['configuration:basicSettings:editDictionary']"
                @click="operation('cancel', scope.row, scope.$index)">取消</el-button>
              <el-button v-if="scope.row.isEdit || scope.row.isAdd" type="text"
                v-hasPermi="['configuration:basicSettings:editDictionary']"
                @click="operation('save', scope.row, scope.$index)">保存</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <el-footer class="container_footer">
        <el-pagination @size-change="changePagination" @current-change="changePagination"
          :current-page="qeuryTableData.pageNum" :hide-on-single-page="false" :page-size="qeuryTableData.pageSize"
          background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-10px"
          :total="totolCount"></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { frontFilter } from '@/utils/index' // 模糊查询方法
import {
  outerDictConvert_findWithPage, // 基础配置-字典转换对照-查询
  outerDictConvert_insert, // 基础配置-字典转换对照-增
  outerDictConvert_deleteById, // 基础配置-字典转换对照-删
  outerDictConvert_edit, // 基础配置-字典转换对照-改
  // outerDictConvert_getById, // 基础配置-字典转换对照-查询详情
  dictGroup_getDictGroupWithPage, // 字典分组列表
  dictItem_findAllWithPage // 字典详情
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'DictionaryConversion',
  components: {},
  filters: {

  },
  data: function () {
    return {
      loading: false, // 表格的loding
      qeuryTableData: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '' // 编码或名称
      },
      oneTableData: {}, // 取消用来还原
      tableData: [], // 右边表格数据
      totolCount: 0, // 分页总量
      dictionaries: [], // 字典分组集合
      sonDictionaries: [] // 字典子项
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
      await this.filterGroupData() // 字典列表
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
      this.qeuryTableData.searchKey = val
      outerDictConvert_findWithPage(this.qeuryTableData).then((res) => {
        const data = res.data
        data.result.map(i => {
          i.isEdit = false
        })
        this.tableData = data.result
        this.totolCount = data.totolCount
      })
    },
    /**
     * 字典
     */
    async filterGroupData(row, val) {
      let groupData = []
      if (row && row.dictGroup && row.dictGroupName) {
        groupData.push({
          groupCode: row.dictGroup,
          groupName: row.dictGroupName
        })
      }
      if (row && row.dictGroup == '') {
        row.icisDictValue = ''
        row.icisDictName = ''
      }
      groupData = frontFilter(val, groupData)
      this.dictionaries = await this.getGroupData(val) // 字典列表
      if (groupData?.length > 0) {
        const dictionariesOne = this.dictionaries.filter(res => {
          return groupData[0].groupCode == res.groupCode
        })
        if (dictionariesOne.length === 0) {
          this.dictionaries = this.dictionaries.concat(groupData)
        }
      }
    },
    /**
     * 字典
     * 监护项字典、标化字典、非标化字典
     */
    getGroupData(key) {
      return new Promise((resolve, reject) => {
        dictGroup_getDictGroupWithPage({
          pageNum: 1,
          pageSize: 50,
          searchKey: key || ''
        })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data.result)
            } else {
              reject([])
            }
          })
          .catch(() => {
            reject([])
          })
      })
    },
    /**
     * 字典详情
     */
    filterGroupFc(row, index, flag) {
      if (row.dictGroup == '') {
        this.sonDictionaries = []
        return
      }
      dictItem_findAllWithPage({
        dictGroupCode: row.dictGroup,
        pageNum: 1,
        pageSize: 1000,
        searchKey: '',
        statusDict: ''
      }).then(res => {
        if (!flag) {
          row.icisDictValue = ''
          row.icisDictName = ''
        }
        this.sonDictionaries = res.data.result
      })
    },
    /**
     * 字典详情选择
     */
    filterSonFc(row, index) {
      if (row.icisDictValue == '') {
        return
      }
      const oneData = this.sonDictionaries.filter(f => { return f.dictCode == row.icisDictValue })
      row.icisDictName = oneData[0].dictName || ''
    },
    /**
     * 表格增删改查
     */
    operation(type, item, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      const data = {
        dictGroup: '', // 字典分组名称
        icisDictValue: '', // 字典项编码
        icisDictName: '', // 字典项名称
        outerDictValue: '', // 对照编码
        dictDesc: '', // 对照名称
        isEdit: false, // 修改状态
        isAdd: true // 新增状态
      }
      switch (type) {
        case 'add':
          // 校验有没有其他修改情况
          if (this.stateJudgement(this.tableData)) {
            break
          }
          this.tableData.unshift(data)
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
              outerDictConvert_deleteById(
                item.id
              )
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
          this.filterGroupData(item)
          this.oneTableData = JSON.parse(JSON.stringify(item))
          this.filterGroupFc(item, index, true)
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
          if (!item.dictGroup) {
            this.$message.error('请选择字典分组名称!')
            break
          }
          if (!item.icisDictName) {
            this.$message.error('请选择字典项名称!')
            break
          }
          if (!item.outerDictValue) {
            this.$message.error('请填写对照编码!')
            break
          }
          if (!item.dictDesc) {
            this.$message.error('请填写对照名称!')
            break
          }
          if (item.isEdit) {
            query = outerDictConvert_edit
            successName = '修改成功'
          } else if (item.isAdd) {
            query = outerDictConvert_insert
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
     * 分页数据请求
     */
    changePagination(val) {
      this.qeuryTableData.pageNum = val
      this.queryFc()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.dictionaryConversion {
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
}</style>
