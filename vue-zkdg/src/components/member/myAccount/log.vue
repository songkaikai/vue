<template>
  <div class="withdraw-log-page" v-scroll="_addList">
    <div class="log-wrapper">
      <!-- 日志列表 -->
      <div class="log-inner" v-if="showList">
        <div class="list-item border-bottom-1px" v-for="(item, index) in withdrawLogList">
          <p><span class="left">{{ item.add_time }}</span><span class="right">{{ withdrawStatus[item.status] }}</span></p>
          <p><span class="left">{{ withdrawType[item.type] }}</span><span class="right">{{ item.draw_money }}</span></p>
        </div>
      </div>
      <!--  -->
      <div id="none-list-msg" v-else>暂无日志</div>
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
        pageStr: 'log',
        tipsStr: '',
        withdrawType: ['', '支付宝', '微信'],
        withdrawStatus: ['申请中', '已同意', '已拒绝'],
        dataOption: {
          token: '',
          pagesize: 40,
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
        withdrawLogList: state => state.withdrawLogList
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
            var listLen = res.data.lists.length;
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
        return this.$store.dispatch('withdrawLogList', {data: this.dataOption, type});
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
          var targetHei = parseInt($('.withdraw-log-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.getAgain = false;
            this.dataOption.page += 1;
            this.$refs.loading.showLoad();
            this._getSubList(2).then(res => {
              this.$refs.loading.hideLoad();
              // console.log(res.data.lists);
              if (res.data.lists.length === this.dataOption.pagesize) {
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

  .withdraw-log-page
    .list-item
      position: relative
      &.border-bottom-1px
        border-bottom-1px(#eee)
      p
        padding: 0.5rem 0.8rem
        font-size: 0.9rem
        overflow: hidden
        .left
          float: left
        .right
          float: right
        .red
          color: #e4393c
</style>
