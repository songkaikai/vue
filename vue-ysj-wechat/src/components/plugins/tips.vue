<template>
  <transition name="tips">
    <div class="tips-icon" v-show="tipsShow"><span>{{ tipsStr }}</span></div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        // 弹框是否显示
        tipsShow: false
      };
    },
    props: {
      tipsStr: {
        type: String
      }
    },
    methods: {
      showTips () {
        // 如果提示已经是显示状态。就阻止再次触发
        if (!this.tipsShow) {
          // 提示框显示
          this.tipsShow = true;
          // 1.5秒后关闭
          setTimeout(() => {
            this.tipsShow = false;
          }, 1200);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tips-icon
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin: auto
    text-align: center
    height: 34px
    z-index: 1500
    -webkit-transition: all 0.2s
    &.tips-enter-active
      -webkit-transform: translate3d(0, 0, 0)
      opacity: 1
    &.tips-enter, &.tips-leave-active
      -webkit-transform: translate3d(0, 300%, 0)
      opacity: 0
    span
      display: inline-block
      padding: 12px 18px
      border-radius: 5px
      font-size: 14px
      line-height: 14px
      background: rgba(0, 0, 0, 0.6)
      color: #fff
</style>
