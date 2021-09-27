import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/management/rule/list',
        method: 'post',
        data
    })
}
export function addRule(data) {
    return request({
        url: '/management/rule/add',
        method: 'post',
        data
    })
}

export function editRule(data) {
    return request({
        url: '/management/rule/edit',
        method: 'post',
        data
    })
}

export function delRule(data) {
    return request({
        url: '/management/rule/del',
        method: 'post',
        data
    })
}
// H5 列表页
export function h5ManageList(data) {
    return request({
        url: '/management/h5Manage/list',
        method: 'post',
        data
    })
}
//添加H5
export function h5ManageAdd(data) {
    return request({
        url: '/management/h5Manage/add',
        method: 'post',
        data
    })
}
//修改H5
export function h5ManageEdit(data) {
    return request({
        url: '/management/h5Manage/edit',
        method: 'post',
        data
    })
}
//删除H5
export function h5ManageDel(data) {
    return request({
        url: '/management/h5Manage/del',
        method: 'post',
        data
    })
}

//启用/禁用 H5
export function h5ManageStatus(data) {
    return request({
        url: '/management/h5Manage/updateStatus',
        method: 'post',
        data
    })
}

//校验名称是否存在
export function h5ManageCheckName(data) {
    return request({
        url: '/management/h5Manage/checkH5Name',
        method: 'post',
        data
    })
}

//获取所有H5
export function h5ManageGetAllList(data) {
    return request({
        url: '/management/h5Manage/allList',
        method: 'post',
        data
    })
}

//获取所有
export function h5ManageGetDetail(data) {
    return request({
        url: '/management/h5Manage/detail',
        method: 'post',
        data
    })
}
