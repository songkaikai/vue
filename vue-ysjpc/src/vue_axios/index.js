// 引用axios 来异步提交数据
import axios from 'axios';
// import Local from 'common/js/localStorage';
// 引入session
import Session from 'common/js/sessionStorage';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

// 区别开发环境 或者 生产环境的 接口地址
// 工分的接口
var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://staff.sj.my.com/v1/' : 'https://staffapi.megglife.com/v1/';

// 返回的状态 200
const ERR_OK = 200;

// 将对象变成字符串
// 'username=13588888888&password=55555555'
function dataToString (data) {
  var arr = [];
  for (var key in data) {
    if (data[key] !== '') {
      arr.push(key + '=' + data[key]);
    }
  }
  return arr.join('&');
}

export var sx = {
  // 工分(以及促销的post提交的数据)接口信息
  getData (cb, data, path) {
    axios.post(baseUrl + path, dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        // alert(1);
        if (parseInt(res.data.status) === 100) {
          Session.empty(MEMBER_LOGIN);
        }
        cb(res.data);
      }
    }).catch(() => {
      // console.log(1);
      // console.log(error);
      Session.empty(MEMBER_LOGIN);
      cb({data: {'cuowu': '请刷新页面'}, code: 500});
    });
  },
  getList (cb, data, path) {
    axios.get(baseUrl + path + '?' + dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        cb(res.data);
      }
    }).catch(() => {
      Session.empty(MEMBER_LOGIN);
      cb({data: {'cuowu': '请刷新页面'}, code: 500});
    });
  }
};
