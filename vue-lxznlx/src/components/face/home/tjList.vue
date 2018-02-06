<template>
  <div class="tjlist-page" ref="tjlist" v-scroll="_addList">
    <div v-if="showLists">
      <!-- <div class="list-item border-bottom-1px" v-for="(item, index) in 20">
        <p class="desc">
          <span class="phone">13874878787</span>
          <span class="count">20%</span>
        </p>
        <p class="name" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">大叔</p>
      </div>
    </div> -->
     <div class="list-item border-bottom-1px" v-for="(item, index) in gwjtCountList">
        <p class="desc">
          <span class="phone">{{ item.add_date }}</span>
          <span class="count">{{ item.type === 1 ? '-' + item.out : '+' + item.in }}</span>
        </p>
        <p class="name" style="text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.desc }}</p>
      </div>
    </div>
    <!-- 没有数据时显示 -->
    <div class="none-msg-wrapper" v-else>
      <div class="none-msg">
        <i class="none-msg-icon"></i>
        <p class="desc">暂无记录</p>
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
  import $ from 'jquery';

  export default {
    data () {
      return {
         tipsStr: '', // 错误提示
         listOption: {
            token: '', // 会员TOKEN
            type: '6', // 日志类型1静态收益2分享收益3共享收益6岗位津贴
            pages: 1, // 当前页
            pageSize: 20 // 每页显示数量
         }, // 各个记录提交的参数
         winHei: 0, // window的高度
         loadingShow: false, // 加载中是否显示
         getAgain: true, // 是否再次获取
         chooseAgain: false,
         showLists: false // 列表是否显示
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 岗位津贴列表日志
      gwjtCountList: state => state.gwjtCountList
    }),
    created () {
      // 获取window的高度
      this.winHei = window.screen.height;
      this.$nextTick(() => {
        this._getList();
      });
    },
    methods: {
      // 获取提现记录
      _getList () {
        this.$refs.loading.showLoad();
        this._subList().then(res => {
          this.$refs.loading.hideLoad();
          if (res.data.lists.length > 0) {
            this.showLists = true;
          }
          setTimeout(() => {
            this.chooseAgain = true;
          }, 500);
          // console.log(res.data.length < this.dataOption.pagesize);
          if (res.data.lists.length < this.listOption.pageSize) {
            this.getAgain = false;
          }
        });
      },
      _subList () {
        this.listOption.token = this.memberLogin.token;
        return this.$store.dispatch('logCountList', this.listOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.tjlist-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.listOption.pages += 1;
            this._subList().then(res => {
              this.loadingShow = false;
              // console.log(res.data.lists);
              if (res.data.lists.length === this.listOption.pageSize) {
                this.getAgain = true;
              }
            });
          }
        }
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
  
  .tjlist-page
    .none-msg-wrapper
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: #fff
      .none-msg
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        margin: auto
        width: 8rem
        height: 6rem
        text-align: center
        color: #cacaca
        font-size: 0.8rem
        i
          display: inline-block
          width: 3rem
          height: 3rem
          background: url(./no_msg_icon.png) center no-repeat
          background-size: 100% 100%
    .list-item
      padding: 0.5rem 0.8rem
      position: relative
      background: #fff
      font-size: 0.9rem
      &.border-bottom-1px
        border-bottom-1px(#f6f6f6)
      .name
        max-height: 2rem
        line-height: 1rem
        font-size: 0.9rem
        overflow: hidden
        color: #666
      .desc
        margin-bottom: 0.4rem
        overflow: hidden
        .phone
          float: left
          color: #282828
        .count
          float: right
          color: #fe772a
</style>
