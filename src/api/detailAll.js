import request from '@/utils/request'


export function partnerAccount(data) {
  return request({
    url: '/management/partnerAccount/detail',
    method: 'post',
    data
  })
}

export function partnerList(data) {
  return request({
    url: '/management/partnerAccountDetail/list',
    method: 'post',
    data
  })
}

// 积分明细统计金额
export function partnerAccount2(data) {
  return request({
    url: '/management/partnerAccountDetail/statistics',
    method: 'post',
    data
  })
}