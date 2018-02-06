<template>
  <div class="buy-prod-page">
      <!-- 头部显示的地址 -->
      <div class="header-address" style="height:5rem;">
      	<!-- <div class="no-address" @click="openAddress()" style="text-align:center;height:5rem;line-height:5rem;font-size:1rem;">
          +添加收货地址
        </div> -->
        <div class="no-address" @click="openAddress()" style="text-align:center;height:5rem;line-height:5rem;font-size:1rem;"  v-if="!addressList[0]">
          +添加收货地址
        </div>
        <div class="inner-msg" v-else @click="_choosdAdd()">
          <div class="one-line">
            <i class="icon-one"></i>
            <p class="address">{{ addressList[chooseIndex].area | formatDate }} {{ addressList[chooseIndex].address }}</p>
          </div>
          <div class="two-line">
            <i class="icon-two"></i><span>{{ addressList[chooseIndex].mobile }}</span><i class="icon-three"></i><span>{{ addressList[chooseIndex].consignee }}</span>
          </div>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="prod-list">
        <div class="order-inner" v-for="(item, index) in prodArr">
          <div class="order-img"><img :src="item.goods.main_pic" alt=""></div>
          <div class="order-right">
            <p class="name">{{ item.goods_name }}</p>
            <p class="price">￥{{ item.goods.price }}</p>
            <p class="count">数量：{{ item.num }}</p>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottom-sub">
        <span class="right-btn" @click="submitBtn()">提交</span>
        <div class="all-count">实付：￥<span>{{ allProdPrice }}</span></div>
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
  // 引入session
  import Session from 'common/js/sessionStorage';

  // 存储产品详情的字段
  const PROD_DETAIL = 'prod_detail';
  const PROD_CART_LIST = 'prod_cart_list';

  export default {
    data () {
      return {
        chooseIndex: 0, // 当前选中的地址列表的下标
        srcLink: '',
        prodName: '',
        prodPrice: '', // 价格
        tipsStr: '',
        dataOption: {
          token: '',
          // productId: '', // 产品id
          address_id: '' // 地址ID
        },
        allProdPrice: '0.00', // 购物总价总价
        queryArr: null, // url参数
        prodArr: [], // 存储产品列表的地方
        cartIdStr: [] // 购物车id所有的
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取地址列表
      addressList: state => state.addressList
    }),
    created () {
      this.queryArr = this.$route.query;
      // console.log(queryArr.type);
      if (parseInt(this.queryArr.type) === 0) { // 从详情页前往的购买页
        var prodDetail = Session.fetch(PROD_DETAIL);
        // prodDetail.num = 1;
        this.prodArr.push({
          num: 1,
          goods_name: prodDetail.goods_name,
          goods: {
            price: prodDetail.price,
            main_pic: prodDetail.pic[0]
          }
        });
        this.allProdPrice = prodDetail.price; // 显示的总价格
      } else { // 从购物车前往的购买页
        var prodList = Session.fetch(PROD_CART_LIST);
        for (var i = 0; i < prodList.length; i++) {
          prodList[i].count = prodList[i].num;
          var prodPrice = prodList[i].num * prodList[i].goods.price;
          this.allProdPrice = (parseFloat(this.allProdPrice) + prodPrice).toFixed(2);
          // 推入购物车id
          this.cartIdStr.push(prodList[i].cart_id);
        }
        // console.log(prodList);
        this.prodArr = prodList;
      }
      this.$nextTick(() => {
        this.$refs.loading.showLoad();
        this.$store.dispatch('addressList', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            console.log('get cart list');
          } else {
            this._showTip(res.msg);
          }
        });
      });
    },
    filters: {
      formatDate (area) {
        return area.split(' ').join('-');
      }
    },
    methods: {
      submitBtn () {
        if (!this.addressList[0]) {
          this._showTip('请先填写收货地址');
          return false;
        }
        this.$refs.loading.showLoad();
        // 当前默认地址id
        this.dataOption.address_id = this.addressList[0].id;
        this.dataOption.token = this.memberLogin.token;
        var type = parseInt(this.queryArr.type);
        if (type === 0) {
          this.dataOption.goods_id = this.queryArr.id;
        } else {
          this.dataOption.cart_id = this.cartIdStr.join(',');
          // console.log(this.dataOption.cart_id);
        }
        this.$store.dispatch('buyProdInfo', {data: this.dataOption, type: type}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              // console.log(res.data);
              this.$router.push({name: 'orderpay', query: {order_no: res.data.order_no, order_money: res.data.order_money}});
            } else {
              this._showTip(res.msg);
            }
         });
      },
      openAddress () {
        this.$router.push({name: 'addEdit', query: {id: 'add'}});
      },
      _choosdAdd () {
        console.log(1);
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
  .buy-prod-page{padding-bottom: 3.15rem;}
  .buy-prod-page .header-address{padding: 0.7rem 0.5rem;position: relative;background: #fff;}
  /*.buy-prod-page .header-address:after{}*/
  .buy-prod-page .header-address .inner-msg{background: url(./address_bg.png) no-repeat;background-size: 100% 100%;}
  .buy-prod-page .header-address .inner-msg .one-line{overflow: hidden;padding: 0.4rem 0.6rem;position: relative;}
  .buy-prod-page .header-address .inner-msg .one-line:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .buy-prod-page .header-address .inner-msg .icon-one{float:left;width: 1.4rem;height:1.4rem;background: url(./add_icon_one.png) no-repeat;background-size: 100% 100%;}
  .buy-prod-page .header-address .inner-msg .address{font-size: 0.9rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;margin-top: 0.2rem;}
  .buy-prod-page .header-address .inner-msg .two-line{overflow: hidden;padding: 0.6rem 0.6rem;font-size: 0.9rem;}
  .buy-prod-page .header-address .inner-msg .icon-two{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./address_icon_two.png) no-repeat;background-size: 100% 100%;}
  .buy-prod-page .header-address .inner-msg .icon-three{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./address_icon_three.png) no-repeat;background-size: 100% 100%;}
  .buy-prod-page .header-address .inner-msg span{display: inline-block;vertical-align: middle;}
  .buy-prod-page .prod-list{position: relative;background: #fff;}
  .buy-prod-page .prod-list:before{position: absolute;left: 0;top: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .buy-prod-page .prod-list:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .buy-prod-page .prod-list .order-inner{overflow: hidden;padding: 1rem 1.5rem;}
  .buy-prod-page .prod-list .order-inner .order-img{float:left;width: 5.5rem;height:5.5rem;border:1px solid #eee;}
  .buy-prod-page .prod-list .order-inner .order-img img{display:block;width: 5.5rem;height:5.5rem;}
  .buy-prod-page .prod-list .order-inner .order-right{padding: 0 0 0 6rem;font-size: 1rem;}
  .buy-prod-page .prod-list .order-inner .order-right .name{color:#969696;margin: 0.8rem 0 0.3rem 0;font-size: 0.9rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;height: 1rem;}
  .buy-prod-page .prod-list .order-right .price{color:#333;}
  .buy-prod-page .prod-list .order-inner .order-right .count{color:#969696;text-align: right;font-size: 0.9rem;margin-top:0.3rem;}
  .buy-prod-page .bottom-sub{position: fixed;bottom:0;left:0;width:100%;overflow: hidden;z-index: 110;background: #fff;}
  .buy-prod-page .bottom-sub .right-btn{cursor:pointer;float:right;width:7.5rem;height:3rem;line-height: 3rem;font-size:0.9rem;text-align: center;color:#fff;background: #02bdce;}
  .buy-prod-page .bottom-sub .all-count{padding:0 7.5rem 0 1rem;font-size: 0.9rem;height:3rem;line-height: 3rem;}
</style>


