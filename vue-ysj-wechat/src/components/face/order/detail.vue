<template>
  <div class="order-detail">
    <div class="order-detail-wrapper" v-if="showDetail">
      <div class="list-item">
        <div class="head-info border-bottom-1px">
          <span class="order-no">订单编号：{{ orderDetail.order_no }}</span>
          <span class="order-type">{{ orderType[orderDetail.status] }}</span>
        </div>
        <div class="prod-wrapper">
          <!-- <div class="prod-msg" v-for="good in item.order_goods" :key="good.id"> -->
          <div class="prod-msg">
            <div class="left-img"><img :src="orderDetail.main_pic" alt="" /></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ orderDetail.goods_name }}</p>
              <p class="price">￥{{ parseFloat(orderDetail.price).toFixed(2) }}</p>
              <p class="count">x{{ orderDetail.num }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="other-params">
        <p class="info">{{ orderDetail.attr_value }}</p>
        <p class="info">收取方式：{{ parseInt(orderDetail.is_ship) === 1 ? '快递' : '自取' }}</p>
        <!-- 只有快递才显示收货地址 -->
        <p class="info" v-if="parseInt(orderDetail.is_ship) === 0">提货单号：{{ orderDetail.cnt }}</p>
        <p class="info" v-if="parseInt(orderDetail.is_ship) === 1">收货人：{{ orderDetail.consignee }}</p>
        <p class="info" v-if="parseInt(orderDetail.is_ship) === 1">收货人手机号：{{ orderDetail.mobile }}</p>
        <p class="info" v-if="parseInt(orderDetail.is_ship) === 1">收货地址：{{ orderDetail.area }} {{ orderDetail.address }}</p>
      </div>
      <!-- 赠品 -->
      <!-- <div class="list-item" v-if="(parseInt(orderDetail.status) > 1 && parseInt(orderDetail.is_ship) === 1) || (parseInt(orderDetail.status) === 4 && parseInt(orderDetail.is_ship) === 0)"> -->
      <div class="list-item" v-if="(parseInt(orderDetail.status) > 1 && parseInt(orderDetail.is_ship) === 1) || parseInt(orderDetail.is_ship) === 0">
        <div class="head-info border-bottom-1px">
          <span class="order-no">赠品订单编号：{{ orderDetail.order_gift.order_no }}</span>
          <span class="order-type">{{ orderType[orderDetail.order_gift.status] }}</span>
        </div>
        <div class="prod-wrapper">
          <div class="prod-msg">
            <div class="left-img"><img :src="orderDetail.order_gift.gift_pic" alt="" /></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ orderDetail.order_gift.gift_name }}</p>
              <div class="right-btn" v-if="(parseInt(orderDetail.status) === 3 && parseInt(orderDetail.is_ship) === 1) || (parseInt(orderDetail.status) === 4 && parseInt(orderDetail.is_ship) === 1)">
                <span class="search-btn" @click="_searchExperss(orderDetail.order_gift.order_no,1)">查看物流</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="all-btn border-top-1px">
      <span class="blue-btn" v-if="parseInt(orderDetail.status) === 1" @click="_payPage(orderDetail.order_no)">付款</span>
      <span class="white-btn" v-if="parseInt(orderDetail.status) === 1" @click="_deleteOrder(orderDetail.order_no)">删除</span>
      <span class="white-btn" v-if="parseInt(orderDetail.status) === 3" @click="_sureOrder(orderDetail.order_no,orderDetail.is_ship)">确认收货</span>
      <span class="blue-btn" v-if="(parseInt(orderDetail.status) === 3 && parseInt(orderDetail.is_ship) === 1) || (parseInt(orderDetail.status) === 4 && parseInt(orderDetail.is_ship) === 1)" @click="_searchExperss(orderDetail.order_no,0)">查看物流</span>
      <!-- <span class="white-btn" v-if="parseInt(item.status) === 2 || parseInt(item.status) === 3 || parseInt(item.status) === 4" @click="_exitOrder(item.order_no, index)">退款</span> -->
    </div>
    <!-- {{orderDetail}} -->
    <!-- 身份证号码 -->
    <card-no ref="cardno" v-on:showTip="_showTip" v-on:submitMsg="submitCardNo"></card-no>
    <!-- 快递 -->
    <express ref="express"></express>
    <!-- 自取 -->
    <ziqu ref="ziqu"></ziqu>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import bombBox from 'components/plugins/bombBox';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import cardNo from 'components/face/order/cardNo';
  import express from 'components/face/setup/express';
  import ziqu from 'components/face/setup/ziqu';
  // import $ from 'jquery';

  export default{
    data () {
      return {
        page: 'order-detail',
        tipsStr: '',
        bombStr: '',
        showDetail: false,
        orderType: ['订单已删除', '待付款', '待发货', '待收货', '已收货'], // 订单类型
        dataOption: {
          token: '',
          order_no: ''
        },
        orderIndex: null, // 当前选中的列表下的下表
        orderNo: null, // 当前选中要操作的订单id
        boxType: null // 当前执行的弹框的状态1代表删除2代表确认收货
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        orderDetail: state => state.orderDetail
      })
    },
    created () {
      // 利用路由的str来获取token
      var str = this.$route.query.str;
      // 判断当前是直接进入订单详情页的
      this.orderIndex = this.$route.query.index;
      // console.log(this.orderIndex === undefined);
      this.$nextTick(() => {
        if (!this.memberLogin.token) {
          this.$refs.loading.showLoad();
          this.$store.dispatch('memberLogin', {str: str}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              // 获取详情
              this._getDetail();
            } else {
              this._showTip(res.msg);
            }
          });
        } else {
          // 获取详情
          this._getDetail();
        }
      });
    },
    methods: {
      // 订单支付
      _payPage (orderNo) {
        var data = {
          token: this.memberLogin.token,
          order_no: orderNo,
          type: 1
        };
        this.$refs.loading.showLoad();
        this.$store.dispatch('prodPay', data).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            var self = this;
            // 打印输出信息
            // alert(JSON.stringify(res.data));
            // console.log(res.data);
            var onBridgeReady = function () {
               window.WeixinJSBridge.invoke(
                  'getBrandWCPayRequest',
                  JSON.parse(res.data.wechat),
                  function (res) {
                    // alert(JSON.stringify(res));
                    // console.log(res);
                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功
                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      // window.location.href = 'http://www.wzdaolema.com/payResult?payType=0&type=1&total=' + rest.data.total;
                      self.$store.dispatch('delListOrder', {index: self.orderIndex || -1});
                      self.$refs.express._showBomb({type: 0});
                      // self._showTip('支付成功');
                      self._getDetail(); // 重新获取数据
                    }
                    if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 支付过程中用户取消
                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      self._showTip('取消支付');
                    }
                    if (res.err_msg === 'get_brand_wcpay_request:fail') { // 支付失败
                      // 使用以上方式判断前端返回,微信团队郑重提示
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      self._showTip('支付失败');
                      // 测试
                      // self.$emit('submitMsg');
                    }
                  }
               );
            };
            if (typeof WeixinJSBridge === 'undefined') {
              if (window.document.addEventListener) {
                window.document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
              } else if (window.document.attachEvent) {
                window.document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                window.document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
              }
            } else {
               onBridgeReady();
            }
          } else { // 错误信息
            this._showTip(res.msg);
          }
        });
      },
      _getDetail () {
        this.dataOption = {
          token: this.memberLogin.token,
          order_no: this.$route.query.orderNo
        };
        this.$refs.loading.showLoad();
        this.$store.dispatch('orderDetail', this.dataOption).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this.showDetail = true;
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 查询快递信息
      _searchExperss (orderNo, type) {
        // 类型0为手机订单1为礼品订单
        this.$router.push({name: 'expressInfo', query: {order_no: orderNo, type}});
      },
      // 确认收货
      _sureOrder (id, isShip) {
        this.boxType = 2;
        this.orderNo = id;
        // 是否快递1快递0自提
        if (parseInt(isShip) === 0) { // 如果是自取就不需要填写身份证号码了
          this.bombStr = '确认收货吗?';
          this.$refs.bombbox._showBomb();
        } else {
          this._showCardNo();
        }
      },
      _showCardNo () {
        this.$refs.cardno._showBomb();
      },
      // 已经填写完身份证号码
      submitCardNo (cardNo) {
        // console.log(cardNo);
        var data = {
          token: this.memberLogin.token,
          cardNo: cardNo, // 身份证号如果是快递就需要填写身份证号
          order_no: this.orderNo
        };
        // console.log(data);
        this.$refs.loading.showLoad();
        this.$store.dispatch('orderSure', {data: data, index: this.orderIndex || -1}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this._showTip('收货成功');
            // this.$refs.express._showBomb({type: 0});
            this._getDetail();
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 删除订单
      _deleteOrder (id) {
        this.boxType = 1;
        this.orderNo = id;
        this.bombStr = '确认删除订单吗?';
        this.$refs.bombbox._showBomb();
      },
      // 弹框确认以后的操作
      submitMsg () {
        var data = {
          token: this.memberLogin.token,
          order_no: this.orderNo
        };
        this.$refs.loading.showLoad();
        if (this.boxType === 1) {
          // this._showTip('删除成功');
          this.$store.dispatch('orderDelete', {data: data, index: this.orderIndex || -1}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this._showTip('删除成功');
              this._getDetail();
              // if (this.orderIndex !== undefined) {
              //   this.$router.go(-1);
              // } else {
              //   this._getDetail();
              // }
            } else {
              this._showTip(res.msg);
            }
          });
        } else if (this.boxType === 2) {
          // this._showTip('确认收货');
          this.$store.dispatch('orderSure', {data: data, index: this.orderIndex || -1}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this._showTip('收货成功');
              this._getDetail();
            } else {
              this._showTip(res.msg);
            }
          });
        } else if (this.boxType === 3) {
          // this._showTip('退货成功');
          this.$store.dispatch('orderExit', {data: data, index: this.orderIndex}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this._showTip('已经申请退货,前往售后查看');
            } else {
              this._showTip(res.msg);
            }
          });
        }
      },
      /**
       * [_showTip description] 显示提示框
       * @param  {[type]} str [传到提示框的字段]
       * @return {[type]}     [description]
       */
       _showTip (str) {
         this.tipsStr = str;
         this.$refs.tips.showTips();
       }
    },
    components: {
      loading,
      tips,
      bombBox,
      cardNo,
      express, // 快递layer
      ziqu // 自取layer
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .order-detail
    .order-detail-wrapper
      padding-bottom: 3.5rem
      .list-item
        background: #fff
        .head-info
          position: relative
          padding: 0.6rem 0.8rem
          overflow: hidden
          &.border-bottom-1px
            border-bottom-1px(#eee)
          .order-no
            float: left
            font-size: 0.8rem
          .order-type
            float: right
            font-size: 0.8rem
            color: #e4393c
        .prod-msg
          position: relative
          padding: 0.5rem 1rem
          overflow: hidden
          .left-img
            float: left
            width: 5.5rem
            height: 5.5rem
            border: 1px solid #eee
            img
              display: block
              width: 100%
              height: 100%
          .right-info
            padding: 0 0 0 6.4rem
            font-size: 0.9rem
            .search-btn
              display: inline-block
              margin-top: 0.5rem
              padding: 0.4rem 0.6rem
              border: 1px solid #009fe8
              color: #009fe8
              border-radius: 5px
              font-size: 0.8rem
            .name
              margin: 0.3rem 0
              font-size: 0.85rem
              line-height: 0.9rem
              height: 1.8rem
              word-break: break-all;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              overflow: hidden
            .price
              margin: 0.5rem 0
              font-size: 1rem
              color: #009fe8
            .count
              text-align: right
      .other-params
        margin: 0.3rem 0
        background: #fff
        padding: 0.6rem 0.8rem
        font-size: 0.85rem
        .info
          padding: 0.2rem 0
    .all-btn
      position: fixed
      bottom: 0
      left: 0
      width: 90%
      padding: 0 5%
      overflow: hidden
      background: #fff
      &.border-top-1px
        border-top-1px(#eee)
      span
        float: right
        font-size: 0.8rem
        margin: 0.8rem 0
        padding: 0.6rem 1.6rem
        margin-left: 0.8rem
        border-radius: 5px
        border: 1px solid #009fe8
        cursor: pointer
        &.blue-btn
          background: #009fe8
          color: #fff
        &.white-btn
          color: #009fe8
</style>
