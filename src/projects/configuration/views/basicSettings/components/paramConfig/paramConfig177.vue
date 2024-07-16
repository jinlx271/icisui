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
        <v-table-column prop="wardCode" label="病区">
          <template slot-scope="scope">
            <el-select style="width:100%" v-model="scope.row.wardCode" placeholder="请选择"
              @change="changeWardCode($event, scope.row)">
              <el-option v-for="(item) in wardList" :key="item.wardCode" :label="item.wardName"
                :value="item.wardCode"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="液体平衡监护项">
          <template slot-scope="scope">
            <el-select filterable clearable multiple v-model="scope.row.moniitemCode" :value-key="'moniitemCode'"
              style="width:100%" @change="selectMoniitem($event, scope.row)">
              <el-option v-for="(item,index) in moniitemCodeWard[scope.row.wardCode]" :key="`${scope.row.wardCode}-${item.moniitemCode}-${scope.$index}-${index}`"
                :label="item.moniitemName" :value="item.moniitemCode" :forceHide="item.statusDict != 1">{{
                  item.moniitemName + '(' + item.moniitemCode + ')' }}</el-option>
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
import {
  icuWard_findWithPage,
  wardModuleMoniitem_findAllWithPage
} from '@/api/configuration'
export default {
  name: 'ParamConfigOrderRelativeFluid',
  components: {},
  data: function () {
    return {
      wardList: [],
      wardListAll: [],
      paramValueCopy: [],
      moniitemDictList: [],
      moniitemDictListAll: [],
      moniitemCodeList: [], // 已经存在的编码

      moniitemCodeWard: {
      }
    }
  },
  props: {
    paramValue: {},
    title: {
      type: String,
      default: ''
    },
    dataSourceDict: { // 是否过滤数据来演
      type: String,
      default: ''
    }
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
    const wardList = await icuWard_findWithPage({
      pageSize: 1000,
      pageNum: 1,
      userName: ''
    })
    this.wardList = this.wardListAll = wardList.data.result
    this.getMoniitemCodeByWard()
  },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => !v.wardCode).length > 0) {
          this.$message.error('请选择病区!')
          reject()
          return
        }
        if (this.paramValueCopy.filter(v => !v.moniitemCode.length).length > 0) {
          this.$message.error('请选择液体平衡监护项!')
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
    // 添加新数据
    addLine() {
      this.paramValueCopy.unshift({ moniitemCode: [], wardCode: '' })
    },
    /**
     * 切换病区要查询对应的监护数据列表
     * @param {*} $event
     * @param {*} row
     */
    changeWardCode($event, row) {
      const length = this.paramValueCopy.filter(item => item.wardCode == $event && item.moniitemCode == row.moniitemCode).length
      if (length > 1) {
        this.$message.warning('相同病区下已存在该液体平衡监护项')
        row.moniitemCode = ''
      }
      if (!this.moniitemCodeWard[$event] || this.moniitemCodeWard[$event]?.length == 0) {
        // 请求液体平衡的监护项
        wardModuleMoniitem_findAllWithPage({
          'wardCode': $event,
          'busiTypeDictCode': '3',
          'pageNum': 1,
          'pageSize': 1000
        }).then(res => {
          this.$set(this.moniitemCodeWard, $event, res.data.result)
        })
      }
    },
    /**
     * 选择液体平衡项目
     * @param {*} $event
     * @param {*} row
     */
    selectMoniitem($event, row) {
      const length = this.paramValueCopy.filter(item => item.wardCode == row.wardCode && item.moniitemCode == row.moniitemCode).length
      if (length > 1) {
        this.$message.warning('相同病区下已存在该液体平衡监护项')
        row.moniitemCode = ''
      }
    },
    getMoniitemCodeByWard() {
      this.paramValueCopy.forEach(item => {
        this.$set(this.moniitemCodeWard, item.wardCode, [])
        this.changeWardCode(item.wardCode, item)
      })
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
