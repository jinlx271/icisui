<template>
  <div  :class="element.attr.tdBreakLine==1?'breakLine':'tinymceEdit'" v-html="element.htmlStr"></div>
</template>
<script>
import {
    moniitemRecord_getMoniitemRecord,
    moniitemRecord_findMoniItemRecordByTime,
    moniitemRecord_getById,
    dictItem_findAllWithPage
} from '@/api/configuration'
import {
  supplementDrug_getSupplementDrugById,
  liquidRecord_getLiquidRecordById
} from '@/api/fluidBalance'
import {
  nurseRecord_findWithPage
} from '@/api/nurseRecord'
import {
  personMoniitem_findPersonConfigMoniitem
} from '@/api/patient'
import patientInfoCompute from '@/views/patient/mixin/patientInfoCompute'
export default {
  name: 'TinmceEdit',
  data() {
    return {
      divId: '',
      data: {},
      divDom: null
    }
  },
  mixins: [patientInfoCompute],
  props: {
    element: {
      type: Object,
      require: true
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    const self = this
    this.$nextTick(() => {
      document.querySelectorAll('#printContent table tr td').forEach((tdDom, index) => { // 表格组件行点击事件
        tdDom.ondblclick = async function(e) {
          const moniitemCode = tdDom.getAttribute('data-moniitemCodes')
          // const moniitemRecordIDs = tdDom.getAttribute('data-moniitemRecordIDs') //用id的话 页面不刷新 删除数据后 无法再次编辑  所以 不用id来修改监护项
          const recordTime = tdDom.getAttribute('data-recordtime')
          const icuRecordId = self.icuRecordId
          const recordInfo = {}
          const value = tdDom.innerText
          if (moniitemCode) {
            if (moniitemCode == 'NURSERECORD') { // 护理记录特殊处理
              const nurseRecordId = tdDom.getAttribute('data-nurseRecordId')
              const nurseRecordInfo = await self.getNurseRecord(nurseRecordId, icuRecordId, recordTime)
              const arr = []
              arr.push(Object.assign({
                'icuRecordId': icuRecordId,
                'moniitemCode': moniitemCode,
                'moniitemName': '护理记录',
                'recordTime': recordTime,
                'contentTypeDict': 'textarea',
                'moniitemOriValue': recordTime ? nurseRecordInfo.nurseRecordContent : '', // 原始数据 用来判断数据是否更改
                'moniitemValue': recordTime ? nurseRecordInfo.nurseRecordContent : ''
              }, nurseRecordInfo))
              recordInfo.moniitemList = arr
              recordInfo.dataType = 'NURSERECORD'
              if (tdDom.innerText != '' && !nurseRecordId) {
                return
              }
            } else if (moniitemCode == 'INCONTENT' || moniitemCode == 'INMEASURE') { // 入量
              const inmeasureID = tdDom.getAttribute('data-inmeasureCode') // 药物
              const liquidID = tdDom.getAttribute('data-inmeasureLiquidCode') // 液体平衡类型
              let result
              if (inmeasureID) {
                result = await self.getSupplementDrugInfo(inmeasureID)
                recordInfo.dataType = 'inDrug'
              } else if (liquidID) {
                result = await self.getLiquidData(liquidID)
                recordInfo.dataType = 'inliquid'
              } else if (!value) {
                recordInfo.dataType = 'inliquid'
                result = []
              } else {
                return
              }
              recordInfo.moniitemList = result
            } else if (moniitemCode == 'OUTCONTENT' || moniitemCode == 'OUTMEASURE' || moniitemCode == 'OUTCHARACTER') { // 出量性状
              const liquidID = tdDom.getAttribute('data-outmeasureLiquidCode') || tdDom.getAttribute('data-outCharacterLiquidCode')
              recordInfo.dataType = 'outliquid'
              if (liquidID) {
                const result = await self.getLiquidData(liquidID)
                recordInfo.moniitemList = result
              } else if (!value) {
                recordInfo.moniitemList = [] // 新增
              } else {
                return
              }
            } else {
              // 用id的话 页面不刷新 删除数据后 无法再次编辑  所以 不用id来修改监护项 合并代码时注意这里
              const result = await self.getMoniitemRecordByTime(recordTime, moniitemCode.split('|'), icuRecordId)
              result.forEach(item => {
                if (item.contentTypeDict == '4') {
                  if (item.moniitemValue != '' && item.moniitemValue) {
                     item.moniitemValue = item.moniitemValue.indexOf('[') > -1 ? JSON.parse(item.moniitemValue) : item.moniitemValue.split(',')
                  } else {
                     item.moniitemValue = []
                  }
                }
              })
              recordInfo.moniitemList = result
              recordInfo.dataType = 'moniitemCode'
            }
            recordInfo.event = e
            recordInfo.dom = tdDom
            recordInfo.recordTime = recordTime || self.$dayjs().format('YYYY-MM-DD HH:mm:ss')
            if (!recordTime) {
              recordInfo.insertNewData = true
            }
            self.$bus.$emit('showRecordEditDiaglog', recordInfo)
          }
          e.preventDefault()
        }
      })
      document.querySelectorAll('#printContent table a').forEach(aDom => {
        aDom.onclick = function(e) {
          const recordId = aDom.getAttribute('href')
          if (recordId) {
            self.openRecord(recordId)
          }
          e.preventDefault()
        }
      })
    })
  },
  destroyed() {

  },
  methods: {
    /**
     * 打开护理记录
     */
    openRecord(recordId) {
      this.$bus.$emit('openRecord', recordId)
    },
    /**
     * 根据监护项code 查找对应的 记录
     */
    getMonitemRecord(recordTime, moniitemCode, icuRecordId) {
      return new Promise((resolve, reject) => {
        const query = {
          recordTime: recordTime,
          moniitemCode: moniitemCode,
          icuRecordId: icuRecordId
        }
        moniitemRecord_getMoniitemRecord(query).then(res => {
          resolve(res.data)
        }).catch(reject)
      })
    },
    /**
     * 通过时间获取对应的监护数据
     */
    getMoniitemRecordByTime(recordTime, moniitemCodes, icuRecordId) {
      return new Promise((resolve, reject) => {
        if (recordTime) { // 存在记录时间
          const query = {
            recordTime: recordTime,
            icuRecordId: icuRecordId
          }
          moniitemRecord_findMoniItemRecordByTime(query).then(res => {
            let resultArr = []
            resultArr = moniitemCodes.map(async moniitemCode => {
              // 监护数据页面存在数据
              let effectiveFlag = false
              let moniitemInfo
              res.data?.forEach(item => {
                const filterRe = item.moduleItemList.filter(v => moniitemCode == v.moniitemCode)
                if (filterRe.length > 0) {
                  effectiveFlag = true
                  moniitemInfo = filterRe[0]
                }
              })

              if (!effectiveFlag) {
                moniitemInfo = await this.getMoniitemInfo(moniitemCode, icuRecordId)
                if (moniitemInfo.valueDictCode != '' && moniitemInfo.valueDictCode) {
                  moniitemInfo.dictList = await this.getMoniitemDict(moniitemInfo.valueDictCode)
                } else {
                  moniitemInfo.dictList = []
                }
                moniitemInfo.moniitemValue = null
                moniitemInfo.icuRecordId = icuRecordId
              } else {
                if (moniitemInfo.valueDictCode != '' && moniitemInfo.valueDictCode) {
                  moniitemInfo.dictList = await this.getMoniitemDict(moniitemInfo.valueDictCode)
                } else {
                  moniitemInfo.dictList = []
                }
              }
              return moniitemInfo
            })
            Promise.all(resultArr).then((e) => {
              resolve(e)
            })
          })
        } else {
            moniitemCodes = moniitemCodes.map(async moniitemCode => {
              const moniitemInfo = await this.getMoniitemInfo(moniitemCode, icuRecordId)
              if (moniitemInfo.valueDictCode != '' && moniitemInfo.valueDictCode) {
                moniitemInfo.dictList = await this.getMoniitemDict(moniitemInfo.valueDictCode)
              } else {
                moniitemInfo.dictList = []
              }
              moniitemInfo.moniitemValue = null
              moniitemInfo.icuRecordId = icuRecordId

              return moniitemInfo
            })
            Promise.all(moniitemCodes).then((e) => {
              resolve(e)
            })
        }
        })
    },
    /** *
     * 通过记录ID获取监护项记录
     */
    getMoniitemRecordByID(recordTime, recordIds, moniitemCodes, icuRecordId) {
      return new Promise((resolve, reject) => {
        const result = recordIds.map(async (recordId, index) => {
          if (recordId) {
            const recordInfo = await moniitemRecord_getById(recordId)
            const item = recordInfo.data
            if (item.valueDictCode != '' && item.valueDictCode) {
              item.dictList = await this.getMoniitemDict(item.valueDictCode)
            } else {
              item.dictList = []
            }
            return item
          } else {
            const moniitemInfo = await this.getMoniitemInfo(moniitemCodes[index], icuRecordId)
            if (moniitemInfo.valueDictCode != '' && moniitemInfo.valueDictCode) {
              moniitemInfo.dictList = await this.getMoniitemDict(moniitemInfo.valueDictCode)
            } else {
              moniitemInfo.dictList = []
            }
            moniitemInfo.moniitemValue = null
            moniitemInfo.icuRecordId = icuRecordId
            moniitemInfo.recordTime = recordTime
            return moniitemInfo
          }
        })
        Promise.all(result).then((e) => {
            resolve(e)
          })
      })
    },
    /**
     * 获取监护项基本信息
     */
    getMoniitemInfo(moniitemCode, icuRecordId) {
      return new Promise((resolve, reject) => {
        personMoniitem_findPersonConfigMoniitem({
           'statusDict': '',
           'moniitemCode': moniitemCode,
           'pageNum': 1,
           'pageSize': 100,
          //  'wardCode': this.currentUserWard.wardCode,
           'icuRecordId': icuRecordId,
           'busiTypeDictCode': 2
        }).then(res => {
          resolve(res.data[0])
        })
      })
    },
    /**
     * 获取对应字典项
     */
    getMoniitemDict(dictGroupCode) {
      return new Promise((resolve, reject) => {
        dictItem_findAllWithPage({
          dictGroupCode,
          pageSize: 1000,
          pageNum: 1
        }).then(res => {
          resolve(res.data.result)
        })
      })
    },
    /**
     * 查找护理记录
     */
    getNurseRecord(nurseRecordId, icuRecordId, time) {
      return new Promise((resolve, reject) => {
          const query = {
            pageSize: 1,
            pageNum: 1,
            icuRecordId: icuRecordId,
            nurseRecordId: nurseRecordId
          }
          nurseRecord_findWithPage(query).then(res => {
            if (res.data.result.length > 0 && nurseRecordId) {
              resolve(res.data.result[0])
            } else resolve({})
          })
      })
    },
    /**
     * 获取待入量信息
     */
    getSupplementDrugInfo(id) {
      return new Promise((resolve, reject) => {
        supplementDrug_getSupplementDrugById({ id: id }).then(res => {
          const arr = []
          res.data.oriData = JSON.parse(JSON.stringify(res.data))
          arr.push(res.data)
          resolve(arr)
        })
      })
    },
    /**
     * 通过id获取液体入量信息
     */
    getLiquidData(id) {
      return new Promise((resolve, reject) => {
        liquidRecord_getLiquidRecordById({ moniitemRecordId: id }).then(async res => {
          const arr = []
          const moniitemData = res.data
          moniitemData.moniitemOriValue = moniitemData.moniitemValue
          moniitemData.dataType = 'liquid'
          if (moniitemData.valueDictCode != '' && moniitemData.valueDictCode) {
            moniitemData.dictList = await this.getMoniitemDict(moniitemData.valueDictCode)
          } else {
            moniitemData.dictList = []
          }
          arr.push(res.data)
          resolve(arr)
        })
      })
    }

  }

}
</script>
<style lang="scss" scoped>
// @import '/static/tinymce/css/common.css';
.tinymceEdit {
  display: flex;
  flex-direction: column;
  //background: #fff;
  position: absolute;
}
.breakLine{
  table th,  table td, .mce-content-body table th, .mce-content-body table th{
    overflow: hidden !important;
    white-space:none !important;
  }
}
</style>
