<template>
  <div class="savaAsTemp">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-form-item label="序号" prop="sortNo">
        <el-input-number v-model="form.sortNo" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="模板名称" prop="tempName">
        <el-input v-model="form.tempName" placeholder="请输入" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="页数" prop="tempPageNum" width="80px">
        <el-input-number v-model="form.tempPageNum" placeholder="请输入" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="多页模式" prop="multiPageMode" width="80px">
        <el-select v-model="form.multiPageMode" placeholder="请选择" clearable>
          <el-option label="正反面" :value="0"></el-option>
          <el-option label="非正反面" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用查询模式" prop="suitPatternTemp" v-if="form.tempType == '1'">
        <el-cascader :options="printModeList" :props="{ multiple: true }" clearable v-model="form.suitPatternTemp"
          @change="selectModeList($event, form, true)"></el-cascader>
      </el-form-item>
      <el-form-item label="默认查询模式" prop="defaultPatternTemp" v-if="form.tempType == '1'">
        <el-cascader :options="form.selectedModeListTemp" v-model="form.defaultPatternTemp" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="归档模式" prop="archiveMode" v-if="form.tempType == '1'">
        <el-select v-model="form.archiveMode" clearable>
          <el-option v-for="item in form.archiveModeList" :key="item.dictCode" :label="item.dictName"
            :value="item.dictCode" :disabled="item.statusDict == '0' || !item.canSelect"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归档数据可控制范围" prop="archiveScopeTemp" v-if="form.tempType == '1'">
        <el-select v-model="form.archiveScopeTemp" clearable multiple>
          <el-option v-for="item in ICIS_DICT_ARCHIVE_SCOPE" :key="item.dictCode" :label="item.dictName"
            :value="item.dictCode" :disabled="item.statusDict == '0'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入区当天数据规则" prop="inAreaTimeRule">
        <el-select v-model="form.inAreaTimeRule" placeholder="请选择" clearable>
          <el-option v-for="item in inAreaTimeRule" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
            :disabled="item.statusDict == '0'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出区当天数据规则" prop="leaveTimeRule">
        <el-select v-model="form.leaveTimeRule" placeholder="请选择" clearable>
          <el-option v-for="item in leaveTimeRule" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
            :disabled="item.statusDict == '0'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签名方式" prop="signatureWayTemp" v-if="form.tempType == '1'">
        <el-select v-model="form.signatureWayTemp" clearable multiple>
          <el-option v-for="item in form.signatureList" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"
            :disabled="item.statusDict == '0' || !item.canSelect"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面加载模式" prop="pageLoadMode">
        <el-select v-model="form.pageLoadMode" clearable>
          <el-option label="普通" value="1"></el-option>
          <el-option label="分批次" value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import {
  insertTmpDocConfig,
  getNextSortNo
} from '@/api/anas'
import _ from 'lodash'
export default {
  props: {
    tempData: {
      type: Object,
      default: () => { }
    },
    tempList: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      pageSize: 10,
      totalCount: 0,
      // 列表数据
      listData: [],
      // 重症记录单保存数据 名称 类型
      form: {
        beid: 209,
        tempType: '1',
        tempName: '',
        tempPageNum: 1,
        suitPattern: [],
        defaultPattern: [],
        archiveMode: '',
        archiveScope: '',
        archiveScopeTemp: [],
        signatureWayTemp: [],
        multiPageMode: null,
        pageLoadMode: '1',
        leaveTimeRule: '',
        inAreaTimeRule: ''
      },
      selectedModeList: [],
      printModeList: [
        {
          label: '在区期间', value: '1',
          children: [
            {
              value: '1',
              label: '不分组'
            },
            {
              value: '2',
              label: '按自然日'
            },
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        },
        {
          label: '按班次', value: '3',
          children: [
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        },
        {
          label: '时间段', value: '4',
          children: [
            {
              value: '1',
              label: '不分组'
            },
            {
              value: '2',
              label: '按自然日'
            },
            {
              value: '3',
              label: '按全班次'
            }, {
              value: '4',
              label: '按每个班次' // 968459 特护单根据每个班次分页显示
            }
          ]
        }

      ],
      rules: {
        tempName: [
          { required: true, message: '模板名称', trigger: 'blur' },
          {
            message: '名称已存在', trigger: 'blur',
            validator: (rule, value, callback) => {
              this.validatorName(value, callback)
            }
          }
        ],
        tempPageNum: [
          { required: true, message: '模板页数', trigger: 'blur' }
        ]
      },
      ICIS_DICT_ARCHIVE_SCOPE: [],
      ICIS_DICT_ARCHIVE_MODE: [],
      ICIS_DICT_SIGNATURE_WAY: [], // 签名方式
      tempTypeName: '护理文书模板', // 护理文书模板:1|内置单据打印模板:2|患者评估打印模板:3
      currsuitPattern: [], // 当前查询模式
      leaveTimeRule: [
        { dictCode: '1', dictName: '截止出区时间点' },
        { dictCode: '2', dictName: '截止至全班结束时间点' }
      ],
      inAreaTimeRule: [
        { dictCode: '1', dictName: '入区时间点' },
        { dictCode: '2', dictName: '全班次开始时间点' }
      ],
      ICIS_DICT_LOAD_MODE: [
        { dictCode: '1', dictName: '普通' },
        { dictCode: '10', dictName: '10页/批次' },
        { dictCode: '20', dictName: '20页/批次' },
        { dictCode: '30', dictName: '30页/批次' },
        { dictCode: '40', dictName: '40页/批次' },
        { dictCode: '50', dictName: '50页/批次' },
        { dictCode: '60', dictName: '60页/批次' },
        { dictCode: '70', dictName: '70页/批次' }
      ]
    }
  },
  async created() {
    const { ICIS_DICT_ARCHIVE_SCOPE, ICIS_DICT_ARCHIVE_MODE, ICIS_DICT_SIGNATURE_WAY } = await this.$batchGetDictItemList(['ICIS_DICT_ARCHIVE_SCOPE', 'ICIS_DICT_ARCHIVE_MODE', 'ICIS_DICT_SIGNATURE_WAY'])
    this.ICIS_DICT_ARCHIVE_SCOPE = ICIS_DICT_ARCHIVE_SCOPE
    this.ICIS_DICT_ARCHIVE_MODE = ICIS_DICT_ARCHIVE_MODE
    this.ICIS_DICT_SIGNATURE_WAY = ICIS_DICT_SIGNATURE_WAY
    const item = this.formarDataStrut(this.tempData)
    console.log('item', item)
    this.form = { ...item }
    this.form.tempName += '_复制'
    this.form.sortNo = await this.getMaxSortNo()
  },
  mounted() {

  },
  methods: {
    /**
     * 格式化数据结构
     */
    formarDataStrut(data) {
      const item = data
      console.log('data', data)
      item.suitPatternTemp = !Array.isArray(item.suitPattern) ? JSON.parse(item.suitPattern || '[]') : item.suitPattern
      item.defaultPatternTemp = !Array.isArray(item.defaultPattern) ? JSON.parse(item.defaultPattern || '[]') : item.defaultPattern
      item.archiveModeList = JSON.parse(JSON.stringify(this.ICIS_DICT_ARCHIVE_MODE))
      item.signatureWayTemp = !Array.isArray(item.signatureWay) ? JSON.parse(item.signatureWay || '[]') : item.signatureWay
      item.archiveModeList.map(v => {
        if (v.dictCode == '0') v.canSelect = true
        else v.canSelect = false
      })
      // 签名方式列表
      item.signatureList = JSON.parse(JSON.stringify(this.ICIS_DICT_SIGNATURE_WAY))
      item.signatureList.map(v => {
        v.canSelect = false
      })
      item.selectedModeListTemp = this.cascaderDataToObject(item.suitPatternTemp)
      item.archiveScopeTemp = !Array.isArray(item.archiveScope) ? JSON.parse(item.archiveScope || '[]') : _.cloneDeep(item.archiveScope)
      this.selectModeList(item.suitPatternTemp, item)
      console.log('item', item)
      return item
    },
    /**
     * 获取模板排序号
     */
    getMaxSortNo() {
      return new Promise((resolve, reject) => {
        getNextSortNo({
          'type': 'templet',
          'tempType': this.tempData.tempType
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    /**
    * 选择适用模式 使用模式关联项目
     */
    selectModeList(e, row, forcerefresh) {
      if (e.length > 0) {
        if (forcerefresh) {
          row.selectedModeListTemp = []
          row.defaultPatternTemp = []
          row.selectedModeListTemp = this.cascaderDataToObject(e)
          row.archiveMode = ''
          row.signatureWay = ''
          row.signatureWayTemp = []
        }

        // 当”适用查询模式“选择了“在区期间|不分组” 时，"归档模式“可选“出区归档”
        // 当“适用查询模式”选择了“在区期间|按全班次”或“按班次|按全班次”或“按时间段|按全班次”时，“归档模式“可选”按全班次归档”。
        // 2022 0906 修改 在区期间/班次 可以按照 出区归档
        const patientNode = e.map(v => { return v[0] })
        const childrenNode = e.map(v => { return v[1] })

        row.archiveModeList.map(item => {
          if (item.dictCode == '1') item.canSelect = (patientNode.includes('1') && childrenNode.includes('1') || patientNode.includes('1') && childrenNode.includes('3'))
          if (item.dictCode == '2') item.canSelect = childrenNode.includes('3')
          if (item.dictCode == '0') item.canSelect = true
        })

        // 可选规则：当适用查询模式包含”在区期间“时，可选 整单签名/整单复核签名，否则此两项不可选；
        //           当适用查询模式包含”按班次“时，可选 各班次签名/全班次签名/各班次复核签名/全班次复核签名，否则此四项不可选。
        row.signatureList.map(item => {
          if (item.dictCode == '0003' || item.dictCode == '1003') item.canSelect = patientNode.includes('1')
          else item.canSelect = patientNode.includes('3')
        })
      } else {
        row.selectedModeListTemp = []
        row.defaultPatternTemp = []
        row.archiveMode = ''
        row.signatureWay = ''
        row.signatureWayTemp = []
        row.archiveModeList.map(item => {
          if (item.dictCode == '0') item.canSelect = true
          else item.canSelect = false
        })
        row.signatureList.map(item => {
          item.canSelect = false
        })
      }
    },
    /**
     * 将级联数据转为数字对象 方便默认数据
     */
    cascaderDataToObject(arr) {
      const returArr = []
      const parentValues = [...new Set(arr?.map(v => {
        if (Array.isArray(v)) {
          return v[0]
        } else return []
      }))] // 父级选择项目列表

      const list = _.keyBy(parentValues?.map(item => { // 将选择项转化为Object
        return {
          value: item,
          children: arr?.filter(v => v[0] == item)?.map(v => { return v[1] })
        }
      }), 'value')
      const printModeListTemp = _.cloneDeep(this.printModeList)
      printModeListTemp?.forEach(item => {
        const children = []
        if (parentValues.includes(item.value)) {
          // 选中code children
          item.children.forEach(c => {
            if (list[item.value].children.includes(c.value)) {
              children.push(c)
            }
          })
          returArr.push({
            label: item.label,
            value: item.value,
            children: children
          })
        }
      })
      return returArr
    },
    /**
     * 将级联的数组类型转为对应的字符串
     */
    cascaderDataToString(arr, type) {
      const resultArr = []
      let resultString = ''
      let object = {}
      if (!arr) return ''
      object = this.cascaderDataToObject(arr)
      if (type && type == 'multiple') {
        object = this.cascaderDataToObject(arr)
      } else {
        const temp = []
        temp.push(arr)
        object = this.cascaderDataToObject(temp)
      }

      object?.forEach(item => {
        item.children.forEach(c => {
          resultArr.push(item.label + '/' + c.label)
        })
      })
      if (resultArr.length > 0) resultString = resultArr.toString()
      return resultString
    },
    /**
    选择默认模式
     */
    selectDefaultMode(e) {
      if (e) {
        this.form.defaultPattern = e
      }
    },
    dialogClose() {
      const form = {
        beid: 209,
        tempType: '1',
        tempName: '',
        tempPageNum: 1,
        suitPattern: [],
        defaultPattern: []
      }
      this.form = { ...form }
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.$emit('dialogClose')
    },
    saveRecord() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const query = { ...this.form }
          query.suitPattern = this.form.suitPatternTemp ? JSON.stringify(this.form.suitPatternTemp) : null
          query.defaultPattern = this.form.defaultPatternTemp ? JSON.stringify(this.form.defaultPatternTemp) : null
          query.archiveScope = this.form.archiveScope ? JSON.stringify(this.form.archiveScope) : null // 多选
          query.signatureWay = this.form.signatureWayTemp ? JSON.stringify(this.form.signatureWayTemp) : null
          const componentList = JSON.parse(this.form.tempContent || '{}')
          const formProSqlIdList = []
          for (var pageNum in componentList) {
            if (componentList[pageNum].components) {
              componentList[pageNum].components.forEach(item => {
                formProSqlIdList.push(item.attr.formProSqlId)
              })
            }
          }
          if (formProSqlIdList.length > 0) {
            query.formProSqlIds = [... new Set(formProSqlIdList)]
          }
          insertTmpDocConfig(query).then(res => {
            this.$message({
              type: res.msg == '操作成功' ? 'success' : 'warning',
              message: res.msg == '操作成功' ? '复制成功' : res.msg
            })
            this.dialogClose()
            this.$emit('saveasTemp')
          })
        }
      })
    },
    validatorName(value, callback) {
      const filterRe = this.tempList.filter(item => item.tempName == value)
      if (filterRe.length > 0) {
        callback(new Error())
      }
      callback()
    }

  }
}
</script>
<style lang="scss" scoped>
.savaAsTemp {
  width: 480px;
  height: 360px;
  overflow-y: auto;
}
</style>
