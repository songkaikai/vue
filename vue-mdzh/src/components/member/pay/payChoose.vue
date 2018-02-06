<template>
  <div class="pay-choose-page">
    <div class="pay-head">
      <p class="head-one">订单编号：<span>{{ dataOption.orderNo }}</span></p>
      <p class="head-two">应付金额：¥ <span>{{ orderPrice }}</span></p>
    </div>
    <div class="choose-type">
      <!-- <div class="list-item index">
        <i></i>
        <div class="right"><img src="./type_account.png" alt=""></div>
      </div> -->
      <div class="list-item" :class="[dataOption.payType === 1 ? 'index' : '']" v-if="wxClient" @click="chooseTypeIndex(1)">
        <i></i>
        <div class="right"><img src="./type_alipay.png" alt=""></div>
      </div>
      <div class="list-item" :class="[dataOption.payType === 2 ? 'index' : '']" @click="chooseTypeIndex(2)">
        <i></i>
        <div class="right"><img src="./type_wechat.png" alt=""></div>
      </div>
    </div>
    <div class="submit-btn" @click="goPayResult()">去付款</div>
    <!-- 存放alipay表单的地址 -->
    <div class="link-alipay"></div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import $ from 'jquery';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  // 引入session
  import Session from 'common/js/sessionStorage';

  export default {
    data () {
      return {
        wxClient: false,
        tipsStr: '',
        orderId: '', // 订单编号
        orderPrice: '', // 订单价格
        dataOption: {
          token: '',
          orderNo: '', // 订单编号
          payType: 1 // 支付方式1支付宝2微信
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin
    }),
    created () {
      var uG = window.navigator.userAgent.toLowerCase();
      if (uG.indexOf('micromessenger') === -1) {
        this.wxClient = true;
      } else {
        this.dataOption.payType = 2;
      }
      var item = Session.fetch('buy_prod_info');
      this.dataOption.orderNo = item.orderNo;
      this.orderPrice = item.payMoney;
      // console.log(item);
    },
    methods: {
      chooseTypeIndex (index) {
        if (index !== this.dataOption.payType) {
          this.dataOption.payType = index;
        }
      },
      // 支付
      goPayResult () {
        var uG = window.navigator.userAgent.toLowerCase();
        if (uG.indexOf('micromessenger') !== -1) {
          window.location.href = 'http://zx.mdanlife.com/wechat/pay.html?orderNo=' + this.dataOption.orderNo;
        } else {
          this.dataOption.token = this.memberLogin.token;
          this.$refs.loading.showLoad();
          this.$store.dispatch('payChange', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 200) {
              if (this.dataOption.payType === 1) { // 支付宝支付
                $('.link-alipay').html(res.data.alipay.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
              } else { // 微信支付
                window.location.href = res.data.wechat;
                // console.log(res.data);
              }
            } else if (res.code === 401) {
                this._showTip('请重新登录');
            } else if (res.code === 500) {
              this._showTip('服务器内部错误');
            } else {
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
          });
          this.$router.push({name: 'payResult'});
        }
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      tips,
      loading
    }
  };
</script>

<style>
  .pay-choose-page{background: #fff;}
  .pay-choose-page .pay-head{text-align: center;font-size: 1rem;padding: 2rem 0;position: relative;}
  .pay-choose-page .pay-head:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #f8ce8b;content: '';}
  .pay-choose-page .pay-head p.head-one{margin-bottom: 0.4rem;}
  .pay-choose-page .submit-btn{width: 80%;margin:auto;background: #f8ce8b;color:#fff;font-size: 0.9rem;padding: 0.7rem 0;text-align: center;border-radius:4px;}
  .pay-choose-page .choose-type{overflow: hidden;padding: 0 2rem;margin: 2rem 0;}
  .pay-choose-page .choose-type .list-item{overflow: hidden;cursor:pointer;}
  .pay-choose-page .choose-type i{float:left;width: 1.5rem;height: 1.5rem;background:url(./choose_none.png) no-repeat;background-size: 1.5rem 1.5rem;cursor:pointer;padding: 0.5rem 0;margin-top:0.45rem;}
  .pay-choose-page .choose-type .list-item.index i{background:url(./choose_index.png) no-repeat;background-size: 1.5rem 1.5rem;}
  .pay-choose-page .choose-type .right{padding: 0 0 0 2.4rem;}
  .pay-choose-page .choose-type .right img{display: block;width: 6.5rem;height:2.4rem;}
</style>
