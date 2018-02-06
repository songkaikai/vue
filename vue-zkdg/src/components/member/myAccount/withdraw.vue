<template>
	<div class="withdraw-page">
    <div class="inner-wrapper">
      <div class="list-item">
        <input type="tel" v-model="dataOption.alipay_no" @input="filter('alipay_no')" placeholder="请输入支付宝号" />
      </div>
      <div class="list-item">
        <input type="text" v-model="dataOption.true_name" @input="filter('true_name')" placeholder="请输入真实姓名" maxlength="5" />
      </div>
      <div class="list-item">
        <input type="tel" v-model="dataOption.draw_money" @input="filter('draw_money')" placeholder="请输入提现金额" />
      </div>
      <p class="tips">*提现方式只支持支付宝</p>
      <div class="submit-btn" @click="_submit">确定</div>
    </div>
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

  export default {
    data () {
      return {
        pageStr: 'withdraw-page',
        tipsStr: '',
        dataOption: {
          token: '',
          type: 1, // 类型1-支付宝2-微信(需绑定微信)
          draw_money: '', // 提现金额
          true_name: '', // 真实姓名
          alipay_no: '' // 支付宝号
        }
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin
      })
    },
    methods: {
      _submit () {
        if (this.dataOption.alipay_no === '') {
          this._showTip('支付宝号不能为空');
          return false;
        }
        if (this.dataOption.true_name === '') {
          this._showTip('真实姓名不能为空');
          return false;
        }
        if (this.dataOption.draw_money === '') {
          this._showTip('提现金额不能为空');
          return false;
        }
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('withdrawPost', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this.dataOption = {
              token: '',
              type: 1, // 类型1-支付宝2-微信(需绑定微信)
              draw_money: '', // 提现金额
              true_name: '', // 真实姓名
              alipay_no: '' // 支付宝号
            };
            this._showTip('提现成功');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 过滤空格
      filter (str) {
        this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
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

<style lang="stylus">
  @import "../../../common/stylus/mixin.styl";

  .withdraw-page
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: #fff
    .inner-wrapper
      padding: 2rem 2rem 0 2rem
      .tips
        color: #e4393c
        font-size: 0.9rem
      .submit-btn
        margin-top: 2rem
        width: 100%
        text-align: center
        font-size: 0.8rem
        background: #4fccdb
        padding: 0.7rem 0
        border-radius: 4px
        color: #fff
      .list-item
        position: relative
        padding: 0.6rem 0.8rem
        margin: 0.8rem 0
        border: 1px solid #ccc
        border-radius: 4px
        input
          font-size: 0.9rem
</style>
