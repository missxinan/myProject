import request from '@/utils/request'

export function bannerPosition(data) {
  return request({
    url: '/management/bannerPosition/list',
    method: 'post',
    data
  })
}

export function bannerlist(data) {
  return request({
    url: '/management/banner/pageList',
    method: 'post',
    data
  })
}

// 调试接口
export function bannersearch(data) {
  return request({
    url: '/management/banner/list',
    method: 'post',
    data
  })
}

export function banneradd(data) {
  return request({
    url: '/management/banner/add',
    method: 'post',
    data
  })
}
