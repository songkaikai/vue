<template>
  <div class="register-page">
    <div class="register-wrapper">
      <img src="../assets/lx_icon1.png" alt="" class="lx-icon">
      <img src="../assets/welcome1.png" alt="" class="wel-icon">
<!--       <p class="title">欢迎使用</p>
      <p class="content">盱眙龙虾连锁店消费商平台</p> -->
      <!-- 账号登录 -->
      <div class="inner-wrapper">
        <div class="prev-page" v-show="prevPage">
          <div class="list-item border-bottom-1px">
            <i class="icon-one"></i>
            <input type="text" v-model="dataOption.userName" @input="filter('userName')" placeholder="请输入用户名" maxlength="20" />
          </div>
          <div class="list-item border-bottom-1px">
            <i class="icon-three"></i>
            <input type="tel" v-model="dataOption.mobile" @input="filter('mobile')" placeholder="请输入您的手机号" />
          </div>
          <!-- <div class="list-item border-bottom-1px">
            <i class="icon-four"></i>
            <input type="tel" v-model="dataOption.code" @input="filter('code')" placeholder="请输入验证码" maxlength="6" />
            <span class="validate" @click="_getValidateCode">{{ validateStr }}</span>
          </div> -->
          <div class="list-item border-bottom-1px">
            <i class="icon-one"></i>
            <input type="text" v-model="dataOption.nickName" @input="filter('nickName')" placeholder="请输入真实姓名" maxlength="6" />
          </div> 
          <div class="list-item border-bottom-1px">
            <!-- <input type="tel" v-model="dataOption.recommender" @input="filter('recommender')" placeholder="推荐人手机号或编号" maxlength="20" /> -->
            <i class="icon-six"></i>
            <input type="text" v-model="dataOption.recommender" @input="filter('recommender')" placeholder="请输入推荐人" maxlength="20" />
          </div>
          <div class="register-btn" @click="_next(true)">下一步</div>
        </div>
        <div class="next-page" v-show="!prevPage">
          <div class="list-item border-bottom-1px" style="margin: 1.5rem 0 0 0;">
            <i class="icon-two"></i>
            <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" />
          </div>
          <div class="list-item border-bottom-1px">
            <i class="icon-two"></i>
            <input type="password" v-model="dataOption.confirmPassword" @input="filter('confirmPassword')" placeholder="请确认密码" />
          </div>
          <div class="list-item border-bottom-1px" @click="_showDialog">
            <span class="none-msg" v-if="dataOption.areaId === ''">请选择省、市、区</span>
            <span class="has-msg" v-else>{{ dataOption.areaName }}</span>
          </div>
          <div class="register-btn" @click="_register">注册</div>
          <div class="register-btn" @click="_prev" style="background: rgba(255, 255, 255, 0.3)">上一步</div>
        </div>
        <p class="tip">已经有账户了？<router-link :to="{name: 'login'}" class="login-btn">点此登录</router-link></p>
      </div>
    </div>
    <transition name="prowrapper">
      <div class="shade-pro-wrapper" v-show="showPro">
        <transition name="innerpro">
          <div class="shade-pro-protocal" v-show="showPro">
            <div class="pro-info"  ref="menuwrapper">
              <div class="pro-wrapper">
                <p class="title">蓝享物联网预约消费协议</p>
                <p class="type-one">尊敬的消费者：</p>
                <!-- <p class="type-two">本协议是您与蓝享物联网智能科技有限公司（简称“本平台”，网址：http://lx.bhsxy.cn）之间就蓝享物联网线上线下发生预约消费而双方自愿签署的购销协议。</p>
                <p class="type-two">蓝享物联网智能科技有限公司是河南平开电力设备集团新开发的物联网项目，旨在联盟线下线上商家，以全民健康养生为切入点打造生态商圈，通过购买产品赠送积分实现无痛消费的理念，扩大消费终端，创建大数据，实现蓝享物联网平台与线下线上实体互联互通，打造物联网智能科技消费创富的新领域。</p>
                <p class="type-two">一、公司为了促销产品，提高销量，以购买产品赠送积分作为活动初衷，并拿出销售产品的绝大部分利润回馈给消费用户，回馈方式是轮流预约注册购物奖励。</p>
                <p class="type-two">二、本公司旨在为广大消费者提供一个一次消费，N次受惠的消费创富平台，积分只是一个转换媒介，并非投机或者是投资理财平台，请每一位消费者在购买产品的同时，一定要控制在自己可以承受的经济范围之内。</p>
                <p class="type-two">三、公司始终贯彻“诚信经营，遵纪守法”的企业准则，同时践行国家提出的分享经济和共享经济的理念，严禁在分享过程中夸大宣传，虚假诱导，歪曲事实甚至恶意欺骗。对此公司将会严厉打击，对违法行为交由公安机关处理。</p>
                <p class="type-two">四、公司可能在发展过程中做一些战略规划的推进调整，以适应平台长久良性发展需求，所以在预约消费购买产品的时候，请仔细斟酌，对此公司拥有最终解释权。</p>
                <p class="type-two">五、公司赠送的积分可在公司商城重复消费使用，以及在与公司达成战略合作伙伴的所有实体商家消费购物，也可以将积分转换成蓝享券通过第三方交易平台进行交易，对此公司郑重提醒：公司对蓝享券的价格不作任何担保。</p>
                <p class="type-two">六、预约注册消费时请仔细阅读完本协议，确认并同意后方可注册。</p> -->
                <!-- <p class="type-one">◎ 本人已经认真仔细阅读过，同意！</p> -->
              </div>
            </div>
            <div class="sub-btn">
              <span class="sure" @click="_subChoose(1)">同意</span><span @click="_subChoose(0)">取消</span>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <!-- <img src="../assets/login_bottom.png" class="bottom-icon" alt=""> -->
    <!-- 地区选择 -->
    <data-dialog ref="datadialog" v-on:showLoad="showLoad" v-on:hideLoad="hideLoad" v-on:subInfo="submitInfo"></data-dialog>
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  // 提示框
  import tips from 'components/plugins/tips';
  import dataDialog from 'components/plugins/dialog';
  import loading from 'components/plugins/loading';
  import BScroll from 'better-scroll';
  import $ from 'jquery';
  // import regional from 'static/js/regional';

  export default {
    data () {
      return {
        showPro: false,
        prevPage: true,
        tipsStr: '',
        dataOption: {
          userName: '', // 用户名
          mobile: '', // 手机号
          password: '', // 密码
          confirmPassword: '', // 确认密码
          nickName: '', // 真实姓名
          code: '', // 手机验证码
          recommender: '', // 推荐人手机号或编号
          areaId: '', // 省市区
          areaName: '' // 省市区
        },
        areaStr: '', // 省市区显示的字段
        registerTrue: false, // 当前是否注册成功true为成功
        canGetCode: 1, // 能否再次获取验证码
        validateStr: '获取验证码', // 验证码提示字段
        generatorCode: '', // 前端生成的6位数验证码
        timeOut: null,
        loginOption: {
          username: '',
          password: ''
        }
      };
    },
    created () {
        // 获取当前路径的参数
        if (this.$route.query.uname !== undefined) {
          this.dataOption.recommender = this.$route.query.uname;
        }
        this.showPro = true;
        // 创建一个新的滚轮对象
        this.$nextTick(() => {
            this.$store.dispatch('helpArticalDetail', {newsId: 5}).then(res => {
                // this.$refs.loading.hideLoad();
                if (!res.data.code) {
                  // console.log(res);
                  $('.shade-pro-protocal .pro-wrapper').append(res.data.cnt);
                  this.$nextTick(() => {
                    this.national = new BScroll(this.$refs.menuwrapper, {
                      click: true
                    });
                  });
                } else {
                  var obj = JSON.parse(res.data.message);
                  for (var key in obj) {
                    this._showTip(obj[key]);
                    return;
                  }
                }
              });
          });
        // console.log(regional[1]);
    },
    methods: {
        _subChoose (type) {
          if (type === 1) {
            this.showPro = false;
          } else {
            this.$router.go(-1);
          }
        },
        // 发送验证码等待的剩余时间
        _waitTime (time) {
          var nowTime = time - 1;
          this.validateStr = nowTime + 's后重新发送';
          // 如果是不能获取验证码或者时间已经变成0或者已经注册成功
          if (this.canGetCode === 1 || nowTime < 0 || this.registerTrue) {
            this.canGetCode = 1;
            this.validateStr = '获取验证码';
            // 清空定时器
            this.timeOut = null;
          } else {
            this.timeOut = setTimeout(() => {
              this._waitTime(nowTime);
            }, 1000);
          }
        },
        // 随机生成6位小数
        _sixMath () {
          var arr = [];
          while (arr.length < 6) {
            arr.push(Math.round(Math.random() * 9));
          }
          return arr.join('');
        },
        // 获取验证码
        _getValidateCode () {
          if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return;
          }
          // 判断在用户能否点击
          if (this.canGetCode === 1) {
            // console.log('我正在点击...');
            // 禁止用户再次点击
            this.canGetCode = 0;
            // 生成6位数的验证码
            // this.generatorCode = this._sixMath();
            // console.log(this.generatorCode);
            this.$refs.loading.showLoad();
            this.$store.dispatch('getValidateCode', {mobile: String(this.dataOption.mobile)}).then(res => {
              this.$refs.loading.hideLoad();
              if (!res.data.code) {
                this.registerTrue = false;
                this._showTip('获取验证码成功');
                // 获取验证码成功等待60s
                this._waitTime(20);
              } else {
                this.canGetCode = 1;
                var obj = JSON.parse(res.data.message);
                for (var key in obj) {
                  this._showTip(obj[key]);
                  return;
                }
              }
            });
          }
        },
        // 登录
        _next (choose) {
          // alert(1);
          if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.userName)) {
            this._showTip('用户名必须是3-20位的数字或英文');
            return false;
          }
          if (!/^1[34578]\d{9}$/.test(this.dataOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return false;
          }
          // 需求 技术 或者是应用的前景都非常客观
          // if (this.dataOption.code === '') {
          //   this._showTip('验证码不能为空');
          //   return false;
          // }
          // if (parseInt(this.dataOption.code) !== parseInt(this.generatorCode)) {
          //   this._showTip('验证码不正确');
          //   return;
          // }
          // 验证密码是否输入
          if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.recommender)) {
            this._showTip('推荐码必须是3-20位的数字或英文');
            return false;
          }
          if (choose) {
            // 到下一步
            this.prevPage = false;
          }
          return true;
        },
        _prev () {
          // 去上一步
          this.prevPage = true;
        },
        // 显示地区选择
        _showDialog () {
          this.$refs.datadialog._showDialog(this.dataOption.areaId);
        },
        _register () {
         if (!this._next(false)) {
          return false;
         }
         if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('密码不能少于6位数');
            return false;
          }
          if (this.dataOption.password !== this.dataOption.confirmPassword) {
            this._showTip('两次密码不一致');
            return false;
          }
         if (this.dataOption.areaId === '') {
          this._showTip('省市区不能为空');
          return false;
         }
         // 验证通过注册
         this.$refs.loading.showLoad();
         this.$store.dispatch('memberRegister', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
                this.prevPage = true;
                this.dataOption = {
                  userName: '', // 用户名
                  mobile: '', // 手机号
                  password: '', // 密码
                  confirmPassword: '', // 确认密码
                  nickName: '', // 真实姓名
                  code: '', // 手机验证码
                  areaId: '',
                  areaName: '',
                  recommender: '' // 推荐人手机号或编号
                };
                // 验证码清空
                this.generatorCode = '';
                this.registerTrue = true;
                // 重新显示协议
                this.showPro = true;
                this._showTip('注册成功');
            } else {
              var obj = JSON.parse(res.data.message);
              for (var key in obj) {
                this._showTip(obj[key]);
                return;
              }
            }
         });
         // setTimeout(() => {
         //    this.$refs.loading.hideLoad();
         //  }, 1500);
        },
        // 地址选择传递的数据
        submitInfo (option) {
          // console.log(option);
          this.dataOption.areaId = option.index;
          this.dataOption.areaName = option.str;
          // console.log(this.dataOption.areaId);
          // console.log(1);
          // this.dataOption.area = option.str;
        },
        showLoad () {
          this.$refs.loading.showLoad();
        },
        hideLoad () {
          this.$refs.loading.hideLoad();
        },
        // 过滤空格
        filter (str) {
          this.dataOption[str] = this.dataOption[str].replace(/\s/g, '');
        },
        // 显示提示框
        _showTip (str) {
          this.tipsStr = str;
          this.$refs.tips.showTips();
        }
      },
    components: {
      dataDialog,
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../common/stylus/mixin.styl";

  .register-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: url(../assets/login_bg3.jpg) no-repeat
    background-size: 100% 100%
    // border: 1px solid red
    .shade-pro-wrapper
      position: fixed
      top: 0
      right: 0
      bottom: 0
      left: 0
      background: rgba(0, 0, 0, 0.5)
      -webkit-transition: all 0.3s
      &.prowrapper-enter-active
        opacity: 1
      &.prowrapper-enter,&.prowrapper-leave-active
        opacity: 0
      .sub-btn
        position: absolute
        bottom: 0
        left: 0
        height: 3rem
        width: 100%
        overflow: hidden
        cursor: pointer
        &:after
          position: absolute
          content: ''
          top: 0
          left: 0
          width: 100%
          height: 1px
          background: #ccc
          -webkit-transform: scaleY(0.5)
        span
          float: left
          width: 50%
          text-align: center
          height: 3rem
          line-height: 3rem
          font-size: 0.9rem
          &.sure
            position: relative
            color: red
            &:after
              position: absolute
              content: ''
              top: 0
              right: 0
              width: 1px
              height: 100%
              background: #ccc
              -webkit-transform: scaleX(0.5)
      .shade-pro-protocal
        position: absolute
        top: 3rem
        left: 2rem
        bottom: 3rem
        right: 2rem
        background: #fff
        border-radius: 6px
        overflow: hidden
        -webkit-transition: all 0.2s
        &.innerpro-enter-active
          transform: scale(1, 1)
          -webkit-transform: scale(1, 1)
        &.innerpro-enter,&.innerpro-leave-active
          transform: scale(1.1, 1.1)
          -webkit-transform: scale(1.1, 1.1)
        .pro-info
          position: absolute
          top: 0.5rem
          left: 0
          right: 0
          bottom: 3.2rem
          padding: 0 0.6rem
          overflow: hidden
          .pro-wrapper
            font-size: 0.9rem
            .title
              padding: 0.5rem 0
              text-align: center
              font-size: 1rem 
              color: red
            .type-one
              font-size: 0.9rem
              margin-bottom: 0.3rem
            .type-two
              text-indent: 1.5rem;
              line-height: 1rem
              margin-bottom: 0.2rem
    .bottom-icon
      position: absolute
      left: 0
      bottom: 1.2rem
      width: 120%
      margin-left: -10%
    .register-wrapper
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 16rem
      height: 26rem
      margin: auto
      // border: 1px solid red
      .lx-icon
        // position: absolute
        // top: 10%
        left: 50%
        width: 100%
        // margin-left: -20%
        // margin-top: 10px
        height: auto
        // border: 1px solid red
        z-index: 110
      .wel-icon
        display: block
        width: 100%
        height: auto
      .title
          padding: 0.6rem 0
          text-align: center
          color: #fff
          font-size: 1.6rem
        .content
          text-align: center
          color: #fff
          font-size: 0.8rem
      .inner-wrapper
        // margin-top: 0.5rem
        .list-item
          position: relative
          padding: 0.4rem 0
          &.border-bottom-1px
            border-bottom-1px(#fff)
          i
            position: absolute
            top: 0.35rem
            left: 0.35rem
            display: block
            width: 1.4rem
            height: 1.4rem
            &:after
              position: absolute
              content: ''
              top: 0
              right: -0.2rem
              height: 100%
              width: 1px
              background: #fff
              -webkit-transform: scaleX(0.5)
            &.icon-one
              background: url(../assets/small_icon_one.png)
              background-size: 100% 100%
            &.icon-two
              background: url(../assets/small_icon_two.png)
              background-size: 100% 100%
            &.icon-three
              background: url(../assets/small_icon_three.png)
              background-size: 100% 100%
            &.icon-four
              background: url(../assets/small_icon_four.png)
              background-size: 100% 100%
            &.icon-six
              background: url(../assets/small_icon_six.png)
              background-size: 100% 100%
          .none-msg,.has-msg
            font-size: 0.9rem
            color: #fff
          .validate
            display: inline-block
            position: absolute
            top: 0
            right: 0
            width: 7rem
            height: 2.2rem
            font-size: 0.9rem
            line-height: 2.2rem
            color: #fff
            text-align: center
            &:after
              position: absolute
              content: ''
              top: 10%
              left: 0
              width: 1px
              height: 80%
              background: #fff
              -webkit-transform: scaleX(0.5);
          input
            display: inline-block
            padding-left: 15%
            width: 85%
            height: 1.4rem
            line-height: 1.4rem
            font-size: 0.9rem
            color: #fff
        .register-btn
          margin: auto
          margin-top: 1rem
          padding: 0.6rem 2rem
          // width: 100%
          width: 4rem
          text-align: center
          border-radius: 5px
          font-size: 1rem
          background: #fff
          color: #4d3a52
        .tip
          margin-top: 0.3rem
          padding: 0.5rem 0
          display: block
          width: 100%
          text-align: center
          font-size: 0.9rem
          color: #4aa1fe
          .login-btn
            color: #fff
</style>
