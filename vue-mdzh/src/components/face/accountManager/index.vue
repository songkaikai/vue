<template>
  <div class="member-page">
    <div class="member-header">
      <!-- 二維碼鏈接 -->
      <div class="qr-link" @click="linkToOther('qrCode')"></div>
      <div class="member-pic"><img :src="avatarArr[memberInfo.level]" alt="" /></div>
      <!-- 会员未登录 -->
      <!-- <div class="member-info" style="display:none;">
        <div class="load-btn" style="overflow:hidden;">
          <div class="login" style="float:left;padding:1rem;height:2rem;line-height:2rem;font-size:1rem;margin-right:1rem;" onclick="showLoad()">登录</div>
          <div class="register" style="float:left;padding:1rem;height:2rem;line-height:2rem;font-size:1rem;" onclick="showRegister()">注册</div>
        </div>
      </div> -->
      <!-- 会员已经登录 -->
      <div class="member-info">
        <p class="name">{{ memberInfo.uname }}</p>
        <!-- 如果级别是0就不显示 -->
        <p class="refrence" v-if="parseInt(memberInfo.sub_level)">{{ subLevel[memberInfo.sub_level] }}</p>
        <p class="money">您由&nbsp;<span style="color:#fad08f;">({{ memberInfo.recomm_uname }})</span>&nbsp;推荐</p>
      </div>
    </div>
    <!-- content -->
    <div class="member-content">
      <div class="type-account">
        <div class="line-account">
          <div class="sub-account in-border-bottom-1px in-border-right-1px" @click="linkFans()">
            <div class="left-img type-one"></div>
            <div class="right-msg">
              <p class="money" style="margin-top:0.2rem;">{{ memberInfo.recomm_count }}人</p>
              <p class="desc">分享人数</p>
            </div>
          </div>
          <div class="sub-account in-border-bottom-1px">
            <div class="left-img type-two"></div>
            <div class="right-msg">
              <p class="money" style="margin-top:0.2rem;">{{ memberInfo.team_count }}人</p>
              <p class="desc">团队人数</p>
            </div>
          </div>
        </div>
        <div class="line-account">
          <div class="sub-account in-border-right-1px">
            <div class="left-img type-three"></div>
            <div class="right-msg">
              <p class="money" style="margin-top:0.2rem;">{{ memberInfo.order_count }}</p>
              <p class="desc">藏宝位</p>
            </div>
          </div>
          <div class="sub-account">
            <div class="left-img type-four"></div>
            <div class="right-msg">
              <p class="money" style="margin-top:0.2rem;">{{ memberInfo.all_money }}</p>
              <p class="desc">累计获得Q蛋</p>
            </div>
          </div>
        </div>
      </div>
      <!-- page link -->
      <div class="page-link">
        <div class="list-item border-bottom-1px" @click="linkToOther('orderList')">
          <i class="two-icon"></i><span>订单管理</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('withdraw')">
          <i class="ten-icon"></i><span>提现</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('cbArea')">
          <i class="three-icon"></i><span>藏宝位</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('syDetail')">
          <i class="four-icon"></i><span>收益明细</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('teamList')">
          <i class="five-icon"></i><span>团队统计</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('jyjj')">
          <i class="one-icon"></i><span>教育基金</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('mallList')">
          <i class="six-icon"></i><span>商城业绩</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('address')">
          <i class="nine-icon"></i><span>我的地址</span>
        </div>
        <div class="list-item border-bottom-1px" @click="linkToOther('editPass')">
          <i class="seven-icon"></i><span>修改密码</span>
        </div>
        <div class="list-item border-bottom-1px" @click="logout()">
          <i class="eight-icon"></i><span>退出登录</span>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <bomb-box ref="bombbox" :bombStr="bombStr" v-on:submitMsg="submitMsg"></bomb-box>
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
  import bombBox from 'components/plugins/bombBox';
  // 引入session
  import Session from 'common/js/sessionStorage';
  import Local from 'common/js/localStorage';
  // 要会议存储的字段key
  const MEMBER_LOGIN = 'member_login';
  const MEMBER_INFO = 'member_info';

  export default {
    data () {
      return {
        bombStr: '您确定退出登录吗？',
        tipsStr: '',
        subLevel: ['', 'A社群俱乐部', 'B社群俱乐部', 'C社群俱乐部', 'D社群俱乐部'],
        avatarArr: [require('./member_image_00.png'), require('./member_image.png'), require('./member_image_02.png'), require('./member_image_03.png')]
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      this.$nextTick(() => {
        this.$refs.loading.showLoad();
        this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(res => {
          this.$refs.loading.hideLoad();
          if (res.code === 401) {
            this._showTip('请重新登录');
          }
        });
      });
    },
    methods: {
      linkFans () {
        this.$router.push({name: 'fans'});
      },
      linkToOther (link) {
        // console.log(link);
        this.$router.push({name: link});
      },
      logout () {
        this.$refs.bombbox._showBomb();
      },
      submitMsg () {
        // 退出登录
        // this.$store.dispatch('logout', {}).then(res => {
        Local.empty(MEMBER_LOGIN);
        Session.empty(MEMBER_INFO);
        this.$router.push({name: 'login'});
        // });
      },
      // 显示提示框
      _showTip (str) {
        this.tipsStr = str;
        this.$refs.tips.showTips();
      }
    },
    components: {
      loading,
      tips,
      bombBox
    }
  };
</script>

<style>
  .member-page{background: #fff;padding-bottom:3.2rem;}
  .member-page .member-header{background: url(./member_header_bg.jpg) no-repeat;background-size: 100% 100%;padding: 2rem 1.5rem;overflow: hidden;position: relative;}
  @media screen and (min-width: 375px) and (max-width: 479px) {/*6*/
    .member-page .member-header{padding: 2.5rem 1.5rem;}
  }
  .member-page .member-header .qr-link{position: absolute;width: 1.5rem;height: 1.5rem;background: url(./qr_code_img.png) no-repeat;background-size: 100% 100%;top: 1.5rem;right: 1.5rem;padding: 0.4rem;}
  .member-page .member-header .member-pic{float:left;width: 4.5rem;}
  .member-page .member-header .member-pic img{display:block;width: 4.5rem;height:auto;border-radius:50%;}
  .member-page .member-header .member-info{padding: 0 0 0 5rem;color: #fff;}
  .member-page .member-header .member-info p{padding: 0.3rem 0;font-size: 0.9rem;}

  .member-page .member-content .type-account{border-top: 0.4rem solid #ffe0af;border-bottom: 0.4rem solid #eeeeee;}
  .member-page .member-content .type-account .line-account{overflow: hidden;}
  .member-page .member-content .type-account .line-account .sub-account{float:left;width:50%;padding: 1rem 0;position: relative;overflow: hidden;}
  .member-page .member-content .type-account .line-account .sub-account.in-border-bottom-1px:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eeeeee;content: '';-webkit-transform: scaleY(0.5);}
  .member-page .member-content .type-account .line-account .sub-account.in-border-right-1px:before{position: absolute;right: 0;top: 0;height: 100%;z-index: 1;border-right: 1px solid #eeeeee;content: '';-webkit-transform: scaleX(0.5);}
  .member-page .member-content .type-account .line-account .sub-account .left-img{float:left;width: 2.4rem;height:2.4rem;margin-left: 0.8rem;}
  .member-page .member-content .type-account .line-account .sub-account .left-img.type-one{background: url(./manager_type_one.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .type-account .line-account .sub-account .left-img.type-two{background: url(./manager_type_two.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .type-account .line-account .sub-account .left-img.type-three{background: url(./manager_type_three.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .type-account .line-account .sub-account .left-img.type-four{background: url(./manager_type_four.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .type-account .line-account .sub-account .right-msg{padding: 0 0 0 3.1rem;}
  .member-page .member-content .type-account .line-account .sub-account .right-msg p{padding: 0 0 0 0.4rem;}
  .member-page .member-content .type-account .line-account .sub-account .right-msg p.desc{color:#b4b3b3;font-size: 0.8rem;padding-top: 0.25rem;}
  .member-page .member-content .type-account .line-account .sub-account .right-msg p.money{color:#272727;font-size: 1rem;}
  .member-page .member-content .page-link .list-item{position: relative;padding: 0.6rem 1rem;background: url(./member_arrow_right.png) 95% center no-repeat;background-size: 1.2rem 1.2rem;}
  .member-page .member-content .page-link .list-item:after{position: absolute;left: 0;bottom: 0;width: 100%;z-index: 1;border-bottom: 1px solid #eeeeee;content: '';-webkit-transform: scaleY(0.5);}
  .member-page .member-content .page-link .list-item i{display: inline-block;vertical-align: middle;width: 1.7rem;height:1.7rem;}
  .member-page .member-content .page-link .list-item i.one-icon{background: url(./member_icon_five.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.two-icon{background: url(./member_icon_one.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.three-icon{background: url(./member_icon_two.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.four-icon{background: url(./member_icon_three.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.five-icon{background: url(./member_icon_four.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.six-icon{background: url(./member_icon_six.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.seven-icon{background: url(./member_icon_seven.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.eight-icon{background: url(./member_icon_eight.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.nine-icon{background: url(./member_icon_nine.png) no-repeat;background-size: 100% 100%;}
  .member-page .member-content .page-link .list-item i.ten-icon{background: url(./member_icon_ten.png) no-repeat;background-size: 100% 100%;}
  /*.member-page .member-content .page-link .list-item i.nine-icon{background: url(./member_icon_nine.png) no-repeat;background-size: 100% 100%;}*/
  .member-page .member-content .page-link .list-item span{display: inline-block;vertical-align: middle;font-size: 0.9rem;margin-left: 0.2rem;}
</style>
