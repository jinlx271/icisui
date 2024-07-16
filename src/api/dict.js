import request from '@/utils/request'

// 获取字典分组
export function getDictItemGroups() {
  return request({
    url: '/sys/getDictItemGroups',
    method: 'post',
    data: {}
  })
}

// 获取字典项后台默认加了 enabled的
export function getDictItemsByGroupId(param) {
  return request({
    url: '/sys/getDictItemsByGroupId',
    method: 'post',
    data: param
  })
}

// 修改字典
export function upDictItem(param) {
  return request({
    url: '/sys/upDictItem',
    method: 'post',
    data: param
  })
}
// 新增字典
export function addDictItem(param) {
  return request({
    url: '/sys/addDictItem',
    method: 'post',
    data: param
  })
}
// 删除字典
export function deleteDictItem(param) {
  return request({
    url: '/sys/deleteDictItem',
    method: 'post',
    data: param
  })
}

// 同步字典
export function syncDictToHis(param) {
  return request({
    url: '/sys/syncDictToHis',
    method: 'post',
    data: param
  })
}
