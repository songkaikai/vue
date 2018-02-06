<template>
  <div class="cart-page">
    <div class="cart-all-wrapper" v-if="showList">
      <!-- 购物车列表 -->
      <div class="list-wrapper">
        <div class="list-item" :class="[index < 5 - 1 ? 'border-bottom-1px' : '']" v-for="(item, index) in cartList">
          <div class="choose-btn" @click="_changeChoose(index)"><i :class="[parseInt(item.choose) === 0 ? '' : 'index']"></i></div>
          <div class="prod-msg">
            <div class="left-img"><img :src="item.goods.main_pic" alt=""></div>
            <div class="right-info">
              <p class="name" style="-webkit-box-orient: vertical;">{{ item.goods.goods_name }}</p>
              <p class="price">￥{{ item.goods.price }}</p>
              <div class="other-btn">
                <div class="changeCount">
                  <!-- reduce -->
                  <span class="noReduce" :class="[item.num > 1 ? 'reduce' : '']" @click="_changeNum(1, index)"></span><span class="count">{{ item.num }}</span><span class="plus" @click="_changeNum(2, index)"></span>
                </div>
                <i class="delete-btn" @click="_delCart(item.cart_id)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部结算 -->
      <div class="bottom-wrapper border-top-1px">
        <div class="choose-all" @click="_changeAll()"><i :class="[allChooses === 0 ? '' : 'index']"></i><span>全选</span></div>
        <div class="all-wrapper">
          <div class="left-price">合计：{{ allPirce }}</div>
          <div class="balance-pay" @click="_submit">结算</div>
        </div>
      </div>
    </div>
    <div id="none-list-msg" v-else>购物车为空</div>
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
  import Session from 'common/js/sessionStorage';

  // 存储产品详情的字段
  const PROD_CART_LIST = 'prod_cart_list';

  export default {
    data () {
      return {
        pageStr: 'cart',
        allPirce: '0.00', // 总价格
        allChooses: 0,
        showList: false,
        goBuy: 0, // 要选择过产品以后才能购买
        cartSelectList: [], // 当前选中的产品的信息
        tipsStr: '',
        bombStr: '您确定要删除吗？',
        delId: null // 要删除的商品id
      };
    },
    created () {
      this.$nextTick(() => {
        this._getCartList();
      });
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        cartList: state => state.cartList
      })
    },
    methods: {
      // 提交购物车
      _submit () {
        if (!this.goBuy) {
          this._showTip('至少选择一样商品');
          return false;
        }
        // 当前选中的购物车进行本地存储
        // console.log(this.cartSelectList);
        Session.save(this.cartSelectList, PROD_CART_LIST);
        this.$router.push({name: 'buyPage', query: {type: 1}});
      },
      // 获取购物车列表
      _getCartList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getCartList', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            if (res.data.lists.length > 0) {
              this.showList = true;
            } else {
              this.showList = false;
            }
            // console.log('cart list');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      _changeChoose (index) {
        this.$store.dispatch('changeChoose', {index}).then(() => {
          this._changeAllPrice();
        });
      },
      _changeAll () {
        this.allChooses = parseInt(this.allChooses) === 0 ? 1 : 0;
        this.$store.dispatch('allChangeChoose', {type: this.allChooses}).then(() => {
          this._changeAllPrice();
        });
      },
      _changeAllPrice () {
        this.cartSelectList = []; // 初始化选中信息
        this.allPirce = '0.00';
        var len = this.cartList.length;
        var count = 0;
        for (var i = 0; i < len; i++) {
          if (parseInt(this.cartList[i].choose) === 1) {
            // 把当前选中的购物车商品放入
            this.cartSelectList.push(this.cartList[i]);
            var nowPrice = parseInt(this.cartList[i].num) * parseFloat(this.cartList[i].goods.price);
            this.allPirce = parseFloat(this.allPirce) + nowPrice;
            count++;
          }
        }
        this.goBuy = count > 0 ? 1 : 0; // 判断当前是否有选中的产品
        this.allPirce = parseFloat(this.allPirce).toFixed(2);
        this.allChooses = count !== len ? 0 : 1;
      },
      // 更改购物车数量
      _changeNum (type, index) {
        var prodNum = this.cartList[index].num;
        if (type === 1) { // 减数量
          if (prodNum === 1) { // 当前数量只有一个的时候就阻止
            return false;
          } else {
            prodNum--;
          }
        } else if (type === 2) { // 加数量
          prodNum++;
        }
        // console.log(prodNum);
        this.$refs.loading.showLoad();
        this.$store.dispatch('changeNum', {type, index, prodNum, token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code !== 1) {
            this._showTip(res.msg);
          }
        });
      },
      // 删除购物车产品
      _delCart (id) {
        this.delId = id;
        this.$refs.bombbox._showBomb();
      },
      // 弹框确认以后的操作
      submitMsg () {
        // console.log(this.delId);
        this.$refs.loading.showLoad();
        this.$store.dispatch('delCart', {token: this.memberLogin.token, cart_id: this.delId}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this._showTip('删除成功');
            this._getCartList();
          } else {
            this._showTip(res.msg);
          }
        });
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
  
  .cart-page
    padding-bottom: 5.1rem
    background: #f4f4f4
    .bottom-wrapper
      position: fixed
      bottom: 2.7rem
      left: 0
      width: 100%
      background: #fff
      overflow: hidden
      &.border-top-1px
        border-top-1px(#eee)
      .choose-all
        position: absolute
        top: 0
        left: 0
        width: 4.2rem
        font-size: 0.9rem
        height: 2.4rem
        line-height: 2.4rem
        text-align: center
        span
          display: inline-block
          vertical-align: middle
        i
          display: inline-block
          vertical-align: middle
          width: 1.6rem
          height: 1.6rem
          background: url(./select_no.png) no-repeat
          background-size: 100% 100%
          &.index
            background: url(./select_index.png) no-repeat
            background-size: 100% 100%
      .all-wrapper
        padding: 0 0 0 4.5rem
        overflow: hidden
        .left-price
          float: left
          width: 70%
          font-size: 0.9rem
          height: 2.4rem
          line-height: 2.4rem
        .balance-pay
          float: left
          width: 30%
          height: 2.4rem
          line-height: 2.4rem
          text-align: center
          background: url(./btn_bg_icon.png) no-repeat
          background-size: 100% 100%
          color: #fff
    .list-wrapper
      .list-item
        position: relative
        padding: 0.4rem 0
        background: #fff
        // overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#ccc)
        .choose-btn
          position: absolute
          top: 0
          left: 0
          width: 2.5rem
          height: 100%
          i
            position: absolute
            top: 0
            right: 0
            bottom: 0
            left: 0
            margin: auto
            display: inline-block
            width: 1.6rem
            height: 1.6rem
            background: url(./select_no.png) no-repeat
            background-size: 100% 100%
            &.index
              background: url(./select_index.png) no-repeat
              background-size: 100% 100%
        .prod-msg
          padding: 0 0 0 2.5rem
          overflow: hidden
          .left-img
            float: left
            width: 5rem
            height: 5rem
            border: 1px solid #eee
            img
              display: block
              width: 100%
              height: 100%
          .right-info
            padding: 0 0.5rem 0 5.5rem
            .name
              margin: 0.2rem 0
              height: 1.85rem
              line-height: 0.9rem
              font-size: 0.85rem
              word-break: break-all;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              overflow: hidden
            .price
              font-size: 0.9rem
              color: #f55858
            .other-btn
              margin-top: 0.15rem
              overflow: hidden
              .delete-btn
                float: right
                margin-right: 0.2rem
                padding: 0.15rem
                width: 1.35rem
                height: 1.35rem
                background: url(./delete_icon.png) center no-repeat
                background-size: 1.35rem 1.35rem
              .changeCount
                float: left
                border: 1px solid #ccc
                border-radius: 5px
                overflow: hidden
                span
                  display: inline-block
                  width: 25px
                  height: 25px
                  font-size: 13px
                  color: #555555
                  vertical-align: middle
                  text-align: center
                  line-height: 25px
                  background: url(./cart_icon.png) no-repeat -100px -118px
                  background-size: 22px auto
                  cursor: pointer
                  &.count
                    width: 50px
                  &.noReduce
                    background-position: 1px 7px
                    border-right:1px solid #ccc
                  &.reduce
                    background-position: 1px -58px
                    border-right:1px solid #ccc
                  &.plus
                    background-position: 1px -27px
                    border-left:1px solid #ccc
</style>
