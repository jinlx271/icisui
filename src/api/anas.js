import request from '@/utils/request'
// import store from '../store'

// 查询模板
export function getTmpDocConfigByTempType(query) {
    return request({
        url: '/basedata/getTmpDocConfigByTempType',
        method: 'post',
        data: query
    })
}
// 保存麻醉记录单/复苏记录单模板
export function saveTmpDocConfig(query) {
    return request({
        url: '/basedata/saveTmpDocConfig',
        method: 'post',
        data: query
    })
}
// 查询内置模板
export function getTmpDocConfigList(query) {
    return request({
        url: '/basedata/getTmpDocConfigList',
        method: 'post',
        data: query
    })
}

// 查询内置模板
export function getTmpAllDocConfigList(query) {
    return request({
        url: '/basedata/getTmpAllDocConfigList',
        method: 'post',
        data: query
    })
}

// 新增模板
export function insertTmpDocConfig(query) {
    return request({
        url: '/basedata/insertTmpDocConfig',
        method: 'post',
        data: query
    })
}

// 删除文书模板
export function deleteTmpDocConfig(query) {
    return request({
        url: '/basedata/deleteTmpDocConfig ',
        method: 'post',
        data: query
    })
}

// 获取文书模板相关信息
export function getTmpDocConfigById(query) {
    return request({
        url: '/basedata/getTmpDocConfigById',
        method: 'post',
        data: query
    })
}

// 新增对应病区的模板列表
export function insertTmpDocWard(query) {
    return request({
        url: '/basedata/insertTmpDocWard',
        method: 'post',
        data: query
    })
}
// 新增对应病区的模板列表
export function getTmpDocWardListByWardCode(query) {
    return request({
        url: '/basedata/getTmpDocWardListByWardCode',
        method: 'post',
        data: query
    })
}
// 新增对应病区的模板列表
export function getAllDocWardListByWardCode(query) {
    return request({
        url: '/basedata/getAllDocWardListByWardCode',
        method: 'post',
        data: query
    })
}

// 新增对应病区的模板列表
export function deleteTmpDocWardById(query) {
    return request({
        url: '/basedata/deleteTmpDocWardById',
        method: 'post',
        data: query
    })
}

// 获取归档类的文书模板
export function getWardArchiveTmpDocList(query) {
    return request({
        url: '/basedata/getWardArchiveTmpDocList',
        method: 'post',
        data: query
    })
}

export function updateTmpDocWardById(query) {
    return request({
        url: '/basedata/updateTmpDocWardById',
        method: 'post',
        data: query
    })
}
/**
 * 获取文书签名信息
 * @param {*} query
 * @returns
 */

export function tmpDocSignature_findSignatureEntityList(query) {
    return request({
        url: '/tmpDocSignature/findSignatureEntityList',
        method: 'post',
        data: query
    })
}
/**
 * 重新签名
 * @param {*} query
 * @returns
 */
export function tmpDocSignature_edit(query) {
    return request({
        url: '/tmpDocSignature/edit',
        method: 'post',
        data: query
    })
}
/**
 * 签名
 * @param {*} query
 * @returns
 */
 export function tmpDocSignature_insert(query) {
    return request({
        url: '/tmpDocSignature/insert',
        method: 'post',
        data: query
    })
}
/**
 *  取消签名
 * @param {*} query
 * @returns
 */
 export function tmpDocSignature_cancel(query) {
    return request({
        url: '/tmpDocSignature/cancel',
        method: 'post',
        data: query
    })
}

/**
 * 获取表格组件排序号
 */
 export function getNextSortNo(query) {
    return request({
        url: '/basedata/doc/nextSortNo',
        method: 'post',
        data: query
    })
}
