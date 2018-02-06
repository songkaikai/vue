import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import App from '@/App';
// 首页底部导航页面
import home from 'components/face/home';
import cart from 'components/face/cart';
import aboutus from 'components/face/aboutus';
import linkus from 'components/face/linkus';
import my from 'components/face/my';

import login from 'components/login';
import register from 'components/register';
import forget from 'components/forget';

// 共享页
import member from 'components/member';
import QRcode from 'components/member/QRcode';
import team from 'components/member/team';
import log from 'components/member/myLog';
import myAccount from 'components/member/myAccount';
import withdraw from 'components/member/myAccount/withdraw';
import withdrawLog from 'components/member/myAccount/log';
import editPass from 'components/member/editPass';
import address from 'components/member/address';
import addEdit from 'components/member/address/edit';
import orderList from 'components/member/orderList';
import expressInfo from 'components/member/orderList/express';
import afterSale from 'components/member/orderList/afterSale';
import returnExpress from 'components/member/orderList/retExpress';
import orderpay from 'components/member/pay';
import payResult from 'components/member/pay/payResult';

// 产品详情
import prodDetail from 'components/face/home/prodDetail';
import buyPage from 'components/face/home/buyPage';

// 引入session
// import Session from 'common/js/sessionStorage';
import localStorage from 'common/js/localStorage';
// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: login
    },
    {
      path: '/forget',
      name: 'forget',
      meta: {
        title: '忘记密码'
      },
      component: forget
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: register
    },
    {
      path: '/',
      // name: 'HelloWorld',
      redirect: {name: 'login'},
      // redirect: {name: 'home'},
      component: App,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN)) {
          return next();
        } else {
          return next({name: 'login'});
        }
      },
      children: [
        {
          path: 'index',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: home
        },
        {
          path: 'cart',
          name: 'cart',
          meta: {
            title: '购物车'
          },
          component: cart
        },
        {
          path: 'aboutus',
          name: 'aboutus',
          meta: {
            title: '关于我们'
          },
          component: aboutus
        },
        {
          path: 'linkus',
          name: 'linkus',
          meta: {
            title: '联系我们'
          },
          component: linkus
        },
        {
          path: 'my',
          name: 'my',
          meta: {
            title: '我的'
          },
          component: my
        }
      ]
    },
    {
      path: '/member',
      component: member,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN)) {
          return next();
        } else {
          return next({name: 'login'});
        }
      },
      children: [
        {
          path: 'QRcode',
          name: 'myQRcode',
          meta: {
            title: '二维码'
          },
          component: QRcode
        },
        {
          path: 'team',
          name: 'myTeam',
          meta: {
            title: '团队'
          },
          component: team
        },
        {
          path: 'log',
          name: 'myLog',
          meta: {
            title: '日志'
          },
          component: log
        },
        {
          path: 'account',
          name: 'myAccount',
          meta: {
            title: '钱包'
          },
          component: myAccount
        },
        {
          path: 'account/withdraw',
          name: 'withdraw',
          meta: {
            title: '提现'
          },
          component: withdraw
        },
        {
          path: 'account/withdrawLog',
          name: 'withdrawLog',
          meta: {
            title: '提现日志'
          },
          component: withdrawLog
        },
        {
          path: 'resetPass',
          name: 'resetPass',
          meta: {
            title: '修改密码'
          },
          component: editPass
        },
        {
          path: 'address',
          name: 'address',
          meta: {
            title: '收货地址'
          },
          component: address
        },
        {
          path: 'editAdd',
          name: 'addEdit',
          meta: {
            title: '编辑地址'
          },
          component: addEdit
        },
        {
          path: 'orderList',
          name: 'orderList',
          meta: {
            title: '订单列表'
          },
          component: orderList
        },
        {
          path: 'expressInfo',
          name: 'expressInfo',
          meta: {
            title: '快递信息'
          },
          component: expressInfo
        },
        {
          path: 'afterSale',
          name: 'afterSale',
          meta: {
            title: '售后服务'
          },
          component: afterSale
        },
        {
          path: 'returnExpress',
          name: 'returnExpress',
          meta: {
            title: '退款快递单号'
          },
          component: returnExpress
        }
      ]
    },
    {
      path: '/prod',
      component: member,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN)) {
          return next();
        } else {
          return next({name: 'login'});
        }
      },
      children: [
        {
          path: 'detail',
          name: 'prodDetail',
          meta: {
            title: '产品详情'
          },
          component: prodDetail
        },
        {
          path: 'buyPage',
          name: 'buyPage',
          meta: {
            title: '购买页'
          },
          component: buyPage
        },
        {
          path: 'orderpay',
          name: 'orderpay',
          meta: {
            title: '订单支付'
          },
          component: orderpay
        },
        {
          path: 'payResult',
          name: 'payResult',
          meta: {
            title: '支付结果'
          },
          component: payResult
        }
      ]
    }
  ],
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active'
});
