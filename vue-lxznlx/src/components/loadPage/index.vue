<template>
  <div class="load-page">
     <div class="qmgs-icon">
        <!-- ios -->
        <a href="itms-services://?action=download-manifest&url=https://git.oschina.net/phpgame/xuezhan/raw/master/download.pist" class="icon-btn load-ios" v-if="iosAdd"></a>
        <!-- android -->
        <a href="http://www.huichapu.cn/app/xzdd.apk" class="icon-btn load-android" v-if="androidAdd"></a>
      </div>
      <div class="all-shade" v-show="showShade" @click="_showSub"></div>
      <div class="shade" v-show="showSub">
        <img src="./tips_icon.png" alt="">
      </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showShade: false,
        showSub: false,
        iosAdd: false,
        androidAdd: false
      };
    },
    created () {
      // var nav = navigator.userAgent.toLowerCase();
      // if (nav.match(/MicroMessenger/i)) {
      //   this.showShade = true;
      // }
      // var nav = navigator.userAgent.toLowerCase();
      // console.log(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent));
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  // 判断iPhone|iPad|iPod|iOS
          this.iosAdd = true;
      } else if (/(Android)/i.test(navigator.userAgent)) { // 判断Android
          this.androidAdd = true;
      } else { // pc
          alert('PC');
      };
    },
    methods: {
      _showSub () {
        this.showSub = true;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .load-page
    position: fixed
    top:0
    right:0
    bottom:0
    left:0
    background: url(./load_bg.jpg) no-repeat
    background-size:100% 100%
  .load-page .qmgs-icon{position:absolute;top:50%;left:50%;width: 150px;height:150px;-webkit-transform:translate(-75px, -170px);background: url(./xylx_icon.png) no-repeat;background-size: 100% 100%;margin:auto;}
  .load-page .qmgs-icon .icon-btn{display: block;width:238px;height:44px;position: absolute;bottom:-140px; left:50%;margin-left:-119px;}
  .load-page .qmgs-icon .icon-btn.load-ios{background: url(./ios_icon.png) no-repeat;background-size: 100% 100%;}
  .load-page .qmgs-icon .icon-btn.load-android{background: url(./android_icon.png) no-repeat;background-size: 100% 100%;}
  .shade{position: fixed;top:0;right:0;bottom:0;left:0;background: rgba(0,0,0,0.6);}
  .shade img{display: block;width:100%;height: auto;}
  .all-shade{position: fixed;top:0;right:0;bottom:0;left:0;background: rgba(0,0,0,0);z-index:110;}
</style>
