import request from '@/utils/request'
//获取邀请排行榜列表
export function fetchList(data) {
  return request({
    url: '/invite/record/operation/page',
    method: 'post',
    data
  })
}
//添加邀请数据
export function inviteInfoAdd(data) {
	return request({
	  url: '/invite/record/operation/save',
	  method: 'post',
	  data
	})
}
//编辑邀请数据
export function inviteInfoUpdate(data) {
	return request({
	  url: '/invite/record/operation/update',
	  method: 'post',
	  data
	})
}
//删除邀请数据
export function inviteInfoDelete(data) {
	return request({
	  url: '/invite/record/operation/delete',
	  method: 'post',
	  data
	})
}
//修改数据状态
export function inviteInfoStatus(data) {
	return request({
	  url: '/invite/record/operation/status',
	  method: 'post',
	  data
	})
}