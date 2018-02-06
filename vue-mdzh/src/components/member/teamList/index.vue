<template>
  <div class="team-list-page">
    <div class="inner-wrapper">
      <div class="list-item" v-for="(item, index) in jfAllList">
        <p class="one-list"><span class="left">{{ item.remark }}</span><span class="right red">{{ item.in }}</span></p>
        <p class="two-list"><span class="left">{{ item.add_time }}</span></p>
      </div>
    </div>
    <!-- 没有数据时显示 -->
    <div id="none-list-msg" v-show="showNoneMsg">暂无记录</div>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import $ from 'jquery';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  export default {
    data () {
      return {
        tipsStr: '',
        winHei: 0, // window的高度
        loadingShow: false, // 加载中是否显示
        getAgain: true, // 是否再次获取
        showLists: false, // 列表是否显示
        showNoneMsg: false,
        dataOption: {
          token: '', // 会员TOKEN
          logType: '5', // 日志类型默认所有1直推奖,2挖宝收益,3教育基金,4商城业绩,5区域收益
          pages: 1,
          pageSize: 15
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      memberInfo: state => state.memberInfo,
      // 日志列表
      jfAllList: state => state.jfAllList
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
          if (res.code === 200) {
            if (res.data.items.length === 0) {
              this.showNoneMsg = true;
            }
            if (res.data.items.length > 0) {
              this.showLists = true;
            }
            // console.log(res.data.length < this.dataOption.pagesize);
            if (res.data.items.length < this.dataOption.pageSize) {
              this.getAgain = false;
            } else {
              this.getAgain = true;
            }
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
      _subList () {
        // alert(this.dataOption);
        this.dataOption.token = this.memberLogin.token;
        return this.$store.dispatch('jfAllList', this.dataOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.team-list-page').height());
          if (targetHei - currTop <= this.winHei) {
            this.loadingShow = true;
            this.getAgain = false;
            this.dataOption.pages += 1;
            this._subList().then(res => {
              this.loadingShow = false;
              // console.log(res.data.lists);
              if (res.data.items.length < this.dataOption.pageSize) {
                this.getAgain = false;
              } else {
                this.getAgain = true;
              }
            });
          }
        }
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
  .team-list-page .inner-wrapper .list-item{padding: 0.8rem 1rem;font-size: 0.9rem;position: relative;background: #fff;}
  .team-list-page .inner-wrapper .list-item:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #b5b5b5;content: '';-webkit-transform: scaleY(0.5);}
  .team-list-page .inner-wrapper .list-item .one-list{margin-bottom:0.4rem;overflow: hidden;}
  .team-list-page .inner-wrapper .list-item .one-list .left{float:left;}
  .team-list-page .inner-wrapper .list-item .one-list .right{float:right;}
  .team-list-page .inner-wrapper .list-item .one-list .right.red{color:#cb0808;}
  .team-list-page .inner-wrapper .list-item .one-list .right.green{color:#61b022;}
  .team-list-page .inner-wrapper .list-item .two-list{color:#b5b3b3;overflow: hidden;color:#b5b3b3;}
  .team-list-page .inner-wrapper .list-item .two-list .left{float:left;}
  .team-list-page .inner-wrapper .list-item .two-list .right{float:right;}
</style>
