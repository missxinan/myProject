import request from '@/utils/request'

export function getDepartment(data) {
  return request({
    url: '/management/dept/list',
    method: 'post',
		data
  })
}


export function deleteDepartment(data) {
  return request({
    url: '/management/dept/del',
    method: 'post',
		data
  })
}


export function addDepartment(data) {
  return request({
    url: '/management/dept/add',
    method: 'post',
		data
  })
}

export function updateDepart(data) {
  return request({
    url: '/management/dept/edit',
    method: 'post',
		data
  })
}


 


