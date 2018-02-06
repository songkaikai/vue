<template>
  <div class="pay-result-page">
    <div class="result-msg" v-if="payResult === 0">
      <img src="./pay_false.png" alt="">
      <p>支付失败！</p>
    </div>
    <div class="result-msg" v-if="payResult === 1">
      <img src="./pay_true.png" alt="">
      <p>支付成功！</p>
    </div>
    <p class="payFail" v-if="payResult === 0">*支付失败，请到订单列表重新支付</p>
    <div class="link-btn black" @click="goCenter('accountManager')">会员中心</div>
    <div class="link-btn" @click="goCenter('home')">商城首页</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        payResult: ''
      };
    },
    created () {
      this.payResult = parseInt(this.$route.query.result);
      // console.log(1);
    },
    methods: {
      goCenter (type) {
        // console.log(link);
        this.$router.push({name: type});
      }
    }
  };
</script>

<style>
  .pay-result-page{background: #fff;}
  .pay-result-page .result-msg{padding: 2rem 0;}
  .pay-result-page .result-msg img{width:7rem;height:7rem;display: block;margin: auto;}
  .pay-result-page .result-msg p{text-align: center;font-size: 1rem;margin-top: 0.5rem;}
  .pay-result-page .link-btn{cursor:pointer;text-align: center;padding: 0.55rem 0;border:1px solid #000;width: 70%;margin:auto;border-radius: 5px;margin-top: 1rem;font-size: 0.9rem;}
  .pay-result-page .link-btn.black{background: #000;color:#f8ce8b;}
  .pay-result-page .payFail{color:red;font-size: 0.9rem;padding: 0.8rem 0;text-align: center;}
</style>
