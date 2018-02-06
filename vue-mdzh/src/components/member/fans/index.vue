<template>
  <div class="fans-list-page" v-scroll="_addList">
    <div class="list-item border-bottom-1px" v-for="(item, index) in fansList">
      <span class="left">{{ item.member_id }}</span>
      <span class="right">{{ typeArr[item.level] }}</span>
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
        typeArr: ['', '网红店', '大咖店', '工作室'],
        tipsStr: '',
        winHei: 0, // window的高度
        loadingShow: false, // 加载中是否显示
        getAgain: true, // 是否再次获取
        showLists: false, // 列表是否显示
        showNoneMsg: false,
        dataOption: {
          token: '', // 会员TOKEN
          pages: 1,
          pageSize: 20
        }
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 我的客户列表
      fansList: state => state.fansList
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
        return this.$store.dispatch('fansList', this.dataOption);
      },
       // 拉倒底部加载
      _addList () {
        if (this.getAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.fans-list-page').height());
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
      loading,
      tips
    }
  };
</script>

<style>
  .fans-list-page .list-item{overflow: hidden;padding: 0.6rem 1rem;position: relative;font-size: 0.9rem;}
  .fans-list-page .list-item:after{position: absolute;bottom:0;left:0;width:100%;height:1px;background: #f4f4f4;content: '';}
  .fans-list-page .list-item .left{float:left;}
  .fans-list-page .list-item .right{float:right;}
</style>
