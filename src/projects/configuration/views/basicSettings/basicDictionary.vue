<!-- 基础字典 -->
<template>
  <div class="basicDictionaryPage">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="全部字典" name="all">
      </el-tab-pane>
      <el-tab-pane label="监护项字典" name="2">
      </el-tab-pane>
      <el-tab-pane label="元数据字典" name="3">
      </el-tab-pane>
      <el-tab-pane label="标化字典" name="4">
      </el-tab-pane>
      <el-tab-pane label="非标化字典" name="5">
      </el-tab-pane>
      <el-tab-pane label="HIS字典" name="1">
      </el-tab-pane>
      <el-tab-pane label="内置字典" name="6">
      </el-tab-pane>
    </el-tabs>
    <el-container class='basicDictionary' element-loading-text="加载中" v-loading="loading">
      <!-- 左侧菜单 -->
      <el-aside class="basicDictionary_left" style="width:400px">
        <el-container class="basicDictionary_left_div">
          <el-header>
            <div>
              <el-input size="small" clearable placeholder="字典名称/字典编码" suffix-icon="el-icon-search"
                v-model="leftGroupName" @keyup.enter.native="leftInputFC" @input="debounceSearch"></el-input>
              <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="debounceSearch">
                显示禁用
              </el-checkbox>
            </div>
            <el-button v-hasPermi="['configuration:basicSettings:dictConfig']" class="queryButton" size="small"
              type="primary" @click="addDicGroup" v-if="activeName != 'all'">
              新增字典分组</el-button>
          </el-header>
          <!-- csc已经写高度了 -->
          <el-main class="basicDictionary_left_main">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
              class="basicDictionary_left_main_table" :show-header="false" :data="tableDataOne"
              @row-click="changeTableTwo" fit ref="tableDataOne" highlight-current-row style="overflow: auto;">
              <v-table-column prop="groupName">
                <template slot-scope="scope">
                  <div class="groupName">
                    <div class="name">
                      <div>{{ scope.row.groupName }}</div>
                      <span>{{ scope.row.groupCode }}</span>
                    </div>
                    <div class="handler">
                      <el-button v-hasPermi="['configuration:basicSettings:dictConfig']"
                        @click.native.prevent="modifyGroup(scope.$index, scope.row)" type="text"
                        size="small">修改</el-button>
                      <el-button v-hasPermi="['configuration:basicSettings:dictConfig']"
                        @click.native.prevent="enableOrDisable(scope.$index, scope.row)" type="text" size="small"
                        :style="+scope.row.statusDict ? 'color:#EC0000' : 'color:#00AB44'">{{+scope.row.statusDict ? '禁用'
                          :
                          '启用' }}</el-button>
                    </div>
                  </div>

                </template>
              </v-table-column>

              <!-- 要进行操作  删除 修改 -->
            </el-table>
          </el-main>
          <el-footer class="basicDictionary_right_footer">
            <el-pagination @size-change="changeGroupPagination" @current-change="changeGroupPagination"
              :current-page="groupPageNum" :hide-on-single-page="false" :page-size="groupPageSize" background
              layout="total, prev, pager, next" small style="float:right;margin-top:15px;" :total="groupTotolCount"
              :pager-count="5"></el-pagination>
          </el-footer>
        </el-container>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container class="basicDictionary_right">

        <el-header class="basicDictionary_right_head">
          <div>
            <el-input class="elInput" size="small" placeholder="值/值含义" suffix-icon="el-icon-search"
              v-model="qeuryTableData.searchKey" @keyup.enter.native="rightInputFC" @input="rightInputFC"></el-input>
            <el-checkbox v-model="qeuryTableData.statusDict" true-label="" false-label="1" @change="rightInputFC">
              显示禁用
            </el-checkbox>
          </div>
          <div>
            <el-button class="queryButton" size="small" type="primary" @click="showAddDictItem"
              v-show="activeName == 'HIS'">同步HIS数据</el-button>
            <el-button v-hasPermi="['configuration:basicSettings:dictConfig']" class="queryButton" size="small"
              type="primary" @click="showAddDictItem">添加字典项</el-button>
          </div>

        </el-header>
        <!-- csc已经写高度了 -->
        <el-main class="basicDictionary_right_body">
          <el-table
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            height="100%" ref="tableDataTwo" :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            :data="tableDataTwo" fit border highlight-current-row>
            <!-- <v-table-column prop="dictGroupCode" label="分组编码" :min-width="200"></v-table-column>
                      <v-table-column prop="dictGroupName" label="分组名称" :min-width="150"></v-table-column> -->
            <v-table-column prop="dictCode" label="编码">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.dictCode" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit || addOrModifyDictItem == 'modify'" maxlength="64"> </el-input>
                <span v-else>{{ scope.row.dictCode }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="dictName" label="名称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.dictName" placeholder="请输入" clearable maxlength="300"
                  :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{ scope.row.dictName }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="dictAbbr" label="简称">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" v-model="scope.row.dictAbbr" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit"> </el-input>
                <span v-else>{{ scope.row.dictAbbr }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="pinyin" label="拼音"></v-table-column>
            <v-table-column prop="wubi" label="五笔"></v-table-column>
            <v-table-column prop="sortNo" label="排序" width="120px">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" clearable
                  :disabled="!scope.row.isEdit" size="mini" style="width:90px;"> </el-input-number>
                <span v-else>{{ scope.row.sortNo }}</span>
              </template>
            </v-table-column>
            <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit && activeName != '6' && oneRow.dictGroupType != '6'"
                  v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                  inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']"
                  @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small"
                  :disabled="oneRow.dictGroupType == '6'">修改</el-button>
                <!-- <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']"
                                     @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']" type="text"
                  @click="cancelItemRow(scope.$index, scope.row)">取消</el-button>
                <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']" type="text"
                  @click="saveItemRow(scope.$index, scope.row)">保存</el-button>

              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="basicDictionary_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination"
            :current-page="qeuryTableData.pageNum" :hide-on-single-page="false" :page-size="qeuryTableData.pageSize"
            background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-10px"
            :total="dictItemTotolCount" :pager-count="5"></el-pagination>
        </el-footer>
      </el-container>
    </el-container>

    <!-- 新增字典分组 -->
    <el-dialog :title="addDialogTitle" :visible.sync="addGroupShow" :before-close="addGroupClose" width="420px"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="groupForm" label-width="80px" :rules="groupRules">
        <el-form-item label="名称" prop="groupName">
          <el-input v-model="groupForm.groupName" placeholder="请输入" maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="groupCode">
          <el-input v-model="groupForm.groupCode" placeholder="请输入" :disabled="addOrModifyGroup == 'modify'"
            maxlength="64"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupClose">取消</el-button>
        <el-button type="primary" @click="confirmAddDictionary">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  dictItem_getMaxSort,
  dictGroup_getDictGroupWithPage,
  dictItem_findAllWithPage,
  dictGroup_insert,
  dictItem_insert,
  dictItem_edit,
  // dictItem_delete,
  dictGroupById_delete,
  dictGroup_edit
} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'BasicDictionary',
  components: {},
  data: function () {
    return {
      activeName: 'all',
      loading: false, // 表格的loding
      leftGroupName: '', // 左边表格数据查询
      groupPageNum: 1, // 左侧分组数据页码
      groupPageSize: 15, // 左侧分组数据pageSize
      groupTotolCount: 0, // 字典分组总数量
      oneRow: {}, // 左边点击的数据
      tableDataOne: [], // 左边表格数据
      tableDataTwo: [], // 右边表格数据
      totolCount: 0, // 分页总量
      statusDict: '',
      qeuryTableData: {
        pageNum: 1,
        statusDict: '',
        pageSize: 10,
        searchKey: '', // 名称或者值
        dictGroupCode: '' // 类型
      },
      // 新增字典分组flag
      addGroupShow: false,
      // 字典分组数据
      groupForm: {
        groupName: '',
        groupCode: ''
      },
      addDialogTitle: '',
      // 新增字典项
      addDictItemShow: false,
      // 字典项目必填属性
      dictItemForm: {
        'dictAbbr': '',
        'dictCode': '',
        'dictName': '',
        'sortNo': 0,
        'statusDict': '1'
      },
      // 字典项总数
      dictItemTotolCount: 0,
      dictItemDialogTitle: '',
      addOrModifyGroup: 'add',
      addOrModifyDictItem: 'add',
      // 字典分组校验规则
      groupRules: {
        groupName: [
          { required: true, message: '请输入字典分组名称', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '请输入字典分组编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.startsWith('ICIS_DICT') || value.startsWith('HIS_DICT') || value.startsWith('ICIS_DICT_META')) {
                callback()
              } else {
                callback(new Error('请输入ICIS_DICT/HIS_DICT/ICIS_DICT_META为前缀的编码，英文大写'))
              }
            }, trigger: 'blur'
          }
        ]
      },
      // 字典项校验规则
      rules: {
        dictName: [
          { required: true, message: '请输入字典项名称', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '请输入字典项编码', trigger: 'blur' }

        ]
      },
      // 字典分组类型
      dictGroupType: [
        {
          groupType: '1',
          groupTypeName: '基础字典'
        },
        {
          groupType: '2',
          groupTypeName: '监护字典'
        },
        {
          groupType: '3',
          groupTypeName: '元数据字典'
        }
      ],
      // 当前行
      curRow: []
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {
    this.init()
  },
  mounted() { },
  methods: {
    // 切换tabs
    handleClick() {
      this.getLeftGroupData(1)
    },
    /**
     * 初始化
     */
    init() {
      // 左边字典查询
      this.getGroupData(1)
    },
    // 获取左侧数据
    getLeftGroupData(page) {
      this.getGroupData(page)
    },
    /**
     * 左边字典名称查询
     */
    getGroupData(page) {
      this.loading = true
      this.groupPageNum = page
      const query = {
        statusDict: this.statusDict,
        searchKey: this.leftGroupName || '',
        pageNum: this.groupPageNum,
        pageSize: this.groupPageSize

      }
      if (this.activeName != 'all') {
        const list = []
        list.push(this.activeName)
        query.dictGroupTypeList = list
      }
      dictGroup_getDictGroupWithPage(query).then(req => {
        this.tableDataOne = req.data.result
        this.tableDataOneAll = req.data.result
        this.groupTotolCount = req.data.totolCount
        if (this.groupTotolCount > 0) {
          this.oneRow = this.tableDataOne[0] // 第一条数据
          if (this.oneRow) {
            this.$nextTick(() => {
              this.$refs.tableDataOne.setCurrentRow(this.oneRow)
            })
            this.changeTableTwo(this.oneRow)
          }
        } else {
          this.loading = false
          this.tableDataTwo = []
          this.totolCount = 0
        }
      })
    },

    // 获取字典项目
    getDictItems(page) {
      if (page) {
        this.qeuryTableData.pageNum = page
      }
      this.loading = true
      dictItem_findAllWithPage(this.qeuryTableData).then(req => {
        this.loading = false
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableDataTwo = req.data.result // 列表数据
        this.dictItemTotolCount = req.data.totolCount // 总条数
        this.$refs.tableDataTwo.doLayout()
      })
    },
    /**
     * 右边表格数据请求
     */
    changeTableTwo(data, index, event) {
      this.loading = true
      this.qeuryTableData.dictGroupCode = data.groupCode || '' // 类型
      this.oneRow = data // 存起来点击对象.右边查询需要用到
      this.getDictItems(1)
    },
    // 分页请求分组数据
    changeGroupPagination(page) {
      this.getGroupData(page)
    },
    /**
     * 分页数据请求
     */
    changePagination(val) {
      this.getDictItems(val)
    },
    leftInputFC() {
      if (this.activeName == 'HIS') {
        this.getHISGroupData(1)
      } else {
        this.getGroupData(1)
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.leftInputFC()
      }, 200)
      this.debounceSearchSymbol()
    },
    /**
     * 右边按钮事件
     */
    rightInputFC() {
      this.getDictItems(1)
    },

    // 新增字典分组
    addDicGroup() {
      this.addDialogTitle = '新增字典分组'
      this.addGroupShow = true
      this.addOrModifyGroup = 'add'
    },
    // 关闭 新增字典分组弹框
    addGroupClose() {
      this.addGroupShow = false
      this.$refs.form.clearValidate()
      this.groupForm = {
        groupName: '',
        groupCode: ''
      }
    },
    // 增加字典分组
    confirmAddDictionary() {
      this.$refs.form.validate(v => {
        if (v) {
          const query = this.groupForm
          if (query.dictGroupId) { // 修改
            dictGroup_edit(query).then(res => {
              if (res.code == 0) {
                this.addGroupClose()
                this.getGroupData(1)
              }
            })
          } else { // 添加
            if (this.activeName != 'all') {
              query.dictGroupType = this.activeName
            }

            dictGroup_insert(query).then(res => {
              this.leftGroupName = this.groupForm.groupName

              if (res.code == 0) {
                this.addGroupClose()
                this.leftInputFC()
              }
            })
          }
        }
      })
    },
    // 启用禁用-字典分组
    enableOrDisable(index, row) {
      dictGroupById_delete({
        dictGroupId: row.dictGroupId,
        statusDict: row.statusDict == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.leftInputFC()
      })
    },
    modifyGroup(index, row) {
      this.addGroupShow = true
      this.addDialogTitle = '修改字典分组'
      this.addOrModifyGroup = 'modify'
      this.groupForm = { ...row }
    },
    // 显示新增字典项
    async showAddDictItem() {
      if (this.tableDataTwo.length > 0 && this.tableDataTwo[0].isCreate == true) return
      const maxSortNo = await this.getMaxSortNo(this.oneRow.groupCode)
      const itemInfo = {
        'isCreate': true,
        'isEdit': true,
        'dictAbbr': '',
        'dictCode': '',
        'dictName': '',
        'sortNo': maxSortNo || 1,
        'statusDict': '1',
        'dictGroupCode': this.oneRow.groupCode,
        'dictGroupName': this.oneRow.groupName
      }
      this.addOrModifyDictItem = 'add'
      this.tableDataTwo.unshift(itemInfo)
    },
    /**
     * 获取字典项目分组
     */
    getMaxSortNo(groupCode) {
      return new Promise((resolve, reject) => {
        dictItem_getMaxSort(groupCode).then(res => {
          resolve(res.data)
        })
      })
    },
    // 保存字典项目
    saveItemRow(index, row) {
      if (row.isCreate) {
        dictItem_insert(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.getDictItems()
          }
        }).catch(

        )
      } else {
        // row.dictAbbr=row.dictAbbr.replace()
        dictItem_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })

            row.isEdit = false
            this.getDictItems()
          }
        })
      }
    },
    // 修改字典项目
    modifyRow(index, row) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
      this.$refs.tableDataTwo.doLayout()
      this.addOrModifyDictItem = 'modify'
    },
    // 取消当前行编辑
    cancelItemRow(index, row) {
      row.isEdit = false
      if (this.addOrModifyDictItem == 'add') {
        this.tableDataTwo.splice(index, 1)
      } else {
        this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
        this.$refs.tableDataTwo.doLayout()
        this.tableDataTwo[index] = this.curRow[index]
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.basicDictionaryPage {
  background: #ffffff;
  height: 100%;
  display: block;
  padding: 1%;

  .tabs {
    height: 60px;
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }
}

.basicDictionary {
  height: calc(100% - 60px);

  &_left {
    overflow-x: hidden;

    &_div {
      height: 100%;
    }

    &_main {
      height: calc(100% - 32px);

      .groupName {
        display: flex;
        align-items: center;

        .name {
          flex: 1;

          span {
            color: #999;
            font-size: 12px;
          }
        }

        .handler {
          width: 68px;
          display: flex;
        }
      }

      padding: 0;
      background: #f0f4ff;

      &_table {
        border: none;
        background: none;
        padding-top: 8px;

        &::before {
          background: transparent;
        }

        &::after {
          background: transparent;
        }

        ::v-deep tr {
          background: none;

          &.current-row {
            color: var(--maincolor);

            td {
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: var(--maincolor);
              background: none;

              .cell {
                background: #d9e3ff;
                border-radius: 3px;
              }
            }
          }

          &:hover {
            color: var(--maincolor);

            td {
              background: none;
            }
          }
        }

        ::v-deep td {
          border: none;
          padding: 0px 8px;
          color: #000622;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;

          .cell {
            padding: 8px;
          }
        }
      }
    }
  }

  &_right {
    height: 100%;
    padding-left: 10px;
    margin-left: 10px;
    border-left: 2px solid rgba(203, 215, 238, 0.3);

    // box-shadow: 0px 2px 4px 0px rgba(203, 215, 238, 0.5);
    &_body {
      height: calc(100% - 32px);
    }
  }
}
</style>
