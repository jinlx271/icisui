<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             width="720px"
             top="20px">
    <el-form :rules="rules"
             ref="dataForm"
             :model="dataModel"
             label-position="right"
             label-width="140px"
             style='width: 580px; margin-left:50px;'>
      <el-form-item label="表设置名称"
                    prop="formName">
        <el-input v-model="dataModel.formName"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属病区" prop="wardCode">
        <el-select clearable
                   v-model="dataModel.wardCode"
                   placeholder="请选择"
                   style="width:100%">
          <el-option v-for="i in formWardList"
                     :key="i.wardCode"
                     :label="i.wardName"
                     :value="i.wardCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据获取方式" prop="formtypeGroup">
        <el-select clearable
                   v-model="dataModel.formtypeGroup"
                   placeholder="请选择"
                   style="width:100%">
          <el-option v-for="item in formtypeGroupList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单描述">
        <el-input v-model="dataModel.formDesc"
                  placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button v-if="dialogStatus=='create'"
                 type="primary"
                 @click="createData">保存</el-button>
      <el-button v-else
                 type="primary"
                 @click="updateData">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
 import { insertFormName, updateFormName, getIcuWardList } from '@/api/formName.js'

export default {
  props: {
    onCallback: {
      type: Function,
      default: undefined
    },
    tableList: {
      type: Array,
      default: function() {
        return []
    }
    }
  },
  created() {
     this.getIcuWardList()
  },
  data() {
    return {
      textMap: {
        update: '修改表格设置',
        create: '新增表格设置'
      },
      formtypeGroupList: [
         { id: '1', name: '存储过程' },
         { id: '2', name: 'SQL语句' }
      ],
      formWardList: [], // 病区
      dialogFormVisible: false,
      dialogStatus: 'create',
      tableT: undefined,
      dataModel: {
      },
      rules: {
        formName: [
          { required: true, message: '表设置名称不能为空！', trigger: 'blur' }
        ],
        formtypeGroup: [
          { required: true, message: '表设置类型不能为空！', trigger: 'blur' }
        ],
        wardCode: [
          { required: true, message: '病区不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getIcuWardList() {
      getIcuWardList({}).then((res) => {
        if (res.code === 0) {
          this.formWardList = res.data.result
        } else {
          this.$message.error('获取病区失败')
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateFormName(this.dataModel).then(() => {
            this.dialogFormVisible = false
            this.onCallback()
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          insertFormName(this.dataModel).then(response => {
            this.dialogFormVisible = false
            this.onCallback(response.data)
          })
        }
      })
    },
    show(dialogStatus, data) {
        this.dialogFormVisible = true
        this.dialogStatus = dialogStatus || 'create'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        if (data.id) {
           this.dataModel = { ...data }
        } else {
          this.dataModel = {}
        }
    },
    hide() {
      this.dialogFormVisible = false
    }
  }
}
</script>
