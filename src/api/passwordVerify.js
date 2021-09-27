import request from '@/utils/request'
import qs from 'qs'

export function passwordVerify(data) {
    return request({
      url: '/management/user/isChangePassWord',
      method: 'post',
      data
    })
  }