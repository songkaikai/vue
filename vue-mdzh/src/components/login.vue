<template>
  <div class="login-page">
    <div class="login-wrapper">
      <img src="../assets/mdzh_logo.png" alt="" class="lx-icon">
      <img src="../assets/mdzh_title.png" alt="" class="wel-icon">
      <!-- <p class="title">欢迎使用</p>
      <p class="content">盱眙龙虾连锁店消费商平台</p> -->
      <!-- 账号登录 -->
      <div class="inner-wrapper">
        <div class="list-item border-bottom-1px">
          <i class="icon-one"></i>
          <input type="tel" v-model="dataOption.username" @input="filter('username')" placeholder="请输入您的用户名" maxlength="20" />
        </div>
        <div class="list-item border-bottom-1px">
          <i class="icon-two"></i>
          <input type="password" v-model="dataOption.password" @input="filter('password')" placeholder="请输入密码" />
        </div>
        <p class="tips-login">* 免蛋会员可直接登录</p>
        <div class="login-btn" @click="_login">登录</div>
        <router-link :to="{name: 'register'}" class="register-btn">注册一个新账号？</router-link>
      </div>
    </div>
    <!-- <img src="../assets/login_bottom.png" class="bottom-icon" alt=""> -->
    <!-- 提示框 -->
    <tips :tipsStr="tipsStr" ref="tips"></tips>
    <!-- 等待加载 -->
    <loading ref="loading"></loading>
  </div>
</template>

<script>
   // 提示框
   import tips from 'components/plugins/tips';
   import loading from 'components/plugins/loading';

   export default {
      data () {
        return {
          tipsStr: '',
          dataOption: {
            username: '',
            password: ''
          }
        };
      },
      // created () {
      //   this.$nextTick(() => {
      //     this._login();
      //   });
      // },
      methods: {
        _login () {
          // 要改成8
          if (!/^[A-Za-z0-9]{3,20}$/.test(this.dataOption.username)) {
            this._showTip('用户名必须是3-20位的数字或英文');
            return;
          }
          // 验证密码是否输入
          if (!/^\w{6,18}$/.test(this.dataOption.password)) {
            this._showTip('密码不能少于6位数');
            return;
          }
        // 验证通过登录
         this.$refs.loading.showLoad();
         this.$store.dispatch('memberLogin', this.dataOption).then(res => {
            this.$refs.loading.hideLoad();
            if (res.code === 200) {
              this.$router.replace({name: 'home'});
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
  
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
    color: #c1c1c0; 
  } 
  
  .login-page
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    // background: url(../assets/login_bg3.jpg) no-repeat
    background-size: 100% 100%
    .bottom-icon
      position: absolute
      left: 0
      bottom: 1.2rem
      width: 120%
      margin-left: -10%
    .login-wrapper
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 16rem
      height: 14rem
      margin: auto
      // border: 1px solid red
      .lx-icon
        position: absolute
        top: -7rem
        left: 50%
        width: 140%
        margin-left: -70%
        height: auto
        // border: 1px solid red
      .wel-icon
        margin: 0.8rem 0
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
        margin-top: 0.5rem
        .list-item
          position: relative
          padding: 0.6rem 0
          margin: 0.2rem 0
          &.border-bottom-1px
            border-bottom-1px(#7f7f7f)
          i
            position: absolute
            top: 0.55rem
            left: 0.35rem
            display: block
            width: 1.6rem
            height: 1.6rem
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
          input
            display: inline-block
            padding-left: 15%
            width: 85%
            height: 1.6rem
            line-height: 1.6rem
            font-size: 0.9rem
            color: #000
        .login-btn
          margin: auto
          margin-top: 1rem
          padding: 0.6rem 2rem
          // width: 100%
          // width: 4rem
          text-align: center
          border-radius: 5px
          font-size: 1rem
          background: #e5cba6
          color: #fff
        .tips-login
          margin-top: 1.8rem;
          font-size: 0.9rem;
          text-align: center
          color: #e5cba6
        .register-btn
          margin-top: 1rem
          padding: 0.5rem 0
          display: block
          width: 100%
          text-align: center
          font-size: 0.9rem
          color: #a7a7a7
          cursor: pointer
</style>
