<!-- 角色管理 -->
<template>
  <div id="roleManagement" class="roleManagement" v-loading="loading" element-loading-text="加载中">
    <!-- 左边表格 -->
    <div class="roleManagement_left">
      <!-- 顶部内容 -->
      <div class="roleManagement_left_headDiv">
        <div>
          <i class="iconBlue"></i>
          <span>角色列表</span>
        </div>
        <div>
          <el-button v-hasPermi="['configuration:authorization:roleAdd']" class="queryButton" type="primary"
            @click.native.prevent="addRoleVisible = true">新增</el-button>
        </div>
      </div>
      <div style="height:calc(100% - 50px)" class="roleManagement_left_table">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          height="100%" ref="tableDataOne" @row-click="changeTable" highlight-current-row fit :data="tableDataOne" border
          style="width: 100%;overflow: auto;" :row-class-name="({ row }) => row.enable == 0 ? 'disabled' : ''">
          <v-table-column prop="id" label="角色编码" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="roleType" label="角色类型" width="150">
            <template slot-scope="scope">
              <el-select v-if="scope.row.isEdit" v-model="scope.row.roleType" filterable placeholder="请选择"
                style="width:100%">
                <el-option v-for="item in roleTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
                  :disabled="item.statusDict == '0'"></el-option>
              </el-select>
              <span v-else>{{ scope.row.roleType | dictCodeToName(roleTypeList) }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="name" label="角色名称">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" type="type" v-model="scope.row.name" placeholder="请输入" border
                clearable></el-input>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </v-table-column>
          <v-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit">
                <el-button v-hasPermi="['configuration:authorization:roleUpdate']"
                  @click.native.prevent="saveRow(scope.$index, scope.row)" type="text" size="small">保存</el-button>
                <el-button v-hasPermi="['configuration:authorization:roleUpdate']"
                  @click.native.prevent="cancelRow(scope.$index, scope.row)" type="text" size="small">取消</el-button>
              </template>
              <template v-else>
                <el-button v-hasPermi="['configuration:authorization:roleUpdate']"
                  @click.native.prevent="modifyRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                <el-button v-hasPermi="['configuration:authorization:roleUpdate']"
                  @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small"
                  :style="{ color: scope.row.enable == 1 ? '#EC0000' : '#00AB44' }">{{+scope.row.enable ? '禁用' : '启用'
                  }}</el-button>
              </template>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右边表格 -->
    <div class="roleManagement_right">
      <!-- 顶部内容 -->
      <div class="roleManagement_right_headDiv">
        <div>
          <i class="iconBlue"></i>
          <span>功能表格</span>
        </div>
        <el-input style="width: 150px;" size="small" placeholder="菜单名称" suffix-icon="el-icon-search" v-model="searchKey"
          @input="searchKeyInputFc" @change="searchKeyInputFc" clearable></el-input>
      </div>
      <div style="height:calc(100% - 50px)" class="roleManagement_right_table">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          height="100%" ref="tableDataTwo" :data="tableDataTwo" @select="selectionFC" @select-all="selectionAllFC"
          highlight-current-row fit border style="width: 100%;overflow: auto;" row-key="id"
          :expand-row-keys="expandRowKeys" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <v-table-column type="selection" width="50" :selectable="tableTwoSelectable"></v-table-column>
          <v-table-column prop="label" label="菜单名称"></v-table-column>
          <v-table-column prop="id" label="菜单编码"></v-table-column>
          <v-table-column label="设置首页">
            <template slot-scope="scope" v-if="scope.row.menuType !== 'F' && !scope.row.patientDetail">
              <el-radio :label="scope.$index" v-model="templateRadio"
                :disabled="!scope.row.select || !($btnHasPerm(['configuration:authorization:roleUpdate']))"
                @change.native="radioClick(scope.$index, scope.row)" style="margin-left: 10px;">&nbsp;</el-radio>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="addRoleVisible" width="450px" @close="handleCancelAddRole">
      <el-form ref="addRoleFrom" :model="roleform" :rules="roleRules" label-width="100px" status-icon>
        <el-form-item label="角色类型" prop="roleType">
          <el-select v-model="roleform.roleType" filterable placeholder="请选择" style="width:100%">
            <el-option v-for="item in roleTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
              :disabled="item.statusDict == '0'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input placeholder="请输入" clearable v-model="roleform.name" type="type" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAddRole">取消</el-button>
        <el-button type="primary" @click="addRoleFC">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import {
  // getRoleList,
  getAllRoleList,
  getTreeMenuList,
  saveRole,
  updateRole,
  deleteRole,
  insertRoleHomepage,
  dictItem_findWithPage
} from '@/api/configuration'
export default {
  name: 'RoleManagement',
  components: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      tableDataOne: [], // 第一个表格数据
      backTableDataOne: [], // 回退表格数据
      tableDataTwo: [], // 第二个表格数据
      expandRowKeys: [], // 第二表打开内容
      oldTableDataTwo: [], // 第二个表格数据
      templateRadio: '', // 设置主菜单按钮

      addRoleQueryData: {
        beid: '', // 登录的id
        docIds: [],
        menuIds: [],
        name: '', // 角色名称
        roleType: '' // 角色编号
      }, // 第一个表格请求数据对象
      roleform: {
        name: '', // 角色名称
        roleType: '' // 角色类型
      }, // 修改密码的v-model
      roleRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 40) {
                callback(new Error('请输入40字以内的角色名称'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ], // 角色名称校验
        roleType: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ] // 角色编号校验
      }, // 校验

      addRoleVisible: false, // 表格一新增角色框是否显示
      tableDataOneRow: {}, // 表格一选择的数据对象,提交修改权限的时候有用
      selectionAll: false, // 表格二多选框的全选非全选
      roleTypeList: [], //  角色类型集合
      constIndex: 0, // 计算 radio是多少个高亮
      searchKey: '' // 功能表格搜索
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : dictCode
    }
  },
  created() {
    this.searchKeyInputFc = _.debounce((val) => {
      if (this.oldTableDataTwo.length == this.tableDataTwo.length) {
        this.recursionTableDataTwo(this.oldTableDataTwo)
      }
      this.searchKeyInput(val)
    }, 200)
    // 初始化
    this.init()
    dictItem_findWithPage({
      pageNum: 1,
      pageSize: 1000,
      dictGroupCode: 'ICIS_DICT_ROLE_TYPE'
    }).then(res => {
      this.roleTypeList = res.data.result
    })
    // id获取
    this.addRoleQueryData.beid = this.userInfo.beid
  },
  mounted() {
    this.$nextTick(() => {
      // 功能表格 菜单权限多选 禁用,还是能选择.
      if (!this.$btnHasPerm(['configuration:authorization:roleUpdate'])) {
        document.getElementsByClassName('el-checkbox')[0].style.display = 'none'
        // this.$refs.tableDataTwo.$el.getElementsByClassName('el-checkbox')[0].style.display = 'none'
      }
    })
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      // 查询角色
      this.loading = true
      getTreeMenuList().then(res => {
        res.data.map(item => {
          this.setParentElement(item)
        })
        this.tableDataTwo = res.data.map(item => {
          if (item.id == '201903281036215454') {
            // 患者管理子项 不可以设置为首页
            item.children.forEach(c => {
              if (c.id != '201903281036215000') c.patientDetail = true
            })
          }
          return item
        })
        this.oldTableDataTwo = _.cloneDeep(this.tableDataTwo)
        getAllRoleList().then(res => {
          this.loading = false
          this.tableDataOne = res.data // 给第一个表格数据
          if (this.tableDataOne[0]) {
            this.$refs.tableDataOne?.setCurrentRow(this.tableDataOne[0]) // 默认设定第一行高亮
            this.changeTable(this.tableDataOne[0]) // 查询第二表格
          }
        })
      })
    },
    /**
     * 第一个表格点击某一行事件
     */
    changeTable(data, index, event) {
      this.tableDataOneRow = this.tableDataOne.filter(res => {
        return data.id === res.id
      })[0] // 第一表格选择后角色id这条数据
      setTimeout(req => {
        this.constIndex = 0 // 计算 radio是多少个高亮
        this.templateRadio = ''
        this.recursionTableDataTwo(this.tableDataTwo) // 表格递归
        // 检测是否为全选
        for (const i in this.tableDataTwo) {
          this.selectionAll = this.tableDataTwo[i].select
          if (!this.tableDataTwo[i].select) {
            // 只要有个按钮是false 就跳出去
            return
          }
        }
      })
    },
    /**
     * 表格递归
     */
    recursionTableDataTwo(list) {
      list.map(item => {
        item.select = this.tableDataOneRow.menuIds.indexOf(item.id) !== -1
        item.radio = this.tableDataOneRow.homePageId === item.id
        // 多选赋值
        this.$refs.tableDataTwo.toggleRowSelection(item, item.select)
        // 设置radio 高亮
        if (item.radio) {
          this.templateRadio = this.constIndex
        }
        this.constIndex++
        if (item.children) {
          this.recursionTableDataTwo(item.children)
        }
      })
    },
    // 取消新增
    handleCancelAddRole() {
      this.$refs.addRoleFrom.clearValidate()
      this.$refs.addRoleFrom.resetFields()
      this.addRoleVisible = false
    },
    /**
     * 第一表格 新增角色
     */
    addRoleFC() {
      this.$refs['addRoleFrom'].validate(valid => {
        if (!valid) {
          return
        }
        saveRole(Object.assign({}, this.addRoleQueryData, this.roleform)).then(
          res => {
            this.init()
            this.addRoleVisible = false
            this.$notify({
              title: '成功',
              message: '新增成功！',
              type: 'success',
              duration: 2000
            })
          }
        )
      })
    },
    // 功能表格权限控制 是否可以选中
    tableTwoSelectable(row, index) {
      return this.$btnHasPerm(['configuration:authorization:roleUpdate'])
    },
    /**
     * 点击radio
     */
    radioClick(index, row) {
      row.radio = true
      insertRoleHomepage({
        beid: this.addRoleQueryData.beid,
        roleid: this.tableDataOneRow.id,
        menuid: row.id
      }).then(req => {
        this.tableDataOneRow.homePageId = row.id
        this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    /**
     * 第一表格修改
     */
    modifyRow(index, row) {
      this.backTableDataOne[index] = { ...row }
      this.$set(
        this.tableDataOne,
        index,
        Object.assign(row, {
          isEdit: true
        })
      )
      this.tableDataOne = JSON.parse(JSON.stringify(this.tableDataOne))
      this.$refs.tableDataOne.doLayout()
    },
    // 取消修改
    cancelRow(index, row) {
      this.$set(
        this.tableDataOne,
        index,
        Object.assign(this.backTableDataOne[index], {
          isEdit: false
        })
      )
      this.tableDataOne = JSON.parse(JSON.stringify(this.tableDataOne))
      this.$refs.tableDataOne.doLayout()
    },
    /**
     * 第一表格保存修改数据
     */
    saveRow(index, row) {
      if (row.name === '') {
        this.$message.error('角色名称不能为空')
        return
      } else if (row.name.length > 40) {
        this.$message.error('请输入40字以内的角色名称')
        return
      }
      updateRole(row)
        .then(res => {
          this.init()
          this.$notify({
            title: '成功',
            message: '保存成功！',
            type: 'success',
            duration: 2000
          })
        })
        .catch(erro => {
          this.init()
        })
    },
    /**
     * 第一表格删除
     */
    deleteRow(index, row) {
      deleteRole({
        name: row.name,
        beid: row.beid,
        id: row.id,
        enable: row.enable == '1' ? '0' : '1'
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.enable ? '已禁用' : '已启用'
        })
        this.init()
      })
    },

    /**
     *递归设置节点选中
     */
    setRowSelected(rowItem, selecteStatus) {
      if (selecteStatus) {
        // 迭代设置父节点选中
        this.setParentElementChecked(rowItem)
      }
      rowItem.select = selecteStatus
      this.$refs.tableDataTwo.toggleRowSelection(rowItem, selecteStatus)
      const children = rowItem.children
      if (children && children.length > 0) {
        children.map(subItem => {
          this.setRowSelected(subItem, selecteStatus)
        })
      }
    },

    /**
     * 第二个表格多选框 表头
     * element ui 只对菜单一级控制.
     * 在这里吧所有的菜单控制
     */
    selectionAllFC() {
      this.selectionAll = !this.selectionAll
      this.tableDataTwo.map(item => {
        this.setRowSelected(item, this.selectionAll)
      })
      this.updateSelect() // 给后台数据那个被选择取消选择
    },
    /**
     * 第二表格多选框按钮
     */
    selectionFC(list, row) {
      this.setRowSelected(row, !row.select)
      this.updateSelect() // 给后台数据那个被选择取消选择
    },
    /**
     * 第二表格选择后提交给后台修改权限
     */
    updateSelect() {
      this.menuIdsFc() // 递归处理方法
      // 修改参数
      updateRole(this.tableDataOneRow)
        .then(res => {
          this.changeTable(this.tableDataOneRow)
          this.$notify({
            title: '成功',
            message: '修改成功！',
            type: 'success',
            duration: 2000
          })
        })
        .catch(erro => {
          this.init()
        })
    },
    /**
     * 搜索的时候,表格数据不全,导致权限都清空了
     */
    menuIdsFc() {
      // 拿取表格二数组id
      this.tableDataOneRow.menuIds = []
      if (this.tableDataTwo.length == this.oldTableDataTwo.length) {
        this.recursionUpdateSelect(this.tableDataTwo)
      } else {
        this.recursionUpdateSelect(this.oldTableDataTwo)
        this.menuIds = _.cloneDeep(this.tableDataOneRow.menuIds)
        this.tableDataOneRow.menuIds = []
        this.editTableDataTwoFc(this.tableDataTwo)
        this.recursionUpdateSelect(this.tableDataTwo)
        this.tableDataOneRow.menuIds = this.tableDataOneRow.menuIds.concat(this.menuIds)
      }
    },
    /**
     * 递归下面子项
     */
    recursionUpdateSelect(list) {
      list.map(item => {
        item.select && this.tableDataOneRow.menuIds.push(item.id)
        if (item.children) {
          this.recursionUpdateSelect(item.children)
        }
      })
    },
    editTableDataTwoFc(list) {
      list.map(i => {
        this.menuIds = this.menuIds.filter(res => { return res != i.id })
        if (i.children) {
          this.editTableDataTwoFc(i.children)
        }
      })
    },
    /**
     * 设置父节点选中
     */
    setParentElementChecked(item) {
      const parent = item.parent
      if (parent) {
        parent.select = true
        this.$refs.tableDataTwo.toggleRowSelection(parent, true)
        this.setParentElementChecked(parent)
      }
    },
    /**
     * 节点信息设置父节点引用
     */
    setParentElement(item) {
      if (item.children) {
        item.children.map(subItem => {
          subItem.parent = item
          this.setParentElement(subItem)
        })
      }
    },
    /**
     * 菜单搜索 过滤
     */
    searchKeyInput(val) {
      if (this.oldTableDataTwo.length < 1) {
        return
      }
      if (!val) {
        this.tableDataTwo = _.cloneDeep(this.oldTableDataTwo)
        this.changeTable(this.tableDataOneRow)
        return
      }
      this.tableDataTwo = _.cloneDeep(this.childrenRecursion(_.cloneDeep(this.oldTableDataTwo), val))
      this.expandRowKeys = []
      this.tableDataTwo = this.openSelectFc(this.tableDataTwo)
      this.changeTable(this.tableDataOneRow)
    },
    /**
     * 菜单过滤 递归
     */
    childrenRecursion(children, val) {
      return children.filter(i => {
        if (i.children) {
          i.children = this.childrenRecursion(i.children, val)
          if (i.children.length < 1) {
            if (i.label && i.label.indexOf(val) > -1) {
              return true
            }
          }
          return i.children.length > 0
        } else if (i.label && i.label.indexOf(val) > -1) {
          return true
        }
        return false
      })
    },
    /**
     * 搜索默认打开
     */
    openSelectFc(list) {
      if (list.length > 0) {
        list.map(i => {
          if (i.children) {
            i.children = this.openSelectFc(i.children)
            this.expandRowKeys.push(i.id)
          }
        })
      }
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.roleManagement {
  background: #ffffff;
  height: 100%;
  display: flex;
  position: relative;
  padding: 1%;

  &_left {
    width: 45%;
    height: 100%;
    margin-right: 1%;

    &_headDiv {
      height: 46px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .iconBlue {
        display: inline-block;
        width: 3px;
        height: 16px;
        background: var(--maincolor);
      }

      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }

      span {
        flex: 1;
        margin-left: 8px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
      }
    }

    &_table {
      height: calc(100% - 50px);
    }
  }

  &_right {
    flex: 1;
    width: 54%;
    height: 100%;

    &_headDiv {
      height: 46px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .iconBlue {
        display: inline-block;
        width: 3px;
        height: 16px;
        background: var(--maincolor);
      }

      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }

      span {
        flex: 1;
        margin-left: 8px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
      }
    }

    &_table {
      height: calc(100% - 50px);
    }
  }

  ::v-deep .el-select {
    width: 93%;
  }

  ::v-deep .el-input {
    width: 93%;
  }
}
</style>
