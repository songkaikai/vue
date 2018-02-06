<template>
  <div class="moneyDetail">
    <div class="detail-wrapper">
      <div class="order-title"></div>
      <div class="list-wrapper">
        <div class="head-list">
          <ul class="head-ul">
            <li>
              <p class="title">A网见点奖</p>
              <p class="count">￥{{ moneyDetailList[2] ? moneyDetailList[2] : 0 }}</p>
            </li>
            <li>
              <p class="title">B网见点奖</p>
              <p class="count">￥{{ moneyDetailList[8] ? moneyDetailList[8] : 0 }}</p>
            </li>
          </ul>
        </div>
        <ul class="other-ul">
          <li>
            <p class="title">分销收益</p>
            <p class="count">￥{{ moneyDetailList[5] ? moneyDetailList[5] : 0 }}</p>
          </li>
          <li>
            <p class="title">轰炸奖</p>
            <p class="count">￥{{ moneyDetailList[6] ? moneyDetailList[6] : 0 }}</p>
          </li>
          <li>
            <p class="title">领导奖</p>
            <p class="count">￥{{ moneyDetailList[7] ? moneyDetailList[7] : 0 }}</p>
          </li>
        </ul>
        <ul class="other-ul">
          <li>
            <p class="title">推荐奖</p>
            <p class="count">￥{{ moneyDetailList[1] ? moneyDetailList[1] : 0 }}</p>
          </li>
          <li>
            <p class="title">中奖</p>
            <p class="count">￥{{ moneyDetailList[3] ? moneyDetailList[3] : 0 }}</p>
          </li>
          <li>
            <p class="title">静态分红</p>
            <p class="count">￥{{ moneyDetailList[4] ? moneyDetailList[4] : 0 }}</p>
          </li>
        </ul>
      </div>
      <router-link :to="{name: 'index'}" class="return-icon"></router-link>
    </div>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        cc: 0
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户收益详情
      moneyDetailList: state => state.moneyDetailList
    }),
    created () {
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      _getList () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('moneyDetailList', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
        });
      }
    },
    components: {
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .moneyDetail
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      background: url(../assets/xz_bg.jpg) no-repeat
      background-size: 100% 100%
      .detail-wrapper
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        width: 13rem
        height: 20rem
        padding: 1.2rem 1.5rem 2rem 1.5rem
        margin: auto
        background: url(../assets/shade_bg.png) no-repeat
        background-size: 100% 100%
        .order-title
          width: 6rem
          height: 2rem
          margin: auto
          margin-bottom: 0.3rem
          background: url(../assets/shouyi_title.png) no-repeat
          background-size: 100% 100%
        .return-icon
            position: absolute
            bottom: -3rem
            left: 50%
            width: 5rem
            height: 2.2rem
            margin-left: -2.5rem
            background: url(../assets/return_icon_btn.png) no-repeat
            background-size: 100% 100%
        .other-ul
          margin: 1rem 0
          overflow: hidden
          li
            float: left
            width: 33.3%
            color: #fff
            font-size: 0.9rem
            text-align: center
            p
              padding: 0.2rem 0
            .count
              font-size: 0.75rem
        .head-list
          margin-top: 1rem
          padding-bottom: 1rem
          border-bottom: 1px dashed #fff
          .head-ul
            overflow: hidden
            li
              float: left
              width: 50%
              text-align: center
              color: #fff
              font-size:  1rem
              p
                padding: 0.8rem 0 0.2rem 0
              .count
                font-size: 0.9rem
                color: #f5b620
</style>
