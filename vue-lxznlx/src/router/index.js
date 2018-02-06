import Vue from 'vue';
import Router from 'vue-router';
// import Hello from '@/components/Hello';

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
      path: '/',
      component: require('../App'),
      redirect: {name: 'login'},
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN) === null) {
          return next({ name: 'login' });
        } else {
          return next();
        }
      },
      children: [
        {
          path: 'index',
          name: 'index',
          meta: {
            title: '首页'
          },
          component: require('components/face/home')
        },
        {
          path: 'team',
          name: 'team',
          meta: {
            title: '团队管理'
          },
          component: require('components/member/team')
        },
        {
          path: 'integralMall',
          name: 'integralMall',
          meta: {
            title: '积分商城'
          },
          component: require('components/face/integralMall')
        },
        {
          path: 'shopcart',
          name: 'shopcart',
          meta: {
            title: '购物车'
          },
          component: require('components/face/shopcart')
        },
        {
          path: 'helpCenter',
          name: 'helpCenter',
          meta: {
            title: '帮助中心'
          },
          component: require('components/face/helpCenter')
        },
        {
          path: 'exchangeManager',
          name: 'exchangeManager',
          meta: {
            title: '交易管理'
          },
          component: require('components/face/exchangeManager')
        },
        {
          path: 'accountManager',
          name: 'accountManager',
          meta: {
            title: '账户管理'
          },
          component: require('components/face/accountManager')
        }
      ]
    },
    {
      path: '/member',
      component: require('components/member'),
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        // console.log(localStorage.fetch(MEMBER_LOGIN));
        if (localStorage.fetch(MEMBER_LOGIN) === null) {
          return next({ name: 'login' });
        } else {
          return next();
        }
      },
      children: [
        {
          path: 'xfList',
          name: 'xfList',
          meta: {
            title: '消费记录'
          },
          component: require('components/face/exchangeManager/list')
        },
        {
          path: 'tjList',
          name: 'tjList',
          meta: {
            title: '岗位津贴记录'
          },
          component: require('components/face/home/tjList')
        },
        {
          path: 'teamList',
          name: 'teamList',
          meta: {
            title: '团队岗位津贴'
          },
          component: require('components/face/home/teamList')
        },
        {
          path: 'qrCode',
          name: 'qrCode',
          meta: {
            title: '二维码'
          },
          component: require('components/member/qrCode')
        },
        {
          path: 'announcement/:id',
          name: 'announcement',
          meta: {
            title: '盱眙公告'
          },
          component: require('components/face/helpCenter/announcement')
        },
        {
          path: 'withdraw',
          name: 'withdraw',
          meta: {
            title: '提现'
          },
          component: require('components/member/withdraw')
        },
        {
          path: 'withdrawBank',
          name: 'withdrawBank',
          meta: {
            title: '提现'
          },
          component: require('components/member/withdraw/bank')
        },
        {
          path: 'getLxcode',
          name: 'getLxcode',
          meta: {
            title: '获取蓝享币'
          },
          component: require('components/member/getLxcode')
        },
        {
          path: 'activationCode',
          name: 'activationCode',
          meta: {
            title: '转激活码'
          },
          component: require('components/member/activationCode')
        }
      ]
    },
    {
      // 设置交易密码
      path: '/exchangeCode',
      name: 'exchangeCode',
      meta: {
        title: '设置交易密码'
      },
      component: require('components/exchangeCode'),
      beforeEnter: (to, from, next) => {
        // 如果用户没有登录就去登录页面
        if (parseInt(localStorage.fetch(MEMBER_LOGIN).setPay) === 1) {
          return next({ name: 'index' });
        } else {
          return next();
        }
      }
    },
    // {
    //   path: '/loadPage',
    //   name: 'loadPage',
    //   meta: {
    //     title: '下载页'
    //   },
    //   component: require('@/components/loadPage/index')
    // },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: require('components/login')
    },
    {
      path: '/regist',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: require('components/register')
    }
  ]
});
