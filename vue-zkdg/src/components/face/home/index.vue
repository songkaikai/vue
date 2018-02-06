<template>
	<div class="home-page">
    <!-- 头部轮播 -->
		<div class="head-slider">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-wrapper">
        <swiper-slide class="swiper-list" v-for="(item, index) in swiperSlides">
          <router-link :to="{name: 'prodDetail', query: {id: item.link_id}}">
            <img :src="item.image" alt="" />
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- 报单入口 -->
    <!-- <div class="bd-enter">
      <img src="./bd_img.jpg" alt="" />
    </div> -->

    <!-- 产品列表 -->
    <div class="prod-list" style="margin-top:0.4rem">
      <div class="head-info">
        <i class="line-center"></i><span class="name">产品</span><i class="line-center"></i>
      </div>
      <div class="prod-wrapper">
        <div class="list-item" :class="[index % 2 === 0 ? '' : 'right']" v-for="(item, index) in prodList">
          <router-link :to="{name: 'prodDetail', query: {id: item.id}}">
            <img :src="item.main_pic" alt="">
            <p class="prod-name" style="-webkit-box-orient: vertical;">{{ item.goods_name }}</p>
            <p class="prod-price">￥{{ item.price }}</p>
          </router-link>
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
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';

  export default {
    data () {
      return {
        pageStr: 'shouye',
        tipsStr: '',
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
        swiperSlides: []
      };
    },
    created () {
      this.$nextTick(() => {
        this._getSlideList(); // 获取轮播
        this._getProdList();
        // console.log(this.swiper);
      });
    },
    computed: {
      ...mapState({
        prodList: state => state.prodList
      }),
      swiper () {
        // console.log(this.$refs.mySwiper.swiper);
        return this.$refs.mySwiper.swiper;
      }
    },
    // mounted () {
    //   setInterval(() => {
    //     console.log('simulate async data');
    //     // let swiperSlides = this.swiperSlides;
    //     if (this.swiperSlides.length < 10) this.swiperSlides.push(this.swiperSlides.length + 1);
    //   }, 1000);
    // },
    methods: {
      _getSlideList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('getSlideList').then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            // console.log(res.data);
            var slide = res.data.lunb;
            var len = slide.length;
            for (var i = 0; i < len; i++) {
              this.swiperSlides.push(slide[i]);
            }
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 获取产品列表
      _getProdList () {
        if (this.prodList.length === 0) {
          this.$refs.loading.showLoad();
          this.$store.dispatch('getProdList').then(res => {
            this.$refs.loading.hideLoad();
            if (res.code !== 1) {
              this._showTip(res.msg);
            }
            // if (res.code === 1) {
            //   // console.log('yes');
            // } else {
            //   this._showTip(res.msg);
            // }
          });
        }
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
      swiper,
      swiperSlide,
      loading,
      tips
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .home-page
    padding-bottom: 2.7rem
    background: #f4f4f4
    .head-slider
      position: relative
      width: 100%
      .swiper-wrapper
        width: 100%
        overflow: hidden
        .swiper-list
          float: left
          width: 100%
          img
            display: block
            width: 100%
            height: auto
    .bd-enter
      margin: 0.6rem 0
      width: 100%
      img
        display: block
        width: 100%
        height: auto
    .prod-list
      .head-info
        padding: 0.6rem 0
        text-align: center
        background: #fff
        .line-center
          display: inline-block
          vertical-align: middle
          width: 3rem
          height: 2px 
          background: #02bdce
        .name
          display: inline-block
          vertical-align: middle
          padding: 0 0.8rem
          color: #02bdce
      .prod-wrapper
        overflow: hidden
        .list-item
          float: left
          width: 49.3%
          margin-bottom: 0.3rem
          background: #fff
          &.right
            float: right
          a
            display: block
            img
              display: block
              width: 100%
              height: auto
            .prod-name
              margin: 0.3rem 0
              padding: 0 0.4rem
              font-size: 0.85rem
              line-height: 0.9rem
              height: 1.8rem
              word-break: break-all;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              overflow: hidden
            .prod-price
              padding: 0.1rem 0.4rem 0.3rem 0.4rem
              font-size: 1rem
              color: #4fccdb
</style>
