<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" :class="[parseInt(typeShow) === 1 ? 'index' : '']" v-show="showBomb">
          <!-- 取货地址 -->
          <div class="address-wrapper">
            <p class="title">请您前往</p>
            <p class="add-one">{{ companyAddress.company }}</p>
            <p class="add-two">{{ companyAddress.address }}</p>
            <p class="phone">{{ companyAddress.mobile }}</p>
            <p class="tips">* 请向工作人员出示您的订单凭证</p>
            <p class="tips" style="margin-top: 0.2rem">如有疑问请拨打上方热线</p>
            <div class="white-btn" @click="_downloadApp">下载APP</div>
            <div class="white-btn" @click="_orderList" v-if="parseInt(typeShow) === 1">订单列表</div>
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
        typeShow: false,
        companyAddress: {} // 公司信息
      };
    },
    props: {
      bombStr: {
        type: String
      }
    },
    methods: {
      // 显示弹框
      _showBomb (params) { // {data:res.data,type: 1}
        this.typeShow = params.type;
        this.companyAddress = params.data;
        this.showBomb = true;
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        this.showBomb = false;
      },
      _downloadApp () {
        window.location.href = 'https://companynew.megglife.com/down/down1.html';
      },
      // 订单列表
      _orderList () {
        this.$router.push({'name': 'orderList'});
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
      height: 17.5rem
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
      &.index
        height: 20rem
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
      .tips
        text-align: center
        font-size: 0.85rem
        color: #c8c9c9
      .white-btn
          width: 100%
          // background: #009fe8
          margin: auto
          margin-top: 1rem
          text-align: center
          border: 1px solid #fff
          color: #fff
          font-size: 0.9rem
          border-radius: 5px
          padding: 0.6rem 0
          -webkit-box-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3)
          &:active
            -webkit-transition: all 0.2s
            -webkit-transform: scale(1.05, 1.05)
      .address-wrapper
        padding: 1rem 1.5rem
        color: #fff
        .title
          font-size: 1.2rem
        .add-one
          padding: 1.4rem 0 0.4rem 0
          font-size: 1rem
        .add-two
          padding: 0.3rem 0
          min-height: 2.85rem
          line-height: 0.95rem
          font-size: 0.8rem
        .phone
          font-size: 1.1rem
          margin-bottom: 1.4rem
</style>
