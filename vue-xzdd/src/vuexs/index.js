import Vue from 'vue';
import Vuex from 'vuex';

// 引入session
import Session from 'common/js/sessionStorage';
// 引入axios异步调用的 函数接口(home-as-axios)就是给他换了个名称
import { xz as axios } from '../vue_axios';

// 首页状态
// import home from './modules/home';

// 使用vue的状态管理vuex
Vue.use(Vuex);

// 获取全国选择里面的所有地区的接口(讲师，场地的全国通用的)
const MEMBER_LOGIN_PATH = 'member/login';
// 退出登录
// const LOGOUT_PATH = 'member/logout';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'member/get-member-info';
// 修改昵称
const EDIT_NIKENAME_PATH = 'member/chg-nick-name';
// 修改密码
const EDIT_NEWPWD_PATH = 'member/set-pass';
// 添加收获地址
const EDIT_ADDRESS_PATH = 'address/create';
// 编辑收获地址
const UPDATE_ADDRESS_PATH = 'address/update';
// 收获地址列表接口
const ADDRESS_LIST_PATH = 'address/index';
// 删除收获地址
const ADDRESS_REMOVE_PATH = 'address/delete';
// 添加邀请会员的接口
const INVITE_MEMBER_PATH = 'member/create';
// 添加转币的接口
const CHANGE_MONEY_PATH = 'account/trans';
// A网公排
const PUBLIC_A_PATH = 'public-row/index';
// B网公排
const PUBLIC_B_PATH = 'public-row/blist';
// 账户日志
const ACCOUNT_INDEX_PATH = 'account/index';
// 提现
const WITH_DRAW_PATH = 'withdraw/create';
// 提现记录
const COUNT_DRAW_PATH = 'withdraw/index';
// 团队列表
const TEAM_LIST_PATH = 'team/index';
// 血战订单列表接口
const XZ_ORDER_PATH = 'licai-order/index';
// 添加血战订单
const XZ_BUY_PATH = 'licai-order/create';
// 添加充值接口
const XZ_CZ_PATH = 'recharge/create';
// 充值记录的接口
const XZ_CODE_PATH = 'recharge/index';
// 订单接口
const ORDER_LIST_PATH = 'orders/index';
// 订单详情接口
const ORDER_DETAIL_PATH = 'orders/view';
// 获取中奖名单的接口
const LOTTERY_INDEX_PATH = 'lottery/index';
// 会员注册
const MEMBER_REGISTER_PATH = 'member/register';
// 购买产品接口
const BUY_PRODUCT_PATH = 'orders/create';
// 根据手机号获取会员信息
const MEMBER_MOBILE_PATH = 'member/get-info-by-mobile';
// 我的收益接口
const ACCOUNT_TONGJI_PATH = 'account/tongji';
// 导师团接口
const DAOSHI_TEACHER_PATH = 'daoshi/index';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';
const MEMBER_INFO = 'member_info';
const IS_APP = 'is_app';
// const consumerType = ['moneyConsumerList', 'pointConsumerList'];

// 创建一个用来共享的 store 实例化对象
const store = new Vuex.Store({
  state: {
    // 会员登录以后的会员信息
    memberLogin: Session.fetch(MEMBER_LOGIN) === null ? {} : Session.fetch(MEMBER_LOGIN),
    memberInfo: Session.fetch(MEMBER_INFO) === null ? {} : Session.fetch(MEMBER_INFO),
    publicA: {}, // A公网
    publicB: {}, // B公网
    countDetail: {}, // 账户日志
    countDraw: {}, // 提现记录
    teamList: {}, // 团队列表
    addressList: [], // 收获地址列表
    orderList: [], // 订单列表
    orderDetail: {}, // 订单详情
    xzOrderDetail: {}, // 血战订单
    // lotteryList: [{'period': '201706230004', 'uname': '13745741245', 'nike_name': '白色'}, {'period': '201706230224', 'uname': '15245741223', 'nike_name': 'xiaoH'}, {'period': '201706230014', 'uname': '13845741524', 'nike_name': '这是'}], // 中奖名单
    lotteryList: [], // 中奖名单
    czcodeList: {}, // 充值记录
    moneyDetailList: {}, // 我的收益
    dsTeacher: [], // 导师团
    isApp: Session.fetch(IS_APP) === null ? 1 : Session.fetch(IS_APP)
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
    // 修改会员信息
    editMemberInfo (state, msg) {
      state.memberInfo[msg[0]] = msg[1];
      Session.save(state.memberInfo, MEMBER_INFO);
    },
    // 第一次进来收获地址补全
    changeHaveAdd (state, type) {
      state.memberLogin.haveAdd = type;
      Session.save(state.memberLogin, MEMBER_LOGIN);
    },
    publicA (state, msg) {
      state.publicA = msg;
    },
    publicB (state, msg) {
      state.publicB = msg;
    },
    countDetail (state, msg) {
      state.countDetail = msg;
    },
    countDraw (state, msg) {
      state.countDraw = msg;
    },
    teamList (state, msg) {
      state.teamList = msg;
    },
    addressList (state, msg) {
      state.addressList = msg;
    },
    xzOrderDetail (state, msg) {
      state.xzOrderDetail = msg;
    },
    // 充值记录
    czcodeList (state, msg) {
      state.czcodeList = msg;
    },
    // 订单列表
    orderList (state, msg) {
      state.orderList = msg;
    },
    // 我的收益
    moneyDetailList (state, msg) {
      state.moneyDetailList = msg;
    },
    // 导师团
    dsTeacher (state, msg) {
      state.dsTeacher = msg;
    },
    // 订单详情
    orderDetail (state, msg) {
      state.orderDetail = msg;
    },
    // 获取中奖名单
    lotteryList (state, msg) {
      state.lotteryList = msg;
    },
    isApp (state, type) {
      state.isApp = type;
    },
    // 退出登录
    logout (state, msg) {
      state.memberLogin = {};
      state.memberInfo = {};
      Session.empty(MEMBER_INFO);
      Session.empty(MEMBER_LOGIN);
      Session.empty(IS_APP);
    }
  },
  actions: {
    // 会员登录
    loginMember ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (!res.data.code) {
            commit('memberLogin', res.data);
            Session.save(res.data, MEMBER_LOGIN);
          }
          // commit('logout');
          // window.location.href = 'http://api.huichapu.cn?isApp=' + state.isApp === 0 ? '1' : '0';
          // if (res.data.code) {
          resolve(res);
        }, option, MEMBER_LOGIN_PATH);
     });
    },
    // 退出登录
    logout ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        commit('logout');
        resolve();
        // axios.getData(res => {
        //   if (res.message === 'OK') {
        //     commit('logout');
        //   }
        //   resolve(res);
        // }, option, LOGOUT_PATH);
     });
    },
    // 获取会员基本信息
    memberInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('memberInfo', res.data);
            Session.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    // 修改昵称
    editNikeName ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          if (!res.data.code) {
            commit('editMemberInfo', ['nick_name', option.nickName]);
          }
          resolve(res);
        }, option, EDIT_NIKENAME_PATH);
      });
    },
    // 修改密码
    editNewPwd ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, EDIT_NEWPWD_PATH);
      });
    },
    // 会员注册
    memberRegister ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, MEMBER_REGISTER_PATH);
      });
    },
    // 获取所有的收获地址
    addressList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('addressList', res.data);
          }
          resolve(res);
        }, option, ADDRESS_LIST_PATH);
      });
    },
    // 删除收获地址
    removeAdd ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, ADDRESS_REMOVE_PATH);
      });
    },
    // 添加编辑收货地址
    editAddress ({commit, state}, option) {
      var path = '';
      if (option.type === 0) {
        path = EDIT_ADDRESS_PATH;
      } else {
        path = UPDATE_ADDRESS_PATH;
      }
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('changeHaveAdd', 1);
          }
          resolve(res);
        }, option.data, path);
     });
    },
    // 购买产品
    buyProduct ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, BUY_PRODUCT_PATH);
      });
    },
    // 邀请会员
    inviteMember ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, INVITE_MEMBER_PATH);
      });
    },
    // 转币
    exchangeMoney ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, CHANGE_MONEY_PATH);
      });
    },
    // 公网A排
    publicA ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('publicA', res.data.lists);
          }
          resolve(res.data);
        }, option, PUBLIC_A_PATH);
      });
    },
    // 公网B排
    publicB ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('publicB', res.data.lists);
          }
          resolve(res.data);
        }, option, PUBLIC_B_PATH);
      });
    },
    // 账户日志
    countDetail ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('countDetail', res.data);
          }
          resolve(res.data);
          // resolve(res.data);
        }, option, ACCOUNT_INDEX_PATH);
      });
    },
    // 提现
    withDraw ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, WITH_DRAW_PATH);
      });
    },
    // 提现记录
    countDraw ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('countDraw', res.data);
          }
          resolve(res.data);
        }, option, COUNT_DRAW_PATH);
      });
    },
    teamList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('teamList', res.data);
          }
          resolve(res.data);
        }, option, TEAM_LIST_PATH);
      });
    },
    xzOrderDetail ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('xzOrderDetail', res.data);
          }
          resolve(res.data);
        }, option, XZ_ORDER_PATH);
      });
    },
    xzOrderBuy ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, XZ_BUY_PATH);
      });
    },
    // 充值金币
    xzCz ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, XZ_CZ_PATH);
      });
    },
    // 充值记录
    czcodeList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('czcodeList', res.data);
          }
          resolve(res);
        }, option, XZ_CODE_PATH);
      });
    },
    // 订单列表
    orderList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('orderList', res.data.lists);
          }
          resolve(res);
        }, option, ORDER_LIST_PATH);
      });
    },
    // 获取订单详情
    orderDetail ({commit, state}, option) {
      // console.log(state.orderList[option.index - 1].order_no);
      var data = {
        token: option.data.token,
        orderNo: String(state.orderList[option.index - 1].order_no)
      };
      return new Promise((resolve, reject) => {
        axios.getList(res => {
          if (res.message === 'OK') {
            commit('orderDetail', res.data);
            // console.log(res.data);
          }
         resolve(res);
        }, data, ORDER_DETAIL_PATH);
      });
    },
    // 获取中奖名单
    lotteryList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getList(res => {
          if (res.message === 'OK') {
            commit('lotteryList', res.data);
          }
          resolve(res);
        }, option, LOTTERY_INDEX_PATH);
      });
    },
    // 是app登录才调用
    isApp ({commit, state}, option) {
      // console.log(option.type);
      // if (!Session.fetch(IS_APP)) {
      commit('isApp', option.type);
      Session.save(option.type, IS_APP);
      // }
    },
    // 根据手机号获取用户信息
    getName ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          resolve(res);
        }, option, MEMBER_MOBILE_PATH);
      });
    },
    // ACCOUNT_TONGJI_PATH
    // 我的收益详情
    moneyDetailList ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            commit('moneyDetailList', res.data);
          }
          resolve(res);
        }, option, ACCOUNT_TONGJI_PATH);
      });
    },
    // 导师团
    dsTeacher ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (res.message === 'OK') {
            // console.log(res.data);
            commit('dsTeacher', res.data.lists);
          }
          resolve(res);
        }, option, DAOSHI_TEACHER_PATH);
      });
    },
    test ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.test2(res => {
          resolve(res);
        }, option);
      });
    },
    test3 ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.test3(res => {
          resolve(res);
        }, option);
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
