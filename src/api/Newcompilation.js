import requestImg from '@/utils/requestImg'
import request from '@/utils/request'
export function uploadFileList(data) {
    return requestImg({
        url: '/oss/uploadFileList',
        method: 'post',
        data
    })
}

export function categoryedit(data) {
    return request({
        url: '/management/category/edit',
        method: 'post',
        data
    })
}


export function inputOnchange(data) {
    return request({
        url: '/management/sysConfig/getValue',
        method: 'post',
        data
    })
}

export function categorydel(data) {
    return request({
        url: '/management/category/del',
        method: 'post',
        data
    })
}
//