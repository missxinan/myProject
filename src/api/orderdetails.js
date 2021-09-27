import request from '@/utils/request'

export function orderdetaillist(data) {
    return request({
        url: '/management/order/order/detail',
        method: 'post',
        data
    })
}

export function orderdetaillistactionId(data) {
    return request({
        url: '/management/order/order/orderDetail',
        method: 'post',
        data
    })
}
//取消订单
export function ordercloseOrder(data) {
    return request({
        url: '/management/order/order/closeOrder',
        method: 'post',
        data
    })
}
//发布
export function carrierlist(data) {
    return request({
        url: '/management/carrier/allList',
        method: 'post',
        data
    })
}
//
export function deliverGoods(data) {
    return request({
        url: '/management/order/order/deliverGoods',
        method: 'post',
        data
    })
}
// setRemark
export function setRemark(data) {
    return request({
        url: '/management/order/order/editRemark',
        method: 'post',
        data
    })
}
// backMoney{}
export function backMoney(data) {
    return request({
        url: '/management/order/order/backMoney',
        method: 'post',
        data
    })
}