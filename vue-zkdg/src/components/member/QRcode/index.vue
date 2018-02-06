<template>
  <div class="qrcode-page">
  	<div class="qrcode-inner">
  		<div class="qr-top">
	      <img :src="memberInfo.avatar || defaultAvatar" alt="">
	      <p class="name">{{ memberInfo.nick_name }}</p>
	    </div>
	    <div class="qr-code">
	      <qr-code :uname="uname"></qr-code>
	    </div>
	    <p class="bottom-tips">扫一扫立即加入中科电工</p>
  	</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qrCode from 'components/plugins/QRcode';

  export default {
    data () {
      return {
        uname: '',
        defaultAvatar: require('./default_head_img.png')
      };
    },
    computed: mapState({
      // 获取用户信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      // console.log(this.uname);
      // 传递给二维码的uname
      this.uname = this.memberInfo.mobile;
      // this.uname = 13819445382;
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
    left: 2rem
    bottom: 0
    right: 2rem
    height: 25rem
    margin: auto
    border-radius: 5px
    background: #fff
    .qr-top
      margin-top:1.5rem
      width: 100%
      img
        display: block
        width: 5rem
        height: auto
        margin: auto
      .name
      	padding: 0.6rem
      	text-align: center
      	font-size: 0.9rem
    .qr-code
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width:  9.5rem
      height: 9.5rem
      margin: auto
      -webkit-transform: translate(0, 2rem)
      padding: 1rem
      background: rgba(255, 255, 255, 0.3)
    .bottom-tips
      position: absolute
      left: 0
      bottom: 4rem
      width: 100%
      color: #ccc
      font-size: 0.9rem
      text-align: center
      .white-code-icon
        display: inline-block
        vertical-align: middle
        margin: -0.3rem 0.6rem 0 0.6rem
        width: 0.6rem
        height: 0.6rem
        // background: url(./white_code_icon.png) center no-repeat
        background-size: 100% 100%
</style>