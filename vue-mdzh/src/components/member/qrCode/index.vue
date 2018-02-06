<template>
  <div class="qrcode-page">
    <div class="qr-top">
      <!-- <img src="../../../assets/mdzh_logo.png" alt=""> -->
    </div>
    <div class="qr-code">
      <qr-code :uname="uname"></qr-code>
    </div>
    <p class="bottom-tips">{{ memberInfo.uname }}<i class="white-code-icon"></i>二维码</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qrCode from 'components/plugins/QRcode';

  export default {
    data () {
      return {
        uname: ''
      };
    },
    computed: mapState({
      // 获取用户信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      // console.log(this.uname);
      // 传递给二维码的uname
      this.uname = this.memberInfo.uname;
    },
    components: {
      qrCode
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .qrcode-page
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(./qr_bg.jpg) no-repeat
    background-size: 100% 100%
    .qr-top
      margin-top:1.5rem
      width: 100%
      img
        display: block
        width: 130%
        margin-left: -15%
        height: auto
    .qr-code
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width:  7.5rem
      height: 7.5rem
      margin: auto
      padding: 1rem
      background: rgba(255, 255, 255, 0.3)
    .bottom-tips
      position: absolute
      left: 0
      bottom: 7rem
      width: 100%
      color: #fff
      font-size: 1.1rem
      text-align: center
      .white-code-icon
        display: inline-block
        vertical-align: middle
        margin: -0.3rem 0.6rem 0 0.6rem
        width: 0.6rem
        height: 0.6rem
        background: url(./white_code_icon.png) center no-repeat
        background-size: 100% 100%
</style>