import {
  userPersonalizedConfig_findWithPage, // 个性化储存 查询
  userPersonalizedConfig_insertOrUpdate // 个性化储存 新增或者修改
} from '@/api/patient'
const dragMsg = sessionStorage.getItem('dragMsg') != '' && sessionStorage.getItem('dragMsg') != undefined && sessionStorage.getItem('dragMsg') != 'undefined' ? JSON.parse(sessionStorage.getItem('dragMsg')) : { isFixShow: false }
const userPersonalizedConfig = sessionStorage.getItem('userPersonalizedConfig') != '' && sessionStorage.getItem('userPersonalizedConfig') != undefined && sessionStorage.getItem('userPersonalizedConfig') != 'undefined' ? JSON.parse(sessionStorage.getItem('userPersonalizedConfig')) : []
const app = {
    state: {
        batchSearchSysCodeObj: {},
        paramCodeObj: {},
        userPersonalizedConfig,
        routes: [],
        dragMsg,
        statisticsOpt: {
            forMonth: '',
            forYear: '',
            forQuater: '',
            forSelf: '',
            radio: 3,
            year: new Date().getFullYear(),
            season: '',
            startTime: '',
            endTime: ''
        }
    },

    mutations: {
        set_dragMsg(state, opt) {
            sessionStorage.setItem('dragMsg', JSON.stringify(opt))
            state.dragMsg = Object.assign({}, state.dragMsg, opt)
        },
        set_statisticsOpt(state, opt) {
            state.statisticsOpt = Object.assign({}, opt)
        },
        set_dict(state, newDictObj) {
            state.batchSearchSysCodeObj = Object.assign({}, state.batchSearchSysCodeObj, newDictObj)
        },
        set_param(state, newDictObj) {
            state.paramCodeObj = Object.assign({}, state.paramCodeObj, newDictObj)
        },
        SET_ROUTES(state, routes) {
            state.routes = routes
        },
        SET_userPersonalizedConfig(state, userPersonalizedConfig) {
          sessionStorage.setItem('userPersonalizedConfig', JSON.stringify(userPersonalizedConfig))
          state.userPersonalizedConfig = userPersonalizedConfig
        }
    },

    actions: {
        setRoutes({ commit }, routes) {
            commit('SET_ROUTES', routes)
        },
        userPersonalizedConfig({ dispatch, commit }, config) {
          const { userName, configCode, configValue } = config
          return new Promise((resolve, reject) => {
            userPersonalizedConfig_findWithPage({
              username: userName
            }).then((res) => {
              if (!configCode) { // 获取缓存值
                const list = res.data.result
                list.forEach(element => {
                  try {
                    element.configValue = element.configValue && JSON.parse(element.configValue)
                  } catch {
                    element.configValue = { configValue: element.configValue.replace(/^,+|,+$/g, '') }
                  }
                })
                commit('SET_userPersonalizedConfig', list)
                resolve()
                return
              }
              const allCheckListOneObj = res.data.result.filter((req) => {
                return req.configCode == configCode
              })
              userPersonalizedConfig_insertOrUpdate({
                configCode,
                configValue: JSON.stringify(configValue),
                configId: allCheckListOneObj[0]?.configId || '',
                username: userName
              }).then((res) => {
                dispatch('userPersonalizedConfig', { userName })
              })
            })
          })
        }
    }
}

export default app
