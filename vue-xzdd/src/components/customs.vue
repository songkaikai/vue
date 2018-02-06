<template>
  <div class="customs-page">
    <router-link :to="{name: 'index'}" class="return-btn"><i></i><span>返回</span></router-link>
    <div class="customs-wrapper">
      <div class="prods_title"></div>
      <div class="inner-wrapper">
        <img :src="prodsImg" alt="">
        <p class="name"></p>
        <p class="detail">小贝是由瑞士巴塞尔国际制药集团联合国内知名生物实验公司，经过5年时间，针对国内食品污染的环境现状而研制出的全新糙米果蔬净洗片，并已获得国家专利。它可以有效安全降解果蔬、谷物等的农药残留、有效祛除细菌，激素，重金属，果蜡，米蜡等有害物质，对人体无二次污染，能有效抑制杀灭各种细菌和病菌，抑菌率高达99.9% ！</p>
        <div class="submit-btn" @click="_boxShad"></div>
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
          <p>此次购买需花费58金币</p>
          <div class="btn-item">
            <span @click="_sureBtn('yes')">确定</span><span @click="_sureBtn('no')">取消</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        showBuy: false,
        tipsStr: '',
        prodsImg: require('../assets/moke_prod_100.png'),
        dataOption: {
          token: '', // 会员TOKEN
          mobile: '', // 收货人手机号
          consignee: '', // 收货人
          area: '', // 所在地区
          address: '' // 详细地址
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户地址信息
      addressList: state => state.addressList
    }),
    created () {
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      // 获取收获地址
      _getList () {
         this.$store.dispatch('addressList', {token: this.memberLogin.token}).then(res => {
          var address = res.data[0];
          this.dataOption.mobile = address.mobile;
          this.dataOption.consignee = address.consignee;
          this.dataOption.area = address.area;
          this.dataOption.address = address.address;
          // console.log(res.data[0]);
         });
      },
      _boxShad () {
        this.showBuy = true;
      },
      _sureBtn (str) {
        if (str === 'yes') {
          this._submit();
        }
        this.showBuy = false;
      },
      // 提交购买
      _submit () {
        if (this.addressList.length === 0) {
          this._showTip('请先填写收货地址');
          return;
        }
        // console.log(1);
        // 提交数据
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('buyProduct', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
               this._showTip('购买成功');
               setTimeout(() => {
                  this.$router.replace({name: 'index'});
               }, 1000);
             } else {
              // console.log(JSON.parse(resolve.data.message));
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
             }
        });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      loading,
      tips
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .customs-page
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .all-shade
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0
      background: rgba(0, 0, 0, 0.7)
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
    .return-btn
      position: absolute
      top: 1rem
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
    .customs-wrapper
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        width: 13rem
        height: 22.5rem
        padding: 1.2rem 1.5rem 2rem 1.5rem
        margin: auto
        background: url(../assets/shade_bg.png) no-repeat
        background-size: 100% 100%
    .prods_title
        width: 6rem
        height: 2rem
        margin: auto
        margin-bottom: 0.3rem
        background: url(../assets/prods_title.png) no-repeat
        background-size: 100% 100%
    .inner-wrapper
      width: 100%
      img
        display: block
        width: 92%
        height: auto
        margin: auto
      .name
        margin: auto
        margin-bottom: 0.3rem
        width: 8rem
        height: 1.4rem
        background: url(../assets/prod_title_name.png) no-repeat
        background-size: 100% 100%
      .detail
        font-size: 0.7rem
        line-height: 0.8rem
        color: #fff
      .submit-btn
        position: absolute
        bottom: -2.8rem
        left: 50%
        display: block
        width: 5rem
        height: 2.2rem
        margin-left: -2.5rem
        line-height: 2rem
        background: url(../assets/prod_buy_btn.png) center no-repeat
        background-size: 100% 100%
</style>

