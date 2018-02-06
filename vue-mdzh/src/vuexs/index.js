import Vue from 'vue';
import Vuex from 'vuex';

// 引入session
import Session from 'common/js/sessionStorage';
import Local from 'common/js/localStorage';
// 引入axios异步调用的 函数接口(home-as-axios)就是给他换了个名称
import { sx as axios } from '../vue_axios';

// 首页状态
// import home from './modules/home';

// 使用vue的状态管理vuex
Vue.use(Vuex);

// 获取手机验证码的接口
const GET_VALIDATECODE_PATH = 'members/send-reg-mobile';
// 会员注册接口
const MEMBER_REGISTER_PATH = 'members/register';
// 用户登录接口
const MEMBER_LOGIN_PATH = 'members/login';
// 用户退出登录
// const MEMBER_LOGOUT_PATH = 'member/logout';
// 用户修改密码
const EDIT_PASSWORD_PATH = 'member/settings/chang-pass';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'direct/homes/info';
// 激活币账户日志接口
// const JHB_LIST_PATH = 'trans/code-index';
// 获取商品列表的接口
const PROD_LIST_PATH = 'direct/goods/lists';
// 地址列表接口
const ADDRESS_LIST_PATH = 'addresses/lists';
// 添加收货地址
const ADD_ADDRESS_PATH = 'addresses/create';
const DEFAULT_ADDRESS_PATH = 'addresses/setdefault';
const DEL_ADDRESS_PATH = 'addresses/delete';
const EDIT_ADDRESS_PATH = 'addresses/edit';
// 产品下订单
const BUY_PRODINFO_PATH = 'direct/buys/create';
// 支付接口
const BUY_PAY_PATH = 'direct/buys/pay';
// 订单列表
const ORDER_LIST_PATH = 'direct/orders/lists';
const ORDER_SURE_PATH = 'direct/orders/confirm';
// 获取日志列表的接口
const ALL_JF_LIST_PATH = 'direct/logs/lists';
// 公排队列(藏宝位)的接口
const PUBLIC_LIST_PATH = 'direct/rows/lists';
// 快递详情
const EXPRESS_INFO_PATH = 'orders/get-logistics';
// 客服中心
const KF_CENTER_PATH = 'single-articles/detail';
// const ADDRESS_AREA_PATH = 'addresses/list';
const WITHDRAW_CREATE_PATH = 'direct/withdraws/create';
// 提现日志接扣
const WITHDRAW_LIST_PATH = 'direct/withdraws/lists';
// 我的粉丝列表
const FANS_LIST_PATH = 'direct/homes/lists';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';
const MEMBER_INFO = 'member_info';
const ADDRESS_LIST = 'address_list';
// const PROD_LIST = 'prod_list';
// 产品分类
const PROD_ONE_LIST = 'prod_list_one';
const PROD_TWO_LIST = 'prod_list_two';
const PROD_THREE_LIST = 'prod_list_three';
const PROD_INFO_BUY = 'buy_prod_info';
const ORDER_LIST_ALL = 'order_list_all';

// 创建一个用来共享的 store 实例化对象
const store = new Vuex.Store({
  state: {
    // 会员登录以后的会员信息
    memberLogin: Local.fetch(MEMBER_LOGIN) === null ? {} : Local.fetch(MEMBER_LOGIN),
    memberInfo: Session.fetch(MEMBER_INFO) === null ? {} : Session.fetch(MEMBER_INFO),
    prodListOne: Session.fetch(PROD_ONE_LIST) === null ? [] : Session.fetch(PROD_ONE_LIST), // 产品列表信息1
    prodListTwo: Session.fetch(PROD_TWO_LIST) === null ? [] : Session.fetch(PROD_TWO_LIST), // 产品列表信息2
    prodListThree: Session.fetch(PROD_THREE_LIST) === null ? [] : Session.fetch(PROD_THREE_LIST), // 产品列表信息3
    buyProdInfo: Session.fetch(PROD_INFO_BUY) === null ? [] : Session.fetch(PROD_INFO_BUY), // 购买产品下订单
    orderList: Session.fetch(ORDER_LIST_ALL) === null ? [] : Session.fetch(ORDER_LIST_ALL), // 订单列表
    withdrawCountList: [], // 提现日志接口
    fkCenter: {}, // 客服中心
    expressInfo: [], // 快递详情
    publicList: [], // 公排队列(藏宝位)
    fansList: [], // 粉丝列表
    jfAllList: [], // 存储积分的地方
    addressList: [], // 地址列表
    addressArea: [] // 地址省市区
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
    // 商品列表
    prodList (state, msg) {
      // 1网红店产品。2大咖店产品。3工作室产品
      var typeArr = [1, 2, 3];
      var storeArr = ['prodListOne', 'prodListTwo', 'prodListThree'];
      // 每次进来清空
      for (var d = 0; d < storeArr.length; d++) {
        state[storeArr[d]] = [];
      }
      // 重新赋值
      for (var i = 0; i < typeArr.length; i++) {
        for (var r = 0; r < msg.length; r++) {
          if (typeArr[i] === parseInt(msg[r].product_type)) {
            // console.log(msg[r]);
            state[storeArr[i]].push(msg[r]);
          }
        }
      }
      // 重新存储
      var localArr = ['PROD_ONE_LIST', 'PROD_TWO_LIST', 'PROD_THREE_LIST'];
      for (var c = 0; c < localArr.length; c++) {
        Session.save(state[storeArr[c]], localArr[c]);
      }
    },
    // 快递详情
    expressInfo (state, msg) {
      msg.Traces = msg.Traces.reverse();
      state.expressInfo = msg;
    },
    // 地址列表
    addressList (state, msg) {
      var len = msg.length;
      var item = null;
      for (var i = 0; i < len; i++) {
        if (parseInt(msg[i].is_default) === 1) {
          item = msg[i];
          msg.splice(i, 1);
          break;
        }
      }
      msg.unshift(item);
      state.addressList = msg;
    },
    // 购买产品返回的订单
    buyProdInfo (state, msg) {
      state.buyProdInfo = msg;
    },
    // 订单列表
    orderList (state, msg) {
      if (msg.count === 1) {
        state.orderList = [];
      }
      state.orderList = state.orderList.concat(msg.data);
      Session.save(state.orderList, ORDER_LIST_ALL);
    },
    jfAllList (state, msg) {
      if (msg.count === 1) {
        state.jfAllList = [];
      }
      state.jfAllList = state.jfAllList.concat(msg.data);
    },
    fansList (state, msg) {
      if (msg.count === 1) {
        state.fansList = [];
      }
      state.fansList = state.fansList.concat(msg.data);
    },
    // 藏宝位
    publicList (state, msg) {
      if (msg.count === 1) {
        state.publicList = [];
      }
      state.publicList = state.publicList.concat(msg.data);
    },
    fkCenter (state, msg) {
      state.fkCenter = msg;
    },
    // 提现日志
    withdrawCountList (state, msg) {
       if (msg.count === 1) {
        state.withdrawCountList = [];
      }
      state.withdrawCountList = state.withdrawCountList.concat(msg.data);
    }
  },
  actions: {
    // 获取手机验证码
    getValidateCode ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getList(res => {
          resolve(res);
        }, option, GET_VALIDATECODE_PATH);
     });
    },
    // 会员注册
    memberRegister ({commit, state}, option) {
      return new Promise((resolve, reject) => {
          axios.getData(res => {
            // console.log(res);
            resolve(res);
          }, option, MEMBER_REGISTER_PATH);
       });
    },
    // 会员登录
    memberLogin ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (parseInt(res.code) === 200) { // 如果响应是200就存储
            commit('memberLogin', res.data);
            // console.log(res.data);
            Local.save(res.data, MEMBER_LOGIN);
          }
          resolve(res);
        }, option, MEMBER_LOGIN_PATH);
     });
    },
    // 会员退出登录
    logout ({commit, state}, option) {
      return new Promise((resolve, reject) => {
          // commit('memberLogout');
          Local.empty(MEMBER_LOGIN);
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
        axios.getList(res => {
          if (res.code === 200) {
            commit('memberInfo', res.data);
            Session.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    prodList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res.data);
              commit('prodList', res.data.items);
            }
            resolve(res);
          }, option, PROD_LIST_PATH);
      });
    },
    addressList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res.data);
              commit('addressList', res.data);
              Session.save(res.data, ADDRESS_LIST);
            }
            resolve(res);
          }, option, ADDRESS_LIST_PATH);
      });
    },
    addAddress ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, ADD_ADDRESS_PATH);
      });
    },
    // 设置为默认地址
    chooseDefault ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, DEFAULT_ADDRESS_PATH);
      });
    },
    // 删除收货地址
    delAddress ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, DEL_ADDRESS_PATH);
      });
    },
    // 编辑地址
    editAddress ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, EDIT_ADDRESS_PATH);
      });
    },
    // 产品下订单
    buyProdInfo ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            if (res.code === 200) {
              commit('buyProdInfo', res.data);
              Session.save(res.data, PROD_INFO_BUY);
            }
            resolve(res);
          }, option, BUY_PRODINFO_PATH);
      });
    },
    // 支付
    payChange ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, BUY_PAY_PATH);
      });
    },
    // 订单列表
    orderList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res);
              commit('orderList', {data: res.data.items, count: option.pages});
            }
            resolve(res);
          }, option, ORDER_LIST_PATH);
      });
    },
    // 确认收货
    sureOrder ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, ORDER_SURE_PATH);
      });
    },
    jfAllList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res);
              commit('jfAllList', {data: res.data.items, count: option.pages});
            }
            resolve(res);
          }, option, ALL_JF_LIST_PATH);
      });
    },
    publicList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res);
              commit('publicList', {data: res.data.items, count: option.pages});
            }
            resolve(res);
          }, option, PUBLIC_LIST_PATH);
      });
    },
    // 快递详情
    expressInfo ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              commit('expressInfo', res.data);
            }
            resolve(res);
          }, option, EXPRESS_INFO_PATH);
      });
    },
    // 客服中心
    fkCenter ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              commit('fkCenter', res.data);
            }
            resolve(res);
          }, option, KF_CENTER_PATH);
      });
    },
    // 提现
    withdrawBank ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, WITHDRAW_CREATE_PATH);
      });
    },
    // 提现日志接口
    withdrawCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              commit('withdrawCountList', {data: res.data.items, count: option.pages});
            }
            resolve(res);
          }, option, WITHDRAW_LIST_PATH);
      });
    },
    fansList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 200) {
              // console.log(res);
              commit('fansList', {data: res.data.items, count: option.pages});
            }
            resolve(res);
          }, option, FANS_LIST_PATH);
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
