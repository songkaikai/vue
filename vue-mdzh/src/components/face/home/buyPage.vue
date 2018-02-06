<template>
  <div class="buy-prod-page">
      <!-- 头部显示的地址 -->
      <div class="header-address" style="height:5rem;">
        <div class="no-address" @click="openAddress()" style="text-align:center;height:5rem;line-height:5rem;font-size:1rem;"  v-if="!addressList[0]">
          +添加收货地址
        </div>
        <div class="inner-msg" v-if="addressList[0]" @click="_choosdAdd()">
          <div class="one-line">
            <i class="icon-one"></i>
            <p class="address">{{ addressList[chooseIndex].area_name | formatDate }} {{ addressList[chooseIndex].address }}</p>
          </div>
          <div class="two-line">
            <i class="icon-two"></i><span>{{ addressList[chooseIndex].mobile }}</span><i class="icon-three"></i><span>{{ addressList[chooseIndex].consignee }}</span>
          </div>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="prod-list">
        <div class="order-inner">
          <div class="order-img"><img :src="srcLink" alt=""></div>
          <div class="order-right">
            <p class="name">{{ prodName }}</p>
            <p class="price">￥{{ prodPrice }}</p>
            <p class="count">数量：1</p>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottom-sub">
        <span class="right-btn" @click="submitBtn()">提交</span>
        <div class="all-count">实付：￥<span>{{ prodPrice }}</span></div>
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
          productId: '', // 产品id
          addressId: '' // 地址ID
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取地址列表
      addressList: state => state.addressList
    }),
    created () {
      var queryArr = this.$route.query;
      var typeArr = ['PROD_ONE_LIST', 'PROD_TWO_LIST', 'PROD_THREE_LIST'];
      // console.log();
      this.$nextTick(() => {
        var item = Session.fetch(typeArr[queryArr.type])[queryArr.id];
        this.srcLink = item.pic;
        this.prodName = item.pro_name;
        this.prodPrice = item.price;
        this.dataOption.productId = item.id;
        // console.log(item);
        this.$nextTick(() => {
          this.$refs.loading.showLoad();
          this.$store.dispatch('addressList', {token: this.memberLogin.token}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 200) {
              console.log(1);
            } else if (res.code === 401) {
              this._showTip('请重新登录');
            }
          });
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
        this.dataOption.addressId = this.addressList[0].id;
        this.dataOption.token = this.memberLogin.token;
        this.$store.dispatch('buyProdInfo', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 200) {
              this.$router.push({name: 'payChoose'});
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
  .buy-prod-page .header-address{padding: 0.7rem 0.5rem;position: relative;}
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
  .buy-prod-page .prod-list{position: relative;}
  .buy-prod-page .prod-list:before{position: absolute;left: 0;top: 0;width: 100%;z-index: 1;border-bottom: 1px solid #e4cca6;content: '';-webkit-transform: scaleY(0.5);}
  .buy-prod-page .prod-list:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #e4cca6;content: '';-webkit-transform: scaleY(0.5);}
  .buy-prod-page .prod-list .order-inner{overflow: hidden;padding: 1rem 1.5rem;}
  .buy-prod-page .prod-list .order-inner .order-img{float:left;width: 5.5rem;height:5.5rem;border:1px solid #eee;}
  .buy-prod-page .prod-list .order-inner .order-img img{display:block;width: 5.5rem;height:5.5rem;}
  .buy-prod-page .prod-list .order-inner .order-right{padding: 0 0 0 6rem;font-size: 1rem;}
  .buy-prod-page .prod-list .order-inner .order-right .name{color:#969696;margin: 0.8rem 0 0.3rem 0;font-size: 0.9rem;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;height: 1rem;}
  .buy-prod-page .prod-list .order-right .price{color:#e5cba6;}
  .buy-prod-page .prod-list .order-inner .order-right .count{color:#969696;text-align: right;font-size: 0.9rem;margin-top:0.3rem;}
  .buy-prod-page .bottom-sub{position: fixed;bottom:0;left:0;width:100%;overflow: hidden;z-index: 110;}
  .buy-prod-page .bottom-sub .right-btn{cursor:pointer;float:right;width:7.5rem;height:3rem;line-height: 3rem;font-size:0.9rem;text-align: center;color:#f8d488;background: #000;}
  .buy-prod-page .bottom-sub .all-count{padding:0 7.5rem 0 1rem;font-size: 0.9rem;height:3rem;line-height: 3rem;background: #f4f4f4;}
</style>
