import request from '@/utils/request'
// management/supplierInfo/list
export function virtualHoldAddApi(data) {
  return request({
    url: '/member/virtualHold/add',
    method: 'post',
    data
  })
}
export function virtualHoldListApi(data) {
  return request({
    url: '/member/virtualHold/list',
    method: 'post',
    data
  })
}
export function virtualHoldEditApi(data) {
  return request({
    url: '/member/virtualHold/edit',
    method: 'post',
    data
  })
}
export function resetPasswordApi(data) {
  return request({
    url: '/member/virtualHold/reset',
    method: 'post',
    data
  })
}