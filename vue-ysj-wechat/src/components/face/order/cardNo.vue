<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <!-- 取货地址 -->
          <div class="address-wrapper">
            <div class="list-item">
              <i class="icon-five"></i>
              <div class="right-ipt">
                <input type="text" name="" v-model="dataOption.cardNo" @input="_filter('cardNo')" placeholder="请输入身份证号码" />
              </div>
            </div>
            <p class="tips">* 请确认是本人身份证号码</p>
            <div class="blue-btn" @click="_submitChoose">确定</div>
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
          cardNo: '' // 身份证号码
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
      _showBomb () {
        this.showBomb = true;
      },
      // 取消
      _cancelChoose () {
        this.showBomb = false;
      },
      // 确定选择
      _submitChoose () {
        if (this.dataOption.cardNo === '') {
          this.showTip('请填写身份证号码');
          return false;
        }
        this.$emit('submitMsg', this.dataOption.cardNo);
        this.showBomb = false;
      },
      // 过滤空格
      _filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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
          overflow: hidden
          i
            float: left
            width: 2rem
            height: 2rem
            &.icon-five
              background: url(./address_icon_five.png) center no-repeat
              background-size: 100% 100%
          .right-ipt
            padding: 0.2rem 0 0 2.4rem
            input
              display: inline-block
              width: 92%
              padding: 0.2rem 4%
              font-size: 0.9rem
              border-radius: 0
              // background: red
              color: #fff
              border-bottom: 1px solid #cecece
</style>
