/** 基础数据模块**/
import request from '@/utils/request'
import store from '@/store'

// 根据code查询单位 ["thicknessUnits", "flowUnits"]
export function batchSearchSysCode(query) {
    const filterList = query.filter(dictName => {
        return !{}.hasOwnProperty.call(
            store.getters.batchSearchSysCodeObj,
            dictName
        )
    })
    if (filterList.length > 0) {
        return request({
            url: '/basedata/batchSearchSysCode',
            method: 'post',
            params: query
        }).then(function (rs) {
            store.commit('set_dict', rs)
            return rs
        })
    } else {
        const result_obj = {}
        query.forEach(dictName => {
            result_obj[dictName] = store.getters.batchSearchSysCodeObj[dictName]
        })
        return new Promise(function (r) {
            r(result_obj)
        })
    }
}
