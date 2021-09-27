/* eslint-disable no-mixed-spaces-and-tabs */
import request from '@/utils/request'
import requestImg from '@/utils/requestImg'
// import qs from 'qs'

// 请求列表
export function fetchList(data) {
  return request({
    url: '/management/memberUserList/list',
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
export function usersDetail(data) {
  return request({
    url: '/management/member/detail',
    method: 'post',
    data
  })
}

// fansList
export function fansList(data) {
  return request({
    url: '/management/memberUserList/myFans',
    method: 'post',
    data
  })
}
// delToken
export function delToken(data) {
  return request({
    url: '/management/memberUserList/delToken',
    method: 'post',
    data
  })
}
// 用户禁用启用
export function usersForbidden(data){
	return request({
	  url: '/management/memberUserList/forbidden',
	  method: 'post',
	  data
	})
}
// 用户余额积分查询moneyDetail
export function moneyDetail(data){
	return request({
	  url: '/management/memberUserList/balanceAndIntegral',
	  method: 'post',
	  data
	})
}
// 修改management/memberUserList/editAmount
export function moneyEdit(data){
	return request({
	  url: '/management/memberUserList/editAmount',
	  method: 'post',
	  data
	})
}
//integralEdit
export function integralEdit(data){
	return request({
	  url: '/management/memberUserList/editIntegral',
	  method: 'post',
	  data
	})
}
// integralUp
export function integralUp(data){
	return request({
	  url: '/management/memberUserList/excelUserList',
	  method: 'post',
	  data
	})
}
//uploadFileList
export function uploadImgFile(data) {
    return requestImg({
        url: '/oss/uploadFileList',
        method: 'post',
        data
    })
}
// 加入黑名单blacklist
export function blacklist(data) {
    return request({
        url: '/management/memberUserList/editBlacklist',
        method: 'post',
        data
    })
}
// 用户资金明细moneyList
export function moneyList(data) {
    return request({
        url: '/management/memberUserList/myAmount',
        method: 'post',
        data
    })
}
// 获取用户金额getUserMoney
export function getUserMoney(data) {
    return request({
        url: '/management/memberUserList/getMyMoneyByUserId',
        method: 'post',
        data
    })
}

//个人管理中用户详情接口  个人信息接口
export function getUserDetail(data) {
  return request({
      url: '/management/member/personInfo',
      method: 'post',
      data
  })
}
//个人管理中用户详情接口  实名信息接口
export function getUserRealInfo(data) {
  return request({
      url: '/management/member/getPersonByUserId',
      method: 'post',
      data
  })
}
//个人管理中用户详情接口  资产统计接口
export function getMyMoneyByUserId(data) {
  return request({
      url: '/management/memberUserList/getMyMoneyByUserId',
      method: 'post',
      data
  })
}
//个人管理中用户详情接口  积分统计接口
export function myTotalIntegrate(data) {
  return request({
      url: '/management/member/myTotalIntegrate',
      method: 'post',
      data
  })
}

//个人管理中用户详情接口  行为记录接口
export function auctionRecord(data) {
  return request({
      url: '/management/member/auctionRecord',
      method: 'post',
      data
  })
}
//个人管理中用户详情接口  收支明细上面的接口
export function getMyMoneymmm(data) {
  return request({
      url: '/management/memberUserList/getMyMoneyByUserId',
      method: 'post',
      data
  })
}

//个人管理中  积分记录接口integral
export function integralRecord(data) {
  return request({
      url: '/management/member/integral/list',
      method: 'post',
      data
  })
}
// 超级积分记录
export function superIntegralRecordApi(data) {
  return request({
      url: '/management/member/superIntegral/list',
      method: 'post',
      data
  })
}

//个人管理中  用户详细中收货地址接口
export function receivingAddressList(data) {
  return request({
      url: '/management/member/addressList',
      method: 'post',
      data
  })
}
//个人管理中  出价记录接口
export function bidList(data) {
  return request({
      url: '/management/member/bid/list',
      method: 'post',
      data
  })
}
//个人管理中  异常操作记录接口
export function abnormalOps(data) {
  return request({
      url: '/management/abnormalOps/list',
      method: 'post',
      data
  })
}
//个人管理中  异常操作记录详情接口
export function abnormalOpsDetail(data) {
  return request({
      url: '/management/abnormalOps/detail',
      method: 'post',
      data
  })
}
export function getSysConfig(data) {
  return request({
    url: '/management/sysConfig/getValue',
    method: 'post',
	  data
  })
}
// 用户累计直属见属fansListNumApi
export function fansListNumApi(data) {
  return request({
    url: '/management/memberUserList/fansNumVo',
    method: 'post',
	  data
  })
}
// 分库分表后统计用户收支明细
export function getcomputerMoney(data) {
  return request({
    url: '/management/memberUserList/statisticsAllMemberMoney',
    method: 'post',
	  data
  })
}
// 注册渠道列表 添加 修改 删除
export function registerListApi(data) {
  return request({
    url: '/management/h5RegisterChannel/list',
    method: 'post',
	  data
  })
}
export function registerAddApi(data) {
  return request({
    url: '/management/h5RegisterChannel/add',
    method: 'post',
	  data
  })
}
export function registerEditApi(data) {
  return request({
    url: '/management/h5RegisterChannel/edit',
    method: 'post',
	  data
  })
}
export function registerAllListApi(data) {
  return request({
    url: '/management/h5RegisterChannel/allList',
    method: 'post',
	  data
  })
}
// 添加虚拟用户
export function addRobotApi(data) {
  return request({
    url: '/management/member/addRobot',
    method: 'post',
	  data
  })
}
// 修改虚拟用户
export function robotEditApi(data) {
  return request({
    url: '/management/member/editRobot',
    method: 'post',
	  data
  })
}
// 拍客领袖
export function isLeaderLists(data) {
  return request({
    url: '/management/leaderLog/list',
    method: 'post',
	  data
  })
}
// 添加/修改拍客领袖
export function isLeaderSaveOrUpdate(data) {
  return request({
    url: '/management/leaderLog/saveOrUpdate',
    method: 'post',
	  data
  })
}
// 赠送芒果
export function givingMango(data) {
  return request({
    url: '/management/member/giving',
    method: 'post',
	  data
  })
}