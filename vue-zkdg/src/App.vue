<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
    <!-- 底部tab(标签)导航栏 -->
    <div class="tab-wrapper border-top-1px">
       <div class="tab-item">
          <router-link :to="{name: 'home'}"><i class="home"></i>首页</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'cart'}"><i class="cart"></i>购物车</router-link>
        </div>
        <div class="tab-item">
          <router-link  :to="{name: 'aboutus'}"><i class="aboutus"></i>关于我们</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{name: 'linkus'}"><i class="linkus"></i>联系我们</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{name: 'my'}"><i class="my"></i>我的</router-link>
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
    height: 2.7rem
    overflow: hidden
    &.border-top-1px
      border-top-1px(#d7d4d4)
    background-color: #f9f9f9
    .tab-item
      float:left
      width: 20%
      a
        display: block
        height: 2.7rem
        text-align: center
        font-size: 0.7rem
        color: #d5d5d5
        i
          display: block
          margin: 0 auto
          width: 1.8rem
          height: 1.8rem
          &.home
            background: url(./assets/home_type_one.png) center no-repeat
            background-size: 90% 90%
          &.cart
            background: url(./assets/home_type_two.png) center no-repeat
            background-size: 90% 90%
          &.aboutus
            background: url(./assets/home_type_three.png) center no-repeat
            background-size: 90% 90%
          &.linkus
            background: url(./assets/home_type_four.png) center no-repeat
            background-size: 90% 90%
          &.my
            background: url(./assets/home_type_five.png) center no-repeat
            background-size: 90% 90%
        &.active
          color: #4fccdb
          .home
            background: url(./assets/home_type_one_index.png) center no-repeat
            background-size: 90% 90%
          .cart
            background: url(./assets/home_type_two_index.png) center no-repeat
            background-size: 90% 90%
          .aboutus
            background: url(./assets/home_type_three_index.png) center no-repeat
            background-size: 90% 90%
          .linkus
            background: url(./assets/home_type_four_index.png) center no-repeat
            background-size: 90% 90%
          .my
            background: url(./assets/home_type_five_index.png) center no-repeat
            background-size: 90% 90%
          
</style>
