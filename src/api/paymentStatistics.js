import request from '@/utils/request'
import qs from 'qs'

// 拍卖列表
export function auctionDataList(data) {
  return request({
    url: '/management/finance/paymentHistory/auction',
    method: 'post',
    data
  })
}

// 积分商城列表
export function integralDataList(data) {
    return request({
      url: '/management/finance/paymentHistory/mall',
      method: 'post',
      data
    })
  }