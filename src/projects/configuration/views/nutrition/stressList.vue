<!-- 抢救记录项配置 -->
<template>
  <div id="salvageItem" class="salvageItem" element-loading-text="加载中" v-loading="loading">
    <!-- ICU病区 -->
    <div class="left">
      <el-container style="height:100%">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <icu-region style="height:calc(100% - 42px)" :defaultPermi="['configuration:nutrition:stressList:config']"
          :defaultRegion="defaultRegion" module="stressConfig" @defaultRegionChange="defaultRegionChange"
          ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <!-- 基础病情、护理、用药记录 -->
    <div class="salvageItemBaseInfo">
      <el-container class="w100">
        <el-header class="elHeader3">
          <!-- input输入 -->
          <div class="headerLeft">
            <el-input size="small" placeholder="名称/编码" clearable suffix-icon="el-icon-search"
              v-model="queryData.searchKey" @input="getData()"></el-input>
            <el-checkbox v-model="queryData.status" true-label="" false-label="1" @change="getData()">
              显示禁用
            </el-checkbox>
          </div>
          <div class="headerRight">
            <el-button class="queryButton" type="primary" @click.native.prevent="getData()" size="small">查询</el-button>
            <el-button v-hasPermi="['configuration:nutrition:stressList:config']" class="queryButton" type="primary"
              @click.native.prevent="handleAdd">新增</el-button>
          </div>
        </el-header>

      </el-container>
      <div class="w100" style="height:calc(100% - 50px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          height="100%" ref="tableData" :row-class-name="({ row }) => row.status == 0 ? 'disabled' : ''" :data="tableData"
          highlight-current-row fit border row-key="id">
          <v-table-column prop="dictCode" label="编码">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isCreate" v-model="scope.row.dictCode" placeholder="请输入" clearable maxlength="64">
              </el-input>
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
          <v-table-column prop="simpleName" label="简称">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.simpleName" placeholder="请输入" clearable
                :disabled="!scope.row.isEdit"> </el-input>
              <span v-else>{{ scope.row.simpleName }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="coefficient" label="系数" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.coefficient" v-only-num :digit="1" maxlength="9"
                placeholder="请输入" clearable :disabled="!scope.row.isEdit" style="width:100%;"> </el-input>
              <span v-else>{{ scope.row.coefficient }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="pinyin" label="拼音" align="center"></v-table-column>
          <v-table-column prop="wubi" label="五笔" align="center"></v-table-column>
          <v-table-column prop="sortNo" label="排序" width="120px" align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEdit" v-model="scope.row.sortNo" v-only-num :digit="0" maxlength="5"
                placeholder="请输入" clearable :disabled="!scope.row.isEdit" style="width:100%;"> </el-input>
              <span v-else>{{ scope.row.sortNo }}</span>
            </template>
          </v-table-column>

          <v-table-column label="操作" align="center" width="150px" fixed="right">
            <template slot-scope="scope">
              <el-button v-hasPermi="['configuration:nutrition:stressList:config']" type="text"
                @click="handleEdit(scope.$index, scope.row)" v-if="!scope.row.isEdit">修改</el-button>
              <el-button v-hasPermi="['configuration:nutrition:stressList:config']" type="text"
                @click="handleSave(scope.$index, scope.row)" v-if="scope.row.isEdit">保存</el-button>
              <el-button v-hasPermi="['configuration:nutrition:stressList:config']" type="text"
                @click="handleCancel(scope.$index, scope.row)" v-if="scope.row.isEdit">取消</el-button>
              <el-button v-if="!scope.row.isCreate" v-hasPermi="['configuration:nutrition:stressList:config']" type="text"
                @click="enableOrDisable(scope.$index, scope.row)"
                :style="{ color: scope.row.status == 1 ? '#EC0000' : '#00AB44' }">{{+scope.row.status ? '禁用' :
                  '启用' }}</el-button>
            </template>
          </v-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import icuRegion from '@/views/configuration/basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import {
  stress_findWithPage,
  stress_insert,
  stress_edit
} from '@/api/configuration'
import { getDrugBasicData } from '@/utils/utils'
export default {
  name: 'SalvageItem',
  components: { icuRegion },
  data: function () {
    return {
      loading: false,
      defaultRegion: '',
      pageNum: 1,
      pageSize: 1000,
      totolCount: 0,
      tableData: [],
      queryData: {
        searchKey: '',
        status: ''
      },
      drugBasicData: [], // 药品基础数据
      unitList: [],
      currRow: null
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
    Promise.all([
      this.$getDictItemList('ICIS_DICT_UNIT'),
      getDrugBasicData(),
      this.getDrugData()
    ]).then(res => {
      this.unitList = res[0]
      this.drugBasicData = res[1]
      this.tableData = res[2]
    })
  },
  mounted() { },
  methods: {
    async getData() {
      this.loading = true
      this.tableData = await this.getDrugData()
    },
    // 获取药品信息
    getDrugData(pageNum) {
      this.pageNum = pageNum || 1
      return new Promise((resolve, reject) => {
        const query = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          wardCode: this.defaultRegion,
          ...this.queryData
        }
        stress_findWithPage(query).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.totolCount = res.data.totolCount
            resolve(res.data.result)
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    async changePage(pageNum) {
      this.tableData = await this.getDrugData(pageNum)
    },
    // 启用禁用-用药信息
    enableOrDisable(index, row) {
      stress_edit({
        id: row.id,
        status: row.status == '1' ? '0' : '1'
      }).then(res => {
        this.getData()
        this.$message({
          type: 'success',
          message: +row.status ? '已禁用' : '已启用'
        })
      })
    },
    // 取消功能
    async handleCancel(index, row) {
      if (row.isCreate) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData[index] = this.currRow
      }
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      row.isEdit = false
      this.currRow = null
      this.drugBasicData = await getDrugBasicData()
    },
    handleEdit(index, row) {
      const isEdit = this.tableData.find(item => item.isEdit)
      if (isEdit) {
        this.$message.warning('请先保存或取消当前编辑内容')
        return
      }
      this.currRow = { ...row }
      row.isEdit = true
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 复制配置功能
    defaultRegionChange(e) {
      this.defaultRegion = e
      if (this.defaultRegion != '') {
        this.tableData = []
        this.getData()
      }
    },
    // 添加药品按钮
    async handleAdd() {
      const isEdit = this.tableData.find(item => item.isEdit)
      if (isEdit) {
        this.$message.warning('请先保存或取消当前编辑内容')
        return
      }
      if (this.tableData.length > 0) {
        const first = this.tableData[0]
        if (first.isCreate) {
          return
        }
      }
      const sortNoArr = _.map(this.tableData, 'sortNo')
      let sortNo = 1
      if (sortNoArr.length) {
        sortNo = Math.max(0, ...sortNoArr) + 1
      }
      const row = {
        isEdit: true,
        isCreate: true,
        dictCode: '',
        dictName: '',
        simpleName: '',
        coefficient: 1,
        sortNo,
        status: '1'
      }
      this.tableData.unshift(row)
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    handleSave(index, row) {
      console.log('handleSave', row)
      if (!row.dictCode) {
        this.$message.error('请输入应激因素编码')
        return
      }
      if (!row.dictName) {
        this.$message.error('请输入应激因素名称')
        return
      }
      if (row.coefficient === '') {
        this.$message.error('请输入系数')
        return
      }
      if (+row.coefficient <= 0) {
        this.$message.error('请输入大于0的系数')
        return
      }
      if (row.isCreate) {
        const query = {
          wardCode: this.defaultRegion,
          ...row
        }
        delete query.isCreate
        delete query.isEdit
        stress_insert(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            delete row.isCreate
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getData()
          }
        })
      } else {
        const query = { ...row }
        delete query.isEdit
        stress_edit(query).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.currRow = null
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getData()
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/config-common.scss'; // 公共css方法

.salvageItem {
  background: #fff;
  display: flex;
  height: 100%;
  width: 100%;

  .left {
    height: 100%;
    margin-right: 10px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    width: 385px;
  }

  .salvageItemBaseInfo {
    height: 100%;
    flex: 1;
    padding: 15px 15px 15px 0;
    overflow-x: auto;

    .el-header {
      height: 34px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;

      .el-input {
        width: 300px;
      }
    }
  }
}
</style>
