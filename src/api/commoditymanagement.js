import request from '@/utils/request'
// 商品列表
export function goodsInfolist(data) {
    return request({
        url: '/management/goodsInfo/list',
        method: 'post',
        data
    })
}
// /management/goodsInfo/downGoodsInfo
//下架
export function downGoodsInfo(data) {
    return request({
        url: '/management/goodsInfo/downGoodsInfo',
        method: 'post',
        data
    })
}
//调序
export function settingSort(data) {
    return request({
        url: '/management/goodsInfo/settingSort',
        method: 'post',
        data
    })
}
//调序
export function supplierList(data) {
    return request({
        url: '/management/supplierInfo/allList',
        method: 'post',
        data
    })
}