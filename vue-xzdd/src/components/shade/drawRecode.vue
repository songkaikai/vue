<template>
  <transition name="drawrecode">
    <div class="drawrecode-shade" v-show="drawrecodeShow">
      <div class="drawrecode-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <ul class="drawcode-head">
              <li>类型</li>
              <li>日期</li>
              <li>金额</li>
              <li>状态</li>
            </ul>
            <div class="code-list" v-if="countDraw && countDraw.lists">
              <ul class="list-item border-bottom-1px" v-for="(item, index) in countDraw.lists">
                <li>{{ item.withdraw_type === 'alipay' ? '支付宝' : '银行卡' }}</li>
                <li>{{ item.add_time | formatDate }}</li>
                <li>{{ item.draw_money }}</li>
                <li>{{ item.statusName }}</li>
              </ul>
            </div>
            <div class="page-btn" v-if="pagePrev > 1">
              <i class="blue_left_btn" @click="_changePage('prev')"></i><span>{{ dataOption.pages }}/{{ pagePrev }}</span><i class="blue_right_btn" @click="_changePage('next')"></i>
            </div>
         </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        // 当前是否显示邀请弹框
        drawrecodeShow: false,
        dataOption: {
          token: '',
          pages: 1,
          pageSize: 8
        },
        pagePrev: 1,
        pageAgain: false
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 提现记录
      countDraw: state => state.countDraw
    }),
    filters: {
      formatDate (time) {
        if (time !== undefined) {
          var date = time.slice(5);
          return date;
        } else {
          return '';
        }
      }
    },
    methods: {
      showShade () {
        this.drawrecodeShow = true;
        // 获取提现记录
        this.dataOption.pages = 1;
        this.dataOption.token = this.memberLogin.token;
        // 获取数据
        this._getList();
      },
      // 提交数据
      closeShade (str) {
          this.drawrecodeShow = false;
          this.$emit('showMiddle', 'withdraw');
       },
       // 改变页数
       _changePage (type) {
        if (type === 'next') {
          if (this.dataOption.pages !== this.pagePrev) {
            this.dataOption.pages ++;
            this.pageAgain = true;
          }
        } else if (type === 'prev') {
          if (this.dataOption.pages !== 1) {
            this.dataOption.pages --;
            this.pageAgain = true;
          }
        }
        if (this.pageAgain) {
          this.pageAgain = false;
          // 获取数据
          this._getList();
        }
       },
       _getList () {
          this.$emit('showLoad');
          this.$store.dispatch('countDraw', this.dataOption).then(res => {
            this.$emit('hideLoad');
            this.pagePrev = Math.ceil(parseInt(res.total) / parseInt(this.dataOption.pageSize));
            // console.log(parseInt(res.total) / parseInt(res.pageSize));
          });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .drawrecode-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.drawrecode-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.drawrecode-enter, &.drawrecode-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .drawrecode-wrapper
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 15rem
      padding: 2rem 1.5rem
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
        .drawcode-head
          overflow: hidden
          li
            float: left
            padding: 0.5rem 0
            width: 25%
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
            width: 25%
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
