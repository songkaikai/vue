<template>
  <div class="sy-detail-page" v-scroll="_addList">
    <div class="choose-type-head">
      <span :class="dataOption.logType === indexArr[index] ? 'index' : ''" v-for="(item, index) in topArr" @click="_changeChoose(indexArr[index])">{{ item }}</span>
    </div>
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
        topArr: ['全部', '直推奖', '挖宝收益'],
        indexArr: ['', '1', '2'],
        dataOption: {
          token: '', // 会员token
          logType: '', // 订单状态
          pageSize: 10, // 每页显示数量
          pages: 1 // 当前页
        },
        winHei: 0, // window的高度
        getAgain: true, // 是否再次获取
        showNoneMsg: false, // 显示没有任何数据
        chooseAgain: false,
        loadingShow: false, // 加载中是否显示
        showLists: false // 列表是否显示
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
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
            this.chooseAgain = true;
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
        if (this.getAgain && this.chooseAgain) {
          // console.log(1);
          // 获取当前距离顶部的距离
          var currTop = document.body.scrollTop;
          // console.log(currTop, this.winHei);
          // var targetHei = parseInt(document.defaultView.getComputedStyle(this.$refs.asdasd, null).height);
          var targetHei = parseInt($('.sy-detail-page').height());
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
      _changeChoose (type) {
        if (this.dataOption.logType !== type) {
          this.dataOption.logType = type;
          // 初始化数据
          this.showNoneMsg = false;
          this.chooseAgain = false;
          this.showLists = false;
          this.dataOption.pages = 1;
          this._getList();
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
  .sy-detail-page{background: #fff;margin-top:2.5rem;}
  .sy-detail-page .choose-type-head{overflow: hidden;position: fixed;top:0;left:0;width:100%;background: #fff;z-index: 12;}
  .sy-detail-page .choose-type-head:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #ccc;content: '';-webkit-transform: scaleY(0.5);}
  .sy-detail-page .choose-type-head span{float:left;width: 33.3%;text-align: center;font-size: 0.8rem;padding: 0.8rem 0;position: relative;cursor:pointer;}
  .sy-detail-page .choose-type-head span.index:after{position: absolute;left: 10%;bottom: 0;width: 80%;z-index: 1;border-bottom: 2px solid #d3b073;content: '';}
  .sy-detail-page .inner-wrapper .list-item{padding: 0.8rem 1rem;font-size: 0.9rem;position: relative;background: #fff;}
  .sy-detail-page .inner-wrapper .list-item:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #b5b5b5;content: '';-webkit-transform: scaleY(0.5);}
  .sy-detail-page .inner-wrapper .list-item .one-list{margin-bottom:0.4rem;overflow: hidden;}
  .sy-detail-page .inner-wrapper .list-item .one-list .left{float:left;}
  .sy-detail-page .inner-wrapper .list-item .one-list .right{float:right;}
  .sy-detail-page .inner-wrapper .list-item .one-list .right.red{color:#cb0808;}
  .sy-detail-page .inner-wrapper .list-item .one-list .right.green{color:#61b022;}
  .sy-detail-page .inner-wrapper .list-item .two-list{color:#b5b3b3;overflow: hidden;color:#b5b3b3;}
  .sy-detail-page .inner-wrapper .list-item .two-list .left{float:left;}
  .sy-detail-page .inner-wrapper .list-item .two-list .right{float:right;}
</style>
