import request from '@/utils/request'
import qs from 'qs'

// 请求列表
export function fetchList(data) {
  return request({
    url: '/management/sysConfig/list',
    method: 'post',
    data
  })
}
// 删除广告 management/banner/del
export function sysConfigDel(data) {
  return request({
    url: '/management/sysConfig/del',
    method: 'post',
    data
  })
}
// 广告详情 management/banner/detail
export function sysConfigDetail(data) {
  return request({
    url: '/management/sysConfig/detail',
    method: 'post',
    data
  })
}
// 广告修改
export function sysConfigEdit(data) {
  return request({
    url: '/management/sysConfig/edit',
    method: 'post',
    data
  })
}
// 广告新增
export function sysConfigAdd(data) {
  return request({
    url: '/management/sysConfig/add',
    method: 'post',
    data
  })
}

// 开启芒果
export function sysOpenMango(data) {
  return request({
    url: '/management/member/editMongoCard',
    method: 'post',
    data
  })
}