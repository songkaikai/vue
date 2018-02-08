import Vue from 'vue';
import Router from 'vue-router';
// import App from '@/App';
import pordList from 'components/face/prodlist';
import pordDetail from 'components/face/prodlist/detail';
import orderList from 'components/face/order';
import orderDetail from 'components/face/order/detail';
import express from 'components/face/order/express';
import errorPage from 'components/errorPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pordList',
      meta: {
        title: '产品列表'
      },
      component: pordList
    },
    {
      path: '/pordDetail',
      name: 'pordDetail',
      meta: {
        title: '产品详情'
      },
      component: pordDetail
    },
    {
      path: '/orderList',
      name: 'orderList',
      meta: {
        title: '订单列表'
      },
      component: orderList
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta: {
        title: '订单详情'
      },
      component: orderDetail
    },
    {
      path: '/express',
      name: 'expressInfo',
      meta: {
        title: '物流信息'
      },
      component: express
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: '404页面未找到'
      },
      component: errorPage
    }
  ],
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active'
});
