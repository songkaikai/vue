<template>
  <div class="order-list">
    <router-link :to="{name: 'index'}" class="return-btn"><i></i><span>返回</span></router-link>
    <div class="order-list-wrapper">
      <div class="order-title"></div>
      <div class="list-wrapper" v-if="orderDetail.order_no">
        <div class="list-item">
          <p class="address"><i class="add-icon"></i><span>{{ orderDetail.area }} {{ orderDetail.address }}</span></p>
          <div class="member-detail">
            <div class="phone">
              <i class="phone-icon"></i><span>{{ orderDetail.mobile }}</span>
            </div>
            <div class="member-name">
              <i class="name-icon"></i><span>{{ orderDetail.consignee }}</span>
            </div>
          </div>
          <p class="order-no">订单号：{{ orderDetail.order_no }}</p>
          <a class="item-detail">
            <div class="left">
              <img :src="prodsImg" alt="">
            </div>
            <div class="right">
              <p class="name">{{ orderDetail.goods_name }}</p>
              <p class="count">
                <span class="price">{{ orderDetail.price }}</span>
                <span class="buy">X{{ orderDetail.buy_count }}</span>
              </p>
            </div>
          </a>
          <p class="total-price">共{{ orderDetail.buy_count }}件商品 合计：<span>￥{{ orderDetail.total }}</span></p>
          <div class="order-info">
            <p class="express-no">快递编号：{{ orderDetail.express_no }}</p>
            <p class="express">快递公司：{{ orderDetail.express }}</p>
            <p class="pay-time">支付时间：{{ orderDetail.pay_time }}</p>
          </div>
        </div>
      </div>
      <div class="page-btn" v-if="pagePrev > 1">
        <i class="blue_left_btn" @click="_changePage('prev')"></i><span>{{ nowPage }}/{{ pagePrev }}</span><i class="blue_right_btn" @click="_changePage('next')"></i>
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
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        prodsImg: require('../assets/moke_prod_100.png'),
        tipsStr: '',
        dataOption: {
          token: ''
          // pages: 1,
          // pageSize: 2
        },
        nowPage: 1,
        pagePrev: 1,
        pageAgain: false
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取订单详情
      orderDetail: state => state.orderDetail
    }),
    created () {
      // 获取当前token
      this.dataOption.token = this.memberLogin.token;
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      _getList () {
        // console.log(1);
         // this.$refs.loading.showLoad();
         this.$store.dispatch('orderList', this.dataOption).then(res => {
            // this.$refs.loading.hideLoad();
            // console.log(res.data.total);
            this.pagePrev = parseInt(res.data.total);
            // 获取订单详情数据
            if (res.data.lists.length > 0) {
              this._getDetail();
            }
         });
      },
      // 改变页数
      _changePage (type) {
        if (type === 'next') {
          if (this.nowPage !== this.pagePrev) {
            this.nowPage ++;
            this.pageAgain = true;
          }
        } else if (type === 'prev') {
          if (this.nowPage !== 1) {
            this.nowPage --;
            this.pageAgain = true;
          }
        }
        if (this.pageAgain) {
          this.pageAgain = false;
          // 获取订单详情数据
          this._getDetail();
        }
      },
      _getDetail () {
         this.$refs.loading.showLoad();
         this.$store.dispatch('orderDetail', {data: this.dataOption, index: this.nowPage}).then(res => {
            this.$refs.loading.hideLoad();
            if (!res.messgae === 'OK') {
              this._showTip('获取订单详情失败');
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
   .order-list
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      background: url(../assets/xz_bg.jpg) no-repeat
      background-size: 100% 100%
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
      .order-list-wrapper
          position: absolute
          top: 0
          left: 0
          bottom: 0
          right: 0
          width: 13rem
          height: 20rem
          padding: 1.2rem 1.5rem 2rem 1.5rem
          margin: auto
          background: url(../assets/shade_bg.png) no-repeat
          background-size: 100% 100%
          .page-btn
            position: absolute
            bottom: -3rem
            left: 50%
            width: 9rem
            margin-left: -4.5rem
            text-align: center
            font-size: 0.9rem
            color: #fff
            i
              display: inline-block
              vertical-align: middle
              margin: 0 0.3rem
              width: 1.8rem
              height: 1.8rem
              &.blue_left_btn
                background: url(../assets/blue_left_btn.png) center no-repeat
                background-size: 100% 100%
              &.blue_right_btn
                background: url(../assets/blue_right_btn.png) center no-repeat
                background-size: 100% 100%
            span
              display: inline-block
              vertical-align: middle
              width: 4rem
              height: 2rem
              line-height: 2rem
              background: url(../assets/blue_center_btn.png) center no-repeat
              background-size: 100% 100%
      .order-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../assets/order_title.png) no-repeat
          background-size: 100% 100%
      .list-wrapper
        padding-top: 0.2rem
        .list-item
          margin: 0.3rem 0
          font-size: 0.75rem
          color: #fff
          .address
            overflow: hidden
            .add-icon
              float: left
              display: inline-block
              width: 1rem
              height: 1rem
              background: url(../assets/address_icon.png) no-repeat
              background-size: 100% 100%
            span
              display: block
              padding: 0 0 0 1.2rem
              height: 2rem
              line-height: 1rem
          .member-detail
            margin-bottom: 0.4rem
            overflow: hidden
            .phone
              float: left
              width: 60%
              i
                display: inline-block
                vertical-align: middle
                width: 1rem
                height: 1rem
                background: url(../assets/phone_icon.png) no-repeat
                background-size: 100% 100%
              span
                display: inline-block
                vertical-align: middle
                height: 1rem
                line-height: 1rem
            .member-name
              float: left
              width: 40%
              i
                display: inline-block
                vertical-align: middle
                width: 1rem
                height: 1rem
                background: url(../assets/name_icon.png) no-repeat
                background-size: 100% 100%
              span
                display: inline-block
                vertical-align: middle
                height: 1rem
                line-height: 1rem
          .order-info
            margin-top: 0.5rem
            p
              padding: 0.25rem 0
          .order-no
            padding: 0.5rem 0
          .total-price
            padding: 0.5rem 0
            span
              color: #e8d32c
          .item-detail
            display: block
            border: 1px dashed #fff
            padding: 0.3rem
            overflow: hidden
            color: #fff
            .left
              float: left
              width: 4rem
              height: 4rem
              img
                display: block
                width: 4rem
                height: 4rem
            .right
              padding: 0 0 0 4.5rem
              .name
                padding: 0.5rem 0
                font-size: 0.9rem
                text-overflow: ellipsis
                overflow: hidden
                white-space: nowrap
              .count
                margin-top: 0.8rem
                padding: 0 0.7rem 0 0
                font-size: 0.7rem
                overflow: hidden
                .price
                  float: left
                .buy
                  float: right
</style>
