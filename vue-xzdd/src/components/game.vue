<template>
  <div class="game-page">
    <router-link :to="{name: 'index'}" class="return-btn"><i></i><span>返回</span></router-link>
    <div class="shade-tips">
      <i class="tips-icon"></i>
      <div class="tip-wrapper" v-if="tipsShow" ref="tipparent">
        <span ref="tiplong" style="left: 0;">{{ orderTips }}</span>
      </div>
    </div>
    <div class="box-list" v-if="showList">
      <div class="box" v-for="(item, index) in boxArr" @click="_openBox(item, index)">
        <!-- 2是待购买1是收益0是待开奖 -->
        <div v-if="item === 4 || item === 8">
          <i class="none"></i>
          <p>待购买</p>
        </div>
        <div v-else-if="item === 0 || item === 1">
          <i class="allready"></i>
          <p>{{ item === 0 ? '待开奖' : '已开奖'}}</p>
        </div>
        <div v-else-if="item === 2">
          <i class="open"></i>
          <p>收益</p>
        </div>
      </div>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <!-- 购买确认弹框 -->
    <transition name="boxshade">
      <div class="all-shade" v-show="showBuy">
        <div class="box-shade">
          <p>此次购买需花费100金币</p>
          <div class="btn-item">
            <span @click="_sureBtn('yes')">确定</span><span @click="_sureBtn('no')">取消</span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 已开奖提示 -->
    <transition name="tipsboxs">
      <div class="tipsboxs-shade" v-if="showBox">
        <div class="box-shade">
          <p>出局次数：{{ countMoney.frequency }}</p>
          <p>累计金额：{{ countMoney.all }}</p>
          <p>今日可获：{{ countMoney.day }}</p>
          <div class="btn-item">
            <span @click="_closeBox">确定</span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="gifimg">
      <div class="gif-img" v-if="gifShow">
        <img :src="gifSrc" alt="" />
        <p class="tips">恭喜你中了 {{ this.contsDetail }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
        return {
          gifShow: false,
          tipsShow: false,
          showList: false,
          showBuy: false,
          showBox: false,
          tipsStr: '',
          // 各个宝箱的状态
          boxArr: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          orderTips: '',
          timout: true,
          // 提示的总宽度
          allLong: 0,
          nowLong: 0,
          countMoney: {
            all: 0,
            frequency: 0,
            day: 0
          },
          gifSrc: '',
          boxGif: require('../assets/boxGif.gif'),
          contsDetail: 0
        };
    },
    computed: mapState({
        // 获取用户信息
        memberLogin: state => state.memberLogin,
        // 获取中奖名单
        lotteryList: state => state.lotteryList,
        // 获取用户信息
        xzOrderDetail: state => state.xzOrderDetail
     }),
    created () {
      this.$nextTick(() => {
        this._getMsg();
        this._getTips();
      });
    },
    methods: {
      _getTips () {
        // console.log('_getTips');
        this.$store.dispatch('lotteryList', {token: this.memberLogin.token}).then(() => {
          this.tipsShow = false;
          this.tipsShow = true;
          this.orderTips = '';
          var len = this.lotteryList.length;
          for (var i = 0; i < len; i++) {
            this.orderTips += '恭喜' + this.lotteryList[i].nick_name + '喜中' + this.lotteryList[i].period + '期大奖;     ';
          }
          this.$nextTick(() => {
            // 获取需要位移的长度
            this.$refs.tiplong.style.left = 0;
            // this.$refs.tiplong.style.left = this.tipsParent;
            this.nowLong = 0;
            var tipsLen = window.getComputedStyle(this.$refs.tiplong, null).width;
            var tipsParent = window.getComputedStyle(this.$refs.tipparent, null).width;
            this.allLong = parseInt(tipsLen + tipsParent) + 40;
            // console.log(this.allLong);
            this._changeLeft();
          });
        });
      },
      _closeBox () {
        this.showBox = false;
      },
      _changeLeft () {
          this.nowLong ++;
          this.$refs.tiplong.style.left = -this.nowLong + 'px';
          if (this.allLong > this.nowLong) {
            setTimeout(() => {
              if (this.timout) {
                this._changeLeft();
              }
             }, 40);
          } else {
            // console.log(this.lotteryList.length);
            if (this.lotteryList.length !== 0) {
              this._getTips();
            }
          }
      },
      // 获取血战订单的数据
      _getMsg () {
        // console.log('ok');
          this.$refs.loading.showLoad();
          this.$store.dispatch('xzOrderDetail', {token: this.memberLogin.token}).then(res => {
            // 获取会员基本信息
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this.$refs.loading.hideLoad();
            this.showList = false;
            for (var i = 0; i < res.length; i++) {
              // console.log(parseInt(res[i].status));
              this.boxArr[parseInt(res[i].member_paihao) - 1] = parseInt(res[i].status);
            }
            // console.log(this.boxArr);
            // 显示宝箱列表
            this.showList = true;
            // this.timout = setTimeout(() => {
            //   if (this.timout) {
            //     this._getMsg();
            //   }
            // }, 10000);
          });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      },
      // 开宝箱
      _openBox (type, index) {
        if (type === 4 || type === 8) {
          this.showBuy = true;
        } else if (type === 0) {
          this._showTip('未开奖');
        } else if (type === 1) {
          this.showList = false;
          for (var r = 0; r < this.xzOrderDetail.length; r++) {
            if (this.xzOrderDetail[r].member_paihao - 1 === index) {
              this.contsDetail = this.xzOrderDetail[r].fh_money;
              break;
            }
          }
          // this.contsDetail = this.xzOrderDetail[index].fh_money;
          this.gifSrc = this.boxGif;
          this.gifShow = true;
          setTimeout(() => {
             setTimeout(() => {
                this.gifShow = false;
                this.showList = true;
              }, 0);
              this.gifSrc = '';
            }, 2000);
        } else if (type === 2) {
          for (var i = 0; i < this.xzOrderDetail.length; i++) {
            if (this.xzOrderDetail[i].member_paihao - 1 === index) {
              this.countMoney.day = this.xzOrderDetail[i].day_money;
              this.countMoney.frequency = this.xzOrderDetail[i].frequency;
              this.countMoney.all = this.xzOrderDetail[i].fh_money;
              break;
            }
          }
          // this.countMoney.day = this.xzOrderDetail[index + 1].day_money;
          // this.countMoney.frequency = this.xzOrderDetail[index + 1].frequency;
          // this.countMoney.all = this.xzOrderDetail[index + 1].fh_money;
          this.showBox = true;
          // this._showTip('累计金额：' + this.xzOrderDetail[index].day_money);
        }
      },
      _sureBtn (str) {
        if (str === 'yes') {
            this.$refs.loading.showLoad();
            this.$store.dispatch('xzOrderBuy', {token: this.memberLogin.token}).then(res => {
              this.$refs.loading.hideLoad();
              // console.log(res);
              if (!res.data.message) {
                this.showList = false;
                this.showList = true;
                this._showTip('购买成功');
                this._getMsg();
              } else {
                this._showTip(JSON.parse(res.data.message));
              }
            });
        }
        this.showBuy = false;
      }
    },
    components: {
      tips,
      loading
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      this.timout = false;
      next();
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .game-page
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .gif-img
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.2s linear
      -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
      &.gifimg-enter-active
        opacity: 1
        -webkit-transform: scale(1, 1)     
      &.gifimg-enter, &.gifimg-leave-active
        opacity: 0
        transform: scale(0.7, 0.7)
      .tips
        position: absolute
        left: 0
        bottom: 6rem
        width: 100%
        color: #fff
        text-align: center
      img
        position: absolute
        top: 0
        bottom: 0
        right: 0
        left: 0
        display: block
        width: 100%
        height: 100%
    .return-btn
      position: absolute
      bottom: 1rem
      left: 1rem
      color: #fff
      font-size: 0.8rem
      i
        display: inline-block
        vertical-align: middle
        margin: 0 0.3rem
        width: 1.8rem
        height: 1.8rem
        background: url(../assets/blue_left_btn.png) center no-repeat
        background-size: 100% 100%
    .tipsboxs-shade
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.2s linear
      -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
      &.tipsboxs-enter-active
        opacity: 1
        -webkit-transform: scale(1, 1)     
      &.tipsboxs-enter, &.tipsboxs-leave-active
        opacity: 0
        transform: scale(0.7, 0.7)  
      .box-shade
        position: absolute
        top: 0
        bottom: 0
        right: 0
        left: 0
        padding: 0.5rem
        width: 12rem
        height: 7.8rem
        margin: auto
        background: url(../assets/shade_bg.png) no-repeat
        background-size: 100% 100%
      p
        padding: 0.5rem 0
        font-size: 0.9rem
        text-align: center
        color: #fff
      .btn-item
        text-align: center
        span
          display: inline-block
          width: 4.8rem;
          height: 1.92rem;
          text-align: center;
          margin-left: 0.7rem
          line-height: 1.9rem;
          background: url(../assets/blue_center_btn.png) no-repeat;
          background-size: 100% 100%;
          font-size: 0.9rem;
          color: #fff;
    .all-shade
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0
      background: rgba(0, 0, 0, 0.3)
      -webkit-transition: all 0.2s linear
      -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
      &.boxshade-enter-active
        opacity: 1
        -webkit-transform: scale(1, 1)     
      &.boxshade-enter, &.boxshade-leave-active
        opacity: 0
        transform: scale(0.7, 0.7)  
      .box-shade
        position: absolute
        top: 0
        bottom: 0
        right: 0
        left: 0
        width: 12rem
        height: 6rem
        margin: auto
        background: url(../assets/shade_bg.png) no-repeat
        background-size: 100% 100%
      p
        padding: 1rem 0
        font-size: 0.9rem
        text-align: center
        color: #fff
      .btn-item
        span
          display: inline-block
          width: 4.8rem;
          height: 1.92rem;
          text-align: center;
          margin-left: 0.7rem
          line-height: 1.9rem;
          background: url(../assets/blue_center_btn.png) no-repeat;
          background-size: 100% 100%;
          font-size: 0.9rem;
          color: #fff;
    .shade-tips
      position: relative
      width: 65%
      margin: 2rem 0 1rem 3rem
      padding: 0.5rem 1rem 0.5rem 0
      border-radius: 25px
      height: 1rem
      color: #fff
      font-size: 0.9rem
      background: rgba(255, 255, 255, 0.3)
      .tip-wrapper
        position: relative
        height: 1rem
        display: block
        overflow: hidden
        span
          position: absolute
          top: 0
          left: 0
          z-index: 1
          // width: 100px
          white-space: nowrap
          height: 1rem
          margin-left: 1.5rem
      i.tips-icon
        position: absolute
        top: -0.1rem
        left: -1.8rem
        display: inline-block
        width: 3.5rem
        height: 2.2rem
        z-index: 10
        background: url(../assets/laba_icon.png) no-repeat
        background-size: 100% 100%
    .box-list
      overflow: hidden
      width: 17.2rem
      margin: auto
      .box
        position: relative
        float: left
        margin: 0.15rem 0
        width: 3.4rem
        height: 3.8rem
        i
          display: inline-block
          width: 3.4rem
          height: 3.4rem
          &.none
            background: url(../assets/box_no_blue.png) no-repeat
            background-size: 100% 100%
          &.allready
            background: url(../assets/box_yes_yellow.png) no-repeat
            background-size: 100% 100%
          &.open
            background: url(../assets/box_yes_ready_yellow.png) no-repeat
            background-size: 100% 100%
        p
          position: absolute
          bottom: 0
          left: 0
          width: 100%
          font-size: 0.7rem
          text-align: center
          color: #d7b543
</style>
