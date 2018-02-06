<template>
  <div class="exchange-code-page">
    <div class="register-wrapper">
      <img src="../assets/lx_icon1.png" alt="" class="lx-icon">
      <img src="../assets/setsafe.png" alt="" class="wel-icon">
      <!-- 设置交易密码 -->
      <div class="inner-wrapper">
        <!-- <div class="list-item border-bottom-1px">
          <input type="tel" v-model="exchangeOption.mobile" placeholder="请输入您的手机号" disabled="disabled" />
        </div>
        <div class="list-item border-bottom-1px">
          <input type="tel" v-model="dataOption.code" @input="filter('code')" placeholder="请输入验证码" maxlength="6" />
          <span class="validate" @click="_getValidateCode">{{ validateStr }}</span>
        </div> -->
        <div class="list-item border-bottom-1px">
          <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" maxlength="18" />
        </div>
        <div class="list-item border-bottom-1px">
          <input type="password" v-model="dataOption.confirmPass" @input="filter('confirmPass')" placeholder="请确认密码" maxlength="18" />
        </div>
        <div class="register-btn" @click="_submit">确定</div>
        <p class="tip">首次注册登录必须设置交易密码<br/>才能进入系统</p>
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

  export default {
    data () {
      return {
        tipsStr: '',
        dataOption: {
          token: '', // 会员token
          code: '', // 验证码
          password: '', // 密码
          confirmPass: '' // 确认密码
        },
        // 获取交易密码的手机验证码
        exchangeOption: {
          token: '', // 会员token
          mobile: '' // 存储手机号的地方
        },
        registerTrue: false, // 当前是否注册成功true为成功
        canGetCode: 1, // 能否再次获取验证码
        validateStr: '获取验证码', // 验证码提示字段
        generatorCode: '', // 前端生成的6位数验证码
        timeOut: null
      };
    },
    computed: mapState({
      // 获取用户token
      memberLogin: state => state.memberLogin,
      // 获取用户基本信息
      memberInfo: state => state.memberInfo
    }),
    created () {
      this.$store.dispatch('memberInfo', {token: this.memberLogin.token}).then(() => {
        this.exchangeOption.mobile = this.memberInfo.mobile;
      });
    },
    methods: {
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
          if (!/^1[34578]\d{9}$/.test(this.exchangeOption.mobile)) {
            this._showTip('请输入正确的手机格式');
            return;
          }
          // 判断在用户能否点击
          if (this.canGetCode === 1) {
            // console.log('我正在点击...');
            // 禁止用户再次点击
            this.canGetCode = 0;
            // 生成6位数的验证码
            this.generatorCode = this._sixMath();
            // console.log(this.generatorCode);
            this.$refs.loading.showLoad();
            this.exchangeOption.token = this.memberLogin.token;
            this.$store.dispatch('getExchangeCode', this.exchangeOption).then(res => {
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
        _submit () {
          // if (!/^1[34578]\d{9}$/.test(this.exchangeOption.mobile)) {
          //   this._showTip('请输入正确的手机格式');
          //   return;
          // }
          // if (this.dataOption.code === '') {
          //   this._showTip('验证码不能为空');
          //   return;
          // }
          // if (this.dataOption.code === this.generatorCode) {
          //   this._showTip('验证码不正确');
          //   return;
          // }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('交易密码不能少于6位数');
            return;
          }
          if (this.dataOption.password !== this.dataOption.confirmPass) {
            this._showTip('两次交易密码不一致');
            return;
          }
          // 验证通过。交易密码提交
         this.$refs.loading.showLoad();
         this.dataOption.token = this.memberLogin.token;
         this.$store.dispatch('setExchangeCode', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (!res.data.code) {
              // 成功跳转首页
              this.$router.replace({name: 'index'});
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
      tips,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../common/stylus/mixin.styl";

  .exchange-code-page
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: url(../assets/login_bg2.jpg) no-repeat
    background-size: 100% 100%
    .register-wrapper
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 16rem
      height: 18.5rem
      margin: auto
      .lx-icon
        position: absolute
        top: -6rem
        left: 50%
        width: 120%
        margin-left: -60%
        height: auto
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
            width: 100%
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
          margin-top: 1rem
          padding: 0.5rem 0
          display: block
          width: 100%
          text-align: center
          line-height: 1.1rem
          font-size: 0.9rem
          color: #fff
</style>
