<template>
  <transition name="cxcode">
    <div class="cxcode-shade" v-show="teamShow">
      <div class="cxcode-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="cxcode-title"></div>
            <ul class="cxcode-head">
              <li style="width: 40%">订单号</li>
              <li>日期</li>
              <li>金额</li>
              <li>结果</li>
            </ul>
            <div class="code-list" v-if="czcodeList && czcodeList.lists">
              <ul class="list-item border-bottom-1px" v-for="(item, index) in czcodeList.lists">
                <li style="width: 40%">{{ item.order_no }}</li>
                <li>{{ item.add_time }}</li>
                <li>{{ item.recharge_money }}</li>
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
        teamShow: false,
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
      czcodeList: state => state.czcodeList
    }),
    methods: {
      showShade () {
        this.teamShow = true;
        // 获取提现记录
        this.dataOption.pages = 1;
        this.dataOption.token = this.memberLogin.token;
        // 获取数据
        this._getList();
      },
      // 提交数据
      closeShade (str) {
          this.teamShow = false;
          this.$emit('showMiddle', 'team');
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
          this.$store.dispatch('czcodeList', this.dataOption).then(res => {
            this.$emit('hideLoad');
            // alert(1);
            this.pagePrev = Math.ceil(parseInt(res.data.total) / parseInt(this.dataOption.pageSize));
          });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .cxcode-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.cxcode-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.cxcode-enter, &.cxcode-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .cxcode-wrapper
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
        .cxcode-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../../assets/czcode_title.png) no-repeat
          background-size: 100% 100%
        .cxcode-head
          overflow: hidden
          li
            float: left
            padding: 0.5rem 0
            width: 20%
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
            width: 20%
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
