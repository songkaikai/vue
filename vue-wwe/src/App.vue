<template>
  <div class="wrap" v-scroll="showTop">
    <!-- 导航栏 -->
    <div class="meun border-top-1px">
      <router-link :to="{name: 'superStar'}">
        <i class="icon-star"></i>
        <p>Super Star</p>
      </router-link>
      <router-link :to="{name: 'followWith'}">
        <i class="icon-fire"></i>
        <p>Follow With</p>
      </router-link>
      <router-link :to="{name: 'aboutMe'}">
        <i class="icon-bubble"></i>
        <p>About Me</p>
      </router-link>
      <!-- <router-link :to="{name: 'pink'}"><i class="icon-bubble"></i></router-link> -->
    </div>
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
    <!-- 回到顶部 -->
    <div @click="gotop" class="go-top" :class="goTop?'active':''"><i class="icon-rocket"></i></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-left',
        goTop: false
      };
    },
    // 只能在同一router-view下使用
    // watch: {
    //   '$route' (to, from) {
    //     const toDepth = to.path.split('/').length;
    //     const fromDepth = from.path.split('/').length;
    //     // console.log(toDepth, fromDepth);
    //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    //   }
    // },
    methods: {
      // 计算是否回到顶部的按钮显示
      showTop () {
        if (document.body.scrollTop > 200) {
          this.goTop = true;
        } else {
          this.goTop = false;
        }
      },
      // 返回顶部
      gotop () {
        let speed = 10;
        let timer = setInterval(() => {
          if (document.body.scrollTop > 0) {
            document.body.scrollTop = document.body.scrollTop - speed > 0 ? document.body.scrollTop - speed : 0;
            speed += 20;
          } else {
            clearInterval(timer);
          }
        }, 16);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import './common/stylus/mixin.styl';

  .meun
    position: fixed
    bottom: 0
    left: 0
    z-index: 6
    width: 100%
    height: 52px
    background: #F2F1EF
    color: #666
    overflow: hidden
    &.border-top-1px
      border-top-1px(#ccc)
    a
      text-decoration: none
      float: left
      width: 33.3%
      height: 52px
      text-align: center
      color: #6E7377
      i
        display: inline-block
        margin-top: 6px
        font-size: 22px
      p
        padding: 2px 0
        font-size: 14px
      &.active
        color: #1AAD19
  // .child-view
  //   width: 100%
  //   transition: all .5s
  //   -webkit-transition: all .5s
  //   &.slide-left-enter,&.slide-right-leave-active
  //     opacity: 0
  //     transform: translate(15px, 0)
  //     -webkit-transform: translate(15px, 0)
  //   &.slide-left-leave-active,&.slide-right-enter
  //     opacity: 0
  //     transform: translate(-15px, 0)
  //     -webkit-transform: translate(-15px, 0)
  .go-top
    position: fixed
    bottom: -100px
    right: 20px
    z-index: 499 
    border-radius: 50%
    width: 50px
    text-align: center
    height: 50px
    line-height: 60px
    color: #fff
    background: rgba(0,0,0,.7)
    transition: .3s linear
    &.active
      bottom: 60px
      transition: .3s linear
    i
      display: inline-block
      font-size: 24px
      -webkit-transform: rotate(-45deg)
</style>
