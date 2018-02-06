// 引入vue
import Vue from 'vue';
// 引入vuex
import Vuex from 'vuex';
// 引入axios
import vueAxios from '@/vue_axios';
// 引入session一次会话存储
import Session from 'common/js/sessionStorage';
import * as types from './types';

// 使用vue的状态管理vuex
Vue.use(Vuex);

const SUPERSTARLIST = 'super_star_list';
const STARLISTSHOW = 'star_list_show';
const GETLISTAGAIN = 'get_list_again';
const ADD_LEN = 'add_len';

const store = new Vuex.Store({
  state: {
    // 存储获取到的图片列表
    superStarList: Session.fetch(SUPERSTARLIST) === null ? [] : Session.fetch(SUPERSTARLIST),
    // 控制第一次进来列表时隐藏的
    StarListShow: Session.fetch(STARLISTSHOW) === null ? false : Session.fetch(STARLISTSHOW),
    // 是否还能获取
    getListAgain: Session.fetch(GETLISTAGAIN) === null ? true : Session.fetch(GETLISTAGAIN),
    addLen: Session.fetch(ADD_LEN) === null ? 0 : Session.fetch(ADD_LEN)
  },
  mutations: {
    // 修改当前superStarList数据
    [types.SUPE_RSTAR_LIST] (state, list) {
      state.superStarList = state.superStarList.concat(list);
      // state.superStarList = list;
      // 进行会话存储
      Session.save(state.superStarList, SUPERSTARLIST);
    },
    // 修改当前StarListShow状态为true
    [types.RSTAR_LIST_SHOW] (state) {
      state.StarListShow = true;
      // 进行会话存储
      Session.save(state.StarListShow, STARLISTSHOW);
    },
    // 禁止后续的获取
    [types.GET_LIST_AGAIN] (state) {
      state.getListAgain = false;
      Session.save(state.getListAgain, GETLISTAGAIN);
    },
    [types.CHANGE_ADD] (state, id) {
      // console.log(state.superStarList[id].like);
      state.superStarList[id].like = !state.superStarList[id].like;
      Session.save(state.superStarList, SUPERSTARLIST);
      // 获取已经关注到的个数
      var num = 0;
      var len = state.superStarList.length;
      for (var i = 0; i < len; i++) {
        if (state.superStarList[i].like) {
          ++num;
        }
      }
      state.addLen = num;
      Session.save(state.addLen, ADD_LEN);
    }
  },
  actions: {
    superStarList ({commit, state}, option) {
      var path = '';
      // 模拟第一次加载的时候加载superStarOne.第二次加载superStarTwo
      if (option.page === 1) {
        path = '/static/json/superStarOne.json';
      } else {
        path = '/static/json/superStarTwo.json';
      }
      return new Promise(resolve => {
        // 调用axios
        vueAxios((res) => {
          // console.log(res);
          // 模拟等待获取数据
          setTimeout(() => {
            // 如果是第一次加载就进入改变列表为显示状态
            if (option.page === 1) {
              commit(types.RSTAR_LIST_SHOW);
            }
            // 如果获取的数据小于当前想要获取到的条数
            if (res.length < option.pageSize) {
              commit(types.GET_LIST_AGAIN);
            }
            // 获取到数据以后进行存储
            commit(types.SUPE_RSTAR_LIST, res);
            resolve();
          }, 1000);
        }, path);
      });
    },
    changeAdd ({commit, state}, id) {
      return new Promise(resolve => {
        commit(types.CHANGE_ADD, id);
        resolve();
      });
    }
  }
});

export default store;
