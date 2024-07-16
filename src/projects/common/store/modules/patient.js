const defaultPatientInfo = sessionStorage.getItem('patientInfo') != '' && sessionStorage.getItem('patientInfo') != undefined && sessionStorage.getItem('patientInfo') != 'undefined' ? JSON.parse(sessionStorage.getItem('patientInfo')) : {}
const patient = {
  state: {
    patientInfo: defaultPatientInfo || {},
    timestamp: 'yyyy',
    patientList: []
  },
  mutations: {
    set_timestamp: function (state) {
      state.timestamp = new Date().getTime() + ''
    },
    set_patientInfo: (state, patientInfo) => {
      if (patientInfo) {
        const cloneObj = JSON.parse(JSON.stringify(patientInfo)) // 深度复制 否则将修改list数据
        const icuPatientInfo = JSON.parse(JSON.stringify(cloneObj?.patientInfo || cloneObj))
        delete cloneObj.patientInfo
        const info = Object.assign(icuPatientInfo, cloneObj)
        if (info.patientEntity && !info.patientEntity.birthday && info.patientEntity.idNo) {
          info.patientEntity.birthday = `${getBirthdayFromIdCard(info.patientEntity.idNo)} 00:00:00`
        }
        state.patientInfo = info
        sessionStorage.setItem('patientInfo', JSON.stringify(info))
      } else {
        sessionStorage.removeItem('patientInfo')
      }
    },
    set_patientList: (state, list) => {
      state.patientList = list
      if (state.patientInfo && list.length > 0) {
        const patientInfo = Object.assign(state.patientInfo, list.filter(v => v.icuRecordId == state.patientInfo.icuRecordId)[0]?.patientInfo)
        if (patientInfo && patientInfo.icuRecordId) {
          sessionStorage.setItem('patientInfo', JSON.stringify(state.patientInfo))
        }
      }
    }
  },

  actions: {
    setPatientInfo({ commit }, patientInfo) {
      commit('set_patientInfo', patientInfo)
    },
    setPatientList({ commit }, list) {
      commit('set_patientList', list)
    }
  }
}
function getBirthdayFromIdCard(idCard) {
  let birthday = ''
  if (idCard != null && idCard != '') {
    if (idCard.length == 15) {
      birthday = '19' + idCard.substr(6, 6)
    } else if (idCard.length == 18) {
      birthday = idCard.substr(6, 8)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
  }
  return birthday
}
export default patient
