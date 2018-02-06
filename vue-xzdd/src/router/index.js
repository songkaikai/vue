import Vue from 'vue';
import Router from 'vue-router';
import SessionStorage from '../common/js/sessionStorage';

Vue.use(Router);
// 会员存储的信息
const MEMBER_LOGIN = 'member_login';

export default new Router({
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: require('../App'),
      redirect: {name: 'login'},
      children: [
        {
          path: 'index',
          name: 'index',
          meta: {
            title: '首页'
          },
          component: require('@/components/index'),
          beforeEnter: (to, from, next) => {
            // console.log(to);
            // 判断用户是否已经登录
            // console.log(SessionStorage.fetch(MEMBER_LOGIN));
            if (SessionStorage.fetch(MEMBER_LOGIN) === null) {
              return next({ name: 'login' });
            } else if (SessionStorage.fetch(MEMBER_LOGIN).haveAdd === '0') {
              return next({ name: 'address', params: {id: 'add'} });
            } else {
              return next();
            }
            // return next();
          }
        },
        {
          path: 'customs',
          name: 'customs',
          meta: {
            title: '报单'
          },
          component: require('@/components/customs')
        },
        {
          path: 'orderList',
          name: 'orderList',
          meta: {
            title: '订单列表'
          },
          component: require('@/components/orderList')
        },
        {
          path: 'dsTeacher',
          name: 'dsTeacher',
          meta: {
            title: '导师列表'
          },
          component: require('@/components/dsTeacher')
        },
        {
          path: 'inviteQrcode',
          name: 'inviteQrcode',
          meta: {
            title: '邀请好友注册'
          },
          component: require('@/components/inviteQrcode')
        },
        {
          path: 'addresslist',
          name: 'addresslist',
          meta: {
            title: '收货地址'
          },
          component: require('@/components/addresslist')
        },
        {
          path: 'address/:id',
          name: 'address',
          meta: {
            title: '编辑地址'
          },
          component: require('@/components/address'),
          beforeEnter: (to, from, next) => {
            // console.log(to);
            // 判断用户是否已经登录
            // console.log(SessionStorage.fetch(MEMBER_LOGIN).haveAdd);
            if (SessionStorage.fetch(MEMBER_LOGIN).haveAdd === '0' || to.params.id !== 'add') {
              return next();
            } else {
              return next({ name: 'index' });
            }
          }
        },
        {
          path: 'game',
          name: 'game',
          meta: {
            title: '血战到底'
          },
          component: require('@/components/game')
        }
      ]
    },
    {
      path: '/invitePage',
      name: 'invitePage',
      meta: {
        title: '邀请注册页'
      },
      component: require('@/components/invitePage')
    },
    {
      path: '/moneyDetail',
      name: 'moneyDetail',
      meta: {
        title: '我的收益'
      },
      component: require('@/components/moneyDetail')
    },
    {
      path: '/loadPage',
      name: 'loadPage',
      meta: {
        title: '下载页'
      },
      component: require('@/components/loadPage/index')
    },
    // 登录页
    {
      path: '',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: require('@/components/login'),
      beforeEnter: (to, from, next) => {
         // if (SessionStorage.fetch(MEMBER_LOGIN) !== null) {
         //    return next({ name: 'index' });
         //  } else {
         //    return next();
         //  }
          // return next();
          // console.log(to);
          // 判断用户是否pc端
          // 判断ios跟android
          // console.log(navigator.userAgent.toLowerCase().indexOf('micromessenger'));
          // if (navigator.userAgent.toLowerCase().indexOf('micromessenger')) {
          //    return next({ name: 'error' });
          // } else {
          //   return next();
          // }
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  // 判断iPhone|iPad|iPod|iOS
              return next();
          } else if (/(Android)/i.test(navigator.userAgent)) {   // 判断Android
              return next();
          } else {  // pc
              return next({ name: 'error' });
          }
          // return next();
      }
    },
    {
      path: '/error',
      name: 'error',
      meta: {
        title: '404'
      },
      component: require('@/components/error')
    }
  ]
});
