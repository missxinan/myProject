import request from '@/utils/request'
export function partnerList(data) {
  return request({
    url: '/management/partner/list',
    method: 'post',
    data
  })
}
export function partnerEdit(data) {
  return request({
    url: '/management/partner/edit',
    method: 'post',
    data
  })
}
export function partnerForbidden(data) {
  return request({
    url: '/management/partner/forbidden',
    method: 'post',
    data
  })
}
// 修改密码
export function partnerEditPassword(data) {
  return request({
    url: '/management/partner/resetPassword',
    method: 'post',
    data
  })
}
// 添加总公司用户
export function partnerAdd(data) {
  return request({
    url: '/management/partner/add',
    method: 'post',
    data
  })
}
// 公司用户详情
export function partnerDetail(data) {
  return request({
    url: '/management/partner/detail',
    method: 'post',
    data
  })
}
// 公司人数统计
export function partnerNumCountSum(data) {
  return request({
    url: '/management/partnerNumCount/sum',
    method: 'post',
    data
  })
}
export function partnerNumCountist(data) {
  return request({
    url: '/management/partnerNumCount/list',
    method: 'post',
    data
  })
}
export function partnerCompleteSumSum(data) {
  return request({
    url: '/management/partnerCompleteSum/sum',
    method: 'post',
    data
  })
}
export function partnerCompleteSumList(data) {
  return request({
    url: '/management/partnerCompleteSum/list',
    method: 'post',
    data
  })
}
export function partnerNumCountList(data) {
  return request({
    url: '/management/partnerNumCount/list',
    method: 'post',
    data
  })
}
// 区域地址
export function addressList(data) {
  return request({
    url: '/management/address/list',
    method: 'post',
    data
  })
}
export function partnerPromotion(data) {
  return request({
    url: '/management/partner/promotion',
    method: 'post',
    data
  })
}
export function referrerPartnerApi(data) {
  return request({
    url: '/management/partner/list',
    method: 'post',
    data
  })
}
