import request from '@/utils/request'
// 请求列表
export function fetchMangoList(data) {
  return request({
    url: '/management/member/vip',
    method: 'post',
    data
  })
}

