import request from '@/utils/request'
// 请求列表
export function fetchNoticeList(data) {
  return request({
    url: '/management/announcement/list',
    method: 'post',
    data
  })
}

// 删除公告 
export function noticeDel(data) {
  return request({
    url: '/management/announcement/del',
    method: 'post',
    data
  })
}
// 公告详情 management/banner/detail
export function noticeDetail(data) {
  return request({
    url: '/management/announcement/info',
    method: 'post',
    data
  })
}
// 编辑
export function noticeEdit(data) {
  return request({
    url: '/management/announcement/edit',
    method: 'post',
    data
  })
}
// 公告新增
export function noticeAdd(data) {
  return request({
    url: '/management/announcement/add',
    method: 'post',
    data
  })
}
// 修改状态
export function noticeStatus(data) {
	return request({
	  url: '/management/announcement/send',
	  method: 'post',
	  data
	})
}

// app推送
export function pushNotice(data) {
	return request({
	  url: '/management/announcement/push',
	  method: 'post',
	  data
	})
}