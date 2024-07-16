<!-- 基础参数 -->
<template>
  <div class="paramConfigOrderRelativeFluid">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="paramValueCopy"></el-form-item>
      <div>
        <el-button type="primary" @click="addLine">新增</el-button>
      </div>
    </div>
    <div style="height:calc(100% - 60px)">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="table" border :data="paramValueCopy" row-key="id" height="100%">
        <v-table-column prop="moni" label="医嘱分类">
          <template slot-scope="scope">
            <el-select v-model="scope.row.orderCode" placeholder="请选择" style="width:100%"
              @change="selectOrderType($event, scope.row)">
              <el-option v-for="item in orderUsageTypeList" :key="item.dictCode" :forceHide="item.statusDict != 1"
                :label="item.dictName" :value="item.dictCode">{{ item.dictName + '(' + item.dictCode + ')' }}</el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="执行计划样式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.styleCode" style="width:100%" @change="handleChangeStyle($event, scope.row)">
              <el-option v-for="item in styleList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="图标">
          <template slot-scope="scope">
            <el-select v-model="scope.row.iconCode" style="width:100%" :disabled="scope.row.styleCode == 1">
              <el-option v-for="item in iconList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="占用宽度">
          <template slot-scope="scope">
            <el-select v-model="scope.row.width" style="width:100%" :disabled="scope.row.styleCode == 2">
              <el-option v-for="item in widthList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="deleteFn(scope.$index)">删除</el-button>
          </template>
        </v-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParamConfigOrderRelativeFluid',
  components: {},
  data: function () {
    return {
      orderUsageTypeList: [],
      orderUsageTypeListAll: [],
      paramValueCopy: [],
      orderDefaultIcon: {
        '1001': '1', // 输液类医嘱
        '1005': '2', // 输血类医嘱
        '1004': '3', // 注射类医嘱
        '1006': '4', // 口服类医嘱
        '1010': '5', // 营养类医嘱
        '1007': '6', // 鼻饲类医嘱
        '1009': '7' // 喂养类医嘱
      },
      styleList: [
        {
          dictCode: '1',
          dictName: '进度条式'
        },
        {
          dictCode: '2',
          dictName: '图标式'
        }
      ],
      iconList: [
        {
          dictCode: '1',
          dictName: '输液图标'
        },
        {
          dictCode: '2',
          dictName: '输血图标'
        },
        {
          dictCode: '3',
          dictName: '注射图标'
        },
        {
          dictCode: '4',
          dictName: '口服图标'
        },
        {
          dictCode: '5',
          dictName: '营养图标'
        },
        {
          dictCode: '6',
          dictName: '鼻饲图标'
        },
        {
          dictCode: '7',
          dictName: '喂养图标'
        }
      ],
      widthList: [
        {
          dictCode: '0.5',
          dictName: '半个时'
        },
        {
          dictCode: '1',
          dictName: '1小时'
        },
        {
          dictCode: '2',
          dictName: '2小时'
        }
      ],
      moniitemDictList: [],
      moniitemDictListAll: [],
      moniitemCodeList: [] // 已经存在的编码
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    stringAddList: {
      handler: function (n) {
        try {
          const { string } = n
          const paramValueCopy = JSON.parse(JSON.parse(string))
          this.paramValueCopy = paramValueCopy.map(v => {
            return v
          })
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    string() {
      return JSON.stringify(this.paramValue)
    },
    stringAddList() {
      const { string } = this
      return { string }
    }
  },
  created: async function () {
    const { ICIS_DICT_ORDER_USAGE_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_ORDER_USAGE_TYPE'])
    this.orderUsageTypeList = this.orderUsageTypeListAll = ICIS_DICT_ORDER_USAGE_TYPE
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => !v.orderCode).length > 0) {
          this.$message.error('请选择医嘱分类!')
          reject()
          return
        } else if (this.paramValueCopy.filter(v => v.styleCode == 2 && !v.iconCode).length > 0) {
          this.$message.error('执行计划为图标式样式请选择图标!')
          reject()
          return
        }
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    handleChangeStyle(e, row) {
      if (e == 1) {
        row.iconCode = ''
      } else if (e == 2) {
        row.width = '1'
      }
    },
    addLine() {
      this.paramValueCopy.unshift({ orderCode: '', styleCode: '1', iconCode: '', width: '1' })
    },
    /**
     * 选择医嘱分类
     * @param {} e
     * @param {*} row
     */
    selectOrderType(e, row) {
      const length = this.paramValueCopy.filter(item => item.orderCode == row.orderCode).length
      if (length > 1) {
        this.$message.warning('该医嘱类型已配置')
        row.orderCode = ''
      } else {
        if (this.orderDefaultIcon[row.orderCode]) {
          row.styleCode = '2'
          row.iconCode = this.orderDefaultIcon[row.orderCode]
          row.width = '1'
        } else {
          row.styleCode = '1'
          row.iconCode = ''
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigOrderRelativeFluid {
  height: 300px;
}

::v-deep .el-form-item__label {
  padding: 0;
  width: 118px !important;
  margin-right: 12px;
}
</style>
