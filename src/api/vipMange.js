import request from '@/utils/request'
import requestImg from '@/utils/requestImg'
import qs from 'qs'

// ==================等级管理========S========================================
// vip等级列表
export function vipLevelList(data) {
  return request({
    url: `/management/vipLevel/list`,
    method: 'post',
    data
  })
}

// vip等级列表详情
export function vipLevelDetail(data) {
  return request({
    url: `/management/vipLevel/detail`,
    method: 'post',
    data
  })
}

// vip等级列表编辑
export function vipLevelEdit(data) {
  return request({
    url: `/management/vipLevel/edit`,
    method: 'post',
    data
  })
}
// /127.0.0.1:8801/management/vipLevel/add
// vip等级列表添加
export function vipLevelAdd(data) {
  return request({
    url: `/management/vipLevel/add`,
    method: 'post',
    data
  })
}
// ===================等级管理========N========================================


// ==================房间管理========S========================================
// vip房间列表
export function vipRoomMangeList(data) {
  return request({
    url: `/management/vipRoom/list`,
    method: 'post',
    data
  })
}

// vip房间列表详情
export function vipRoomMangeDetail(data) {
  return request({
    url: `/management/vipRoom/detail`,
    method: 'post',
    data
  })
}

  // vip房间列表修改接口
export function roomManagementEdit(data) {
  return request({
    url: `/management/vipRoom/edit`,
    method: 'post',
    data
  })
}

 // vip房间列表开启禁用房间
 export function roomManagementOpenAndDisable(data) {
  return request({
    url: `/management/vipRoom/updateOpenStatus`,
    method: 'post',
    data
  })
}

// vip房间列表重置密码
export function roomManagementResetPassword(data) {
  return request({
    url: `/management/vipRoom/resetPassword`,
    method: 'post',
    data
  })
}

// vip房间管理--->查看拍品页面路由（竞价活动列表）

export function viewTheAuctionList(data) {
  return request({
    url: `/management/order/auctionRecordInfo/list`,
    method: 'post',
    data
  })
}
// vip房间管理--->查看拍品-->新增拍卖
// export function newAddAuction(data) {
//   return request({
//     url: `/management/order/auctionRecordInfo/add`,
//     method: 'post',
//     data
//   })
// }
// vip房间管理--->查看拍品-->新增拍卖-->选择商品
// export function selectGoods(data) {
//   return request({
//     url: `/management/goodsInfo/list`,
//     method: 'post',
//     data
//   })
// }

// 商品数据
export function treeApi() {
  return request({
      url: '/management/category/allList',
      method: 'post',
  })
}


//  机器人禁用 启动
export function updateOpendRobot(data) {
  return request({
      url: '/management/order/auctionRecordInfo/updateOpendRobot',
      method: 'post',
      data,
  })
}

//  关闭拍卖
export function closeAuction(data) {
  return request({
      url: '/management/order/auctionRecordInfo/close',
      method: 'post',
      data,
  })
}
//  修改保护价
export function editProtectPrice(data) {
  return request({
      url: '/management/order/auctionRecordInfo/editProtectPrice',
      method: 'post',
      data,
  })
}
//房间管理中   查看
export function auctionRecordInfodetail(data) {
  return request({
      url: '/management/order/auctionRecordInfo/detail',
      method: 'post',
      data
  })
}

// ==================房间管理========N========================================

// ==================房主管理========S========================================
  // vip房主列表
  export function viphouseOwnerManageList(data) {
    return request({
      url: `/management/vip/list`,
      method: 'post',
      data
    })
  }
  // vip房主新增
  export function vipHouseOwnerAdd(data) {
    return request({
      url: `/management/vip/add`,
      method: 'post',
      data
    })
  }
  // vip房主修改
  export function vipHouseOwnerEdit(data) {
    return request({
      url: `/management/vip/edit`,
      method: 'post',
      data
    })
  }
  // vip房主详细
  export function vipHouseOwnerDetail(data) {
    return request({
      url: `/management/vip/detail`,
      method: 'post',
      data
    })
  }

  // vip房主禁用启用
  export function vipHouseOwnerDisableAndEnable(data) {
    return request({
      url: `/management/vip/updateOpenStatus`,
      method: 'post',
      data
    })
  }

  // vip房间重置密码
  export function vipHouseOwnerResetPassword(data) {
    return request({
      url: `/management/vip/resetPassword`,
      method: 'post',
      data
    })
  }

  // vip房主房间新增
  export function vipHouseAdd(data) {
    return request({
      url: `/management/vipRoom/add`,
      method: 'post',
      data
    })
  }
  
  // vip房主房间获取下次编号
  export function getNextNumber(data) {
    return request({
      url: `/management/vipRoom/getNextNumber`,
      method: 'post',
      data
    })
  }
// ==================房主管理========N========================================
export function getSystemTime(data) {
  return request({
    url: '/management/sysConfig/getValue',
    method: 'post',
    data
  })
}
// 店铺管理列表中的查看密码
export function getPassword(data) {
  return request({
    url: '/management/vipRoom/getPassword',
    method: 'post',
    data
  })
}
// =======================VIP商品库================================
// 旗舰店商品库
export function vipLibraryOfGoods(data) {
  return request({
    url: '/management/vipGoodsInfo/list',
    method: 'post',
    data
  })
}
// 旗舰店拍卖增加
export function newAddAuction(data) {
  return request({
    url: '/management/order/auctionRecordInfo/addVipAuction',
    method: 'post',
    data
  })
}
//店铺列表商品库添加
export function vipLibraryOfGoodsAdd(data) {
  return request({
    url: `/management/vipGoodsInfo/add`,
    method: 'post',
    data
  })
}

//店铺列表商品库修改
export function vipLibraryOfGoodsEdit(data) {
  return request({
    url: `/management/vipGoodsInfo/edit`,
    method: 'post',
    data
  })
}

// 店铺商品库详情
export function vipLibraryOfGoodsDetails(data) {
  return request({
    url: '/management/vipGoodsInfo/detail',
    method: 'post',
    data
  })
}

// 店铺商品库上架
export function upperGoodsInfo(data) {
  return request({
    url: '/management/vipGoodsInfo/upperBatch',
    method: 'post',
    data
  })
}

// 店铺商品库下架
export function downGoodsInfo(data) {
  return request({
    url: '/management/vipGoodsInfo/downBatch',
    method: 'post',
    data
  })
}

// 修改旗舰店商品库库存
export function settingSort(data) {
  return request({
    url: '/management/vipGoodsInfo/editInventory',
    method: 'post',
    data
  })
}

// 关闭竞拍

export function closeGoodsInfo(data) {
  return request({
    url: '/management/vipGoodsInfo/closeGoodsInfo',
    method: 'post',
    data
  })
}

export function newroomManagementOpenAndDisable(data) {
  return request({
    url: '/management/vipRoom/updateOpenPassword',
    method: 'post',
    data
  })
}

// 店主收支明细
export function vipAccountDetail(data) {
  return request({
    url: '/management/vipAccountDetail/list',
    method: 'post',
    data
  })
}
// 店主收支明细 ---> 总金额 提现金额 余额
export function vipAccount(data) {
  return request({
    url: '/management/vipAccount/detail',
    method: 'post',
    data
  })
}
