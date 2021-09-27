import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authentication/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/management/user/loginOut',
    method: 'post'
  })
}
export function sureUpdatePwd(data) {
  return request({
    url: '/management/user/editPassword',
    method: 'post',
	data
  })
}

export function abnormalOpsDetail(data) {
  return request({
    url: '/management/abnormalOps/detail',
    method: 'post',
	data
  })
}
