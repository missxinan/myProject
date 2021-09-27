import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/management/role/allList',
    method: 'post'
  })
}

export function getRoles(data) {
  return request({
    url: '/management/role/list',
    method: 'post',
		data
  })
}

export function addRole(data) {
  return request({
    url: '/management/role/add',
    method: 'post',
    data
  })
}

export function detailRole(data) {
	return request({
	  url: '/management/role/detail',
	  method: 'post',
	  data
	})
  }
  

export function updateRole(data) {
  return request({
    url: '/management/role/edit',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/management/user/del',
    method: 'post',
		data
  })
}

export function department(){
	return request({
	  url: '/management/dept/allList',
	  method: 'post',
	})
}
///management/menu/allListmenuTreeAddmenuTreeDelete
export function menuTreeLis(data){
	return request({
	  url: '/management/menu/list',
	  method: 'post',
		data
	})
}
export function menuTreeAdd(data){
	return request({
	  url: '/management/menu/add',
	  method: 'post',
		data
	})
}
export function menuTreeDelete(data){
	return request({
	  url: '/management/menu/del',
	  method: 'post',
		data
	})
}


export function menuTreeList(data){
	return request({
	  url: '/management/menu/allList',
	  method: 'post',
		data
	})
}



export function allMenuListTree(data){
	return request({
	  url: '/management/menu/allMenuList',
	  method: 'post',
		data
	})
}

export function deleteRoleById(data){
	return request({
	  url: '/management/role/del',
	  method: 'post',
		data
	})
}
export function getUserDetail(data){
	return request({
	  url: '/management/user/detail',
	  method: 'post',
		data
	})
}


