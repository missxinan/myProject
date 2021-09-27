import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/table/list',
        method: 'get',
        params
    })
}

export function settingSort(params) {
    return request({
        url: '/management/goodsInfo/settingSort',
        method: 'post',
        params
    })
}

export function activityOrder(params) {
    return request({
        url: '/management/activityOrder/list/bag',
        method: 'post',
        params
    })
}