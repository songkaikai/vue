<template>
  <div class="pay-page">
    <div class="edit-wrapper">
      <div class="list-item">
        <span class="left">姓名：{{ orderCode.true_name }}</span>
        <span class="left" style="color:#e4393c;">订单状态：{{ orderCode.status_name }}</span>
      </div>
      <div class="list-item">
        <span class="left">身份证：{{ orderCode.card_no }}</span>
        <span class="left">订单编号：{{ orderCode.order_no }}</span>
      </div>
      <div class="list-item" style="padding:0;margin:10px 0;">
        <span class="left" style="width: 100%;max-height:34px;line-height: 17px;">地址：{{ orderCode.address }}</span>
      </div>
      <div class="list-item">
        <div class="img-wrapper" style="cursor:pointer;" @click="_showBigPic('card1')">
          <!-- <input type="file" /> -->
          <!-- <img :src="faceImg" alt="" /> -->
          <img :src="orderCode.card1" alt="" />
        </div>
        <div class="img-wrapper" style="cursor:pointer;" @click="_showBigPic('card2')">
          <!-- <input type="file" /> -->
          <!-- <img :src="backendImg" alt="" /> -->
          <img :src="orderCode.card2" alt="" />
        </div>
      </div>
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 33">
        <div class="list-item">
          <span class="left">套餐：{{ orderCode.name }}</span>
        </div>
        <div class="list-item">
          <span class="left">付款方式：支付宝</span>
        </div>
        <div class="list-item">
          <span class="left">价格：{{ orderCode.market_price }}元</span>
        </div>
        <div class="list-item">
          <span class="left">领机方式：{{ parseInt(orderCode.buy_type) === 1 ? '押金' : '信用' }}</span>
        </div>
        <div class="list-item">
          <span class="inner-left" style="height:26px;line-height:26px">领机码：</span>
          <div class="img-wrapper" style="margin-left:10px">
            <input type="text" class="code-ipt" v-model="dataOption.pin" />
          </div>
        </div>
        <div class="list-item">
          <span class="inner-left">拍照：</span>
          <div class="img-wrapper" style="margin-left:10px;cursor:pointer;" @click="_tickPhoto">
            <!-- <input type="file" class="file-ipt" /> -->
            <img :src="photoImgOut" alt="" />
          </div>
        </div>
        <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submit">确定</span>
          <span class="close-btn" @click="_reset">重置</span>
        </div>
      </div>
    </div>
    <!-- 截取按钮 -->
    <div class="jiequ-btn" v-show="tickShow">
      <div class="video-wrapper">
        <div class="video-tick">
          <video id="video" width="640" height="480"></video>
          <canvas width="640" height="480" id="canvas" style="position:absolute;top:0;left:0;z-index:-1;"></canvas>
        </div>
        <div class="video-btn"><a @click="_submitPic">截取</a></div>
      </div>
      <!-- <a href="javascript:webcam.capture();void(0);" @click="_submitPic">截取</a> -->
    </div>
    <!-- 自动返回弹框 -->
    <transition name="returnout">
      <div class="return-wrapper" v-show="showReturn">
        <transition name="returninner">
          <div class="return-inner" v-show="showReturn">
            <p class="title">数据提交成功...</p>
            <router-link :to="{name: 'index'}">{{ closeCount }}秒后跳转首页</router-link>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 显示大图片 -->
    <transition name="picout">
      <div class="bigpic-wrapper" @click="_closeBigPic" v-show="showBigPic">
        <transition name="picinner">
          <div class="bigpic-inner" v-show="showBigPic">
            <img :src="bigPic" alt="" />
          </div>
        </transition>
      </div>
    </transition>
    <div class="tickpic-wrapper" style="position:absolute;top:0;left:0;z-index:1111;">
      <video id="video" width="400" height="300"></video>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import $ from 'jquery';

  export default {
    data () {
      return {
        tickShow: false,
        tipsStr: '', // 提示语句
        faceImg: require('../../assets/card_on_img.png'), // 身份证正面照
        backendImg: require('../../assets/card_bottom_img.png'), // 身份证反面照
        photoImg: require('../../assets/proto_img.png'), // 拍照的图片
        photoImgOut: require('../../assets/proto_img.png'), // 拍照的图片
        showBigPic: false, // 显示放大的图片
        bigPic: '', // 存放大图片地址的地方
        showReturn: false,
        closeCount: 3, // 距离关闭的秒速
        time: null,
        dataOption: {
          token: '', // 员工TOKEN
          registerId: '', // 申请单ID
          pin: '', // 手机机器码
          pic1: '' // 拍的图片
        },
        hasProto: false
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      orderCode: state => state.orderCode
    }),
    created () {
      this.$nextTick(() => {
        $('.pay-page .code-ipt').focus();
         var video = document.getElementById('video');
         // console.log(video);
        // canvas = document.getElementById('canvas'),
        // snap = document.getElementById('tack'),
        // img = document.getElementById('img'),
        var vendorUrl = window.URL || window.webkitURL;
        // 媒体对象
       window.navigator.getMedia = window.navigator.getUserMedia ||
                             window.navagator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia;
       window.navigator.getMedia({
            video: true, // 使用摄像头对象
            audio: false  // 不适用音频
        }, function (strem) {
            video.src = vendorUrl.createObjectURL(strem);
            video.play();
        }, function (error) {
            // error.code
            console.log(error);
        });
      });
    },
    methods: {
      // 拍照
      _tickPhoto () {
        this.tickShow = true;
        // $('.web-wrapper').show();
      },
      _submitPic () {
        // setTimeout(() => {
        //   this.photoImgOut = document.getElementById('canvas').toDataURL('image/png');
        // }, 150);
        // setTimeout(() => {
        //   $('.web-wrapper').hide();
        //   this.tickShow = false;
        //  }, 850);
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        // 绘制canvas图形
        canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
        // 把canvas图像转为img图片
        this.photoImgOut = canvas.toDataURL('image/png');
        this.hasProto = true;
        this.tickShow = false;
      },
      // 重置
      _reset () {
        this.hasProto = false;
        this.dataOption.pin = '';
        this.photoImgOut = this.photoImg;
        this.dataOption.pic1 = '';
      },
      // 提交数据
      _submit () {
        if (this.dataOption.pin === '') {
          this._showTip('领机码不能为空');
          return;
        }
        if (!this.hasProto) {
          this._showTip('必须上传照片');
          return;
        }
        // if (this.dataOption.pic1 === '') {
        //   this._showTip('请先拍照');
        //   return;
        // }
        // 提交数据
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.dataOption.registerId = this.orderCode.id;
        // 替换加号
        // this.dataOption.pic1 = this.dataOption.pic1.replace('+', '%2B');
        // url编码
        this.dataOption.pic1 = this.photoImgOut;
        this.dataOption.pic1 = encodeURIComponent(this.dataOption.pic1);
        this.$store.dispatch('postLing', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.data.result === 'success') {
              this._showReturn();
            } else {
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
        });
      },
      _showReturn () {
        this.showReturn = true;
        this._djs();
      },
      // 倒计时
      _djs () {
        // console.log(this.closeCount > 0);
        if (this.closeCount === 0) {
          this.time = null;
          this.$router.replace({name: 'index'});
        } else {
          this.time = setTimeout(() => {
            this.closeCount--;
            this._djs();
          }, 1000);
        }
      },
      // 显示大图
      _showBigPic (type) {
        this.bigPic = this.orderCode[type];
        this.showBigPic = true;
      },
      _closeBigPic () {
        this.showBigPic = false;
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  
  .pay-page
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    min-width: 1280px
    min-height: 720px;
    background: url(../../assets/pay_page_bg.jpg) center no-repeat
    background-size: 100% 100%
    .jiequ-btn
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      margin: auto
      background: rgba(0, 0, 0, 0.3)
      z-index: 11111111111111111
      .video-wrapper
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        margin: auto
        width: 640px
        height: 522px
        background: #fff
        .video-tick
          height: 480px
        .video-btn
          padding: 6px 0 
          background: #fff
          text-align: center
          a
            display: inline-block
            text-align: center
            width: 120px
            height: 30px
            line-height: 30px
            background: #333
            color:#fff
            border-radius: 5px
            cursor: pointer
    .bigpic-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.picout-enter-active
        opacity: 1
      &.picout-enter,&.picout-leave-active
        opacity: 0
      .bigpic-inner
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 500px
        height: 320px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.4)
        background: rgba(255, 255, 255, 0.8)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        cursor: pointer
        &.picinner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.picinner-enter,&.picinner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        img
          display: block
          width: 100%
          height: auto
    .return-wrapper
      position: fixed
      top: 0
      right: 0
      left: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.3s
      &.returnout-enter-active
        opacity: 1
      &.returnout-enter,&.returnout-leave-active
        opacity: 0
      .return-inner
        position: absolute
        top: 0
        right: 0
        left: 0
        bottom: 0
        width: 160px
        height: 70px
        border-radius: 6px
        overflow: hidden
        margin: auto
        border: 3px solid rgba(255, 255, 255, 0.4)
        background: rgba(255, 255, 255, 0.8)
        transition: all 0.2s
        -webkit-transition: all 0.2s
        &.returninner-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.returninner-enter,&.returninner-leave-active
          transform: scale(1.2, 1.2)
          -webkit-transform: scale(1.2, 1.2)
        .title
          padding: 12px 0
          text-align: center
        a
          display: block
          width: 100%
          text-align: center
          color: #000
          // border-bottom: 1px solid #000
    .edit-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      margin: auto
      width: 600px
      height: 640px
      padding: 20px 60px
      background: url(../../assets/inner_back_bg.png) center no-repeat
      background-size: 100% 100%
      .list-item
        font-size: 16px
        padding: 10px 0
        color: #fff
        overflow: hidden
        .sure-btn
          display: inline-block
          margin-top: 10px
          margin-right: 60px
          width: 120px
          height: 36px
          line-height: 36px
          font-size: 16px
          background: url(../../assets/blue_small_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .close-btn
          display: inline-block
          margin-top: 10px
          width: 120px
          height: 36px
          line-height: 36px
          font-size: 16px
          background: url(../../assets/white_small_progress.png) center no-repeat
          background-size: 100% 100%
          cursor: pointer
        .left
          float: left
          width: 50%
        .inner-left
          float: left
          line-height: 20px
          height: 20px
        .choose-btn
          float: left
          cursor: pointer
          .inner-item
            float: left
            margin-left: 14px
            span
              margin-left: 4px
              display: inline-block
              vertical-align: middle
              line-height: 20px
              height: 20px
            i
              display: inline-block
              vertical-align: middle
              width: 20px
              height: 20px
              background: url(../../assets/choose_icon.png) center no-repeat
              background-size: 100% 100%
            &.index
              i
                background: url(../../assets/choose_index_icon.png) center no-repeat
                background-size: 100% 100%
        .img-wrapper
          position: relative
          float: left
          margin-left: 40px
          overflow: hidden
          img
            display: block
            width: 180px
            height: 120px
          .code-ipt
            display: inline-block
            padding: 5px
            font-size: 16px
            line-height: 16px
            border-radius: 3px
            background: rgba(190, 188, 187, 1)
            color: #fff
          .file-ipt
            position: absolute
            display: block
            top: 0
            left: 0
            right: 0
            bottom: 0
            opacity: 0
            cursor: pointer
</style>
