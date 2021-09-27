import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/management/user/list',
        method: 'post',
        data
    })
}
export function fetchDepartmentList(data) {
    return request({
        url: '/management/dept/list',
        method: 'post',
        data
    })
}

export function goodsinfolists(data) {
    return request({
        url: '/management/goodsInfo/list',
        method: 'post',
        data
    })
}

export function fetchArticle(id) {
    return request({
        url: '/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/article/pv',
        method: 'get',
        params: { pv }
    })
}

export function createArticle(data) {
    return request({
        url: '/management/user/add',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/management/user/update',
        method: 'post',
        data
    })
}


export function updateUser(data) {
    return request({
        url: '/management/user/edit',
        method: 'post',
        data
    })
}

export function resetPassword(data) {
    return request({
        url: '/management/user/resetPassword',
        method: 'post',
        data
    })
}