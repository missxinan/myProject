import request from '@/utils/request'
// 请求城市列表
export function fetchCityInfo(data) {
  return request({
    url: '/tbSysArea/noLogin/province/city',
    method: 'post',
    data
  })
}
// 请求区县列表
export function fetchCountyInfo(data) {
  return request({
    url: '/tbSysArea/noLogin/city/county/level',
    method: 'post',
    data
  })
}
// 请求省列表
export function fetchCityList(data) {
  return request({
    url: '/tbSysArea/noLogin/province',
    method: 'post',
    data
  })
}
// 请求市列表
export function fetchCountyList(data) {
  return request({
    url: '/tbSysArea/noLogin/city',
    method: 'post',
    data
  })
}
// 请求区域列表
export function fetchAreaList(data) {
  return request({
    url: '/tbSysArea/noLogin/county',
    method: 'post',
    data
  })
}
// 查询城市
export function fetchAreaName(data) {
  return request({
    url: '/tbSysArea/noLogin/city/county/areaName',
    method: 'post',
    data
  })
}
// 精确查询
export function fetchAreaCode(data) {
  return request({
    url: '/tbSysArea/noLogin/areaCode',
    method: 'post',
    data
  })
}
// 修改状态
export function updateStatus(data) {
  return request({
    url: '/tbSysArea/update/signStatus',
    method: 'post',
    data
  })
}
// 修改状态
export function updateHidden(data) {
  return request({
    url: '/tbSysArea/update/hidden',
    method: 'post',
    data
  })
}
// 修改区域类别
export function updateAreaClass(data) {
  return request({
    url: '/tbSysArea/update/level',
    method: 'post',
    data
  })
}