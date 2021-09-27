import request from '@/utils/request'
// management/supplierInfo/list
export function fetchList(data) {
  return request({
    url: '/management/supplierInfo/list',
    method: 'post',
    data
  })
}
// 删除广告 management/banner/del
export function supplierInfoDel(data) {
  return request({
    url: '/management/supplierInfo/del',
    method: 'post',
    data
  })
}
// 广告详情 management/banner/detail
export function supplierInfoDetail(data) {
  return request({
    url: '/management/supplierInfo/detail',
    method: 'post',
    data
  })
}
// 广告修改
export function supplierInfoEdit(data) {
  return request({
    url: '/management/supplierInfo/edit',
    method: 'post',
    data
  })
}
// 广告新增
export function supplierInfoAdd(data) {
  return request({
    url: '/management/supplierInfo/add',
    method: 'post',
    data
  })
}
//supplierStatus
export function supplierStatus(data) {
  return request({
    url: '/management/supplierInfo/editStatus',
    method: 'post',
    data
  })
}