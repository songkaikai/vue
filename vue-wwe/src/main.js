// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import App from './App'
import router from './router';
import store from './vue_vuex';
import VueLazyload from 'vue-lazyload';  // 引入图片懒加载模块
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

// 更换当前title
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

// 引入图片懒加载
// error，loading是图片路径, 用require引入
Vue.use(VueLazyload, {
    error: require('./assets/404.jpg'),
    loading: require('./assets/loading.gif'),
    attempt: 1
  }
);

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store
  // template: '<App/>',
  // components: { App }
}).$mount('#app');
