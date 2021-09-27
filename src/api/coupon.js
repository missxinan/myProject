import request from '@/utils/request'
// 获取优惠券列表
export function fetchCouponList(data) {
  return request({
    url: '/management/order/coupon/list',
    method: 'post',
    data
  })
}


// 新增优惠券
export function addCouponSave(data) {
  return request({
    url: '/management/order/coupon/add',
    method: 'post',
    data
  })
}

// 编辑优惠券
export function updateCoupon(data) {
  return request({
    url: '/management/order/coupon/edit',
    method: 'post',
    data
  })
}


// 关闭优惠券
export function closeCoupon(data) {
  return request({
    url: '/management/order/coupon/close',
    method: 'post',
    data
  })
}

// 发放优惠券
export function sendCoupon(data) {
  return request({
    url: '/management/order/coupon/send',
    method: 'post',
    data
  })
}