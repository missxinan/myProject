import request from '@/utils/request'

export function sortlist(data) {
    return request({
        url: '/management/category/list',
        method: 'post',
        data
    })
}

export function allsortlist(data) {
    return request({
        url: '/management/category/allList',
        method: 'post',
        data
    })
}

export function categoryadd(data) {
    return request({
        url: '/management/category/add',
        method: 'post',
        data
    })
}