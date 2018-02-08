<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <!-- 支付方式 -->
          <div class="pay-wrapper">
            <div class="list-item">
              <i class="index"></i>
              <div class="right-icon wechat"><img src="./wechat_icon.png" alt=""></div>
            </div>
            <!-- <p class="tips">* 请选择支付方式</p> -->
            <p class="tips">* 暂时只支持微信支付</p>
            <div class="blue-btn" @click="_submitChoose">确定支付</div>
          </div>
          <div class="close-btn" @click="_cancelChoose"><img src="./close_icon.png" alt=""></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        showBomb: false,
        dataOption: {
          token: '', // token
          order_no: '', // 订单编号
          type: 1 // 支付类型(1-微信2-支付宝)
        }
      };
    },
    props: {
      bombStr: {
        type: String
      }
    },
    methods: {
      // 显示弹框
      _showBomb (option) {
        this.dataOption.token = option.token;
        // 赋值订单编号
        this.dataOption.order_no = option.orderNo;
        this.showBomb = true;
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        // this.$emit('submitMsg'); // 返回函数
        // return false;
        this.showLoad();
        this.$store.dispatch('prodPay', this.dataOption).then(res => {
          this.hideLoad();
          if (res.code === 1) {
            var self = this;
            // 打印输出信息
            // alert(JSON.stringify(res.data));
            // console.log(res.data);
            // wx.chooseWXPay({
            //   timestamp: res.data.wechat.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            //   nonceStr: res.data.wechat.nonceStr, // 支付签名随机串，不长于 32 位
            //   package: res.data.wechat.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            //   signType: res.data.wechat.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            //   paySign: res.data.wechat.paySign, // 支付签名
            //   success: function (res) {
            //     // 支付成功后的回调函数
            //     alert(JSON.stringify(res));
            //     // console.log(res);
            //   }
            // });
            var onBridgeReady = function () {
               window.WeixinJSBridge.invoke(
                  'getBrandWCPayRequest',
                  JSON.parse(res.data.wechat),
                  // JSON.parse('{"appId":"wx08c7a674d8fe73de","timeStamp":"1517812008","nonceStr":"5a77f928405d1","package":"prepay_id=wx201802051426482cd4caf9e30537032572","signType":"MD5","paySign":"34548FEFCA97833654C052AC59EABBE0"}'),
                  // {
                  //   "appId":"wx2421b1c4370ec43b", // 公众号名称，由商户传入
                  //   "timeStamp":"1395712654", // 时间戳，自1970年以来的秒数
                  //   "nonceStr":"e61463f8efa94090b1f366cccfbbb444", // 随机串
                  //   "package":"prepay_id=u802345jgfjsdfgsdg888",
                  //   "signType":"MD5", // 微信签名方式：
                  //   "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
                  // },
                  function (res) {
                    // console.log(res);
                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功
                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      // window.location.href = 'http://www.wzdaolema.com/payResult?payType=0&type=1&total=' + rest.data.total;
                      self.$emit('submitMsg'); // 返回函数
                    }
                    if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 支付过程中用户取消
                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      self.showTip('取消支付');
                    }
                    if (res.err_msg === 'get_brand_wcpay_request:fail') { // 支付失败
                      // 使用以上方式判断前端返回,微信团队郑重提示
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      self.showTip('支付失败');
                      // 测试
                      // self.$emit('submitMsg');
                    }
                  }
               );
            };
            if (typeof WeixinJSBridge === 'undefined') {
              if (window.document.addEventListener) {
                window.document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
              } else if (window.document.attachEvent) {
                window.document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                window.document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
              }
            } else {
               onBridgeReady();
            }
          } else { // 错误信息
            this.showTip(res.msg);
          }
        });
        // this.$emit('submitMsg', type);
        // this.showBomb = false;
      },
      showLoad () {
        this.$emit('showLoad');
      },
      hideLoad () {
        this.$emit('hideLoad');
      },
      // 显示提示框
      showTip (str) {
        // console.log(str);
        this.$emit('showTip', str);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../../common/stylus/mixin.styl';

  .bomb-wrapper
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 1000
    background: rgba(0, 0, 0, 0.8)
    -webkit-transition: all 0.3s
    &.bombox-enter-active
      opacity: 1
    &.bombox-enter,&.bombox-leave-active
      opacity: 0
    .bomb-box
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      margin: auto
      width: 16rem
      height: 10rem
      border-radius: 8px
      background: rgba(255, 255, 255, 0.22)
      transition: all 0.2s
      -webkit-transition: all 0.2s
      &.box-enter-active
        transform: scale(1, 1)
        -webkit-transform: scale(1, 1)
      &.box-enter,&.box-leave-active
        transform: scale(1.2, 1.2)
        -webkit-transform: scale(1.2, 1.2)
      .close-btn
        position: absolute
        bottom: -3.6rem
        left: 50%
        margin-left: -1.25rem
        width: 2.5rem
        height: 2.5rem
        cursor: pointer
        &:active
          -webkit-transition: all 0.2s
          -webkit-transform: scale(1.2, 1.2)
        img
          display: block
          width: 100%
          height: 100%
      .pay-wrapper
        padding: 0.8rem 1rem
        .tips
          text-align: center
          font-size: 0.9rem
          color: #c8c9c9
        .blue-btn
          width: 100%
          background: #009fe8
          margin: auto
          margin-top: 1rem
          text-align: center
          color: #fff
          font-size: 0.9rem
          border-radius: 5px
          padding: 0.6rem 0
          -webkit-box-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3)
          &:active
            -webkit-transition: all 0.2s
            -webkit-transform: scale(1.05, 1.05)
        .list-item
          padding: 0.6rem 0
          width: 100%
          text-align: center
          i
            display: inline-block
            vertical-align: middle
            width: 2rem
            height: 2rem
            -webkit-transition: all 0.2s
            background: url(./choose_default.png) center no-repeat
            background-size: 100% 100%
            &.index
              background: url(./choose_index.png) center no-repeat
              background-size: 100% 100%
          .right-icon
            display: inline-block
            vertical-align: middle
            width: 10rem
            img
              display: block
              width: 100%
              height: auto
</style>
