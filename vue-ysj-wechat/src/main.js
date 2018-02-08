// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import App from './App';
import router from './router';
// 引入全局状态
import store from './vuexs';

// 全局引入css
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

// 跳转页面默认到页面顶部
router.afterEach(route => {
    window.scrollTo(0, 0);
});

router.beforeEach((to, from, next) => {
  // document.title = to.meta.title;
  // next();
  // 假设第一次是后台地址跳转到前台SPA
  // 如果不是微信直接跳转404
  // 防止利用token在其他游览器登录
  // console.log(from);
  // console.log(to);
  if (to.name === '404') {
    next();
  } else {
    // 判断是不是微信游览器
    var uG = window.navigator.userAgent.toLowerCase();
    // console.log(uG.indexOf('micromessenger'));
    if (uG.indexOf('micromessenger') !== -1) {
      document.title = to.meta.title;
      next();
    } else { // 如果不是微信登录直接跳转404
      next({ name: '404' });
      // setTimeout(() => {
      //   return next({ name: 'orderDetail' });
      // }, 3000);
    }
  }
});

// 自定义滚动指令
Vue.directive('scroll', {
  bind (el, binding) {
    window.addEventListener('scroll', () => {
      let fnc = binding.value;
      fnc(el);
    });
  }
});

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  store,
  router
  // components: { App },
  // template: '<App/>'
}).$mount('#app');
