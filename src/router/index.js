
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import componentsRouter from './modules/yxCompont'
import Layout from '@/layout'

export const constantRoutes = [{
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () =>
        import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'index',
        affix: true
      }
    }]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu',
    children: [{
      path: 'menu',
      name: 'menu',
      component: () =>
        import('@/views/menu/index'),
      meta: {
        title: '菜单管理',
        icon: 'dashboard'
      }
    }]
  },
  // 商品管理
  {
    path: '/storeManagement',
    component: Layout,
    redirect: '/storeManagement/commodity',
    name: 'storeManagement',
    meta: {
      title: '商品管理',
      icon: 'example'
    },
    children: [{
        path: 'commodityList',
        name: 'commodityList',
        component: () =>
          import('@/views/storeManagement/commodity/list/index'),
        meta: {
          title: '寄拍商品列表',
          keepAlive: true, // 需要被缓存
          isUseCache: false
        },
        hidden: true
      },
      {
        path: 'commodityListDetail',
        name: 'commodityListDetail',
        component: () =>
          import('@/views/storeManagement/commodity/list/detail'),
        meta: {
          title: '寄拍商品详情',
          keepAlive: true, // 需要被缓存
          isUseCache: false
        },
        hidden: true
      },
      {
        path: 'productiondetail',
        name: 'productiondetail',
        component: () =>
          import('@/views/storeManagement/commodity/productiondetail/index'),
        meta: {
          title: '新增/编辑商品'
        },
        hidden: true
      },
      {
        path: 'classification',
        name: 'classification',
        meta: {
          title: '拍卖分类管理'
        },
        component: () =>
          import('@/views/storeManagement/classification/index')
      }, {
        path: 'priceRule',
        name: 'priceRule',
        meta: {
          title: '加价规则'
        },
        component: () =>
          import('@/views/storeManagement/priceRule/index')
      }, {
        path: 'auctionsRecord',
        name: 'auctionsRecord',
        meta: {
          title: '拍卖记录'
        },
        redirect: '/storeManagement/auctionsRecord/auctionsRecordList',
        component: () =>
          import('@/views/storeManagement/auctionsRecord/index'),
        children: [{
          path: 'auctionsRecordList',
          name: 'auctionsRecordList',
          component: () =>
            import('@/views/storeManagement/auctionsRecord/list/index'),
          meta: {
            title: '拍卖记录'
          },
          hidden: true
        }, {
          path: 'auctionsRecordDetail',
          name: 'auctionsRecordDetail',
          component: () =>
            import('@/views/storeManagement/auctionsRecord/detail/index'),
          meta: {
            title: '拍卖详情'
          },
          hidden: true
        }]
      }
    ]
  },
  // 商城管理
  {
    path: '/mallManagement',
    component: Layout,
    redirect: '/mallManagement/mall',
    name: 'mallManagement',
    meta: {
      title: '商城管理',
      icon: 'example'
    },
    children: [
     {
        path: 'mallOrderDetail',
        name: 'mallOrderDetail',
        component: () =>
          import('@/views/mallManagement/mallOrder/detail'),
        meta: {
          title: '商城订单详情'
        },
        hidden: true
      },
	  {
	     path: 'auctionOrderDetail',
	     name: 'auctionOrderDetail',
	     component: () =>
	       import('@/views/mallManagement/auctionOrder/detail'),
	     meta: {
	       title: '寄拍订单详情'
	     },
	     hidden: true
	   },
     {
       path: 'mallOrderList',
       name: 'mallOrderList',
       component: () =>
         import('@/views/mallManagement/mallOrder/orderList'),
       meta: {
         title: '商城订单列表'
       },
       hidden: true
     },
     {
       path: 'auctionOrderList',
       name: 'auctionOrderList',
       component: () =>
         import('@/views/mallManagement/auctionOrder/orderList'),
       meta: {
         title: '寄拍订单列表'
       },
       hidden: true
     }
    ,{
      path: 'mall',
      name: 'mall',
      redirect: '/mallManagement/mall/mallList',
      meta: {
        title: '商城管理'
      },
      component: () =>
        import('@/views/mallManagement/mall/index'),
      children: [{
        path: 'mallList',
        name: 'mallList',
        component: () =>
          import('@/views/mallManagement/mall/list/index'),
        meta: {
          title: '商城商品列表'
        },
        hidden: true
      }, {
        path: 'mallAdd',
        name: 'mallAdd',
        component: () =>
          import('@/views/mallManagement/mall/add/index'),
        meta: {
          title: '新增/编辑商城商品'
        },
        hidden: true
      }, {
        path: 'mallDetail',
        name: 'mallDetail',
        component: () =>
          import('@/views/mallManagement/mall/detail/index'),
        meta: {
          title: '商城商品详情'
        },
        hidden: true
      }]
    }, {
      path: 'mallOrder',
      name: 'mallOrder',
      meta: {
        title: '商城订单管理'
      },
      component: () =>
        import('@/views/mallManagement/mallOrder/index'),
      children: [{
        path: 'mallOrderList',
        name: 'mallOrderList',
        component: () =>
          import('@/views/mallManagement/mallOrder/orderList'),
        meta: {
          title: '商城订单列表'
        },
        hidden: true
      }, {
        path: 'mallOrderDetail',
        name: 'mallOrderDetail',
        component: () =>
          import('@/views/mallManagement/mallOrder/detail'),
        meta: {
          title: '商城订单详情'
        },
        hidden: true
      }]
    }, 
	{
	  path: 'auctionOrder',
	  name: 'auctionOrder',
	  meta: {
	    title: '会员寄拍管理'
	  },
	  component: () =>
	    import('@/views/mallManagement/auctionOrder/index'),
	  children: [{
	    path: 'auctionOrderList',
	    name: 'auctionOrderList',
	    component: () =>
	      import('@/views/mallManagement/auctionOrder/orderList'),
	    meta: {
	      title: '寄拍订单列表'
	    },
	    hidden: true
	  }, {
	    path: 'auctionOrderDetail',
	    name: 'auctionOrderDetail',
	    component: () =>
	      import('@/views/mallManagement/auctionOrder/detail'),
	    meta: {
	      title: '寄拍订单详情'
	    },
	    hidden: true
	  }]
	},{
      path: 'vipOrder',
      name: 'viporderLists',
      meta: {
        title: '拍场订单管理'
      },
      redirect: '/mallManagement/vipOrder/vipOrderList',
      component: () =>
        import('@/views/mallManagement/vipOrder/index'),
      children: [{
        path: 'vipOrderList',
        name: 'viporderListss',
        component: () =>
          import('@/views/mallManagement/vipOrder/list/index'),
        meta: {
          title: '拍场订单列表'
        },
        hidden: true
      }, {
        path: 'vipOrderDetail',
        name: 'vipOrderDetail',
        component: () =>
          import('@/views/mallManagement/vipOrder/detail/index'),
        meta: {
          title: '拍场订单详情'
        },
        hidden: true
      }]
    }, {
      path: 'mailingCategory',
      name: 'mailingCategory',
      component: () =>
        import('@/views/mallManagement/mailingCategory/index'),
      meta: {
        title: '寄拍分类管理'
      }
    }, {
      path: 'exchangeCategory',
      name: 'exchangeCategory',
      component: () =>
        import('@/views/mallManagement/exchangeCategory/index'),
      meta: {
        title: '换购分类管理'
      }
    }]
  },
  // 订单管理
  {
    path: '/orderManagement',
    component: Layout,
    redirect: '/orderManagement/orderList',
    name: 'orderManagement',
    meta: {
      title: '订单管理'
    },
    children: [{
      path: 'orderList',
      name: 'orderListTag',
      component: () =>
        import('@/views/orderManagement/orderList/index'),
      meta: {
        title: '订单列表'
      }
    }, {
      path: 'expressManagement',
      name: 'expressManagement',
      component: () =>
        import('@/views/orderManagement/expressManagement/index'),
      meta: {
        title: '快递管理'
      }
    }, {
      path: 'detail',
      name: 'detail',
      component: () =>
        import('@/views/orderManagement/orderList/detail/index'),
      meta: {
        title: '订单详情'
      },
    }, {
      path: 'fukubukuro',
      name: 'fukubukuro',
      component: () =>
        import('@/views/orderManagement/fukubukuro/index'),
      meta: {
        title: '福袋订单'
      },
    }]
  },
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo',
    children: [{
      path: 'userInfo',
      name: 'userInfo',
      component: () =>
        import('@/views/userInfo/index'),
      meta: {
        title: '用户管理',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department',
    children: [{
      path: 'department',
      name: 'department',
      component: () =>
        import('@/views/department/index'),
      meta: {
        title: '部门管理',
        icon: 'nested'
      }
    }]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role',
    children: [{
      path: 'role',
      name: 'role',
      component: () =>
        import('@/views/role/index'),
      meta: {
        title: '角色管理',
        icon: 'nested'
      }
    }]
  },
  {
    path: '/parameter',
    component: Layout,
    redirect: '/parameter',
    children: [{
      path: 'parameter',
      name: 'parameter',
      component: () =>
        import('@/views/parameter/index'),
      meta: {
        title: '系统参数',
        icon: 'dashboard'
      }
    }]
  },
  //用户管理========S======
  {
    path: '/users',
    component: Layout,
    redirect: '/users',
    children: [{
        path: 'users',
        name: 'users',
        component: () =>
          import('@/views/users/index'),
        meta: {
          title: '用户管理',
          icon: 'dashboard'
        }
      },
      {
        path: 'robot',
        name: 'robot',
        component: () =>
          import('@/views/users/robot'),
        meta: {
          title: '虚拟用户'
        }
      },
      {
        path: 'moneyDetail',
        name: 'moneyDetail',
        component: () =>
          import('@/views/users/moneyDetail/index'),
        meta: {
          title: '资金明细'
        }
      },
      {
        path: 'userDetail',
        name: 'userDetail',
        component: () =>
          import('@/views/users/userDetail/index'),
        meta: {
          title: '用户详情'
        }
      },
      {
        path: 'userLeader',
        name: 'userLeader',
        component: () =>
          import('@/views/users/userLeader'),
        meta: {
          title: '领袖管理'
        }
      },
      {
        path: 'bidRecord',
        name: 'bidRecord',
        component: () =>
          import('@/views/users/bidRecord/index'),
        meta: {
          title: '出价记录'
        }
      },
      {
        path: 'DetailsOfreceiptsAndPayments',
        name: 'DetailsOfreceiptsAndPayments',
        component: () =>
          import('@/views/users/DetailsOfreceiptsAndPayments/index'),
        meta: {
          title: '收支明细'
        }
      },
      {
        path: 'integralRecord',
        name: 'integralRecord',
        component: () =>
          import('@/views/users/integralRecord/index'),
        meta: {
          title: '用户积分记录'
        }
      },
    ]
  },
   // H5页面管理路由  规则管理路由
   {
    path: '/rule',
    component: Layout,
    redirect: '/rule/index',
    children: [{
        path: 'rule',
        name: 'rule',
        component: () =>
          import('@/views/rule/index'),
        meta: {
          title: '规则管理',
          icon: 'dashboard'
        }
      },
    ]
  },
  {
    path: '/adverList',
    component: Layout,
    redirect: '/adverList/adver',
    name: 'adverList',
    meta: {
      title: '广告管理',
      icon: 'example'
    },
    children: [{
        path: 'adver',
        name: 'adver',
        component: () =>
          import('@/views/adver/index'),
        meta: {
          title: '广告管理',
          icon: 'nested'
        }
      },
      {
        path: 'adverLocal',
        name: 'adverLocal',
        component: () =>
          import('@/views/adverLocal/index'),
        meta: {
          title: '广告位管理',
          icon: 'nested'
        }
      },
      {
        path: 'notice',
        name: 'notice',
        component: () =>
          import('@/views/notice/index'),
        meta: {
          title: '公告管理',
          icon: 'nested'
        }
      }
    ]
  },
  {
    path: '/moneyList',
    component: Layout,
    redirect: '/moneyList/withdraw',
    name: 'moneyList',
    meta: {
      title: '财务管理',
      icon: 'example'
    },
    children: [{
        path: 'withdraw',
        name: 'withdraw',
        component: () =>
          import('@/views/withdraw/index'),
        meta: {
          title: '提现管理',
          icon: 'nested',
          noCache: false
        }
      },
      {
        path: 'accountLog',
        name: 'accountLog',
        component: () =>
          import('@/views/accountLog/index'),
        meta: {
          title: '充值列表',
          icon: 'nested',
          noCache: false
        }
      },
      {
        path: 'paymentStatistics',
        name: 'paymentStatistics',
        component: () =>
          import('@/views/paymentStatistics/index'),
        meta: {
          title: '付款统计',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/sellingSet',
    component: Layout,
    redirect: '/sellingSet/sellingRecord',
    meta: {
      title: '拍卖管理',
      icon: 'example'
    },
    children: [{
        path: 'sellingRecord',
        name: 'sellingRecord',
        component: () =>
          import('@/views/sellingSet/auctionsRecord/index'),
        meta: {
          title: '拍卖记录',
          icon: 'nested',
          noCache: false
        }
      },
      {
        path: 'sellingRecordDetail',
        name: 'sellingRecordDetail',
        component: () =>
          import('@/views/sellingSet/auctionsRecord/detail'),
        meta: {
          title: '拍卖记录',
          icon: 'nested',
          noCache: false
        }
      },
      {
        path: 'sellingRule',
        name: 'sellingRule',
        component: () =>
          import('@/views/sellingSet/priceRule/index'),
        meta: {
          title: '加价规则',
          icon: 'nested',
          noCache: false
        }
      },
      {
        path: 'vipAuditing',
        name: 'vipAuditing',
        component: () =>
          import('@/views/sellingSet/vipAuditing/index'),
        meta: {
          title: '拍场审核'
        }
      },
      {
        path: 'sellingArea',
        name: 'sellingArea',
        component: () =>
          import('@/views/sellingSet/sellingArea/index'),
        meta: {
          title: '拍卖区域'
        }
      },
    ]
  },//拼赚管理
  {
    path: '/spellSet',
    component: Layout,
    redirect: '/spellSet/spellRecord',
    meta: {
      title: '拼赚管理',
      icon: 'example'
    },
    children: [{
        path: 'spellRecord',
        name: 'spellRecord',
        component: () =>
          import('@/views/spellSet/spellRecord/index'),
        meta: {
          title: '拼赚管理',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'spellGroupRecord',
        name: 'spellGroupRecord',
        component: () =>
          import('@/views/spellSet/spellGroupRecord/index'),
        meta: {
          title: '拼团管理',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'spellOrderInfo',
        name: 'spellOrderInfo',
        component: () =>
          import('@/views/spellSet/spellOrderInfo/index'),
        meta: {
          title: '拼赚订单详情',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'spellInfoList',
        name: 'spellInfoList',
        component: () =>
          import('@/views/spellSet/spellInfoList/index'),
        meta: {
          title: '拼赚信息汇总',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'spellOrder',
        name: 'spellOrder',
        component: () =>
          import('@/views/spellSet/spellOrder/index'),
        meta: {
          title: '拼赚订单',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'spellOrderDetail',
        name: 'spellOrderDetail',
        component: () =>
          import('@/views/spellSet/spellOrder/spellDetail'),
        meta: {
          title: '参团详情',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'subscribeDetail',
        name: 'subscribeDetail',
        component: () =>
          import('@/views/spellSet/spellOrder/subscribeDetail'),
        meta: {
          title: '预约保底价详情',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },//直销数据管理
  {
    path: '/directSellingSet',
    component: Layout,
    redirect: '/directSellingSet/directSpellRecord',
    meta: {
      title: '直销管理',
      icon: 'example'
    },
    children: [{
        path: 'directSpellRecord',
        name: 'directSpellRecord',
        component: () =>
          import('@/views/directSellingSet/directSpellRecord/index'),
        meta: {
          title: '直销管理',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'operateDirectRecord',
        name: 'operateDirectRecord',
        component: () =>
          import('@/views/directSellingSet/operateDirectRecord/index'),
        meta: {
          title: '直销管理',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },//芒果卡管理
  {
    path: '/mangoCard',
    component: Layout,
    redirect: '/mangoCard/mangoCardList',
    meta: {
      title: '芒果卡管理',
      icon: 'example'
    },
    children: [{
        path: 'mangoCardList',
        name: 'mangoCardList',
        component: () =>
          import('@/views/mangoCard/mangoCardList/index'),
        meta: {
          title: '芒果卡管理',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },//代理商芒果卡管理
  {
    path: '/agentCard',
    component: Layout,
    redirect: '/agentCard/agentCardList',
    meta: {
      title: '代理商芒果卡',
      icon: 'example'
    },
    children: [{
        path: 'agentCardList',
        name: 'agentCardList',
        component: () =>
          import('@/views/agentCard/agentCardList/index'),
        meta: {
          title: '芒果卡管理',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/productionDetail',
    component: Layout,
    redirect: '/productionDetail',
    children: [{
      path: 'productionDetail',
      name: 'productionDetail',
      component: () =>
        import('@/views/productiondetail/index'),
      meta: {
        title: '商品详情',
        icon: 'dashboard'
      }
    }]
  },  //鉴定相关
  {
    path: '/identification',
    component: Layout,
    redirect: '/identification/appraiserList',
    meta: {
      title: '鉴定相关',
      icon: 'example'
    },
    children: [{
        path: 'appraiserList',
        name: 'appraiserList',
        component: () =>
          import('@/views/identification/appraiserList/index'),
        meta: {
          title: '鉴定师管理',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'classifyList',
        name: 'ClassifyList',
        component: () =>
          import('@/views/identification/classifyList/index'),
        meta: {
          title: '分类管理',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'identificationGoods',
        name: 'IdentificationGoods',
        component: () =>
          import('@/views/identification/identificationGoods/index'),
        meta: {
          title: '鉴定商品审核',
          icon: 'nested',
          noCache: false
        }
      },{
        path: 'identificationCheck',
        name: 'IdentificationCheck',
        component: () =>
          import('@/views/identification/identificationCheck/index'),
        meta: {
          title: '鉴定商品审核',
          icon: 'nested',
          noCache: false
        }
      }
    ]
  },//优惠券
  {  
	path: '/coupon',
	component: Layout,
	redirect: '/coupon/couponList',
	meta: {
	  title: '优惠券',
	  icon: 'example'
	},
	children: [{
		path: 'couponList',
		name: 'couponList',
		component: () =>
		  import('@/views/coupon/couponList/index'),
		meta: {
		  title: '优惠券列表',
		  icon: 'nested',
		  noCache: false
		}
	  }
	]
  },//千拍万藏
  {  
	path: '/collectSet',
	component: Layout,
	redirect: '/collectSet/applicationList',
	meta: {
	  title: '千拍万藏',
	  icon: 'example'
	},
	children: [{
		path: 'applicationList',
		name: 'applicationList',
		component: () =>
		  import('@/views/collectSet/applicationList/index'),
		meta: {
		  title: '咨询列表',
		  icon: 'nested',
		  noCache: false
		}
	  },{
		path: 'privateCollectList',
		name: 'privateCollectList',
		component: () =>
		  import('@/views/collectSet/privateCollectList/index'),
		meta: {
		  title: '个人收藏馆列表',
		  icon: 'nested',
		  noCache: false
		}
	  }
	]
  },//小鑫开店
  {  
	path: '/storeGame',
	component: Layout,
	redirect: '/storeGame/auspiciousTime',
	meta: {
	  title: '小鑫开店',
	  icon: 'example'
	},
	children: [{
		path: 'auspiciousTime',
		name: 'auspiciousTime',
		component: () =>
		  import('@/views/storeGame/auspiciousTime/index'),
		meta: {
		  title: '天降祥瑞时间',
		  icon: 'nested',
		  noCache: false
		}
	  },{
		path: 'auspiciousReward',
		name: 'auspiciousReward',
		component: () =>
		  import('@/views/storeGame/auspiciousReward/index'),
		meta: {
		  title: '天降祥瑞奖励',
		  icon: 'nested',
		  noCache: false
		}
	  },{
		path: 'auspiciousPrizeList',
		name: 'auspiciousPrizeList',
		component: () =>
		  import('@/views/storeGame/auspiciousPrizeList/index'),
		meta: {
		  title: '抽奖奖品列表',
		  icon: 'nested',
		  noCache: false
		}
	  },{
		path: 'auspiciousSignList',
		name: 'auspiciousSignList',
		component: () =>
		  import('@/views/storeGame/auspiciousSignList/index'),
		meta: {
		  title: '每日签到奖励',
		  icon: 'nested',
		  noCache: false
		}
	  },{
		path: 'auspiciousExpansionList',
		name: 'auspiciousExpansionList',
		component: () =>
		  import('@/views/storeGame/auspiciousExpansionList/index'),
		meta: {
		  title: '仓库扩容配置',
		  icon: 'nested',
		  noCache: false
		}
	  }
	]
  },
  {
    path: '/platformGoods',
    component: Layout,
    redirect: '/platformGoods',
    children: [{
        path: 'platformGoods',
        name: 'platformGoods',
        component: () =>
          import('@/views/platformGoods/commodity/list/index'),
        meta: {
          title: '平台商品管理',
          icon: 'dashboard'
        }
      },
      {
        path: 'platformGoodsDetail',
        name: 'platformGoodsDetail',
        component: () =>
          import('@/views/platformGoods/commodity/list/detail'),
        meta: {
          title: '平台商品详情',
          icon: 'dashboard'
        }
      },
      {
        path: 'addPlatformGoods',
        name: 'addPlatformGoods',
        component: () =>
          import('@/views/platformGoods/commodity/productiondetail/index'),
        meta: {
          title: '平台商品添加',
          icon: 'dashboard'
        }
      },
      {
        path: 'addPlatformGoodsInfo',
        name: 'addPlatformGoodsInfo',
        component: () =>
          import('@/views/platformGoods/commodity/productionInfo/index'),
        meta: {
          title: '捡漏商品添加',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/vipOrder',
    component: Layout,
    redirect: '/vipOrder',
    children: [{
      path: 'vipOrder',
      name: 'viporderListss',
      component: () =>
        import('@/views/vipOrder/index'),
      meta: {
        title: '拍场订单'
      }
    }]
  },
  {
    path: '/vipMange',
    component: Layout,
    redirect: '/vipMange',
    name: 'vipMange',
    meta: {
      title: 'vip店铺管理',
      icon: 'example'
    },
    children: [{
        path: 'houseOwnerMange',
        name: 'houseOwnerMange',
        redirect: '/vipMange/houseOwnerMange/houseOwnerMangeList',
        meta: {
          title: '店主管理'
        },
        component: () =>
          import('@/views/vipManage/houseOwnerManage/index'),
        children: [{
          path: 'houseOwnerMangeList',
          name: 'houseOwnerMangeList',
          component: () =>
            import('@/views/vipManage/houseOwnerManage/list/index'),
          meta: {
            title: '店主管理列表'
          },
          hidden: true
        }, {
          path: 'addOrEdit',
          name: 'addOrEdit',
          component: () =>
            import('@/views/vipManage/houseOwnerManage/addOrEdit/index'),
          meta: {
            title: '新增/添加店主'
          },
          hidden: true
        }, {
          path: 'addHouse',
          name: 'addoHouse',
          component: () => import('@/views/vipManage/houseOwnerManage/addHouse/index'),
          meta: {
            title: '增加店铺'
          },
          hidden: true
        }]
      },
      // 房间管理的路由
      {
        path: 'roomManagement',
        name: 'roomManagement',
        redirect: '/vipMange/roomManagement/roomManagementList',
        meta: {
          title: '店铺管理'
        },
        component: () =>
          import('@/views/vipManage/roomManagement/index'),
        children: [{
            path: 'roomManagementList',
            name: 'roomManagementList',
            meta: {
              title: '店铺管理列表'
            },
            component: () =>
              import('@/views/vipManage/roomManagement/roomManagementList/index'),
            hidden: true
          },
          // 查看拍品
          {
            path: 'checkTheTtemsmentList',
            name: 'checkTheTtemsmentList',
            meta: {
              title: '查看拍品'
            },
            component: () =>
              import('@/views/vipManage/roomManagement/checkTheTtemsmentList/index'),
            hidden: true
          },
          // 新增拍卖
          {
            path: 'newAddAuction',
            name: 'newAddAuction',
            meta: {
              title: '新增拍卖'
            },
            component: () =>
              import('@/views/vipManage/roomManagement/newAddAuction/index'),
            hidden: true
          },
          // 查看（房间管理-->查看拍卖中的查看）
          {
            path: 'seeDetails',
            name: 'seeDetails',
            meta: {
              title: '查看'
            },
            component: () =>
              import('@/views/vipManage/roomManagement/seeDetails/index'),
            hidden: true
          }
        ]
      },
      // 等级管理的路由
      {
        path: 'levelManagement',
        name: 'levelManagement',
        redirect: '/vipMange/levelManagement/levelManagementList',
        meta: {
          title: '等级管理'
        },
        component: () =>
          import('@/views/vipManage/levelManagement/levelManagementList/index'),
        children: [{
          path: 'levelManagementList',
          name: 'levelManagementList',
          meta: {
            title: '等级管理列表'
          },
          component: () =>
            import('@/views/vipManage/levelManagement/levelManagementList/index'),
          hidden: true
        }]
      },
      //拍场商品库的路由
      {
        path: 'vipLibraryOfGoods',
        name: 'vipLibraryOfGoods',
        redirect: '/vipMange/vipLibraryOfGoods/vipLibraryList',
        meta: {
          title: '拍场商品库'
        },
        component: () =>
          import('@/views/vipManage/vipLibraryOfGoods'),
        children: [{
            path: 'vipCommissionAuction',
            name: 'vipCommissionAuction',
            meta: {
              title: '拍场寄拍管理'
            },
            component: () =>
              import('@/views/vipManage/vipLibraryOfGoods/vipCommissionAuction/index'),
            hidden: true
          },
          {
            path: 'vipLibraryList',
            name: 'vipLibraryList',
            meta: {
              title: '拍场商品库列表'
            },
            component: () =>
              import('@/views/vipManage/vipLibraryOfGoods/vipLibraryList/index'),
            hidden: true
          },
          {
            path: 'addGoods',
            name: 'addGoods',
            meta: {
              title: '新增商品'
            },
            component: () =>
              import('@/views/vipManage/vipLibraryOfGoods/addGoods/index'),
            hidden: true
          },
          {
            path: 'goodDetail',
            name: 'goodDetail',
            meta: {
              title: '查看商品详情'
            },
            component: () =>
              import('@/views/vipManage/vipLibraryOfGoods/goodDetail/index'),
            hidden: true
          },

        ]
      },
      {
        path: 'incomeAndPayDetail',
        name: 'incomeAndPayDetail',
        meta: {
          title: '店主收支明细'
        },
        component: () =>
          import('@/views/vipManage/incomeAndPayDetail/incomeAndPayDetail'),
      },
    ]
  },
  {
    path: '/messageManagement',
    component: Layout,
    redirect: '/messageManagement',
    children: [{
      path: 'messageManagement',
      name: 'messageManagement',
      component: () =>
        import('@/views/messageManagement/index'),
      meta: {
        title: '消息管理',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/versionManagement',
    component: Layout,
    redirect: '/versionManagement',
    children: [{
      path: 'versionManagement',
      name: 'versionManagement',
      component: () =>
        import('@/views/versionManagement/index'),
      meta: {
        title: '版本管理'
      }
    }]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity',
    children: [{
        path: 'activity',
        name: 'activity',
        component: () =>
          import('@/views/activity/index'),
        meta: {
          title: '活动管理'
        }
      },
      {
        path: 'drawGoods',
        name: 'drawGoods',
        component: () =>
          import('@/views/activity/drawGoods'),
        meta: {
          title: '抽奖商品'
        }
      },
      {
        path: 'sendGoods',
        name: 'sendGoods',
        component: () =>
          import('@/views/activity/sendGoods'),
        meta: {
          title: '赠送商品'
        }
      },
      {
        path: 'activityGoods',
        name: 'activityGoods',
        component: () =>
          import('@/views/activity/activityGoods'),
        meta: {
          title: '活动商品'
        }
      },
      {
        path: 'joinDetail',
        name: 'joinDetail',
        component: () =>
          import('@/views/activity/joinDetail'),
        meta: {
          title: '参与详情'
        }
      },
      {
        path: 'activityOrder',
        name: 'activityOrder',
        component: () =>
          import('@/views/activity/activityOrder'),
        meta: {
          title: '活动订单'
        }
      }, {
        path: 'drawGoodsAdd',
        name: 'drawGoodsAdd',
        component: () =>
          import('@/views/activity/drawGoodsAdd'),
        meta: {
          title: '活动商品添加'
        }
      }, {
        path: 'sendGoodsAdd',
        name: 'sendGoodsAdd',
        component: () =>
          import('@/views/activity/sendGoodsAdd'),
        meta: {
          title: '赠送商品添加'
        }
      }, {
        path: 'activityGoodsAdd',
        name: 'activityGoodsAdd',
        component: () =>
          import('@/views/activity/activityGoodsAdd'),
        meta: {
          title: '活动商品添加'
        }
      }, {
        path: 'inviteRanking',
        name: 'InviteRanking',
        component: () =>
          import('@/views/activity/inviteRanking'),
        meta: {
          title: '邀请好友排行榜'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  ...componentsRouter
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
