import request from '@/utils/request'

export function carrierlist(data) {
    return request({
        url: '/management/carrier/list',
        method: 'post',
        data
    })
}

export function carrieradd(data) {
    return request({
        url: '/management/carrier/add',
        method: 'post',
        data
    })
}

export function carrieredit(data) {
    return request({
        url: '/management/carrier/edit',
        method: 'post',
        data
    })
}