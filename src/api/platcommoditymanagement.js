import request from '@/utils/request'
// 商品列表
export function goodsInfolist(data) {
    return request({
        url: '/management/goodsInfo/list',
        method: 'post',
        data
    })
}
// 寄拍商品列表
export function auctionInfolist(data) {
    return request({
        url: '/management/goodsInfo/up/list',
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
//上上
export function upperGoodsInfo(data) {
    return request({
        url: '/management/goodsInfo/upperGoodsInfo',
        method: 'post',
        data
    })
}
//调序
export function settingSort(data) {
    return request({
        url: '/management/goodsInfo/editInventory',
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
//management/goodsInfo/detail
export function goodsInfoDetail(data) {
    return request({
        url: '/management/goodsInfo/detail',
        method: 'post',
        data
    })
}
export function editGoods(data) {
    return request({
        url: '/management/goodsInfo/edit',
        method: 'post',
        data
    })
}
//management/goodsInfo/closeGoodsInfo
export function closeGoodsInfo(data) {
    return request({
        url: '/management/goodsInfo/closeGoodsInfo',
        method: 'post',
        data
    })
}
// 批量上架批量下架
export function batchUpperGoodsInfo(data) {
    return request({
        url: '/management/goodsInfo/batchUpperGoodsInfo',
        method: 'post',
        data
    })
}
export function batchDownGoodsInfo(data) {
    return request({
        url: '/management/goodsInfo/batchDownGoodsInfo',
        method: 'post',
        data
    })
}