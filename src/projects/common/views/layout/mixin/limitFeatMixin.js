
export default {
  data() {
    return {
      limitFeat: '',
      inpatientID: '',
      timestamp: 0,
      noPatientInfo: '',
      parentHeight: '',
      parentWidth: ''
    }
  },
  created() {
    const { limitFeat, noPatientInfo, height, width } = this.$route.query
    this.limitFeat = limitFeat
    this.noPatientInfo = noPatientInfo
    this.parentHeight = height
    this.parentWidth = width
  }
}
