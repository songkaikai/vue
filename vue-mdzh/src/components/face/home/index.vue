<template>
  <div class="home-page">
    <!-- <div class="head-lunbo">
      <img src="./mdzh_moke_01.png" alt="">
    </div> -->
    <div class="prod-wrapper">
      <div class="product-wrapper" style="border-bottom:0.6rem solid #f4f4f4;" v-if="prodListOne.length > 0">
        <p class="prod-title"><i class="small-type-one"></i><span>人气网红</span></p>
        <div class="prod-inner">
          <div class="prod-detail border-right-1px" style="width:100%;" v-for="(item, index) in prodListOne">
            <div class="prod-img" @click="openProd(0, index)"><img :src="[ item.pic ]" alt=""></div>
            <div class="buy-type"><img src="./mdzh_type_1.png" alt=""></div>
            <div class="right-buy" @click="buyClick(0, index)">立即购买</div>
            <div class="left-msg">
              <p class="detail">{{ item.pro_name }}</p>
              <p class="price">￥{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="product-wrapper" style="border-bottom:0.6rem solid #f4f4f4;" v-if="prodListTwo.length > 0">
        <p class="prod-title"><i class="small-type-two"></i><span>风云大咖</span></p>
        <div class="prod-inner">
          <div class="prod-detail border-right-1px" style="width:100%;" v-for="(item, index) in prodListTwo">
            <div class="prod-img" @click="openProd(1, index)"><img :src="[ item.pic ]" alt=""></div>
            <div class="buy-type"><img src="./mdzh_type_2.png" alt=""></div>
            <div class="right-buy" @click="buyClick(1, index)">立即购买</div>
            <div class="left-msg">
              <p class="detail">{{ item.pro_name }}</p>
              <p class="price">￥{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="product-wrapper" style="border-bottom:0.6rem solid #f4f4f4;" v-if="prodListThree.length > 0">
        <p class="prod-title"><i class="small-type-two"></i><span>工作室</span></p>
        <div class="prod-inner">
          <div class="prod-detail border-right-1px" style="width:100%;" v-for="(item, index) in prodListThree">
            <div class="prod-img" @click="openProd(2, index)"><img :src="[ item.pic ]" alt=""></div>
            <div class="buy-type"><img class="lang" src="./mdzh_type_3.png" alt=""></div>
            <div class="right-buy" @click="buyClick(2, index)">立即购买</div>
            <div class="left-msg">
              <p class="detail">{{ item.pro_name }}</p>
              <p class="price">￥{{ item.price }}</p>
            </div>
          </div>
        </div>
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
  import Local from 'common/js/localStorage';
  // 要会议存储的字段key
  const MEMBER_LOGIN = 'member_login';

  export default {
    data () {
      return {
        tipsStr: '',
        // 清除定时器时需要的
        timeStep: null
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取商品列表
      prodListOne: state => state.prodListOne,
      prodListTwo: state => state.prodListTwo,
      prodListThree: state => state.prodListThree
    }),
    created () {
      // 验证token有没有过期
      this._timeStemp();
      this.$nextTick(() => {
        this.$refs.loading.showLoad();
        this.$store.dispatch('prodList', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 401) {
             this._showTip('请重新登录');
           }
        });
      });
    },
    methods: {
      // 验证token有没有过期
      _timeStemp () {
        // console.log(1);
        if (!Local.fetch(MEMBER_LOGIN)) {
          // console.log(1);
          // 清除定时器
          this.timeStep = null;
          this.$router.replace({name: 'login'});
        }
        this.timeStep = setTimeout(() => {
          this._timeStemp();
        }, 500);
      },
      openProd (type, id) {
        // console.log(link);
        this.$router.push({name: 'prodDetail', query: {type, id}});
      },
      buyClick (type, id) { // 立即购买
        this.$router.push({name: 'buyPage', query: {type, id}});
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
	/* 产品 */
    .home-page{padding-bottom: 3.15rem;}
    .home-page .head-lunbo{width: 100%;}
    .home-page .head-lunbo img{display:block;height:auto;width: 100%;}
    /*.home-page .prod-wrapper{margin-top: 0.7rem;background: #fff;}*/
    .home-page .prod-wrapper .prod-title{text-align: center;padding: 0.8rem 0;height:1.4rem;line-height:1.4rem;}
    .home-page .prod-wrapper .prod-title .small-type-one{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./small_icon_one.png) no-repeat;background-size: 100% 100%;}
    .home-page .prod-wrapper .prod-title .small-type-two{display: inline-block;vertical-align: middle;width: 1.4rem;height:1.4rem;background: url(./small_icon_two.png) no-repeat;background-size: 100% 100%;}
    .home-page .prod-wrapper .prod-title span{display: inline-block;vertical-align: middle;font-size: 1rem;margin: 0 0.8rem;color:#e5cba6;}
    .home-page .prod-wrapper .prod-title .shu{display: inline-block;vertical-align: middle;width:4rem;height:1px;background:#e5cba6; }
    .home-page .prod-wrapper .prod-inner{overflow: hidden;position: relative;}
    .home-page .prod-wrapper .prod-inner:before{position: absolute;left: 0;top: 0;width: 100%;z-index: 1;border-bottom: 1px solid #ebd0a8;content: '';-webkit-transform: scaleY(0.5);}
    /*.home-page .prod-wrapper .prod-inner:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #ebd0a8;content: '';-webkit-transform: scaleY(0.5);}*/
    .home-page .prod-wrapper .prod-inner .prod-detail{float:left;width:49.4%;position: relative;display: block;overflow: hidden;}
    .home-page .prod-wrapper .prod-inner .prod-detail.right{float:right;}
    /*.home-page .prod-wrapper .prod-inner .prod-detail.border-right-1px:before{position: absolute;right: 0;bottom: 0;height: 100%;z-index: 1;width:1px;background:#ebd0a8;content: '';-webkit-transform: scaleX(0.5);}*/
    /*.home-page .prod-wrapper .prod-inner .prod-detail.border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;height:1px;background:#ebd0a8;content: '';-webkit-transform: scaleY(0.5);}*/
    .home-page .prod-wrapper .prod-inner .prod-detail .prod-img{width: 100%;float:left;}
    .home-page .prod-wrapper .prod-inner .prod-detail .prod-img img{display:block;width: 100%;height:auto;}
    .home-page .prod-wrapper .prod-inner .prod-detail p{}
    .home-page .prod-wrapper .prod-inner .prod-detail .price{color: #e5cba6;font-size: 1.1rem;padding: 0.2rem 0.5rem;padding-bottom:0.4rem;}
    .home-page .prod-wrapper .prod-inner .prod-detail .detail{color:#969696;font-size: 0.8rem;padding: 0.2rem 0.5rem;padding-top:0.4rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
    .home-page .prod-wrapper .prod-inner .prod-detail .right-buy{float:right;width: 40%;background: #302f34;color:#fff;font-size: 0.9rem;height:3.1rem;line-height: 3.1rem;text-align: center;}
    .home-page .prod-wrapper .prod-inner .prod-detail .left-msg{float:left;width: 60%;}
    .home-page .prod-wrapper .prod-inner .prod-detail .buy-type{float:left;width: 92%;padding: 0.4rem 4%;}
    .home-page .prod-wrapper .prod-inner .prod-detail .buy-type img{display: inline-block;width: 7rem;height:auto;}
    .home-page .prod-wrapper .prod-inner .prod-detail .buy-type img.lang{width: 12rem;}
    .other-img{width: 100%;}
    .other-img img{width: 100%;height: auto;display: block;}
</style>
