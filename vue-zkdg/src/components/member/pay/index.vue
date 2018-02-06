<template>
  <div class="pay-choose-page">
    <div class="pay-head">
      <p class="head-one"><span class="left">订单编号：</span><span class="right">{{ orderInfo.order_no }}</span></p>
      <p class="head-two"><span class="left">应付金额：</span><span class="right">¥{{ parseFloat(orderInfo.order_money).toFixed(2) }}</span></p>
    </div>
    <div class="choose-type">
      <!-- <div class="list-item border-bottom-1px" @click="_payType('alipay')"> -->
      <div class="list-item border-bottom-1px" @click="_payType(3)">
        <div class="right"><img src="./alipay_icon.png" alt=""></div>
        <div class="left-info">
          <p class="title"><span class="name">支付宝支付</span></p>
          <p class="detail">支付宝支付</p>
        </div>
      </div>
      <!-- <div class="list-item" @click="_payType('wechat')"> -->
      <div class="list-item" @click="_payType(2)">
        <div class="right"><img src="./wechat_icon.png" alt=""></div>
        <div class="left-info">
          <p class="title"><span class="name">微信支付</span></p>
          <p class="detail">微信安全支付</p>
        </div>
      </div>
    </div>
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
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import $ from 'jquery';

  export default {
    data () {
      return {
        pageStr: 'pay-page',
        tipsStr: '',
        orderInfo: { // 订单信息
          order_no: '',
          order_money: ''
        },
        dataOption: {
          token: '',
          order_no: '',
          type: ''
        }
      };
    },
    created () {
      this.orderInfo.order_no = this.$route.query.order_no;
      this.orderInfo.order_money = this.$route.query.order_money;
      // 赋值订单号
      this.dataOption.order_no = this.$route.query.order_no;
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin
      })
    },
    methods: {
      _payType (type) {
        this.dataOption.type = type;
        // console.log(type);
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('buyLink', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            // console.log(res);
            // this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            if (type === 2) {
              // console.log('wechat');
              window.location.href = res.data;
              // console.log(res.data);
              // console.log(res.data);
            } else if (type === 3) {
              // console.log('alipay');
              // console.log(res.data);
              $('.link-alipay').html(res.data.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
            }
            // this._showTip('提现成功');
          } else {
            this._showTip(res.msg);
          }
        });
        // this.$router.push({name: 'payResult', query: {result: 1}});
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

<style scoped>
  .pay-choose-page{background: #fff;position: absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;}
  .pay-choose-page .pay-head{text-align: center;font-size: 1rem;padding: 1rem 0.6rem;position: relative;}
  .pay-choose-page .pay-head:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #e3e5e9;content: '';-webkit-transform: scaleY(0.5);}
  .pay-choose-page .pay-head p{color:#3785e2;overflow: hidden;font-size: 0.8rem;}
  .pay-choose-page .pay-head p .left{float:left;}
  .pay-choose-page .pay-head p .right{float:right;}
  .pay-choose-page .pay-head p.head-one{margin-bottom: 0.5rem;}
  .pay-choose-page .choose-type{overflow: hidden;padding: 0 1rem;margin: 1rem 0;}
  .pay-choose-page .choose-type .list-item{overflow: hidden;padding: 0.6rem 0;position: relative;background: url(./arrow_right_icon.png) right center no-repeat;background-size:  1.4rem 1.4rem;}
  .pay-choose-page .choose-type .list-item.border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #e3e5e9;content: '';-webkit-transform: scaleY(0.5);}
  .pay-choose-page .choose-type .list-item .right{float:left;width:2.4rem;}
  .pay-choose-page .choose-type .list-item .right img{display:block;width:2.4rem;height:auto;}
  .pay-choose-page .choose-type .list-item .left-info{font-size: 0.9rem;padding: 0 0 0 2.8rem;}
  .pay-choose-page .choose-type .list-item .left-info .title{padding: 0.2rem 0;font-size: 1rem;}
  .pay-choose-page .choose-type .list-item .left-info .title .tj{color:#fff;background: #d81212;border-radius: 3px;font-size: 0.8rem;padding: 0.1rem 0.2rem;margin-left: 0.3rem;}
  .pay-choose-page .choose-type .list-item .left-info .detail{color:#c8c8c8;font-size: 0.7rem;}
</style>
