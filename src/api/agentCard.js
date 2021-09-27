import request from '@/utils/request'
// 请求列表
export function fetchMangoList(data) {
  return request({
    url: '/mango/card/agent',
    method: 'post',
    data
  })
}

// 分配
export function distribution(data) {
  return request({
    url: '/mango/card/distribution',
    method: 'post',
    data
  })
}