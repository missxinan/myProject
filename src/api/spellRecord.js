import request from '@/utils/request'

// 删除拼赚商品
export function spellMakeDelete(data) {
  return request({
    url: '/spell/make/goods/delete',
    method: 'post',
    data
  })
}
//拼赚详情
export function spellMakeInfo(data) {
  return request({
    url: '/spell/make/goods/info',
    method: 'post',
    data
  })
}
//拼赚列表
export function spellMakeList(data) {
  return request({
    url: '/spell/make/goods/list',
    method: 'post',
    data
  })
}
//编辑拼赚
export function spellMakeUpdata(data) {
  return request({
    url: '/spell/make/goods/update',
    method: 'post',
    data
  })
}
//新增拼赚商品
export function spellMakeSave(data) {
  return request({
    url: '/spell/make/goods/save',
    method: 'post',
    data
  })
}
//开启或关闭机器人
export function spellMakeRobot(data) {
  return request({
    url: '/spell/make/goods/robot',
    method: 'post',
    data
  })
}
//修改拼赚商品状态上下架
export function spellMakeStatus(data) {
  return request({
    url: '/spell/make/goods/status',
    method: 'post',
    data
  })
}

//拼赚订单列表
export function spellOrder(data) {
  return request({
    url: '/spell/make/order/page',
    method: 'post',
    data
  })
}
//拼赚参团详情
export function spellOrderInfo(data) {
  return request({
    url: '/spell/make/order/take',
    method: 'post',
    data
  })
}
//拼赚预约保底详情
export function spellSubscribe(data) {
  return request({
    url: '/spell/make/order/subscribe',
    method: 'post',
    data
  })
}
//拼团管理
export function spellTeam(data) {
  return request({
    url: '/spell/make/order/team',
    method: 'post',
    data
  })
}

//批量上下架
export function changeGoodStatus(data) {
  return request({
    url: '/spell/make/goods/batchUpdateStatus',
    method: 'post',
    data
  })
}

//拼赚订单详情
export function spellOrderInfoList(data) {
  return request({
    url: '/spell/make/order/detail',
    method: 'post',
    data
  })
}

//拼赚信息汇总
export function spellUserInfo(data) {
  return request({
    url: '/spell/make/order/userInfo',
    method: 'post',
    data
  })
}