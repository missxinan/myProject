import request from '@/utils/request'
export function activityGoodsAdd(data) {
  return request({
    url: '/management/activityGoodsInfo/add',
    method: 'post',
    data
  })
}
 export function activityForbApi(data) {
    return request({
      url: '/management/activityGoodsInfo/change',
      method: 'post',
      data
    })
  }
  export function goodsInfoDetail(data) {
     return request({
       url: '/management/activityGoodsInfo/detail',
       method: 'post',
       data
     })
   }
   export function editGoods(data) {
     return request({
       url: '/management/activityGoodsInfo/edit',
       method: 'post',
       data
     })
   }
export function activityListApi(data) {
  return request({
    url: '/management/activity/list',
    method: 'post',
    data
  })
}
// 活动添加
export function activityAddApi(data) {
  return request({
    url: '/management/activity/add',
    method: 'post',
    data
  })
}
 export function activityEditApi(data) {
    return request({
      url: '/management/activity/edit',
      method: 'post',
      data
    })
  }
  export function activityCodeDetailApi(data) {
    return request({
      url: '/management/activityCode/list ',
      method: 'post',
      data
    })
  }
  export function activityOrderApi(data) {
    return request({
      url: '/management/activityOrder/list',
      method: 'post',
      data
    })
  }
// sendGoodsApi
 export function sendGoodsApi(data) {
    return request({
      url: '/management/activityOrder/deliverGoods',
      method: 'post',
      data
    })
  }
  // anagement/activity/edit
  export function activityDetailApi(data) {
     return request({
       url: '/management/activity/list',
       method: 'post',
       data
     })
   }
//修改活动状态
  export function activityChangeStatus(data) {
     return request({
       url: '/management/activity/send',
       method: 'post',
       data
     })
   }
//获取活动详情
 export function activityInfo(data) {
	return request({
	  url: '/management/activity/info',
	  method: 'post',
	  data
	})
  }
//编辑活动
 export function activityEditInfo(data) {
	return request({
	  url: '/management/activity/edit',
	  method: 'post',
	  data
	})
  }
//新增活动
 export function activityNewAdd(data) {
	return request({
	  url: '/management/activity/add',
	  method: 'post',
	  data
	})
  }
  
//删除活动
 export function activityDelete(data) {
	return request({
	  url: '/management/activity/del',
	  method: 'post',
	  data
	})
  }
  
//活动订单
export function activityOrderList(data) {
	return request({
	  url: '/management/activityOrder/list',
	  method: 'post',
	  data
	})
}

//活动商品列表
export function activityGoodsList(data) {
	return request({
	  url: '/management/activityGoodsInfo/list',
	  method: 'post',
	  data
	})
}

//活动商品上下架
export function activityGoodsStatusChange(data) {
	return request({
	  url: '/management/activityGoodsInfo/send',
	  method: 'post',
	  data
	})
}

//新增活动商品
export function activityGoodsNewAdd(data) {
	return request({
	  url: '/management/activityGoodsInfo/add',
	  method: 'post',
	  data
	})
}

//删除活动商品
export function activityGoodsDelete(data) {
	return request({
	  url: '/management/activityGoodsInfo/del',
	  method: 'post',
	  data
	})
}

//活动商品详情
export function activityGoodsInfo(data) {
	return request({
	  url: '/management/activityGoodsInfo/info',
	  method: 'post',
	  data
	})
}

//修改活动商品
export function activityGoodsEdit(data) {
	return request({
	  url: '/management/activityGoodsInfo/edit',
	  method: 'post',
	  data
	})
}


//获取正在进行的活动列表
export function activityUnderwayList(data) {
	return request({
	  url: '/management/activity/underway',
	  method: 'post',
	  data
	})
}