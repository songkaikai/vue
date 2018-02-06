<template>
  <transition name="integration">
    <div class="integration-shade" v-show="integrationShow">
      <div class="integration-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="publicb-title"></div>
            <ul class="integration-head">
              <li>日期</li>
              <li style="width: 40%">数量</li>
            </ul>
            <div class="code-list">
              <ul class="list-item border-bottom-1px" v-for="(item, index) in 8">
                <li>2017-12-10</li>
                <li style="width: 40%">100</li>
              </ul>
            </div>
            <div class="page-btn">
              <i class="blue_left_btn" @click="_changePage('prev')"></i><span>{{ pageNext }}/{{ pagePrev }}</span><i class="blue_right_btn" @click="_changePage('next')"></i>
            </div>
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
        integrationShow: false,
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
        this.integrationShow = true;
      },
      // 提交数据
      closeShade (str) {
          this.integrationShow = false;
          this.$emit('showMiddle', 'team');
       },
      // 改变页数
       _changePage (type) {
        if (type === 'next') {
          if (this.pageNext !== this.pagePrev) {
            this.pageNext ++;
            this.pageAgain = true;
          }
        } else if (type === 'prev') {
          if (this.pageNext !== 1) {
            this.pageNext --;
            this.pageAgain = true;
          }
        }
        if (this.pageAgain) {
          this.pageAgain = false;
          // console.log(this.pageNext);
          // 获取数据
          this.$emit('showLoad');
            setTimeout(() => {
              this.$emit('hideLoad');
               // this.$emit('showTip', '提现成功');
            }, 1500);
        }
       }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .integration-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.integration-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.integration-enter, &.integration-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .integration-wrapper
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
        background: url(../../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
      .inner-content
        .publicb-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../../assets/jf_title.png) no-repeat
          background-size: 100% 100%
        .integration-head
          overflow: hidden
          li
            float: left
            padding: 0.5rem 0
            width: 60%
            text-align: center
            color: #fff
            font-size: 1rem
      .code-list
         height: 11rem
        .list-item
          position: relative
          overflow: hidden
          &.border-bottom-1px
            border-bottom-1px(#fff)
          li
            float: left
            padding: 0.3rem 0
            width: 60%
            text-align: center
            color: #fff
            font-size: 0.8rem
        .page-btn
          margin-top: 0.8rem
          text-align: center
          font-size: 0.9rem
          color: #fff
          i
            display: inline-block
            vertical-align: middle
            margin: 0 0.3rem
            width: 1.8rem
            height: 1.8rem
            &.blue_left_btn
              background: url(../../assets/blue_left_btn.png) center no-repeat
              background-size: 100% 100%
            &.blue_right_btn
              background: url(../../assets/blue_right_btn.png) center no-repeat
              background-size: 100% 100%
          span
            display: inline-block
            vertical-align: middle
            width: 4rem
            height: 2rem
            line-height: 2rem
            background: url(../../assets/blue_center_btn.png) center no-repeat
            background-size: 100% 100%
</style>
