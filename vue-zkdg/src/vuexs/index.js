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
const GET_VALIDATECODE_PATH = 'sendCode';
// 会员注册接口
const MEMBER_REGISTER_PATH = 'register';
// 用户登录接口
const MEMBER_LOGIN_PATH = 'login';
// 忘记密码
const FORGET_PASSWORD_PATH = 'reset/pwd';
// 用户退出登录
// const MEMBER_LOGOUT_PATH = 'member/logout';
// 用户修改密码
const EDIT_PASSWORD_PATH = 'editPassword';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'user';
// 收货地址列表
const ADDRESS_LIST_PATH = 'address';
const ADD_ADDRESS_PATH = 'address/create';
const EDIT_ADDRESS_PATH = 'address/update';
const AREA_LIST_PATH = 'region';
const CHOOSE_DEFAULT_PATH = 'address/default';
const DELETE_ADDRESS_PATH = 'address/delete';

// 商品列表
const PROD_LIST_PATH = 'goods/index';
const PROD_DETAIL_PATH = 'goods';
// 添加到购物车
const ADD_CART_PATH = 'cart/create';
// 立即购买
const BUY_NOW_PATH = 'order/init';
// 购物车购买
const CART_BUY_PATH = 'order/create';
// 购物车列表
const CART_LIST_PATH = 'cart';
// 更改购物车数量
const CHANGE_NUM_PATH = 'cart/update';
// 删除购物车
const DEL_CART_PATH = 'cart/delete';
// 订单列表
const ORDER_LIST_PATH = 'order/index';
// 删除订单
const ORDER_DELETE_PATH = 'order/delete';
// 确认收货
const ORDER_SURE_PATH = 'order/confirm';
// 查看快递信息
const ORDER_EXPRESS_PATH = 'order/express';
// 退款
const ORDER_EXIT_PATH = 'order/return/create';
// 订单售后列表
const ORDER_RETURN_PATH = 'order/return';
// 获取快递编码
const GET_EXP_CODE_PATH = 'order/code';
// 退货订单接口
const POST_EXPRESS_PATH = 'order/return/edit';
// 关于我们接口
const ABOUT_US_PATH = 'contact';

// 我的team
const TEAM_LIST_PATH = 'myteam';
// 账户日志
const ACCOUNT_LOG_PATH = 'account';
// 提现日志
const WITHDRAW_LIST_PATH = 'withdraw';
// 提交提现
const WITHDRAW_POST_PATH = 'withdraw/create';
// 升级
const UP_GRADE_PATH = 'upgrade';
const UP_GRADE_SERVER_PATH = 'order/upgrade';
const BUY_LINK_PATH = 'pay';
// 更换头像
const CHANGE_HEAD_PATH = 'headPic';
// 广告
const AD_PATH = 'ad';

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
    memberLogin: Local.fetch(MEMBER_LOGIN) === null ? {} : Local.fetch(MEMBER_LOGIN),
    memberInfo: Local.fetch(MEMBER_INFO) === null ? {} : Local.fetch(MEMBER_INFO),
    addressList: Session.fetch(ADDRESS_LIST) === null ? {} : Session.fetch(ADDRESS_LIST),
    areaOneList: [], // 收获地址省市区
    areaTwoList: [],
    areaThreeList: [],
    aboutus: {}, // 關於我們
    linkus: {}, // 联系我們
    serverInfo: {}, // 升级服务商获取的信息
    prodList: [], // 产品列表
    slideList: [], // 广告列表
    cartList: [], // 购物车列表
    prodDetail: {}, // 产品详情
    orderList: [], // 订单列表
    teamList: [], // 团队列表
    withdrawLogList: [], // 提现日志
    expressInfo: {}, // 快递信息
    orderRrturn: [], // 订单售后列表
    expressCode: [], // 快递编码
    accountLogList: [] // 账户日志
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
    addressList (state, msg) {
      state.addressList = msg;
    },
    // 存放省市区
    areaList (state, msg) {
      state[areaType[msg.type]] = msg.data;
    },
    getSlideList (state, msg) {
      state.slideList = msg;
    },
    getProdList (state, msg) {
      state.prodList = msg;
    },
    getPordDetail (state, msg) {
      state.prodDetail = msg;
    },
    getCartList (state, msg) {
      var len = msg.length;
      for (var i = 0; i < len; i++) {
        msg[i].choose = 0;
      }
      state.cartList = msg;
    },
    changeChoose (state, index) {
      // console.log(index);
      if (parseInt(state.cartList[index].choose) === 0) {
        state.cartList[index].choose = 1;
      } else {
        state.cartList[index].choose = 0;
      }
    },
    allChangeChoose (state, type) {
      var len = state.cartList.length;
      for (var i = 0; i < len; i++) {
        // console.log(i);
        state.cartList[i].choose = type;
      }
    },
    changeNum (state, msg) {
      state.cartList[msg.index].num = msg.num;
    },
    // 订单列表
    orderList (state, msg) {
      if (msg.type === 1) {
        state.orderList = msg.data;
      } else if (msg.type === 2) {
        state.orderList = state.orderList.concat(msg.data);
      }
    },
    // 删除本地存储的当前订单
    orderDelete (state, index) {
      state.orderList.splice(index, index + 1);
    },
    // 查看快递信息
    expressInfo (state, msg) {
      msg.Traces = msg.Traces.reverse();
      state.expressInfo = msg;
    },
    // 团队列表
    teamList (state, msg) {
      if (msg.type === 1) {
        state.teamList = msg.data;
      } else if (msg.type === 2) {
        state.teamList = state.teamList.concat(msg.data);
      }
    },
    // 账户日志列表
    accountLogList (state, msg) {
      if (msg.type === 1) {
        state.accountLogList = msg.data;
      } else if (msg.type === 2) {
        state.accountLogList = state.accountLogList.concat(msg.data);
      }
    },
    withdrawLogList (state, msg) {
      if (msg.type === 1) {
        state.withdrawLogList = msg.data;
      } else if (msg.type === 2) {
        state.withdrawLogList = state.withdrawLogList.concat(msg.data);
      }
    },
    orderRrturn (state, msg) {
      if (msg.type === 1) {
        state.orderRrturn = msg.data;
      } else if (msg.type === 2) {
        state.orderRrturn = state.orderRrturn.concat(msg.data);
      }
    },
    getExpressCode (state, msg) {
      state.expressCode = msg;
    },
    aboutus (state, msg) {
      state.aboutus = msg;
    },
    linkus (state, msg) {
      state.linkus = msg;
    },
    serverUpGrade (state, msg) {
      state.serverInfo = msg;
    }
  },
  actions: {
    // 获取手机验证码
    getValidateCode ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, GET_VALIDATECODE_PATH);
     });
    },
    // 会员注册
    memberRegister ({commit, state}, option) {
      return new Promise((resolve, reject) => {
          axios.getData(res => {
            if (res.code === 1) { // 如果响应是200就存储
              commit('memberLogin', res.data);
              // console.log(res.data);
              Local.save(res.data, MEMBER_LOGIN);
            }
            // console.log(res);
            resolve(res);
          }, option, MEMBER_REGISTER_PATH);
       });
    },
    // 会员登录
    memberLogin ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.code === 1) { // 如果响应是200就存储
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
        Local.empty(MEMBER_INFO);
        resolve();
      });
    },
    // 忘记密码
    forgetPass ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, FORGET_PASSWORD_PATH);
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
          if (res.code === 1) {
            commit('memberInfo', res.data);
            Local.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    // 获取会员基本信息
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
    getSlideList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('getSlideList', res.data.lunb);
          }
          resolve(res);
        }, option, AD_PATH);
      });
    },
    // 获取商品列表
    getProdList ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 1) {
              commit('getProdList', res.data.lists);
            }
            resolve(res);
          }, option, PROD_LIST_PATH);
      });
    },
    getPordDetail ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            commit('getPordDetail', res.data);
            resolve(res);
          }, option, PROD_DETAIL_PATH);
      });
    },
    // 添加购物车
    addCart ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, ADD_CART_PATH);
      });
    },
    buyProdInfo ({commit, state}, option) {
      var path = '';
      if (option.type === 0) { // 直接购买
        path = BUY_NOW_PATH;
      } else { // 购物车购买
        path = CART_BUY_PATH;
      }
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option.data, path);
      });
    },
    getCartList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (res.code === 1) {
              commit('getCartList', res.data.lists);
            }
            resolve(res);
          }, option, CART_LIST_PATH);
      });
    },
    // 更改当前为是否选中
    changeChoose ({commit, state}, option) {
      return new Promise((resolve) => {
        commit('changeChoose', option.index);
        resolve();
      });
    },
    allChangeChoose ({commit, state}, option) {
      return new Promise((resolve) => {
        commit('allChangeChoose', option.type);
        // console.log('out');
        resolve();
      });
    },
    // 更改购物车数量
    changeNum ({commit, state}, option) {
      var data = {
        token: option.token,
        cart_id: state.cartList[option.index].cart_id,
        num: option.prodNum
      };
      return new Promise((resolve) => {
          axios.getData(res => {
            if (res.code === 1) {
              commit('changeNum', {index: option.index, num: option.prodNum});
            }
            resolve(res);
          }, data, CHANGE_NUM_PATH);
      });
    },
    // 删除购物车
    delCart ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          resolve(res);
        }, option, DEL_CART_PATH);
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
          if (res.code === 1) { // 删除成功后把本地的也删除
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
          if (res.code === 1) { // 删除成功后把本地的也删除
            commit('orderDelete', option.index);
          }
          resolve(res);
        }, option.data, ORDER_SURE_PATH);
      });
    },
    // 退款
    orderExit ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          // if (res.code === 1) { // 删除成功后把本地的也删除
          //   commit('orderDelete', option.index);
          // }
          resolve(res);
        }, option.data, ORDER_EXIT_PATH);
      });
    },
    orderRrturn ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          // console.log(res);
          if (res.code === 1) {
            commit('orderRrturn', {data: res.data.lists, type: option.type});
          }
          resolve(res);
        }, option.data, ORDER_RETURN_PATH);
      });
    },
    getExpressCode ({commit, state}, option = {}) {
      return new Promise((resolve) => {
        axios.getList(res => {
          // console.log(res);
          if (res.code === 1) {
            commit('getExpressCode', res.data);
          }
          resolve(res);
        }, option, GET_EXP_CODE_PATH);
      });
    },
    // 提交退货订单编号
    postExpress ({commit, state}, option = {}) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, POST_EXPRESS_PATH);
      });
    },
    // team列表
    teamList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('teamList', {data: res.data, type: option.type});
          }
          resolve(res);
        }, option.data, TEAM_LIST_PATH);
      });
    },
    // 账户日志列表
    accountLogList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            commit('accountLogList', {data: res.data.lists, type: option.type});
          }
          resolve(res);
        }, option.data, ACCOUNT_LOG_PATH);
      });
    },
    withdrawLogList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          commit('withdrawLogList', {data: res.data.lists, type: option.type});
          resolve(res);
        }, option.data, WITHDRAW_LIST_PATH);
      });
    },
    withdrawPost ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, WITHDRAW_POST_PATH);
      });
    },
    // 查看快递信息
    expressInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          commit('expressInfo', res.data);
          resolve(res);
        }, option, ORDER_EXPRESS_PATH);
      });
    },
    getAboutDetail ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (res.code === 1) {
            if (parseInt(option.type) === 1) {
              commit('aboutus', res.data);
            } else if (parseInt(option.type) === 0) {
              commit('linkus', res.data);
            }
          }
          resolve(res);
        }, option, ABOUT_US_PATH);
      });
    },
    // 升级
    postUpgrade ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          if (res.code === 1 && option.type === 0) {
            commit('serverUpGrade', res.data);
          }
          resolve(res);
        }, option, UP_GRADE_PATH);
      });
    },
    // 升级服务商
    upgradeServer ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, UP_GRADE_SERVER_PATH);
      });
    },
    buyLink ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, BUY_LINK_PATH);
      });
    },
    changeAvatar ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.postImg(res => {
          resolve(res);
        }, option, CHANGE_HEAD_PATH);
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
