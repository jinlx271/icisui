const dictData = {
  state: {

  },
  mutations: {
    set_dictData: (state, dictItemInfo) => {
      state[dictItemInfo.dictCode] = dictItemInfo.list
    }
  }
}

export default dictData
