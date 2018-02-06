<template>
  <div class="team-page" v-scroll="_addList">
  	<div class="team-info border-bottom-1px" v-if="showList">
      <p class="title">团队业绩：<span>￥{{ teamList.team }}</span></p>
      <p class="other">我分享的人数：<span>{{ teamList.recomm_count }}人</span></p>
      <p class="other">我的团队人数：<span>{{ teamList.team_num }}人</span></p>
    </div>
    <div class="team-all-wrapper" style="padding-top:6.3rem;">
      <div class="team-wrapper" v-if="showList">
        <div class="list-item border-bottom-1px" v-for="(item, index) in teamList.offline.lists">
          <div class="left-img"><img :src="item.avatar || defaultAvatar" alt=""></div>
          <div class="right-msg" :class="item.level > 0 ? 'red': ''">
            <p>名字：{{ item.nick_name }}</p>
            <p>订单消费：￥{{ item.consum }}</p>
            <p>分享数：{{ item.recomm_count }}人</p>
            <!-- <p>团队数：10人</p> -->
          </div>
        </div>  
      </div>
      <!--  -->
      <div id="none-list-msg" v-else>暂无团队单列表</div>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
        pageStr: 'team',
        defaultAvatar: require('./default_head_img.png'),
        tipsStr: '',
        dataOption: {
          token: '',
          pagesize: 20,
          page: 1
        },
        winHei: 0, // window的高度
        chooseAgain: true,
        getAgain: true, // 是否再次获取
        showList: false // 列表是否有数据
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        teamList: state => state.teamList
      })
    },
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.dataOption.token = this.memberLogin.token;
      this.$nextTick(() => {
        this.$refs.loading.showLoad();
        this._getList(1).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) {
            var listLen = res.data.offline.lists.length;
            if (listLen !== parseInt(this.dataOption.pagesize)) {
              // console.log(1);
              // 如果获取到的数量少于要获取的数量，禁止滚动底部加载
              this.chooseAgain = false;
            }
            if (listLen === 0) {
              this.showList = false;
            } else {
              this.showList = true;
            }
          } else {
            this._showTip(res.msg);
          }
        });
      });
    },
    methods: {
      _getList (type) {
        return this.$store.dispatch('teamList', {data: this.dataOption, type});
      },
      // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          // 但是发现document.body.scrollTop一直是0。
          // 查资料发现是DTD的问题。
          // 页面指定了DTD，即指定了DOCTYPE时，使用document.documentElement。
          // 页面没有DTD，即没指定DOCTYPE时，使用document.body。
          var currTop = document.body.scrollTop;
          // var currTop = document.documentElement.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.team-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.getAgain = false;
            this.dataOption.page += 1;
            this.$refs.loading.showLoad();
            this._getSubList(2).then(res => {
              this.$refs.loading.hideLoad();
              // console.log(res.data.lists);
              if (res.data.offline.lists.length === this.dataOption.pagesize) {
                this.getAgain = true;
              }
            });
          }
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";

  .team-page
    .team-info
      position: fixed
      left: 0
      top: 0
      width: 100%
      background: #fff
      padding: 1rem 0
      text-align: center
      font-size: 0.8rem
      border-bottom-1px(#eee)
      .title
        padding: 0.6rem 0
        font-size: 0.95rem
      .other
        padding: 0.15rem 0
    .team-wrapper
      .list-item
        position: relative
        padding: 0.5rem 1rem
        background: #fff
        overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#eee)
        .left-img
          float: left
          width: 4rem
          height: 4rem
          img
            display: block
            width: 100%
            height: 100%
        .right-msg
          padding: 0 0 0 4.8rem
          font-size: 0.8rem
          &.red
            color: red
          p
            padding: 0.1rem 0
</style>
