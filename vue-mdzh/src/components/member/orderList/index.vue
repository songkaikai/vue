<template>
  <div class="order-list-page" v-scroll="_addList">
    <div class="choose-type-head">
      <span :class="dataOption.status === indexArr[index] ? 'index' : ''" v-for="(item, index) in topArr" @click="_changeChoose(indexArr[index])">{{ item }}</span>
    </div>
    <!-- 订单列表 -->
    <div class="order-list-wrapper" v-show="showLists">
      <div class="list-item" v-for="(item, index) in orderList">
        <p class="title border-bottom-1px">
          <span class="order-no">订单编号：{{ item.order_no }}</span>
          <span class="order-status">{{ orderType[item.status] }}</span>
        </p>
        <div class="order-detail">
          <div class="order-inner">
            <div class="order-img"><img :src="item.product_pic" alt=""></div>
            <div class="order-right">
              <p class="name">{{ item.product_name }}</p>
              <p class="price">￥{{ item.price }}</p>
              <p class="count">数量：1</p>
            </div>
          </div>
          <p class="all-price">共1件商品&nbsp;&nbsp;实付款：￥{{ item.price }}</p>
        </div>
        <div class="all-btn">
          <span v-if="parseInt(item.status) === 0" @click="_goPay(item.order_no, item.price)">付款</span>
          <span v-if="parseInt(item.status) === 2" @click="_sureBuy(item.id)">确认收货</span>
          <span v-if="parseInt(item.status) === 2 || parseInt(item.status) === 8" @click="_searchExpress(item.express_code, item.express)">查看物流</span>
          <!-- <span v-if="parseInt(item.status) === 2 || parseInt(item.status) === 8">订单详情</span> -->
        </div>
      </div>
    </div>
    <!-- 没有数据时显示 -->
    <div id="none-list-msg" v-show="showNoneMsg">暂无订单</div>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
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
  import bombBox from 'components/plugins/bombBox';
  // 引入session
  import Session from 'common/js/sessionStorage';
  const PROD_INFO_BUY = 'buy_prod_info';

  export default {
    data () {
      return {
        topArr: ['全部', '待付款', '待发货', '待收货', '已收货'],
        indexArr: ['', '0', '1', '2', '8'],
        orderType: ['待付款', '待发货', '待收货', '', '', '', '', '', '已收货'],
        bombStr: '您确定要删除订单吗？',
        tipsStr: '', // 提示字段
        dataOption: {
          token: '', // 会员token
          status: '', // 订单状态
          pageSize: 10, // 每页显示数量
          pages: 1 // 当前页
        },
        prodId: 0, // 当前选择的id
        winHei: 0, // window的高度
        getAgain: true, // 是否再次获取
        chooseAgain: false,
        showNoneMsg: false, // 显示没有任何数据
        loadingShow: false, // 加载中是否显示
        showLists: false // 列表是否显示
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取订单列表
      orderList: state => state.orderList
    }),
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      // 确认收货
      _sureBuy (id) {
        this.prodId = id;
        this.$refs.bombbox._showBomb();
      },
      submitMsg () {
        // console.log(this.prodId);
        this.$refs.loading.showLoad();
        this.$store.dispatch('sureOrder', {token: this.memberLogin.token, orderId: this.prodId}).then(res => {
           this.$refs.loading.hideLoad();
           if (res.code === 200) {
            this._showTip('已确定提交');
            // 初始化数据
            this.showNoneMsg = false;
            this.getAgain = false;
            this.showLists = false;
            this.dataOption.pages = 1;
            this._getList();
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
      _getList () {
        this.$refs.loading.showLoad();
        this._subList().then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 200) {
            this.chooseAgain = true;
            if (res.data.items.length === 0) {
              this.showNoneMsg = true;
            }
            if (res.data.items.length > 0) {
              this.showLists = true;
            }
            // console.log(res.data.length < this.dataOption.pagesize);
            if (res.data.items.length < this.dataOption.pageSize) {
              this.getAgain = false;
            } else {
              this.getAgain = true;
            }
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
      _subList () {
        this.dataOption.token = this.memberLogin.token;
        return this.$store.dispatch('orderList', this.dataOption);
      },
      _changeChoose (type) {
        if (this.dataOption.status !== type) {
          this.dataOption.status = type;
          // 初始化数据
          this.showNoneMsg = false;
          this.chooseAgain = false;
          this.showLists = false;
          this.dataOption.pages = 1;
          this._getList();
        }
      },
      // 前往支付
      _goPay (orderNo, payMoney) {
        Session.save({orderNo, payMoney}, PROD_INFO_BUY);
        this.$router.push({name: 'payChoose'});
      },
      // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.order-list-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.dataOption.pages += 1;
            this._subList().then(res => {
              this.loadingShow = false;
              if (res.data.items.length < this.dataOption.pageSize) {
                this.getAgain = false;
              } else {
                this.getAgain = true;
              }
            });
          }
        }
      },
      // 查看快递
      _searchExpress (expressNo, express) {
        // console.log(expressNo, express);
        this.$router.push({name: 'orderExpress', query: {expressNo, express}});
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      tips,
      loading,
      bombBox
    }
  };
</script>

<style>
  .order-list-page{background: #fff;}
  .order-list-page .choose-type-head{overflow: hidden;position: fixed;top:0;left:0;width:100%;background: #fff;z-index: 12;}
  .order-list-page .choose-type-head:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #ccc;content: '';-webkit-transform: scaleY(0.5);}
  .order-list-page .choose-type-head span{float:left;width: 20%;text-align: center;font-size: 0.8rem;padding: 0.8rem 0;position: relative;cursor:pointer;}
  .order-list-page .choose-type-head span.index:after{position: absolute;left: 10%;bottom: 0;width: 80%;z-index: 1;border-bottom: 2px solid #d3b073;content: '';}
  .order-list-page .order-list-wrapper{margin-top: 2.4rem;}
  .order-list-page .order-list-wrapper .list-item{border-top: 0.6rem solid #f4f4f4;}
  .order-list-page .order-list-wrapper .list-item .title{padding: 0.6rem 1rem;position: relative;font-size: 0.9rem;overflow: hidden;position: relative;}
  .order-list-page .order-list-wrapper .list-item .title .order-no{float:left;}
  .order-list-page .order-list-wrapper .list-item .title .order-status{float:right;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner{overflow: hidden;padding: 1rem 1.5rem;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-img{float:left;width: 5.5rem;height:5.5rem;border:1px solid #eee;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-img img{display:block;width: 5.5rem;height:5.5rem;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-right{padding: 0 0 0 6rem;font-size: 1rem;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-right .name{color:#969696;margin: 0.8rem 0 0.3rem 0;font-size: 0.9rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;height: 1rem;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-right .price{color:#e5cba6;}
  .order-list-page .order-list-wrapper .list-item .order-detail .order-inner .order-right .count{color:#969696;text-align: right;font-size: 0.9rem;margin-top:0.3rem;}
  .order-list-page .order-list-wrapper .list-item .all-price{text-align: right;font-size: 0.9rem;padding: 0.4rem 1.5rem;position: relative;color:#969696;}
  .order-list-page .order-list-wrapper .list-item .all-price:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #efefef;content: '';-webkit-transform: scaleY(0.5);}
  .order-list-page .order-list-wrapper .list-item .all-price:before{position: absolute;left: 0;top: 0;width: 100%;z-index: 1;border-bottom: 1px solid #efefef;content: '';-webkit-transform: scaleY(0.5);}
  .order-list-page .order-list-wrapper .list-item .all-btn{overflow: hidden;padding: 0.8rem 1.5rem;}
  .order-list-page .order-list-wrapper .list-item .all-btn span{float:right;padding: 0.4rem 0.6rem;border:1px solid #050001;border-radius: 4px;font-size: 0.85rem;cursor: pointer;margin-left: 0.4rem;cursor:pointer;}

</style>
