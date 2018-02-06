import Vue from 'vue';
import Router from 'vue-router';
// face内容
import App from '../App';
import home from 'components/face/home';
import mdMall from 'components/face/mdMall';
import kfCenter from 'components/face/kfCenter';
import accountManager from 'components/face/accountManager';
// 会员的具体内容
import Member from 'components/member';
import orderList from 'components/member/orderList';
import cbArea from 'components/member/cbArea';
import syDetail from 'components/member/syDetail';
import teamList from 'components/member/teamList';
import jyjj from 'components/member/jyjj';
import mallList from 'components/member/mallList';
import editPass from 'components/member/editPass';
import qrCode from 'components/member/qrCode';
import address from 'components/member/address';
import addEdit from 'components/member/address/edit';
import payChoose from 'components/member/pay/payChoose';
import payResult from 'components/member/pay/payResult';
import orderExpress from 'components/member/orderExpress';
import withdraw from 'components/member/withdraw';
import fans from 'components/member/fans';
// 商品详情
import prodDetail from 'components/face/home/prodDetail';
import buyPage from 'components/face/home/buyPage';
// 登录页
import login from 'components/login';
import register from 'components/register';

// 引入session
// import Session from 'common/js/sessionStorage';
import localStorage from 'common/js/localStorage';
// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

Vue.use(Router);

export default new Router({
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: login,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN)) {
          return next({ name: 'home' });
        } else {
          return next();
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: register,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN)) {
          return next({ name: 'home' });
        } else {
          return next();
        }
      }
    },
    {
      path: '/',
      redirect: {name: 'login'},
      component: App,
      // component: require('../App'),
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (!localStorage.fetch(MEMBER_LOGIN)) {
          return next({ name: 'login' });
        } else {
          return next();
        }
      },
      children: [
        {
          path: 'home',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: home
        },
        {
          path: 'mdMall',
          name: 'mdMall',
          meta: {
            title: '免蛋商城'
          },
          component: mdMall
        },
        {
          path: 'kfCenter',
          name: 'kfCenter',
          meta: {
            title: '客服中心'
          },
          component: kfCenter
        },
        {
          path: 'accountManager',
          name: 'accountManager',
          meta: {
            title: '会员中心'
          },
          component: accountManager
        }
      ]
    },
    {
      path: '/member',
      component: Member,
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (!localStorage.fetch(MEMBER_LOGIN)) {
          return next({ name: 'login' });
        } else {
          return next();
        }
      },
      children: [
        {
          path: 'withdraw',
          name: 'withdraw',
          meta: {
            title: '商品详情'
          },
          component: withdraw
        },
        {
          path: 'prodDetail',
          name: 'prodDetail',
          meta: {
            title: '商品详情'
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
          path: 'payChoose',
          name: 'payChoose',
          meta: {
            title: '选择支付'
          },
          component: payChoose
        },
        {
          path: 'payResult',
          name: 'payResult',
          meta: {
            title: '支付结果'
          },
          component: payResult
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
          path: 'cbArea',
          name: 'cbArea',
          meta: {
            title: '藏宝位'
          },
          component: cbArea
        },
        {
          path: 'syDetail',
          name: 'syDetail',
          meta: {
            title: '收益明细'
          },
          component: syDetail
        },
        {
          path: 'teamList',
          name: 'teamList',
          meta: {
            title: '团队统计'
          },
          component: teamList
        },
        {
          path: 'jyjj',
          name: 'jyjj',
          meta: {
            title: '教育基金'
          },
          component: jyjj
        },
        {
          path: 'mallList',
          name: 'mallList',
          meta: {
            title: '商城业绩'
          },
          component: mallList
        },
        {
          path: 'editPass',
          name: 'editPass',
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
          path: 'addEdit',
          name: 'addEdit',
          meta: {
            title: '编辑地址'
          },
          component: addEdit
        },
        {
          path: 'qrCode',
          name: 'qrCode',
          meta: {
            title: '我的二维码'
          },
          component: qrCode
        },
        {
          path: 'orderExpress',
          name: 'orderExpress',
          meta: {
            title: '快递查询'
          },
          component: orderExpress
        },
        {
          path: 'fans',
          name: 'fans',
          meta: {
            title: '我的客户'
          },
          component: fans
        }
      ]
    }
  ]
});
