<!-- 护理记录模板 -->
<template>
  <div class="templateConfig">
    <div class="templateConfig_left" >
      <el-container style="height:100%">
        <el-header>
          <div>
            <i class="iconBlue"></i>
            <span>ICU病区</span>
          </div>
        </el-header>
        <icu-region  :defaultPermi="['configuration:basicSettings:tempCopyConfig']" style="height:calc(100% - 42px)" :defaultRegion="defaultRegion"
                    :module="'tempSetting'" @defaultRegionChange="defaultRegionChange" ref="icuRegion"></icu-region>
      </el-container>
    </div>
    <div class="templateConfig_right">
      <el-tabs class="tabPart" v-model="activeName" @tab-click="handleClick" :before-leave="tabClickBefore" >
        <el-tab-pane v-for="item in typeInfo.list" :label="item.dictName" :name="item.templateCategory" :key="item.templateCategory">
        </el-tab-pane>
      </el-tabs>
      <el-container>
        <el-main class="container" :key="tabContentKey">
          <div class="left" v-loading="loading">
            <el-input class="lineInput" size="small" clearable placeholder="模板名称" suffix-icon="el-icon-search" v-model="searchKey"
                      @input="inputSearch" @keyup.enter.native="search" style="margin-bottom:5px;"></el-input>

            <div class="flex flex-between align-items-center">
                <el-button class="flex1 m-l10" type="primary" @click="showDialog" v-hasPermi.sync="typeInfo.list[Number(activeName)-1].permission"><i style="color:#FFF" class="el-icon-plus"></i> 新增模板
                </el-button>

            </div>
            <ul class="header list">
              <li>
                <div class="sortNo">
                  序号
                </div>
                <div class="title">
                  <span>模板</span>
                </div>
                <span>
                  操作
                </span>
              </li>
            </ul>
            <!-- 模板列表 -->
            <ul class="list" v-loading="loading">
              <li v-for="(item, index) in list" :class="index==leftIndex?'active':''" :key="item.templateId" @click="changeTemp(index)">
                <div class="sortNo">
                  {{item.sortNo}}
                </div>
                <div class="title">
                  <span :title="item.templateName">{{item.templateName}}</span>
                </div>
                <span class="flex">
                  <el-button @click.stop="modifyRow(item)" v-hasPermi.sync="typeInfo.list[Number(activeName)-1].permission" type="text" size="small">修改</el-button>
                  <el-button class="redCss" @click.stop="deleteRow(item,index)" v-hasPermi.sync="typeInfo.list[Number(activeName)-1].permission" type="text" size="small">删除</el-button>
                </span>
              </li>
            </ul>
          </div>
          <div class='right'>
            <div class="flex flex-between">
              <el-button type="primary" @click="saveTemplateContent" v-hasPermi.sync="typeInfo.list[Number(activeName)-1].permission">保存</el-button>
            </div>
            <div id="editor">
              <el-input type="textarea" :rows="20" maxlength="1000" v-model="content" placeholder="请输入" style="height:650px;width:100%;" />
            </div>
          </div>
        </el-main>
      </el-container>
      <el-dialog :title="diaglogTitle" :visible.sync="dialogVisible" :before-close="handleClose" width="480px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form ref="form" :model="formInfo" :rules="formInfoRules" label-width="80px">
          <el-form-item label="序号" prop="sortNo">
            <el-input-number v-model="formInfo.sortNo" placeholder="请输入" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="formInfo.templateName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitData">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import {
  template_deleteTemplateById, // 删除模板
  template_editTemplate, // 修改Template
  template_getTemplateList, // 分页获取Template
  template_insertTemplate// 新增模板

} from '@/api/configuration'
import icuRegion from '../basicSettings/components/icuRegion.vue'
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
import {
  patientRecord_getPatientPropertyList
} from '@/api/patient'
export default {
  name: 'TemplateConfig',
  components: {
    icuRegion
  },
  data: function () {
    return {
      tabContentKey: '',
      searchKey: '',
      defaultRegion: '',
      loading: false,
      // 模板分类信息
      typeInfo: {
        code: 'ICIS_DICT_TEMP_TYPE',
        list: [{
          templateCategory: '1',
          dictName: '感染原因模板维护',
          permission: ['configuration:basicSettings:infectReasonConfig']
        }, {
          templateCategory: '2',
          dictName: '重要交班内容模板维护',
          permission: ['configuration:basicSettings:shiftContentConfig']
        }, {
          templateCategory: '3',
          dictName: '镇静镇痛原因模板维护',
          permission: ['configuration:basicSettings:calmReasonConfig']
        }, {
          templateCategory: '4',
          dictName: '镇静镇痛处理措施模板维护',
          permission: ['configuration:basicSettings:calmmMeasuresConfig']
        }, {
          templateCategory: '5',
          dictName: '透前评估模板维护',
          permission: ['configuration:basicSettings:evaluationPreConfig']
        }, {
          templateCategory: '6',
          dictName: '透后病情评估模板维护',
          permission: ['configuration:basicSettings:evaluationAfterConfig']
        }, {
          templateCategory: '7',
          dictName: '液体内容模板维护',
          permission: ['configuration:basicSettings:fluidContentConfig']
        }, {
          templateCategory: '8',
          dictName: '重要内容补录模板维护',
          permission: ['configuration:basicSettings:importentContentConfig']
        }]
      },
      addOrModify: '',
      activeName: '1',
      tabName: '',
      // 页面布局
      pagePartsList: [
        {
          width: 4,
          name: 'name1'
        },
        {
          width: 20,
          name: 'name2'
        }
      ],
      // 模板列表
      list: [
      ],
      currWard: '', // 当前病区
      leftIndex: 0, // 左侧模板列表下标
      dialogVisible: false,
      diaglogTitle: '',
      // 弹框显示信息对象
      formInfo: {
        templateName: '',
        sortNo: 1
      },
      // 当前模板数据
      currentObj: {},
      content: '',
      formInfoRules: {
        templateName: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('请输入30字以内的模板名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      pageNum: 1,
      drawerVisible: false,
      fields: {}

    }
  },
  props: {},
  watch: {},
  computed: {
    ...mapGetters(['userWardList', 'currentUserWard', 'userInfo'])
  },
  created() {
    this.defaultRegion = this.currentUserWard.wardCode
    this.getTempList(1)
    this.inputSearch = debounce(() => {
      this.search()
    }, 500)
  },
  mounted() {

  },
  methods: {

    /**
     * 左侧区域切换病区
     */
    defaultRegionChange(e) {
      this.defaultRegion = e
      this.getTempList()
    },
    // 验证tab是否需要切换
    tabClickBefore(activeName, oldActiveName) {
      this.searchKey = ''
      this.activeName = activeName
      this.leftIndex = 0
      this.getTempList()
    },
    /**
    模板的模糊搜索 */
    search() {
      this.getTempList()
    },
    // 获取模板列表
    getTempList(pageNum) {
      this.loading = true
      const query = {
        pageNum: 1,
        pageSize: 1000,
        searchKey: this.searchKey,
        templateTypeDict: '2',
        templateTypeValue: this.defaultRegion,
        templateCategory: this.typeInfo.list[Number(this.activeName) - 1].templateCategory
      }
      template_getTemplateList(query).then(res => {
        this.list = res.data.result

        this.formInfo = { ...this.list[this.leftIndex] }
        this.currentObj = { ...this.formInfo }
        this.content = this.list[this.leftIndex]?.templateContent || ''
        this.loading = false
      })
    },

    // 切换左侧下标
    changeTemp(index) {
      this.leftIndex = index
      this.content = this.list[this.leftIndex].templateContent || ''
      this.currentObj = this.list[this.leftIndex]
    },
    // 切换tab标签
    handleClick(e) {
      this.tabContentKey = new Date().getTime()
    },
    // 新增模板
    showDialog() {
      this.addOrModify = 'add'
      this.diaglogTitle = '新增模板'
      this.dialogVisible = true
      const list = [...new Set(this.list.filter(item => item.sortNo).map(item => item.sortNo))]
      var maxSortNo = Math.max(...list)
      this.formInfo = {
        templateName: '',
        sortNo: maxSortNo ? maxSortNo + 1 : 1
      }
    },
    // 修改摸板信息
    modifyRow(obj) {
      this.addOrModify = 'modify'
      this.diaglogTitle = '修改模板'
      this.dialogVisible = true

      this.formInfo = { ...obj }
      if (!this.formInfo.sortNo) {
        const list = [...new Set(this.list.filter(item => item.sortNo).map(item => item.sortNo))]
        var maxSortNo = Math.max(...list)
        this.formInfo.sortNo = maxSortNo + 1 || 1
      }
    },
    // 删除模板数据
    deleteRow(obj, index) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const query = {
          templateId: obj.templateId
        }
        template_deleteTemplateById(query).then(res => {
          if (this.leftIndex == index) this.leftIndex = index == 0 ? 0 : index - 1
          this.getTempList(1)
          this.$message.success('删除成功！')
        })
      })
    },
    saveTemplateContent() {
      const query = { ... this.currentObj }
      query.templateRichContent = this.content
      query.templateContent = this.content
      query.templateCategory = this.typeInfo.list[Number(this.activeName) - 1].templateCategory

      template_editTemplate(query).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        this.getTempList()
      })
    },
    // 隐藏弹框
    handleClose() {
      this.dialogVisible = false
      this.$refs['form'].resetFields()
      this.formInfo = {
        templateName: '',
        sortNo: 1
      }
    },
    // 保存当前模板信息
    submitData() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        const query = {
          templateName: this.formInfo.templateName,
          sortNo: this.formInfo.sortNo,
          templateTypeDict: '2',
          templateTypeValue: this.defaultRegion,
          templateCategory: this.typeInfo.list[Number(this.activeName) - 1].templateCategory
        }
        const apiPlus = this.addOrModify == 'modify' ? template_editTemplate : template_insertTemplate
        if (this.addOrModify == 'modify') {
          query['templateId'] = this.formInfo.templateId
        }
        apiPlus(query).then(res => {
          this.handleClose()
          this.getTempList()
        })
      })
    },
    // 字段数据格式化
    dictFormat(code, arr) {
      const result = arr.filter(item => item.dictCode == code)
      if (result.length > 0) {
        return result[0].dictName
      } else return ''
    },
    /**
     * 显示抽屉
     */
    async showDrawer() {
      const result = await patientRecord_getPatientPropertyList()
      this.fields.recipel = result.data
      this.fields.recipel.push({ // 添加自定义 字段
        label: '自定义',
        value: 'custom'
      })
      console.log('this.fields', this.fields)
      this.drawerVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
@import '~styles/config-common.scss';

.templateConfig {
  display: flex;
  width: 100%;
  background: #fff;
  height: 100%;

  &_left {
    width: 300px;
    padding: 12px;
    border-right: 2px solid rgba(203, 215, 238, 0.3);
    height: 100%;
  }
  &_right {
    // flex: 1;
    width: calc(100% - 300px);
    display: block;
    overflow-x:hidden ;
    background: #fff;
    height: 100%;
    padding: 0 20px;
    overflow-y: hidden;
    ::v-deep .el-row {
      display: flex;
      flex-wrap: wrap;
    }
    ::v-deep .el-main {
      padding: 0px;
      height: 100%;
    }
    .tabPart{
      width: 100%;
    }
    #editor {
      display: flex;
      .el-textarea__inner {
        height: 650px;
        overflow-y: auto;
        /* overflow-y: auto;兼容ie  */
      }
    }
    .el-container {
      height: calc(100% - 50px);
    }
    .container {
      display: flex;
      height: 100%;
    }
    .left {
      width: 240px;
      height: 100%;
      margin-right: 10px;
      ::v-deep .el-input > .el-input__inner {
        width: 240px;
      }
      ::v-deep .el-select {
        margin-bottom: 5px;
      }
      ::v-deep .el-select > .el-input > .el-input__inner {
        width: 238px;
        min-width: 140px;
      }
    }
    .right {
      width: calc(100% - 240px);
      height: 100%;
      overflow: hidden;
      .queryButton {
        float: right;
      }
      #editor {
        height: calc(100% - 20px);
        overflow-y: auto;
      }
      ::v-deep .el-button {
        margin-bottom: 5px;
      }
    }
    .content {
      ::v-deep .el-textarea__inner {
        background: transparent;
        border: none;
        height: calc(100vh - 270px);
      }
    }

    .list {
      list-style: none;
      height: calc(100% - 120px);
      overflow-y: auto;
      li {
        font-size: 14px;
        line-height: 30px;
        background: rgb(243, 245, 249);
        padding: 5px 10px;
        margin-top: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title {
          display: flex;
          flex-direction: column;
          span {
            width: 115px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:nth-of-type(2) {
              color: #999;
              font-size: 12px;
            }
          }
        }
        .sortNo{
          width: 40px;
        }
        .text {
          width: 100px;
          color: var(--maincolor);
          font-size: 12px;
          text-align: right;
        }
        .redCss {
          color: #f52c2c;
        }
      }
      .active {
        background: rgb(207, 225, 255);
      }
    }
    .header{
      height: 40px;
      overflow: hidden;
      li{
        color:#999;
      }
    }
  }
}
</style>
