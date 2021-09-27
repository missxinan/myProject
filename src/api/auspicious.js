import request from '@/utils/request'
// 天降祥瑞时间列表
export function fetchTimeList(data) {
  return request({
    url: '/xxkd/auspicious/time/list',
    method: 'post',
    data
  })
}

// 天降祥瑞时间详情
export function auspiciousTimeInfo(data) {
  return request({
    url: '/xxkd/auspicious/time/info',
    method: 'post',
    data
  })
}

// 新增天降祥瑞时间
export function auspiciousTimeAdd(data) {
  return request({
    url: '/xxkd/auspicious/time/add',
    method: 'post',
    data
  })
}

// 编辑天降祥瑞时间
export function auspiciousTimeEdit(data) {
  return request({
    url: '/xxkd/auspicious/time/edit',
    method: 'post',
    data
  })
}

// 删除天降祥瑞时间
export function auspiciousTimeDel(data) {
  return request({
    url: '/xxkd/auspicious/time/del',
    method: 'post',
    data
  })
}


// 天降祥瑞奖励列表
export function fetchRewardList(data) {
  return request({
    url: '/xxkd/auspicious/reward/list',
    method: 'post',
    data
  })
}

// 新增天降祥瑞奖励
export function fetchRewardAdd(data) {
  return request({
    url: '/xxkd/auspicious/reward/add',
    method: 'post',
    data
  })
}

// 编辑天降祥瑞奖励
export function fetchRewardEdit(data) {
  return request({
    url: '/xxkd/auspicious/reward/edit',
    method: 'post',
    data
  })
}

// 删除天降祥瑞奖励
export function fetchRewardDel(data) {
  return request({
    url: '/xxkd/auspicious/reward/del',
    method: 'post',
    data
  })
}


// 添加祥瑞奖励配置
export function fetchDeployAdd(data) {
  return request({
    url: '/xxkd/auspicious/deploy/add',
    method: 'post',
    data
  })
}

// 编辑祥瑞奖励配置
export function fetchDeployEdit(data) {
  return request({
    url: '/xxkd/auspicious/deploy/edit',
    method: 'post',
    data
  })
}

// 删除祥瑞奖励配置
export function fetchDeployDel(data) {
  return request({
    url: '/xxkd/auspicious/deploy/del',
    method: 'post',
    data
  })
}


// 抽奖奖品列表
export function fetchPrizeList(data) {
  return request({
    url: '/xxkd/draw/prize/list',
    method: 'post',
    data
  })
}

// 编辑抽奖奖品
export function fetchPrizeEdit(data) {
  return request({
    url: '/xxkd/draw/prize/edit',
    method: 'post',
    data
  })
}


// 每日签到奖励列表
export function fetchSignList(data) {
  return request({
    url: '/xxkd/sign/reward/list',
    method: 'post',
    data
  })
}

// 编辑每日签到奖励
export function fetchSignEdit(data) {
  return request({
    url: '/xxkd/sign/reward/edit',
    method: 'post',
    data
  })
}

// 文玩仓库扩容配置列表
export function fetchWarehouseList(data) {
  return request({
    url: '/xxkd/warehouse/expansion/list',
    method: 'post',
    data
  })
}

// 新增文玩仓库扩容配置
export function fetchWarehouseAdd(data) {
  return request({
    url: '/xxkd/warehouse/expansion/add',
    method: 'post',
    data
  })
}

// 编辑文玩仓库扩容配置
export function fetchWarehouseEdit(data) {
  return request({
    url: '/xxkd/warehouse/expansion/edit',
    method: 'post',
    data
  })
}