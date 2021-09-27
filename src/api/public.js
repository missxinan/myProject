import request from '@/utils/request'

// 获取所有支付方式
export function getAllPayTypeApi() {
  return request({
    url: '/management/thirdPaymentSettings/allList',
    method: 'post'
  })
}
// 修改支付方式
export function payTypeEditApi(data) {
    return request({
      url: '/management/thirdPaymentSettings/edit',
      method: 'post',
      data
    })
}
// 请求系统参数
export function getSysConfig(data) {
  return request({
    url: '/management/sysConfig/getValue',
    method: 'post',
	  data
  })
}