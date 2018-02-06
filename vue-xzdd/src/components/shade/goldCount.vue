<template>
  <transition name="goldcount">
    <div class="goldcount-shade" v-show="goldcountShow">
      <div class="goldcount-wrapper">
         <i class="close-btn" @click="closeShade('')"></i>
         <div class="inner-content">
            <div class="publicb-title"></div>
            <ul class="goldcount-head">
              <li style="width: 25%">日期</li>
              <li style="width: 25%">数量</li>
              <li>类型</li>
            </ul>
            <div class="code-list" v-if ="countDetail && countDetail.lists">
              <div class="border-bottom-1px" v-for="(item, index) in countDetail.lists">
                <ul class="list-item">
                  <li style="width: 25%">{{ item.add_date | formatDate }}</li>
                  <li style="width: 25%">{{ item.in !== '0.00' ? '+' + item.in : '-' + item.out }}</li>
                  <li><span class="desc">{{ item.type }}</span></li>
                </ul>
                <p>{{ item.desc }}</p>
              </div>
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
        goldcountShow: false,
        dataOption: {
          token: '',
          pages: 1,
          pageSize: 4
        },
        pagePrev: 1,
        pageAgain: false
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 账户日志
      countDetail: state => state.countDetail
    }),
    filters: {
      formatDate (time) {
        if (time !== undefined) {
          var date = time.slice(5, 10);
          return date;
        } else {
          return '';
        }
      }
    },
    methods: {
      showShade () {
        this.goldcountShow = true;
        // 获取账户日志
        this.dataOption.pages = 1;
        this.dataOption.token = this.memberLogin.token;
        // 获取数据
        this._getList();
      },
      // 提交数据
      closeShade (str) {
          this.goldcountShow = false;
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
        this.$store.dispatch('countDetail', this.dataOption).then(res => {
          this.$emit('hideLoad');
          this.pagePrev = Math.ceil(parseInt(res.total) / parseInt(res.pageSize));
          // console.log(parseInt(res.total) / parseInt(res.pageSize));
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .goldcount-shade
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 11
    -webkit-transition: all 0.2s linear
    -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
    &.goldcount-enter-active
      opacity: 1
      -webkit-transform: scale(1, 1)     
    &.goldcount-enter, &.goldcount-leave-active
      opacity: 0
      transform: scale(0.7, 0.7)  
    .goldcount-wrapper
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
          background: url(../../assets/gold_title.png) no-repeat
          background-size: 100% 100%
        .goldcount-head
          overflow: hidden
          li
            float: left
            padding: 0.5rem 0
            width: 50%
            text-align: center
            color: #fff
            font-size: 1rem
      .code-list
         height: 11rem
         div
           position: relative
           &.border-bottom-1px
             border-bottom-1px(#fff)
          p
            padding: 0.3rem
            font-size: 0.8rem
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            color: #fff
          .list-item
            overflow: hidden
            li
              float: left
              padding: 0.3rem 0
              width: 50%
              text-align: center
              color: #fff
              font-size: 0.8rem
              .desc
                display: block
                width: 100%
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
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
