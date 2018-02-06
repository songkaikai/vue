import Vue from 'vue';
import Vuex from 'vuex';

// 引入session
import Session from 'common/js/sessionStorage';
// import Local from 'common/js/localStorage';
// 引入axios异步调用的 函数接口(home-as-axios)就是给他换了个名称
import { sx as axios } from '../vue_axios';

// 首页状态
// import home from './modules/home';

// 使用vue的状态管理vuex
Vue.use(Vuex);

// 用户登录接口
const MEMBER_LOGIN_PATH = 'defaults/login';
// 用户退出登录
// const MEMBER_LOGOUT_PATH = 'member/logout';
// 用户修改密码
const EDIT_PASSWORD_PATH = 'usercenter/editPassword';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'usercenter/getProfile';
// 提交领机码接口
const SUBMIT_CODE_PATH = 'registers/info';
// 分公司产品列表
const PROD_LIST_PATH = 'products/list';
// 支付接口
const POST_PAY_PATH = 'registers/payment';
// 开卡接口
const POST_CARD_PATH = 'registers/send-card';
// 领机接口
const POST_LINGJI_PATH = 'registers/machine';
// 修改密码
const CHANGE_PASS_PATH = 'homes/chang-pass';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';
const MEMBER_INFO = 'member_info';
const ORDER_CODE = 'order_code';

// 创建一个用来共享的 store 实例化对象
const store = new Vuex.Store({
  state: {
    // 会员登录以后的会员信息
    memberLogin: Session.fetch(MEMBER_LOGIN) === null ? {} : Session.fetch(MEMBER_LOGIN),
    memberInfo: Session.fetch(MEMBER_INFO) === null ? {} : Session.fetch(MEMBER_INFO),
    orderCode: Session.fetch(ORDER_CODE) === null ? {} : Session.fetch(ORDER_CODE),
    prodList: {}
  },
  mutations: {
    // 会员登录记录token
    memberLogin (state, msg) {
      state.memberLogin = msg;
    },
    // 会员退出登录
    memberLogout (state, msg) {
      state.memberLogin = {};
      state.memberInfo = {};
    },
    // 会员信息
    memberInfo (state, msg) {
      state.memberInfo = msg;
    },
    orderCode (state, msg) {
      state.orderCode = msg;
    },
    prodList (state, msg) {
      state.prodList = msg;
    }
  },
  actions: {
    // 会员登录
    memberLogin ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (!res.data.code) {
            commit('memberLogin', res.data);
            // console.log(res.data);
            Session.save(res.data, MEMBER_LOGIN);
          }
          resolve(res);
        }, option, MEMBER_LOGIN_PATH);
     });
    },
    // 会员退出登录
    logout ({commit, state}, option) {
      return new Promise((resolve, reject) => {
          commit('memberLogout');
          Session.empty(MEMBER_LOGIN);
          Session.empty(MEMBER_INFO);
          resolve();
      });
    },
    // 修改密码
    editPassword ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
            resolve(res);
         }, option, EDIT_PASSWORD_PATH);
      });
    },
    // 获取会员基本信息
    memberInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          if (res.status === 1) {
            commit('memberInfo', res.data);
            Session.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    // 提交领机码
    orderCode ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getList(res => {
            if (res.data.result === 'success') {
              commit('orderCode', res.data.cnt);
              Session.save(res.data.cnt, ORDER_CODE);
            }
            resolve(res);
         }, option, SUBMIT_CODE_PATH);
      });
    },
    prodList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.data.result === 'success') {
            commit('prodList', res.data.cnt);
          }
          resolve(res);
        }, option, PROD_LIST_PATH);
      });
    },
    // 提交支付
    postPay ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, POST_PAY_PATH);
      });
    },
    // 开卡
    postCard ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, POST_CARD_PATH);
      });
    },
    // 领机
    postLing ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, POST_LINGJI_PATH);
      });
    },
    // 修改密码
    changePass ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, CHANGE_PASS_PATH);
      });
    }
  },
  modules: {
    // 首页状态
    // home
  },
  // 严格模式  生产环境下禁止使用 严格模式 strict-> 严格的
  strict: process.env.NODE_ENV !== 'production'
});
// console.log(Vuex);
export default store;
