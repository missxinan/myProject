import request from '@/utils/request'

export function getCategoryList() {
  return request({
    url: '/seller/store/category/list',
    method: 'post'
  })
}

export function shelvesGoods(data){
  return request({
    url: '/seller/store/goods/release',
    method: 'post',
    data
  })
}
