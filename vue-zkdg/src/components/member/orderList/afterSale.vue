<template>
  <div class="after-sale-page" v-scroll="_addList">
    <!-- order list -->
    <div class="order-wrapper" v-show="showList">
      <div class="list-item" v-for="(item, index) in orderRrturn">
        <div class="head-info border-bottom-1px">
          <span class="order-no">订单编号：{{ item.order_no }}</span>
          <span class="order-type">{{ parseInt(item.return_status) === 0 ? orderType[item.status] : exitType[item.return_status] }}</span>
        </div>
        <div class="prod-wrapper">
          <div class="prod-msg" v-for="(good, index) in item.order_goods">
            <div class="left-img"><img :src="good.main_pic" alt="" /></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ good.goods_name }}</p>
              <p class="price">￥{{ parseInt(good.price).toFixed(2) }}</p>
              <p class="count">x{{ good.num }}</p>
            </div>
          </div>
        </div>
        <div class="all-btn border-top-1px" v-if="parseInt(item.return_status) > 1">
        <!-- <div class="all-btn border-top-1px" v-if="parseInt(item.return_status) === 1"> -->
          <span class="white-btn" v-if="parseInt(item.return_status) === 2" @click="_returnExpress(item.order_no)">填写退货快递</span>
        </div>
      </div>
    </div>
    <!--  -->
    <div id="none-list-msg" v-show="!showList">暂无售后列表</div>
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
        pageStr: 'afterSale',
        tipsStr: '',
        bombStr: '',
        dataOption: {
          token: '',
          pagesize: 3,
          page: 1
        },
        exitType: ['', '待后台审核', '同意', '快递退回中', '拒绝', '完成'], //
        winHei: 0, // window的高度
        chooseAgain: true,
        getAgain: true, // 是否再次获取
        showList: false // 列表是否有数据
      };
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        this.dataOption.token = this.memberLogin.token;
        // 获取列表
        this._getOrderList(1);
      });
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        orderRrturn: state => state.orderRrturn
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
        return this.$store.dispatch('orderRrturn', {data: this.dataOption, type});
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
          var currTop = document.body.scrollTop || document.documentElement.scrollTop;
          // var currTop = document.documentElement.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.after-sale-page').height());
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
      // 退货快递
      _returnExpress (orderNo) {
        this.$router.push({name: 'returnExpress', query: {orderNo}});
        // this.$refs.bombbox._showBomb();
      },
      // 弹框确认以后的操作
      submitMsg () {
        // console.log(1);
        console.log(this.orderNow);
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

<style lang="stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .after-sale-page
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
      // padding-top: 2.7rem
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
