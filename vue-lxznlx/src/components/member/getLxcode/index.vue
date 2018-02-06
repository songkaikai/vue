<template>
  <div class="getlxcode">
    <div class="lx-wrapper">
      <!-- <div class="list-item">
        <span class="left">积分数量</span>
        <div class="right"><input type="tel" /></div>
      </div> -->
      <div class="list-item">
        <span class="left">激活码数量</span>
        <div class="right"><input type="tel" v-model="dataOption.buyCount" /></div>
      </div>
      <div class="list-item" v-show="dataOption.buyCount.length > 0">
        <span class="left"></span>
        <div class="right" style="font-size: 0.9rem;font-size: 0.85rem;height: 1.4rem;line-height: 1.4rem;"><span>需扣除积分{{ parseInt(dataOption.buyCount) * 10 }}</span></div>
      </div>
      <div class="submit-btn" @click="_submit">确定</div>
      <p class="tips">当前剩余积分{{ memberInfo.integral_balance }}</p>
      <p class="tips" style="color:red;">*1个激活码等于10积分</p>
    </div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
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
        tipsStr: '', // 提示框的字段
        dataOption: {
          token: '', // 会员TOKEN
          buyCount: '' // 购买个数
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo
    }),
    methods: {
      _submit () {
        if (parseInt(this.dataOption.buyCount) * 10 > parseFloat(this.memberInfo.integral_balance)) {
          this._showTip('积分不足');
          return false;
        }
        // this._showTip('确定中...');
        // 验证通过进行提交
        this.$refs.loading.showLoad();
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('activationBuy', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            this.$store.dispatch('memberInfo', {token: this.memberLogin.token});
            this.dataOption.buyCount = '';
            this._showTip('转换成功');
          } else {
            var obj = JSON.parse(res.data.message);
            for (var key in obj) {
              this._showTip(obj[key]);
              return;
            }
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
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .getlxcode
    background: #fff
    .lx-wrapper
      padding: 1.6rem 1rem
      .list-item
        overflow: hidden
        padding: 0.2rem 0
        .left
          float: left
          width: 5rem
          font-size: 0.85rem
          height: 1.4rem
          line-height: 1.4rem
          text-align: right
        .right
          padding: 0 0 0 5.5rem
          input
            display: inline-block
            width: 93%
            padding: 0.2rem 3%
            height: 1rem
            line-height: 1rem
            border: 1px solid #ccc
            font-size: 0.85rem
      .submit-btn
        width: 100%
        background: #62a5e7
        color: #fff
        text-align: center
        margin: 0.6rem 0 1rem 0
        padding: 0.5rem 0
        font-size: 0.95rem
        border-radius: 4px
      .tips
        font-size: 0.8rem
        margin-top: 0.3rem
</style>
