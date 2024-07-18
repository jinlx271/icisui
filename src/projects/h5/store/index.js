import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import patient from './modules/patient'
import formCreator from './modules/formCreator'
import dictData from './modules/dictData'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        app,
        user,
        patient,
        dictData,
        formCreator
    },
    getters
})
export default store
