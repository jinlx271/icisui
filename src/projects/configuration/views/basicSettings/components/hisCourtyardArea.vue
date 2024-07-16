<!-- HIS基础数据-院区 -->
<template>
  <div class="hisCourtyardArea">
    <el-container class='courtyardArea' element-loading-text="加载中" v-loading="loading">
      <el-container class="courtyardArea_right">
        <el-header class="courtyardArea_right_head">
          <div></div>
          <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']" class="queryButton" size="small"
            type="primary" @click="showDialog">添加院区</el-button>
        </el-header>
        <el-main style="height:calc(100% - 42px)" class="courtyardArea_right_body">
          <el-table :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''"
            @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
            ref="table" height="100%" :data="tableData" fit border highlight-current-row style="width: 100%;">
            <v-table-column prop="areaCode" label="院区编码"></v-table-column>
            <v-table-column prop="areaName" label="院区名称"></v-table-column>
            <v-table-column prop="statusDict" label="状态" align="center">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0"
                  active-text="已启用" inactive-text="已禁用"></el-switch>
                <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="220px" align="center">
              <template slot-scope="scope">
                <el-button v-hasPermi="['configuration:basicSettings:basedateConfig']"
                  @click.native.prevent="modifyRow(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </el-container>
      <!-- 添加/编辑院区 -->
      <el-dialog :title="titleDialog" :visible.sync="idDialog" :before-close="closeDialog" width="420px"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="formDialog" label-width="80px" :rules="rules">
          <el-form-item label="名称" prop="areaName">
            <el-input v-model="formDialog.areaName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="areaCode">
            <el-input v-model="formDialog.areaCode" placeholder="请输入" :disabled="markDialog == 'modify'"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formDialog.statusDict">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveData">保存</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  area_insert, // 增
  area_edit, // 改
  area_findAll // 查
} from '@/api/configuration'
export default {
  name: 'CourtyardArea',
  components: {},
  data: function () {
    return {
      // 表格的loding
      loading: false,
      // 表格数据
      tableData: [],
      // 弹窗标题
      titleDialog: '',
      // 是否显示弹窗
      idDialog: false,
      // 院区属性
      formDialog: {
        areaName: '',
        areaCode: '',
        statusDict: '0'
      },
      // 弹窗标记
      markDialog: 'add',
      // 院区校验规则
      rules: {
        areaName: [
          { required: true, message: '请输入院区名称', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请输入院区编码', trigger: 'blur' }
        ]
      }
    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['currentUserWard'])
  },
  created() {
    this.init()
  },
  mounted() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.getData()
    },
    /**
     * 获取数据
     */
    getData() {
      this.loading = true
      area_findAll({}).then(res => {
        this.loading = false
        if (!(res.data)) {
          return
        }
        this.tableData = res.data // 列表数据
      })
    },
    /**
     * 显示添加院区弹窗
     */
    showDialog() {
      this.titleDialog = '添加院区'
      this.markDialog = 'add'
      this.idDialog = true
    },
    /**
     * 修改弹框
     */
    modifyRow(row) {
      this.titleDialog = '修改院区'
      this.markDialog = 'modify'
      this.formDialog = { ...row }
      this.idDialog = true
    },
    /**
     * 关闭添加院区弹窗
     */
    closeDialog() {
      this.idDialog = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.formDialog = {
        areaName: '',
        areaCode: '',
        statusDict: '0'
      }
    },
    /**
     * 添加/修改院区
     */
    saveData() {
      this.formDialog.wardCode = this.currentUserWard.wardCode // 病区code
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = area_edit
          if (this.markDialog == 'modify') {
            // 编辑
            url = area_edit
          } else {
            // 添加
            url = area_insert
          }
          url(this.formDialog).then(res => {
            this.closeDialog()
            this.getData()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.hisCourtyardArea {
  background: #ffffff;
  height: 100%;
  display: block;
}

.courtyardArea {
  height: 100%;

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

  &_right {
    height: 100%;
  }
}
</style>
