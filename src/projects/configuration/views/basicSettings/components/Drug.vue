<!-- 基础字典 -->
<template>
  <div class='hisDrug'>
    <el-container class='hisDrug' element-loading-text="加载中" v-loading="loading">
      <el-container class="hisDrug_right">
        <el-header class="hisDrug_right_head">
          <div>
          <el-input class="elInput" size="small" placeholder="编码/名称/国标码" suffix-icon="el-icon-search" clearable v-model="searchKey"
                    @keyup.enter.native="rightInputFC" @input="debounceSearch"></el-input>
          <el-checkbox v-model="statusDict" true-label="" false-label="1" @change="debounceSearch" >
                显示禁用
          </el-checkbox>
          </div>
          <div>
            <!-- <el-button class="queryButton" size="small" type="primary" @click="">同步HIS数据</el-button> -->
            <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small" type="primary"
                       @click="showAddDiag">新增药品</el-button>
          </div>
        </el-header>
        <el-main class="hisDrug_right_body" style="height:calc(100% - 102px)">
          <el-table :row-class-name="({row}) => row.statusDict == 0 ? 'disabled' : ''" @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :data="tableDataTwo" fit border highlight-current-row style="width: 100%">
            <v-table-column prop="drugCode" label="值"></v-table-column>
            <v-table-column prop="drugName" label="药品名称"></v-table-column>
            <v-table-column prop="gbCode" label="国标码" v-if="XTCS0027 == '1'"></v-table-column>
            <v-table-column prop="simpleName" label="药品缩写"></v-table-column>
            <v-table-column prop="drugSpec" label="药品规格"></v-table-column>
            <!-- 705872 药品属性设置：晶体、胶体、营养液 -->
            <v-table-column prop="drugAttributes" label="药品属性">
              <template slot-scope="scope">
                <span>{{drugAttributesFilter(scope.row.drugAttributes,drugAttributesList)}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="drugTypeDict" label="药品类型">
              <template slot-scope="scope">
                <span>{{drugAttributesFilter(scope.row.drugTypeDict,drugTypeDictList)}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="dosageUnit" label="单位"></v-table-column>
            <v-table-column prop="factoryName" label="厂家"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用"
                           inactive-text="已禁用" @change="validateStatus"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="modifyInfo(scope.$index, scope.row)"
                           type="text" size="small">修改</el-button>
                <!-- <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" @click.native.prevent="deleteInfo(scope.$index, scope.row)" type="text" size="small" class="redCss">删除</el-button> -->
              </template>
            </v-table-column>
          </el-table>
        </el-main>
        <el-footer class="hisDrug_right_footer">
          <el-pagination @size-change="changePagination" @current-change="changePagination" :current-page="pageNum" :hide-on-single-page="false"
                         :page-size="pageSize" background layout="total, prev, pager, next" style="float:right;margin-top:15px;margin-right:-30px"
                         :total="totolCount"></el-pagination>
        </el-footer>
      </el-container>
      <!-- 新增字典分组 -->
      <el-dialog :title="drugDialog" :visible.sync="dialogFlag" :before-close="closeDialog" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form ref="form" :model="drugInfo" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="drugName">
            <el-input v-model="drugInfo.drugName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="drugCode">
            <el-input v-model="drugInfo.drugCode" placeholder="请输入" :disabled="addOrModify=='modify'"></el-input>
          </el-form-item>
          <el-form-item v-if="addOrModify == 'add' " label="国标码" prop="gbCode">
            <el-input v-model="drugInfo.gbCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="缩写" prop="simpleName">
            <el-input v-model="drugInfo.simpleName" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- 705872 药品属性设置：晶体、胶体、营养液 -->
          <el-form-item label="属性" prop="drugAttributes">
            <el-select clearable v-model="drugInfo.drugAttributes" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,index) in drugAttributesList" :key="item.dictId + index" :label="item.dictName" :value="item.dictCode"
                         :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品类型" prop="drugTypeDict">
            <el-select clearable v-model="drugInfo.drugTypeDict" placeholder="请选择" style="width:100%">
              <el-option v-for="(item,index) in drugTypeDictList" :key="item.dictCode + index" :label="item.dictName" :value="item.dictCode"
                         :disabled="item.statusDict == '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格" prop="drugSpec">
            <el-input v-model="drugInfo.drugSpec" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="dosageUnit">
            <el-input v-model="drugInfo.dosageUnit" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="厂家" prop="factoryName">
            <el-input v-model="drugInfo.factoryName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="drugInfo.statusDict" @change="validateStatus">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitData">保存</el-button>
        </span>
      </el-dialog>

    </el-container>
  </div>

</template>

<script>
import {
  drug_deleteById,
  drug_edit,
  // drug_findWithPage,
  drug_findAllWithPage,
  drug_insert

} from '@/api/configuration'
import { debounce } from 'lodash'
export default {
  name: 'HisDrug',
  components: {},
  data: function () {
    return {
      elTableHeight: 100,
      loading: false,
      searchKey: '',
      statusDict: '',
      pageSize: 15,
      pageNum: 1,
      totolCount: 0,
      tableDataTwo: [],
      drugDialog: '新增药品',
      dialogFlag: false, // 弹框标志
      drugTypeDictList: [
        // {
        //   dictCode: '1',
        //   dictName: '普通'
        // }, {
        //   dictCode: '2',
        //   dictName: '麻醉'
        // }, {
        //   dictCode: '3',
        //   dictName: '精神'
        // }, {
        //   dictCode: '4',
        //   dictName: '剧毒'
        // }, {
        //   dictCode: '5',
        //   dictName: '危险'
        // }, {
        //   dictCode: '6',
        //   dictName: '化试'
        // }, {
        //   dictCode: '7',
        //   dictName: '胰岛素'
        // }, {
        //   dictCode: '9',
        //   dictName: '抗菌素'
        // }
      ],
      drugInfo: {
        drugCode: '',
        drugTypeDict: '',
        drugAttributes: '',
        drugName: '',
        simpleName: '',
        dosageUnit: '',
        drugSpec: '',
        factoryName: '',
        statusDict: '1',
        gbCode: ''
      },
      // 校验规则
      rules: {
        drugCode: [
          { required: true, message: '请输入药品编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 50) {
                callback(new Error('请输入少于50字的药品编码'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        drugName: [
          { required: true, message: '请输入药品名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 30) {
                callback(new Error('请输入少于30字的药品名称'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        simpleName: [
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 30) {
                callback(new Error('请输入少于30字的药品缩写'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      // 弹框是修改还是新增
      addOrModify: 'add',
      drugAttributesList: [], // 药品属性
      XTCS0027: ''
    }
  },
  props: {},
  watch: {},
  computed: {},
  async created() {
    const params = await this.$queryParam({ paramGroupCode: 'XTCS', paramCode: 'XTCS0027' })
    this.XTCS0027 = params[0]?.paramValue || '0'
    const batchDictObj = await this.$batchGetDictItemList(['ICIS_DICT_DRUG_ATTRIBUTES', 'HIS_DICT_DRUG_TYPE'])
    this.drugAttributesList = batchDictObj['ICIS_DICT_DRUG_ATTRIBUTES']
    this.drugTypeDictList = batchDictObj['HIS_DICT_DRUG_TYPE']
    this.getDrugList()
  },
  mounted() {
  },
  methods: {
    // 获取药品列表
    getDrugList(pageNum) {
      this.loading = true
      const query = {
        statusDict: this.statusDict,
        pageNum: pageNum || this.pageNum,
        pageSize: this.pageSize
      }
      if (pageNum) this.pageNum = pageNum
      if (this.searchkey != '') {
        query.searchKey = this.searchKey
      }
      drug_findAllWithPage(query).then(res => {
        this.loading = false
        this.tableDataTwo = res.data.result
        this.totolCount = res.data.totolCount
      })
    },
    rightInputFC() {
      this.getDrugList(1)
    },
    debounceSearch() {
      this.debounceSearchSymbol = this.debounceSearchSymbol ? this.debounceSearchSymbol : debounce(function () {
        this.getDrugList(1)
      }, 200)
      this.debounceSearchSymbol()
    },
    // 增加药品 显示弹框
    showAddDiag() {
      this.drugDialog = '新增药品'
      this.addOrModify = 'add'
      this.dialogFlag = true
    },
    // 修改当前药品信息
    modifyInfo(index, row) {
      this.drugDialog = '修改药品'
      this.dialogFlag = true
      this.addOrModify = 'modify'
      this.drugInfo = { ...row }
    },
    // 关闭弹框
    closeDialog() {
      this.dialogFlag = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.drugInfo = {
        drugCode: '',
        drugName: '',
        gbCode: '',
        statusDict: '1'
      }
    },
    // 数据翻页
    changePagination(pageNum) {
      this.pageNum = pageNum
      this.getDrugList()
    },
    setStatusDict(index, row) {
      this.drugInfo = row
      this.drugInfo.statusDict = this.drugInfo.statusDict ^ 1
      this.addOrModify = 'modify'
      this.submitData()
    },
    /** 禁用状态提醒 */
    validateStatus(e) {
      if (e == 0 || e == '0') {
        this.$message({
          type: 'info',
          message: '相关配置及个人相关数据也将被禁用！'
        })
      } else {
        this.$message.closeAll()
      }
    },
    // 提交药品数据 新增 修改都是该方法
    submitData() {
      const query = this.drugInfo
      // if (this.drugInfo.statusDict == 0) {
      //   this.$message({
      //     type: 'info',
      //     message: '监护配置及个人监护项相关数据也将被禁用!'
      //   })
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.addOrModify == 'modify') { // 修改
            drug_edit(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDrugList()
                this.closeDialog()
              }
            })
          } else {
            drug_insert(query).then(res => {
              this.closeDialog()
              if (res.code == 0) {
                this.getDrugList(1)
                this.closeDialog()
              }
            })
          }
        }
      })
    },
    // 删除当前药品信息
    deleteInfo(index, row) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = row.drugId
        drug_deleteById(query).then(res => {
          this.getDrugList(1)
        })
      })
    },
    // 属性名称
    drugAttributesFilter(val, list) {
      if (!val) return
      const data = list.filter((item) => { return val == item.dictCode })
      return data[0]?.dictName || ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.hisDrug_right {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.hisDrug {
  background: #ffffff;
  height: 100%;
  display: block;
  &_left {
    &_div {
      height: 100%;
    }
    &_main {
      .groupName {
        display: flex;
        align-items: center;
        .name {
          flex: 1;
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
              font-size: 14px;
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
}
</style>
