<template>
  <div class="dsTeacher">
    <div class="shade-bg" v-show="shwDsList">
      <!-- 返回添加地址列表 -->
      <router-link :to="{name: 'index'}" class="close-btn"></router-link>
      <div class="inner-content">
        <!-- 标题 -->
        <div class="ds-title"></div>
        <!-- 列表 -->
        <!-- <div>{{ dsTeacher }}</div> -->
        <div class="list-wrapper" v-if="dsTeacher.length > 0">
          <div class="list-item" v-for="(item, index) in dsTeacher">
            <span class="left">{{ item.nick_name }}</span>
            <span class="right qr-icon" @click="_showQr(index)"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="page-btn" v-if="pagePrev > 1">
      <!-- <div class="page-btn"> -->
        <i class="blue_left_btn" @click="_changePage('prev')"></i><span>{{ dataOption.pages }}/{{ pagePrev }}</span><i class="blue_right_btn" @click="_changePage('next')"></i>
      </div>
    </div>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <!-- 导师二维码 -->
    <transition name="dscode">
      <div class="ds-code" v-if="!shwDsList">
        <img :src="qrCodes" alt="">
        <a class="close-btn" @click="_hideList"></a>
      </div>
    </transition>
  </div>
</template>

<script>
   import { mapState } from 'vuex';
   import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        shwDsList: true,
        qrCodes: 'http://img2.shuaijiao.com/images/2017/0708/20170708112506325.jpg', // 二维码
        dataOption: {
          token: '',
          pages: 1,
          pageSize: 7
        },
        pagePrev: 1,
        pageAgain: false
      };
    },
    computed: mapState({
      // 获取用户信息
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      dsTeacher: state => state.dsTeacher
    }),
    created () {
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      // 显示二维码
      _showQr (index) {
        // console.log(index);
        // console.log(this.dsTeacher[index].avatar);
        this.qrCodes = this.dsTeacher[index].wechat_code;
        this.shwDsList = false;
      },
      _hideList () {
        this.shwDsList = true;
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
          this.dataOption.token = this.memberLogin.token;
          this.$refs.loading.showLoad();
          this.$store.dispatch('dsTeacher', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            this.pagePrev = Math.ceil(parseInt(res.data.total) / parseInt(this.dataOption.pageSize));
          });
      }
    },
    components: {
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dsTeacher
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .ds-code
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 10rem
      height: 10rem
      padding: 2rem
      margin: auto
      background: url(../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      -webkit-transition: all 0.2s linear
      -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
      &.dscode-enter-active
        opacity: 1
        -webkit-transform: scale(1, 1)     
      &.dscode-enter, &.dscode-leave-active
        opacity: 0
        transform: scale(0.7, 0.7)  
      img
        display: block
        width: 10rem
        height: 10rem
      .close-btn
        position: absolute
        // display: block
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
    .shade-bg
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      width: 13rem
      height: 20rem
      padding: 1.2rem 1.5rem 2rem 1.5rem
      margin: auto
      background: url(../assets/shade_bg.png) no-repeat
      background-size: 100% 100%
      .page-btn
          position: absolute
          bottom: -3rem
          left: 50%
          width: 9rem
          margin-left: -4.5rem
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
              background: url(../assets/blue_left_btn.png) center no-repeat
              background-size: 100% 100%
            &.blue_right_btn
              background: url(../assets/blue_right_btn.png) center no-repeat
              background-size: 100% 100%
          span
            display: inline-block
            vertical-align: middle
            width: 4rem
            height: 2rem
            line-height: 2rem
            background: url(../assets/blue_center_btn.png) center no-repeat
            background-size: 100% 100%
      .close-btn
        position: absolute
        // display: block
        top: -0.9rem
        right: -0.8rem
        width: 2.5rem
        height: 2.5rem
        background: url(../assets/close_btn_icon.png)
        background-size: 100% 100%
        &:active
          transform: scale(1.2, 1.2)
      .inner-content
        position: relative
        .ds-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../assets/ds_title.png) no-repeat
          background-size: 100% 100%
        .list-item
          padding: 0.5rem 0.5rem
          border-bottom: 1px dashed #fff
          overflow: hidden
          color: #fff
          font-size: 0.9rem
          .left
            float: left
            height: 1.5rem
            line-height: 1.5rem
          .right
            float: right
            height: 1.5rem
            width: 1.5rem
            background: url(../assets/qr_code_icon.png) no-repeat
            background-size: 100% 100%
</style>
