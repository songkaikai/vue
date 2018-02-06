<template>
  <div class="express-page">
      <div class="expree-header" v-if="showExpress">
        <p class="name">快递公司：<span>{{ expressInfo.ShipperCode }}</span></p>
        <p class="order">快递单号：<span>{{ expressInfo.OrderCode }}</span></p>
        <p class="status">当前状态：<span>{{ expressInfo.State }}</span></p>
      </div>
      <div class="flow-wrapper" v-if="showExpress">
        <ul class="flow-main">
          <li :class="index === 0 ? 'first' : 'flow-list'" v-for="(item, index) in expressInfo.Traces">
            <div class="flow-main">{{ item.AcceptStation }}</div>
            <p class="flow-time border-bottom-1px">{{ item.AcceptTime }}</p>
          </li>
          <!-- <li class="flow-list">
            <div class="flow-main">但是 v 地方干部的腐败干部发 v 避风港的地方港的地方 是颠倒是非</div>
            <p class="flow-time border-bottom-1px">2017-12-21  12:12:12</p>
          </li> -->
        </ul>
      </div>
      <!-- 提示框 -->
      <tips :tipsStr="tipsStr" ref="tips"></tips>
      <!-- 等待加载 -->
      <loading ref="loading"></loading>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  // import $ from 'jquery';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        showExpress: false,
        tipsStr: '',
        dataOption: {
          token: '', // 会员token
          order_no: '' // 快递单号
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 快递信息
      expressInfo: state => state.expressInfo
    }),
    created () {
      this.$nextTick(() => {
        this._getMsg();
      });
    },
    methods: {
      _getMsg () {
        this.dataOption.order_no = this.$route.query.order_no;
        this.dataOption.token = this.memberLogin.token;
        this.$refs.loading.showLoad();
        this.$store.dispatch('expressInfo', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this.showExpress = true;
          } else {
            this._showTip(res.msg);
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
      tips,
      loading
    }
  };
</script>

<style>
  .expree-header{padding: 1rem 1.5rem;background: #fff;}
  .expree-header p{font-size: 0.9rem;color:#000;padding:0.25rem 0;}
  .flow-wrapper{margin-top:10px;background: #fff;}
  .flow-wrapper .flow-main{padding: 0 10px;line-height: 16px}
  .flow-wrapper .flow-main .flow-time{position: relative;padding: 5px 10px;}
  .flow-wrapper .flow-main .flow-list,.flow-wrapper .flow-main .first{position:relative;padding: 10px 0 0 50px;font-size: 14px;color: #a6a6a6;position:relative;}
  .flow-wrapper .flow-main .flow-list::before{content:'';position:absolute;top:0;left:25px;width: 1px;height: 100%;background: #eee;}
  .flow-wrapper .flow-main .flow-list::after{content:'';position:absolute;top:10px;left:21px;width: 9px;height: 9px;border-radius:50%;background: #eee;}
  .flow-wrapper .flow-main .first{color:#df454b;}
  .flow-wrapper .flow-main .first::before{content:'';position:absolute;top:17px;left:25px;width: 1px;height: 100%;background: #eee;}
  .flow-wrapper .flow-main .first::after{content:'';position:absolute;top:10px;left:17px;width: 18px;height: 18px;border-radius:50%;background: url(./red_point.png) no-repeat;background-size: 100% auto;}

</style>
