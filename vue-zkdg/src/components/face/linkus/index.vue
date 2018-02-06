<template>
  <div class="linkus-page">
    <!-- 关于我们内容 -->
    <div class="about-wrapper"></div>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        pageStr: 'linkus',
        tipsStr: ''
      };
    },
    computed: {
      ...mapState({
        linkus: state => state.linkus
      })
    },
    created () {
      this.$nextTick(() => {
        this._getDetail();
      });
    },
    methods: {
      // 获取产品列表
      _getDetail () {
        // console.log(this.aboutus);
        if (!this.linkus.value) {
          this.$refs.loading.showLoad();
          this.$store.dispatch('getAboutDetail', {type: 0}).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 1) {
              // console.log('yes');
              $('.about-wrapper').html(res.data.value);
            } else {
              this._showTip(res.msg);
            }
          });
        } else {
          $('.about-wrapper').html(this.linkus.value);
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
      loading,
      tips
    }
  };
</script>

<style></style>
