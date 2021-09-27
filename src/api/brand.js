import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/seller/brand/list',
    method: 'post',
    data
  })
}

export function brandDel(data) {
  return request({
    url: '/seller/brand/del',
    method: 'post',
    data
  })
}
export function brandAdd(data) {
  return request({
    url: '/seller/brand/add',
    method: 'post',
    data
  })
}

export function brandEdit(data) {
  return request({
    url: '/seller/brand/edit',
    method: 'post',
    data
  })
}
export function brandDetail(data) {
  return request({
    url: '/seller/brand/detail',
    method: 'post',
    data
  })
}
// brandStart
export function brandStart(data) {
  return request({
    url: '/seller/brand/updateStatus',
    method: 'post',
    data
  })
}