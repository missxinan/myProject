import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/management/bannerPosition/list',
    method: 'post',
    data
  })
}

export function fetchListbanner(data) {
  return request({
    url: '/management/bannerPosition/list',
    method: 'post',
    data
  })
}

export function setsortdata(data) {
  return request({
    url: '/management/banner/setsort',
    method: 'post',
    data
  })
}

// /management/bannerPosition/list
// 拍卖区域列表和修改接口
export function sellingAreaList(data) {
  return request({
    url: '/management/auctionArea/allList',
    method: 'post',
    data
  })
}
export function sellingAreaEdit(data) {
  return request({
    url: '/management/auctionArea/edit',
    method: 'post',
    data
  })
}
