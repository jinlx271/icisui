<template>
  <div class="menuManager">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input v-model="queryParams.searchKey" placeholder="请输入" clearable size="small" @input="debounceSearch"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable size="small" @change="debounceSearch">
          <el-option :key="1" label="启用" :value="1" />
          <el-option :key="0" label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['configuration:authorization:menuAdd']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增
        </el-button>
      </el-form-item>
    </el-form>
    <div style="height:calc(100% - 50px)" >
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" border v-loading="loading" :data="menuList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :row-class-name="({row}) => row.status == 0 ? 'disabled' : ''" height="100%">
        <!-- <v-table-column prop="parentId" label="父级" width="60"></v-table-column> -->
        <v-table-column prop="name" label="菜单名称" width="380" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <!-- {{scope.row.menutype=='F'?'按钮':'菜单'}} -->
            <i v-if="scope.row.menutype=='F'" class="el-icon-mouse"></i>
            {{scope.row.name}}（{{scope.row.id}}）
          </template>
        </v-table-column>
        <v-table-column label="类型" width="50">
          <template slot-scope="scope">{{scope.row.menutype=='F'?'按钮':'菜单'}}</template>
        </v-table-column>
        <v-table-column prop="sort" label="排序" width="50"></v-table-column>
        <v-table-column prop="icon" label="图标" width="50" align="center">
          <!-- <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>-->
        </v-table-column>
        <!-- <v-table-column prop="target" label="target"></v-table-column> -->
        <!-- <v-table-column prop="module" label="module"></v-table-column> -->
        <!-- <v-table-column prop="isLeftMenu" label="isLeftMenu"></v-table-column>
        <v-table-column prop="type" label="type" width="50"></v-table-column>
        <v-table-column prop="docTableId" label="docTableId"></v-table-column> -->
        <v-table-column prop="url" label="路由地址" min-width="180" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.menutype=='F'?'--':scope.row.url}}
          </template>
        </v-table-column>
        <v-table-column prop="permission" label="权限标识" min-width="180" :show-overflow-tooltip="true"></v-table-column>
        <!-- <v-table-column prop="component" label="组件路径" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.menutype=='F'?'--':scope.row.component}}
          </template>
        </v-table-column> -->
        <v-table-column prop="status" label="状态" width="80" align="center">
          <template slot-scope="scope">
            {{scope.row.status?'已启用':'已禁用'}}
            <!-- <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" disabled></el-switch> -->
          </template>
        </v-table-column>

        <v-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-hasPermi="['configuration:authorization:menuUpdate']" size="mini" type="text"
                      @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-hasPermi="['configuration:authorization:menuAdd']" size="mini" type="text"
                      @click="handleAdd(scope.row)">新增</el-button>
            <el-button v-hasPermi="['configuration:authorization:menuUpdate']" size="mini" type="text" @click="handleDelete(scope.row)"
              :style="{ color: scope.row.status == 1 ? '#EC0000': '#00AB44' }">
              {{+scope.row.status ? '禁用' : '启用' }}
            </el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body modal :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menutype">
              <el-radio-group v-model="form.menutype">
                <!-- <el-radio label="M">目录</el-radio> -->
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <!-- <el-input v-model="form.status"></el-input> -->
              <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <!-- <el-input v-model="form.parentId"></el-input> -->
              <select-tree v-model="form.parentId" @value="(v)=>this.form.parentId=v" :options="menuTree" :props="defaultProps" />
              <!-- <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true" placeholder="选择上级菜单" /> -->
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" placeholder="请输入" controls-position="right" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item v-if="form.menutype != 'F'" label="菜单图标">
              <el-input v-model="form.icon" placeholder="请输入"></el-input>
              <!-- <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>-->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item v-if="form.menutype != 'F'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item v-if="form.menutype != 'F'" label="路由地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menutype != 'F'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menutype != 'M'" label="权限标识">
              <el-input v-model="form.permission" placeholder="请输入" maxlength="50"
                        :disabled="form.parentId==0 && (form.permission=='oprm'||form.permission=='patient'||form.permission=='pacu'||form.permission=='ctrlcent')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import SelectTree from './selectTree.vue'
import { mapGetters } from 'vuex'
import {
  getMenuList,
  updateMenu,
  addMenu
  // deleteMenu
} from '@/api/setting'
import { debounce } from 'lodash'
export default {
  components: { SelectTree },
  computed: {
    ...mapGetters([])
  },
  data() {
    return {
      // data: JSON.parse(JSON.stringify(data)),
      // 遮罩层
      loading: false,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        searchKey: '',
        status: '',
        beid: null
      },
      // 表单参数
      form: {},
      menuTree: [],
      defaultProps: {
        // parent: 'parentId', // 父级唯一标识
        value: 'id', // 唯一标识
        label: 'name', // 标签显示
        children: 'children' // 子级
      },
      // 表单校验
      rules: {
        parentId: [
          {
            required: true, message: '上级菜单不能为空', trigger: 'change'
          }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '顺序不能为空', trigger: 'blur' }
        ],
        url: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
      }
    }
  },
  props: {
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询菜单树结构 */
    getTreeMenuList(currId) {
      return getMenuList({ status: '', searchKey: '' }).then(res => {
        // this.menuList = this.$handleTree(res.data, 'id')
        let tempArr = []
        if (currId) {
          tempArr = res.data.filter(item => {
            return item.id != currId
          })
        } else {
          tempArr = res.data
        }

        this.menuTree = [{ id: '0', name: '根目录', children: [...this.$handleTree(tempArr, 'id')] }]
      })
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      getMenuList(this.queryParams).then((res) => {
        this.menuList = this.$handleTree(res.data, 'id')
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: '0',
        name: undefined,
        icon: undefined,
        menutype: 'C',
        sort: undefined,
        module: '',
        // visible: '0',
        status: 1,
        target: ''
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.handleQuery()
      }, 200)
      this.debounceSearchSymbol()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeMenuList().then(() => {
        if (row != null) {
          this.form.parentId = row.id
        }
        this.open = true
        this.title = '添加菜单'
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeMenuList(row.id).then(() => {
        this.form = { ...row }
        this.open = true
        this.title = '修改菜单'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.menutype === 'F' && !this.form.permission) {
            this.$message.error('请填写权限标识!')
            return
          }

          if (this.form.id != undefined) {
            updateMenu(this.form).then(() => {
              this.$message.success('修改成功')
              this.$
              this.open = false
              this.getList()
            })
          } else {
            addMenu(this.form).then(() => {
              this.$message.success('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 启用禁用按钮操作 */
    handleDelete(row) {
      row.status = +!row.status
      updateMenu(row).then(() => {
        this.$message.success('修改成功')
        this.$
        this.open = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menuManager {
  background: #ffffff;
  height: 100%;
  padding: 1%;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    padding-right: 8px;
  }
  .hover_show {
    padding-left: 20px;
    display: none;
  }
  .custom-tree-node:hover .hover_show {
    display: block !important;
  }
}
</style>
