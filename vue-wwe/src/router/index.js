import Vue from 'vue';
import Router from 'vue-router';
// import Hello from '@/components/Hello'

Vue.use(Router);

export default new Router({
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      // name: 'Hello',
      component: require('../App'),
      redirect: {name: 'superStar'},
      children: [
        {
          path: 'superStar',
          name: 'superStar',
          meta: {
            title: 'superStar'
          },
          component: require('@/components/home/superStar')
        },
        {
          path: 'followWith',
          name: 'followWith',
          meta: {
            title: 'followWith'
          },
          component: require('@/components/home/followWith')
        },
        {
          path: 'aboutMe',
          name: 'aboutMe',
          meta: {
            title: 'aboutMe'
          },
          component: require('@/components/home/aboutMe')
        }
      ]
    },
    {
      path: '/detail/:id',
      name: 'detail',
      meta: {
        title: 'detail'
      },
      component: require('@/components/home/detail')
    }
  ],
  // 每次切换页面都回到顶部
  scrollBehavior (to, from, savedPosition) {
    // alert('1');
    // 只有游览器后退前进才会触发
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
