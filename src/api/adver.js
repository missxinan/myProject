import request from '@/utils/request'
import requestImg from '@/utils/requestImg'
// 请求列表
export function fetchList(data) {
  return request({
    url: '/management/banner/list',
    method: 'post',
    data
  })
}
// 请求未分页分类  // bannerPosition/listNoPage
export function positionList(data) {
  return request({
    url: '/management/bannerPosition/listNoPage',
    method: 'post',
    data
  })
}
// 删除广告 management/banner/del
export function advDel(data) {
  return request({
    url: '/management/banner/del',
    method: 'post',
    data
  })
}
// 广告详情 management/banner/detail
export function advDetail(data) {
  return request({
    url: '/management/banner/detail',
    method: 'post',
    data
  })
}
// 广告修改
export function advEdit(data) {
  return request({
    url: '/management/banner/edit',
    method: 'post',
    data
  })
}
// 上传图片
export function uploadImg(data) {
  return request({
    url: '/oss/upload',
    method: 'post',
    data
  })
}
// 广告新增
export function advAdd(data) {
  return request({
    url: '/management/banner/add',
    method: 'post',
    data
  })
}
// 禁用启用
export function advChange(data) {
  return request({
    url: '/management/banner/change',
    method: 'post',
    data
  })
}
// 超级商家运营分类seller/operationCategory/superList
export function superList(data) {
  return request({
    url: '/management/operationCategory/superList',
    method: 'post',
    data
  })
}
// uploadFileList
export function uploadImgFile(data) {
  return requestImg({
    url: '/oss/uploadFileList',
    method: 'post',
    data
  })
}

// 拍卖区域列表
export function auctionAreaList(data) {
  return request({
    url: '/management/auctionArea/allList',
    method: 'post',
    data
  })
}
