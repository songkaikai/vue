<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <!-- 取货方式 -->
          <div class="type-wrapper">
            <!-- 是否快递 1是0否 -->
            <div><i class="express-icon" @click="_submitChoose(1)"></i></div>
            <div><i class="ziqu-icon" @click="_submitChoose(0)"></i></div>
          </div>
          <p class="tips">* 请选择一种取货方式</p>
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
        showBomb: false
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
      _submitChoose (type) {
        this.$emit('submitMsg', type);
        this.showBomb = false;
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
      height: 18rem
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
        font-size: 0.9rem
        color: #c8c9c9
      .type-wrapper
        padding: 0.8rem 0
        div
          padding: 0.6rem 0
          width: 100%
          text-align: center
          i
            display: inline-block
            width: 5.6rem
            height: 5.6rem
            -webkit-transition: all 0.2s
            &.express-icon
              background: url(./kd_index_icon.png) center no-repeat
              background-size: 100% 100%
              &:active
                background: url(./type_kd_icon.png) center no-repeat
                background-size: 100% 100%
            &.ziqu-icon
              background: url(./type_zq_icon.png) center no-repeat
              background-size: 100% 100%
              &:active
                background: url(./zq_index_icon.png) center no-repeat
                background-size: 100% 100%
        // .express-icon
</style>
