<!-- 基础参数 -->
<template>
  <div class="paramConfigShiftHandoverScreen">
    <div class="flex flex-between">
      <el-form-item label="参数值" prop="encryptionInfo">
        <div class="paramConfigShiftHandoverScreenContent">
          <el-form ref="form" :model="encryptionInfo" label-width="10em" align="left">
            <el-tabs type="border-card" v-model="activeName" style="margin-bottom: 20px">
              <el-tab-pane label="交班大屏配置" v-for="(configItem, configIndex) in encryptionInfo.configList"
                :key="configIndex" :name="configItem.mode">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="标题颜色" prop="titleColor" class="line30" label-width="8em">
                      <el-color-picker v-model="configItem.titleColor"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="标题字体大小" :prop="`configList[${configIndex}].titleFontSize`"
                      :rules="{ required: true, message: '请输入字体大小' }" label-width="11em">
                      <el-input v-model="configItem.titleFontSize" type="number" placeholder="请输入" :min="12" :max="99"
                        :maxlength="2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="预警提醒颜色" prop="key" label-width="8em">
                      <el-color-picker v-model="configItem.warningColor"></el-color-picker>
                    </el-form-item></el-col>
                  <el-col :span="12">
                    <el-form-item label="预警提醒字体大小" :prop="`configList[${configIndex}].warningFontSize`"
                      :rules="{ required: true, message: '请输入字体大小' }" label-width="11em">
                      <el-input v-model="configItem.warningFontSize" type="number" placeholder="请输入"
                        :maxlength="200"></el-input>
                    </el-form-item></el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="危急值提醒颜色" prop="key" label-width="8em">
                      <el-color-picker v-model="configItem.criticalColor"></el-color-picker>
                    </el-form-item></el-col>
                  <el-col :span="12">
                    <el-form-item label="危急值提醒字体大小" :prop="`configList[${configIndex}].criticalFontSize`"
                      :rules="{ required: true, message: '请输入字体大小' }" label-width="11em">
                      <el-input v-model="configItem.criticalFontSize" type="number" placeholder="请输入"
                        :maxlength="200"></el-input>
                    </el-form-item></el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-row class="m-t10">
              <el-col :span="24">
                <el-form-item label="公告栏" prop="enable" class="line30" label-width="4em">
                  <el-switch v-model="encryptionInfo.notice.enable" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公告字体颜色" prop="key" label-width="7em">
                  <el-color-picker v-model="encryptionInfo.notice.color"></el-color-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公告字体大小" prop="notice.fontSize" :rules="{ required: true, message: '请输入字体大小' }">
                  <el-input v-model="encryptionInfo.notice.fontSize" type="number" placeholder="请输入"
                    :maxlength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="当前发布内容" prop="enable" class="line30" label-width="7em">
                  <div class="flex flex-end m-b10">
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                  </div>
                  <el-table
                    @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
                    ref="tableData" :data="encryptionInfo.notice.contentList" height="300px" highlight-current-row fit
                    border>
                    <v-table-column label="区域" align="center" width="150px">
                      <template slot-scope="scope">
                        <template v-if="scope.row.isEdit">
                          <el-select clearable v-model="scope.row.modeCode" placeholder="请选择" style="width:100%">
                            <el-option v-for="(modeItem, modeIndex) in encryptionInfo.configList"
                              :key="`notice-${modeIndex}`" :value="modeItem.mode" :label="modeItem.name"></el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          {{ scope.row.modeName }}
                        </template>
                      </template>
                    </v-table-column>
                    <v-table-column label="发布内容" align="center" min-width="150px">
                      <template slot-scope="scope">
                        <template v-if="scope.row.isEdit">
                          <el-input type="textarea" v-model="scope.row.content" :rows="3" show-word-limit></el-input>
                        </template>
                        <span v-else>{{ scope.row.content }}</span>
                      </template>
                    </v-table-column>
                    <v-table-column label="发布时间" align="center" width="130px">
                      <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                      </template>
                    </v-table-column>
                    <v-table-column label="操作" align="center" width="120px">
                      <template slot-scope="scope">
                        <template v-if="scope.row.isEdit">
                          <el-button type="text" @click="handleCancel(scope.row, scope.$index)">取消</el-button>
                          <el-button type="text" @click="handleSave(scope.row, scope.$index)">保存</el-button>
                        </template>
                        <template v-else>
                          <el-button type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                          <el-button type="text" style="color: red;"
                            @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                        </template>
                      </template>
                    </v-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ParamConfigShiftHandoverScreen',
  data: function () {
    return {
      activeName: '1',
      // 隐私信息加密
      encryptionInfo: {
        configList: [
          {
            mode: '1',
            name: '交班大屏配置',
            titleColor: '#0b8be5',
            titleFontSize: '56',
            warningColor: '#FFA524',
            warningFontSize: '20',
            criticalColor: '#FF6565',
            criticalFontSize: '20'
          }
        ],
        notice: {
          enable: '0',
          color: '#FFF',
          fontSize: '40',
          contentList: []
        }
      },
      originContentList: [],
      initPageConfig: {
        mode: '1',
        name: '交班大屏配置',
        titleColor: '#0b8be5',
        titleFontSize: '56',
        warningColor: '#FFA524',
        warningFontSize: '20',
        criticalColor: '#FF6565',
        criticalFontSize: '20'
      }
    }
  },
  props: {
    paramValue: {}
  },
  watch: {
    string: {
      handler: function (n) {
        try {
          this.encryptionInfo = JSON.parse(JSON.parse(n))
          const { notice } = this.encryptionInfo
          this.originContentList = [...notice.contentList]
        } catch (error) {
          //
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    string() {
      return JSON.stringify(this.paramValue) || '{}'
    }
  },
  created: async function () {
    console.log('userInfo', this.userInfo)
  },
  destroyed() {
  },
  mounted() { },
  methods: {
    handleAdd() {
      if (this.encryptionInfo.notice.contentList.filter(item => item.isEdit).length) {
        this.$message.error('请保存正在编辑的公告')
        return
      }
      const editObj = this.encryptionInfo.notice.contentList.find(item => item.isEdit)
      !editObj && this.encryptionInfo.notice.contentList.unshift({ isEdit: true, isCreate: true, modeCode: '', modeName: '', content: '', createTime: '', operatorName: this.userInfo.name, operatorCode: this.userInfo.userName })
    },
    handleCancel(row, index) {
      if (row.isCreate) {
        this.encryptionInfo.notice.contentList.shift()
      } else {
        this.encryptionInfo.notice.contentList[index] = { ...this.originContentList[index] }
        this.encryptionInfo.notice.contentList = [...this.encryptionInfo.notice.contentList]
        this.encryptionInfo.notice.contentList[index].isEdit = false
      }
      this.originContentList = [...this.encryptionInfo.notice.contentList]
    },
    handleEdit(row, index) {
      if (this.encryptionInfo.notice.contentList.filter(item => item.isEdit).length) {
        this.$message.error('请保存正在编辑的公告')
        return
      }
      this.$set(
        this.encryptionInfo.notice.contentList,
        index,
        Object.assign(row, {
          isEdit: true
        })
      )
      this.encryptionInfo.notice.contentList = JSON.parse(JSON.stringify(this.encryptionInfo.notice.contentList))
    },
    handleSave(row, index) {
      if (!row.modeCode) {
        this.$message.error('请选择公告区域')
        return
      }
      if (!row.content) {
        this.$message.error('请输入公告内容')
        return
      }
      const selectConfigObj = this.encryptionInfo.configList.find(item => item.mode == row.modeCode)
      selectConfigObj && (row.modeName = selectConfigObj.name)
      row.createTime = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.encryptionInfo.notice.contentList[index] = { ...row }
      const contentList = this.encryptionInfo.notice.contentList.map(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'isCreate', false)
        return item
      }).sort((a, b) => this.$dayjs(b.createTime).valueOf() - this.$dayjs(a.createTime).valueOf())
      this.encryptionInfo.notice.contentList = [...contentList]
      this.originContentList = [...contentList]
    },
    handleDelete(row, index) {
      this.encryptionInfo.notice.contentList.splice(index, 1)
      this.originContentList.splice(index, 1)
    },
    /**
     * 数据变更 保存数据F
     */
    change() {
      return new Promise((resolve, reject) => {
        if (this.encryptionInfo.notice.contentList.filter(item => item.isEdit).length) {
          this.$message.error('请保存正在编辑的公告')
          return
        }
        this.$refs?.crontab?.submitFill()
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('update:paramValue', JSON.stringify(this.encryptionInfo))
            resolve()
          } else reject()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.paramConfigShiftHandoverScreen {
  height: fit-content;
  margin-bottom: 20px;

}

.paramConfigShiftHandoverScreenContent {
  // background:var(--maincolor4);
  max-height: 300px;
  height: fit-content;
  overflow-y: auto;

  ::v-deep .el-input>.el-input__inner {

    border: 1px solid #ddd;
    background: #fff;
  }

  .line30 {
    .el-form-item--small .el-form-item__content {
      line-height: 30px;
      ;
    }
  }

  .shortInput {
    .el-button {
      width: 130px;
    }

    .linkStatus {
      width: 130px;
    }

    .m-l10 {
      margin-left: 10px;
    }

    ::v-deep .el-input {
      flex: 1;
    }
  }
}

.popup-result {
  box-sizing: border-box;
  line-height: 24px;
  margin: 25px auto;
  padding: 15px 10px 10px;
  border: 1px solid #ccc;
  position: relative;
}

.popup-result .title {
  position: absolute;
  top: -28px;
  left: 50%;
  width: 140px;
  font-size: 14px;
  margin-left: -70px;
  text-align: center;
  line-height: 30px;
  background: #f3f5f9;
}

.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}

.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.popup-result-scroll {
  font-size: 12px;
  line-height: 24px;
  height: 10em;
  overflow-y: auto;
}</style>
