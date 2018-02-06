// 游览器 一次性会话
export default {
  // 查找
  fetch (type) {
    return JSON.parse(window.sessionStorage.getItem(type));
  },
  // 添加
  save (items, type) {
    items = JSON.stringify(items);
    window.sessionStorage.setItem(type, items);
  },
  // 删除
  empty (type) {
    // console.log(1);
    window.sessionStorage.removeItem(type);
  }
};
