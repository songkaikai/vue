<template>
  <div class="prod-detail-page">
    <div class="pord-wrappers" v-if="showPage">
      <div class="head-slider">
        <img :src="prodDetail.pic[0]" alt="" />
      </div>
      <div class="prod-detail">
        <p class="name">{{ prodDetail.goods_name }}</p>
        <p class="desc" style="-webkit-box-orient: vertical;">{{ prodDetail.description }}</p>
        <p class="price">￥{{ prodDetail.price }}</p>
      </div>
      <!-- prod detail -->
      <div class="detail-wrapper" style="background:#fff;">
        <p class="title border-bottom-1px">产品详情</p>
        <div class="detail-inner">
          <!-- <img src="./moke_slider.jpg" alt="">
          <img src="./moke_slider.jpg" alt="">
          <img src="./moke_slider.jpg" alt=""> -->
        </div>
      </div>
      <!-- bottom nav -->
      <div class="bottom-nav">
        <div class="add-cart" @click="_addCart">加入购物车</div>
        <div class="buy-now" @click="_buyNow">立即购买</div>
      </div>
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
  import $ from 'jquery';
  import Session from 'common/js/sessionStorage';
  // 存储产品详情的字段
  const PROD_DETAIL = 'prod_detail';

  export default {
    data () {
      return {
        showPage: false,
        tipsStr: '',
        prodId: 0 // 当前页商品的id
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        prodDetail: state => state.prodDetail
      })
    },
    created () {
      // 获取商品id
      this.prodId = this.$route.query.id;
      this.$nextTick(() => {
        this._getPordDetail();
      });
    },
    methods: {
      _getPordDetail () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getPordDetail', {id: this.prodId}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            // 用会话存储存下当前产品详情，后面购买页要使用此信息
            Session.save(res.data, PROD_DETAIL);
            // console.log(Session.fetch(PROD_DETAIL));
            this.showPage = true;
            this.$nextTick(() => {
              $('.detail-inner').html(res.data.content);
            });
            // console.log('prod detail');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 立即购买
      _buyNow () {
        this.$router.push({name: 'buyPage', query: {id: this.prodId, type: 0}});
      },
      // 加入购物车
      _addCart () {
        // this._showTip('add cart !');
        this.$refs.loading.showLoad();
        this.$store.dispatch('addCart', {token: this.memberLogin.token, goods_id: this.prodId}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this._showTip('添加成功');
          } else {
            this._showTip(res.msg);
          }
        });
      },
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

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .prod-detail-page
    padding: 0 0 3.2rem 0
    .head-slider
      width: 100%
      img
        display: block
        width: 100%
        height: auto
    .prod-detail
      background: #fff
      .name
        padding: 0.3rem 0.4rem
        font-size: 0.85rem
        line-height: 0.9rem
      .desc
        // margin: 0.3rem 0
        padding: 0.3rem 0.4rem
        font-size: 0.85rem
        line-height: 0.9rem
        height: 1.5rem
        word-break: break-all;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        overflow: hidden
      .price
        padding: 0.5rem 0.4rem 0.6rem 0.4rem
        font-size: 1rem
        color: #4fccdb
    .detail-wrapper
      width: 100%
      .title
        position: relative
        text-align: center
        background: #fff
        border-top: 0.6rem solid #eee
        padding: 0.6rem 0
        font-size: 0.9rem
        &.border-bottom-1px
          border-bottom-1px(#eee)
      img
        display: block
        width: 100%
        height: auto
    .bottom-nav
      position: fixed
      bottom: 0
      left: 0
      width: 100%
      overflow: hidden
      z-index: 11
      background: #fff
      border-top-1px(#ccc)
      div
        float: left
        width: 50%
        height: 3.2rem
        line-height: 3.2rem
        text-align: center
        font-size: 0.9rem
        &.add-cart
          background: #bfbfbf
          color: #fff
        &.buy-now
          background: url(./bule_btn.png) no-repeat
          background-size: 100% 100%
          color: #fff
</style>
