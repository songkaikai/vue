// 引入axios来异步提交数据
import axios from 'axios';

export default function (cb, path) {
  axios.get(path).then((res) => {
    cb(res.data);
  }).catch(errs => {
    cb('error');
  });
};
