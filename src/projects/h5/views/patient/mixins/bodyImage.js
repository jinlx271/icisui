import { findCatheterRecordWithPage } from '@/api/pipeCare'
import { findSkinRecordWithPage } from '@/api/skinRecord'

export default {
  data() {
    return {
      loadingCatheter: false,
      loadingSkin: false,
      loadData: false
    }
  },
  mounted() {},
  methods: {
    getPatientCatheterList() {
      this.loadingCatheter = true
      this.$refs.catheterBody?.setDefaultSeleced([])
      const query = {
        pageSize: 100,
        pageNum: 1,
        icuRecordId: this.patientInfo.icuRecordId
      }
      findCatheterRecordWithPage(query)
        .then((res) => {
          if (res.code == 0) {
            this.loadData = true
            const list = res.data.result
            const pipeHunanObject = {}
            list.forEach((item) => {
              item.posiDictCode = item.cathPosiDictCode
              item.posiDictName = item.cathPosiDictName
              if (item.cathStatusDict == '2' || item.cathStatusDict == '3') {
                const humanId = item.humanId
                let pipeList = pipeHunanObject[humanId]
                if (!pipeList) {
                  pipeList = []
                  pipeHunanObject[humanId] = pipeList
                }
                pipeList.push(item)
              }
              const starttime = item.startTime
              const endDate = new Date(starttime)
              const duration = Number(item.planDuration)
              const endDay = endDate.getDate() + duration
              endDate.setDate(endDay)

              const cathStatusDict = item.cathStatusDict
              if (cathStatusDict == '0' || cathStatusDict == '1') {
                // 已经结束
                return
              }
              item.planEndTime = this.$dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')
            })

            this.$nextTick(() => {
              this.$refs.catheterBody?.setDefaultSeleced(pipeHunanObject)
              this.loadingCatheter = false
            })
          }
        })
        .catch((e) => {
          this.loadingCatheter = false
        })
    },
    // 获取皮肤记录数据
    getSkinRecordList() {
      this.loadingSkin = true
      const query = {
        icuRecordId: this.patientInfo.icuRecordId
      }
      this.$refs.skinBody?.setDefaultSeleced([])
      findSkinRecordWithPage(query)
        .then((res) => {
          if (res.code == 0) {
            this.loadData = true
            const list = res.data.result
            const skinHunanObject = {}
            list.forEach((item) => {
              item.posiDictCode = item.skinPosiDictCode
              item.posiDictName = item.skinPosiDictName
              if (item.backStatusFlag != '1') {
                const humanId = item.humanId
                let skinList = skinHunanObject[humanId]
                if (!skinList) {
                  skinList = []
                  skinHunanObject[humanId] = skinList
                }
                skinList.push(item)
              }
            })
            this.$nextTick(() => {
              this.$refs.skinBody?.setDefaultSeleced(skinHunanObject)
              this.loadingSkin = false
            })
          }
        })
        .catch((e) => {
          this.loadingSkin = false
        })
    }
  }
}
