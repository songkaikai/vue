<template>
  <div class="invite-qr">
    <router-link :to="{name: 'index'}" class="return-btn"><i></i><span>返回</span></router-link>
    <div class="invite-wrapper">
      <!-- <div class="member-head">
        <div class="head-img">
          <img :src="headImg" alt="" />
        </div>
        <div class="head-name">{{ memberInfo.nick_name }}</div>
      </div> -->
      <div class="qr-top">
        <img src="../assets/invite_head_pic.png" alt="">
      </div>
      <div class="qr-code">
        <p class="tips">扫我二维码</p>
        <p class="tips">和我一起加入血战吧</p>
        <qr-code :userId="userId" :uname="uname"></qr-code>
        <img src="../assets/xzdds_icon.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qrCode from '@/components/plugins/QRcode';

  export default {
    data () {
      return {
        userId: '',
        uname: '',
        headImg: require('../assets/moke_head_01.jpg'),
        qeCode: require('../assets/qr_code.png')
      };
    },
    computed: mapState({
      // 获取用户信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      // 传递给二维码的userId
      this.userId = this.memberInfo.uno;
      this.uname = this.memberInfo.uname;
      // alert(this.uname);
    },
    components: {
      qrCode
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .invite-qr
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/invite_index_bg.jpg) no-repeat
    background-size: 100% 100%
    .return-btn
      position: absolute
      bottom: 1rem
      left: 1rem
      color: #fff
      font-size: 0.8rem
      i
        display: inline-block
        vertical-align: middle
        margin: 0 0.3rem
        width: 1.8rem
        height: 1.8rem
        background: url(../assets/blue_left_btn.png) center no-repeat
        background-size: 100% 100%
    .member-head
      padding: 2rem 3rem
      color: #fff
      overflow: hidden
      .head-img
        float: left
        width: 3.2rem
        height: 3.2rem
        img
          display: block
          width: 3.2rem
          height: 3.2rem
          border-radius: 50%
      .head-name
        padding: 0 0 0 4.2rem
        height: 3.2rem
        line-height: 3.2rem
        font-size: 1rem
    .qr-top
      margin-top:2rem
      width: 100%
      img
        display: block
        width: 100%
        height: auto
    .qr-code
      position: relative
      width: 10rem
      height: 10rem
      margin: auto
      // margin-top: 5rem
      margin-top: 1rem
      color: #fff
      text-align: center
      img
        display: block
        width: 7rem
        height: 4rem
        margin: auto
        margin-top: 0.6rem
      .tips
        margin: 0.3rem 0
        width: 100%
        font-size: 0.8rem
        text-align: center
</style>
