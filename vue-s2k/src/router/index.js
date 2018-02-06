import Vue from 'vue';
import Router from 'vue-router';
import App from '@/App';
import Member from '@/components/member';
import chatRoom from '@/components/chatRoom';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/member',
      name: 'member',
      meta: {
        title: 'member'
      },
      component: Member
    },
    {
      path: '/chatroom',
      name: 'chatRoom',
      meta: {
        title: 'S2K Chat Room'
      },
      component: chatRoom
    }
  ],
  mode: 'history',
  // 如果有底部导航栏，这个属性可以为被选中的路由增加相应的选中状态class
  linkActiveClass: 'active'
});
