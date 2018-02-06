<template>
  <div class="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <router-view/> -->
    <router-view></router-view>

     <!-- 底部tab(标签)导航栏 -->
    <div class="tab-wrapper border-top-1px">
       <div class="tab-item">
          <router-link :to="{name: 'home'}"><i class="home"></i>首页</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'mdMall'}"><i class="mdMall"></i>免蛋商城</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'kfCenter'}"><i class="kfCenter"></i>客服中心</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{name: 'accountManager'}"><i class="accountManager"></i>会员中心</router-link>
        </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'app'
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
    height: 3.2rem
    overflow: hidden
    &.border-top-1px
      border-top-1px(#d7d4d4)
    background-color: #000
    .tab-item
      float:left
      width: 25%
      a
        display: block
        height: 3.2rem
        text-align: center
        font-size: 0.7rem
        color: #989898
        i
          display: block
          margin: 0.2rem auto 0 auto
          width: 1.8rem
          height: 1.8rem
          &.home
            background: url(./assets/home_type_one.png) center no-repeat
            background-size: 90% 90%
          &.mdMall
            background: url(./assets/home_type_two.png) center no-repeat
            background-size: 90% 90%
          &.kfCenter
            background: url(./assets/home_type_three.png) center no-repeat
            background-size: 90% 90%
          &.accountManager
            background: url(./assets/home_type_four.png) center no-repeat
            background-size: 90% 90%
        &.active
          color: #fad08f
          .home
            background: url(./assets/home_type_one_index.png) center no-repeat
            background-size: 90% 90%
          .mdMall
            background: url(./assets/home_type_two_index.png) center no-repeat
            background-size: 90% 90%
          .kfCenter
            background: url(./assets/home_type_three_index.png) center no-repeat
            background-size: 90% 90%
          .accountManager
            background: url(./assets/home_type_four_index.png) center no-repeat
            background-size: 90% 90%
          
</style>
