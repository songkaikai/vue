<template>
  <transition name="bombox">
    <div class="bomb-wrapper" v-show="showBomb">
      <transition name="box">
        <div class="bomb-box border-bottom-1px" v-show="showBomb">
          <p>{{ bombStr }}</p>
          <div class="choose-type">
            <span class="cancel" @click="_cancelChoose">取消</span><span class="submit" @click="_submitChoose">确定</span>
          </div>
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
      _submitChoose () {
        this.$emit('submitMsg');
        this.showBomb = false;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .bomb-wrapper
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 100
    background: rgba(0, 0, 0, 0.3)
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
      width: 240px
      height: 90px
      border-radius: 8px
      background: #fff
      transition: all 0.2s
      -webkit-transition: all 0.2s
      &.box-enter-active
        transform: scale(1, 1)
        -webkit-transform: scale(1, 1)
      &.box-enter,&.box-leave-active
        transform: scale(1.2, 1.2)
        -webkit-transform: scale(1.2, 1.2)
      p
        position: relative
        padding: 18px 0
        text-align: center
        font-size: 15px
        color: #333
        border-bottom-1px(#eee)
      .choose-type
        line-height: 14px
        font-size: 14px
        span
          display: inline-block
          padding: 12px 0
          height: 15px
          width: 50%
          text-align: center
        .cancel
          position: relative
          color: #a0a0a0
          border-right-1px(#eee, 0, 100%)
        .submit
          // color: #5197db
          color: #cbb693
</style>
