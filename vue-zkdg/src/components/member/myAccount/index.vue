<template>
  <div class="account-page">
  	<div class="head-info">
  		<p class="title">账户可用积分</p>
      <p class="count"><i class="icon-one"></i><span>{{ parseFloat(memberInfo.balance).toFixed(2) }}</span></p>
  	</div>
    <div class="other-link">
      <router-link :to="{name: 'withdraw'}">提现</router-link>
      <router-link :to="{name: 'withdrawLog'}" class="log-btn">记录</router-link>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        pageStr: 'account'
      };
    },
    computed: {
      ...mapState({
        memberInfo: state => state.memberInfo
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .account-page
    .other-link
      margin-top: 3.6rem
      padding: 0 1.6rem
      a
        display: block
        width: 96%
        text-align: center
        margin: auto
        margin-bottom: 1.4rem
        border-radius: 4px
        padding: 0.6rem 0
        font-size: 0.9rem
        background: #4fccdb
        border: 1px solid #4fccdb
        color: #fff
        &.log-btn
          border: 1px solid #4fccdb
          background: transparent
          color: #4fccdb
    .head-info
      padding: 2.8rem 0
      background: url(./account_head_bg.png) no-repeat
      background-size: 100% 100%
      p
        text-align: center
        color: #fff
      .title
        padding-bottom: 0.6rem
        font-size: 0.9rem
      .count
        text-align: center
        .icon-one
          display: inline-block
          vertical-align: middle
          width: 1.6rem
          height: 1.6rem
          background: url(./icon_one.png) no-repeat
          background-size: 100% 100%
        span
          display: inline-block
          vertical-align: middle
          line-height: 1.4rem
          height: 1.4rem
          font-size: 1.2rem
</style>
