import request from '@/utils/request'
import qs from 'qs'

// 请求未分页分类
export function fetchList(data) {
  return request({
    url: '/management/partner/withdraw/list',
    method: 'post',
    data
  })
}
export function userfetchList(data) {
  return request({
    url: '/management/member/withdraw/list',
    method: 'post',
    data
  })
}

export function audit(data) {
  return request({
    url: '/management/partner/withdraw/audit',
    method: 'post',
    data
  })
}
export function useraudit(data) {
  return request({
    url: '/management/member/withdraw/audit',
    method: 'post',
    data
  })
}
// gsCompentDetail
export function gsCompentDetail(data) {
  return request({
    url: '/management/partner/withdraw/detail',
    method: 'post',
    data
  })
}
// 获取VIP房主申请提现列表management/vipWithdraw/list
export function vipWithDraw(data) {
  return request({
    url: '/management/vipWithdraw/list',
    method: 'post',
    data
  })
}
// vipDrawUp
export function vipDrawUp(data) {
  return request({
    url: '/management/vipWithdraw/audit',
    method: 'post',
    data
  })
}
// VIP审核记录/management/vipWithdraw/detail
export function vipDrawSee(data) {
  return request({
    url: '/management/vipWithdraw/detail',
    method: 'post',
    data
  })
}
//红包统计
export function packetsStatistics(data) {
  return request({
    url: '/management/finance/statistics/luckyMoney',
    method: 'post',
    data
  })
}
// 提现统计management/member/withdraw/countMoney
export function countMoneyApi(data) {
  return request({
    url: '/management/member/withdraw/countMoney',
    method: 'post',
    data
  })
}
