<template>
  <div class="detail-page">
    <div class="detail-show" v-if="showDetail">
      <div class="head-detail">
        <!-- 头部轮播 -->
        <div class="head-slider">
          <swiper :options="swiperOption" ref="mySwiper" class="swiper-wrapper">
            <swiper-slide class="swiper-list" v-for="item in swiperSlides" :key="item.id">
              <img :src="item" alt="" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <!-- 产品详情 -->
        <div class="prod-detail">
          <p class="title">{{ prodDetail.goods_name }}</p>
          <p class="price">￥{{ prodDetail.price }}</p>
          <p class="detail" style="-webkit-box-orient: vertical;">{{ prodDetail.description }}</p>
          <!-- 选择类型 -->
          <div class="type-div border-top-1px border-bottom-1px" @click="_chooseType">
            <p class="has-type" v-if="dataOption.attr_ids">
              <span>已选：</span><span v-for="item in paramsStr" :key="item.id"> "{{ item }}"</span>
            </p>
            <p v-else>
              <span class="left">请选择</span><span class="left" v-for="item in paramsAll" :key="item.id">
              {{ item.type }}</span>
            </p>
          </div>
          <div class="gift-wrapper">
            <div class="head-gift"><i class="gift-icon"></i><span>赠送产品</span></div>
            <!-- 产品横向移动 -->
            <div class="list-gift" ref="prodWrapper">
              <div class="list-wrapper">
                <div class="list-item" :class="item.gift_id === dataOption.gift_id ? 'index' : ''" v-for="item in prodDetail.gifts" :key="item.id" @click="_getGiftId(item.gift_id)">
                  <img :src="item.pic" alt="">
                  <div class="name">{{ item.gift_name }}</div>
                </div>
                <!-- <div class="list-item">
                  <img src="./gift_img_01.png" alt="">
                  <p class="name">大净水器</p>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="shu"><img src="./shu-icon.png" alt=""></div>
      <!-- 产品详情 -->
      <div class="prod-content"></div>
      <!-- 提交按钮 -->
      <div class="submit-btn">
        <div class="inner-btn" @click="_buyBtn">购买</div>
      </div>
    </div>
    <!-- 产品规格layer parameter：参数 -->
    <prod-parameter ref="parameter" v-on:submitMsg="submitParameter" v-on:showTip="_showTip"></prod-parameter>
    <!-- 第一步选择取货方式 -->
    <pickup-type ref="pickup" v-on:submitMsg="submitPickup"></pickup-type>
    <!-- 填写收货地址 -->
    <add-ress ref="address" v-on:showTip="_showTip" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:submitMsg="submitAddress"></add-ress>
    <!-- 支付方式 -->
    <pay ref="paylayer" v-on:showTip="_showTip" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:submitMsg="submitPay"></pay>
    <!-- 快递 -->
    <express ref="express"></express>
    <!-- 自取 -->
    <ziqu ref="ziqu"></ziqu>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import BScroll from 'better-scroll';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import pickupType from 'components/face/setup/pickupType';
  import addRess from 'components/face/setup/address';
  import pay from 'components/face/setup/pay';
  import prodParameter from 'components/face/setup/parameter';
  import express from 'components/face/setup/express';
  import ziqu from 'components/face/setup/ziqu';
  import $ from 'jquery';

  export default {
    data () {
      return {
        name: 'pord-list',
        tipsStr: '',
        showDetail: false, // 等加载完毕数据以后在显示
        swiperOption: {
          autoplay: true,
          loop: true,
          setWrapperSize: true,
          pagination: {
            el: '.swiper-pagination'
          },
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
          on: {
            slideChangeTransitionEnd: () => {
              // console.log(1); // 切换结束时，告诉我现在是第几个slide
              // this.swiper.autoplay.start();
            }
          }
        },
        // swiperSlides: [require('./moke_pic_01.jpg'), require('./moke_pic_01.jpg')]
        swiperSlides: [], // 存放轮播信息的地方
        dataOption: { // 购买时提交的信息
          token: '', // token
          goods_id: '', // 商品id
          gift_id: '', // 礼品id
          attr_ids: '', // 属性id，逗号分割4,4
          is_ship: '', // 是否快递1是0否
          consignee: '', // 收件人
          mobile: '', // 收件人手机号
          area: '', // 地区
          address: '', // 详情地址
          cardNo: '' // 身份证号自提时，需要提交，即is_ship为0
        },
        paramsAll: [], // 存放递归出来的数据
        paramsStr: [] // 存放已经选中的字段
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        memberInfo: state => state.memberInfo,
        prodDetail: state => state.prodDetail
      })
    },
    created () {
      // 当前产品的id
      var prodId = this.$route.query.id;
      // 赋值商品id
      this.dataOption.token = this.memberLogin.token;
      this.dataOption.goods_id = prodId;
      // 等待dom加载完毕后获取产品详情
      this.$nextTick(() => {
        // 获取产品详情
        this._getProdDetail(prodId);
      });
    },
    methods: {
      // 获取产品详情
      _getProdDetail (prodId) {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getPordDetail', {id: prodId, token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            this.showDetail = true;
            this.swiperSlides = res.data.pic;
            // 递归获取
            this._getParamsAll(res.data.attr_web, 0, '', '');
            // alert(JSON.stringify(res.data.pic));
            // console.log(res);
            this.$nextTick(() => {
              $('.prod-content').html(res.data.content);
              $('.list-wrapper').css('width', 5 * this.prodDetail.gifts.length + 'rem');
              // $('.list-wrapper').css('width', 5 * $('.list-item').length + 'rem');
              // 初始化滚动插件
              this.prodScroll = new BScroll(this.$refs.prodWrapper, {
                click: true, // 允许点击事件
                scrollX: true, // 横向滚动
                eventPassthrough: 'vertical'
              });
              // 重新加载
              // this.picScroll.refresh();
            });
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 递归获取类型所有值到相对应的状态数组下
      _getParamsAll (attrArr, count, ids, values) {
        // 递归创建对应类型对象
        if (!this.paramsAll[count]) {
          this.paramsAll[count] = {
            type: attrArr[0].name,
            params: []
          };
        }
        // console.log(count);
        var len = attrArr.length;
        for (var i = 0; i < len; i++) {
          var addVal = values ? values + ',' + attrArr[i].value : attrArr[i].value;
          this.paramsAll[count].params.push({
            id: ids ? ids + ',' + attrArr[i].id : attrArr[i].id,
            name: attrArr[i].name,
            value: attrArr[i].value,
            addVal: addVal,
            img: attrArr[i].img || '',
            price: attrArr[i].price,
            stock: attrArr[i].stock
          });
          if (attrArr[i].version) {
            this._getParamsAll(attrArr[i].version, count + 1, attrArr[i].id, attrArr[i].value);
          }
        }
        // console.log(this.paramsAll);
      },
      // 选择产品规格
      _chooseType () {
        // alert('选择产品规格');
        this.$refs.parameter._showBomb({pic: this.prodDetail.pic[0], params: this.paramsAll, attrIds: this.dataOption.attr_ids});
      },
      // 选择完毕的参数
      submitParameter (option) {
        // console.log(option);
        this.paramsStr = option.valStr.split(',');
        this.dataOption.attr_ids = option.numStr;
      },
      /*
        选择赠送的产品
      */
      _getGiftId (giftId) {
        // alert(giftId);
        this.dataOption.gift_id = giftId;
      },
      // 购买按钮
      _buyBtn () {
        if (this.dataOption.attr_ids === '') { // 判断有没有选择过参数
          this.$refs.parameter._showBomb({pic: this.prodDetail.pic[0], params: this.paramsAll, attrIds: this.dataOption.attr_ids});
        } else if (this.dataOption.gift_id === '') { // 判断有没有选过赠送产品
          this._showTip('请先选择赠送产品');
        } else {
          // alert(1);
          this.$refs.pickup._showBomb();
        }
      },
      // 选完取货方式.是否快递1是0否
      submitPickup (type) {
        type = parseInt(type);
        // alert(JSON.stringify(type));
        this.dataOption.is_ship = type;
        // if (type === 0) { // 自取
        //   alert('自取');
        // } else if (type === 1) { // 快递
        //   alert('快递');
        // }
        // 打开编辑地址信息
        this.$refs.address._showBomb(parseInt(type));
      },
      // 填完快递信息提交订单
      submitAddress (addressOption) {
        // console.log(addressOption);
        this.dataOption.consignee = addressOption.consignee;
        this.dataOption.mobile = addressOption.mobile;
        this.dataOption.area = addressOption.area;
        this.dataOption.address = addressOption.address;
        this.dataOption.cardNo = addressOption.cardNo;
        // console.log(this.dataOption);
        this.showLoad();
        this.$store.dispatch('postOrder', this.dataOption).then(res => {
          // console.log(res);
          this.hideLoad();
          if (res.code === 1) {
            // 关闭收货地址编辑的弹窗
            this.$refs.address._cancelChoose();
            if (this.dataOption.is_ship === 0) { // 自取
              // 获取公司地址联系方式
              this.showLoad();
              this.$store.dispatch('companyAddress', {token: this.memberLogin.token}).then(res => {
                this.hideLoad();
                if (res.code === 1) {
                  this.$refs.ziqu._showBomb({data: res.data, type: 1});
                } else {
                  this._showTip(res.msg);
                }
              });
            } else { // 快递
              // 显示支付layer
              this.$refs.paylayer._showBomb({token: this.memberLogin.token, orderNo: res.data.order_no});
            }
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 支付方式..支付成功会返回到此函数
      submitPay () {
        // 关闭支付方式的弹窗
        this.$refs.paylayer._cancelChoose();
        // alert('支付成功');
        // 是否快递1是0否
        this.$refs.express._showBomb({type: 1});
        // if (parseInt(this.dataOption.is_ship) === 1) { // 快递
        //   this.$refs.express._showBomb({type: 1});
        // } else if (parseInt(this.dataOption.is_ship) === 0) { // 自取
        //   // 获取公司地址联系方式
        //   this.showLoad();
        //   this.$store.dispatch('companyAddress', {token: this.memberLogin.token}).then(res => {
        //     this.hideLoad();
        //     if (res.code === 1) {
        //       this.$refs.ziqu._showBomb({data: res.data, type: 1});
        //     } else {
        //       this._showTip(res.msg);
        //     }
        //   });
        // }
      },
      // 显示加载中...
      showLoad () {
        this.$refs.loading.showLoad();
      },
      // 影藏加载中...
      hideLoad () {
        this.$refs.loading.hideLoad();
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      swiper,
      swiperSlide,
      loading,
      tips,
      prodParameter, // 产品参数layer
      pickupType, // 取货方式layer
      addRess, // 收货地址layer
      pay, // 支付layer
      express, // 快递layer
      ziqu // 自取layer
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .detail-page
    padding: 0.8rem 1rem
    .detail-show
      padding: 0 0 2rem 0
      .head-detail
        border-radius: 5px
        overflow: hidden
        -webkit-box-shadow: 5px 5px 8px #ccc
        .head-slider
          position: relative
          width: 100%
          .swiper-wrapper
            width: 100%
            overflow: hidden
            .swiper-list
              float: left
              border-top-left-radius: 5px
              border-top-right-radius: 5px
              overflow: hidden
              width: 100%
              img
                display: block
                width: 100%
                height: auto
        .prod-detail
          background: #fff
          .title
            padding: 0.8rem 1rem
            font-size: 1rem
            color: #333
          .price
            padding: 0 1rem
            font-size: 1.1rem
            color: #04b9fd
          .detail
            margin: 0.3rem 0
            padding: 0 1rem
            font-size: 0.85rem
            line-height: 0.9rem
            height: 1.8rem
            word-break: break-all;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            overflow: hidden
          .type-div
            position: relative
            overflow: hidden
            padding: 0.9rem 1rem
            font-size: 0.8rem
            color: #666
            background: url(./arrow_right_icon.png) 95% center no-repeat
            background-size: 1rem 1rem
            &.border-top-1px
              border-top-1px(#eee)
            &.border-bottom-1px
              border-bottom-1px(#eee)
          .gift-wrapper
            // padding: 0 1rem
            .head-gift
              padding: 0 1rem
              overflow: hidden
              font-size: 0.9rem
              .gift-icon
                display: inline-block
                vertical-align: middle
                width: 1.6rem
                height: 1.6rem
                background: url(./gift_icon.png) center no-repeat
                background-size: 100% 100%
              span
                margin-left: 0.2rem
                display: inline-block
                vertical-align: middle
                line-height: 1.6rem
                height: 1.6rem
                font-size: 0.8rem
                color: #333
            .list-gift
              width: 100%
              overflow: hidden
              white-space: nowrap
              .list-wrapper
                font-size: 0
                // width: 30rem
                .list-item
                  // float: left
                  display: inline-block
                  padding: 0.4rem 0
                  width: 5rem
                  &.index
                    .name
                      color: #009fe8
                  img
                    display: block
                    width: 4rem
                    height: 4rem
                    margin: auto
                    border-radius: 3px
                  .name
                    padding: 0.3rem 0
                    text-align: center
                    font-size: 0.7rem
                    color: #ccc
      .shu
        padding: 0.3rem 0
        img
          display: block
          width: 100%
          height: auto
    .submit-btn
      position: fixed
      bottom: 0.7rem
      left: 0
      width: 100%
      z-index: 10
      .inner-btn
        width: 86%
        background: #009fe8
        // background: url(../setup/blue_btn.png) center no-repeat
        // background-size: 100% 100%
        margin: auto
        text-align: center
        color: #fff
        border-radius: 5px
        padding: 0.8rem 0
        -webkit-box-shadow: 4px 4px 10px #ccc
        &:active
          -webkit-transition: all 0.2s
          -webkit-transform: scale(1.05, 1.05)
</style>
