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
const GET_VALIDATECODE_PATH = 'member/send-reg-mobile';
// 会员注册接口
const MEMBER_REGISTER_PATH = 'member/register';
// 用户登录接口
const MEMBER_LOGIN_PATH = 'member/login';
// 用户退出登录
const MEMBER_LOGOUT_PATH = 'member/logout';
// 用户修改密码
const EDIT_PASSWORD_PATH = 'member/set-pass';
// 获取会员基本信息
const MEMBER_INFO_PATH = 'member/get-member-info';
// 设置交易密码的接口
const SET_EXCHANGECODE_PATH = 'pay-pass/create';
// 忘记交易密码的接口
const EDIT_EXCHANGECODE_PATH = 'pay-pass/find';
// 修改交易密码的接口
const PAY_PASSWORD_PATH = 'pay-pass/edit';
// 发送会员设置支付密码手机验证码
const PAY_MOBILE_PATH = 'pay-pass/send-pay-mobile';
// 昵称修改
const EDIT_NICKNAME_PATH = 'member/chg-nick-name';
// 设置会员的基本信息
const EDIT_INFOMSG_PATH = 'member/set-info';
// 根据用户名获取会员信息
const GET_BUY_UNAME_PATH = 'member/get-info-by-mobile';
// 创建会员转账订单的接口
const TRANS_ORDER_DETAIL_PATH = 'trans/create';
// 激活币账户日志接口
const JHB_LIST_PATH = 'trans/code-index';
// 余额账户日志接口
const YE_LIST_PATH = 'trans/balance-index';
// 收益奖金账户日志接口
const SY_LIST_PATH = 'trans/profit-index';
// 积分转账日志的接口
const JF_LIST_PATH = 'trans/shop-index';
// 获取理财产品列表的接口
const LC_DETAILLIST_PATH = 'licai/index';
// 创建理财订单
const ADD_LCORDER_PATH = 'licai/create';
// 帮助中心-获取文章类别
const HELP_ARTICALTYPE_PATH = 'news/get-category';
// 帮助中心-获取文章详情
const HELP_ARTICALDETAIL_PATH = 'news/view';
// 帮助中心-获取文章列表
const HELP_ARTICALLIST_PATH = 'news/index';
// 账户日志
const LOG_COUNTLIST_PATH = 'account/index';
// 团队津贴日志
const TEAMJT_COUNTLIST_PATH = 'team/padian';
// 团队业绩日志
const TEAMYJ_LIST_PATH = 'team/index';
// 获取大盘交易价格
const GET_BIGPRICE_PATH = 'withdraw/get-price';
// 提现接口
const WITHDRAW_INFO_PATH = 'withdraw/create';
// 提现日志接扣
const WITHDRAW_LIST_PATH = 'withdraw/index';
// 消费记录接口
const XFCOUNT_LIST_PATH = 'licai/list';
// 支付宝银行卡提现
const WITHDRAW_BANK_INFO_PATH = 'withdraw-bank/create';
// 支付宝银行卡提现记录
const WITHDRAW_BANK_LIST_PATH = 'withdraw-bank/index';
// 收益购买激活币
const SY_BUY_JHB_PATH = 'activation-code/buy';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';
const MEMBER_INFO = 'member_info';
// 账户日志的数组存储的字段
const logCountType = ['', 'jtCountList', 'fxCountList', 'gxCountList', '', '', 'gwjtCountList'];
// 地区存储类型
const areaType = ['areaOneList', 'areaTwoList', 'areaThreeList'];

// 创建一个用来共享的 store 实例化对象
const store = new Vuex.Store({
  state: {
    // 会员登录以后的会员信息
    memberLogin: Local.fetch(MEMBER_LOGIN) === null ? {} : Local.fetch(MEMBER_LOGIN),
    memberInfo: Session.fetch(MEMBER_INFO) === null ? {} : Session.fetch(MEMBER_INFO),
    jhbCountList: [], // 激活币账户日志
    yeCountList: [], // 余额账户日志
    syCountList: [], // 收益奖金账户日志
    jfCountList: [], // 收益奖金账户日志
    lcDetailList: {}, // 理财列表
    helpArticalType: [], // 帮助中心-获取文章类别
    helpArticalDetail: {},
    gwjtCountList: [], // 岗位津贴日志
    jtCountList: [], // 静态收益日志
    fxCountList: [], // 分享收益日志
    gxCountList: [], // 共享收益日志
    teamJtCountList: [], // 团队津贴日志
    teamYjList: [], // 团队业绩日志
    getPrice: {}, // 大盘交易价格
    withdrawCountList: [], // 提现日志接口
    xfCountList: [], // 消费日志接口
    bankwraList: [], // 消费日志接口
    tjjList: [], // 首页列表信息
    areaOneList: [], // 收获地址省市区
    areaTwoList: [],
    areaThreeList: []
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
      state.teamYjList = [];
    },
    // 会员信息
    memberInfo (state, msg) {
      state.memberInfo = msg;
    },
    // 激活币日志列表
    jhbCountList (state, msg) {
      if (msg.count === 1) {
        state.jhbCountList = [];
      }
      state.jhbCountList = state.jhbCountList.concat(msg.data);
    },
    yeCountList (state, msg) {
      if (msg.count === 1) {
        state.yeCountList = [];
      }
      state.yeCountList = state.yeCountList.concat(msg.data);
    },
    syCountList (state, msg) {
      if (msg.count === 1) {
        state.syCountList = [];
      }
      state.syCountList = state.syCountList.concat(msg.data);
    },
    // 积分转账日志
    jfCountList (state, msg) {
      if (msg.count === 1) {
        state.jfCountList = [];
      }
      state.jfCountList = state.jfCountList.concat(msg.data);
    },
    // 理财列表
    lcDetailList (state, msg) {
      state.lcDetailList = msg;
    },
    helpArticalType (state, msg) {
      state.helpArticalType = msg;
    },
    // 岗位津贴列表日志
    gwjtCountList (state, msg) {
       if (msg.count === 1) {
        state.gwjtCountList = [];
      }
      state.gwjtCountList = state.gwjtCountList.concat(msg.data);
    },
    // 静态收益日志
    jtCountList (state, msg) {
       if (msg.count === 1) {
        state.jtCountList = [];
      }
      state.jtCountList = state.jtCountList.concat(msg.data);
    },
    // 分享收益日志
    fxCountList (state, msg) {
       if (msg.count === 1) {
        state.fxCountList = [];
      }
      state.fxCountList = state.fxCountList.concat(msg.data);
    },
    // 共享收益日志
    gxCountList (state, msg) {
       if (msg.count === 1) {
        state.gxCountList = [];
      }
      state.gxCountList = state.gxCountList.concat(msg.data);
    },
    teamJtCountList (state, msg) {
       if (msg.count === 1) {
        state.teamJtCountList = [];
      }
      state.teamJtCountList = state.teamJtCountList.concat(msg.data);
    },
    teamYjList (state, msg) {
       if (msg.count === 1) {
        state.teamYjList = [];
      }
      state.teamYjList = state.teamYjList.concat(msg.data);
    },
    helpArticalDetail (state, msg) {
      // console.log(msg);
      state.helpArticalDetail = msg;
    },
    helpArticalList (state, msg) {
      state.helpArticalList = msg;
    },
    getPrice (state, msg) {
      state.getPrice = msg;
    },
    // 提现日志
    withdrawCountList (state, msg) {
       if (msg.count === 1) {
        state.withdrawCountList = [];
      }
      state.withdrawCountList = state.withdrawCountList.concat(msg.data);
    },
    xfCountList (state, msg) {
       if (msg.count === 1) {
        state.xfCountList = [];
      }
      state.xfCountList = state.xfCountList.concat(msg.data);
    },
    bankwraList (state, msg) {
       if (msg.count === 1) {
        state.bankwraList = [];
      }
      state.bankwraList = state.bankwraList.concat(msg.data);
    },
    areaList (state, msg) {
      if (msg.type === 0) {
        var count = 0;
        for (var i = 0; i < msg.data.length; i++) {
          if (msg.data[i].provinceId === '900000000000') {
            count = i;
            break;
          }
        }
        msg.data.splice(count, 1);
      }
      state[areaType[msg.type]] = msg.data;
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
            resolve(res);
          }, option, MEMBER_REGISTER_PATH);
       });
    },
    // 会员登录
    memberLogin ({commit, state}, option) {
      return new Promise((resolve, reject) => {
        axios.getData(res => {
          if (!res.data.code) {
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
        axios.getList(res => {
          if (!res.data.code) {
            commit('memberLogout');
            Local.empty(MEMBER_LOGIN);
            Local.empty(MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_LOGOUT_PATH);
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
          if (!res.data.code) {
            commit('memberInfo', res.data);
            Session.save(res.data, MEMBER_INFO);
          }
          resolve(res);
        }, option, MEMBER_INFO_PATH);
      });
    },
    // 设置交易密码
    setExchangeCode ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, SET_EXCHANGECODE_PATH);
      });
    },
    // 忘记交易密码
    editExchangeCode ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, EDIT_EXCHANGECODE_PATH);
      });
    },
    // 修改交易密码
    payPassword ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, PAY_PASSWORD_PATH);
      });
    },
    getExchangeCode ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          resolve(res);
        }, option, PAY_MOBILE_PATH);
      });
    },
    // 设置会员基本信息
    editInfo ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, EDIT_INFOMSG_PATH);
      });
    },
    // 修改昵称
    editNickName ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, EDIT_NICKNAME_PATH);
      });
    },
    // 帮助中心-获取文章类别
    helpArticalType ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (!res.data.code) {
            commit('helpArticalType', res.data);
          }
          resolve(res);
        }, option, HELP_ARTICALTYPE_PATH);
      });
    },
    helpArticalDetail ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          if (!res.data.code) {
            commit('helpArticalDetail', res.data);
          }
          resolve(res);
        }, option, HELP_ARTICALDETAIL_PATH);
      });
    },
    helpArticalList ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getList(res => {
          // if (!res.data.code && option.classId === 4) {
          //   console.log(res.data.lists);
          //   commit('helpArticalList', res.data.lists);
          // }
          resolve(res);
        }, option, HELP_ARTICALLIST_PATH);
      });
    },
    // 根据用户名获取会员信息
    getBuyUname ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, GET_BUY_UNAME_PATH);
      });
    },
    // 会员转账
    transOrderDetail ({commit, state}, option) {
      return new Promise((resolve) => {
        axios.getData(res => {
          resolve(res);
        }, option, TRANS_ORDER_DETAIL_PATH);
      });
    },
    // 激活币转账日志
    jhbCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              // console.log(res);
              commit('jhbCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, JHB_LIST_PATH);
      });
    },
    // 余额转账日志
    yeCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('yeCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, YE_LIST_PATH);
      });
    },
    // 收益奖金转账日志
    syCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('syCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, SY_LIST_PATH);
      });
    },
    jfCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('jfCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, JF_LIST_PATH);
      });
    },
    // 获取理财产品列表
    lcDetailList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('lcDetailList', res.data);
            }
            resolve(res);
          }, option, LC_DETAILLIST_PATH);
      });
    },
    // 创建理财订单
    addLcOrder ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, ADD_LCORDER_PATH);
      });
    },
    // 账户日志
    logCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit(logCountType[option.type], {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, LOG_COUNTLIST_PATH);
      });
    },
    teamJtCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('teamJtCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, TEAMJT_COUNTLIST_PATH);
      });
    },
    teamYjList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('teamYjList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, TEAMYJ_LIST_PATH);
      });
    },
    getPrice ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            if (!res.data.code) {
              commit('getPrice', res.data);
            }
            resolve(res);
          }, option, GET_BIGPRICE_PATH);
      });
    },
    // 申请提现
    withdrawInfo ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, WITHDRAW_INFO_PATH);
      });
    },
    // 支付宝银行提现
    withdrawBank ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, WITHDRAW_BANK_INFO_PATH);
      });
    },
    // 提现日志接口
    withdrawCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('withdrawCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, WITHDRAW_LIST_PATH);
      });
    },
    xfCountList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('xfCountList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, XFCOUNT_LIST_PATH);
      });
    },
    bankwraList ({commit, state}, option) {
      return new Promise((resolve) => {
          axios.getList(res => {
            if (!res.data.code) {
              commit('bankwraList', {data: res.data.lists, count: option.pages});
            }
            resolve(res);
          }, option, WITHDRAW_BANK_LIST_PATH);
      });
    },
    areaList ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.address(res => {
            commit('areaList', {data: res, type: option.type});
            resolve(res);
          }, option.data);
      });
    },
    // 收益购买激活币
    activationBuy ({commit, state}, option) {
      // console.log(option.data);
      return new Promise((resolve) => {
          axios.getData(res => {
            resolve(res);
          }, option, SY_BUY_JHB_PATH);
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
