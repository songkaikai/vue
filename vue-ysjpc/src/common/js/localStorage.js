// 游览器 一次性会话
export default {
  // 查找
  fetch (type) {
    return JSON.parse(window.localStorage.getItem(type));
  },
  // 添加
  save (items, type) {
    items = JSON.stringify(items);
    window.localStorage.setItem(type, items);
  },
  // 删除
  empty (type) {
    window.localStorage.removeItem(type);
  }
};
