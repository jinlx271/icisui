<!-- 用户管理 -->
<template>
  <el-main id="userManagement" class="userManagement">
    <el-container style="height:100%">
      <el-header class="userManagement_query">
        <div class="userManagement_query_left">
          <div class="userName">
            <el-input size="small" :placeholder="XTCS0027=='1'?'工号/姓名/国标码':'工号/姓名'"  clearable suffix-icon="el-icon-search" v-model="queryData.searchKey" @input="debounceSearch"></el-input>
          </div>
          <div class="inputData">
            <span>职工类型</span>
            <el-select filterable clearable v-model="queryData.userType" placeholder="请选择" @change="debounceSearch">
              <el-option v-for="item in roleTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict == '0'" ></el-option>
            </el-select>
          </div>
          <div class="inputData">
            <span>科室</span>
            <el-select filterable clearable :filter-method="filterMethod" v-model="queryData.deptCode" placeholder="请选择" @change="debounceSearch">
              <el-option v-for="item in showListDeptList" :key="item.deptCode" :label="item.deptName" :value="item.deptCode" :disabled="item.statusDict == '0'" ></el-option>
            </el-select>
          </div>
          <div class="inputData">
            <span>病区</span>
            <el-select filterable clearable v-model="queryData.wardCode" placeholder="请选择" @change="debounceSearch">
              <el-option v-for="item in icuWardList" :key="item.wardCode" :label="item.wardName" :value="item.wardCode" :disabled="item.statusDict == '0'" ></el-option>
            </el-select>
          </div>
          <div class="inputData">
            <span>状态</span>
            <el-select filterable clearable v-model="queryData.enable" placeholder="请选择" @change="debounceSearch">
              <el-option label="停用" value="0"></el-option>
              <el-option label="正常" value="1"></el-option>
            </el-select>
          </div>
          <!-- <div class="inputData">
            <span>锁定</span>
            <el-select filterable clearable v-model="queryData.locked">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </div>-->
        </div>
        <div class="userManagement_query_right">
          <el-button class="queryButton" type="primary" @click="queryDataButton">查询</el-button>
          <el-button class="queryButton" type="primary" v-hasPermi="['configuration:authorization:userAdd']" @click="handleAdd">新增</el-button>
        </div>
        <!-- </div> -->
      </el-header>
      <el-main class="userManagement_table">
        <el-container style="height:100%">
          <!-- 表格 -->
          <el-main style="height:calc(100% - 40px)" class="userManagement_table_div">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
              height="100%"
              element-loading-text="加载中"
              v-loading="loading"
              highlight-current-row
              fit
              :data="tableData"
              ref="tableData"
              border
              style="width: 100%;overflow: auto;"
              :row-class-name="({row}) => row.enable == 0 ? 'disabled' : ''"
            >
              <!-- <v-table-column type="index" label="序号"></v-table-column> -->
              <v-table-column label="工号">
                <template prop="userName" slot-scope="scope">
                  <el-input v-if="scope.row.isCreate" type="type" v-model="scope.row.userName" placeholder="请输入" border clearable @blur="handleCheckUserName(scope.row)"></el-input>
                  <span v-else>{{scope.row.userName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="姓名">
                <template prop="name" slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" type="type" v-model="scope.row.name" placeholder="请输入" border clearable></el-input>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="sex" label="性别">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.sex" placeholder="请选择">
                    <el-option v-for="item in sexDictData" :key="item.dictCode" :label="item.dictName" :value="item.dictName"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.sex}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="gbCode" label="国标码" v-if="XTCS0027=='1'">
              </v-table-column>
              <v-table-column prop="userType" label="职工类型">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.userType" placeholder="请选择" :disabled="!scope.row.isEdit">
                    <el-option v-for="item in roleTypeList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
                  </el-select>
                  <template v-else>{{scope.row.userType|showDictNameFilter(roleTypeList,'dictCode_to_dictName')}}</template>
                </template>
              </v-table-column>
              <v-table-column prop="deptName" label="科室">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.deptId" filterable placeholder="请选择" @change="changeDept(scope.row,allDeptList)">
                    <el-option v-for="item in allDeptList" :key="item.deptCode" :label="item.deptName" :value="item.deptCode" :disabled="item.statusDict=='0'"></el-option>
                  </el-select>
                  <span v-else>{{scope.row.deptName}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="deptId" label="科室代码"></v-table-column>
              <v-table-column prop="wardCode" label="病区">
                <template slot-scope="scope">
                  <div v-if="scope.row.isEdit">
                    <el-select
                      class="select-fix"
                      :value-key="'wardCode'"
                      v-model="scope.row.userWardList"
                      filterable
                      placeholder="请选择"
                      @change="changeWard(scope.row,icuWardList)"
                      multiple

                    >
                      <el-option v-for="item in icuWardList" :key="item.wardCode" :label="item.wardName" :value="item"  :disabled="item.statusDict=='0'"></el-option>
                    </el-select>
                  </div>
                  <span v-else>{{scope.row.userWardList&&scope.row.userWardList.map(v=>v.wardName).join(',')}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="mobile" label="联系电话">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" type="type" v-model="scope.row.mobile" placeholder="请输入" border clearable></el-input>
                  <span v-else>{{scope.row.mobile}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="email" label="邮箱">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit" type="type" v-model="scope.row.email" placeholder="请输入" border clearable></el-input>
                  <span v-else>{{scope.row.email}}</span>
                </template>
              </v-table-column>
              <v-table-column prop="email" label="签名图片">
                <template slot-scope="scope">
                  <template  v-if="scope.row.isEdit && !scope.row.isCreate">
                    <el-upload
                      v-if="!scope.row.picShowPath"
                      :headers="importHeaders" :action="uploadImageApi"
                      :data="{username:scope.row.userName}"
                      :multiple="false" :limit="1" :before-upload="beforeUpload" :accept="'.png,.jpg,.bmp'"
                      :on-success="(response, file, fileList) => {
                          return successUpload(response, file, fileList, scope.row);
                        }
                      "  :show-file-list="false">
                        <el-button slot="default" type="primary" >上传图片</el-button>
                    </el-upload>
                    <div v-else class="el-upload-list__item is-ready " >
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="scope.row.picShowPath" alt=""  width="100%">
                        <div
                          class="deletePic"
                          @click="handleRemove(scope.row)"
                        >
                          <i class="el-icon-close"></i>
                        </div>
                    </div>
                  </template>
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="scope.row.picShowPath" alt=""  width="100%"
                    v-else-if="scope.row.picShowPath!=''"
                  >
                </template>
              </v-table-column>
              <v-table-column prop="enable" label="状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.enable === 1 ? '' : 'danger'">{{scope.row.enable|enableName}}</el-tag>
                </template>
              </v-table-column>
              <!-- <v-table-column prop="locked" label="是否锁定">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.locked === 1 ? 'danger' : ''">{{scope.row.locked|lockedName}}</el-tag>
                </template>
              </v-table-column>-->
              <v-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button
                    v-hasPermi="['configuration:authorization:userUpdate']"
                    v-if="!scope.row.isEdit"
                    @click.native.prevent="handleEdit(scope.$index, scope)"
                    type="text"
                    size="small"
                  >修改</el-button>
                  <span v-else>
                    <el-button @click.native.prevent="handleCancel(scope.$index, scope)" type="text" size="small">取消</el-button>
                    <el-button @click.native.prevent="handleSave(scope.$index, scope)" type="text" size="small">保存</el-button>
                  </span>
                  <el-button
                    v-if="!scope.row.isCreate && scope.row.userName != 'admin'"
                    v-hasPermi="['configuration:authorization:userUpdate']"
                    @click.native.prevent="handdleStatus(scope.$index, scope)"
                    type="text"
                    size="small"
                    :style="{ color: scope.row.enable == 1 ? '#EC0000': '#00AB44' }"
                  >{{scope.row.enable === 1 ? '禁用' : '启用'}}</el-button>
                  <el-button
                    v-if="!scope.row.isCreate && scope.row.userName != 'admin'"
                    v-hasPermi="['configuration:authorization:userResetpassword']"
                    @click.native.prevent="resetPasswords(scope.$index, scope)"
                    type="text"
                    size="small"
                  >重置密码</el-button>
                </template>
              </v-table-column>
            </el-table>
          </el-main>
          <!-- 翻页部分 -->
          <el-footer class="userManagement_table_pagination">
            <el-pagination
              background
              @size-change="changePagination"
              @current-change="changePagination"
              @prev-click="changePagination"
              @next-click="changePagination"
              layout="prev, pager, next"
              :current-page="queryData.pageNum"
              :page-size="queryData.pageSize"
              :total="totolCount"
            ></el-pagination>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </el-main>
</template>

<script>
import {
  icuWard_findWithPage,
  dept_findWithPage,
  getUserListByExample,
  addUserBaseInfo,
  updateUserBaseInfo,
  enableUser,
  resetUserPassword,
  dictItem_findWithPage,
  selectByUsername
} from '@/api/configuration'
import { Message } from 'element-ui'
import { frontFilter } from '@/utils/index' // 模糊查询方法
import { debounce } from 'lodash'
import { getCookie } from '@/utils/cookie' // 存储方式
export default {
  name: 'UserManagement',
  components: {},
  data: function() {
    return {
      totolCount: 0, // 总数
      queryData: {
        pageNum: 1, // 请求页
        pageSize: 15, // 请求条数
        searchKey: '', // 查询用户
        userType: null, // 职工类型
        deptCode: '', // 所属科室
        wardCode: '', // 病區
        enable: '' // 状态
      }, // 请求数据集合
      roleTypeList: [], // 职工类型集合(角色类型集合)
      showListDeptList: [], // 显示科室
      allDeptList: [], // 全部科室,用来模糊查询
      icuWardList: [], // ICU病区集合
      loading: false, // 表格loading
      tableData: [], // 表格数据
      backTableData: [], // 回退表格数据
      sexDictData: [], // 男女
      XTCS0027: '0',
      importHeaders: { 'X-Token': getCookie('token').tocken },
      uploadImageApi: (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + '/sys/uploadUserSignPicture',
      editStatusFlag: false
    }
  },
  filters: {
    enableName(val) {
      if (val === 0 || val === '0') {
        return '停用'
      }
      if (val === 1 || val === '1') {
        return '正常'
      }
    },
    lockedName(val) {
      if (val === 0 || val === '0') {
        return '否'
      }
      if (val === 1 || val === '1') {
        return '是'
      }
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    const paramInfo = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
    this.XTCS0027 = paramInfo[0]?.paramValue || this.XTCS0027
    this.init()
  },
  mounted() {},
  methods: {
    changeWard(row, dataList) {
      const icuCodeList = row.icuCodeList
      if (icuCodeList === null || icuCodeList.length === 0) {
        row.icuCode = null
        row.wardName = null
        return
      }
      const wardCodes = []
      const wardNameList = []
      icuCodeList.forEach(icuCode => {
        const finder = dataList.find(item => item.wardCode == icuCode)
        if (finder) {
          wardNameList.push(finder.wardName)
          wardCodes.push(icuCode)
        }
      })
      row.icuCode = wardCodes.toString()
      row.icuName = wardNameList.toString()
    },
    changeDept(row, dataList) {
      const deptId = row.deptId
      if (deptId === null || deptId === '') {
        row.deptName = null
        return
      }
      const finder = dataList.find(item => item.deptCode == deptId)
      row.deptName = finder ? finder.deptName : ''
    },
    /**
     * 初始化
     */
    async init() {
      this.sexDictData = await this.$getDictItemList('HIS_DICT_SEX')
      // 获取所属科室
      this.getDeptListFC()
      // 获取病区集合
      this.getWardListFc()
      // 请求查询table
      this.queryDataFC()
      // 获取职工类型集合
      this.getRoleTypeList()
    },
    // 获取职工类型集合
    getRoleTypeList() {
      dictItem_findWithPage({
        pageNum: 1,
        pageSize: 1000,
        dictGroupCode: 'ICIS_DICT_ROLE_TYPE'
      }).then(res => {
        this.roleTypeList = res.data.result
      })
    },
    /**
     * 获取科室集合
     */
    getDeptListFC() {
      dept_findWithPage({
        pageNum: 1,
        pageSize: 2000
      }).then(res => {
        this.showListDeptList = res.data.result // 用来显示的数据集
        this.allDeptList = res.data.result // 用来模糊查询的时候总量不变值
      })
    },
    // 获取病区集合
    getWardListFc() {
      icuWard_findWithPage({
        pageNum: 1,
        pageSize: 2000
      }).then(res => {
        this.icuWardList = res.data.result
      })
    },

    /**
     * 科室
     * 模糊查询的方法
     */
    filterMethod(val) {
      this.showListDeptList = frontFilter(val, this.allDeptList)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol
        ? this.debounceSearchSymbol
        : debounce(function() {
            this.queryDataButton()
          }, 1000)
      this.debounceSearchSymbol()
    },
    /**
     * 请求按钮
     * 需要翻页第一页去.
     */
    queryDataButton() {
      this.queryData.pageNum = 1
      this.queryDataFC()
    },
    /**
     * 请求方法
     */
    queryDataFC() {
      this.loading = true
      this.editStatusFlag = false
      getUserListByExample(this.queryData).then(res => {
        res.data.result.forEach(element => {
          const icuCode = element.icuCode
          if (icuCode) {
            const icuCodeList = icuCode.split(',')
            element.icuCodeList = icuCodeList
          } else {
            element.icuCodeList = []
          }
          const icuName = element.icuName
          if (icuName) {
            const icuNameList = icuName.split(',')
            element.icuNameList = icuNameList
          } else {
            element.icuNameList = []
          }
          if (element.picPath) {
            if (element.picPath.indexOf('base64') > -1) {
              element.picShowPath = element.picPath
            } else {
              if (process.env.NODE_ENV === 'production') {
                element.picShowPath = element.picPath
              } else {
                element.picShowPath = globalConfig.BASE_API + element.picPath
              }
            }
          } else {
            element.picShowPath = ''
          }
          // element.picShowPath = element.picPath ? (element.picPath.indexOf('base64') > -1 ? element.picPath : ((process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + element.picPath?.split('static')[1])) : ''
        })
        this.tableData = res.data.result // 显示表格的参数
        this.backTableData = JSON.parse(JSON.stringify(res.data.result)) // 回退表格的参数 深度拷贝一下
        this.totolCount = res.data.totolCount
        this.loading = false
      })
    },
    // 新增监护字典
    handleAdd() {
      if (this.editStatusFlag) {
        this.$message('请完成当前行编辑')
        return
      }
      this.editStatusFlag = true
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const row = {
        isCreate: true,
        isEdit: true,
        icuCodeList: [],
        enable: 1
      }
      this.addOrModify = 'add'
      this.tableData.unshift(row)
      this.$refs.cathertable && this.$refs.cathertable.doLayout()
    },
    /**
     * table 表格里面 修改按钮
     */
    handleEdit(index, scope) {
      if (this.editStatusFlag) {
        this.$message('请完成当前行编辑')
        return
      }
      this.editStatusFlag = true
      this.backTableData[index] = { ...scope.row }
      this.$set(
        this.tableData,
        index,
        Object.assign(scope.row, {
          isEdit: true
        })
      )
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.$refs.tableData && this.$refs.tableData.doLayout()
    },
    /**
     * table 表格里面 取消按钮
     */
    handleCancel(index, scope) {
      if (scope.row.isCreate) {
        this.tableData.splice(index, 1)
        this.editStatusFlag = false
      } else {
        this.editStatusFlag = false
        this.$set(
          this.tableData,
          index,
          Object.assign(this.backTableData[index], {
            isEdit: false
          })
        )
      }
    },
    /**
     * table 表格里面 保存按钮
     */
    handleSave(index, scope, text) {
      if (scope.row.userName == undefined || scope.row.userName.trim() == '') {
        Message({
          showClose: true,
          title: '提示',
          message: '用户工号不能为空！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.isCreate && scope.row.hasExistUserName) {
        this.$message.error('此工号已存在！')
        return false
      }
      if (scope.row.name == undefined || scope.row.name.trim() == '') {
        Message({
          showClose: true,
          title: '提示',
          message: '用户姓名不能为空！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.sex == undefined || scope.row.sex.trim() == '') {
        Message({
          showClose: true,
          title: '提示',
          message: '请选择用户性别！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.userType == undefined || scope.row.userType.trim() == '') {
        Message({
          showClose: true,
          title: '提示',
          message: '请选择用户职工类型！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.deptId == undefined || scope.row.deptId.trim() == '') {
        Message({
          showClose: true,
          title: '提示',
          message: '请选择科室！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.userWardList == undefined || (scope.row.userWardList instanceof Array && scope.row.userWardList.length == 0)) {
        Message({
          showClose: true,
          title: '提示',
          message: '请选择病区！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      const youxiang_patt = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      const shouji_patt = /^1[3456789]\d{9}$/
      if (scope.row.email && !youxiang_patt.test(scope.row.email)) {
        Message({
          showClose: true,
          title: '提示',
          message: '邮箱格式不正确！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      if (scope.row.mobile && !shouji_patt.test(scope.row.mobile)) {
        Message({
          showClose: true,
          title: '提示',
          message: '手机格式不正确！',
          //   type: 'error',
          duration: 5000
        })
        return
      }
      const query = {
        name: scope.row.name,
        sex: scope.row.sex,
        userType: scope.row.userType,
        deptId: scope.row.deptId,
        deptName: scope.row.deptName,
        mobile: scope.row.mobile,
        email: scope.row.email,
        userName: scope.row.userName,
        userWardList: scope.row.userWardList
      }
      query.picPath = scope.row.picShowPath
      // if (scope.row.picShowPath == '') {
      //   query.picPath = ''
      // } else {
      //   query.picPath = scope.row.picPath
      // }
      if (scope.row.isCreate) {
        query.enable = scope.row.enable
        addUserBaseInfo(query).then(res => {
          this.$notify({
            title: '成功',
            message: text || '新增成功！',
            type: 'success',
            duration: 2000
          })
          this.editStatusFlag = false
          this.queryDataFC()
        })
        .catch(erro => {
          this.queryDataFC()
        })
      } else {
          updateUserBaseInfo(query).then(res => {
            this.$notify({
              title: '成功',
              message: text || '修改成功！',
              type: 'success',
              duration: 2000
            })
            this.editStatusFlag = false
            this.queryDataFC()
          })
          .catch(erro => {
            this.queryDataFC()
          })
      }
    },
    /**
     * table 表格里面 启用禁用
     */
    handdleStatus(index, scope) {
      enableUser({
        userName: scope.row.userName,
        enable: scope.row.enable == 1 ? 0 : 1
      }).then(res => {
        if (scope.row.enable == 1) {
          Message({
            showClose: true,
            title: '提示',
            message: '禁用成功',
            duration: 5000
          })
        } else {
          Message({
            showClose: true,
            title: '提示',
            type: 'success',
            message: '启用成功',
            duration: 5000
          })
        }
        this.queryDataFC()
      })
    },
    /**
     * 重置密码
     */
    resetPasswords(index, scope) {
      resetUserPassword({
        loginName: scope.row.userName
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '已重置密码！',
          type: 'success',
          duration: 2000
        })
      })
    },
    /**
     * 翻页的方法
     */
    changePagination(val) {
      this.queryData.pageNum = val
      this.queryDataFC()
    },
    /**
     * 查询图片大小
     */
    beforeUpload(file) {
      const isJPG = file.type
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!(isJPG.endsWith('jpeg') || isJPG.endsWith('png') || isJPG.endsWith('bmp'))) {
        this.$message.error('支持图片格式jpeg/jpg/bmp/png!')
        return false
      }
      if (!isLt5M) {
        this.$message.error('图片大小限5M以内!')
        return false
      }
      return isJPG && isLt5M
    },
    /**
     * 上传成功
     */
    successUpload(res, file, fileList, row) {
      row.picShowPath = res.data.indexOf('base64') > -1 ? res.data : ((process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + res.data?.split('static')[1])
      row.picPath = res.data
    },
    /**
     * 删除用户图片
     */
    handleRemove(row) {
      row.picShowPath = ''
    },
    // 校验工号
    handleCheckUserName(row) {
      selectByUsername({ userName: row.userName }).then(res => {
        row.hasExistUserName = !!res.data
        if (row.hasExistUserName) {
          this.$message.error('此工号已存在！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped >
.select-fix {
  vertical-align: baseline;
}
.userManagement {
  background: #fff;
  padding: 1%;
  height: 100%;
  &_query {
    display: flex;
    height: 32px !important;
    margin-bottom: 10px;
    position: relative;
    padding: 0;
    justify-content: space-between;
    &_left {
      display: flex;
      flex-grow: 1;
    }
    &_right {}
    .userName {
      max-width: 260px;
      min-width: 220px;
      width: 16%;
    }
    .inputData {
      margin-left: 2%;
      white-space: nowrap;
      span {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 6, 34, 0.7);
      }
      ::v-deep .el-select {
        max-width: 140px;
        min-width: 100px;
      }
    }
  }
  &_table {
    height: calc(100% - 42px);
    padding: 0;
    overflow: hidden;
    &_div {
      padding: 0;
      overflow: hidden;
    }
    &_pagination {
      padding: 0;
      height: 30px !important;
      margin-top: 10px;
      text-align: right;
    }
    .deletePic{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: auto;
      background: rgba(0, 0, 0, 0.2);
      text-align: right;
      padding:10px;
      & i{
        color:#fff
      }
    }
  }
}
/* 工号/姓名 的样式 */
::v-deep.el-input--small .el-input__inner {
  background: #f3f5f9;
  border-radius: 2px 0px 0px 2px;
  border: initial;
}
/* 表格里面的背景颜色 */
::v-deep.el-table .el-table__row .el-input__inner {
  background: #fff;
}
</style>
