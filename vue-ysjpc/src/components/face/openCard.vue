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
      <div class="show-wrapper" v-if="parseInt(orderCode.status) === 32">
        <div class="show-phone" v-show="dataOption.mobile">{{ dataOption.mobile | formatDate }}</div>
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
          <span class="inner-left" style="height:26px;line-height:26px">手机号：</span>
          <div class="img-wrapper" style="margin-left:10px">
            <input type="text" class="code-ipt" v-model="dataOption.mobile" @input="filter('mobile')" />
          </div>
        </div>
        <div class="list-item" style="text-align:center;">
          <span class="sure-btn" @click="_submit">确定</span>
          <span class="close-btn" @click="_reset">重置</span>
        </div>
      </div>
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
        tipsStr: '', // 提示语句
        faceImg: require('../../assets/card_on_img.png'), // 身份证正面照
        backendImg: require('../../assets/card_bottom_img.png'), // 身份证反面照
        photoImg: require('../../assets/proto_img.png'), // 拍照的图片
        showBigPic: false, // 显示放大的图片
        bigPic: '', // 存放大图片地址的地方
        showReturn: false,
        closeCount: 3, // 距离关闭的秒速
        time: null,
        dataOption: {
          token: '', // 员工TOKEN
          registerId: '', // 申请单ID
          mobile: '' // 发放的手机号
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      orderCode: state => state.orderCode
    }),
    created () {
      this.$nextTick(() => {
        $('.code-ipt').focus();
      });
    },
    filters: {
      formatDate (str) {
        var strArr = String(str).split('');
        if (strArr.length > 3) {
          strArr.splice(3, 0, '-');
        }
        if (strArr.length > 8) {
          strArr.splice(8, 0, '-');
        }
        return strArr.join('');
      }
    },
    methods: {
      // 重置
      _reset () {
        this.dataOption.mobile = '';
      },
      // 提交
      _submit () {
        if (this.dataOption.mobile === '') {
          this._showTip('手机号不能为空');
          return;
        }
        // 提交数据
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.dataOption.registerId = this.orderCode.id;
        this.$store.dispatch('postCard', this.dataOption).then(res => {
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
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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
      height: 600px
      padding: 20px 60px
      background: url(../../assets/inner_back_bg.png) center no-repeat
      background-size: 100% 100%
      .show-wrapper
        position: relative
        .show-phone
            position: absolute
            bottom: 4.4rem
            left: 16rem
            font-size: 1.8rem
            background: #000
            width: 18rem
            height: 3rem
            line-height: 3rem
            text-align: center
            color: #fff
            letter-spacing: 0.18rem
            border-radius: 5px
            &:after
              position: absolute
              content: ''
              left: -1.3rem
              top: 50%
              margin-top: -0.7rem
              border: 0.7rem solid #000;
              border-left: 0.7rem solid transparent
              border-top: 0.7rem solid transparent
              border-bottom: 0.7rem solid transparent
      .list-item
        position: relative
        font-size: 16px
        padding: 10px 0
        color: #fff
        overflow: hidden
        .sure-btn
          display: inline-block
          margin-top: 15px
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
          margin-top: 15px
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
            width: 140px
            font-size: 16px
            line-height: 16px
            border-radius: 3px
            background: rgba(190, 188, 187, 1)
            color: #fff
          // input
          //   position: absolute
          //   display: block
          //   top: 0
          //   left: 0
          //   right: 0
          //   bottom: 0
          //   opacity: 0
          //   cursor: pointer
</style>
