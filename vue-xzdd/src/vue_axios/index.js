// 引用axios 来异步提交数据
import axios from 'axios';
import Session from 'common/js/sessionStorage';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

// 区别开发环境 或者 生产环境的 接口地址
// 工分的接口
// var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://www.huichapu.cn/api/' : 'http://www.huichapu.cn/api/';
var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://192.168.88.125/yii/xzdd/web/api/' : 'http://api.xzdd.com/api/';

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

export var xz = {
  // 工分(以及促销的post提交的数据)接口信息
  getData (cb, data, path) {
    axios.post(baseUrl + path, dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        if (res.data.data.code === 401) {
          Session.empty(MEMBER_LOGIN);
        }
        // console.log(res.data);
        cb(res.data);
      }
    }).catch(() => {
      // alert(1);
      cb({code: 500});
      // console.log(gfmkMd5(data).str);
      // console.log(error, gfmkMd5(data).str);
    });
  },
  getList (cb, data, path) {
    axios.get(baseUrl + path + '?' + dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        cb(res.data);
      }
    }).catch(error => {
      console.log(error);
    });
  },
  test (cb, data) {
    axios.post('http://192.168.88.125/yii/test/basic/web/api/hello/index', dataToString(data), {'headers': {'firstDemo': 'call my name S2K.'}}).then(function (res) {
      if (res.status === ERR_OK) {
        cb(res.data);
      }
    }).catch(() => {
      alert(1);
    });
  },
  test2 (cb, data) {
    axios.get('http://192.168.88.125/yii/test/basic/web/api/hello/index?' + dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        cb(res.data);
      }
    }).catch(() => {
      alert(1);
    });
  },
  test3 (cb, data) {
    axios.post('http://192.168.88.125/yii/test/basic/web/api/hello/add', dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        cb(res.data);
      }
    }).catch(() => {
      alert(1);
    });
  }
};
