<template>
  <div class="announcement-page">
    <p class="title">{{ helpArticalDetail.title }}</p>
    <p class="date">{{ helpArticalDetail.created_at }}</p>
    <div class="content-wrapper">
      <!-- <p class="to-pass">尊敬的深蓝家人：</p> -->
      <div class="content"></div>
      <!-- <p class="end-pass">盱眙龙虾运营中心</p> -->
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        tipsStr: '',
        param: ''
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 帮助中心-获取文章类别
      helpArticalDetail: state => state.helpArticalDetail
    }),
    created () {
      // this.dataOption.recommender = this.$route.query.uname;
      this.param = this.$route.params.id;
      this.$nextTick(() => {
        this.getDetail();
      });
    },
    methods: {
      getDetail () {
        this.$refs.loading.showLoad();
        this.$store.dispatch('helpArticalDetail', {token: this.memberLogin.token, newsId: this.param}).then(res => {
          this.$refs.loading.hideLoad();
          if (!res.data.code) {
            $('.content').html(this.helpArticalDetail.cnt);
          } else {
            this._showTip('请重新获取');
          }
        });
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .announcement-page
    // position: fixed
    // top: 0
    // left: 0
    // right: 0
    // bottom: 0
    // background: #fff
    .title
      padding: 1.6rem 0 0.6rem 0
      text-align: center
      font-size: 1rem
      color: #3c3c3c
    .date
      padding-bottom: 2rem
      text-align: center
      font-size: 0.8rem
      color: #969696
    .content-wrapper
      padding: 0 1.6rem
      font-size: 0.8rem
      color: #1e1e1e
      .content
        margin: 1.3rem 0
        line-height: 0.9rem
      .end-pass
        text-align: right
</style>
