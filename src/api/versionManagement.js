//版本管理
import request from '@/utils/request'
/**
 * 管理列表
 */
export function versionlist(data) {
    return request({
        url: '/management/versionInfo/list',
        method: 'post',
        data
    })
}
/**新增管理 */
export function addversion(data) {
    return request({
        url: '/management/versionInfo/add',
        method: 'post',
        data
    })
}
/**删除管理 */
export function deletversion(data) {
    return request({
        url: '/management/versionInfo/del',
        method: 'post',
        data
    })
}
/**开关管理 */
export function versioninfoopen(data) {
    return request({
        url: '/management/versionInfo/switchs',
        method: 'post',
        data
    })
}

/**根据id获取详情 */
export function versionDetails(row) {
  return request({
    url: '/management/versionInfo/getById',
    method: 'get',
    params: { verId:row.verId},
    // data
  })
}

/**版本修改 */
export function versionEdit(data) {
  return request({
    url: '/management/versionInfo/edit',
    method: 'post',
    data
  })
}
