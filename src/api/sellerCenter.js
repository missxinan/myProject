import request from '@/utils/request'

//获取卖家店铺列表
export function fetchSellerStoreList(data){
  return request({
    url: '/seller/store/list',
    method: 'post',
    data
  })
}
//获取卖家详情
export function fetchSellerDetail(data){
  return request({
    url: '/seller/store/details',
    method: 'post',
    data
  })
}
// 审核通过或者拒绝
export function SellerRatify(data){
  return request({
    url: '/seller/store/ratify',
    method: 'post',
    data
  })
}
//获取卖家文件审核详情
export function fetchSellerFileDetail(data){
  return request({
    url:'/seller/store/papers/details',
    method: 'post',
    data
  })
}
//审核卖家文件通过或者拒绝
export function SellerFileRatify(data){
  return request({
    url: '/seller/store/papers/examine',
    method: 'post',
    data
  })
}

// 获取被举报店铺列表
export function fetchTipOffList(data){
  return request({
    url:'/merchant/goodsTipOff/tipOffList',
    method: 'post',
    data
  })
}

// 获取当前被举报店铺列表
export function fetchTipOffDetail(data){
  return request({
    url:'/merchant/goodsTipOff/getTipOffById',
    method: 'post',
    data
  })
}
