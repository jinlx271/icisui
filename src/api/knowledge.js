/*
重症知识库配置接口
*/
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
// 删除知识库
export const medicalKnow_deleteById = (data) => wrapHttp(`/medicalKnow/deleteById`, data)
// 编辑知识库
export const medicalKnow_edit = (data) => wrapHttp(`/medicalKnow/edit`, data)
// 知识库
export const medicalKnow_findMedicalKnowList = (data) => wrapHttp(`/medicalKnow/findMedicalKnowList`, data)
// 知识库获取树结构
export const medicalKnow_findMedicalKnowTree = (data) => wrapHttp(`/medicalKnow/findMedicalKnowTree`, data)
// 获取信息
export const medicalKnow_getById = (data) => wrapHttp(`/medicalKnow/getById`, data)
// 获取信息
export const medicalKnow_insert = (data) => wrapHttp(`/medicalKnow/insert`, data)
// 删除文件
export const medicalKnow_deleteFile = (data) => wrapHttp(`/medicalKnow/deleteFile`, data)
// 获取请求文件的最大排序
export const medicalKnow_getMaxSort = (data) => wrapHttp(`/medicalKnow/getMaxSort`, data)
