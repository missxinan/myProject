/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const componentsRouter =[
  {
    path: '/shareholder',
    component: Layout,
    redirect: '/shareholder',
    children: [{
      path: 'shareholder',
      name: 'shareholder',
      component: () =>
        import('@/views/shareholder/index'),
      meta: {
        title: '虚拟股东'
      }
    }]
  },
  {
    path: '/sellerCenter',
    component: Layout,
    redirect: '/sellerCenter/sellerStoreList',
    name: 'sellerCenter',
    meta: {
      title: '卖家中心',
      icon: 'example'
    },
    children: [{
      path: 'sellerStoreList',
      name: 'sellerStoreList',
      component: () =>
        import('@/views/sellerCenter/sellerStoreList/index'),
      meta: {
        title: '店铺审核列表'
      }
    },{
      path: 'sellerDetail',
      name: 'sellerDetail',
      component: () =>
        import('@/views/sellerCenter/sellerStoreList/detail'),
      meta: {
        title: '卖家店铺详情'
      }
    },{
      path: 'sellerChecking',
      name: 'sellerChecking',
      component: () =>
        import('@/views/sellerCenter/sellerChecking/index'),
      meta: {
        title: '待审核店铺'
      }
    },{
        path: 'sellerFileDetail',
        name: 'sellerFileDetail',
        component: () =>
            import('@/views/sellerCenter/sellerFileDetail/index'),
        meta: {
            title: '文件审核详情'
        }
    },{
      path: 'goodsTipOffList',
      name: 'goodsTipOffList',
      component: () =>
        import('@/views/sellerCenter/goodsTipOffList/index'),
      meta: {
        title: '商品举报列表'
      }
    },{
      path: 'goodsTipOffDetail',
      name: 'goodsTipOffDetail',
      component: () =>
        import('@/views/sellerCenter/goodsTipOffList/goodsTipOffDetail'),
      meta: {
        title: '商品举报详情'
      }
    },{
      path: 'commissionRate',
      name: 'commissionRate',
      component: () =>
        import('@/views/sellerCenter/commissionRate/index'),
      meta: {
        title: '店铺佣金比例调整'
      }
    }]
  },
  {
    path: '/ownStoreGoods',
    redirect: '/ownStoreGoods',
    component: Layout,
    children: [{
      path: 'ownStoreGoods',
      name: 'ownStoreGoods',
      component: () =>
        import('@/views/ownStoreGoods/commodity/goodsList'),
      meta: {
        title: '自营店商品列表'
      }
    },
    {
      path: 'addOwnStoreGoods',
      name: 'addOwnStoreGoods',
      component: () =>
        import('@/views/ownStoreGoods/addOwnStoreGoods/addOwnStoreGoods'),
      meta: {
        title: '添加自营店商品'
      }
    }]
  }
]
export default componentsRouter
