<template>
  <div class="product-page">
    <input type="hidden" value="" class="prudId" />
    <!-- 头部信息 -->
    <div class="product-header">
      <div class="product-img">
        <img :src="srcLink" alt="">
      </div>
      <div class="product-info">
        <p class="title">{{ prodName }}</p>
        <p class="price">￥<span>{{ prodPrice }}</span></p>
      </div>
    </div>
    <!-- 产品详情 -->
    <div class="product-detail">
      <div class="detail-title">
        <i class="heng"></i><span>详情介绍</span><i class="heng"></i>
      </div>
      <div class="img-all">{{ prodInfo }}
        <!-- <img src="./mdzh_moke_01.png" alt="">
        <img src="./mdzh_moke_01.png" alt="">
        <img src="./mdzh_moke_01.png" alt=""> -->
      </div>
    </div>
    <div class="prod-bottom">
        <span class="submit-btn" style="width:100%;" @click="buyClick()">立即购买</span>
      </div>
  </div>
</template>

<script>
  // 引入session
  import Session from 'common/js/sessionStorage';
  import $ from 'jquery';

  export default {
    data () {
      return {
        srcLink: '',
        prodName: '',
        prodPrice: '', // 价格
        prodInfo: '', // 产品详情
        bombStr: '您确定要退出登录吗？'
      };
    },
    created () {
      var queryArr = this.$route.query;
      var typeArr = ['PROD_ONE_LIST', 'PROD_TWO_LIST', 'PROD_THREE_LIST'];
      // console.log();
      this.$nextTick(() => {
        var item = Session.fetch(typeArr[queryArr.type])[queryArr.id];
        this.srcLink = item.pic;
        this.prodName = item.pro_name;
        this.prodPrice = item.price;
        $('.img-all').html(item.remark);
        // console.log(item);
      });
    },
    methods: {
      buyClick () {
        var queryArr = this.$route.query;
        this.$router.push({name: 'buyPage', query: {type: queryArr.type, id: queryArr.id}});
      }
    }
  };
</script>

<style>
  .product-page{background: #fff;padding-bottom:3rem;}
  .product-header{border-bottom: 0.6rem solid #f4f4f4;}
  .product-page .product-img{width: 100%;border-bottom: 1px solid #dcdbda;}
  .product-page .product-img img{display:block;width: 100%;}
  .product-page .product-info{padding: 1rem 1.5rem;}
  .product-page .product-info .title{color:#000000;font-size: 0.9rem}
  .product-page .product-info .price{margin-top: 0.3rem;color:#e5cba6;font-size: 1rem;}
  .product-page .product-detail .detail-title{text-align: center;padding: 0.8rem 0;font-size: 0.9rem;}
  .product-page .product-detail .detail-title i.heng{display: inline-block;vertical-align: middle;width: 2.5rem;height:2px;background: #000;}
  .product-page .product-detail .detail-title span{display: inline-block;vertical-align: middle;margin: 0 0.8rem;}
  .product-page .product-detail .img-all{width: 100%;font-size: 0.9rem;}
  .product-page .product-detail .img-all img{display:block;width: 100%;height:auto;}
  .prod-bottom{position: fixed;bottom:0;left:0;width:100%;height:3rem;z-index: 110;background: #fff;}
  .prod-bottom:after{position: absolute;left: 0;top: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eee;content: '';-webkit-transform: scaleY(0.5);}
  .prod-bottom span{float:left;width:50%;text-align: center;height:3rem;line-height: 3rem;color:#000;}
  .prod-bottom .submit-btn{background: #000;color:#fad498;}
</style>
