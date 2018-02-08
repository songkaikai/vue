// 引用axios 来异步提交数据
import axios from 'axios';
import Local from 'common/js/localStorage';

// 要会议存储的字段key
const MEMBER_LOGIN = 'member_login';

// 区别开发环境 或者 生产环境的 接口地址
// 工分的接口
// var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://192.168.88.27:200/api/' : 'http://www.xthhly.com/api/';
// var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://www.fzpei.com/api/' : 'http://ysj.xthhly.com/api/';
var baseUrl = process.env.NODE_ENV !== 'production' ? 'http://www.fzpei.com/api/' : 'http://ysj.megglife.com/api/';

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
  getData (cbs, data, path) {
    // console.log(baseUrl + path);
    axios.post(baseUrl + path, dataToString(data)).then(function (res) {
      // console.log(res);
      if (res.status === ERR_OK) {
        cbs(res.data);
      }
    }).catch(error => {
      // Local.empty(MEMBER_LOGIN);
      // cbs({data: {}, code: 500});
      // console.log(gfmkMd5(data).str);
      // console.log(error, gfmkMd5(data).str);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        cbs(error.response.data);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        Local.empty(MEMBER_LOGIN);
        cbs({code: 401});
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      // console.log(error.config);
    });
  },
  getList (cbs, data, path) {
    axios.get(baseUrl + path + '?' + dataToString(data)).then(function (res) {
      if (res.status === ERR_OK) {
        cbs(res.data);
      }
    }).catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        cbs(error.response.data);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        Local.empty(MEMBER_LOGIN);
        cbs({code: 401});
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  },
  postImg (cbs, data, path) {
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    };
    axios.post(baseUrl + path, data, config).then(function (res) {
      if (res.status === ERR_OK) {
        cbs(res.data);
      }
    }).catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        cbs(error.response.data);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        Local.empty(MEMBER_LOGIN);
        cbs({code: 401});
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  },
  // 阿里云省市区接口
  address (cb, data) {
    axios.get('http://ali-city.showapi.com/areaDetail?parentId=' + data.parentId, {'headers': {'Authorization': 'APPCODE 1776380a0d6a4ed097634f4d64a88927'}}).then(function (res) {
      cb(res.data.showapi_res_body.data);
    }).catch(error => {
      console.log(error);
    });
  }
};
