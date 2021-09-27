import request from '@/utils/request'
/**
 * 商城商品管理接口
 */
/**
 * 添加商品
 */
export function addGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/add',
    method: 'post',
    data
  })
}
/**
 * 修改商品
 */
export function editGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/edit',
    method: 'post',
    data
  })
}
/**
 * 商品列表
 */
export function goodsListMall(data) {
  return request({
    url: '/management/mallGoodsInfo/list',
    method: 'post',
    data
  })
}
/**
 * 商品上架
 */
export function upperGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/upperGoodsInfo',
    method: 'post',
    data
  })
}
/**
 * 商品下架
 */
export function downGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/downGoodsInfo',
    method: 'post',
    data
  })
}
/**
 * 商品详情
 */
export function goodsDetailMall(data) {
  return request({
    url: '/management/mallGoodsInfo/detail',
    method: 'post',
    data
  })
}
/**
 * 编辑商品库存
 */
export function editInventoryMall(data) {
  return request({
    url: '/management/mallGoodsInfo/editInventory',
    method: 'post',
    data
  })
}
/**
 * 编辑商品顺序
 */
export function editSortsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/editSort',
    method: 'post',
    data
  })
}
/**
 * 商城订单管理接口
 */
/**
 * 订单列表
 */
export function orderListMall(data) {
  return request({
    url: '/management/mallOrder/list',
    method: 'post',
    data
  })
}
/**
 * 寄拍订单列表
 */
export function orderListAuction(data) {
  return request({
    url: '/management/mallOrder/listNumber',
    method: 'post',
    data
  })
}
/**
 * 发货修改物流信息
 */
export function deliverGoodsMall(data) {
  return request({
    url: '/management/mallOrder/deliverGoods',
    method: 'post',
    data
  })
}
/**
 * 会员订单接拍
 */
export function acceptAuctionByNumber(data) {
  return request({
    url: '/management/mallOrder/acceptAuctionByNumber',
    method: 'post',
    data
  })
}
/**
 * 接拍
 */
export function acceptAuctionMall(data) {
  return request({
    url: '/management/mallOrder/acceptAuction',
    method: 'post',
    data
  })
}
/**
 * 处理订单
 */
export function handleMallOrder(data) {
  return request({
    url: '/management/mallOrder/handleMallOrder',
    method: 'post',
    data
  })
}
/**
 * 订单详情
 */
export function orderDetailMall(data) {
  return request({
    url: '/management/mallOrder/detail',
    method: 'post',
    data
  })
}
/**
 * 修改订单备注
 */
export function editRemarkMall(data) {
  return request({
    url: '/management/mallOrder/editRemark',
    method: 'post',
    data
  })
}
/**
 * 获取所以启用供应商
 */
export function supplierList(data) {
  return request({
    url: '/management/supplierInfo/allList',
    method: 'post',
    data
  })
}

/**
 * 批量上架
 */
export function newUpperGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/batchUpperGoodsInfo',
    method: 'post',
    data
  })
}

/**
 * 批量下架
 */
export function newDownGoodsMall(data) {
  return request({
    url: '/management/mallGoodsInfo/batchDownGoodsInfo',
    method: 'post',
    data
  })
}
// 获取树形加载分类/management/category/allList
export function treeCategoryApi(data) {
  return request({
    url: '/management/category/allList',
    method: 'post',
    data
  })
}

export function mallCountMoneyApi(data) {
  return request({
    url: '/management/mallOrder/countMoney',
    method: 'post',
    data
  })
}

export function auctionCountMoneyApi(data) {
  return request({
    url: '/management/mallOrder/countNumberMoney',
    method: 'post',
    data
  })
}
