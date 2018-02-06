<template>
  <div class="helpCenter-page">
      <div class="help-header">
        <img src="./mdzh_logo.jpg" alt="">
      </div>
      <div class="inner-help">
        <!-- <p class="name">公司名称：<span>免蛋正合</span></p>
        <p class="tel">联系电话：<span>0579-89979976</span></p>
        <p class="address">地址：<span>浙江省义乌市北苑街道</span></p>
        <p class="email">email：<span>1936258369@qq.com</span></p>
        <p class="email">版权所有©2017 浙江久尚网络科技有限公司</p> -->
      </div>
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

  export default {
    data () {
      return {
        showList: false,
        tipsStr: ''
      };
    },
    computed: mapState({
      // 客服中心
      fkCenter: state => state.fkCenter
    }),
    created () {
      this.$nextTick(() => {
        this.getList();
      });
    },
    methods: {
      getList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('fkCenter', {articleNo: 'mdzh_link'}).then(res => {
          this.$refs.loading.hideLoad();
           if (res.code === 200) {
             this.showList = true;
             // console.log(res.data.cnt);
             $('.inner-help').html(res.data.cnt);
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
  .helpCenter-page .help-header{width:100%;margin-bottom: 1rem;}
  .helpCenter-page .help-header img{display: block;width:100%;height:auto;}
  .helpCenter-page .inner-help{padding: 2rem;}
  .helpCenter-page .inner-help p{font-size: 0.9rem;color:#000;padding: 0.3rem 0;}
</style>
