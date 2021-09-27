import request from '@/utils/request'

// 初始化获取list数组参数
export function auctionRecordInfoList(data) {
  return request({
    url: '/management/order/auctionRecordInfo/list',
    method: 'post',
    data
  })
}
// 刷新数据库缓存
export function refreshAuction(data) {
  return request({
    url: '/management/order/auctionRecordInfo/refreshAuction',
    method: 'post',
    data
  })
}

export function listByGoodsIdin(data) {
  return request({
    url: '/management/order/auctionRecordInfo/listByGoodsId',
    method: 'post',
    data
  })
}

// 上架此商品
// /management/banner/change
export function bannerchangeshoppping(data) {
  return request({
    url: '/management/banner/change',
    method: 'post',
    data
  })
}
// 点击查询
export function auctionRecordInfodetail(data) {
  return request({
    url: '/management/order/auctionRecordInfo/detail',
    method: 'post',
    data
  })
}

export function auctionRecordDetaillistByAuctionId(data) {
  return request({
    url: '/management/order/auctionRecordDetail/listByAuctionId',
    method: 'post',
    data
  })
}
export function treeApi(data) {
  return request({
    url: '/management/category/allList',
    method: 'post',
    data
  })
}
export function ByAuctionId(data) {
  return request({
    url: '/management/order/auctionRecordDetail/listByAuctionId',
    method: 'post',
    data
  })
}
export function robotForbidden(data) {
  return request({
    url: '/management/order/auctionRecordInfo/updateOpendRobot',
    method: 'post',
    data
  })
}
// addsellingrecord
// 新增拍卖
export function addsellingrecord(data) {
  return request({
    url: '/management/order/auctionRecordInfo/add',
    method: 'post',
    data
  })
}
// 批量新增拍卖
export function batchAddsellingrecord(data) {
  return request({
    url: '/management/order/auctionRecordInfo/batchAdd',
    method: 'post',
    data
  })
}
// 批量关闭拍卖bathCloseSellingApi
export function bathCloseSellingApi(data) {
  return request({
    url: '/management/order/auctionRecordInfo/batchClose',
    method: 'post',
    data
  })
}
// 批量关闭机器人bathCloseRobotApi
export function bathCloseRobotApi(data) {
  return request({
    url: '/management/order/auctionRecordInfo/batchForbid',
    method: 'post',
    data
  })
}



export function sellingRecordClose(data) {
  return request({
    url: '/management/order/auctionRecordInfo/close',
    method: 'post',
    data
  })
}
export function editProtectPrice(data) {
  return request({
    url: '/management/order/auctionRecordInfo/editProtectPrice',
    method: 'post',
    data
  })
}
// 获取所有房主
export function getVipRoomUser(data) {
  return request({
    url: '/management/vipRoom/getAll',
    method: 'post',
    data
  })
}

export function getSystemTime(data) {
  return request({
    url: '/management/sysConfig/getValue',
    method: 'post',
    data
  })
}
// 旗舰店vip列表和审核接口
export function vipActionsList(data) {
  return request({
    url: '/management/vipAuctionApply/list',
    method: 'post',
    data
  })
}
export function vipActionsAudit(data) {
  return request({
    url: '/management/vipAuctionApply/audit',
    method: 'post',
    data
  })
}
// 拍卖区域列表和修改接口
export function sellingAreaList(data) {
  return request({
    url: '/management/auctionArea/allList',
    method: 'post',
    data
  })
}
export function auctionRecordInfodetail_goodsInfo(data) {
  return request({
    url: '/management/order/auctionRecordInfo/detail',
    method: 'post',
    data
  })
}

export function updataAuctionTime(data) {
  return request({
    url: '/management/order/auctionRecordInfo/updateStartTime',
    method: 'post',
    data
  })
}
