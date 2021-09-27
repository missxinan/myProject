import request from '@/utils/request'
// 获取鉴定师列表
export function fetchAppraiserList(data) {
  return request({
    url: '/identification/appraiser/list',
    method: 'post',
    data
  })
}

// 获取鉴定分类
export function fetchAppraiserClassify(data) {
  return request({
    url: '/identification/appraiser/classify',
    method: 'post',
    data
  })
}

// 查看鉴定师详情
export function getAppraiserInfo(data) {
  return request({
    url: '/identification/appraiser/info',
    method: 'post',
    data
  })
}

// 新增鉴定师
export function addAppraiserSave(data) {
  return request({
    url: '/identification/appraiser/save',
    method: 'post',
    data
  })
}

// 编辑鉴定师
export function updateAppraiser(data) {
  return request({
    url: '/identification/appraiser/update',
    method: 'post',
    data
  })
}

// 鉴定师审核
export function auditAppraiser(data) {
  return request({
    url: '/identification/appraiser/audit',
    method: 'post',
    data
  })
}

// 删除鉴定师
export function deleteAppraiser(data) {
  return request({
    url: '/identification/appraiser/delete',
    method: 'post',
    data
  })
}


// 获取鉴品分类列表
export function fetchClassifyList(data) {
  return request({
    url: '/identification/classify/list',
    method: 'post',
    data
  })
}

// 添加鉴品分类
export function addClassifySave(data) {
  return request({
    url: '/identification/classify/save',
    method: 'post',
    data
  })
}

// 修改鉴品分类状态
export function updataClassifyStatus(data) {
  return request({
    url: '/identification/classify/status',
    method: 'post',
    data
  })
}

// 删除鉴品分类
export function deleteClassify(data) {
  return request({
    url: '/identification/classify/delete',
    method: 'post',
    data
  })
}

// 编辑鉴品分类
export function updataClassify(data) {
  return request({
    url: '/identification/classify/update',
    method: 'post',
    data
  })
}

//获取鉴品审核列表
export function fetchIdentificationList(data) {
  return request({
    url: '/identification/artwork/page',
    method: 'post',
    data
  })
}

//获取鉴品详情
export function getIdentificationInfo(data) {
  return request({
    url: '/identification/artwork/info',
    method: 'post',
    data
  })
}

//鉴品审核
export function identificationAudit(data) {
  return request({
    url: '/identification/artwork/audit',
    method: 'post',
    data
  })
}

//鉴品寄卖订单列表
export function identificationOrderList(data) {
  return request({
    url: '/identification/artwork/order/page',
    method: 'post',
    data
  })
}

//鉴品寄卖订单详情
export function identificationOrderInfo(data) {
  return request({
    url: '/identification/artwork/order/info',
    method: 'post',
    data
  })
}