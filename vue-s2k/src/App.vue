<template>
  <div class="home-page">
    <img src="./assets/talk.jpg" class="head-logo">
    <!-- <router-view/> -->
    <div class="link-wrapper">
      <div class="link-btn">
        <router-link :to="{name: 'member', query: {register: bool}}">会员</router-link>
      </div>
      <div class="link-btn">
        <!-- char room -->
        <router-link :to="{name: 'chatRoom', query: {member: name}}">Chat Room</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        bool: 'true',
        name: '' // 随机生成的数字
      };
    },
    created () {
      // 随机生成一个0-100的编号
      this.name = parseInt(Math.random() * 100);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}*/
  .head-logo
    display: block
    width: 100%
    margin: auto
    margin-top: 2rem
  .link-wrapper
    margin-top: 2.4rem
    a
      display: block
      margin: auto
      margin-bottom: 2.4rem
      padding: 0.9rem 0
      width: 48%
      font-size: 1rem
      text-align: center
      background: rgba(24, 24, 26, 0.8)
      box-shadow: 10px 10px 5px #888888
      color: #fff
      border-radius: 8px
      &:active
        -webkit-transform: scale(1.1, 1.1)
</style>
