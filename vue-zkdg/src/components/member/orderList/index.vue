<template>
  <div class="order-list-page" v-scroll="_addList">
    <!-- head navigator -->
    <div class="order-nav border-bottom-1px">
      <span class="list-item" :class="[parseInt(indexType) === navType[index] ? 'index' : '']" v-for="(item, index) in navStr" @click="_changeType(navType[index])">{{ item }}</span>
    </div>
    <!-- order list -->
    <div class="order-wrapper" v-show="showList">
      <div class="list-item" v-for="(item, index) in orderList">
        <div class="head-info border-bottom-1px">
          <span class="order-no">订单编号：{{ item.order_no }}</span>
          <span class="order-type">{{ parseInt(item.return_status) === 0 ? orderType[item.status] : exitType[item.return_status] }}</span>
        </div>
        <div class="prod-wrapper">
          <div class="prod-msg" v-for="(good, index) in item.order_goods">
            <div class="left-img"><img :src="good.main_pic" alt="" /></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ good.goods_name }}</p>
              <p class="price">￥{{ parseFloat(good.price).toFixed(2) }}</p>
              <p class="count">x{{ good.num }}</p>
            </div>
          </div>
        </div>
        <div class="all-btn border-top-1px">
          <span class="blue-btn" v-if="parseInt(item.status) === 1" @click="_payPage(item.order_no, item.order_money)">付款</span>
          <span class="white-btn" v-if="parseInt(item.status) === 1" @click="_deleteOrder(item.order_no, index)">删除</span>
          <span class="white-btn" v-if="parseInt(item.status) === 3" @click="_sureOrder(item.order_no, index)">确认收货</span>
          <span class="blue-btn" v-if="parseInt(item.status) === 3 || parseInt(item.status) === 4" @click="_searchExperss(item.order_no)">查看物流</span>
          <span class="white-btn" v-if="parseInt(item.status) === 2 || parseInt(item.status) === 3 || parseInt(item.status) === 4" @click="_exitOrder(item.order_no, index)">退款</span>
        </div>
      </div>
    </div>
    <!--  -->
    <div id="none-list-msg" v-show="!showList">暂无订单列表</div>
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
        orderType: ['', '待付款', '待发货', '待收货', '', '', '已收货'], // 订单类型
        exitType: ['', '待后台审核', '同意', '快递退回中', '拒绝', '完成'], // 1-待后台审核2-同意3-快递退回中4-拒绝5-完成
        winHei: 0, // window的高度
        chooseAgain: true,
        getAgain: true, // 是否再次获取
        showList: false // 列表是否有数据
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      // 获取当前进来的订单状态
      this.indexType = this.$route.query.type;
      this.$nextTick(() => {
        this.dataOption.token = this.memberLogin.token;
        this.dataOption.type = this.indexType;
        // 获取列表
        this._getOrderList(1);
      });
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        orderList: state => state.orderList
      })
    },
    methods: {
      _getOrderList (type) {
        // console.log(this.indexType);
        this.$refs.loading.showLoad();
        this._getSubList(type).then(res => {
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
        // type (1代表当前是更换状态要把存储的订单全部清空2代表当前状态订单继续获取)
        return this.$store.dispatch('getOrderList', {data: this.dataOption, type});
      },
      // 修改类型
      _changeType (type) {
        if (this.indexType !== type) {
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
      _payPage (orderNo, orderMoney) {
        this.$router.push({name: 'orderpay', query: {order_no: orderNo, order_money: orderMoney}});
      },
      _exitOrder (id, index) {
        this.boxType = 3;
        this.orderNo = id;
        this.orderIndex = index;
        this.bombStr = '确认退货吗?';
        this.$refs.bombbox._showBomb();
      },
      // 确认收货
      _sureOrder (id, index) {
        this.boxType = 2;
        this.orderNo = id;
        this.orderIndex = index;
        this.bombStr = '确认收货吗?';
        this.$refs.bombbox._showBomb();
      },
      // 删除订单
      _deleteOrder (id, index) {
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
        this.$router.push({name: 'expressInfo', query: {order_no: orderNo}});
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
      bombBox
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
        float: left
        width: 20%
        padding: 0.9rem 0
        text-align: center
        font-size: 0.9rem
        cursor: pointer
        &.index
          position: relative
          color: #4fccdb
          &:after
            position: absolute
            content: ''
            bottom: 0
            left: 50%
            margin-left: -40%
            width: 80%
            height: 2px
            background: #4fccdb
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
              color: #4fccdb
            .count
              text-align: right
        .all-btn
          position: relative
          padding: 0.5rem 1rem
          overflow: hidden
          &.border-top-1px
            border-top-1px(#eee)
          span
            float: right
            font-size: 0.8rem
            padding: 0.4rem 0.8rem
            margin-left: 0.4rem
            border-radius: 25px
            border: 1px solid #4fccdb
            cursor: pointer
            &.blue-btn
              background: #4fccdb
              color: #fff
            &.white-btn
              color: #4fccdb
              
</style>
