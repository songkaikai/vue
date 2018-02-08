<template>
  <div class="order-list-page" v-scroll="_addList">
    <!-- head navigator -->
    <div class="order-nav border-bottom-1px">
      <span class="list-item" :class="[parseInt(indexType) === navType[index] ? 'sub-index' : '']" v-for="(item, index) in navStr" :key="item.id" @click="_changeType(navType[index])">{{ item }}</span>
    </div>
    <!-- order list -->
    <div class="order-wrapper" v-show="showList">
      <div class="list-item" v-for="(item, index) in orderList" :key="item.id">
        <div class="head-info border-bottom-1px">
          <span class="order-no">订单编号：{{ item.order_no }}</span>
          <span class="order-type">{{ orderType[item.status] }}</span>
        </div>
        <div class="prod-wrapper" @click="_goDetail(item.order_no, index)">
          <!-- <div class="prod-msg" v-for="good in item.order_goods" :key="good.id"> -->
          <div class="prod-msg">
            <div class="left-img"><img :src="item.order_goods.main_pic" alt="" /></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ item.order_goods.goods_name }}</p>
              <p class="price">￥{{ parseFloat(item.order_goods.price).toFixed(2) }}</p>
              <p class="count">x{{ item.order_goods.num }}</p>
            </div>
          </div>
        </div>
        <div class="choose-type border-top-1px">提取方式：<span class="right">{{ parseInt(item.is_ship) === 1 ? '快递' : '自取' }}</span></div>
        <div class="all-btn border-top-1px">
          <span class="blue-btn" v-if="parseInt(item.status) === 1" @click="_payPage(item.order_no, index)">付款</span>
          <span class="white-btn" v-if="parseInt(item.status) === 1" @click="_deleteOrder(item.order_no, index)">删除</span>
          <span class="white-btn" v-if="parseInt(item.status) === 3" @click="_sureOrder(item.order_no, index, item.is_ship)">确认收货</span>
          <span class="blue-btn" v-if="(parseInt(item.status) === 3 && parseInt(item.is_ship) === 1) || (parseInt(item.status) === 4 && parseInt(item.is_ship) === 1)" @click="_searchExperss(item.order_no)">查看物流</span>
          <!-- <span class="white-btn" v-if="parseInt(item.status) === 2 || parseInt(item.status) === 3 || parseInt(item.status) === 4" @click="_exitOrder(item.order_no, index)">退款</span> -->
        </div>
      </div>
    </div>
    <!--  -->
    <div id="none-list-msg" v-show="!showList">暂无订单列表</div>
    <!-- 快递 -->
    <express ref="express"></express>
    <!-- 自取 -->
    <ziqu ref="ziqu"></ziqu>
    <!-- 身份证号码 -->
    <card-no ref="cardno" v-on:showTip="_showTip" v-on:submitMsg="submitCardNo"></card-no>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        pageStr: 'orderList',
        tipsStr: '',
        bombStr: '',
        navStr: ['全部', '待付款', '待发货', '待收货', '已收货'],
        navType: [9, 1, 2, 3, 4],
        indexType: 9, // 当前导航栏的选项
        orderIndex: null, // 当前选中的列表下的下表
        orderNo: null, // 当前选中要操作的订单id
        boxType: null, // 当前执行的弹框的状态1代表删除2代表确认收货
        dataOption: {
          token: '', // token
          type: '', // 订单状态（9-全部 1-待付款 2-待发货 3-待签收 6-交易完成）
          pagesize: 10, // 每页显示数量
          page: 1 // 页码
        },
        orderType: ['订单已删除', '待付款', '待发货', '待收货', '已收货'], // 订单类型
        // exitType: ['', '待后台审核', '同意', '快递退回中', '拒绝', '完成'], // 1-待后台审核2-同意3-快递退回中4-拒绝5-完成
        winHei: 0, // window的高度
        chooseAgain: true,
        getAgain: true, // 是否再次获取
        showList: false, // 列表是否有数据
        typeOfShip: 0
      };
    },
    created () {
      // 利用路由的str来获取token
      var str = this.$route.query.str;
      // 获取window的高度
      this.winHei = window.screen.height;
      // 获取当前进来的订单状态
      // this.indexType = this.$route.query.type;
      this.$nextTick(() => {
        if (!this.memberLogin.token) {
          this.$refs.loading.showLoad();
          this.$store.dispatch('memberLogin', {str: str}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this.dataOption.token = res.data.token;
              this.dataOption.type = this.indexType;
              // 获取列表
              this._getOrderList(1);
            } else {
              this._showTip(res.msg);
            }
          });
        } else {
          this.dataOption.token = this.memberLogin.token;
          this.dataOption.type = this.indexType;
          // 获取列表
          this._getOrderList(1);
        }
      });
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        orderList: state => state.orderList
      })
    },
    methods: {
      _goDetail (orderNo, index) {
        // console.log(orderNo);
        this.$router.push({'name': 'orderDetail', query: {orderNo, index}});
      },
      _getOrderList (type) {
        // console.log(this.indexType);
        this.$refs.loading.showLoad();
        this._getSubList(type).then(res => {
          // console.log(res);
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            var listLen = res.data.lists.length;
            if (listLen !== parseInt(this.dataOption.pagesize)) {
              // console.log(1);
              // 如果获取到的数量少于要获取的数量，禁止滚动底部加载
              this.chooseAgain = false;
            }
            if (listLen === 0) {
              this.showList = false;
            } else {
              this.showList = true;
            }
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 获取订单列表
      _getSubList (type) {
        // console.log(type);
        // type (1代表当前是更换状态要把存储的订单全部清空2代表当前状态订单继续获取)
        return this.$store.dispatch('getOrderList', {data: this.dataOption, type});
      },
      // 修改类型
      _changeType (type) {
        if (this.indexType !== type) {
          // console.log(type);
          this.indexType = type;
          // 赋值重新
          this.dataOption.type = type;
          this.dataOption.page = 1;
          this.chooseAgain = true;
          this.getAgain = true;
          // 获取列表
          this._getOrderList(1);
        }
      },
      // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          // 但是发现document.body.scrollTop一直是0。
          // 查资料发现是DTD的问题。
          // 页面指定了DTD，即指定了DOCTYPE时，使用document.documentElement。
          // 页面没有DTD，即没指定DOCTYPE时，使用document.body。
          var currTop = document.body.scrollTop;
          // var currTop = document.documentElement.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.order-list-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.getAgain = false;
            this.dataOption.page += 1;
            this.$refs.loading.showLoad();
            this._getSubList(2).then(res => {
              this.$refs.loading.hideLoad();
              // console.log(res.data.lists);
              if (res.data.lists.length === this.dataOption.pagesize) {
                this.getAgain = true;
              }
            });
          }
        }
      },
      // 前往支付页
      _payPage (orderNo, index) {
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
                    // console.log(res);
                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功
                      // alert('ok');
                      // 使用以上方式判断前端返回,微信团队郑重提示：
                      // res.err_msg将在用户支付成功后返回
                      // ok，但并不保证它绝对可靠。
                      // window.location.href = 'http://www.wzdaolema.com/payResult?payType=0&type=1&total=' + rest.data.total;
                      self.$store.dispatch('delListOrder', {index});
                      self.$refs.express._showBomb({type: 0});
                      // self._showTip('支付成功');
                    }
                    if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 支付过程中用户取消
                      // alert('cancel');
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
      _exitOrder (id, index) {
        this.boxType = 3;
        this.orderNo = id;
        this.orderIndex = index;
        this.bombStr = '确认退货吗?';
        this.$refs.bombbox._showBomb();
      },
      // 确认收货
      _sureOrder (id, index, isShip) {
        this.boxType = 2;
        this.orderNo = id;
        this.orderIndex = index;
        this.typeOfShip = parseInt(isShip);
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
        this.$store.dispatch('orderSure', {data: data, index: this.orderIndex}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this._showTip('收货成功');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 删除订单
      _deleteOrder (id, index) {
        // alert(index);
        this.boxType = 1;
        this.orderNo = id;
        this.orderIndex = index;
        this.bombStr = '确认删除订单吗?';
        this.$refs.bombbox._showBomb();
      },
      // 弹框确认以后的操作
      submitMsg () {
        var data = {
          token: this.memberLogin.token,
          cardNo: '', // 身份证号如果是快递就需要填写身份证号
          order_no: this.orderNo
        };
        this.$refs.loading.showLoad();
        if (this.boxType === 1) {
          // this._showTip('删除成功');
          this.$store.dispatch('orderDelete', {data: data, index: this.orderIndex}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this._showTip('删除成功');
            } else {
              this._showTip(res.msg);
            }
          });
        } else if (this.boxType === 2) {
          // this._showTip('确认收货');
          this.$store.dispatch('orderSure', {data: data, index: this.orderIndex}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              this._showTip('收货成功');
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
      // 查询快递信息
      _searchExperss (orderNo) {
        // 类型0为手机订单1为礼品订单
        this.$router.push({name: 'expressInfo', query: {order_no: orderNo, type: 0}});
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

  .order-list-page
    .order-nav
      position: fixed
      top: 0
      left: 0
      width: 100%
      background: #fff
      z-index: 111
      overflow: hidden
      &.border-bottom-1px
        border-bottom-1px(#eee)
      .list-item
        position: relative
        float: left
        width: 20%
        padding: 0.9rem 0
        text-align: center
        font-size: 0.9rem
        cursor: pointer
        &.sub-index
          color: #009fe8
          &:after
            position: absolute
            content: ''
            bottom: 1px
            left: 10%
            width: 80%
            height: 2px
            background: #009fe8
    .order-wrapper
      padding-top: 2.7rem
      .list-item
        margin-bottom: 0.3rem
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
        .choose-type
          position: relative
          padding: 0.5rem 1rem
          overflow: hidden
          font-size: 0.85rem
          &.border-top-1px
            border-top-1px(#eee)
          .right
            float: right
        .all-btn
          position: relative
          padding: 0.5rem 1rem
          overflow: hidden
          &.border-top-1px
            border-top-1px(#eee)
          span
            float: right
            font-size: 0.8rem
            padding: 0.4rem 0.9rem
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
