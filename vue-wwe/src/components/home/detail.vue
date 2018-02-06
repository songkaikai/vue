<template>
  <div class="detail">
    <div class="detail-msg" v-show="detailShow">
      <div class="head">
        <img :src="detail.picture_detail" alt="">
      </div>
      <div class="main">
        <div class="heart" @click="_changeAdd(detail.id)">
          <i class="icon-heart" :class="detail.like ? 'red' : ''"></i>
        </div>
        <p class="name">姓名: {{ detail.name }}</p>
        <p class="title" v-if="detail.title !== 'none'">头衔：{{ detail.title }}</p>
        <p class="desc">描述: {{ detail.detail }}</p>
      </div>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  // 引入session一次会话存储
  import Session from 'common/js/sessionStorage';
  // 引入loading组件
  import loading from '@/components/plugin/loading';

  const SUPERSTARLIST = 'super_star_list';

  export default {
    data () {
      return {
        detail: [],
        detailShow: false
      };
    },
    created () {
      var list = Session.fetch(SUPERSTARLIST);
      this.detail = list[parseInt(this.$route.params.id)];
      this.$nextTick(() => {
        // 模拟加载
        this.$refs.loading.showLoad();
        setTimeout(() => {
          this.$refs.loading.hideLoad();
          this.detailShow = true;
        }, 300);
      });
    },
    methods: {
      _changeAdd (id) {
        this.$store.dispatch('changeAdd', id).then(() => {
          this.detail.like = !this.detail.like;
        });
      }
    },
    components: {
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';

  .detail
    img
      display: block
      width: 100%
      height: auto
    .main
      position: relative
      padding: 15px
      font-size: 18px
      line-height: 20px
      color: #666
      .heart
        position: absolute
        top: -5px
        right: 5px
        padding: 20px
        .red
          color: #e4393c
      .name
        padding-bottom: 15px 
        color: #333
      .title
        padding-bottom: 10px
        font-size: 16px
      .desc
        font-size: 14px
</style>
