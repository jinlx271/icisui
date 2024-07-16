<!-- 医嘱属性设置 -->
<template>
  <el-container class="orderPropertyConfig">
    <el-header>
      <!-- input输入 -->
      <el-input size="small" placeholder="医嘱" clearable suffix-icon="el-icon-search" v-model="searchKey"></el-input>
      <!-- 按钮 -->
      <el-button class="queryButton" type="primary" @click.native.prevent="addRoleVisible = true">添加</el-button>
    </el-header>
    <el-main>
      <el-table @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)" ref="table" height="100%" :data="tableData" border style="width: 100%"  highlight-current-row>
        <v-table-column prop="name1" label="医嘱"></v-table-column>
        <v-table-column prop="name2" label="病区名称"></v-table-column>
        <v-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="determineRow(scope.$index, scope.row)" type="text" size="small">确定</el-button>
            <el-button @click.native.prevent="cancelRow(scope.$index, scope.row)" type="text" size="small">取消</el-button>
          </template>
        </v-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'OrderPropertyConfig',
  components: {},
  data: function() {
    return {
      searchKey: '',
      addRoleVisible: false,
      tableData: [
        { name1: '多种微量元素注射液', name2: '胶体' },
        { name1: '多种微量元素注射液', name2: '胶体' },
        { name1: '多种微量元素注射液', name2: '胶体' }
      ]
    }
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>

.orderPropertyConfig {
  background: #fff;
  height: 100%;
  padding-bottom: 15px;
  ::v-deep .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-input,
    .el-input--small,
    .el-input__inner {
      width: vw(360);
    }
  }
  ::v-deep .el-main {
    padding: 0 20px;
  }
}
</style>
