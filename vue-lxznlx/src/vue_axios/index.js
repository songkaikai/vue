// 引用axios 来异步提交数据
import axios from 'axios';
import Local from 'common/js/localStorage';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

// 区别开发环境 或者 生产环境的 接口地址
// 工分的接口
var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://lxwlw.my.com/api/' : 'http://api.bhsxy.cn/api/';

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
        if (res.data.data.code === 401) {
          Local.empty(MEMBER_LOGIN);
        }
        cb(res.data);
      }
    }).catch(() => {
      Local.empty(MEMBER_LOGIN);
      cb({data: {}, code: 500});
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
  // 阿里云省市区接口
  address (cb, data) {
    axios.get('http://ali-city.showapi.com/areaDetail?parentId=' + data.parentId, {'headers': {'Authorization': 'APPCODE 416f5a0dd5c64cd4a90b64cae3c5ae19'}}).then(function (res) {
      cb(res.data.showapi_res_body.data);
    }).catch(error => {
      console.log(error);
    });
  }
};
