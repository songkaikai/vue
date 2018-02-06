<template>
  <transition name="logistics">
    <div class="logistics-shade" v-show="logisticsShow">
      <div class="logistics-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="logistics-title"></div>
            <p class="log-msg">物流公司：天天快递</p>
            <p class="log-msg">物流单号：32254547878787878</p>
            <ul class="log-list">
              <li class="index">快点进去就为大家千万记得去我觉得千万记得千万记得千万记得千万记得去玩</li>
              <li>快点进去就为大家千万记得去我觉得千万记得千万得千万记得去玩</li>
              <li>快点进去就为大家千千万记得千万记得去玩</li>
              <li>快点进去就为大家千记得千万记得去玩</li>
              <li>快点进去就为大家千万记得去我觉得千万记得大家千记得千万记得</li>
            </ul>
         </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    data () {
      return {
        // 当前是否显示邀请弹框
        logisticsShow: false,
        dataOption: {
          nike: '',
          phone: ''
        },
        pageNext: 1,
        pagePrev: 3,
        pageAgain: false
      };
    },
    methods: {
      showShade () {
        this.logisticsShow = true;
      },
      // 提交数据
      closeShade (str) {
          this.logisticsShow = false;
          this.$emit('showMiddle', 'logistics');
       }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .logistics-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.logistics-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.logistics-enter, &.logistics-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .logistics-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 17rem
      padding: 1.2rem 1.5rem 2rem 1.5rem
      margin: auto
      background: url(../../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .close-btn
        position: absolute
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../../assets/close_btn_icon.png) no-repeat
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
      .inner-content
        .logistics-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../../assets/wl_title.png) no-repeat
          background-size: 100% 100%
       .log-msg
         padding: 0.3rem 0
         font-size: 0.8rem
         color: #fff
       .log-list
         li
           position: relative
           padding: 0.3rem 0
           padding-left: 2rem
           font-size: 0.6rem
           line-height: 0.75rem
           color: #fff
           &:before
             position: absolute
             top: 0.2rem
             left: 0.5rem
             content: ''
             width: 0.8rem
             height: 0.8rem
             z-index: 2
             background: url(../../assets/choose_no_btn.png) no-repeat
             background-size: 100% 100%
           &.index:before
             background: url(../../assets/choose_has_btn.png) no-repeat
             background-size: 100% 100%
           &:after
             position: absolute
             top: 0.25rem
             left: 0.88rem
             content: ''
             width: 1px
             height: 100%
             border-left: 1px dashed #fff
</style>
