import request from '@/utils/request'
// 请求未分页分类
export function fetchList(data) {
  return request({
    url: '/management/member/rechargeLog/list',
    method: 'post',
    data
  })
}

// 请求未分页分类
export function rewardList(data) {
  return request({
    url: '/management/accountLog/rewardList',
    method: 'post',
    data
  })
}
// 请求未分页分类
export function payLog(data) {
  return request({
    url: '/management/payLog/list',
    method: 'post',
    data
  })
}
export function rechargeLogExport(data) {
  return request({
    url: '/management/member/rechargeLog/export',
    method: 'post',
    data
  })
}
// /management/member/rechargeLog/countMoney
export function rechargeCountMoneyApi(data) {
  return request({
    url: '/management/member/rechargeLog/countMoney',
    method: 'post',
    data
  })
}


