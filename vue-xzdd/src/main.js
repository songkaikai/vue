// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import App from './App'
import router from './router';
// 引入全局状态
import store from './vuexs';
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

/* eslint-disable no-new */
export default new Vue({
  // el: '#app',
  router,
  store
  // template: '<App/>',
  // components: { App }
}).$mount('#app');
