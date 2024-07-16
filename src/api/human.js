// ICU病区
import request from '@/utils/request'
/**
 * 公用post
 * @param url 请求接口
 * @param data 入参
 */
const wrapHttp = (url, data = {}, method = 'post') => {
  return request({
    url: url,
    method,
    data
  })
}

// 查询人体部位对应导管列表
export const findDictCatheterPositionWithPage = (data) => wrapHttp(`/dict/findDictCatheterPositionWithPage`, data)
// 批量添加人体部位对应导管列表
export const addhumanPipePositionList = (data) => wrapHttp(`/dict/insertDictCatheterPositionList`, data)
// 删除人体部位对应导管列表
export const delhumanPipePosition = (data) => wrapHttp(`/dict/deleteDictCatheterPositionById`, data)

// 查询导管集合
export const findDictCatheterWithPage = (data) => wrapHttp(`dict/findDictCatheterWithPage`, data)
// 查询导管分类
export const findDictCatheterType = (data) => wrapHttp(`dict/getDictItemListByGroupType`, {
  groupType: 'catheterType',
  pageSize: 1000 })
// 查询导管危险级别
export const findDictCatheterRiskLevel = (data) => wrapHttp(`dict/getDictItemListByGroupType`, {
  groupType: 'catheterRiskLevel',
  pageSize: 1000
})

// 查询导管部位映射导管
export const findPipePositionCatheter = (data) => wrapHttp(`dict/findDictCatheterPositionMpWithPage`, data)
// 批量新增导管部位映射导管
export const insertDictCatheterPositionMpList = (data) => wrapHttp(`dict/insertDictCatheterPositionMpList`, data)
// 删除导管部位映射导管
export const deleteDictCatheterPositionMp = (data) => wrapHttp(`dict/deleteDictCatheterPositionMp`, data)

