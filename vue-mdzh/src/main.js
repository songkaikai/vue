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

// 获取页面的标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
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
  // template: '<App/>',
  // components: { App }
}).$mount('#app');
