import request from '@/utils/request'
// 获取所有Todolist
export function allList() {
  return request({
    url: '/management/markupRule/allList',
    method: 'post'
  })
}
// 编辑
export function edit(data) {
  return request({
    url: '/management/markupRule/edit',
    method: 'post',
    data
  })
}
// base64图片上传接口

export function base64picture(data) {
  return request({
    url: '/oss/upload',
    method: 'post',
    data
  })
}

export function goodsInfoedit(data) {
  return request({
    url: '/management/goodsInfo/edit',
    method: 'post',
    data
  })
}

export function upperGoodsInfo(data) {
  return request({
    url: '/management/goodsInfo/upperGoodsInfo',
    method: 'post',
    data
  })
}
// 添加规则
export function add(data) {
  return request({
    url: '/management/markupRule/add',
    method: 'post',
    data
  })
}

export function goodsInfoadd(data) {
  return request({
    url: '/management/goodsInfo/add',
    method: 'post',
    data
  })
}

export function goodsInfoaddlist(data) {
  return request({
    url: '/management/goodsInfo/detail',
    method: 'post',
    data
  })
}
