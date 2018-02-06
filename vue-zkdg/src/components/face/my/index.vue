<template>
  <div class="my-page">
  	<div class="member-info">
      <span class="reload" @click="_reload"></span>
      <div class="change-avatar">
        <input type="file" name="" ref="headImg" accept="image/png,image/jpeg" class="hiddenImg" @change="_getChangeFile" />
        <img :src="memberInfo.avatar ? memberInfo.avatar : defaultAvatar" class="avatar" alt="" />
      </div>
      <p class="name">{{ memberInfo.nick_name }}</p>
      <p class="share-person">分享人：{{ memberInfo.recommender }}</p>
      <p class="all-count">可兑现：￥{{ parseFloat(memberInfo.balance).toFixed(2) }}</p>
      <!--  -->
      <div class="other-link border-top-1px">
        <div class="sub-link border-right-1px" @click="_upgradeServer">升级服务商</div>
        <div class="sub-link" @click="_upgradeChannel">升级渠道商</div>
      </div>
  	</div>
    <!-- order type -->
    <div class="order-wrapper">
      <div class="head-all border-bottom-1px">
        <span class="left">全部订单</span>
        <span class="right" @click="_orderLink(9)">查看全部订单</span>
      </div>
      <div class="other-order">
        <div class="list-item" @click="_orderLink(1)">
          <i class="icon-one"></i>
          <p class="title">待付款</p>
        </div>
        <div class="list-item" @click="_orderLink(2)">
          <i class="icon-two"></i>
          <p class="title">待发货</p>
        </div>
        <div class="list-item" @click="_orderLink(3)">
          <i class="icon-three"></i>
          <p class="title">待收货</p>
        </div>
        <div class="list-item" @click="_orderLink(4)">
          <i class="icon-four"></i>
          <p class="title">已收货</p>
        </div>
        <div class="list-item" @click="_orderLink(8)">
          <i class="icon-five"></i>
          <p class="title">售后</p>
        </div>
      </div>
    </div>
    <!-- 常用工具 -->
    <div class="nine-gong">
      <p class="title border-bottom-1px">常用工具</p>
      <div class="link-wrapper">
        <div class="list-item" :class="[index < 6 ? 'border-bottom-1px': '']" v-for="(item, index) in pageData" @click="_orderToPage(item.linkStr)">
          <i :class="item.iconClass"></i>
          <p class="name">{{ item.linkName }}</p>
        </div>
      </div>
    </div>
    <!-- 升级服务商 -->
    <service-provider ref="service" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:showTips="_showTip"></service-provider>
    <!-- 升级渠道商 -->
    <channel ref="channel" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:showTips="_showTip"></channel>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import bombBox from 'components/plugins/bombBox';
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';
  import channel from './channel';
  import serviceProvider from './service';

  export default {
    data () {
      return {
        pageStr: 'my',
        // 九宫格内容
        pageData: [
          {
            iconClass: 'icon-one',
            linkName: '钱包',
            linkStr: 'myAccount'
          },
          {
            iconClass: 'icon-two',
            linkName: '日志',
            linkStr: 'myLog'
          },
          {
            iconClass: 'icon-three',
            linkName: '团队',
            linkStr: 'myTeam'
          },
          {
            iconClass: 'icon-zero',
            linkName: '收货地址',
            linkStr: 'address'
          },
          {
            iconClass: 'icon-four',
            linkName: '二维码',
            linkStr: 'myQRcode'
          },
          {
            iconClass: 'icon-five',
            linkName: '修改密码',
            linkStr: 'resetPass'
          },
          {
            iconClass: 'icon-six',
            linkName: '退出',
            linkStr: 'logout'
          }
        ],
        tipsStr: '',
        bombStr: '您确定退出登录吗？',
        defaultAvatar: require('./default_head_img.png') // 用户默认头像
      };
    },
    computed: {
      ...mapState({
        memberLogin: state => state.memberLogin,
        memberInfo: state => state.memberInfo
      })
    },
    methods: {
      _reload () {
        // var data = [{'品名': '杜雷斯', '数量': 4}, {'品名': '冈本', '数量': 3}];
        // console.table(data);
        this.$refs.loading.showLoad();
        this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 1) { // 获取用户信息
            this._showTip('更新成功');
          } else {
            this._showTip(res.msg);
          }
        });
      },
      // 更换头像
      _getChangeFile () {
        // console.log('更换头像');
        // console.log(this.$refs.headImg.files[0]);
        var oMyForm = new FormData();
        oMyForm.append('token', this.memberLogin.token);
        // fileInputElement中已经包含了用户所选择的文件
        oMyForm.append('avatar', this.$refs.headImg.files[0]);
        // console.log(oMyForm.get('avatar'));
        this.$refs.loading.showLoad();
        this.$store.dispatch('changeAvatar', oMyForm).then(res => {
          if (res.code === 1) {
            this._reload(); // 更新个人信息
            // this._showTip('更换成功');
          } else {
            this.$refs.loading.hideLoad();
            this._showTip(res.msg);
          }
        });
      },
      // 前往当前订单的类型
      _orderLink (type) {
        // console.log(type);
        if (type === 8) {
          this.$router.push({name: 'afterSale'});
        } else {
          this.$router.push({name: 'orderList', query: {type: type}});
        }
      },
      _orderToPage (str) {
        if (str === 'logout') {
          this.$refs.bombbox._showBomb();
        } else {
          // console.log(str);
          this.$router.push({name: str});
        }
      },
      // 弹框确认以后的操作
      submitMsg () {
        // this._showTip('true');
        this.$store.dispatch('logout').then(() => {
          this.$router.replace({name: 'login'});
        });
      },
      // 升级服务商
      _upgradeServer () {
        // console.log('_upgradeServer');
        if (parseInt(this.memberInfo.level) === 0 || parseInt(this.memberInfo.level) === 1) {
          this.$refs.service._showShade();
        } else if (parseInt(this.memberInfo.level) === 2) {
          this._showTip('您已经是初级服务商');
        } else if (parseInt(this.memberInfo.level) === 3) {
          this._showTip('您已经是高级服务商');
        }
      },
      // 升级渠道商
      // {"mobile":"13819445383","nick_name":"test","true_name":"","recommender":null,"level":0,"agent":0,"avatar":null,"total_money":"0.00","balance":"0.00","withdraw":"0.00"}
      _upgradeChannel () {
        // console.log('_upgradeChannel');
        // 0代表不是渠道商1县2市
        if (parseInt(this.memberInfo.agent) === 0) {
          this.$refs.channel._showShade();
        } else {
          this._showTip('您已经是渠道商');
        }
      },
      showLoad () {
        // alert(1);
        this.$refs.loading.showLoad();
      },
      hideLoad () {
        this.$refs.loading.hideLoad();
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
      tips,
      bombBox,
      channel,
      serviceProvider
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl";
  
  .my-page
    padding: 0 0 2.7rem
    .member-info
      position: relative
      background: url(./my_head_bg.jpg) no-repeat
      background-size: 100% 100%
      padding: 1rem 0 0 0
      .reload
        position: absolute
        top: 1rem
        right: 1rem
        display: inline-block
        width: 1.5rem
        height: 1.5rem
        background: url(./reload.png) no-repeat
        background-size: 100% 100%
        cursor: pointer
      .change-avatar
        position: relative
        width: 4.5rem
        height: 4.5rem
        margin: auto
        margin-bottom: 0.4rem
        .avatar
          display: block
          width: 4.5rem
          height: 4.5rem
          border-radius: 50%
        .hiddenImg
          position: absolute
          top: 0
          right: 0
          bottom: 0
          left: 0
          width: 100%
          height: 100%
          opacity: 0
      p
        text-align: center
        color: #fff
        padding: 0.1rem 0
        font-size: 0.9rem
      .other-link
        position: relative
        margin-top: 1.2rem
        overflow: hidden
        background: rgba(255, 255, 255, 0.3)
        &.border-top-1px
          border-top-1px(#fff)
        .sub-link
          position: relative
          float: left
          padding: 0.8rem 0
          width: 50%
          text-align: center
          color: #fff
          font-size: 0.9rem
          &.border-right-1px
            border-right-1px(#fff)
    .order-wrapper
      background: #fff
      .head-all
        position: relative
        padding: 0 1rem
        font-size: 0.9rem
        overflow: hidden
        &.border-bottom-1px
          border-bottom-1px(#eee)
        .left
          padding: 0.6rem 0
          float: left
        .right
          float: right
          padding: 0.65rem 0
          font-size: 0.8rem
          color: #717070
      .other-order
        overflow: hidden
        .list-item
          float: left
          padding: 0.4rem 0
          width: 20%
          text-align: center
          font-size: 0.7rem
          color: #717070
          i
            display: inline-block
            width: 1.8rem
            height: 1.8rem
            &.icon-one
              background: url(./order_icon_one.png) no-repeat
              background-size: 100% 100%
            &.icon-two
              background: url(./order_icon_two.png) no-repeat
              background-size: 100% 100%
            &.icon-three
              background: url(./order_icon_three.png) no-repeat
              background-size: 100% 100%
            &.icon-four
              background: url(./order_icon_four.png) no-repeat
              background-size: 100% 100%
            &.icon-five
              background: url(./order_icon_five.png) no-repeat
              background-size: 100% 100%
    .nine-gong
      margin-top: 0.6rem
      background: #fff
      .title
        position: relative
        padding: 0.6rem 1rem
        font-size: 0.9rem
        &.border-bottom-1px
          border-bottom-1px(#eee)
      .link-wrapper
        overflow: hidden
        .list-item
          position: relative
          float: left
          padding: 1rem 0
          width: 33.3%
          text-align: center
          &.border-bottom-1px
            border-bottom-1px(#eee)
          .name
            font-size: 0.7rem
            color: #717070
          i
            display: inline-block
            width: 1.8rem
            height: 1.8rem
            &.icon-one
              background: url(./my_icon_one.png) no-repeat
              background-size: 100% 100%
            &.icon-two
              background: url(./my_icon_two.png) no-repeat
              background-size: 100% 100%
            &.icon-three
              background: url(./my_icon_three.png) no-repeat
              background-size: 100% 100%
            &.icon-four
              background: url(./my_icon_four.png) no-repeat
              background-size: 100% 100%
            &.icon-five
              background: url(./my_icon_five.png) no-repeat
              background-size: 100% 100%
            &.icon-six
              background: url(./my_icon_six.png) no-repeat
              background-size: 100% 100%
            &.icon-zero
              background: url(./my_icon_zero.png) no-repeat
              background-size: 100% 100%
</style>
