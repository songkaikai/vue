<template>
  <div class="cbarea-page">
    <div class="list-wrapper">
      <div class="list-item border-bottom-1px" v-for="(item, index) in publicList">
        <span class="left-type" :class="[item.is_first === 1 ? 'index' : '']"></span>
        <div class="right-info">
          <p class="title">
            <i class="index"></i><span class="left-msg">{{ item.layer }} - {{ item.col }}</span>
          </p>
          <p class="other">
            <!-- <span class="left-msg">2017-08-19 12:35:19</span>
            <span class="right-msg">挖宝收益: {{ item.send_money }}Q蛋</span> -->
            <span class="left-msg">挖宝收益: {{ item.send_money }}Q蛋</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 没有数据时显示 -->
    <div id="none-list-msg" v-show="showNoneMsg">暂无订单</div>
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
      // 藏宝位
      publicList: state => state.publicList
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
        return this.$store.dispatch('publicList', this.dataOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.cbarea-page').height());
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
  .cbarea-page .list-wrapper .list-item{overflow: hidden;padding: 1rem 0.8rem;position: relative;}
  .cbarea-page .list-wrapper .list-item.border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eeeeee;content: '';-webkit-transform: scaleY(0.5);}
  .cbarea-page .list-wrapper .list-item .left-type{float:left;width: 2.5rem;height:2.5rem;background: url(./cang_bao.png) no-repeat;background-size: 100% 100%;}
  .cbarea-page .list-wrapper .list-item .left-type.index{background: url(./cang_bao_index.png) no-repeat;background-size: 100% 100%;}
  .cbarea-page .list-wrapper .list-item .right-info{padding: 0 0 0 3rem;}
  .cbarea-page .list-wrapper .list-item .right-info .title{overflow: hidden;font-size: 1rem;}
  .cbarea-page .list-wrapper .list-item .right-info .title i{float:left;width:1.3rem;height:1.3rem;background: url(./pu_icon.png) no-repeat;background-size: 100% 100%;}
  .cbarea-page .list-wrapper .list-item .right-info .title i.index{background: url(./te_icon.png) no-repeat;background-size: 100% 100%;}
  .cbarea-page .list-wrapper .list-item .right-info .title .left-msg{float:left;height:1.3rem;line-height: 1.3rem;color:#010101;}
  .cbarea-page .list-wrapper .list-item .right-info .title .right-msg{float:right;height:1.3rem;line-height: 1.3rem;color:#cb0808;}
  .cbarea-page .list-wrapper .list-item .right-info .other{overflow: hidden;font-size: 0.8rem;margin-top: 0.3rem;color:#b5b3b3;}
  .cbarea-page .list-wrapper .list-item .right-info .other .left-msg{float: left;}
  .cbarea-page .list-wrapper .list-item .right-info .other .right-msg{float:right;}
</style>
