import request from '@/utils/request'

export function orderlist(params) {
    return request({
        url: '/management/order/order/list',
        method: 'post',
        params
    })
}
export function orderCountMoney(params) {
    return request({
        url: '/management/order/order/countMoney',
        method: 'post',
        params
    })
}
