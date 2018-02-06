<template>
  <div class="index-page">
   <!--  <router-link :to="{name: 'loadPage'}" class="good-tips" v-if="isApp === 1"><span>为了您有更好的体验，请点击此处下载APP</span><i class="downLoad-icon"></i></router-link> -->
    <!-- 会员信息头部 -->
    <div class="count-wrapper">
      <div class="list-item" style="width: 29%">
        <i class="left gold-icon"></i><span @click="_pibliclist('goldcount')">￥{{ memberInfo.balance }}</span><i class="green-btn-icon" @click="_pibliclist('czdetail')"></i>
      </div>
      <div class="list-item">
        <!-- <i class="left money-icon"></i><span @click="_pibliclist('integration')">{{ memberInfo.integral_balance }}</span><i class="green-btn-icon"></i> -->
        <i class="left money-icon"></i><span>{{ memberInfo.integral_balance }}</span>
      </div>
      <div class="list-item" style="width: 20%">
        <i class="left bx-icon"></i><span>{{ memberInfo.openBoxCount }}/{{ memberInfo.buyBoxCount }}</span><!-- <i class="green-btn-icon"></i> -->
      </div>
    </div>
    <div class="member-header">
      <div class="head-wrapper">
          <div class="head-img" @click="_pibliclist('memberedit')">
            <img :src="headImg" alt=""><span>{{ memberInfo.nick_name }}</span>
          </div>
          <div class="jifen">
            <i class="jf-icon"></i>
            <span>{{ memberInfo.vouchers }}</span>
          </div>
      </div>
      <!-- 设置 -->
      <i class="edit-icon" @click="_editGame"></i>
    </div>
    <!-- 中间导航栏 -->
    <div class="middle-menu" v-show="showMiddle">
      <!-- 导师列表 -->
      <router-link :to="{name: 'dsTeacher'}" class="dsdetail_icon"></router-link>
      <a class="list-item xuezhan" @click="_level"></a>
      <!-- <router-link :to="{name: 'game'}" class="list-item xuezhan"></router-link> -->
      <!-- <a href="" class="list-item xuezhan"></a> -->
      <a class="list-item publiclist" @click="_showPublic"></a>
      <!-- <a class="list-item publiclist" @click="_pibliclist('publica')"></a> -->
      <!-- <a class="list-item member" @click="_pibliclist('publicb')"></a> -->
      <a class="list-item baodan" @click="_showBd"></a>
    </div>
    <!-- 底部导航 -->
    <div class="bottom-menu">
      <!-- 收益详情 -->
      <router-link :to="{name: 'moneyDetail'}" class="sydetail_icon"></router-link>
      <!-- 刷新页面 -->
      <i class="refurbish_icon" @click="_refurbish"></i>
      <ul>
        <li @click="showShade('moneytransfer')" ref="moneytransfer">
          <i class="invite-icon"></i>
          <p>转币</p>
        </li>
        <li @click="showShade('withdraw')" ref="withdraw">
          <i class="tx-icon"></i>
          <p>提现</p>
        </li>
        <li @click="showShade('team')" ref="team">
          <i class="active-icon"></i>
          <p>团队</p>
        </li>
        <!-- <li @click="showShade('logistics')" ref="logistics"> -->
        <li>
          <i class="hobby-icon" @click="_orderList('orderList')"></i>
          <p>订单</p>
        </li>
        <!-- <li @click="showShade('exchange')" ref="exchange"> -->
        <li>
          <i class="exchange-icon" @click="_orderList('inviteQrcode')"></i>
          <p>邀请</p>
        </li>
      </ul>
    </div>

    <!-- 邀请好友 -->
    <invite ref="invitebox" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad" v-on:otherShow="_otherShow"></invite>
    <!-- 转币 -->
    <money-transfer ref="moneytransferbox" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></money-transfer>
    <!-- 提现 -->
    <withdraw ref="withdrawbox" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad" v-on:otherShow="_otherShow"></withdraw>
    <!-- 提现记录 -->
    <draw-recode ref="drawrecode" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></draw-recode>
    <!-- 团队 -->
    <team ref="teambox" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></team>
    <!-- 游戏设置 -->
    <edit-game ref="editgame" v-on:showMiddle="showMiddles"></edit-game>
    <!-- 公排A -->
    <public-a ref="publica" v-on:showMiddle="showMiddles"></public-a>
    <!-- 公排B -->
    <public-b ref="publicb" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></public-b>
    <!-- 物流 -->
    <!-- <logistics ref="logisticsbox" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></logistics> -->
    <!-- 金币记录 -->
    <gold-count ref="goldcount" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></gold-count>
    <!-- 积分记录 -->
    <integration ref="integration" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></integration>
     <!-- 会员信息修改 -->
    <memberedit ref="memberedit" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad" v-on:otherShow="_otherShow"></memberedit>
    <!-- 修改密码 -->
    <editpwd ref="editpwd" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></editpwd>
    <!-- 充值 -->
    <cz-detail ref="czdetail" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad" v-on:otherShow="_otherShow"></cz-detail>
    <!-- 充值记录 -->
    <cz-recode ref="czrecode" v-on:showMiddle="showMiddles" v-on:showTip="_showTip" v-on:showLoad="_showLoad" v-on:hideLoad="_hideLoad"></cz-recode>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
    <transition name="publics">
      <div class="publics-shade" v-show="publicsShow">
        <div class="publics-wrapper">
           <i class="close-btn" @click="_closePublic"></i>
           <div class="inner-content">
             <a class="list-items publiclist" @click="_pibliclist('publica')"></a>
             <a class="list-items member" @click="_pibliclist('publicb')"></a>
           </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Session from 'common/js/sessionStorage';
  import invite from '@/components/shade/invite';
  import moneyTransfer from '@/components/shade/moneyTransfer';
  import withdraw from '@/components/shade/withdraw';
  import drawRecode from '@/components/shade/drawRecode';
  import team from '@/components/shade/team';
  import editGame from '@/components/shade/editGame';
  import publicA from '@/components/shade/publicA';
  import publicB from '@/components/shade/publicB';
  // import logistics from '@/components/shade/logistics';
  // 金币记录
  import goldCount from '@/components/shade/goldCount';
  // 积分记录
  import integration from '@/components/shade/integration';
  import memberedit from '@/components/shade/memberedit';
  import editpwd from '@/components/shade/editpwd';
  import czDetail from '@/components/shade/czDetail';
  import czRecode from '@/components/shade/czRecode';
  // 提示框
  import tips from 'components/plugins/tips';
  import loading from 'components/plugins/loading';

  // 要会议存储的字段key
  const MEMBER_LOGIN = 'member_login';

  export default {
    data () {
      return {
        publicsShow: false,
        //  会员头像
        headImg: require('../assets/moke_head_01.jpg'),
        downLoad: require('../assets/down_load_icon.png'),
        // 中间的导航按钮
        showMiddle: true,
        // 提示信息
        tipsStr: '',
        type: {
          invite: 0
        },
        // 清除定时器时需要的
        timeStep: null
      };
    },
    created () {
      // alert(this.isApp);
      // 获取会员基本信息
      this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(res => {
        if (res === 401) {
          this.$router.replace({name: 'login'});
        }
      });
      this.$nextTick(() => {
        this._toLogin();
        // 验证token有没有过期
        this._timeStemp();
      });
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      memberInfo: state => state.memberInfo,
      // 判断是不是app登录
      isApp: state => state.isApp
    }),
    methods: {
      // 验证token有没有过期
      _timeStemp () {
        // console.log(1);
        if (!Session.fetch(MEMBER_LOGIN)) {
          // console.log(1);
          // 清除定时器
          this.timeStep = null;
          this.$router.replace({name: 'login', query: {isApp: this.isApp === 0 ? '1' : '0'}});
        }
        this.timeStep = setTimeout(() => {
          this._timeStemp();
        }, 500);
      },
      // 1小时后自动退出登录
      _toLogin () {
        setTimeout(() => {
          this.$store.dispatch('logout', {token: this.memberLogin.token});
          this.$router.replace({name: 'login'});
        }, 3600000);
      },
      // 刷新页面数据
      _refurbish () {
        this._showLoad();
        this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(() => {
          this._hideLoad();
        });
      },
      // 如果是会员就进入购买宝箱页面
      _level () {
         if (this.memberInfo.level === '1') {
            this.$router.push({name: 'game'});
         } else {
            this._showTip('请先报单');
         }
      },
      // 显示公排的通道
      _showPublic () {
        if (this.memberInfo.level === '1') {
            this.showMiddle = false;
            this.publicsShow = true;
         } else {
            this._showTip('请先报单');
         }
      },
      _closePublic () {
        this.showMiddle = true;
        this.publicsShow = false;
      },
      _showBd () {
        this.$router.push({name: 'customs'});
      },
      //  显示弹框str为当前要显示哪个弹框
      showShade (str) {
        // 买过产品才能显示
        if (str === 'moneytransfer' && this.memberInfo.level !== '1') {
          this._showTip('请先报单');
          return false;
        }
        if (str === 'withdraw' && this.memberInfo.level !== '1') {
          this._showTip('请先报单');
          return false;
        }
        // console.log(this.$refs[str]);
        this.$refs[str].className = 'active';
        this.$refs[str + 'box'].showShade();
        this.showMiddle = false;
      },
      // 缩小按钮
      showMiddles (str) {
        // console.log(str);
        this.$refs[str].className = '';
        this.showMiddle = true;
      },
      // str为drawrecode显示提现记录
      // str为moneytransfer显示转币
      _otherShow (str) {
        // console.log(this.$refs.drawrecode);
        this.$refs[str].showShade();
      },
      // 游戏设置
      _editGame () {
        this.showMiddle = false;
        this.$refs.editgame.showShade();
      },
      // 公排弹框
      _pibliclist (type) {
        this.showMiddle = false;
        this.publicsShow = false;
        this.$refs[type].showShade();
      },
      // 跳转订单列表页面
      _orderList (str) {
        this.$router.push({name: str});
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      },
      // 显示加载中
      _showLoad () {
        this.$refs.loading.showLoad();
      },
      // 隐藏加载中
      _hideLoad () {
        this.$refs.loading.hideLoad();
      }
    },
    components: {
      loading,
      tips,
      invite,
      moneyTransfer,
      withdraw,
      drawRecode,
      // logistics,
      team,
      editGame,
      publicA,
      publicB,
      goldCount,
      integration,
      memberedit,
      editpwd,
      czDetail,
      czRecode
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .index-page
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: url(../assets/xz_bg.jpg) no-repeat
    background-size: 100% 100%
    .publics-shade
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 11
      -webkit-transition: all 0.2s linear
      -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
      &.publics-enter-active
        opacity: 1
        -webkit-transform: scale(1, 1)     
      &.publics-enter, &.publics-leave-active
        opacity: 0
        transform: scale(0.7, 0.7)  
      .publics-wrapper
        position: absolute
        top: 0
        left: 0
        bottom: 0
        right: 0
        width: 12rem
        height: 10rem
        padding: 1rem 1.5rem 2rem 1.5rem
        margin: auto
        background: url(../assets/shade_bg.png) no-repeat
        background-size: 100% 100%
        .close-btn
          position: absolute
          top: -0.9rem
          right: -0.8rem
          width: 2.5rem
          height: 2.5rem
          background: url(../assets/close_btn_icon.png)
          background-size: 100% 100%
          &:active
            transform: scale(1.2, 1.2)
        .inner-content
           .list-items
              display: block
              width: 10rem
              height: 3.2rem
              margin: 1.5rem auto
              &.member
                background: url(../assets/index_pubb_icon.png) center no-repeat;
                background-size: 100% 100%
              &.publiclist
                background: url(../assets/index_puba_icon.png) center no-repeat;
                background-size: 100% 100%
    .good-tips
      display: block
      padding: 1.5rem 0.5rem 0 0.5rem
      color: #fff
      font-size: 0.7rem
      text-align: center
      span
        display: inline-block
        vertical-align: middle
        margin-right: 0.2rem
        height: 1rem
        line-height: 1rem
      .downLoad-icon
        display: inline-block
        vertical-align: middle
        width: 1rem
        height: 1rem
        background: url(../assets/down_load_icon.png) no-repeat
        background-size: 100% 100%
    .count-wrapper
      padding: 1.1rem 0.6rem 0.3rem 0.6rem
      overflow: hidden
      .list-item
        position: relative
        float: left
        margin: 0 5%
        width: 21%
        height: 1.8rem
        background: url(../assets/count_bg.png) no-repeat
        background-size: 100% 100%
        color: #fff
        font-size: 0.7rem
        .green-btn-icon
          position: absolute
          top: 1px
          right: -1rem
          display: inline-block
          width: 1.6rem
          height: 1.6rem
          background: url(../assets/green_shade_icon.png) no-repeat
          background-size: 100% 100%
        span
          display: block
          height: 1.8rem
          line-height: 1.8rem
          width: 70%
          margin: auto
          text-align: center
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .left
          position: absolute
          top: 1px
          left: -0.8rem
          display: inline-block
          width: 1.7rem
          height: 1.7rem
          &.gold-icon
            background: url(../assets/gold_count_icon.png) no-repeat
            background-size: 100% 100%
          &.money-icon
            background: url(../assets/money_count_icon.png) center no-repeat
            background-size: 100% 106%
          &.bx-icon
            background: url(../assets/bx_count_icon.png) no-repeat
            background-size: 100% 100%
    .bottom-menu
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      .refurbish_icon
        position: absolute
        top: -2.4rem
        right: 1rem
        width: 2rem
        height: 2rem
        background: url(../assets/refurbish_icon.png) no-repeat
        background-size: 100% 100%
      .sydetail_icon
        position: absolute
        top: -6rem
        right: 1rem
        width: 2rem
        height: 2rem
        background: url(../assets/money_detail_icon.png) no-repeat
        background-size: 100% 100%
      ul
        overflow: hidden
        li
          float: left
          padding:  0.7rem 0
          width: 20%
          font-size: 0.8rem
          text-align: center
          color: #fff
          -webkit-transition: all 0.2s linear
          -webkit-transition-timing-function: cubic-bezier(0, 0.74, 0.52, 1.38)
          &.active
             -webkit-transform: scale(1.2, 1.2) translate(0, -10px)
          i
             display: inline-block
             width: 3rem
             height: 3rem
             margin: 0.1rem 0
             &.invite-icon
                background: url(../assets/bottom_invite_icon.png) center 5px no-repeat
                background-size: 100% 88%
             &.tx-icon
                background: url(../assets/bottom_tx_icon.png) center 5px no-repeat
                background-size: 100% 88%
             &.active-icon
                background: url(../assets/bottom_active_icon.png) center 5px no-repeat
                background-size: 100% 88%
             &.hobby-icon
                background: url(../assets/bottom_hobby_icon.png) center 5px no-repeat
                background-size: 100% 88%
             &.exchange-icon
                background: url(../assets/bottom_exchange_icon.png) center 5px no-repeat
                background-size: 100% 88% 
    .member-header
      position: relative
      padding: 0.8rem 0.6rem
      overflow: hidden
      .edit-icon
        float: right
        width: 2.6rem
        height: 2.6rem
        background: url(../assets/out_edit_icon.png) center no-repeat
        background-size: 100% 100%
      .head-wrapper
         float: left
         padding: 0.3rem 0
         width: 82%
         overflow: hidden
         color: #fff
         background: url(../assets/count_lang_bg.png) no-repeat
         background-size: 100% 100%
         .jifen
           position: relative
           float: right
           margin-right: 0.5rem
           padding: 0 0.5rem 0 1rem
           height: 1.95rem
           line-height: 1.95rem
           font-size: 0.9rem
           background: url(../assets/count_bg.png) no-repeat
           background-size: 100% 100%
           .jf-icon
             position: absolute
             top: 0.2rem
             left: -0.7rem
             width: 1.5rem
             height: 1.5rem
             background: url(../assets/jb_icon.png) center no-repeat
             background-size: 100% 100%
         .head-img
            float: left
            margin-left: 1.1rem
            overflow: hidden
            img
              float: left
              display: block
              width: 1.6rem
              height: 1.6rem
              border: 3px solid #fe8300
              border-radius: 50%
            span
              float: left
              padding-left: 0.4rem
              height: 1.95rem
              line-height: 1.95rem
              font-size: 0.9rem
    .middle-menu
      // margin-top: 5.2rem
      .dsdetail_icon
        position: absolute
        top: 8rem
        right: 1rem
        display: block
        width: 2rem
        height: 2rem
        background: url(../assets/daoshi_icon.png) no-repeat
        background-size: 100% 100%
      .list-item
        display: block
        width: 12rem
        height: 4rem
        margin: 0.8rem auto
        &.member
          background: url(../assets/index_member_icon.png) center no-repeat;
          background-size: 100% 100%
        &.xuezhan
          background: url(../assets/index_xuezhan_icon.png) center no-repeat;
          background-size: 100% 100%
        &.publiclist
          background: url(../assets/index_public_icon.png) center no-repeat;
          background-size: 100% 100%
        &.baodan
          background: url(../assets/index_baodan_icon.png) center no-repeat;
          background-size: 100% 100%
        &:active
          -webkit-transform: scale(1.1, 1.1)
</style>
