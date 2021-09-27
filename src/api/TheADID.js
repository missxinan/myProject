import request from '@/utils/request'

export function bannerPosition(params) {
    return request({
        url: '/management/bannerPosition/list',
        method: 'post',
        params
    })
}