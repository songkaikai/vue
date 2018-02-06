<template>
  <div id="app">
<!--     <img src="./assets/logo.png"> -->
    <router-view></router-view>
    <!-- 底部tab(标签)导航栏 -->
    <div class="tab-wrapper border-top-1px">
       <div class="tab-item">
          <router-link :to="{name: 'index'}"><i class="home"></i>首页</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'team'}"><i class="team"></i>团队</router-link>
        </div>
        <!-- <div class="tab-item">
          <router-link  :to="{name: 'integralMall'}"><i class="integralmall"></i>积分商城</router-link>
        </div> -->
        <!-- <div class="tab-item">
          <router-link  :to="{name: 'shopcart'}"><i class="shopcart"></i>购物车</router-link>
        </div> -->
        <div class="tab-item">
          <router-link  :to="{name: 'helpCenter'}"><i class="helpcenter"></i>帮助中心</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'exchangeManager'}"><i class="exchangemanager"></i>交易管理</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{name: 'accountManager'}"><i class="accountManager"></i>账户管理</router-link>
        </div>
     </div>
  </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Local from 'common/js/localStorage';
    // 要会议存储的字段key
    const MEMBER_LOGIN = 'member_login';

    export default {
      name: 'app',
      data () {
        return {
           timeStep: null // 定时器
        };
      },
      computed: mapState({
        // 获取用户token
        memberLogin: state => state.memberLogin
      }),
      created () {
        this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
        // 验证token有没有过期
        this._timeStemp();
      },
      methods: {
        // 验证token有没有过期
        _timeStemp () {
          // console.log(1);
          if (!Local.fetch(MEMBER_LOGIN)) {
            // console.log(1);
            // 清除定时器
            this.timeStep = null;
            this.$router.replace({name: 'login'});
          }
          this.timeStep = setTimeout(() => {
            this._timeStemp();
          }, 500);
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl";

  .tab-wrapper 
    position: fixed
    left: 0
    bottom: 0
    z-index: 500
    width: 100%
    height: 3.1rem
    overflow: hidden
    &.border-top-1px
      border-top-1px(#d7d4d4)
    background-color: #f9f9f9
    .tab-item
      float:left
      width: 20%
      a
        display: block
        height: 3.1rem
        text-align: center
        font-size: 0.7rem
        color: #b4b4b4
        i
          display: block
          margin: 0.2rem auto 0 auto
          width: 1.8rem
          height: 1.8rem
          &.home
            background: url(./assets/home_icon.png) center no-repeat
            background-size: 80% 80%
          &.team
            background: url(./assets/team_icon.png) center no-repeat
            background-size: 75% 75%
          &.integralmall
            background: url(./assets/shop_icon.png) center no-repeat
            background-size: 80% 80%
          &.shopcart
            background: url(./assets/cart_icon.png) center no-repeat
            background-size: 80% 80%
          &.exchangemanager
            background: url(./assets/exchange_icon.png) center no-repeat
            background-size: 80% 80%
          &.accountManager
            background: url(./assets/zhgl_icon.png) center no-repeat
            background-size: 80% 80%
          &.helpcenter
            background: url(./assets/help_icon.png) center no-repeat
            background-size: 80% 80%
        &.active
          color: #5197db
          .home
            background: url(./assets/home_index_icon.png) center no-repeat
            background-size: 80% 80%
          .team
            background: url(./assets/team_index_icon.png) center no-repeat
            background-size: 75% 75%
          .integralmall
            background: url(./assets/shop_index_icon.png) center no-repeat
            background-size: 80% 80%
          .shopcart
            background: url(./assets/cart_index_icon.png) center no-repeat
            background-size: 80% 80%
          .exchangemanager
            background: url(./assets/exchange_index_icon.png) center no-repeat
            background-size: 80% 80%
          .accountManager
            background: url(./assets/zhgl_index_icon.png) center no-repeat
            background-size: 80% 80%
          .helpcenter
            background: url(./assets/help_index_icon.png) center no-repeat
            background-size: 80% 80%
</style>
