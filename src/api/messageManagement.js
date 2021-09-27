//消息管理
import request from '@/utils/request'
/**
 * 消息列表
 */
// export function messagelist(data) {
//     return request({
//         url: '/management/messagePush/list',
//         method: 'post',
//         data
//     })
// }
/**新增消息 */
// export function addmessage(data) {
//     return request({
//         url: '/management/messagePush/add',
//         method: 'post',
//         data
//     })
// }
/**删除消息 */
// export function deletmessage(data) {
//     return request({
//         url: '/management/messagePush/del',
//         method: 'post',
//         data
//     })
// }
/**推送消息 */
// export function pushmessage(data) {
//     return request({
//         url: '/management/messagePush/push',
//         method: 'post',
//         data
//     })
// }

/**
//  * 消息列表
//  */
export function messagelist(data) {
    return request({
        url: '/management/pushMessage/list',
        method: 'post',
        data
    })
}
// /**新增消息 */
export function addmessage(data) {
    return request({
        url: '/management/pushMessage/add',
        method: 'post',
        data
    })
}

// /**编辑消息 */
export function editMessageApi(data) {
    return request({
        url: '/management/pushMessage/edit',
        method: 'post',
        data
    })
}
// /**删除消息 */
export function deletmessage(data) {
    return request({
        url: '/management/pushMessage/del',
        method: 'post',
        data
    })
}
// /**推送消息 */
export function pushmessage(data) {
    return request({
        url: '/management/messagePush/push',
        method: 'post',
        data
    })
}