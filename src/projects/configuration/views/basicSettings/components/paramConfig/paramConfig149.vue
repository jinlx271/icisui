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
        <v-table-column prop="moni" label="年龄最小值">
          <template slot-scope="scope">
            <div class="flex">
              <el-input v-only-num :digit="0" :min="0" :max="150" v-model="scope.row.ageMin" placeholder="请输入"
                style="width:50%"></el-input>
              <el-select v-model="scope.row.ageMinUnit" placeholder="请选择" style="width:50%"
                @change="selectImageType($event, scope.row)">
                <el-option v-for="item in ageUnitList" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictCode"></el-option>
              </el-select>
            </div>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="年龄最大值">
          <template slot-scope="scope">
            <div class="flex">
              <el-input v-only-num :digit="0" :min="0" :max="150" v-model="scope.row.ageMax" placeholder="请输入"
                style="width:50%"></el-input>
              <el-select v-model="scope.row.ageMaxUnit" placeholder="请选择" style="width:50%"
                @change="selectImageType($event, scope.row)">
                <el-option v-for="item in ageUnitList" :key="item.dictCode" :label="item.dictName"
                  :value="item.dictCode"></el-option>
              </el-select>
            </div>
          </template>
        </v-table-column>
        <v-table-column prop="moni" label="人体图">
          <template slot-scope="scope">
            <el-select v-model="scope.row.imageType" style="width:100%">
              <el-option v-for="item in imageTypeFilterList" :key="item.dictCode" :label="item.dictName"
                :value="item.dictCode" :disabled="item.isSelect"></el-option>
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
  map
} from 'lodash'
export default {
  name: 'ParamConfigOrderRelativeFluid',
  components: {},
  data: function () {
    return {
      paramValueCopy: [],
      imageTypeList: [
        {
          dictCode: '1',
          dictName: '新生儿人体图',
          imageList: ['boy', 'girl']
        },
        {
          dictCode: '2',
          dictName: '中年人体图',
          imageList: ['man', 'woman']
        },
        {
          dictCode: '3',
          dictName: '老年人体图',
          imageList: ['oldMan', 'oldWoman']
        }
      ],
      ageUnitList: [
        {
          dictCode: 1,
          dictName: '天'
        },
        {
          dictCode: 2,
          dictName: '月'
        },
        {
          dictCode: 365,
          dictName: '岁'
        }
      ]
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
    },
    imageTypeFilterList() {
      const selectArr = map(this.paramValueCopy, 'imageType')
      return this.imageTypeList.map(item => {
        item.isSelect = selectArr.includes(item.dictCode)
        return item
      })
    }
  },
  created: async function () { },
  mounted() { },
  methods: {
    change() {
      return new Promise((resolve, reject) => {
        if (this.paramValueCopy.filter(v => v.ageMin === '').length > 0) {
          this.$message.error('请输入年龄最小值!')
          reject()
          return
        } else if (this.paramValueCopy.filter(v => v.ageMax === '').length > 0) {
          this.$message.error('请输入年龄最大值!')
          reject()
          return
        } else if (this.paramValueCopy.filter(v => !v.imageType).length > 0) {
          this.$message.error('请选择人体图!')
          reject()
          return
        }
        // 判断最大年龄最小年龄
        const errorAgeMinMax = this.paramValueCopy.filter(v => {
          const minAgeUnit = this.ageUnitList.find(age => age.dictCode == v.ageMinUnit)
          const maxAgeUnit = this.ageUnitList.find(age => age.dictCode == v.ageMaxUnit)
          return v.ageMin * minAgeUnit.dictCode > v.ageMax * maxAgeUnit.dictCode
        })
        if (errorAgeMinMax.length > 0) {
          this.$message.error('年龄最小值不能大于年龄最大值!')
          reject()
          return
        }
        this.paramValueCopy.map(item => {
          item.ageMinValue = item.ageMin * item.ageMinUnit
          item.ageMaxValue = item.ageMax * item.ageMaxUnit
          item.imageList = this.imageTypeList.find(imageItem => imageItem.dictCode == item.imageType).imageList
          return item
        })
        this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
        resolve()
      })
    },
    deleteFn(index) {
      this.paramValueCopy.splice(index, 1)
    },
    addLine() {
      this.paramValueCopy.unshift({ ageMin: '', ageMinUnit: 365, ageMinValue: 0, ageMax: '', ageMaxUnit: 365, ageMaxValue: 0, imageType: '', imageList: [] })
      this.paramValueCopy = JSON.parse(JSON.stringify(this.paramValueCopy))
    },
    /**
     * 选择医嘱分类
     * @param {} e
     * @param {*} row
     */
    selectImageType(e, row) {
      const length = this.paramValueCopy.filter(item => item.imageType == row.imageType).length
      if (length > 1) {
        this.$message.warning('该人体图已配置')
        row.imageType = ''
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
