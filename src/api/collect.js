import request from '@/utils/request'
// 请求资讯列表
export function fetchCollectList(data) {
  return request({
    url: '/collection/collector/enroll/page',
    method: 'post',
    data
  })
}
//修改资讯列表状态
export function updataStatus(data) {
  return request({
    url: '/collection/collector/enroll/edit',
    method: 'post',
    data
  })
}
//获取个人馆列表---上传商品选择个人馆
export function fetchMallList(data) {
  return request({
    url: '/management/mallInfo/allListName',
    method: 'post',
    data
  })
}


//个人收藏馆列表
export function fetchPersonalMallList(data) {
  return request({
    url: '/collection/personal/page',
    method: 'post',
    data
  })
}

//新增个人收藏馆
export function addPersonalMallList(data) {
  return request({
    url: '/collection/personal/add',
    method: 'post',
    data
  })
}

//编辑个人收藏馆
export function editPersonalMallList(data) {
  return request({
    url: '/collection/personal/edit',
    method: 'post',
    data
  })
}

//删除个人收藏馆
export function delPersonalMallList(data) {
  return request({
    url: '/collection/personal/del',
    method: 'post',
    data
  })
}