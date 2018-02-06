import Vue from 'vue';
import Router from 'vue-router';

// 引入session
import Session from 'common/js/sessionStorage';
// import localStorage from 'common/js/localStorage';
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
        if (Session.fetch(MEMBER_LOGIN) === null) {
          return next({ name: 'login' });
          // return next();
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
          component: require('components/face/index')
        },
        {
          path: 'payPage',
          name: 'payPage',
          meta: {
            title: '付款'
          },
          component: require('components/face/payPage')
        },
        {
          path: 'openCard',
          name: 'openCard',
          meta: {
            title: '开卡'
          },
          component: require('components/face/openCard')
        },
        {
          path: 'receive',
          name: 'receive',
          meta: {
            title: '领机'
          },
          component: require('components/face/receive')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: require('components/login')
    },
    {
      path: '/xfgzs',
      name: 'xfgzs',
      meta: {
        title: '消费分期告知书'
      },
      component: require('components/xfgzs')
    }
  ]
});
