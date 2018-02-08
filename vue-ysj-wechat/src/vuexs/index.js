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

// 获取会员token
const MEMBER_LOGIN_PATH = 'getStr';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'user';
// 获取导航分类
const PROD_CATEGORY = 'category';
// 收货地址列表
const ADDRESS_LIST_PATH = 'address';
const ADD_ADDRESS_PATH = 'address/create';
const EDIT_ADDRESS_PATH = 'address/update';
const AREA_LIST_PATH = 'region';
const CHOOSE_DEFAULT_PATH = 'address/default';
const DELETE_ADDRESS_PATH = 'address/delete';
// 立即购买
const BUY_PORD_PATH = 'order/create';
// 支付
const PAY_PATH = 'pay';
// 公司地址
const COMPANY_ADDRESS_PATH = 'company/address';
// 商品列表
const PROD_LIST_PATH = 'goods/index';
const PROD_DETAIL_PATH = 'goods';
// 订单列表
const ORDER_LIST_PATH = 'order/index';
// 订单详情
const ORDER_DETAIL_PATH = 'order/show';
// 删除订单
const ORDER_DELETE_PATH = 'order/delete';
// 确认收货
const ORDER_SURE_PATH = 'order/confirm';
// 查看快递信息
const ORDER_EXPRESS_PATH = 'order/express';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';
const MEMBER_INFO = 'member_info';
const ADDRESS_LIST = 'address_list';

// 地区存储类型
const areaType = ['areaOneList', 'areaTwoList', 'areaThreeList'];

// 创建一个用来共享的 store 实例化对象
const store = new Vuex.Store({
  state: {
    // 会员登录以后的会员信息
    memberLogin: Session.fetch(MEMBER_LOGIN) === null ? {} : Session.fetch(MEMBER_LOGIN),
    memberInfo: Session.fetch(MEMBER_INFO) === null ? {} : Session.fetch(MEMBER_INFO),
    category: [], // 导航分类
    prodList: [], // 产品列表
    prodDetail: {}, // 产品详情
    addressList: Session.fetch(ADDRESS_LIST) === null ? {} : Session.fetch(ADDRESS_LIST),
    expressInfo: {}, // 快递信息
    orderList: [], // 订单列表
    orderDetail: {}, // 订单详情
    areaOneList: [], // 收获地址省市区
    areaTwoList: [],
    areaThreeList: []
  },
  mutations: {
    // 会员登录记录token
    memberLogin (state, msg) {
      state.memberLogin = msg;
    },
    // 会员信息
    memberInfo (state, msg) {
      state.memberInfo = msg;
    },
    // 导航分类
    category (state, msg) {
      state.category = msg;
    },
    // 产品列表
    prodList (state, msg) {
      if (msg.page === 1) {
        state.prodList = msg.data;
      } else {
        state.prodList = state.prodList.concat(msg.data);
      }
    },
    prodDetail (state, msg) {
      state.prodDetail = msg;
    },
    addressList (state, msg) {
      state.addressList = msg;
    },
    // 存放省市区
    areaList (state, msg) {
      state[areaType[msg.type]] = msg.data;
    },
    // 订单列表
    orderList (state, msg) {
      if (msg.type === 1) {
        state.orderList = msg.data;
      } else if (msg.type === 2) {
        state.orderList = state.orderList.concat(msg.data);
      }
      // console.log(state.orderList);
    },
    // 删除本地存储的当前订单
    orderDelete (state, index) {
      // alert(index);
      state.orderList.splice(index, 1);
    },
    // 订单详情
    orderDetail (state, msg) {
      state.orderDetail = msg;
    },
    // 查看快递信息
    expressInfo (state, msg) {
      msg.Traces = JSON.parse(msg.Traces).reverse();
      state.expressInfo = msg;
    }
  },
  actions: {
    // 会员登录
    memberLogin ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('memberLogin', res.data);
            // console.log(res.data);
            Session.save(res.data, MEMBER_LOGIN);
          }
          resolve(res);
        }, option, MEMBER_LOGIN_PATH);
      });
    },
    // 获取会员基本信息
    memberInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('memberInfo', res.data);
            Session.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    // 获取导航分类
    category ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('category', res.data);
          }
          resolve(res);
        }, option, PROD_CATEGORY);
      });
    },
    // 获取商品列表
    getProdList ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 1) {
              commit('prodList', {data: res.data.lists, page: option.page});
            }
            resolve(res);
          }, option, PROD_LIST_PATH);
      });
    },
    // 获取产品详情
    getPordDetail ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            commit('prodDetail', res.data);
            resolve(res);
          }, option, PROD_DETAIL_PATH);
      });
    },
    // 提交订单
    postOrder ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, BUY_PORD_PATH);
      });
    },
    // 支付
    prodPay ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, PAY_PATH);
      });
    },
    // 获取公司信息
    companyAddress ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            resolve(res);
          }, option, COMPANY_ADDRESS_PATH);
      });
    },
    // 获取地址列表
    addressList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('addressList', res.data);
            Session.save(res.data, ADDRESS_LIST);
          }
          resolve(res);
        }, option, ADDRESS_LIST_PATH);
      });
    },
    editAddress ({commit, state}, option) {
      var path = '';
      if (option.type === 2) { // 修改地址
        path = EDIT_ADDRESS_PATH;
      } else { // 添加地址
        path = ADD_ADDRESS_PATH;
      }
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option.data, path);
      });
    },
    // 获取省市区列表
    areaList ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 1) {
              commit('areaList', {data: res.data, type: option.type});
            }
            resolve(res.data);
          }, option.data, AREA_LIST_PATH);
      });
    },
    chooseDefault ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getList(res => {
            resolve(res);
          }, option, CHOOSE_DEFAULT_PATH);
      });
    },
    delAddress ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getList(res => {
            resolve(res);
          }, option, DELETE_ADDRESS_PATH);
      });
    },
    getOrderList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('orderList', {data: res.data.lists, type: option.type});
          }
          resolve(res);
        }, option.data, ORDER_LIST_PATH);
      });
    },
    // 删除订单
    orderDelete ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          // alert(option.index !== undefined);
          if (res.code === 1 && option.index !== -1) { // 删除成功后把本地的也删除
            commit('orderDelete', option.index);
          }
          resolve(res);
        }, option.data, ORDER_DELETE_PATH);
      });
    },
    // 确认收货
    orderSure ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          if (res.code === 1 && option.index !== -1) { // 删除成功后把本地的也删除
            commit('orderDelete', option.index);
          }
          resolve(res);
        }, option.data, ORDER_SURE_PATH);
      });
    },
    // 订单详情
    orderDetail ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('orderDetail', res.data);
          }
          resolve(res);
        }, option, ORDER_DETAIL_PATH);
      });
    },
    delListOrder ({commit, state}, index) {
      // alert(index);
      if (index !== -1) {
        commit('orderDelete', index);
      }
    },
    // 查看快递信息
    expressInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('expressInfo', res.data);
          }
          resolve(res);
        }, option, ORDER_EXPRESS_PATH);
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
